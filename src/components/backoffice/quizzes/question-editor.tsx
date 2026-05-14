'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { addQuestion, updateQuestion } from '@/lib/actions/quizzes'

interface Option {
    text: string
    isCorrect: boolean
}

interface QuestionEditorProps {
    quizId: string
    question?: {
        id: string
        type: string
        text: string
        points: number
        options: { text: string; isCorrect: boolean }[]
        allowedFileTypes?: string
        maxFileSizeMB?: number
        maxFileCount?: number
        uploadInstructions?: string
    }
    onSuccess?: () => void
    onCancel?: () => void
}

const FILE_TYPE_OPTIONS = [
    { value: 'pdf', label: 'PDF' },
    { value: 'docx', label: 'DOCX' },
    { value: 'doc', label: 'DOC' },
    { value: 'jpg', label: 'JPG' },
    { value: 'jpeg', label: 'JPEG' },
    { value: 'png', label: 'PNG' },
    { value: 'mp4', label: 'MP4' },
    { value: 'zip', label: 'ZIP' },
    { value: 'rar', label: 'RAR' },
]

export function QuestionEditor({
    quizId,
    question,
    onSuccess,
    onCancel,
}: QuestionEditorProps) {
    const [isPending, startTransition] = useTransition()
    const [type, setType] = useState(question?.type ?? 'MULTIPLE_CHOICE')
    const [text, setText] = useState(question?.text ?? '')
    const [points, setPoints] = useState(question?.points ?? 1)
    const [options, setOptions] = useState<Option[]>(
        question?.options ?? [
            { text: '', isCorrect: true },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
        ]
    )
    
    // FILE_UPLOAD specific states
    const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>(
        question?.allowedFileTypes ? JSON.parse(question.allowedFileTypes) : ['pdf', 'docx', 'jpg', 'png']
    )
    const [maxFileSizeMB, setMaxFileSizeMB] = useState(question?.maxFileSizeMB ?? 10)
    const [maxFileCount, setMaxFileCount] = useState(question?.maxFileCount ?? 1)
    const [uploadInstructions, setUploadInstructions] = useState(question?.uploadInstructions ?? '')

    const correctIndex = options.findIndex((o) => o.isCorrect)
    
    function toggleFileType(fileType: string) {
        setAllowedFileTypes((prev) =>
            prev.includes(fileType)
                ? prev.filter((t) => t !== fileType)
                : [...prev, fileType]
        )
    }

    function addOption() {
        setOptions((prev) => [...prev, { text: '', isCorrect: false }])
    }

    function removeOption(idx: number) {
        setOptions((prev) => {
            const next = prev.filter((_, i) => i !== idx)
            // Ensure at least one correct
            if (!next.some((o) => o.isCorrect) && next.length > 0) {
                next[0].isCorrect = true
            }
            return next
        })
    }

    function updateOptionText(idx: number, value: string) {
        setOptions((prev) => prev.map((o, i) => (i === idx ? { ...o, text: value } : o)))
    }

    function setCorrectOption(idx: number) {
        setOptions((prev) =>
            prev.map((o, i) => ({ ...o, isCorrect: i === idx }))
        )
    }

    function handleSubmit() {
        if (text.trim().length < 3) {
            toast.error('Teks soal minimal 3 karakter')
            return
        }

        if (type === 'MULTIPLE_CHOICE') {
            const filledOptions = options.filter((o) => o.text.trim())
            if (filledOptions.length < 2) {
                toast.error('Minimal 2 opsi jawaban')
                return
            }
            if (!filledOptions.some((o) => o.isCorrect)) {
                toast.error('Pilih satu jawaban benar')
                return
            }
        }

        if (type === 'FILE_UPLOAD') {
            if (allowedFileTypes.length === 0) {
                toast.error('Pilih minimal 1 tipe file yang diperbolehkan')
                return
            }
            if (maxFileSizeMB < 1 || maxFileSizeMB > 50) {
                toast.error('Ukuran file harus antara 1-50 MB')
                return
            }
            if (maxFileCount < 1 || maxFileCount > 10) {
                toast.error('Jumlah file harus antara 1-10')
                return
            }
        }

        const data: any = {
            type,
            text: text.trim(),
            points,
        }

        if (type === 'MULTIPLE_CHOICE') {
            data.options = options.filter((o) => o.text.trim())
        } else if (type === 'FILE_UPLOAD') {
            data.allowedFileTypes = JSON.stringify(allowedFileTypes)
            data.maxFileSizeMB = maxFileSizeMB
            data.maxFileCount = maxFileCount
            data.uploadInstructions = uploadInstructions.trim() || null
        }

        startTransition(async () => {
            const result = question
                ? await updateQuestion(question.id, data)
                : await addQuestion(quizId, data)

            if (result.success) {
                toast.success(question ? 'Soal diperbarui' : 'Soal ditambahkan')
                onSuccess?.()
            } else {
                toast.error(result.error ?? 'Gagal menyimpan soal')
            }
        })
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Tipe Soal</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="MULTIPLE_CHOICE">Pilihan Ganda</SelectItem>
                            <SelectItem value="ESSAY">Essay</SelectItem>
                            <SelectItem value="FILE_UPLOAD">File Upload</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="points">Poin</Label>
                    <Input
                        id="points"
                        type="number"
                        min={1}
                        max={100}
                        value={points}
                        onChange={(e) => setPoints(Number(e.target.value) || 1)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Pertanyaan *</Label>
                <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Tulis pertanyaan..."
                    rows={3}
                />
            </div>

            {type === 'MULTIPLE_CHOICE' && (
                <div className="space-y-3">
                    <Label>Opsi Jawaban</Label>
                    <RadioGroup
                        value={String(correctIndex)}
                        onValueChange={(v) => setCorrectOption(Number(v))}
                    >
                        {options.map((opt, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <RadioGroupItem value={String(idx)} id={`opt-${idx}`} />
                                <Input
                                    value={opt.text}
                                    onChange={(e) => updateOptionText(idx, e.target.value)}
                                    placeholder={`Opsi ${String.fromCharCode(65 + idx)}`}
                                    className="flex-1"
                                />
                                {options.length > 2 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeOption(idx)}
                                        className="shrink-0 text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </RadioGroup>
                    {options.length < 6 && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addOption}
                        >
                            <Plus className="mr-1 h-3 w-3" /> Tambah Opsi
                        </Button>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Pilih radio di samping jawaban yang benar
                    </p>
                </div>
            )}

            {type === 'ESSAY' && (
                <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                    Jawaban essay akan dinilai secara manual atau dengan bantuan AI
                </div>
            )}

            {type === 'FILE_UPLOAD' && (
                <div className="space-y-4 rounded-lg border p-4">
                    <div className="space-y-2">
                        <Label>Tipe File yang Diperbolehkan *</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {FILE_TYPE_OPTIONS.map((fileType) => (
                                <div key={fileType.value} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`file-${fileType.value}`}
                                        checked={allowedFileTypes.includes(fileType.value)}
                                        onCheckedChange={() => toggleFileType(fileType.value)}
                                    />
                                    <label
                                        htmlFor={`file-${fileType.value}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {fileType.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="maxFileSize">Ukuran Maksimal (MB) *</Label>
                            <Input
                                id="maxFileSize"
                                type="number"
                                min={1}
                                max={50}
                                value={maxFileSizeMB}
                                onChange={(e) => setMaxFileSizeMB(Number(e.target.value) || 1)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxFileCount">Jumlah File *</Label>
                            <Input
                                id="maxFileCount"
                                type="number"
                                min={1}
                                max={10}
                                value={maxFileCount}
                                onChange={(e) => setMaxFileCount(Number(e.target.value) || 1)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="uploadInstructions">Instruksi Upload (Opsional)</Label>
                        <Textarea
                            id="uploadInstructions"
                            value={uploadInstructions}
                            onChange={(e) => setUploadInstructions(e.target.value)}
                            placeholder="Contoh: Upload file dalam format PDF dengan nama file: NIM_Nama_Tugas1"
                            rows={3}
                        />
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Batal
                    </Button>
                )}
                <Button onClick={handleSubmit} disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {question ? 'Simpan' : 'Tambah Soal'}
                </Button>
            </div>
        </div>
    )
}
