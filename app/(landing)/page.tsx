"use client";

import React, { useEffect, useState, useRef } from "react";

/* ─────────────────────────────────────────────
   Animated Section (Intersection Observer)
   ───────────────────────────────────────────── */
function AnimatedSection({
    children,
    delay = 0,
}: {
    children: React.ReactNode;
    delay?: number;
}) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setTimeout(() => setIsVisible(true), delay);
            },
            { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [delay]);

    return (
        <div
            ref={ref}
            style={{
                transition: `all 0.9s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(36px)",
            }}
        >
            {children}
        </div>
    );
}

/* ─────────────────────────────────────────────
   Landscape Product Card — New alternating design
   ───────────────────────────────────────────── */
function LandscapeProductCard({
    label,
    title,
    description,
    price,
    features,
    mediaSrc,
    mediaType,
    accentColor,
    accentGlow,
    href,
    delay = 0,
    reverse = false,
}: {
    label: React.ReactNode;
    title: string;
    description: string;
    price: React.ReactNode;
    features: string[];
    mediaSrc: string;
    mediaType: "video" | "gif" | "placeholder";
    accentColor: string;
    accentGlow: string;
    href: string;
    delay?: number;
    reverse?: boolean;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || mediaType !== "video") return;

        // Force strict iOS autoplay requirements
        video.defaultMuted = true;
        video.muted = true;
        video.playsInline = true;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => { });
                } else {
                    video.pause();
                }
            },
            { threshold: 0.2 }
        );
        observer.observe(video);
        return () => observer.disconnect();
    }, [mediaType]);

    return (
        <AnimatedSection delay={delay}>
            <div className={`hub-showcase-row ${reverse ? "reverse" : ""}`}>
                {/* Media Section (16:9) */}
                <a
                    href={href}
                    className="hub-showcase-media"
                    onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.boxShadow = `0 48px 100px -20px ${accentGlow}`;
                        el.style.borderColor = `${accentColor}66`;
                    }}
                    onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.boxShadow = "0 32px 80px -20px rgba(59,47,37,0.15)";
                        el.style.borderColor = "rgba(255,255,255,0.15)";
                    }}
                >
                    {mediaType === "video" && mediaSrc ? (
                        <video
                            ref={videoRef}
                            src={mediaSrc}
                            autoPlay loop muted playsInline
                            disablePictureInPicture
                            controlsList="nodownload nofullscreen noremoteplayback"
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", aspectRatio: "16/9", pointerEvents: "none" }}
                        />
                    ) : mediaType === "gif" && mediaSrc ? (
                        <img src={mediaSrc} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", aspectRatio: "16/9" }} />
                    ) : (
                        <div style={{
                            width: "100%", height: "100%", aspectRatio: "16/9",
                            background: `linear-gradient(160deg, rgba(30,20,12,0.97) 0%, ${accentGlow} 100%)`,
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
                        }}>
                            <div style={{
                                width: 72, height: 72, borderRadius: 20,
                                background: `${accentColor}18`,
                                border: `1.5px solid ${accentColor}44`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke={accentColor} strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                                </svg>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: `${accentColor}99` }}>
                                Coming Soon
                            </span>
                        </div>
                    )}
                </a>

                {/* Text Content */}
                <div className="hub-showcase-content" style={{
                    backgroundColor: accentColor === '#c9184a' ? `${accentColor}0D` : `${accentColor}26`,  /* Wrapped (Pink) reduced further to ~5% */
                    border: `1.5px solid ${accentColor === '#c9184a' ? `${accentColor}26` : `${accentColor}40`}`, /* Thinner border for Wrapped */
                    borderRadius: "var(--radius-lg)",
                    padding: "clamp(32px, 4.5vw, 48px)",
                    boxShadow: `0 24px 48px -16px ${accentColor === '#c9184a' ? `${accentColor}14` : `${accentColor}26`}`
                }}>
                    {/* Label Badge */}
                    <div style={{
                        alignSelf: "flex-start",
                        padding: "6px 14px", borderRadius: 999,
                        background: `${accentColor}15`,
                        border: `1px solid ${accentColor}33`,
                        color: accentColor, fontSize: 9, fontWeight: 700, letterSpacing: "0.16em",
                        textTransform: "uppercase" as const,
                        marginBottom: 24,
                    }}>
                        {label}
                    </div>

                    <h3 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.8rem, 4vw, 2.7rem)",
                        fontWeight: 400,
                        color: accentColor, /* Modified: Menggunakan accentColor khusus setiap produk */
                        lineHeight: 1.15,
                        marginBottom: 16,
                    }}>
                        {title}
                    </h3>

                    <p style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
                        color: "#6e5c53",
                        lineHeight: 1.7,
                        marginBottom: 28,
                    }}>
                        {description}
                    </p>

                    {/* Features List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
                        {features.map((feat) => {
                            const isToggleFeature = feat.toLowerCase().includes("turn on / off");
                            const isMusicFeature = feat.toLowerCase().includes("music pilihan");
                            const isPageFeature = feat.toLowerCase().includes("berbeda");
                            const isVoiceFeature = feat.toLowerCase().includes("rekam suara");
                            const isGalleryFeature = feat.toLowerCase().includes("galeri foto");
                            const isEnvelopeFeature = feat.toLowerCase().includes("amplop");
                            const isTypewriterFeature = feat.toLowerCase().includes("typewriter");

                            return (
                                <div key={feat} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#6e5c53", fontWeight: 500 }}>
                                    <div style={{ flexShrink: 0, width: 18, height: 18, borderRadius: "50%", background: `${accentColor}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span style={{ marginRight: 8 }}>{feat}</span>

                                    {/* Animation: Toggle */}
                                    {isToggleFeature && (
                                        <div style={{
                                            width: 28, height: 15, borderRadius: 99,
                                            background: "rgba(0,0,0,0.06)", padding: 2,
                                            display: "inline-flex", alignItems: "center",
                                            position: "relative", overflow: "hidden",
                                            animation: "toggle-bg 4s infinite",
                                            flexShrink: 0,
                                            // @ts-ignore
                                            "--accent-color": accentColor
                                        }}>
                                            <div style={{
                                                width: 11, height: 11, borderRadius: "50%",
                                                background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                                animation: "toggle-slide 4s infinite"
                                            }} />
                                        </div>
                                    )}

                                    {/* Animation: Music Equalizer */}
                                    {isMusicFeature && (
                                        <div style={{ display: "inline-flex", alignItems: "flex-end", gap: 2, height: 14, paddingBottom: 1 }}>
                                            {[1, 2, 3].map(i => (
                                                <div key={i} style={{
                                                    width: 3,
                                                    background: accentColor,
                                                    borderRadius: 1,
                                                    animation: `eq-bar ${0.6 + i * 0.2}s ease-in-out infinite`,
                                                    animationDelay: `${i * 0.15}s`
                                                }} />
                                            ))}
                                        </div>
                                    )}

                                    {/* Animation: Page Indicator */}
                                    {isPageFeature && (
                                        <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                            {[1, 2, 3].map(i => (
                                                <div key={i} style={{
                                                    width: 4, height: 4,
                                                    borderRadius: "50%",
                                                    background: accentColor,
                                                    animation: `page-indicator 1.5s infinite`,
                                                    animationDelay: `${i * 0.3}s`
                                                }} />
                                            ))}
                                        </div>
                                    )}

                                    {/* Animation: Voice Pulse */}
                                    {isVoiceFeature && (
                                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 14, height: 14, position: "relative" }}>
                                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: accentColor }} />
                                            <div style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", border: `1.5px solid ${accentColor}`, animation: "voice-pulse 1.8s infinite" }} />
                                        </div>
                                    )}

                                    {/* Animation: Photo Shuffle */}
                                    {isGalleryFeature && (
                                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 14, position: "relative" }}>
                                            <div style={{ width: 10, height: 10, border: `1.5px solid ${accentColor}`, borderRadius: 2, position: "absolute", zIndex: 1, background: "#faf7f2" }} />
                                            <div style={{ width: 10, height: 10, border: `1.5px solid ${accentColor}`, borderRadius: 2, position: "absolute", animation: "photo-shuffle 2s infinite ease-in-out", background: `transparent` }} />
                                        </div>
                                    )}

                                    {/* Animation: Envelope */}
                                    {isEnvelopeFeature && (
                                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", animation: "envelope-bob 2.5s infinite ease-in-out" }}>
                                            <svg width="15" height="12" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" />
                                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Animation: Typewriter Text */}
                                    {isTypewriterFeature && (
                                        <div style={{ display: "inline-flex", alignItems: "center", height: 14 }}>
                                            <div style={{ 
                                                fontFamily: "monospace", 
                                                fontSize: 10, 
                                                fontWeight: 700,
                                                color: accentColor, 
                                                overflow: "hidden", 
                                                whiteSpace: "nowrap", 
                                                borderRight: `2px solid ${accentColor}`,
                                                paddingRight: 1,
                                                animation: "typewriter-text 5s steps(17) infinite, typewriter-blink 0.5s step-end infinite alternate"
                                            }}>
                                                Dearest Lyxelle, 
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginTop: "auto" }}>
                        <a href={href} style={{
                            padding: "12px 28px", borderRadius: 999,
                            background: accentColor, color: "#fff",
                            fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const,
                            textDecoration: "none", transition: "all 0.3s ease",
                            boxShadow: `0 8px 24px -4px ${accentColor}66`
                        }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                            Lihat Produk
                        </a>

                        <div style={{
                            padding: "10px 20px", borderRadius: 999,
                            background: `linear-gradient(135deg, rgba(255,255,255,0.95), ${accentColor}1A)`,
                            border: `1px solid ${accentColor}44`,
                            boxShadow: `inset 0 2px 4px rgba(255,255,255,0.8), 0 6px 16px -4px ${accentColor}44`,
                            fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", color: accentColor,
                            display: "flex", alignItems: "center", gap: 8
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                <line x1="7" y1="7" x2="7.01" y2="7" />
                            </svg>
                            {price}
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}

/* ═══════════════════════════════════════════════════════════
   MAIN HUB PAGE
   ═══════════════════════════════════════════════════════════ */
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
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(3px, -3px); }
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

            {/* ── HERO ── */}
            <section style={{ position: "relative", zIndex: 1, paddingTop: "clamp(140px, 20vh, 200px)", paddingBottom: "clamp(80px, 12vh, 130px)", textAlign: "center" }}>
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
                            Tiga cara berbeda untuk mengabadikan satu cerita.
                            Pilih produk yang paling mencerminkan perasaanmu.
                        </p>
                    </AnimatedSection>

                    <AnimatedSection delay={300}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 80 }}>
                            <div style={{ height: 1, width: 40, background: "rgba(205,171,143,0.3)" }} />
                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#cdab8f" }} />
                            <div style={{ height: 1, width: 40, background: "rgba(205,171,143,0.3)" }} />
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

            {/* ── THE COLLECTION ── */}
            <section id="collection" style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>

                    <AnimatedSection>
                        <div style={{ textAlign: "center", marginBottom: 80 }}>
                            <span style={{
                                fontFamily: "var(--font-sans)", fontSize: 8.5, fontWeight: 700,
                                letterSpacing: "0.22em", textTransform: "uppercase" as const,
                                color: "#a88365", display: "inline-block",
                                padding: "6px 20px", border: "1.2px solid rgba(205,171,143,0.3)",
                                borderRadius: 999, background: "rgba(205,171,143,0.06)",
                            }}>
                                The Collection
                            </span>
                        </div>
                    </AnimatedSection>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <LandscapeProductCard
                            label={
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    Voices Gift <span style={{ opacity: 0.5 }}>•</span> Best Seller
                                </div>
                            }
                            title="Kado Suara & Foto"
                            description="Rangkai kenangan visual dan audio menjadi satu memori abadi bernuansa sinematik. Ungkapkan perasaanmu secara langsung."
                            features={[
                                "Rekam Suara & Custom Pesan",
                                "Galeri Foto Sinematik",
                                "Background Music Pilihan"
                            ]}
                            price="Mulai Rp 10.000"
                            mediaSrc="https://cdn.for-you-always.my.id/1775620755494-cig1w.mp4"
                            mediaType="video"
                            accentColor="#a67c52"
                            accentGlow="rgba(166,124,82,0.2)"
                            href="/voices"
                            delay={100}
                        />
                        <LandscapeProductCard
                            label="Letter Edition"
                            title="Surat Digital Aesthetic"
                            description="Sampaikan pesan bermakna melalui surat digital bernuansa sinematik. Hadir dengan amplop interaktif, efek typewriter klasik, dan kustomisasi tema eksklusif."
                            features={[
                                "Amplop Digital Interaktif",
                                "Efek Typewriter Sinematik",
                                "Background Music Pilihan"
                            ]}
                            price="Promo Rp 10.000"
                            mediaSrc="https://cdn.for-you-always.my.id/1776429848862-q9u8fm.mp4"
                            mediaType="video"
                            accentColor="#c4858a"
                            accentGlow="rgba(196,133,138,0.2)"
                            href="/letter"
                            delay={200}
                            reverse={true}
                        />
                        <LandscapeProductCard
                            label="Arcade Edition"
                            title="10 Rooms of Memories"
                            description="Bawa dia ke dalam petualangan menyusuri 10 ruangan interaktif yang menceritakan perjalanan hubungan kalian."
                            features={[
                                "10 Ruangan Berbeda",
                                "Bisa Turn On / Off Room",
                                "Background Music Pilihan"
                            ]}
                            price={
                                <>
                                    <span style={{ textDecoration: "line-through", opacity: 0.6, fontWeight: 500 }}>Rp 25.000</span>
                                    <span style={{ marginLeft: 8 }}>Promo Rp 20.000</span>
                                </>
                            }
                            mediaSrc="https://cdn.for-you-always.my.id/1773433190382-k7de49.mp4"
                            mediaType="video"
                            accentColor="#5c8c5c"
                            accentGlow="rgba(92,140,92,0.2)"
                            href="/arcade"
                            delay={300}
                            reverse={false}
                        />
                        <LandscapeProductCard
                            label="Wrapped Edition"
                            title="Memories Wrapped"
                            description="Kado digital 6 halaman interaktif. Pilih lagu, galeri, rekap perjalanan, hingga surat yang bisa dibuka kapan saja."
                            features={[
                                "6 Halaman Berbeda",
                                "Bisa Turn On / Off Halaman",
                                "Background Music Pilihan"
                            ]}
                            price={
                                <>
                                    <span style={{ textDecoration: "line-through", opacity: 0.6, fontWeight: 500 }}>Rp 25.000</span>
                                    <span style={{ marginLeft: 8 }}>Promo Rp 20.000</span>
                                </>
                            }
                            mediaSrc="https://cdn.for-you-always.my.id/1775677721850-q0w3xt.mp4"
                            mediaType="video"
                            accentColor="#c9184a"
                            accentGlow="rgba(201,24,74,0.15)"
                            href="/wrapped"
                            delay={400}
                            reverse={true}
                        />
                    </div>
                </div>
            </section>

            {/* ── CARA KERJA ── */}
            <section style={{ position: "relative", zIndex: 1, padding: "120px 0", background: "#f2ebe1", overflow: "hidden" }}>
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
                                desc: "Pilih dari Voices, Arcade, atau Wrapped — sesuai cerita yang ingin kamu sampaikan.",
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
            <section style={{ position: "relative", zIndex: 1, padding: "120px 0", background: "#1d1816", overflow: "hidden" }}>
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
                                { num: "100+", label: "Delivered" },
                                { num: "5.0", label: "Average Rating" },
                                { num: "3", label: "Foundations" },
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

            {/* ── FOOTER ── */}
            <section style={{ position: "relative", zIndex: 1, padding: "120px 24px 80px", background: "#faf7f2", textAlign: "center" }}>

                <AnimatedSection>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 80 }}>
                        {[
                            { icon: "○", label: "5.0 Rating" },
                            { icon: "○", label: "100+ Stories" },
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

                    <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginBottom: 48 }}>
                        {[{ label: "Voices", href: "/voices" }, { label: "Arcade", href: "/arcade" }, { label: "Wrapped", href: "/wrapped" }].map(link => (
                            <a key={link.href} href={link.href} style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#6e5c53", textDecoration: "none", borderBottom: "1.5px solid transparent", transition: "all 0.3s ease" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderBottomColor = "#cdab8f"; (e.currentTarget as HTMLElement).style.color = "#cdab8f"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#6e5c53"; }}>
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <p style={{ fontSize: 9, color: "#a6968c", fontWeight: 500, letterSpacing: "0.05em" }}>© 2026 FOR YOU, ALWAYS. — ALL RIGHTS RESERVED.</p>
                </AnimatedSection>
            </section>

            {/* Floating WhatsApp — Champagne Truffle Style */}
            <a href="https://wa.me/6281381543981?text=Halo%20Digital%20Atelier!%20Saya%20ingin%20bertanya%20tentang%20produk%20kalian." target="_blank" rel="noopener noreferrer" aria-label="Hubungi via WhatsApp"
                style={{ position: "fixed", bottom: 32, right: 32, zIndex: 100, width: 48, height: 48, borderRadius: "50%", background: "#1d1816", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(29,24,22,0.2)", transition: "all 0.3s ease", textDecoration: "none" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.1) rotate(5deg)"; (e.currentTarget as HTMLElement).style.background = "#cdab8f"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1) rotate(0deg)"; (e.currentTarget as HTMLElement).style.background = "#1d1816"; }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#faf7f2">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.486 3.53 1.337 5.006L2.001 22l5.13-1.322A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.065-1.112l-.292-.174-3.046.784.813-2.934-.19-.302A7.965 7.965 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
                </svg>
            </a>
        </div>
    );
}