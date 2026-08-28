"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SlotPickerModal, { SlotPickerConfig } from "./SlotPickerModal";

interface LoopCard {
    badgeText?: string;
    badgeColor?: string;
    badgeVariant?: "solid" | "soft";
    slotBadgeText?: string;
    imageSrc: string;
    title: string;
    titleColor?: string;
    description: string;
    demoLink?: string;
    href: string;
    price?: string | React.ReactNode;
    onAddToCart?: () => void;
    isThreeSlotEligible?: boolean;
    onAddThreeSlotToCart?: () => void;
}

interface AutoScrollCarouselProps {
    cards: LoopCard[];
    speed?: number; // px per second, default 60
}

export default function AutoScrollCarousel({ cards, speed = 55 }: AutoScrollCarouselProps) {
    const singleSetWidth = cards.length * 380;
    const duration = singleSetWidth / speed;
    const [slotPickerConfig, setSlotPickerConfig] = useState<SlotPickerConfig | null>(null);
    const [navigatingKey, setNavigatingKey] = useState<string | null>(null);
    const [isInViewport, setIsInViewport] = useState(false);
    const [isPageVisible, setIsPageVisible] = useState(true);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsInViewport(entry.isIntersecting),
            { threshold: 0.05 }
        );
        const handleVisibilityChange = () => setIsPageVisible(!document.hidden);

        observer.observe(carousel);
        handleVisibilityChange();
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            observer.disconnect();
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    const handlePesanClick = (card: LoopCard) => {
        if (card.isThreeSlotEligible && card.onAddThreeSlotToCart && card.onAddToCart) {
            setSlotPickerConfig({
                productId: card.title,
                productTitle: card.title,
                themeColor: card.titleColor || "#a67c52",
                singlePriceText: "Rp 20.000",
                threeSlotPriceText: "Rp 25.000",
                onSelectSingle: card.onAddToCart,
                onSelectThreeSlot: card.onAddThreeSlotToCart,
            });
        } else {
            card.onAddToCart?.();
        }
    };

    // Render a single card
    const renderCard = (card: LoopCard, key: string) => (
        <article
            key={key}
            style={{
                width: 360,
                flexShrink: 0,
                borderRadius: "1.6rem",
                background: "#ffffff",
                padding: "12px",
                boxShadow: "0 4px 24px -4px rgba(0,0,0,0.07), 0 0 0 1px rgba(205,171,143,0.1)",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                userSelect: "none",
                display: "flex",
                flexDirection: "column",
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px -8px rgba(0,0,0,0.14), 0 0 0 1px rgba(205,171,143,0.18)";
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px -4px rgba(0,0,0,0.07), 0 0 0 1px rgba(205,171,143,0.1)";
            }}
        >
            {/* Image Container with rounded corners all around */}
            <div style={{ position: "relative", height: 260, overflow: "hidden", borderRadius: "1.2rem", backgroundColor: "#1d1816" }}>
                <Image
                    src={card.imageSrc}
                    alt={card.title}
                    fill
                    draggable={false}
                    loading="lazy"
                    sizes="(max-width: 768px) calc(100vw - 54px), 360px"
                    style={{
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                        pointerEvents: "none",
                        filter: card.badgeText === "UPCOMING" ? "blur(14px) contrast(1.05) brightness(0.9)" : "none",
                        transform: card.badgeText === "UPCOMING" ? "scale(1.06)" : "scale(1)"
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                />

                {/* Central Lock Badge for UPCOMING items */}
                {card.badgeText === "UPCOMING" && (
                    <div style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "rgba(29,24,22,0.88)",
                        border: "1px solid rgba(205,171,143,0.4)",
                        color: "#cdab8f",
                        padding: "6px 14px",
                        borderRadius: 999,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        zIndex: 5,
                        whiteSpace: "nowrap",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
                    }}>
                        <span style={{ fontSize: 11 }}>🔒</span>
                        <span>REVEALING SOON</span>
                    </div>
                )}
                {/* Badge */}
                {card.badgeText && (
                    <span style={{
                        position: "absolute",
                        top: 12,
                        left: card.badgeVariant === "soft" ? "auto" : 12,
                        right: card.badgeVariant === "soft" ? 12 : "auto",
                        borderRadius: 999,
                        background: card.badgeVariant === "soft"
                            ? `${card.badgeColor || "#a88365"}22`
                            : "rgba(255,255,255,0.88)",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                        color: card.badgeVariant === "soft"
                            ? (card.badgeColor || "#a88365")
                            : (card.badgeColor || "#382a24"),
                        fontSize: 9,
                        fontWeight: 800,
                        padding: "4px 12px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                    }}>
                        {card.badgeText}
                    </span>
                )}

                {/* Top Right Slot / Scarcity Badge */}
                {card.slotBadgeText && (
                    <span style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        borderRadius: 999,
                        background: "rgba(29, 24, 22, 0.82)",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                        border: "1px solid rgba(205, 171, 143, 0.35)",
                        color: "#ffffff",
                        fontSize: 9,
                        fontWeight: 700,
                        padding: "4px 10px",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        zIndex: 2,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                    }}>
                        <span style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            backgroundColor: "#2e7d32",
                            display: "inline-block"
                        }} />
                        <span>{card.slotBadgeText}</span>
                    </span>
                )}

                {/* Price overlay */}
                {card.price && (
                    <div
                        style={{
                            position: "absolute", bottom: 12, left: 12,
                            display: "flex", alignItems: "center", gap: 5,
                            background: "rgba(250,247,242,0.85)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                            border: "1px solid rgba(56,42,36,0.1)",
                            borderRadius: 999,
                            padding: "5px 12px",
                            fontSize: 10, fontWeight: 800,
                            color: "#382a24",
                            letterSpacing: "0.05em",
                        }}
                    >
                        {card.price}
                    </div>
                )}

            </div>

            {/* Content */}
            <div style={{ padding: "16px 8px 8px 8px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <h3 style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 24, fontWeight: 800,
                    color: card.titleColor || "#382a24",
                    margin: "0 0 8px 0",
                    letterSpacing: "-0.02em", lineHeight: 1.15,
                }}>
                    {card.title}
                </h3>
                <p style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 13, fontWeight: 400,
                    color: "#7a6a62", lineHeight: 1.6,
                    margin: "0 0 20px 0",
                }}>
                    {card.description}
                </p>

                {/* Buttons — stacked */}
                <button
                    onClick={() => handlePesanClick(card)}
                    style={{
                        display: "flex", justifyContent: "center", alignItems: "center", gap: 6,
                        width: "100%", padding: "12px 0", borderRadius: 12,
                        background: card.titleColor || "#382a24", color: "#faf7f2",
                        fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 800,
                        border: "none", cursor: "pointer",
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        marginBottom: 6,
                        transition: "all 0.2s ease",
                        boxShadow: `0 4px 14px ${card.titleColor || "#382a24"}33`,
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 20px ${card.titleColor || "#382a24"}44`;
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 14px ${card.titleColor || "#382a24"}33`;
                    }}
                >
                    {card.badgeText === "UPCOMING" ? (
                        <>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            KABARI SAYA SAAT RILIS
                        </>
                    ) : (
                        <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            Pesan
                        </>
                    )}
                </button>
                <Link 
                    href={card.href} 
                    prefetch={true} 
                    onClick={() => setNavigatingKey(key)}
                    style={{
                        display: "flex", justifyContent: "center", alignItems: "center", gap: 6,
                        width: "100%", padding: "12px 0", borderRadius: 12,
                        border: "1.5px solid rgba(205,171,143,0.3)",
                        background: "transparent", color: "#6e5c53",
                        fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
                        textDecoration: "none",
                        letterSpacing: "0.07em", textTransform: "uppercase",
                        transition: "all 0.2s ease",
                        boxSizing: "border-box",
                        opacity: navigatingKey === key ? 0.8 : 1
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#faf7f2"; e.currentTarget.style.borderColor = "rgba(205,171,143,0.5)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(205,171,143,0.3)"; }}
                >
                    {navigatingKey === key ? (
                        <>
                            <style>{`
                                @keyframes gold-spin {
                                    0% { transform: rotate(0deg); }
                                    100% { transform: rotate(360deg); }
                                }
                            `}</style>
                            <span style={{
                                display: "inline-block",
                                width: 11,
                                height: 11,
                                borderRadius: "50%",
                                border: "2px solid rgba(110,92,83,0.3)",
                                borderTopColor: "#6e5c53",
                                animation: "gold-spin 0.75s linear infinite"
                            }} />
                            Memuat...
                        </>
                    ) : (
                        <>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 5h5v5"/><path d="M10 14L19 5"/><path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4"/>
                            </svg>
                            Preview
                        </>
                    )}
                </Link>
            </div>
        </article>
    );

    return (
        <>
            <div ref={carouselRef} className="auto-scroll-carousel-shell" style={{ position: "relative", width: "100%", overflow: "hidden" }}>
                <style>{`
                    @keyframes slide-infinite-css {
                        from { transform: translateX(0); }
                        to { transform: translateX(-50%); }
                    }
                    @media (max-width: 1024px) {
                        .carousel-fade { display: none !important; }
                    }
                    @media (prefers-reduced-motion: reduce) {
                        .auto-scroll-carousel-shell {
                            overflow-x: auto !important;
                        }
                        .auto-scroll-carousel-track {
                            animation: none !important;
                            transform: none !important;
                        }
                    }
                `}</style>
                
                {/* The moving track — duplicated for seamless loop */}
                <div
                    className="auto-scroll-carousel-track"
                    style={{
                        display: "flex",
                        gap: 20,
                        width: "max-content",
                        animation: `slide-infinite-css ${duration}s linear infinite`,
                        animationPlayState: isInViewport && isPageVisible ? "running" : "paused",
                        paddingBottom: 16,
                        paddingTop: 8,
                    }}
                >
                    {/* Original set */}
                    {cards.map((c, i) => renderCard(c, `card-a-${i}`))}
                    {/* Duplicate set for seamless loop */}
                    {cards.map((c, i) => renderCard(c, `card-b-${i}`))}
                </div>

                {/* Fade edges */}
                <div className="carousel-fade" style={{
                    position: "absolute", left: 0, top: 0, bottom: 16,
                    width: 80, background: "linear-gradient(90deg, rgba(250,247,242,1) 0%, transparent 100%)",
                    pointerEvents: "none",
                }} />
                <div className="carousel-fade" style={{
                    position: "absolute", right: 0, top: 0, bottom: 16,
                    width: 80, background: "linear-gradient(270deg, rgba(250,247,242,1) 0%, transparent 100%)",
                    pointerEvents: "none",
                }} />

            </div>

            {/* Slot Picker Modal */}
            {slotPickerConfig && (
                <SlotPickerModal
                    config={slotPickerConfig}
                    onClose={() => setSlotPickerConfig(null)}
                />
            )}

        </>
    );
}
