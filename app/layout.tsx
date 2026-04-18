import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "For you, Always. — Digital Atelier",
  description: "Tiga cara berbeda untuk mengabadikan satu cerita. Voices, Arcade, dan Wrapped — kado digital premium yang bisa kamu buat sendiri.",
  openGraph: {
    title: "For you, Always. — Digital Atelier",
    description: "Tiga cara berbeda untuk mengabadikan satu cerita. Voices, Arcade, dan Wrapped — kado digital premium yang bisa kamu buat sendiri.",
    url: "https://for-you-always.my.id",
    siteName: "For you, Always.",
    images: [
      {
        url: "https://bpahzgewtgfjwobjrpdk.supabase.co/storage/v1/object/public/assets/voices.gif",
        width: 800,
        height: 1000,
        alt: "For you, Always. — Digital Atelier Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "For you, Always. — Digital Atelier",
    description: "Tiga cara berbeda untuk mengabadikan satu cerita. Voices, Arcade, dan Wrapped — kado digital premium yang bisa kamu buat sendiri.",
    images: ["https://bpahzgewtgfjwobjrpdk.supabase.co/storage/v1/object/public/assets/voices.gif"],
  },
  icons: {
    icon: [
      { url: "/assets/favicon/favicon.ico" },
      { url: "/assets/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/assets/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/assets/favicon/apple-touch-icon.png",
  },
  manifest: "/assets/favicon/site.webmanifest",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${dmSans.variable} ${cormorant.variable}`}>
      <head>
        <link rel="icon" href="/assets/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/assets/favicon/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/assets/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/assets/favicon/site.webmanifest" />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
