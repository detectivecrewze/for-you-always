"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    const close = useCallback(() => {
        if (closeTimer.current) return;
        setClosing(true);
        closeTimer.current = setTimeout(() => onCloseRef.current(), 180);
    }, []);

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const mountTimer = window.setTimeout(() => setMounted(true), 0);
        const focusTimer = window.setTimeout(() => dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus(), 30);
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") close();
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
    }, [close]);

    const choose = (handler: () => void) => {
        handler();
        close();
    };

    if (!mounted) return null;
    const accent = config.themeColor || "#8b1d2c";

    return createPortal(
        <div onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }} style={{ position: "fixed", inset: 0, zIndex: 1000000, display: "grid", placeItems: "center", padding: "20px 16px", background: "rgba(29,24,22,.55)", backdropFilter: "blur(8px)", opacity: closing ? 0 : 1, transition: "opacity .18s ease" }}>
            <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="purchase-mode-title" style={{ width: "min(100%, 430px)", maxHeight: "min(90vh, 720px)", overflowY: "auto", borderRadius: 28, background: "#fffdf9", border: "1px solid rgba(205,171,143,.35)", boxShadow: "0 28px 80px rgba(29,24,22,.25)", transform: closing ? "translateY(12px) scale(.98)" : "none", transition: "transform .18s ease" }}>
                <header style={{ position: "relative", padding: "25px 68px 20px 24px", borderBottom: "1px solid rgba(205,171,143,.24)", background: `linear-gradient(145deg, ${accent}16, transparent)` }}>
                    <p style={{ margin: "0 0 6px", color: accent, fontSize: 10, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase" }}>{config.productTitle}</p>
                    <h2 id="purchase-mode-title" style={{ margin: 0, color: "#1d1816", fontFamily: "var(--font-display)", fontSize: 27, lineHeight: 1.1 }}>Mau dibuat sendiri atau dibantu?</h2>
                    <p style={{ margin: "8px 0 0", color: "#74645c", fontSize: 12.5, lineHeight: 1.55 }}>Pilih cara yang paling nyaman. Isi dan desain gift tetap memakai template yang sama.</p>
                    <button type="button" onClick={close} aria-label="Tutup pilihan" style={{ position: "absolute", top: 18, right: 18, width: 44, height: 44, display: "grid", placeItems: "center", borderRadius: "50%", border: "1px solid rgba(56,42,36,.12)", background: "rgba(255,255,255,.8)", color: "#382a24", cursor: "pointer" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                </header>

                <div style={{ display: "grid", gap: 12, padding: 18 }}>
                    <button type="button" onClick={() => choose(config.onSelectSelfService)} style={{ position: "relative", width: "100%", minHeight: 108, padding: "17px 18px", display: "grid", gridTemplateColumns: "44px 1fr auto", alignItems: "center", gap: 13, textAlign: "left", borderRadius: 18, border: "1px solid #e8ddd5", background: "#fff", color: "#382a24", cursor: "pointer" }}>
                        <span style={{ position: "absolute", top: 10, right: 12, padding: "3px 8px", borderRadius: 99, background: "#e8e2db", color: "#5a4a42", fontSize: 8, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>Instan & Personal</span>
                        <span style={{ width: 44, height: 44, display: "grid", placeItems: "center", borderRadius: 14, background: "#f6efe9", color: accent }}>
                            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg>
                        </span>
                        <span><strong style={{ display: "block", fontSize: 14, marginBottom: 4 }}>Rangkai Sendiri</strong><small style={{ display: "block", color: "#827168", fontSize: 11.5, lineHeight: 1.45 }}>Nikmati serunya menyusun kejutan untuknya lewat form editor yang simpel dan interaktif.</small></span>
                        <strong style={{ color: "#382a24", fontSize: 14, whiteSpace: "nowrap" }}>{formatRupiah(config.selfServicePrice)}</strong>
                    </button>

                    <button type="button" onClick={() => choose(config.onSelectDoneForYou)} style={{ position: "relative", width: "100%", minHeight: 158, padding: "20px 18px 17px", display: "grid", gridTemplateColumns: "44px 1fr auto", alignItems: "start", gap: 13, textAlign: "left", borderRadius: 18, border: `1.5px solid ${accent}55`, background: `linear-gradient(145deg, ${accent}12, #fff 70%)`, color: "#382a24", cursor: "pointer", boxShadow: `0 9px 28px ${accent}16` }}>
                        <span style={{ position: "absolute", top: 10, right: 12, padding: "3px 8px", borderRadius: 99, background: accent, color: "#fff", fontSize: 8, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>Paling Praktis</span>
                        <span style={{ width: 44, height: 44, marginTop: 12, display: "grid", placeItems: "center", borderRadius: 14, background: `${accent}18`, color: accent }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
                        </span>
                        <span style={{ marginTop: 12 }}><strong style={{ display: "block", fontSize: 14, marginBottom: 4 }}>Terima Jadi</strong><small style={{ display: "block", color: "#6f5e55", fontSize: 11.5, lineHeight: 1.45 }}>Tim kami mengerjakan gift setelah bahan lengkap.</small><span style={{ display: "grid", gap: 4, marginTop: 10, color: "#75645b", fontSize: 10.5 }}><span>✓ Hasil kado siap dicek dalam 1×24 jam</span><span>✓ Bebas revisi hingga 3 kali</span><span>✓ Link final dikirim melalui WhatsApp</span></span></span>
                        <strong style={{ marginTop: 40, color: accent, fontSize: 14, whiteSpace: "nowrap" }}>{formatRupiah(config.doneForYouPrice)}</strong>
                    </button>
                    <p style={{ margin: "1px 8px 2px", color: "#94847a", textAlign: "center", fontSize: 10.5, lineHeight: 1.5 }}>Estimasi dimulai setelah seluruh bahan dinyatakan lengkap. Waktu revisi berada di luar estimasi pengerjaan pertama.</p>
                </div>
            </div>
        </div>,
        document.body,
    );
}

