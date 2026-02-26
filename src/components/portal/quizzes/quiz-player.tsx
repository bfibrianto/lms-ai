'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Timer,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Loader2,
    AlertTriangle,
} from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { submitAttempt } from '@/lib/actions/quiz-attempts'
import { cn } from '@/lib/utils'

interface QuizQuestion {
    id: string
    type: string
    text: string
    points: number
    order: number
    options: { id: string; text: string }[]
}

interface QuizPlayerProps {
    attemptId: string
    courseId: string
    quiz: {
        id: string
        title: string
        duration: number | null
        questions: QuizQuestion[]
    }
}

export function QuizPlayer({ attemptId, courseId, quiz }: QuizPlayerProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [currentIdx, setCurrentIdx] = useState(0)
    const [answers, setAnswers] = useState<Record<string, { optionId?: string; essayText?: string }>>(
        {}
    )
    const [showConfirm, setShowConfirm] = useState(false)
    const [timeLeft, setTimeLeft] = useState<number | null>(
        quiz.duration ? quiz.duration * 60 : null
    )

    const currentQuestion = quiz.questions[currentIdx]
    const totalQuestions = quiz.questions.length
    const answeredCount = Object.keys(answers).length

    // Countdown timer
    useEffect(() => {
        if (timeLeft === null) return
        if (timeLeft <= 0) {
            handleSubmit()
            return
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev !== null ? prev - 1 : null))
        }, 1000)

        return () => clearInterval(interval)
    }, [timeLeft]) // eslint-disable-line react-hooks/exhaustive-deps

    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }, [])

    function setAnswer(questionId: string, data: { optionId?: string; essayText?: string }) {
        setAnswers((prev) => ({ ...prev, [questionId]: data }))
    }

    function handleSubmit() {
        const answersList = quiz.questions.map((q) => ({
            questionId: q.id,
            optionId: answers[q.id]?.optionId,
            essayText: answers[q.id]?.essayText,
        }))

        startTransition(async () => {
            const result = await submitAttempt(attemptId, answersList)
            if (result.success) {
                toast.success('Quiz berhasil disubmit!')
                router.push(`/portal/my-courses/${courseId}/quiz/${quiz.id}/result/${attemptId}`)
            } else {
                toast.error(result.error ?? 'Gagal menyimpan jawaban')
            }
        })
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
                <div>
                    <h1 className="font-semibold">{quiz.title}</h1>
                    <p className="text-xs text-muted-foreground">
                        Soal {currentIdx + 1} dari {totalQuestions} • {answeredCount}/{totalQuestions} dijawab
                    </p>
                </div>
                {timeLeft !== null && (
                    <div
                        className={cn(
                            'flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-mono font-medium',
                            timeLeft <= 60
                                ? 'bg-destructive/10 text-destructive'
                                : timeLeft <= 300
                                    ? 'bg-yellow-500/10 text-yellow-600'
                                    : 'bg-secondary text-secondary-foreground'
                        )}
                    >
                        <Timer className="h-4 w-4" />
                        {formatTime(timeLeft)}
                    </div>
                )}
            </div>

            {/* Question navigation dots */}
            <div className="flex flex-wrap gap-1.5">
                {quiz.questions.map((q, idx) => {
                    const isAnswered = !!answers[q.id]
                    const isCurrent = idx === currentIdx
                    return (
                        <button
                            key={q.id}
                            onClick={() => setCurrentIdx(idx)}
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors',
                                isCurrent
                                    ? 'bg-primary text-primary-foreground'
                                    : isAnswered
                                        ? 'bg-green-500/20 text-green-700'
                                        : 'bg-secondary text-secondary-foreground hover:bg-accent'
                            )}
                        >
                            {idx + 1}
                        </button>
                    )
                })}
            </div>

            {/* Question */}
            <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                    <Badge variant="secondary">
                        {currentQuestion.type === 'MULTIPLE_CHOICE' ? 'Pilihan Ganda' : 'Essay'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{currentQuestion.points} poin</span>
                </div>

                <p className="mb-6 text-base leading-relaxed">{currentQuestion.text}</p>

                {currentQuestion.type === 'MULTIPLE_CHOICE' ? (
                    <RadioGroup
                        value={answers[currentQuestion.id]?.optionId ?? ''}
                        onValueChange={(value) => setAnswer(currentQuestion.id, { optionId: value })}
                    >
                        <div className="space-y-3">
                            {currentQuestion.options.map((opt, optIdx) => (
                                <div
                                    key={opt.id}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg border p-3 transition-colors',
                                        answers[currentQuestion.id]?.optionId === opt.id
                                            ? 'border-primary bg-primary/5'
                                            : 'hover:bg-accent'
                                    )}
                                >
                                    <RadioGroupItem value={opt.id} id={`q-${currentQuestion.id}-opt-${opt.id}`} />
                                    <Label
                                        htmlFor={`q-${currentQuestion.id}-opt-${opt.id}`}
                                        className="flex-1 cursor-pointer text-sm"
                                    >
                                        <span className="mr-2 font-medium text-muted-foreground">
                                            {String.fromCharCode(65 + optIdx)}.
                                        </span>
                                        {opt.text}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </RadioGroup>
                ) : (
                    <div className="space-y-2">
                        <Label>Jawaban Anda</Label>
                        <Textarea
                            value={answers[currentQuestion.id]?.essayText ?? ''}
                            onChange={(e) =>
                                setAnswer(currentQuestion.id, { essayText: e.target.value })
                            }
                            placeholder="Tulis jawaban essay Anda di sini..."
                            rows={6}
                        />
                    </div>
                )}
            </div>

            {/* Navigation + Submit */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                    disabled={currentIdx === 0}
                >
                    <ChevronLeft className="mr-1 h-4 w-4" /> Sebelumnya
                </Button>

                <div className="flex items-center gap-2">
                    {currentIdx < totalQuestions - 1 ? (
                        <Button onClick={() => setCurrentIdx((p) => p + 1)}>
                            Berikutnya <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setShowConfirm(true)}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                            )}
                            Submit Quiz
                        </Button>
                    )}
                </div>
            </div>

            {/* Submit confirmation */}
            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            Submit Quiz?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {answeredCount < totalQuestions ? (
                                <span className="text-destructive">
                                    Anda baru menjawab {answeredCount} dari {totalQuestions} soal.
                                    Soal yang belum dijawab akan dianggap kosong.
                                </span>
                            ) : (
                                <span>
                                    Anda telah menjawab semua {totalQuestions} soal. Setelah submit, jawaban
                                    tidak dapat diubah.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Kembali</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit} disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Ya, Submit
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
