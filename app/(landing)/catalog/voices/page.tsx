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

const VOICES_CART_ITEM = {
    id: "voices",
    title: "Voices Gift",
    numericPrice: 20000,
    oldNumericPrice: 30000,
    themeColor: "#a67c52",
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
        trackViewContent({ id: "voices", name: "Voices Gift", price: 20000 });
    }, []);

    const demoAnalyticsProperties = useCallback((demo: ActiveDemo) => ({
        product_id: "voices",
        product_name: "Voices Gift",
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
                price: VOICES_CART_ITEM.numericPrice,
                currency: "IDR",
            });
        }
        addToCart(VOICES_CART_ITEM);
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
                            label="Voices Gift"
                            title="Kado Suara & Foto"
                            description="Rangkai kenangan visual dan audio menjadi satu memori abadi bernuansa sinematik. Ungkapkan perasaanmu secara langsung."
                            features={[
                                "Rekam Suara & Custom Pesan",
                                "Galeri Foto Sinematik",
                                "Background Music Pilihan"
                            ]}
                            price="Rp 20.000"
                            oldPrice="Rp 30.000"
                            demoLink="https://voice.for-you-always.my.id/gift/for-nadin"

                            fallbackImgSrc="https://cdn.for-you-always.my.id/1777881039502-bav595.webp"
                            mediaType="image"
                            accentColor="#a67c52"
                            accentGlow="rgba(166,124,82,0.2)"
                            onAddToCart={() => addToCart(VOICES_CART_ITEM)}
                            onAddThreeSlotToCart={() => addToCart({ id: "voices", title: "Voices Gift (3 Gift)", numericPrice: 25000, themeColor: "#a67c52", isThreeSlot: true, slotCount: 3 })}
                            themes={[
                                { name: "Music Box", desc: "Nuansa kotak musik klasik", color: "#a67c52", fallbackImgSrc: "https://cdn.for-you-always.my.id/1777881039502-bav595.webp" },
                                { name: "Camera", desc: "Tampilan bergaya retro camera", color: "#9ca3af", fallbackImgSrc: "https://cdn.for-you-always.my.id/1777882686448-bkvu14.png", demoLink: "https://voice.for-you-always.my.id/camera/silver/for-nadin" }
                            ]}
                            delay={100}
                            initialSelectedIndex={0}
                            autoCycle={true}
                            tiktokHref="https://www.tiktok.com/@foryoualways.id/video/7608960116141886740?is_from_webapp=1&sender_device=pc"
                            onDemoOpen={(url, label) => openDemo(url, label)}
                        />

                        {activeDemo && (
                            <DemoPreviewModal
                                isOpen
                                src={activeDemo.url}
                                title={activeDemo.label || "Voices Gift"}
                                subtitle="Dengarkan rekaman suara berpadu memori foto & musik latar"
                                productName="Voices Gift"
                                price="Rp 20.000"
                                theme="voices"
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