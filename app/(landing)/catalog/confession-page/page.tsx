"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import CartCheckoutModal from "../../../components/CartCheckoutModal";
import PurchaseModeModal, { type PurchaseModeConfig } from "../../../components/PurchaseModeModal";
import DemoPreviewModal from "../../../components/LazyDemoPreviewModal";
import type { DemoCloseReason } from "../../../components/DemoPreviewModal";
import type { CartItem } from "../../../context/CartContext";
import { trackViewContent } from "@/lib/pixel";
import { CONFESSION_PAGE_DEMO_URL, CONFESSION_PAGE_THEME_SWATCHES } from "@/lib/storefront-demo-config";
import { createDoneForYouItem, getDigitalPurchaseOption } from "@/lib/purchase-options";

const PRODUCT: CartItem = {
  id: "confession-page",
  title: "Confession Page",
  numericPrice: 20000,
  themeColor: "#c4900a",
  themeImgSrc: "/assets/confession-page/hero.webp",
  fulfillmentMode: "self_service",
};

function capture(event: string, properties: Record<string, unknown>) {
  void import("posthog-js").then(({ default: posthog }) => posthog.capture(event, properties)).catch(() => {});
}

export default function ConfessionPageCatalogPage() {
  const [checkoutItem, setCheckoutItem] = useState<CartItem | null>(null);
  const [purchaseModeConfig, setPurchaseModeConfig] = useState<PurchaseModeConfig | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const openedAt = useRef(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackViewContent({ id: "confession-page", name: "Confession Page", price: 20000 });
    capture("product_viewed", { product_id: "confession-page", price: 20000, currency: "IDR", source: "product_detail" });
  }, []);

  const openPurchaseMode = useCallback(() => {
    const option = getDigitalPurchaseOption("confession-page");
    if (!option) {
      setCheckoutItem({ ...PRODUCT, fulfillmentMode: "self_service" });
      return;
    }
    setPurchaseModeConfig({
      productId: option.id,
      productTitle: option.title,
      themeColor: option.themeColor,
      selfServicePrice: option.basePrice,
      doneForYouPrice: option.doneForYouPrice,
      onSelectSelfService: () => setCheckoutItem({ ...PRODUCT, fulfillmentMode: "self_service" }),
      onSelectDoneForYou: () => {
        const item = createDoneForYouItem(PRODUCT.id);
        if (item) setCheckoutItem(item);
      },
    });
  }, []);

  const openDemo = useCallback(() => {
    openedAt.current = performance.now();
    setDemoOpen(true);
    capture("product_demo_opened", { product_id: "confession-page", source: "product_detail" });
  }, []);
  const closeDemo = useCallback((reason: DemoCloseReason) => {
    capture("product_demo_closed", { product_id: "confession-page", close_method: reason, open_duration_ms: Math.round(performance.now() - openedAt.current) });
    setDemoOpen(false);
  }, []);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Confession Page",
    image: "https://for-you-always.my.id/assets/confession-page/hero.webp",
    description: "Ungkapkan perasaan kepada gebetan lewat gift komik interaktif berisi foto, pesan personal, musik, dan pertanyaan yang ingin kamu ajukan.",
    brand: { "@type": "Brand", name: "For you, Always." },
    offers: { "@type": "Offer", priceCurrency: "IDR", price: "20000", availability: "https://schema.org/InStock", url: "https://for-you-always.my.id/catalog/confession-page" },
  };

  return (
    <main style={{ minHeight: "100vh", background: "#faf7f2" }}>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px clamp(16px, 4vw, 40px) 40px" }}>
        <Link href="/catalog" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "#9f7a10", textDecoration: "none", letterSpacing: ".05em", textTransform: "uppercase" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19 3 12m0 0 7-7m-7 7h18" /></svg>
          Kembali ke Katalog
        </Link>
      </div>
      <section style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
          <LandscapeProductCard
            productId="confession-page"
            label={<span>Confession Page <span style={{ opacity: .5 }}>•</span> Self Edit / Terima Jadi</span>}
            title="Confession Page"
            description="Sampaikan perasaanmu dengan cara yang lebih personal. Rangkai foto, pesan, dan lagu menjadi cerita komik interaktif, lalu tutup dengan pertanyaan yang selama ini ingin kamu ajukan."
            features={["Puzzle foto sebagai pembuka cerita", "Kata-kata personal untuk mengungkapkan isi hati", "Lagu pilihan yang menemani ceritamu", "Jawaban interaktif di akhir cerita"]}
            animatedFeatureIcons
            salesCountPlacement="media"
            price="Mulai Rp 20.000"
            demoLink={CONFESSION_PAGE_DEMO_URL}
            demoLabel="Lihat Demo"
            fallbackImgSrc="/assets/confession-page/hero.webp"
            themesLabel="Koleksi Pages"
            themes={[
              { name: "Opening & Puzzle", desc: "Susun potongan foto untuk membuka cerita kecil ini.", fallbackImgSrc: "/assets/confession-page/puzzle.webp" },
              { name: "Opening", desc: "Sapaan personal yang menjadi awal dari ceritamu.", fallbackImgSrc: "/assets/confession-page/opening.webp" },
              { name: "Chapter 1 · Awal Cerita", desc: "Satu momen dan cerita singkat tentang bagaimana semuanya dimulai.", fallbackImgSrc: "/assets/confession-page/chapter-1.webp" },
              { name: "Chapter 2 · Kenapa Kamu", desc: "Hal-hal sederhana yang membuat dia terasa istimewa.", fallbackImgSrc: "/assets/confession-page/chapter-2.webp" },
              { name: "Isi Hati", desc: "Pesan personal untuk mengungkapkan perasaanmu.", fallbackImgSrc: "/assets/confession-page/letter.webp" },
              { name: "Pertanyaan Akhir", desc: "Tutup cerita dengan pertanyaan yang ingin kamu sampaikan.", fallbackImgSrc: "/assets/confession-page/hero.webp" },
            ]}
            initialSelectedIndex={0}
            mediaType="image"
            accentColor="#c4900a"
            accentGlow="rgba(196,144,10,.18)"
            onAddToCart={openPurchaseMode}
            autoCycle={false}
            priority
            onDemoOpen={openDemo}
          />
        </div>
      </section>
      {purchaseModeConfig && <PurchaseModeModal config={purchaseModeConfig} onClose={() => setPurchaseModeConfig(null)} />}
      {checkoutItem && <CartCheckoutModal directItem={checkoutItem} onClose={() => setCheckoutItem(null)} />}
      {demoOpen && (
        <DemoPreviewModal
          isOpen src={`${CONFESSION_PAGE_DEMO_URL}&section=puzzle`} title="Demo Confession Page" subtitle="Lihat puzzle foto, cerita komik, surat, dan jawaban akhir" productName="Confession Page" price="Rp 20.000"
          theme="birthday" themeSwatches={CONFESSION_PAGE_THEME_SWATCHES} initialSwatchId="classic" orderButtonLabel="Pesan Confession Page"
          onClose={closeDemo} onOrder={() => { setDemoOpen(false); openPurchaseMode(); }}
          onLoaded={(loadTimeMs) => capture("product_demo_loaded", { product_id: "confession-page", load_time_ms: loadTimeMs })}
        />
      )}
    </main>
  );
}
