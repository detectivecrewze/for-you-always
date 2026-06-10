"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import CompactProductCard from "../components/CompactProductCard";
import { LandscapeProductCard, AnimatedSection } from "../components/LandscapeProductCard";

/* ─────────────────────────────────────────────
   Navbar
   ───────────────────────────────────────────── */
function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const links = [
        { label: "Home", href: "/" },
        { label: "Catalog", href: "/catalog" },
        { label: "Cara Kerja", href: "#cara-kerja" },
        { label: "Testimoni", href: "#testimoni" },
    ];

    const mobileLinks = [
        { label: "Catalog", href: "/catalog" },
        { label: "Cara Kerja", href: "#cara-kerja" },
        { label: "Testimoni", href: "#testimoni" },
        { label: "FAQ", href: "#faq" },
    ];

    return (
        <>
            {/* ── Wrapper: full width container, centers the pill ── */}
            <div style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 10000,
                display: "flex", justifyContent: "center",
                padding: scrolled ? "10px 20px 0" : "16px 20px 0",
                transition: "padding 0.4s ease",
                pointerEvents: "none",
                background: "transparent",
            }}>
                <nav style={{
                    pointerEvents: "auto",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%",
                    maxWidth: 1100,
                    height: 52,
                    padding: "0 16px 0 16px",
                    background: "rgba(250,247,242,0.96)",
                    backdropFilter: "blur(24px) saturate(180%)",
                    WebkitBackdropFilter: "blur(24px) saturate(180%)",
                    border: "1px solid rgba(205,171,143,0.25)",
                    borderRadius: 999,
                    boxShadow: scrolled
                        ? "0 8px 32px -8px rgba(29,24,22,0.14), 0 2px 8px -2px rgba(29,24,22,0.06)"
                        : "0 4px 16px -4px rgba(29,24,22,0.08)",
                    transition: "all 0.4s ease",
                }}>
                    {/* Logo */}
                    <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0, position: "relative", zIndex: 10 }}>
                        <div style={{ width: 26, height: 26, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(205,171,143,0.3)" }}>
                            <img src="/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "#382a24", letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
                            For you, Always.
                        </span>
                    </a>

                    {/* Desktop links — center */}
                    <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="nav-desktop-links">
                        {links.map(l => (
                            <a key={l.href} href={l.href} style={{
                                fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700,
                                letterSpacing: "0.1em", textTransform: "uppercase",
                                color: "#6e5c53", textDecoration: "none",
                                transition: "color 0.2s ease",
                            }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#a67c52"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#6e5c53"; }}
                            >
                                {l.label}
                            </a>
                        ))}
                    </div>

                    {/* Mobile quick links — center */}
                    <div style={{ alignItems: "center", gap: 16 }} className="nav-mobile-quicklinks">
                        <Link href="/" style={{
                            fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700,
                            letterSpacing: "0.1em", textTransform: "uppercase",
                            color: "#a67c52", textDecoration: "none",
                        }}>HOME</Link>
                        <Link href="/catalog" style={{
                            fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700,
                            letterSpacing: "0.1em", textTransform: "uppercase",
                            color: "#6e5c53", textDecoration: "none",
                        }}>CATALOG</Link>
                    </div>

                    {/* CTA + Hamburger */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <a href="https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20ingin%20order." target="_blank" rel="noopener noreferrer"
                            style={{
                                padding: "7px 18px", borderRadius: 999,
                                background: "#1d1816", color: "#faf7f2",
                                fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                                textDecoration: "none", transition: "all 0.3s ease", whiteSpace: "nowrap",
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#a67c52"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#1d1816"; }}
                            className="nav-cta"
                        >
                            Order
                        </a>
                        {/* Hamburger */}
                        <button
                            onClick={() => setMobileOpen(v => !v)}
                            className="nav-hamburger"
                            style={{
                                background: "rgba(205,171,143,0.12)", border: "1px solid rgba(205,171,143,0.25)",
                                borderRadius: 999, cursor: "pointer",
                                width: 34, height: 34,
                                display: "flex", flexDirection: "column", gap: 4, alignItems: "center", justifyContent: "center",
                                transition: "background 0.2s ease",
                            }}
                            aria-label="Toggle menu"
                        >
                            <span style={{ display: "block", width: 16, height: 1.5, background: "#382a24", transition: "all 0.3s ease", transform: mobileOpen ? "translateY(5.5px) rotate(45deg)" : "none" }} />
                            <span style={{ display: "block", width: 16, height: 1.5, background: "#382a24", transition: "all 0.3s ease", opacity: mobileOpen ? 0 : 1 }} />
                            <span style={{ display: "block", width: 16, height: 1.5, background: "#382a24", transition: "all 0.3s ease", transform: mobileOpen ? "translateY(-5.5px) rotate(-45deg)" : "none" }} />
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile dropdown menu */}
            <div style={{
                position: "fixed", top: scrolled ? 74 : 80, left: 20, right: 20, zIndex: 998,
                background: "rgba(250,247,242,0.98)", backdropFilter: "blur(24px)",
                border: mobileOpen ? "1px solid rgba(205,171,143,0.25)" : "none",
                opacity: mobileOpen ? 1 : 0,
                borderRadius: 20,
                padding: mobileOpen ? "20px 24px 24px" : "0 24px",
                maxHeight: mobileOpen ? 400 : 0,
                overflow: "hidden",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: mobileOpen ? "0 12px 40px -8px rgba(29,24,22,0.16)" : "none",
                pointerEvents: mobileOpen ? "auto" : "none",
            }} className="nav-mobile-dropdown">
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {mobileLinks.map(l => (
                        <a key={l.href} href={l.href}
                            onClick={() => setMobileOpen(false)}
                            style={{
                                fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700,
                                letterSpacing: "0.08em", textTransform: "uppercase",
                                color: "#382a24", textDecoration: "none",
                                padding: "13px 0",
                                borderBottom: "1px solid rgba(205,171,143,0.12)",
                                transition: "color 0.2s ease",
                            }}
                        >
                            {l.label}
                        </a>
                    ))}
                    <a href="https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20ingin%20order." target="_blank" rel="noopener noreferrer"
                        onClick={() => setMobileOpen(false)}
                        style={{
                            marginTop: 16, display: "inline-flex", alignItems: "center", justifyContent: "center",
                            padding: "12px 28px", borderRadius: 999,
                            background: "#1d1816", color: "#faf7f2",
                            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                            textDecoration: "none",
                        }}
                    >
                        Order via WhatsApp
                    </a>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .nav-desktop-links { display: none !important; }
                    .nav-cta { display: none !important; }
                    .nav-hamburger { display: flex !important; }
                    .nav-mobile-quicklinks { display: flex !important; }
                }
                @media (min-width: 769px) {
                    .nav-hamburger { display: none !important; }
                    .nav-mobile-dropdown { display: none !important; }
                    .nav-mobile-quicklinks { display: none !important; }
                }
            `}</style>
        </>
    );
}


export default function MainHubPage() {
    return (
        <div style={{ minHeight: "100vh", background: "#faf7f2", overflowX: "clip" }}>

            <style>{`
                @keyframes bounce-soft {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(8px); }
                }
                @keyframes pulse-dot {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.15); }
                }
                @keyframes toggle-slide {
                    0%, 20% { transform: translateX(0); }
                    40%, 80% { transform: translateX(14px); }
                    100% { transform: translateX(0); }
                }
                @keyframes toggle-bg {
                    0%, 20% { background: rgba(0,0,0,0.1); }
                    40%, 80% { background: var(--accent-color); }
                    100% { background: rgba(0,0,0,0.1); }
                }
                @keyframes eq-bar {
                    0%, 100% { height: 4px; }
                    50% { height: 12px; }
                }
                @keyframes page-indicator {
                    0%, 100% { transform: scale(1); opacity: 0.3; }
                    33% { transform: scale(1.3); opacity: 1; }
                }
                @keyframes voice-pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.4); opacity: 0; }
                    100% { transform: scale(1); opacity: 0; }
                }
                @keyframes photo-shuffle {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-3px) rotate(-2deg); }
                    75% { transform: translateY(3px) rotate(2deg); }
                }
                @keyframes image-fade-in {
                    from { opacity: 0; filter: blur(4px); }
                    to { opacity: 1; filter: blur(0); }
                }
                @keyframes typewriter-blink {
                    0%, 100% { border-color: transparent; }
                    50% { border-color: inherit; }
                }
                @keyframes typewriter-text {
                    0%, 15% { width: 0; }
                    40%, 65% { width: 17ch; }
                    85%, 100% { width: 0; }
                }
                @keyframes envelope-bob {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
            `}</style>

            {/* Ambient Blobs — Frosted Champagne */}
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-10%", left: "-5%", width: "50vw", height: "50vw", borderRadius: "50%", background: "rgba(205,171,143,0.06)", filter: "blur(120px)" }} />
                <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50vw", height: "50vw", borderRadius: "50%", background: "rgba(205,171,143,0.04)", filter: "blur(120px)" }} />
            </div>

            <Navbar />

            {/* ── HERO ── */}
            <section id="hero" style={{ position: "relative", zIndex: 1, paddingTop: "clamp(80px, 12vh, 120px)", paddingBottom: "clamp(80px, 12vh, 130px)", textAlign: "center" }}>
                <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>

                    <AnimatedSection>
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            padding: "6px 16px",
                            background: "rgba(205,171,143,0.08)",
                            border: "1.2px solid rgba(205,171,143,0.2)",
                            borderRadius: 999, marginBottom: 36,
                        }}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#cdab8f", animation: "pulse-dot 2s infinite", display: "inline-block" }} />
                            <span style={{ fontFamily: "var(--font-sans)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#a88365" }}>
                                Digital Atelier · For you, Always.
                            </span>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection delay={100}>
                        <h1 style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(3.2rem, 10vw, 7rem)",
                            fontWeight: 400, lineHeight: 0.95,
                            letterSpacing: "-0.04em", color: "#382a24", marginBottom: 32,
                        }}>
                            The Art of<br />
                            <span style={{ fontStyle: "italic", marginLeft: "0.2em", color: "#cdab8f" }}>Gifting Memories.</span>
                        </h1>
                    </AnimatedSection>

                    <AnimatedSection delay={200}>
                        <p style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "clamp(1rem, 2.2vw, 1.1rem)",
                            color: "#6e5c53", lineHeight: 1.8,
                            maxWidth: 500, margin: "0 auto 56px",
                            letterSpacing: "-0.01em"
                        }}>
                            Enam cara berbeda untuk mengabadikan satu cerita.
                            Pilih produk yang paling mencerminkan perasaanmu.
                        </p>
                    </AnimatedSection>

                    <AnimatedSection delay={300}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 40 }}>
                            <div style={{ height: 1, width: 40, background: "rgba(205,171,143,0.3)" }} />
                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#cdab8f" }} />
                            <div style={{ height: 1, width: 40, background: "rgba(205,171,143,0.3)" }} />
                        </div>
                    </AnimatedSection>

                    {/* Hero CTA Buttons */}
                    <AnimatedSection delay={350}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 60 }}>
                            <Link
                                href="/catalog"
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 8,
                                    padding: "14px 32px", borderRadius: 999,
                                    background: "#1d1816", color: "#faf7f2",
                                    fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                    textDecoration: "none", transition: "all 0.3s ease",
                                    boxShadow: "0 8px 32px -8px rgba(29,24,22,0.25)"
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.background = "#cdab8f"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.background = "#1d1816"; }}
                            >
                                Lihat Catalog
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            </Link>
                            <a
                                href="https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20ingin%20tahu%20lebih%20lanjut%20tentang%20produk%20kalian."
                                target="_blank" rel="noopener noreferrer"
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 8,
                                    padding: "14px 32px", borderRadius: 999,
                                    background: "transparent", color: "#6e5c53",
                                    fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                    textDecoration: "none", transition: "all 0.3s ease",
                                    border: "1.5px solid rgba(205,171,143,0.35)",
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#cdab8f"; (e.currentTarget as HTMLElement).style.color = "#a88365"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(205,171,143,0.35)"; (e.currentTarget as HTMLElement).style.color = "#6e5c53"; }}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.477 2 2 6.477 2 12c0 1.821.486 3.53 1.337 5.006L2.001 22l5.13-1.322A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" /></svg>
                                Tanya via WhatsApp
                            </a>
                        </div>
                    </AnimatedSection>


                    <AnimatedSection delay={500}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.5, animation: "bounce-soft 2s ease-in-out infinite" }}>
                            <span style={{ fontFamily: "var(--font-sans)", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#a6968c" }}>Explore</span>
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#a6968c" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── THE COLLECTION (SELF-EDIT) ── */}
            <section id="collection" style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>

                    <AnimatedSection>
                        <div style={{ textAlign: "center", marginBottom: 70 }}>
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: 10,
                                padding: "6px 20px", border: "1.2px solid rgba(205,171,143,0.3)",
                                borderRadius: 999, marginBottom: 24,
                                background: "linear-gradient(135deg, rgba(205,171,143,0.08), rgba(205,171,143,0.02))",
                                boxShadow: "0 8px 24px -8px rgba(205,171,143,0.25)"
                            }}>
                                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#a88365", animation: "pulse-dot 2s infinite" }} />
                                <span style={{
                                    fontFamily: "var(--font-sans)", fontSize: 9.5, fontWeight: 700,
                                    letterSpacing: "0.24em", textTransform: "uppercase" as const,
                                    color: "#a88365"
                                }}>
                                    Instant Access
                                </span>
                                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#a88365", animation: "pulse-dot 2s infinite", animationDelay: "1s" }} />
                            </div>

                            <h2 style={{
                                fontFamily: "var(--font-display)", fontSize: "clamp(2.8rem, 7vw, 4.8rem)",
                                fontWeight: 400, color: "#3B2F25", lineHeight: 1.1, letterSpacing: "-0.03em",
                                marginBottom: 0
                            }}>
                                Most Popular <br />
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
                                    <span style={{ 
                                        fontStyle: "italic", 
                                        background: "linear-gradient(135deg, #a88365 0%, #d8b89c 40%, #8c6a4f 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        display: "inline-block",
                                        paddingRight: "0.1em"
                                    }}>Choice</span>
                                    <svg viewBox="0 0 24 24" fill="url(#starGradient)" style={{ width: "clamp(32px, 5vw, 48px)", height: "clamp(32px, 5vw, 48px)", flexShrink: 0 }}>
                                        <defs>
                                            <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#a88365" />
                                                <stop offset="40%" stopColor="#d8b89c" />
                                                <stop offset="100%" stopColor="#8c6a4f" />
                                            </linearGradient>
                                        </defs>
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </span>
                            </h2>
                            
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, margin: "28px 0" }}>
                                <div style={{ height: 1, width: 40, background: "linear-gradient(90deg, transparent, rgba(205,171,143,0.6))" }} />
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a88365" strokeWidth="1.5">
                                    <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="rgba(168, 131, 101, 0.15)" />
                                </svg>
                                <div style={{ height: 1, width: 40, background: "linear-gradient(270deg, transparent, rgba(205,171,143,0.6))" }} />
                            </div>

                            <p style={{
                                fontFamily: "var(--font-sans)", fontSize: "clamp(1rem, 2vw, 1.15rem)", color: "#6e5c53",
                                maxWidth: 540, margin: "0 auto", lineHeight: 1.7,
                                letterSpacing: "0.01em"
                            }}>
                                Pilihan favorit dari pelanggan kami. Temukan template yang paling diminati dan jadikan momen spesial Anda lebih berkesan.
                            </p>
                        </div>
                    </AnimatedSection>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, paddingBottom: 64 }}>
                        <CompactProductCard
                            badgeText="#1 Terlaris"
                            badgeColor="#e91e63"
                            titleColor="#a67c52" // From Voices page
                            imageSrc="https://cdn.for-you-always.my.id/1777881039502-bav595.webp"
                            title="Voices Gift"
                            oldPrice="Rp 30.000"
                            newPrice="Rp 15.000"
                            href="/catalog/voices"
                            occasions={["Long Dist", "Any Occasion", "Birthday"]}
                            features={["Pesan Suara (Voice Note)", "Desain Minimalis Elegan", "Surat Personal"]}
                        />
                        <CompactProductCard
                            badgeText="Popular"
                            badgeColor="#9c27b0"
                            titleColor="#2a3d5c" // From Letter Midnight theme
                            imageSrc="https://cdn.for-you-always.my.id/1781032720701-5lb1a.png"
                            title="Letter Edition"
                            oldPrice="Rp 25.000"
                            newPrice="Rp 15.000"
                            href="/catalog/letter"
                            occasions={["Graduation", "Apology", "Anniversary"]}
                            features={["Animasi Segel Lilin", "Surat Panjang Terbaca Jelas", "Tema Menyesuaikan"]}
                        />
                        <CompactProductCard
                            badgeText="Premium Bundle"
                            badgeColor="#4a7c8e"
                            titleColor="#5a8d9e" // From Mixtape page
                            imageSrc="https://cdn.for-you-always.my.id/1781034685666-udzbps.png"
                            title="Mixtape Edition"
                            oldPrice="Rp 50.000"
                            newPrice="Rp 25.000"
                            href="/catalog/mixtape"
                            occasions={["Crush", "Birthday", "Any Occasion"]}
                            features={["Integrasi Lagu Spotify", "Animasi Kaset Retro", "Galeri Foto Estetik"]}
                        />
                    </div>

                    <AnimatedSection delay={200}>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: 48, marginBottom: 24 }}>
                            <Link href="/catalog" style={{
                                padding: "16px 40px",
                                borderRadius: 999,
                                background: "#382a24",
                                color: "#faf7f2",
                                fontFamily: "var(--font-sans)",
                                fontSize: 16,
                                fontWeight: 700,
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 12,
                                transition: "all 0.3s ease",
                                boxShadow: "0 8px 24px rgba(56, 42, 36, 0.25)",
                                letterSpacing: "0.02em"
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = "translateY(-4px)";
                                e.currentTarget.style.boxShadow = "0 12px 32px rgba(56, 42, 36, 0.35)";
                                e.currentTarget.style.background = "#4a3830";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 8px 24px rgba(56, 42, 36, 0.25)";
                                e.currentTarget.style.background = "#382a24";
                            }}>
                                Lihat Semua Template
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </Link>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── CARA KERJA ── */}
            <section id="cara-kerja" style={{ position: "relative", zIndex: 1, padding: "120px 0", background: "#f2ebe1", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", opacity: 0.035 }} />
                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)", position: "relative", zIndex: 1 }}>

                    <AnimatedSection>
                        <div style={{ textAlign: "center", marginBottom: 80 }}>
                            <span style={{
                                fontFamily: "var(--font-sans)", fontSize: 8.5, fontWeight: 700,
                                letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#a88365",
                                display: "inline-block", padding: "6px 20px",
                                border: "1.2px solid rgba(205,171,143,0.2)", borderRadius: 999,
                                background: "rgba(205,171,143,0.08)", marginBottom: 28,
                            }}>
                                Workflow
                            </span>
                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 6vw, 4rem)", fontWeight: 400, color: "#382a24", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
                                Semudah<br />
                                <span style={{ fontStyle: "italic", color: "#cdab8f" }}> Tiga Langkah.</span>
                            </h2>
                        </div>
                    </AnimatedSection>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 2 }}>
                        {[
                            {
                                num: "01", title: "Pilih Produk",
                                desc: "Pilih dari lima format kado digital kami — sesuai cerita yang ingin kamu sampaikan.",
                                icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                            },
                            {
                                num: "02", title: "Isi di Studio",
                                desc: "Upload foto, rekam suara, pilih musik — semua dari browser-mu. Tidak perlu skill apapun.",
                                icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
                            },
                            {
                                num: "03", title: "Kirim & Surprise",
                                desc: "Dapat link unik dengan passcode. Kirim ke orang tersayang, dan lihat reaksinya.",
                                icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0-10.628a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5zm0 10.628a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5z" /></svg>
                            },
                        ].map((step, i) => (
                            <AnimatedSection key={i} delay={i * 120}>
                                <div style={{
                                    padding: "50px 40px",
                                    background: i === 1 ? "#1d1816" : "rgba(255,255,255,0.6)",
                                    backdropFilter: "blur(20px)",
                                    borderRadius: 24,
                                    border: i === 1 ? "1px solid rgba(205,171,143,0.15)" : "1px solid rgba(255,255,255,0.8)",
                                    boxShadow: i === 1 ? "0 30px 60px -15px rgba(29,24,22,0.4)" : "0 8px 32px -8px rgba(29,24,22,0.05)",
                                    height: "100%",
                                    transition: "all 0.5s ease"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: i === 1 ? "rgba(205,171,143,0.5)" : "#a6968c", fontWeight: 700, letterSpacing: "0.1em" }}>{step.num}</span>
                                        <div style={{ flex: 1, height: 1, background: i === 1 ? "rgba(205,171,143,0.1)" : "rgba(205,171,143,0.15)" }} />
                                    </div>
                                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", fontWeight: 400, color: i === 1 ? "#faf7f2" : "#382a24", marginBottom: 16, lineHeight: 1.1, letterSpacing: "-0.02em" }}>{step.title}</h3>
                                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: i === 1 ? "rgba(250,247,242,0.6)" : "#6e5c53", lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section id="testimoni" style={{ position: "relative", zIndex: 1, padding: "120px 0", background: "#1d1816", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "10%", left: "5%", width: "40vw", height: "40vw", borderRadius: "50%", background: "rgba(212,191,160,0.05)", filter: "blur(80px)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: "5%", right: "5%", width: "30vw", height: "30vw", borderRadius: "50%", background: "rgba(192,168,130,0.04)", filter: "blur(60px)", pointerEvents: "none" }} />

                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)", position: "relative", zIndex: 1 }}>
                    <AnimatedSection>
                        <div style={{ textAlign: "center", marginBottom: 80 }}>
                            <span style={{
                                fontFamily: "var(--font-sans)", fontSize: 8, fontWeight: 700,
                                letterSpacing: "0.22em", textTransform: "uppercase" as const,
                                color: "rgba(205,171,143,0.6)", display: "inline-block",
                                padding: "6px 20px", border: "1px solid rgba(205,171,143,0.2)",
                                borderRadius: 999, background: "rgba(205,171,143,0.08)", marginBottom: 28,
                            }}>
                                Community
                            </span>
                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 400, color: "#faf7f2", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
                                Kind Words.<br />
                                <span style={{ fontStyle: "italic", color: "#cdab8f" }}> Authentic Stories.</span>
                            </h2>
                        </div>
                    </AnimatedSection>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 20 }}>
                        {[
                            { name: "Rara A.", product: "Voices Gift", text: "Pacarku nangis pas buka ini. Beneran ga nyangka bisa segitu indahnya. Foto-fotonya berasa kayak film pendek.", rating: 5, delay: 80 },
                            { name: "Kevin M.", product: "Arcade Edition", text: "Buat ulang tahun pacar, dia main sampe lupa waktu. 10 ruangan semua seru banget, apalagi bagian kejutan di akhir.", rating: 5, delay: 160 },
                            { name: "Sella D.", product: "Voices Gift", text: "Murah banget tapi hasilnya premium. Temen-temenku pada tanya beli dimana, kirain bikin sendiri.", rating: 5, delay: 240 },
                            { name: "Bagas P.", product: "Voices Gift", text: "Awalnya skeptis, tapi begitu kirim ke dia... dia langsung video call sambil nangis. Worth every penny.", rating: 5, delay: 320 },
                        ].map((r, i) => (
                            <AnimatedSection key={i} delay={r.delay}>
                                <div style={{
                                    padding: "32px 28px", borderRadius: 20,
                                    background: "rgba(250,247,242,0.03)",
                                    border: "1px solid rgba(205,171,143,0.08)",
                                    backdropFilter: "blur(12px)",
                                    height: "100%", display: "flex", flexDirection: "column", gap: 16,
                                    transition: "all 0.4s ease",
                                }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLElement).style.background = "rgba(250,247,242,0.06)";
                                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(205,171,143,0.2)";
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLElement).style.background = "rgba(250,247,242,0.03)";
                                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(205,171,143,0.08)";
                                    }}
                                >
                                    <div style={{ display: "flex", gap: 3 }}>
                                        {Array.from({ length: r.rating }).map((_, s) => (
                                            <span key={s} style={{ color: "#cdab8f", fontSize: 10 }}>★</span>
                                        ))}
                                    </div>
                                    <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.1rem", color: "rgba(250,247,242,0.9)", lineHeight: 1.6, margin: 0, flex: 1 }}>
                                        &ldquo;{r.text}&rdquo;
                                    </p>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid rgba(205,171,143,0.1)" }}>
                                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(205,171,143,0.1)", border: "1px solid rgba(205,171,143,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 12, color: "#cdab8f" }}>{r.name[0]}</span>
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700, color: "#faf7f2", marginBottom: 2 }}>{r.name}</div>
                                            <div style={{ fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" as const, color: "rgba(205,171,143,0.5)" }}>via {r.product}</div>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>

                    <AnimatedSection delay={400}>
                        <div style={{ marginTop: 80, display: "flex", justifyContent: "center", gap: "clamp(32px, 8vw, 100px)", flexWrap: "wrap" }}>
                            {[
                                { num: "1000+", label: "Happy Customers" },
                                { num: "5.0", label: "Average Rating" },
                                { num: "6", label: "Formats" },
                            ].map((stat, i) => (
                                <div key={i} style={{ textAlign: "center" }}>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 400, color: "#faf7f2", lineHeight: 1, marginBottom: 8 }}>{stat.num}</div>
                                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(205,171,143,0.5)" }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section id="faq" style={{ position: "relative", zIndex: 1, padding: "120px 0", background: "#faf7f2" }}>
                <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
                    <AnimatedSection>
                        <div style={{ textAlign: "center", marginBottom: 64 }}>
                            <span style={{
                                fontFamily: "var(--font-sans)", fontSize: 8.5, fontWeight: 700,
                                letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#a88365",
                                display: "inline-block", padding: "6px 20px",
                                border: "1.2px solid rgba(205,171,143,0.2)", borderRadius: 999,
                                background: "rgba(205,171,143,0.08)", marginBottom: 24,
                            }}>
                                FAQ
                            </span>
                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 400, color: "#382a24", lineHeight: 1, letterSpacing: "-0.03em" }}>
                                Pertanyaan <span style={{ fontStyle: "italic", color: "#cdab8f" }}>yang Sering Ditanya.</span>
                            </h2>
                        </div>
                    </AnimatedSection>

                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {[
                            {
                                q: "Berapa lama proses pengerjaan?",
                                a: "Untuk produk Self-Edit, Anda akan langsung mendapatkan akses instan seketika setelah pembayaran. Untuk layanan Terima Jadi (Memoria), proses pengerjaan adalah maksimal 1x24 jam setelah semua materi dan data kami terima."
                            },

                            {
                                q: "Bagaimana cara pembayaran?",
                                a: "Pembayaran dapat dilakukan via scan QR, transfer bank, atau dompet digital (GoPay, OVO, Dana). Setelah order via WhatsApp, admin akan mengirimkan detail dan QR pembayaran langsung ke chat."
                            },
                            {
                                q: "Apakah bisa request custom desain atau tema?",
                                a: "Untuk saat ini tema dan desain sudah tersedia di dalam studio. Jika ada kebutuhan khusus, silakan tanyakan langsung via WhatsApp dan kami akan bantu sesuaikan."
                            },
                            {
                                q: "Apakah penerima perlu punya akun untuk membukanya?",
                                a: "Tidak perlu. Penerima hanya perlu membuka link dan memasukkan passcode yang kamu tentukan sendiri. Sangat mudah dan tidak perlu registrasi apapun."
                            },
                        ].map((item, i) => (
                            <AnimatedSection key={i} delay={i * 80}>
                                <details style={{
                                    borderBottom: "1px solid rgba(205,171,143,0.2)",
                                    padding: "24px 0",
                                    cursor: "pointer",
                                    listStyle: "none",
                                }}>
                                    <summary style={{
                                        fontFamily: "var(--font-sans)", fontSize: "0.95rem",
                                        fontWeight: 700, color: "#382a24",
                                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                                        cursor: "pointer", userSelect: "none" as const,
                                        listStyle: "none",
                                    }}>
                                        {item.q}
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cdab8f" strokeWidth={2.5} style={{ flexShrink: 0 }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <p style={{
                                        fontFamily: "var(--font-sans)", fontSize: "0.9rem",
                                        color: "#6e5c53", lineHeight: 1.75,
                                        marginTop: 16, paddingRight: 32,
                                    }}>
                                        {item.a}
                                    </p>
                                </details>
                            </AnimatedSection>
                        ))}
                    </div>

                    <AnimatedSection delay={500}>
                        <div style={{ textAlign: "center", marginTop: 56 }}>
                            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "#a6968c", marginBottom: 16 }}>
                                Masih ada pertanyaan lain?
                            </p>
                            <a
                                href="https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20punya%20pertanyaan%20tentang%20produk%20kalian."
                                target="_blank" rel="noopener noreferrer"
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 8,
                                    padding: "12px 28px", borderRadius: 999,
                                    background: "#1d1816", color: "#faf7f2",
                                    fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                    textDecoration: "none", transition: "all 0.3s ease",
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#cdab8f"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#1d1816"; }}
                            >
                                Chat via WhatsApp
                            </a>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <section style={{ position: "relative", zIndex: 1, padding: "120px 24px 80px", background: "#faf7f2", textAlign: "center" }}>

                <AnimatedSection>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 80 }}>
                        {[
                            { icon: "○", label: "5.0 Rating" },
                            { icon: "○", label: "1000+ Stories" },
                            { icon: "○", label: "Instant Access" },
                            { icon: "○", label: "Private Link" },
                        ].map((badge, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 24px", borderRadius: 999, border: "1px solid rgba(205,171,143,0.3)", fontSize: 11, fontWeight: 700, color: "#6e5c53", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                {badge.label}
                            </div>
                        ))}
                    </div>
                </AnimatedSection>

                <AnimatedSection delay={100}>
                    <div style={{ marginBottom: 40 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 14, overflow: "hidden", border: "1.2px solid rgba(205,171,143,0.3)", margin: "0 auto 20px" }}>
                            <img src="/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.15) opacity(0.85)" }} />
                        </div>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 24, color: "#382a24", marginBottom: 8, letterSpacing: "-0.02em" }}>For you, Always.</div>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "#a6968c" }}>Preserving Memories Digitally</div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginBottom: 32 }}>
                        {[
                            { label: "Voices", href: "https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Voices%20Edition*.%20Mohon%20info%20selanjutnya%20ya.%20Terima%20kasih!" },
                            { label: "Letter", href: "https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Letter%20Edition*.%20Mohon%20info%20selanjutnya%20ya.%20Terima%20kasih!" },
                            { label: "Arcade", href: "https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Arcade%20Edition*.%20Mohon%20info%20selanjutnya%20ya.%20Terima%20kasih!" },
                            { label: "Wrapped", href: "https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Wrapped%20Edition*.%20Mohon%20info%20selanjutnya%20ya.%20Terima%20kasih!" },
                        ].map(link => (
                            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#6e5c53", textDecoration: "none", borderBottom: "1.5px solid transparent", transition: "all 0.3s ease" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderBottomColor = "#cdab8f"; (e.currentTarget as HTMLElement).style.color = "#cdab8f"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#6e5c53"; }}>
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 48 }}>
                        <a href="https://instagram.com/foryoualways.id" target="_blank" rel="noopener noreferrer" style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: 40, height: 40, borderRadius: "50%",
                            background: "rgba(205,171,143,0.1)", border: "1px solid rgba(205,171,143,0.3)",
                            color: "#6e5c53", textDecoration: "none", transition: "all 0.3s ease",
                        }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#cdab8f"; (e.currentTarget as HTMLElement).style.color = "#faf7f2"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(205,171,143,0.1)"; (e.currentTarget as HTMLElement).style.color = "#6e5c53"; }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <a href="https://tiktok.com/@foryoualways.id" target="_blank" rel="noopener noreferrer" style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: 40, height: 40, borderRadius: "50%",
                            background: "rgba(205,171,143,0.1)", border: "1px solid rgba(205,171,143,0.3)",
                            color: "#6e5c53", textDecoration: "none", transition: "all 0.3s ease",
                        }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#cdab8f"; (e.currentTarget as HTMLElement).style.color = "#faf7f2"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(205,171,143,0.1)"; (e.currentTarget as HTMLElement).style.color = "#6e5c53"; }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                        </a>
                    </div>

                    <p style={{ fontSize: 9, color: "#a6968c", fontWeight: 500, letterSpacing: "0.05em" }}>© 2026 FOR YOU, ALWAYS. — ALL RIGHTS RESERVED.</p>
                </AnimatedSection>
            </section>

            {/* Floating WhatsApp with label */}
            <a href="https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20ingin%20bertanya%20tentang%20produk%20kalian." target="_blank" rel="noopener noreferrer" aria-label="Hubungi via WhatsApp"
                style={{ position: "fixed", bottom: 28, right: 28, zIndex: 100, display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
            >

                <div
                    style={{ width: 44, height: 44, borderRadius: "50%", background: "#1d1816", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px -4px rgba(29,24,22,0.25)", transition: "all 0.3s ease", flexShrink: 0 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#cdab8f"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#1d1816"; }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#faf7f2">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.486 3.53 1.337 5.006L2.001 22l5.13-1.322A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.065-1.112l-.292-.174-3.046.784.813-2.934-.19-.302A7.965 7.965 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
                    </svg>
                </div>
            </a>
        </div>
    );
}