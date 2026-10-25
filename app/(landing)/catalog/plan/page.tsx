"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import CartCheckoutModal from "../../../components/CartCheckoutModal";
import DemoPreviewModal from "../../../components/LazyDemoPreviewModal";
import type { DemoCloseReason, DemoPreviewVariant } from "../../../components/DemoPreviewModal";
import type { CartItem } from "../../../context/CartContext";
import { trackViewContent } from "@/lib/pixel";

const DEMO_URL = "https://the-plan-iota.vercel.app/";
const PRODUCT: CartItem = {
  id: "plan",
  title: "The Plan",
  numericPrice: 40000,
  themeColor: "#8f332f",
  themeImgSrc: "/assets/the-plan/hero.webp",
};
const DEMO_VARIANTS: readonly DemoPreviewVariant[] = [
  { id: "complete", label: "Full Experience", src: DEMO_URL, subtitle: "Puzzle, invitation, rundown, surat, galeri, dan tiket digital" },
];

function capture(event: string, properties: Record<string, unknown>) {
  void import("posthog-js").then(({ default: posthog }) => posthog.capture(event, properties)).catch(() => {});
}

export default function ThePlanCatalogPage() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const openedAt = useRef(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackViewContent({ id: "plan", name: "The Plan", price: 40000 });
    capture("product_viewed", { product_id: "plan", price: 40000, currency: "IDR", source: "product_detail" });
  }, []);

  const openDemo = useCallback(() => {
    openedAt.current = performance.now();
    setDemoOpen(true);
    capture("product_demo_opened", { product_id: "plan", source: "product_detail" });
  }, []);
  const closeDemo = useCallback((reason: DemoCloseReason) => {
    capture("product_demo_closed", { product_id: "plan", close_method: reason, open_duration_ms: Math.round(performance.now() - openedAt.current) });
    setDemoOpen(false);
  }, []);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "The Plan",
    image: "https://for-you-always.my.id/assets/the-plan/hero.webp",
    description: "Kado digital premium berbentuk scrapbook interaktif dengan puzzle foto, invitation, rundown, surat, galeri, musik, dan tiket digital.",
    brand: { "@type": "Brand", name: "For you, Always." },
    offers: { "@type": "Offer", priceCurrency: "IDR", price: "40000", availability: "https://schema.org/InStock", url: "https://for-you-always.my.id/catalog/plan" },
  };

  return (
    <main style={{ minHeight: "100vh", background: "#faf7f2" }}>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px clamp(16px, 4vw, 40px) 40px" }}>
        <Link href="/catalog" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "#a88365", textDecoration: "none", letterSpacing: ".05em", textTransform: "uppercase" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19 3 12m0 0 7-7m-7 7h18" /></svg>
          Kembali ke Katalog
        </Link>
      </div>
      <section style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
          <LandscapeProductCard
            productId="plan"
            label={<span>The Plan <span style={{ opacity: .5 }}>•</span> Premium Terima Jadi</span>}
            title="The Plan"
            description="Satu hari yang kamu rencanakan untuknya, dirangkai tim menjadi scrapbook digital yang hangat dan interaktif. Customer cukup mengisi form; kami mengurus susunan cerita, desain, dan detail gift-nya."
            features={["Puzzle Foto Interaktif", "Invitation & Rundown dalam Animasi Printer", "Surat, Musik, Foto & Video", "Tiket Digital Siap Unduh atau Bagikan", "Terima Jadi oleh Tim"]}
            animatedFeatureIcons
            salesCountPlacement="media"
            price="Rp 40.000"
            demoLink={DEMO_URL}
            demoLabel="Lihat Demo"
            fallbackImgSrc="/assets/the-plan/hero.webp"
            mediaType="image"
            accentColor="#8f332f"
            accentGlow="rgba(143,51,47,.2)"
            onAddToCart={() => setCheckoutOpen(true)}
            themesLabel="Yang Akan Kamu Dapat"
            themes={[
              { name: "Opening Puzzle", desc: "Tiga keping foto membuka perjalanan gift secara interaktif.", color: "#8f332f", fallbackImgSrc: "/assets/the-plan/opening.webp" },
              { name: "Hero & Soundtrack", desc: "Cerita utama, foto, dan lagu personal dalam satu komposisi scrapbook.", color: "#8f332f", fallbackImgSrc: "/assets/the-plan/hero.webp" },
              { name: "Spotify-style Player", desc: "Soundtrack pilihan hadir dalam pemutar musik yang menyatu dengan gift.", color: "#8f332f", fallbackImgSrc: "/assets/the-plan/music.webp" },
              { name: "Printed Invitation", desc: "Undangan tercetak dari printer digital dengan detail tanggal, waktu, dan tempat.", color: "#8f332f", fallbackImgSrc: "/assets/the-plan/invitation.webp" },
              { name: "Event Rundown", desc: "Susunan acara tampil sebagai perjalanan waktu dengan agenda dan catatan personal.", color: "#8f332f", fallbackImgSrc: "/assets/the-plan/rundown.webp" },
              { name: "Personal Letter", desc: "Surat personal dirangkai menjadi halaman handmade yang hangat.", color: "#8f332f", fallbackImgSrc: "/assets/the-plan/letter.webp" },
              { name: "Photo & Video Gallery", desc: "Kenangan tampil dalam bingkai stamp untuk foto dan video.", color: "#8f332f", fallbackImgSrc: "/assets/the-plan/gallery.webp" },
              { name: "Interactive Closing", desc: "Pertanyaan akhir mengajak penerima memberi jawaban untuk rencana spesialnya.", color: "#8f332f", fallbackImgSrc: "/assets/the-plan/closing.webp" },
              { name: "Digital Ticket", desc: "Printer akhir menghasilkan tiket 9:16 yang siap diunduh atau dibagikan.", color: "#8f332f", fallbackImgSrc: "/assets/the-plan/ticket.webp" },
            ]}
            initialSelectedIndex={1}
            autoCycle={false}
            priority
            onDemoOpen={openDemo}
          />
        </div>
      </section>
      {checkoutOpen && <CartCheckoutModal directItem={PRODUCT} onClose={() => setCheckoutOpen(false)} />}
      {demoOpen && (
        <DemoPreviewModal
          isOpen src={DEMO_URL} title="Demo The Plan" subtitle="Jelajahi perjalanan lengkap dari puzzle hingga tiket digital" productName="The Plan" price="Rp 40.000"
          theme="memoria" variants={DEMO_VARIANTS} initialVariantId="complete" orderButtonLabel="Pesan The Plan"
          onClose={closeDemo} onOrder={() => { setDemoOpen(false); setCheckoutOpen(true); }}
          onLoaded={(loadTimeMs) => capture("product_demo_loaded", { product_id: "plan", load_time_ms: loadTimeMs })}
        />
      )}
    </main>
  );
}
