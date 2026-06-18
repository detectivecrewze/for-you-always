"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import CompactProductCard from "../components/CompactProductCard";
import { LandscapeProductCard, AnimatedSection } from "../components/LandscapeProductCard";
import AutoScrollCarousel from "../components/ProductCarousel";

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
                        <Link href="/catalog"
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
                        </Link>
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
                    <Link href="/catalog"
                        onClick={() => setMobileOpen(false)}
                        style={{
                            marginTop: 16, display: "inline-flex", alignItems: "center", justifyContent: "center",
                            padding: "12px 28px", borderRadius: 999,
                            background: "#1d1816", color: "#faf7f2",
                            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                            textDecoration: "none",
                        }}
                    >
                        Order Now
                    </Link>
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


import CheckoutModal from "../components/CheckoutModal";

function LandingContentWithCheckout() {
    const [checkoutProduct, setCheckoutProduct] = useState<{ id: string, title: string, numericPrice: number, themeColor: string } | null>(null);
    
    return (
        <>
            <LandingContent setCheckoutProduct={setCheckoutProduct} />
            <CheckoutModal product={checkoutProduct} onClose={() => setCheckoutProduct(null)} />
        </>
    );
}

export default function MainHubPage() {
    return (
        <div style={{ minHeight: "100vh", background: "#faf7f2", overflowX: "clip" }}>
            <Navbar />
            <LandingContentWithCheckout />
        </div>
    );
}

