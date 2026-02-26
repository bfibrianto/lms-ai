import Link from 'next/link'
import Image from 'next/image'
import { redirect, notFound } from 'next/navigation'
import { ArrowLeft, BookOpen, CheckCircle2, Circle, Lock, PlayCircle, Trophy } from 'lucide-react'

import { auth } from '@/lib/auth'
import { getPortalLearningPathDetail } from '@/lib/actions/path-enrollments'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { EnrollPathButton } from '@/components/portal/learning-paths/enroll-path-button'
import { Badge } from '@/components/ui/badge'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function LearningPathDetailPage({ params }: PageProps) {
    const session = await auth()
    if (!session?.user) {
        redirect('/auth/login')
    }

    const { id } = await params
    const path = await getPortalLearningPathDetail(id)

    if (!path) notFound()

    const isEnrolled = !!path.enrollment
    const isCompleted = !!path.enrollment?.completedAt

    const totalCourses = path.courses.length
    const completedCourses = path.courses.filter((c: any) => c.isCompleted).length
    const progressPercentage = totalCourses === 0 ? 0 : Math.round((completedCourses / totalCourses) * 100)

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-6 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-start">
                <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg border md:w-64">
                    {path.thumbnail ? (
                        <Image
                            src={path.thumbnail}
                            alt={path.title}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                            <BookOpen className="h-12 w-12 text-muted-foreground" />
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-4">
                    <div>
                        <Link href="/portal/learning-paths" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Katalog
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">{path.title}</h1>
                        <p className="mt-2 text-muted-foreground">{path.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{totalCourses} Kursus</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Trophy className="h-4 w-4" />
                            <span>Sertifikat Path</span>
                        </div>
                    </div>

                    {isEnrolled && (
                        <div className="space-y-2 pt-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Progress Penyelesaian</span>
                                <span>{progressPercentage}%</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                        </div>
                    )}

                    <div className="pt-2">
                        <EnrollPathButton
                            pathId={path.id}
                            isEnrolled={isEnrolled}
                            isCompleted={isCompleted}
                        />
                    </div>
                </div>
            </div>

            {/* Course List / Path Visualization */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Struktur Jalur Pembelajaran</h2>

                <div className="relative border-l-2 border-muted ml-4 space-y-8 pb-4">
                    {path.courses.map((pc: any, index: number) => {
                        // Determine visual state
                        const isLocked = pc.isLocked
                        const isFinished = pc.isCompleted
                        const isActive = isEnrolled && !isLocked && !isFinished

                        return (
                            <div key={pc.id} className="relative pl-8">
                                {/* Step Indicator */}
                                <div className="absolute -left-[17px] mt-1.5 bg-background p-1">
                                    {isFinished ? (
                                        <CheckCircle2 className="h-6 w-6 text-green-500 fill-green-100 dark:fill-green-900/20" />
                                    ) : isLocked ? (
                                        <Lock className="h-6 w-6 text-muted-foreground bg-muted rounded-full p-1" />
                                    ) : isActive ? (
                                        <PlayCircle className="h-6 w-6 text-primary fill-primary/10" />
                                    ) : (
                                        <Circle className="h-6 w-6 text-muted-foreground" />
                                    )}
                                </div>

                                <div className={`rounded-xl border p-5 transition-colors ${isActive ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-card'}`}>
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div className="flex-1 space-y-1">
                                            <h3 className={`text-lg font-semibold ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>
                                                {index + 1}. {pc.course.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Badge variant="outline">{pc.course.level}</Badge>
                                                <span>• {pc.course._count.modules} Modul</span>
                                            </div>
                                        </div>

                                        <div className="shrink-0 mt-2 sm:mt-0">
                                            {isLocked ? (
                                                <Button disabled variant="outline" className="w-full sm:w-auto">
                                                    <Lock className="mr-2 h-4 w-4" />
                                                    Terkunci
                                                </Button>
                                            ) : isFinished ? (
                                                <Button asChild variant="outline" className="w-full sm:w-auto">
                                                    <Link href={`/portal/my-courses/${pc.courseId}`}>
                                                        Tinjau Kursus
                                                    </Link>
                                                </Button>
                                            ) : isEnrolled ? (
                                                <Button asChild className="w-full sm:w-auto">
                                                    <Link href={`/portal/my-courses/${pc.courseId}`}>
                                                        {pc.progress > 0 ? 'Lanjutkan Belajar' : 'Mulai Belajar'}
                                                    </Link>
                                                </Button>
                                            ) : null}
                                        </div>
                                    </div>

                                    {isActive && pc.progress > 0 && (
                                        <div className="mt-4 flex items-center gap-4">
                                            <Progress value={pc.progress} className="h-1.5 flex-1" />
                                            <span className="text-xs text-muted-foreground">{pc.progress}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
