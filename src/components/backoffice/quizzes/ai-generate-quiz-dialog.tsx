'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import {
    BookOpen,
    AlertCircle,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    Loader2,
    Trash2,
    RotateCcw,
    CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { getModulesWithLessonsForContext, type ModuleWithTextLessons } from '@/lib/actions/modules'
import { generateQuizQuestionsContextAction } from '@/lib/actions/ai'
import type { GeneratedQuestion } from '@/lib/ai'

// ─── Types ────────────────────────────────────────────────────────────────────

type DialogStep = 'source-picker' | 'context-editor' | 'generation-config' | 'review'

const STEP_ORDER: DialogStep[] = ['source-picker', 'context-editor', 'generation-config', 'review']

const STEP_LABELS: Record<DialogStep, string> = {
    'source-picker': 'Pilih Sumber',
    'context-editor': 'Edit Konteks',
    'generation-config': 'Konfigurasi',
    'review': 'Review',
}

const MAX_CONTEXT_CHARS = 8000

// Local editable version of generated question for review step
interface EditableQuestion {
    _localId: string
    type: 'MULTIPLE_CHOICE' | 'ESSAY'
    text: string
    points: number
    explanation?: string
    rubric?: string
    options: Array<{ text: string; isCorrect: boolean }>
}

function toEditable(q: GeneratedQuestion, idx: number): EditableQuestion {
    if (q.type === 'MULTIPLE_CHOICE') {
        return {
            _localId: `q-${idx}-${Date.now()}`,
            type: 'MULTIPLE_CHOICE',
            text: q.text,
            points: q.points ?? 1,
            explanation: q.explanation,
            options: q.options,
        }
    }
    return {
        _localId: `q-${idx}-${Date.now()}`,
        type: 'ESSAY',
        text: q.text,
        points: q.points ?? 5,
        rubric: q.rubric,
        options: [],
    }
}

// ─── Context assembly ─────────────────────────────────────────────────────────

