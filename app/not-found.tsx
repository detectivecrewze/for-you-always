import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
    const featuredCollections = [
        {
            title: "Letter Edition",
            category: "Digital Keepsake",
            desc: "Sealed wax envelope with typewriter animation and hidden letters.",
            href: "/catalog/letter",
        },
        {
            title: "Voices Gift",
            category: "Audio Experience",
            desc: "Heartfelt voice recordings paired with cherished memories.",
            href: "/catalog/voices",
        },
        {
            title: "The Gift Box",
            category: "Hybrid Physical Gift",
            desc: "Handcrafted physical gift box paired with scannable QR reveals.",
            href: "/catalog/the-gift-box",
        },
        {
            title: "Memoria Edition",
            category: "Cinematic Canvas",
            desc: "An ultra-premium interactive journey through your love story.",
            href: "/catalog/memoria",
        },
    ];

    return (
        <main style={{
            minHeight: "100vh",
            backgroundColor: "#FAF7F2",
            color: "#1D1816",
            fontFamily: "var(--font-sans, system-ui, -apple-system, sans-serif)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "32px 20px",
            position: "relative",
            overflow: "hidden",
            boxSizing: "border-box",
        }}>
            {/* Ambient Background Glows */}
            <div style={{
                position: "absolute",
                top: "-15%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "600px",
                height: "600px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(250, 247, 242, 0) 70%)",
                pointerEvents: "none",
                zIndex: 0,
            }} />

            {/* Top Navigation Brand Pill */}
            <header style={{
                position: "relative",
                zIndex: 2,
                width: "100%",
                maxWidth: "1100px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <Link
                    href="/"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        textDecoration: "none",
                        color: "#1D1816",
                    }}
                >
                    <div style={{
                        position: "relative",
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        overflow: "hidden",
                        border: "1px solid rgba(205, 171, 143, 0.4)",
                    }}>
                        <Image src="/logo.png" alt="Logo" fill unoptimized style={{ objectFit: "cover" }} sizes="28px" />
                    </div>
                    <span style={{
                        fontFamily: "var(--font-display, serif)",
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                    }}>
                        For you, Always.
                    </span>
                </Link>

                <Link
                    href="/catalog"
                    style={{
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#6E5C53",
                        textDecoration: "none",
                        padding: "8px 16px",
                        borderRadius: "999px",
                        border: "1px solid rgba(205, 171, 143, 0.3)",
                        backgroundColor: "rgba(255, 255, 255, 0.6)",
                        backdropFilter: "blur(10px)",
                        transition: "all 0.2s ease",
                    }}
                >
                    View Catalog
                </Link>
            </header>

            {/* Main Central Error Statement */}
            <section style={{
                position: "relative",
                zIndex: 2,
                maxWidth: "680px",
                textAlign: "center",
                margin: "auto 0",
                padding: "48px 0",
            }}>
                {/* 404 Tag */}
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "5px 14px",
                    borderRadius: "999px",
                    backgroundColor: "rgba(166, 124, 82, 0.08)",
                    border: "1px solid rgba(166, 124, 82, 0.2)",
                    marginBottom: "24px",
                }}>
                    <span style={{
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "#A67C52",
                    }}>
                        404 • Chapter Not Found
                    </span>
                </div>

                {/* Main Heading */}
                <h1 style={{
                    fontFamily: "var(--font-display, serif)",
                    fontSize: "clamp(2.5rem, 6vw, 4rem)",
                    fontWeight: 500,
                    lineHeight: 1.15,
                    color: "#1D1816",
                    margin: "0 0 16px",
                    letterSpacing: "-0.02em",
                }}>
                    A page waiting <br />
                    <em style={{ fontStyle: "italic", fontWeight: 400, color: "#A67C52" }}>to be written.</em>
                </h1>

                {/* Subtext */}
                <p style={{
                    fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)",
                    lineHeight: 1.65,
                    color: "#6E5C53",
                    margin: "0 auto 36px",
                    maxWidth: "520px",
                    fontWeight: 400,
                }}>
                    The path you followed may have moved or no longer exists. 
                    Rest assured, your cherished memories and gifts remain safe in our atelier.
                </p>

                {/* Primary Action Buttons */}
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    marginBottom: "48px",
                }}>
                    <Link
                        href="/"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "14px 28px",
                            borderRadius: "999px",
                            backgroundColor: "#1D1816",
                            color: "#FAF7F2",
                            textDecoration: "none",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            boxShadow: "0 4px 16px rgba(29, 24, 22, 0.12)",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        }}
                    >
                        <span>Return to Atelier</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </Link>

                    <Link
                        href="/catalog"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "14px 24px",
                            borderRadius: "999px",
                            backgroundColor: "#FFFFFF",
                            color: "#1D1816",
                            border: "1px solid #DCD1C6",
                            textDecoration: "none",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            transition: "border-color 0.2s ease, background-color 0.2s ease",
                        }}
                    >
                        Browse All Collections
                    </Link>

                    <Link
                        href="/order-status"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "14px 20px",
                            borderRadius: "999px",
                            backgroundColor: "transparent",
                            color: "#6E5C53",
                            textDecoration: "none",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            letterSpacing: "0.02em",
                        }}
                    >
                        Track Order
                    </Link>
                </div>

                {/* Curated Recommendations Grid */}
                <div style={{
                    textAlign: "left",
                    paddingTop: "32px",
                    borderTop: "1px solid rgba(220, 209, 198, 0.6)",
                }}>
                    <div style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "#8D7971",
                        marginBottom: "16px",
                        textAlign: "center",
                    }}>
                        Explore Signature Editions
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "12px",
                    }}>
                        {featuredCollections.map((col) => (
                            <Link
                                key={col.title}
                                href={col.href}
                                style={{
                                    display: "block",
                                    padding: "18px",
                                    borderRadius: "14px",
                                    backgroundColor: "rgba(255, 255, 255, 0.75)",
                                    border: "1px solid rgba(220, 209, 198, 0.5)",
                                    textDecoration: "none",
                                    color: "inherit",
                                    backdropFilter: "blur(8px)",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                <div style={{
                                    fontSize: "0.68rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: "#A67C52",
                                    marginBottom: "4px",
                                }}>
                                    {col.category}
                                </div>
                                <div style={{
                                    fontFamily: "var(--font-display, serif)",
                                    fontSize: "1.15rem",
                                    fontWeight: 600,
                                    color: "#1D1816",
                                    marginBottom: "4px",
                                }}>
                                    {col.title}
                                </div>
                                <div style={{
                                    fontSize: "0.78rem",
                                    lineHeight: 1.45,
                                    color: "#7A685E",
                                }}>
                                    {col.desc}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer Signature */}
            <footer style={{
                position: "relative",
                zIndex: 2,
                width: "100%",
                maxWidth: "1100px",
                textAlign: "center",
                paddingTop: "20px",
                fontSize: "0.74rem",
                color: "#8D7971",
                letterSpacing: "0.02em",
            }}>
                For you, Always. • Handcrafted Digital & Physical Gifts
            </footer>
        </main>
    );
}
