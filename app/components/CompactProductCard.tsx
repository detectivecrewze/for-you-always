import React from "react";
import Link from "next/link";

interface CompactProductCardProps {
    badgeText?: string;
    badgeColor?: string; // e.g. "#e91e63"
    imageSrc: string;
    title: string;
    oldPrice?: string;
    newPrice: string;
    hashtag: string;
    soldCount: string;
    href: string;
}

export default function CompactProductCard({
    badgeText,
    badgeColor = "#e91e63",
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
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                        }}>
                            <span>★</span> {badgeText}
                        </div>
                    )}
                </div>

                {/* Content Container */}
                <div style={{ padding: "16px 4px 4px 4px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    {/* Left Column */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <h3 style={{ 
                            fontFamily: "var(--font-sans)", 
                            fontSize: 16, 
                            fontWeight: 700, 
                            color: "#382a24",
                            margin: 0
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
                                    color: "#9da3a8", 
                                    textDecoration: "line-through",
                                    fontWeight: 500
                                }}>
                                    {oldPrice}
                                </span>
                            )}
                            <span style={{ 
                                fontFamily: "var(--font-sans)", 
                                fontSize: 16, 
                                fontWeight: 800, 
                                color: "#e91e63"
                            }}>
                                {newPrice}
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </Link>
    );
}
