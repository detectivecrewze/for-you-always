"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import posthog from "posthog-js";
import { formatRupiah } from "@/lib/purchase-options";

export interface PurchaseModeConfig {
    productId: string;
    productTitle: string;
    themeColor: string;
    selfServicePrice: number;
    doneForYouPrice: number;
    onSelectSelfService: () => void;
    onSelectDoneForYou: () => void;
}

export default function PurchaseModeModal({ config, onClose }: { config: PurchaseModeConfig; onClose: () => void }) {
    const [mounted, setMounted] = useState(false);
    const [closing, setClosing] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onCloseRef = useRef(onClose);
    const dialogRef = useRef<HTMLDivElement>(null);
    const selectedModeRef = useRef(false);
    const closeTrackedRef = useRef(false);
    const viewedTrackedRef = useRef(false);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    const trackingProperties = useCallback(() => ({
        product_id: config.productId,
        product_title: config.productTitle,
        self_service_price: config.selfServicePrice,
        done_for_you_price: config.doneForYouPrice,
        done_for_you_surcharge: config.doneForYouPrice - config.selfServicePrice,
        currency: "IDR",
        source: "purchase_mode_modal",
    }), [config.doneForYouPrice, config.productId, config.productTitle, config.selfServicePrice]);

    const close = useCallback((reason: "close_button" | "backdrop" | "escape" | "selection" = "close_button") => {
        if (closeTimer.current) return;
        if (!selectedModeRef.current && !closeTrackedRef.current) {
            closeTrackedRef.current = true;
            posthog.capture("purchase_mode_closed", {
                ...trackingProperties(),
                close_reason: reason,
            });
        }
        setClosing(true);
        closeTimer.current = setTimeout(() => onCloseRef.current(), 180);
    }, [trackingProperties]);

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const mountTimer = window.setTimeout(() => setMounted(true), 0);
        const focusTimer = window.setTimeout(() => dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus(), 30);
        if (!viewedTrackedRef.current) {
            viewedTrackedRef.current = true;
            posthog.capture("purchase_mode_viewed", trackingProperties());
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") close("escape");
            if (event.key !== "Tab" || !dialogRef.current) return;
            const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button,[href],[tabindex]:not([tabindex="-1"])'));
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.clearTimeout(mountTimer);
            window.clearTimeout(focusTimer);
            if (closeTimer.current) clearTimeout(closeTimer.current);
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [close, trackingProperties]);

    const choose = (mode: "self_service" | "done_for_you", handler: () => void) => {
        selectedModeRef.current = true;
        posthog.capture("purchase_mode_selected", {
            ...trackingProperties(),
            fulfillment_mode: mode,
            selected_price: mode === "done_for_you" ? config.doneForYouPrice : config.selfServicePrice,
        });
        handler();
        close("selection");
    };

    if (!mounted) return null;
    const accent = config.themeColor || "#8b1d2c";

    return createPortal(
        <div onMouseDown={(event) => { if (event.target === event.currentTarget) close("backdrop"); }} style={{ position: "fixed", inset: 0, zIndex: 1000000, display: "grid", placeItems: "center", padding: "20px 16px", background: "rgba(29,24,22,.55)", backdropFilter: "blur(8px)", opacity: closing ? 0 : 1, transition: "opacity .18s ease" }}>
            <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="purchase-mode-title" style={{ width: "min(100%, 430px)", maxHeight: "min(90vh, 720px)", overflowY: "auto", borderRadius: 28, background: "#fffdf9", border: "1px solid rgba(205,171,143,.35)", boxShadow: "0 28px 80px rgba(29,24,22,.25)", transform: closing ? "translateY(12px) scale(.98)" : "none", transition: "transform .18s ease" }}>
                <header style={{ position: "relative", padding: "25px 68px 20px 24px", borderBottom: "1px solid rgba(205,171,143,.24)", background: `linear-gradient(145deg, ${accent}16, transparent)` }}>
                    <p style={{ margin: "0 0 6px", color: accent, fontSize: 10, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase" }}>{config.productTitle}</p>
                    <h2 id="purchase-mode-title" style={{ margin: 0, color: "#1d1816", fontFamily: "var(--font-display)", fontSize: 27, lineHeight: 1.1 }}>Mau merangkai sendiri atau tinggal kirim bahan?</h2>
                    <p style={{ margin: "8px 0 0", color: "#74645c", fontSize: 12.5, lineHeight: 1.55 }}>Keduanya memakai desain yang sama. Bedanya hanya siapa yang menyusunnya.</p>
                    <button type="button" onClick={() => close("close_button")} aria-label="Tutup pilihan" style={{ position: "absolute", top: 18, right: 18, width: 44, height: 44, display: "grid", placeItems: "center", borderRadius: "50%", border: "1px solid rgba(56,42,36,.12)", background: "rgba(255,255,255,.8)", color: "#382a24", cursor: "pointer" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                </header>

                <div style={{ display: "grid", gap: 12, padding: 18 }}>
                    <button type="button" onClick={() => choose("self_service", config.onSelectSelfService)} style={{ position: "relative", width: "100%", minHeight: 108, padding: "17px 18px", display: "grid", gridTemplateColumns: "44px 1fr auto", alignItems: "center", gap: 13, textAlign: "left", borderRadius: 18, border: "1px solid #e8ddd5", background: "#fff", color: "#382a24", cursor: "pointer" }}>
                        <span style={{ position: "absolute", top: 10, right: 12, padding: "3px 8px", borderRadius: 99, background: "#e8e2db", color: "#5a4a42", fontSize: 8, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>Langsung & Personal</span>
                        <span style={{ width: 44, height: 44, display: "grid", placeItems: "center", borderRadius: 14, background: "#f6efe9", color: accent }}>
                            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg>
                        </span>
                        <span><strong style={{ display: "block", fontSize: 14, marginBottom: 4 }}>Rangkai Sendiri</strong><small style={{ display: "block", color: "#827168", fontSize: 11.5, lineHeight: 1.45 }}>Akses Studio langsung setelah pembayaran. Cocok kalau kamu ingin mengatur isi dan desainnya sendiri.</small></span>
                        <strong style={{ color: "#382a24", fontSize: 14, whiteSpace: "nowrap" }}>{formatRupiah(config.selfServicePrice)}</strong>
                    </button>

                    <button type="button" onClick={() => choose("done_for_you", config.onSelectDoneForYou)} style={{ position: "relative", width: "100%", minHeight: 176, padding: "20px 18px 17px", display: "grid", gridTemplateColumns: "44px minmax(0, 1fr) auto", alignItems: "start", gap: 13, textAlign: "left", borderRadius: 18, border: `1.5px solid ${accent}55`, background: `linear-gradient(145deg, ${accent}12, #fff 70%)`, color: "#382a24", cursor: "pointer", boxShadow: `0 9px 28px ${accent}16` }}>
                        <span style={{ position: "absolute", top: 10, right: 12, padding: "3px 8px", borderRadius: 99, background: accent, color: "#fff", fontSize: 8, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>Tanpa Ribet</span>
                        <span style={{ width: 44, height: 44, marginTop: 12, display: "grid", placeItems: "center", borderRadius: 14, background: `${accent}18`, color: accent }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
                        </span>
                        <span style={{ marginTop: 12 }}><strong style={{ display: "block", fontSize: 14, marginBottom: 4 }}>Dibuatkan Tim</strong><small style={{ display: "block", color: "#6f5e55", fontSize: 11.5, lineHeight: 1.45 }}>Kamu cukup kirim foto dan ceritanya. Teks, susunan, dan desain kami rapikan sampai gift siap dibagikan.</small><span style={{ display: "grid", gap: 4, marginTop: 10, color: "#75645b", fontSize: 10.5 }}><span>✓ Tidak perlu membuka atau mengatur Studio</span><span>✓ Preview pertama maksimal 1×24 jam</span><span>✓ Termasuk hingga 3 kali revisi</span><span>✓ Link final dikirim via WhatsApp</span></span></span>
                        <span style={{ marginTop: 40, textAlign: "right", whiteSpace: "nowrap" }}><strong style={{ display: "block", color: accent, fontSize: 14 }}>{formatRupiah(config.doneForYouPrice)}</strong><small style={{ display: "block", marginTop: 3, color: "#8a766c", fontSize: 8.5 }}>+{formatRupiah(config.doneForYouPrice - config.selfServicePrice)} jasa tim</small></span>
                    </button>
                    <p style={{ margin: "1px 8px 2px", color: "#94847a", textAlign: "center", fontSize: 10.5, lineHeight: 1.5 }}>Setelah checkout, kamu akan diarahkan mengirim bahan lewat WhatsApp. Tim mulai menyusun setelah bahannya lengkap.</p>
                </div>
            </div>
        </div>,
        document.body,
    );
}

