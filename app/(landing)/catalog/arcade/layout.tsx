import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arcade Edition - Petualangan Interaktif | For you, Always.",
  description: "Bawa dia ke dalam petualangan menyusuri 10 ruangan interaktif yang menceritakan perjalanan hubungan kalian.",
  openGraph: {
    title: "Arcade Edition - Petualangan Interaktif",
    description: "Bawa dia ke dalam petualangan menyusuri 10 ruangan interaktif yang menceritakan perjalanan hubungan kalian.",
    images: ["https://cdn.for-you-always.my.id/1777884639353-xogjtd.webp"],
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
