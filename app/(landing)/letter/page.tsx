"use client";

import React, { useEffect, useState, useRef } from "react";
import "./letter.css";

const THEMES = {
    rose: { name: "Dusty Rose", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>, swatch: "#f0cccd", bg: "#fbf0f0", bgWarm: "#f5e6e6", bgDeep: "#3d1a1a", bgCard: "rgba(255,245,245,0.78)", textPrimary: "#2d1515", textSecondary: "#7a5050", textMuted: "#a07878", textLight: "#fdf0f0", accent: "#c4858a", accentLight: "#d4a5aa", accentGlow: "rgba(196,133,138,0.15)", accentDeep: "#9c5a60", border: "rgba(196,133,138,0.12)", borderWarm: "rgba(196,133,138,0.25)", shadowSoft: "0 20px 60px -15px rgba(61,26,26,0.1)", shadowElevated: "0 40px 80px -20px rgba(61,26,26,0.15)", blob1: "rgba(196,133,138,0.14)", blob2: "rgba(156,90,96,0.10)" },
    blush: { name: "Blush Cream", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>, swatch: "#e8d5b0", bg: "#fef8f2", bgWarm: "#f5ead8", bgDeep: "#3b2010", bgCard: "rgba(255,250,242,0.82)", textPrimary: "#2c1a0e", textSecondary: "#7a5a3a", textMuted: "#a08060", textLight: "#fef8f2", accent: "#c9956c", accentLight: "#d9ae8a", accentGlow: "rgba(201,149,108,0.15)", accentDeep: "#a87050", border: "rgba(201,149,108,0.12)", borderWarm: "rgba(201,149,108,0.28)", shadowSoft: "0 20px 60px -15px rgba(59,32,16,0.1)", shadowElevated: "0 40px 80px -20px rgba(59,32,16,0.15)", blob1: "rgba(201,149,108,0.14)", blob2: "rgba(168,112,64,0.10)" },
    sage: { name: "Sage", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>, swatch: "#cce0cd", bg: "#f4f7f2", bgWarm: "#e8f0e8", bgDeep: "#1a3020", bgCard: "rgba(244,247,242,0.78)", textPrimary: "#1a2d1a", textSecondary: "#506050", textMuted: "#708070", textLight: "#f4f7f2", accent: "#7a9e7e", accentLight: "#96b89a", accentGlow: "rgba(122,158,126,0.15)", accentDeep: "#5a7a5e", border: "rgba(122,158,126,0.12)", borderWarm: "rgba(122,158,126,0.25)", shadowSoft: "0 20px 60px -15px rgba(26,48,32,0.1)", shadowElevated: "0 40px 80px -20px rgba(26,48,32,0.15)", blob1: "rgba(122,158,126,0.14)", blob2: "rgba(90,122,94,0.10)" },
    midnight: { name: "Midnight", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>, swatch: "#2a3d5c", bg: "#0b1120", bgWarm: "#0f1729", bgDeep: "#020617", bgCard: "rgba(15,23,41,0.7)", textPrimary: "#f8fafc", textSecondary: "#94a3b8", textMuted: "#64748b", textLight: "#f8fafc", accent: "#6b8cba", accentLight: "#8ba8d4", accentGlow: "rgba(107,140,186,0.15)", accentDeep: "#3d5a82", border: "rgba(107,140,186,0.12)", borderWarm: "rgba(107,140,186,0.22)", shadowSoft: "0 20px 60px -15px rgba(2,6,23,0.5)", shadowElevated: "0 40px 80px -20px rgba(2,6,23,0.8)", blob1: "rgba(107,140,186,0.12)", blob2: "rgba(71,85,105,0.15)" },
} as const;
type ThemeKey = keyof typeof THEMES;

