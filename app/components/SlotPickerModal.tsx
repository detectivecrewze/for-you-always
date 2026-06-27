"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import posthog from 'posthog-js';

export interface SlotPickerConfig {
    productId: string;
    productTitle: string;
    themeColor: string;
    themeImgSrc?: string;
    // Callbacks
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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        // Trigger enter animation
        const t = setTimeout(() => setVisible(true), 10);
        // Track modal open
        posthog.capture('slot_picker_opened', { product: config.productTitle });
        return () => clearTimeout(t);
    }, []);

    const handleClose = () => {
        setClosing(true);
        posthog.capture('slot_picker_closed_without_buy', { product: config.productTitle });
        setTimeout(() => onClose(), 220);
    };

    const handleSelect = (fn: () => void, slotType: '1_slot' | '3_slot') => {
        posthog.capture('slot_picker_selected', { product: config.productTitle, slot_type: slotType });
        fn();
        setClosing(true);
        setTimeout(() => onClose(), 220);
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
            {/* Modal Panel */}
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
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <div>
                        <p style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: 10, fontWeight: 700,
                            letterSpacing: "0.12em", textTransform: "uppercase",
                            color: accentColor, margin: "0 0 4px",
                        }}>
                            Pilih Paket
                        </p>
                        <h3 style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 22, color: "#1d1816",
                            margin: 0, letterSpacing: "-0.02em", lineHeight: 1.1,
                        }}>
                            {config.productTitle}
                        </h3>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        style={{
                            background: "rgba(255,255,255,0.8)",
                            border: "1px solid rgba(205,171,143,0.25)",
                            borderRadius: "50%",
                            width: 32, height: 32,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", color: "#8b7e75",
                            flexShrink: 0,
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.8)"; }}
                    >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Options */}
                <div style={{ padding: "16px 16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>

                    {/* Option 1: Satuan */}
                    <button
                        onClick={() => handleSelect(config.onSelectSingle, '1_slot')}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            width: "100%", padding: "16px 18px",
                            borderRadius: 16, border: "1.5px solid rgba(205,171,143,0.3)",
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
                            <p style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: 13, fontWeight: 700, color: "#1d1816",
                                margin: "0 0 3px",
                            }}>
                                1 Slot
                            </p>
                            <p style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: 11, color: "#8b7e75",
                                margin: 0, fontWeight: 400,
                            }}>
                                Buat 1 kado untuk 1 penerima
                            </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                            <span style={{
                                fontFamily: "var(--font-display)",
                                fontSize: 18, color: "#382a24",
                                letterSpacing: "-0.02em", fontWeight: 400,
                            }}>
                                Rp 15.000
                            </span>
                            <div style={{
                                width: 28, height: 28, borderRadius: "50%",
                                background: "rgba(205,171,143,0.15)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "background 0.2s ease",
                            }}>
                                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#8b7e75" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>
                    </button>

                    {/* Option 2: 3 Slot — Premium */}
                    <button
                        onClick={() => handleSelect(config.onSelectThreeSlot, '3_slot')}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            width: "100%", padding: "16px 18px",
                            borderRadius: 16,
                            border: `1.5px solid ${accentColor}50`,
                            background: `linear-gradient(135deg, ${accentColor}14 0%, ${accentColor}06 100%)`,
                            cursor: "pointer",
                            textAlign: "left", transition: "all 0.2s ease",
                            boxShadow: `0 4px 16px ${accentColor}20`,
                            position: "relative",
                            overflow: "hidden",
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
                        {/* Recommended badge */}
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
                            <p style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: 13, fontWeight: 700, color: "#1d1816",
                                margin: "0 0 3px", display: "flex", alignItems: "center", gap: 6,
                            }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={`${accentColor}30`} />
                                </svg>
                                3 Slot
                            </p>
                            <p style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: 11, color: "#6e5c53",
                                margin: 0, fontWeight: 400,
                            }}>
                                1 kode bundle · bisa buat 3 kado
                            </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                            <span style={{
                                fontFamily: "var(--font-display)",
                                fontSize: 18, color: accentColor,
                                letterSpacing: "-0.02em", fontWeight: 400,
                            }}>
                                Rp 20.000
                            </span>
                            <div style={{
                                width: 28, height: 28, borderRadius: "50%",
                                background: `${accentColor}22`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={accentColor} strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>
                    </button>

                    {/* Hint */}
                    <p style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 10, color: "#a67c52",
                        textAlign: "center", margin: "2px 0 0",
                        opacity: 0.75,
                    }}>
                        Akses dikirim otomatis ke email kamu setelah bayar
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
}
