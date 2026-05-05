import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { isBackofficeRole } from '@/lib/roles'
import { TopNav } from '@/components/portal/top-nav'
import { PortalFooter } from '@/components/portal/portal-footer'
import { db } from '@/lib/db'

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

  const dbUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { points: true },
  })

  const user = {
    name: session.user.name ?? '',
    email: session.user.email ?? '',
    role: session.user.role,
    points: dbUser?.points ?? 0,
  }

  const businessInfo = {
    name: process.env.BUSINESS_NAME ?? 'Sitamoto Academy',
    address: process.env.BUSINESS_ADDRESS ?? '',
    phone: process.env.BUSINESS_PHONE ?? '',
    email: process.env.BUSINESS_EMAIL ?? '',
    whatsapp: process.env.BUSINESS_WHATSAPP ?? '',
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopNav user={user} />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 text-base lg:px-8">
        {children}
      </main>
      <PortalFooter
        businessName={businessInfo.name}
        businessAddress={businessInfo.address}
        businessPhone={businessInfo.phone}
        businessEmail={businessInfo.email}
        businessWhatsapp={businessInfo.whatsapp}
      />
    </div>
  )
}

