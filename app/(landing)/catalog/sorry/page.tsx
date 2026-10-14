"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import CartCheckoutModal from "../../../components/CartCheckoutModal";
import DemoPreviewModal from "../../../components/LazyDemoPreviewModal";
import type { DemoCloseReason } from "../../../components/DemoPreviewModal";
import type { CartItem } from "../../../context/CartContext";
import { trackViewContent } from "@/lib/pixel";
import { STOREFRONT_DEMO_CONFIGS } from "@/lib/storefront-demo-config";

const PRODUCT: CartItem = {
  id: "sorry",
  title: "Sorry Letter",
  numericPrice: 15000,
  themeColor: "#8b1d2c",
  themeImgSrc: "/assets/sorry-features/sorry-envelope.webp",
};

const SCENES = [
  {
    name: "Amplop Vintage",
    desc: "Pembuka gift dengan amplop vintage interaktif.",
    fallbackImgSrc: "/assets/sorry-features/sorry-envelope.webp",
  },
  {
    name: "Surat & Musik",
    desc: "Surat typewriter dengan pemutar lagu pilihanmu.",
    fallbackImgSrc: "/assets/sorry-features/sorry-letter-player.webp",
  },
  {
    name: "Pertanyaan",
    desc: "Pertanyaan maaf dengan maskot dan dua pilihan jawaban.",
    fallbackImgSrc: "/assets/sorry-features/sorry-question.webp",
  },
  {
    name: "Ending",
    desc: "Ending personal mengikuti jawaban penerima.",
    fallbackImgSrc: "/assets/sorry-features/sorry-accepted.webp",
  },
] as const;

function capture(event: string, properties: Record<string, unknown>) {
  void import("posthog-js")
    .then(({ default: posthog }) => posthog.capture(event, properties))
    .catch(() => {});
}

export default function SorryCatalogPage() {
  const [checkoutItem, setCheckoutItem] = useState<CartItem | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const demoOpenedAt = useRef(0);
  const demo = STOREFRONT_DEMO_CONFIGS.sorry;

  useEffect(() => {
    window.scrollTo(0, 0);
    trackViewContent({ id: PRODUCT.id, name: PRODUCT.title, price: PRODUCT.numericPrice });
    capture("product_viewed", {
      product_id: "sorry",
      price: 15000,
      currency: "IDR",
      source: "product_detail",
    });
  }, []);

  const openCheckout = useCallback(() => {
    setCheckoutItem(PRODUCT);
  }, []);

  const openDemo = useCallback(() => {
    demoOpenedAt.current = performance.now();
    capture("product_demo_opened", {
      product_id: "sorry",
      price: 15000,
      currency: "IDR",
      source: "product_detail",
    });
    setDemoOpen(true);
  }, []);

  const closeDemo = useCallback((reason: DemoCloseReason) => {
    capture("product_demo_closed", {
      product_id: "sorry",
      price: 15000,
      currency: "IDR",
      source: "product_detail",
      close_method: reason,
      open_duration_ms: Math.max(0, Math.round(performance.now() - demoOpenedAt.current)),
    });
    setDemoOpen(false);
  }, []);

  const handleDemoOrder = useCallback(() => {
    capture("product_demo_cta_clicked", {
      product_id: "sorry",
      price: 15000,
      currency: "IDR",
      source: "product_detail",
      destination: "direct_checkout",
    });
    setDemoOpen(false);
    setCheckoutItem(PRODUCT);
  }, []);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Sorry Letter",
    image: "https://for-you-always.my.id/assets/sorry-features/sorry-envelope.webp",
    description: "Surat permintaan maaf interaktif dengan amplop vintage, musik pilihan, maskot, dan respons personal.",
    brand: { "@type": "Brand", name: "For you, Always." },
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: "15000",
      availability: "https://schema.org/InStock",
      url: "https://for-you-always.my.id/catalog/sorry",
    },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#faf7f2" }}>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px clamp(16px, 4vw, 40px) 40px" }}>
        <Link
          href="/catalog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            fontWeight: 600,
            color: "#a88365",
            textDecoration: "none",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19 3 12m0 0 7-7m-7 7h18" />
          </svg>
          Kembali ke Katalog
        </Link>
      </div>

      <section style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
          <LandscapeProductCard
            productId="sorry"
            label={
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                Sorry Letter <span style={{ opacity: 0.5 }}>•</span> New Release
              </div>
            }
            title="Sorry Letter"
            description="Surat permintaan maaf interaktif yang membantu kamu menyampaikan isi hati dengan lebih tenang, personal, dan bermakna. Lengkap dengan amplop vintage, lagu pilihan, maskot, dan respons personal."
            features={[
              "Surat Maaf dengan Efek Typewriter",
              "Musik Pilihan atau Upload Sendiri",
              "2 Pilihan Karakter Maskot",
              "Ending Interaktif",
              "Studio Editor & Live Preview",
            ]}
            animatedFeatureIcons
            salesCountPlacement="media"
            price="Rp 15.000"
            demoLink="https://sorry.for-you-always.my.id/"
            demoLabel="Lihat Demo"
            fallbackImgSrc="/assets/sorry-features/sorry-envelope.webp"
            mediaType="image"
            accentColor="#8b1d2c"
            accentGlow="rgba(139,29,44,0.2)"
            onAddToCart={openCheckout}
            themesLabel="Lihat Isi Gift"
            themes={SCENES.map((scene) => ({
              ...scene,
              color: "#8b1d2c",
            }))}
            initialSelectedIndex={0}
            autoCycle={false}
            delay={250}
            reverse={false}
            priority
            onDemoOpen={openDemo}
          />
        </div>
      </section>

      {checkoutItem && (
        <CartCheckoutModal directItem={checkoutItem} onClose={() => setCheckoutItem(null)} />
      )}

      {demoOpen && (
        <DemoPreviewModal
          isOpen
          src={demo.variants[0].src}
          title={demo.title}
          subtitle={demo.subtitle}
          productName={demo.productName}
          price={demo.price}
          theme={demo.theme}
          variants={demo.variants}
          initialVariantId={demo.initialVariantId}
          themeSwatches={demo.themeSwatches}
          orderButtonLabel="Checkout Sekarang"
          onClose={closeDemo}
          onOrder={handleDemoOrder}
          onLoaded={(loadTimeMs) => capture("product_demo_loaded", {
            product_id: "sorry",
            price: 15000,
            currency: "IDR",
            source: "product_detail",
            load_time_ms: loadTimeMs,
          })}
        />
      )}
    </div>
  );
}
