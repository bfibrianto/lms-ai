import { describe, it, expect } from 'vitest'
import { ForgotPasswordSchema, ResetPasswordSchema } from '@/lib/validations/auth'

describe('Auth Validations', () => {
    describe('ForgotPasswordSchema', () => {
        it('validates a correct email format', () => {
            const result = ForgotPasswordSchema.safeParse({ email: 'test@sitamoto.ai' })
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data.email).toBe('test@sitamoto.ai')
            }
        })

        it('lowercases and trims the email', () => {
            const result = ForgotPasswordSchema.safeParse({ email: '  User@SitaMoto.ai  ' })
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data.email).toBe('user@sitamoto.ai')
            }
        })

        it('rejects an invalid email format', () => {
            const result = ForgotPasswordSchema.safeParse({ email: 'not-an-email' })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Format email tidak valid')
            }
        })
    })

    describe('ResetPasswordSchema', () => {
        const validPassword = 'Password123'

        it('validates matching passwords that meet criteria', () => {
            const result = ResetPasswordSchema.safeParse({
                password: validPassword,
                confirmPassword: validPassword
            })
            expect(result.success).toBe(true)
        })

        it('rejects passwords under 8 characters', () => {
            const result = ResetPasswordSchema.safeParse({
                password: 'Pass1',
                confirmPassword: 'Pass1'
            })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('Password minimal 8 karakter')
            }
        })

        it('rejects passwords without numbers', () => {
            const result = ResetPasswordSchema.safeParse({
                password: 'Password',
                confirmPassword: 'Password'
            })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('Password harus mengandung angka')
            }
        })

        it('rejects unmatched confirm password', () => {
            const result = ResetPasswordSchema.safeParse({
                password: validPassword,
                confirmPassword: 'DifferentPassword123'
            })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Konfirmasi password tidak cocok')
            }
        })
    })
})
