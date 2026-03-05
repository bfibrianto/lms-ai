import { getOrders, confirmOrder, cancelOrder } from '@/lib/actions/orders'
import { AdminOrdersClient } from './orders-client'

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; search?: string; page?: string }>
}) {
    const sp = await searchParams
    const page = sp.page ? parseInt(sp.page) : 1
    const { orders, total, totalPages } = await getOrders({
        status: sp.status,
        search: sp.search,
        page,
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Manajemen Pesanan</h1>
                <p className="text-muted-foreground">
                    Konfirmasi pembayaran dan kelola pesanan pengguna.
                </p>
            </div>

            <AdminOrdersClient
                orders={orders}
                total={total}
                totalPages={totalPages}
                currentPage={page}
                currentStatus={sp.status || 'ALL'}
                currentSearch={sp.search || ''}
                confirmOrder={confirmOrder}
                cancelOrder={cancelOrder}
            />
        </div>
    )
}
