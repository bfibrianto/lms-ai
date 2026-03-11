'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { AssignmentType } from '@/generated/prisma/client'
import { sendEmail } from '@/lib/email'
import { getEmailNotificationPrefs } from '@/lib/actions/settings'

async function requireAdmin() {
    const session = await auth()
    if (!session?.user?.id) throw new Error('Unauthenticated')
    if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'HR_ADMIN') {
        throw new Error('Unauthorized')
    }
    return session.user
}

async function requireAuth() {
    const session = await auth()
    if (!session?.user?.id) throw new Error('Unauthenticated')
    return session.user
}

interface CreateAssignmentData {
    type: AssignmentType
    itemId: string
    title: string
    startDate: Date
    dueDate: Date
    userIds: string[]
}

export async function createAssignment(data: CreateAssignmentData) {
    try {
        const user = await requireAdmin()

        // 1. Create the Assignment and AssignmentTargets
        const assignment = await db.assignment.create({
            data: {
                type: data.type,
                itemId: data.itemId,
                title: data.title,
                startDate: data.startDate,
                dueDate: data.dueDate,
                assignedById: user.id!,
                assignees: {
                    create: data.userIds.map(userId => ({
                        userId
                    }))
                }
            }
        })

        // 2. Upsert the specific registration models
        // Because we need to do this for each user, we'll use a loop.
        for (const userId of data.userIds) {
            if (data.type === 'COURSE') {
                await db.enrollment.upsert({
                    where: { userId_courseId: { userId, courseId: data.itemId } },
                    update: { isMandatory: true, startDate: data.startDate, dueDate: data.dueDate },
                    create: { userId, courseId: data.itemId, isMandatory: true, startDate: data.startDate, dueDate: data.dueDate }
                })
            } else if (data.type === 'TRAINING') {
                const existing = await db.trainingRegistration.findFirst({
                    where: { userId, trainingId: data.itemId }
                })
                if (existing) {
                    await db.trainingRegistration.update({
                        where: { id: existing.id },
                        data: { isMandatory: true, startDate: data.startDate, dueDate: data.dueDate }
                    })
                } else {
                    await db.trainingRegistration.create({
                        data: { userId, trainingId: data.itemId, status: 'REGISTERED', isMandatory: true, startDate: data.startDate, dueDate: data.dueDate }
                    })
                }
            } else if (data.type === 'LEARNING_PATH') {
                await db.pathEnrollment.upsert({
                    where: { userId_pathId: { userId, pathId: data.itemId } },
                    update: { isMandatory: true, startDate: data.startDate, dueDate: data.dueDate },
                    create: { userId, pathId: data.itemId, isMandatory: true, startDate: data.startDate, dueDate: data.dueDate }
                })
            }
        }

        // 3. Send Emails if allowed
        const prefs = await getEmailNotificationPrefs()
        if (prefs.MANDATORY_ASSIGNMENT) {
            const users = await db.user.findMany({
                where: { id: { in: data.userIds } },
                select: { email: true, name: true }
            })
            for (const u of users) {
                if (u.email) {
                    sendEmail({
                        to: u.email,
                        subject: `Penugasan Wajib Baru: ${data.title}`,
                        body: `Halo ${u.name},\n\nAnda mendapatkan penugasan wajib baru "${data.title}" dengan tenggat waktu penyelesaian pada ${data.dueDate.toLocaleDateString('id-ID')}.\nSilakan cek portal platform untuk mengakses dan menyelesaikannya tepat waktu.\n\nSalam,\nTim LMS AI`
                    }).catch(console.error)
                }
            }
        }

        revalidatePath('/backoffice/assignments')
        return { success: true, data: assignment }
    } catch (error: any) {
        console.error('Failed to create assignment:', error)
        return { success: false, error: 'Gagal membuat penugasan' }
    }
}

