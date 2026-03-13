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
                {/* Logo */}
                <a href="/" className="landing-nav-logo">
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 14,
                            overflow: "hidden",
                            border: "1px solid var(--border)",
                        }}
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
                        <span className="label-text" style={{ fontSize: 8, margin: 0 }}>
                            Digital Atelier
                        </span>
                    </div>
                </a>

                {/* Nav Links */}
                <div className="landing-nav-links">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`landing-nav-link ${isActive ? 'active' : ''}`}
                            >
                                {link.label}
                            </a>
                        );
                    })}
                </div>
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
