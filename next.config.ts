import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: (process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http') as 'http' | 'https',
        hostname: process.env.MINIO_ENDPOINT || 'localhost',
        port: process.env.MINIO_PORT || '9000',
        pathname: `/${process.env.MINIO_BUCKET || 'lms-media'}/**`,
      },
      {
        protocol: 'https',
        hostname: 'minio.tandeem.co.id',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '109.199.120.180',
        port: '9004',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
