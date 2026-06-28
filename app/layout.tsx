import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
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
  metadataBase: new URL("https://for-you-always.my.id"),
  alternates: { canonical: '/' },
  title: "For you, Always. — Digital Atelier | Kado & Surat Interaktif",
  description: "Tiga cara berbeda untuk mengabadikan satu cerita. Voices, Arcade, dan Wrapped — kado digital premium yang bisa kamu buat sendiri.",
  openGraph: {
    title: "For you, Always. — Digital Atelier | Kado & Surat Interaktif",
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
    title: "For you, Always. — Digital Atelier | Kado & Surat Interaktif",
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
  verification: {
    google: "xioDWch2qaMHQ9tLJDUxKtV1oddFipFpL2IVhOp0PLU",
  },
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
        <link rel="preload" href="https://cdn.for-you-always.my.id/1781807802981-yohlpk.gif" as="image" />
        <link rel="icon" href="/assets/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/assets/favicon/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/assets/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/assets/favicon/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "For you, Always.",
              "url": "https://for-you-always.my.id",
              "logo": "https://for-you-always.my.id/logo.png",
              "description": "Digital Atelier khusus kado digital premium dan surat interaktif.",
              "sameAs": [
                "https://instagram.com/foryoualways.id"
              ]
            })
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
        {/* Google Analytics GA4 — afterInteractive agar tidak blokir LCP */}
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-ZSS29T9B71"
        />
        <Script
          id="google-analytics-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZSS29T9B71');
            `,
          }}
        />
        {/* Microsoft Clarity — loaded after page is interactive, no LCP impact */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xdgwjss71o");`,
          }}
        />
      </body>
    </html>
  );
}
