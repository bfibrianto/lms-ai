'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Sparkles, Loader2, Eye, Pencil } from 'lucide-react'
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
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group'
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
  CreateCourseSchema,
  EditCourseSchema,
  COURSE_LEVELS,
  COURSE_STATUSES,
} from '@/lib/validations/courses'
import { createCourse, updateCourse } from '@/lib/actions/courses'
import { generateCourseDescriptionAction } from '@/lib/actions/ai'
import { FileUploader } from '@/components/shared/upload-button'
import { MarkdownRenderer } from '@/components/shared/markdown-renderer'
import { MonetizationSection } from '@/components/shared/monetization-section'
import type { CourseDetail } from '@/types/courses'

type CreateValues = z.infer<typeof CreateCourseSchema>
type EditValues = z.infer<typeof EditCourseSchema>

interface CourseFormCreateProps {
  mode: 'create'
}

interface CourseFormEditProps {
  mode: 'edit'
  course: CourseDetail
}

type Props = CourseFormCreateProps | CourseFormEditProps

const LEVEL_LABELS: Record<typeof COURSE_LEVELS[number], string> = {
  BEGINNER: 'Pemula',
  INTERMEDIATE: 'Menengah',
  ADVANCED: 'Mahir',
}

const STATUS_LABELS: Record<typeof COURSE_STATUSES[number], string> = {
  DRAFT: 'Draf',
  PUBLISHED: 'Diterbitkan',
  ARCHIVED: 'Diarsipkan',
}

const DESC_MAX = 1000

