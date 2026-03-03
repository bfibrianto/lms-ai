#!/usr/bin/env node

/**
 * Setup MinIO bucket CORS policy.
 * Run: node scripts/setup-minio-cors.js
 * 
 * Requires: MINIO_ENDPOINT, MINIO_PORT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET
 */

const http = require('http');
const crypto = require('crypto');

const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
const port = parseInt(process.env.MINIO_PORT || '9000');
const accessKey = process.env.MINIO_ACCESS_KEY || 'minioadmin';
const secretKey = process.env.MINIO_SECRET_KEY || 'minioadmin';
const bucket = process.env.MINIO_BUCKET || 'lms-media';

const corsConfig = `<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <ExposeHeader>ETag</ExposeHeader>
    <MaxAgeSeconds>3600</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>`;

function hmacSHA256(key, data) {
    return crypto.createHmac('sha256', key).update(data).digest();
}

function sha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

function getSignatureKey(key, dateStamp, regionName, serviceName) {
    const kDate = hmacSHA256('AWS4' + key, dateStamp);
    const kRegion = hmacSHA256(kDate, regionName);
    const kService = hmacSHA256(kRegion, serviceName);
    const kSigning = hmacSHA256(kService, 'aws4_request');
    return kSigning;
}

function makeRequest() {
    const now = new Date();
    const dateStamp = now.toISOString().replace(/[-:]/g, '').slice(0, 8);
    const amzDate = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const region = 'us-east-1';
    const service = 's3';

    const payloadHash = sha256(corsConfig);
    const canonicalUri = `/${bucket}`;
    const canonicalQuerystring = 'cors=';
    const canonicalHeaders = `host:${endpoint}:${port}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';

    const canonicalRequest = `PUT\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${sha256(canonicalRequest)}`;

    const signingKey = getSignatureKey(secretKey, dateStamp, region, service);
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

    const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const options = {
        hostname: endpoint,
        port: port,
        path: `/${bucket}?cors=`,
        method: 'PUT',
        headers: {
            'Host': `${endpoint}:${port}`,
            'Content-Type': 'application/xml',
            'Content-Length': Buffer.byteLength(corsConfig),
            'x-amz-content-sha256': payloadHash,
            'x-amz-date': amzDate,
            'Authorization': authorization,
        },
    };

    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log('✅ MinIO CORS policy set successfully for bucket:', bucket);
            } else {
                console.error(`❌ Failed to set CORS (HTTP ${res.statusCode}):`, body);
            }
        });
    });

    req.on('error', (err) => {
        console.error('❌ Connection error:', err.message);
    });

    req.write(corsConfig);
    req.end();
}

// Also try to set bucket policy to public-read for GET
function setBucketPolicy() {
    const policy = JSON.stringify({
        Version: '2012-10-17',
        Statement: [
            {
                Sid: 'PublicRead',
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${bucket}/*`],
            },
        ],
    });

    const now = new Date();
    const dateStamp = now.toISOString().replace(/[-:]/g, '').slice(0, 8);
    const amzDate = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const region = 'us-east-1';
    const service = 's3';

    const payloadHash = sha256(policy);
    const canonicalUri = `/${bucket}`;
    const canonicalQuerystring = 'policy=';
    const canonicalHeaders = `host:${endpoint}:${port}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';

    const canonicalRequest = `PUT\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${sha256(canonicalRequest)}`;

    const signingKey = getSignatureKey(secretKey, dateStamp, region, service);
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

    const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const options = {
        hostname: endpoint,
        port: port,
        path: `/${bucket}?policy=`,
        method: 'PUT',
        headers: {
            'Host': `${endpoint}:${port}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(policy),
            'x-amz-content-sha256': payloadHash,
            'x-amz-date': amzDate,
            'Authorization': authorization,
        },
    };

    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
            if (res.statusCode === 200 || res.statusCode === 204) {
                console.log('✅ MinIO bucket policy (public-read) set successfully for bucket:', bucket);
            } else {
                console.error(`❌ Failed to set bucket policy (HTTP ${res.statusCode}):`, body);
            }
        });
    });

    req.on('error', (err) => {
        console.error('❌ Connection error:', err.message);
    });

    req.write(policy);
    req.end();
}

console.log(`Setting up MinIO CORS for ${endpoint}:${port}/${bucket}...`);
makeRequest();
setBucketPolicy();
