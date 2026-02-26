import { describe, it, expect } from 'vitest'
import { CreateUserSchema, EditUserSchema } from '@/lib/validations/users'

describe('CreateUserSchema', () => {
    const validUser = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'EMPLOYEE' as const,
        password: 'password123',
        isActive: true,
    }

    it('accepts valid data', () => {
        const result = CreateUserSchema.safeParse(validUser)
        expect(result.success).toBe(true)
    })

    it('accepts all valid roles', () => {
        const roles = ['SUPER_ADMIN', 'HR_ADMIN', 'MENTOR', 'LEADER', 'EMPLOYEE'] as const
        for (const role of roles) {
            const result = CreateUserSchema.safeParse({ ...validUser, role })
            expect(result.success).toBe(true)
        }
    })

    it('rejects invalid role', () => {
        const result = CreateUserSchema.safeParse({ ...validUser, role: 'INVALID_ROLE' })
        expect(result.success).toBe(false)
    })

    it('rejects name shorter than 2 chars', () => {
        const result = CreateUserSchema.safeParse({ ...validUser, name: 'A' })
        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].message).toContain('2 karakter')
        }
    })

    it('rejects empty name', () => {
        const result = CreateUserSchema.safeParse({ ...validUser, name: '' })
        expect(result.success).toBe(false)
    })

    it('rejects invalid email format', () => {
        const result = CreateUserSchema.safeParse({ ...validUser, email: 'not-email' })
        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].message).toContain('email')
        }
    })

    it('rejects password shorter than 8 chars', () => {
        const result = CreateUserSchema.safeParse({ ...validUser, password: 'short' })
        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].message).toContain('8 karakter')
        }
    })

    it('rejects password longer than 72 chars', () => {
        const result = CreateUserSchema.safeParse({ ...validUser, password: 'a'.repeat(73) })
        expect(result.success).toBe(false)
    })

    it('accepts optional department and position', () => {
        const result = CreateUserSchema.safeParse({
            ...validUser,
            department: 'Engineering',
            position: 'Senior Developer',
        })
        expect(result.success).toBe(true)
    })

    it('accepts empty string for department/position', () => {
        const result = CreateUserSchema.safeParse({
            ...validUser,
            department: '',
            position: '',
        })
        expect(result.success).toBe(true)
    })

    it('coerces isActive string "true" to boolean', () => {
        const result = CreateUserSchema.safeParse({ ...validUser, isActive: 'true' })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.isActive).toBe(true)
        }
    })
})

describe('EditUserSchema', () => {
    const validEdit = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'EMPLOYEE' as const,
        isActive: true,
    }

    it('accepts data without password', () => {
        const result = EditUserSchema.safeParse(validEdit)
        expect(result.success).toBe(true)
    })

    it('accepts empty password (no change)', () => {
        const result = EditUserSchema.safeParse({ ...validEdit, password: '' })
        expect(result.success).toBe(true)
    })

    it('accepts valid new password', () => {
        const result = EditUserSchema.safeParse({ ...validEdit, password: 'newpassword123' })
        expect(result.success).toBe(true)
    })

    it('rejects password longer than 72 chars', () => {
        const result = EditUserSchema.safeParse({ ...validEdit, password: 'x'.repeat(73) })
        expect(result.success).toBe(false)
    })
})
