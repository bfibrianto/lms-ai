'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'
import { createQuiz, updateQuiz } from '@/lib/actions/quizzes'

interface QuizSettingsFormProps {
    courseId: string
    quiz?: {
        id: string
        title: string
        description: string | null
        passingScore: number
        duration: number | null
        maxAttempts: number
        shuffleQuestions: boolean
        showResult: boolean
    }
    onSuccess?: () => void
    onCancel?: () => void
}

export function QuizSettingsForm({
    courseId,
    quiz,
    onSuccess,
    onCancel,
}: QuizSettingsFormProps) {
    const [isPending, startTransition] = useTransition()
    const [shuffleQuestions, setShuffleQuestions] = useState(quiz?.shuffleQuestions ?? false)
    const [showResult, setShowResult] = useState(quiz?.showResult ?? true)

    function handleSubmit(formData: FormData) {
        formData.set('shuffleQuestions', String(shuffleQuestions))
        formData.set('showResult', String(showResult))

        startTransition(async () => {
            const result = quiz
                ? await updateQuiz(quiz.id, formData)
                : await createQuiz(courseId, formData)

            if (result.success) {
                toast.success(quiz ? 'Quiz berhasil diperbarui' : 'Quiz berhasil dibuat')
                onSuccess?.()
            } else {
                toast.error(result.error ?? 'Gagal menyimpan quiz')
            }
        })
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Judul Quiz *</Label>
                <Input
                    id="title"
                    name="title"
                    defaultValue={quiz?.title ?? ''}
                    placeholder="Contoh: Quiz Modul 1"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                    id="description"
                    name="description"
                    defaultValue={quiz?.description ?? ''}
                    placeholder="Deskripsi quiz (opsional)"
                    rows={2}
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="passingScore">Passing Score (%)</Label>
                    <Input
                        id="passingScore"
                        name="passingScore"
                        type="number"
                        min={0}
                        max={100}
                        defaultValue={quiz?.passingScore ?? 70}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="duration">Durasi (menit)</Label>
                    <Input
                        id="duration"
                        name="duration"
                        type="number"
                        min={1}
                        max={600}
                        defaultValue={quiz?.duration ?? ''}
                        placeholder="Kosong = unlimited"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="maxAttempts">Maks Percobaan</Label>
                    <Input
                        id="maxAttempts"
                        name="maxAttempts"
                        type="number"
                        min={1}
                        max={10}
                        defaultValue={quiz?.maxAttempts ?? 1}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                    <p className="text-sm font-medium">Acak Soal</p>
                    <p className="text-xs text-muted-foreground">Urutan soal diacak tiap percobaan</p>
                </div>
                <Switch checked={shuffleQuestions} onCheckedChange={setShuffleQuestions} />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                    <p className="text-sm font-medium">Tampilkan Hasil</p>
                    <p className="text-xs text-muted-foreground">Nilai langsung ditampilkan setelah submit</p>
                </div>
                <Switch checked={showResult} onCheckedChange={setShowResult} />
            </div>

            <div className="flex justify-end gap-2 pt-2">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Batal
                    </Button>
                )}
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {quiz ? 'Simpan Perubahan' : 'Buat Quiz'}
                </Button>
            </div>
        </form>
    )
}
