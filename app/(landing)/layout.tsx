"use client";

import React from "react";
import "./landing.css";

import { usePathname } from "next/navigation";

/* ─── Per-page theme tokens ─────────────────────────────── */
type PageTheme = {
    activeBg: string;
    activeColor: string;
    activeBorder: string;
    ctaBg: string;
    ctaHoverBg: string;
    ctaLink: string;
};

const PAGE_THEMES: Record<string, PageTheme> = {
    "/voices": {
        activeBg: "#3b2f25",
        activeColor: "#f5efe6",
        activeBorder: "rgba(166,124,82,0.3)",
        ctaBg: "#3b2f25",
        ctaHoverBg: "#a67c52",
        ctaLink: "/voices#pesan",
    },
    "/letter": {
        activeBg: "#3b2010",
        activeColor: "#fef8f2",
        activeBorder: "rgba(201,149,108,0.3)",
        ctaBg: "#3b2010",
        ctaHoverBg: "#c9956c",
        ctaLink: "/letter#pesan",
    },
    "/arcade": {
        activeBg: "#1a3a2a",
        activeColor: "#e8f5e0",
        activeBorder: "rgba(74,124,85,0.35)",
        ctaBg: "#1a3a2a",
        ctaHoverBg: "#2d6a4f",
        ctaLink: "/arcade#pesan",
    },
    "/wrapped": {
        activeBg: "#4a044e",
        activeColor: "#fdf5f6",
        activeBorder: "rgba(160,26,88,0.3)",
        ctaBg: "#4a044e",
        ctaHoverBg: "#c9184a",
        ctaLink: "/wrapped#order",
    },
    "/": {
        activeBg: "#3b2f25",
        activeColor: "#f5efe6",
        activeBorder: "rgba(166,124,82,0.3)",
        ctaBg: "#3b2f25",
        ctaHoverBg: "#a67c52",
        ctaLink: "/#collection",
    },
};

function Navbar() {
    const pathname = usePathname();

    // Resolve active theme — fallback to voices/default
    const theme: PageTheme = PAGE_THEMES[pathname] ?? PAGE_THEMES["/"];

    const getLinkStyle = (path: string) => {
        const isActive = pathname === path;
        return {
            className: "landing-nav-link" + (isActive ? " nav-link-active" : ""),
            style: isActive
                ? {
                    background: theme.activeBg,
                    color: theme.activeColor,
                    border: `1px solid ${theme.activeBorder}`,
                }
                : {},
        };
    };

    return (
        <nav className="landing-nav">
            <div className="landing-nav-inner">
                {/* Logo (kiri) */}
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <a href="/" className="landing-nav-logo" style={{ marginRight: 4 }}>
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 12,
                                overflow: "hidden",
                                border: "1px solid var(--border)",
                                flexShrink: 0,
                            }}
                            className="landing-nav-logo-img"
                        >
                            <img
                                src="/logo.png"
                                alt="For you, Always."
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span className="landing-nav-title">
                                For you, Always.
                            </span>
                            <span className="label-text landing-nav-subtitle" style={{ fontSize: 8, margin: 0 }}>
                                Digital Atelier
                            </span>
                        </div>
                    </a>

                    {/* Nav Links — 4 Products (HIDDEN TEMPORARILY) */}
                    <div className="landing-nav-links" style={{ display: "none" }}>
                        <a href="/voices" {...getLinkStyle("/voices")}>Voices</a>
                        <a href="/letter" {...getLinkStyle("/letter")}>Letter</a>
                        <a href="/arcade" {...getLinkStyle("/arcade")}>Arcade</a>
                        <a href="/wrapped" {...getLinkStyle("/wrapped")}>Wrapped</a>
                    </div>
                </div>

                {/* CTA Button (kanan) — theme-aware + compact on mobile */}
                <a
                    href={theme.ctaLink}
                    className="landing-nav-cta"
                    style={{
                        background: theme.ctaBg,
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = theme.ctaHoverBg;
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = theme.ctaBg;
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }}
                >
                    <span className="landing-nav-cta-text">Order</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </a>
            </div>
        </nav>
    );
}

export default function LandingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {/* <Navbar /> */}
            {children}
        </>
    );
}