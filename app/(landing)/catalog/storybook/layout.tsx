import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Storybook Edition — Kado Digital Buku Cerita Komik | For you, Always.",
  description: "Rangkai foto, tempat, lagu, dan surat menjadi Storybook interaktif dengan lima room personal bertema Spider-Man atau Batman.",
  alternates: { canonical: "/catalog/storybook" },
  openGraph: {
    title: "Storybook Edition — Lima Room untuk Satu Cerita",
    description: "Kado digital buku cerita komik dengan Atlas, galeri, soundtrack, surat, dan finale personal.",
    url: "https://for-you-always.my.id/catalog/storybook",
    images: [{ url: "/assets/storybook-features/spiderman-box.jpg", width: 1280, height: 720, alt: "Storybook Edition bertema komik Spider-Man" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Storybook Edition — Kado Digital Buku Cerita Komik", description: "Lima room personal dengan tema Spider-Man dan Batman.", images: ["/assets/storybook-features/spiderman-box.jpg"] },
};

export default function StorybookLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
