"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import WishInboxInfoModal from "../../../components/WishInboxInfoModal";
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

const BIRTHDAY_DEMO_VARIANTS = [
    { id: "snoopy", label: "Snoopy Comic", src: "https://snoopy.for-you-always.my.id/gift?project=gift-f0d02efd7edcbf62", subtitle: "Scrapbook komik retro bersama Snoopy & Woodstock" },
    { id: "dubu-dudu", label: "Dubu & Dudu", src: "https://snoopy.for-you-always.my.id/gift/index.html?project=gift-ab79b22216982751", subtitle: "Scrapbook hangat dengan nuansa pastel" },
] as const satisfies readonly DemoPreviewVariant[];

const BIRTHDAY_CART_ITEM = {
    id: "birthday",
    title: "Birthday Scrapbook",
    numericPrice: 25000,
    oldNumericPrice: 35000,
    themeColor: "#bf7b19",
};

function captureDemoEvent(event: string, properties: Record<string, unknown>) {
    void import("posthog-js")
        .then(({ default: posthog }) => posthog.capture(event, properties))
        .catch(() => {});
}

export default function BirthdayCatalogPage() {
    const { addToCart } = useCart();
    const [isWishInboxModalOpen, setIsWishInboxModalOpen] = useState(false);
    const [activeDemo, setActiveDemo] = useState<ActiveDemo | null>(null);
    const demoOpenedAtRef = useRef(0);

    useEffect(() => {
        const cancelDemoPreload = scheduleDemoPreviewPreload();
        window.scrollTo(0, 0);
        trackViewContent({ id: "birthday", name: "Birthday Scrapbook", price: 25000 });
        return cancelDemoPreload;
    }, []);

    const demoAnalyticsProperties = useCallback((demo: ActiveDemo) => ({
        product_id: "birthday",
        product_name: "Birthday Scrapbook",
        demo_label: demo.label,
        demo_variant: demo.variant,
        source: demo.source,
        variant_switch_count: demo.switchCount,
    }), []);

    const openDemo = useCallback((url: string, label: string, variantId?: string) => {
        demoOpenedAtRef.current = performance.now();
        const variant = BIRTHDAY_DEMO_VARIANTS.find((item) => item.id === variantId || item.src === url) ?? BIRTHDAY_DEMO_VARIANTS[0];
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
                price: BIRTHDAY_CART_ITEM.numericPrice,
                currency: "IDR",
            });
        }
        addToCart(BIRTHDAY_CART_ITEM);
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
                        {/* Wish Inbox Exclusive Feature Info Trigger Button */}
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: "28px",
                        }}>
                            <button
                                type="button"
                                onClick={() => setIsWishInboxModalOpen(true)}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "clamp(6px, 1.8vw, 9px)",
                                    padding: "8px clamp(14px, 3.5vw, 20px)",
                                    borderRadius: 999,
                                    background: "linear-gradient(135deg, #F5B738 0%, #E2991E 100%)",
                                    border: "1px solid rgba(245, 183, 56, 0.6)",
                                    boxShadow: "0 6px 20px rgba(226, 153, 30, 0.28)",
                                    color: "#241604",
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "clamp(12px, 2.7vw, 13px)",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    whiteSpace: "nowrap",
                                    maxWidth: "100%",
                                    boxSizing: "border-box",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 10px 26px rgba(226, 153, 30, 0.45)";
                                    e.currentTarget.style.borderColor = "#F5B738";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(226, 153, 30, 0.28)";
                                    e.currentTarget.style.borderColor = "rgba(245, 183, 56, 0.6)";
                                }}
                            >
                                <span style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: "#241604",
                                    flexShrink: 0,
                                }} />
                                <span style={{ letterSpacing: "0.01em", whiteSpace: "nowrap" }}>
                                    Fitur Eksklusif: Wish Inbox
                                </span>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#241604" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginLeft: 1 }}>
                                    <path d="M7 17L17 7" />
                                    <path d="M7 7h10v10" />
                                </svg>
                            </button>
                        </div>

                        <LandscapeProductCard
                            label={
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    Birthday Scrapbook <span style={{ opacity: 0.5 }}>•</span> New Release
                                </div>
                            }
                            title="Birthday Scrapbook"
                            description="Rayakan momen ulang tahun spesial dengan scrapbook digital interaktif. Tersedia pilihan tema Snoopy Comic, Dubu & Dudu, dan Nailong, lengkap dengan 15 galeri foto/video polaroid, 3 playlist soundtrack musik, surat personal, dan wish inbox interaktif."
                            features={[
                                "Pilihan Tema: Snoopy, Dubu & Nailong",
                                "4 Ruangan Interaktif",
                                "3 Playlist Soundtrack Musik",
                                "Surat Digital & Wish Inbox",
                                "Akses Instan & Custom Studio"
                            ]}
                            price="Rp 25.000"
                            oldPrice="Rp 35.000"
                            demoLink="https://snoopy.for-you-always.my.id/gift?project=gift-f0d02efd7edcbf62"
                            demoLabel="Lihat"
                            fallbackImgSrc="/assets/snoopy-features/main-card-updatesnoopy.webp"
                            mediaType="image"
                            accentColor="#bf7b19"
                            accentGlow="rgba(191, 123, 25, 0.2)"
                            onAddToCart={() => addToCart({
                                id: "birthday",
                                title: "Birthday Scrapbook",
                                numericPrice: 25000,
                                oldNumericPrice: 35000,
                                themeColor: "#bf7b19"
                            })}
                            themesLabel="Pilih Tema Scrapbook"
                            themes={[
                                {
                                    name: "Snoopy Comic",
                                    desc: "Tema scrapbook komik retro yang hangat & ceria bersama Snoopy & Woodstock",
                                    title: "Snoopy Birthday Scrapbook",
                                    description: "Kado ulang tahun digital interaktif bergaya komik retro Snoopy. Hadir dengan 4 ruangan kejutan lengkap: amplop interaktif, galeri hingga 15 foto/video polaroid, 3 playlist musik, surat personal, dan wish inbox.",
                                    color: "#bf7b19",
                                    features: [
                                        "4 Ruangan Interaktif",
                                        "Hingga 15 Foto & Video Polaroid",
                                        "3 Playlist Soundtrack Musik",
                                        "Surat Digital & Wish Inbox",
                                        "Akses Instan & Custom Studio"
                                    ],
                                    demoLink: "https://snoopy.for-you-always.my.id/gift?project=gift-f0d02efd7edcbf62",
                                    demoLabel: "Lihat",
                                    demoVariantId: "snoopy",
                                    defaultSubThemeIndex: 0,
                                    subThemes: [
                                        { name: "Opening", fallbackImgSrc: "/assets/snoopy-features/opening-1.webp" },
                                        { name: "Wishes", fallbackImgSrc: "/assets/snoopy-features/wishes-2.webp" },
                                        { name: "Scrapbook", fallbackImgSrc: "/assets/snoopy-features/main-card-updatesnoopy.webp" },
                                        { name: "Wish Inbox", fallbackImgSrc: "/assets/snoopy-features/wish-card-update-snoopy.webp" },
                                        { name: "Galeri", fallbackImgSrc: "/assets/snoopy-features/room-galleries-5.webp" },
                                        { name: "Musik", fallbackImgSrc: "/assets/snoopy-features/room-music-6.webp" },
                                        { name: "Surat", fallbackImgSrc: "/assets/snoopy-features/letter-7.webp" },
                                        { name: "Perayaan", fallbackImgSrc: "/assets/snoopy-features/ending-8.webp" }
                                    ]
                                },
                                {
                                    name: "Dubu & Dudu",
                                    desc: "Tema warm pastel yang manis, menggemaskan, dan penuh kehangatan",
                                    title: "Dubu & Dudu Scrapbook",
                                    description: "Rayakan hari ulang tahun orang tersayang bersama karakter menggemaskan Dubu & Dudu. Penuh nuansa lembut pastel dengan 4 ruangan kenangan, pemutar musik, surat cinta, dan perayaan meriah.",
                                    color: "#bf7b19",
                                    features: [
                                        "Nuansa Visual Warm Pastel",
                                        "4 Ruangan Interaktif",
                                        "3 Playlist Soundtrack Musik",
                                        "Surat Digital & Wish Inbox",
                                        "Akses Instan & Custom Studio"
                                    ],
                                    demoLink: "https://snoopy.for-you-always.my.id/gift/index.html?project=gift-ab79b22216982751",
                                    demoLabel: "Lihat",
                                    demoVariantId: "dubu-dudu",
                                    defaultSubThemeIndex: 0,
                                    subThemes: [
                                        { name: "Opening", fallbackImgSrc: "/assets/dubu-features/opening-dubu-1.webp" },
                                        { name: "Wishes", fallbackImgSrc: "/assets/dubu-features/opening-dubu-2.webp" },
                                        { name: "Scrapbook", fallbackImgSrc: "/assets/dubu-features/main-carddubu-3.webp" },
                                        { name: "Wish Inbox", fallbackImgSrc: "/assets/dubu-features/room-wishdubu-4.webp" },
                                        { name: "Galeri", fallbackImgSrc: "/assets/dubu-features/room-galleriesdubu-5.jpg" },
                                        { name: "Musik", fallbackImgSrc: "/assets/dubu-features/room-musicdubu-6.webp" },
                                        { name: "Surat", fallbackImgSrc: "/assets/dubu-features/room-letterdubu-7.webp" },
                                        { name: "Perayaan", fallbackImgSrc: "/assets/dubu-features/room-endingdubu-8.webp" }
                                    ]
                                },
                                {
                                    name: "Nailong",
                                    desc: "Tema naga kuning ceria yang riang, menggemaskan, playful, dan penuh energi",
                                    title: "Nailong Birthday Scrapbook",
                                    description: "Rayakan hari ulang tahun spesial bersama karakter naga kuning Nailong yang lucu dan playful. Hadir dengan 4 ruangan kejutan interaktif, galeri foto/video polaroid, pemutar musik, surat personal, dan wish inbox.",
                                    color: "#f5a623",
                                    features: [
                                        "Nuansa Visual Ceria & Playful",
                                        "4 Ruangan Interaktif",
                                        "3 Playlist Soundtrack Musik",
                                        "Surat Digital & Wish Inbox",
                                        "Akses Instan & Custom Studio"
                                    ],
                                    demoDisabled: true,
                                    defaultSubThemeIndex: 0,
                                    subThemes: [
                                        { name: "Opening", fallbackImgSrc: "/assets/nailong-features/opening.webp" },
                                        { name: "Wishes", fallbackImgSrc: "/assets/nailong-features/wish.webp" },
                                        { name: "Scrapbook", fallbackImgSrc: "/assets/nailong-features/scrapebook.webp" },
                                        { name: "Wish Inbox", fallbackImgSrc: "/assets/nailong-features/warmwishes.webp" },
                                        { name: "Galeri", fallbackImgSrc: "/assets/nailong-features/room-galleries-5.webp" },
                                        { name: "Musik", fallbackImgSrc: "/assets/nailong-features/song.webp" },
                                        { name: "Surat", fallbackImgSrc: "/assets/nailong-features/letter.webp" },
                                        { name: "Perayaan", fallbackImgSrc: "/assets/nailong-features/perayaan.webp" }
                                    ]
                                }
                            ]}
                            delay={0}
                            reverse={false}
                            initialSelectedIndex={0}
                            autoCycle={false}
                            onDemoOpen={(url, label, metadata) => openDemo(url, label, metadata?.variantId)}
                        />

                        {/* Wish Inbox Info Walkthrough Modal */}
                        <WishInboxInfoModal
                            isOpen={isWishInboxModalOpen}
                            onClose={() => setIsWishInboxModalOpen(false)}
                        />

                        {activeDemo && (
                            <DemoPreviewModal
                                isOpen
                                src={activeDemo.url}
                                title="Demo Birthday Scrapbook"
                                subtitle="Jelajahi scrapbook digital interaktif dengan 4 ruangan kejutan"
                                productName="Birthday Scrapbook"
                                price="Rp 25.000"
                                theme="birthday"
                                variants={BIRTHDAY_DEMO_VARIANTS}
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

