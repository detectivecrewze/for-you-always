"use client";

import React, { useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import CircleWishesInfoModal from "../../../components/CircleWishesInfoModal";
import DemoPreviewModal, { scheduleDemoPreviewPreload } from "../../../components/LazyDemoPreviewModal";
import type { DemoCloseReason, DemoPreviewVariant } from "../../../components/DemoPreviewModal";
import { useCart } from "../../../context/CartContext";
import Link from "next/link";
import { trackViewContent } from "@/lib/pixel";
import { GIFT_OPENING_DEMO_URL, MEMORIA_DEMO_VARIANTS, MEMORIA_THEME_SWATCHES } from "@/lib/storefront-demo-config";

type DemoVariant = "personal" | "gift-opening" | "circle";
type DemoSource = "product_card" | "circle_wishes_info";

interface ActiveDemo {
    variant: DemoVariant;
    source: DemoSource;
    url: string;
    label: string;
    switchCount: number;
}

const MEMORIA_CART_ITEM = {
    id: "loves",
    title: "Memoria Premium",
    numericPrice: 40000,
    oldNumericPrice: 50000,
    themeColor: "#581824",
};

function captureDemoEvent(event: string, properties: Record<string, unknown>) {
    void import("posthog-js")
        .then(({ default: posthog }) => posthog.capture(event, properties))
        .catch(() => {});
}

export default function ProductCatalogPage() {
    const { addToCart } = useCart();
    const [isInfoModalOpen, setIsInfoModalOpen] = React.useState(false);
    const [activeDemo, setActiveDemo] = React.useState<ActiveDemo | null>(null);
    const demoOpenedAtRef = React.useRef(0);
    const [memoriaNotice, setMemoriaNotice] = React.useState<{ isActive: boolean; title: string; message: string }>({
        isActive: false,
        title: "Info Khusus Memoria:",
        message: "",
    });

    useEffect(() => {
        const cancelDemoPreload = scheduleDemoPreviewPreload();
        window.scrollTo(0, 0);
        trackViewContent({ id: "loves", name: "Memoria Premium", price: 40000 });
        fetch("/api/public/memoria-notice")
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.notice) setMemoriaNotice(data.notice);
            })
            .catch(() => {});
        return cancelDemoPreload;
    }, []);

    const demoAnalyticsProperties = React.useCallback((demo: ActiveDemo) => ({
        product_id: "loves",
        product_name: "Memoria Premium",
        demo_variant: demo.variant,
        source: demo.source,
        variant_switch_count: demo.switchCount,
    }), []);

    const openDemo = React.useCallback((
        variant: DemoVariant,
        source: DemoSource,
        url: string,
        label: string
    ) => {
        setIsInfoModalOpen(false);
        demoOpenedAtRef.current = performance.now();
        const configuredVariant = MEMORIA_DEMO_VARIANTS.find((item) => item.id === variant) ?? MEMORIA_DEMO_VARIANTS[0];
        const demo: ActiveDemo = { variant, source, url: configuredVariant.src || url, label: configuredVariant.label || label, switchCount: 0 };
        captureDemoEvent("product_demo_opened", demoAnalyticsProperties(demo));
        setActiveDemo(demo);
    }, [demoAnalyticsProperties]);

    const handleVariantChange = React.useCallback((previousVariant: DemoPreviewVariant, nextVariant: DemoPreviewVariant) => {
        setActiveDemo((current) => {
            if (!current || (nextVariant.id !== "personal" && nextVariant.id !== "gift-opening" && nextVariant.id !== "circle")) return current;
            const switchCount = current.switchCount + 1;
            captureDemoEvent("product_demo_variant_changed", {
                ...demoAnalyticsProperties(current),
                from_variant: previousVariant.id,
                to_variant: nextVariant.id,
                switch_index: switchCount,
            });
            return {
                ...current,
                variant: nextVariant.id,
                url: nextVariant.src,
                label: nextVariant.label,
                switchCount,
            };
        });
    }, [demoAnalyticsProperties]);

    const closeDemo = React.useCallback((reason: DemoCloseReason) => {
        if (!activeDemo) return;
        captureDemoEvent("product_demo_closed", {
            ...demoAnalyticsProperties(activeDemo),
            close_method: reason,
            open_duration_ms: Math.max(0, Math.round(performance.now() - demoOpenedAtRef.current)),
        });
        setActiveDemo(null);
    }, [activeDemo, demoAnalyticsProperties]);

    const handleDemoLoaded = React.useCallback((loadTimeMs: number) => {
        if (!activeDemo) return;
        captureDemoEvent("product_demo_loaded", {
            ...demoAnalyticsProperties(activeDemo),
            load_time_ms: loadTimeMs,
        });
    }, [activeDemo, demoAnalyticsProperties]);

    const handleDemoOrder = React.useCallback(() => {
        if (activeDemo) {
            captureDemoEvent("product_demo_cta_clicked", {
                ...demoAnalyticsProperties(activeDemo),
                destination: "cart",
                price: MEMORIA_CART_ITEM.numericPrice,
                currency: "IDR",
            });
        }
        addToCart(MEMORIA_CART_ITEM);
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
            <section id="loves-edition" style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
                <style>{`
                    #loves-edition .hub-showcase-media {
                        background-color: #faf7f2 !important;
                    }
                    #loves-edition .hub-showcase-content {
                        background-color: #2D141E !important;
                        border-color: rgba(250, 247, 242, 0.25) !important;
                    }
                    #loves-edition .hub-showcase-content h3 { color: #faf7f2 !important; }
                    #loves-edition .hub-showcase-content p { color: rgba(250, 247, 242, 0.85) !important; }
                    #loves-edition .hub-showcase-content > div > div > span { color: #faf7f2 !important; opacity: 1 !important; }
                    
                    /* Themes Section */
                    #loves-edition .hub-showcase-media-wrapper > div:last-child {
                        background: #2D141E !important;
                        border-color: rgba(250, 247, 242, 0.25) !important;
                    }
                    #loves-edition .hub-showcase-media-wrapper > div:last-child button {
                        background: rgba(255, 255, 255, 0.2) !important;
                        border-color: rgba(255, 255, 255, 0.4) !important;
                        color: #faf7f2 !important;
                    }
                    #loves-edition .hub-showcase-media-wrapper > div:last-child button:hover {
                        background: rgba(255, 255, 255, 0.3) !important;
                        border-color: rgba(255, 255, 255, 0.6) !important;
                    }
                    #loves-edition .hub-showcase-media-wrapper > div:last-child span { color: #faf7f2 !important; }
                    #loves-edition .hub-showcase-media-wrapper > div:last-child span[style*="opacity: 0.8"] { color: rgba(250, 247, 242, 0.85) !important; opacity: 1 !important; }
                `}</style>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {memoriaNotice.isActive && (
                            <div style={{
                                background: "#fff9f0",
                                border: "1px solid #f0dfb8",
                                padding: "16px 20px",
                                borderRadius: "16px",
                                marginBottom: "30px",
                                color: "#6e4b20",
                                fontSize: 13.5,
                                fontFamily: "var(--font-sans)",
                                lineHeight: 1.6,
                                boxShadow: "0 4px 14px rgba(110,75,32,0.04)",
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 12
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a67c52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <div>
                                    <strong style={{ color: "#382a24" }}>{memoriaNotice.title || "Info Khusus Memoria:"}</strong>{" "}
                                    {memoriaNotice.message}
                                </div>
                            </div>
                        )}

                        {/* Circle Wishes Info Trigger Button */}
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: "28px",
                        }}>
                            <button
                                type="button"
                                onClick={() => setIsInfoModalOpen(true)}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "clamp(6px, 1.8vw, 10px)",
                                    padding: "8px clamp(14px, 3.5vw, 20px)",
                                    borderRadius: 999,
                                    background: "#2D141E",
                                    border: "1px solid rgba(226, 133, 155, 0.35)",
                                    boxShadow: "0 6px 20px rgba(45, 20, 30, 0.15)",
                                    color: "#FDE8E9",
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "clamp(11.5px, 2.7vw, 13px)",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    maxWidth: "100%",
                                    boxSizing: "border-box",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.borderColor = "rgba(226, 133, 155, 0.65)";
                                    e.currentTarget.style.boxShadow = "0 10px 26px rgba(45, 20, 30, 0.25)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.borderColor = "rgba(226, 133, 155, 0.35)";
                                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(45, 20, 30, 0.15)";
                                }}
                            >
                                <span style={{
                                    fontSize: 9.5,
                                    fontWeight: 800,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    padding: "2px 8px",
                                    borderRadius: 999,
                                    background: "rgba(226, 133, 155, 0.22)",
                                    color: "#E2859B",
                                    border: "1px solid rgba(226, 133, 155, 0.4)",
                                    lineHeight: 1.2,
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
                                    display: "inline-block",
                                }}>
                                    BARU
                                </span>
                                <span style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexWrap: "wrap",
                                    gap: "4px 8px",
                                    textAlign: "center",
                                    lineHeight: 1.35,
                                }}>
                                    <span style={{ whiteSpace: "nowrap" }}>
                                        Circle Wishes: Memoria Edition
                                    </span>
                                    <span style={{
                                        whiteSpace: "nowrap",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 5,
                                        color: "#D1A7B1",
                                    }}>
                                        <span>— Pelajari Cara Kerja</span>
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#E2859B"
                                            strokeWidth={2.5}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{ flexShrink: 0 }}
                                        >
                                            <path d="M7 17L17 7" />
                                            <path d="M7 7h10v10" />
                                        </svg>
                                    </span>
                                </span>
                            </button>
                        </div>

                        <LandscapeProductCard
                            productId="loves"
                            label={
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    Done For You <span style={{ opacity: 0.5 }}>•</span> Premium
                                </div>
                            }
                            title="Memoria"
                            description="Serahkan materinya kepada Digital Atelier kami, dan kami akan menciptakan pengalaman kado digital paling premium untuk orang tersayang Anda."
                            features={[
                                "Desain Premium & Eksklusif",
                                "Bebas Kustomisasi Tema & Teks",
                                "Animasi Visual Interaktif",
                                "Kustomisasi Galeri & Musik Audio",
                                "Dikerjakan Langsung oleh Kami"
                            ]}
                            price="Rp 40.000"
                            oldPrice="Rp 50.000"
                            demoLink={GIFT_OPENING_DEMO_URL}
                            onDemoOpen={(url, label) => openDemo("gift-opening", "product_card", url, label)}
                            mediaSrc=""
                            fallbackImgSrc="/assets/opening_gate.png"
                            mediaType="image"
                            accentColor="#faf7f2"
                            accentGlow="rgba(250,247,242,0.15)"
                            onAddToCart={() => addToCart(MEMORIA_CART_ITEM)}
                            themesLabel="Koleksi Pages"
                            themes={[
                                { name: "Opening Gate", desc: "Animasi kado pembuka", color: "#faf7f2", fallbackImgSrc: "/assets/opening_gate.png", demoLink: GIFT_OPENING_DEMO_URL, demoVariantId: "gift-opening" },
                                { name: "Opening Section", desc: "Sapaan & musik latar", color: "#faf7f2", fallbackImgSrc: "/assets/opening_section.webp" },
                                { name: "Time Section", desc: "Hitung mundur momen", color: "#faf7f2", fallbackImgSrc: "/assets/time_section.webp" },
                                { name: "Letter Section", desc: "Pesan menyentuh hati", color: "#faf7f2", fallbackImgSrc: "/assets/letter_section.webp" },
                                { name: "Reason Section", desc: "Bebas ubah tema/konsep", color: "#faf7f2", fallbackImgSrc: "/assets/reason_section.webp" },
                                { name: "Garden Section", desc: "Bebas ubah tema/konsep", color: "#faf7f2", fallbackImgSrc: "/assets/metafora-gardeon_section.webp" },
                                { name: "Gallery Section", desc: "Koleksi memori indah", color: "#faf7f2", fallbackImgSrc: "/assets/gallery_section.webp" },
                                { name: "Closing Section", desc: "Penutup yang manis", color: "#faf7f2", fallbackImgSrc: "/assets/closing%20section.webp" }
                            ]}
                            delay={100}
                            reverse={false}
                            initialSelectedIndex={0}
                            autoCycle={false}
                            tiktokHref="https://www.tiktok.com/@foryoualways.id/video/7647125933169675541?is_from_webapp=1&sender_device=pc"
                        />

                        {/* Modal Popup Informatif Circle Wishes */}
                        <CircleWishesInfoModal
                            isOpen={isInfoModalOpen}
                            onClose={() => setIsInfoModalOpen(false)}
                            onDemoOpen={(url, label) => openDemo("circle", "circle_wishes_info", url, label)}
                        />

                        {activeDemo && (
                            <DemoPreviewModal
                                isOpen
                                src={activeDemo.url}
                                title="Demo Memoria Premium"
                                subtitle="Jelajahi pengalaman Memoria"
                                productName="Memoria Premium"
                                price="Rp 40.000"
                                variants={MEMORIA_DEMO_VARIANTS}
                                initialVariantId={activeDemo.variant}
                                themeSwatches={MEMORIA_THEME_SWATCHES}
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
