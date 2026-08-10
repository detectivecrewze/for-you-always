"use client";

import React from "react";

interface DiscountPriceProps {
    oldPrice: string;
    newPrice: string;
    /** Ukuran varian — 'sm' untuk CompactCard, 'md' untuk LandscapeCard, 'lg' untuk SlotPicker */
    size?: "sm" | "md" | "lg";
    /** Orientasi layout — 'stack' (vertikal) atau 'inline' (horizontal) */
    layout?: "stack" | "inline";
}

/**
 * DiscountPrice — komponen reusable premium discount price.
 * Menampilkan harga coret merah elegan + harga aktif bold.
 * Digunakan konsisten di semua surface: catalog, product page, slot picker, cart.
 */
export default function DiscountPrice({
    oldPrice,
    newPrice,
    size = "md",
    layout = "stack",
}: DiscountPriceProps) {
    const fontSizes = {
        sm: { old: 9,  new: 12 },
        md: { old: 11, new: 14 },
        lg: { old: 12, new: 18 },
    };
    const fs = fontSizes[size];

    if (layout === "inline") {
        return (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                {/* Harga coret */}
                <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: fs.old,
                    fontWeight: 600,
                    color: "#b84c3a",
                    textDecoration: "line-through",
                    opacity: 0.85,
                    letterSpacing: "0.01em",
                }}>
                    {oldPrice}
                </span>
                {/* Panah Indikator */}
                <svg width="12" height="10" viewBox="0 0 14 10" fill="none" stroke="#7a5438" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.75 }}>
                    <path d="M1 5h12M9 1l4 4-4 4" />
                </svg>
                {/* Harga aktif */}
                <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: fs.new,
                    fontWeight: 800,
                    color: "#1d1816",
                    letterSpacing: "0.01em",
                }}>
                    {newPrice}
                </span>
            </span>
        );
    }

    // Stack layout (default) — untuk CompactProductCard
    return (
        <span style={{ display: "inline-flex", flexDirection: "column", gap: 2, alignItems: "flex-start" }}>
            {/* Baris atas: harga coret merah */}
            <span style={{
                fontFamily: "var(--font-sans)",
                fontSize: fs.old,
                fontWeight: 600,
                color: "#b84c3a",
                textDecoration: "line-through",
                opacity: 0.8,
                letterSpacing: "0.01em",
                lineHeight: 1.2,
            }}>
                {oldPrice}
            </span>
            {/* Baris bawah: harga aktif */}
            <span style={{
                fontFamily: "var(--font-sans)",
                fontSize: fs.new,
                fontWeight: 800,
                color: "#1d1816",
                letterSpacing: "0.01em",
                lineHeight: 1,
            }}>
                {newPrice}
            </span>
        </span>
    );
}
