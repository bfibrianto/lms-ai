'use server'

import { db } from '@/lib/db'
import { Role } from '@/generated/prisma/client'
import { hash } from 'bcryptjs'
import { RegisterCustomerSchema } from '@/lib/validations/auth'
import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'

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

/**
 * Server-side login action.
 * Uses signIn from auth.ts (server-side) to properly set cookies on Vercel.
 */
export async function loginAction(formData: FormData) {
    try {
        await signIn('credentials', {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            redirectTo: '/dashboard',
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Email atau password salah.' }
                default:
                    return { error: 'Terjadi kesalahan saat login.' }
            }
        }
        // NEXT_REDIRECT throws an error that must be re-thrown
        throw error
    }
}