const LandingContent = React.memo(({ setCheckoutProduct }: { setCheckoutProduct: any }) => {
    return (
        <>

            <style>{`
                @keyframes bounce-soft {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(8px); }
                }
                @keyframes wiggle-bubble {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-2px) rotate(-4deg); }
                    75% { transform: translateY(2px) rotate(4deg); }
                }
                @media (max-width: 500px) {
                    .social-proof-row {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 8px !important;
                    }
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
            <section id="hero" style={{ position: "relative", zIndex: 1, paddingTop: "clamp(80px, 12vh, 120px)", paddingBottom: "clamp(80px, 12vh, 130px)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "60px" }}>
                    
                    {/* LEFT COLUMN: HERO MOCKUP */}
                    <div style={{ flex: "1 1 400px", position: "relative", display: "flex", justifyContent: "center" }}>
                        <AnimatedSection delay={100}>
                            <div style={{ position: "relative", display: "inline-block" }}>
                                {/* Image Utama - Menggunakan <img> biasa (bukan Next/Image) agar
                                    animated WebP dapat bergerak di iOS TikTok in-app browser.
                                    TikTok's WKWebView memaksa <video> ke fullscreen, sedangkan
                                    <img> dirender sebagai gambar biasa, workaround yang valid. */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src="/assets/favicon/hand-phone-z.gif" 
                                    alt="Preview kado digital For You Always"
                                    className="hero-mockup-img"
                                    style={{
                                        width: "100%", maxWidth: 360, height: "auto",
                                        display: "block",
                                        filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
                                        maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                                        WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)"
                                    }}
                                />

                                {/* Floating Badge 1: Link langsung jadi */}
                                <div className="hero-badge-1" style={{
                                    position: 'absolute',
                                    top: '40%',
                                    background: '#fff',
                                    padding: '10px 16px',
                                    borderRadius: '16px',
                                    boxShadow: '0 12px 32px rgba(29,24,22,0.12)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    zIndex: 10,
                                    animation: 'bounce-soft 4s ease-in-out infinite'
                                }}>
                                    <span style={{ fontSize: 14 }}>⚡</span>
                                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#382a24', textAlign: 'left', lineHeight: 1.3 }}>Link langsung jadi<br/>setelah bayar</p>
                                </div>

                                {/* Floating Badge 2: Hubungi Kami */}
                                <a href="https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20ada%20pertanyaan." target="_blank" rel="noopener noreferrer" className="hero-badge-2" style={{
                                    position: 'absolute',
                                    bottom: '20%',
                                    background: '#fff',
                                    padding: '12px 16px',
                                    borderRadius: '16px',
                                    boxShadow: '0 12px 32px rgba(29,24,22,0.12)',
                                    zIndex: 10,
                                    textAlign: 'left',
                                    textDecoration: 'none',
                                    animation: 'bounce-soft 4.5s ease-in-out infinite 0.7s',
                                    cursor: 'pointer'
                                }}>
                                    <p style={{ margin: 0, fontSize: '10px', color: '#888', marginBottom: 2 }}>Ada pertanyaan?</p>
                                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#1d1816' }}>Hubungi kami</p>
                                </a>
                            </div>
                        </AnimatedSection>
                    </div>

                    {/* RIGHT COLUMN: TEXT & CTA */}
                    <div style={{ flex: "1 1 500px", textAlign: "left" }} className="hero-text-container">

                        <AnimatedSection delay={100}>
                            <h1 style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                                color: "#a67c52",
                                marginBottom: 16,
                                marginTop: 0
                            }}>
                                Kado Digital Premium & Surat Interaktif
                            </h1>
                            <h2 style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(4.2rem, 12vw, 6.5rem)",
                                fontWeight: 500, lineHeight: 0.95,
                                letterSpacing: "-0.02em", color: "#382a24", marginTop: 0, marginBottom: 24,
                            }}>
                                The Art of<br />
                                <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Gifting<br/>Memories.</span>
                            </h2>
                        </AnimatedSection>

                        <AnimatedSection delay={200}>
                            <p style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: "clamp(1.1rem, 2vw, 1.25rem)",
                                color: "#6e5c53", lineHeight: 1.6,
                                maxWidth: 480, margin: "0 0 48px",
                                letterSpacing: "-0.01em"
                            }}>
                                Kado kejutan website romantis untuk si dia, siap dalam 1 menit. Mulai dari <strong style={{ color: '#1d1816', fontWeight: 800 }}>Rp 15.000.</strong>
                            </p>
                        </AnimatedSection>

                        {/* Hero CTA Buttons */}
                        <AnimatedSection delay={350}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "nowrap", width: "100%", maxWidth: "400px", marginBottom: 20 }}>
                                <a
                                    href="#collection"
                                    style={{
                                        flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 8,
                                        padding: "14px 0", borderRadius: 999,
                                        background: "#1d1816", color: "#faf7f2",
                                        fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                        textDecoration: "none", transition: "all 0.3s ease",
                                        boxShadow: "0 8px 32px -8px rgba(29,24,22,0.25)"
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.background = "#cdab8f"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.background = "#1d1816"; }}
                                >
                                    Pilih Template &rarr;
                                </a>
                                <a
                                    href="#collection"
                                    style={{
                                        flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 8,
                                        padding: "14px 0", borderRadius: 999,
                                        background: "transparent", color: "#6e5c53",
                                        fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                        textDecoration: "none", transition: "all 0.3s ease",
                                        border: "1.5px solid rgba(205,171,143,0.35)",
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#cdab8f"; (e.currentTarget as HTMLElement).style.color = "#a88365"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(205,171,143,0.35)"; (e.currentTarget as HTMLElement).style.color = "#6e5c53"; }}
                                >
                                    Lihat Catalog
                                </a>
                            </div>
                        </AnimatedSection>

                        {/* Social Proof */}
                        <AnimatedSection delay={450}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "17px", fontWeight: 800, color: "#1d1816" }}>
                                        800+ Happy Customers
                                    </span>
                                    <div style={{ display: "flex", gap: 2 }}>
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#ffc107" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", marginLeft: 4 }}>
                                    {[
                                        { initial: 'A', bg: '#b36b79' },
                                        { initial: 'M', bg: '#6b8bb3' },
                                        { initial: 'J', bg: '#6bb381' },
                                        { initial: 'K', bg: '#b38d6b' },
                                        { initial: 'S', bg: '#766bb3' },
                                    ].map((user, i) => (
                                        <div key={i} style={{
                                            width: 34, height: 34, borderRadius: "50%", background: user.bg,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            marginLeft: i > 0 ? -12 : 0, border: "2.5px solid #faf7f2",
                                            position: "relative", zIndex: 5 - i,
                                            color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: "var(--font-sans)",
                                            boxShadow: "0 4px 12px rgba(29,24,22,0.08)",
                                            animation: `wiggle-bubble 3s ease-in-out infinite`,
                                            animationDelay: `${i * 0.15}s`
                                        }}>
                                            {user.initial}
                                        </div>
                                    ))}
                                    <div style={{
                                        height: 34, borderRadius: 999, background: "#fff",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        marginLeft: -12, padding: "0 14px 0 16px", border: "2.5px solid #faf7f2",
                                        position: "relative", zIndex: 0,
                                        color: "#6e5c53", fontSize: 11, fontWeight: 800, fontFamily: "var(--font-sans)",
                                        boxShadow: "0 4px 12px rgba(29,24,22,0.08)",
                                        animation: `wiggle-bubble 3s ease-in-out infinite`,
                                        animationDelay: `0.75s`
                                    }}>
                                        +MORE
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>
                        
                        {/* ── MARQUEE SCROLLING TEXT ── */}
                        <div style={{
                            position: "absolute",
                            left: 0,
                            width: "100vw",
                            marginTop: 40
                        }}>
                            <style dangerouslySetInnerHTML={{__html: `
                                    @keyframes marquee-scroll {
                                        0% { transform: translateX(0); }
                                        100% { transform: translateX(-50%); }
                                    }
                                    .marquee-animate {
                                        animation: marquee-scroll 25s linear infinite;
                                        will-change: transform;
                                    }
                                    @media (max-width: 768px) {
                                        .marquee-animate {
                                            animation: marquee-scroll 12s linear infinite;
                                        }
                                    }
                                    .marquee-hover:hover {
                                        animation-play-state: paused !important;
                                    }
                                `}} />
                                <div style={{ 
                                    overflow: "hidden", 
                                    whiteSpace: "nowrap", 
                                    display: "flex", 
                                    width: "100%", 
                                    background: "#efebe6", 
                                    borderTop: "1px solid #e5dbcf", 
                                    borderBottom: "1px solid #e5dbcf", 
                                    padding: "16px 0" 
                                }}>
                                    <div className="marquee-hover marquee-animate" style={{ 
                                        display: "flex", 
                                        flexDirection: "row", 
                                        width: "max-content"
                                    }}>
                                        {[...Array(6)].map((_, arrayIndex) => (
                                            <div key={arrayIndex} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                                                {["DESAIN PREMIUM", "AKTIF SELAMANYA", "PROSES 1 MENIT", "800+ HAPPY CUSTOMERS", "LINK LANGSUNG JADI", "HARGA TERJANGKAU", "FULL CUSTOM"].map((text, i) => (
                                                    <div key={i} style={{ 
                                                        flexShrink: 0, 
                                                        display: "flex", 
                                                        alignItems: "center",
                                                        fontFamily: "var(--font-sans)",
                                                        fontSize: "12px",
                                                        fontWeight: 800,
                                                        letterSpacing: "0.15em",
                                                        textTransform: "uppercase",
                                                        color: "#a88365"
                                                    }}>
                                                        <span>{text}</span>
                                                        <span style={{ margin: "0 32px", opacity: 0.4, fontSize: "16px" }}>•</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </section>

            {/* ── THE COLLECTION (SELF-EDIT) ── */}
            <section id="collection" style={{ position: "relative", zIndex: 1, padding: "120px 0 40px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>

                    {/* Minimal header — like letter4u: kicker kiri + link kanan */}
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, marginBottom: 28 }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                                <div style={{ width: 24, height: 1, background: "rgba(168,131,101,0.5)" }} />
                                <p style={{
                                    fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700,
                                    letterSpacing: "0.2em", textTransform: "uppercase",
                                    color: "#a88365", margin: 0
                                }}>Pilih Kado</p>
                            </div>
                            <h2 style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
                                fontWeight: 400,
                                color: "#1d1816", margin: 0,
                                letterSpacing: "-0.02em", lineHeight: 1.05
                            }}>
                                Temukan <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Gift-mu</span>
                            </h2>
                        </div>
                        <Link href="/catalog" style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "12px 24px", borderRadius: 999,
                            border: "1px solid rgba(205,171,143,0.3)",
                            fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700,
                            letterSpacing: "0.05em", textTransform: "uppercase",
                            color: "#8a7060", textDecoration: "none", whiteSpace: "nowrap",
                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                        onMouseEnter={e => { 
                            e.currentTarget.style.background = "rgba(205,171,143,0.08)";
                            e.currentTarget.style.borderColor = "rgba(205,171,143,0.6)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={e => { 
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.borderColor = "rgba(205,171,143,0.3)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                        >
                            Lihat Semua
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </Link>
                    </div>


                    {/* ─── Auto-Scrolling Carousel (Landing Page only) ─── */}
                    <div style={{ margin: "0 -24px", paddingBottom: 48 }}>
                        <AutoScrollCarousel
                            speed={55}
                            cards={[
                                {
                                    badgeText: "#1 Exclusive",
                                    badgeColor: "#d4af37",
                                    badgeVariant: "solid",
                                    imageSrc: "/assets/opening_gate.png",
                                    price: "Rp 40.000",
                                    title: "Memoria (Premium)",
                                    titleColor: "#581824",
                                    description: "Kado eksklusif done-for-you paling premium untuk momen anniversary dan ulang tahun.",
                                    href: "/catalog/memoria",
                                    onOrder: () => setCheckoutProduct({ id: "loves", title: "Memoria Premium", numericPrice: 40000, themeColor: "#581824" })
                                },
                                {
                                    badgeText: "#1 Terlaris",
                                    badgeColor: "#e91e63",
                                    badgeVariant: "solid",
                                    imageSrc: "https://cdn.for-you-always.my.id/1777881039502-bav595.webp",
                                    price: "Rp 15.000",
                                    title: "Voices Gift",
                                    titleColor: "#a67c52",
                                    description: "Website kado romantis dengan rekaman suaramu, galeri foto sinematik, dan musik latar pilihan.",
                                    href: "/catalog/voices",
                                    onOrder: () => setCheckoutProduct({ id: "voices", title: "Voices Gift", numericPrice: 15000, themeColor: "#a67c52" })
                                },
                                {
                                    badgeText: "Popular",
                                    badgeColor: "#2a3d5c",
                                    badgeVariant: "solid",
                                    imageSrc: "https://cdn.for-you-always.my.id/1780253357024-sb9db.webp",
                                    price: "Rp 15.000",
                                    title: "Letter Edition",
                                    titleColor: "#2a3d5c",
                                    description: "Amplop digital interaktif dengan efek typewriter sinematik dan foto/video di akhir surat.",
                                    href: "/catalog/letter",
                                    onOrder: () => setCheckoutProduct({ id: "letter", title: "Letter Edition", numericPrice: 15000, themeColor: "#2a3d5c" })
                                },
                                {
                                    badgeText: "Premium Bundle",
                                    badgeColor: "#4a7c8e",
                                    badgeVariant: "soft",
                                    imageSrc: "https://cdn.for-you-always.my.id/1781034685666-udzbps.png",
                                    price: "Rp 15.000",
                                    title: "Mixtape Edition",
                                    titleColor: "#5a8d9e",
                                    description: "Desain kaset klasik dengan galeri foto & video untuk momen yang tak terlupakan.",
                                    href: "/catalog/mixtape",
                                    onOrder: () => setCheckoutProduct({ id: "mixtape", title: "Mixtape Edition", numericPrice: 15000, themeColor: "#5a8d9e" })
                                },
                                {
                                    badgeText: "New ✨",
                                    badgeColor: "#e8789a",
                                    badgeVariant: "solid",
                                    imageSrc: "https://cdn.for-you-always.my.id/1781210840115-m9v0xv.webp",
                                    price: "Rp 15.000",
                                    title: "Invitation Edition",
                                    titleColor: "#8a3050",
                                    description: "Undangan kencan interaktif — pilih tanggal, aktivitas, dan kirim tiket kencan digital.",
                                    href: "/catalog/invitation",
                                    onOrder: () => setCheckoutProduct({ id: "invitation", title: "Invitation Edition", numericPrice: 15000, themeColor: "#8a3050" })
                                },
                                {
                                    badgeText: "10 Rooms",
                                    badgeColor: "#5c8c5c",
                                    badgeVariant: "solid",
                                    imageSrc: "https://cdn.for-you-always.my.id/1781032826300-poixyb.png",
                                    price: "Rp 20.000",
                                    title: "Arcade Edition",
                                    titleColor: "#5c8c5c",
                                    description: "10 ruangan interaktif penuh kejutan dengan background music pilihan.",
                                    href: "/catalog/arcade",
                                    onOrder: () => setCheckoutProduct({ id: "arcade", title: "Arcade Edition", numericPrice: 20000, themeColor: "#5c8c5c" })
                                },
                                {
                                    badgeText: "Nostalgic",
                                    badgeColor: "#008689",
                                    badgeVariant: "soft",
                                    imageSrc: "https://cdn.for-you-always.my.id/1778444079509-72xi4d.png",
                                    price: "Rp 15.000",
                                    title: "Retro Edition",
                                    titleColor: "#008689",
                                    description: "Tampilan retro Windows 98 dengan 5 stages of surprises dan custom GIF pilihan.",
                                    href: "/catalog/retro",
                                    onOrder: () => setCheckoutProduct({ id: "retro", title: "Retro Edition", numericPrice: 15000, themeColor: "#008689" })
                                },
                                {
                                    badgeText: "Storytelling",
                                    badgeColor: "#c9184a",
                                    badgeVariant: "soft",
                                    imageSrc: "https://cdn.for-you-always.my.id/1777887751232-efe0ge.webp",
                                    price: "Rp 20.000",
                                    title: "Wrapped Edition",
                                    titleColor: "#c9184a",
                                    description: "6 halaman interaktif bercerita — perfect untuk anniversary dan year-end recap.",
                                    href: "/catalog/wrapped",
                                    onOrder: () => setCheckoutProduct({ id: "wrapped", title: "Wrapped Edition", numericPrice: 20000, themeColor: "#c9184a" })
                                },
                            ]}
                        />
                    </div>



                </div>
            </section>



            {/* ── CARA KERJA ── */}
            <section id="cara-kerja" style={{ position: "relative", zIndex: 1, padding: "40px 0 120px", background: "#f2ebe1", overflow: "hidden" }}>
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
                                num: "01", title: "Pilih & Selesaikan Pesanan",
                                desc: "Pilih dari delapan format kado digital kami, isi data diri, dan selesaikan pembayaran dengan aman.",
                                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                            },
                            {
                                num: "02", title: "Cek Email & Masuk Studio",
                                desc: "Link akses eksklusif akan langsung dikirim ke emailmu. Buka linknya, lalu upload foto, lagu, atau rekam suara.",
                                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            },
                            {
                                num: "03", title: "Kirim & Surprise!",
                                desc: "Kado digitalmu siap dalam hitungan menit! Dapatkan link unik dengan passcode untuk dikirimkan ke orang tersayang.",
                                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
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
                                        <div style={{ color: i === 1 ? "rgba(205,171,143,0.8)" : "#a6968c", display: "flex" }}>
                                            {step.icon}
                                        </div>
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
                            { name: "Sella D.", product: "Wrapped Edition", text: "Murah banget tapi hasilnya premium. Temen-temenku pada nanya bikin dimana, kirain jago coding.", rating: 5, delay: 240 },
                            { name: "Bagas P.", product: "Letter Edition", text: "Awalnya skeptis, tapi begitu kirim ke dia... dia langsung video call sambil senyum-senyum salah tingkah. Bener-bener worth every penny.", rating: 5, delay: 320 },
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
                                { num: "800+", label: "Happy Customers" },
                                { num: "5.0", label: "Average Rating" },
                                { num: "8", label: "Formats" },
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
                                a: "Akses instan (langsung) setelah pembayaran untuk produk Self-Edit. Khusus layanan Terima Jadi (Memoria), pengerjaan maksimal 1x24 jam."
                            },

                            {
                                q: "Bagaimana cara pembayaran?",
                                a: "Sistem otomatis 24 jam via QRIS, Virtual Account, atau E-Wallet (GoPay/OVO/DANA). Akses langsung didapat tanpa perlu konfirmasi admin."
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
                            { label: "Memoria", href: "https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Memoria%20Premium*.%20Mohon%20info%20selanjutnya%20ya.%20Terima%20kasih!" },
                            { label: "Voices", href: "https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Voices%20Edition*.%20Mohon%20info%20selanjutnya%20ya.%20Terima%20kasih!" },
                            { label: "Letter", href: "https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Letter%20Edition*.%20Mohon%20info%20selanjutnya%20ya.%20Terima%20kasih!" },
                            { label: "Mixtape", href: "https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Mixtape%20Edition*.%20Mohon%20info%20selanjutnya%20ya.%20Terima%20kasih!" },
                            { label: "Invitation", href: "https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Invitation%20Edition*.%20Mohon%20info%20selanjutnya%20ya.%20Terima%20kasih!" },
                            { label: "Arcade", href: "https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Arcade%20Edition*.%20Mohon%20info%20selanjutnya%20ya.%20Terima%20kasih!" },
                            { label: "Retro", href: "https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Retro%20Edition*.%20Mohon%20info%20selanjutnya%20ya.%20Terima%20kasih!" },
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

                    <div style={{ maxWidth: 600, margin: "0 auto 32px", textAlign: "center" }}>
                        <p style={{ fontSize: 10, color: "#8b7e75", lineHeight: 1.6, fontWeight: 400, fontFamily: "var(--font-sans)" }}>
                            For you, Always. adalah Digital Atelier yang menghadirkan pengalaman <strong>kado digital premium</strong> dan <strong>surat interaktif aesthetic</strong>. Cocok untuk hadiah anniversary, kado ulang tahun, merayakan momen spesial, atau kejutan LDR (Long Distance Relationship). Dari <em>Voices Gift</em>, <em>Arcade</em>, <em>Mixtape</em>, hingga <em>Retro Edition</em>, setiap karya didesain dengan animasi eksklusif untuk menciptakan memori yang tak terlupakan.
                        </p>
                    </div>

                    <p style={{ fontSize: 9, color: "#a6968c", fontWeight: 500, letterSpacing: "0.05em" }}>© 2026 FOR YOU, ALWAYS. — ALL RIGHTS RESERVED.</p>
                </AnimatedSection>
            </section>

            {/* Floating WhatsApp with label */}
            <a href="https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20ingin%20bertanya%20tentang%20produk%20kalian." target="_blank" rel="noopener noreferrer" aria-label="Hubungi via WhatsApp"
                style={{ position: "fixed", bottom: 28, right: 28, zIndex: 100, display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}
                onMouseEnter={e => { 
                    const btn = e.currentTarget.children[1] as HTMLElement;
                    if (btn) { btn.style.background = "#cdab8f"; btn.style.transform = "scale(1.05)"; }
                    const bubble = e.currentTarget.children[0] as HTMLElement;
                    if (bubble) { bubble.style.transform = "translateY(-2px)"; bubble.style.boxShadow = "0 12px 28px -4px rgba(29, 24, 22, 0.15)"; }
                }}
                onMouseLeave={e => { 
                    const btn = e.currentTarget.children[1] as HTMLElement;
                    if (btn) { btn.style.background = "#1d1816"; btn.style.transform = "scale(1)"; }
                    const bubble = e.currentTarget.children[0] as HTMLElement;
                    if (bubble) { bubble.style.transform = "translateY(0)"; bubble.style.boxShadow = "0 8px 24px -4px rgba(29, 24, 22, 0.12)"; }
                }}
            >
                {/* Text Bubble */}
                <div className="hidden md:flex items-center gap-[6px]" style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    padding: "10px 20px",
                    borderRadius: "999px",
                    boxShadow: "0 8px 24px -4px rgba(29, 24, 22, 0.12)",
                    border: "1px solid rgba(205, 171, 143, 0.2)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}>
                    <span style={{ fontSize: 12.5, fontWeight: 500, color: "#6e5c53", fontFamily: "var(--font-sans)", letterSpacing: "-0.01em" }}>
                        Butuh bantuan? <strong style={{ color: "#382a24", fontWeight: 700 }}>Chat Admin</strong>
                    </span>
                </div>

                {/* WA Icon */}
                <div
                    style={{ width: 48, height: 48, borderRadius: "50%", background: "#1d1816", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px -4px rgba(29,24,22,0.25)", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", flexShrink: 0 }}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#faf7f2">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.486 3.53 1.337 5.006L2.001 22l5.13-1.322A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.065-1.112l-.292-.174-3.046.784.813-2.934-.19-.302A7.965 7.965 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
                    </svg>
                </div>
            </a>
        </>
    );
});