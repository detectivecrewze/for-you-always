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
import { IZIN_MAIN_DEMO_URL, IZIN_MAIN_DEMO_VARIANTS, IZIN_MAIN_THEME_SWATCHES } from "@/lib/storefront-demo-config";
import { createDoneForYouItem, getDigitalPurchaseOption } from "@/lib/purchase-options";

const PRODUCT: CartItem = {
  id: "izin-main",
  title: "Izin Main",
  numericPrice: 15000,
  themeColor: "#6b4a37",
  themeImgSrc: "/assets/izin-main/hero.webp",
};

function capture(event: string, properties: Record<string, unknown>) {
  void import("posthog-js").then(({ default: posthog }) => posthog.capture(event, properties)).catch(() => {});
}

export default function IzinMainCatalogPage() {
  const [checkoutItem, setCheckoutItem] = useState<CartItem | null>(null);
  const [purchaseModeConfig, setPurchaseModeConfig] = useState<PurchaseModeConfig | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const openedAt = useRef(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackViewContent({ id: "izin-main", name: "Izin Main", price: 15000 });
    capture("product_viewed", { product_id: "izin-main", price: 15000, currency: "IDR", source: "product_detail" });
  }, []);

  const openDemo = useCallback(() => {
    openedAt.current = performance.now();
    setDemoOpen(true);
    capture("product_demo_opened", { product_id: "izin-main", source: "product_detail" });
  }, []);
  const closeDemo = useCallback((reason: DemoCloseReason) => {
    capture("product_demo_closed", { product_id: "izin-main", close_method: reason, open_duration_ms: Math.round(performance.now() - openedAt.current) });
    setDemoOpen(false);
  }, []);

  const openPurchaseMode = useCallback(() => {
    const option = getDigitalPurchaseOption(PRODUCT.id);
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

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Izin Main",
    image: "https://for-you-always.my.id/assets/izin-main/hero.webp",
    description: "Permohonan izin main digital interaktif yang dapat disusun sendiri melalui Studio Editor.",
    brand: { "@type": "Brand", name: "For you, Always." },
    offers: { "@type": "Offer", priceCurrency: "IDR", price: "15000", availability: "https://schema.org/InStock", url: "https://for-you-always.my.id/catalog/izin-main" },
  };

  return (
    <main style={{ minHeight: "100vh", background: "#faf7f2" }}>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px clamp(16px, 4vw, 40px) 40px" }}>
        <Link href="/catalog" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "#7c6c5b", textDecoration: "none", letterSpacing: ".05em", textTransform: "uppercase" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19 3 12m0 0 7-7m-7 7h18" /></svg>
          Kembali ke Katalog
        </Link>
      </div>
      <section style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
          <LandscapeProductCard
            productId="izin-main"
            label={<span>Izin Main <span style={{ opacity: .5 }}>•</span> Self Edit / Terima Jadi</span>}
            title="Izin Main"
            description="Buat permohonan izin main yang lebih niat, lucu, dan personal. Kamu bisa menyusunnya sendiri lewat Studio, atau pilih Terima Jadi agar tim kami yang merangkai berkasnya dari bahanmu."
            features={["Berkas Digital Interaktif", "Dua Foto & Rencana Personal", "Musik, Janji & Respons Penerima", "Studio Editor dengan Live Preview", "Surat Izin Siap Unduh"]}
            salesCountPlacement="media"
            price="Mulai Rp 15.000"
            demoLink={IZIN_MAIN_DEMO_URL}
            demoLabel="Lihat Demo"
            fallbackImgSrc="/assets/izin-main/hero.webp"
            mediaType="image"
            accentColor="#6b4a37"
            accentGlow="rgba(107,74,55,.18)"
            onAddToCart={openPurchaseMode}
            themesLabel="Yang Bisa Kamu Atur"
            themes={[
              { name: "Opening Berkas", desc: "Brankas dan map dokumen membuka gift dengan animasi berkas asli.", color: "#6b4a37", fallbackImgSrc: "/assets/izin-main/hero.webp" },
              { name: "Pemohon & Penerima", desc: "Dua foto berbeda membuat permohonannya terasa benar-benar personal.", color: "#6b4a37", fallbackImgSrc: "/assets/izin-main/people.webp" },
              { name: "Rencana & Janji", desc: "Tanggal wajib, sedangkan tempat, alamat, kebersamaan, dan detail lain boleh dikosongkan.", color: "#6b4a37", fallbackImgSrc: "/assets/izin-main/plan.webp" },
              { name: "Persetujuan Digital", desc: "Penerima menyetujui lalu mendapatkan surat izin yang siap diunduh.", color: "#6b4a37", fallbackImgSrc: "/assets/izin-main/approval.webp" },
            ]}
            initialSelectedIndex={0}
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
          isOpen src={IZIN_MAIN_DEMO_URL} title="Demo Izin Main" subtitle="Buka berkas dan jelajahi permohonannya" productName="Izin Main" price="Rp 15.000"
          theme="izin-main" variants={IZIN_MAIN_DEMO_VARIANTS} initialVariantId="complete" orderButtonLabel="Pesan Izin Main"
          themeSwatches={IZIN_MAIN_THEME_SWATCHES} initialSwatchId="district-office"
          onClose={closeDemo} onOrder={() => { setDemoOpen(false); openPurchaseMode(); }}
          onLoaded={(loadTimeMs) => capture("product_demo_loaded", { product_id: "izin-main", load_time_ms: loadTimeMs })}
        />
      )}
    </main>
  );
}
