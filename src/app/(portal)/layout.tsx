import { auth, signOut } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { isBackofficeRole } from '@/lib/roles'
import { TopNav } from '@/components/portal/top-nav'

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  if (isBackofficeRole(session.user.role)) {
    redirect('/backoffice/dashboard')
  }

  const signOutAction = async () => {
    'use server'
    await signOut({ redirectTo: '/auth/login' })
  }

  const user = {
    name: session.user.name ?? '',
    email: session.user.email ?? '',
    role: session.user.role,
  }

  return (
    <>
      <TopNav user={user} signOutAction={signOutAction} />
      <main className="mx-auto max-w-7xl px-4 py-6 text-base lg:px-8">
        {children}
      </main>
    </>
  )
}