function applyTheme(key: ThemeKey) {
    const t = THEMES[key];
    const r = document.documentElement;
    r.style.setProperty("--bg", t.bg);
    r.style.setProperty("--bg-warm", t.bgWarm);
    r.style.setProperty("--bg-deep", t.bgDeep);
    r.style.setProperty("--bg-card", t.bgCard);
    r.style.setProperty("--text-primary", t.textPrimary);
    r.style.setProperty("--text-secondary", t.textSecondary);
    r.style.setProperty("--text-muted", t.textMuted);
    r.style.setProperty("--text-light", t.textLight);
    r.style.setProperty("--accent", t.accent);
    r.style.setProperty("--accent-light", t.accentLight);
    r.style.setProperty("--accent-glow", t.accentGlow);
    r.style.setProperty("--accent-deep", t.accentDeep);
    r.style.setProperty("--border", t.border);
    r.style.setProperty("--border-warm", t.borderWarm);
    r.style.setProperty("--shadow-soft", t.shadowSoft);
    r.style.setProperty("--shadow-elevated", t.shadowElevated);
}

/* ── Animated Section (Intersection Observer) ── */
function AnimatedSection({
    children,
    className = "",
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setTimeout(() => setIsVisible(true), delay);
            },
            { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [delay]);

    return (
        <div
            ref={ref}
            style={{
                transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(32px)",
            }}
            className={className}
        >
            {children}
        </div>
    );
}

/* ── Step Card (Cara Kerja) ── */
function StepCard({
    number,
    title,
    description,
    icon,
}: {
    number: string;
    title: string;
    description: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="glass-surface" style={{ padding: "40px 32px" }}>
            {/* Step Badge */}
            <div
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 14px",
                    background: "var(--accent-glow)",
                    borderRadius: 999,
                    border: "1px solid var(--border-warm)",
                    marginBottom: 28,
                }}
            >
                <span className="label-text" style={{ color: "var(--accent)", margin: 0 }}>
                    Step
                </span>
                <span
                    style={{
                        fontFamily: "var(--font-display)",
                        fontStyle: "italic",
                        fontWeight: 600,
                        fontSize: 14,
                        color: "var(--text-primary)",
                    }}
                >
                    0{number}
                </span>
            </div>

            {/* Icon */}
            <div
                style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                    color: "var(--accent)",
                }}
            >
                {icon}
            </div>

            <h3
                className="heading-md"
                style={{ marginBottom: 12, fontSize: "1.35rem" }}
            >
                {title}
            </h3>
            <p className="body-text" style={{ fontSize: "0.9rem" }}>
                {description}
            </p>
        </div>
    );
}

/* ── Feature Showcase — Slideshow with navigation ── */
type ThemeMedia = { blush: string; rose?: string; sage?: string; midnight?: string; };

const FEATURE_SLIDES = [
    {
        label: "INTERAKTIF",
        title: "Amplop Digital Eksklusif",
        description:
            "Kejutan dimulai bahkan sebelum surat dibaca. Amplop digital interaktif yang membawa kesan personal dan mendalam bagi penerimanya.",
        videoSrc: {
            blush: "https://cdn.for-you-always.my.id/1776428663275-7kfqle.mp4",
            rose: "https://cdn.for-you-always.my.id/1776432142893-mecr16.mp4",
            sage: "https://cdn.for-you-always.my.id/1776432216915-tak42d.mp4",
            midnight: "https://cdn.for-you-always.my.id/1776432449348-uxmvjp.mp4"
        } as ThemeMedia,
        imageSrc: "",
        gifSrc: "",
    },
    {
        label: "SENSASI",
        title: "Efek Typewriter Sinematik",
        description:
            "Setiap kata tampil perlahan bagai diketik langsung di depan mata. Menciptakan alur emosional yang mendalam dalam setiap kalimat yang terjalin.",
        videoSrc: {
            blush: "https://cdn.for-you-always.my.id/1776429224320-hd30d.mp4",
            rose: "https://cdn.for-you-always.my.id/1776429365241-hftum.mp4",
            sage: "https://cdn.for-you-always.my.id/1776432341572-74gp9s.mp4",
            midnight: "https://cdn.for-you-always.my.id/1776432547434-xoehyn.mp4"
        } as ThemeMedia,
        imageSrc: "",
        gifSrc: "",
    },
    {
        label: "ATMOSPHERE",
        title: "Library Musik Personal",
        description:
            "Studio editor kami menyediakan koleksi musik pilihan untuk menemani setiap baris tulisanmu. Pilih melodi yang sempurna untuk menghidupkan suasana saat surat terbuka.",
        videoSrc: {
            blush: "https://cdn.for-you-always.my.id/1774606552857-l95uqf.mp4",
        } as ThemeMedia,
        imageSrc: "",
        gifSrc: "",
    },
];

