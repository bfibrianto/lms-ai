'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { formatRupiah } from '@/lib/utils/format-currency'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { CheckCircle, XCircle, Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'

type OrderItem = {
    id: string
    userId: string
    user: { name: string; email: string }
    itemType: string
    itemId: string
    itemTitle: string
    price: number
    originalPrice: number
    status: string
    paidAt: Date | null
    createdAt: Date
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: string }> = {
    PENDING: { label: 'Pending', variant: 'secondary', icon: '🟡' },
    PAID: { label: 'Lunas', variant: 'default', icon: '🟢' },
    CANCELLED: { label: 'Batal', variant: 'destructive', icon: '🔴' },
    REFUNDED: { label: 'Refund', variant: 'outline', icon: '⚪' },
}

const itemTypeLabels: Record<string, string> = {
    COURSE: 'Kursus',
    TRAINING: 'Pelatihan',
    LEARNING_PATH: 'Learning Path',
}

type ActionResult = { success: boolean; error?: string }

export function AdminOrdersClient({
    orders,
    total,
    totalPages,
    currentPage,
    currentStatus,
    currentSearch,
    confirmOrder,
    cancelOrder,
}: {
    orders: OrderItem[]
    total: number
    totalPages: number
    currentPage: number
    currentStatus: string
    currentSearch: string
    confirmOrder: (id: string) => Promise<ActionResult>
    cancelOrder: (id: string) => Promise<ActionResult>
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [search, setSearch] = useState(currentSearch)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    function updateParams(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString())
        if (value && value !== 'ALL') {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        params.delete('page')
        startTransition(() => {
            router.push(`/backoffice/orders?${params.toString()}`)
        })
    }

    function handleSearch() {
        updateParams('search', search)
    }

    async function handleConfirm(orderId: string) {
        setActionLoading(orderId)
        const result = await confirmOrder(orderId)
        setActionLoading(null)
        if (result.success) {
            toast.success('Pembayaran berhasil dikonfirmasi')
            router.refresh()
        } else {
            toast.error(result.error || 'Gagal konfirmasi')
        }
    }

    async function handleCancel(orderId: string) {
        setActionLoading(orderId)
        const result = await cancelOrder(orderId)
        setActionLoading(null)
        if (result.success) {
            toast.success('Pesanan berhasil dibatalkan')
            router.refresh()
        } else {
            toast.error(result.error || 'Gagal membatalkan')
        }
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
                <Select
                    value={currentStatus}
                    onValueChange={(v) => updateParams('status', v)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Semua Status</SelectItem>
                        <SelectItem value="PENDING">🟡 Pending</SelectItem>
                        <SelectItem value="PAID">🟢 Lunas</SelectItem>
                        <SelectItem value="CANCELLED">🔴 Batal</SelectItem>
                        <SelectItem value="REFUNDED">⚪ Refund</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex gap-2 flex-1">
                    <Input
                        placeholder="Cari nama user atau item..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="max-w-xs"
                    />
                    <Button variant="outline" size="icon" onClick={handleSearch}>
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead>Harga</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    Tidak ada pesanan.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => {
                                const config = statusConfig[order.status] || { label: order.status, variant: 'outline' as const, icon: '⚪' }
                                const isLoading = actionLoading === order.id

                                return (
                                    <TableRow key={order.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-sm">{order.user.name}</p>
                                                <p className="text-xs text-muted-foreground">{order.user.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-sm truncate max-w-[200px]">{order.itemTitle}</p>
                                                <p className="text-xs text-muted-foreground">{itemTypeLabels[order.itemType] || order.itemType}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {formatRupiah(order.price)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={config.variant}>
                                                {config.icon} {config.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {order.status === 'PENDING' && (
                                                <div className="flex justify-end gap-1">
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="sm" variant="default" disabled={isLoading}>
                                                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Konfirmasi Pembayaran?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Pesanan &quot;{order.itemTitle}&quot; oleh {order.user.name} akan ditandai sebagai LUNAS.
                                                                    User akan otomatis di-enroll.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleConfirm(order.id)}>
                                                                    Konfirmasi
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="sm" variant="destructive" disabled={isLoading}>
                                                                <XCircle className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Batalkan Pesanan?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Pesanan &quot;{order.itemTitle}&quot; akan dibatalkan.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Kembali</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleCancel(order.id)}>
                                                                    Ya, Batalkan
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {total} pesanan · Hal {currentPage} dari {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1 || isPending}
                            onClick={() => {
                                const params = new URLSearchParams(searchParams.toString())
                                params.set('page', String(currentPage - 1))
                                router.push(`/backoffice/orders?${params.toString()}`)
                            }}
                        >
                            ← Prev
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages || isPending}
                            onClick={() => {
                                const params = new URLSearchParams(searchParams.toString())
                                params.set('page', String(currentPage + 1))
                                router.push(`/backoffice/orders?${params.toString()}`)
                            }}
                        >
                            Next →
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
