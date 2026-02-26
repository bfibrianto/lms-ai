'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { CreateLearningPathSchema, UpdatePathCoursesSchema } from '@/lib/validations/learning-paths'

// ─── ADMIN / BACKOFFICE ACTIONS ──────────────────────────────

export async function getLearningPaths() {
    const session = await auth()
    if (!session?.user) throw new Error('Unauthorized')

    const paths = await db.learningPath.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { courses: true, enrollments: true }
            }
        }
    })

    return paths
}

export async function getLearningPathDetail(id: string) {
    const session = await auth()
    if (!session?.user) throw new Error('Unauthorized')

    const learningPath = await db.learningPath.findUnique({
        where: { id },
        include: {
            courses: {
                include: {
                    course: {
                        include: {
                            _count: { select: { modules: true } }
                        }
                    }
                },
                orderBy: { order: 'asc' }
            },
            _count: {
                select: { enrollments: true }
            }
        }
    })

    return learningPath
}

export async function createLearningPath(formData: FormData) {
    const session = await auth()
    if (!session?.user) throw new Error('Unauthorized')

    const rawData = {
        title: formData.get('title'),
        description: formData.get('description'),
        status: formData.get('status'),
        thumbnail: formData.get('thumbnail'),
    }

    const validatedData = CreateLearningPathSchema.safeParse(rawData)

    if (!validatedData.success) {
        return { error: 'Validasi gagal', details: validatedData.error.flatten().fieldErrors }
    }

    const { title, description, status, thumbnail } = validatedData.data

    const path = await db.learningPath.create({
        data: {
            title,
            description,
            status: status || 'DRAFT',
            thumbnail: typeof thumbnail === 'string' ? thumbnail : null,
            creatorId: session.user.id,
        }
    })

    revalidatePath('/backoffice/learning-paths')
    return { success: true, id: path.id }
}

export async function updateLearningPath(id: string, formData: FormData) {
    const session = await auth()
    if (!session?.user) throw new Error('Unauthorized')

    const pathContent = await db.learningPath.findUnique({ where: { id } })
    if (!pathContent) throw new Error('Learning path tidak ditemukan')

    const rawData = {
        title: formData.get('title'),
        description: formData.get('description'),
        status: formData.get('status'),
        thumbnail: formData.get('thumbnail'),
    }

    const validatedData = CreateLearningPathSchema.safeParse(rawData)

    if (!validatedData.success) {
        return { error: 'Validasi gagal', details: validatedData.error.flatten().fieldErrors }
    }

    const { title, description, status, thumbnail } = validatedData.data

    await db.learningPath.update({
        where: { id },
        data: {
            title,
            description,
            status: status || 'DRAFT',
            thumbnail: typeof thumbnail === 'string' ? thumbnail : null,
        }
    })

    revalidatePath('/backoffice/learning-paths')
    revalidatePath(`/backoffice/learning-paths/${id}/edit`)
    return { success: true }
}

export async function deleteLearningPath(id: string) {
    const session = await auth()
    if (!session?.user) throw new Error('Unauthorized')

    const pathContent = await db.learningPath.findUnique({ where: { id } })
    if (!pathContent) throw new Error('Tidak ditemukan')

    await db.learningPath.delete({ where: { id } })

    revalidatePath('/backoffice/learning-paths')
    return { success: true }
}

export async function updatePathCourses(pathId: string, payload: { courseId: string; order: number }[]) {
    const session = await auth()
    if (!session?.user) throw new Error('Unauthorized')

    const validatedData = UpdatePathCoursesSchema.safeParse({ pathId, courses: payload })
    if (!validatedData.success) {
        return { error: 'Data kursus tidak valid' }
    }

    const { courses } = validatedData.data

    await db.$transaction(async (tx: any) => {
        // 1. Delete all existing course relations
        await tx.pathCourse.deleteMany({
            where: { pathId }
        })

        // 2. Re-insert with new order
        if (courses.length > 0) {
            await tx.pathCourse.createMany({
                data: courses.map((course: any) => ({
                    pathId,
                    courseId: course.courseId,
                    order: course.order
                }))
            })
        }
    })

    revalidatePath(`/backoffice/learning-paths/${pathId}/edit`)
    revalidatePath('/portal/learning-paths')
    return { success: true }
}
