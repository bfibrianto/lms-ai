import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    generateCertificate,
    getMyCertificates,
    getAllCertificates,
    getCertificateDetail,
    revokeCertificate,
} from '@/lib/actions/certificates'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

// Mock dependencies
vi.mock('@/lib/db', () => ({
    db: {
        certificate: {
            findFirst: vi.fn(),
            create: vi.fn(),
            findMany: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
        },
    },
}))

vi.mock('@/lib/auth', () => ({
    auth: vi.fn(),
}))

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}))

describe('Certificate Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('generateCertificate', () => {
        it('should create a new certificate if one does not exist for the course', async () => {
            vi.mocked(db.certificate.findFirst).mockResolvedValueOnce(null)
            const mockResult = { id: 'cert-1', userId: 'user-1', courseId: 'course-1', isValid: true }
            vi.mocked(db.certificate.create).mockResolvedValueOnce(mockResult as any)

            const result = await generateCertificate({
                userId: 'user-1',
                type: 'COURSE',
                referenceId: 'course-1',
            })

            expect(db.certificate.findFirst).toHaveBeenCalledWith({
                where: { userId: 'user-1', courseId: 'course-1' },
            })
            expect(db.certificate.create).toHaveBeenCalledWith({
                data: { userId: 'user-1', courseId: 'course-1', pathId: null },
            })
            expect(result).toEqual(mockResult)
        })

        it('should return the existing certificate if the user already has one', async () => {
            const existingCert = { id: 'cert-1', userId: 'user-1', courseId: 'course-1', isValid: true }
            vi.mocked(db.certificate.findFirst).mockResolvedValueOnce(existingCert as any)

            const result = await generateCertificate({
                userId: 'user-1',
                type: 'COURSE',
                referenceId: 'course-1',
            })

            expect(db.certificate.create).not.toHaveBeenCalled()
            expect(result).toEqual(existingCert)
        })

        it('should create a new certificate for a learning path', async () => {
            vi.mocked(db.certificate.findFirst).mockResolvedValueOnce(null)
            const mockResult = { id: 'cert-2', userId: 'user-1', pathId: 'path-1', isValid: true }
            vi.mocked(db.certificate.create).mockResolvedValueOnce(mockResult as any)

            const result = await generateCertificate({
                userId: 'user-1',
                type: 'PATH',
                referenceId: 'path-1',
            })

            expect(db.certificate.findFirst).toHaveBeenCalledWith({
                where: { userId: 'user-1', pathId: 'path-1' },
            })
            expect(db.certificate.create).toHaveBeenCalledWith({
                data: { userId: 'user-1', courseId: null, pathId: 'path-1' },
            })
        })
    })

    describe('getMyCertificates', () => {
        it('should throw an error if user is unauthenticated', async () => {
            vi.mocked(auth).mockResolvedValueOnce(null)
            await expect(getMyCertificates()).rejects.toThrow('Unauthorized')
        })

        it('should return a list of certificates for the authenticated user', async () => {
            vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user-1' } } as any)
            const mockCertificates = [{ id: 'cert-1' }, { id: 'cert-2' }]
            vi.mocked(db.certificate.findMany).mockResolvedValueOnce(mockCertificates as any)

            const result = await getMyCertificates()

            expect(db.certificate.findMany).toHaveBeenCalledWith({
                where: { userId: 'user-1' },
                include: {
                    course: { select: { id: true, title: true, thumbnail: true } },
                    path: { select: { id: true, title: true, thumbnail: true } },
                },
                orderBy: { issuedAt: 'desc' },
            })
            expect(result).toEqual(mockCertificates)
        })
    })

    describe('getCertificateDetail', () => {
        it('should fetch the certificate detail by ID', async () => {
            const mockDetail = { id: 'cert-1', user: { name: 'Test' } }
            vi.mocked(db.certificate.findUnique).mockResolvedValueOnce(mockDetail as any)

            const result = await getCertificateDetail('cert-1')

            expect(db.certificate.findUnique).toHaveBeenCalledWith({
                where: { id: 'cert-1' },
                include: expect.any(Object),
            })
            expect(result).toEqual(mockDetail)
        })
    })

    describe('getAllCertificates', () => {
        it('should throw if user is not admin or hr_admin', async () => {
            vi.mocked(auth).mockResolvedValueOnce({ user: { role: 'EMPLOYEE' } } as any)
            await expect(getAllCertificates()).rejects.toThrow('Unauthorized')
        })

        it('should fetch all certificates if user is SUPER_ADMIN', async () => {
            vi.mocked(auth).mockResolvedValueOnce({ user: { role: 'SUPER_ADMIN' } } as any)
            const mockCerts = [{ id: 'cert-1' }]
            vi.mocked(db.certificate.findMany).mockResolvedValueOnce(mockCerts as any)

            await getAllCertificates()

            expect(db.certificate.findMany).toHaveBeenCalledWith({
                include: expect.any(Object),
                orderBy: { issuedAt: 'desc' },
            })
        })
    })

    describe('revokeCertificate', () => {
        it('should throw if user is not authorized to revoke', async () => {
            vi.mocked(auth).mockResolvedValueOnce({ user: { role: 'MENTOR' } } as any)
            await expect(revokeCertificate('cert-1')).rejects.toThrow('Unauthorized')
        })

        it('should set isValid to false and revalidate the page for SUPER_ADMIN', async () => {
            vi.mocked(auth).mockResolvedValueOnce({ user: { role: 'SUPER_ADMIN' } } as any)
            vi.mocked(db.certificate.update).mockResolvedValueOnce({} as any)

            await revokeCertificate('cert-1')

            expect(db.certificate.update).toHaveBeenCalledWith({
                where: { id: 'cert-1' },
                data: { isValid: false },
            })
            expect(revalidatePath).toHaveBeenCalledWith('/backoffice/certificates')
        })
    })
})
