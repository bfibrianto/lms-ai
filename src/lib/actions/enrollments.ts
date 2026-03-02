'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { checkAndUnlockNextCourse } from '@/lib/actions/path-enrollments'
import { generateCertificate } from '@/lib/actions/certificates'
import { awardPoints } from '@/lib/actions/gamification'
import { createNotification } from '@/lib/actions/notifications'
import { sendEmail } from '@/lib/email'

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
      select: { id: true, title: true },
    })
    if (!course) return { success: false, error: 'Kursus tidak ditemukan' }

    const existing = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id!, courseId } },
    })
    if (existing) return { success: false, error: 'Sudah terdaftar' }

    await db.enrollment.create({
      data: { userId: user.id!, courseId },
    })

    // Trigger Notification
    await createNotification({
      userId: user.id!,
      type: 'INFO',
      title: 'Pendaftaran Berhasil',
      message: `Anda telah berhasil terdaftar di kursus "${course.title}". Selamat belajar!`,
      actionUrl: `/portal/my-courses/${courseId}`
    })

    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: `Pendaftaran Kursus: ${course.title}`,
        body: `Halo ${user.name},\n\nAnda telah terdaftar di kursus "${course.title}". Selamat belajar!\n\nSalam,\nTim LMS AI`
      })
    }

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
      lastLessonId: true,
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

// ─── Progress Tracking ────────────────────────────────────────

export async function completeLesson(
  courseId: string,
  lessonId: string
): Promise<{ success: boolean; error?: string; progress?: number }> {
  try {
    const user = await requireAuth()

    const enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id!, courseId } },
      include: { course: { select: { title: true } } }
    })
    if (!enrollment) return { success: false, error: 'Belum terdaftar di kursus ini' }

    // Upsert lesson completion
    await db.lessonCompletion.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId,
        },
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId,
      },
      update: {},
    })

    // Count total lessons in this course
    const totalLessons = await db.lesson.count({
      where: { module: { courseId } },
    })

    // Count completed lessons for this enrollment
    const completedCount = await db.lessonCompletion.count({
      where: {
        enrollmentId: enrollment.id,
        lesson: { module: { courseId } },
      },
    })

    // Calculate progress percentage
    const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
    const isCompleted = progress >= 100

    // Update enrollment
    await db.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress,
        lastLessonId: lessonId,
        status: isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
        completedAt: isCompleted ? new Date() : null,
      },
    })

    if (isCompleted) {
      await checkAndUnlockNextCourse(user.id!, courseId)
      // Generate certificate for completing the COURSE
      await generateCertificate({
        userId: user.id!,
        type: 'COURSE',
        referenceId: courseId,
      })
      // Award points for course completion
      await awardPoints(user.id!, 100, `Menyelesaikan kursus: ${enrollment.course.title}`)
    }

    revalidatePath(`/portal/my-courses/${courseId}`)
    revalidatePath('/portal/my-courses')
    revalidatePath('/portal/dashboard')

    return { success: true, progress }
  } catch {
    return { success: false, error: 'Gagal menandai lesson selesai' }
  }
}

export async function getCompletedLessonIds(
  userId: string,
  courseId: string
): Promise<string[]> {
  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: {
      completions: {
        select: { lessonId: true },
      },
    },
  })
  return enrollment?.completions.map((c) => c.lessonId) ?? []
}

export async function updateLastAccessed(
  courseId: string,
  lessonId: string
): Promise<{ success: boolean }> {
  try {
    const user = await requireAuth()

    await db.enrollment.update({
      where: { userId_courseId: { userId: user.id!, courseId } },
      data: {
        lastLessonId: lessonId,
        status: 'IN_PROGRESS',
      },
    })

    return { success: true }
  } catch {
    return { success: false }
  }
}
