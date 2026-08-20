import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Birthday Scrapbook - Kado Ulang Tahun Digital Retro | For you, Always.",
  description: "Kado ulang tahun digital interaktif bergaya komik retro dengan 4 ruangan kejutan, pemutar musik, galeri polaroid, dan wish inbox.",
  openGraph: {
    title: "Birthday Scrapbook - Kado Ulang Tahun Digital Retro",
    description: "Kado ulang tahun digital interaktif bergaya komik retro dengan 4 ruangan kejutan, pemutar musik, galeri polaroid, dan wish inbox.",
    url: "https://for-you-always.my.id/catalog/birthday",
    siteName: "For you, Always.",
    images: [
      {
        url: "https://for-you-always.my.id/assets/snoopy-features/main-card-updatesnoopy.webp",
        width: 1200,
        height: 630,
        alt: "Birthday Scrapbook — For you, Always.",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Birthday Scrapbook - Kado Ulang Tahun Digital Retro",
    description: "Kado ulang tahun digital interaktif bergaya komik retro dengan 4 ruangan kejutan, pemutar musik, galeri polaroid, dan wish inbox.",
    images: ["https://for-you-always.my.id/assets/snoopy-features/main-card-updatesnoopy.webp"],
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
