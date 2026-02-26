'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useSWR from 'swr'
import { getUnreadNotificationsCount, getRecentNotifications, markAsRead } from '@/lib/actions/notifications'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { id as localeId } from 'date-fns/locale'

export function NotificationBell() {
  const router = useRouter()

  // Polling unread count every 30 seconds
  const { data: count = 0, mutate: mutateCount } = useSWR(
    'unread-notifications-count',
    getUnreadNotificationsCount,
    { refreshInterval: 30000 }
  )

  const { data: recentNotifs = [], mutate: mutateRecent } = useSWR(
    'recent-notifications',
    () => getRecentNotifications(5)
  )

  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead) {
      await markAsRead(notif.id)
      mutateCount()
      mutateRecent()
    }
    if (notif.actionUrl) {
      router.push(notif.actionUrl)
    }
  }

  const handleViewAll = () => {
    router.push('/portal/notifications')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifikasi"
        >
          <Bell className="h-4 w-4" />
          {count > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]"
            >
              {count > 9 ? '9+' : count}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center font-normal">
          <span className="font-semibold">Notifikasi</span>
          <Badge variant="secondary" className="px-1.5 py-0">{count} Baru</Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {recentNotifs.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            Tidak ada notifikasi baru
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {recentNotifs.map((notif: any) => (
              <DropdownMenuItem
                key={notif.id}
                className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${!notif.isRead ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex w-full justify-between items-start">
                  <span className={`text-sm ${!notif.isRead ? 'font-semibold text-foreground' : 'font-medium text-foreground'}`}>
                    {notif.title}
                  </span>
                  {!notif.isRead && (
                    <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {notif.message}
                </p>
                <span className="text-[10px] text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: localeId })}
                </span>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="w-full text-center text-sm font-medium text-blue-600 justify-center cursor-pointer"
          onClick={handleViewAll}
        >
          Lihat Semua Notifikasi
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