function FeatureShowcase({ activeTheme }: { activeTheme: ThemeKey }) {
    const TOTAL = FEATURE_SLIDES.length;
    const [active, setActive] = useState(0);
    const [fading, setFading] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const goTo = (idx: number) => {
        if (idx === active || fading) return;
        setFading(true);
        setTimeout(() => {
            setActive(idx);
            setFading(false);
        }, 280);
    };

    const prev = () => goTo((active - 1 + TOTAL) % TOTAL);
    const next = () => goTo((active + 1) % TOTAL);

    const slide = FEATURE_SLIDES[active];
    const currentVideoSrc = slide.videoSrc[activeTheme] || slide.videoSrc.blush;

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.play().catch(() => { });
        }
    }, [active, currentVideoSrc]);

    const hasVideo = !!currentVideoSrc;
    const hasGif = !!slide.gifSrc;
    const hasImage = !!slide.imageSrc;

    return (
        <AnimatedSection delay={100}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse-glow-v {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.1); }
                }
                `
            }} />
            <div style={{ maxWidth: 860, margin: "0 auto" }}>
                {/* Media Frame 16:9 */}
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "16/9",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                        background: "var(--bg-deep)",
                        border: "1.5px solid var(--border-warm)",
                        boxShadow: "var(--shadow-elevated)",
                        transition: "opacity 0.28s ease",
                        opacity: fading ? 0 : 1,
                    }}
                >


                    {hasVideo ? (
                        <video
                            ref={(el) => {
                                (videoRef as any).current = el;
                                if (el) {
                                    el.defaultMuted = true;
                                    el.muted = true;
                                    el.playsInline = true;
                                    el.play().catch(() => { });
                                }
                            }}
                            key={currentVideoSrc}
                            src={currentVideoSrc}
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                                pointerEvents: "none"
                            }}
                        />
                    ) : hasGif ? (
                        <img
                            key={slide.gifSrc}
                            src={slide.gifSrc}
                            alt={slide.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                    ) : hasImage ? (
                        <img
                            key={slide.imageSrc}
                            src={slide.imageSrc}
                            alt={slide.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                    ) : (
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 16,
                                background: "linear-gradient(135deg, var(--bg-warm) 0%, var(--bg) 100%)",
                            }}
                        >
                            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--border-warm)" strokeWidth={0.8}>
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                            <span
                                style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                    color: "var(--text-muted)",
                                }}
                            >
                                {slide.title} — Video Coming Soon
                            </span>
                        </div>
                    )}

                    <div
                        style={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            zIndex: 10,
                            padding: "5px 14px",
                            borderRadius: 999,
                            background: "var(--accent)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                            color: "var(--text-light)",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                        }}
                    >
                        {slide.label}
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            zIndex: 10,
                            padding: "5px 14px",
                            borderRadius: 999,
                            background: "var(--accent-glow)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                            border: "1px solid var(--border-warm)",
                            color: "var(--text-primary)",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                        }}
                    >
                        {String(active + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
                    </div>
                </div>

                {/* Info Row + Arrows */}
                <div
                    style={{
                        marginTop: 24,
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        transition: "opacity 0.28s ease",
                        opacity: fading ? 0 : 1,
                    }}
                >
                    <button
                        onClick={prev}
                        aria-label="Fitur sebelumnya"
                        style={{
                            flexShrink: 0,
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            border: "1.5px solid var(--border-warm)",
                            background: "var(--bg-card)",
                            color: "var(--text-primary)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.25s ease",
                            boxShadow: "var(--shadow-soft)",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "var(--accent)";
                            (e.currentTarget as HTMLElement).style.color = "var(--text-light)";
                            (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "var(--bg-card)";
                            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                            (e.currentTarget as HTMLElement).style.borderColor = "var(--border-warm)";
                        }}
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
                            <h3
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontStyle: "italic",
                                    fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                                    fontWeight: 600,
                                    color: "var(--text-primary)",
                                    lineHeight: 1.2,
                                    margin: 0
                                }}
                            >
                                {slide.title}
                            </h3>
                        </div>
                        <p
                            className="body-text"
                            style={{ fontSize: "0.9rem", margin: 0, lineHeight: 1.65 }}
                        >
                            {slide.description}
                        </p>
                    </div>

                    <button
                        onClick={next}
                        aria-label="Fitur berikutnya"
                        style={{
                            flexShrink: 0,
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            border: "1.5px solid var(--border-warm)",
                            background: "var(--bg-card)",
                            color: "var(--text-primary)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.25s ease",
                            boxShadow: "var(--shadow-soft)",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "var(--accent)";
                            (e.currentTarget as HTMLElement).style.color = "var(--text-light)";
                            (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "var(--bg-card)";
                            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                            (e.currentTarget as HTMLElement).style.borderColor = "var(--border-warm)";
                        }}
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div
                    style={{
                        marginTop: 20,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    {FEATURE_SLIDES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            aria-label={FEATURE_SLIDES[i].title}
                            style={{
                                width: i === active ? 28 : 8,
                                height: 8,
                                borderRadius: 999,
                                border: "none",
                                background: i === active ? "var(--accent)" : "var(--border-warm)",
                                cursor: "pointer",
                                padding: 0,
                                transition: "all 0.3s ease",
                                opacity: i === active ? 1 : 0.55,
                            }}
                        />
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
}

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    return isMobile;
}

function ThemeSwitcher({ active, onChange }: { active: ThemeKey; onChange: (k: ThemeKey) => void }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 8, marginBottom: 32 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "var(--text-muted)" }}>Pilih Nuansa</span>
            {(Object.keys(THEMES) as ThemeKey[]).map((key) => {
                const t = THEMES[key];
                const isActive = active === key;
                return (
                    <button key={key} onClick={() => onChange(key)} title={t.name} aria-label={`Tema ${t.name}`}
                        style={{ width: isActive ? 34 : 26, height: isActive ? 34 : 26, borderRadius: "50%", border: isActive ? `2.5px solid var(--text-primary)` : "2px solid var(--border-warm)", padding: 3, background: "transparent", cursor: "pointer", transition: "all 0.3s ease" }}>
                        <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: t.swatch, boxShadow: isActive ? `0 0 0 2px ${t.accent}` : "none" }} />
                    </button>
                );
            })}
        </div>
    );
}

function ThemeGallery({ active, onChange }: { active: ThemeKey; onChange: (k: ThemeKey) => void }) {
    const themes = Object.keys(THEMES) as ThemeKey[];
    const activeIndex = themes.indexOf(active);
    
    const nextTheme = () => onChange(themes[(activeIndex + 1) % themes.length]);
    const prevTheme = () => onChange(themes[(activeIndex - 1 + themes.length) % themes.length]);
    const t = THEMES[active];

    return (
        <section id="pilih-nuansa" className="section-spacing" style={{ background: "var(--bg-warm)", position: "relative", overflow: "hidden" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px,4vw,24px)", boxSizing: "border-box" as const }}>
                <AnimatedSection>
                    <div style={{ textAlign: "center", marginBottom: 56 }}>
                        <span className="label-text" style={{ display: "inline-block", padding: "6px 16px", background: "var(--accent-glow)", border: "1px solid var(--border-warm)", borderRadius: 999, marginBottom: 24 }}>Pilih Nuansamu</span>
                        <h2 className="heading-lg">Setiap Surat,<br /><span className="italic-accent">Punya Suasananya Sendiri.</span></h2>
                        <p className="body-text" style={{ maxWidth: 480, margin: "16px auto 0" }}>Geser untuk melihat opsi tema yang paling cocok dengan perasaan dan momen yang ingin kamu abadikan.</p>
                    </div>
                </AnimatedSection>
                
                <div style={{ maxWidth: 360, margin: "0 auto", position: "relative" }}>
                    <AnimatedSection>
                        <div style={{ width: "100%", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: `0 24px 60px -12px ${t.accent}60`, transition: "all 0.5s ease" }}>
                            <div style={{ background: t.bg, border: `2px solid ${t.accent}`, borderRadius: "var(--radius-lg)", overflow: "hidden", transition: "all 0.5s ease" }}>
                                <div style={{ padding: "32px 20px 24px", background: t.bgWarm, minHeight: 200, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: 18, position: "relative" as const, transition: "background 0.5s ease" }}>
                                    <div style={{ width: "100%", maxWidth: 180, background: t.bgCard, borderRadius: 14, padding: "16px 14px", border: `1px solid ${t.borderWarm}`, transition: "all 0.5s ease" }}>
                                        <div style={{ width: "55%", height: 5, borderRadius: 999, background: t.accent, marginBottom: 10, transition: "background 0.5s ease" }} />
                                        <div style={{ width: "88%", height: 4, borderRadius: 999, background: t.textMuted, opacity: 0.35, marginBottom: 6, transition: "background 0.5s ease" }} />
                                        <div style={{ width: "72%", height: 4, borderRadius: 999, background: t.textMuted, opacity: 0.35, marginBottom: 6, transition: "background 0.5s ease" }} />
                                        <div style={{ width: "82%", height: 4, borderRadius: 999, background: t.textMuted, opacity: 0.35, transition: "background 0.5s ease" }} />
                                    </div>
                                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: t.swatch, border: `2px solid ${t.borderWarm}`, boxShadow: `0 4px 12px ${t.accent}50`, transition: "all 0.5s ease" }} />
                                </div>
                                <div style={{ padding: "18px 24px", background: t.bg, borderTop: `1px solid ${t.borderWarm}`, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.5s ease" }}>
                                    <div style={{ textAlign: "left" as const }}>
                                        <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18, fontWeight: 600, color: t.textPrimary, lineHeight: 1, display: "flex", alignItems: "center", gap: 8, transition: "color 0.5s ease" }}>
                                            <span style={{ color: t.accent, display: "flex", flexShrink: 0, transition: "color 0.5s ease" }}>{t.icon}</span>
                                            {t.name}
                                        </div>
                                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: t.textMuted, marginTop: 6, transition: "color 0.5s ease" }}>Tema Aktif</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
                
                {/* Navigation Controls */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 32 }}>
                    <button onClick={prevTheme} style={{ width: 44, height: 44, borderRadius: "50%", background: t.bgCard, border: `1px solid ${t.borderWarm}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: t.textPrimary, transition: "all 0.3s ease" }} aria-label="Tema sebelumnya">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    
                    <div style={{ display: "flex", gap: 8 }}>
                        {themes.map((key) => (
                            <button key={key} onClick={() => onChange(key)} aria-label={`Pilih tema ${THEMES[key].name}`} style={{ width: active === key ? 24 : 8, height: 8, borderRadius: 999, background: active === key ? t.accent : THEMES[key].swatch, border: active === key ? "none" : `1px solid ${t.borderWarm}`, padding: 0, cursor: "pointer", transition: "all 0.3s ease" }} />
                        ))}
                    </div>

                    <button onClick={nextTheme} style={{ width: 44, height: 44, borderRadius: "50%", background: t.bgCard, border: `1px solid ${t.borderWarm}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: t.textPrimary, transition: "all 0.3s ease" }} aria-label="Tema selanjutnya">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
        </section>
    );
}

export default function LetterLandingPage() {
    const isMobile = useIsMobile();
    const [activeTheme, setActiveTheme] = useState<ThemeKey>("blush");
    const handleThemeChange = (key: ThemeKey) => { setActiveTheme(key); applyTheme(key); };
    useEffect(() => { applyTheme("blush"); }, []);
    const t = THEMES[activeTheme];
    return (
        <div style={{ minHeight: "100vh", position: "relative", overflowX: "clip", width: "100%", maxWidth: "100%", boxSizing: "border-box", transition: "background 0.5s ease" }}>
            {/* Background Ambient Blobs — theme-aware */}
            <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: -1 }}>
                <div className="ambient-blob" style={{ top: "-8%", left: "-8%", width: "50%", height: "50%", background: t.blob1 }} />
                <div className="ambient-blob" style={{ top: "30%", right: "-10%", width: "45%", height: "45%", background: t.blob2 }} />
                <div className="ambient-blob" style={{ bottom: "-10%", left: "20%", width: "50%", height: "50%", background: t.blob1, opacity: 0.65 }} />
            </div>

            {/* HERO SECTION */}
            <section
                style={{
                    position: "relative",
                    paddingTop: isMobile ? 96 : 160,
                    paddingBottom: isMobile ? 56 : 100,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: 1100,
                        margin: "0 auto",
                        padding: "0 24px",
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: 60,
                        alignItems: "center",
                    }}
                >
                    <div style={{
                        textAlign: "center",
                        maxWidth: "100%",
                        margin: "0 auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                        overflow: "hidden"
                    }}>
                        <AnimatedSection>
                            <div
                                className="label-text"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "6px 16px",
                                    background: "var(--accent-glow)",
                                    border: "1px solid var(--border-warm)",
                                    borderRadius: 999,
                                    marginBottom: 32,
                                }}
                            >
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", animation: "pulse-warm 2s infinite" }} />
                                Letter Edition — Aesthetic Memoir
                            </div>
                        </AnimatedSection>
                        <AnimatedSection delay={50}>
                            <ThemeSwitcher active={activeTheme} onChange={handleThemeChange} />
                        </AnimatedSection>
                        <AnimatedSection delay={100}>
                            <h1 className="heading-lg" style={{ marginBottom: 28, maxWidth: "100%", wordWrap: "break-word" }}>
                                Surat yang ingin Disampaikan.
                                <br />
                                <span className="italic-accent">Dengan cara yang lebih berarti.</span>
                            </h1>
                        </AnimatedSection>
                        <AnimatedSection delay={200}>
                            <p className="body-text" style={{ fontSize: "1rem", maxWidth: "100%", width: "100%", margin: "0 auto 40px", padding: "0 10px", boxSizing: "border-box" }}>
                                Rangkai ucapan dan doa dalam sebuah surat digital bersuasana sinematik. Sentuhan klasik, dalam pengalaman modern yang{" "}
                                <strong className="italic-accent" style={{ fontWeight: 600, color: "var(--accent)" }}>penuh makna.</strong>
                            </p>
                        </AnimatedSection>
                        <AnimatedSection delay={300}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center", width: "100%", maxWidth: "100%" }}>
                                <a href="#pesan" className="btn-primary" style={{ width: "100%", maxWidth: "300px" }}>
                                    <span>Tulis Surat Sekarang</span>
                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ position: "relative", zIndex: 1 }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                                <a href="#showcase" className="btn-secondary" style={{ width: "100%", maxWidth: "300px" }}>
                                    Lihat Lebih Dekat
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </a>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* PILIH NUANSA — Theme Gallery */}
            <ThemeGallery active={activeTheme} onChange={handleThemeChange} />

            {/* SHOWCASE */}
            <section
                id="showcase"
                className="section-spacing"
                style={{ position: "relative", background: "var(--bg)", overflow: "hidden" }}
            >
                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px, 4vw, 24px)", boxSizing: "border-box", width: "100%" }}>
                    <AnimatedSection>
                        <div style={{ textAlign: "center", marginBottom: 64 }}>
                            <span
                                className="label-text"
                                style={{
                                    display: "inline-block",
                                    padding: "6px 16px",
                                    background: "var(--bg-card)",
                                    border: "1px solid var(--border)",
                                    borderRadius: 999,
                                    marginBottom: 28,
                                }}
                            >
                                Apa yang Mereka Terima
                            </span>
                            <h2 className="heading-lg">
                                Seni Mengirim Pesan.
                                <br />
                                <span className="italic-accent">
                                    Dalam Nuansa Berbeda.
                                </span>
                            </h2>
                        </div>
                    </AnimatedSection>

                    <FeatureShowcase activeTheme={activeTheme} />
                </div>
            </section>

            {/* CARA KERJA */}
            <section
                id="cara-kerja"
                className="section-spacing"
                style={{ position: "relative", overflow: "hidden" }}
            >
                <div
                    className="ambient-blob"
                    style={{
                        top: 0,
                        right: 0,
                        width: "min(500px, 80vw)",
                        height: "min(500px, 80vw)",
                        background: "rgba(107, 140, 186, 0.08)",
                        transform: "translate(10%, -30%)",
                    }}
                />

                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px, 4vw, 24px)", boxSizing: "border-box", width: "100%" }}>
                    <AnimatedSection>
                        <div
                            style={{
                                textAlign: "center",
                                marginBottom: 64,
                                maxWidth: 600,
                                margin: "0 auto 64px",
                            }}
                        >
                            <span
                                className="label-text"
                                style={{
                                    display: "inline-block",
                                    padding: "6px 16px",
                                    background: "var(--accent-glow)",
                                    border: "1px solid var(--border-warm)",
                                    borderRadius: 999,
                                    marginBottom: 28,
                                }}
                            >
                                Cara Kerja
                            </span>
                            <h2 className="heading-lg" style={{ marginBottom: 16 }}>
                                Ciptakan Kenangan
                                <br />
                                <span className="italic-accent">Semudah Tiga Langkah.</span>
                            </h2>
                            <p className="body-text">
                                Hadirkan kebahagiaan dalam genggaman dengan proses yang
                                dirancang khusus untuk setiap cerita berharga Anda.
                            </p>
                        </div>
                    </AnimatedSection>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
                            gap: 24,
                        }}
                    >
                        <AnimatedSection delay={100}>
                            <StepCard
                                number="1"
                                title="Pesan via WhatsApp"
                                description="Hubungi admin via WhatsApp untuk melakukan pemesanan dan dapatkan akses eksklusif ke studio editor kami."
                                icon={
                                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                }
                            />
                        </AnimatedSection>
                        <AnimatedSection delay={200}>
                            <StepCard
                                number="2"
                                title="Tulis & Kustomisasi"
                                description="Gunakan studio editor kami untuk menulis surat, menyesuaikan format, dan memilih musik latar yang pas."
                                icon={
                                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                                    </svg>
                                }
                            />
                        </AnimatedSection>
                        <AnimatedSection delay={300}>
                            <StepCard
                                number="3"
                                title="Bagikan Suratmu"
                                description="Dapatkan link aman berpassword beserta QR code cantik, lalu kirimkan ke orang tersayang seketika."
                                icon={
                                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0-10.628a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5zm0 10.628a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5z" />
                                    </svg>
                                }
                            />
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section
                id="pesan"
                className="dark-section section-spacing"
                style={{ background: "var(--bg-deep)" }}
            >
                <div
                    style={{
                        maxWidth: 800,
                        margin: "0 auto",
                        padding: "0 24px",
                        textAlign: "center",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <AnimatedSection>
                        <span
                            style={{
                                display: "inline-block",
                                padding: "6px 16px",
                                background: "rgba(107, 140, 186, 0.15)",
                                border: "1px solid rgba(107, 140, 186, 0.25)",
                                borderRadius: 999,
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                color: "var(--accent-light)",
                                marginBottom: 36,
                            }}
                        >
                            Harga Spesial
                        </span>
                    </AnimatedSection>

                    <AnimatedSection delay={100}>
                        <h2
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                                fontWeight: 400,
                                color: "#f8fafc",
                                lineHeight: 1.15,
                                marginBottom: 20,
                            }}
                        >
                            Satu Surat.
                            <br />
                            <span
                                style={{
                                    fontStyle: "italic",
                                    color: "var(--accent-light)",
                                }}
                            >
                                Beribu Makna.
                            </span>
                        </h2>
                    </AnimatedSection>

                    <AnimatedSection delay={200}>
                        <p
                            style={{
                                fontSize: "1.05rem",
                                color: "rgba(248, 250, 252, 0.6)",
                                lineHeight: 1.7,
                                maxWidth: 480,
                                margin: "0 auto 48px",
                            }}
                        >
                            Ciptakan momen yang tak terlupakan hari ini. Hanya dengan satu klik,
                            mulai rangkai kata-katamu.
                        </p>
                    </AnimatedSection>

                    {/* Pricing Cards */}
                    <AnimatedSection delay={300}>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr",
                            maxWidth: 400,
                            margin: "0 auto 48px",
                        }}>
                            <div style={{
                                padding: "36px 32px",
                                borderRadius: "var(--radius-lg)",
                                background: "rgba(255,255,255,0.03)",
                                border: "1.5px solid rgba(107, 140, 186, 0.4)",
                                backdropFilter: "blur(12px)",
                                WebkitBackdropFilter: "blur(12px)",
                                display: "flex",
                                flexDirection: "column",
                            }}>
                                <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18, color: "var(--accent-light)", marginBottom: 8 }}>
                                    Letter Edition (VIP)
                                </div>
                                <div style={{ marginBottom: 24 }}>
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "rgba(248, 250, 252, 0.4)" }}>Rp </span>
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 600, color: "#f8fafc", letterSpacing: "-0.03em" }}>10</span>
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "#f8fafc" }}>.000</span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28, flex: 1 }}>
                                    {["Akses Self-Edit Studio", "Custom Domain VIP", "Musik Latar Bebas Pilih", "Tampilan Amplop Interaktif", "Revisi tanpa batas"].map((f, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(248, 250, 252, 0.7)", lineHeight: 1.4 }}>
                                            <div style={{ flexShrink: 0, width: 18, height: 18, borderRadius: "50%", background: "rgba(107, 140, 186, 0.2)", border: "1px solid rgba(107, 140, 186, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            {f}
                                        </div>
                                    ))}
                                </div>
                                <a
                                    href="https://wa.me/6281381543981?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Letter%20Edition*%20seharga%20Rp%2010.000.%0A%0AMohon%20info%20langkah%20selanjutnyaya.%20Terima%20kasih!"
                                    target="_blank" rel="noopener noreferrer"
                                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "16px 0", borderRadius: "var(--radius-md)", background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)", color: "#020617", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", transition: "all 0.3s ease", textAlign: "center" }}
                                >
                                    Pesan Sekarang
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </a>
                            </div>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection delay={400}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 20,
                                fontSize: 11,
                                color: "rgba(248, 250, 252, 0.35)",
                                fontWeight: 600,
                                letterSpacing: "0.12em",
                                flexWrap: "wrap",
                            }}
                        >
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span
                                    style={{
                                        width: 5,
                                        height: 5,
                                        borderRadius: "50%",
                                        background: "rgba(107, 140, 186, 0.5)",
                                    }}
                                />
                                SECURE PAYMENT
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span
                                    style={{
                                        width: 5,
                                        height: 5,
                                        borderRadius: "50%",
                                        background: "rgba(107, 140, 186, 0.5)",
                                    }}
                                />
                                LIFETIME ACCESS
                            </span>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* FOOTER */}
            <footer
                style={{
                    padding: "48px 24px",
                    background: "var(--bg)",
                    borderTop: "1px solid var(--border)",
                    textAlign: "center",
                }}
            >
                <a
                    href="/"
                    style={{
                        display: "inline-flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                        textDecoration: "none",
                        marginBottom: 20,
                    }}
                >
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 12,
                            overflow: "hidden",
                            border: "1px solid var(--border)",
                        }}
                    >
                        <img
                            src="/logo.png"
                            alt="Logo"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                    <span
                        style={{
                            fontFamily: "var(--font-display)",
                            fontStyle: "italic",
                            fontWeight: 600,
                            fontSize: 15,
                            color: "var(--text-primary)",
                        }}
                    >
                        For you, Always.
                    </span>
                </a>

                <p
                    style={{
                        fontSize: 10,
                        color: "var(--text-muted)",
                        fontWeight: 500,
                    }}
                >
                    © 2026 For you, Always. — Preserving Memories Digitally
                </p>
            </footer>

            {/* Floating WhatsApp Button */}
            <a
                href="https://wa.me/6281381543981?text=Halo%20Digital%20Atelier!%20Saya%20ingin%20bertanya%20tentang%20Letter%20Edition."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hubungi via WhatsApp"
                style={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    zIndex: 50,
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 24px -4px rgba(2, 6, 23, 0.6)",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                }}
            >
                <svg width="26" height="26" fill="var(--accent-light)" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </a>
        </div>
    );
}
