import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const globalForS3 = globalThis as unknown as {
    s3: S3Client | undefined;
};

const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
const minioEndpoint = process.env.MINIO_ENDPOINT || 'localhost';
const minioPort = process.env.MINIO_PORT ? `:${process.env.MINIO_PORT}` : ':9000';
const fullEndpoint = process.env.S3_ENDPOINT || `${protocol}://${minioEndpoint}${minioPort}`;

export const s3 =
    globalForS3.s3 ??
    new S3Client({
        region: process.env.S3_REGION || 'us-east-1',
        endpoint: fullEndpoint,
        credentials: {
            accessKeyId: process.env.MINIO_ACCESS_KEY || process.env.S3_ACCESS_KEY || 'minioadmin',
            secretAccessKey: process.env.MINIO_SECRET_KEY || process.env.S3_SECRET_KEY || 'minioadmin',
        },
        forcePathStyle: true, // Required for MinIO
    });

if (process.env.NODE_ENV !== 'production') globalForS3.s3 = s3;

export const S3_BUCKET_NAME = process.env.MINIO_BUCKET || process.env.S3_BUCKET_NAME || 'lms-media';

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
    const fileUrl = `${fullEndpoint}/${S3_BUCKET_NAME}/${fileName}`;

    return { url, fileUrl };
}
