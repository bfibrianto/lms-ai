import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus } from 'lucide-react'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { getUsers } from '@/lib/actions/users'
import { UserTable } from '@/components/backoffice/users/user-table'

interface PageProps {
  searchParams: Promise<{
    search?: string
    role?: string
    status?: string
    page?: string
  }>
}

export default async function UsersPage({ searchParams }: PageProps) {
  const session = await auth()
  if (!['SUPER_ADMIN', 'HR_ADMIN'].includes(session!.user.role)) {
    redirect('/backoffice/dashboard')
  }

  const params = await searchParams
  const page = Number(params.page) || 1

  const { users, total, totalPages } = await getUsers({
    search: params.search,
    role: params.role,
    status: params.status,
    page,
    pageSize: 10,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pengguna</h1>
          <p className="mt-1 text-muted-foreground">
            Kelola akun pengguna sistem
          </p>
        </div>
        <Button asChild>
          <Link href="/backoffice/users/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pengguna
          </Link>
        </Button>
      </div>

      <UserTable
        users={users}
        total={total}
        totalPages={totalPages}
        currentPage={page}
        currentUserRole={session!.user.role}
        currentUserId={session!.user.id}
      />
    </div>
  )
}
