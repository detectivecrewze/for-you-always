"use client";

import React from "react";
import Link from "next/link";

interface CompactProductCardProps {
    badgeText?: string;
    badgeColor?: string; // e.g. "#a88365"
    imageSrc: string;
    title: string;
    titleColor?: string;
    oldPrice?: string;
    newPrice: string;
    hashtag?: string;
    soldCount?: string;
    href: string;
}

export default function CompactProductCard({
    badgeText,
    badgeColor = "#a88365",
    imageSrc,
    title,
    titleColor = "#382a24",
    oldPrice,
    newPrice,
    hashtag,
    soldCount,
    href
}: CompactProductCardProps) {
    const waText = `Halo Digital Atelier! Saya tertarik untuk memesan *${title}* seharga ${newPrice}.\n\nMohon info langkah selanjutnya ya. Terima kasih!`;
    const waLink = `https://wa.me/6281936109076?text=${encodeURIComponent(waText)}`;

    return (
        <div style={{
            background: "#ffffff",
            borderRadius: 24,
            overflow: "hidden",
            border: "1px solid rgba(205,171,143,0.15)",
            boxShadow: "0 8px 24px -8px rgba(0,0,0,0.06)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            padding: 12
        }}
        onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px -8px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px -8px rgba(0,0,0,0.06)";
        }}>
            {/* Image Container */}
            <div style={{
                position: "relative",
                width: "100%",
                aspectRatio: "9/16",
                borderRadius: 16,
                overflow: "hidden",
                background: "#f4f4f4"
            }}>
                <img 
                    src={imageSrc} 
                    alt={title} 
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                />
                
                {/* Top Left Badge */}
                {badgeText && (
                    <div style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        background: badgeColor,
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: 999,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase"
                    }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        {badgeText}
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div style={{ padding: "16px 4px 4px 4px", display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Title and Prices */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    {/* Left Column */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingRight: 8 }}>
                        <h3 style={{ 
                            fontFamily: "var(--font-display)", 
                            fontSize: 18, 
                            fontWeight: 800, 
                            color: titleColor,
                            margin: 0,
                            letterSpacing: "0.02em",
                            lineHeight: 1.2
                        }}>
                            {title}
                        </h3>
                    </div>

                    {/* Right Column */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1.2 }}>
                            <div style={{
                                padding: "6px 12px", borderRadius: 999,
                                background: "#faf7f2", color: "#382a24",
                                fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700,
                                letterSpacing: "0.05em", textTransform: "uppercase",
                                display: "flex", alignItems: "center", gap: 6,
                                border: "1px solid rgba(205,171,143,0.2)"
                            }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                    <line x1="7" y1="7" x2="7.01" y2="7" />
                                </svg>
                                {newPrice}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons Container */}
                <div style={{ display: "flex", gap: 8 }}>
                    <Link href={href} style={{
                        flex: 1, textAlign: "center", padding: "12px 10px", borderRadius: 14,
                        background: "#faf7f2", color: "#382a24",
                        fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700,
                        textDecoration: "none", transition: "all 0.2s ease",
                        border: "1px solid rgba(205,171,143,0.2)",
                        letterSpacing: "0.05em", textTransform: "uppercase",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = "#f0eae1";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = "#faf7f2";
                    }}>
                        Lihat
                    </Link>
                    
                    <a href={waLink} target="_blank" rel="noopener noreferrer" style={{
                        flex: 1, textAlign: "center", padding: "12px 10px", borderRadius: 14,
                        background: "#382a24", color: "#faf7f2",
                        fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700,
                        textDecoration: "none", transition: "all 0.2s ease",
                        boxShadow: "0 4px 12px rgba(56, 42, 36, 0.2)",
                        letterSpacing: "0.05em", textTransform: "uppercase",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(56, 42, 36, 0.3)";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(56, 42, 36, 0.2)";
                    }}>
                        Order Gift
                    </a>
                </div>
            </div>
        </div>
    );
}
