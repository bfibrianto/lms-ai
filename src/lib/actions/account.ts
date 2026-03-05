'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { compare, hash } from 'bcryptjs'
import { UpdateProfileSchema, ChangePasswordSchema } from '@/lib/validations/account'

type ActionResult = {
    success: boolean
    error?: string
    fieldErrors?: Record<string, string[]>
}

async function requireAuth() {
    const session = await auth()
    if (!session?.user) throw new Error('Tidak terautentikasi')
    return session
}

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

export async function updateProfile(formData: FormData): Promise<ActionResult> {
    const session = await requireAuth()

    const parsed = UpdateProfileSchema.safeParse({
        name: formData.get('name'),
    })

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
    revalidatePath('/', 'layout') // refresh header/user menu

    return { success: true }
}

export async function changePassword(formData: FormData): Promise<ActionResult> {
    const session = await requireAuth()

    const parsed = ChangePasswordSchema.safeParse({
        currentPassword: formData.get('currentPassword'),
        newPassword: formData.get('newPassword'),
        confirmPassword: formData.get('confirmPassword'),
    })

    if (!parsed.success) {
        return {
            success: false,
            error: 'Data tidak valid',
            fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        }
    }

    const { currentPassword, newPassword } = parsed.data

    // Get current password hash
    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
    })

    if (!user?.password) {
        return { success: false, error: 'Akun tidak memiliki password (login via OAuth)' }
    }

    // Verify current password
    const isValid = await compare(currentPassword, user.password)
    if (!isValid) {
        return {
            success: false,
            error: 'Password lama tidak sesuai',
            fieldErrors: { currentPassword: ['Password lama tidak sesuai'] },
        }
    }

    // Hash and update
    const hashedPassword = await hash(newPassword, 12)
    await db.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword },
    })

    return { success: true }
}