export async function getAssignments(params?: { search?: string, page?: number }) {
    try {
        await requireAdmin()
        const page = params?.page || 1
        const pageSize = 10
        const skip = (page - 1) * pageSize

        const where = params?.search ? {
            title: { contains: params.search, mode: 'insensitive' as const }
        } : {}

        const [assignments, total] = await Promise.all([
            db.assignment.findMany({
                where,
                include: {
                    assignedBy: { select: { name: true } },
                    _count: { select: { assignees: true } }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize
            }),
            db.assignment.count({ where })
        ])

        return {
            success: true,
            data: {
                assignments,
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize)
            }
        }
    } catch (error) {
        return { success: false, error: 'Gagal memuat daftar penugasan' }
    }
}

export async function getAssignmentById(id: string) {
    try {
        await requireAdmin()
        const assignment = await db.assignment.findUnique({
            where: { id },
            include: {
                assignedBy: { select: { name: true } },
                assignees: {
                    include: {
                        user: { select: { name: true, email: true, department: true } }
                    },
                    orderBy: {
                        user: { name: 'asc' }
                    }
                }
            }
        })

        if (!assignment) return { success: false, error: 'Penugasan tidak ditemukan' }

        // Dynamically calculate and sync true progress of each assignee
        const enrichedAssignees = await Promise.all(assignment.assignees.map(async (assignee) => {
            let realProgress = assignee.progress
            let realStatus = assignee.status

            if (assignment.type === 'COURSE') {
                const enrollment = await db.enrollment.findUnique({
                    where: { userId_courseId: { userId: assignee.userId, courseId: assignment.itemId } }
                })
                if (enrollment) {
                    realProgress = enrollment.progress
                    realStatus = enrollment.status === 'COMPLETED' ? 'COMPLETED' : (enrollment.progress > 0 ? 'IN_PROGRESS' : 'PENDING')
                }
            } else if (assignment.type === 'TRAINING') {
                const reg = await db.trainingRegistration.findUnique({
                    where: { userId_trainingId: { userId: assignee.userId, trainingId: assignment.itemId } }
                })
                if (reg) {
                    realProgress = reg.status === 'ATTENDED' ? 100 : 0
                    realStatus = reg.status === 'ATTENDED' ? 'COMPLETED' : 'PENDING'
                }
            } else if (assignment.type === 'LEARNING_PATH') {
                const pathEnv = await db.pathEnrollment.findUnique({
                    where: { userId_pathId: { userId: assignee.userId, pathId: assignment.itemId } }
                })
                if (pathEnv) {
                    const pathCourses = await db.pathCourse.findMany({
                        where: { pathId: assignment.itemId }
                    })
                    const totalCourses = pathCourses.length
                    if (totalCourses > 0) {
                        const courseIds = pathCourses.map(pc => pc.courseId)
                        const enrollments = await db.enrollment.findMany({
                            where: { userId: assignee.userId, courseId: { in: courseIds } }
                        })
                        const completedCourses = enrollments.filter(e => e.status === 'COMPLETED').length
                        realProgress = Math.round((completedCourses / totalCourses) * 100)

                        if (pathEnv.completedAt) {
                            realProgress = 100
                            realStatus = 'COMPLETED'
                        } else {
                            realStatus = realProgress > 0 ? 'IN_PROGRESS' : 'PENDING'
                        }
                    } else {
                        realProgress = pathEnv.completedAt ? 100 : 0
                        realStatus = pathEnv.completedAt ? 'COMPLETED' : 'IN_PROGRESS'
                    }
                }
            }

            if (realStatus !== 'COMPLETED' && new Date(assignment.dueDate) < new Date()) {
                realStatus = 'OVERDUE'
            }

            // Optionally sync it up if different
            if (realProgress !== assignee.progress || realStatus !== assignee.status) {
                await db.assignmentTarget.update({
                    where: { id: assignee.id },
                    data: { progress: realProgress, status: realStatus as any }
                })
            }

            return {
                ...assignee,
                progress: realProgress,
                status: realStatus
            }
        }))

        return { success: true, data: { ...assignment, assignees: enrichedAssignees } }
    } catch (error) {
        return { success: false, error: 'Gagal memuat detail penugasan' }
    }
}

