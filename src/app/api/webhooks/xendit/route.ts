import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { OrderStatus } from '@/generated/prisma/client'
import { autoEnroll } from '@/lib/actions/orders'
import { sendEmail } from '@/lib/email'
import { getEmailNotificationPrefs } from '@/lib/actions/settings'

export async function POST(req: NextRequest) {
    // Validate Xendit webhook token
    const callbackToken = req.headers.get('x-callback-token')
    if (callbackToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: Record<string, unknown>
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const { external_id, status, payment_method } = body as {
        external_id?: string
        status?: string
        payment_method?: string
    }

    if (!external_id || !status) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // external_id format: invoice_{orderId}
    const orderId = external_id.startsWith('invoice_') ? external_id.slice(8) : null
    if (!orderId) {
        return NextResponse.json({ error: 'Invalid external_id format' }, { status: 400 })
    }

    const order = await db.order.findUnique({
        where: { id: orderId },
        include: { user: { select: { id: true, email: true, name: true } } },
    })

    if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (status === 'PAID') {
        // Idempotency guard
        if (order.status === OrderStatus.PAID) {
            return NextResponse.json({ message: 'Already processed' })
        }

        await db.order.update({
            where: { id: orderId },
            data: {
                status: OrderStatus.PAID,
                paidAt: new Date(),
                paymentMethod: typeof payment_method === 'string' ? payment_method : null,
            },
        })

        // Auto-enroll user
        await autoEnroll(order.userId, order.itemType, order.itemId)

        // Send email notification
        const prefs = await getEmailNotificationPrefs()
        if (prefs.ORDER_CREATED && order.user.email) {
            sendEmail({
                to: order.user.email,
                subject: `Pembayaran Berhasil: ${order.itemTitle}`,
                body: `Halo ${order.user.name ?? ''},\n\nPembayaran Anda untuk "${order.itemTitle}" telah berhasil dikonfirmasi.\nAnda sudah dapat mengakses konten tersebut.\n\nSalam,\nTim LMS AI`,
            }).catch(console.error)
        }
    } else if (status === 'EXPIRED') {
        if (order.status === OrderStatus.PENDING) {
            await db.order.update({
                where: { id: orderId },
                data: { status: OrderStatus.CANCELLED },
            })
        }
    }

    return NextResponse.json({ message: 'OK' })
}
