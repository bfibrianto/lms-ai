'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getOrderStatus } from '@/lib/actions/xendit'
import { formatRupiah } from '@/lib/utils/format-currency'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    CheckCircle,
    AlertCircle,
    Loader2,
    ExternalLink,
    MapPin,
    Phone,
    Mail,
    MessageCircle,
    CreditCard,
    Clock,
    ArrowLeft,
} from 'lucide-react'

type OrderData = {
    id: string
    status: string
    itemType: string
    itemId: string
    itemTitle: string
    price: number
    originalPrice: number
    xenditInvoiceUrl: string | null
    createdAt: string
}

type BusinessInfo = {
    name: string
    address: string
    phone: string
    email: string
    whatsapp: string
}

function getItemPath(itemType: string, itemId: string) {
    if (itemType === 'COURSE') return `/portal/my-courses/${itemId}`
    if (itemType === 'TRAINING') return `/portal/trainings/${itemId}`
    if (itemType === 'LEARNING_PATH') return `/portal/learning-paths/${itemId}`
    return '/portal/orders'
}

export function PaymentPageClient({
    order,
    businessInfo,
}: {
    order: OrderData
    businessInfo: BusinessInfo
}) {
    const [currentStatus, setCurrentStatus] = useState(order.status)
    const [xenditUrl, setXenditUrl] = useState(order.xenditInvoiceUrl)
    const [pollingDone, setPollingDone] = useState(false)

    useEffect(() => {
        // Only poll if PENDING
        if (currentStatus !== 'PENDING') {
            setPollingDone(true)
            return
        }

        let attempts = 0
        const maxAttempts = 20
        const interval = 5000

        async function poll() {
            const result = await getOrderStatus(order.id)
            if (!result.success) {
                setPollingDone(true)
                return
            }

            setCurrentStatus(result.data.status)
            if (result.data.xenditInvoiceUrl) setXenditUrl(result.data.xenditInvoiceUrl)
            attempts++

            if (
                result.data.status === 'PAID' ||
                result.data.status === 'CANCELLED' ||
                result.data.status === 'REFUNDED'
            ) {
                setPollingDone(true)
                return
            }

            if (attempts >= maxAttempts) {
                setPollingDone(true)
                return
            }

            setTimeout(poll, interval)
        }

        const timer = setTimeout(poll, interval)
        return () => clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const hasDiscount = order.originalPrice > 0 && order.price < order.originalPrice

    // --- PAID ---
    if (currentStatus === 'PAID') {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="p-8 space-y-4">
                        <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
                        <h2 className="text-2xl font-bold">Pembayaran Berhasil!</h2>
                        <p className="text-muted-foreground">
                            Terima kasih! Pembayaran Anda telah dikonfirmasi. Silakan mulai belajar.
                        </p>
                        <div className="flex flex-col gap-2 mt-2">
                            <Link href={getItemPath(order.itemType, order.itemId)}>
                                <Button className="w-full">Mulai Belajar</Button>
                            </Link>
                            <Link href="/portal/orders">
                                <Button variant="outline" className="w-full">Lihat Pesanan Saya</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // --- CANCELLED ---
    if (currentStatus === 'CANCELLED' || currentStatus === 'REFUNDED') {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="p-8 space-y-4">
                        <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
                        <h2 className="text-xl font-bold">Pesanan Dibatalkan</h2>
                        <p className="text-muted-foreground">
                            Pesanan ini sudah dibatalkan atau kedaluwarsa. Silakan buat pesanan baru.
                        </p>
                        <Link href="/portal/orders">
                            <Button variant="outline" className="w-full">Lihat Pesanan Saya</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // --- PENDING (main payment page) ---
    return (
        <div className="container mx-auto max-w-2xl px-4 py-8">
            <Link
                href="/portal/orders"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="h-4 w-4" />
                Lihat Semua Pesanan
            </Link>

            <div className="flex items-center gap-3 mb-6">
                <h1 className="text-2xl font-bold">Selesaikan Pembayaran</h1>
                {!pollingDone && (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                )}
            </div>

            <div className="space-y-5">
                {/* Order Summary */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <CreditCard className="h-5 w-5" />
                            Ringkasan Pesanan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                            <div className="min-w-0">
                                <p className="font-medium truncate">{order.itemTitle}</p>
                                <p className="text-sm text-muted-foreground capitalize">
                                    {order.itemType.replace('_', ' ').toLowerCase()}
                                </p>
                            </div>
                            <Badge variant="outline" className="shrink-0 text-yellow-600 border-yellow-400">
                                <Clock className="mr-1 h-3 w-3" />
                                Menunggu Bayar
                            </Badge>
                        </div>

                        <div className="border-t pt-3 space-y-1">
                            {hasDiscount && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Harga Asli</span>
                                    <span className="line-through text-muted-foreground">
                                        {formatRupiah(order.originalPrice)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total Bayar</span>
                                <span className="text-primary">{formatRupiah(order.price)}</span>
                            </div>
                        </div>

                        {/* Xendit Payment CTA */}
                        {xenditUrl ? (
                            <Button
                                className="w-full mt-2"
                                size="lg"
                                onClick={() => window.open(xenditUrl!, '_blank')}
                            >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Bayar via Xendit
                            </Button>
                        ) : (
                            <Button className="w-full mt-2" size="lg" disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menyiapkan metode pembayaran...
                            </Button>
                        )}
                        <p className="text-xs text-center text-muted-foreground">
                            Klik tombol di atas untuk memilih metode pembayaran (Transfer Bank, Virtual Account, QRIS, dll.)
                        </p>
                    </CardContent>
                </Card>

                {/* Instructions */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Petunjuk Pembayaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                            <li>Klik <strong className="text-foreground">Bayar via Xendit</strong> untuk membuka halaman pemilihan metode pembayaran.</li>
                            <li>Pilih metode pembayaran yang Anda inginkan (Transfer Bank, Virtual Account, QRIS, dll.).</li>
                            <li>Selesaikan pembayaran sesuai instruksi yang diberikan.</li>
                            <li>Setelah pembayaran berhasil, akses kursus Anda akan aktif secara otomatis.</li>
                            <li>Jika ada kendala, hubungi kami melalui kontak di bawah.</li>
                        </ol>
                    </CardContent>
                </Card>

                {/* Business Contact */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Butuh Bantuan?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm font-medium">{businessInfo.name}</p>
                        {businessInfo.address && (
                            <div className="flex items-start gap-3 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                <span>{businessInfo.address}</span>
                            </div>
                        )}
                        {businessInfo.phone && (
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 shrink-0" />
                                <a href={`tel:${businessInfo.phone}`} className="hover:text-foreground hover:underline">
                                    {businessInfo.phone}
                                </a>
                            </div>
                        )}
                        {businessInfo.email && (
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 shrink-0" />
                                <a href={`mailto:${businessInfo.email}`} className="hover:text-foreground hover:underline">
                                    {businessInfo.email}
                                </a>
                            </div>
                        )}
                        {businessInfo.whatsapp && (
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <MessageCircle className="h-4 w-4 shrink-0" />
                                <a
                                    href={`https://wa.me/${businessInfo.whatsapp.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-foreground hover:underline"
                                >
                                    WhatsApp: {businessInfo.whatsapp}
                                </a>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
