import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createNotification } from './notifications'

export async function awardPoints(userId: string, amount: number, reason: string) {
    try {
        const session = await auth()
        if (!session?.user) {
            throw new Error('Unauthorized')
        }

        if (amount <= 0) {
            return { success: false, error: 'Points amount must be greater than zero' }
        }

        // Gunakan tx transactions agar balance points & history tercatat atomikal
        const result = await db.$transaction(async (tx) => {
            // Create histori poin
            const history = await tx.pointHistory.create({
                data: {
                    userId,
                    amount,
                    reason,
                }
            })

            // Update akumulasi poin user (tambahkan dari balance saat ini)
            const user = await tx.user.update({
                where: { id: userId },
                data: {
                    points: {
                        increment: amount
                    }
                }
            })

            return { history, newTotal: user.points }
        })

        // Buat notifikasi pencapaian untuk pengguna
        await createNotification({
            userId,
            type: 'ACHIEVEMENT',
            title: 'Poin Ditambahkan! 🌟',
            message: `Selamat! Anda mendapatkan ${amount} poin dari: ${reason}. Total poin Anda sekarang: ${result.newTotal}.`,
            actionUrl: '/portal/dashboard'
        })

        return { success: true, data: result }
    } catch (error) {
        console.error('[GAMIFICATION_AWARD]', error)
        return { success: false, error: 'Gagal menambahkan poin' }
    }
}