export function CourseForm(props: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEdit = props.mode === 'edit'
  const course = isEdit ? props.course : undefined

  const schema = isEdit ? EditCourseSchema : CreateCourseSchema

  const form = useForm<CreateValues | EditValues>({
    resolver: zodResolver(schema),
    defaultValues: isEdit
      ? {
        title: course!.title,
        description: course!.description ?? '',
        thumbnail: course!.thumbnail ?? '',
        level: course!.level,
        status: course!.status,
        visibility: (course as any).visibility ?? 'INTERNAL',
        price: (course as any).price ? Number((course as any).price) : null,
        promoPrice: (course as any).promoPrice ? Number((course as any).promoPrice) : null,
      }
      : {
        title: '',
        description: '',
        thumbnail: '',
        level: 'BEGINNER' as const,
        visibility: 'INTERNAL' as const,
        price: null,
        promoPrice: null,
      },
  })

  // Description preview mode state
  const [descMode, setDescMode] = useState<string>('edit')

  // Generate dialog state
  const [genDialogOpen, setGenDialogOpen] = useState(false)
  const [genAdditionalContext, setGenAdditionalContext] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  function onSubmit(values: CreateValues | EditValues) {
    const formData = new FormData()
    Object.entries(values).forEach(([k, v]) => {
      formData.append(k, String(v ?? ''))
    })

    startTransition(async () => {
      try {
        const result = isEdit
          ? await updateCourse(course!.id, formData)
          : await createCourse(formData)

        if (result.success) {
          toast.success(isEdit ? 'Kursus berhasil diperbarui' : 'Kursus berhasil dibuat')
          if (!isEdit) {
            const createResult = result as { success: true; data: { id: string } }
            router.push(`/backoffice/courses/${createResult.data.id}`)
          } else {
            router.push(`/backoffice/courses/${course!.id}`)
          }
        } else {
          if (result.fieldErrors) {
            Object.entries(result.fieldErrors).forEach(([field, errors]) => {
              form.setError(field as keyof (CreateValues | EditValues), {
                message: errors[0],
              })
            })
          }
          toast.error(result.error)
        }
      } catch {
        toast.error('Terjadi kesalahan. Silakan coba lagi.')
      }
    })
  }

  async function handleGenerateDescription(onSuccess: (text: string) => void) {
    const title = form.getValues('title')
    if (!title || title.trim().length < 3) {
      toast.error('Masukkan judul kursus terlebih dahulu (minimal 3 karakter).')
      return
    }

    setIsGenerating(true)
    try {
      const res = await generateCourseDescriptionAction(
        title,
        genAdditionalContext.trim() || undefined
      )
      if (res.success && res.data) {
        onSuccess(res.data)
        setGenDialogOpen(false)
        setGenAdditionalContext('')
        toast.success('Deskripsi berhasil di-generate oleh AI.')
      } else {
        toast.error(res.error || 'Gagal menghasilkan deskripsi.')
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan sistem.')
    } finally {
      setIsGenerating(false)
    }
  }

  const descLength = form.watch('description')?.length ?? 0

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Judul */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Kursus</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Dasar-dasar JavaScript" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Deskripsi */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>
                  Deskripsi{' '}
                  <span className="text-muted-foreground text-xs font-normal">
                    (Markdown didukung)
                  </span>
                </FormLabel>
                <div className="flex items-center gap-2">
                  <ToggleGroup
                    type="single"
                    value={descMode}
                    onValueChange={(v) => v && setDescMode(v)}
                    className="h-7"
                  >
                    <ToggleGroupItem
                      value="edit"
                      className="h-7 px-2 text-xs gap-1"
                      aria-label="Mode edit"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="preview"
                      className="h-7 px-2 text-xs gap-1"
                      aria-label="Mode preview"
                    >
                      <Eye className="h-3 w-3" />
                      Preview
                    </ToggleGroupItem>
                  </ToggleGroup>

                  {/* Generate Button with Dialog */}
                  <Dialog open={genDialogOpen} onOpenChange={setGenDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        type="button"
                        className="h-7 text-xs"
                      >
                        <Sparkles className="h-3 w-3 mr-1 text-primary" />
                        Generate
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Generate Deskripsi Kursus</DialogTitle>
                        <DialogDescription>
                          AI akan membuat deskripsi umum kursus berdasarkan judul.
                          Anda dapat menambahkan instruksi tambahan jika diperlukan.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Judul Kursus</p>
                          <p className="text-sm text-muted-foreground rounded-md border px-3 py-2">
                            {form.watch('title') || (
                              <span className="italic">Belum diisi</span>
                            )}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="gen-context"
                            className="text-sm font-medium"
                          >
                            Instruksi Tambahan{' '}
                            <span className="text-muted-foreground font-normal">
                              (opsional)
                            </span>
                          </label>
                          <Textarea
                            id="gen-context"
                            placeholder="Contoh: Fokus pada manfaat praktis untuk pemula..."
                            value={genAdditionalContext}
                            onChange={(e) =>
                              setGenAdditionalContext(e.target.value)
                            }
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setGenDialogOpen(false)}
                          disabled={isGenerating}
                        >
                          Batal
                        </Button>
                        <Button
                          type="button"
                          onClick={() =>
                            handleGenerateDescription(field.onChange)
                          }
                          disabled={isGenerating}
                        >
                          {isGenerating && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          )}
                          Generate Sekarang
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <FormControl>
                {descMode === 'edit' ? (
                  <Textarea
                    placeholder="Deskripsi singkat tentang kursus ini..."
                    rows={4}
                    maxLength={DESC_MAX}
                    {...field}
                    value={field.value ?? ''}
                  />
                ) : (
                  <div className="rounded-md border p-3 min-h-[120px]">
                    <MarkdownRenderer
                      content={
                        field.value || '_Belum ada deskripsi._'
                      }
                      className="text-muted-foreground"
                    />
                  </div>
                )}
              </FormControl>

              {/* Character counter */}
              <div className="flex items-center justify-between">
                <FormMessage />
                <p
                  className={`text-xs ml-auto ${descLength > 900
                    ? 'text-destructive'
                    : 'text-muted-foreground'
                    }`}
                >
                  {descLength} / {DESC_MAX}
                </p>
              </div>
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Thumbnail */}
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem className="col-span-full sm:col-span-2">
                <FormLabel>Gambar Thumbnail Kursus</FormLabel>
                <FormControl>
                  <FileUploader
                    currentImageUrl={field.value}
                    onUploadSuccess={(url) => {
                      field.onChange(url)
                    }}
                    folder="courses"
                  />
                </FormControl>
                <FormDescription>Format didukung: JPG, PNG, WEBP. Maks 5MB.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Level */}
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COURSE_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {LEVEL_LABELS[level]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status (edit only) */}
          {isEdit && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COURSE_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Monetization */}
        <MonetizationSection form={form} />

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? isEdit
                ? 'Menyimpan...'
                : 'Membuat...'
              : isEdit
                ? 'Simpan Perubahan'
                : 'Buat Kursus'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/backoffice/courses')}
            disabled={isPending}
          >
            Batal
          </Button>
        </div>
      </form>
    </Form>
  )
}
