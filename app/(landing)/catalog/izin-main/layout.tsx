import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Izin Main — Permohonan Digital Interaktif | For you, Always.",
  description: "Buat permohonan izin main yang lucu dan personal lewat Studio Editor. Lengkap dengan foto, rencana, janji, musik, live preview, dan surat izin digital.",
  alternates: { canonical: "/catalog/izin-main" },
  openGraph: {
    title: "Izin Main — Kalau Minta Izin Bisa Dibuat Lebih Niat",
    description: "Berkas izin main digital self-edit yang bisa disusun sendiri lalu dikirim kepada pasangan.",
    url: "https://for-you-always.my.id/catalog/izin-main",
    images: [{ url: "/assets/izin-main/hero.webp", width: 1600, height: 1000, alt: "Izin Main interactive digital gift" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Izin Main — Permohonan Digital Interaktif", description: "Susun berkas izin main sendiri lewat Studio Editor.", images: ["/assets/izin-main/hero.webp"] },
};

export default function IzinMainLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
