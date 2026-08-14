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
  description: "Delapan kado unik untuk mengabadikan satu cerita. Memoria, Letter, Voices, Mixtape, Invitation, Arcade, Retro, dan Wrapped — kado digital premium yang bisa kamu buat sendiri.",
  openGraph: {
    title: "For you, Always. — Digital Atelier | Kado & Surat Interaktif",
    description: "Delapan kado unik untuk mengabadikan satu cerita. Memoria, Letter, Voices, Mixtape, Invitation, Arcade, Retro, dan Wrapped — kado digital premium yang bisa kamu buat sendiri.",
    url: "https://for-you-always.my.id",
    siteName: "For you, Always.",
    images: [
      {
        url: "https://for-you-always.my.id/assets/opening_gate.png",
        width: 1200,
        height: 630,
        alt: "For you, Always. — Digital Atelier Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "For you, Always. — Digital Atelier | Kado & Surat Interaktif",
    description: "Delapan kado unik untuk mengabadikan satu cerita. Memoria, Letter, Voices, Mixtape, Invitation, Arcade, Retro, dan Wrapped — kado digital premium yang bisa kamu buat sendiri.",
    images: ["https://for-you-always.my.id/assets/opening_gate.png"],
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
        {/* TikTok Pixel */}
        <Script
          id="tiktok-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
              var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
              ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
              ttq.load('D9VP8P3C77UDGUKDU7T0');
              ttq.page();
            }(window, document, 'ttq');`,
          }}
        />
      </body>
    </html>
  );
}
