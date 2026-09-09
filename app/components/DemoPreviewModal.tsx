"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type DemoCloseReason = "button" | "backdrop" | "escape" | "order";
export type DemoModalTheme = "memoria" | "letter" | "voices" | "mixtape" | "invitation" | "retro" | "arcade" | "wrapped" | "birthday";

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
    mixtape: {
        backdropBg: "rgba(9, 17, 22, 0.82)",
        frameBg: "linear-gradient(160deg, #112028 0%, #091116 100%)",
        frameBorder: "1px solid rgba(90, 141, 158, 0.32)",
        frameShadow: "0 30px 90px rgba(0, 0, 0, 0.62), 0 0 40px rgba(90, 141, 158, 0.12)",
        headerBg: "rgba(17, 32, 40, 0.96)",
        headerBorder: "1px solid rgba(90, 141, 158, 0.2)",
        footerBg: "rgba(17, 32, 40, 0.98)",
        footerBorder: "1px solid rgba(90, 141, 158, 0.2)",
        titleColor: "#E6F2F5",
        subtitleColor: "#8FAEB8",
        closeBg: "rgba(230, 242, 245, 0.08)",
        closeBorder: "1px solid rgba(90, 141, 158, 0.3)",
        closeColor: "#E6F2F5",
        closeHoverBg: "rgba(90, 141, 158, 0.2)",
        closeHoverBorder: "rgba(90, 141, 158, 0.55)",
        orderBg: "linear-gradient(135deg, #7BB0C2 0%, #5A8D9E 100%)",
        orderColor: "#0B171D",
        orderShadow: "0 7px 20px rgba(90, 141, 158, 0.28)",
        orderHoverShadow: "0 10px 24px rgba(90, 141, 158, 0.38)",
        spinnerTrack: "rgba(90, 141, 158, 0.18)",
        spinnerAccent: "#7BB0C2",
        retryBtnBg: "#1C3B47",
        retryBtnColor: "#E6F2F5",
        retryLinkColor: "#5A8D9E",
        emptyBg: "radial-gradient(circle at 50% 40%, #F4F8FA 0%, #DEE8ED 72%)",
        emptyText: "#1C3B47",
    },
    invitation: {
        backdropBg: "rgba(22, 10, 15, 0.82)",
        frameBg: "linear-gradient(160deg, #26111A 0%, #15080E 100%)",
        frameBorder: "1px solid rgba(232, 120, 154, 0.32)",
        frameShadow: "0 30px 90px rgba(0, 0, 0, 0.62), 0 0 40px rgba(232, 120, 154, 0.12)",
        headerBg: "rgba(38, 17, 26, 0.96)",
        headerBorder: "1px solid rgba(232, 120, 154, 0.2)",
        footerBg: "rgba(38, 17, 26, 0.98)",
        footerBorder: "1px solid rgba(232, 120, 154, 0.2)",
        titleColor: "#FDF0F4",
        subtitleColor: "#D9A7B8",
        closeBg: "rgba(253, 240, 244, 0.08)",
        closeBorder: "1px solid rgba(232, 120, 154, 0.3)",
        closeColor: "#FDF0F4",
        closeHoverBg: "rgba(232, 120, 154, 0.2)",
        closeHoverBorder: "rgba(232, 120, 154, 0.55)",
        orderBg: "linear-gradient(135deg, #F095B2 0%, #E8789A 100%)",
        orderColor: "#26111A",
        orderShadow: "0 7px 20px rgba(232, 120, 154, 0.28)",
        orderHoverShadow: "0 10px 24px rgba(232, 120, 154, 0.38)",
        spinnerTrack: "rgba(232, 120, 154, 0.18)",
        spinnerAccent: "#E8789A",
        retryBtnBg: "#5E2036",
        retryBtnColor: "#FDF0F4",
        retryLinkColor: "#993B5D",
        emptyBg: "radial-gradient(circle at 50% 40%, #FFF8FA 0%, #F9E8EE 72%)",
        emptyText: "#5E2036",
    },
    retro: {
        backdropBg: "rgba(5, 16, 17, 0.82)",
        frameBg: "linear-gradient(160deg, #0A1E20 0%, #051011 100%)",
        frameBorder: "1px solid rgba(0, 134, 137, 0.35)",
        frameShadow: "0 30px 90px rgba(0, 0, 0, 0.62), 0 0 40px rgba(0, 134, 137, 0.14)",
        headerBg: "rgba(10, 30, 32, 0.96)",
        headerBorder: "1px solid rgba(0, 134, 137, 0.22)",
        footerBg: "rgba(10, 30, 32, 0.98)",
        footerBorder: "1px solid rgba(0, 134, 137, 0.22)",
        titleColor: "#E6F7F7",
        subtitleColor: "#82B8BA",
        closeBg: "rgba(230, 247, 247, 0.08)",
        closeBorder: "1px solid rgba(0, 134, 137, 0.3)",
        closeColor: "#E6F7F7",
        closeHoverBg: "rgba(0, 134, 137, 0.2)",
        closeHoverBorder: "rgba(0, 134, 137, 0.55)",
        orderBg: "linear-gradient(135deg, #20A9AC 0%, #008689 100%)",
        orderColor: "#051011",
        orderShadow: "0 7px 20px rgba(0, 134, 137, 0.28)",
        orderHoverShadow: "0 10px 24px rgba(0, 134, 137, 0.38)",
        spinnerTrack: "rgba(0, 134, 137, 0.18)",
        spinnerAccent: "#20A9AC",
        retryBtnBg: "#005C5E",
        retryBtnColor: "#E6F7F7",
        retryLinkColor: "#20A9AC",
        emptyBg: "radial-gradient(circle at 50% 40%, #F2FAFA 0%, #DBECEC 72%)",
        emptyText: "#005C5E",
    },
    arcade: {
        backdropBg: "rgba(10, 18, 10, 0.82)",
        frameBg: "linear-gradient(160deg, #132213 0%, #0A120A 100%)",
        frameBorder: "1px solid rgba(92, 140, 92, 0.35)",
        frameShadow: "0 30px 90px rgba(0, 0, 0, 0.62), 0 0 40px rgba(92, 140, 92, 0.14)",
        headerBg: "rgba(19, 34, 19, 0.96)",
        headerBorder: "1px solid rgba(92, 140, 92, 0.22)",
        footerBg: "rgba(19, 34, 19, 0.98)",
        footerBorder: "1px solid rgba(92, 140, 92, 0.22)",
        titleColor: "#EEF6EE",
        subtitleColor: "#9EBA9E",
        closeBg: "rgba(238, 246, 238, 0.08)",
        closeBorder: "1px solid rgba(92, 140, 92, 0.3)",
        closeColor: "#EEF6EE",
        closeHoverBg: "rgba(92, 140, 92, 0.2)",
        closeHoverBorder: "rgba(92, 140, 92, 0.55)",
        orderBg: "linear-gradient(135deg, #7EAE7E 0%, #5C8C5C 100%)",
        orderColor: "#0A120A",
        orderShadow: "0 7px 20px rgba(92, 140, 92, 0.28)",
        orderHoverShadow: "0 10px 24px rgba(92, 140, 92, 0.38)",
        spinnerTrack: "rgba(92, 140, 92, 0.18)",
        spinnerAccent: "#7EAE7E",
        retryBtnBg: "#2E522E",
        retryBtnColor: "#EEF6EE",
        retryLinkColor: "#5C8C5C",
        emptyBg: "radial-gradient(circle at 50% 40%, #F5F9F5 0%, #E2EDE2 72%)",
        emptyText: "#2E522E",
    },
    wrapped: {
        backdropBg: "rgba(20, 4, 10, 0.82)",
        frameBg: "linear-gradient(160deg, #2A0D18 0%, #14040A 100%)",
        frameBorder: "1px solid rgba(201, 24, 74, 0.35)",
        frameShadow: "0 30px 90px rgba(0, 0, 0, 0.62), 0 0 40px rgba(201, 24, 74, 0.14)",
        headerBg: "rgba(42, 13, 24, 0.96)",
        headerBorder: "1px solid rgba(201, 24, 74, 0.22)",
        footerBg: "rgba(42, 13, 24, 0.98)",
        footerBorder: "1px solid rgba(201, 24, 74, 0.22)",
        titleColor: "#FDE8EF",
        subtitleColor: "#D899AC",
        closeBg: "rgba(253, 232, 239, 0.08)",
        closeBorder: "1px solid rgba(201, 24, 74, 0.3)",
        closeColor: "#FDE8EF",
        closeHoverBg: "rgba(201, 24, 74, 0.2)",
        closeHoverBorder: "rgba(201, 24, 74, 0.55)",
        orderBg: "linear-gradient(135deg, #E03565 0%, #C9184A 100%)",
        orderColor: "#FFFFFF",
        orderShadow: "0 7px 20px rgba(201, 24, 74, 0.28)",
        orderHoverShadow: "0 10px 24px rgba(201, 24, 74, 0.38)",
        spinnerTrack: "rgba(201, 24, 74, 0.18)",
        spinnerAccent: "#E03565",
        retryBtnBg: "#680D27",
        retryBtnColor: "#FDE8EF",
        retryLinkColor: "#C9184A",
        emptyBg: "radial-gradient(circle at 50% 40%, #FFF5F7 0%, #F9DEE5 72%)",
        emptyText: "#680D27",
    },
    birthday: {
        backdropBg: "rgba(24, 15, 4, 0.82)",
        frameBg: "linear-gradient(160deg, #241604 0%, #120A02 100%)",
        frameBorder: "1px solid rgba(245, 183, 56, 0.35)",
        frameShadow: "0 30px 90px rgba(0, 0, 0, 0.62), 0 0 40px rgba(245, 183, 56, 0.14)",
        headerBg: "rgba(36, 22, 4, 0.96)",
        headerBorder: "1px solid rgba(245, 183, 56, 0.22)",
        footerBg: "rgba(36, 22, 4, 0.98)",
        footerBorder: "1px solid rgba(245, 183, 56, 0.22)",
        titleColor: "#FFF8EE",
        subtitleColor: "#D8B88C",
        closeBg: "rgba(255, 248, 238, 0.08)",
        closeBorder: "1px solid rgba(245, 183, 56, 0.3)",
        closeColor: "#FFF8EE",
        closeHoverBg: "rgba(245, 183, 56, 0.2)",
        closeHoverBorder: "rgba(245, 183, 56, 0.55)",
        orderBg: "linear-gradient(135deg, #F5B738 0%, #E2991E 100%)",
        orderColor: "#241604",
        orderShadow: "0 7px 20px rgba(226, 153, 30, 0.28)",
        orderHoverShadow: "0 10px 24px rgba(226, 153, 30, 0.38)",
        spinnerTrack: "rgba(245, 183, 56, 0.18)",
        spinnerAccent: "#F5B738",
        retryBtnBg: "#5E3D0A",
        retryBtnColor: "#FFF8EE",
        retryLinkColor: "#E2991E",
        emptyBg: "radial-gradient(circle at 50% 40%, #FFFDF8 0%, #F6ECE0 72%)",
        emptyText: "#5E3D0A",
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
