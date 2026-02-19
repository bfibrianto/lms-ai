import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { UserForm } from '@/components/backoffice/users/user-form'

export default async function NewUserPage() {
  const session = await auth()
  if (!['SUPER_ADMIN', 'HR_ADMIN'].includes(session!.user.role)) {
    redirect('/backoffice/dashboard')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/backoffice/users">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Tambah Pengguna</h1>
          <p className="mt-1 text-muted-foreground">
            Buat akun pengguna baru untuk sistem
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <UserForm mode="create" currentUserRole={session!.user.role} />
      </div>
    </div>
  )
}
