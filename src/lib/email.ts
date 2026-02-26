/**
 * Mock Email Service for LMS AI
 * In a real-world scenario, you would replace this with Resend, Sendgrid, or Nodemailer.
 */

export async function sendEmail(params: {
    to: string
    subject: string
    body: string
}) {
    if (process.env.NODE_ENV === 'development') {
        console.log('\n================================')
        console.log(`[EMAIL MOCK] Sending email to: ${params.to}`)
        console.log(`Subject: ${params.subject}`)
        console.log('--- Body ---')
        console.log(params.body)
        console.log('================================\n')
    }

    // Pretend we send the email successfully
    return true
}
