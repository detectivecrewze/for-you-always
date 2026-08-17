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
        // Cache homepage di Vercel CDN edge selama 60 detik
        // stale-while-revalidate: kirim cache lama sambil update di background
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
