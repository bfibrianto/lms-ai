'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, BookOpen, Users, Clock } from 'lucide-react'
import type { PublishedCourse } from '@/lib/actions/courses'
import { PriceDisplay } from '@/components/shared/price-display'

const LEVEL_LABEL: Record<string, string> = {
    BEGINNER: 'Pemula',
    INTERMEDIATE: 'Menengah',
    ADVANCED: 'Mahir',
}

const LEVEL_COLOR: Record<string, string> = {
    BEGINNER: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    INTERMEDIATE: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    ADVANCED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

interface CourseCarouselProps {
    courses: PublishedCourse[]
}

export function CourseCarousel({ courses }: CourseCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    function scroll(direction: 'left' | 'right') {
        if (!scrollRef.current) return
        const amount = 320
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -amount : amount,
            behavior: 'smooth',
        })
    }

    function checkScroll() {
        if (!scrollRef.current) return
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }

    useEffect(() => {
        checkScroll()
        const ref = scrollRef.current
        if (ref) {
            ref.addEventListener('scroll', checkScroll)
            window.addEventListener('resize', checkScroll)
            return () => {
                ref.removeEventListener('scroll', checkScroll)
                window.removeEventListener('resize', checkScroll)
            }
        }
    }, [courses])

    if (courses.length === 0) {
        return (
            <section id="courses" className="py-16">
                <div className="mx-auto max-w-6xl px-4">
                    <h2 className="text-2xl font-bold sm:text-3xl">Kursus Tersedia</h2>
                    <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                        <BookOpen className="mb-3 h-10 w-10 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">
                            Belum ada kursus yang dipublikasi.
                        </p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section id="courses" className="py-16">
            <div className="mx-auto max-w-6xl px-4">
                {/* Header */}
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold sm:text-3xl">Kursus Tersedia</h2>
                        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                            Pilih kursus yang sesuai dengan kebutuhan pengembangan Anda
                        </p>
                    </div>
                    <div className="hidden gap-2 sm:flex">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-9 w-9 rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-30" 
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-9 w-9 rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-30" 
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Scrollable carousel */}
                <div
                    ref={scrollRef}
                    className="mt-8 flex gap-5 overflow-x-auto pb-4 scrollbar-none"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {courses.map((course) => {
                        const totalLessons = course.modules.reduce(
                            (sum, m) => sum + m._count.lessons,
                            0
                        )

                        return (
                            <Link
                                key={course.id}
                                href={`/courses/${course.id}`}
                                className="group flex w-[280px] shrink-0 flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                style={{ scrollSnapAlign: 'start' }}
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
                                    {course.thumbnail ? (
                                        <Image
                                            src={course.thumbnail}
                                            alt={course.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="280px"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <BookOpen className="h-10 w-10 text-blue-300 transition-transform duration-300 group-hover:scale-110 dark:text-blue-700" />
                                        </div>
                                    )}
                                    {/* Overlay gradient on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                </div>

                                {/* Content */}
                                <div className="flex flex-1 flex-col p-4">
                                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors duration-200 group-hover:text-primary">
                                        {course.title}
                                    </h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {course.creator.name}
                                    </p>

                                    {/* Meta */}
                                    <div className="mt-auto space-y-2 pt-3">
                                        <Badge
                                            variant="secondary"
                                            className={`text-xs ${LEVEL_COLOR[course.level] ?? ''}`}
                                        >
                                            {LEVEL_LABEL[course.level] ?? course.level}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <BookOpen className="h-3 w-3" />
                                            <span>{course._count.modules} modul · {totalLessons} pelajaran</span>
                                        </div>
                                    </div>

                                    {/* Enrollment count */}
                                    {course._count.enrollments > 0 && (
                                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                                            <Users className="h-3 w-3" />
                                            {course._count.enrollments} peserta
                                        </div>
                                    )}

                                    {/* Price */}
                                    {course.price != null && (
                                        <div className="mt-2 pt-2 border-t">
                                            <PriceDisplay
                                                price={Number(course.price)}
                                                promoPrice={course.promoPrice ? Number(course.promoPrice) : null}
                                                size="sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
