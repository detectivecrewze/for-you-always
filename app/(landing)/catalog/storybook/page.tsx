"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import DemoPreviewModal, { scheduleDemoPreviewPreload } from "../../../components/LazyDemoPreviewModal";
import type { DemoCloseReason, DemoPreviewVariant } from "../../../components/DemoPreviewModal";
import { useCart } from "../../../context/CartContext";
import { trackViewContent } from "@/lib/pixel";
import { STORYBOOK_DEMO_VARIANTS, STOREFRONT_DEMO_CONFIGS } from "@/lib/storefront-demo-config";

interface ActiveDemo {
  url: string;
  label: string;
  variant: string;
  switchCount: number;
}

const CART_ITEM = {
  id: "storybook",
  title: "Storybook Edition",
  numericPrice: 25000,
  themeColor: "#8b1d2c",
};

const UPDATED_ROOM_SCREENSHOTS = new Set([
  "spiderman-atlas",
  "spiderman-gallery",
  "spiderman-music",
  "batman-atlas",
  "batman-gallery",
  "batman-music",
]);

function storybookScreenshotSrc(file: string) {
  if (file === "spiderman-box" || file === "batman-box") {
    return `/assets/storybook-features/${file}.jpg`;
  }
  const versionedFile = UPDATED_ROOM_SCREENSHOTS.has(file) ? `${file}-v20260921` : file;
  return `/assets/storybook-features/${versionedFile}.webp`;
}

function capture(event: string, properties: Record<string, unknown>) {
  void import("posthog-js")
    .then(({ default: posthog }) => posthog.capture(event, properties))
    .catch(() => {});
}

