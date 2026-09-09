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

const RETRO_CART_ITEM = {
    id: "retro",
    title: "Retro Edition",
    numericPrice: 20000,
    oldNumericPrice: 30000,
    themeColor: "#008689",
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
        trackViewContent({ id: "retro", name: "Retro Edition", price: 20000 });
    }, []);

    const demoAnalyticsProperties = useCallback((demo: ActiveDemo) => ({
        product_id: "retro",
        product_name: "Retro Edition",
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
                price: RETRO_CART_ITEM.numericPrice,
                currency: "IDR",
            });
        }
        addToCart(RETRO_CART_ITEM);
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
                            label={
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    Retro Edition
                                </div>
                            }
                            title="Retro Gift Card"
                            description="Kado digital bergaya Windows 98/XP yang nostalgia. Cocok untuk birthday, apology, atau momen spesial apapun. Lengkap dengan GIF pilihan, surat digital, dan musik."
                            features={[
                                "Tampilan Retro Windows 98",
                                "Custom GIF Pilihan",
                                "5 Stages of Surprises",
                                "Support Mobile Experiences",
                                "Background Music Pilihan"
                            ]}
                            price="Rp 20.000"
                            oldPrice="Rp 30.000"
                            demoLink="https://retro.for-you-always.my.id/?to=retro-test"

                            fallbackImgSrc="https://cdn.for-you-always.my.id/1778444079509-72xi4d.png"
                            mediaType="image"
                            accentColor="#008689"
                            accentGlow="rgba(0,134,137,0.2)"
                            onAddToCart={() => addToCart(RETRO_CART_ITEM)}
                            onAddThreeSlotToCart={() => addToCart({ id: "retro", title: "Retro Edition (3 Gift)", numericPrice: 25000, themeColor: "#008689", isThreeSlot: true, slotCount: 3 })}
                            themesLabel="Koleksi Halaman"
                            themes={[
                                { name: "Greeting", desc: "Tampilan awal greeting card", color: "#008689", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778444079509-72xi4d.png" },
                                { name: "Music Player", desc: "Pemutar musik bergaya Winamp retro", color: "#008689", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778445055394-kwtv5o.png" },
                                { name: "Notepad.exe", desc: "Surat digital bergaya editor klasik", color: "#008689", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778445055893-z63rma.png" },
                                { name: "Secret Gallery", desc: "Galeri rahasia yang muncul di akhir pesan", color: "#008689", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778445056536-xvpcth.png" }
                            ]}
                            delay={250}
                            reverse={false}
                            initialSelectedIndex={0}
                            autoCycle={false}
                            tiktokHref="https://www.tiktok.com/@foryoualways.id/video/7641893530503351573?is_from_webapp=1&sender_device=pc"
                            onDemoOpen={(url, label) => openDemo(url, label)}
                        />

                        {activeDemo && (
                            <DemoPreviewModal
                                isOpen
                                src={activeDemo.url}
                                title={activeDemo.label || "Retro Edition"}
                                subtitle="Rasakan kejutan nostalgia bernuansa Windows 98 klasik"
                                productName="Retro Edition"
                                price="Rp 20.000"
                                theme="retro"
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