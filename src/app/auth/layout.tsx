import { LandingNavbar } from '@/components/landing/landing-navbar'
import { LandingFooter } from '@/components/landing/landing-footer'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <LandingNavbar />
            <main className="flex-1 flex flex-col justify-center py-10">
                {children}
            </main>
            <LandingFooter />
        </div>
    )
}
