'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { createTraining, updateTraining } from '@/lib/actions/trainings'
import {
  CreateTrainingSchema,
  EditTrainingSchema,
  type CreateTrainingInput,
  type EditTrainingInput,
} from '@/lib/validations/trainings'
import type { TrainingDetail } from '@/types/trainings'
import { format } from 'date-fns'

interface TrainingFormProps {
  training?: TrainingDetail
}

function toDatetimeLocal(date: Date | string) {
  return format(new Date(date), "yyyy-MM-dd'T'HH:mm")
}

export function TrainingForm({ training }: TrainingFormProps) {
  const isEdit = !!training
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<CreateTrainingInput | EditTrainingInput>({
    resolver: zodResolver(isEdit ? EditTrainingSchema : CreateTrainingSchema),
    defaultValues: training
      ? {
          title: training.title,
          description: training.description ?? '',
          type: training.type as 'WORKSHOP' | 'SEMINAR' | 'BOOTCAMP',
          status: training.status as
            | 'DRAFT'
            | 'OPEN'
            | 'CLOSED'
            | 'COMPLETED'
            | 'CANCELLED',
          startDate: toDatetimeLocal(training.startDate),
          endDate: toDatetimeLocal(training.endDate),
          location: training.location ?? '',
          onlineUrl: training.onlineUrl ?? '',
          capacity: training.capacity ?? '',
        }
      : {
          title: '',
          description: '',
          type: 'WORKSHOP' as const,
          startDate: '',
          endDate: '',
          location: '',
          onlineUrl: '',
          capacity: '',
        },
  })

  function onSubmit(values: CreateTrainingInput | EditTrainingInput) {
    startTransition(async () => {
      const fd = new FormData()
      Object.entries(values).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, String(v))
      })

      const result = isEdit
        ? await updateTraining(training!.id, fd)
        : await createTraining(fd)

      if (!result.success) {
        if ('fieldErrors' in result && result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, messages]) => {
            form.setError(field as keyof typeof values, {
              message: (messages as string[])[0],
            })
          })
        }
        toast.error(result.error ?? 'Terjadi kesalahan')
        return
      }

      toast.success(
        isEdit ? 'Pelatihan berhasil diperbarui' : 'Pelatihan berhasil dibuat'
      )
      if (isEdit) {
        router.push(`/backoffice/trainings/${training!.id}`)
      } else {
        router.push('/backoffice/trainings')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Pelatihan</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan judul pelatihan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Deskripsi pelatihan (opsional)"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type + Status (edit only) */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Pelatihan</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value as string}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="WORKSHOP">Workshop</SelectItem>
                    <SelectItem value="SEMINAR">Seminar</SelectItem>
                    <SelectItem value="BOOTCAMP">Bootcamp</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEdit && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value as string}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draf</SelectItem>
                      <SelectItem value="OPEN">Terbuka</SelectItem>
                      <SelectItem value="CLOSED">Ditutup</SelectItem>
                      <SelectItem value="COMPLETED">Selesai</SelectItem>
                      <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Dates */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Mulai</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} value={field.value as string} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Selesai</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} value={field.value as string} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location + Online URL */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lokasi (opsional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: Ruang Meeting A, Gedung B"
                    {...field}
                    value={field.value as string}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="onlineUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link Online (opsional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://meet.google.com/..."
                    {...field}
                    value={field.value as string}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Capacity */}
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem className="max-w-xs">
              <FormLabel>Kapasitas (opsional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="Kosongkan jika tidak terbatas"
                  {...field}
                  value={field.value as string | number}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? isEdit
                ? 'Menyimpan...'
                : 'Membuat...'
              : isEdit
                ? 'Simpan Perubahan'
                : 'Buat Pelatihan'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Batal
          </Button>
        </div>
      </form>
    </Form>
  )
}
