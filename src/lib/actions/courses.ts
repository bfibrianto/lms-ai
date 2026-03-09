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

/** Public query – no auth required. Returns PUBLISHED + PUBLIC courses for landing page. */
export async function getPublishedCourses(limit = 12) {
  const courses = await db.course.findMany({
    where: { status: 'PUBLISHED', visibility: 'PUBLIC' },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnail: true,
      level: true,
      price: true,
      promoPrice: true,
      creator: { select: { name: true } },
      _count: { select: { modules: true, enrollments: true } },
      modules: {
        select: {
          _count: { select: { lessons: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  // Convert Decimal to Number for client serialization
  return courses.map((c) => ({
    ...c,
    price: c.price != null ? Number(c.price) : null,
    promoPrice: c.promoPrice != null ? Number(c.promoPrice) : null,
  }))
}

export type PublishedCourse = Awaited<ReturnType<typeof getPublishedCourses>>[number]

/** Public detail for a single course. No auth required. */
export async function getCoursePublicDetail(courseId: string) {
  const course = await db.course.findUnique({
    where: { id: courseId, visibility: 'PUBLIC', status: 'PUBLISHED' },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnail: true,
      level: true,
      price: true,
      promoPrice: true,
      creator: { select: { name: true } },
      _count: { select: { enrollments: true } },
      modules: {
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
            },
          },
        },
      },
    },
  })

  if (!course) return null

  return {
    ...course,
    price: course.price != null ? Number(course.price) : null,
    promoPrice: course.promoPrice != null ? Number(course.promoPrice) : null,
  }
}

export type PublicCourseDetail = NonNullable<Awaited<ReturnType<typeof getCoursePublicDetail>>>

/** Preview content — module 1 with full lesson content. No auth. */
export async function getCoursePreviewContent(courseId: string) {
  const course = await db.course.findUnique({
    where: { id: courseId, visibility: 'PUBLIC', status: 'PUBLISHED' },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      promoPrice: true,
      modules: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          order: true,
          lessons: {
            orderBy: { order: 'asc' },
            select: { id: true, title: true, type: true, content: true },
          },
        },
      },
    },
  })

  if (!course) return null

  // Separate first module (preview) from rest
  const firstModule = course.modules[0] ?? null
  const allModules = course.modules.map((m) => ({ id: m.id, title: m.title, order: m.order }))

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    price: course.price != null ? Number(course.price) : null,
    promoPrice: course.promoPrice != null ? Number(course.promoPrice) : null,
    previewModule: firstModule,
    allModules,
    totalModules: course.modules.length,
  }
}

export type CoursePreview = NonNullable<Awaited<ReturnType<typeof getCoursePreviewContent>>>

export async function getCourseById(courseId: string): Promise<CourseDetail | null> {
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnail: true,
      level: true,
      visibility: true,
      price: true,
      promoPrice: true,
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

  if (!course) return null

  return {
    ...course,
    price: course.price != null ? Number(course.price) : null,
    promoPrice: course.promoPrice != null ? Number(course.promoPrice) : null,
  }
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
    visibility: formData.get('visibility') || 'INTERNAL',
    price: formData.get('price'),
    promoPrice: formData.get('promoPrice'),
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
      visibility: parsed.data.visibility as any,
      price: parsed.data.price,
      promoPrice: parsed.data.promoPrice,
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
    visibility: formData.get('visibility') || 'INTERNAL',
    price: formData.get('price'),
    promoPrice: formData.get('promoPrice'),
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
      visibility: parsed.data.visibility as any,
      price: parsed.data.price,
      promoPrice: parsed.data.promoPrice,
    },
  })

  revalidatePath('/backoffice/courses')
  revalidatePath(`/backoffice/courses/${courseId}`)
  return { success: true, data: undefined }
}

export async function deleteCourse(courseId: string): Promise<ActionResult<void>> {
  await requireWriteAccess()

  const activeAssignment = await db.assignment.findFirst({
    where: { itemId: courseId, type: 'COURSE' }
  })
  if (activeAssignment) {
    return { success: false, error: 'Item ini sedang ditugaskan secara Mandatory. Hapus penugasan terlebih dahulu atau pilih Non-aktifkan (Draft).' }
  }

  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { id: true },
  })
  if (!course) return { success: false, error: 'Kursus tidak ditemukan' }

  await db.course.delete({ where: { id: courseId } })
  revalidatePath('/backoffice/courses')
  return { success: true, data: undefined }
}

// ---------------------------------------------------------------------------
// Participant Tracking (TASK-018)
// ---------------------------------------------------------------------------

import type { ParticipantListItem, ParticipantDetail } from '@/types/courses'

export async function getCourseParticipants(courseId: string): Promise<ActionResult<{ participants: ParticipantListItem[]; total: number }>> {
  try {
    await requireWriteAccess()

    const [enrollments, totalLessons] = await Promise.all([
      db.enrollment.findMany({
        where: { courseId },
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
          _count: { select: { completions: true } }
        },
        orderBy: { enrolledAt: 'desc' }
      }),
      db.lesson.count({
        where: { module: { courseId } }
      })
    ])

    const participants: ParticipantListItem[] = enrollments.map(en => {
      const completed = en._count.completions
      const progressPercentage = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0

      return {
        id: en.id,
        user: {
          id: en.user.id,
          name: en.user.name,
          email: en.user.email,
          role: en.user.role
        },
        progressPercentage,
        completedLessons: completed,
        totalLessons,
        enrolledAt: en.enrolledAt
      }
    })

    return { success: true, data: { participants, total: participants.length } }
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal mengambil data peserta' }
  }
}

export async function getParticipantDetail(courseId: string, userId: string): Promise<ActionResult<ParticipantDetail>> {
  try {
    await requireWriteAccess()

    const user = await db.user.findUnique({ where: { id: userId }, select: { name: true, email: true } })
    if (!user) throw new Error('User tidak ditemukan')

    const enroll = await db.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: { _count: { select: { completions: true } } }
    })

    // If not enrolled at all
    if (!enroll) {
      return {
        success: true,
        data: {
          courseId,
          user: { name: user.name, email: user.email },
          progressPercentage: 0,
          quizzes: []
        }
      }
    }

    const totalLessons = await db.lesson.count({ where: { module: { courseId } } })
    const progressPercentage = (totalLessons > 0) ? Math.round((enroll._count.completions / totalLessons) * 100) : 0

    // Get quizzes for this course
    const quizzes = await db.quiz.findMany({
      where: { courseId },
      select: { id: true, title: true, passingScore: true, order: true }
    })

    const quizDetails = await Promise.all(quizzes.map(async (quiz) => {
      const attempts = await db.quizAttempt.findMany({
        where: { quizId: quiz.id, enrollmentId: enroll.id },
        orderBy: { score: 'desc' }
      })

      const bestScore = attempts.length > 0 ? (attempts[0].score || 0) : 0
      const passed = bestScore >= quiz.passingScore

      return {
        quizId: quiz.id,
        title: quiz.title,
        score: bestScore,
        attempts: attempts.length,
        passed,
      }
    }))

    return {
      success: true,
      data: {
        courseId,
        user: { name: user.name, email: user.email },
        progressPercentage,
        quizzes: quizDetails
      }
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal merincikan detail peserta' }
  }
}
