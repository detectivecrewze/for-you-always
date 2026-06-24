import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.for-you-always.my.id',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
