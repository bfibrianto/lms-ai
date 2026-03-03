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
    ],
  },
};

export default nextConfig;
