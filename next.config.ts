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
  async redirects() {
    return [
      {
        source: '/catalog/unbox-the-memory',
        destination: '/catalog/the-gift-box',
        permanent: true,
      },
      {
        source: '/catalog/unbox-the-memory/checkout',
        destination: '/catalog/the-gift-box/checkout',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
