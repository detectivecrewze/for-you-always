"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface CircleWishesInfoModalProps {
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

export default function CircleWishesInfoModal({ isOpen, onClose }: CircleWishesInfoModalProps) {
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
            return () => {
                clearTimeout(timer);
                document.body.style.overflow = "";
            };
        } else {
            document.body.style.overflow = "";
            setVisible(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "Escape") {
                handleClose();
            } else if (e.key === "ArrowLeft") {
                setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : FEATURE_SLIDES.length - 1));
            } else if (e.key === "ArrowRight") {
                setActiveSlideIndex((prev) => (prev < FEATURE_SLIDES.length - 1 ? prev + 1 : 0));
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, closing]);

    const handleClose = () => {
        if (closing || closingRef.current) return;
        closingRef.current = true;
        setClosing(true);
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
        }
        closeTimerRef.current = setTimeout(() => {
            onClose();
            closingRef.current = false;
            setClosing(false);
            document.body.style.overflow = "";
        }, 220);
    };

    const currentSlide = FEATURE_SLIDES[activeSlideIndex];

    const goToPrev = () => {
        setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : FEATURE_SLIDES.length - 1));
    };

    const goToNext = () => {
        setActiveSlideIndex((prev) => (prev < FEATURE_SLIDES.length - 1 ? prev + 1 : 0));
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (diff > 45) {
            goToNext();
        } else if (diff < -45) {
            goToPrev();
        }
        setTouchStartX(null);
    };

    const handleTouchCancel = () => {
        setTouchStartX(null);
    };

    if (!mounted || !isOpen) return null;

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
                    margin: "0 0 12px",
                    textAlign: "center",
                    letterSpacing: "-0.01em",
                }}>
                    Cara Kerja Circle Wishes: Memoria Edition
                </h3>

                {/* Large Hero Screenshot (Swipeable & Prominent) */}
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
                        border: "1px solid rgba(226, 133, 155, 0.28)",
                        boxShadow: "0 20px 48px rgba(0, 0, 0, 0.55)",
                        marginBottom: 12,
                        background: "#180911",
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
                            background: "rgba(22, 9, 16, 0.8)",
                            backdropFilter: "blur(6px)",
                            border: "1px solid rgba(226, 133, 155, 0.35)",
                            color: "#FDE8E9",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
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
                            background: "rgba(22, 9, 16, 0.8)",
                            backdropFilter: "blur(6px)",
                            border: "1px solid rgba(226, 133, 155, 0.35)",
                            color: "#FDE8E9",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
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

                {/* 3 Steps Flow (Informasi Alur Kerja Lengkap & Rapi) */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginBottom: 16,
                    flexShrink: 0,
                }}>
                    <div style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 10.5,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#E2859B",
                        marginBottom: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                    }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#E2859B" }} />
                        3 Langkah Mudah Circle Wishes
                    </div>

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

                    <a
                        href="https://anniv.for-you-always.my.id/auto-circle"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 7,
                            background: "linear-gradient(135deg, #E2859B 0%, #C96880 100%)",
                            color: "#2D141E",
                            fontFamily: "var(--font-sans)",
                            fontSize: "clamp(12px, 2.8vw, 13px)",
                            fontWeight: 700,
                            padding: "9px clamp(14px, 3.5vw, 20px)",
                            borderRadius: 999,
                            whiteSpace: "nowrap",
                            textDecoration: "none",
                            boxShadow: "0 6px 20px rgba(226, 133, 155, 0.3)",
                            transition: "all 0.2s ease",
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
                    </a>
                </div>
            </div>
        </div>,
        document.body
    );
}
