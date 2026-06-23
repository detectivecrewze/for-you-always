"use client";

import React from "react";
import Link from "next/link";

interface CarouselProductCardProps {
    badgeText?: string;
    badgeColor?: string;
    imageSrc: string;
    title: string;
    titleColor?: string;
    oldPrice?: string;
    newPrice: string;
    description: string; // short 1-2 line desc, no checklist
    occasions?: string[];
    demoLink?: string;
    href: string;
    onAddToCart?: () => void;
    bgAccent?: string; // background color for mockup stage padding
}

export default function CarouselProductCard({
    badgeText,
    badgeColor = "#a88365",
    imageSrc,
    title,
    titleColor = "#382a24",
    oldPrice,
    newPrice,
    description,
    occasions,
    demoLink,
    href,
    onAddToCart,
    bgAccent = "#f4ede4",
}: CarouselProductCardProps) {
    return (
        <div
            style={{
                width: 300,
                flexShrink: 0,
                borderRadius: 24,
                background: "#ffffff",
                boxShadow: "0 8px 32px -8px rgba(0,0,0,0.08), 0 0 0 1px rgba(205,171,143,0.12)",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                userSelect: "none",
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 48px -8px rgba(0,0,0,0.14), 0 0 0 1px rgba(205,171,143,0.2)";
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px -8px rgba(0,0,0,0.08), 0 0 0 1px rgba(205,171,143,0.12)";
            }}
        >
            {/* ── Mockup Stage Image: 4:3 canvas with portrait screenshot centered ── */}
            <div style={{
                position: "relative",
                width: "100%",
                aspectRatio: "4 / 3",
                background: bgAccent,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                {/* Decorative background blobs */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(ellipse at 30% 60%, ${titleColor}18 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, ${titleColor}10 0%, transparent 50%)`,
                    pointerEvents: "none",
                }} />

                {/* Portrait image displayed as a "floating phone mockup" */}
                <div style={{
                    position: "relative",
                    height: "88%",
                    aspectRatio: "9 / 16",
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: `0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)`,
                    border: "2px solid rgba(255,255,255,0.6)",
                }}>
                    <img
                        src={imageSrc}
                        alt={title}
                        draggable={false}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                            pointerEvents: "none",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    />
                </div>

                {/* Badge — top left */}
                {badgeText && (
                    <div style={{
                        position: "absolute", top: 12, left: 12,
                        background: badgeColor, color: "#fff",
                        fontSize: 9, fontWeight: 800,
                        padding: "4px 10px", borderRadius: 999,
                        letterSpacing: "0.06em", textTransform: "uppercase",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
                        display: "flex", alignItems: "center", gap: 4,
                    }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        {badgeText}
                    </div>
                )}

                {/* Demo button — bottom left */}
                {demoLink && (
                    <a
                        href={demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{
                            position: "absolute", bottom: 12, left: 12,
                            background: "rgba(250,247,242,0.88)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                            border: "1px solid rgba(56,42,36,0.12)",
                            color: "#382a24",
                            fontSize: 10, fontWeight: 800,
                            padding: "5px 11px", borderRadius: 999,
                            display: "flex", alignItems: "center", gap: 5,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            letterSpacing: "0.02em",
                            textDecoration: "none",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "rgba(250,247,242,0.98)";
                            e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "rgba(250,247,242,0.88)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                        Lihat Demo
                    </a>
                )}

                {/* Price badge — bottom right */}
                <div style={{
                    position: "absolute", bottom: 12, right: 12,
                    background: "#faf7f2",
                    border: "1px solid rgba(205,171,143,0.25)",
                    borderRadius: 999,
                    padding: "5px 11px",
                    display: "flex", alignItems: "center", gap: 5,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}>
                    {oldPrice && (
                        <span style={{
                            fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 600,
                            color: "#aaa", textDecoration: "line-through", letterSpacing: "0.03em",
                        }}>{oldPrice}</span>
                    )}
                    <span style={{
                        fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 800,
                        color: "#382a24", letterSpacing: "0.03em",
                    }}>{newPrice}</span>
                </div>
            </div>

            {/* ── Card Content ── */}
            <div style={{ padding: "18px 18px 18px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Title + Occasions */}
                <div>
                    <h3 style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 20, fontWeight: 800,
                        color: titleColor, margin: "0 0 6px 0",
                        letterSpacing: "-0.02em", lineHeight: 1.15,
                    }}>
                        {title}
                    </h3>

                    {/* Occasions tags — compact */}
                    {occasions && occasions.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                            <span style={{
                                fontFamily: "var(--font-sans)", fontSize: 8, fontWeight: 600,
                                color: `${titleColor}80`, fontStyle: "italic", marginRight: 2,
                            }}>For</span>
                            {occasions.map((occ, i) => (
                                <span key={i} style={{
                                    fontFamily: "var(--font-sans)", fontSize: 8, fontWeight: 700,
                                    color: titleColor, background: `${titleColor}15`,
                                    padding: "2px 6px", borderRadius: 999,
                                    letterSpacing: "0.04em", textTransform: "uppercase",
                                }}>
                                    {occ}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Short description — progressive disclosure */}
                <p style={{
                    fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400,
                    color: "#6e5c53", lineHeight: 1.6, margin: 0,
                }}>
                    {description}
                </p>

                {/* CTA Buttons */}
                <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                    <Link href={href} style={{
                        flex: 1, textAlign: "center", padding: "11px 8px",
                        borderRadius: 14,
                        background: "#faf7f2", color: "#382a24",
                        fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
                        textDecoration: "none", transition: "all 0.2s ease",
                        border: "1px solid rgba(205,171,143,0.2)",
                        letterSpacing: "0.05em", textTransform: "uppercase",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#f0eae1"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#faf7f2"; }}
                    >
                        Lihat
                    </Link>
                    <button onClick={onAddToCart} style={{
                        flex: 2, padding: "11px 8px", borderRadius: 14,
                        background: titleColor, color: "#faf7f2",
                        fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
                        border: "none", cursor: "pointer", transition: "all 0.2s ease",
                        boxShadow: `0 4px 12px ${titleColor}33`,
                        letterSpacing: "0.05em", textTransform: "uppercase",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${titleColor}4D`;
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px ${titleColor}33`;
                    }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        Masuk Keranjang
                    </button>
                </div>
            </div>
        </div>
    );
}
