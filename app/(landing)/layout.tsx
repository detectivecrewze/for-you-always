"use client";

import React from "react";
import { usePathname } from "next/navigation";
import "./landing.css";

function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { label: "Voices", href: "/" },
        { label: "Arcade", href: "/arcade" },
    ];

    return (
        <nav className="landing-nav">
            <div className="landing-nav-inner">
                {/* Logo + Nav Links (kiri) */}
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <a href="/" className="landing-nav-logo" style={{ marginRight: 4 }}>
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 14,
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

                    {/* Nav Links — hidden on mobile */}
                    <div
                        className="landing-nav-links"
                        style={{ display: "flex" }}
                    >
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className={`landing-nav-link ${isActive ? "active" : ""}`}
                                    style={{
                                        // Hide on small screens via inline media — handled by CSS below
                                    }}
                                >
                                    {link.label}
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* Order Button (kanan) */}
                <a
                    href="#pesan"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "9px 20px",
                        background: "var(--bg-deep)",
                        color: "var(--text-light)",
                        borderRadius: 999,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "var(--accent)";
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "var(--bg-deep)";
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }}
                >
                    Order
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
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
            <Navbar />
            {children}
        </>
    );
}