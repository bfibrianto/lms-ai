import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const globalForS3 = globalThis as unknown as {
    s3: S3Client | undefined;
};

export const s3 =
    globalForS3.s3 ??
    new S3Client({
        region: process.env.S3_REGION || 'us-east-1',
        endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
            secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
        },
        forcePathStyle: true, // Required for MinIO
    });

if (process.env.NODE_ENV !== 'production') globalForS3.s3 = s3;

export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'lms-media';

/**
 * Generate a presigned URL for uploading a file directly from the client.
 */
export async function getPresignedUploadUrl(
    fileName: string,
    contentType: string,
    expiresInSeconds = 3600
) {
    const command = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: fileName,
        ContentType: contentType,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });

    // Compute public file URL assuming MinIO/S3 structure.
    // E.g., http://localhost:9000/lms-media/folder/file.png
    const fileUrl = `${process.env.S3_ENDPOINT || 'http://localhost:9000'}/${S3_BUCKET_NAME}/${fileName}`;

    return { url, fileUrl };
}
