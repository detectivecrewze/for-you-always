"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Atelier application error:", error);
    }, [error]);

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
            {/* Ambient Background Glow */}
            <div style={{
                position: "absolute",
                top: "-15%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "600px",
                height: "600px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(205, 171, 143, 0.12) 0%, rgba(250, 247, 242, 0) 70%)",
                pointerEvents: "none",
                zIndex: 0,
            }} />

            {/* Top Brand Header */}
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
                    }}
                >
                    Catalog
                </Link>
            </header>

            {/* Central Error Box */}
            <section style={{
                position: "relative",
                zIndex: 2,
                maxWidth: "580px",
                textAlign: "center",
                margin: "auto 0",
                padding: "36px 0",
            }}>
                {/* Status Badge */}
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
                        Atelier Notice • Unexpected Event
                    </span>
                </div>

                {/* Main Heading */}
                <h1 style={{
                    fontFamily: "var(--font-display, serif)",
                    fontSize: "clamp(2.4rem, 5vw, 3.4rem)",
                    fontWeight: 500,
                    lineHeight: 1.2,
                    color: "#1D1816",
                    margin: "0 0 16px",
                    letterSpacing: "-0.02em",
                }}>
                    A brief pause in <br />
                    <em style={{ fontStyle: "italic", fontWeight: 400, color: "#A67C52" }}>our atelier.</em>
                </h1>

                {/* Description */}
                <p style={{
                    fontSize: "0.98rem",
                    lineHeight: 1.65,
                    color: "#6E5C53",
                    margin: "0 auto 36px",
                    maxWidth: "480px",
                }}>
                    An unexpected error occurred while preparing this experience.
                    Please try reloading the page, or connect with our atelier concierge.
                </p>

                {/* Action Buttons */}
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                }}>
                    <button
                        onClick={() => reset()}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "14px 28px",
                            borderRadius: "999px",
                            backgroundColor: "#1D1816",
                            color: "#FAF7F2",
                            border: "none",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            cursor: "pointer",
                            boxShadow: "0 4px 16px rgba(29, 24, 22, 0.12)",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <span>Try Again</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                        </svg>
                    </button>

                    <Link
                        href="/"
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
                        }}
                    >
                        Return Home
                    </Link>

                    <a
                        href="https://wa.me/6281381543981?text=Hi%20For%20you,%20Always.%20I%20encountered%20an%20error%20on%20the%20website"
                        target="_blank"
                        rel="noopener noreferrer"
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
                        }}
                    >
                        Contact Concierge
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                position: "relative",
                zIndex: 2,
                width: "100%",
                maxWidth: "1100px",
                textAlign: "center",
                fontSize: "0.74rem",
                color: "#8D7971",
                letterSpacing: "0.02em",
            }}>
                For you, Always. • Handcrafted Digital & Physical Gifts
            </footer>
        </main>
    );
}
