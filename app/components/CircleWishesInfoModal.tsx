"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface CircleWishesInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDemoOpen?: (url: string, label: string) => void;
}

const CIRCLE_DEMO_URL = "https://anniv.for-you-always.my.id/auto-circle?preview=circle#circle-wishes-section";
const CIRCLE_DEMO_LABEL = "Demo Memoria Circle Edition";

interface SlideItem {
    id: string;
    title: string;
    desc: React.ReactNode;
    src: string;
}

const FEATURE_SLIDES: SlideItem[] = [
    {
        id: "bento",
        title: "Bento Grid Ucapan Sahabat",
        desc: "Seluruh doa, pesan, foto, video, dan rekaman suara para sahabat tersusun rapi dalam bento grid kado Memoria yang interaktif dan mewah.",
        src: "/assets/auto-circle/auto-circle1.webp",
    },
    {
        id: "video",
        title: "Video Kenangan & Live-Photo",
        desc: "Video singkat (1–15 detik) berputar halus tanpa suara di grid menyerupai live-photo, dan dapat diputar bersuara jernih saat kartu ucapan dibuka.",
        src: "/assets/auto-circle/auto-circle2.webp",
    },
    {
        id: "voice",
        title: "Voice Note dengan Player Interaktif",
        desc: "Dukungan rekaman suara personal dari sahabat dengan waveform visualizer modern, progress bar, dan sinkronisasi audio otomatis tanpa bentrok musik latar.",
        src: "/assets/auto-circle/auto-circle3.webp",
    },
    {
        id: "link",
        title: "Link Pengumpulan Tanpa Aplikasi",
        desc: (
            <span>
                Cukup bagikan link khusus (contoh: <code style={{ color: "#E2859B", background: "rgba(226, 133, 155, 0.15)", padding: "1px 6px", borderRadius: 4, whiteSpace: "nowrap" }}>for-you-always.my.id/c/nama</code>) secara perorangan atau ke grup WhatsApp tanpa perlu login atau instal aplikasi.
            </span>
        ),
        src: "/assets/auto-circle/auto-circle5.webp",
    },
];

