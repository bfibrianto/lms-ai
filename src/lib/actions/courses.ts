'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { CourseStatus, CourseLevel } from '@/generated/prisma/client'
import type { Prisma } from '@/generated/prisma/client'
import { CreateCourseSchema, EditCourseSchema } from '@/lib/validations/courses'
import type { CourseListItem, CourseDetail, ActionResult } from '@/types/courses'

// ---------------------------------------------------------------------------
// Access Control
// ---------------------------------------------------------------------------

const WRITE_ROLES = ['SUPER_ADMIN', 'HR_ADMIN', 'MENTOR'] as const

async function requireWriteAccess() {
  const session = await auth()
  if (!session?.user) throw new Error('Tidak terautentikasi')
  if (!(WRITE_ROLES as readonly string[]).includes(session.user.role)) {
    throw new Error('Akses ditolak')
  }
  return session
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function getCourses(params: {
  search?: string
  status?: string
  level?: string
  page?: number
  pageSize?: number
}): Promise<{ courses: CourseListItem[]; total: number; totalPages: number }> {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 10
  const skip = (page - 1) * pageSize

  const where: Prisma.CourseWhereInput = {}

  if (params.search) {
    where.title = { contains: params.search, mode: 'insensitive' }
  }
  if (params.status && params.status !== 'ALL') {
    where.status = params.status as CourseStatus
  }
  if (params.level && params.level !== 'ALL') {
    where.level = params.level as CourseLevel
  }

  const [courses, total] = await Promise.all([
    db.course.findMany({
      where,
      select: {
        id: true,
        title: true,
        thumbnail: true,
        level: true,
        status: true,
        createdAt: true,
        creator: { select: { name: true } },
        _count: { select: { modules: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    db.course.count({ where }),
  ])

  return { courses, total, totalPages: Math.ceil(total / pageSize) }
}

export async function getCourseById(courseId: string): Promise<CourseDetail | null> {
  return db.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnail: true,
      level: true,
      status: true,
      creatorId: true,
      creator: { select: { name: true } },
      createdAt: true,
      updatedAt: true,
      modules: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          courseId: true,
          title: true,
          order: true,
          lessons: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              moduleId: true,
              title: true,
              type: true,
              content: true,
              videoUrl: true,
              fileUrl: true,
              duration: true,
              order: true,
            },
          },
        },
      },
    },
  })
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export async function createCourse(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const session = await requireWriteAccess()

  const raw = {
    title: formData.get('title'),
    description: formData.get('description'),
    thumbnail: formData.get('thumbnail'),
    level: formData.get('level'),
  }

  const parsed = CreateCourseSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data tidak valid',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const course = await db.course.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      thumbnail: parsed.data.thumbnail || null,
      level: parsed.data.level as CourseLevel,
      status: CourseStatus.DRAFT,
      creatorId: session.user.id,
    },
    select: { id: true },
  })

  revalidatePath('/backoffice/courses')
  return { success: true, data: { id: course.id } }
}

export async function updateCourse(
  courseId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  await requireWriteAccess()

  const raw = {
    title: formData.get('title'),
    description: formData.get('description'),
    thumbnail: formData.get('thumbnail'),
    level: formData.get('level'),
    status: formData.get('status'),
  }

  const parsed = EditCourseSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data tidak valid',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  await db.course.update({
    where: { id: courseId },
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      thumbnail: parsed.data.thumbnail || null,
      level: parsed.data.level as CourseLevel,
      status: parsed.data.status as CourseStatus,
    },
  })

  revalidatePath('/backoffice/courses')
  revalidatePath(`/backoffice/courses/${courseId}`)
  return { success: true, data: undefined }
}

export async function deleteCourse(courseId: string): Promise<ActionResult<void>> {
  await requireWriteAccess()

  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { id: true },
  })
  if (!course) return { success: false, error: 'Kursus tidak ditemukan' }

  await db.course.delete({ where: { id: courseId } })
  revalidatePath('/backoffice/courses')
  return { success: true, data: undefined }
}
