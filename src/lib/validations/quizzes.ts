import { z } from 'zod'

export const QUESTION_TYPES = ['MULTIPLE_CHOICE', 'ESSAY'] as const

export const QuestionOptionSchema = z.object({
    text: z.string().min(1, 'Teks opsi wajib diisi').max(1000),
    isCorrect: z.boolean().default(false),
})

export const QuestionSchema = z.object({
    type: z.enum(QUESTION_TYPES, { message: 'Pilih tipe soal' }),
    text: z.string().min(3, 'Teks soal minimal 3 karakter').max(10000),
    points: z.coerce.number().int().min(1, 'Poin minimal 1').max(100).default(1),
    options: z.array(QuestionOptionSchema).optional(),
})

export const CreateQuizSchema = z.object({
    title: z.string().min(3, 'Judul minimal 3 karakter').max(200),
    description: z.preprocess(
        (v) => (v === null ? undefined : v),
        z.string().max(5000).optional().or(z.literal(''))
    ),
    passingScore: z.coerce.number().int().min(0).max(100).default(70),
    duration: z.preprocess(
        (v) => (v === '' || v == null ? undefined : Number(v)),
        z.number().int().min(1).max(600).optional()
    ),
    maxAttempts: z.coerce.number().int().min(1).max(10).default(1),
    shuffleQuestions: z.preprocess((v) => v === 'true' || v === true, z.boolean().default(false)),
    showResult: z.preprocess((v) => v === 'true' || v === true || v === undefined, z.boolean().default(true)),
})

export const EditQuizSchema = CreateQuizSchema

export type CreateQuizInput = z.infer<typeof CreateQuizSchema>
export type QuestionInput = z.infer<typeof QuestionSchema>
export type QuestionOptionInput = z.infer<typeof QuestionOptionSchema>
