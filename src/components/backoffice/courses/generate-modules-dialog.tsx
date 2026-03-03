'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Sparkles, Loader2, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { generateModuleListAction } from '@/lib/actions/ai'
import { bulkCreateModules } from '@/lib/actions/modules'

interface GenerateModulesDialogProps {
    courseId: string
    courseTitle: string
    courseDescription: string
}

type Step = 'input' | 'review'

interface ModuleItem {
    id: string
    title: string
}

let counter = 0
function nextId() {
    return `gen-${++counter}`
}

export function GenerateModulesDialog({
    courseId,
    courseTitle,
    courseDescription,
}: GenerateModulesDialogProps) {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState<Step>('input')
    const [guidelines, setGuidelines] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [modules, setModules] = useState<ModuleItem[]>([])

    function reset() {
        setStep('input')
        setGuidelines('')
        setModules([])
        setIsGenerating(false)
        setIsCreating(false)
    }

    async function handleGenerate() {
        setIsGenerating(true)
        try {
            const res = await generateModuleListAction(
                courseId,
                guidelines.trim() || undefined
            )
            if (res.success && res.data) {
                setModules(res.data.map((m) => ({ id: nextId(), title: m.title })))
                setStep('review')
            } else {
                toast.error(res.error || 'Gagal generate modul.')
            }
        } catch (err: any) {
            toast.error(err.message || 'Terjadi kesalahan sistem.')
        } finally {
            setIsGenerating(false)
        }
    }

    function handleEditTitle(id: string, value: string) {
        setModules((prev) =>
            prev.map((m) => (m.id === id ? { ...m, title: value } : m))
        )
    }

    function handleRemove(id: string) {
        setModules((prev) => prev.filter((m) => m.id !== id))
    }

    function handleReorder(idx: number, direction: 'up' | 'down') {
        setModules((prev) => {
            const next = [...prev]
            const swapIdx = direction === 'up' ? idx - 1 : idx + 1
            if (swapIdx < 0 || swapIdx >= next.length) return prev
                ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
            return next
        })
    }

    async function handleCreate() {
        const validModules = modules.filter((m) => m.title.trim().length >= 2)
        if (validModules.length === 0) {
            toast.error('Tidak ada modul valid untuk dibuat.')
            return
        }

        setIsCreating(true)
        try {
            const result = await bulkCreateModules(
                courseId,
                validModules.map((m) => m.title)
            )
            if (result.success) {
                toast.success(`${validModules.length} modul berhasil dibuat.`)
                setOpen(false)
                reset()
            } else {
                toast.error(result.error || 'Gagal membuat modul.')
            }
        } catch (err: any) {
            toast.error(err.message || 'Terjadi kesalahan sistem.')
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(o) => {
                setOpen(o)
                if (!o) reset()
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-dashed">
                    <Sparkles className="mr-2 h-4 w-4 text-primary" />
                    Generate Modul dengan AI
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                {step === 'input' ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Generate Modul dengan AI</DialogTitle>
                            <DialogDescription>
                                AI akan membuat daftar modul berdasarkan judul dan deskripsi
                                kursus. Anda dapat menambahkan arahan untuk menyesuaikan hasil.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Kursus</p>
                                <p className="text-sm text-muted-foreground rounded-md border px-3 py-2">
                                    {courseTitle}
                                </p>
                            </div>
                            {courseDescription && (
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Deskripsi</p>
                                    <p className="text-sm text-muted-foreground rounded-md border px-3 py-2 line-clamp-3">
                                        {courseDescription}
                                    </p>
                                </div>
                            )}
                            <div className="space-y-1">
                                <label htmlFor="gen-guidelines" className="text-sm font-medium">
                                    Arahan Tambahan{' '}
                                    <span className="text-muted-foreground font-normal">
                                        (opsional)
                                    </span>
                                </label>
                                <Textarea
                                    id="gen-guidelines"
                                    placeholder="Contoh: Buat 5 modul, fokus pada praktik langsung..."
                                    value={guidelines}
                                    onChange={(e) => setGuidelines(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={isGenerating}
                            >
                                Batal
                            </Button>
                            <Button
                                type="button"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                            >
                                {isGenerating && (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                )}
                                Generate
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Review Modul</DialogTitle>
                            <DialogDescription>
                                Edit, hapus, atau atur ulang urutan modul sebelum membuat.
                            </DialogDescription>
                        </DialogHeader>

                        <ScrollArea className="max-h-[360px] pr-2">
                            <div className="space-y-2 py-2">
                                {modules.map((mod, idx) => (
                                    <div
                                        key={mod.id}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium">
                                            {idx + 1}
                                        </span>
                                        <Input
                                            value={mod.title}
                                            onChange={(e) =>
                                                handleEditTitle(mod.id, e.target.value)
                                            }
                                            className="h-8 text-sm"
                                        />
                                        <div className="flex shrink-0 items-center gap-0.5">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                disabled={idx === 0}
                                                onClick={() => handleReorder(idx, 'up')}
                                                aria-label="Pindah ke atas"
                                            >
                                                <ChevronUp className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                disabled={idx === modules.length - 1}
                                                onClick={() => handleReorder(idx, 'down')}
                                                aria-label="Pindah ke bawah"
                                            >
                                                <ChevronDown className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-destructive hover:text-destructive"
                                                onClick={() => handleRemove(mod.id)}
                                                aria-label="Hapus modul"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {modules.length === 0 && (
                                    <p className="py-4 text-center text-sm text-muted-foreground">
                                        Semua modul telah dihapus.
                                    </p>
                                )}
                            </div>
                        </ScrollArea>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep('input')}
                                disabled={isCreating}
                            >
                                Coba Lagi
                            </Button>
                            <Button
                                type="button"
                                onClick={handleCreate}
                                disabled={isCreating || modules.length === 0}
                            >
                                {isCreating && (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                )}
                                Buat {modules.length} Modul
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
