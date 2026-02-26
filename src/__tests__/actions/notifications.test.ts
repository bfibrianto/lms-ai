import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    createNotification,
    getUnreadNotificationsCount,
    getRecentNotifications,
    getAllNotifications,
    markAsRead,
    markAllAsRead,
} from '@/lib/actions/notifications'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

vi.mock('@/lib/db', () => ({
    db: {
        notification: {
            create: vi.fn(),
            count: vi.fn(),
            findMany: vi.fn(),
            update: vi.fn(),
            updateMany: vi.fn(),
        },
    },
}))

vi.mock('@/lib/auth', () => ({
    auth: vi.fn(),
}))

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}))

describe('Notification Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('createNotification', () => {
        it('should create a new notification in the database', async () => {
            const mockNotif = { id: 'notif-1', title: 'Test' }
            vi.mocked(db.notification.create).mockResolvedValueOnce(mockNotif as any)

            const result = await createNotification({
                userId: 'user-1',
                type: 'INFO',
                title: 'Test',
                message: 'Hello World',
            })

            expect(db.notification.create).toHaveBeenCalledWith({
                data: {
                    userId: 'user-1',
                    type: 'INFO',
                    title: 'Test',
                    message: 'Hello World',
                    actionUrl: undefined,
                },
            })
            expect(result).toEqual(mockNotif)
        })
    })

    describe('Queries', () => {
        const mockUser = { user: { id: 'user-1' } }

        it('getUnreadNotificationsCount should return count for the logged in user', async () => {
            vi.mocked(auth).mockResolvedValueOnce(mockUser as any)
            vi.mocked(db.notification.count).mockResolvedValueOnce(5)

            const result = await getUnreadNotificationsCount()

            expect(db.notification.count).toHaveBeenCalledWith({
                where: { userId: 'user-1', isRead: false },
            })
            expect(result).toBe(5)
        })

        it('getRecentNotifications should return recent notifications', async () => {
            vi.mocked(auth).mockResolvedValueOnce(mockUser as any)
            const mockList = [{ id: 'n1' }, { id: 'n2' }]
            vi.mocked(db.notification.findMany).mockResolvedValueOnce(mockList as any)

            const result = await getRecentNotifications()

            expect(db.notification.findMany).toHaveBeenCalledWith({
                where: { userId: 'user-1' },
                orderBy: { createdAt: 'desc' },
                take: 5,
            })
            expect(result).toEqual(mockList)
        })

        it('getAllNotifications should return paginated list', async () => {
            vi.mocked(auth).mockResolvedValueOnce(mockUser as any)
            const mockList = Array.from({ length: 5 }, (_, i) => ({ id: `n${i}` }))
            vi.mocked(db.notification.findMany).mockResolvedValueOnce(mockList as any)
            vi.mocked(db.notification.count).mockResolvedValueOnce(20)

            const result = await getAllNotifications(2)

            expect(db.notification.findMany).toHaveBeenCalledWith({
                where: { userId: 'user-1' },
                orderBy: { createdAt: 'desc' },
                take: 15,
                skip: 15,
            })
            expect(result).toEqual({
                notifications: mockList,
                total: 20,
                totalPages: 2,
                page: 2,
            })
        })
    })

    describe('Mutations', () => {
        const mockUser = { user: { id: 'user-1' } }

        it('markAsRead should update a specific notification', async () => {
            vi.mocked(auth).mockResolvedValueOnce(mockUser as any)

            await markAsRead('notif-1')

            expect(db.notification.update).toHaveBeenCalledWith({
                where: { id: 'notif-1', userId: 'user-1' },
                data: { isRead: true },
            })
            expect(revalidatePath).toHaveBeenCalledWith('/portal/notifications')
        })

        it('markAllAsRead should update all unread notifications for a user', async () => {
            vi.mocked(auth).mockResolvedValueOnce(mockUser as any)

            await markAllAsRead()

            expect(db.notification.updateMany).toHaveBeenCalledWith({
                where: { userId: 'user-1', isRead: false },
                data: { isRead: true },
            })
            expect(revalidatePath).toHaveBeenCalledWith('/portal/notifications')
        })
    })
})
