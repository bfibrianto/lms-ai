'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { UserMenu } from '@/components/layout/user-menu'
import { NotificationBell } from '@/components/layout/notification-bell'
import { MobileSidebar } from './mobile-sidebar'

interface HeaderProps {
  user: { name: string; email: string; role: string }
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <MobileSidebar userRole={user.role} />

      {/* Search */}
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Cari..." className="pl-9 text-sm" />
      </div>

      {/* Right side actions */}
      <div className="ml-auto flex items-center gap-1">
        <NotificationBell />
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  )
}
