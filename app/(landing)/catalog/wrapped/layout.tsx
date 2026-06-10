import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wrapped Edition - Rekap Perjalanan Spesial | For you, Always.",
  description: "Kado digital 6 halaman interaktif. Pilih lagu, galeri, rekap perjalanan, hingga surat yang bisa dibuka kapan saja.",
  openGraph: {
    title: "Wrapped Edition - Rekap Perjalanan Spesial",
    description: "Kado digital 6 halaman interaktif. Pilih lagu, galeri, rekap perjalanan, hingga surat yang bisa dibuka kapan saja.",
    images: ["https://cdn.for-you-always.my.id/1777887751232-efe0ge.webp"],
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
