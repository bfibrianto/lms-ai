'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { OrderStatus, OrderItemType } from '@/generated/prisma/client'
import { CreateOrderSchema } from '@/lib/validations/orders'
import { sendEmail } from '@/lib/email'
import { getEmailNotificationPrefs } from '@/lib/actions/settings'

type ActionResult<T = void> = {
    success: boolean
    data?: T
    error?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function requireAuth() {
    const session = await auth()
    if (!session?.user) throw new Error('Tidak terautentikasi')
    return session
}

async function requireAdminAccess() {
    const session = await auth()
    if (!session?.user) throw new Error('Tidak terautentikasi')
    if (!['SUPER_ADMIN', 'HR_ADMIN'].includes(session.user.role)) {
        throw new Error('Akses ditolak')
    }
    return session
}

export async function autoEnroll(userId: string, itemType: string, itemId: string) {
    if (itemType === 'COURSE') {
        const exists = await db.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId: itemId } },
        })
        if (!exists) {
            await db.enrollment.create({
                data: { userId, courseId: itemId, status: 'ENROLLED' },
            })
        }
    } else if (itemType === 'TRAINING') {
        const exists = await db.trainingRegistration.findFirst({
            where: { userId, trainingId: itemId },
        })
        if (!exists) {
            await db.trainingRegistration.create({
                data: { userId, trainingId: itemId, status: 'REGISTERED' },
            })
        }

        // Auto-enroll to linked courses
        const linkedCourses = await db.trainingCourse.findMany({
            where: { trainingId: itemId },
        })

        if (linkedCourses.length > 0) {
            for (const link of linkedCourses) {
                const expiresAt = new Date()
                expiresAt.setDate(expiresAt.getDate() + link.accessDurationInDays)

                const existingEnrollment = await db.enrollment.findUnique({
                    where: { userId_courseId: { userId, courseId: link.courseId } }
                })

                if (!existingEnrollment || existingEnrollment.isTemporary) {
                    await db.enrollment.upsert({
                        where: { userId_courseId: { userId, courseId: link.courseId } },
                        update: { isTemporary: true, expiresAt },
                        create: { userId, courseId: link.courseId, isTemporary: true, expiresAt }
                    })
                }
            }
        }
    } else if (itemType === 'LEARNING_PATH') {
        const exists = await db.pathEnrollment.findFirst({
            where: { userId, pathId: itemId },
        })
        if (!exists) {
            await db.pathEnrollment.create({
                data: { userId, pathId: itemId },
            })
        }
    }
}

// ---------------------------------------------------------------------------
// User Actions
// ---------------------------------------------------------------------------

export async function createOrder(
    formData: FormData
): Promise<ActionResult<{ orderId: string; autoEnrolled: boolean }>> {
    const session = await requireAuth()

    const raw = {
        itemType: formData.get('itemType'),
        itemId: formData.get('itemId'),
    }

    const parsed = CreateOrderSchema.safeParse(raw)
    if (!parsed.success) {
        return { success: false, error: 'Data tidak valid' }
    }

    const { itemType, itemId } = parsed.data

    // Get item details for snapshot
    let itemTitle = ''
    let price = 0
    let originalPrice = 0

    if (itemType === 'COURSE') {
        const course = await db.course.findUnique({
            where: { id: itemId },
            select: { title: true, price: true, promoPrice: true, visibility: true, status: true },
        })
        if (!course || course.visibility !== 'PUBLIC' || course.status !== 'PUBLISHED') {
            return { success: false, error: 'Kursus tidak ditemukan atau tidak tersedia' }
        }
        itemTitle = course.title
        originalPrice = course.price ? Number(course.price) : 0
        price = course.promoPrice ? Number(course.promoPrice) : originalPrice
    } else if (itemType === 'TRAINING') {
        const training = await db.training.findUnique({
            where: { id: itemId },
            select: { title: true, price: true, promoPrice: true, visibility: true, status: true },
        })
        if (!training || training.visibility !== 'PUBLIC' || training.status !== 'OPEN') {
            return { success: false, error: 'Pelatihan tidak ditemukan atau tidak tersedia' }
        }
        itemTitle = training.title
        originalPrice = training.price ? Number(training.price) : 0
        price = training.promoPrice ? Number(training.promoPrice) : originalPrice
    } else if (itemType === 'LEARNING_PATH') {
        const lp = await db.learningPath.findUnique({
            where: { id: itemId },
            select: { title: true, price: true, promoPrice: true, visibility: true, status: true },
        })
        if (!lp || lp.visibility !== 'PUBLIC' || lp.status !== 'PUBLISHED') {
            return { success: false, error: 'Learning path tidak ditemukan atau tidak tersedia' }
        }
        itemTitle = lp.title
        originalPrice = lp.price ? Number(lp.price) : 0
        price = lp.promoPrice ? Number(lp.promoPrice) : originalPrice
    }

    // Check duplicate order
    const existingOrder = await db.order.findFirst({
        where: {
            userId: session.user.id,
            itemType: itemType as OrderItemType,
            itemId,
            status: { in: [OrderStatus.PENDING, OrderStatus.PAID] },
        },
    })

    if (existingOrder) {
        return { success: false, error: 'Anda sudah memiliki pesanan untuk item ini' }
    }

    const isFree = price === 0

    const order = await db.order.create({
        data: {
            userId: session.user.id,
            itemType: itemType as OrderItemType,
            itemId,
            itemTitle,
            price,
            originalPrice,
            status: isFree ? OrderStatus.PAID : OrderStatus.PENDING,
            paidAt: isFree ? new Date() : null,
        },
        select: { id: true },
    })

    // Auto-enroll for free items
    if (isFree) {
        await autoEnroll(session.user.id, itemType, itemId)
    }

    const prefs = await getEmailNotificationPrefs()
    if (prefs.ORDER_CREATED && session.user.email) {
        sendEmail({
            to: session.user.email,
            subject: `Pesanan Berhasil Dibuat: ${itemTitle}`,
            body: `Halo,\nAnda telah membuat pesanan untuk "${itemTitle}".\nStatus pesanan saat ini adalah: ${isFree ? 'LUNAS' : 'MENUNGGU PEMBAYARAN'}.\nTerima kasih atas pesanan Anda.\n\nSalam,\nTim LMS AI`
        }).catch(console.error)
    }

    revalidatePath('/portal/orders')
    return { success: true, data: { orderId: order.id, autoEnrolled: isFree } }
}

