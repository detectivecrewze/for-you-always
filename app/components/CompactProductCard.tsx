import React from "react";
import Link from "next/link";

interface CompactProductCardProps {
    badgeText?: string;
    badgeColor?: string; // e.g. "#e91e63"
    imageSrc: string;
    title: string;
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
    oldPrice,
    newPrice,
    hashtag,
    soldCount,
    href
}: CompactProductCardProps) {
    return (
        <Link href={href} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
            <div style={{
                background: "#ffffff",
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(205,171,143,0.15)",
                boxShadow: "0 8px 24px -8px rgba(0,0,0,0.06)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
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
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
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
                <div style={{ padding: "16px 4px 4px 4px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    {/* Left Column */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <h3 style={{ 
                            fontFamily: "var(--font-display)", 
                            fontSize: 18, 
                            fontWeight: 500, 
                            color: "#382a24",
                            margin: 0,
                            letterSpacing: "0.02em"
                        }}>
                            {title}
                        </h3>

                    </div>

                    {/* Right Column */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1.2 }}>
                            {oldPrice && (
                                <span style={{ 
                                    fontFamily: "var(--font-sans)", 
                                    fontSize: 10, 
                                    color: "#a6968c", 
                                    textDecoration: "line-through",
                                    fontWeight: 500
                                }}>
                                    {oldPrice}
                                </span>
                            )}
                            <div style={{
                                padding: "6px 12px", borderRadius: 999,
                                background: "#faf7f2", color: "#382a24",
                                fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700,
                                letterSpacing: "0.05em", textTransform: "uppercase",
                                display: "flex", alignItems: "center", gap: 6,
                                border: "1px solid rgba(205,171,143,0.2)",
                                marginTop: oldPrice ? 4 : 0
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
            </div>
        </Link>
    );
}
