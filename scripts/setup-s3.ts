import 'dotenv/config';
import { CreateBucketCommand, PutBucketCorsCommand, HeadBucketCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3';
import { s3, S3_BUCKET_NAME } from '../src/lib/s3';

async function main() {
    try {
        console.log(`[INFO] Checking if bucket '${S3_BUCKET_NAME}' exists...`);
        try {
            await s3.send(new HeadBucketCommand({ Bucket: S3_BUCKET_NAME }));
            console.log(`[OK] Bucket '${S3_BUCKET_NAME}' already exists.`);
        } catch (error: any) {
            if (error.$metadata?.httpStatusCode === 404 || error.name === 'NotFound') {
                console.log(`[INFO] Bucket '${S3_BUCKET_NAME}' not found. Creating...`);
                await s3.send(new CreateBucketCommand({ Bucket: S3_BUCKET_NAME }));
                console.log(`[OK] Bucket '${S3_BUCKET_NAME}' created successfully.`);
            } else {
                throw error;
            }
        }

        console.log(`[INFO] Setting public read access policy for bucket '${S3_BUCKET_NAME}'...`);
        const policy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Sid: 'PublicReadGetObject',
                    Effect: 'Allow',
                    Principal: '*',
                    Action: 's3:GetObject',
                    Resource: `arn:aws:s3:::${S3_BUCKET_NAME}/*`
                }
            ]
        };
        await s3.send(new PutBucketPolicyCommand({
            Bucket: S3_BUCKET_NAME,
            Policy: JSON.stringify(policy)
        }));
        console.log(`[OK] Bucket policy set successfully.`);

        console.log(`[INFO] Setting CORS policy for bucket '${S3_BUCKET_NAME}'...`);
        await s3.send(new PutBucketCorsCommand({
            Bucket: S3_BUCKET_NAME,
            CORSConfiguration: {
                CORSRules: [
                    {
                        AllowedHeaders: ['*'],
                        AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
                        AllowedOrigins: ['*'], // Ganti dengan http://localhost:3000 jika ingin strict
                        ExposeHeaders: ['ETag'],
                        MaxAgeSeconds: 3600,
                    }
                ]
            }
        }));
        console.log(`[OK] CORS policy set successfully.`);

    } catch (error) {
        console.error('[ERROR] Failed initializing S3 bucket:', error);
        process.exit(1);
    }
}

main();
