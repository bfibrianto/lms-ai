const { S3Client, CreateBucketCommand, HeadBucketCommand, PutBucketPolicyCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env' });

const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
const minioEndpoint = process.env.MINIO_ENDPOINT || 'localhost';
const minioPort = process.env.MINIO_PORT ? `:${process.env.MINIO_PORT}` : ':9000';
const fullEndpoint = process.env.S3_ENDPOINT || `${protocol}://${minioEndpoint}${minioPort}`;
const bucketName = process.env.MINIO_BUCKET || process.env.S3_BUCKET_NAME || 'lms-media';

const s3 = new S3Client({
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: fullEndpoint,
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || process.env.S3_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.MINIO_SECRET_KEY || process.env.S3_SECRET_KEY || 'minioadmin',
    },
    forcePathStyle: true,
});

async function initBucket() {
    console.log(`Checking connection to MinIO at ${fullEndpoint}...`);
    try {
        await s3.send(new HeadBucketCommand({ Bucket: bucketName }));
        console.log(`Bucket '${bucketName}' already exists. Ready to use!`);
    } catch (error) {
        if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
            console.log(`Bucket '${bucketName}' does not exist. Creating...`);
            try {
                await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
                console.log(`✅ Bucket '${bucketName}' created successfully.`);

                // Set bucket policy for public read access
                const policy = {
                    Version: "2012-10-17",
                    Statement: [
                        {
                            Effect: "Allow",
                            Principal: "*",
                            Action: ["s3:GetObject"],
                            Resource: [`arn:aws:s3:::${bucketName}/*`]
                        }
                    ]
                };

                await s3.send(new PutBucketPolicyCommand({
                    Bucket: bucketName,
                    Policy: JSON.stringify(policy)
                }));
                console.log(`✅ Public read policy attached to '${bucketName}'.`);
            } catch (createErr) {
                console.error('❌ Error creating bucket or setting policy:', createErr.message);
                process.exit(1);
            }
        } else {
            console.error('❌ Error checking bucket:', error.message);
            console.error('Ensure MinIO is running and credentials in .env are correct.');
            process.exit(1);
        }
    }
}

initBucket();
