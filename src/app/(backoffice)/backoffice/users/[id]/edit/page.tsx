import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { getUserById } from '@/lib/actions/users'
import { UserForm } from '@/components/backoffice/users/user-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditUserPage({ params }: PageProps) {
  const session = await auth()
  if (!['SUPER_ADMIN', 'HR_ADMIN'].includes(session!.user.role)) {
    redirect('/backoffice/dashboard')
  }

  const { id } = await params
  const user = await getUserById(id)

  if (!user) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/backoffice/users">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Pengguna</h1>
          <p className="mt-1 text-muted-foreground">
            Ubah data pengguna <span className="font-medium">{user.name}</span>
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <UserForm mode="edit" user={user} currentUserRole={session!.user.role} />
      </div>
    </div>
  )
}
