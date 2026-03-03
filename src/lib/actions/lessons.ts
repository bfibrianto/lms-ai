'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { LessonType } from '@/generated/prisma/client'
import { EditLessonSchema } from '@/lib/validations/courses'
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

async function getCourseIdFromLesson(lessonId: string): Promise<string | null> {
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    select: { module: { select: { courseId: true } } },
  })
  return lesson?.module.courseId ?? null
}

async function getCourseIdFromModule(moduleId: string): Promise<string | null> {
  const module = await db.module.findUnique({
    where: { id: moduleId },
    select: { courseId: true },
  })
  return module?.courseId ?? null
}

export async function createLesson(
  moduleId: string,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  await requireWriteAccess()

  const raw = {
    title: formData.get('title'),
    type: formData.get('type'),
    content: formData.get('content'),
    videoUrl: formData.get('videoUrl'),
    fileUrl: formData.get('fileUrl'),
    duration: formData.get('duration'),
  }

  const parsed = EditLessonSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data tidak valid',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const lastLesson = await db.lesson.findFirst({
    where: { moduleId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })

  const newOrder = (lastLesson?.order ?? -1) + 1
  const type = parsed.data.type as LessonType

  const lesson = await db.lesson.create({
    data: {
      moduleId,
      title: parsed.data.title,
      type,
      content: type === 'TEXT' ? (parsed.data.content || null) : null,
      videoUrl: type === 'VIDEO' ? (parsed.data.videoUrl || null) : null,
      fileUrl: type === 'DOCUMENT' ? (parsed.data.fileUrl || null) : null,
      duration: parsed.data.duration ?? null,
      order: newOrder,
    },
    select: { id: true },
  })

  const courseId = await getCourseIdFromModule(moduleId)
  if (courseId) revalidatePath(`/backoffice/courses/${courseId}`)
  return { success: true, data: { id: lesson.id } }
}

export async function updateLesson(
  lessonId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  await requireWriteAccess()

  const raw = {
    title: formData.get('title'),
    type: formData.get('type'),
    content: formData.get('content'),
    videoUrl: formData.get('videoUrl'),
    fileUrl: formData.get('fileUrl'),
    duration: formData.get('duration'),
  }

  const parsed = EditLessonSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data tidak valid',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const type = parsed.data.type as LessonType

  await db.lesson.update({
    where: { id: lessonId },
    data: {
      title: parsed.data.title,
      type,
      content: type === 'TEXT' ? (parsed.data.content || null) : null,
      videoUrl: type === 'VIDEO' ? (parsed.data.videoUrl || null) : null,
      fileUrl: type === 'DOCUMENT' ? (parsed.data.fileUrl || null) : null,
      duration: parsed.data.duration ?? null,
    },
  })

  const courseId = await getCourseIdFromLesson(lessonId)
  if (courseId) revalidatePath(`/backoffice/courses/${courseId}`)
  return { success: true, data: undefined }
}

export async function deleteLesson(lessonId: string): Promise<ActionResult<void>> {
  await requireWriteAccess()

  const courseId = await getCourseIdFromLesson(lessonId)
  await db.lesson.delete({ where: { id: lessonId } })
  if (courseId) revalidatePath(`/backoffice/courses/${courseId}`)
  return { success: true, data: undefined }
}

export async function reorderLesson(
  lessonId: string,
  direction: 'up' | 'down'
): Promise<ActionResult<void>> {
  await requireWriteAccess()

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    select: { moduleId: true, order: true, module: { select: { courseId: true } } },
  })
  if (!lesson) return { success: false, error: 'Pelajaran tidak ditemukan' }

  const siblings = await db.lesson.findMany({
    where: { moduleId: lesson.moduleId },
    orderBy: { order: 'asc' },
    select: { id: true, order: true },
  })

  const idx = siblings.findIndex((l) => l.id === lessonId)
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1

  if (swapIdx < 0 || swapIdx >= siblings.length) {
    return { success: false, error: 'Tidak dapat dipindahkan' }
  }

  const target = siblings[idx]
  const sibling = siblings[swapIdx]

  await db.$transaction([
    db.lesson.update({ where: { id: target.id }, data: { order: sibling.order } }),
    db.lesson.update({ where: { id: sibling.id }, data: { order: target.order } }),
  ])

  revalidatePath(`/backoffice/courses/${lesson.module.courseId}`)
  return { success: true, data: undefined }
}

export async function bulkCreateLessons(
  moduleId: string,
  lessons: Array<{ title: string; type: 'TEXT' | 'VIDEO' | 'DOCUMENT' }>
): Promise<ActionResult<{ ids: string[] }>> {
  await requireWriteAccess()

  if (!lessons.length) {
    return { success: false, error: 'Tidak ada pelajaran untuk dibuat.' }
  }

  const lastLesson = await db.lesson.findFirst({
    where: { moduleId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })
  const startOrder = (lastLesson?.order ?? -1) + 1

  // Use individual creates to get IDs back (createMany doesn't return IDs)
  const createdIds: string[] = []
  for (let i = 0; i < lessons.length; i++) {
    const created = await db.lesson.create({
      data: {
        moduleId,
        title: lessons[i].title.trim(),
        type: lessons[i].type as LessonType,
        order: startOrder + i,
      },
      select: { id: true },
    })
    createdIds.push(created.id)
  }

  const courseId = await getCourseIdFromModule(moduleId)
  if (courseId) revalidatePath(`/backoffice/courses/${courseId}`)
  return { success: true, data: { ids: createdIds } }
}

/**
 * Batch reorder lessons within a module in a single transaction.
 * Frontend sends the full ordered list after drag & drop.
 */
export async function batchReorderLessons(
  moduleId: string,
  lessons: Array<{ id: string; order: number }>
): Promise<ActionResult<void>> {
  await requireWriteAccess()

  if (!lessons.length) {
    return { success: false, error: 'Tidak ada pelajaran untuk diurutkan.' }
  }

  const updates = lessons.map((l) =>
    db.lesson.update({ where: { id: l.id }, data: { order: l.order } })
  )

  await db.$transaction(updates)

  const courseId = await getCourseIdFromModule(moduleId)
  if (courseId) revalidatePath(`/backoffice/courses/${courseId}`)
  return { success: true, data: undefined }
}
