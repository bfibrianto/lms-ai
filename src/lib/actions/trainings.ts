'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import {
  CreateTrainingSchema,
  EditTrainingSchema,
} from '@/lib/validations/trainings'

const WRITE_ROLES = ['SUPER_ADMIN', 'HR_ADMIN', 'MENTOR']

async function requireAuth() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthenticated')
  return session.user
}

async function requireWriteAccess() {
  const user = await requireAuth()
  if (!WRITE_ROLES.includes(user.role as string)) {
    throw new Error('Forbidden')
  }
  return user
}

// ── Queries ─────────────────────────────────────────────────────────────────

export async function getTrainings(params: {
  search?: string
  type?: string
  status?: string
  page?: number
}) {
  const { search, type, status, page = 1 } = params
  const pageSize = 10
  const skip = (page - 1) * pageSize

  const where = {
    ...(search && { title: { contains: search, mode: 'insensitive' as const } }),
    ...(type && type !== 'all' && {
      type: type as 'WORKSHOP' | 'SEMINAR' | 'BOOTCAMP',
    }),
    ...(status && status !== 'all' && {
      status: status as 'DRAFT' | 'OPEN' | 'CLOSED' | 'COMPLETED' | 'CANCELLED',
    }),
  }

  const [trainings, total] = await Promise.all([
    db.training.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { startDate: 'asc' },
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        startDate: true,
        endDate: true,
        location: true,
        onlineUrl: true,
        capacity: true,
        creator: { select: { name: true } },
        _count: { select: { registrations: true } },
      },
    }),
    db.training.count({ where }),
  ])

  return {
    trainings,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function getTrainingById(id: string) {
  return db.training.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      status: true,
      startDate: true,
      endDate: true,
      location: true,
      onlineUrl: true,
      capacity: true,
      cover: true,
      creatorId: true,
      creator: { select: { name: true } },
      _count: { select: { registrations: true } },
      registrations: {
        orderBy: { registeredAt: 'asc' },
        select: {
          id: true,
          status: true,
          registeredAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              department: true,
            },
          },
        },
      },
    },
  })
}

