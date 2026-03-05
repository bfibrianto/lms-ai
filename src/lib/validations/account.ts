import { z } from 'zod'

export const UpdateProfileSchema = z.object({
    name: z
        .string()
        .min(2, 'Nama minimal 2 karakter')
        .max(100, 'Nama maksimal 100 karakter')
        .transform((v) => v.trim()),
})

export const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Password lama wajib diisi'),
    newPassword: z
        .string()
        .min(8, 'Password minimal 8 karakter')
        .regex(/[A-Za-z]/, 'Password harus mengandung huruf')
        .regex(/[0-9]/, 'Password harus mengandung angka'),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
}).refine((data) => data.newPassword !== data.currentPassword, {
    message: 'Password baru tidak boleh sama dengan password lama',
    path: ['newPassword'],
})

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>
