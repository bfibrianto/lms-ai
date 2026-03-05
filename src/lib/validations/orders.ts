import { z } from 'zod'

export const CreateOrderSchema = z.object({
    itemType: z.enum(['COURSE', 'TRAINING', 'LEARNING_PATH']),
    itemId: z.string().min(1, 'Item ID wajib diisi'),
})

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>
