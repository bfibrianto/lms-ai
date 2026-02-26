'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { generateCertificate } from '@/lib/actions/certificates'
import { createNotification } from '@/lib/actions/notifications'
import { sendEmail } from '@/lib/email'

// ─── PORTAL ACTIONS ──────────────────────────────

export async function getPortalLearningPaths() {
    const session = await auth()
    if (!session?.user) throw new Error('Unauthorized')

    const paths = await db.learningPath.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        include: {
            creator: {
                select: { id: true, name: true }
            },
            courses: {
                include: {
                    course: {
                        select: {
                            id: true,
                            title: true,
                            level: true,
                            thumbnail: true,
                            _count: { select: { modules: true } }
                        }
                    }
                },
                orderBy: { order: 'asc' }
            },
            enrollments: {
                where: { userId: session.user.id }
            }
        }
    })

    return paths
}

export async function getPortalLearningPathDetail(id: string) {
    const session = await auth()
    if (!session?.user) throw new Error('Unauthorized')
    const userId = session.user.id

    const path = await db.learningPath.findFirst({
        where: {
            id,
            status: 'PUBLISHED'
        },
        include: {
            creator: { select: { id: true, name: true } },
            courses: {
                orderBy: { order: 'asc' },
                include: {
                    course: {
                        include: {
                            _count: { select: { modules: true } }
                        }
                    }
                }
            }
        }
    })

    if (!path) return null

    // Get user's enrollment for this path
    const pathEnrollment = await db.pathEnrollment.findUnique({
        where: { userId_pathId: { userId, pathId: path.id } }
    })

    // Get all active course enrollments for this user
    const courseEnrollments = await db.enrollment.findMany({
        where: {
            userId,
            courseId: { in: path.courses.map(pc => pc.courseId) }
        }
    })

    // Map progress and locking mechanism
    let isPreviousCompleted = true // First course is always unlocked

    const processedCourses = path.courses.map((pc: any, index: number) => {
        const enrollment = courseEnrollments.find(e => e.courseId === pc.courseId)

        // Check if locked
        const isCompleted = enrollment?.status === 'COMPLETED'

        const isLocked = !pathEnrollment ? true : !isPreviousCompleted

        // Update isPreviousCompleted for the NEXT iteration
        isPreviousCompleted = isCompleted

        return {
            ...pc,
            isLocked,
            isCompleted,
            enrollmentStatus: enrollment?.status,
            progress: enrollment?.progress || 0
        }
    })

    return {
        ...path,
        enrollment: pathEnrollment,
        courses: processedCourses
    }
}

export async function enrollInPath(pathId: string) {
    const session = await auth()
    if (!session?.user) throw new Error('Unauthorized')
    const userId = session.user.id

    // 1. Validate Path
    const path = await db.learningPath.findFirst({
        where: { id: pathId, status: 'PUBLISHED' },
        include: {
            courses: {
                orderBy: { order: 'asc' },
                take: 1
            }
        }
    })

    if (!path) throw new Error('Learning path tidak ditemukan')

    // 2. Transaksi Enrollment
    await db.$transaction(async (tx: any) => {
        // Daftar ke Learning Path
        await tx.pathEnrollment.upsert({
            where: { userId_pathId: { userId, pathId } },
            update: {},
            create: { userId, pathId }
        })

        // Auto-enroll ke kursus pertama jika ada
        const firstCourse = path.courses[0]
        if (firstCourse) {
            await tx.enrollment.upsert({
                where: { userId_courseId: { userId, courseId: firstCourse.courseId } },
                update: {},
                create: {
                    userId,
                    courseId: firstCourse.courseId,
                    status: 'ENROLLED'
                }
            })
        }
    })

    // Trigger Notification
    await createNotification({
        userId: userId,
        type: 'INFO',
        title: 'Pendaftaran Learning Path Berhasil',
        message: `Anda telah terdaftar di learning path "${path.title}".`,
        actionUrl: `/portal/learning-paths/${pathId}`
    })

    if (session.user.email) {
        await sendEmail({
            to: session.user.email,
            subject: `Pendaftaran Learning Path: ${path.title}`,
            body: `Halo ${session.user.name},\n\nAnda telah terdaftar di learning path "${path.title}".\n\nSalam,\nTim LMS AI`
        })
    }

    revalidatePath(`/portal/learning-paths/${pathId}`)
    revalidatePath('/portal/my-courses')
    revalidatePath('/portal/learning-paths')
    return { success: true }
}

// Internal function to check and unlock next course in the path
export async function checkAndUnlockNextCourse(userId: string, completedCourseId: string) {
    // Find all learning paths containing this completed course
    // where the user is also enrolled in those paths
    const pathCourses = await db.pathCourse.findMany({
        where: { courseId: completedCourseId },
        include: {
            path: {
                include: {
                    courses: { orderBy: { order: 'asc' } },
                    enrollments: { where: { userId } }
                }
            }
        }
    })

    for (const pc of pathCourses) {
        // If user is not enrolled in this path, skip
        if (pc.path.enrollments.length === 0) continue

        const allCoursesInPath = pc.path.courses
        const currentIndex = allCoursesInPath.findIndex((c: any) => c.courseId === completedCourseId)

        // Check if this path was fully completed
        if (currentIndex === allCoursesInPath.length - 1) {
            // It was the last course in the path. Check if ALL courses in path are completed by user
            const courseIds = allCoursesInPath.map((c: any) => c.courseId)
            const userEnrollments = await db.enrollment.findMany({
                where: { userId, courseId: { in: courseIds } }
            })

            const isPathFullyCompleted = allCoursesInPath.every((course: any) => {
                const enr = userEnrollments.find(e => e.courseId === course.courseId)
                return enr?.status === 'COMPLETED'
            })

            if (isPathFullyCompleted) {
                // Mark PathEnrollment as completed
                await db.pathEnrollment.update({
                    where: { userId_pathId: { userId, pathId: pc.pathId } },
                    data: { completedAt: new Date() }
                })

                // Generate logic for PATH certificate
                await generateCertificate({
                    userId,
                    type: 'PATH',
                    referenceId: pc.pathId
                })
            }
        } else if (currentIndex < allCoursesInPath.length - 1) {
            // There is a next course. Enroll the user into the next course!
            const nextCourse = allCoursesInPath[currentIndex + 1]

            // Just upsert an enrollment for the next course
            await db.enrollment.upsert({
                where: { userId_courseId: { userId, courseId: nextCourse.courseId } },
                update: {}, // Don't reset if they are already enrolled
                create: {
                    userId,
                    courseId: nextCourse.courseId,
                    status: 'ENROLLED'
                }
            })
        }
    }
}
