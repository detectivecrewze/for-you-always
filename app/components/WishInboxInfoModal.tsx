"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
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
        desc: "Penerima kado berinteraksi langsung meniup lilin kue ulang tahun digital dan menuliskan pesan balasan serta harapannya di dalam scrapbook.",
        src: "/assets/snoopy-features/wishes-2.webp",
    },
    {
        id: "inbox",
        title: "Wish Inbox Interaktif",
        desc: "Pesan harapan dari si dia otomatis tersimpan di Wish Inbox dan langsung bisa kamu baca kapan saja secara privat.",
        src: "https://cdn.for-you-always.my.id/1788948631528-i2oht.webp",
    },
];

export default function WishInboxInfoModal({ isOpen, onClose }: WishInboxInfoModalProps) {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [lightboxTouchStartX, setLightboxTouchStartX] = useState<number | null>(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomScale, setZoomScale] = useState(1);
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
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
        }
        closeTimerRef.current = setTimeout(() => {
            setClosing(false);
            closingRef.current = false;
            document.body.style.overflow = originalOverflowRef.current;
            onCloseRef.current();
        }, 260);
    }, []);

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
                background: visible && !closing ? "rgba(12, 9, 4, 0.85)" : "rgba(12, 9, 4, 0)",
                backdropFilter: visible && !closing ? "blur(14px)" : "blur(0px)",
                WebkitBackdropFilter: visible && !closing ? "blur(14px)" : "blur(0px)",
                transition: "background 0.28s ease, backdrop-filter 0.28s ease",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "linear-gradient(165deg, #231C0E 0%, #141007 100%)",
                    width: "100%",
                    maxWidth: 580,
                    maxHeight: "92dvh",
                    borderRadius: "clamp(20px, 4.5vw, 28px)",
                    border: "1px solid rgba(245, 183, 56, 0.38)",
                    boxShadow: "0 32px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(245, 183, 56, 0.16)",
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
                        background: "rgba(245, 183, 56, 0.16)",
                        border: "1px solid rgba(245, 183, 56, 0.45)",
                        color: "#FCD875",
                        fontFamily: "var(--font-sans)",
                        fontSize: "clamp(9.5px, 2.3vw, 10.5px)",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                    }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#F5B738", flexShrink: 0 }} />
                        Birthday Scrapbook · Wish Inbox
                    </div>

                    <button
                        onClick={handleClose}
                        aria-label="Tutup dialog"
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            border: "1px solid rgba(245, 183, 56, 0.35)",
                            background: "rgba(45, 36, 18, 0.7)",
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
                            e.currentTarget.style.background = "rgba(245, 183, 56, 0.3)";
                            e.currentTarget.style.borderColor = "rgba(245, 183, 56, 0.7)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(45, 36, 18, 0.7)";
                            e.currentTarget.style.borderColor = "rgba(245, 183, 56, 0.35)";
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

                {/* Hero Screenshot (Click to Zoom & Swipeable) */}
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
                        aspectRatio: "1.4 / 1",
                        minHeight: "clamp(230px, 54vw, 380px)",
                        flexShrink: 0,
                        borderRadius: "clamp(14px, 3.2vw, 18px)",
                        overflow: "hidden",
                        border: "1px solid rgba(245, 183, 56, 0.35)",
                        boxShadow: "0 20px 48px rgba(0, 0, 0, 0.65)",
                        marginBottom: 12,
                        background: "#141007",
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
                        background: "rgba(18, 14, 7, 0.85)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(245, 183, 56, 0.45)",
                        color: "#FCD875",
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
                            background: "rgba(32, 25, 12, 0.85)",
                            backdropFilter: "blur(6px)",
                            border: "1px solid rgba(245, 183, 56, 0.45)",
                            color: "#FAF7F2",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                            zIndex: 2,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(245, 183, 56, 0.35)";
                            e.currentTarget.style.borderColor = "rgba(245, 183, 56, 0.8)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(32, 25, 12, 0.85)";
                            e.currentTarget.style.borderColor = "rgba(245, 183, 56, 0.45)";
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
                            background: "rgba(32, 25, 12, 0.85)",
                            backdropFilter: "blur(6px)",
                            border: "1px solid rgba(245, 183, 56, 0.45)",
                            color: "#FAF7F2",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                            zIndex: 2,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(245, 183, 56, 0.35)";
                            e.currentTarget.style.borderColor = "rgba(245, 183, 56, 0.8)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(32, 25, 12, 0.85)";
                            e.currentTarget.style.borderColor = "rgba(245, 183, 56, 0.45)";
                        }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>

                {/* Integrated Feature Caption & Story Flow Box */}
                <div style={{
                    background: "rgba(52, 40, 20, 0.55)",
                    border: "1px solid rgba(245, 183, 56, 0.28)",
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
                                color: "#E0CCA9",
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
                                        background: idx === activeSlideIndex ? "#F5B738" : "rgba(245, 183, 56, 0.25)",
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
                        color: "#EDE1CB",
                        lineHeight: 1.5,
                    }}>
                        {currentSlide.desc}
                    </div>
                </div>

                {/* 2-Step Process Flow Cards (Clickable Steps) */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "clamp(8px, 2.2vw, 12px)",
                    marginBottom: 20,
                    flexShrink: 0,
                }}>
                    {[
                        { num: "01", title: "Tiup Lilin", sub: "Penerima tulis wish", slideIdx: 0 },
                        { num: "02", title: "Wish Inbox", sub: "Dibaca pembuat kado", slideIdx: 1 },
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
                                    padding: "10px 8px",
                                    borderRadius: 12,
                                    background: isCurrentActive ? "rgba(245, 183, 56, 0.2)" : "rgba(255, 255, 255, 0.03)",
                                    border: isCurrentActive ? "1px solid rgba(245, 183, 56, 0.65)" : "1px solid rgba(255, 255, 255, 0.08)",
                                    boxShadow: isCurrentActive ? "0 4px 16px rgba(245, 183, 56, 0.2)" : "none",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                <span style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: 9.5,
                                    fontWeight: 700,
                                    color: isCurrentActive ? "#FCD875" : "#9E8C6A",
                                    letterSpacing: "0.08em",
                                    marginBottom: 3,
                                }}>
                                    LANGKAH {step.num}
                                </span>
                                <span style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "clamp(11.5px, 2.7vw, 12.5px)",
                                    fontWeight: 600,
                                    color: isCurrentActive ? "#FAF7F2" : "#C8B99A",
                                    lineHeight: 1.25,
                                    marginBottom: 3,
                                }}>
                                    {step.title}
                                </span>
                                <span style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "clamp(9.5px, 2.3vw, 10.5px)",
                                    color: isCurrentActive ? "#EDE1CB" : "#807156",
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
                            background: "linear-gradient(135deg, #F5B738 0%, #E2991E 100%)",
                            color: "#241604",
                            fontFamily: "var(--font-sans)",
                            fontSize: "clamp(12.5px, 2.8vw, 13.5px)",
                            fontWeight: 700,
                            padding: "10px clamp(28px, 6vw, 40px)",
                            borderRadius: 999,
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 6px 20px rgba(245, 183, 56, 0.35)",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 8px 24px rgba(245, 183, 56, 0.5)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 6px 20px rgba(245, 183, 56, 0.35)";
                        }}
                    >
                        Mengerti & Tutup
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
                        background: "rgba(10, 8, 4, 0.96)",
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
                            color: "#FAF7F2",
                            fontWeight: 600,
                        }}>
                            <span style={{
                                padding: "3px 9px",
                                borderRadius: 999,
                                background: "rgba(245, 183, 56, 0.2)",
                                border: "1px solid rgba(245, 183, 56, 0.45)",
                                color: "#FCD875",
                                fontSize: "clamp(10px, 2.5vw, 11px)",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                            }}>
                                Langkah {activeSlideIndex + 1}/2
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
                                    background: zoomScale > 1 ? "rgba(245, 183, 56, 0.25)" : "rgba(255, 255, 255, 0.1)",
                                    border: "1px solid " + (zoomScale > 1 ? "rgba(245, 183, 56, 0.6)" : "rgba(255, 255, 255, 0.2)"),
                                    color: zoomScale > 1 ? "#FCD875" : "#FAF7F2",
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
                                    color: "#FAF7F2",
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
                            background: "rgba(32, 25, 12, 0.85)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            border: "1px solid rgba(245, 183, 56, 0.45)",
                            color: "#FAF7F2",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            zIndex: 100010,
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.65)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(245, 183, 56, 0.35)";
                            e.currentTarget.style.borderColor = "rgba(245, 183, 56, 0.8)";
                            e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(32, 25, 12, 0.85)";
                            e.currentTarget.style.borderColor = "rgba(245, 183, 56, 0.45)";
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
                            background: "rgba(32, 25, 12, 0.85)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            border: "1px solid rgba(245, 183, 56, 0.45)",
                            color: "#FAF7F2",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            zIndex: 100010,
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.65)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(245, 183, 56, 0.35)";
                            e.currentTarget.style.borderColor = "rgba(245, 183, 56, 0.8)";
                            e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(32, 25, 12, 0.85)";
                            e.currentTarget.style.borderColor = "rgba(245, 183, 56, 0.45)";
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
                                aspectRatio: "1.48 / 1",
                                minHeight: zoomScale > 1 ? 460 : 250,
                                transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s ease",
                                cursor: zoomScale > 1 ? "zoom-out" : "zoom-in",
                                borderRadius: 14,
                                overflow: "hidden",
                                boxShadow: "0 24px 64px rgba(0, 0, 0, 0.9)",
                                border: "1px solid rgba(245, 183, 56, 0.35)",
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
                                        background: idx === activeSlideIndex ? "#F5B738" : "rgba(245, 183, 56, 0.35)",
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
                            color: "#E0CCA9",
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