export async function getOpenTrainings(params: {
  search?: string
  type?: string
  page?: number
}) {
  const { search, type, page = 1 } = params
  const pageSize = 9
  const skip = (page - 1) * pageSize

  const where = {
    status: 'OPEN' as const,
    ...(search && { title: { contains: search, mode: 'insensitive' as const } }),
    ...(type && type !== 'all' && {
      type: type as 'WORKSHOP' | 'SEMINAR' | 'BOOTCAMP',
    }),
  }

  const [trainings, total] = await Promise.all([
    db.training.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { startDate: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        status: true,
        startDate: true,
        endDate: true,
        location: true,
        onlineUrl: true,
        capacity: true,
        creator: { select: { name: true } },
        _count: { select: { registrations: true } },
      },
    }),
    db.training.count({ where }),
  ])

  return { trainings, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function getMyTrainingIds(userId: string): Promise<string[]> {
  const regs = await db.trainingRegistration.findMany({
    where: { userId, status: { not: 'CANCELLED' } },
    select: { trainingId: true },
  })
  return regs.map((r) => r.trainingId)
}

// ── Mutations ────────────────────────────────────────────────────────────────

export async function createTraining(formData: FormData) {
  const user = await requireWriteAccess()

  const raw = {
    title: formData.get('title'),
    description: formData.get('description'),
    type: formData.get('type'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    location: formData.get('location'),
    onlineUrl: formData.get('onlineUrl'),
    capacity: formData.get('capacity'),
  }

  const parsed = CreateTrainingSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false as const,
      error: 'Data tidak valid',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const { title, description, type, startDate, endDate, location, onlineUrl, capacity } =
    parsed.data

  try {
    const training = await db.training.create({
      data: {
        title,
        description: description || null,
        type: type as 'WORKSHOP' | 'SEMINAR' | 'BOOTCAMP',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location: location || null,
        onlineUrl: onlineUrl || null,
        capacity: capacity ? Number(capacity) : null,
        creatorId: user.id!,
      },
    })
    revalidatePath('/backoffice/trainings')
    return { success: true as const, data: training }
  } catch {
    return { success: false as const, error: 'Gagal membuat pelatihan' }
  }
}

export async function updateTraining(id: string, formData: FormData) {
  await requireWriteAccess()

  const raw = {
    title: formData.get('title'),
    description: formData.get('description'),
    type: formData.get('type'),
    status: formData.get('status'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    location: formData.get('location'),
    onlineUrl: formData.get('onlineUrl'),
    capacity: formData.get('capacity'),
  }

  const parsed = EditTrainingSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false as const,
      error: 'Data tidak valid',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const { title, description, type, status, startDate, endDate, location, onlineUrl, capacity } =
    parsed.data

  try {
    await db.training.update({
      where: { id },
      data: {
        title,
        description: description || null,
        type: type as 'WORKSHOP' | 'SEMINAR' | 'BOOTCAMP',
        status: status as 'DRAFT' | 'OPEN' | 'CLOSED' | 'COMPLETED' | 'CANCELLED',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location: location || null,
        onlineUrl: onlineUrl || null,
        capacity: capacity ? Number(capacity) : null,
      },
    })
    revalidatePath('/backoffice/trainings')
    revalidatePath(`/backoffice/trainings/${id}`)
    return { success: true as const }
  } catch {
    return { success: false as const, error: 'Gagal mengupdate pelatihan' }
  }
}

export async function deleteTraining(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireWriteAccess()
    await db.training.delete({ where: { id } })
    revalidatePath('/backoffice/trainings')
    return { success: true }
  } catch {
    return { success: false, error: 'Gagal menghapus pelatihan' }
  }
}

export async function updateRegistrationStatus(
  registrationId: string,
  status: 'REGISTERED' | 'ATTENDED' | 'ABSENT' | 'CANCELLED'
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireWriteAccess()
    const reg = await db.trainingRegistration.update({
      where: { id: registrationId },
      data: { status },
      select: { trainingId: true },
    })
    revalidatePath(`/backoffice/trainings/${reg.trainingId}`)
    return { success: true }
  } catch {
    return { success: false, error: 'Gagal mengupdate status' }
  }
}

// ── Portal ───────────────────────────────────────────────────────────────────

export async function registerTraining(
  trainingId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireAuth()

    const training = await db.training.findUnique({
      where: { id: trainingId, status: 'OPEN' },
      select: { capacity: true, _count: { select: { registrations: true } } },
    })
    if (!training) return { success: false, error: 'Pelatihan tidak tersedia' }

    if (
      training.capacity !== null &&
      training._count.registrations >= training.capacity
    ) {
      return { success: false, error: 'Kuota penuh' }
    }

    const existing = await db.trainingRegistration.findUnique({
      where: { userId_trainingId: { userId: user.id!, trainingId } },
    })
    if (existing) {
      if (existing.status !== 'CANCELLED') {
        return { success: false, error: 'Sudah terdaftar' }
      }
      // re-register
      await db.trainingRegistration.update({
        where: { id: existing.id },
        data: { status: 'REGISTERED' },
      })
    } else {
      await db.trainingRegistration.create({
        data: { userId: user.id!, trainingId },
      })
    }

    revalidatePath('/portal/trainings')
    revalidatePath('/portal/dashboard')
    return { success: true }
  } catch {
    return { success: false, error: 'Gagal mendaftar pelatihan' }
  }
}

export async function cancelTrainingRegistration(
  trainingId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireAuth()
    await db.trainingRegistration.update({
      where: { userId_trainingId: { userId: user.id!, trainingId } },
      data: { status: 'CANCELLED' },
    })
    revalidatePath('/portal/trainings')
    revalidatePath('/portal/dashboard')
    return { success: true }
  } catch {
    return { success: false, error: 'Gagal membatalkan pendaftaran' }
  }
}
