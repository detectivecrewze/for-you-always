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
        <div style={{
            background: "#ffffff",
            borderRadius: "1.6rem",
            boxShadow: "0 4px 24px -4px rgba(0,0,0,0.07), 0 0 0 1px rgba(205,171,143,0.1)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            padding: 12,
            display: "flex",
            flexDirection: "column",
        } as React.CSSProperties}
        onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px -8px rgba(0,0,0,0.14), 0 0 0 1px rgba(205,171,143,0.18)";
        }}
        onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px -4px rgba(0,0,0,0.07), 0 0 0 1px rgba(205,171,143,0.1)";
        }}>
            {/* Image Container */}
            <div style={{ position: "relative", overflow: "hidden", borderRadius: "1.2rem", zIndex: 1 }}>
                <img 
                    src={imageSrc} 
                    alt={title} 
                    style={{ width: "100%", height: 260, objectFit: "cover", transition: "transform 0.5s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                />
                
                {/* Top Left Badge */}
                {badgeText && (
                    <span style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.88)",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                        color: badgeColor,
                        fontSize: 9,
                        fontWeight: 800,
                        padding: "4px 12px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        zIndex: 2
                    }}>
                        {badgeText}
                    </span>
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
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 5h5v5"/><path d="M10 14L19 5"/><path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4"/>
                        </svg>
                        Lihat
                    </Link>
                    
                    <button onClick={onOrder} style={{
                        flex: 1, textAlign: "center", padding: "12px 10px", borderRadius: 14,
                        background: titleColor, color: "#faf7f2",
                        fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700,
                        border: "none", cursor: "pointer", transition: "all 0.2s ease",
                        boxShadow: `0 4px 12px ${titleColor}33`,
                        letterSpacing: "0.05em", textTransform: "uppercase",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 16px ${titleColor}4D`;
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px ${titleColor}33`;
                    }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        Order Gift
                    </button>
                </div>
            </div>
        </div>
    );
}
