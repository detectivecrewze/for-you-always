"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/Navbar";

import { trackViewContent } from "@/lib/pixel";
import UnboxCheckoutModal from "../../../components/UnboxCheckoutModal";

// SHOPEE STORE LINK
const SHOPEE_URL = "https://shopee.co.id"; // Link toko Shopee resmi Aldo saat siap

// ULTRA-LIGHT SECTION WRAPPER (MAXIMUM MOBILE PERFORMANCE)
function SpringAnimatedSection({ children }: { children: React.ReactNode; delay?: number }) {
    return <>{children}</>;
}

// 3-GRID SHOWCASE CARD WITH CLEAN HOVER & MOBILE TAP TRANSITION
function ShowcaseGridCard({
    img,
    hoverImg,
    title,
    desc,
    objectPosition = "center 48%"
}: {
    img: string;
    hoverImg?: string;
    title: string;
    desc: string;
    objectPosition?: string;
}) {
    const [activeIdx, setActiveIdx] = useState(0);

    const isShowingSecond = hoverImg && activeIdx === 1;

    return (
        <div
            onMouseEnter={() => {
                if (hoverImg) setActiveIdx(1);
            }}
            onMouseLeave={() => {
                if (hoverImg) setActiveIdx(0);
            }}
            onClick={() => {
                if (hoverImg) setActiveIdx(prev => prev === 0 ? 1 : 0);
            }}
            style={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(205,171,143,0.25)",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: isShowingSecond ? "0 18px 40px -12px rgba(56,42,36,0.12)" : "0 10px 30px -10px rgba(56,42,36,0.06)",
                transform: isShowingSecond ? "translateY(-4px)" : "translateY(0)",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: hoverImg ? "pointer" : "default"
            }}
        >
            <div style={{ height: "230px", overflow: "hidden", position: "relative", backgroundColor: "#1d1816" }}>
                <Image
                    src={img}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    style={{
                        objectFit: "cover",
                        objectPosition: objectPosition,
                        transform: isShowingSecond ? "scale(1.04)" : "scale(1)",
                        opacity: isShowingSecond ? 0 : 1,
                        transition: "transform 0.5s ease, opacity 0.3s ease",
                    }}
                />
                {hoverImg && (
                    <Image
                        src={hoverImg}
                        alt={`${title} Detail`}
                        fill
                        sizes="(max-width: 768px) 100vw, 360px"
                        style={{
                            objectFit: "cover",
                            objectPosition: "center 48%",
                            transform: isShowingSecond ? "scale(1.04)" : "scale(1)",
                            opacity: isShowingSecond ? 1 : 0,
                            transition: "transform 0.5s ease, opacity 0.3s ease",
                            pointerEvents: isShowingSecond ? "auto" : "none",
                        }}
                    />
                )}

                {/* NUMBER & DOT INDICATOR FOR MULTI-PHOTO CARDS (MOBILE & DESKTOP) */}
                {hoverImg && (
                    <div style={{
                        position: "absolute",
                        bottom: "12px",
                        right: "12px",
                        backgroundColor: "rgba(29, 24, 22, 0.78)",
                        backdropFilter: "blur(8px)",
                        color: "#faf7f2",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        padding: "3px 9px",
                        borderRadius: "20px",
                        letterSpacing: "0.06em",
                        border: "1px solid rgba(205, 171, 143, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        pointerEvents: "none",
                        zIndex: 2
                    }}>
                        <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: activeIdx === 0 ? "#cdab8f" : "rgba(250,247,242,0.35)", transition: "all 0.3s ease" }} />
                            <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: activeIdx === 1 ? "#cdab8f" : "rgba(250,247,242,0.35)", transition: "all 0.3s ease" }} />
                        </div>
                        <span>{activeIdx + 1} / 2</span>
                    </div>
                )}
            </div>
            <div style={{ padding: "24px" }}>
                <h3 style={{
                    fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                    fontSize: "1.45rem",
                    fontWeight: 600,
                    color: "#382a24",
                    marginBottom: "8px"
                }}>
                    {title}
                </h3>
                <p style={{ fontSize: "0.88rem", color: "#6e5c53", lineHeight: 1.6, margin: 0 }}>
                    {desc}
                </p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 📸 CDN IMAGE ASSETS CONFIGURATION
// Ganti URL di bawah ini dengan link CDN foto baru saat sudah siap diupload.
// ─────────────────────────────────────────────────────────────────────────────
export const GIFT_BOX_ASSETS = {
    // 1. Foto Hero / Preview Box (Otomatis berganti saat switch tab Kraft / Hardbox)
    kraftBoxHero: "/assets/classic-kraftbox/kraftbox-hero.jpg",        // Foto Classic Kraft Box
    hardboxHero: "https://cdn.for-you-always.my.id/1786911997774-xrhcf4.jpg",       // Foto Signature Hardbox (Rigid)

    // 2. Foto Kartu 3-Grid Showcase (Classic Kraft Box)
    kraftBoxCardFront: "/assets/classic-kraftbox/classic-kraftbox1.webp",  // Foto depan Classic Kraft Box
    kraftBoxCardHover: "/assets/classic-kraftbox/classic-kraftbox2.webp",  // Foto detail Classic Kraft Box

    // 3. Foto Kartu 3-Grid Showcase (Signature Hardbox)
    luxuryBoxCardFront: "/the-gift-box/IMG_2214_hd.webp",                            // Foto depan (Slide 1) Signature Hardbox
    luxuryBoxCardHover: "https://cdn.for-you-always.my.id/1786961453803-dxyo1x.png", // Foto detail / dalam (Slide 2) Signature Hardbox
};

