import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memoria - Kado Digital Premium (Done For You) | For you, Always.",
  description: "Serahkan materinya kepada Digital Atelier kami, dan kami akan menciptakan pengalaman kado digital paling premium untuk orang tersayang Anda.",
  openGraph: {
    title: "Memoria - Kado Digital Premium",
    description: "Serahkan materinya kepada Digital Atelier kami, dan kami akan menciptakan pengalaman kado digital paling premium untuk orang tersayang Anda.",
    images: ["https://for-you-always.my.id/assets/opening_gate.png"],
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
