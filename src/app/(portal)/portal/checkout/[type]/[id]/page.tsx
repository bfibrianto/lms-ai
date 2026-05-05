import { getCoursePublicDetail } from '@/lib/actions/courses'
import { checkExistingOrder } from '@/lib/actions/orders'
import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { CheckoutForm } from './checkout-form'

export default async function CheckoutPage({
    params,
}: {
    params: Promise<{ type: string; id: string }>
}) {
    const session = await auth()
    if (!session?.user) redirect('/auth/login')

    const { type, id } = await params

    if (type !== 'course') {
        // For now, only course checkout is supported
        notFound()
    }

    const course = await getCoursePublicDetail(id)
    if (!course) notFound()

    // Check existing order
    const existingOrder = await checkExistingOrder('COURSE', id)

    const effectivePrice = course.promoPrice ?? course.price ?? 0
    const hasDiscount = course.promoPrice != null && course.price != null && course.promoPrice < course.price

    return (
        <CheckoutForm
            item={{
                id: course.id,
                type: 'COURSE',
                title: course.title,
                description: course.description || '',
                thumbnail: course.thumbnail,
                level: course.level,
                moduleCount: course.modules.length,
                price: course.price ?? 0,
                effectivePrice,
                hasDiscount,
            }}
            existingOrderStatus={existingOrder?.status ?? null}
            existingOrderId={existingOrder?.id ?? null}
            existingInvoiceUrl={existingOrder?.xenditInvoiceUrl ?? null}
        />
    )
}
