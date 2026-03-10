import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import nodemailer from 'nodemailer'
import { sendEmail } from '@/lib/email'

// Mock nodemailer
vi.mock('nodemailer', () => ({
    default: {
        createTransport: vi.fn().mockReturnValue({
            sendMail: vi.fn().mockResolvedValue(true)
        })
    }
}))

describe('sendEmail utility', () => {
    const originalEnv = process.env

    beforeEach(() => {
        vi.clearAllMocks()
        process.env = { ...originalEnv }
    })

    afterEach(() => {
        process.env = originalEnv
    })

    it('should use nodemailer to send email when EMAIL_HOST exists', async () => {
        process.env.EMAIL_HOST = 'smtp.resend.com'
        process.env.EMAIL_PORT = '465'
        process.env.EMAIL_USER = 'resend'
        process.env.EMAIL_PASSWORD = 'password123'
        process.env.EMAIL_FROM = 'test@sitamoto.ai'

        const result = await sendEmail({
            to: 'user@example.com',
            subject: 'Test Subject',
            body: '<p>Test Body</p>'
        })

        expect(result).toBe(true)
        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            host: 'smtp.resend.com',
            port: 465,
            secure: true,
            auth: {
                user: 'resend',
                pass: 'password123'
            }
        })
    })

    it('should fall back to mock log if EMAIL_HOST is missing in development', async () => {
        delete process.env.EMAIL_HOST
        // @ts-expect-error - readonly property in tests
        process.env.NODE_ENV = 'development'

        // spy on console.log
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

        const result = await sendEmail({
            to: 'user@example.com',
            subject: 'Test Subject',
            body: '<p>Test Body</p>'
        })

        expect(result).toBe(true)
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[EMAIL MOCK] Sending email to: user@example.com'))
        expect(nodemailer.createTransport).not.toHaveBeenCalled()

        logSpy.mockRestore()
    })

    it('should return false if sending fails', async () => {
        process.env.EMAIL_HOST = 'smtp.resend.com'

        // Setup the mock to throw an error
        const mockSendMail = vi.fn().mockRejectedValue(new Error('SMTP Error'))
        vi.mocked(nodemailer.createTransport).mockReturnValue({
            sendMail: mockSendMail
        } as any)

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

        const result = await sendEmail({
            to: 'user@example.com',
            subject: 'Fail Subject',
            body: '<p>Fail</p>'
        })

        expect(result).toBe(false)
        expect(consoleSpy).toHaveBeenCalled()

        consoleSpy.mockRestore()
    })
})
