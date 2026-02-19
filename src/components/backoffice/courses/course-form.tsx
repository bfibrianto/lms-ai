'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
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
  CreateCourseSchema,
  EditCourseSchema,
  COURSE_LEVELS,
  COURSE_STATUSES,
} from '@/lib/validations/courses'
import { createCourse, updateCourse } from '@/lib/actions/courses'
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
        }
      : {
          title: '',
          description: '',
          thumbnail: '',
          level: 'BEGINNER' as const,
        },
  })

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
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Deskripsi singkat tentang kursus ini..."
                  rows={4}
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Thumbnail */}
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Thumbnail</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/thumbnail.jpg"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormDescription>URL gambar thumbnail kursus (opsional)</FormDescription>
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