export default function StorybookCatalogPage() {
  const { addToCart } = useCart();
  const [activeDemo, setActiveDemo] = useState<ActiveDemo | null>(null);
  const openedAt = useRef(0);
  const config = STOREFRONT_DEMO_CONFIGS.storybook;
  const spiderDemo = STORYBOOK_DEMO_VARIANTS.find((item) => item.id === "spiderman");
  const batmanDemo = STORYBOOK_DEMO_VARIANTS.find((item) => item.id === "batman");

  useEffect(() => {
    const cancel = scheduleDemoPreviewPreload();
    window.scrollTo(0, 0);
    trackViewContent({ id: "storybook", name: "Storybook Edition", price: 25000 });
    return cancel;
  }, []);

  const openDemo = useCallback((url: string, label: string, variantId?: string) => {
    const variant =
      STORYBOOK_DEMO_VARIANTS.find((item) => item.id === variantId || item.src === url) ??
      STORYBOOK_DEMO_VARIANTS[0];

    openedAt.current = performance.now();
    setActiveDemo({
      url: variant.src,
      label: variant.label || label,
      variant: variant.id,
      switchCount: 0,
    });
    capture("product_demo_opened", {
      product_id: "storybook",
      demo_variant: variant.id,
      source: "product_card",
    });
  }, []);

  const closeDemo = useCallback(
    (reason: DemoCloseReason) => {
      if (activeDemo) {
        capture("product_demo_closed", {
          product_id: "storybook",
          demo_variant: activeDemo.variant,
          close_method: reason,
          open_duration_ms: Math.round(performance.now() - openedAt.current),
        });
      }
      setActiveDemo(null);
    },
    [activeDemo],
  );

  const handleVariantChange = useCallback(
    (previous: DemoPreviewVariant, next: DemoPreviewVariant) => {
      setActiveDemo((current) =>
        current
          ? {
              ...current,
              url: next.src,
              label: next.label,
              variant: next.id,
              switchCount: current.switchCount + 1,
            }
          : current,
      );
      capture("product_demo_variant_changed", {
        product_id: "storybook",
        from_variant: previous.id,
        to_variant: next.id,
      });
    },
    [],
  );

  const addProduct = useCallback(() => addToCart(CART_ITEM), [addToCart]);

  const themeCards = useMemo(
    () => [
      {
        name: "Spider-Man",
        desc: "Komik merah-biru dengan tekstur web dan energi superhero.",
        color: "#8b1d2c",
        title: "Spider-Man Storybook",
        description:
          "Lima chapter personal dalam scrapbook komik merah-biru dengan opening gift, Atlas, soundtrack, surat, dan finale.",
        features: [
          "5 Room Cerita Personal",
          "Atlas Peta Kenangan",
          "Galeri Foto & Video",
          "Soundtrack dengan Quote",
          "Surat & Finale Interaktif",
        ],
        demoLink: spiderDemo?.src,
        demoLabel: "Lihat Demo",
        demoVariantId: "spiderman",
        demoDisabled: !spiderDemo,
        defaultSubThemeIndex: 0,
        subThemes: [
          ["Opening Gift", "spiderman-box"],
          ["Opening", "spiderman-greeting"],
          ["Story Chapters", "spiderman-menu"],
          ["Why You Matter", "spiderman-reasons"],
          ["Memory Archive", "spiderman-gallery"],
          ["Atlas of Us", "spiderman-atlas"],
          ["Our Soundtrack", "spiderman-music"],
          ["A Letter", "spiderman-letter"],
          ["Finale", "spiderman-finale"],
        ].map(([name, file]) => ({
          name,
          fallbackImgSrc: storybookScreenshotSrc(file),
        })),
      },
      {
        name: "Batman",
        desc: "Dossier Gotham navy gelap dengan aksen emas dan suasana noir.",
        color: "#d9ab36",
        title: "Batman Storybook",
        description:
          "Lima chapter personal dalam dossier Gotham yang sinematik, lengkap dengan peta, musik, surat, dan finale.",
        features: [
          "5 Room Cerita Personal",
          "Atlas Peta Kenangan",
          "Galeri Foto & Video",
          "Soundtrack dengan Quote",
          "Surat & Finale Interaktif",
        ],
        demoLink: batmanDemo?.src,
        demoLabel: "Lihat Demo",
        demoVariantId: "batman",
        demoDisabled: !batmanDemo,
        defaultSubThemeIndex: 0,
        subThemes: [
          ["Opening Gift", "batman-box"],
          ["Opening", "batman-greeting"],
          ["Story Chapters", "batman-menu"],
          ["Why You Matter", "batman-reasons"],
          ["Memory Archive", "batman-gallery"],
          ["Atlas of Us", "batman-atlas"],
          ["Our Soundtrack", "batman-music"],
          ["A Letter", "batman-letter"],
          ["Finale", "batman-finale"],
        ].map(([name, file]) => ({
          name,
          fallbackImgSrc: storybookScreenshotSrc(file),
        })),
      },
    ],
    [batmanDemo, spiderDemo],
  );

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Storybook Edition",
    image: "https://for-you-always.my.id/assets/storybook-features/spiderman-box.jpg",
    description:
      "Kado digital buku cerita komik dengan lima room personal, Atlas, galeri, soundtrack, surat, dan finale.",
    brand: { "@type": "Brand", name: "For you, Always." },
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: "25000",
      availability: "https://schema.org/InStock",
      url: "https://for-you-always.my.id/catalog/storybook",
    },
  };

  return (
    <main style={{ minHeight: "100vh", background: "#faf7f2" }}>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "120px clamp(16px, 4vw, 40px) 40px",
        }}
      >
        <Link
          href="/catalog"
          aria-label="Kembali ke katalog"
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
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Kembali ke Katalog
        </Link>
      </div>

      <section style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
          <LandscapeProductCard
            label={
              <span>
                Storybook Edition <span style={{ opacity: 0.55 }}>•</span> New Release
              </span>
            }
            title="Storybook Edition"
            description="Kado digital berbentuk buku cerita komik yang menghubungkan alasan, foto, tempat, lagu, dan surat dalam lima room personal."
            features={[
              "5 Room Cerita Personal",
              "Atlas Peta Kenangan",
              "Galeri Foto & Video",
              "Soundtrack dengan Quote",
              "Surat & Finale Interaktif",
            ]}
            price="Rp 25.000"
            demoLink={config.variants[0].src}
            demoLabel="Lihat Demo"
            fallbackImgSrc="/assets/storybook-features/spiderman-box.jpg"
            mediaType="image"
            accentColor="#8b1d2c"
            accentGlow="rgba(139, 29, 44, .2)"
            onAddToCart={addProduct}
            themesLabel="Pilih Tema Storybook"
            themes={themeCards}
            initialSelectedIndex={0}
            onDemoOpen={(url, label, metadata) => openDemo(url, label, metadata?.variantId)}
            priority
          />

          {activeDemo && (
            <DemoPreviewModal
              isOpen
              src={activeDemo.url}
              title={config.title}
              subtitle={config.subtitle}
              productName={config.productName}
              price={config.price}
              theme="storybook"
              variants={config.variants}
              initialVariantId={activeDemo.variant}
              onClose={closeDemo}
              onOrder={addProduct}
              onVariantChange={handleVariantChange}
              onLoaded={(ms) =>
                capture("product_demo_loaded", {
                  product_id: "storybook",
                  demo_variant: activeDemo.variant,
                  load_time_ms: ms,
                })
              }
            />
          )}
        </div>
      </section>
    </main>
  );
}
