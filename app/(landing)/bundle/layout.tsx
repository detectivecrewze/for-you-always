import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/bundle" },
};

export default function BundleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
