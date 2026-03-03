'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Pencil, Eye, Sparkles, Loader2, Check, AlertCircle } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { MarkdownRenderer } from '@/components/shared/markdown-renderer'
import { EditLessonSchema } from '@/lib/validations/courses'
import { createLesson, updateLesson } from '@/lib/actions/lessons'
import { generateLessonContentAction } from '@/lib/actions/ai'
import type { LessonDetail } from '@/types/courses'

type FormValues = z.infer<typeof EditLessonSchema>
type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface LessonEditorSheetProps {
  open: boolean
  moduleId: string
  lesson: LessonDetail | null
  onClose: () => void
}

export function LessonEditorSheet({
  open,
  moduleId,
  lesson,
  onClose,
}: LessonEditorSheetProps) {
  const [isPending, startTransition] = useTransition()
  const [contentMode, setContentMode] = useState<string>('edit')
  const [isGenerating, setIsGenerating] = useState(false)
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>('idle')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstRender = useRef(true)
  const isEdit = lesson !== null

  const form = useForm<FormValues>({
    resolver: zodResolver(EditLessonSchema),
    defaultValues: lesson
      ? {
        title: lesson.title,
        type: lesson.type,
        content: lesson.content ?? '',
        videoUrl: lesson.videoUrl ?? '',
        fileUrl: lesson.fileUrl ?? '',
        duration: lesson.duration ?? undefined,
      }
      : {
        title: '',
        type: 'TEXT',
        content: '',
        videoUrl: '',
        fileUrl: '',
        duration: undefined,
      },
  })

  useEffect(() => {
    if (open) {
      setContentMode('edit')
      form.reset(
        lesson
          ? {
            title: lesson.title,
            type: lesson.type,
            content: lesson.content ?? '',
            videoUrl: lesson.videoUrl ?? '',
            fileUrl: lesson.fileUrl ?? '',
            duration: lesson.duration ?? undefined,
          }
          : {
            title: '',
            type: 'TEXT',
            content: '',
            videoUrl: '',
            fileUrl: '',
            duration: undefined,
          }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lesson?.id])

  const lessonType = form.watch('type')
  const formValues = form.watch()

  // Debounced autosave (edit mode only)
  useEffect(() => {
    if (!isEdit || isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setAutosaveStatus('saving')
      try {
        const formData = new FormData()
        Object.entries(formValues).forEach(([k, v]) => {
          if (v != null && v !== undefined) formData.append(k, String(v))
        })
        const result = await updateLesson(lesson!.id, formData)
        if (result.success) {
          setAutosaveStatus('saved')
          setTimeout(() => setAutosaveStatus('idle'), 3000)
        } else {
          setAutosaveStatus('error')
        }
      } catch {
        setAutosaveStatus('error')
      }
    }, 1500)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(formValues), isEdit, lesson?.id])

  async function handleGenerateContent() {
    const title = form.getValues('title')
    if (!title || title.trim().length < 2) {
      toast.error('Masukkan judul pelajaran terlebih dahulu.')
      return
    }
    setIsGenerating(true)
    try {
      const res = isEdit
        ? await generateLessonContentAction(lesson.id)
        : await generateLessonContentAction(undefined, moduleId, title)
      if (res.success && res.data) {
        form.setValue('content', res.data, { shouldDirty: true })
        toast.success('Konten berhasil di-generate.')
        setContentMode('preview')
      } else {
        toast.error(res.error || 'Gagal generate konten.')
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan sistem.')
    } finally {
      setIsGenerating(false)
    }
  }

  function onSubmit(values: FormValues) {
    const formData = new FormData()
    Object.entries(values).forEach(([k, v]) => {
      if (v != null && v !== undefined) formData.append(k, String(v))
    })

    startTransition(async () => {
      try {
        const result = isEdit
          ? await updateLesson(lesson.id, formData)
          : await createLesson(moduleId, formData)

        if (result.success) {
          if (debounceRef.current) clearTimeout(debounceRef.current)
          setAutosaveStatus('idle')
          isFirstRender.current = true
          toast.success(isEdit ? 'Pelajaran diperbarui' : 'Pelajaran ditambahkan')
          onClose()
        } else {
          if (result.fieldErrors) {
            Object.entries(result.fieldErrors).forEach(([field, errors]) => {
              form.setError(field as keyof FormValues, { message: errors[0] })
            })
          }
          toast.error(result.error)
        }
      } catch {
        toast.error('Terjadi kesalahan. Silakan coba lagi.')
      }
    })
  }

  function handleClose() {
    if (autosaveStatus === 'error') {
      const confirmed = confirm('Perubahan terakhir gagal tersimpan. Yakin keluar?')
      if (!confirmed) return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setAutosaveStatus('idle')
    isFirstRender.current = true
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent side="right" className="flex w-full flex-col overflow-y-auto sm:max-w-2xl px-4">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>
              {isEdit ? 'Edit Pelajaran' : 'Tambah Pelajaran'}
            </SheetTitle>
            {isEdit && autosaveStatus !== 'idle' && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {autosaveStatus === 'saving' && (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                )}
                {autosaveStatus === 'saved' && (
                  <>
                    <Check className="h-3 w-3 text-teal-500" />
                    <span className="text-teal-500">Tersimpan</span>
                  </>
                )}
                {autosaveStatus === 'error' && (
                  <>
                    <AlertCircle className="h-3 w-3 text-destructive" />
                    <span className="text-destructive">Gagal tersimpan</span>
                  </>
                )}
              </div>
            )}
          </div>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-1 flex-col gap-4 py-4"
          >
            {/* Judul */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Pelajaran</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Pengenalan Variabel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipe */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Pelajaran</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TEXT">Teks</SelectItem>
                      <SelectItem value="VIDEO">Video</SelectItem>
                      <SelectItem value="DOCUMENT">Dokumen</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conditional content fields */}
            {lessonType === 'VIDEO' && (
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Video</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.youtube.com/watch?v=..."
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormDescription>
                      URL YouTube, Vimeo, atau platform video lainnya
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {lessonType === 'DOCUMENT' && (
              <FormField
                control={form.control}
                name="fileUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Dokumen</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/materi.pdf"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormDescription>
                      URL file PDF, PPT, atau dokumen lainnya
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {lessonType === 'TEXT' && (
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between">
                      <FormLabel>
                        Konten{' '}
                        <span className="text-muted-foreground text-xs font-normal">
                          (Markdown didukung)
                        </span>
                      </FormLabel>
                      <div className="flex items-center gap-2">
                        <ToggleGroup
                          type="single"
                          value={contentMode}
                          onValueChange={(v) => v && setContentMode(v)}
                          className="h-7"
                        >
                          <ToggleGroupItem value="edit" className="h-7 px-2 text-xs gap-1">
                            <Pencil className="h-3 w-3" />
                            Edit
                          </ToggleGroupItem>
                          <ToggleGroupItem value="preview" className="h-7 px-2 text-xs gap-1">
                            <Eye className="h-3 w-3" />
                            Preview
                          </ToggleGroupItem>
                        </ToggleGroup>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={handleGenerateContent}
                          disabled={isGenerating || isPending}
                        >
                          {isGenerating ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <Sparkles className="h-3 w-3 mr-1 text-primary" />
                          )}
                          Generate
                        </Button>
                      </div>
                    </div>
                    <FormControl>
                      {contentMode === 'edit' ? (
                        <Textarea
                          placeholder="Tulis konten pelajaran dalam format Markdown..."
                          className="flex-1 min-h-[300px] font-mono text-sm"
                          {...field}
                          value={field.value ?? ''}
                        />
                      ) : (
                        <div className="flex-1 overflow-y-auto rounded-md border p-3 min-h-[300px]">
                          <MarkdownRenderer
                            content={field.value || '_Belum ada konten._'}
                          />
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Durasi */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durasi (menit)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      min={1}
                      max={9999}
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === '' ? undefined : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>Opsional — estimasi durasi pelajaran</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="mt-auto flex gap-3 pt-4">
              <Button type="submit" disabled={isPending || isGenerating} className="flex-1">
                {isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending || isGenerating}
              >
                Batal
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
