"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import DemoPreviewModal, { scheduleDemoPreviewPreload } from "../../../components/LazyDemoPreviewModal";
import type { DemoCloseReason, DemoPreviewVariant } from "../../../components/DemoPreviewModal";
import { useCart } from "../../../context/CartContext";
import Link from "next/link";
import { trackViewContent } from "@/lib/pixel";

interface ActiveDemo {
    url: string;
    label: string;
    variant: string;
    source: "product_card";
    switchCount: number;
}

const LETTER_DEMO_VARIANTS = [
    { id: "classic-wax", label: "Classic Wax Seal", src: "https://letter.for-you-always.my.id/letter-test", subtitle: "Surat klasik dengan amplop dan segel wax" },
    { id: "vintage-airmail", label: "Vintage Airmail", src: "https://letter.for-you-always.my.id/airmail/letter-test", subtitle: "Surat pos udara bernuansa vintage" },
    { id: "ribbon-seal", label: "Ribbon & Seal", src: "https://letter.for-you-always.my.id/ribbon/letter-test", subtitle: "Surat elegan dengan pita dan segel" },
    { id: "vintage", label: "Vintage", src: "https://letter.for-you-always.my.id/vintage/letter-test", subtitle: "Surat vintage dengan amplop interaktif" },
] as const satisfies readonly DemoPreviewVariant[];

const LETTER_CART_ITEM = {
    id: "letter",
    title: "Letter Edition",
    numericPrice: 20000,
    oldNumericPrice: 30000,
    themeColor: "#7a5438",
};

function captureDemoEvent(event: string, properties: Record<string, unknown>) {
    void import("posthog-js")
        .then(({ default: posthog }) => posthog.capture(event, properties))
        .catch(() => {});
}