export default function TheGiftBoxPage() {
    const [selectedDigitalExperience, setSelectedDigitalExperience] = useState<"memoria" | "birthday" | "letter" | "voices">("letter");
    const [selectedBoxType, setSelectedBoxType] = useState<"kraft" | "hardbox">("kraft");
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [stocks, setStocks] = useState<{
        kraft: { stock: number; in_stock: boolean; is_low_stock: boolean };
        hardbox: { stock: number; in_stock: boolean; is_low_stock: boolean };
    }>({
        kraft: { stock: 10, in_stock: true, is_low_stock: false },
        hardbox: { stock: 8, in_stock: true, is_low_stock: false },
    });

    const stockData = stocks[selectedBoxType];

    // Pilihan Box Fisik
    const BOX_TYPES = {
        hardbox: {
            id: "hardbox",
            name: "Signature Hardbox",
            tagline: "Hardbox premium rigid, finishing elegan & berkelas.",
            basePrice: 0,
            badge: "Signature",
            badgeColor: "#a67c52",
            imageSrc: GIFT_BOX_ASSETS.hardboxHero,
        },
        kraft: {
            id: "kraft",
            name: "Classic Kraft Box",
            tagline: "Kotak kraft natural premium, kesan hangat & timeless.",
            basePrice: 75000,
            badge: "Lebih Hemat",
            badgeColor: "#2e7d32",
            imageSrc: GIFT_BOX_ASSETS.kraftBoxHero,
        },
    } as const;

    useEffect(() => {
        trackViewContent({ id: "the-gift-box", name: "The Gift Box" });
    }, []);

    useEffect(() => {
        // Live sync Kraft stock
        fetch("/api/inventory?product_id=the-gift-box-kraft")
            .then((res) => res.json())
            .then((data) => {
                if (data && typeof data.stock === "number") {
                    setStocks((prev) => ({
                        ...prev,
                        kraft: {
                            stock: data.stock,
                            in_stock: data.in_stock,
                            is_low_stock: data.is_low_stock,
                        },
                    }));
                }
            })
            .catch(() => {});

        // Live sync Hardbox stock
        fetch("/api/inventory?product_id=the-gift-box")
            .then((res) => res.json())
            .then((data) => {
                if (data && typeof data.stock === "number") {
                    setStocks((prev) => ({
                        ...prev,
                        hardbox: {
                            stock: data.stock,
                            in_stock: data.in_stock,
                            is_low_stock: data.is_low_stock,
                        },
                    }));
                }
            })
            .catch(() => {});
    }, []);

    const tabContainerRef = useRef<HTMLDivElement>(null);
    const isFirstRender = useRef(true);
    const experienceKeys: Array<"memoria" | "birthday" | "letter" | "voices"> = ["memoria", "birthday", "letter", "voices"];

    const handleTabChange = (key: keyof typeof digitalExperiences) => {
        if (key === selectedDigitalExperience) return;
        setSelectedDigitalExperience(key);
    };

    const handlePrevTab = () => {
        const currentIndex = experienceKeys.indexOf(selectedDigitalExperience);
        const nextIndex = (currentIndex - 1 + experienceKeys.length) % experienceKeys.length;
        setSelectedDigitalExperience(experienceKeys[nextIndex]);
    };

    const handleNextTab = () => {
        const currentIndex = experienceKeys.indexOf(selectedDigitalExperience);
        const nextIndex = (currentIndex + 1) % experienceKeys.length;
        setSelectedDigitalExperience(experienceKeys[nextIndex]);
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (tabContainerRef.current) {
            const activeBtn = tabContainerRef.current.querySelector(`[data-tab-key="${selectedDigitalExperience}"]`) as HTMLElement;
            if (activeBtn) {
                const container = tabContainerRef.current;
                const scrollLeft = activeBtn.offsetLeft - (container.clientWidth / 2) + (activeBtn.clientWidth / 2);
                container.scrollTo({ left: scrollLeft, behavior: "smooth" });
            }
        }
    }, [selectedDigitalExperience]);

    const digitalExperiences = {
        memoria: {
            title: "Memoria",
            subtitle: "Kisah Cinta Sinematik Eksklusif",
            desc: "Halaman interaktif ultra-premium dengan animasi kelas atas, menceritakan perjalanan kasih kalian secara spesial.",
            badge: "Signature",
            color: "#a67c52",
            kraftPrice: "Rp 85.000",
            kraftOldPrice: "Rp 110.000",
            kraftNumericPrice: 85000,
            hardboxPrice: "Rp 150.000",
            hardboxOldPrice: "Rp 200.000",
            hardboxNumericPrice: 150000,
            previewUrl: "/catalog/memoria",
            imageSrc: "/assets/opening_gate.png"
        },
        birthday: {
            title: "Birthday Scrapbook",
            subtitle: "Scrapbook Interaktif & Wish Inbox",
            desc: "Rayakan momen ulang tahun spesial dengan scrapbook interaktif 4 ruangan, 15 galeri polaroid foto/video, 3 soundtrack musik latar, surat digital, dan wish inbox.",
            badge: "Birthday",
            color: "#bf7b19",
            kraftPrice: "Rp 80.000",
            kraftOldPrice: "Rp 105.000",
            kraftNumericPrice: 80000,
            hardboxPrice: "Rp 135.000",
            hardboxOldPrice: "Rp 180.000",
            hardboxNumericPrice: 135000,
            previewUrl: "/catalog/birthday",
            imageSrc: "/assets/snoopy-features/main-card-updatesnoopy.webp"
        },
        letter: {
            title: "Letter Edition",
            subtitle: "Surat Digital & Amplop Interaktif",
            desc: "Penerima akan membuka amplop digital dengan animasi typewriter sinematik, musik latar syahdu, serta galeri kenangan tersembunyi.",
            badge: "Best Seller",
            color: "#a67c52",
            kraftPrice: "Rp 75.000",
            kraftOldPrice: "Rp 100.000",
            kraftNumericPrice: 75000,
            hardboxPrice: "Rp 135.000",
            hardboxOldPrice: "Rp 180.000",
            hardboxNumericPrice: 135000,
            previewUrl: "/catalog/letter",
            imageSrc: "https://cdn.for-you-always.my.id/1783163306081-l92p1h.webp"
        },
        voices: {
            title: "Voices Gift",
            subtitle: "Rekaman Suara Pribadi & Galeri Foto",
            desc: "Pesan suara penuh kehangatan yang diputar otomatis bersama kompilasi foto kenangan terbaik kalian berdua.",
            badge: "",
            color: "#a67c52",
            kraftPrice: "Rp 75.000",
            kraftOldPrice: "Rp 100.000",
            kraftNumericPrice: 75000,
            hardboxPrice: "Rp 135.000",
            hardboxOldPrice: "Rp 180.000",
            hardboxNumericPrice: 135000,
            previewUrl: "/catalog/voices",
            imageSrc: "https://cdn.for-you-always.my.id/1777881039502-bav595.webp"
        }
    };

    const currentBox = BOX_TYPES[selectedBoxType];
    const currentExp = digitalExperiences[selectedDigitalExperience];
    const displayPrice = selectedBoxType === "kraft"
        ? currentExp.kraftNumericPrice
        : currentExp.hardboxNumericPrice;
    const displayOldPrice = selectedBoxType === "kraft"
        ? currentExp.kraftOldPrice
        : currentExp.hardboxOldPrice;

    return (
        <div style={{ backgroundColor: "#faf7f2", color: "#382a24", minHeight: "100vh", fontFamily: "var(--font-sans, system-ui, sans-serif)", position: "relative", overflowX: "hidden" }}>

            {/* GLOBAL FLOATING NAVBAR */}
            <Navbar />

            {/* AMBIENT BACKGROUND BLOBS */}
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-10%", left: "-5%", width: "50vw", height: "50vw", borderRadius: "50%", background: "rgba(205,171,143,0.08)", filter: "blur(130px)" }} />
                <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50vw", height: "50vw", borderRadius: "50%", background: "rgba(205,171,143,0.05)", filter: "blur(130px)" }} />
            </div>

            {/* ── HERO SECTION ── */}
            <section style={{
                position: "relative",
                zIndex: 1,
                paddingTop: "clamp(120px, 15vh, 150px)",
                paddingBottom: "clamp(50px, 7vh, 80px)",
                maxWidth: "1160px",
                margin: "0 auto",
                paddingLeft: "24px",
                paddingRight: "24px"
            }}>
                {/* MINIMALIST BREADCRUMB */}
                <div style={{ marginBottom: "24px" }}>
                    <Link
                        href="/catalog"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            color: "#8a7569",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            textDecoration: "none",
                            letterSpacing: "0.02em",
                            transition: "color 0.2s ease"
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color = "#382a24";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = "#8a7569";
                        }}
                    >
                        <span>Catalog</span>
                        <span style={{ opacity: 0.4 }}>/</span>
                        <span style={{ color: "#382a24", fontWeight: 600 }}>The Gift Box</span>
                    </Link>
                </div>

                {/* HERO 2-COLUMN LAYOUT: PHOTO ON LEFT, TEXT ON RIGHT */}
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "clamp(36px, 5vw, 56px)"
                }}>
                    {/* LEFT COLUMN: HERO HAMPERS SHOWCASE IMAGE CARD */}
                    <div
                        style={{
                            flex: "1 1 380px",
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <div style={{
                            position: "relative",
                            width: "100%",
                            maxWidth: "480px",
                            aspectRatio: "4 / 3",
                            borderRadius: "24px",
                            overflow: "hidden",
                            border: "1px solid rgba(205,171,143,0.3)",
                            boxShadow: "0 18px 45px -12px rgba(56,42,36,0.12)",
                            background: "#2a211c"
                        }}>
                            {/* Layer 1: Classic Kraft Box Photo (Instant Preload & Zero Delay) */}
                            <Image
                                src={GIFT_BOX_ASSETS.kraftBoxHero}
                                alt="Classic Kraft Box"
                                fill
                                sizes="(max-width: 768px) 100vw, 480px"
                                style={{
                                    objectFit: "cover",
                                    objectPosition: "center 48%",
                                    borderRadius: "24px",
                                    opacity: selectedBoxType === "kraft" ? 1 : 0,
                                    transition: "opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                                    pointerEvents: selectedBoxType === "kraft" ? "auto" : "none",
                                }}
                                priority
                            />
                            {/* Layer 2: Signature Hardbox Photo (Instant Preload & Zero Delay) */}
                            <Image
                                src={GIFT_BOX_ASSETS.hardboxHero}
                                alt="Signature Hardbox"
                                fill
                                sizes="(max-width: 768px) 100vw, 480px"
                                style={{
                                    objectFit: "cover",
                                    objectPosition: "center 48%",
                                    borderRadius: "24px",
                                    opacity: selectedBoxType === "hardbox" ? 1 : 0,
                                    transition: "opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                                    pointerEvents: selectedBoxType === "hardbox" ? "auto" : "none",
                                }}
                                priority
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: EYEBROW, H1, DESC, PRICE & CTAS */}
                    <div style={{ flex: "1 1 440px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        
                        {/* EYEBROW */}
                        <span style={{
                            fontSize: "0.76rem",
                            fontWeight: 700,
                            letterSpacing: "0.22em",
                            textTransform: "uppercase",
                            color: "#a88365",
                            display: "block",
                            marginBottom: "12px"
                        }}>
                            THE GIFT BOX
                        </span>

                        {/* H1 HEADLINE */}
                        <h1 style={{
                            fontFamily: "var(--font-display, Cormorant Garamond, Georgia, serif)",
                            fontSize: "clamp(2.4rem, 4.4vw, 3.8rem)",
                            fontWeight: 400,
                            lineHeight: 1.08,
                            color: "#382a24",
                            marginBottom: "16px",
                            letterSpacing: "-0.03em",
                            textAlign: "left"
                        }}>
                            Made To Be<br />
                            <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Remembered.</span>
                        </h1>
                        {/* DESCRIPTION PARAGRAPH */}
                        <p style={{
                            fontSize: "clamp(0.92rem, 1.5vw, 1.02rem)",
                            color: "#6e5c53",
                            lineHeight: 1.65,
                            marginBottom: "20px",
                            fontWeight: 400,
                            maxWidth: "460px",
                            textAlign: "left"
                        }}>
                            Gift box fisik dengan kejutan digital personal, dibuat untuk menyampaikan sesuatu yang sulit diucapkan langsung.
                        </p>

                        {/* EDITORIAL PRICE & REALTIME STOCK */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "8px 12px",
                            width: "100%",
                            maxWidth: "440px",
                            marginBottom: "16px",
                            paddingBottom: "14px",
                            borderBottom: "1px solid rgba(205, 171, 143, 0.25)"
                        }}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
                                <span style={{
                                    fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                                    fontSize: "clamp(1.85rem, 3.8vw, 2.4rem)",
                                    fontWeight: 700,
                                    color: "#1d1816",
                                    lineHeight: 1,
                                    whiteSpace: "nowrap"
                                }}>
                                    Rp {displayPrice.toLocaleString("id-ID")}
                                </span>
                                {displayOldPrice && (
                                    <span style={{ fontSize: "0.92rem", color: "#a89589", textDecoration: "line-through", whiteSpace: "nowrap" }}>
                                        {displayOldPrice}
                                    </span>
                                )}
                                <span style={{
                                    fontSize: "0.68rem",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                    color: selectedBoxType === "kraft" ? "#2e7d32" : "#a67c52",
                                    backgroundColor: selectedBoxType === "kraft" ? "#e8f5e9" : "rgba(166,124,82,0.12)",
                                    padding: "3px 8px",
                                    borderRadius: "999px",
                                    whiteSpace: "nowrap",
                                    flexShrink: 0
                                }}>
                                    {selectedBoxType === "kraft" ? "All-in Bundle" : "Signature"}
                                </span>
                            </div>

                            <div style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "0.76rem",
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                                color: stockData.stock === 0 ? "#c62828" : stockData.is_low_stock ? "#b26a00" : "#2e7d32"
                            }}>
                                <span style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    backgroundColor: stockData.stock === 0 ? "#c62828" : stockData.is_low_stock ? "#b26a00" : "#2e7d32",
                                    display: "inline-block",
                                    flexShrink: 0
                                }} />
                                <span style={{ whiteSpace: "nowrap" }}>
                                    {stockData.stock === 0
                                        ? "Habis"
                                        : `Sisa ${stockData.stock} Box`}
                                </span>
                            </div>
                        </div>

                        {/* MINIMALIST SEGMENTED BOX SELECTOR */}
                        <div style={{ marginBottom: "20px", width: "100%", maxWidth: "440px" }}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                padding: "4px",
                                borderRadius: "14px",
                                backgroundColor: "rgba(205, 171, 143, 0.16)",
                                gap: "4px"
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedBoxType("kraft")}
                                    style={{
                                        padding: "10px 8px",
                                        borderRadius: "11px",
                                        border: "none",
                                        backgroundColor: selectedBoxType === "kraft" ? "#ffffff" : "transparent",
                                        color: "#1d1816",
                                        cursor: "pointer",
                                        boxShadow: selectedBoxType === "kraft" ? "0 2px 8px rgba(29, 24, 22, 0.08)" : "none",
                                        transition: "all 0.2s ease",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "6px",
                                        fontWeight: selectedBoxType === "kraft" ? 700 : 500,
                                        fontSize: "clamp(0.78rem, 2.3vw, 0.86rem)",
                                        minWidth: 0,
                                    }}
                                >
                                    <span style={{ whiteSpace: "nowrap" }}>Classic Kraft</span>
                                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#2e7d32", backgroundColor: "#e8f5e9", padding: "2px 7px", borderRadius: "999px", whiteSpace: "nowrap", flexShrink: 0 }}>
                                        75K
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setSelectedBoxType("hardbox")}
                                    style={{
                                        padding: "10px 8px",
                                        borderRadius: "11px",
                                        border: "none",
                                        backgroundColor: selectedBoxType === "hardbox" ? "#ffffff" : "transparent",
                                        color: "#1d1816",
                                        cursor: "pointer",
                                        boxShadow: selectedBoxType === "hardbox" ? "0 2px 8px rgba(29, 24, 22, 0.08)" : "none",
                                        transition: "all 0.2s ease",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "6px",
                                        fontWeight: selectedBoxType === "hardbox" ? 700 : 500,
                                        fontSize: "clamp(0.78rem, 2.3vw, 0.86rem)",
                                        minWidth: 0,
                                    }}
                                >
                                    <span style={{ whiteSpace: "nowrap" }}>Signature Hardbox</span>
                                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#a67c52", backgroundColor: "rgba(166,124,82,0.12)", padding: "2px 7px", borderRadius: "999px", whiteSpace: "nowrap", flexShrink: 0 }}>
                                        Rigid
                                    </span>
                                </button>
                            </div>

                            <div style={{ fontSize: "0.76rem", color: "#8a7569", marginTop: "8px", paddingLeft: "4px" }}>
                                {selectedBoxType === "kraft"
                                    ? "Kotak kraft natural aesthetic (All-in sudah termasuk box + kado digital)."
                                    : "Hardbox rigid premium eksklusif dengan balutan pita satin mewah."}
                            </div>
                        </div>

                        {/* CTA ACTION CONTAINER */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "440px", marginBottom: "20px" }}>
                            {/* Primary Order Button */}
                            {stockData.stock > 0 ? (
                                <Link
                                    href={`/catalog/the-gift-box/checkout?boxType=${selectedBoxType}&digital=${selectedDigitalExperience}`}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "10px",
                                        backgroundColor: "#1d1816",
                                        color: "#faf7f2",
                                        fontWeight: 700,
                                        fontSize: "0.94rem",
                                        padding: "15px 24px",
                                        borderRadius: "14px",
                                        textDecoration: "none",
                                        boxShadow: "0 8px 24px -6px rgba(29,24,22,0.25)",
                                        transition: "all 0.25s ease",
                                        textAlign: "center"
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.backgroundColor = "#382a24";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.backgroundColor = "#1d1816";
                                    }}
                                >
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                                    </svg>
                                    <span>Pesan Gift Box Sekarang</span>
                                </Link>
                            ) : (
                                <a
                                    href="https://wa.me/6281936109076?text=Halo%20For%20You%20Always,%20saya%20tertarik%20dengan%20The%20Gift%20Box.%20Apakah%20bisa%20ikut%20pre-order%20batch%20berikutnya?"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "10px",
                                        backgroundColor: "#7a685e",
                                        color: "#faf7f2",
                                        fontWeight: 700,
                                        fontSize: "0.92rem",
                                        padding: "14px 24px",
                                        borderRadius: "14px",
                                        textDecoration: "none",
                                        textAlign: "center"
                                    }}
                                >
                                    <span>Pre-Order Batch Berikutnya (Hubungi Admin)</span>
                                </a>
                            )}

                            {/* Minimalist Sub-Row (Jabodetabek Info + WhatsApp Consultation) */}
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "8px",
                                paddingTop: "4px",
                                fontSize: "0.78rem",
                                color: "#8a7569"
                            }}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a67c52" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    Khusus Jabodetabek
                                </span>

                                <a
                                    href="https://wa.me/6281936109076?text=Halo%20Admin%20For%20You%20Always,%20saya%20ingin%20konsultasi%20mengenai%20The%20Gift%20Box%20(Kraft%20/%20Hardbox)."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "5px",
                                        color: "#1d1816",
                                        fontWeight: 600,
                                        textDecoration: "none",
                                        transition: "color 0.2s ease"
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.color = "#25D366")}
                                    onMouseOut={(e) => (e.currentTarget.style.color = "#1d1816")}
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                    </svg>
                                    <span>Konsultasi WA ↗</span>
                                </a>
                            </div>
                        </div>

                        <Link
                            href="/catalog"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                color: "#8a7569",
                                fontSize: "0.78rem",
                                fontWeight: 500,
                                textDecoration: "none",
                                padding: "2px 0",
                                transition: "color 0.2s ease",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.color = "#382a24";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.color = "#8a7569";
                            }}
                        >
                            <span>Prefer a digital gift? Jelajahi Katalog →</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── PRODUCT SHOWCASE GALLERY GRID (KOMPONEN HAMPERS) ── */}
            <section style={{ padding: "80px 24px", maxWidth: "1160px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                <div style={{ textAlign: "center", marginBottom: "60px" }}>
                    <span style={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "#a88365",
                        display: "inline-block",
                        padding: "6px 20px",
                        border: "1.2px solid rgba(205,171,143,0.2)",
                        borderRadius: 999,
                        background: "rgba(205,171,143,0.08)",
                        marginBottom: "16px"
                    }}>
                        Curated Experience
                    </span>
                    <h2 style={{
                        fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                        fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
                        fontWeight: 400,
                        color: "#382a24",
                        lineHeight: 1.18,
                        letterSpacing: "-0.02em",
                    }}>
                        Everything Inside<br />
                        <span style={{ fontStyle: "italic", color: "#cdab8f" }}>For Your Special One</span>
                    </h2>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "24px"
                }}>
                    <ShowcaseGridCard
                        img={selectedBoxType === "kraft" ? GIFT_BOX_ASSETS.kraftBoxCardFront : GIFT_BOX_ASSETS.luxuryBoxCardFront}
                        hoverImg={selectedBoxType === "kraft" ? GIFT_BOX_ASSETS.kraftBoxCardHover : GIFT_BOX_ASSETS.luxuryBoxCardHover}
                        title={selectedBoxType === "kraft" ? "Classic Kraft Box" : "Signature Hardbox"}
                        desc={
                            selectedBoxType === "kraft"
                                ? "Kotak kraft natural aesthetic dengan sentuhan earthy & vintage yang hangat, dirancang ramah lingkungan dan penuh ketulusan untuk melengkapi kado spesialmu."
                                : "Hardbox eksklusif dengan balutan pita satin elegan, dirancang presisi untuk menghadirkan kesan mewah dan tak terlupakan sejak pertama kali digenggam."
                        }
                    />
                    <ShowcaseGridCard
                        img="/the-gift-box/IMG_2217_hd.webp"
                        title="Curated Keepsakes"
                        desc="Koleksi kecil penuh perhatian, mulai dari teddy bear mini, dried flowers, hingga sweet treats pilihan yang melengkapi momen hangatmu."
                    />
                    <ShowcaseGridCard
                        img="/the-gift-box/IMG_2215_hd.webp"
                        title="Personal QR Experience"
                        desc="Kartu akses ber-QR eksklusif yang menjadi gerbang pembuka menuju pengalaman kado digital interaktif — penuh dengan musik, foto, dan pesan yang dibuat khusus untuknya."
                        objectPosition="center center"
                    />
                </div>
            </section>

            {/* ── WORKFLOW / 3-STEP JOURNEY SECTION ── */}
            <section id="cara-kerja" style={{ position: "relative", zIndex: 1, padding: "90px 24px", background: "#f2ebe1", overflow: "hidden" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "70px" }}>
                        <span style={{
                            fontSize: "0.8rem", fontWeight: 700,
                            letterSpacing: "0.22em", textTransform: "uppercase", color: "#a88365",
                            display: "inline-block", padding: "6px 20px",
                            border: "1.2px solid rgba(205,171,143,0.2)", borderRadius: 999,
                            background: "rgba(205,171,143,0.08)", marginBottom: "20px"
                        }}>
                            Alur Pemesanan
                        </span>
                        <h2 style={{ fontFamily: "var(--font-display, Cormorant Garamond, serif)", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 400, color: "#382a24", lineHeight: 0.98 }}>
                            Semudah<br />
                            <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Tiga Langkah.</span>
                        </h2>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                        {[
                            {
                                num: "01",
                                title: "Pilih & Personalisasi",
                                desc: "Pilih format kado digital favoritmu (Letter, Voices, atau Memoria) dan lengkapi alamat pengiriman saat checkout.",
                                icon: (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                                    </svg>
                                )
                            },
                            {
                                num: "02",
                                title: "Kami Rangkai & Kirim",
                                desc: "Kami merangkai gift box eksklusif, mencetak Kartu Akses QR kado digitalmu, dan mengirimkannya dengan aman.",
                                icon: (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                    </svg>
                                )
                            },
                            {
                                num: "03",
                                title: "Scan QR & Buka Kado",
                                desc: "Penerima cukup scan kartu QR dengan kamera HP. Halaman kado digital langsung terbuka dengan musik dan animasi.",
                                icon: (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                                        <line x1="12" y1="18" x2="12.01" y2="18"></line>
                                    </svg>
                                )
                            }
                        ].map((step, i) => (
                            <SpringAnimatedSection key={i} delay={i * 120}>
                                <div style={{
                                    padding: "44px 36px",
                                    background: i === 1 ? "#1d1816" : "#ffffff",
                                    borderRadius: "24px",
                                    border: i === 1 ? "1px solid rgba(205,171,143,0.2)" : "1px solid rgba(205,171,143,0.25)",
                                    boxShadow: i === 1 ? "0 25px 50px -12px rgba(29,24,22,0.4)" : "0 8px 30px -8px rgba(29,24,22,0.04)",
                                    height: "100%"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                                        <span style={{ fontSize: 12, color: i === 1 ? "#cdab8f" : "#a6968c", fontWeight: 700, letterSpacing: "0.1em" }}>{step.num}</span>
                                        <div style={{ flex: 1, height: 1, background: i === 1 ? "rgba(205,171,143,0.15)" : "rgba(205,171,143,0.15)" }} />
                                        <div style={{ color: i === 1 ? "#cdab8f" : "#a6968c", display: "flex" }}>
                                            {step.icon}
                                        </div>
                                    </div>
                                    <h3 style={{ fontFamily: "var(--font-display, Cormorant Garamond, serif)", fontSize: "1.6rem", fontWeight: 500, color: i === 1 ? "#faf7f2" : "#382a24", marginBottom: 14, lineHeight: 1.15 }}>
                                        {step.title}
                                    </h3>
                                    <p style={{ fontSize: "0.9rem", color: i === 1 ? "rgba(250,247,242,0.65)" : "#6e5c53", lineHeight: 1.65, margin: 0 }}>
                                        {step.desc}
                                    </p>
                                </div>
                            </SpringAnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── INTERACTIVE DIGITAL EXPERIENCE PREVIEW ── */}
            <section style={{ padding: "90px 24px", maxWidth: "1160px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                <div style={{ textAlign: "center", marginBottom: "48px" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#a88365" }}>
                        Pilihan Konten Digital
                    </span>
                    <h2 style={{
                        fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                        fontSize: "clamp(2rem, 4vw, 3.2rem)",
                        fontWeight: 400,
                        color: "#382a24",
                        marginTop: "8px"
                    }}>
                        Apa Isi QR Code Di Dalam <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Kotak?</span>
                    </h2>
                    <p style={{ color: "#6e5c53", maxWidth: "580px", margin: "12px auto 0", fontSize: "0.98rem", lineHeight: 1.6 }}>
                        Pilih salah satu edisi digital favorit untuk disematkan secara eksklusif ke dalam Kartu QR Code hampers fisikmu.
                    </p>
                </div>

                {/* EXPERIENCE TABS CONTAINER WITH LEFT & RIGHT NAVIGATION ARROWS */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                    maxWidth: "760px",
                    margin: "0 auto 32px",
                    padding: "0 4px",
                    boxSizing: "border-box",
                }}>
                    {/* Left Navigation Arrow */}
                    <button
                        type="button"
                        onClick={handlePrevTab}
                        aria-label="Pilihan Format Sebelumnya"
                        style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            backgroundColor: "#ffffff",
                            border: "1.2px solid rgba(205,171,143,0.35)",
                            color: "#382a24",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            flexShrink: 0,
                            boxShadow: "0 3px 10px rgba(56,42,36,0.06)",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>

                    {/* 3 DIGITAL EXPERIENCE TABS (HORIZONTAL ROW / SIDE BY SIDE) */}
                    <div 
                        ref={tabContainerRef}
                        className="no-scrollbar"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            overflowX: "auto",
                            WebkitOverflowScrolling: "touch",
                            scrollbarWidth: "none",
                            padding: "6px 2px",
                            scrollBehavior: "smooth",
                            flex: "1 1 auto",
                            justifyContent: "flex-start",
                        }}
                    >
                        {(Object.keys(digitalExperiences) as Array<keyof typeof digitalExperiences>).map((key) => {
                            const exp = digitalExperiences[key];
                            const isSelected = selectedDigitalExperience === key;
                            return (
                                <button
                                    key={key}
                                    data-tab-key={key}
                                    onClick={() => handleTabChange(key)}
                                    style={{
                                        padding: "9px clamp(12px, 2.5vw, 20px)",
                                        borderRadius: "999px",
                                        border: isSelected ? `2px solid ${exp.color}` : "1.2px solid rgba(205,171,143,0.35)",
                                        backgroundColor: isSelected ? "#ffffff" : "rgba(255,255,255,0.65)",
                                        color: isSelected ? exp.color : "#5a483e",
                                        fontWeight: isSelected ? 700 : 600,
                                        fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        flexShrink: 0,
                                        boxShadow: isSelected ? "0 4px 16px rgba(0,0,0,0.07)" : "none",
                                        transform: isSelected ? "scale(1.02)" : "scale(1)",
                                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                                    }}
                                >
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                        <span>{exp.title}</span>
                                        <span style={{ fontSize: "0.75rem", opacity: isSelected ? 1 : 0.75, fontWeight: 700 }}>
                                            • {selectedBoxType === "kraft" ? exp.kraftPrice : exp.hardboxPrice}
                                        </span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Navigation Arrow */}
                    <button
                        type="button"
                        onClick={handleNextTab}
                        aria-label="Pilihan Format Berikutnya"
                        style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            backgroundColor: "#ffffff",
                            border: "1.2px solid rgba(205,171,143,0.35)",
                            color: "#382a24",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            flexShrink: 0,
                            boxShadow: "0 3px 10px rgba(56,42,36,0.06)",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>

                {/* DISPLAY SELECTED PREVIEW CARD */}
                {(() => {
                    const currentExp = digitalExperiences[selectedDigitalExperience];
                    return (
                        <div style={{
                            backgroundColor: "rgba(255,255,255,0.8)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255,255,255,0.9)",
                            borderRadius: "28px",
                            padding: "clamp(24px, 4vw, 48px)",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: "36px",
                            alignItems: "center",
                            boxShadow: "0 20px 45px -15px rgba(56,42,36,0.08)"
                        }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "18px" }}>
                                    {currentExp.badge ? (
                                        <span style={{
                                            backgroundColor: `${currentExp.color}15`,
                                            color: currentExp.color,
                                            fontSize: "0.78rem",
                                            fontWeight: 700,
                                            padding: "6px 14px",
                                            borderRadius: "20px",
                                            display: "inline-block",
                                            letterSpacing: "0.05em"
                                        }}>
                                            {currentExp.badge}
                                        </span>
                                    ) : null}
                                    <span style={{
                                        fontSize: "0.82rem",
                                        fontWeight: 700,
                                        color: "#1d1816",
                                        background: "#ffffff",
                                        border: "1px solid rgba(205,171,143,0.3)",
                                        padding: "5px 12px",
                                        borderRadius: "999px",
                                    }}>
                                        Paket Box: {selectedBoxType === "kraft" ? currentExp.kraftPrice : currentExp.hardboxPrice}
                                    </span>
                                </div>
                                <h3 style={{
                                    fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                                    fontSize: "clamp(2rem, 3.5vw, 2.5rem)",
                                    fontWeight: 500,
                                    color: "#382a24",
                                    marginBottom: "6px"
                                }}>
                                    {currentExp.title}
                                </h3>
                                <h4 style={{ fontSize: "1.02rem", color: currentExp.color, fontWeight: 600, marginBottom: "16px" }}>
                                    {currentExp.subtitle}
                                </h4>
                                <p style={{ fontSize: "0.93rem", color: "#6e5c53", lineHeight: 1.7, marginBottom: "28px" }}>
                                    {currentExp.desc}
                                </p>
                                <Link
                                    href={currentExp.previewUrl}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        color: currentExp.color,
                                        fontWeight: 700,
                                        textDecoration: "none",
                                        fontSize: "0.95rem"
                                    }}
                                >
                                    <span>Pratinjau Kado Digital Ini</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </Link>
                            </div>

                            {/* DYNAMIC SCREENSHOT PREVIEW MOCKUP */}
                            <div style={{
                                position: "relative",
                                borderRadius: "24px",
                                overflow: "hidden",
                                border: "1px solid rgba(205,171,143,0.3)",
                                backgroundColor: "#1d1816",
                                boxShadow: "0 15px 35px -10px rgba(56,42,36,0.2)"
                            }}>
                                <div style={{
                                    height: "260px",
                                    position: "relative",
                                    overflow: "hidden"
                                }}>
                                    <Image
                                        key={selectedDigitalExperience}
                                        src={currentExp.imageSrc}
                                        alt={`Preview ${currentExp.title}`}
                                        width={480}
                                        height={320}
                                        priority
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block"
                                        }}
                                    />
                                    {/* TOP-RIGHT SCANNER BADGE */}
                                    <div style={{
                                        position: "absolute",
                                        top: "14px",
                                        right: "14px",
                                        backgroundColor: "rgba(29,24,22,0.85)",
                                        backdropFilter: "blur(12px)",
                                        border: "1px solid rgba(205,171,143,0.3)",
                                        color: "#cdab8f",
                                        fontSize: "0.72rem",
                                        fontWeight: 700,
                                        padding: "4px 12px",
                                        borderRadius: "999px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase"
                                    }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                                            <line x1="12" y1="18" x2="12.01" y2="18"></line>
                                        </svg>
                                        <span>QR Scan Result Preview</span>
                                    </div>
                                </div>

                                <div style={{ padding: "18px 24px", color: "#faf7f2", backgroundColor: "#1d1816" }}>
                                    <p style={{ fontWeight: 600, fontSize: "0.95rem", margin: 0, color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cdab8f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                        </svg>
                                        <span>Tampilan Saat QR Discanned</span>
                                    </p>
                                    <p style={{ fontSize: "0.82rem", color: "rgba(250,247,242,0.65)", marginTop: "4px", lineHeight: 1.5, margin: "4px 0 0 0" }}>
                                        Saat QR pada kartu di-scan, halaman <strong>{currentExp.title}</strong> ini akan langsung terbuka di HP penerima.
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </section>

            {/* ── FREQUENTLY ASKED QUESTIONS (FAQ) SECTION ── */}
            <section style={{ padding: "90px 24px", maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                <SpringAnimatedSection>
                    <div style={{ textAlign: "center", marginBottom: "56px" }}>
                        <span style={{
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            letterSpacing: "0.22em",
                            textTransform: "uppercase",
                            color: "#a88365",
                            display: "inline-block",
                            padding: "6px 20px",
                            border: "1.2px solid rgba(205,171,143,0.2)",
                            borderRadius: 999,
                            background: "rgba(205,171,143,0.08)",
                            marginBottom: "16px"
                        }}>
                            Panduan & Jawaban
                        </span>
                        <h2 style={{
                            fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                            fontSize: "clamp(2rem, 4vw, 3.2rem)",
                            fontWeight: 400,
                            color: "#382a24",
                            lineHeight: 1.1
                        }}>
                            Pertanyaan Yang Sering <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Diajukan</span>
                        </h2>
                        <p style={{ color: "#6e5c53", maxWidth: "540px", margin: "12px auto 0", fontSize: "0.95rem", lineHeight: 1.6 }}>
                            Temukan jawaban lengkap mengenai pemesanan hampers fisik, kartu QR emas, hingga akses kado digital.
                        </p>
                    </div>
                </SpringAnimatedSection>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {[
                        {
                            q: "Berapa lama estimasi pengiriman gift box ke kota tujuan?",
                            a: "Gift box fisik dikirim khusus ke wilayah Jabodetabek (Jakarta, Bogor, Depok, Tangerang, Bekasi) dengan pengemasan aman berlapis bubble wrap tebal. Estimasi tiba 1-2 hari kerja atau tersedia opsi pengiriman ekspres."
                        },
                        {
                            q: "Bagaimana cara memasukkan ucapan & foto ke dalam kado digital?",
                            a: "Setelah pemesanan terkonfirmasi, kamu akan menerima link Studio Pembuat Kado. Di sana kamu dapat mengunggah foto kenangan, menuliskan pesan, dan memilih lagu favorit dengan sangat mudah."
                        },
                        {
                            q: "Apakah penerima harus meng-install aplikasi khusus untuk membuka QR Code?",
                            a: "Tidak perlu aplikasi apa pun. Penerima cukup mengarahkan kamera bawaan HP (iPhone / Android) ke Kartu Akses QR. Halaman kado digital sinematik akan langsung terbuka otomatis di browser HP."
                        },
                        {
                            q: "Bisakah gift box dikirimkan langsung ke alamat penerima (sebagai kejutan)?",
                            a: "Tentu saja! Saat pemesanan, kamu bisa langsung memasukkan nama & alamat penerima sebagai tujuan pengiriman. Kami akan mengemas paket dengan sangat rapi dan tanpa mencantumkan nota harga."
                        }
                    ].map((faq, i) => {
                        const isOpen = openFaqIndex === i;
                        return (
                            <SpringAnimatedSection key={i} delay={i * 70}>
                                <div
                                    style={{
                                        backgroundColor: isOpen ? "#ffffff" : "#fdfbf7",
                                        border: isOpen ? "1.5px solid rgba(205,171,143,0.5)" : "1px solid rgba(205,171,143,0.25)",
                                        borderRadius: "20px",
                                        overflow: "hidden",
                                        boxShadow: isOpen ? "0 12px 30px -10px rgba(56,42,36,0.08)" : "0 4px 15px -5px rgba(56,42,36,0.02)",
                                        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                                    }}
                                >
                                    <button
                                        onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                                        style={{
                                            width: "100%",
                                            padding: "22px 28px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: "16px",
                                            background: "none",
                                            border: "none",
                                            textAlign: "left",
                                            cursor: "pointer",
                                            color: "#382a24",
                                            outline: "none"
                                        }}
                                    >
                                        <span style={{
                                            fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                                            fontSize: "1.25rem",
                                            fontWeight: 600,
                                            lineHeight: 1.3,
                                            color: isOpen ? "#a67c52" : "#382a24"
                                        }}>
                                            {faq.q}
                                        </span>
                                        <div style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "50%",
                                            backgroundColor: isOpen ? "rgba(205,171,143,0.15)" : "rgba(205,171,143,0.08)",
                                            color: isOpen ? "#a67c52" : "#6e5c53",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                            transition: "all 0.3s ease"
                                        }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </button>
                                    {isOpen && (
                                        <div style={{
                                            padding: "0 28px 24px 28px",
                                            fontSize: "0.93rem",
                                            color: "#6e5c53",
                                            lineHeight: 1.7,
                                            borderTop: "1px solid rgba(205,171,143,0.12)",
                                            paddingTop: "16px"
                                        }}>
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            </SpringAnimatedSection>
                        );
                    })}
                </div>
            </section>

            {/* ── FOOTER CTA BANNER ── */}
            <section style={{
                backgroundColor: "#1d1816",
                color: "#faf7f2",
                padding: "90px 24px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden"
            }}>
                <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 2 }}>
                    <span style={{ color: "#cdab8f", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                        SPECIAL EDITION
                    </span>
                    <h2 style={{
                        fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                        fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)",
                        fontWeight: 400,
                        marginTop: "14px",
                        marginBottom: "16px",
                        color: "#ffffff"
                    }}>
                        Pesan <span style={{ fontStyle: "italic", color: "#cdab8f" }}>The Gift Box</span>
                    </h2>
                    <p style={{ fontSize: "1.05rem", color: "rgba(250,247,242,0.7)", lineHeight: 1.7, marginBottom: "20px" }}>
                        Dapatkan paket hampers fisik eksklusif lengkap dengan kado digital interaktif pilihanmu.
                    </p>

                    <div style={{
                        display: "inline-flex",
                        alignItems: "baseline",
                        gap: "10px",
                        marginBottom: "32px",
                        whiteSpace: "nowrap",
                    }}>
                        <span style={{ fontFamily: "var(--font-display, Cormorant Garamond, serif)", fontSize: "clamp(1.8rem, 3.5vw, 2.2rem)", fontWeight: 600, color: "#ffffff", whiteSpace: "nowrap" }}>
                            Mulai Rp 75.000
                        </span>
                        <span style={{ fontSize: "0.95rem", color: "rgba(250,247,242,0.45)", textDecoration: "line-through", whiteSpace: "nowrap" }}>
                            Rp 100.000
                        </span>
                    </div>
                    <br />

                    <Link
                        href={`/catalog/the-gift-box/checkout?boxType=${selectedBoxType}&digital=${selectedDigitalExperience}`}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "12px",
                            backgroundColor: "#cdab8f",
                            color: "#1d1816",
                            fontWeight: 700,
                            fontSize: "1.05rem",
                            padding: "18px 42px",
                            borderRadius: "14px",
                            textDecoration: "none",
                            boxShadow: "0 12px 35px rgba(205,171,143,0.3)",
                            transition: "all 0.3s ease"
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.backgroundColor = "#d8b99d";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.backgroundColor = "#cdab8f";
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        <span>Pesan Gift Box Sekarang</span>
                    </Link>
                </div>
            </section>

            {/* UNBOX CHECKOUT MODAL */}
            {showCheckoutModal && (
                <UnboxCheckoutModal
                    onClose={() => setShowCheckoutModal(false)}
                    initialDigitalProduct={selectedDigitalExperience}
                />
            )}

            {/* Floating WhatsApp with label (Bottom Right) */}
            <a href="https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20ingin%20bertanya%20tentang%20The%20Gift%20Box." target="_blank" rel="noopener noreferrer" aria-label="Hubungi via WhatsApp"
                style={{ position: "fixed", bottom: 28, right: 28, zIndex: 100, display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}
                onMouseEnter={e => { 
                    const btn = e.currentTarget.children[1] as HTMLElement;
                    if (btn) { btn.style.background = "#cdab8f"; btn.style.transform = "scale(1.05)"; }
                    const bubble = e.currentTarget.children[0] as HTMLElement;
                    if (bubble) { bubble.style.transform = "translateY(-2px)"; bubble.style.boxShadow = "0 12px 28px -4px rgba(29, 24, 22, 0.15)"; }
                }}
                onMouseLeave={e => { 
                    const btn = e.currentTarget.children[1] as HTMLElement;
                    if (btn) { btn.style.background = "#1d1816"; btn.style.transform = "scale(1)"; }
                    const bubble = e.currentTarget.children[0] as HTMLElement;
                    if (bubble) { bubble.style.transform = "translateY(0)"; bubble.style.boxShadow = "0 8px 24px -4px rgba(29, 24, 22, 0.12)"; }
                }}
            >
                {/* Text Bubble */}
                <div className="hidden md:flex items-center gap-[6px]" style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    padding: "10px 20px",
                    borderRadius: "999px",
                    boxShadow: "0 8px 24px -4px rgba(29, 24, 22, 0.12)",
                    border: "1px solid rgba(205, 171, 143, 0.2)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}>
                    <span style={{ fontSize: 12.5, fontWeight: 500, color: "#6e5c53", fontFamily: "var(--font-sans)", letterSpacing: "-0.01em" }}>
                        Butuh bantuan? <strong style={{ color: "#382a24", fontWeight: 700 }}>Chat Admin</strong>
                    </span>
                </div>

                {/* WA Icon */}
                <div
                    style={{ width: 48, height: 48, borderRadius: "50%", background: "#1d1816", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px -4px rgba(29,24,22,0.25)", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", flexShrink: 0 }}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#faf7f2">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.486 3.53 1.337 5.006L2.001 22l5.13-1.322A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.065-1.112l-.292-.174-3.046.784.813-2.934-.19-.302A7.965 7.965 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
                    </svg>
                </div>
            </a>

            {/* CSS KEYFRAME ANIMATIONS */}
            <style>{`
                @keyframes ribbon-beam-sweep {
                    0% { transform: translateX(-140%); }
                    30%, 100% { transform: translateX(240%); }
                }

                @keyframes shopee-icon-bounce {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    15% { transform: translateY(-3px) rotate(-6deg); }
                    30% { transform: translateY(0) rotate(4deg); }
                    45% { transform: translateY(-1px) rotate(0deg); }
                }

                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
