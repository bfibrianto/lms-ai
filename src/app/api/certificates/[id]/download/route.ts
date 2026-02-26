import { NextRequest, NextResponse } from 'next/server'
import { getCertificateDetail } from '@/lib/actions/certificates'
import { renderToStream } from '@react-pdf/renderer'
import { CertificateDocument } from '@/components/pdf/certificate-document'
import { format } from 'date-fns'

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const certificate = await getCertificateDetail(params.id)

        if (!certificate) {
            return new NextResponse('Certificate not found', { status: 404 })
        }

        const itemName = certificate.course?.title || certificate.path?.title || 'Unknown Program'
        const dateStr = format(new Date(certificate.issuedAt), 'MMMM dd, yyyy')
        // The URL for verification (we assume localhost:3000 for dev, but really should use env var)
        // using req.nextUrl.origin for a more robust approach
        const verificationUrl = `${request.nextUrl.origin}/verify/${certificate.id}`

        const stream = await renderToStream(
            // Need to pass it as JSX element, workaround for TS errors with custom component
            CertificateDocument({
                studentName: certificate.user.name,
                itemName: itemName,
                date: dateStr,
                certificateId: certificate.id,
                verificationUrl: verificationUrl
            }) as any
        )

        // Transform NodeJS Readable stream to Web ReadableStream
        const webStream = new ReadableStream({
            start(controller) {
                stream.on('data', (chunk) => controller.enqueue(chunk))
                stream.on('end', () => controller.close())
                stream.on('error', (err) => controller.error(err))
            }
        })

        const response = new NextResponse(webStream, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="Certificate-${certificate.id}.pdf"`,
            },
        })

        return response
    } catch (error) {
        console.error('Error generating PDF:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
