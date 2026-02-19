'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

async function requireAuth() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthenticated')
  return session.user
}

export async function enrollCourse(
  courseId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireAuth()

    const course = await db.course.findUnique({
      where: { id: courseId, status: 'PUBLISHED' },
      select: { id: true },
    })
    if (!course) return { success: false, error: 'Kursus tidak ditemukan' }

    const existing = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id!, courseId } },
    })
    if (existing) return { success: false, error: 'Sudah terdaftar' }

    await db.enrollment.create({
      data: { userId: user.id!, courseId },
    })

    revalidatePath('/portal/dashboard')
    revalidatePath('/portal/my-courses')
    revalidatePath(`/portal/courses/${courseId}`)

    return { success: true }
  } catch {
    return { success: false, error: 'Gagal mendaftar kursus' }
  }
}

export async function unenrollCourse(
  courseId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireAuth()

    await db.enrollment.delete({
      where: { userId_courseId: { userId: user.id!, courseId } },
    })

    revalidatePath('/portal/dashboard')
    revalidatePath('/portal/my-courses')
    revalidatePath(`/portal/courses/${courseId}`)

    return { success: true }
  } catch {
    return { success: false, error: 'Gagal membatalkan pendaftaran' }
  }
}

export async function getPublishedCourses(params: {
  search?: string
  level?: string
  page?: number
}) {
  const { search, level, page = 1 } = params
  const pageSize = 12
  const skip = (page - 1) * pageSize

  const where = {
    status: 'PUBLISHED' as const,
    ...(search && {
      title: { contains: search, mode: 'insensitive' as const },
    }),
    ...(level && level !== 'all' && { level: level as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' }),
  }

  const [courses, total] = await Promise.all([
    db.course.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        level: true,
        status: true,
        creator: { select: { name: true } },
        _count: { select: { modules: true, enrollments: true } },
      },
    }),
    db.course.count({ where }),
  ])

  return { courses, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function getMyEnrollments(userId: string) {
  return db.enrollment.findMany({
    where: { userId },
    orderBy: { enrolledAt: 'desc' },
    select: {
      id: true,
      status: true,
      progress: true,
      enrolledAt: true,
      completedAt: true,
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          thumbnail: true,
          level: true,
          creator: { select: { name: true } },
          _count: { select: { modules: true } },
        },
      },
    },
  })
}

export async function getEnrolledCourseIds(userId: string): Promise<string[]> {
  const enrollments = await db.enrollment.findMany({
    where: { userId },
    select: { courseId: true },
  })
  return enrollments.map((e) => e.courseId)
}
