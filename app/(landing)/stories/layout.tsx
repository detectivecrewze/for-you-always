import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories of Us — Cerita & Testimoni Nyata | For you, Always.",
  description: "Kumpulan pesan, kesan, dan cerita nyata dari pelanggan For you, Always. Lebih dari 1000+ kado dan surat digital telah menemani berbagai momen istimewa.",
  alternates: {
    canonical: "/stories",
  },
  openGraph: {
    title: "Stories of Us — Cerita & Testimoni Nyata | For you, Always.",
    description: "Kumpulan pesan, kesan, dan cerita nyata dari pelanggan For you, Always. Lebih dari 1000+ kado dan surat digital telah menemani berbagai momen istimewa.",
    url: "https://for-you-always.my.id/stories",
    siteName: "For you, Always.",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stories of Us — Cerita & Testimoni Nyata | For you, Always.",
    description: "Kumpulan pesan, kesan, dan cerita nyata dari pelanggan For you, Always.",
  },
};

export default function StoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
