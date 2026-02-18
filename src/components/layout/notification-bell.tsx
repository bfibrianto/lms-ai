'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function NotificationBell({ count = 0 }: { count?: number }) {
  return (
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
  )
}
