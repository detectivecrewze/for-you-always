"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import DemoPreviewModal, { scheduleDemoPreviewPreload } from "../../../components/LazyDemoPreviewModal";
import type { DemoCloseReason, DemoPreviewVariant } from "../../../components/DemoPreviewModal";
import { useCart } from "../../../context/CartContext";
import Link from "next/link";
import { trackViewContent } from "@/lib/pixel";
import { INVITATION_DEMO_VARIANTS } from "@/lib/storefront-demo-config";

interface ActiveDemo {
    url: string;
    label: string;
    variant: string;
    source: "product_card";
    switchCount: number;
}


const INVITATION_CART_ITEM = {
    id: "invitation",
    title: "Invitation Edition",
    numericPrice: 20000,
    oldNumericPrice: 30000,
    themeColor: "#8a3050",
};

function captureDemoEvent(event: string, properties: Record<string, unknown>) {
    void import("posthog-js")
        .then(({ default: posthog }) => posthog.capture(event, properties))
        .catch(() => {});
}

export default function InvitationCatalogPage() {
    const { addToCart } = useCart();
    const [activeDemo, setActiveDemo] = useState<ActiveDemo | null>(null);
    const demoOpenedAtRef = useRef(0);

    useEffect(() => {
        const cancelDemoPreload = scheduleDemoPreviewPreload();
        window.scrollTo(0, 0);
        trackViewContent({ id: "invitation", name: "Invitation Edition", price: 20000 });
        return cancelDemoPreload;
    }, []);

    const demoAnalyticsProperties = useCallback((demo: ActiveDemo) => ({
        product_id: "invitation",
        product_name: "Invitation Edition",
        demo_label: demo.label,
        demo_variant: demo.variant,
        source: demo.source,
        variant_switch_count: demo.switchCount,
    }), []);

    const openDemo = useCallback((url: string, label: string, variantId?: string) => {
        demoOpenedAtRef.current = performance.now();
        const variant = INVITATION_DEMO_VARIANTS.find((item) => item.id === variantId || item.src === url) ?? INVITATION_DEMO_VARIANTS[0];
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
                price: INVITATION_CART_ITEM.numericPrice,
                currency: "IDR",
            });
        }
        addToCart(INVITATION_CART_ITEM);
    }, [activeDemo, addToCart, demoAnalyticsProperties]);

    return (
        <div style={{ minHeight: "100vh", background: "#faf7f2" }}>
            <Navbar />

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

            <section style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <LandscapeProductCard
                            label="Invitation Edition"
                            title="Undangan Kencan Interaktif"
                            description="Kirimkan undangan kencan yang manis dan interaktif kepada orang spesialmu. Pilih paket reguler untuk 1 undangan atau paket 3 Gift untuk membuat 3 undangan berbeda."
                            features={[
                                "Pilihan Paket 1 atau 3 Gift",
                                "Amplop Digital Interaktif",
                                "Pilih Tanggal Kencan Berdua",
                                "Pilih Aktivitas & Dress Code",
                                "Background Music Pilihan"
                            ]}
                            price="Rp 20.000"
                            oldPrice="Rp 30.000"
                            demoLink="https://invitation.for-you-always.my.id/WRcVb-mY0f"
                            mediaSrc="https://cdn.for-you-always.my.id/1782232677562-8sosah.webp"
                            fallbackImgSrc="https://cdn.for-you-always.my.id/1782232677562-8sosah.webp"
                            mediaType="image"
                            accentColor="#e8789a"
                            accentGlow="rgba(232,120,154,0.2)"
                            onAddToCart={() => addToCart({ id: "invitation", title: "Invitation Edition", numericPrice: 20000, oldNumericPrice: 30000, themeColor: "#8a3050" })}
                            onAddThreeSlotToCart={() => addToCart({ id: "invitation", title: "Invitation Edition (3 Gift)", numericPrice: 25000, themeColor: "#8a3050", isThreeSlot: true, slotCount: 3 })}
                            themesLabel="Pilih Mode & Template"
                            themes={[
                                {
                                    name: "Invitation Date",
                                    desc: "Kartu undangan kencan interaktif dengan date picker & dress code",
                                    title: "Undangan Kencan Interaktif",
                                    description: "Kirimkan undangan kencan yang manis dan interaktif kepada orang spesialmu. Pilih paket reguler untuk 1 undangan atau paket 3 Gift untuk membuat 3 undangan berbeda.",
                                    color: "#e8789a",
                                    features: [
                                        "Pilihan Paket 1 atau 3 Gift",
                                        "Amplop Digital Interaktif",
                                        "Pilih Tanggal Kencan Berdua",
                                        "Pilih Aktivitas & Dress Code",
                                        "Background Music Pilihan"
                                    ],
                                    demoLink: "https://invitation.for-you-always.my.id/WRcVb-mY0f",
                                    demoLabel: "Lihat Demo Invitation",
                                    demoVariantId: "invitation-date",
                                    defaultSubThemeIndex: 0,
                                    subThemes: [
                                        { name: "Opening", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210841269-q6ybib.webp" },
                                        { name: "Invitation", fallbackImgSrc: "https://cdn.for-you-always.my.id/1782232677562-8sosah.webp" },
                                        { name: "Date Picker", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210838838-b3w88t.webp" },
                                        { name: "Date Activity", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210838139-qf8gc.webp" },
                                        { name: "Dress Code", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210839542-jybloo.webp" },
                                        { name: "Notes", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210840694-hzo19n.webp" },
                                        { name: "Ending", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210842087-xguq5o.webp" }
                                    ]
                                },
                                {
                                    name: "Rundown Date",
                                    desc: "Jadwal & susunan acara kencan interaktif bernuansa estetik",
                                    title: "Rundown Kencan Interaktif",
                                    description: "Buat susunan acara kencan yang rapi dan estetik untuk hari spesialmu. Pasanganmu bisa melihat jadwal kencan, dress code, dan catatan manis secara interaktif.",
                                    color: "#2b5c8f",
                                    features: [
                                        "Pilihan Paket 1 atau 3 Gift",
                                        "Amplop Digital Interaktif",
                                        "Kartu Rundown & Susunan Acara",
                                        "Pilih Dress Code & Catatan",
                                        "Background Music Pilihan"
                                    ],
                                    demoLink: "https://invitation.for-you-always.my.id/rundown-tqthew7",
                                    demoLabel: "Lihat Demo Rundown",
                                    demoVariantId: "rundown-date",
                                    defaultSubThemeIndex: 0,
                                    subThemes: [
                                        { name: "Opening", fallbackImgSrc: "/assets/rundown-photo/1-ticket-card-opening.webp" },
                                        { name: "Flower Burst", fallbackImgSrc: "/assets/rundown-photo/2-flower-burst-transistion.webp" },
                                        { name: "Invitation", fallbackImgSrc: "/assets/rundown-photo/3-step1-photos-invitation.webp" },
                                        { name: "Rundown", fallbackImgSrc: "/assets/rundown-photo/4-rundown.webp" },
                                        { name: "Dress Code", fallbackImgSrc: "/assets/rundown-photo/4-dress-code.webp" },
                                        { name: "Notes", fallbackImgSrc: "/assets/rundown-photo/5-note-from-user.webp" },
                                        { name: "Ending Ticket", fallbackImgSrc: "/assets/rundown-photo/7-ticket-rundown.webp" }
                                    ]
                                }
                            ]}
                            delay={0}
                            reverse={false}
                            initialSelectedIndex={0}
                            autoCycle={false}
                            onDemoOpen={(url, label, metadata) => openDemo(url, label, metadata?.variantId)}
                        />

                        {activeDemo && (
                            <DemoPreviewModal
                                isOpen
                                src={activeDemo.url}
                                title="Demo Invitation Edition"
                                subtitle="Rasakan pengalaman tiket kencan digital interaktif"
                                productName="Invitation Edition"
                                price="Rp 20.000"
                                theme="invitation"
                                variants={INVITATION_DEMO_VARIANTS}
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
