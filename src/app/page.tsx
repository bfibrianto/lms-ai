import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { GraduationCap, BookOpen, Users, Award, CalendarDays, MapPin, Route } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/db'
import { getPublishedCourses } from '@/lib/actions/courses'
import { getPublishedTrainings } from '@/lib/actions/trainings'
import { getPublishedLearningPaths } from '@/lib/actions/learning-paths'
import { PriceDisplay } from '@/components/shared/price-display'
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
    const [courses, trainings, learningPaths, stats] = await Promise.all([
        getPublishedCourses(12),
        getPublishedTrainings(6),
        getPublishedLearningPaths(6),
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

            {/* Public Trainings */}
            {trainings.length > 0 && (
                <section className="py-16 bg-slate-50/50 dark:bg-slate-900/20">
                    <div className="mx-auto max-w-6xl px-4">
                        <h2 className="text-2xl font-bold sm:text-3xl">Pelatihan Tersedia</h2>
                        <p className="mt-1 text-muted-foreground">
                            Workshop, seminar, dan bootcamp yang bisa Anda ikuti
                        </p>
                        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {trainings.map((t) => (
                                <div
                                    key={t.id}
                                    className="flex flex-col rounded-xl border bg-card p-5 transition-all hover:shadow-lg"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold line-clamp-2">{t.title}</h3>
                                        <Badge variant="outline" className="shrink-0 text-xs">
                                            {t.type}
                                        </Badge>
                                    </div>
                                    {t.description && (
                                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                            {t.description}
                                        </p>
                                    )}
                                    <div className="mt-auto flex flex-col gap-2 pt-4">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <CalendarDays className="h-3.5 w-3.5" />
                                            {new Date(t.startDate).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </div>
                                        {t.location && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {t.location}
                                            </div>
                                        )}
                                        {t.price != null && (
                                            <div className="pt-2 border-t">
                                                <PriceDisplay
                                                    price={Number(t.price)}
                                                    promoPrice={t.promoPrice ? Number(t.promoPrice) : null}
                                                    size="sm"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Public Learning Paths */}
            {learningPaths.length > 0 && (
                <section className="py-16">
                    <div className="mx-auto max-w-6xl px-4">
                        <h2 className="text-2xl font-bold sm:text-3xl">Jalur Pembelajaran</h2>
                        <p className="mt-1 text-muted-foreground">
                            Kumpulan kursus terstruktur untuk penguasaan mendalam
                        </p>
                        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {learningPaths.map((lp) => (
                                <div
                                    key={lp.id}
                                    className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg"
                                >
                                    {lp.thumbnail ? (
                                        <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950">
                                            <Image
                                                src={lp.thumbnail}
                                                alt={lp.title}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                                sizes="(max-width: 640px) 100vw, 33vw"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950">
                                            <Route className="h-10 w-10 text-indigo-300 dark:text-indigo-700" />
                                        </div>
                                    )}
                                    <div className="flex flex-1 flex-col p-4">
                                        <h3 className="font-semibold line-clamp-2 group-hover:text-primary">
                                            {lp.title}
                                        </h3>
                                        {lp.description && (
                                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                                {lp.description}
                                            </p>
                                        )}
                                        <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="h-3 w-3" />
                                                {lp._count.courses} kursus
                                            </span>
                                            {lp._count.enrollments > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    {lp._count.enrollments} peserta
                                                </span>
                                            )}
                                        </div>
                                        {lp.price != null && (
                                            <div className="mt-2 pt-2 border-t">
                                                <PriceDisplay
                                                    price={Number(lp.price)}
                                                    promoPrice={lp.promoPrice ? Number(lp.promoPrice) : null}
                                                    size="sm"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

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
