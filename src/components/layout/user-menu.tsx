'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, Settings, ClipboardList, BookOpen, Award } from 'lucide-react'
import { roleLabels } from '@/lib/roles'

const BACKOFFICE_ROLES = ['SUPER_ADMIN', 'HR_ADMIN', 'MENTOR', 'LEADER']

interface UserMenuProps {
  user: { name: string; email: string; role: string }
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const isBackoffice = BACKOFFICE_ROLES.includes(user.role)
  const accountUrl = isBackoffice
    ? '/backoffice/account'
    : '/portal/account'

  function handleSignOut() {
    startTransition(() => {
      signOut({ callbackUrl: '/auth/login' })
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg p-1.5 transition-all duration-200 hover:bg-accent">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          <p className="text-xs text-muted-foreground">
            {roleLabels[user.role] || user.role}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!isBackoffice && (
          <>
            <DropdownMenuItem
              onClick={() => router.push('/portal/my-courses')}
              className="cursor-pointer"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Kursus Saya
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push('/portal/certificates')}
              className="cursor-pointer"
            >
              <Award className="mr-2 h-4 w-4" />
              Sertifikat
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {user.role === 'CUSTOMER' && (
          <>
            <DropdownMenuItem
              onClick={() => router.push('/portal/orders')}
              className="cursor-pointer"
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Pesanan Saya
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          onClick={() => router.push(accountUrl)}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          Pengaturan Akun
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isPending}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isPending ? 'Keluar...' : 'Keluar'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
