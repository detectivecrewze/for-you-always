"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface WishInboxInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SlideItem {
    id: string;
    title: string;
    desc: React.ReactNode;
    src: string;
}

const FEATURE_SLIDES: SlideItem[] = [
    {
        id: "write",
        title: "Momen Tiup Lilin & Tulis Harapan",
        desc: "Penerima kado membuka scrapbook digital, meniup lilin kue ulang tahun interaktif, dan menuliskan pesan balasan serta harapan rahasianya langsung di dalam kado.",
        src: "/assets/snoopy-features/wishes-2.webp",
    },
    {
        id: "save",
        title: "Tersimpan Aman di Wish Inbox Privat",
        desc: "Setiap doa dan harapan yang dituliskan penerima langsung terkunci rapi ke dalam Wish Inbox privat, terlindungi tanpa bisa dilihat sembarang orang.",
        src: "/assets/snoopy-features/wish-card-update-snoopy.webp",
    },
    {
        id: "read",
        title: "Dibaca Kapan Saja oleh Pembuat Kado",
        desc: "Sebagai pembuat kado, kamu memegang akses privat khusus untuk membuka dan membaca seluruh pesan balasan serta isi hati manis si dia kapan saja.",
        src: "/assets/snoopy-features/letter-7.webp",
    },
];

