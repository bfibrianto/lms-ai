'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle2, Loader2, User, FileText } from 'lucide-react'
import { gradeEssay } from '@/lib/actions/quiz-attempts'
import { SuggestScoreButton } from './suggest-score-button'
import type { EssayToGrade } from '@/types/quizzes'

interface GradingDashboardProps {
    essays: EssayToGrade[]
    quizTitle: string
}

export function GradingDashboard({ essays, quizTitle }: GradingDashboardProps) {
    const [isPending, startTransition] = useTransition()
    const [scores, setScores] = useState<Record<string, number>>({})
    const [feedbacks, setFeedbacks] = useState<Record<string, string>>({})
    const [gradedIds, setGradedIds] = useState<Set<string>>(new Set())

    function handleGrade(answerId: string, maxPoints: number) {
        const score = scores[answerId]
        const feedback = feedbacks[answerId] ?? ''

        if (score === undefined || score < 0 || score > maxPoints) {
            toast.error(`Skor harus antara 0 dan ${maxPoints}`)
            return
        }

        startTransition(async () => {
            const result = await gradeEssay(answerId, score, feedback)
            if (result.success) {
                toast.success('Jawaban berhasil dinilai')
                setGradedIds((prev) => new Set(prev).add(answerId))
            } else {
                toast.error(result.error ?? 'Gagal menyimpan nilai')
            }
        })
    }

    const pendingEssays = essays.filter((e) => !gradedIds.has(e.id))

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {pendingEssays.length} jawaban belum dinilai
                </p>
            </div>

            {pendingEssays.length === 0 && (
                <div className="rounded-lg border border-dashed py-10 text-center">
                    <CheckCircle2 className="mx-auto mb-2 h-10 w-10 text-green-500/40" />
                    <p className="text-sm text-muted-foreground">
                        Semua jawaban essay sudah dinilai!
                    </p>
                </div>
            )}

            {pendingEssays.map((essay) => (
                <div key={essay.id} className="rounded-lg border">
                    {/* Student info */}
                    <div className="flex items-center justify-between border-b px-4 py-2.5">
                        <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{essay.attempt.enrollment.user.name}</span>
                            <span className="text-muted-foreground">
                                {essay.attempt.enrollment.user.email}
                            </span>
                        </div>
                        <Badge variant="secondary">{essay.question.points} poin maks</Badge>
                    </div>

                    {/* Question & answer */}
                    <div className="space-y-3 px-4 py-3">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Pertanyaan:</p>
                            <p className="text-sm">{essay.question.text}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Jawaban:</p>
                            <div className="whitespace-pre-wrap rounded-md bg-secondary/50 p-3 text-sm">
                                {essay.essayText || '(tidak dijawab)'}
                            </div>
                        </div>
                    </div>

                    {/* Grading form */}
                    <div className="border-t bg-accent/30 px-4 py-3">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold">Penilaian</h4>
                                <SuggestScoreButton
                                    questionText={essay.question.text}
                                    studentAnswer={essay.essayText || ''}
                                    maxScore={essay.question.points}
                                    onSuccess={(score, feedback) => {
                                        setScores(prev => ({ ...prev, [essay.id]: score }))
                                        setFeedbacks(prev => ({ ...prev, [essay.id]: "(AI) " + feedback }))
                                    }}
                                />
                            </div>
                            <div className="flex items-end gap-3 flex-wrap sm:flex-nowrap">
                                <div className="w-24 space-y-1">
                                    <Label className="text-xs">Skor</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={essay.question.points}
                                        value={scores[essay.id] ?? ''}
                                        onChange={(e) =>
                                            setScores((prev) => ({
                                                ...prev,
                                                [essay.id]: Number(e.target.value),
                                            }))
                                        }
                                        placeholder={`0-${essay.question.points}`}
                                    />
                                </div>
                                <div className="min-w-0 flex-1 space-y-1">
                                    <Label className="text-xs">Feedback (opsional)</Label>
                                    <Textarea
                                        value={feedbacks[essay.id] ?? ''}
                                        onChange={(e) =>
                                            setFeedbacks((prev) => ({
                                                ...prev,
                                                [essay.id]: e.target.value,
                                            }))
                                        }
                                        placeholder="Komentar untuk peserta..."
                                        rows={1}
                                    />
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => handleGrade(essay.id, essay.question.points)}
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                    ) : (
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                    )}
                                    Simpan
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
