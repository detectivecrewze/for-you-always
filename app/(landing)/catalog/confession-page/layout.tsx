import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confession Page — Cara Playful Bilang Suka",
  description: "Buat confession yang lebih personal dengan puzzle foto, cerita komik, musik, dan pertanyaan akhir. Edit sendiri lalu bagikan.",
  alternates: { canonical: "/catalog/confession-page" },
  openGraph: {
    title: "Confession Page — For you, Always.",
    description: "Puzzle foto, cerita komik, dan pertanyaan akhir dalam satu gift interaktif.",
    url: "https://for-you-always.my.id/catalog/confession-page",
    images: [{ url: "/assets/confession-page/hero.webp", width: 1600, height: 1000, alt: "Confession Page comic gift" }],
  },
  twitter: { card: "summary_large_image", title: "Confession Page", description: "Cara playful untuk bilang suka.", images: ["/assets/confession-page/hero.webp"] },
};

export default function ConfessionPageLayout({ children }: { children: React.ReactNode }) { return children; }