export default function WishInboxInfoModal({ isOpen, onClose }: WishInboxInfoModalProps) {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const closingRef = useRef(false);
    const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setMounted(true);
        return () => {
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
            }
            document.body.style.overflow = "";
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            closingRef.current = false;
            setClosing(false);
            setActiveSlideIndex(0);
            const timer = setTimeout(() => setVisible(true), 15);
            document.body.style.overflow = "hidden";
            return () => clearTimeout(timer);
        } else {
            setVisible(false);
            document.body.style.overflow = "";
        }
    }, [isOpen]);

    const handleClose = () => {
        if (closingRef.current) return;
        closingRef.current = true;
        setClosing(true);
        setVisible(false);
        closeTimerRef.current = setTimeout(() => {
            setClosing(false);
            closingRef.current = false;
            onClose();
        }, 260);
    };

    const goToPrev = () => {
        setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : FEATURE_SLIDES.length - 1));
    };

    const goToNext = () => {
        setActiveSlideIndex((prev) => (prev < FEATURE_SLIDES.length - 1 ? prev + 1 : 0));
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches && e.touches.length > 0) {
            setTouchStartX(e.touches[0].clientX);
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        if (e.changedTouches && e.changedTouches.length > 0) {
            const touchEndX = e.changedTouches[0].clientX;
            const diffX = touchEndX - touchStartX;
            if (Math.abs(diffX) > 40) {
                if (diffX < 0) {
                    goToNext();
                } else {
                    goToPrev();
                }
            }
        }
        setTouchStartX(null);
    };

    const handleTouchCancel = () => {
        setTouchStartX(null);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "Escape") {
                handleClose();
            } else if (e.key === "ArrowLeft") {
                goToPrev();
            } else if (e.key === "ArrowRight") {
                goToNext();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    if (!mounted || (!isOpen && !closing)) return null;

    const currentSlide = FEATURE_SLIDES[activeSlideIndex];

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wish-inbox-modal-title"
            onClick={handleClose}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 99999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "clamp(10px, 3vw, 24px)",
                background: visible && !closing ? "rgba(10, 6, 4, 0.85)" : "rgba(10, 6, 4, 0)",
                backdropFilter: visible && !closing ? "blur(14px)" : "blur(0px)",
                WebkitBackdropFilter: visible && !closing ? "blur(14px)" : "blur(0px)",
                transition: "background 0.28s ease, backdrop-filter 0.28s ease",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "linear-gradient(165deg, #241813 0%, #150D0A 100%)",
                    width: "100%",
                    maxWidth: 580,
                    maxHeight: "92dvh",
                    borderRadius: "clamp(20px, 4.5vw, 28px)",
                    border: "1px solid rgba(212, 151, 59, 0.28)",
                    boxShadow: "0 32px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 151, 59, 0.12)",
                    overflowY: "auto",
                    WebkitOverflowScrolling: "touch",
                    transform: visible && !closing ? "translateY(0) scale(1)" : "translateY(20px) scale(0.96)",
                    transition: "transform 0.28s cubic-bezier(0.34, 1.4, 0.64, 1)",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    padding: "16px clamp(14px, 3.8vw, 22px) 20px",
                }}
            >
                {/* Header Row: Badge on Left, Close Button on Right */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 8,
                }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 12px",
                        borderRadius: 999,
                        background: "rgba(212, 151, 59, 0.15)",
                        border: "1px solid rgba(212, 151, 59, 0.35)",
                        color: "#F6C87C",
                        fontFamily: "var(--font-sans)",
                        fontSize: "clamp(9.5px, 2.3vw, 10.5px)",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                    }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#D4973B", flexShrink: 0 }} />
                        Birthday Scrapbook · Wish Inbox
                    </div>

                    <button
                        onClick={handleClose}
                        aria-label="Tutup dialog"
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            border: "1px solid rgba(255, 255, 255, 0.18)",
                            background: "rgba(60, 36, 25, 0.65)",
                            backdropFilter: "blur(8px)",
                            color: "#FAF7F2",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(212, 151, 59, 0.25)";
                            e.currentTarget.style.borderColor = "rgba(212, 151, 59, 0.6)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(60, 36, 25, 0.65)";
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
                        }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Single Compact Title */}
                <h3 id="wish-inbox-modal-title" style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(20px, 4.8vw, 26px)",
                    fontWeight: 600,
                    color: "#FAF7F2",
                    lineHeight: 1.25,
                    margin: "0 0 12px",
                    textAlign: "center",
                    letterSpacing: "-0.01em",
                }}>
                    Cara Kerja Fitur Eksklusif Wish Inbox
                </h3>

                {/* Hero Screenshot (Swipeable & Prominent) */}
                <div
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchCancel}
                    style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "1.29 / 1",
                        minHeight: "clamp(240px, 54vw, 420px)",
                        flexShrink: 0,
                        borderRadius: "clamp(14px, 3.2vw, 18px)",
                        overflow: "hidden",
                        border: "1px solid rgba(212, 151, 59, 0.28)",
                        boxShadow: "0 20px 48px rgba(0, 0, 0, 0.6)",
                        marginBottom: 12,
                        background: "#150D0A",
                        touchAction: "pan-y",
                    }}
                >
                    <Image
                        key={currentSlide.src}
                        src={currentSlide.src}
                        alt={currentSlide.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 580px"
                        style={{
                            objectFit: "contain",
                            transition: "opacity 0.25s ease",
                        }}
                        priority
                    />

                    {/* Prev Navigation Arrow */}
                    <button
                        type="button"
                        onClick={goToPrev}
                        aria-label="Foto sebelumnya"
                        style={{
                            position: "absolute",
                            left: 8,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "rgba(24, 15, 10, 0.85)",
                            backdropFilter: "blur(6px)",
                            border: "1px solid rgba(212, 151, 59, 0.35)",
                            color: "#FAF7F2",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(212, 151, 59, 0.35)";
                            e.currentTarget.style.borderColor = "rgba(212, 151, 59, 0.7)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(24, 15, 10, 0.85)";
                            e.currentTarget.style.borderColor = "rgba(212, 151, 59, 0.35)";
                        }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>

                    {/* Next Navigation Arrow */}
                    <button
                        type="button"
                        onClick={goToNext}
                        aria-label="Foto berikutnya"
                        style={{
                            position: "absolute",
                            right: 8,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "rgba(24, 15, 10, 0.85)",
                            backdropFilter: "blur(6px)",
                            border: "1px solid rgba(212, 151, 59, 0.35)",
                            color: "#FAF7F2",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(212, 151, 59, 0.35)";
                            e.currentTarget.style.borderColor = "rgba(212, 151, 59, 0.7)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(24, 15, 10, 0.85)";
                            e.currentTarget.style.borderColor = "rgba(212, 151, 59, 0.35)";
                        }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>

                {/* Integrated Feature Caption & Story Flow Box */}
                <div style={{
                    background: "rgba(55, 34, 23, 0.45)",
                    border: "1px solid rgba(212, 151, 59, 0.2)",
                    borderRadius: 14,
                    padding: "11px 14px",
                    marginBottom: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                    flexShrink: 0,
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                        <div style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "clamp(12.5px, 3.2vw, 13.5px)",
                            fontWeight: 700,
                            color: "#FAF7F2",
                        }}>
                            {currentSlide.title}
                        </div>

                        {/* Navigation Dots & Slide Counter */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                            <span style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: 10.5,
                                color: "#CBB09C",
                                letterSpacing: "0.04em",
                                marginRight: 2,
                            }}>
                                {activeSlideIndex + 1}/{FEATURE_SLIDES.length}
                            </span>
                            {FEATURE_SLIDES.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setActiveSlideIndex(idx)}
                                    aria-label={`Lihat foto ${idx + 1}`}
                                    style={{
                                        width: idx === activeSlideIndex ? 16 : 5,
                                        height: 5,
                                        borderRadius: 999,
                                        background: idx === activeSlideIndex ? "#D4973B" : "rgba(212, 151, 59, 0.25)",
                                        border: "none",
                                        padding: 0,
                                        cursor: "pointer",
                                        transition: "all 0.25s ease",
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "clamp(11.5px, 2.8vw, 12.5px)",
                        color: "#E6D0BE",
                        lineHeight: 1.5,
                    }}>
                        {currentSlide.desc}
                    </div>
                </div>

                {/* 3-Step Process Flow Cards (Clickable Steps) */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "clamp(6px, 1.8vw, 10px)",
                    marginBottom: 20,
                    flexShrink: 0,
                }}>
                    {[
                        { num: "01", title: "Tiup Lilin", sub: "Penerima tulis wish", slideIdx: 0 },
                        { num: "02", title: "Wish Inbox", sub: "Tersimpan aman", slideIdx: 1 },
                        { num: "03", title: "Balasan Si Dia", sub: "Dibaca pembuat kado", slideIdx: 2 },
                    ].map((step, sIdx) => {
                        const isCurrentActive = activeSlideIndex === step.slideIdx;
                        return (
                            <button
                                key={sIdx}
                                type="button"
                                onClick={() => setActiveSlideIndex(step.slideIdx)}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    textAlign: "center",
                                    padding: "9px 6px",
                                    borderRadius: 10,
                                    background: isCurrentActive ? "rgba(212, 151, 59, 0.18)" : "rgba(255, 255, 255, 0.03)",
                                    border: isCurrentActive ? "1px solid rgba(212, 151, 59, 0.55)" : "1px solid rgba(255, 255, 255, 0.08)",
                                    boxShadow: isCurrentActive ? "0 4px 14px rgba(212, 151, 59, 0.15)" : "none",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                <span style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: 9.5,
                                    fontWeight: 700,
                                    color: isCurrentActive ? "#F6C87C" : "#9E8170",
                                    letterSpacing: "0.08em",
                                    marginBottom: 2,
                                }}>
                                    LANGKAH {step.num}
                                </span>
                                <span style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "clamp(10.5px, 2.5vw, 11.5px)",
                                    fontWeight: 600,
                                    color: isCurrentActive ? "#FAF7F2" : "#D2BCAC",
                                    lineHeight: 1.25,
                                    marginBottom: 2,
                                }}>
                                    {step.title}
                                </span>
                                <span style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "clamp(9px, 2.2vw, 10px)",
                                    color: isCurrentActive ? "#E6D0BE" : "#8A6E5F",
                                    lineHeight: 1.2,
                                }}>
                                    {step.sub}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Footer: Centered Single Button "Mengerti & Tutup" */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: 4,
                }}>
                    <button
                        type="button"
                        onClick={handleClose}
                        style={{
                            background: "linear-gradient(135deg, #D4973B 0%, #BF7B19 100%)",
                            color: "#1C120D",
                            fontFamily: "var(--font-sans)",
                            fontSize: "clamp(12.5px, 2.8vw, 13.5px)",
                            fontWeight: 700,
                            padding: "10px clamp(24px, 5vw, 36px)",
                            borderRadius: 999,
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 6px 20px rgba(212, 151, 59, 0.3)",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 8px 24px rgba(212, 151, 59, 0.45)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 6px 20px rgba(212, 151, 59, 0.3)";
                        }}
                    >
                        Mengerti & Tutup
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