export async function getMyAssignments() {
    try {
        const user = await requireAuth()

        if (user.role === 'CUSTOMER') {
            return { success: false, error: 'Customers do not have mandatory assignments' }
        }

        const assignments = await db.assignmentTarget.findMany({
            where: { userId: user.id! },
            include: {
                assignment: true
            },
            orderBy: {
                assignment: {
                    dueDate: 'asc'
                }
            }
        })

        // Sync individual assignment progress
        const enrichedAssignments = await Promise.all(assignments.map(async (target) => {
            let realProgress = target.progress
            let realStatus = target.status
            const { type, itemId, dueDate } = target.assignment

            if (type === 'COURSE') {
                const enrollment = await db.enrollment.findUnique({
                    where: { userId_courseId: { userId: user.id!, courseId: itemId } }
                })
                if (enrollment) {
                    realProgress = enrollment.progress
                    realStatus = enrollment.status === 'COMPLETED' ? 'COMPLETED' : (enrollment.progress > 0 ? 'IN_PROGRESS' : 'PENDING')
                }
            } else if (type === 'TRAINING') {
                const reg = await db.trainingRegistration.findUnique({
                    where: { userId_trainingId: { userId: user.id!, trainingId: itemId } }
                })
                if (reg) {
                    realProgress = reg.status === 'ATTENDED' ? 100 : 0
                    realStatus = reg.status === 'ATTENDED' ? 'COMPLETED' : 'PENDING'
                }
            } else if (type === 'LEARNING_PATH') {
                const pathEnv = await db.pathEnrollment.findUnique({
                    where: { userId_pathId: { userId: user.id!, pathId: itemId } }
                })
                if (pathEnv) {
                    const pathCourses = await db.pathCourse.findMany({
                        where: { pathId: itemId }
                    })
                    const totalCourses = pathCourses.length
                    if (totalCourses > 0) {
                        const courseIds = pathCourses.map(pc => pc.courseId)
                        const enrollments = await db.enrollment.findMany({
                            where: { userId: user.id!, courseId: { in: courseIds } }
                        })
                        const completedCourses = enrollments.filter(e => e.status === 'COMPLETED').length
                        realProgress = Math.round((completedCourses / totalCourses) * 100)

                        if (pathEnv.completedAt) {
                            realProgress = 100
                            realStatus = 'COMPLETED'
                        } else {
                            realStatus = realProgress > 0 ? 'IN_PROGRESS' : 'PENDING'
                        }
                    } else {
                        realProgress = pathEnv.completedAt ? 100 : 0
                        realStatus = pathEnv.completedAt ? 'COMPLETED' : 'IN_PROGRESS'
                    }
                }
            }

            if (realStatus !== 'COMPLETED' && new Date(dueDate) < new Date()) {
                realStatus = 'OVERDUE'
            }

            if (realProgress !== target.progress || realStatus !== target.status) {
                await db.assignmentTarget.update({
                    where: { id: target.id },
                    data: { progress: realProgress, status: realStatus as any }
                })
            }

            return { ...target, progress: realProgress, status: realStatus }
        }))

        return { success: true, data: enrichedAssignments }
    } catch (error) {
        return { success: false, error: 'Gagal memuat list tugas' }
    }
}

export async function updateAssignmentDates(id: string, startDate: Date, dueDate: Date) {
    try {
        await requireAdmin()

        const assignment = await db.assignment.findUnique({
            where: { id },
            include: { assignees: true }
        })

        if (!assignment) return { success: false, error: 'Penugasan tidak ditemukan' }

        // 1. Update the Assignment
        await db.assignment.update({
            where: { id },
            data: { startDate, dueDate }
        })

        // 2. Update all corresponding enrollments
        const userIds = assignment.assignees.map(a => a.userId)
        const type = assignment.type
        const itemId = assignment.itemId

        if (type === 'COURSE') {
            await db.enrollment.updateMany({
                where: { courseId: itemId, userId: { in: userIds } },
                data: { startDate, dueDate }
            })
        } else if (type === 'TRAINING') {
            await db.trainingRegistration.updateMany({
                where: { trainingId: itemId, userId: { in: userIds } },
                data: { startDate, dueDate }
            })
        } else if (type === 'LEARNING_PATH') {
            await db.pathEnrollment.updateMany({
                where: { pathId: itemId, userId: { in: userIds } },
                data: { startDate, dueDate }
            })
        }

        revalidatePath(`/backoffice/assignments/${id}`)
        revalidatePath(`/backoffice/assignments`)
        return { success: true }
    } catch (error) {
        console.error('Failed to update assignment dates:', error)
        return { success: false, error: 'Gagal memperbarui tanggal penugasan' }
    }
}

