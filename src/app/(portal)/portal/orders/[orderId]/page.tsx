'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getOrderStatus } from '@/lib/actions/xendit'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED'

interface OrderStatusData {
    status: OrderStatus
    xenditInvoiceUrl: string | null
    itemType: string
    itemId: string
}

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
    const { orderId } = params
    const searchParams = useSearchParams()
    const router = useRouter()
    const returnStatus = searchParams.get('status') // 'success' | 'failed' | null

    const [orderData, setOrderData] = useState<OrderStatusData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [pollingDone, setPollingDone] = useState(false)

    useEffect(() => {
        let attempts = 0
        const maxAttempts = 10
        const interval = 3000

        async function poll() {
            const result = await getOrderStatus(orderId)
            if (!result.success) {
                setError(result.error)
                setLoading(false)
                setPollingDone(true)
                return
            }

            setOrderData(result.data as OrderStatusData)
            setLoading(false)
            attempts++

            if (result.data.status === 'PAID' || result.data.status === 'CANCELLED' || result.data.status === 'REFUNDED') {
                setPollingDone(true)
                return
            }

            if (attempts >= maxAttempts) {
                setPollingDone(true)
                return
            }

            setTimeout(poll, interval)
        }

        poll()
    }, [orderId])

    // Determine item path for "Mulai Belajar" button
    function getItemPath(itemType: string, itemId: string) {
        if (itemType === 'COURSE') return `/portal/my-courses/${itemId}`
        if (itemType === 'TRAINING') return `/portal/trainings/${itemId}`
        if (itemType === 'LEARNING_PATH') return `/portal/learning-paths/${itemId}`
        return '/portal/orders'
    }

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center space-y-3">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">Memeriksa status pembayaran...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="p-8 space-y-4">
                        <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
                        <h2 className="text-xl font-bold">Terjadi Kesalahan</h2>
                        <p className="text-muted-foreground">{error}</p>
                        <Link href="/portal/orders">
                            <Button variant="outline" className="w-full">Lihat Pesanan Saya</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (orderData?.status === 'PAID') {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="p-8 space-y-4">
                        <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
                        <h2 className="text-2xl font-bold">Pembayaran Berhasil!</h2>
                        <p className="text-muted-foreground">
                            Terima kasih! Pembayaran Anda telah dikonfirmasi. Anda sekarang dapat mengakses konten.
                        </p>
                        <div className="flex flex-col gap-2 mt-2">
                            <Link href={getItemPath(orderData.itemType, orderData.itemId)}>
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

    if (returnStatus === 'failed' || orderData?.status === 'CANCELLED') {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="p-8 space-y-4">
                        <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
                        <h2 className="text-xl font-bold">Pembayaran Dibatalkan</h2>
                        <p className="text-muted-foreground">
                            Pesanan Anda telah dibatalkan atau pembayaran gagal. Silakan coba lagi.
                        </p>
                        <div className="flex flex-col gap-2 mt-2">
                            <Link href="/portal/orders">
                                <Button variant="outline" className="w-full">Lihat Pesanan Saya</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // PENDING — still waiting (either polling timed out or just arrived)
    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
            <Card className="w-full max-w-md text-center">
                <CardContent className="p-8 space-y-4">
                    {!pollingDone ? (
                        <>
                            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                            <h2 className="text-xl font-bold">Sedang Diverifikasi...</h2>
                            <p className="text-muted-foreground">
                                Kami sedang memverifikasi pembayaran Anda. Mohon tunggu sebentar.
                            </p>
                        </>
                    ) : (
                        <>
                            <AlertCircle className="h-12 w-12 mx-auto text-yellow-500" />
                            <h2 className="text-xl font-bold">Menunggu Konfirmasi</h2>
                            <p className="text-muted-foreground">
                                Pembayaran Anda sedang diproses. Anda akan mendapat notifikasi setelah dikonfirmasi.
                            </p>
                        </>
                    )}
                    <div className="flex flex-col gap-2 mt-2">
                        {!pollingDone ? (
                            <></>
                        ) : (
                            <Link href={`/portal/payment/${orderId}`}>
                                <Button className="w-full">Lanjutkan Pembayaran</Button>
                            </Link>
                        )}
                        <Link href="/portal/orders">
                            <Button variant="outline" className="w-full">Lihat Pesanan Saya</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
