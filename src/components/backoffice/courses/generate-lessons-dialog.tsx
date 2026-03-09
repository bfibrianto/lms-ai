'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Sparkles, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { generateLessonListAction, generateAndSaveLessonContentAction } from '@/lib/actions/ai'
import { bulkCreateLessons } from '@/lib/actions/lessons'

interface GenerateLessonsDialogProps {
    moduleId: string
    moduleTitle: string
}

type LessonType = 'TEXT' | 'VIDEO' | 'DOCUMENT'

interface LessonItem {
    id: string
    title: string
    type: LessonType
}

const LESSON_TYPE_LABEL: Record<LessonType, string> = {
    TEXT: 'Teks',
    VIDEO: 'Video',
    DOCUMENT: 'Dokumen',
}

const LESSON_TYPE_COLOR: Record<LessonType, string> = {
    TEXT: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    VIDEO: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    DOCUMENT: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
}

let counter = 0
function nextId() {
    return `gen-lesson-${++counter}`
}

type DialogStep = 'prompt' | 'result'

export function GenerateLessonsDialog({
    moduleId,
    moduleTitle,
}: GenerateLessonsDialogProps) {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState<DialogStep>('prompt')
    const [guidelines, setGuidelines] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [lessons, setLessons] = useState<LessonItem[]>([])
    const [generateContent, setGenerateContent] = useState(false)
    const [contentProgress, setContentProgress] = useState<{
        current: number
        total: number
        currentTitle: string
    } | null>(null)

    function reset() {
        setStep('prompt')
        setGuidelines('')
        setLessons([])
        setIsGenerating(false)
        setIsCreating(false)
        setGenerateContent(false)
        setContentProgress(null)
    }

    async function handleGenerate() {
        setIsGenerating(true)
        try {
            const res = await generateLessonListAction(moduleId, guidelines || undefined)
            if (res.success && res.data) {
                setLessons(
                    res.data.map((l) => ({ id: nextId(), title: l.title, type: l.type }))
                )
                setStep('result')
            } else {
                toast.error(res.error || 'Gagal generate pelajaran.')
            }
        } catch (err: any) {
            toast.error(err.message || 'Terjadi kesalahan sistem.')
        } finally {
            setIsGenerating(false)
        }
    }

    function handleRegenerate() {
        setStep('prompt')
        setLessons([])
    }

    function handleEditTitle(id: string, value: string) {
        setLessons((prev) =>
            prev.map((l) => (l.id === id ? { ...l, title: value } : l))
        )
    }

    function handleChangeType(id: string, type: LessonType) {
        setLessons((prev) =>
            prev.map((l) => (l.id === id ? { ...l, type } : l))
        )
    }

    function handleRemove(id: string) {
        setLessons((prev) => prev.filter((l) => l.id !== id))
    }

    async function handleCreate() {
        const validLessons = lessons.filter((l) => l.title.trim().length >= 2)
        if (validLessons.length === 0) {
            toast.error('Tidak ada pelajaran valid untuk dibuat.')
            return
        }

        setIsCreating(true)
        try {
            const result = await bulkCreateLessons(
                moduleId,
                validLessons.map((l) => ({ title: l.title, type: l.type }))
            )
            if (!result.success) {
                toast.error('error' in result ? result.error : 'Gagal membuat pelajaran.')
                setIsCreating(false)
                return
            }

            const createdIds = result.data.ids
            toast.success(`${validLessons.length} pelajaran berhasil dibuat.`)

            if (generateContent) {
                const textLessons = validLessons
                    .map((l, idx) => ({ ...l, dbId: createdIds[idx] }))
                    .filter((l) => l.type === 'TEXT')

                if (textLessons.length > 0) {
                    setContentProgress({ current: 0, total: textLessons.length, currentTitle: textLessons[0].title })

                    for (let i = 0; i < textLessons.length; i++) {
                        setContentProgress({
                            current: i,
                            total: textLessons.length,
                            currentTitle: textLessons[i].title,
                        })

                        const contentRes = await generateAndSaveLessonContentAction(textLessons[i].dbId)
                        if (!contentRes.success) {
                            toast.error(`Gagal generate konten "${textLessons[i].title}": ${contentRes.error}`)
                        }
                    }

                    setContentProgress({
                        current: textLessons.length,
                        total: textLessons.length,
                        currentTitle: '',
                    })
                    toast.success(`Konten berhasil di-generate untuk ${textLessons.length} pelajaran.`)
                }
            }

            setOpen(false)
            reset()
        } catch (err: any) {
            toast.error(err.message || 'Terjadi kesalahan sistem.')
        } finally {
            setIsCreating(false)
        }
    }

    const isProcessing = isCreating || isGenerating

    return (
        <Dialog
            open={open}
            onOpenChange={(o) => {
                if (isProcessing) return
                setOpen(o)
                if (!o) reset()
            }}
        >
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground"
                >
                    <Sparkles className="mr-1.5 h-3 w-3 text-primary" />
                    Generate Pelajaran
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Generate Pelajaran</DialogTitle>
                    <DialogDescription>
                        Modul: <span className="font-medium text-foreground">{moduleTitle}</span>
                    </DialogDescription>
                </DialogHeader>

                {/* Content generation progress */}
                {contentProgress && (
                    <div className="space-y-2 py-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Membuat konten AI...</span>
                            <span>{contentProgress.current} / {contentProgress.total}</span>
                        </div>
                        <Progress value={(contentProgress.current / contentProgress.total) * 100} className="h-2" />
                        {contentProgress.currentTitle && (
                            <p className="text-xs text-muted-foreground truncate">
                                Sedang: {contentProgress.currentTitle}
                            </p>
                        )}
                    </div>
                )}

                {/* STEP 1: Prompt input */}
                {step === 'prompt' && !isGenerating && (
                    <div className="space-y-3 py-2">
                        <div className="space-y-2">
                            <label htmlFor="gen-guidelines" className="text-sm font-medium">
                                Arahan tambahan{' '}
                                <span className="text-muted-foreground font-normal">(opsional)</span>
                            </label>
                            <Textarea
                                id="gen-guidelines"
                                placeholder="Contoh: Fokuskan pada aspek praktis, buat 8 pelajaran, sertakan studi kasus, dll."
                                value={guidelines}
                                onChange={(e) => setGuidelines(e.target.value)}
                                className="min-h-[80px] text-sm"
                                rows={3}
                            />
                            <p className="text-xs text-muted-foreground">
                                Berikan instruksi khusus untuk AI, atau kosongkan untuk generate otomatis berdasarkan judul modul.
                            </p>
                        </div>
                    </div>
                )}

                {/* Loading state */}
                {isGenerating && (
                    <div className="flex flex-col items-center justify-center gap-3 py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">
                            AI sedang membuat daftar pelajaran...
                        </p>
                    </div>
                )}

                {/* STEP 2: Generated results */}
                {step === 'result' && !isGenerating && !contentProgress && lessons.length > 0 && (
                    <>
                        <ScrollArea className="max-h-[300px] pr-2">
                            <div className="space-y-2 py-2">
                                {lessons.map((lesson, idx) => (
                                    <div key={lesson.id} className="flex items-center gap-2">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted text-xs font-medium">
                                            {idx + 1}
                                        </span>
                                        <Input
                                            value={lesson.title}
                                            onChange={(e) =>
                                                handleEditTitle(lesson.id, e.target.value)
                                            }
                                            className="h-8 text-sm flex-1"
                                            disabled={isCreating}
                                        />
                                        <Select
                                            value={lesson.type}
                                            onValueChange={(v) =>
                                                handleChangeType(lesson.id, v as LessonType)
                                            }
                                            disabled={isCreating}
                                        >
                                            <SelectTrigger className="h-8 w-[90px] text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(Object.keys(LESSON_TYPE_LABEL) as LessonType[]).map(
                                                    (type) => (
                                                        <SelectItem key={type} value={type}>
                                                            <Badge
                                                                variant="secondary"
                                                                className={`text-xs ${LESSON_TYPE_COLOR[type]}`}
                                                            >
                                                                {LESSON_TYPE_LABEL[type]}
                                                            </Badge>
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
                                            onClick={() => handleRemove(lesson.id)}
                                            disabled={isCreating}
                                            aria-label="Hapus pelajaran"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Generate content checkbox */}
                        <div className="flex items-start gap-2 rounded-md border p-3 bg-muted/30">
                            <Checkbox
                                id="gen-content"
                                checked={generateContent}
                                onCheckedChange={(checked) =>
                                    setGenerateContent(checked === true)
                                }
                                disabled={isCreating}
                            />
                            <label
                                htmlFor="gen-content"
                                className="text-sm leading-tight cursor-pointer"
                            >
                                <span className="font-medium">Generate konten dengan AI</span>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    AI juga akan membuat konten untuk setiap pelajaran bertipe Teks. Proses ini membutuhkan waktu tambahan.
                                </p>
                            </label>
                        </div>
                    </>
                )}

                {/* Empty state for result step */}
                {step === 'result' && !isGenerating && !contentProgress && lessons.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                        Tidak ada pelajaran yang dihasilkan. Coba lagi.
                    </p>
                )}

                {!contentProgress && (
                    <DialogFooter className="gap-2 sm:gap-0">
                        {step === 'prompt' && !isGenerating && (
                            <Button
                                type="button"
                                onClick={handleGenerate}
                                className="w-full sm:w-auto"
                            >
                                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                                Generate Pelajaran
                            </Button>
                        )}
                        {step === 'result' && !isGenerating && (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleRegenerate}
                                    disabled={isCreating}
                                >
                                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                                    Generate Ulang
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleCreate}
                                    disabled={isCreating || lessons.length === 0}
                                >
                                    {isCreating && (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    )}
                                    Buat {lessons.length} Pelajaran
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}
