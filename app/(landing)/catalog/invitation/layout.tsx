import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invitation Edition - Undangan Kencan Interaktif | For you, Always.",
  description: "Kirimkan undangan kencan yang manis dan interaktif. Amplop digital, pilih tanggal, aktivitas, dress code, dan tiket kencan eksklusif sebagai kenangan.",
  openGraph: {
    title: "Invitation Edition - Undangan Kencan Interaktif",
    description: "Kirimkan undangan kencan yang manis dan interaktif kepada orang spesialmu.",
    images: ["/assets/opening_gate.png"],
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
