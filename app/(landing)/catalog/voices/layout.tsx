import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voices Gift - Kado Suara & Foto | For you, Always.",
  description: "Rangkai kenangan visual dan audio menjadi satu memori abadi bernuansa sinematik. Ungkapkan perasaanmu secara langsung.",
  openGraph: {
    title: "Voices Gift - Kado Suara & Foto",
    description: "Rangkai kenangan visual dan audio menjadi satu memori abadi bernuansa sinematik.",
    images: ["https://cdn.for-you-always.my.id/1781123503121-y6uhb.png"],
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
