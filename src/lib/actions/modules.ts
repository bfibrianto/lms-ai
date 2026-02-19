'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import type { ActionResult } from '@/types/courses'

const WRITE_ROLES = ['SUPER_ADMIN', 'HR_ADMIN', 'MENTOR'] as const

async function requireWriteAccess() {
  const session = await auth()
  if (!session?.user) throw new Error('Tidak terautentikasi')
  if (!(WRITE_ROLES as readonly string[]).includes(session.user.role)) {
    throw new Error('Akses ditolak')
  }
  return session
}

export async function addModule(
  courseId: string,
  title: string
): Promise<ActionResult<{ id: string }>> {
  await requireWriteAccess()

  if (!title.trim() || title.trim().length < 2) {
    return { success: false, error: 'Judul modul minimal 2 karakter' }
  }

  const lastModule = await db.module.findFirst({
    where: { courseId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })

  const newOrder = (lastModule?.order ?? -1) + 1

  const module = await db.module.create({
    data: { courseId, title: title.trim(), order: newOrder },
    select: { id: true },
  })

  revalidatePath(`/backoffice/courses/${courseId}`)
  return { success: true, data: { id: module.id } }
}

export async function updateModuleTitle(
  moduleId: string,
  title: string
): Promise<ActionResult<void>> {
  await requireWriteAccess()

  if (!title.trim() || title.trim().length < 2) {
    return { success: false, error: 'Judul modul minimal 2 karakter' }
  }

  const module = await db.module.findUnique({
    where: { id: moduleId },
    select: { courseId: true },
  })
  if (!module) return { success: false, error: 'Modul tidak ditemukan' }

  await db.module.update({
    where: { id: moduleId },
    data: { title: title.trim() },
  })

  revalidatePath(`/backoffice/courses/${module.courseId}`)
  return { success: true, data: undefined }
}

export async function deleteModule(moduleId: string): Promise<ActionResult<void>> {
  await requireWriteAccess()

  const module = await db.module.findUnique({
    where: { id: moduleId },
    select: { courseId: true },
  })
  if (!module) return { success: false, error: 'Modul tidak ditemukan' }

  await db.module.delete({ where: { id: moduleId } })
  revalidatePath(`/backoffice/courses/${module.courseId}`)
  return { success: true, data: undefined }
}

export async function reorderModule(
  moduleId: string,
  direction: 'up' | 'down'
): Promise<ActionResult<void>> {
  await requireWriteAccess()

  const module = await db.module.findUnique({
    where: { id: moduleId },
    select: { courseId: true, order: true },
  })
  if (!module) return { success: false, error: 'Modul tidak ditemukan' }

  const siblings = await db.module.findMany({
    where: { courseId: module.courseId },
    orderBy: { order: 'asc' },
    select: { id: true, order: true },
  })

  const idx = siblings.findIndex((m) => m.id === moduleId)
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1

  if (swapIdx < 0 || swapIdx >= siblings.length) {
    return { success: false, error: 'Tidak dapat dipindahkan' }
  }

  const target = siblings[idx]
  const sibling = siblings[swapIdx]

  await db.$transaction([
    db.module.update({ where: { id: target.id }, data: { order: sibling.order } }),
    db.module.update({ where: { id: sibling.id }, data: { order: target.order } }),
  ])

  revalidatePath(`/backoffice/courses/${module.courseId}`)
  return { success: true, data: undefined }
}
