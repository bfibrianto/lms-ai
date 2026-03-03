'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HelpCircle, Pencil, Clock } from 'lucide-react'
import type { QuizSummary } from '@/types/courses'

interface QuizCardInlineProps {
    quiz: QuizSummary
    courseId: string
    canEdit: boolean
}

export function QuizCardInline({ quiz, courseId, canEdit }: QuizCardInlineProps) {
    return (
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
            <CardContent className="flex items-center gap-3 py-3">
                <HelpCircle className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{quiz.title}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{quiz._count.questions} soal</span>
                        <span>•</span>
                        <span>Passing score: {quiz.passingScore}%</span>
                        {quiz.duration && (
                            <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {quiz.duration} menit
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <Badge variant="outline" className="shrink-0 border-blue-300 text-blue-700 text-xs dark:border-blue-700 dark:text-blue-300">
                    Quiz
                </Badge>

                {canEdit && (
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" asChild>
                        <Link href={`/backoffice/courses/${courseId}#quiz-${quiz.id}`}>
                            <Pencil className="h-3 w-3" />
                        </Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
