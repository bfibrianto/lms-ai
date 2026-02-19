'use server'

import { revalidatePath } from 'next/cache'
import { hash } from 'bcryptjs'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { Role } from '@/generated/prisma/client'
import type { Prisma } from '@/generated/prisma/client'
import { CreateUserSchema, EditUserSchema } from '@/lib/validations/users'
import type { UserListItem, UserDetail, ActionResult } from '@/types/users'

// ---------------------------------------------------------------------------
// Access Control
// ---------------------------------------------------------------------------

const ALLOWED_ROLES = ['SUPER_ADMIN', 'HR_ADMIN'] as const

async function requireAccess() {
  const session = await auth()
  if (!session?.user) throw new Error('Tidak terautentikasi')
  if (!(ALLOWED_ROLES as readonly string[]).includes(session.user.role)) {
    throw new Error('Akses ditolak')
  }
  return session
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function getUsers(params: {
  search?: string
  role?: string
  status?: string
  page?: number
  pageSize?: number
}): Promise<{ users: UserListItem[]; total: number; totalPages: number }> {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 10
  const skip = (page - 1) * pageSize

  const where: Prisma.UserWhereInput = {}

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { email: { contains: params.search, mode: 'insensitive' } },
    ]
  }

  if (params.role && params.role !== 'ALL') {
    where.role = params.role as Role
  }

  if (params.status === 'active') where.isActive = true
  if (params.status === 'inactive') where.isActive = false

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        position: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    db.user.count({ where }),
  ])

  return {
    users,
    total,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function getUserById(userId: string): Promise<UserDetail | null> {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      position: true,
      isActive: true,
    },
  })
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export async function createUser(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const session = await requireAccess()

  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
    department: formData.get('department'),
    position: formData.get('position'),
    isActive: formData.get('isActive'),
  }

  const parsed = CreateUserSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data tidak valid',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  // HR Admin tidak bisa membuat Super Admin
  if (
    session.user.role === 'HR_ADMIN' &&
    parsed.data.role === Role.SUPER_ADMIN
  ) {
    return { success: false, error: 'HR Admin tidak dapat membuat Super Admin' }
  }

  const existing = await db.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  })
  if (existing) {
    return { success: false, error: 'Email sudah terdaftar' }
  }

  try {
    const hashed = await hash(parsed.data.password, 12)
    const user = await db.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashed,
        role: parsed.data.role,
        department: parsed.data.department || null,
        position: parsed.data.position || null,
        isActive: parsed.data.isActive,
      },
      select: { id: true },
    })
    revalidatePath('/backoffice/users')
    return { success: true, data: { id: user.id } }
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err?.code === 'P2002') {
      return { success: false, error: 'Email sudah terdaftar' }
    }
    throw e
  }
}

export async function updateUser(
  userId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  const session = await requireAccess()

  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
    department: formData.get('department'),
    position: formData.get('position'),
    isActive: formData.get('isActive'),
  }

  const parsed = EditUserSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data tidak valid',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  // HR Admin tidak bisa mengubah role menjadi Super Admin
  if (
    session.user.role === 'HR_ADMIN' &&
    parsed.data.role === Role.SUPER_ADMIN
  ) {
    return {
      success: false,
      error: 'HR Admin tidak dapat mengubah role menjadi Super Admin',
    }
  }

  const updateData: Prisma.UserUpdateInput = {
    name: parsed.data.name,
    email: parsed.data.email,
    role: parsed.data.role,
    department: parsed.data.department || null,
    position: parsed.data.position || null,
    isActive: parsed.data.isActive,
  }

  if (parsed.data.password && parsed.data.password !== '') {
    updateData.password = await hash(parsed.data.password, 12)
  }

  try {
    await db.user.update({ where: { id: userId }, data: updateData })
    revalidatePath('/backoffice/users')
    return { success: true, data: undefined }
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err?.code === 'P2002') {
      return { success: false, error: 'Email sudah terdaftar' }
    }
    throw e
  }
}

export async function deleteUser(userId: string): Promise<ActionResult<void>> {
  const session = await requireAccess()

  if (session.user.id === userId) {
    return { success: false, error: 'Tidak dapat menghapus akun sendiri' }
  }

  const target = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })
  if (!target) return { success: false, error: 'Pengguna tidak ditemukan' }

  if (target.role === Role.SUPER_ADMIN) {
    const count = await db.user.count({ where: { role: Role.SUPER_ADMIN } })
    if (count <= 1) {
      return { success: false, error: 'Tidak dapat menghapus Super Admin terakhir' }
    }
  }

  await db.user.delete({ where: { id: userId } })
  revalidatePath('/backoffice/users')
  return { success: true, data: undefined }
}

export async function toggleUserStatus(
  userId: string,
  isActive: boolean
): Promise<ActionResult<void>> {
  const session = await requireAccess()

  if (session.user.id === userId) {
    return { success: false, error: 'Tidak dapat mengubah status akun sendiri' }
  }

  await db.user.update({
    where: { id: userId },
    data: { isActive },
  })
  revalidatePath('/backoffice/users')
  return { success: true, data: undefined }
}
