import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getDashboardPath } from '@/lib/roles'

export default async function OldDashboard() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  redirect(getDashboardPath(session.user.role))
}
