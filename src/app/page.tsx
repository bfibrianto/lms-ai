import { Metadata } from 'next'
import Link from 'next/link'
import { GraduationCap, BookOpen, Users, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { getPublishedCourses } from '@/lib/actions/courses'
import { LandingHero } from '@/components/landing/landing-hero'
import { CourseCarousel } from '@/components/landing/course-carousel'
import { LandingFeatures } from '@/components/landing/landing-features'
import { LandingFooter } from '@/components/landing/landing-footer'

export const metadata: Metadata = {
    title: 'Sitamoto Academy — AI-Powered Learning Platform',
    description:
        'Platform LMS internal bertenaga AI untuk pengembangan kompetensi Anda. Buat kursus, quiz, dan sertifikat dengan mudah.',
}

export default async function NewLandingPage() {
    const [courses, stats] = await Promise.all([
        getPublishedCourses(12),
        db.$queryRaw<
            Array<{ courseCount: bigint; enrollmentCount: bigint; userCount: bigint }>
        >`
      SELECT
        (SELECT COUNT(*) FROM courses WHERE status = 'PUBLISHED') AS "courseCount",
        (SELECT COUNT(*) FROM enrollments) AS "enrollmentCount",
        (SELECT COUNT(*) FROM users) AS "userCount"
    `.then((rows) => ({
            courseCount: Number(rows[0]?.courseCount ?? 0),
            enrollmentCount: Number(rows[0]?.enrollmentCount ?? 0),
            userCount: Number(rows[0]?.userCount ?? 0),
        })),
    ])

    return (
        <div className="flex min-h-screen flex-col">
            {/* Navbar */}
            <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                    <Link href="/new-lp" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                            <GraduationCap className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-bold">
                            Sitamoto <span className="text-blue-600">Academy</span>
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-6 text-sm md:flex">
                        <Link
                            href="#courses"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Kursus
                        </Link>
                        <Link
                            href="#features"
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

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/auth/login">Masuk</Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link href="/auth/login">Daftar</Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <LandingHero />

            {/* Stats bar */}
            <section className="border-y bg-slate-50/50 dark:bg-slate-900/20">
                <div className="mx-auto grid max-w-4xl grid-cols-3 gap-6 px-4 py-10">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            <span className="text-3xl font-bold">{stats.courseCount}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">Kursus Tersedia</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <Users className="h-5 w-5 text-emerald-600" />
                            <span className="text-3xl font-bold">{stats.enrollmentCount}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">Total Enrollment</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <Award className="h-5 w-5 text-amber-600" />
                            <span className="text-3xl font-bold">{stats.userCount}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">Pengguna Aktif</p>
                    </div>
                </div>
            </section>

            {/* Courses Carousel */}
            <CourseCarousel courses={courses} />

            {/* Features */}
            <div id="features">
                <LandingFeatures />
            </div>

            {/* CTA Section */}
            <section className="py-20">
                <div className="mx-auto max-w-3xl px-4 text-center">
                    <h2 className="text-2xl font-bold sm:text-3xl">
                        Siap Mulai Belajar?
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                        Gabung sekarang dan akses semua kursus, quiz, dan sertifikat.
                        Tingkatkan kompetensi tim Anda bersama Sitamoto Academy.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button size="lg" className="gap-2 px-8" asChild>
                            <Link href="/auth/login">
                                <GraduationCap className="h-5 w-5" />
                                Mulai Sekarang
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="px-8" asChild>
                            <a
                                href="https://sitamoto.ai/en#contact-us"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Hubungi Kami
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <LandingFooter />
        </div>
    )
}
