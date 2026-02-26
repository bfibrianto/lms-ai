import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getPresignedUploadUrl } from '@/lib/s3';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const session = await auth();

        // Pastikan user terautentikasi dan memiliki role ADMIN/EMPLOYEE dst.
        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { filename, contentType, folder = 'media' } = await req.json();

        if (!filename || !contentType) {
            return NextResponse.json(
                { error: 'Missing filename or contentType' },
                { status: 400 }
            );
        }

        // Buat safe fileName (hindari bentrok dengan UUID)
        // misal: media/123e4567-e89b-12d3-a456-426614174000-image.png
        const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = `${folder}/${uuidv4()}-${safeFilename}`;

        const { url, fileUrl } = await getPresignedUploadUrl(key, contentType);

        return NextResponse.json({ url, fileUrl, key });
    } catch (error: any) {
        console.error('Error generating presigned URL:', error);
        return NextResponse.json(
            { error: error?.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
