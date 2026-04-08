"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────
   Animated Section (Intersection Observer)
   ───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   SVG Feature Icons
   ───────────────────────────────────────────── */
const FeatureIcons: Record<string, React.ReactNode> = {
    Login: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    ),
    Music: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
        </svg>
    ),
    "Galleries Memories": (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
        </svg>
    ),
    Wrapped: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12V20M12 4V20M20 12V20" />
        </svg>
    ),
    Letter: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <path d="M22 6l-10 7L2 6" />
        </svg>
    ),
    Invitation: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    ),
};

/* ─────────────────────────────────────────────
   6 Wrapped Pages Data
   ───────────────────────────────────────────── */
const WRAPPED_PAGES = [
    {
        title: "Login",
        description: "Halaman pembuka dengan pesan selamat datang dan sistem keamanan passcode yang romantis.",
        color: "#ff4d6d",
    },
    {
        title: "Music",
        description: "Alunan lagu favorit pilihanmu, lengkap dengan lirik yang mengetik secara emosional dan visualizer yang menari.",
        color: "#ff85a1",
    },
    {
        title: "Galleries Memories",
        description: "Momen SURPRISE! Gosok layar seperti scratch card untuk mengungkap foto kenangan dan ceritanya satu per satu.",
        color: "#ff4d6d",
    },
    {
        title: "Wrapped",
        description: "Rangkuman perjalanan kalian dalam angka — berapa menit bersama, top places, core memories, dan 'Vibe' unik hubungan.",
        color: "#c9184a",
    },
    {
        title: "Letter",
        description: "Amplop virtual yang terbuka dengan animasi, mengungkap surat cinta dengan kertas bergaris dan tanda tangan elegan.",
        color: "#ff85a1",
    },
    {
        title: "Invitation",
        description: "Penutup yang manis — ajakan 'Will you be my Valentine?' dengan karakter beruang lucu yang interaktif dan confetti.",
        color: "#ff4d6d",
    },
];

/* ─────────────────────────────────────────────
   Media URLs — isi video/image saat siap
   ───────────────────────────────────────────── */
const PAGE_MEDIA: Record<string, { video: string; image: string }> = {
    Login: { video: "https://cdn.for-you-always.my.id/1775677163497-m2sjw.mp4", image: "" },
    Music: { video: "https://cdn.for-you-always.my.id/1775677170491-x9o5bc.mp4", image: "" },
    "Galleries Memories": { video: "https://cdn.for-you-always.my.id/1775677161653-h3gapg.mp4", image: "" },
    Wrapped: { video: "https://cdn.for-you-always.my.id/1775677721850-q0w3xt.mp4", image: "" },
    Letter: { video: "https://cdn.for-you-always.my.id/1775677168482-ksz90k.mp4", image: "" },
    Invitation: { video: "https://cdn.for-you-always.my.id/1775677166373-4sk074.mp4", image: "" },
};

function WrappedStepCard({ number, title, description, icon }: { number: string; title: string; description: string; icon: React.ReactNode }) {
    return (
        <div style={{
            padding: "36px 32px",
            borderRadius: 24,
            background: "rgba(255, 77, 109, 0.05)",
            border: "1px solid var(--wrap-border)",
            display: "flex", flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            height: "100%",
        }}>
            {/* Ambient glow top right */}
            <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, background: "rgba(255, 77, 109, 0.1)", filter: "blur(40px)", borderRadius: "50%" }} />

            <div style={{
                width: 48, height: 48, borderRadius: 16, background: "rgba(255, 77, 109, 0.15)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "var(--wrap-accent-light)",
                marginBottom: 24, alignSelf: "flex-start",
                border: "1px solid rgba(255, 77, 109, 0.2)",
            }}>
                {icon}
            </div>

            <div style={{
                position: "absolute", top: 32, right: 32,
                fontFamily: "var(--wrap-font-display)", fontSize: 80, fontWeight: 700,
                color: "rgba(255, 77, 109, 0.15)", lineHeight: 0.8,
                pointerEvents: "none"
            }}>
                {number}
            </div>

            <h3 style={{ fontFamily: "var(--wrap-font-display)", fontSize: 24, fontWeight: 500, color: "var(--wrap-text-primary)", marginBottom: 16 }}>{title}</h3>
            <p style={{ fontSize: "0.95rem", color: "var(--wrap-text-secondary)", lineHeight: 1.7 }}>{description}</p>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   FEATURE SHOWCASE — 1:1 Arcade RoomShowcase Pattern
   ═══════════════════════════════════════════════════════════ */
