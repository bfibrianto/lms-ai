import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GraduationCap, Sparkles } from 'lucide-react'

export function LandingHero() {
    return (
        <section className="relative overflow-hidden">
            {/* Subtle gradient background */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-blue-500/10 blur-[120px]" />
                <div className="absolute right-0 top-1/2 h-[400px] w-[500px] rounded-full bg-indigo-400/8 blur-[100px]" />
            </div>

            <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28 lg:py-36">
                {/* Pill badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI-Powered Learning Platform
                </div>

                <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                    Tingkatkan Skill Tim Anda dengan{' '}
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Sitamoto Academy
                    </span>
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                    Platform learning management system internal yang dilengkapi AI untuk
                    mempercepat pembuatan konten, tracking progress, dan pengembangan
                    kompetensi karyawan.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button size="lg" className="gap-2 px-8 text-base" asChild>
                        <Link href="/auth/signin">
                            <GraduationCap className="h-5 w-5" />
                            Mulai Belajar
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="px-8 text-base" asChild>
                        <Link href="#courses">Jelajahi Kursus</Link>
                    </Button>
                </div>

                {/* Trust line */}
                <p className="mt-14 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Dipercaya oleh berbagai organisasi di Indonesia
                </p>
            </div>
        </section>
    )
}
