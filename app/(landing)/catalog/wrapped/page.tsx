"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import type { DemoCloseReason } from "../../../components/DemoPreviewModal";
import { useCart } from "../../../context/CartContext";
import Link from "next/link";
import { trackViewContent } from "@/lib/pixel";

const DemoPreviewModal = dynamic(() => import("../../../components/DemoPreviewModal"), { ssr: false });

interface ActiveDemo {
    url: string;
    label: string;
}

const WRAPPED_CART_ITEM = {
    id: "wrapped",
    title: "Wrapped Edition",
    numericPrice: 25000,
    oldNumericPrice: 30000,
    themeColor: "#c9184a",
};

function captureDemoEvent(event: string, properties: Record<string, unknown>) {
    void import("posthog-js")
        .then(({ default: posthog }) => posthog.capture(event, properties))
        .catch(() => {});
}

export default function ProductCatalogPage() {
    const { addToCart } = useCart();
    const [activeDemo, setActiveDemo] = useState<ActiveDemo | null>(null);
    const demoOpenedAtRef = useRef(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        trackViewContent({ id: "wrapped", name: "Wrapped Edition", price: 25000 });
    }, []);

    const demoAnalyticsProperties = useCallback((demo: ActiveDemo) => ({
        product_id: "wrapped",
        product_name: "Wrapped Edition",
        demo_label: demo.label,
    }), []);

    const openDemo = useCallback((url: string, label: string) => {
        demoOpenedAtRef.current = performance.now();
        const demo = { url, label };
        captureDemoEvent("product_demo_opened", demoAnalyticsProperties(demo));
        setActiveDemo(demo);
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
                price: WRAPPED_CART_ITEM.numericPrice,
                currency: "IDR",
            });
        }
        addToCart(WRAPPED_CART_ITEM);
    }, [activeDemo, addToCart, demoAnalyticsProperties]);

    return (
        <div style={{ minHeight: "100vh", background: "#faf7f2" }}>
            <Navbar />
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px clamp(16px, 4vw, 40px) 40px" }}>
                <Link href="/catalog" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "#a88365", textDecoration: "none", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Katalog
                </Link>
            </div>
            <section style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <LandscapeProductCard
                            productId="wrapped"
                            label="Wrapped Edition"
                            title="Memories Wrapped"
                            description="Kado digital 6 halaman interaktif. Pilih lagu, galeri, rekap perjalanan, hingga surat yang bisa dibuka kapan saja."
                            features={[
                                "6 Halaman Berbeda",
                                "Bisa Turn On / Off Halaman",
                                "Background Music Pilihan"
                            ]}
                            price="Rp 25.000"
                            oldPrice="Rp 30.000"

                            demoLink="https://love.for-you-always.my.id/love-test"
                            tiktokHref="https://www.tiktok.com/@foryoualways.id/video/7627348817905470741?is_from_webapp=1&sender_device=pc"
                            fallbackImgSrc="https://cdn.for-you-always.my.id/1777887751232-efe0ge.webp"
                            mediaType="image"
                            accentColor="#c9184a"
                            accentGlow="rgba(201,24,74,0.15)"
                            onAddToCart={() => addToCart(WRAPPED_CART_ITEM)}
                            themesLabel="Koleksi Halaman"
                            themes={[
                                { name: "Login", desc: "Halaman masuk", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015209230-zboaxw.webp" },
                                { name: "Music", desc: "Pilihan lagu favorit", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015209591-bgprs5.webp" },
                                { name: "Galleries", desc: "Kumpulan foto & video manis", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015208474-m5rlwh.webp" },
                                { name: "Wrapped", desc: "Ringkasan momen spesial", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015210238-kw2r9r.webp" },
                                { name: "Letter", desc: "Surat cinta dari hati", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778052950263-rgp29.webp" },
                                { name: "Invitation", desc: "Pertanyaan Lucu Dan Romantis", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015209910-p31n5.webp" }
                            ]}
                            delay={450}
                            reverse={false}
                            initialSelectedIndex={3}
                            onDemoOpen={(url, label) => openDemo(url, label)}
                        />

                        {activeDemo && (
                            <DemoPreviewModal
                                isOpen
                                src={activeDemo.url}
                                title={activeDemo.label || "Wrapped Edition"}
                                subtitle="Jelajahi rekap kenangan 6 halaman interaktif"
                                productName="Wrapped Edition"
                                price="Rp 25.000"
                                theme="wrapped"
                                onClose={closeDemo}
                                onOrder={handleDemoOrder}
                                onLoaded={handleDemoLoaded}
                            />
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}