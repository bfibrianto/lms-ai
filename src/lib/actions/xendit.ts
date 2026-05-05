'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { OrderStatus, OrderItemType } from '@/generated/prisma/client'
import { xenditInvoice } from '@/lib/xendit'
import { autoEnroll } from '@/lib/actions/orders'
import { sendEmail } from '@/lib/email'
import { getEmailNotificationPrefs } from '@/lib/actions/settings'

type ActionResult<T = void> =
    | { success: true; data: T }
    | { success: false; error: string }

export async function createOrderWithXenditInvoice(
    itemType: string,
    itemId: string
): Promise<ActionResult<{ invoiceUrl: string; orderId: string }>> {
    const session = await auth()
    if (!session?.user) return { success: false, error: 'Tidak terautentikasi' }

    // Fetch item details
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
    } else {
        return { success: false, error: 'Tipe item tidak valid' }
    }

    // Check duplicate active order
    const existingOrder = await db.order.findFirst({
        where: {
            userId: session.user.id,
            itemType: itemType as OrderItemType,
            itemId,
            status: { in: [OrderStatus.PENDING, OrderStatus.PAID] },
        },
        select: { id: true, xenditInvoiceUrl: true, status: true },
    })

    if (existingOrder) {
        if (existingOrder.status === OrderStatus.PAID) {
            return { success: false, error: 'Anda sudah memiliki akses ke item ini' }
        }
        // PENDING — return existing invoice URL
        if (existingOrder.xenditInvoiceUrl) {
            return {
                success: true,
                data: { invoiceUrl: existingOrder.xenditInvoiceUrl, orderId: existingOrder.id },
            }
        }
        return { success: false, error: 'Anda sudah memiliki pesanan aktif untuk item ini' }
    }

    // Create order record first
    const order = await db.order.create({
        data: {
            userId: session.user.id,
            itemType: itemType as OrderItemType,
            itemId,
            itemTitle,
            price,
            originalPrice,
            status: OrderStatus.PENDING,
            paymentGateway: 'XENDIT',
        },
        select: { id: true },
    })

    // Create Xendit Invoice
    try {
        const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

        const invoice = await xenditInvoice.createInvoice({
            data: {
                externalId: `ORDER-${order.id}`,
                amount: price,
                description: `Pembayaran: ${itemTitle}`,
                payerEmail: session.user.email ?? undefined,
                successRedirectUrl: `${baseUrl}/portal/orders/${order.id}?status=success`,
                failureRedirectUrl: `${baseUrl}/portal/orders/${order.id}?status=failed`,
                currency: 'IDR',
            },
        })

        // Update order with Xendit invoice details
        await db.order.update({
            where: { id: order.id },
            data: {
                xenditInvoiceId: invoice.id,
                xenditInvoiceUrl: invoice.invoiceUrl,
            },
        })

        revalidatePath('/portal/orders')

        return {
            success: true,
            data: { invoiceUrl: invoice.invoiceUrl!, orderId: order.id },
        }
    } catch (err) {
        // Rollback order if Xendit API fails
        await db.order.delete({ where: { id: order.id } })
        console.error('[Xendit] createInvoice error:', err)
        return { success: false, error: 'Gagal membuat invoice Xendit. Silakan coba lagi.' }
    }
}

export async function getOrderStatus(
    orderId: string
): Promise<ActionResult<{ status: string; xenditInvoiceUrl: string | null; itemType: string; itemId: string }>> {
    const session = await auth()
    if (!session?.user) return { success: false, error: 'Tidak terautentikasi' }

    const order = await db.order.findFirst({
        where: { id: orderId, userId: session.user.id },
        select: { status: true, xenditInvoiceUrl: true, itemType: true, itemId: true },
    })

    if (!order) return { success: false, error: 'Pesanan tidak ditemukan' }

    return {
        success: true,
        data: {
            status: order.status,
            xenditInvoiceUrl: order.xenditInvoiceUrl,
            itemType: order.itemType,
            itemId: order.itemId,
        },
    }
}