function assembleContext(
    selectedModuleIds: string[],
    selectedLessonIds: string[],
    modules: ModuleWithTextLessons[]
): string {
    const lines: string[] = []
    for (const mod of modules) {
        if (!selectedModuleIds.includes(mod.id)) continue
        lines.push(`## Modul: ${mod.title}`)
        lines.push('')
        const selectedLessons = mod.lessons.filter((l) => selectedLessonIds.includes(l.id))
        for (const lesson of selectedLessons) {
            lines.push(`### Pelajaran: ${lesson.title}`)
            if (lesson.content && lesson.type === 'TEXT') {
                lines.push(lesson.content.trim())
            } else {
                lines.push(`*(Tidak ada konten teks untuk pelajaran ini)*`)
            }
            lines.push('')
        }
    }
    return lines.join('\n')
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface AIGenerateQuizDialogProps {
    quizId: string
    courseId: string
    open: boolean
    onOpenChange: (open: boolean) => void
    onQuestionsConfirmed: (questions: EditableQuestion[]) => Promise<void>
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AIGenerateQuizDialog({
    quizId,
    courseId,
    open,
    onOpenChange,
    onQuestionsConfirmed,
}: AIGenerateQuizDialogProps) {
    // Step state
    const [step, setStep] = useState<DialogStep>('source-picker')

    // Step 1 — Source Picker
    const [modules, setModules] = useState<ModuleWithTextLessons[]>([])
    const [loadingModules, setLoadingModules] = useState(false)
    const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([])
    const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([])

    // Step 2 — Context Editor
    const [context, setContext] = useState('')
    const [originalContext, setOriginalContext] = useState('')

    // Step 3 — Generation Config
    const [count, setCount] = useState(10)
    const [questionTypes, setQuestionTypes] = useState<Array<'MULTIPLE_CHOICE' | 'ESSAY'>>(['MULTIPLE_CHOICE'])
    const [isGenerating, setIsGenerating] = useState(false)

    // Step 4 — Review
    const [editableQuestions, setEditableQuestions] = useState<EditableQuestion[]>([])
    const [isSaving, setIsSaving] = useState(false)

    // ─── Load modules on open ───────────────────────────────────────────────

    useEffect(() => {
        if (!open) return
        setStep('source-picker')
        setSelectedModuleIds([])
        setSelectedLessonIds([])
        setContext('')
        setOriginalContext('')
        setEditableQuestions([])

        setLoadingModules(true)
        getModulesWithLessonsForContext(courseId)
            .then((res) => {
                if (res.success) {
                    setModules(res.data)
                } else {
                    toast.error(res.error ?? 'Gagal memuat modul.')
                }
            })
            .finally(() => setLoadingModules(false))
    }, [open, courseId])

    // ─── Step 1 helpers ─────────────────────────────────────────────────────

    const allLessonsInModule = useCallback(
        (moduleId: string) => modules.find((m) => m.id === moduleId)?.lessons ?? [],
        [modules]
    )

    const isModuleFullySelected = (moduleId: string) => {
        const lessons = allLessonsInModule(moduleId)
        return lessons.length > 0 && lessons.every((l) => selectedLessonIds.includes(l.id))
    }

    const isModulePartiallySelected = (moduleId: string) => {
        const lessons = allLessonsInModule(moduleId)
        return lessons.some((l) => selectedLessonIds.includes(l.id)) && !isModuleFullySelected(moduleId)
    }

    const toggleModule = (moduleId: string) => {
        const lessons = allLessonsInModule(moduleId)
        const lessonIds = lessons.map((l) => l.id)
        const fullySelected = isModuleFullySelected(moduleId)

        if (fullySelected) {
            setSelectedLessonIds((prev) => prev.filter((id) => !lessonIds.includes(id)))
            setSelectedModuleIds((prev) => prev.filter((id) => id !== moduleId))
        } else {
            setSelectedLessonIds((prev) => [...new Set([...prev, ...lessonIds])])
            setSelectedModuleIds((prev) => [...new Set([...prev, moduleId])])
        }
    }

    const toggleLesson = (moduleId: string, lessonId: string) => {
        const isSelected = selectedLessonIds.includes(lessonId)
        const newLessonIds = isSelected
            ? selectedLessonIds.filter((id) => id !== lessonId)
            : [...selectedLessonIds, lessonId]

        setSelectedLessonIds(newLessonIds)

        // Update module selection state
        const lessons = allLessonsInModule(moduleId)
        const anySelected = lessons.some((l) => newLessonIds.includes(l.id))
        if (anySelected) {
            setSelectedModuleIds((prev) => [...new Set([...prev, moduleId])])
        } else {
            setSelectedModuleIds((prev) => prev.filter((id) => id !== moduleId))
        }
    }

    const totalSelectedLessons = selectedLessonIds.length
    const totalSelectedModules = selectedModuleIds.length

    // ─── Step navigation ─────────────────────────────────────────────────────

    const goToContextEditor = () => {
        const assembled = assembleContext(selectedModuleIds, selectedLessonIds, modules)
        setContext(assembled)
        setOriginalContext(assembled)
        setStep('context-editor')
    }

    const resetContext = () => setContext(originalContext)

    // ─── Step 3: Generate ────────────────────────────────────────────────────

    const handleGenerate = async () => {
        setIsGenerating(true)
        try {
            const res = await generateQuizQuestionsContextAction({
                quizId,
                editedContext: context,
                count,
                questionTypes,
            })
            if (res.success && res.data) {
                setEditableQuestions(res.data.map((q, i) => toEditable(q, i)))
                setStep('review')
            } else {
                toast.error(res.error ?? 'Gagal generate soal.')
            }
        } catch (err: any) {
            toast.error(err.message ?? 'Terjadi kesalahan.')
        } finally {
            setIsGenerating(false)
        }
    }

    // ─── Step 4: Review helpers ───────────────────────────────────────────────

    const updateQuestion = (localId: string, patch: Partial<EditableQuestion>) => {
        setEditableQuestions((prev) =>
            prev.map((q) => (q._localId === localId ? { ...q, ...patch } : q))
        )
    }

    const updateOption = (localId: string, optIdx: number, text: string) => {
        setEditableQuestions((prev) =>
            prev.map((q) => {
                if (q._localId !== localId) return q
                const newOpts = q.options.map((o, i) => (i === optIdx ? { ...o, text } : o))
                return { ...q, options: newOpts }
            })
        )
    }

    const setCorrectOption = (localId: string, optIdx: number) => {
        setEditableQuestions((prev) =>
            prev.map((q) => {
                if (q._localId !== localId) return q
                const newOpts = q.options.map((o, i) => ({ ...o, isCorrect: i === optIdx }))
                return { ...q, options: newOpts }
            })
        )
    }

    const addOption = (localId: string) => {
        setEditableQuestions((prev) =>
            prev.map((q) => {
                if (q._localId !== localId || q.options.length >= 5) return q
                return { ...q, options: [...q.options, { text: '', isCorrect: false }] }
            })
        )
    }

    const removeOption = (localId: string, optIdx: number) => {
        setEditableQuestions((prev) =>
            prev.map((q) => {
                if (q._localId !== localId || q.options.length <= 2) return q
                const newOpts = q.options.filter((_, i) => i !== optIdx)
                // Ensure at least 1 correct
                if (!newOpts.some((o) => o.isCorrect) && newOpts.length > 0) {
                    newOpts[0].isCorrect = true
                }
                return { ...q, options: newOpts }
            })
        )
    }

    const removeQuestion = (localId: string) => {
        setEditableQuestions((prev) => prev.filter((q) => q._localId !== localId))
    }

    const handleConfirm = async () => {
        if (editableQuestions.length === 0) return
        setIsSaving(true)
        try {
            await onQuestionsConfirmed(editableQuestions)
            onOpenChange(false)
        } catch (err: any) {
            toast.error(err.message ?? 'Gagal menyimpan soal.')
        } finally {
            setIsSaving(false)
        }
    }

    // ─── Step Indicator ───────────────────────────────────────────────────────

    const currentStepIndex = STEP_ORDER.indexOf(step)

    // ─── Render ───────────────────────────────────────────────────────────────

    const isWideStep = step === 'review'

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={`flex flex-col gap-0 p-0 ${isWideStep ? 'sm:max-w-3xl' : 'sm:max-w-2xl'} max-h-[90vh]`}
            >
                <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Generate Soal dengan AI
                    </DialogTitle>

                    {/* Step Progress Indicator */}
                    <div className="flex items-center gap-1 mt-3">
                        {STEP_ORDER.map((s, idx) => (
                            <div key={s} className="flex items-center gap-1 flex-1">
                                <div className="flex items-center gap-1.5 flex-1">
                                    <div
                                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${idx < currentStepIndex
                                            ? 'bg-primary text-primary-foreground'
                                            : idx === currentStepIndex
                                                ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                                                : 'bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        {idx < currentStepIndex ? (
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                        ) : (
                                            idx + 1
                                        )}
                                    </div>
                                    <span
                                        className={`text-xs hidden sm:block font-medium ${idx === currentStepIndex ? 'text-foreground' : 'text-muted-foreground'
                                            }`}
                                    >
                                        {STEP_LABELS[s]}
                                    </span>
                                </div>
                                {idx < STEP_ORDER.length - 1 && (
                                    <div className={`h-px flex-1 mx-1 ${idx < currentStepIndex ? 'bg-primary' : 'bg-border'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </DialogHeader>

                {/* ── STEP 1: Source Picker ────────────────────────────────── */}
                {step === 'source-picker' && (
                    <>
                        <div className="px-6 py-4 flex-1 overflow-y-auto">
                            <p className="text-sm text-muted-foreground mb-4">
                                Pilih modul dan pelajaran yang akan dijadikan sumber konteks soal quiz.
                            </p>

                            {loadingModules && (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="rounded-lg border p-3 space-y-2">
                                            <Skeleton className="h-4 w-2/3" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!loadingModules && modules.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-10 text-center gap-3 text-muted-foreground">
                                    <BookOpen className="h-10 w-10 text-muted-foreground/40" />
                                    <p className="text-sm">
                                        Kursus ini belum memiliki modul. Tambahkan modul dan pelajaran terlebih dahulu.
                                    </p>
                                </div>
                            )}

                            {!loadingModules && modules.length > 0 && (
                                <Accordion type="multiple" className="space-y-2">
                                    {modules.map((mod) => {
                                        const fullySelected = isModuleFullySelected(mod.id)
                                        const partial = isModulePartiallySelected(mod.id)
                                        return (
                                            <AccordionItem
                                                key={mod.id}
                                                value={mod.id}
                                                className="border rounded-lg px-3 overflow-hidden"
                                            >
                                                <div className="flex items-center gap-3 py-2">
                                                    <Checkbox
                                                        checked={fullySelected}
                                                        data-state={partial ? 'indeterminate' : undefined}
                                                        className={partial ? 'opacity-70' : ''}
                                                        onCheckedChange={() => toggleModule(mod.id)}
                                                    />
                                                    <AccordionTrigger className="py-0 hover:no-underline flex-1 text-sm font-medium">
                                                        {mod.title}
                                                        <Badge variant="secondary" className="ml-2 text-xs font-normal">
                                                            {mod.lessons.length} pelajaran
                                                        </Badge>
                                                    </AccordionTrigger>
                                                </div>
                                                <AccordionContent className="pb-3">
                                                    <div className="pl-7 space-y-2">
                                                        {mod.lessons.length === 0 && (
                                                            <p className="text-xs text-muted-foreground">Belum ada pelajaran.</p>
                                                        )}
                                                        {mod.lessons.map((lesson) => {
                                                            const isNoContent = lesson.type !== 'TEXT'
                                                            return (
                                                                <div key={lesson.id} className="flex items-center gap-3">
                                                                    <Checkbox
                                                                        checked={selectedLessonIds.includes(lesson.id)}
                                                                        onCheckedChange={() => toggleLesson(mod.id, lesson.id)}
                                                                    />
                                                                    <span className="text-sm flex-1">{lesson.title}</span>
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Badge
                                                                                    variant={isNoContent ? 'outline' : 'secondary'}
                                                                                    className="text-xs shrink-0"
                                                                                >
                                                                                    {lesson.type === 'TEXT' ? 'Teks' : lesson.type === 'VIDEO' ? 'Video' : 'Dok'}
                                                                                </Badge>
                                                                            </TooltipTrigger>
                                                                            {isNoContent && (
                                                                                <TooltipContent>
                                                                                    Hanya judul pelajaran yang digunakan sebagai konteks (tidak ada konten teks)
                                                                                </TooltipContent>
                                                                            )}
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        )
                                    })}
                                </Accordion>
                            )}
                        </div>

                        <div className="flex items-center justify-between px-6 py-4 border-t shrink-0">
                            <p className="text-xs text-muted-foreground">
                                {totalSelectedLessons > 0
                                    ? `Dipilih: ${totalSelectedModules} modul, ${totalSelectedLessons} pelajaran`
                                    : 'Belum ada yang dipilih'}
                            </p>
                            <Button
                                onClick={goToContextEditor}
                                disabled={totalSelectedLessons === 0}
                                size="sm"
                            >
                                Lanjut <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    </>
                )}

                {/* ── STEP 2: Context Editor ───────────────────────────────── */}
                {step === 'context-editor' && (
                    <>
                        <div className="px-6 py-4 flex-1 overflow-y-auto flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Tinjau dan edit konteks materi sebelum dikirim ke AI. Hapus bagian yang tidak relevan.
                                </p>
                                <Badge variant="secondary" className="shrink-0 text-xs">
                                    {totalSelectedModules} modul · {totalSelectedLessons} pelajaran
                                </Badge>
                            </div>

                            {context.length === 0 && selectedLessonIds.every(id => {
                                const lesson = modules.flatMap(m => m.lessons).find(l => l.id === id)
                                return lesson?.type !== 'TEXT'
                            }) && (
                                    <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-3">
                                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                        <p className="text-xs text-amber-700 dark:text-amber-300">
                                            Pelajaran yang dipilih tidak memiliki konten teks. Soal akan dibuat berdasarkan judul pelajaran saja.
                                        </p>
                                    </div>
                                )}

                            <Textarea
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                className="min-h-[300px] font-mono text-xs resize-y"
                                placeholder="Konteks materi akan muncul di sini..."
                            />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs ${context.length > MAX_CONTEXT_CHARS ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                                        {context.length.toLocaleString('id')} karakter
                                        {context.length > MAX_CONTEXT_CHARS && ' — Terlalu panjang!'}
                                    </span>
                                    {context.length > MAX_CONTEXT_CHARS && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-xs">
                                                    Konteks terlalu panjang. Pertimbangkan menghapus bagian yang kurang relevan agar hasil generate lebih akurat (disarankan di bawah 8.000 karakter).
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={resetContext}
                                    className="text-xs h-7"
                                >
                                    <RotateCcw className="mr-1 h-3 w-3" />
                                    Reset ke Asli
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-6 py-4 border-t shrink-0">
                            <Button variant="ghost" size="sm" onClick={() => setStep('source-picker')}>
                                <ChevronLeft className="mr-1 h-4 w-4" /> Kembali
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => setStep('generation-config')}
                                disabled={context.trim().length < 10}
                            >
                                Lanjut <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    </>
                )}

                {/* ── STEP 3: Generation Config ────────────────────────────── */}
                {step === 'generation-config' && (
                    <>
                        <div className="px-6 py-4 flex-1 overflow-y-auto flex flex-col gap-5">
                            <p className="text-sm text-muted-foreground">
                                Tentukan jumlah soal dan tipe soal yang ingin di-generate.
                            </p>

                            {/* Jumlah Soal */}
                            <div className="space-y-2">
                                <Label htmlFor="quiz-count">Jumlah Soal</Label>
                                <Input
                                    id="quiz-count"
                                    type="number"
                                    min={1}
                                    max={30}
                                    value={count}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 1
                                        setCount(Math.min(30, Math.max(1, val)))
                                    }}
                                    className="w-32"
                                />
                                <p className="text-xs text-muted-foreground">Rentang 1–30 soal</p>
                            </div>

                            {/* Tipe Soal */}
                            <div className="space-y-2">
                                <Label>Tipe Soal</Label>
                                <div className="flex flex-wrap gap-3">
                                    {(
                                        [
                                            { value: 'MULTIPLE_CHOICE', label: 'Pilihan Ganda' },
                                            { value: 'ESSAY', label: 'Essay' },
                                        ] as const
                                    ).map(({ value, label }) => {
                                        const active = questionTypes.includes(value)
                                        return (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => {
                                                    if (active && questionTypes.length === 1) return // keep at least 1
                                                    setQuestionTypes((prev) =>
                                                        active ? prev.filter((t) => t !== value) : [...prev, value]
                                                    )
                                                }}
                                                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${active
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-border bg-background text-muted-foreground hover:bg-muted'
                                                    }`}
                                            >
                                                {label}
                                            </button>
                                        )
                                    })}
                                </div>
                                <p className="text-xs text-muted-foreground">Pilih minimal satu tipe soal</p>
                            </div>

                            {/* Preview info */}
                            <div className="rounded-lg bg-muted/50 border px-4 py-3 text-sm text-muted-foreground">
                                AI akan membuat{' '}
                                <span className="font-semibold text-foreground">{count} soal</span> bertipe{' '}
                                <span className="font-semibold text-foreground">
                                    {questionTypes.includes('MULTIPLE_CHOICE') && questionTypes.includes('ESSAY')
                                        ? 'Pilihan Ganda & Essay'
                                        : questionTypes.includes('MULTIPLE_CHOICE')
                                            ? 'Pilihan Ganda'
                                            : 'Essay'}
                                </span>{' '}
                                berdasarkan{' '}
                                <span className="font-semibold text-foreground">
                                    {context.length.toLocaleString('id')} karakter
                                </span>{' '}
                                konteks materi.
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-6 py-4 border-t shrink-0">
                            <Button variant="ghost" size="sm" onClick={() => setStep('context-editor')}>
                                <ChevronLeft className="mr-1 h-4 w-4" /> Kembali
                            </Button>
                            <Button size="sm" onClick={handleGenerate} disabled={isGenerating || questionTypes.length === 0}>
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sedang membuat soal...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" /> Generate Soal
                                    </>
                                )}
                            </Button>
                        </div>
                    </>
                )}

                {/* ── STEP 4: Review ───────────────────────────────────────── */}
                {step === 'review' && (
                    <>
                        <div className="px-6 py-4 flex-1 overflow-y-auto flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Tinjau dan edit soal sebelum ditambahkan ke quiz.
                                </p>
                                <Badge variant="secondary">
                                    {editableQuestions.length} soal
                                </Badge>
                            </div>

                            {editableQuestions.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-3">
                                    <AlertCircle className="h-8 w-8 text-muted-foreground/40" />
                                    <p className="text-sm">Semua soal dihapus. Klik "Generate Ulang" untuk mencoba lagi.</p>
                                </div>
                            )}

                            <div className="space-y-3">
                                {editableQuestions.map((q, qIdx) => (
                                    <div key={q._localId} className="rounded-lg border p-4 space-y-3">
                                        {/* Question header */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-start gap-2 flex-1">
                                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                                                    {qIdx + 1}
                                                </span>
                                                <Badge variant="outline" className="text-xs shrink-0">
                                                    {q.type === 'MULTIPLE_CHOICE' ? 'Pilihan Ganda' : 'Essay'}
                                                </Badge>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
                                                onClick={() => removeQuestion(q._localId)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>

                                        {/* Question text */}
                                        <Textarea
                                            value={q.text}
                                            onChange={(e) => updateQuestion(q._localId, { text: e.target.value })}
                                            className="min-h-[60px] text-sm resize-y"
                                            placeholder="Teks pertanyaan..."
                                        />

                                        {/* MULTIPLE_CHOICE options */}
                                        {q.type === 'MULTIPLE_CHOICE' && (
                                            <div className="space-y-2 pl-1">
                                                <p className="text-xs text-muted-foreground font-medium">Pilihan Jawaban:</p>
                                                {q.options.map((opt, optIdx) => (
                                                    <div key={optIdx} className="flex items-center gap-2">
                                                        <span className="text-xs font-semibold text-muted-foreground w-4 shrink-0">
                                                            {String.fromCharCode(65 + optIdx)}.
                                                        </span>
                                                        <input
                                                            type="radio"
                                                            name={`correct-${q._localId}`}
                                                            checked={opt.isCorrect}
                                                            onChange={() => setCorrectOption(q._localId, optIdx)}
                                                            className="shrink-0 accent-primary"
                                                            title="Tandai sebagai jawaban benar"
                                                        />
                                                        <Input
                                                            value={opt.text}
                                                            onChange={(e) => updateOption(q._localId, optIdx, e.target.value)}
                                                            className="h-7 text-sm flex-1"
                                                            placeholder={`Pilihan ${String.fromCharCode(65 + optIdx)}`}
                                                        />
                                                        {q.options.length > 2 && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 shrink-0 text-muted-foreground"
                                                                onClick={() => removeOption(q._localId, optIdx)}
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                                {q.options.length < 5 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 text-xs text-muted-foreground"
                                                        onClick={() => addOption(q._localId)}
                                                    >
                                                        + Tambah Pilihan
                                                    </Button>
                                                )}
                                                {q.explanation && (
                                                    <div className="rounded bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                                                        <span className="font-medium">Penjelasan: </span>
                                                        {q.explanation}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* ESSAY rubric */}
                                        {q.type === 'ESSAY' && (
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground font-medium">Rubrik Penilaian (opsional):</p>
                                                <Textarea
                                                    value={q.rubric ?? ''}
                                                    onChange={(e) => updateQuestion(q._localId, { rubric: e.target.value })}
                                                    className="min-h-[60px] text-xs resize-y"
                                                    placeholder="Kriteria penilaian jawaban essay..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-6 py-4 border-t shrink-0">
                            <Button variant="ghost" size="sm" onClick={() => setStep('generation-config')}>
                                <ChevronLeft className="mr-1 h-4 w-4" /> Generate Ulang
                            </Button>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                    {editableQuestions.length} soal akan ditambahkan
                                </span>
                                <Button
                                    size="sm"
                                    onClick={handleConfirm}
                                    disabled={editableQuestions.length === 0 || isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="mr-2 h-4 w-4" /> Tambahkan ke Quiz
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