export async function getMyOrders() {
    const session = await requireAuth()

    const orders = await db.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
    })

    return orders.map((o) => ({
        ...o,
        price: Number(o.price),
        originalPrice: Number(o.originalPrice),
    }))
}

export async function checkExistingOrder(itemType: string, itemId: string) {
    const session = await auth()
    if (!session?.user) return null

    return db.order.findFirst({
        where: {
            userId: session.user.id,
            itemType: itemType as OrderItemType,
            itemId,
            status: { in: [OrderStatus.PENDING, OrderStatus.PAID] },
        },
    })
}

// ---------------------------------------------------------------------------
// Admin Actions
// ---------------------------------------------------------------------------

export async function getOrders(params: {
    search?: string
    status?: string
    page?: number
    pageSize?: number
}) {
    await requireAdminAccess()

    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 10
    const skip = (page - 1) * pageSize

    const where: Record<string, unknown> = {}
    if (params.status && params.status !== 'ALL') {
        where.status = params.status
    }
    if (params.search) {
        where.OR = [
            { itemTitle: { contains: params.search, mode: 'insensitive' } },
            { user: { name: { contains: params.search, mode: 'insensitive' } } },
        ]
    }

    const [orders, total] = await Promise.all([
        db.order.findMany({
            where,
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
            skip,
            take: pageSize,
        }),
        db.order.count({ where }),
    ])

    return {
        orders: orders.map((o) => ({
            ...o,
            price: Number(o.price),
            originalPrice: Number(o.originalPrice),
        })),
        total,
        totalPages: Math.ceil(total / pageSize),
    }
}

export async function confirmOrder(orderId: string): Promise<ActionResult> {
    const session = await requireAdminAccess()

    const order = await db.order.findUnique({ where: { id: orderId } })
    if (!order) return { success: false, error: 'Pesanan tidak ditemukan' }
    if (order.status !== OrderStatus.PENDING) {
        return { success: false, error: 'Pesanan tidak dalam status PENDING' }
    }

    await db.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PAID, paidAt: new Date() },
    })

    // Auto-enroll
    await autoEnroll(order.userId, order.itemType, order.itemId)

    // Create notification
    await db.notification.create({
        data: {
            userId: order.userId,
            title: 'Pembayaran Dikonfirmasi',
            message: `Pembayaran untuk "${order.itemTitle}" telah dikonfirmasi oleh ${session.user.name}. Selamat belajar!`,
        },
    })

    const prefs = await getEmailNotificationPrefs()
    if (prefs.PAYMENT_VERIFIED) {
        const user = await db.user.findUnique({ where: { id: order.userId }, select: { email: true, name: true } })
        if (user?.email) {
            sendEmail({
                to: user.email,
                subject: `Pembayaran Dikonfirmasi: ${order.itemTitle}`,
                body: `Halo ${user.name},\n\nPembayaran Anda untuk "${order.itemTitle}" telah dikonfirmasi oleh admin. Anda sudah bisa mengakses materi tersebut sekarang juga.\n\nSalam,\nTim LMS AI`
            }).catch(console.error)
        }
    }

    revalidatePath('/backoffice/orders')
    return { success: true }
}

export async function cancelOrder(orderId: string): Promise<ActionResult> {
    await requireAdminAccess()

    const order = await db.order.findUnique({ where: { id: orderId } })
    if (!order) return { success: false, error: 'Pesanan tidak ditemukan' }
    if (order.status !== OrderStatus.PENDING) {
        return { success: false, error: 'Hanya pesanan PENDING yang bisa dibatalkan' }
    }

    await db.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
    })

    revalidatePath('/backoffice/orders')
    return { success: true }
}
