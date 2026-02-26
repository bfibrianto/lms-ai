import { z } from 'zod'


export const CreateLearningPathSchema = z.object({
    title: z.string().min(3, 'Judul learning path minimal 3 karakter').max(100, 'Judul learning path maksimal 100 karakter'),
    description: z.string().optional().nullable(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
    thumbnail: z.custom<File | null>((val) => {
        if (val === null) return true;
        if (typeof window === 'undefined') return true;
        return val instanceof File;
    }, 'Thumbnail tidak valid').optional().nullable(),
})

export type CreateLearningPathInput = z.infer<typeof CreateLearningPathSchema>

// Schema for updating the course list and their order
export const UpdatePathCoursesSchema = z.object({
    pathId: z.string().min(1),
    courses: z.array(z.object({
        courseId: z.string().min(1),
        order: z.number().int().min(0)
    }))
})

export type UpdatePathCoursesInput = z.infer<typeof UpdatePathCoursesSchema>
