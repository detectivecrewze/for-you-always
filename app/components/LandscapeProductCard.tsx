"use client";

import React, { useEffect, useState, useRef } from "react";

export function AnimatedSection({
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
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                    observer.disconnect(); // Only animate once, stop observing to save CPU
                }
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
export function LandscapeProductCard({
    label,
    title,
    description,
    price,
    features,
    mediaSrc,
    fallbackImgSrc,
    mediaType,
    accentColor,
    accentGlow,
    href,
    onOrder,
    themesLabel = "Koleksi Tema",
    themes,
    initialSelectedIndex,
    autoCycle = false,
    delay = 0,
    reverse = false,
    addonText,
    tiktokHref,
    demoLink,
    demoLabel,
}: {
    label: React.ReactNode;
    title: string;
    description: string;
    price: React.ReactNode;
    features: string[];
    mediaSrc?: string;
    fallbackImgSrc?: string;
    mediaType: "video" | "gif" | "image" | "placeholder";
    accentColor: string;
    accentGlow: string;
    href?: string;
    onOrder?: () => void;
    themesLabel?: string;
    themes?: { name: string, desc: string, color?: string, videoSrc?: string, fallbackImgSrc?: string, demoLink?: string, demoLabel?: string, defaultSubThemeIndex?: number, subThemes?: { name: string, color?: string, videoSrc?: string, fallbackImgSrc?: string, demoLink?: string, demoLabel?: string }[] }[];
    initialSelectedIndex?: number;
    autoCycle?: boolean;
    delay?: number;
    reverse?: boolean;
    addonText?: React.ReactNode;
    tiktokHref?: string;
    demoLink?: string;
    demoLabel?: string;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [activeAccent, setActiveAccent] = useState(accentColor);
    const [activeGlow, setActiveGlow] = useState(accentGlow);
    const [activeVideoSrc, setActiveVideoSrc] = useState(mediaSrc);
    const [activeFallbackImgSrc, setActiveFallbackImgSrc] = useState(fallbackImgSrc);
    const [activeDemoLink, setActiveDemoLink] = useState(demoLink);
    const [activeDemoLabel, setActiveDemoLabel] = useState(demoLabel || "Lihat Demo");
    const [selectedIndex, setSelectedIndex] = useState<number | null>(initialSelectedIndex ?? null);
    const [selectedSubThemeIndex, setSelectedSubThemeIndex] = useState<number>(() => {
        const initIdx = initialSelectedIndex ?? 0;
        return themes?.[initIdx]?.defaultSubThemeIndex || 0;
    });
    const [isTikTok, setIsTikTok] = useState(false);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        if (typeof navigator !== 'undefined') {
            const ua = navigator.userAgent || navigator.vendor;
            if (/Bytedance|musical_ly|TikTok/i.test(ua)) {
                setIsTikTok(true);
            }
        }
    }, []);

    // Reset subTheme index when main theme changes
    useEffect(() => {
        if (selectedIndex !== null && themes && themes[selectedIndex]) {
            setSelectedSubThemeIndex(themes[selectedIndex].defaultSubThemeIndex || 0);
        } else {
            setSelectedSubThemeIndex(0);
        }
    }, [selectedIndex, themes]);

    // Sync media and accents whenever selectedIndex changes
    useEffect(() => {
        if (selectedIndex !== null && themes && themes[selectedIndex]) {
            const theme = themes[selectedIndex];
            const activeTheme = (theme.subThemes && theme.subThemes.length > 0) 
                ? theme.subThemes[selectedSubThemeIndex] || theme 
                : theme;

            const resolvedColor = activeTheme.color || theme.color || accentColor;
            setActiveAccent(resolvedColor);
            setActiveGlow(resolvedColor ? `${resolvedColor}33` : accentGlow);

            // Logic to determine video source
            if (activeTheme.videoSrc) setActiveVideoSrc(activeTheme.videoSrc);
            else if (theme.videoSrc) setActiveVideoSrc(theme.videoSrc);
            else if (activeTheme.fallbackImgSrc || theme.fallbackImgSrc) setActiveVideoSrc("");
            else setActiveVideoSrc(mediaSrc);

            // Logic to determine fallback image
            if (activeTheme.fallbackImgSrc) setActiveFallbackImgSrc(activeTheme.fallbackImgSrc);
            else if (theme.fallbackImgSrc) setActiveFallbackImgSrc(theme.fallbackImgSrc);
            else setActiveFallbackImgSrc(fallbackImgSrc);

            // Logic to determine demoLink
            if (activeTheme.demoLink) setActiveDemoLink(activeTheme.demoLink);
            else if (theme.demoLink) setActiveDemoLink(theme.demoLink);
            else setActiveDemoLink(demoLink);

            // Logic to determine demoLabel
            if (activeTheme.demoLabel) setActiveDemoLabel(activeTheme.demoLabel);
            else if (theme.demoLabel) setActiveDemoLabel(theme.demoLabel);
            else setActiveDemoLabel(demoLabel || "Lihat Demo");
        } else {
            setActiveAccent(accentColor);
            setActiveGlow(accentGlow);
            setActiveVideoSrc(mediaSrc);
            setActiveFallbackImgSrc(fallbackImgSrc);
            setActiveDemoLink(demoLink);
            setActiveDemoLabel(demoLabel || "Lihat Demo");
        }
    }, [selectedIndex, selectedSubThemeIndex, themes, accentColor, accentGlow, mediaSrc, fallbackImgSrc, demoLink, demoLabel]);

    // Handle Auto Cycling
    useEffect(() => {
        if (!autoCycle || !themes || themes.length <= 1 || !isInView) return;

        const interval = setInterval(() => {
            setSelectedIndex(prev => {
                const next = (prev === null ? 0 : prev + 1) % themes.length;
                return next;
            });
        }, 5000); // Change every 5 seconds for better viewing experience

        return () => clearInterval(interval);
    }, [autoCycle, themes, isInView]);


    // (Video logic removed as per request to use static images only)

    return (
        <AnimatedSection delay={delay}>
            <div className={`hub-showcase-row ${reverse ? "reverse" : ""}`}>

                {/* Media Column Wrapper */}
                <div className="hub-showcase-media-wrapper" style={{ gap: 24 }}>
                    {/* Media Section (16:9) */}
                    <div
                        className="hub-showcase-media"
                        style={{ position: "relative", flex: "none", width: "100%" }}
                        onMouseEnter={e => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.boxShadow = `0 48px 100px -20px ${activeGlow}`;
                            el.style.borderColor = `${activeAccent}66`;
                        }}
                        onMouseLeave={e => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.boxShadow = "0 32px 80px -20px rgba(59,47,37,0.15)";
                            el.style.borderColor = "rgba(255,255,255,0.15)";
                        }}
                    >
                        {activeFallbackImgSrc || mediaSrc ? (
                            <img
                                key={activeFallbackImgSrc || mediaSrc}
                                src={activeFallbackImgSrc || mediaSrc}
                                alt={title}
                                loading="lazy"
                                decoding="async"
                                fetchPriority="low"
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", aspectRatio: "16/9", animation: "image-fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}
                            />
                        ) : (
                            <div style={{
                                width: "100%", height: "100%", aspectRatio: "16/9",
                                background: `linear-gradient(160deg, rgba(30,20,12,0.97) 0%, ${activeGlow} 100%)`,
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
                            }}>
                                <div style={{
                                    width: 72, height: 72, borderRadius: 20,
                                    background: `${activeAccent}18`,
                                    border: `1.5px solid ${activeAccent}44`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke={activeAccent} strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                                    </svg>
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: `${activeAccent}99` }}>
                                    Coming Soon
                                </span>
                            </div>
                        )}

                        {/* Floating Demo Button Overlay */}
                        {activeDemoLink && (
                            <a href={activeDemoLink} target="_blank" rel="noopener noreferrer" style={{
                                position: "absolute",
                                bottom: 16,
                                left: 16,
                                background: "rgba(250, 247, 242, 0.85)",
                                backdropFilter: "blur(8px)",
                                WebkitBackdropFilter: "blur(8px)",
                                border: "1px solid rgba(56, 42, 36, 0.15)",
                                color: "#382a24",
                                fontSize: 12,
                                fontWeight: 800,
                                padding: "8px 16px",
                                borderRadius: 999,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                letterSpacing: "0.02em",
                                textDecoration: "none",
                                transition: "all 0.2s ease"
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = "rgba(250, 247, 242, 0.95)";
                                e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = "rgba(250, 247, 242, 0.85)";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                {activeDemoLabel}
                            </a>
                        )}
                    </div>


                    {/* Themes Section */}
                    {themes && (
                        <div style={{
                            marginTop: 16,
                            padding: "24px",
                            background: "rgba(255, 255, 255, 0.45)",
                            backdropFilter: "blur(20px)",
                            borderRadius: "var(--radius-lg)",
                            border: `1px solid ${activeAccent}15`,
                            boxShadow: `0 20px 40px -12px ${activeAccent}0D`,
                            transition: "all 0.5s ease"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                                <span style={{ fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: activeAccent, opacity: 0.8, transition: "color 0.5s ease" }}>
                                    {themesLabel}
                                </span>
                                <div style={{ flex: 1, height: 1, background: `${activeAccent}15`, transition: "background 0.5s ease" }} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                {/* Single Active Theme Display with Arrows */}
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <button
                                        onClick={() => {
                                            const prevIndex = selectedIndex === null ? 0 : selectedIndex;
                                            const newIndex = prevIndex === 0 ? themes.length - 1 : prevIndex - 1;
                                            setSelectedIndex(newIndex);
                                        }}
                                        style={{
                                            width: 36, height: 36, borderRadius: "50%",
                                            background: "#fff", border: `1px solid ${activeAccent}22`,
                                            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                                            color: activeAccent, flexShrink: 0,
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                            transition: "all 0.3s ease"
                                        }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; (e.currentTarget as HTMLElement).style.borderColor = activeAccent; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.borderColor = `${activeAccent}22`; }}
                                    >
                                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                    </button>

                                    <div style={{
                                        flex: 1,
                                        display: "flex", flexDirection: "column", gap: 2,
                                        textAlign: "center", alignItems: "center"
                                    }}>
                                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1d1d1f" }}>
                                            {selectedIndex !== null ? themes[selectedIndex].name : themes[0].name}
                                        </span>
                                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#6e5c53", opacity: 0.8, lineHeight: 1.4 }}>
                                            {selectedIndex !== null ? themes[selectedIndex].desc : themes[0].desc}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => {
                                            const prevIndex = selectedIndex === null ? 0 : selectedIndex;
                                            const newIndex = prevIndex === themes.length - 1 ? 0 : prevIndex + 1;
                                            setSelectedIndex(newIndex);
                                        }}
                                        style={{
                                            width: 36, height: 36, borderRadius: "50%",
                                            background: "#fff", border: `1px solid ${activeAccent}22`,
                                            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                                            color: activeAccent, flexShrink: 0,
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                            transition: "all 0.3s ease"
                                        }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; (e.currentTarget as HTMLElement).style.borderColor = activeAccent; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.borderColor = `${activeAccent}22`; }}
                                    >
                                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>

                                {/* Main Dots Indicator */}
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                                    {themes.map((theme, i) => {
                                        const hasExplicitColor = !!theme.color;
                                        const themeColor = hasExplicitColor ? theme.color! : "#d1d5db";
                                        const isSelected = (selectedIndex === null && i === 0) || selectedIndex === i;
                                        const dotColor = isSelected ? (hasExplicitColor ? themeColor : activeAccent) : (hasExplicitColor ? themeColor : "#d1d5db");
                                        return (
                                            <div
                                                key={i}
                                                onClick={() => setSelectedIndex(i)}
                                                style={{
                                                    width: 10, height: 10, borderRadius: "50%",
                                                    background: dotColor,
                                                    cursor: "pointer",
                                                    border: isSelected ? `2px solid #fff` : `none`,
                                                    boxShadow: isSelected ? `0 0 0 1.5px ${isSelected ? (hasExplicitColor ? themeColor : activeAccent) : "#d1d5db"}` : `none`,
                                                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                                    transform: isSelected ? "scale(1.4)" : "scale(1)",
                                                    opacity: isSelected ? 1 : 0.4
                                                }}
                                                title={theme.name}
                                            />
                                        )
                                    })}
                                </div>

                                {/* SubThemes Color Dots Indicator — only shown when subThemes have explicit color values */}
                                {(() => {
                                    const currentTheme = themes[selectedIndex !== null ? selectedIndex : 0];
                                    const hasColoredSubThemes = currentTheme?.subThemes && currentTheme.subThemes.length > 0 && currentTheme.subThemes.some(s => !!s.color);
                                    if (hasColoredSubThemes) {
                                        return (
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 16, gap: 8 }}>
                                                <span style={{ fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: activeAccent, opacity: 0.7, textTransform: "uppercase" }}>
                                                    Pilih Warna
                                                </span>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                                                    <button
                                                        onClick={() => {
                                                            const prevIndex = selectedSubThemeIndex;
                                                            const newIndex = prevIndex === 0 ? currentTheme.subThemes!.length - 1 : prevIndex - 1;
                                                            setSelectedSubThemeIndex(newIndex);
                                                        }}
                                                        style={{
                                                            width: 24, height: 24, borderRadius: "50%",
                                                            background: "transparent", border: "none",
                                                            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                                                            color: activeAccent, opacity: 0.6,
                                                            transition: "all 0.3s ease"
                                                        }}
                                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"; }}
                                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0.6"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                                                    >
                                                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                                    </button>

                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                                                        {currentTheme.subThemes?.map((subTheme, i) => {
                                                            const themeColor = subTheme.color || activeAccent;
                                                            const isSelected = selectedSubThemeIndex === i;
                                                            return (
                                                                <div
                                                                    key={i}
                                                                    onClick={() => setSelectedSubThemeIndex(i)}
                                                                    style={{
                                                                        width: 12, height: 12, borderRadius: "50%", background: themeColor,
                                                                        cursor: "pointer",
                                                                        border: isSelected ? `2px solid #fff` : `none`,
                                                                        boxShadow: isSelected ? `0 0 0 1.5px ${themeColor}` : `none`,
                                                                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                                                        transform: isSelected ? "scale(1.3)" : "scale(1)",
                                                                        opacity: isSelected ? 1 : 0.4
                                                                    }}
                                                                    title={subTheme.name}
                                                                />
                                                            )
                                                        })}
                                                    </div>

                                                    <button
                                                        onClick={() => {
                                                            const prevIndex = selectedSubThemeIndex;
                                                            const newIndex = prevIndex === currentTheme.subThemes!.length - 1 ? 0 : prevIndex + 1;
                                                            setSelectedSubThemeIndex(newIndex);
                                                        }}
                                                        style={{
                                                            width: 24, height: 24, borderRadius: "50%",
                                                            background: "transparent", border: "none",
                                                            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                                                            color: activeAccent, opacity: 0.6,
                                                            transition: "all 0.3s ease"
                                                        }}
                                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"; }}
                                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0.6"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                                                    >
                                                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>
                        </div>
                    )}


                </div>

                {/* Text Content */}
                <div className="hub-showcase-content" style={{
                    backgroundColor: activeAccent === '#c9184a' ? `${activeAccent}0D` : `${activeAccent}26`,
                    border: `1.5px solid ${activeAccent === '#c9184a' ? `${activeAccent}26` : `${activeAccent}40`}`,
                    borderRadius: "var(--radius-lg)",
                    padding: "clamp(32px, 4.5vw, 48px)",
                    boxShadow: `0 24px 48px -16px ${activeAccent === '#c9184a' ? `${activeAccent}14` : `${activeAccent}26`}`,
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                }}>
                    {/* Label Badge */}
                    <div style={{
                        alignSelf: "flex-start",
                        padding: "6px 14px", borderRadius: 999,
                        background: `${activeAccent}15`,
                        border: `1px solid ${activeAccent}33`,
                        color: activeAccent, fontSize: 9, fontWeight: 700, letterSpacing: "0.16em",
                        textTransform: "uppercase" as const,
                        marginBottom: 24,
                        transition: "all 0.5s ease"
                    }}>
                        {label}
                    </div>

                    <h3 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.8rem, 4vw, 2.7rem)",
                        fontWeight: 400,
                        color: activeAccent,
                        lineHeight: 1.15,
                        marginBottom: 16,
                        transition: "color 0.5s ease"
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
                            const isToggleFeature = feat.toLowerCase().includes("turn on / off") || feat.toLowerCase().includes("animasi interaktif") || feat.toLowerCase().includes("animasi visual");
                            const isMusicFeature = feat.toLowerCase().includes("music pilihan");
                            const isPageFeature = feat.toLowerCase().includes("berbeda") || feat.toLowerCase().includes("multi-tema") || feat.toLowerCase().includes("kustomisasi tema");
                            const isVoiceFeature = feat.toLowerCase().includes("rekam suara");
                            const isGalleryFeature = feat.toLowerCase().includes("galeri foto") || feat.toLowerCase().includes("kustomisasi galeri");
                            const isEnvelopeFeature = feat.toLowerCase().includes("amplop") || feat.toLowerCase().includes("diurus tim") || feat.toLowerCase().includes("dikerjakan langsung");
                            const isTypewriterFeature = feat.toLowerCase().includes("typewriter");
                            const isPremiumFeature = feat.toLowerCase().includes("premium & eksklusif") || feat.toLowerCase().includes("kuota");
                            const isPhotoVideoFeature = feat.toLowerCase().includes("foto / video");
                            const isAnonymousFeature = feat.toLowerCase().includes("anonymous");
                            const isRetroFeature = feat.toLowerCase().includes("retro windows") || feat.toLowerCase().includes("kaset");
                            const isNostalgiaGallery = feat.toLowerCase().includes("nostalgia");
                            const isMobileFeature = feat.toLowerCase().includes("mobile");
                            const isQuotesFeature = feat.toLowerCase().includes("quotes");

                            return (
                                <div key={feat} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#6e5c53", fontWeight: 500 }}>
                                    <div style={{ flexShrink: 0, width: 18, height: 18, borderRadius: "50%", background: `${activeAccent}22`, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.5s ease" }}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={activeAccent} strokeWidth={3} style={{ transition: "stroke 0.5s ease" }}>
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
                                            "--accent-color": activeAccent
                                        }}>
                                            <div style={{
                                                width: 11, height: 11, borderRadius: "50%",
                                                background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                                animation: "toggle-slide 4s infinite"
                                            }} />
                                        </div>
                                    )}

                                    {/* Animation: Premium Sparkle */}
                                    {isPremiumFeature && (
                                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, animation: "photo-shuffle 3s infinite ease-in-out" }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={activeAccent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "all 0.5s ease" }}>
                                                <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill={`${activeAccent}33`} />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Animation: Music Equalizer */}
                                    {isMusicFeature && (
                                        <div style={{ display: "inline-flex", alignItems: "flex-end", gap: 2, height: 14, paddingBottom: 1 }}>
                                            {[1, 2, 3].map(i => (
                                                <div key={i} style={{
                                                    width: 3,
                                                    background: activeAccent,
                                                    borderRadius: 1,
                                                    animation: `eq-bar ${0.6 + i * 0.2}s ease-in-out infinite`,
                                                    animationDelay: `${i * 0.15}s`,
                                                    transition: "background 0.5s ease"
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
                                                    background: activeAccent,
                                                    animation: `page-indicator 1.5s infinite`,
                                                    animationDelay: `${i * 0.3}s`,
                                                    transition: "background 0.5s ease"
                                                }} />
                                            ))}
                                        </div>
                                    )}

                                    {/* Animation: Voice Pulse */}
                                    {isVoiceFeature && (
                                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 14, height: 14, position: "relative" }}>
                                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: activeAccent, transition: "background 0.5s ease" }} />
                                            <div style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", border: `1.5px solid ${activeAccent}`, animation: "voice-pulse 1.8s infinite", transition: "border-color 0.5s ease" }} />
                                        </div>
                                    )}

                                    {/* Animation: Photo Shuffle */}
                                    {isGalleryFeature && (
                                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 14, position: "relative" }}>
                                            <div style={{ width: 10, height: 10, border: `1.5px solid ${activeAccent}`, borderRadius: 2, position: "absolute", zIndex: 1, background: activeAccent === "#faf7f2" ? "#2D141E" : "#faf7f2", transition: "border-color 0.5s ease" }} />
                                            <div style={{ width: 10, height: 10, border: `1.5px solid ${activeAccent}`, borderRadius: 2, position: "absolute", animation: "photo-shuffle 2s infinite ease-in-out", background: `transparent`, transition: "border-color 0.5s ease" }} />
                                        </div>
                                    )}

                                    {/* Animation: Envelope */}
                                    {isEnvelopeFeature && (
                                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", animation: "envelope-bob 2.5s infinite ease-in-out" }}>
                                            <svg width="15" height="12" viewBox="0 0 24 24" fill="none" stroke={activeAccent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.5s ease" }}>
                                                <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" />
                                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Animation: Anonymous */}
                                    {isAnonymousFeature && (
                                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", animation: "envelope-bob 3s infinite ease-in-out", opacity: 0.9 }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={activeAccent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.5s ease" }}>
                                                <path d="M3 10h18" />
                                                <path d="M7 10V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
                                                <circle cx="8" cy="16" r="3" />
                                                <circle cx="16" cy="16" r="3" />
                                                <path d="M11 16h2" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Animation: Retro Windows */}
                                    {isRetroFeature && (
                                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", animation: "envelope-bob 3s infinite ease-in-out" }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={activeAccent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.5s ease" }}>
                                                <rect x="2" y="3" width="20" height="14" rx="2" />
                                                <line x1="2" y1="7" x2="22" y2="7" />
                                                <circle cx="5" cy="5" r="0.8" fill={activeAccent} stroke="none" />
                                                <circle cx="7.5" cy="5" r="0.8" fill={activeAccent} stroke="none" />
                                                <circle cx="10" cy="5" r="0.8" fill={activeAccent} stroke="none" />
                                                <line x1="8" y1="21" x2="16" y2="21" />
                                                <line x1="12" y1="17" x2="12" y2="21" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Animation: Nostalgia Gallery */}
                                    {isNostalgiaGallery && (
                                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={activeAccent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.5s ease", animation: "photo-shuffle 2.5s ease-in-out infinite" }}>
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <polyline points="21 15 16 10 5 21" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Animation: Mobile */}
                                    {isMobileFeature && (
                                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", animation: "envelope-bob 2.8s infinite ease-in-out" }}>
                                            <svg width="12" height="16" viewBox="0 0 24 24" fill="none" stroke={activeAccent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.5s ease" }}>
                                                <rect x="5" y="2" width="14" height="20" rx="2" />
                                                <line x1="12" y1="18" x2="12" y2="18" strokeWidth="3" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Animation: Quotes */}
                                    {isQuotesFeature && (
                                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", animation: "envelope-bob 3s infinite ease-in-out", opacity: 0.9 }}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={activeAccent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.5s ease" }}>
                                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
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
                                                color: activeAccent,
                                                overflow: "hidden",
                                                whiteSpace: "nowrap",
                                                borderRight: `2px solid ${activeAccent}`,
                                                paddingRight: 1,
                                                animation: "typewriter-text 5s steps(17) infinite, typewriter-blink 0.5s step-end infinite alternate",
                                                transition: "color 0.5s ease, border-color 0.5s ease"
                                            }}>
                                                Dearest Lyxelle,
                                            </div>
                                        </div>
                                    )}

                                    {/* Animation: Photo / Video */}
                                    {isPhotoVideoFeature && (
                                        <div style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                                            {/* Film frame */}
                                            <svg width="15" height="13" viewBox="0 0 24 20" fill="none" stroke={activeAccent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.5s ease", animation: "photo-shuffle 3s ease-in-out infinite" }}>
                                                <rect x="1" y="1" width="22" height="18" rx="2" />
                                                <line x1="1" y1="6" x2="23" y2="6" />
                                                <line x1="1" y1="14" x2="23" y2="14" />
                                                <line x1="7" y1="1" x2="7" y2="6" />
                                                <line x1="17" y1="1" x2="17" y2="6" />
                                                <line x1="7" y1="14" x2="7" y2="19" />
                                                <line x1="17" y1="14" x2="17" y2="19" />
                                                <polygon points="9.5,8 9.5,12 14.5,10" fill={activeAccent} stroke="none" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="price-action-container" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginTop: "auto" }}>
                        {/* Order — always dark bg for Memoria (light accent), otherwise use accent */}
                        {onOrder ? (
                            <button onClick={onOrder} style={{
                                padding: "12px 28px", borderRadius: 999, border: "none", cursor: "pointer",
                                background: activeAccent === "#faf7f2" ? "#382a24" : activeAccent,
                                color: "#fff",
                                fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const,
                                textDecoration: "none", transition: "all 0.5s ease",
                                boxShadow: `0 8px 24px -4px rgba(29,24,22,0.2)`,
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                            }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                Order Gift
                            </button>
                        ) : (
                            <a href={href} target="_blank" rel="noopener noreferrer" style={{
                                padding: "12px 28px", borderRadius: 999,
                                background: activeAccent === "#faf7f2" ? "#382a24" : activeAccent,
                                color: "#fff",
                                fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const,
                                textDecoration: "none", transition: "all 0.5s ease",
                                boxShadow: `0 8px 24px -4px rgba(29,24,22,0.2)`,
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                            }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                Order Gift
                            </a>
                        )}

                        {/* Price badge — always readable */}
                        <div style={{
                            padding: "10px 20px", borderRadius: 999,
                            background: "rgba(255,255,255,0.9)",
                            border: "1px solid rgba(205,171,143,0.35)",
                            boxShadow: "inset 0 2px 4px rgba(255,255,255,0.8), 0 4px 12px rgba(205,171,143,0.15)",
                            fontSize: 12, fontWeight: 700, letterSpacing: "0.05em",
                            color: "#6e5c53",
                            display: "flex", alignItems: "center", gap: 8,
                            transition: "all 0.5s ease"
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                <line x1="7" y1="7" x2="7.01" y2="7" />
                            </svg>
                            {price}
                        </div>
                    </div>
                    {addonText && (
                        <div style={{
                            marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "5px 12px", borderRadius: 999,
                            background: "rgba(205,171,143,0.1)",
                            border: "1px dashed rgba(205,171,143,0.5)",
                            fontSize: 11, fontWeight: 600, color: "#8a7060",
                            fontFamily: "var(--font-sans)", letterSpacing: "0.02em"
                        }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            {addonText}
                        </div>
                    )}
                    {}
                </div>
            </div>
        </AnimatedSection>
    );
}

/* ═══════════════════════════════════════════════════════════
   MAIN HUB PAGE
   ═══════════════════════════════════════════════════════════ */
