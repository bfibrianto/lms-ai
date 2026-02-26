'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/actions/notifications'
import { sendEmail } from '@/lib/email'

/**
 * Helper internal function to generate a certificate when a condition is met
 * (e.g. course fully completed, learning path fully completed)
 */
export async function generateCertificate(params: {
    userId: string
    type: 'COURSE' | 'PATH'
    referenceId: string // courseId or pathId
}) {
    // 1. Check if the user already has a certificate for this specific course or path
    const existingCert = await db.certificate.findFirst({
        where: {
            userId: params.userId,
            ...(params.type === 'COURSE' ? { courseId: params.referenceId } : { pathId: params.referenceId })
        }
    })

    if (existingCert) return existingCert

    // 2. Insert new certificate
    const cert = await db.certificate.create({
        data: {
            userId: params.userId,
            courseId: params.type === 'COURSE' ? params.referenceId : null,
            pathId: params.type === 'PATH' ? params.referenceId : null,
        },
        include: {
            user: { select: { name: true, email: true } },
            course: { select: { title: true } },
            path: { select: { title: true } }
        }
    })

    const itemName = cert.course?.title || cert.path?.title || 'Program'

    // Trigger Notification
    await createNotification({
        userId: params.userId,
        type: 'ACHIEVEMENT',
        title: 'Sertifikat Baru!',
        message: `Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "${itemName}".`,
        actionUrl: '/portal/certificates'
    })

    if (cert.user.email) {
        await sendEmail({
            to: cert.user.email,
            subject: `Sertifikat Kelulusan: ${itemName}`,
            body: `Halo ${cert.user.name},\n\nSelamat! Anda telah mendapatkan sertifikat kelulusan untuk "${itemName}". Anda dapat mengunduhnya di portal LMS.\n\nSalam,\nTim LMS AI`
        })
    }

    return cert
}

export async function getMyCertificates() {
    const session = await auth()
    if (!session?.user?.id) throw new Error('Unauthorized')

    const certificates = await db.certificate.findMany({
        where: { userId: session.user.id },
        include: {
            course: {
                select: { id: true, title: true, thumbnail: true }
            },
            path: {
                select: { id: true, title: true, thumbnail: true }
            }
        },
        orderBy: { issuedAt: 'desc' }
    })

    return certificates
}

export async function getCertificateDetail(id: string) {
    const certificate = await db.certificate.findUnique({
        where: { id },
        include: {
            user: {
                select: { name: true, email: true }
            },
            course: {
                select: { id: true, title: true }
            },
            path: {
                select: { id: true, title: true }
            }
        }
    })

    return certificate
}

export async function getAllCertificates() {
    const session = await auth()
    if (!session?.user || !['SUPER_ADMIN', 'HR_ADMIN'].includes(session.user.role)) {
        throw new Error('Unauthorized')
    }

    const certificates = await db.certificate.findMany({
        include: {
            user: { select: { name: true, email: true } },
            course: { select: { title: true } },
            path: { select: { title: true } }
        },
        orderBy: { issuedAt: 'desc' }
    })

    return certificates
}

export async function revokeCertificate(id: string) {
    const session = await auth()
    if (!session?.user || !['SUPER_ADMIN', 'HR_ADMIN'].includes(session.user.role)) {
        throw new Error('Unauthorized')
    }

    await db.certificate.update({
        where: { id },
        data: { isValid: false }
    })

    revalidatePath('/backoffice/certificates')
}
