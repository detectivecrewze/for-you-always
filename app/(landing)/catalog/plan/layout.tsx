import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Plan — Kado Digital Invitation & Rundown Premium | For you, Always.",
  description: "Scrapbook digital premium berisi puzzle foto, invitation, rundown, surat, musik, galeri, dan tiket digital. Terima jadi oleh tim.",
  alternates: { canonical: "/catalog/plan" },
  openGraph: {
    title: "The Plan — Satu Hari yang Direncanakan Khusus Untuknya",
    description: "Kado digital premium yang mengubah rencana kencan menjadi perjalanan scrapbook interaktif.",
    url: "https://for-you-always.my.id/catalog/plan",
    images: [{ url: "/assets/the-plan/hero.webp", width: 1600, height: 1000, alt: "The Plan digital scrapbook gift" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "The Plan — Kado Digital Premium", description: "Puzzle, invitation, rundown, surat, galeri, musik, dan tiket digital.", images: ["/assets/the-plan/hero.webp"] },
};

export default function ThePlanLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
