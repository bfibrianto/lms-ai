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

export async function bulkCreateModules(
  courseId: string,
  titles: string[]
): Promise<ActionResult<void>> {
  await requireWriteAccess()

  if (!titles.length) {
    return { success: false, error: 'Tidak ada modul untuk dibuat.' }
  }

  const lastModule = await db.module.findFirst({
    where: { courseId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })
  const startOrder = (lastModule?.order ?? -1) + 1

  await db.module.createMany({
    data: titles.map((title, idx) => ({
      courseId,
      title: title.trim(),
      order: startOrder + idx,
    })),
  })

  revalidatePath(`/backoffice/courses/${courseId}`)
  return { success: true, data: undefined }
}

/**
 * Batch reorder course items (modules and quizzes) in a single transaction.
 * Frontend sends the full ordered list after drag & drop.
 */
export async function batchReorderCourseItems(
  courseId: string,
  items: Array<{ id: string; type: 'MODULE' | 'QUIZ'; order: number }>
): Promise<ActionResult<void>> {
  await requireWriteAccess()

  if (!items.length) {
    return { success: false, error: 'Tidak ada item untuk diurutkan.' }
  }

  const moduleUpdates = items
    .filter((i) => i.type === 'MODULE')
    .map((i) => db.module.update({ where: { id: i.id }, data: { order: i.order } }))

  const quizUpdates = items
    .filter((i) => i.type === 'QUIZ')
    .map((i) => db.quiz.update({ where: { id: i.id }, data: { order: i.order } }))

  await db.$transaction([...moduleUpdates, ...quizUpdates])

  revalidatePath(`/backoffice/courses/${courseId}`)
  return { success: true, data: undefined }
}

// ---------------------------------------------------------------------------
// Context Loader for AI Quiz Generation (TASK-026)
// ---------------------------------------------------------------------------

export type LessonForContext = {
  id: string
  title: string
  type: 'TEXT' | 'VIDEO' | 'DOCUMENT'
  content: string | null
  order: number
}

export type ModuleWithTextLessons = {
  id: string
  title: string
  order: number
  lessons: LessonForContext[]
}

// Helper: extract summary (2 kalimat pertama)
function extractSummary(text: string | null | undefined, maxSentences = 2): string | null {
  if (!text) return null
  // Simple split by period/question/exclamation
  const sentences = text.match(/[^.!?\n]+[.!?\n]+/g) || [text]
  return sentences.slice(0, maxSentences).join('').trim()
}

export async function getModulesWithLessonsForContext(
  courseId: string
): Promise<ActionResult<ModuleWithTextLessons[]>> {
  try {
    const session = await auth()
    if (!session?.user) return { success: false, error: 'Tidak terautentikasi' }
    if (!((['SUPER_ADMIN', 'HR_ADMIN', 'MENTOR'] as string[]).includes(session.user.role))) {
      return { success: false, error: 'Akses ditolak' }
    }

    const modules = await db.module.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        order: true,
        lessons: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            type: true,
            content: true,
            order: true,
          },
        },
      },
    })

    // Mask content for non-TEXT lessons, and extract summary for TEXT
    const result: ModuleWithTextLessons[] = modules.map((mod) => ({
      ...mod,
      lessons: mod.lessons.map((lesson) => ({
        ...lesson,
        type: lesson.type as 'TEXT' | 'VIDEO' | 'DOCUMENT',
        content: lesson.type === 'TEXT' ? extractSummary(lesson.content) : null,
      })),
    }))

    return { success: true, data: result }
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal memuat modul.' }
  }
}
