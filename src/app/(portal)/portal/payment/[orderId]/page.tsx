import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { PaymentPageClient } from './payment-page-client'

export default async function PaymentPage({
    params,
}: {
    params: Promise<{ orderId: string }>
}) {
    const session = await auth()
    if (!session?.user) redirect('/auth/login')

    const { orderId } = await params

    const order = await db.order.findFirst({
        where: { id: orderId, userId: session.user.id },
        select: {
            id: true,
            status: true,
            itemType: true,
            itemId: true,
            itemTitle: true,
            price: true,
            originalPrice: true,
            xenditInvoiceUrl: true,
            createdAt: true,
        },
    })

    if (!order) notFound()

    const businessInfo = {
        name: process.env.BUSINESS_NAME ?? 'LMS AI',
        address: process.env.BUSINESS_ADDRESS ?? '',
        phone: process.env.BUSINESS_PHONE ?? '',
        email: process.env.BUSINESS_EMAIL ?? '',
        whatsapp: process.env.BUSINESS_WHATSAPP ?? '',
    }

    return (
        <PaymentPageClient
            order={{
                id: order.id,
                status: order.status as string,
                itemType: order.itemType as string,
                itemId: order.itemId,
                itemTitle: order.itemTitle,
                price: Number(order.price),
                originalPrice: Number(order.originalPrice),
                xenditInvoiceUrl: order.xenditInvoiceUrl,
                createdAt: order.createdAt.toISOString(),
            }}
            businessInfo={businessInfo}
        />
    )
}
