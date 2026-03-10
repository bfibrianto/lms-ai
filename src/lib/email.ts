import nodemailer from 'nodemailer'

export interface SendEmailParams {
    to: string
    subject: string
    body: string // HTML content
}

/**
 * Send an email using the configured SMTP server.
 * Returns true if successful, false otherwise.
 */
export async function sendEmail({ to, subject, body }: SendEmailParams): Promise<boolean> {
    try {
        // Fallback to mock behavior if SMTP settings are completely missing
        if (!process.env.EMAIL_HOST && process.env.NODE_ENV === 'development') {
            console.log('\n================================')
            console.log(`[EMAIL MOCK] Sending email to: ${to}`)
            console.log(`Subject: ${subject}`)
            console.log('--- Body ---')
            console.log(body)
            console.log('================================\n')
            return true
        }

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 465,
            secure: Number(process.env.EMAIL_PORT) === 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        })

        await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'LMS AI <academy@sitamoto.ai>',
            to,
            subject,
            html: body,
        })

        return true
    } catch (error) {
        console.error('[EMAIL MOCK/ERROR] Failed to send email to', to, error)
        return false
    }
}
