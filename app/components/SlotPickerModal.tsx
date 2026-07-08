"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface SlotPickerConfig {
    productId: string;
    productTitle: string;
    themeColor: string;
    themeImgSrc?: string;
    onSelectSingle: () => void;
    onSelectThreeSlot: () => void;
}

interface SlotPickerModalProps {
    config: SlotPickerConfig;
    onClose: () => void;
}

export default function SlotPickerModal({ config, onClose }: SlotPickerModalProps) {
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const t = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(t);
    }, []);

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => onClose(), 220);
    };

    const handleSelect = (fn: () => void) => {
        fn();
        handleClose();
    };

    const accentColor = config.themeColor || "#a67c52";

    if (!mounted) return null;

    return createPortal(
        <div
            onClick={handleClose}
            style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                zIndex: 999999,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "20px 16px",
                opacity: visible && !closing ? 1 : 0,
                transition: "opacity 0.22s ease",
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: "#faf7f2",
                    width: "100%", maxWidth: 360,
                    borderRadius: 28,
                    overflow: "hidden",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(205,171,143,0.2)",
                    transform: visible && !closing ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
                    transition: "transform 0.28s cubic-bezier(0.34,1.4,0.64,1)",
                }}
            >
                {/* Header */}
                <div style={{
                    background: `linear-gradient(135deg, ${accentColor}22 0%, ${accentColor}08 100%)`,
                    borderBottom: `1px solid ${accentColor}20`,
                    padding: "22px 24px 18px",
                    position: "relative",
                }}>
                    <button
                        onClick={handleClose}
                        style={{
                            position: "absolute", top: 16, right: 16,
                            width: 30, height: 30, borderRadius: "50%",
                            border: "none", background: "rgba(0,0,0,0.06)",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "background 0.2s ease",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.12)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.06)"; }}
                        aria-label="Tutup"
                    >
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#382a24" strokeWidth={2.5} strokeLinecap="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                    <p style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                        color: accentColor, textTransform: "uppercase",
                        margin: "0 0 6px",
                    }}>
                        {config.productTitle}
                    </p>
                    <h2 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 22, fontWeight: 400,
                        color: "#1d1816", margin: 0,
                        letterSpacing: "-0.02em", lineHeight: 1.2,
                    }}>
                        Pilih Paketmu
                    </h2>
                    <p style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 12, color: "#8b7e75",
                        margin: "6px 0 0", fontWeight: 400,
                    }}>
                        Berapa kado yang ingin kamu buat?
                    </p>
                </div>

                {/* Options */}
                <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: 10 }}>

                    {/* Option 1: 1 Slot */}
                    <button
                        onClick={() => handleSelect(config.onSelectSingle)}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            width: "100%", padding: "16px 18px",
                            borderRadius: 16,
                            border: "1.5px solid rgba(205,171,143,0.3)",
                            background: "#fff", cursor: "pointer",
                            textAlign: "left", transition: "all 0.2s ease",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = `${accentColor}60`;
                            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                            (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(205,171,143,0.3)";
                            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                            (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                        }}
                    >
                        <div>
                            <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1d1816", margin: "0 0 3px" }}>
                                1 Gift
                            </p>
                            <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#8b7e75", margin: 0, fontWeight: 400 }}>
                                Buat 1 kado untuk 1 penerima
                            </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#382a24", letterSpacing: "-0.02em", fontWeight: 400 }}>
                                Rp 15.000
                            </span>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(205,171,143,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#8b7e75" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>
                    </button>

                    {/* Option 2: 3 Gift */}
                    <button
                        onClick={() => handleSelect(config.onSelectThreeSlot)}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            width: "100%", padding: "16px 18px",
                            borderRadius: 16,
                            border: `1.5px solid ${accentColor}50`,
                            background: `linear-gradient(135deg, ${accentColor}14 0%, ${accentColor}06 100%)`,
                            cursor: "pointer",
                            textAlign: "left", transition: "all 0.2s ease",
                            boxShadow: `0 4px 16px ${accentColor}20`,
                            position: "relative", overflow: "hidden",
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = `${accentColor}80`;
                            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                            (e.currentTarget as HTMLElement).style.boxShadow = `0 10px 28px ${accentColor}30`;
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = `${accentColor}50`;
                            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                            (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${accentColor}20`;
                        }}
                    >
                        <div style={{
                            position: "absolute", top: 10, right: 56,
                            background: accentColor, color: "#fff",
                            fontSize: 8, fontWeight: 800,
                            letterSpacing: "0.1em", textTransform: "uppercase",
                            padding: "2px 7px", borderRadius: 99,
                            fontFamily: "var(--font-sans)",
                        }}>
                            Hemat
                        </div>
                        <div>
                            <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1d1816", margin: "0 0 3px", display: "flex", alignItems: "center", gap: 6 }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={`${accentColor}30`} />
                                </svg>
                                3 Gift
                            </p>
                            <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#6e5c53", margin: 0, fontWeight: 400 }}>
                                1 kode bundle · bisa buat 3 kado
                            </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: accentColor, letterSpacing: "-0.02em", fontWeight: 400 }}>
                                Rp 20.000
                            </span>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${accentColor}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={accentColor} strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>
                    </button>

                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, color: "#a67c52", textAlign: "center", margin: "2px 0 0", opacity: 0.75 }}>
                        Akses dikirim otomatis ke email kamu setelah bayar
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
}
