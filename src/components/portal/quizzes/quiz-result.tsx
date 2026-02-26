'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    CheckCircle2,
    XCircle,
    Clock,
    ArrowLeft,
    Trophy,
    AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { QuizAttemptResult } from '@/types/quizzes'

interface QuizResultProps {
    result: QuizAttemptResult
    courseId: string
}

export function QuizResult({ result, courseId }: QuizResultProps) {
    const isPassed = result.passed === true
    const isGraded = result.score !== null
    const showAnswers = result.quiz.showResult

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            {/* Score card */}
            <div
                className={cn(
                    'rounded-xl border-2 p-8 text-center',
                    !isGraded
                        ? 'border-yellow-300 bg-yellow-50'
                        : isPassed
                            ? 'border-green-300 bg-green-50'
                            : 'border-red-300 bg-red-50'
                )}
            >
                <div className="mb-4">
                    {!isGraded ? (
                        <Clock className="mx-auto h-16 w-16 text-yellow-500" />
                    ) : isPassed ? (
                        <Trophy className="mx-auto h-16 w-16 text-green-500" />
                    ) : (
                        <XCircle className="mx-auto h-16 w-16 text-red-500" />
                    )}
                </div>

                <h1 className="text-2xl font-bold">
                    {!isGraded
                        ? 'Menunggu Penilaian'
                        : isPassed
                            ? 'Selamat, Anda Lulus!'
                            : 'Belum Lulus'}
                </h1>

                {isGraded ? (
                    <p className="mt-2 text-5xl text-primary font-bold">
                        {result.score}
                        <span className="text-lg text-muted-foreground">/100</span>
                    </p>
                ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                        Jawaban essay Anda sedang dinilai oleh instruktur
                    </p>
                )}

                <p className="mt-2 text-sm text-muted-foreground">
                    Passing score: {result.quiz.passingScore}%
                </p>

                {result.startedAt && result.submittedAt && (
                    <p className="mt-1 text-xs text-muted-foreground">
                        Durasi: {Math.round(
                            (new Date(result.submittedAt).getTime() - new Date(result.startedAt).getTime()) /
                            60000
                        )}{' '}
                        menit
                    </p>
                )}
            </div>

            {/* Answers review */}
            {showAnswers && (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Review Jawaban</h2>
                    {result.answers.map((answer, idx) => {
                        const isCorrect = answer.score !== null && answer.score > 0
                        const isMCQ = answer.question.type === 'MULTIPLE_CHOICE'
                        const isPendingGrade = answer.score === null

                        return (
                            <div key={answer.id} className="rounded-lg border">
                                <div className="flex items-start justify-between px-4 py-3">
                                    <div className="flex items-start gap-3">
                                        <span
                                            className={cn(
                                                'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                                                isPendingGrade
                                                    ? 'bg-yellow-100 text-yellow-600'
                                                    : isCorrect
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-red-100 text-red-600'
                                            )}
                                        >
                                            {idx + 1}
                                        </span>
                                        <div className="space-y-1">
                                            <p className="text-sm">{answer.question.text}</p>
                                            <Badge variant="secondary" className="text-xs">
                                                {isMCQ ? 'Pilihan Ganda' : 'Essay'} • {answer.question.points} poin
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="ml-2 shrink-0">
                                        {isPendingGrade ? (
                                            <Badge variant="outline" className="gap-1 border-yellow-400 text-yellow-600">
                                                <AlertCircle className="h-3 w-3" /> Belum dinilai
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    'gap-1',
                                                    isCorrect
                                                        ? 'border-green-400 text-green-600'
                                                        : 'border-red-400 text-red-600'
                                                )}
                                            >
                                                {isCorrect ? (
                                                    <CheckCircle2 className="h-3 w-3" />
                                                ) : (
                                                    <XCircle className="h-3 w-3" />
                                                )}
                                                {answer.score ?? 0}/{answer.question.points}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Show answer detail */}
                                <div className="border-t px-4 py-3">
                                    {isMCQ ? (
                                        <div className="space-y-1.5">
                                            {answer.question.options.map((opt) => {
                                                const isSelected = opt.id === answer.optionId
                                                const isCorrectOption = opt.isCorrect
                                                return (
                                                    <div
                                                        key={opt.id}
                                                        className={cn(
                                                            'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm',
                                                            isCorrectOption && 'bg-green-50 font-medium text-green-700',
                                                            isSelected && !isCorrectOption && 'bg-red-50 text-red-700'
                                                        )}
                                                    >
                                                        {isCorrectOption ? (
                                                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                                        ) : isSelected ? (
                                                            <XCircle className="h-3.5 w-3.5 text-red-500" />
                                                        ) : (
                                                            <div className="h-3.5 w-3.5" />
                                                        )}
                                                        <span>{opt.text}</span>
                                                        {isSelected && <Badge variant="secondary" className="ml-auto text-xs">Jawaban Anda</Badge>}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <p className="text-xs font-medium text-muted-foreground">Jawaban Anda:</p>
                                            <p className="whitespace-pre-wrap rounded-md bg-secondary/50 p-3 text-sm">
                                                {answer.essayText || '(tidak dijawab)'}
                                            </p>
                                            {answer.feedback && (
                                                <div className="rounded-md border-l-4 border-primary bg-primary/5 p-3">
                                                    <p className="text-xs font-medium text-primary">Feedback:</p>
                                                    <p className="text-sm">{answer.feedback}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Back button */}
            <div className="flex justify-center pt-4">
                <Button variant="outline" asChild>
                    <Link href={`/portal/my-courses/${courseId}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Kursus
                    </Link>
                </Button>
            </div>
        </div>
    )
}