export default function CircleWishesInfoModal({ isOpen, onClose, onDemoOpen }: CircleWishesInfoModalProps) {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [lightboxTouchStartX, setLightboxTouchStartX] = useState<number | null>(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomScale, setZoomScale] = useState(1);
    const [isStepsOpen, setIsStepsOpen] = useState(false);
    const closingRef = useRef(false);
    const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
    const originalOverflowRef = useRef<string>("");
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        setMounted(true);
        return () => {
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
            }
            document.body.style.overflow = originalOverflowRef.current;
        };
    }, []);

    const handleClose = useCallback(() => {
        if (closingRef.current) return;
        closingRef.current = true;
        setClosing(true);
        setVisible(false);
        setIsZoomed(false);
        setZoomScale(1);
        setIsStepsOpen(false);
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
        }
        closeTimerRef.current = setTimeout(() => {
            closingRef.current = false;
            setClosing(false);
            document.body.style.overflow = originalOverflowRef.current;
            onCloseRef.current();
        }, 220);
    }, []);

    const handleDemoOpen = useCallback(() => {
        if (onDemoOpen) {
            onDemoOpen(CIRCLE_DEMO_URL, CIRCLE_DEMO_LABEL);
            return;
        }
        window.open(CIRCLE_DEMO_URL, "_blank", "noopener,noreferrer");
    }, [onDemoOpen]);

    const goToPrev = useCallback(() => {
        setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : FEATURE_SLIDES.length - 1));
    }, []);

    const goToNext = useCallback(() => {
        setActiveSlideIndex((prev) => (prev < FEATURE_SLIDES.length - 1 ? prev + 1 : 0));
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
            }
            originalOverflowRef.current = document.body.style.overflow || "";
            closingRef.current = false;
            setClosing(false);
            setActiveSlideIndex(0);
            setIsZoomed(false);
            setZoomScale(1);
            setIsStepsOpen(false);
            const timer = setTimeout(() => setVisible(true), 15);
            document.body.style.overflow = "hidden";
            return () => {
                clearTimeout(timer);
                document.body.style.overflow = originalOverflowRef.current;
            };
        } else {
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
            }
            setVisible(false);
            setIsZoomed(false);
            setZoomScale(1);
            setIsStepsOpen(false);
            document.body.style.overflow = originalOverflowRef.current;
        }
    }, [isOpen]);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches && e.touches.length > 0) {
            setTouchStartX(e.touches[0].clientX);
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        if (e.changedTouches && e.changedTouches.length > 0) {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (diff > 45) {
                goToNext();
            } else if (diff < -45) {
                goToPrev();
            }
        }
        setTouchStartX(null);
    };

    const handleTouchCancel = () => {
        setTouchStartX(null);
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (isZoomed) {
                    setIsZoomed(false);
                    setZoomScale(1);
                } else {
                    handleClose();
                }
            } else if (e.key === "ArrowLeft") {
                goToPrev();
                setZoomScale(1);
            } else if (e.key === "ArrowRight") {
                goToNext();
                setZoomScale(1);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, isZoomed, handleClose, goToPrev, goToNext]);

    if (!mounted || (!isOpen && !closing)) return null;

    const currentSlide = FEATURE_SLIDES[activeSlideIndex];

    return createPortal(
        <div
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="circle-modal-title"
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(16, 7, 12, 0.86)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                zIndex: 999999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 12px",
                opacity: visible && !closing ? 1 : 0,
                transition: "opacity 0.24s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "linear-gradient(165deg, #2D141E 0%, #160910 100%)",
                    width: "100%",
                    maxWidth: 580,
                    maxHeight: "92dvh",
                    borderRadius: "clamp(20px, 4.5vw, 28px)",
                    border: "1px solid rgba(226, 133, 155, 0.28)",
                    boxShadow: "0 32px 80px rgba(0, 0, 0, 0.75), 0 0 40px rgba(226, 133, 155, 0.1)",
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
                {/* Header Row: Badge on Left, Close Button on Right (No overlapping) */}
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
                        background: "rgba(226, 133, 155, 0.15)",
                        border: "1px solid rgba(226, 133, 155, 0.35)",
                        color: "#E2859B",
                        fontFamily: "var(--font-sans)",
                        fontSize: "clamp(9.5px, 2.3vw, 10.5px)",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                    }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#E2859B", flexShrink: 0 }} />
                        Memoria · Circle Wishes
                    </div>

                    <button
                        onClick={handleClose}
                        aria-label="Tutup dialog"
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            border: "1px solid rgba(255, 255, 255, 0.18)",
                            background: "rgba(64, 28, 43, 0.65)",
                            backdropFilter: "blur(8px)",
                            color: "#FDE8E9",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(226, 133, 155, 0.25)";
                            e.currentTarget.style.borderColor = "rgba(226, 133, 155, 0.6)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(64, 28, 43, 0.65)";
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
                <h3 id="circle-modal-title" style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(20px, 4.8vw, 26px)",
                    fontWeight: 600,
                    color: "#FDE8E9",
                    lineHeight: 1.25,
                    margin: "0 0 8px",
                    textAlign: "center",
                    letterSpacing: "-0.01em",
                }}>
                    Cara Kerja Circle Wishes: Memoria Edition
                </h3>

                {/* Sleek Minimalist Subtitle Capsule */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    marginBottom: 14,
                }}>
                    <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        padding: "4px 12px",
                        borderRadius: 999,
                        background: "rgba(226, 133, 155, 0.1)",
                        border: "1px solid rgba(226, 133, 155, 0.22)",
                        color: "#D1A7B1",
                        fontFamily: "var(--font-sans)",
                        fontSize: "clamp(10.5px, 2.5vw, 11.5px)",
                        lineHeight: 1.4,
                        maxWidth: "100%",
                    }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#E2859B", flexShrink: 0 }} />
                        <span>
                            Fitur baru opsional — format kado <strong style={{ color: "#FDE8E9" }}>Personal Edition</strong> tetap tersedia.
                        </span>
                    </span>
                </div>

                {/* Large Hero Screenshot (Swipeable & Click to Zoom) */}
                <div
                    onClick={() => {
                        setIsZoomed(true);
                        setZoomScale(1);
                    }}
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
                        border: "1px solid rgba(226, 133, 155, 0.28)",
                        boxShadow: "0 20px 48px rgba(0, 0, 0, 0.55)",
                        marginBottom: 12,
                        background: "#180911",
                        touchAction: "pan-y",
                        cursor: "zoom-in",
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

                    {/* Tap to Zoom Badge Hint */}
                    <div style={{
                        position: "absolute",
                        bottom: 10,
                        right: 10,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "5px 11px",
                        borderRadius: 999,
                        background: "rgba(22, 9, 16, 0.85)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(226, 133, 155, 0.45)",
                        color: "#FDE8E9",
                        fontFamily: "var(--font-sans)",
                        fontSize: "clamp(10px, 2.4vw, 11px)",
                        fontWeight: 600,
                        pointerEvents: "none",
                        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.5)",
                    }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            <line x1="11" y1="8" x2="11" y2="14" />
                            <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                        <span>Ketuk untuk memperbesar</span>
                    </div>

                    {/* Prev Navigation Arrow */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            goToPrev();
                        }}
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => e.stopPropagation()}
                        aria-label="Foto sebelumnya"
                        style={{
                            position: "absolute",
                            left: 8,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "rgba(22, 9, 16, 0.8)",
                            backdropFilter: "blur(6px)",
                            border: "1px solid rgba(226, 133, 155, 0.35)",
                            color: "#FDE8E9",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                            zIndex: 2,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(226, 133, 155, 0.35)";
                            e.currentTarget.style.borderColor = "rgba(226, 133, 155, 0.7)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(22, 9, 16, 0.8)";
                            e.currentTarget.style.borderColor = "rgba(226, 133, 155, 0.35)";
                        }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>

                    {/* Next Navigation Arrow */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            goToNext();
                        }}
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => e.stopPropagation()}
                        aria-label="Foto berikutnya"
                        style={{
                            position: "absolute",
                            right: 8,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "rgba(22, 9, 16, 0.8)",
                            backdropFilter: "blur(6px)",
                            border: "1px solid rgba(226, 133, 155, 0.35)",
                            color: "#FDE8E9",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                            zIndex: 2,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(226, 133, 155, 0.35)";
                            e.currentTarget.style.borderColor = "rgba(226, 133, 155, 0.7)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(22, 9, 16, 0.8)";
                            e.currentTarget.style.borderColor = "rgba(226, 133, 155, 0.35)";
                        }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>

                {/* Integrated Feature Caption & Story Flow Box */}
                <div style={{
                    background: "rgba(64, 28, 43, 0.35)",
                    border: "1px solid rgba(226, 133, 155, 0.18)",
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
                            color: "#FDE8E9",
                        }}>
                            {currentSlide.title}
                        </div>

                        {/* Navigation Dots & Slide Counter */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                            <span style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: 10.5,
                                color: "#D1A7B1",
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
                                        background: idx === activeSlideIndex ? "#E2859B" : "rgba(226, 133, 155, 0.25)",
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
                        color: "#D1A7B1",
                        lineHeight: 1.5,
                    }}>
                        {currentSlide.desc}
                    </div>
                </div>

                {/* 3 Steps Flow Accordion (Collapsible Alur Kerja) */}
                <div style={{
                    marginBottom: 16,
                    flexShrink: 0,
                }}>
                    {/* Banner Kapsul Header Toggle */}
                    <button
                        type="button"
                        onClick={() => setIsStepsOpen((prev) => !prev)}
                        aria-expanded={isStepsOpen}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 10,
                            padding: "10px 14px",
                            borderRadius: 13,
                            background: isStepsOpen ? "rgba(64, 28, 43, 0.55)" : "rgba(64, 28, 43, 0.38)",
                            border: "1px solid " + (isStepsOpen ? "rgba(226, 133, 155, 0.38)" : "rgba(226, 133, 155, 0.18)"),
                            cursor: "pointer",
                            transition: "all 0.25s ease",
                            textAlign: "left",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(64, 28, 43, 0.6)";
                            e.currentTarget.style.borderColor = "rgba(226, 133, 155, 0.45)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = isStepsOpen ? "rgba(64, 28, 43, 0.55)" : "rgba(64, 28, 43, 0.38)";
                            e.currentTarget.style.borderColor = isStepsOpen ? "rgba(226, 133, 155, 0.38)" : "rgba(226, 133, 155, 0.18)";
                        }}
                    >
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            minWidth: 0,
                        }}>
                            <span style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "#E2859B",
                                boxShadow: "0 0 8px rgba(226, 133, 155, 0.6)",
                                flexShrink: 0,
                            }} />
                            <span style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: "clamp(11px, 2.7vw, 12px)",
                                fontWeight: 700,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                color: "#FDE8E9",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}>
                                3 Langkah Mudah Circle Wishes
                            </span>
                        </div>

                        {/* Dynamic Label & Rotating Chevron */}
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: isStepsOpen ? "rgba(226, 133, 155, 0.22)" : "rgba(226, 133, 155, 0.12)",
                            border: "1px solid " + (isStepsOpen ? "rgba(226, 133, 155, 0.4)" : "rgba(226, 133, 155, 0.22)"),
                            color: "#FDE8E9",
                            fontFamily: "var(--font-sans)",
                            fontSize: "clamp(10px, 2.4vw, 11px)",
                            fontWeight: 600,
                            flexShrink: 0,
                            transition: "all 0.25s ease",
                        }}>
                            <span>{isStepsOpen ? "Sembunyikan" : "Lihat Langkah"}</span>
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.6}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{
                                    transform: isStepsOpen ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
                                }}
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </div>
                    </button>

                    {/* Collapsible Content */}
                    <div style={{
                        maxHeight: isStepsOpen ? 900 : 0,
                        opacity: isStepsOpen ? 1 : 0,
                        overflow: "hidden",
                        transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.28s ease, margin 0.25s ease",
                        pointerEvents: isStepsOpen ? "auto" : "none",
                        marginTop: isStepsOpen ? 8 : 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                    }}>
                        {/* Step 1 */}
                        <div style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            padding: "10px 12px",
                            borderRadius: 12,
                            background: "rgba(64, 28, 43, 0.35)",
                            border: "1px solid rgba(226, 133, 155, 0.15)",
                        }}>
                            <div style={{
                                width: 22,
                                height: 22,
                                borderRadius: 6,
                                background: "rgba(226, 133, 155, 0.18)",
                                border: "1px solid rgba(226, 133, 155, 0.35)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                color: "#E2859B",
                                fontFamily: "var(--font-cormorant)",
                                fontSize: 13,
                                fontWeight: 700,
                                marginTop: 1,
                            }}>
                                1
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "clamp(12px, 3vw, 13px)",
                                    fontWeight: 700,
                                    color: "#FDE8E9",
                                    marginBottom: 2,
                                }}>
                                    Bagikan Link Khusus
                                </div>
                                <div style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "clamp(11px, 2.7vw, 11.5px)",
                                    color: "#D1A7B1",
                                    lineHeight: 1.45,
                                }}>
                                    Dapatkan link pengumpulan (contoh: <code style={{ color: "#E2859B", background: "rgba(226, 133, 155, 0.15)", padding: "1px 5px", borderRadius: 4 }}>for-you-always.my.id/c/nama</code>) untuk dibagikan secara perorangan atau ke grup WhatsApp. Teman tidak perlu login atau instal aplikasi.
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            padding: "10px 12px",
                            borderRadius: 12,
                            background: "rgba(64, 28, 43, 0.35)",
                            border: "1px solid rgba(226, 133, 155, 0.15)",
                        }}>
                            <div style={{
                                width: 22,
                                height: 22,
                                borderRadius: 6,
                                background: "rgba(226, 133, 155, 0.18)",
                                border: "1px solid rgba(226, 133, 155, 0.35)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                color: "#E2859B",
                                fontFamily: "var(--font-cormorant)",
                                fontSize: 13,
                                fontWeight: 700,
                                marginTop: 1,
                            }}>
                                2
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "clamp(12px, 3vw, 13px)",
                                    fontWeight: 700,
                                    color: "#FDE8E9",
                                    marginBottom: 2,
                                }}>
                                    Teman Mengisi Pesan & Media
                                </div>
                                <div style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "clamp(11px, 2.7vw, 11.5px)",
                                    color: "#D1A7B1",
                                    lineHeight: 1.45,
                                    marginBottom: 4,
                                }}>
                                    Setiap orang bebas memilih format yang paling berkesan:
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                    {[
                                        "Pesan Teks",
                                        "Foto Kenangan",
                                        "Video Singkat (1–15s)",
                                        "Voice Note Suara",
                                    ].map((format) => (
                                        <span key={format} style={{
                                            fontFamily: "var(--font-sans)",
                                            fontSize: 9.5,
                                            fontWeight: 600,
                                            padding: "1px 7px",
                                            borderRadius: 999,
                                            background: "rgba(226, 133, 155, 0.15)",
                                            border: "1px solid rgba(226, 133, 155, 0.25)",
                                            color: "#E2859B",
                                            whiteSpace: "nowrap",
                                        }}>
                                            {format}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            padding: "10px 12px",
                            borderRadius: 12,
                            background: "rgba(64, 28, 43, 0.35)",
                            border: "1px solid rgba(226, 133, 155, 0.15)",
                        }}>
                            <div style={{
                                width: 22,
                                height: 22,
                                borderRadius: 6,
                                background: "rgba(226, 133, 155, 0.18)",
                                border: "1px solid rgba(226, 133, 155, 0.35)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                color: "#E2859B",
                                fontFamily: "var(--font-cormorant)",
                                fontSize: 13,
                                fontWeight: 700,
                                marginTop: 1,
                            }}>
                                3
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "clamp(12px, 3vw, 13px)",
                                    fontWeight: 700,
                                    color: "#FDE8E9",
                                    marginBottom: 2,
                                }}>
                                    Tersaji Otomatis dalam 1 Kado Memoria
                                </div>
                                <div style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "clamp(11px, 2.7vw, 11.5px)",
                                    color: "#D1A7B1",
                                    lineHeight: 1.45,
                                }}>
                                    Seluruh ucapan tersusun rapi di Bento Grid kado Memoria dengan kontrol audio/video cerdas tanpa mengganggu musik latar kado.
                                </div>
                            </div>
                        </div>

                        {/* Personal Edition Reassurance Note */}
                        <div style={{
                            padding: "9px 12px",
                            borderRadius: 11,
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(226, 133, 155, 0.15)",
                            fontFamily: "var(--font-sans)",
                            fontSize: "clamp(10.5px, 2.5vw, 11px)",
                            color: "#D1A7B1",
                            lineHeight: 1.45,
                        }}>
                            <strong style={{ color: "#FDE8E9" }}>Ingin kado berdua saja?</strong> Pilih opsi <strong>Personal Edition</strong> di formulir pesanan. Langkah pengumpulan ini otomatis dilewati dan kado sepenuhnya berfokus pada ungkapan perasaan pribadimu.
                        </div>
                    </div>
                </div>

                {/* Footer Action Buttons */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    paddingTop: 12,
                    borderTop: "1px solid rgba(226, 133, 155, 0.18)",
                    flexWrap: "wrap",
                    flexShrink: 0,
                }}>
                    <button
                        type="button"
                        onClick={handleClose}
                        style={{
                            padding: "9px 18px",
                            borderRadius: 999,
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            background: "transparent",
                            color: "#D1A7B1",
                            fontFamily: "var(--font-sans)",
                            fontSize: "clamp(12px, 2.8vw, 13px)",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#FDE8E9";
                            e.currentTarget.style.borderColor = "rgba(226, 133, 155, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = "#D1A7B1";
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                        }}
                    >
                        Tutup
                    </button>

                    <button
                        type="button"
                        onClick={handleDemoOpen}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 7,
                            background: "linear-gradient(135deg, #E2859B 0%, #C96880 100%)",
                            color: "#2D141E",
                            fontFamily: "var(--font-sans)",
                            fontSize: "clamp(12px, 2.8vw, 13px)",
                            fontWeight: 700,
                            padding: "9px clamp(14px, 3.5vw, 20px)",
                            borderRadius: 999,
                            border: "none",
                            whiteSpace: "nowrap",
                            cursor: "pointer",
                            boxShadow: "0 6px 20px rgba(226, 133, 155, 0.3)",
                            transition: "all 0.2s ease",
                            flex: "1 1 auto",
                            textAlign: "center",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 8px 24px rgba(226, 133, 155, 0.45)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 6px 20px rgba(226, 133, 155, 0.3)";
                        }}
                    >
                        <span>Coba Demo Memoria Circle Edition</span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2D141E" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M7 17L17 7" />
                            <path d="M7 7h10v10" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Fullscreen Interactive Lightbox Modal */}
            {isZoomed && (
                <div
                    role="dialog"
                    aria-label="Tinjauan Foto Perbesar"
                    onClick={() => {
                        setIsZoomed(false);
                        setZoomScale(1);
                    }}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 100005,
                        background: "rgba(18, 7, 13, 0.96)",
                        backdropFilter: "blur(14px)",
                        WebkitBackdropFilter: "blur(14px)",
                        display: "flex",
                        flexDirection: "column",
                        padding: "16px clamp(12px, 3vw, 24px)",
                        boxSizing: "border-box",
                    }}
                >
                    {/* Top Control Bar */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "clamp(8px, 2vw, 12px)",
                            marginBottom: 10,
                            flexShrink: 0,
                            width: "100%",
                            minWidth: 0,
                        }}
                    >
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            minWidth: 0,
                            flex: "1 1 auto",
                            overflow: "hidden",
                            fontFamily: "var(--font-sans)",
                            fontSize: "clamp(11px, 2.7vw, 13px)",
                            color: "#FDE8E9",
                            fontWeight: 600,
                        }}>
                            <span style={{
                                padding: "3px 9px",
                                borderRadius: 999,
                                background: "rgba(226, 133, 155, 0.2)",
                                border: "1px solid rgba(226, 133, 155, 0.45)",
                                color: "#FDE8E9",
                                fontSize: "clamp(10px, 2.5vw, 11px)",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                            }}>
                                Langkah {activeSlideIndex + 1}/{FEATURE_SLIDES.length}
                            </span>
                            <span style={{
                                opacity: 0.9,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                minWidth: 0,
                            }}>
                                {currentSlide.title}
                            </span>
                        </div>

                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "clamp(6px, 1.8vw, 8px)",
                            flexShrink: 0,
                        }}>
                            {/* Toggle Zoom Scale Button */}
                            <button
                                type="button"
                                onClick={() => setZoomScale((prev) => (prev > 1 ? 1 : 2))}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 5,
                                    padding: "6px clamp(8px, 2vw, 12px)",
                                    borderRadius: 999,
                                    background: zoomScale > 1 ? "rgba(226, 133, 155, 0.25)" : "rgba(255, 255, 255, 0.1)",
                                    border: "1px solid " + (zoomScale > 1 ? "rgba(226, 133, 155, 0.6)" : "rgba(255, 255, 255, 0.2)"),
                                    color: "#FDE8E9",
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "clamp(10.5px, 2.6vw, 11.5px)",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
                                }}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    {zoomScale > 1 ? (
                                        <line x1="8" y1="11" x2="14" y2="11" />
                                    ) : (
                                        <>
                                            <line x1="11" y1="8" x2="11" y2="14" />
                                            <line x1="8" y1="11" x2="14" y2="11" />
                                        </>
                                    )}
                                </svg>
                                <span style={{ whiteSpace: "nowrap" }}>{zoomScale > 1 ? "Perkecil (1x)" : "Perbesar (2x)"}</span>
                            </button>

                            {/* Close Button */}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsZoomed(false);
                                    setZoomScale(1);
                                }}
                                aria-label="Tutup zoom"
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    background: "rgba(255, 255, 255, 0.12)",
                                    border: "1px solid rgba(255, 255, 255, 0.25)",
                                    color: "#FDE8E9",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 0.2s ease",
                                    flexShrink: 0,
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Floating Prev Button */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            goToPrev();
                            setZoomScale(1);
                        }}
                        aria-label="Foto sebelumnya"
                        style={{
                            position: "fixed",
                            left: "clamp(10px, 2.5vw, 24px)",
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: "clamp(40px, 5.2vw, 48px)",
                            height: "clamp(40px, 5.2vw, 48px)",
                            borderRadius: "50%",
                            background: "rgba(22, 9, 16, 0.82)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            border: "1px solid rgba(226, 133, 155, 0.45)",
                            color: "#FDE8E9",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            zIndex: 100010,
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.65)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(226, 133, 155, 0.35)";
                            e.currentTarget.style.borderColor = "rgba(226, 133, 155, 0.8)";
                            e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(22, 9, 16, 0.82)";
                            e.currentTarget.style.borderColor = "rgba(226, 133, 155, 0.45)";
                            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                        }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>

                    {/* Floating Next Button */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            goToNext();
                            setZoomScale(1);
                        }}
                        aria-label="Foto berikutnya"
                        style={{
                            position: "fixed",
                            right: "clamp(10px, 2.5vw, 24px)",
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: "clamp(40px, 5.2vw, 48px)",
                            height: "clamp(40px, 5.2vw, 48px)",
                            borderRadius: "50%",
                            background: "rgba(22, 9, 16, 0.82)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            border: "1px solid rgba(226, 133, 155, 0.45)",
                            color: "#FDE8E9",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            zIndex: 100010,
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.65)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(226, 133, 155, 0.35)";
                            e.currentTarget.style.borderColor = "rgba(226, 133, 155, 0.8)";
                            e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(22, 9, 16, 0.82)";
                            e.currentTarget.style.borderColor = "rgba(226, 133, 155, 0.45)";
                            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                        }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>

                    {/* Scrollable & Pinch/Pan Friendly Viewport */}
                    <div
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setIsZoomed(false);
                                setZoomScale(1);
                            }
                        }}
                        onTouchStart={(e) => {
                            if (zoomScale === 1 && e.touches && e.touches.length > 0) {
                                setLightboxTouchStartX(e.touches[0].clientX);
                            }
                        }}
                        onTouchEnd={(e) => {
                            if (zoomScale === 1 && lightboxTouchStartX !== null && e.changedTouches && e.changedTouches.length > 0) {
                                const touchEndX = e.changedTouches[0].clientX;
                                const diff = lightboxTouchStartX - touchEndX;
                                if (diff > 45) {
                                    goToNext();
                                    setZoomScale(1);
                                } else if (diff < -45) {
                                    goToPrev();
                                    setZoomScale(1);
                                }
                            }
                            setLightboxTouchStartX(null);
                        }}
                        onTouchCancel={() => setLightboxTouchStartX(null)}
                        style={{
                            flex: 1,
                            overflow: "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            touchAction: "pan-x pan-y pinch-zoom",
                            WebkitOverflowScrolling: "touch",
                            padding: "8px 0",
                            position: "relative",
                        }}
                    >
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setZoomScale((prev) => (prev > 1 ? 1 : 2));
                            }}
                            style={{
                                position: "relative",
                                width: zoomScale > 1 ? "clamp(680px, 160vw, 1200px)" : "min(95vw, 920px)",
                                aspectRatio: "1.29 / 1",
                                minHeight: zoomScale > 1 ? 460 : 250,
                                transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s ease",
                                cursor: zoomScale > 1 ? "zoom-out" : "zoom-in",
                                borderRadius: 14,
                                overflow: "hidden",
                                boxShadow: "0 24px 64px rgba(0, 0, 0, 0.9)",
                                border: "1px solid rgba(226, 133, 155, 0.35)",
                                margin: "auto",
                                flexShrink: 0,
                            }}
                        >
                            <Image
                                key={currentSlide.src}
                                src={currentSlide.src}
                                alt={currentSlide.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 1200px"
                                style={{
                                    objectFit: "contain",
                                }}
                                priority
                            />
                        </div>
                    </div>

                    {/* Bottom Controls: Navigation Dots & Helper Hint */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            paddingTop: 8,
                            flexShrink: 0,
                        }}
                    >
                        {/* Slide Dots Indicator */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                        }}>
                            {FEATURE_SLIDES.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                        setActiveSlideIndex(idx);
                                        setZoomScale(1);
                                    }}
                                    aria-label={`Lihat foto ${idx + 1}`}
                                    style={{
                                        width: idx === activeSlideIndex ? 22 : 6,
                                        height: 6,
                                        borderRadius: 999,
                                        background: idx === activeSlideIndex ? "#E2859B" : "rgba(226, 133, 155, 0.3)",
                                        border: "none",
                                        padding: 0,
                                        cursor: "pointer",
                                        transition: "all 0.25s ease",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Helper Hint */}
                        <div style={{
                            textAlign: "center",
                            fontFamily: "var(--font-sans)",
                            fontSize: 11,
                            color: "#D1A7B1",
                        }}>
                            Gunakan panah / swipe untuk berganti foto &middot; Ketuk foto untuk zoom 2x
                        </div>
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
}
