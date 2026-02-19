import { z } from 'zod'

// Client-safe role enum (mirrors Prisma Role — no server imports)
export const ROLES = [
  'SUPER_ADMIN',
  'HR_ADMIN',
  'MENTOR',
  'LEADER',
  'EMPLOYEE',
] as const

const UserBaseSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  email: z.string().email('Format email tidak valid'),
  role: z.enum(ROLES),
  department: z.string().max(100).optional().or(z.literal('')),
  position: z.string().max(100).optional().or(z.literal('')),
  isActive: z.preprocess((v) => v === 'true' || v === true, z.boolean()),
})

export const CreateUserSchema = UserBaseSchema.extend({
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(72, 'Password maksimal 72 karakter'),
})

export const EditUserSchema = UserBaseSchema.extend({
  password: z
    .string()
    .max(72, 'Password maksimal 72 karakter')
    .optional()
    .or(z.literal('')),
})
