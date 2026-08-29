"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import DiscountPrice from "./DiscountPrice";

interface CompactProductCardProps {
    badgeText?: string;
    badgeColor?: string; // e.g. "#a88365"
    slotBadgeText?: string;
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
    onAddToCart?: () => void;
    priority?: boolean;
}

export default function CompactProductCard({
    badgeText,
    badgeColor = "#a88365",
    slotBadgeText,
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
    onAddToCart,
    priority = false,
}: CompactProductCardProps) {

    const cardBorderGradient = `linear-gradient(135deg, ${titleColor}80, ${titleColor})`;

    const handleCardMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px -8px rgba(0,0,0,0.14), 0 0 0 1px rgba(205,171,143,0.18)";
    }, []);

    const handleCardMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px -4px rgba(0,0,0,0.07), 0 0 0 1px rgba(205,171,143,0.1)";
    }, []);

    const handleImageMouseEnter = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
    }, []);

    const handleImageMouseLeave = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
    }, []);

    const handleDemoMouseEnter = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(250, 247, 242, 0.95)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
    }, []);

    const handleDemoMouseLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(250, 247, 242, 0.85)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
    }, []);

    const handleLihatMouseEnter = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        (e.currentTarget as HTMLElement).style.background = "#f0eae1";
    }, []);

    const handleLihatMouseLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        (e.currentTarget as HTMLElement).style.background = "#faf7f2";
    }, []);

    const handlePesanMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 16px ${titleColor}4D`;
    }, [titleColor]);

    const handlePesanMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px ${titleColor}33`;
    }, [titleColor]);

    const [isNavigating, setIsNavigating] = useState(false);

    return (
        <div style={{
            background: "#ffffff",
            borderRadius: "1.6rem",
            boxShadow: "0 4px 24px -4px rgba(0,0,0,0.07), 0 0 0 1px rgba(205,171,143,0.1)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            padding: 12,
            display: "flex",
            flexDirection: "column",
            height: "100%",
        } as React.CSSProperties}
        onMouseEnter={handleCardMouseEnter}
        onMouseLeave={handleCardMouseLeave}>
            {/* Image Container */}
            <div style={{ position: "relative", height: 260, overflow: "hidden", borderRadius: "1.2rem", zIndex: 1, backgroundColor: "#1d1816" }}>
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) calc(100vw - 32px), 360px"
                    priority={priority}
                    loading={priority ? undefined : "lazy"}
                    style={{ 
                        objectFit: "cover", 
                        transition: "transform 0.5s ease",
                        filter: badgeText === "UPCOMING" ? "blur(14px) contrast(1.05) brightness(0.9)" : "none",
                        transform: badgeText === "UPCOMING" ? "scale(1.06)" : "scale(1)"
                    }}
                    onMouseEnter={handleImageMouseEnter}
                    onMouseLeave={handleImageMouseLeave}
                />
                
                {/* Central Lock Badge for UPCOMING items */}
                {badgeText === "UPCOMING" && (
                    <div style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "rgba(29,24,22,0.88)",
                        border: "1px solid rgba(205,171,143,0.4)",
                        color: "#cdab8f",
                        padding: "6px 14px",
                        borderRadius: 999,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        zIndex: 5,
                        whiteSpace: "nowrap",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
                    }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <rect x="4" y="10" width="16" height="10" rx="2" />
                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                        </svg>
                        <span>REVEALING SOON</span>
                    </div>
                )}
                
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

                {/* Top Right Slot / Scarcity Badge */}
                {slotBadgeText && (
                    <span style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        borderRadius: 999,
                        background: "rgba(29, 24, 22, 0.82)",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                        border: "1px solid rgba(205, 171, 143, 0.35)",
                        color: "#ffffff",
                        fontSize: 9,
                        fontWeight: 700,
                        padding: "4px 10px",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        zIndex: 2,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                    }}>
                        <span style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            backgroundColor: "#2e7d32",
                            display: "inline-block"
                        }} />
                        <span>{slotBadgeText}</span>
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
                    onMouseEnter={handleDemoMouseEnter}
                    onMouseLeave={handleDemoMouseLeave}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Lihat Demo
                    </a>
                )}
            </div>

            {/* Content Container */}
            <div style={{ padding: "16px 4px 4px 4px", display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, gap: 20, position: "relative", zIndex: 1 }}>
                {/* Title and Prices */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    {/* Left Column */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingRight: 8, flex: 1 }}>
                        <h3 style={{ 
                            fontFamily: "var(--font-sans)", 
                            fontSize: title.length > 15 ? 20 : 22, 
                            fontWeight: 800, 
                            color: titleColor,
                            margin: 0,
                            letterSpacing: "-0.02em",
                            lineHeight: 1.1,
                            textShadow: "0 1px 2px rgba(0,0,0,0.05)"
                        }}>
                            {title.includes(' (') ? (
                                <>
                                    {title.split(' (')[0]} <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.8 }}>({title.split(' (')[1]}</span>
                                </>
                            ) : title}
                        </h3>
                        
                        {/* Occasions Tags */}
                        {occasions && occasions.length > 0 && (
                            <div style={{ 
                                display: "flex", flexDirection: "row", flexWrap: "wrap", 
                                alignItems: "center", gap: "4px 6px", marginTop: 4
                            }}>
                                <span style={{
                                    fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 500,
                                    color: "#a6968c", letterSpacing: "0.02em",
                                    fontStyle: "italic", marginRight: 2
                                }}>For</span>
                                {occasions.map((occ, i) => (
                                    <span key={i} style={{
                                        fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 700,
                                        color: titleColor, background: `${titleColor}10`,
                                        padding: "3px 8px", borderRadius: 6,
                                        letterSpacing: "0.05em", textTransform: "uppercase",
                                        whiteSpace: "nowrap", display: "inline-block"
                                    }}>
                                        {occ}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column (Price) */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
                        {oldPrice ? (
                            /* Discount price — premium design */
                            <div style={{
                                padding: "6px 10px", borderRadius: 10,
                                background: "#faf7f2",
                                border: "1px solid rgba(192,57,43,0.18)",
                                boxShadow: "0 2px 8px -2px rgba(0,0,0,0.05)",
                                display: "flex", alignItems: "center", gap: 5,
                            }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7, flexShrink: 0 }}>
                                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                    <line x1="7" y1="7" x2="7.01" y2="7" />
                                </svg>
                                <DiscountPrice oldPrice={oldPrice} newPrice={newPrice} size="sm" />
                            </div>
                        ) : (
                            /* Regular price — no discount */
                            <div style={{
                                padding: "6px 10px", borderRadius: 8,
                                background: "#faf7f2", color: "#1d1816",
                                fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 800,
                                letterSpacing: "0.02em",
                                display: "flex", alignItems: "center", gap: 6,
                                border: "1px solid rgba(205,171,143,0.3)",
                                boxShadow: "0 2px 8px -2px rgba(0,0,0,0.05)"
                            }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cdab8f" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                    <line x1="7" y1="7" x2="7.01" y2="7" />
                                </svg>
                                <span>
                                    {newPrice.includes('Rp') ? (
                                        <>
                                            <span style={{ fontSize: 10, fontWeight: 600, color: "#8b7e75", marginRight: 2 }}>Rp</span>
                                            {newPrice.replace('Rp ', '')}
                                        </>
                                    ) : (
                                        newPrice
                                    )}
                                </span>
                            </div>
                        )}
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
                    <Link 
                        href={href} 
                        prefetch={true}
                        onClick={() => setIsNavigating(true)}
                        style={{
                            flex: 1, textAlign: "center", padding: "12px 10px", borderRadius: 14,
                            background: onAddToCart ? "#faf7f2" : titleColor,
                            color: onAddToCart ? "#382a24" : "#faf7f2",
                            fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700,
                            textDecoration: "none", transition: "all 0.2s ease",
                            border: onAddToCart ? "1px solid rgba(205,171,143,0.2)" : "none",
                            boxShadow: onAddToCart ? "none" : `0 4px 12px ${titleColor}33`,
                            letterSpacing: "0.05em", textTransform: "uppercase",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            touchAction: "manipulation",
                            opacity: isNavigating ? 0.8 : 1
                        }}
                        onMouseEnter={onAddToCart ? handleLihatMouseEnter : undefined}
                        onMouseLeave={onAddToCart ? handleLihatMouseLeave : undefined}
                    >
                        {isNavigating ? (
                            <>
                                <style>{`
                                    @keyframes gold-spin {
                                        0% { transform: rotate(0deg); }
                                        100% { transform: rotate(360deg); }
                                    }
                                `}</style>
                                <span style={{
                                    display: "inline-block",
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    border: "2px solid rgba(166,124,82,0.3)",
                                    borderTopColor: "#a67c52",
                                    animation: "gold-spin 0.75s linear infinite"
                                }} />
                                Memuat...
                            </>
                        ) : (
                            <>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 5h5v5"/><path d="M10 14L19 5"/><path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4"/>
                                </svg>
                                Lihat
                            </>
                        )}
                    </Link>
                    
                    {onAddToCart && (
                        <button onClick={onAddToCart} style={{
                            flex: 1, textAlign: "center", padding: "12px 10px", borderRadius: 14,
                            background: titleColor, color: "#faf7f2",
                            fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700,
                            border: "none", cursor: "pointer", transition: "all 0.2s ease",
                            boxShadow: `0 4px 12px ${titleColor}33`,
                            letterSpacing: "0.05em", textTransform: "uppercase",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                        }}
                        onMouseEnter={handlePesanMouseEnter}
                        onMouseLeave={handlePesanMouseLeave}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            Pesan
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
