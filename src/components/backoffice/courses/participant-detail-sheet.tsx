'use client'

import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Trophy } from 'lucide-react'
import type { ParticipantDetail } from '@/types/courses'

interface ParticipantDetailSheetProps {
    isOpen: boolean
    onClose: () => void
    detail: ParticipantDetail | null
    isLoading?: boolean
}

export function ParticipantDetailSheet({
    isOpen,
    onClose,
    detail,
    isLoading
}: ParticipantDetailSheetProps) {
    if (!isOpen) return null

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle>Detail Progres Peserta</SheetTitle>
                    <SheetDescription>
                        Riwayat pembelajaran dan hasil kuis
                    </SheetDescription>
                </SheetHeader>

                {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                ) : !detail ? (
                    <div className="flex h-40 items-center justify-center text-muted-foreground">
                        Data tidak ditemukan
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Profil Peserta */}
                        <div>
                            <h3 className="text-lg font-semibold">{detail.user.name}</h3>
                            <p className="text-sm text-muted-foreground">{detail.user.email}</p>
                        </div>

                        {/* Progress Keseluruhan */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span>Penyelesaian Materi</span>
                                <span>{detail.progressPercentage}%</span>
                            </div>
                            <Progress value={detail.progressPercentage} className="h-2" />
                        </div>

                        {/* Riwayat Kuis */}
                        <div>
                            <h4 className="mb-4 text-sm font-semibold flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-primary" />
                                Daftar Assessment
                            </h4>

                            {detail.quizzes.length === 0 ? (
                                <div className="text-sm text-muted-foreground rounded-md border p-4 text-center">
                                    Kursus ini tidak memiliki kuis.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {detail.quizzes.map((quiz) => (
                                        <div key={quiz.quizId} className="flex flex-col gap-2 rounded-lg border p-3">
                                            <div className="flex items-start justify-between">
                                                <span className="text-sm font-medium">{quiz.title}</span>
                                                {quiz.passed ? (
                                                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">Lulus</Badge>
                                                ) : quiz.attempts > 0 ? (
                                                    <Badge variant="destructive">Gagal</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Belum Dikerjakan</Badge>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-1">
                                                <div className="flex items-center gap-1">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    <span>Skor Terbaik: {quiz.attempts > 0 ? quiz.score : '-'}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <XCircle className="h-3 w-3" />
                                                    <span>Percobaan: {quiz.attempts}x</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
