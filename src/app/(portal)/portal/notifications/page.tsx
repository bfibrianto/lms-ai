import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getAllNotifications, markAllAsRead, markAsRead } from '@/lib/actions/notifications'
import { formatDistanceToNow } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Bell, Check, Info, Trophy, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default async function PortalNotificationsPage(props: {
    searchParams: Promise<{ page?: string }>
}) {
    const session = await auth()
    if (!session?.user) {
        redirect('/auth/login')
    }

    const searchParams = await props.searchParams
    const page = Number(searchParams.page) || 1
    const { notifications, totalPages } = await getAllNotifications(page)

    const getIconForType = (type: string) => {
        switch (type) {
            case 'ACHIEVEMENT': return <Trophy className="h-5 w-5 text-yellow-500" />
            case 'REMINDER': return <Clock className="h-5 w-5 text-orange-500" />
            case 'SYSTEM': return <AlertCircle className="h-5 w-5 text-red-500" />
            case 'INFO':
            default:
                return <Info className="h-5 w-5 text-blue-500" />
        }
    }

    return (
        <div className="container max-w-4xl py-10 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Bell className="h-8 w-8 text-primary" />
                        Kotak Masuk Notifikasi
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Pusat informasi dan pembaruan terkait aktivitas belajar Anda.
                    </p>
                </div>

                <form action={markAllAsRead}>
                    <Button type="submit" variant="outline" className="gap-2">
                        <Check className="h-4 w-4" />
                        Tandai Semua Sudah Dibaca
                    </Button>
                </form>
            </div>

            {notifications.length === 0 ? (
                <Card className="flex flex-col items-center justify-center py-20 bg-slate-50 border-dashed">
                    <Bell className="h-12 w-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">Tidak ada notifikasi</h3>
                    <p className="text-slate-500">Anda belum memiliki notifikasi apapun saat ini.</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notif) => (
                        <Card
                            key={notif.id}
                            className={`p-4 transition-colors ${!notif.isRead ? 'bg-blue-50/40 border-l-4 border-l-blue-500' : 'bg-white'}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-white p-2 rounded-full shadow-sm">
                                    {getIconForType(notif.type)}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-semibold ${!notif.isRead ? 'text-foreground' : 'text-slate-700'}`}>
                                            {notif.title}
                                        </h3>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: localeId })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {notif.message}
                                    </p>

                                    <div className="pt-2 flex items-center gap-3">
                                        {notif.actionUrl && (
                                            <Link href={notif.actionUrl}>
                                                <Button variant="link" size="sm" className="h-auto p-0 text-blue-600">
                                                    Lihat Detail &rarr;
                                                </Button>
                                            </Link>
                                        )}

                                        {!notif.isRead && (
                                            <form action={async () => {
                                                'use server'
                                                await markAsRead(notif.id)
                                            }}>
                                                <Button type="submit" variant="ghost" size="sm" className="h-auto p-0 text-slate-500 hover:text-slate-800">
                                                    Tandai Dibaca
                                                </Button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {/* Simple Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 pt-8">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <Link key={i} href={`/portal/notifications?page=${i + 1}`}>
                                    <Button
                                        variant={page === i + 1 ? 'default' : 'outline'}
                                        size="sm"
                                        className="w-8 h-8 p-0"
                                    >
                                        {i + 1}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
