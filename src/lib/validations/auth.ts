import { z } from 'zod'

export const RegisterCustomerSchema = z.object({
    name: z
        .string()
        .min(2, 'Nama minimal 2 karakter')
        .max(100, 'Nama maksimal 100 karakter')
        .transform((v) => v.trim()),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Format email tidak valid'),
    password: z
        .string()
        .min(8, 'Password minimal 8 karakter')
        .regex(/[A-Za-z]/, 'Password harus mengandung huruf')
        .regex(/[0-9]/, 'Password harus mengandung angka'),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
})

export type RegisterCustomerInput = z.infer<typeof RegisterCustomerSchema>

export const ForgotPasswordSchema = z.object({
    email: z.string().trim().toLowerCase().email('Format email tidak valid'),
})

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>

export const ResetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, 'Password minimal 8 karakter')
        .regex(/[A-Za-z]/, 'Password harus mengandung huruf')
        .regex(/[0-9]/, 'Password harus mengandung angka'),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
})

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>