export default function LetterCatalogPage() {
    const { addToCart } = useCart();
    const [activeDemo, setActiveDemo] = useState<ActiveDemo | null>(null);
    const demoOpenedAtRef = useRef(0);

    useEffect(() => {
        const cancelDemoPreload = scheduleDemoPreviewPreload();
        window.scrollTo(0, 0);
        trackViewContent({ id: "letter", name: "Letter Edition", price: 20000 });
        return cancelDemoPreload;
    }, []);

    const demoAnalyticsProperties = useCallback((demo: ActiveDemo) => ({
        product_id: "letter",
        product_name: "Letter Edition",
        demo_label: demo.label,
        demo_variant: demo.variant,
        source: demo.source,
        variant_switch_count: demo.switchCount,
    }), []);

    const openDemo = useCallback((url: string, label: string, variantId?: string) => {
        demoOpenedAtRef.current = performance.now();
        const variant = LETTER_DEMO_VARIANTS.find((item) => item.id === variantId || item.src === url) ?? LETTER_DEMO_VARIANTS[0];
        const demo: ActiveDemo = { url: variant.src, label: variant.label || label, variant: variant.id, source: "product_card", switchCount: 0 };
        captureDemoEvent("product_demo_opened", demoAnalyticsProperties(demo));
        setActiveDemo(demo);
    }, [demoAnalyticsProperties]);

    const handleVariantChange = useCallback((previousVariant: DemoPreviewVariant, nextVariant: DemoPreviewVariant) => {
        setActiveDemo((current) => {
            if (!current) return current;
            const switchCount = current.switchCount + 1;
            captureDemoEvent("product_demo_variant_changed", {
                ...demoAnalyticsProperties(current),
                from_variant: previousVariant.id,
                to_variant: nextVariant.id,
                switch_index: switchCount,
            });
            return { ...current, url: nextVariant.src, label: nextVariant.label, variant: nextVariant.id, switchCount };
        });
    }, [demoAnalyticsProperties]);

    const closeDemo = useCallback((reason: DemoCloseReason) => {
        if (!activeDemo) return;
        captureDemoEvent("product_demo_closed", {
            ...demoAnalyticsProperties(activeDemo),
            close_method: reason,
            open_duration_ms: Math.max(0, Math.round(performance.now() - demoOpenedAtRef.current)),
        });
        setActiveDemo(null);
    }, [activeDemo, demoAnalyticsProperties]);

    const handleDemoLoaded = useCallback((loadTimeMs: number) => {
        if (!activeDemo) return;
        captureDemoEvent("product_demo_loaded", {
            ...demoAnalyticsProperties(activeDemo),
            load_time_ms: loadTimeMs,
        });
    }, [activeDemo, demoAnalyticsProperties]);

    const handleDemoOrder = useCallback(() => {
        if (activeDemo) {
            captureDemoEvent("product_demo_cta_clicked", {
                ...demoAnalyticsProperties(activeDemo),
                destination: "cart",
                price: LETTER_CART_ITEM.numericPrice,
                currency: "IDR",
            });
        }
        addToCart(LETTER_CART_ITEM);
    }, [activeDemo, addToCart, demoAnalyticsProperties]);

    return (
        <div style={{ minHeight: "100vh", background: "#faf7f2" }}>
            <Navbar />

            {/* Back to Catalog Button */}
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px clamp(16px, 4vw, 40px) 40px" }}>
                <Link href="/catalog" style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#a88365",
                    textDecoration: "none",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase"
                }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Katalog
                </Link>
            </div>

            {/* Product Detail Section */}
            <section style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <LandscapeProductCard
                            label={
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    Letter Edition <span style={{ opacity: 0.5 }}>•</span> Best Seller
                                </div>
                            }
                            title="Surat Digital Aesthetic"
                            description="Sampaikan pesan bermakna melalui surat digital bernuansa sinematik. Hadir dengan amplop interaktif, efek typewriter klasik, dan kustomisasi tema eksklusif."
                            features={[
                                "Amplop Digital Interaktif",
                                "Efek Typewriter Sinematik",
                                "Bisa Kirim Pesan Anonymous",
                                "Foto / Video di Akhir Surat",
                                "Background Music Pilihan"
                            ]}
                            price="Rp 20.000"
                            oldPrice="Rp 30.000"
                            demoLink="https://letter.for-you-always.my.id/ribbon/letter-test"

                            fallbackImgSrc="https://cdn.for-you-always.my.id/1783163306081-l92p1h.webp"
                            mediaType="image"
                            accentColor="#a68a64"
                            accentGlow="rgba(166,138,100,0.2)"
                            onAddToCart={() => addToCart({ id: "letter", title: "Letter Edition", numericPrice: 20000, oldNumericPrice: 30000, themeColor: "#7a5438" })}
                            onAddThreeSlotToCart={() => addToCart({ id: "letter", title: "Letter Edition (3 Gift)", numericPrice: 25000, themeColor: "#7a5438", isThreeSlot: true, slotCount: 3 })}
                            themesLabel="Koleksi Template"
                            themes={[
                                {
                                    name: "Classic Wax Seal",
                                    desc: "Desain amplop minimalis dengan segel lilin",
                                    demoLink: "https://letter.for-you-always.my.id/letter-test",
                                    demoLabel: "Lihat Demo Wax",
                                    demoVariantId: "classic-wax",
                                    defaultSubThemeIndex: 0,
                                    subThemes: [
                                        { name: "Blush", color: "#e3b5b4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781975354379-zs8pmj.webp" },
                                        { name: "Sage", color: "#7a9e7e", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781975355062-7dvbi2.webp" },
                                        { name: "Obsidian Green", color: "#2d6a4f", fallbackImgSrc: "https://cdn.for-you-always.my.id/1782119885711-hczmpi.webp" },
                                        { name: "Rose Pink", color: "#c4858a", fallbackImgSrc: "https://cdn.for-you-always.my.id/1782119887163-8kand7.webp" },
                                        { name: "Red Burgundy", color: "#7b2434", fallbackImgSrc: "https://cdn.for-you-always.my.id/1782119887798-toxu2f.webp" },
                                        { name: "Midnight", color: "#2a3d5c", fallbackImgSrc: "https://cdn.for-you-always.my.id/1782119888422-pdxnom.webp" }
                                    ]
                                },
                                {
                                    name: "Vintage Airmail",
                                    desc: "Desain surat pos udara klasik",
                                    demoLink: "https://letter.for-you-always.my.id/airmail/letter-test",
                                    demoLabel: "Lihat Demo Airmail",
                                    demoVariantId: "vintage-airmail",
                                    subThemes: [
                                        { name: "Parchment", color: "#a68a64", fallbackImgSrc: "https://cdn.for-you-always.my.id/1779464837721-ukwgwd.webp" },
                                        { name: "Lilac", color: "#d4cadd", fallbackImgSrc: "https://cdn.for-you-always.my.id/1779464836965-9zahl.webp" },
                                        { name: "Sage", color: "#7a9e7e", fallbackImgSrc: "https://cdn.for-you-always.my.id/1779464838382-funvvg.webp" },
                                        { name: "Rose", color: "#c4858a", fallbackImgSrc: "https://cdn.for-you-always.my.id/1779464838087-ztk2sl.webp" },
                                        { name: "Midnight", color: "#2a3d5c", fallbackImgSrc: "https://cdn.for-you-always.my.id/1779464837348-a40rot.webp" },
                                        { name: "Bordeaux", color: "#581824", fallbackImgSrc: "https://cdn.for-you-always.my.id/1779464838763-2y25so.webp" }
                                    ]
                                },
                                {
                                    name: "Ribbon & Seal",
                                    desc: "Desain elegan dengan pita dan segel wax",
                                    demoLink: "https://letter.for-you-always.my.id/ribbon/letter-test",
                                    demoLabel: "Lihat Demo Ribbon",
                                    demoVariantId: "ribbon-seal",
                                    defaultSubThemeIndex: 2,
                                    subThemes: [
                                        { name: "Parchment", color: "#e8dbce", fallbackImgSrc: "https://cdn.for-you-always.my.id/1780253357350-fp09fd.webp" },
                                        { name: "Forest", color: "#4d6b53", fallbackImgSrc: "https://cdn.for-you-always.my.id/1780253356127-1es344.webp" },
                                        { name: "Midnight", color: "#2a3d5c", fallbackImgSrc: "https://cdn.for-you-always.my.id/1780253357024-sb9db.webp" },
                                        { name: "Rose", color: "#c4858a", fallbackImgSrc: "https://cdn.for-you-always.my.id/1780253355831-swb14.webp" },
                                        { name: "Bordeaux", color: "#581824", fallbackImgSrc: "https://cdn.for-you-always.my.id/1780253356734-jbzz6.webp" },
                                        { name: "Violet", color: "#8a6b96", fallbackImgSrc: "https://cdn.for-you-always.my.id/1780253356407-czstjw.webp" }
                                    ]
                                },
                                {
                                    name: "Vintage",
                                    desc: "Desain surat vintage autentik dengan amplop interaktif",
                                    demoLink: "https://letter.for-you-always.my.id/vintage/letter-test",
                                    demoLabel: "Lihat Demo Vintage",
                                    demoVariantId: "vintage",
                                    subThemes: [
                                        { name: "Envelope Closed", fallbackImgSrc: "https://cdn.for-you-always.my.id/1783163306081-l92p1h.webp" },
                                        { name: "Envelope Open", fallbackImgSrc: "https://cdn.for-you-always.my.id/1783163305285-pnx28.webp" },
                                        { name: "Flower Burst", fallbackImgSrc: "https://cdn.for-you-always.my.id/1783163304579-zn1oa3.webp" }
                                    ]
                                }
                            ]}
                            delay={0}
                            reverse={false}
                            initialSelectedIndex={3}
                            autoCycle={false}
                            tiktokHref="https://www.tiktok.com/@foryoualways.id/video/7629604229094591764?is_from_webapp=1&sender_device=pc"
                            onDemoOpen={(url, label, metadata) => openDemo(url, label, metadata?.variantId)}
                        />

                        {activeDemo && (
                            <DemoPreviewModal
                                isOpen
                                src={activeDemo.url}
                                title="Demo Letter Edition"
                                subtitle="Rasakan pengalaman membaca surat digital bernuansa sinematik"
                                productName="Letter Edition"
                                price="Rp 20.000"
                                theme="letter"
                                variants={LETTER_DEMO_VARIANTS}
                                initialVariantId={activeDemo.variant}
                                onClose={closeDemo}
                                onOrder={handleDemoOrder}
                                onLoaded={handleDemoLoaded}
                                onVariantChange={handleVariantChange}
                            />
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
