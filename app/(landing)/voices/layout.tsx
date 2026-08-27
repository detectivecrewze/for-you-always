import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/voices" },
};

export default function VoicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