function FeatureShowcase() {
    const [active, setActive] = useState(0);
    const [fading, setFading] = useState(false);
    const TOTAL_SLIDES = WRAPPED_PAGES.length;

    const goTo = (idx: number) => {
        if (idx === active || fading) return;
        setFading(true);
        setTimeout(() => {
            setActive(idx);
            setFading(false);
        }, 300);
    };

    const prev = () => goTo((active - 1 + TOTAL_SLIDES) % TOTAL_SLIDES);
    const next = () => goTo((active + 1) % TOTAL_SLIDES);

    const page = WRAPPED_PAGES[active];
    const media = PAGE_MEDIA[page.title];

    return (
        <section id="features" className="wrap-section" style={{ background: "rgba(255, 77, 109, 0.02)" }}>
            {/* Section Header */}
            <AnimatedSection>
                <div style={{ textAlign: "center", marginBottom: 56 }}>
                    <span className="wrap-badge" style={{ marginBottom: 24 }}>
                        6 Interactive Pages
                    </span>
                    <h2 className="wrap-heading-lg">
                        Setiap Halaman, Satu Kenangan.
                        <br />
                        <span className="wrap-italic" style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)" }}>
                            Enam ruang interaktif untuk merayakan perjalanan kalian.
                        </span>
                    </h2>
                </div>
            </AnimatedSection>

            {/* Slideshow */}
            <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
                {/* Media Frame */}
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "16/9",
                        borderRadius: "var(--wrap-radius-lg)",
                        overflow: "hidden",
                        background: "var(--wrap-surface-raised)",
                        border: "1.5px solid var(--wrap-border)",
                        boxShadow: "0 20px 50px -15px rgba(255, 77, 109, 0.1)",
                        transition: "opacity 0.3s ease",
                        opacity: fading ? 0 : 1,
                    }}
                >
                    {/* Vignette overlay */}
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 2,
                        pointerEvents: "none",
                        borderRadius: "var(--wrap-radius-lg)",
                        background: "radial-gradient(ellipse at center, transparent 55%, rgba(89,13,34,0.35) 100%)",
                    }} />

                    {media && (media.video || media.image) ? (
                        <video
                            ref={(el) => {
                                if (el) {
                                    el.defaultMuted = true;
                                    el.muted = true;
                                    el.playsInline = true;
                                    el.play().catch(() => {});
                                }
                            }}
                            key={media.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            poster={media.image}
                            x-webkit-airplay="deny"
                            disablePictureInPicture
                            controlsList="nodownload nofullscreen noremoteplayback"
                            style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
                        >
                            {media.video && <source src={media.video} type="video/mp4" />}
                        </video>
                    ) : (
                        <div style={{
                            width: "100%", height: "100%",
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center",
                            gap: 16,
                            background: `linear-gradient(135deg, ${page.color}12 0%, ${page.color}06 100%)`,
                        }}>
                            <div style={{
                                width: 72, height: 72,
                                borderRadius: 20,
                                background: `${page.color}18`,
                                border: `2px solid ${page.color}33`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: page.color,
                            }}>
                                {FeatureIcons[page.title]}
                            </div>
                            <span style={{
                                fontFamily: "var(--wrap-font-display)",
                                fontStyle: "italic",
                                fontSize: 13,
                                color: "var(--wrap-text-muted)",
                                letterSpacing: "0.05em",
                            }}>
                                Preview Coming Soon
                            </span>
                        </div>
                    )}

                    {/* Badge top-left */}
                    <div style={{
                        position: "absolute", top: 16, left: 16,
                        background: "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid var(--wrap-border)",
                        borderRadius: 999,
                        padding: "5px 14px",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--wrap-accent)",
                        letterSpacing: "0.08em",
                        zIndex: 3,
                    }}>
                        {String(active + 1).padStart(2, "0")} / {TOTAL_SLIDES}
                    </div>
                </div>

                {/* Info + Navigation */}
                <div style={{
                    marginTop: 28,
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    transition: "opacity 0.3s ease",
                    opacity: fading ? 0 : 1,
                }}>
                    {/* Prev */}
                    <button
                        onClick={prev}
                        aria-label="Previous Page"
                        style={{
                            flexShrink: 0,
                            width: 44, height: 44,
                            borderRadius: "50%",
                            border: "1.5px solid var(--wrap-border)",
                            background: "var(--wrap-surface-raised)",
                            color: "var(--wrap-text-primary)",
                            cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.25s ease",
                            boxShadow: "0 4px 16px rgba(255, 77, 109, 0.08)",
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = "var(--wrap-accent)";
                            (e.currentTarget as HTMLElement).style.color = "#fff";
                            (e.currentTarget as HTMLElement).style.borderColor = "var(--wrap-accent)";
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = "var(--wrap-surface-raised)";
                            (e.currentTarget as HTMLElement).style.color = "var(--wrap-text-primary)";
                            (e.currentTarget as HTMLElement).style.borderColor = "var(--wrap-border)";
                        }}
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Page Info */}
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <h3 style={{ fontFamily: "var(--wrap-font-display)", fontSize: 22, color: "var(--wrap-accent)", marginBottom: 8 }}>
                            {page.title} Page
                        </h3>
                        <p style={{ fontSize: 14, color: "var(--wrap-text-secondary)", margin: 0, lineHeight: 1.6 }}>
                            {page.description}
                        </p>
                    </div>

                    {/* Next */}
                    <button
                        onClick={next}
                        aria-label="Next Page"
                        style={{
                            flexShrink: 0,
                            width: 44, height: 44,
                            borderRadius: "50%",
                            border: "1.5px solid var(--wrap-border)",
                            background: "var(--wrap-surface-raised)",
                            color: "var(--wrap-text-primary)",
                            cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.25s ease",
                            boxShadow: "0 4px 16px rgba(255, 77, 109, 0.08)",
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = "var(--wrap-accent)";
                            (e.currentTarget as HTMLElement).style.color = "#fff";
                            (e.currentTarget as HTMLElement).style.borderColor = "var(--wrap-accent)";
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = "var(--wrap-surface-raised)";
                            (e.currentTarget as HTMLElement).style.color = "var(--wrap-text-primary)";
                            (e.currentTarget as HTMLElement).style.borderColor = "var(--wrap-border)";
                        }}
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Dot Navigation */}
                <div style={{
                    marginTop: 20,
                    display: "flex",
                    justifyContent: "center",
                    gap: 8,
                }}>
                    {WRAPPED_PAGES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            title={WRAPPED_PAGES[i].title}
                            style={{
                                width: i === active ? 24 : 8,
                                height: 8,
                                borderRadius: 999,
                                border: "none",
                                background: i === active
                                    ? "var(--wrap-accent)"
                                    : "rgba(255, 77, 109, 0.2)",
                                cursor: "pointer",
                                padding: 0,
                                transition: "all 0.3s ease",
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════
   TESTIMONIALS CAROUSEL — 1:1 Arcade Pattern
   ═══════════════════════════════════════════════════════════ */
const WRAPPED_TESTIMONI = [
    {
        quote: "Gila sih ini keren banget! Dia sampe nangis pas buka halaman suratnya. Worth every penny ♡",
        name: "Dinda",
        label: "Untuk Pacarnya",
        initial: "D",
    },
    {
        quote: "Scratch card-nya itu lho yang bikin kaget! Dia ga nyangka foto-foto kita muncul satu per satu. Thank you so much!",
        name: "Raka",
        label: "Untuk Pacarnya",
        initial: "R",
    },
    {
        quote: "Stats page-nya lucu parah, berasa Spotify Wrapped tapi versi relationship kita. Best gift ever!",
        name: "Mita",
        label: "Untuk Sahabatnya",
        initial: "M",
    },
];

function WrappedTestimoniCarousel() {
    const [active, setActive] = useState(0);
    const [fading, setFading] = useState(false);
    const total = WRAPPED_TESTIMONI.length;

    const goTo = (idx: number) => {
        if (idx === active || fading) return;
        setFading(true);
        setTimeout(() => { setActive(idx); setFading(false); }, 250);
    };
    const prev = () => goTo((active - 1 + total) % total);
    const next = () => goTo((active + 1) % total);
    const t = WRAPPED_TESTIMONI[active];

    return (
        <section className="wrap-section" style={{ background: "rgba(255, 77, 109, 0.03)", position: "relative", overflow: "hidden" }}>
            {/* Ambient blob */}
            <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "min(400px,60vw)", height: "min(400px,60vw)", borderRadius: "50%", background: "rgba(255, 77, 109, 0.06)", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px,4vw,24px)", position: "relative", zIndex: 1 }}>
                {/* Header */}
                <AnimatedSection>
                    <div style={{ textAlign: "center", marginBottom: 48 }}>
                        <span className="wrap-badge" style={{ marginBottom: 28 }}>
                            100+ Happy Customers
                        </span>
                        <h2 className="wrap-heading-lg">
                            Mereka Sudah Merasakan.
                            <br />
                            <span className="wrap-italic" style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)" }}>
                                Giliranmu Selanjutnya.
                            </span>
                        </h2>
                    </div>
                </AnimatedSection>

                {/* Social proof bar */}
                <AnimatedSection delay={100}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 56, flexWrap: "wrap" }}>
                        {[
                            { icon: <span style={{ color: "var(--wrap-accent-light)", fontSize: 14, letterSpacing: 2 }}>★★★★★</span>, text: "5.0 Rating" },
                            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--wrap-accent)" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>, text: "100+ Customer Puas" },
                            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--wrap-accent-light)" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>, text: "Trusted Since 2025" },
                        ].map((item, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--wrap-border)", flexShrink: 0 }} />}
                                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--wrap-text-muted)" }}>
                                    {item.icon}{item.text}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </AnimatedSection>

                {/* Carousel */}
                <AnimatedSection delay={200}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, maxWidth: 640, margin: "0 auto" }}>
                        {/* Prev */}
                        <button
                            onClick={prev}
                            aria-label="Previous"
                            style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--wrap-border)", background: "var(--wrap-surface-raised)", color: "var(--wrap-text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s ease", boxShadow: "0 4px 16px rgba(255, 77, 109, 0.08)" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--wrap-accent)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--wrap-surface-raised)"; (e.currentTarget as HTMLElement).style.color = "var(--wrap-text-primary)"; }}
                        >
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        {/* Card */}
                        <div
                            style={{ flex: 1, background: "var(--wrap-surface-raised)", border: "1.5px solid var(--wrap-border)", borderRadius: "var(--wrap-radius-lg)", overflow: "hidden", boxShadow: "0 4px 16px rgba(255, 77, 109, 0.06)", transition: "opacity 0.25s ease", opacity: fading ? 0 : 1 }}
                        >
                            <div style={{ padding: "36px 32px 32px" }}>
                                {/* Quote mark */}
                                <div style={{ fontFamily: "var(--wrap-font-display)", fontSize: 64, lineHeight: 1, color: "var(--wrap-accent-light)", opacity: 0.4, marginBottom: 8, userSelect: "none" as const }}>
                                    &ldquo;
                                </div>
                                <p style={{ fontFamily: "var(--wrap-font-display)", fontStyle: "italic", fontSize: "1.15rem", color: "var(--wrap-text-secondary)", lineHeight: 1.75, marginBottom: 32 }}>
                                    {t.quote}
                                </p>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        {/* Avatar */}
                                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--wrap-accent-glow)", border: "1.5px solid var(--wrap-border)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--wrap-font-display)", fontStyle: "italic", fontSize: 16, fontWeight: 600, color: "var(--wrap-accent)", flexShrink: 0 }}>
                                            {t.initial}
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: "var(--wrap-font-display)", fontStyle: "italic", fontSize: 15, fontWeight: 600, color: "var(--wrap-text-primary)", marginBottom: 2 }}>
                                                {t.name}
                                            </div>
                                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--wrap-accent)" }}>
                                                {t.label}
                                            </div>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--wrap-text-muted)" }}>
                                        {active + 1} / {total}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Next */}
                        <button
                            onClick={next}
                            aria-label="Next"
                            style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--wrap-border)", background: "var(--wrap-surface-raised)", color: "var(--wrap-text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s ease", boxShadow: "0 4px 16px rgba(255, 77, 109, 0.08)" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--wrap-accent)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--wrap-surface-raised)"; (e.currentTarget as HTMLElement).style.color = "var(--wrap-text-primary)"; }}
                        >
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>

                    {/* Dot nav */}
                    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
                        {WRAPPED_TESTIMONI.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                style={{ width: i === active ? 24 : 8, height: 8, borderRadius: 999, border: "none", background: i === active ? "var(--wrap-accent)" : "var(--wrap-border)", cursor: "pointer", padding: 0, transition: "all 0.3s ease" }}
                            />
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════
   WRAPPED LANDING PAGE
   ═══════════════════════════════════════════════════════════ */
export default function WrappedLandingPage() {
    return (
        <div className="wrapped-page">


            {/* ── Hero Section ── */}
            <section className="wrap-section" style={{ paddingTop: 180, textAlign: "center" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
                    <AnimatedSection>
                        <span className="wrap-badge" style={{ marginBottom: 32, padding: "8px 20px" }}>
                            Memories Wrapped
                        </span>
                        <h1 className="wrap-heading-xl" style={{ marginBottom: 28 }}>
                            Kilas Balik Perjalananmu.
                            <br />
                            <span className="wrap-italic" style={{ color: "var(--wrap-accent-light)", fontWeight: 300 }}>Abadikan Cerita dalam Setiap Detik.</span>
                        </h1>
                        <p style={{ fontSize: "1.1rem", color: "var(--wrap-text-secondary)", lineHeight: 1.8, maxWidth: 640, margin: "0 auto 48px" }}>
                            Your journey, wrapped. Rangkum setiap detik memori, lagu, dan cerita kalian dalam satu kado digital abadi.
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
                            <a href="#order" className="wrap-btn-primary">
                                Pesan Sekarang
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </a>
                            <a href="#features" style={{
                                display: "inline-flex", padding: "18px 32px", border: "1px solid var(--wrap-border)",
                                borderRadius: 16, color: "var(--wrap-text-primary)", fontWeight: 600, textDecoration: "none",
                                transition: "all 0.3s ease", background: "var(--wrap-surface)"
                            }}
                                onMouseEnter={e => { (e.currentTarget.style.background = "var(--wrap-surface-raised)"); }}
                                onMouseLeave={e => { (e.currentTarget.style.background = "var(--wrap-surface)"); }}
                            >
                                Jelajahi Fitur
                            </a>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── Feature Showcase (Arcade-style) ── */}
            <FeatureShowcase />

            {/* ── Cara Kerja ── */}
            <section id="cara-kerja" className="wrap-section" style={{ position: "relative", overflow: "hidden" }}>
                {/* Ambient decorations */}
                <div style={{ position: "absolute", top: 0, right: 0, width: "min(500px, 80vw)", height: "min(500px, 80vw)", background: "rgba(255,77,109,0.05)", transform: "translate(10%, -30%)", filter: "blur(100px)", borderRadius: "50%", pointerEvents: "none" }} />

                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px, 4vw, 24px)", boxSizing: "border-box", width: "100%" }}>
                    <AnimatedSection>
                        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 64px auto" }}>
                            <span className="wrap-badge" style={{ marginBottom: 20, display: "inline-block" }}>
                                Cara Kerja
                            </span>
                            <h2 className="wrap-heading-lg" style={{ marginBottom: 16, lineHeight: 1.15 }}>
                                Sempurnakan Momen
                                <br />
                                <span className="wrap-italic" style={{ color: "var(--wrap-accent)", fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)" }}>Melalui Sentuhan Digital.</span>
                            </h2>
                            <p style={{ color: "var(--wrap-text-secondary)", lineHeight: 1.6 }}>
                                Hadirkan kebahagiaan dalam genggaman dengan proses yang dirancang khusus untuk setiap cerita berharga Anda.
                            </p>
                        </div>
                    </AnimatedSection>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 24 }}>
                        <AnimatedSection delay={100}>
                            <WrappedStepCard
                                number="1"
                                title="Pesan & Dapat Akses"
                                description="Hubungi via WhatsApp, pilih paket yang sesuai, dan dapatkan link studio editor eksklusif milikmu."
                                icon={
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                        <path d="M8 10h8M8 13h5" opacity="0.6" />
                                    </svg>
                                }
                            />
                        </AnimatedSection>
                        <AnimatedSection delay={200}>
                            <WrappedStepCard
                                number="2"
                                title="Kustomisasi Sendiri"
                                description="Isi semua 6 halaman interaktif sesuai keinginanmu - foto, musik, pesan, dan lainnya. Privat, bebas, sepenuhnya milikmu."
                                icon={
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                                    </svg>
                                }
                            />
                        </AnimatedSection>
                        <AnimatedSection delay={300}>
                            <WrappedStepCard
                                number="3"
                                title="Publish & Kejutkan"
                                description="Setelah selesai, publish dengan satu klik - lalu kirim link Wrapped ke orang tersayang dan biarkan mereka terkejut."
                                icon={
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 12v10H4V12" />
                                        <path d="M22 7H2v5h20V7z" />
                                        <path d="M12 22V7" />
                                        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                                        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                                    </svg>
                                }
                            />
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* ── Testimonials (Arcade-style) ── */}
            <WrappedTestimoniCarousel />

            {/* ── Final CTA & Pricing ── */}
            <section id="order" className="wrap-section wrap-dark-section" style={{ textAlign: "center" }}>
                <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
                    <AnimatedSection>
                        <span style={{
                            display: "inline-block",
                            padding: "6px 16px",
                            background: "rgba(255, 77, 109, 0.15)",
                            border: "1px solid rgba(255, 77, 109, 0.3)",
                            borderRadius: 999,
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "var(--wrap-accent-light)",
                            marginBottom: 36,
                        }}>
                            Harga Spesial
                        </span>
                    </AnimatedSection>

                    <AnimatedSection delay={100}>
                        <h2 style={{
                            fontFamily: "var(--wrap-font-display)",
                            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                            fontWeight: 400,
                            color: "#fff0f3",
                            lineHeight: 1.15,
                            marginBottom: 20,
                        }}>
                            Satu Hadiah.
                            <br />
                            <span style={{ fontStyle: "italic", color: "var(--wrap-accent-light)" }}>
                                Sejuta Kenangan.
                            </span>
                        </h2>
                    </AnimatedSection>

                    <AnimatedSection delay={200}>
                        <p style={{
                            fontSize: "1.05rem",
                            color: "rgba(255, 240, 243, 0.55)",
                            lineHeight: 1.7,
                            maxWidth: 460,
                            margin: "0 auto 48px",
                        }}>
                            Cukup sekali klik untuk membuat mereka tersenyum. Tanpa langganan. Akses selamanya.
                        </p>
                    </AnimatedSection>

                    {/* Pricing Card */}
                    <AnimatedSection delay={300}>
                        <div style={{
                            maxWidth: 420,
                            margin: "0 auto 48px",
                            padding: "44px 36px",
                            borderRadius: "var(--wrap-radius-lg)",
                            background: "rgba(255, 255, 255, 0.08)",
                            border: "1.5px solid rgba(255, 77, 109, 0.3)",
                            backdropFilter: "blur(16px)",
                            WebkitBackdropFilter: "blur(16px)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "left",
                            position: "relative",
                        }}>
                            {/* Price */}
                            <div style={{ marginBottom: 32, textAlign: "center", width: "100%" }}>
                                <span style={{ fontFamily: "var(--wrap-font-display)", fontSize: 18, color: "rgba(255,240,243,0.4)" }}>Rp </span>
                                <span style={{ fontFamily: "var(--wrap-font-display)", fontSize: 64, fontWeight: 600, color: "#fff0f3", letterSpacing: "-0.03em" }}>20</span>
                                <span style={{ fontFamily: "var(--wrap-font-display)", fontSize: 32, fontWeight: 600, color: "#fff0f3" }}>.000</span>
                            </div>

                            {/* Feature list */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32, width: "100%" }}>
                                {[
                                    "6 Halaman Interaktif (Bebas Turn ON/OFF)",
                                    "Memories Wrapped Recap",
                                    "Music Player & Lirik",
                                    "Galleries Memories",
                                    "Surat Cinta Digital",
                                    "Jadi dalam Hitungan Menit",
                                ].map((feat) => (
                                    <div key={feat} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 13, color: "rgba(255,240,243,0.8)", lineHeight: 1.5 }}>
                                        <div style={{ flexShrink: 0, width: 18, height: 18, borderRadius: "50%", background: "rgba(255, 77, 109, 0.2)", border: "1px solid rgba(255, 77, 109, 0.35)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--wrap-accent-light)" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        {feat}
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <a
                                href="https://wa.me/6281381543981?text=Halo%20Digital%20Atelier!%20Saya%20ingin%20memesan%20*Wrapped%20Edition*."
                                className="wrap-btn-primary"
                                style={{ width: "100%", justifyContent: "center" }}
                            >
                                Pesan Sekarang
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
                    </AnimatedSection>

                    {/* Trust badges */}
                    <AnimatedSection delay={400}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
                            {["STUDIO SELF-SERVE", "LIFETIME ACCESS", "PASSWORD PROTECTED"].map((badge, i) => (
                                <React.Fragment key={badge}>
                                    {i > 0 && (
                                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255, 77, 109, 0.4)" }} />
                                    )}
                                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,240,243,0.35)" }}>
                                        {badge}
                                    </span>
                                </React.Fragment>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer style={{ padding: "60px 24px", textAlign: "center", borderTop: "1px solid var(--wrap-border)" }}>
                <Link href="/" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 20 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 12, overflow: "hidden", border: "1px solid var(--wrap-border)" }}>
                        <img src="/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <span style={{ fontFamily: "var(--wrap-font-display)", fontStyle: "italic", fontWeight: 600, fontSize: 15, color: "var(--wrap-text-primary)" }}>
                        For you, Always.
                    </span>
                </Link>
                <p style={{ fontSize: 12, color: "var(--wrap-text-muted)" }}>© 2026 For you, Always. — Digital Atelier</p>
            </footer>

            {/* ── Floating WhatsApp Button ── */}
            <a
                href="https://wa.me/6281381543981?text=Halo%20Digital%20Atelier!%20Saya%20ingin%20bertanya%20tentang%20Memories%20Wrapped."
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
                    background: "var(--wrap-accent)", // match wrapped theme
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 24px -4px rgba(201, 24, 74, 0.4)",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                }}
            >
                <svg width="26" height="26" fill="white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </a>
        </div>
    );
}
