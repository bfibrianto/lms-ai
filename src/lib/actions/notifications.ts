'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createNotification(params: {
    userId: string
    type: 'INFO' | 'ACHIEVEMENT' | 'REMINDER' | 'SYSTEM'
    title: string
    message: string
    actionUrl?: string
}) {
    // We do not require auth here since this will often be called by the system
    // inside other actions (e.g., when a course is completed)
    try {
        const notif = await db.notification.create({
            data: {
                userId: params.userId,
                type: params.type,
                title: params.title,
                message: params.message,
                actionUrl: params.actionUrl
            }
        })
        return notif
    } catch (error) {
        console.error('Failed to create notification', error)
        return null
    }
}

export async function getUnreadNotificationsCount() {
    const session = await auth()
    if (!session?.user?.id) return 0

    const count = await db.notification.count({
        where: {
            userId: session.user.id,
            isRead: false
        }
    })
    return count
}

export async function getRecentNotifications(limit = 5) {
    const session = await auth()
    if (!session?.user?.id) return []

    const notifications = await db.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: limit
    })
    return notifications
}

export async function getAllNotifications(page = 1) {
    const session = await auth()
    if (!session?.user?.id) throw new Error('Unauthorized')

    const pageSize = 15
    const skip = (page - 1) * pageSize

    const [notifications, total] = await Promise.all([
        db.notification.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: pageSize,
            skip
        }),
        db.notification.count({
            where: { userId: session.user.id }
        })
    ])

    return {
        notifications,
        total,
        totalPages: Math.ceil(total / pageSize),
        page
    }
}

export async function markAsRead(id: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error('Unauthorized')

    await db.notification.update({
        where: {
            id,
            userId: session.user.id // Ensure user owns the notif
        },
        data: { isRead: true }
    })

    revalidatePath('/portal/notifications')
}

export async function markAllAsRead() {
    const session = await auth()
    if (!session?.user?.id) throw new Error('Unauthorized')

    await db.notification.updateMany({
        where: {
            userId: session.user.id,
            isRead: false
        },
        data: { isRead: true }
    })

    revalidatePath('/portal/notifications')
}
