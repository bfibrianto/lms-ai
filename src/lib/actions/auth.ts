'use server'

import { db } from '@/lib/db'
import { Role } from '@/generated/prisma/client'
import { hash } from 'bcryptjs'
import { RegisterCustomerSchema } from '@/lib/validations/auth'

type ActionResult<T = void> = {
    success: boolean
    data?: T
    error?: string
    fieldErrors?: Record<string, string[]>
}

/**
 * Register a new CUSTOMER user (self-registration).
 * Does NOT auto-login — client side will call signIn() after success.
 */
export async function registerCustomer(
    formData: FormData
): Promise<ActionResult<{ id: string }>> {
    const raw = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    }

    const parsed = RegisterCustomerSchema.safeParse(raw)
    if (!parsed.success) {
        return {
            success: false,
            error: 'Data tidak valid',
            fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        }
    }

    const { name, email, password } = parsed.data

    // Check email uniqueness
    const existingUser = await db.user.findUnique({
        where: { email },
        select: { id: true },
    })

    if (existingUser) {
        return {
            success: false,
            error: 'Email sudah terdaftar',
            fieldErrors: { email: ['Email sudah terdaftar. Silakan gunakan email lain atau masuk.'] },
        }
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user with CUSTOMER role
    const user = await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: Role.CUSTOMER,
            isActive: true,
        },
        select: { id: true },
    })

    return { success: true, data: { id: user.id } }
}
