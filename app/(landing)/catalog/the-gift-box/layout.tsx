import type { Metadata } from "next";

const title = "The Gift Box — Kado Fisik dengan Kartu Akses QR Custom | For you, Always.";
const description = "Gift box fisik premium yang dipadukan dengan Kartu Akses QR Custom untuk membuka kado digital personal berisi foto, musik, dan pesan spesial.";
const image = "/assets/classic-kraftbox/kraftbox-hero.jpg";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/catalog/the-gift-box" },
  openGraph: {
    title,
    description,
    url: "/catalog/the-gift-box",
    siteName: "For you, Always.",
    images: [{ url: image, alt: "The Gift Box — For you, Always." }],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
  },
};

export default function GiftBoxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
