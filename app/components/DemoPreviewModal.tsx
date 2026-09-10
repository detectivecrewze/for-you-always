"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";

export type DemoCloseReason = "button" | "backdrop" | "escape" | "order";
export type DemoModalTheme = "memoria" | "letter" | "voices" | "mixtape" | "invitation" | "retro" | "arcade" | "wrapped" | "birthday";

export interface DemoPreviewVariant {
    id: string;
    label: string;
    src: string;
    subtitle?: string;
}

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

export interface DemoPreviewModalProps {
    isOpen: boolean;
    src: string;
    title: string;
    subtitle: string;
    productName: string;
    price: string;
    theme?: DemoModalTheme;
    variants?: readonly DemoPreviewVariant[];
    initialVariantId?: string;
    orderButtonLabel?: string;
    onClose: (reason: DemoCloseReason) => void;
    onOrder: () => void;
    onLoaded?: (loadTimeMs: number) => void;
    onVariantChange?: (previousVariant: DemoPreviewVariant, nextVariant: DemoPreviewVariant) => void;
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
    variants,
    initialVariantId,
    orderButtonLabel,
    onClose,
    onOrder,
    onLoaded,
    onVariantChange,
}: DemoPreviewModalProps) {
    const t = THEME_CONFIGS[theme] || THEME_CONFIGS.memoria;
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [timedOut, setTimedOut] = useState(false);
    const [iframeKey, setIframeKey] = useState(0);
    const [showIframe, setShowIframe] = useState(true);
    const [selectedVariantId, setSelectedVariantId] = useState(() => (
        variants?.some((variant) => variant.id === initialVariantId)
            ? initialVariantId!
            : variants?.[0]?.id ?? "default"
    ));

    useEffect(() => {
        if (initialVariantId && variants?.some((variant) => variant.id === initialVariantId)) {
            setSelectedVariantId(initialVariantId);
        }
    }, [initialVariantId, variants]);

    const fallbackVariant = useMemo<DemoPreviewVariant>(() => ({
        id: "default",
        label: title,
        src,
        subtitle,
    }), [src, subtitle, title]);
    const availableVariants = useMemo<readonly DemoPreviewVariant[]>(
        () => variants && variants.length > 0 ? variants : [fallbackVariant],
        [fallbackVariant, variants]
    );
    const selectedVariant = availableVariants.find((variant) => variant.id === selectedVariantId)
        ?? availableVariants[0]
        ?? fallbackVariant;
    const hasVariantSwitcher = availableVariants.length > 1;
    const displayTitle = hasVariantSwitcher ? `Demo ${productName}` : title;
    const displaySubtitle = selectedVariant.subtitle ?? subtitle;

    const dialogRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const variantButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
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
    const onVariantChangeRef = useRef(onVariantChange);

    useEffect(() => {
        onCloseRef.current = onClose;
        onOrderRef.current = onOrder;
        onLoadedRef.current = onLoaded;
        onVariantChangeRef.current = onVariantChange;
    }, [onClose, onOrder, onLoaded, onVariantChange]);

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
        hasReportedLoadRef.current = false;
        loadStartedAtRef.current = performance.now();

        const revealTimer = window.setTimeout(() => {
            setVisible(true);
            closeButtonRef.current?.focus({ preventScroll: true });
            const button = variantButtonRefs.current[selectedVariant.id];
            button?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
        }, 16);

        return () => {
            window.clearTimeout(revealTimer);
            document.body.style.overflow = originalOverflowRef.current;
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || !showIframe) return;
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
    }, [iframeKey, isOpen, selectedVariant.id, showIframe]);

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

    const selectVariant = useCallback((nextVariant: DemoPreviewVariant, focusButton = false) => {
        if (nextVariant.id === selectedVariant.id) return;

        const previousVariant = selectedVariant;
        if (loadTimerRef.current) {
            clearTimeout(loadTimerRef.current);
            loadTimerRef.current = null;
        }
        hasReportedLoadRef.current = false;
        setLoading(true);
        setTimedOut(false);
        setShowIframe(true);
        setSelectedVariantId(nextVariant.id);
        setIframeKey((current) => current + 1);
        onVariantChangeRef.current?.(previousVariant, nextVariant);

        window.requestAnimationFrame(() => {
            const button = variantButtonRefs.current[nextVariant.id];
            button?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
            if (focusButton) button?.focus({ preventScroll: true });
        });
    }, [selectedVariant]);

    const handleVariantKeyDown = useCallback((event: ReactKeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
        let nextIndex: number | null = null;
        if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % availableVariants.length;
        if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + availableVariants.length) % availableVariants.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = availableVariants.length - 1;
        if (nextIndex === null) return;

        event.preventDefault();
        selectVariant(availableVariants[nextIndex], true);
    }, [availableVariants, selectVariant]);

    if (!isOpen && !closing) return null;

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
                    height: min(90dvh, 880px);
                    pointer-events: auto;
                }
                .memoria-demo-viewport {
                    overflow-y: hidden !important;
                    overflow-x: hidden !important;
                }
                .memoria-demo-iframe {
                    width: 100% !important;
                    height: 100% !important;
                    display: block;
                    border: 0;
                    pointer-events: auto !important;
                }
                .memoria-demo-header {
                    display: grid;
                    grid-template-columns: 1fr auto;
                    grid-template-areas:
                        "title close"
                        "switcher switcher";
                    gap: 8px 10px;
                    padding: 9px 12px 9px 14px;
                    border-bottom: ${t.headerBorder};
                    background: ${t.headerBg};
                    flex-shrink: 0;
                }
                .memoria-demo-header:not(.has-switcher) {
                    grid-template-areas: "title close";
                    padding: 10px 14px;
                }
                .memoria-demo-title-group {
                    grid-area: title;
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .memoria-demo-close {
                    grid-area: close;
                    justify-self: end;
                    align-self: center;
                    width: 44px;
                    height: 44px;
                    flex-shrink: 0;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 999px;
                    border: ${t.closeBorder};
                    background: ${t.closeBg};
                    color: ${t.closeColor};
                    cursor: pointer;
                    transition: background 0.18s ease, border-color 0.18s ease;
                }
                .memoria-demo-close:hover,
                .memoria-demo-close:focus-visible {
                    background: ${t.closeHoverBg} !important;
                    border-color: ${t.closeHoverBorder} !important;
                    outline: none;
                }
                .memoria-demo-segmented-track {
                    grid-area: switcher;
                    display: flex;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 999px;
                    padding: 2.5px;
                    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.25);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    width: 100%;
                    box-sizing: border-box;
                }
                .memoria-demo-segmented-track.has-2-variants {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 3px;
                }
                .memoria-demo-segmented-track.has-many-variants {
                    display: flex;
                    gap: 4px;
                    overflow-x: auto;
                    overflow-y: hidden;
                    scrollbar-width: none;
                    -webkit-overflow-scrolling: touch;
                    scroll-snap-type: x proximity;
                }
                .memoria-demo-segmented-track.has-many-variants::-webkit-scrollbar {
                    display: none;
                }
                .memoria-demo-segmented-track.has-many-variants .memoria-demo-segmented-btn {
                    flex: 0 0 auto;
                    width: auto;
                    min-width: fit-content;
                    scroll-snap-align: center;
                }
                .memoria-demo-segmented-label {
                    white-space: nowrap;
                    display: inline-block;
                }
                .memoria-demo-segmented-btn {
                    min-height: 44px;
                    padding: 0 12px;
                    border-radius: 999px;
                    border: none;
                    font-family: var(--font-sans);
                    font-size: 11px;
                    font-weight: 700;
                    line-height: 1;
                    cursor: pointer;
                    white-space: nowrap;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    -webkit-tap-highlight-color: transparent;
                }
                .memoria-demo-segmented-btn:hover:not([aria-selected="true"]) {
                    color: ${t.titleColor} !important;
                    background: rgba(255, 255, 255, 0.06) !important;
                }
                .memoria-demo-segmented-btn:focus-visible {
                    outline: 2px solid ${t.titleColor}8F;
                    outline-offset: 1px;
                }
                .memoria-demo-footer {
                    min-height: 52px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    padding: 8px 16px;
                    border-top: ${t.footerBorder};
                    background: ${t.footerBg};
                }
                .memoria-demo-order {
                    min-height: 44px;
                    flex: 0 0 auto;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    padding: 0 16px;
                    border-radius: 999px;
                    border: none;
                    background: ${t.orderBg};
                    color: ${t.orderColor};
                    box-shadow: ${t.orderShadow};
                    font-family: var(--font-sans);
                    font-size: 11.5px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: transform 0.18s ease, box-shadow 0.18s ease;
                    white-space: nowrap;
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
                    .memoria-demo-header {
                        padding: 10px 20px !important;
                        gap: 20px !important;
                        min-height: 64px !important;
                    }
                    .memoria-demo-header.has-switcher {
                        display: grid !important;
                        grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) !important;
                        grid-template-areas: "title switcher close" !important;
                        align-items: center !important;
                    }
                    .memoria-demo-header:not(.has-switcher) {
                        display: grid !important;
                        grid-template-columns: minmax(0, 1fr) auto !important;
                        grid-template-areas: "title close" !important;
                    }
                    .memoria-demo-title-group {
                        justify-self: start !important;
                        width: 100% !important;
                        max-width: 360px !important;
                    }
                    .memoria-demo-segmented-track {
                        justify-self: center !important;
                        width: auto !important;
                        max-width: min(620px, 46vw) !important;
                    }
                    .memoria-demo-segmented-track.has-2-variants {
                        display: grid !important;
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                        width: clamp(320px, 28vw, 400px) !important;
                        min-width: 0 !important;
                    }
                    .memoria-demo-segmented-track.has-2-variants .memoria-demo-segmented-btn {
                        width: 100% !important;
                    }
                    .memoria-demo-segmented-track.has-many-variants {
                        display: inline-flex !important;
                        gap: 4px !important;
                        width: auto !important;
                        max-width: min(620px, 46vw) !important;
                        justify-content: center !important;
                    }
                    .memoria-demo-segmented-track.has-many-variants .memoria-demo-segmented-btn {
                        flex: 0 0 auto !important;
                        width: auto !important;
                        min-width: 0 !important;
                        padding: 0 12px !important;
                    }
                    .memoria-demo-segmented-track.theme-memoria.variant-count-3 {
                        display: grid !important;
                        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                        width: clamp(380px, 34vw, 480px) !important;
                        gap: 3px !important;
                    }
                    .memoria-demo-segmented-track.theme-memoria.variant-count-3 .memoria-demo-segmented-btn {
                        width: 100% !important;
                    }
                    .memoria-demo-close {
                        justify-self: end !important;
                        width: 44px !important;
                        height: 44px !important;
                    }
                }
                @media (max-width: 767px) {
                    .memoria-demo-frame {
                        height: calc(100dvh - 12px) !important;
                        max-height: 96dvh !important;
                        border-radius: 20px !important;
                        transform: none !important;
                        transition: opacity 0.18s ease !important;
                    }
                    .memoria-demo-footer {
                        padding: 8px 12px max(8px, env(safe-area-inset-bottom)) !important;
                        min-height: 50px !important;
                    }
                    .memoria-demo-viewport {
                        overflow-y: hidden !important;
                        overflow-x: hidden !important;
                    }
                    .memoria-demo-segmented-track.variant-count-3:not(.theme-letter) {
                        display: grid !important;
                        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                        gap: 3px !important;
                        overflow: hidden !important;
                        scroll-snap-type: none !important;
                    }
                    .memoria-demo-segmented-track.variant-count-3:not(.theme-letter) .memoria-demo-segmented-btn {
                        width: 100% !important;
                        min-width: 0 !important;
                        padding-inline: 4px !important;
                        font-size: 10.5px !important;
                    }
                    .memoria-demo-segmented-track.variant-count-3:not(.theme-letter) .memoria-demo-segmented-label {
                        overflow: hidden !important;
                        text-overflow: ellipsis !important;
                        white-space: nowrap !important;
                        display: block !important;
                        width: 100% !important;
                        text-align: center !important;
                    }
                    .memoria-demo-segmented-track.theme-letter {
                        display: flex !important;
                        gap: 5px !important;
                        overflow-x: auto !important;
                        overflow-y: hidden !important;
                        scrollbar-width: none !important;
                        -webkit-overflow-scrolling: touch !important;
                        scroll-snap-type: x proximity !important;
                        padding: 3px 4px !important;
                    }
                    .memoria-demo-segmented-track.theme-letter::-webkit-scrollbar {
                        display: none !important;
                    }
                    .memoria-demo-segmented-track.theme-letter .memoria-demo-segmented-btn {
                        flex: 0 0 auto !important;
                        width: auto !important;
                        min-width: fit-content !important;
                        padding: 0 13px !important;
                        font-size: 11px !important;
                        scroll-snap-align: center !important;
                    }
                    .memoria-demo-segmented-track.theme-letter .memoria-demo-segmented-label {
                        white-space: nowrap !important;
                        display: inline-block !important;
                        overflow: visible !important;
                        text-overflow: clip !important;
                        width: auto !important;
                    }
                }
                @media (prefers-reduced-motion: reduce) {
                    .memoria-demo-backdrop,
                    .memoria-demo-frame,
                    .memoria-demo-order {
                        transition: none !important;
                    }
                    .memoria-demo-segmented-btn {
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
                aria-describedby={displaySubtitle ? "memoria-demo-subtitle" : undefined}
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
                <div className={`memoria-demo-header ${hasVariantSwitcher ? "has-switcher" : ""}`}>
                    <div className="memoria-demo-title-group">
                        <div
                            id="memoria-demo-title"
                            style={{
                                color: t.titleColor,
                                fontFamily: "var(--font-display)",
                                fontSize: 16,
                                fontWeight: 600,
                                lineHeight: 1.1,
                            }}
                        >
                            {displayTitle}
                        </div>
                        {displaySubtitle && (
                            <div
                                id="memoria-demo-subtitle"
                                style={{
                                    marginTop: 3,
                                    color: t.subtitleColor,
                                    fontFamily: "var(--font-sans)",
                                    fontSize: 10.5,
                                    lineHeight: 1.3,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {displaySubtitle}
                            </div>
                        )}
                    </div>

                    {hasVariantSwitcher && (
                        <div
                            role="tablist"
                            aria-label={`Pilih tema demo ${productName}`}
                            className={`memoria-demo-segmented-track ${availableVariants.length === 2 ? "has-2-variants" : "has-many-variants"} variant-count-${availableVariants.length} theme-${theme}`}
                        >
                            {availableVariants.map((variant, index) => {
                                const isSelected = variant.id === selectedVariant.id;
                                return (
                                    <button
                                        key={variant.id}
                                        ref={(node) => { variantButtonRefs.current[variant.id] = node; }}
                                        type="button"
                                        role="tab"
                                        aria-selected={isSelected}
                                        tabIndex={isSelected ? 0 : -1}
                                        className="memoria-demo-segmented-btn"
                                        onClick={() => selectVariant(variant)}
                                        onKeyDown={(event) => handleVariantKeyDown(event, index)}
                                        style={{
                                            background: isSelected ? t.orderBg : "transparent",
                                            color: isSelected ? t.orderColor : t.subtitleColor,
                                            boxShadow: isSelected ? "0 2px 8px rgba(0, 0, 0, 0.25)" : "none",
                                        }}
                                    >
                                        <span className="memoria-demo-segmented-label">
                                            {variant.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <button
                        ref={closeButtonRef}
                        type="button"
                        className="memoria-demo-close"
                        onClick={() => requestClose("button")}
                        aria-label={`Tutup demo ${productName}`}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>
                </div>

                <div
                    className="memoria-demo-viewport"
                    style={{
                        position: "relative",
                        minHeight: 0,
                        overflow: "hidden",
                        background: "#F9F1EA",
                    }}
                >
                    {showIframe && (
                        <iframe
                            ref={iframeRef}
                            key={iframeKey}
                            className="memoria-demo-iframe"
                            src={selectedVariant.src}
                            title={`${productName} — ${selectedVariant.label}`}
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
                                Menyiapkan {selectedVariant.label}…
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
                                href={selectedVariant.src}
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

                <div className="memoria-demo-footer">
                    <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                        <div style={{ color: t.subtitleColor, fontFamily: "var(--font-sans)", fontSize: 10, lineHeight: 1.1 }}>
                            {productName}
                        </div>
                        <div style={{ color: t.titleColor, fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, lineHeight: 1 }}>
                            {price}
                        </div>
                    </div>

                    <button
                        type="button"
                        className="memoria-demo-order"
                        onClick={() => requestClose("order")}
                    >
                        {orderButtonLabel || `Pesan ${productName}`}
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
