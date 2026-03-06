import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout/theme-toggle'

export function LandingNavbar() {
    return (
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                        <GraduationCap className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-bold">
                        Sitamoto <span className="text-blue-600">Academy</span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-6 text-sm md:flex">
                    <Link
                        href="/#courses"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Kursus
                    </Link>
                    <Link
                        href="/#features"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Fitur
                    </Link>
                    <a
                        href="https://sitamoto.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Sitamoto.ai
                    </a>
                </nav>

                <div className="flex items-center gap-1 sm:gap-3">
                    <ThemeToggle />
                    <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                        <Link href="/auth/login">Masuk</Link>
                    </Button>
                    <Button size="sm" asChild>
                        <Link href="/auth/register">Daftar</Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}
