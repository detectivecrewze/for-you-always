import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sorry Letter — Surat Permintaan Maaf Interaktif | For you, Always.",
  description: "Sampaikan permintaan maaf melalui surat digital interaktif dengan amplop vintage, musik pilihan, maskot, dan ending personal.",
  alternates: { canonical: "/catalog/sorry" },
  openGraph: {
    title: "Sorry Letter — Sampaikan Maafmu, Pelan-pelan",
    description: "Surat permintaan maaf interaktif yang dapat kamu isi sendiri melalui Studio.",
    url: "https://for-you-always.my.id/catalog/sorry",
    images: [{ url: "/assets/sorry-features/sorry-envelope.webp", width: 1440, height: 900, alt: "Amplop vintage produk Sorry Letter" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Sorry Letter — Surat Permintaan Maaf Interaktif", description: "Rangkai surat, musik, dan respons personal dalam satu gift digital.", images: ["/assets/sorry-features/sorry-envelope.webp"] },
};

export default function SorryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
