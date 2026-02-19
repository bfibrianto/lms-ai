'use client'

import { useCallback, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { roleLabels } from '@/lib/roles'
import { ToggleStatusButton } from './toggle-status-button'
import { DeleteUserDialog } from './delete-user-dialog'
import type { UserListItem } from '@/types/users'

const ROLE_OPTIONS = [
  { value: 'ALL', label: 'Semua Role' },
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'HR_ADMIN', label: 'HR Admin' },
  { value: 'MENTOR', label: 'Mentor' },
  { value: 'LEADER', label: 'Leader' },
  { value: 'EMPLOYEE', label: 'Karyawan' },
]

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Semua Status' },
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Nonaktif' },
]

const ROLE_BADGE_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  SUPER_ADMIN: 'default',
  HR_ADMIN: 'default',
  MENTOR: 'secondary',
  LEADER: 'secondary',
  EMPLOYEE: 'outline',
}

interface UserTableProps {
  users: UserListItem[]
  total: number
  totalPages: number
  currentPage: number
  currentUserRole: string
  currentUserId: string
}

export function UserTable({
  users,
  total,
  totalPages,
  currentPage,
  currentUserRole,
  currentUserId,
}: UserTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function updateParam(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value && value !== 'ALL') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    }
    // Reset to page 1 whenever filter changes (unless explicitly setting page)
    if (!('page' in updates)) {
      params.delete('page')
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSearch = useCallback(
    (value: string) => {
      if (searchRef.current) clearTimeout(searchRef.current)
      searchRef.current = setTimeout(() => {
        updateParam({ search: value || null })
      }, 400)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, pathname]
  )

  const canManageUser = ['SUPER_ADMIN', 'HR_ADMIN'].includes(currentUserRole)

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau email..."
            defaultValue={searchParams.get('search') ?? ''}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          defaultValue={searchParams.get('role') ?? 'ALL'}
          onValueChange={(v) => updateParam({ role: v })}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          defaultValue={searchParams.get('status') ?? 'ALL'}
          onValueChange={(v) => updateParam({ status: v })}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Departemen</TableHead>
              <TableHead className="text-center">Aktif</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  Tidak ada pengguna ditemukan
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const isSelf = user.id === currentUserId
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div>{user.name}</div>
                      {user.position && (
                        <div className="text-xs text-muted-foreground">
                          {user.position}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={ROLE_BADGE_VARIANT[user.role] ?? 'outline'}>
                        {roleLabels[user.role] ?? user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.department ?? '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      <ToggleStatusButton
                        userId={user.id}
                        isActive={user.isActive}
                        disabled={isSelf || !canManageUser}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          aria-label={`Edit ${user.name}`}
                        >
                          <Link href={`/backoffice/users/${user.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteUserDialog
                          userId={user.id}
                          userName={user.name}
                          disabled={isSelf || !canManageUser}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer: total + pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Total {total} pengguna</span>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateParam({ page: String(currentPage - 1) })}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateParam({ page: String(currentPage + 1) })}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