export async function removeAssignmentTarget(assignmentId: string, userId: string) {
    try {
        await requireAdmin()

        const assignment = await db.assignment.findUnique({ where: { id: assignmentId } })
        if (!assignment) return { success: false, error: 'Penugasan tidak ditemukan' }

        const type = assignment.type
        const itemId = assignment.itemId

        // 1. Un-mark the related enrollment as mandatory
        if (type === 'COURSE') {
            await db.enrollment.updateMany({
                where: { courseId: itemId, userId },
                data: { isMandatory: false, startDate: null, dueDate: null }
            })
        } else if (type === 'TRAINING') {
            await db.trainingRegistration.updateMany({
                where: { trainingId: itemId, userId },
                data: { isMandatory: false, startDate: null, dueDate: null }
            })
        } else if (type === 'LEARNING_PATH') {
            await db.pathEnrollment.updateMany({
                where: { pathId: itemId, userId },
                data: { isMandatory: false, startDate: null, dueDate: null }
            })
        }

        // 2. Delete the assignment target
        await db.assignmentTarget.deleteMany({
            where: { assignmentId, userId }
        })

        revalidatePath(`/backoffice/assignments/${assignmentId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to remove assignment target:', error)
        return { success: false, error: 'Gagal menghapus peserta' }
    }
}

export async function verifyAssignmentCompletion(assignmentId: string, userId: string) {
    try {
        await requireAdmin()

        const assignment = await db.assignment.findUnique({ where: { id: assignmentId } })
        if (!assignment) return { success: false, error: 'Penugasan tidak ditemukan' }

        const type = assignment.type
        const itemId = assignment.itemId

        // Mark related enrollment as completed
        if (type === 'COURSE') {
            await db.enrollment.updateMany({
                where: { courseId: itemId, userId },
                data: { status: 'COMPLETED', progress: 100, completedAt: new Date() }
            })
        } else if (type === 'TRAINING') {
            await db.trainingRegistration.updateMany({
                where: { trainingId: itemId, userId },
                data: { status: 'ATTENDED' } // ATTENDED serves as COMPLETED for Training
            })
        } else if (type === 'LEARNING_PATH') {
            await db.pathEnrollment.updateMany({
                where: { pathId: itemId, userId },
                data: { completedAt: new Date() }
            })
        }

        // 2. Update assignment target
        await db.assignmentTarget.updateMany({
            where: { assignmentId, userId },
            data: { status: 'COMPLETED', progress: 100, completedAt: new Date() }
        })

        revalidatePath(`/backoffice/assignments/${assignmentId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to verify assignment:', error)
        return { success: false, error: 'Gagal memverifikasi penyelesaian' }
    }
}

export async function getAssigneeHistory(userId: string, itemId: string, type: string) {
    try {
        await requireAdmin()
        if (type === 'COURSE') {
            const enrollment = await db.enrollment.findUnique({
                where: { userId_courseId: { userId, courseId: itemId } },
                include: {
                    completions: {
                        include: { lesson: { select: { title: true, type: true } } },
                        orderBy: { completedAt: 'desc' }
                    }
                }
            })
            return {
                success: true,
                data: enrollment?.completions.map(c => ({
                    title: c.lesson.title,
                    type: c.lesson.type,
                    date: c.completedAt
                })) || []
            }
        }
        // For Training or Learning Path, history is more complex or less granular.
        return { success: true, data: [] }
    } catch (error) {
        return { success: false, error: 'Gagal memuat riwayat' }
    }
}
