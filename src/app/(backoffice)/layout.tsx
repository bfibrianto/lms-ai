import { auth, signOut } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { isBackofficeRole } from '@/lib/roles'
import { Sidebar } from '@/components/backoffice/sidebar'
import { Header } from '@/components/backoffice/header'
import { MainContent } from '@/components/backoffice/main-content'

export default async function BackofficeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  if (!isBackofficeRole(session.user.role)) {
    redirect('/portal/dashboard')
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
      <Sidebar userRole={user.role} />
      <MainContent>
        <Header user={user} signOutAction={signOutAction} />
        <main className="p-4 text-sm lg:p-6">{children}</main>
      </MainContent>
    </>
  )
}
