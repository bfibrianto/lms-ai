import { z } from 'zod'

// Client-safe enums (mirror Prisma — no server imports)
export const COURSE_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const
export const COURSE_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const
export const LESSON_TYPES = ['VIDEO', 'DOCUMENT', 'TEXT'] as const

export const CreateCourseSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter').max(200),
  description: z.string().max(5000).optional().or(z.literal('')),
  thumbnail: z
    .string()
    .url('URL tidak valid')
    .optional()
    .or(z.literal('')),
  level: z.enum(COURSE_LEVELS),
})

export const EditCourseSchema = CreateCourseSchema.extend({
  status: z.enum(COURSE_STATUSES),
})

export const EditLessonSchema = z.object({
  title: z.string().min(2, 'Judul pelajaran minimal 2 karakter').max(200),
  type: z.enum(LESSON_TYPES),
  content: z.string().max(50000).optional().or(z.literal('')),
  videoUrl: z
    .string()
    .url('URL video tidak valid')
    .optional()
    .or(z.literal('')),
  fileUrl: z
    .string()
    .url('URL file tidak valid')
    .optional()
    .or(z.literal('')),
  duration: z.preprocess(
    (v) => (v === '' || v == null ? undefined : Number(v)),
    z.number().int().min(1).max(9999).optional()
  ),
})
