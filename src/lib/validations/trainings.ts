import { z } from 'zod'

export const TRAINING_TYPES = ['WORKSHOP', 'SEMINAR', 'BOOTCAMP'] as const
export const TRAINING_STATUSES = [
  'DRAFT',
  'OPEN',
  'CLOSED',
  'COMPLETED',
  'CANCELLED',
] as const
export const REGISTRATION_STATUSES = [
  'REGISTERED',
  'ATTENDED',
  'ABSENT',
  'CANCELLED',
] as const

export const trainingTypeLabels: Record<string, string> = {
  WORKSHOP: 'Workshop',
  SEMINAR: 'Seminar',
  BOOTCAMP: 'Bootcamp',
}

export const trainingStatusLabels: Record<string, string> = {
  DRAFT: 'Draf',
  OPEN: 'Terbuka',
  CLOSED: 'Ditutup',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
}

export const registrationStatusLabels: Record<string, string> = {
  REGISTERED: 'Terdaftar',
  ATTENDED: 'Hadir',
  ABSENT: 'Tidak Hadir',
  CANCELLED: 'Dibatalkan',
}

export const CreateTrainingSchema = z
  .object({
    title: z.string().min(3, 'Judul minimal 3 karakter'),
    description: z.string().optional(),
    type: z.enum(TRAINING_TYPES, { message: 'Pilih tipe pelatihan' }),
    startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
    endDate: z.string().min(1, 'Tanggal selesai wajib diisi'),
    location: z.string().optional(),
    onlineUrl: z.string().url('URL tidak valid').optional().or(z.literal('')),
    capacity: z.coerce.number().int().positive().optional().or(z.literal('')),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'Tanggal selesai harus setelah tanggal mulai',
    path: ['endDate'],
  })

export const EditTrainingSchema = CreateTrainingSchema.extend({
  status: z.enum(TRAINING_STATUSES, { message: 'Pilih status' }),
})

export type CreateTrainingInput = z.infer<typeof CreateTrainingSchema>
export type EditTrainingInput = z.infer<typeof EditTrainingSchema>
