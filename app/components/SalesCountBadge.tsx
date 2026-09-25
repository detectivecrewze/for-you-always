"use client";

import React from "react";
import { useSalesCount } from "../context/SalesCountsContext";

export default function SalesCountBadge({
    productId,
    color = "#9a7180",
    compact = false,
}: {
    productId?: string;
    color?: string;
    compact?: boolean;
}) {
    const count = useSalesCount(productId);
    if (count === null || count <= 0) return null;

    const label = `${new Intl.NumberFormat("id-ID").format(count)} terjual`;

    return (
        <span
            aria-label={`${label} untuk produk ini`}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: compact ? 4 : 6,
                minHeight: compact ? 20 : 26,
                color,
                fontFamily: "var(--font-sans)",
                fontSize: compact ? 10 : 12,
                fontWeight: 700,
                lineHeight: 1,
                whiteSpace: "nowrap",
            }}
        >
            <svg width={compact ? 12 : 15} height={compact ? 12 : 15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.3l7.8-7.8 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
            </svg>
            <span>{label}</span>
        </span>
    );
}
