'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createOrder } from '@/lib/actions/orders'
import { createOrderWithXenditInvoice } from '@/lib/actions/xendit'
import { formatRupiah, calculateDiscount } from '@/lib/utils/format-currency'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    Loader2,
    CheckCircle,
    BookOpen,
    CreditCard,
    AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'

type CheckoutItem = {
    id: string
    type: string
    title: string
    description: string
    thumbnail: string | null
    level: string
    moduleCount: number
    price: number
    effectivePrice: number
    hasDiscount: boolean
}

export function CheckoutForm({
    item,
    existingOrderStatus,
    existingOrderId,
    existingInvoiceUrl,
}: {
    item: CheckoutItem
    existingOrderStatus: string | null
    existingOrderId?: string | null
    existingInvoiceUrl?: string | null
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const isFree = item.effectivePrice === 0

    async function handleCheckout() {
        setLoading(true)

        if (isFree) {
            // Free item — use existing createOrder (auto-enroll)
            const formData = new FormData()
            formData.set('itemType', item.type)
            formData.set('itemId', item.id)

            const result = await createOrder(formData)
            setLoading(false)

            if (!result.success) {
                toast.error(result.error || 'Gagal membuat pesanan')
                return
            }

            toast.success('Selamat! Anda berhasil mendaftar.')
            router.push(`/portal/my-courses/${item.id}`)
            return
        }

        // Paid item — use Xendit, then redirect to our own payment page
        const result = await createOrderWithXenditInvoice(item.type, item.id)
        setLoading(false)

        if (!result.success) {
            toast.error(result.error || 'Gagal membuat invoice pembayaran')
            return
        }

        // Redirect to our custom payment page (not Xendit-hosted)
        router.push(`/portal/payment/${result.data.orderId}`)
    }

    // Already ordered
    if (existingOrderStatus === 'PAID') {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="p-8 space-y-4">
                        <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
                        <h2 className="text-xl font-bold">Anda Sudah Memiliki Akses</h2>
                        <p className="text-muted-foreground">
                            Anda sudah terdaftar di kursus ini. Mulai belajar sekarang!
                        </p>
                        <Link href={`/portal/my-courses/${item.id}`}>
                            <Button className="w-full mt-2">Lanjut Belajar</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (existingOrderStatus === 'PENDING') {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="p-8 space-y-4">
                        <AlertCircle className="h-12 w-12 mx-auto text-yellow-500" />
                        <h2 className="text-xl font-bold">Pesanan Sedang Diproses</h2>
                        <p className="text-muted-foreground">
                            Anda sudah memiliki pesanan untuk item ini. Selesaikan pembayaran untuk melanjutkan.
                        </p>
                        <div className="flex flex-col gap-2 mt-2">
                            {existingOrderId && (
                                <Link href={`/portal/payment/${existingOrderId}`}>
                                    <Button className="w-full">Lanjutkan Pembayaran</Button>
                                </Link>
                            )}
                            {existingOrderId && (
                                <Link href={`/portal/orders/${existingOrderId}`}>
                                    <Button variant="outline" className="w-full">Lihat Status Pesanan</Button>
                                </Link>
                            )}
                            <Link href="/portal/orders">
                                <Button variant="ghost" className="w-full">Lihat Semua Pesanan</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Checkout form
    return (
        <div className="container mx-auto max-w-2xl px-4 py-8">
            <Link
                href={`/courses/${item.id}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Detail
            </Link>

            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            <div className="space-y-6">
                {/* Item Detail */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex gap-4">
                            {item.thumbnail && (
                                <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="min-w-0">
                                <h3 className="font-semibold truncate">{item.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                    <BookOpen className="h-4 w-4" />
                                    {item.moduleCount} Modul
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <CreditCard className="h-5 w-5" />
                            Ringkasan Pembayaran
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Harga Asli</span>
                            <span className={item.hasDiscount ? 'line-through text-muted-foreground' : ''}>
                                {formatRupiah(item.price)}
                            </span>
                        </div>
                        {item.hasDiscount && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Harga Promo{' '}
                                    <Badge variant="destructive" className="text-xs">
                                        -{calculateDiscount(item.price, item.effectivePrice)}%
                                    </Badge>
                                </span>
                                <span className="font-semibold">{formatRupiah(item.effectivePrice)}</span>
                            </div>
                        )}
                        <div className="border-t pt-3 flex justify-between text-lg font-bold">
                            <span>Total Bayar</span>
                            <span>{isFree ? 'Gratis' : formatRupiah(item.effectivePrice)}</span>
                        </div>

                        <Button
                            className="w-full mt-4"
                            size="lg"
                            onClick={handleCheckout}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isFree ? 'Memproses...' : 'Menyiapkan pembayaran...'}
                                </>
                            ) : isFree ? (
                                'Ambil Gratis'
                            ) : (
                                'Bayar Sekarang'
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
