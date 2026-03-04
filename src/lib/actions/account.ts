'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { compare, hash } from 'bcryptjs'
import { UpdateProfileSchema, ChangePasswordSchema } from '@/lib/validations/account'

interface ActionResult {
    success: boolean
    error?: string
    fieldErrors?: Record<string, string[]>
}

async function requireAuth() {
    const session = await auth()
    if (!session?.user?.id) throw new Error('Tidak terautentikasi')
    return session
}

/**
 * Get the current user's profile information.
 */
export async function getMyProfile() {
    const session = await requireAuth()

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
            position: true,
            avatar: true,
            createdAt: true,
        },
    })

    if (!user) throw new Error('User tidak ditemukan')
    return user
}

/**
 * Update the current user's display name.
 */
export async function updateProfile(data: { name: string }): Promise<ActionResult> {
    const session = await requireAuth()

    const parsed = UpdateProfileSchema.safeParse(data)
    if (!parsed.success) {
        return {
            success: false,
            error: 'Data tidak valid',
            fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        }
    }

    await db.user.update({
        where: { id: session.user.id },
        data: { name: parsed.data.name },
    })

    revalidatePath('/backoffice/account')
    revalidatePath('/portal/account')
    revalidatePath('/backoffice', 'layout')
    revalidatePath('/portal', 'layout')

    return { success: true }
}

/**
 * Change the current user's password.
 */
export async function changePassword(data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}): Promise<ActionResult> {
    const session = await requireAuth()

    const parsed = ChangePasswordSchema.safeParse(data)
    if (!parsed.success) {
        return {
            success: false,
            error: 'Data tidak valid',
            fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        }
    }

    // Get current password hash
    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
    })
    if (!user) return { success: false, error: 'User tidak ditemukan' }

    // Verify current password
    const isValid = await compare(parsed.data.currentPassword, user.password)
    if (!isValid) {
        return {
            success: false,
            error: 'Password lama tidak sesuai',
            fieldErrors: { currentPassword: ['Password lama tidak sesuai'] },
        }
    }

    // Hash and update new password
    const hashed = await hash(parsed.data.newPassword, 12)
    await db.user.update({
        where: { id: session.user.id },
        data: { password: hashed },
    })

    return { success: true }
}
