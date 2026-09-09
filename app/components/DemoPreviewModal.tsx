"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type DemoCloseReason = "button" | "backdrop" | "escape" | "order";
export type DemoModalTheme = "memoria" | "letter" | "voices";

interface DemoThemeTokens {
    backdropBg: string;
    frameBg: string;
    frameBorder: string;
    frameShadow: string;
    headerBg: string;
    headerBorder: string;
    footerBg: string;
    footerBorder: string;
    titleColor: string;
    subtitleColor: string;
    closeBg: string;
    closeBorder: string;
    closeColor: string;
    closeHoverBg: string;
    closeHoverBorder: string;
    orderBg: string;
    orderColor: string;
    orderShadow: string;
    orderHoverShadow: string;
    spinnerTrack: string;
    spinnerAccent: string;
    retryBtnBg: string;
    retryBtnColor: string;
    retryLinkColor: string;
    emptyBg: string;
    emptyText: string;
}

const THEME_CONFIGS: Record<DemoModalTheme, DemoThemeTokens> = {
    memoria: {
        backdropBg: "rgba(18, 7, 13, 0.82)",
        frameBg: "linear-gradient(160deg, #2D141E 0%, #170A10 100%)",
        frameBorder: "1px solid rgba(226, 133, 155, 0.32)",
        frameShadow: "0 30px 90px rgba(0, 0, 0, 0.62), 0 0 40px rgba(226, 133, 155, 0.1)",
        headerBg: "rgba(45, 20, 30, 0.96)",
        headerBorder: "1px solid rgba(226, 133, 155, 0.2)",
        footerBg: "rgba(45, 20, 30, 0.98)",
        footerBorder: "1px solid rgba(226, 133, 155, 0.2)",
        titleColor: "#FDE8E9",
        subtitleColor: "#D1A7B1",
        closeBg: "rgba(253, 232, 233, 0.08)",
        closeBorder: "1px solid rgba(226, 133, 155, 0.3)",
        closeColor: "#FDE8E9",
        closeHoverBg: "rgba(226, 133, 155, 0.2)",
        closeHoverBorder: "rgba(226, 133, 155, 0.55)",
        orderBg: "linear-gradient(135deg, #E99AB0 0%, #D97891 100%)",
        orderColor: "#2D141E",
        orderShadow: "0 7px 20px rgba(226, 133, 155, 0.24)",
        orderHoverShadow: "0 10px 24px rgba(226, 133, 155, 0.34)",
        spinnerTrack: "rgba(88, 24, 36, 0.15)",
        spinnerAccent: "#E2859B",
        retryBtnBg: "#581824",
        retryBtnColor: "#FDE8E9",
        retryLinkColor: "#7D4050",
        emptyBg: "radial-gradient(circle at 50% 40%, #FFF9F5 0%, #F8ECE7 72%)",
        emptyText: "#581824",
    },
    letter: {
        backdropBg: "rgba(18, 13, 10, 0.82)",
        frameBg: "linear-gradient(160deg, #241A15 0%, #150F0D 100%)",
        frameBorder: "1px solid rgba(200, 162, 122, 0.32)",
        frameShadow: "0 30px 90px rgba(0, 0, 0, 0.62), 0 0 40px rgba(200, 162, 122, 0.12)",
        headerBg: "rgba(36, 26, 21, 0.96)",
        headerBorder: "1px solid rgba(200, 162, 122, 0.2)",
        footerBg: "rgba(36, 26, 21, 0.98)",
        footerBorder: "1px solid rgba(200, 162, 122, 0.2)",
        titleColor: "#F7EFE8",
        subtitleColor: "#C9B6A8",
        closeBg: "rgba(247, 239, 232, 0.08)",
        closeBorder: "1px solid rgba(200, 162, 122, 0.3)",
        closeColor: "#F7EFE8",
        closeHoverBg: "rgba(200, 162, 122, 0.2)",
        closeHoverBorder: "rgba(200, 162, 122, 0.55)",
        orderBg: "linear-gradient(135deg, #D4AF87 0%, #B88B5E 100%)",
        orderColor: "#241A15",
        orderShadow: "0 7px 20px rgba(184, 139, 94, 0.26)",
        orderHoverShadow: "0 10px 24px rgba(184, 139, 94, 0.36)",
        spinnerTrack: "rgba(122, 84, 56, 0.18)",
        spinnerAccent: "#C8A27A",
        retryBtnBg: "#5A3D29",
        retryBtnColor: "#F7EFE8",
        retryLinkColor: "#8C6A4F",
        emptyBg: "radial-gradient(circle at 50% 40%, #FAF6F1 0%, #EFE5D9 72%)",
        emptyText: "#5A3D29",
    },
    voices: {
        backdropBg: "rgba(18, 11, 7, 0.82)",
        frameBg: "linear-gradient(160deg, #231710 0%, #140D09 100%)",
        frameBorder: "1px solid rgba(212, 155, 106, 0.32)",
        frameShadow: "0 30px 90px rgba(0, 0, 0, 0.62), 0 0 40px rgba(212, 155, 106, 0.12)",
        headerBg: "rgba(35, 23, 16, 0.96)",
        headerBorder: "1px solid rgba(212, 155, 106, 0.2)",
        footerBg: "rgba(35, 23, 16, 0.98)",
        footerBorder: "1px solid rgba(212, 155, 106, 0.2)",
        titleColor: "#F8EFEA",
        subtitleColor: "#D1B7A7",
        closeBg: "rgba(248, 239, 234, 0.08)",
        closeBorder: "1px solid rgba(212, 155, 106, 0.3)",
        closeColor: "#F8EFEA",
        closeHoverBg: "rgba(212, 155, 106, 0.2)",
        closeHoverBorder: "rgba(212, 155, 106, 0.55)",
        orderBg: "linear-gradient(135deg, #E0A978 0%, #C2824D 100%)",
        orderColor: "#231710",
        orderShadow: "0 7px 20px rgba(194, 130, 77, 0.26)",
        orderHoverShadow: "0 10px 24px rgba(194, 130, 77, 0.36)",
        spinnerTrack: "rgba(107, 67, 35, 0.18)",
        spinnerAccent: "#D49B6A",
        retryBtnBg: "#5C371B",
        retryBtnColor: "#F8EFEA",
        retryLinkColor: "#8E5E36",
        emptyBg: "radial-gradient(circle at 50% 40%, #FAF5F0 0%, #EDE0D4 72%)",
        emptyText: "#5C371B",
    },
};

