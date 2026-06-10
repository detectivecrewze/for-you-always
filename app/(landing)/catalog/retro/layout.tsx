import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retro Gift Card - Windows 98/XP Nostalgia | For you, Always.",
  description: "Kado digital bergaya Windows 98/XP yang nostalgia. Cocok untuk birthday, apology, atau momen spesial apapun. Lengkap dengan GIF pilihan, surat digital, dan musik.",
  openGraph: {
    title: "Retro Gift Card - Windows 98/XP Nostalgia",
    description: "Kado digital bergaya Windows 98/XP yang nostalgia. Cocok untuk birthday, apology, atau momen spesial apapun.",
    images: ["https://cdn.for-you-always.my.id/1778444079509-72xi4d.png"],
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
