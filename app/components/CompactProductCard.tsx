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
    features?: string[];
    occasions?: string[];
    demoLink?: string;
    addonText?: string;
    onOrder?: () => void;
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
    href,
    features,
    occasions,
    demoLink,
    onOrder
}: CompactProductCardProps) {

    const cardBorderGradient = `linear-gradient(135deg, ${titleColor}80, ${titleColor})`;

    return (
        <>
        <style>{`
            .gradient-border-card {
                border: 2px solid transparent !important;
                background-clip: padding-box !important;
                position: relative;
            }
            .gradient-border-card::before {
                content: '';
                position: absolute;
                inset: -2px;
                padding: 2px;
                border-radius: inherit;
                background: var(--card-border-gradient, linear-gradient(135deg, #E8A0B0, #8B6A9A, #C4849A));
                -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                z-index: 0;
                pointer-events: none;
            }
        `}</style>
        <div className="gradient-border-card" style={{
            "--card-border-gradient": cardBorderGradient,
            background: "#ffffff",
            borderRadius: 24,
            boxShadow: "0 8px 24px -8px rgba(0,0,0,0.06)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            padding: 12
        } as React.CSSProperties}
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
                zIndex: 1,
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

                {/* Bottom Left Demo Button */}
                {demoLink && (
                    <a href={demoLink} target="_blank" rel="noopener noreferrer" style={{
                        position: "absolute",
                        bottom: 12,
                        left: 12,
                        background: "rgba(250, 247, 242, 0.85)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        border: "1px solid rgba(56, 42, 36, 0.15)",
                        color: "#382a24",
                        fontSize: 11,
                        fontWeight: 800,
                        padding: "6px 12px",
                        borderRadius: 999,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        letterSpacing: "0.02em",
                        textDecoration: "none",
                        transition: "all 0.2s ease"
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = "rgba(250, 247, 242, 0.95)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = "rgba(250, 247, 242, 0.85)";
                        e.currentTarget.style.transform = "translateY(0)";
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Lihat Demo
                    </a>
                )}
            </div>

            {/* Content Container */}
            <div style={{ padding: "16px 4px 4px 4px", display: "flex", flexDirection: "column", gap: 20, position: "relative", zIndex: 1 }}>
                {/* Title and Prices */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    {/* Left Column */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingRight: 8 }}>
                        <h3 style={{ 
                            fontFamily: "var(--font-sans)", 
                            fontSize: 22, 
                            fontWeight: 800, 
                            color: titleColor,
                            margin: 0,
                            letterSpacing: "-0.02em",
                            lineHeight: 1.1,
                            textShadow: "0 1px 2px rgba(0,0,0,0.05)"
                        }}>
                            {title}
                        </h3>
                        {/* Occasions Tags */}
                        {occasions && occasions.length > 0 && (
                            <div style={{ 
                                display: "flex", flexDirection: "row", flexWrap: "wrap", 
                                alignItems: "center", gap: 4, marginTop: 4, 
                                paddingLeft: 6, borderLeft: `2px solid ${titleColor}40` 
                            }}>
                                <span style={{
                                    fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 600,
                                    color: `${titleColor}99`, letterSpacing: "0.05em",
                                    fontStyle: "italic", marginRight: 2
                                }}>For</span>
                                {occasions.map((occ, i) => (
                                    <span key={i} style={{
                                        fontFamily: "var(--font-sans)", fontSize: 8, fontWeight: 700,
                                        color: titleColor, background: `${titleColor}15`,
                                        padding: "2px 6px", borderRadius: 999,
                                        letterSpacing: "0.03em", textTransform: "uppercase",
                                        whiteSpace: "nowrap", display: "inline-block"
                                    }}>
                                        {occ}
                                    </span>
                                ))}
                            </div>
                        )}
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

                {/* Features List */}
                {features && features.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: -4, marginBottom: 4 }}>
                        {features.map((feature, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={titleColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2, opacity: 0.7 }}>
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span style={{
                                    fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500,
                                    color: "#6e5c53", lineHeight: 1.4
                                }}>
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

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
                    
                    <button onClick={onOrder} style={{
                        flex: 1, textAlign: "center", padding: "12px 10px", borderRadius: 14,
                        background: "#382a24", color: "#faf7f2",
                        fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700,
                        border: "none", cursor: "pointer", transition: "all 0.2s ease",
                        boxShadow: "0 4px 12px rgba(56, 42, 36, 0.2)",
                        letterSpacing: "0.05em", textTransform: "uppercase",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 16px rgba(56, 42, 36, 0.3)";
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(56, 42, 36, 0.2)";
                    }}>
                        Order Gift
                    </button>
                </div>
            </div>
        </div>
        </>
    );
}