interface DemoPreviewModalProps {
    isOpen: boolean;
    src: string;
    title: string;
    subtitle: string;
    productName: string;
    price: string;
    theme?: DemoModalTheme;
    orderButtonLabel?: string;
    onClose: (reason: DemoCloseReason) => void;
    onOrder: () => void;
    onLoaded?: (loadTimeMs: number) => void;
}

const CLOSE_DURATION_MS = 220;
const LOAD_TIMEOUT_MS = 12_000;

export default function DemoPreviewModal({
    isOpen,
    src,
    title,
    subtitle,
    productName,
    price,
    theme = "memoria",
    orderButtonLabel,
    onClose,
    onOrder,
    onLoaded,
}: DemoPreviewModalProps) {
    const t = THEME_CONFIGS[theme] || THEME_CONFIGS.memoria;
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [timedOut, setTimedOut] = useState(false);
    const [iframeKey, setIframeKey] = useState(0);
    const [showIframe, setShowIframe] = useState(true);

    const dialogRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);
    const originalOverflowRef = useRef("");
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const loadStartedAtRef = useRef(0);
    const hasClosedRef = useRef(false);
    const hasReportedLoadRef = useRef(false);
    const onCloseRef = useRef(onClose);
    const onOrderRef = useRef(onOrder);
    const onLoadedRef = useRef(onLoaded);

    useEffect(() => {
        onCloseRef.current = onClose;
        onOrderRef.current = onOrder;
        onLoadedRef.current = onLoaded;
    }, [onClose, onOrder, onLoaded]);

    const clearTimers = useCallback(() => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
        if (loadTimerRef.current) {
            clearTimeout(loadTimerRef.current);
            loadTimerRef.current = null;
        }
    }, []);

    useEffect(() => {
        setMounted(true);
        return () => {
            clearTimers();
            document.body.style.overflow = originalOverflowRef.current;
        };
    }, [clearTimers]);

    useEffect(() => {
        if (!isOpen) return;

        previousFocusRef.current = document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        originalOverflowRef.current = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        hasClosedRef.current = false;
        setClosing(false);
        setLoading(true);
        setTimedOut(false);
        setShowIframe(true);
        loadStartedAtRef.current = performance.now();

        const revealTimer = window.setTimeout(() => {
            setVisible(true);
            closeButtonRef.current?.focus({ preventScroll: true });
        }, 16);

        return () => window.clearTimeout(revealTimer);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || !showIframe) return;

        if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
        loadStartedAtRef.current = performance.now();
        loadTimerRef.current = setTimeout(() => {
            setTimedOut(true);
            setLoading(false);
        }, LOAD_TIMEOUT_MS);

        return () => {
            if (loadTimerRef.current) {
                clearTimeout(loadTimerRef.current);
                loadTimerRef.current = null;
            }
        };
    }, [iframeKey, isOpen, showIframe]);

    const finishClose = useCallback((reason: DemoCloseReason) => {
        if (hasClosedRef.current) return;
        hasClosedRef.current = true;
        document.body.style.overflow = originalOverflowRef.current;
        onCloseRef.current(reason);

        if (reason === "order") {
            onOrderRef.current();
        } else {
            window.requestAnimationFrame(() => previousFocusRef.current?.focus({ preventScroll: true }));
        }
    }, []);

    const requestClose = useCallback((reason: DemoCloseReason) => {
        if (closing || hasClosedRef.current) return;
        setClosing(true);
        setVisible(false);
        setShowIframe(false);
        if (loadTimerRef.current) {
            clearTimeout(loadTimerRef.current);
            loadTimerRef.current = null;
        }
        closeTimerRef.current = setTimeout(() => finishClose(reason), CLOSE_DURATION_MS);
    }, [closing, finishClose]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                requestClose("escape");
                return;
            }

            if (event.key !== "Tab" || !dialogRef.current) return;
            const focusable = Array.from(
                dialogRef.current.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])'
                )
            ).filter((element) => !element.hasAttribute("disabled"));

            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, requestClose]);

    const handleIframeLoad = useCallback(() => {
        if (loadTimerRef.current) {
            clearTimeout(loadTimerRef.current);
            loadTimerRef.current = null;
        }
        setLoading(false);
        setTimedOut(false);
        if (window.matchMedia("(max-width: 767px)").matches) {
            iframeRef.current?.focus({ preventScroll: true });
        }
        if (!hasReportedLoadRef.current) {
            hasReportedLoadRef.current = true;
            onLoadedRef.current?.(Math.round(performance.now() - loadStartedAtRef.current));
        }
    }, []);

    const handleRetry = useCallback(() => {
        hasReportedLoadRef.current = false;
        setLoading(true);
        setTimedOut(false);
        setShowIframe(true);
        setIframeKey((current) => current + 1);
    }, []);

    if (!mounted || (!isOpen && !closing)) return null;

    return createPortal(
        <div
            className="memoria-demo-backdrop"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) requestClose("backdrop");
            }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1_000_000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "clamp(8px, 2vw, 18px)",
                background: t.backdropBg,
                opacity: visible && !closing ? 1 : 0,
                transition: "opacity 0.2s ease",
            }}
        >
            <style>{`
                @keyframes memoriaDemoSpin {
                    to { transform: rotate(360deg); }
                }
                .memoria-demo-backdrop {
                    -webkit-tap-highlight-color: transparent;
                    pointer-events: auto;
                }
                .memoria-demo-frame {
                    height: min(88dvh, 840px);
                    pointer-events: auto;
                }
                .memoria-demo-viewport {
                    overflow-y: auto !important;
                    overflow-x: hidden !important;
                    -webkit-overflow-scrolling: touch !important;
                    touch-action: pan-y !important;
                }
                .memoria-demo-iframe {
                    width: 100% !important;
                    height: 100% !important;
                    display: block;
                    border: 0;
                    touch-action: pan-y !important;
                    pointer-events: auto !important;
                }
                .memoria-demo-close:hover,
                .memoria-demo-close:focus-visible {
                    background: ${t.closeHoverBg} !important;
                    border-color: ${t.closeHoverBorder} !important;
                    outline: none;
                }
                .memoria-demo-order:hover,
                .memoria-demo-order:focus-visible {
                    transform: translateY(-1px);
                    box-shadow: ${t.orderHoverShadow} !important;
                    outline: 2px solid ${t.titleColor}A6;
                    outline-offset: 2px;
                }
                @media (min-width: 768px) {
                    .memoria-demo-backdrop {
                        backdrop-filter: blur(6px);
                        -webkit-backdrop-filter: blur(6px);
                    }
                    .memoria-demo-frame {
                        width: min(96vw, 1440px) !important;
                        height: 92dvh;
                        max-width: none !important;
                        max-height: 960px !important;
                    }
                }
                @media (max-width: 767px) {
                    .memoria-demo-frame {
                        height: calc(100dvh - 16px);
                        max-height: 880px;
                        border-radius: 22px !important;
                        transform: none !important;
                        transition: opacity 0.18s ease !important;
                    }
                    .memoria-demo-header {
                        padding: 10px 12px !important;
                    }
                    .memoria-demo-footer {
                        padding: 10px 12px max(10px, env(safe-area-inset-bottom)) !important;
                    }
                    .memoria-demo-viewport {
                        overflow-y: auto !important;
                        overflow-x: hidden !important;
                        -webkit-overflow-scrolling: touch !important;
                        touch-action: pan-y !important;
                    }
                    .memoria-demo-iframe {
                        touch-action: pan-y !important;
                        pointer-events: auto !important;
                    }
                }
                @media (prefers-reduced-motion: reduce) {
                    .memoria-demo-backdrop,
                    .memoria-demo-frame,
                    .memoria-demo-order {
                        transition: none !important;
                    }
                    .memoria-demo-spinner {
                        animation-duration: 1.6s !important;
                    }
                }
            `}</style>

            <div
                ref={dialogRef}
                className="memoria-demo-frame"
                role="dialog"
                aria-modal="true"
                aria-labelledby="memoria-demo-title"
                aria-describedby="memoria-demo-subtitle"
                style={{
                    width: "min(470px, 100%)",
                    maxHeight: 840,
                    display: "grid",
                    gridTemplateRows: "auto minmax(0, 1fr) auto",
                    overflow: "hidden",
                    borderRadius: 26,
                    border: t.frameBorder,
                    background: t.frameBg,
                    boxShadow: t.frameShadow,
                    transform: visible && !closing ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
                    opacity: visible && !closing ? 1 : 0,
                    transition: "transform 0.24s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.18s ease",
                }}
            >
                <div
                    className="memoria-demo-header"
                    style={{
                        minHeight: 66,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "10px 14px 10px 18px",
                        borderBottom: t.headerBorder,
                        background: t.headerBg,
                    }}
                >
                    <div style={{ minWidth: 0 }}>
                        <div
                            id="memoria-demo-title"
                            style={{
                                color: t.titleColor,
                                fontFamily: "var(--font-display)",
                                fontSize: 18,
                                fontWeight: 600,
                                lineHeight: 1.1,
                            }}
                        >
                            {title}
                        </div>
                        <div
                            id="memoria-demo-subtitle"
                            style={{
                                marginTop: 4,
                                color: t.subtitleColor,
                                fontFamily: "var(--font-sans)",
                                fontSize: 11,
                                lineHeight: 1.35,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {subtitle}
                        </div>
                    </div>

                    <button
                        ref={closeButtonRef}
                        type="button"
                        className="memoria-demo-close"
                        onClick={() => requestClose("button")}
                        aria-label={`Tutup demo ${productName}`}
                        style={{
                            width: 44,
                            height: 44,
                            flexShrink: 0,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 999,
                            border: t.closeBorder,
                            background: t.closeBg,
                            color: t.closeColor,
                            cursor: "pointer",
                            transition: "background 0.18s ease, border-color 0.18s ease",
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>
                </div>

                <div
                    className="memoria-demo-viewport"
                    style={{
                        position: "relative",
                        minHeight: 0,
                        overflowY: "auto",
                        overflowX: "hidden",
                        WebkitOverflowScrolling: "touch",
                        background: "#F9F1EA",
                    }}
                >
                    {showIframe && (
                        <iframe
                            ref={iframeRef}
                            key={iframeKey}
                            className="memoria-demo-iframe"
                            src={src}
                            title={title}
                            loading="lazy"
                            scrolling="yes"
                            allow="autoplay; fullscreen"
                            allowFullScreen
                            tabIndex={0}
                            referrerPolicy="strict-origin-when-cross-origin"
                            onLoad={handleIframeLoad}
                            onError={() => {
                                setLoading(false);
                                setTimedOut(true);
                            }}
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "block",
                                border: 0,
                            }}
                        />
                    )}

                    {loading && !timedOut && (
                        <div
                            role="status"
                            aria-live="polite"
                            style={{
                                position: "absolute",
                                inset: 0,
                                zIndex: 2,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 13,
                                color: t.emptyText,
                                background: t.emptyBg,
                            }}
                        >
                            <span
                                className="memoria-demo-spinner"
                                aria-hidden="true"
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 999,
                                    border: `2px solid ${t.spinnerTrack}`,
                                    borderTopColor: t.spinnerAccent,
                                    animation: "memoriaDemoSpin 0.8s linear infinite",
                                }}
                            />
                            <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, letterSpacing: "0.04em" }}>
                                Menyiapkan contoh {productName}…
                            </span>
                        </div>
                    )}

                    {timedOut && (
                        <div
                            role="alert"
                            style={{
                                position: "absolute",
                                inset: 0,
                                zIndex: 3,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 12,
                                padding: 28,
                                textAlign: "center",
                                color: t.emptyText,
                                background: t.emptyBg,
                            }}
                        >
                            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600 }}>
                                Demo belum berhasil dimuat
                            </div>
                            <p style={{ maxWidth: 310, margin: 0, fontFamily: "var(--font-sans)", fontSize: 12.5, lineHeight: 1.55, opacity: 0.75 }}>
                                Koneksi mungkin sedang lambat. Coba muat ulang tanpa meninggalkan halaman ini.
                            </p>
                            <button
                                type="button"
                                onClick={handleRetry}
                                style={{
                                    minHeight: 44,
                                    padding: "10px 20px",
                                    borderRadius: 999,
                                    border: "none",
                                    background: t.retryBtnBg,
                                    color: t.retryBtnColor,
                                    fontFamily: "var(--font-sans)",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                }}
                            >
                                Coba Lagi
                            </button>
                            <a
                                href={src}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    minHeight: 44,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    color: t.retryLinkColor,
                                    fontFamily: "var(--font-sans)",
                                    fontSize: 12,
                                    fontWeight: 600,
                                }}
                            >
                                Buka demo di tab baru
                            </a>
                        </div>
                    )}
                </div>

                <div
                    className="memoria-demo-footer"
                    style={{
                        minHeight: 74,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "11px 14px 12px 18px",
                        borderTop: t.footerBorder,
                        background: t.footerBg,
                    }}
                >
                    <div style={{ minWidth: 0 }}>
                        <div style={{ color: t.subtitleColor, fontFamily: "var(--font-sans)", fontSize: 10.5, lineHeight: 1.2 }}>
                            {productName}
                        </div>
                        <div style={{ marginTop: 3, color: t.titleColor, fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, lineHeight: 1 }}>
                            {price}
                        </div>
                    </div>

                    <button
                        type="button"
                        className="memoria-demo-order"
                        onClick={() => requestClose("order")}
                        style={{
                            minHeight: 48,
                            flex: "0 0 auto",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            padding: "11px clamp(16px, 5vw, 24px)",
                            borderRadius: 999,
                            border: "none",
                            background: t.orderBg,
                            color: t.orderColor,
                            boxShadow: t.orderShadow,
                            fontFamily: "var(--font-sans)",
                            fontSize: 12.5,
                            fontWeight: 800,
                            cursor: "pointer",
                            transition: "transform 0.18s ease, box-shadow 0.18s ease",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {orderButtonLabel || `Pesan ${productName}`}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
