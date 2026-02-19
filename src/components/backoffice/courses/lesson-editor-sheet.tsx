'use client'

import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
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
import { EditLessonSchema } from '@/lib/validations/courses'
import { createLesson, updateLesson } from '@/lib/actions/lessons'
import type { LessonDetail } from '@/types/courses'

type FormValues = z.infer<typeof EditLessonSchema>

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

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="flex w-full flex-col overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? 'Edit Pelajaran' : 'Tambah Pelajaran'}
          </SheetTitle>
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
                  <FormItem>
                    <FormLabel>Konten</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tulis konten pelajaran di sini..."
                        rows={8}
                        {...field}
                        value={field.value ?? ''}
                      />
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
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
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
