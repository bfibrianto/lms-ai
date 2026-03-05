import { getMyOrders } from '@/lib/actions/orders'
import { formatRupiah } from '@/lib/utils/format-currency'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag } from 'lucide-react'

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    PENDING: { label: 'Menunggu Pembayaran', variant: 'secondary' },
    PAID: { label: 'Lunas', variant: 'default' },
    CANCELLED: { label: 'Dibatalkan', variant: 'destructive' },
    REFUNDED: { label: 'Dikembalikan', variant: 'outline' },
}

const itemTypeLabels: Record<string, string> = {
    COURSE: 'Kursus',
    TRAINING: 'Pelatihan',
    LEARNING_PATH: 'Learning Path',
}

export default async function MyOrdersPage() {
    const orders = await getMyOrders()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Pesanan Saya</h1>
                <p className="text-muted-foreground">Riwayat pembelian kursus, pelatihan, dan learning path.</p>
            </div>

            {orders.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="font-semibold">Belum Ada Pesanan</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Jelajahi kursus yang tersedia di halaman utama.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {orders.map((order) => {
                        const config = statusConfig[order.status] || { label: order.status, variant: 'outline' as const }
                        return (
                            <Card key={order.id}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <CardTitle className="text-base truncate">{order.itemTitle}</CardTitle>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {itemTypeLabels[order.itemType] || order.itemType} · {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <Badge variant={config.variant}>{config.label}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {order.originalPrice !== order.price && (
                                                <span className="line-through mr-2">{formatRupiah(order.originalPrice)}</span>
                                            )}
                                            <span className="font-semibold text-foreground">{formatRupiah(order.price)}</span>
                                        </span>
                                        {order.paidAt && (
                                            <span className="text-xs text-muted-foreground">
                                                Dibayar: {new Date(order.paidAt).toLocaleDateString('id-ID')}
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
