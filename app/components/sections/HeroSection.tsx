import React from "react";
import { AnimatedSection } from "../LandscapeProductCard";

export default function HeroSection() {
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

            {/* ── HERO ── */}
            <section id="hero" style={{ position: "relative", zIndex: 1, paddingTop: "clamp(80px, 12vh, 120px)", paddingBottom: "clamp(80px, 12vh, 130px)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "60px" }}>
                    
                    {/* LEFT COLUMN: HERO MOCKUP */}
                    <div style={{ flex: "1 1 400px", position: "relative", display: "flex", justifyContent: "center" }}>
                        <AnimatedSection delay={100}>
                            <div style={{ position: "relative", display: "inline-block" }}>
                                {/* Image Utama - Menggunakan <img> biasa (bukan Next/Image) agar
                                    animated GIF dapat bergerak di iOS TikTok in-app browser.
                                    mask-image dihapus dari <img> untuk mencegah flicker setiap GIF loop.
                                    Efek fade digantikan oleh overlay <div> di bawah. */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src="https://cdn.for-you-always.my.id/1781807802981-yohlpk.gif" 
                                    alt="Preview kado digital For You Always"
                                    className="hero-mockup-img"
                                    style={{
                                        width: "100%", maxWidth: 360, height: "auto",
                                        display: "block",
                                        filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
                                        transform: "translateZ(0)",
                                        backfaceVisibility: "hidden"
                                    }}
                                />
                                {/* Overlay fade — elemen terpisah dari GIF sehingga tidak berkedip saat loop */}
                                <div style={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: "25%",
                                    background: "linear-gradient(to bottom, transparent 0%, #f5efe6 100%)",
                                    pointerEvents: "none"
                                }} />

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
                                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#382a24', textAlign: 'left', lineHeight: 1.3 }}>Akses Instan<br/>tanpa menunggu</p>
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
                                Kado Digital Premium &amp; Surat Interaktif
                            </h1>
                            <h2 style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(4.2rem, 12vw, 6.5rem)",
                                fontWeight: 500, lineHeight: 0.95,
                                letterSpacing: "-0.02em", color: "#382a24", marginTop: 0, marginBottom: 24,
                            }}>
                                The Art of<br />
                                <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Gifting.</span>
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
        </>
    );
}
