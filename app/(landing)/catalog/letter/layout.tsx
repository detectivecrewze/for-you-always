import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Letter Edition - Surat Digital Aesthetic | For you, Always.",
  description: "Sampaikan pesan bermakna melalui surat digital bernuansa sinematik. Hadir dengan amplop interaktif, efek typewriter klasik, dan kustomisasi eksklusif.",
  openGraph: {
    title: "Letter Edition - Surat Digital Aesthetic",
    description: "Sampaikan pesan bermakna melalui surat digital bernuansa sinematik.",
    images: ["https://cdn.for-you-always.my.id/1781032720701-5lb1a.png"],
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
