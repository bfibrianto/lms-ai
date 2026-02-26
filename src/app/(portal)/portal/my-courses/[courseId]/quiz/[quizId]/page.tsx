import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Timer, CheckCircle2, RotateCw, HelpCircle, Play } from 'lucide-react'
import { startAttempt, getMyAttempts } from '@/lib/actions/quiz-attempts'
import { QuizPlayer } from '@/components/portal/quizzes/quiz-player'

interface PageProps {
    params: Promise<{ courseId: string; quizId: string }>
    searchParams: Promise<{ attempt?: string }>
}

export default async function QuizPage({ params, searchParams }: PageProps) {
    const session = await auth()
    if (!session?.user) redirect('/auth/login')

    const { courseId, quizId } = await params
    const { attempt: attemptId } = await searchParams

    // Check enrollment
    const enrollment = await db.enrollment.findUnique({
        where: { userId_courseId: { userId: session.user.id!, courseId } },
    })
    if (!enrollment) redirect('/portal/courses')

    // Get quiz with questions
    const quiz = await db.quiz.findUnique({
        where: { id: quizId, courseId },
        select: {
            id: true,
            title: true,
            description: true,
            passingScore: true,
            duration: true,
            maxAttempts: true,
            shuffleQuestions: true,
            showResult: true,
            questions: {
                orderBy: { order: 'asc' },
                select: {
                    id: true,
                    type: true,
                    text: true,
                    points: true,
                    order: true,
                    options: {
                        orderBy: { order: 'asc' },
                        select: { id: true, text: true },
                    },
                },
            },
        },
    })
    if (!quiz) notFound()

    // If active attempt, show quiz player
    if (attemptId) {
        // Verify attempt belongs to user
        const attempt = await db.quizAttempt.findUnique({
            where: { id: attemptId },
            select: {
                id: true,
                submittedAt: true,
                enrollment: { select: { userId: true } },
            },
        })
        if (!attempt || attempt.enrollment.userId !== session.user.id) redirect(`/portal/my-courses/${courseId}`)
        if (attempt.submittedAt) redirect(`/portal/my-courses/${courseId}/quiz/${quizId}/result/${attemptId}`)

        // Shuffle questions if enabled
        let questions = [...quiz.questions]
        if (quiz.shuffleQuestions) {
            questions = questions.sort(() => Math.random() - 0.5)
        }

        return (
            <QuizPlayer
                attemptId={attemptId}
                courseId={courseId}
                quiz={{
                    id: quiz.id,
                    title: quiz.title,
                    duration: quiz.duration,
                    questions,
                }}
            />
        )
    }

    // Otherwise, show quiz info + start button
    const existingAttempts = await db.quizAttempt.count({
        where: { quizId, enrollmentId: enrollment.id },
    })
    const canStart = existingAttempts < quiz.maxAttempts
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0)

    // Get previous attempts
    const prevAttempts = await db.quizAttempt.findMany({
        where: { quizId, enrollmentId: enrollment.id, submittedAt: { not: null } },
        orderBy: { startedAt: 'desc' },
        select: {
            id: true,
            score: true,
            passed: true,
            startedAt: true,
            submittedAt: true,
        },
    })

    async function handleStart() {
        'use server'
        const result = await startAttempt(quizId, courseId)
        if (result.success && result.attemptId) {
            redirect(`/portal/my-courses/${courseId}/quiz/${quizId}?attempt=${result.attemptId}`)
        }
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <Button variant="ghost" size="sm" asChild>
                <Link href={`/portal/my-courses/${courseId}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Kursus
                </Link>
            </Button>

            {/* Quiz info */}
            <div className="rounded-xl border bg-card p-6">
                <h1 className="text-xl font-bold">{quiz.title}</h1>
                {quiz.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{quiz.description}</p>
                )}

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                        <HelpCircle className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
                        <p className="text-lg font-semibold">{quiz.questions.length}</p>
                        <p className="text-xs text-muted-foreground">Soal</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                        <CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
                        <p className="text-lg font-semibold">{quiz.passingScore}%</p>
                        <p className="text-xs text-muted-foreground">Passing Score</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                        <Timer className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
                        <p className="text-lg font-semibold">{quiz.duration ?? '∞'}</p>
                        <p className="text-xs text-muted-foreground">{quiz.duration ? 'Menit' : 'Unlimited'}</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                        <RotateCw className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
                        <p className="text-lg font-semibold">
                            {existingAttempts}/{quiz.maxAttempts}
                        </p>
                        <p className="text-xs text-muted-foreground">Percobaan</p>
                    </div>
                </div>

                <form action={handleStart} className="mt-6">
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={!canStart}
                    >
                        <Play className="mr-2 h-4 w-4" />
                        {canStart ? 'Mulai Quiz' : 'Batas Percobaan Tercapai'}
                    </Button>
                </form>
            </div>

            {/* Previous attempts */}
            {prevAttempts.length > 0 && (
                <div className="rounded-lg border">
                    <div className="border-b px-4 py-3">
                        <h2 className="font-semibold">Riwayat Percobaan</h2>
                    </div>
                    <div className="divide-y">
                        {prevAttempts.map((attempt) => (
                            <Link
                                key={attempt.id}
                                href={`/portal/my-courses/${courseId}/quiz/${quizId}/result/${attempt.id}`}
                                className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-accent"
                            >
                                <div>
                                    <p className="text-sm font-medium">
                                        {new Date(attempt.startedAt).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {attempt.score !== null && (
                                        <span className="text-sm font-semibold">{attempt.score}/100</span>
                                    )}
                                    <Badge
                                        variant={
                                            attempt.passed === true
                                                ? 'default'
                                                : attempt.passed === false
                                                    ? 'destructive'
                                                    : 'secondary'
                                        }
                                    >
                                        {attempt.passed === true
                                            ? 'Lulus'
                                            : attempt.passed === false
                                                ? 'Tidak Lulus'
                                                : 'Menunggu Penilaian'}
                                    </Badge>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
