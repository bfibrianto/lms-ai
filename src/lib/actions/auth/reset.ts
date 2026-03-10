'use server'

import { db } from '@/lib/db'
import { hash } from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { ForgotPasswordSchema, ResetPasswordSchema } from '@/lib/validations/auth'
import { sendEmail } from '@/lib/email'

export type ActionResult<T = void> = {
    success: boolean
    data?: T
    error?: string
    fieldErrors?: Record<string, string[]>
}

export async function requestPasswordReset(formData: FormData): Promise<ActionResult> {
    const raw = { email: formData.get('email') }
    const parsed = ForgotPasswordSchema.safeParse(raw)

    if (!parsed.success) {
        return {
            success: false,
            error: 'Email tidak valid',
            fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        }
    }

    const { email } = parsed.data

    // 1. Check if user exists
    const user = await db.user.findUnique({ where: { email } })

    // We do NOT return an error if the user doesn't exist, to prevent enumeration attacks.
    // We just act like an email was sent.
    if (user) {
        // 2. Clear existing tokens for this email
        await db.verificationToken.deleteMany({
            where: { identifier: email },
        })

        // 3. Generate a new token
        const token = uuidv4()
        const expires = new Date(Date.now() + 30 * 60 * 1000) // 30 mins

        await db.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires,
            },
        })

        // 4. Send the reset email
        // Determine the base URL. In production VERCEL_URL is preferable, but fallback to process.env.APP_URL
        const appUrl = process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
        const resetLink = `${appUrl}/auth/reset-password?token=${token}`

        const emailBody = `
            <h2>Pemulihan Kata Sandi</h2>
            <p>Halo, ${user.name}</p>
            <p>Anda baru saja mengajukan permohonan untuk mengatur ulang kata sandi Anda. Silakan klik tautan di bawah ini untuk melanjutkan:</p>
            <p><a href="${resetLink}">Reset Password Saya</a></p>
            <p>Tautan ini akan kedaluwarsa dalam 30 menit. Bila Anda tidak merasa mengajukan permohonan ini, silakan abaikan pesan ini.</p>
        `

        await sendEmail({
            to: email,
            subject: 'Instruksi Pemulihan Password - LMS AI',
            body: emailBody,
        })
    }

    return {
        success: true,
        data: undefined,
    }
}

export async function resetPassword(formData: FormData, token: string): Promise<ActionResult> {
    if (!token) {
        return { success: false, error: 'Token tidak ditemukan' }
    }

    const raw = {
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    }

    const parsed = ResetPasswordSchema.safeParse(raw)

    if (!parsed.success) {
        return {
            success: false,
            error: 'Data sandi tidak valid',
            fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        }
    }

    const { password } = parsed.data

    // 1. Validate the token
    const verificationToken = await db.verificationToken.findUnique({
        where: { token },
    })

    if (!verificationToken) {
        return { success: false, error: 'Token reset tidak valid atau tidak ditemukan.' }
    }

    if (verificationToken.expires < new Date()) {
        // Expired token
        await db.verificationToken.delete({ where: { token } })
        return { success: false, error: 'Waktu reset kata sandi telah kedaluwarsa. Silakan ajukan ulang.' }
    }

    // 2. Hash new password
    const hashedPassword = await hash(password, 12)

    // 3. Update the user password utilizing the identifier (which holds the email)
    await db.user.update({
        where: { email: verificationToken.identifier },
        data: { password: hashedPassword },
    })

    // 4. Clean up / discard the token so it's one-time use
    await db.verificationToken.delete({ where: { token } })

    return { success: true }
}
