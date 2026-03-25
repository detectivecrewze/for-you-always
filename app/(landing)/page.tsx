"use client";

import React, { useEffect, useState, useRef } from "react";

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
   Step Card (Cara Kerja)
   ───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   Feature Highlight Card
   ───────────────────────────────────────────── */
function FeatureCard({
    icon,
    title,
    description,
    index,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    index: number;
}) {
    return (
        <AnimatedSection delay={index * 120}>
            <div
                style={{
                    display: "flex",
                    gap: 24,
                    alignItems: "flex-start",
                    padding: "36px 32px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(255,252,247,0.5)",
                    border: "1px solid var(--border)",
                    transition: "all 0.5s ease",
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--bg-card)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-soft)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,252,247,0.5)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
            >
                <div
                    style={{
                        flexShrink: 0,
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: "var(--accent-glow)",
                        border: "1px solid var(--border-warm)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--accent)",
                    }}
                >
                    {icon}
                </div>
                <div>
                    <h4
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.25rem",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            marginBottom: 8,
                        }}
                    >
                        {title}
                    </h4>
                    <p className="body-text" style={{ fontSize: "0.88rem", margin: 0 }}>
                        {description}
                    </p>
                </div>
            </div>
        </AnimatedSection>
    );
}

/* ─────────────────────────────────────────────
   Product Card (Hero)
   ───────────────────────────────────────────── */
function ProductCard({
    label,
    title,
    description,
    price,
    gifSrc,
    ctaHref,
    ctaLabel,
    isPlaceholder,
    isNew,
    delay,
}: {
    label: string;
    title: string;
    description: string;
    price: string;
    gifSrc: string;
    ctaHref: string;
    ctaLabel: string;
    isPlaceholder?: boolean;
    isNew?: boolean;
    delay?: number;
}) {
    return (
        <AnimatedSection delay={delay || 0}>
            <div
                className="glass-surface"
                style={{
                    padding: 0,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* GIF / Placeholder */}
                <div
                    style={{
                        position: "relative",
                        background: "var(--bg-deep)",
                        aspectRatio: "4/5",
                        overflow: "hidden",
                    }}
                >
                    {isPlaceholder ? (
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 16,
                                background: "linear-gradient(135deg, #3b2f25 0%, #2c2118 100%)",
                            }}
                        >
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,124,0.4)" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span
                                style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: 11,
                                    fontWeight: 600,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase" as const,
                                    color: "rgba(201,168,124,0.4)",
                                }}
                            >
                                Coming Soon
                            </span>
                        </div>
                    ) : (
                        <img
                            src={gifSrc}
                            alt={title}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    )}
                    {/* Overlay */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)",
                            pointerEvents: "none",
                        }}
                    />
                    {/* New Badge */}
                    {isNew && (
                        <div
                            style={{
                                position: "absolute",
                                top: 16,
                                left: 16,
                                padding: "6px 14px",
                                borderRadius: 999,
                                background: "rgba(166, 124, 82, 0.9)",
                                backdropFilter: "blur(8px)",
                                color: "#fff",
                                fontSize: 12,
                                fontWeight: 700,
                                letterSpacing: "0.04em",
                                zIndex: 10,
                            }}
                        >
                            NEW
                        </div>
                    )}
                    {/* Price Badge */}
                    <div
                        style={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            padding: "6px 14px",
                            borderRadius: 999,
                            background: "rgba(166, 124, 82, 0.9)",
                            backdropFilter: "blur(8px)",
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                        }}
                    >
                        {price}
                    </div>
                </div>

                {/* Text Info */}
                <div style={{ padding: "28px 28px 32px" }}>
                    <span
                        className="label-text"
                        style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            background: "var(--accent-glow)",
                            border: "1px solid var(--border-warm)",
                            borderRadius: 999,
                            marginBottom: 16,
                            color: "var(--accent)",
                        }}
                    >
                        {label}
                    </span>
                    <h3
                        className="heading-md"
                        style={{ marginBottom: 8, fontSize: "1.35rem" }}
                    >
                        {title}
                    </h3>
                    <p
                        className="body-text"
                        style={{ fontSize: "0.88rem", marginBottom: 24 }}
                    >
                        {description}
                    </p>
                    <a href={ctaHref} className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
                        {ctaLabel}
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </AnimatedSection>
    );
}



/* ─────────────────────────────────────────────
   useIsMobile Hook
   ───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   Testimoni Carousel
   ───────────────────────────────────────────── */
const TESTIMONI_DATA = [
    {
        quote: "Lucuu banget, gemes deh! Makasih banyak ya kak, hasilnya melebihi ekspektasi aku ♡",
        name: "Nabila",
        label: "Untuk Pacarnya",
        initial: "N",
    },
    {
        quote: "Makasih ya kak! Cowo aku terharu banget sama surprise aku, dia sama sekali ga expect bakal disurprise kayak gini 🤲🥹",
        name: "Arini",
        label: "Untuk Pacarnya",
        initial: "A",
    },
    {
        quote: "Huhuu makasih kak, lucuu banget hasilnya! Next time aku pasti bakal order di sini lagi pokoknya!",
        name: "Rara",
        label: "Untuk Sahabatnya",
        initial: "R",
    },
    {
        quote: "Kakak makasih banyak yaa, adek aku seneng banget pas buka hadiah ini! Katanya unik dan beda dari kado biasa, lucuu pula 🥹♡",
        name: "Sinta",
        label: "Untuk Adiknya",
        initial: "S",
    },
    {
        quote: "Makasih kak, mama aku sampe terharu lho pas liat fotonya satu-satu! Bilang ini kado paling berkesan yang pernah dia terima ♡",
        name: "Dinda",
        label: "Untuk Mamahnya",
        initial: "D",
    },
];

/* ─────────────────────────────────────────────
   Studio Preview Section
   ───────────────────────────────────────────── */
function StudioPreview() {
    const videoRef = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.load();
                    video.play().catch(() => { });
                } else {
                    video.pause();
                }
            },
            { threshold: 0.2 }
        );
        observer.observe(video);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            style={{
                padding: "120px 0",
                position: "relative",
                background: "var(--bg-warm)",
                overflow: "hidden",
            }}
        >
            {/* Ambient blob */}
            <div style={{ position: "absolute", top: "-10%", left: "-5%", width: "min(500px, 70vw)", height: "min(500px, 70vw)", borderRadius: "50%", background: "rgba(166,124,82,0.06)", filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }} />

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px, 4vw, 24px)", position: "relative", zIndex: 1 }}>

                {/* Header */}
                <AnimatedSection>
                    <div style={{ textAlign: "center", marginBottom: 64 }}>
                        <span className="label-text" style={{ display: "inline-block", padding: "6px 16px", background: "var(--accent-glow)", border: "1px solid var(--border-warm)", borderRadius: 999, marginBottom: 28, color: "var(--accent)" }}>
                            Studio Editor
                        </span>
                        <h2 className="heading-lg" style={{ marginBottom: 16 }}>
                            Kamu yang Buat Sendiri.
                            <br />
                            <span className="italic-accent">Semudah Ini.</span>
                        </h2>
                        <p className="body-text" style={{ maxWidth: 520, margin: "0 auto", fontSize: "1rem" }}>
                            Tidak perlu skill coding. Tidak perlu nunggu admin. Isi sendiri, publish sendiri, kirim sendiri — dalam hitungan menit.
                        </p>
                    </div>
                </AnimatedSection>

                {/* Video Preview */}
                <AnimatedSection delay={150}>
                    <div
                        style={{
                            maxWidth: 960,
                            margin: "0 auto 56px",
                            borderRadius: "var(--radius-lg)",
                            overflow: "hidden",
                            border: "1.5px solid var(--border-warm)",
                            boxShadow: "var(--shadow-elevated)",
                            background: "var(--bg-deep)",
                            aspectRatio: "2/1",
                        }}
                    >
                        <video
                            ref={videoRef}
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            x-webkit-airplay="deny"
                            disablePictureInPicture
                            controlsList="nodownload nofullscreen noremoteplayback"
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        >
                            <source src="https://cdn.for-you-always.my.id/1773611293880-nh6g6w.mp4" type="video/mp4" />
                        </video>
                    </div>
                </AnimatedSection>

                {/* Feature pills */}
                <AnimatedSection delay={250}>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
                        {[
                            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>, text: "Tidak perlu skill coding" },
                            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>, text: "Selesai dalam menit" },
                            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>, text: "Privat & aman" },
                            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>, text: "Bisa preview sebelum kirim" },
                            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>, text: "Upload foto bebas" },
                            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 19V6l12-3v13M9 19c0 1.1-1.34 2-3 2s-3-.9-3-2 1.34-2 3-2 3 .9 3 2zm12-3c0 1.1-1.34 2-3 2s-3-.9-3-2 1.34-2 3-2 3 .9 3 2z" /></svg>, text: "Pilih musik sendiri" },
                            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>, text: "Revisi bebas setelah publish" },
                        ].map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "10px 18px",
                                    borderRadius: 999,
                                    background: "var(--bg-card)",
                                    border: "1px solid var(--border)",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "var(--text-secondary)",
                                    boxShadow: "var(--shadow-soft)",
                                }}
                            >
                                <span style={{ color: "var(--accent)", flexShrink: 0 }}>{item.icon}</span>
                                {item.text}
                            </div>
                        ))}
                    </div>
                </AnimatedSection>

            </div>
        </section>
    );
}

function TestimoniCarousel() {
    const [active, setActive] = useState(0);
    const [fading, setFading] = useState(false);
    const total = TESTIMONI_DATA.length;

    const goTo = (idx: number) => {
        if (idx === active || fading) return;
        setFading(true);
        setTimeout(() => {
            setActive(idx);
            setFading(false);
        }, 250);
    };

    const prev = () => goTo((active - 1 + total) % total);
    const next = () => goTo((active + 1) % total);
    const t = TESTIMONI_DATA[active];

    return (
        <section style={{ padding: "120px 0", position: "relative", overflow: "hidden", background: "var(--bg)" }}>
            {/* Ambient blob */}
            <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "min(400px,60vw)", height: "min(400px,60vw)", borderRadius: "50%", background: "rgba(166,124,82,0.05)", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px,4vw,24px)", position: "relative", zIndex: 1 }}>

                {/* Header */}
                <AnimatedSection>
                    <div style={{ textAlign: "center", marginBottom: 48 }}>
                        <span className="label-text" style={{ display: "inline-block", padding: "6px 16px", background: "var(--accent-glow)", border: "1px solid var(--border-warm)", borderRadius: 999, marginBottom: 28, color: "var(--accent)" }}>
                            100+ Happy Customers
                        </span>
                        <h2 className="heading-lg" style={{ marginBottom: 0 }}>
                            Mereka Sudah Merasakan.
                            <br />
                            <span className="italic-accent">Giliranmu Selanjutnya.</span>
                        </h2>
                    </div>
                </AnimatedSection>

                {/* Social proof bar */}
                <AnimatedSection delay={100}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 56, flexWrap: "wrap" }}>
                        {[
                            { icon: <span style={{ color: "var(--accent-light)", fontSize: 14, letterSpacing: 2 }}>★★★★★</span>, text: "5.0 Rating" },
                            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>, text: "100+ Customer Puas" },
                            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>, text: "Trusted Since 2025" },
                        ].map((item, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent-light)", opacity: 0.4, flexShrink: 0 }} />}
                                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--text-muted)" }}>
                                    {item.icon}{item.text}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </AnimatedSection>

                {/* Carousel */}
                <AnimatedSection delay={200}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, maxWidth: 640, margin: "0 auto" }}>

                        {/* Prev button */}
                        <button
                            onClick={prev}
                            aria-label="Previous"
                            style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--border-warm)", background: "var(--bg-card)", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s ease", boxShadow: "var(--shadow-soft)" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-card)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-warm)"; }}
                        >
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Card — no photo, quote only */}
                        <div
                            className="glass-surface"
                            style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", transition: "opacity 0.25s ease", opacity: fading ? 0 : 1 }}
                        >
                            <div style={{ padding: "36px 32px 32px" }}>
                                {/* Quote mark */}
                                <div style={{ fontFamily: "var(--font-display)", fontSize: 64, lineHeight: 1, color: "var(--accent-light)", opacity: 0.35, marginBottom: 8, userSelect: "none" }}>
                                    &ldquo;
                                </div>
                                <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.15rem", color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 32 }}>
                                    {t.quote}
                                </p>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent-glow)", border: "1px solid var(--border-warm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "var(--accent)", flexShrink: 0 }}>
                                            {t.initial}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>
                                                {t.name}
                                            </div>
                                            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.05em" }}>
                                                {t.label}
                                            </div>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--text-muted)" }}>
                                        {active + 1} / {total}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Next button */}
                        <button
                            onClick={next}
                            aria-label="Next"
                            style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--border-warm)", background: "var(--bg-card)", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s ease", boxShadow: "var(--shadow-soft)" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-card)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-warm)"; }}
                        >
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Dot navigation */}
                    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
                        {TESTIMONI_DATA.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                style={{ width: i === active ? 24 : 8, height: 8, borderRadius: 999, border: "none", background: i === active ? "var(--accent)" : "var(--border-warm)", cursor: "pointer", padding: 0, transition: "all 0.3s ease" }}
                            />
                        ))}
                    </div>
                </AnimatedSection>

            </div>
        </section>
    );
}

export default function VoicesLandingPage() {
    const isMobile = useIsMobile();
    return (
        <div style={{ minHeight: "100vh", position: "relative", overflowX: "clip", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
            {/* ── Background Ambient Blobs ── */}
            <div
                style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: -1 }}
            >
                <div
                    className="ambient-blob"
                    style={{
                        top: "-8%",
                        left: "-8%",
                        width: "50%",
                        height: "50%",
                        background: "rgba(201, 168, 124, 0.10)",
                    }}
                />
                <div
                    className="ambient-blob"
                    style={{
                        top: "30%",
                        right: "-10%",
                        width: "45%",
                        height: "45%",
                        background: "rgba(166, 124, 82, 0.06)",
                    }}
                />
                <div
                    className="ambient-blob"
                    style={{
                        bottom: "-10%",
                        left: "20%",
                        width: "50%",
                        height: "50%",
                        background: "rgba(122, 90, 58, 0.05)",
                    }}
                />
            </div>



            {/* ════════════════════════════════════
          HERO SECTION
         ════════════════════════════════════ */}
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
                    {/* Text Content */}
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
                                <span
                                    style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: "50%",
                                        background: "var(--accent)",
                                        animation: "pulse-warm 2s infinite",
                                    }}
                                />
                                Voices. Gift — Digital Memoir
                            </div>
                        </AnimatedSection>

                        <AnimatedSection delay={100}>
                            <h1 className="heading-xl" style={{
                                marginBottom: 28,
                                maxWidth: "100%",
                                wordWrap: "break-word"
                            }}>
                                Rangkai Memori.
                                <br />
                                <span className="italic-accent">Abadikan Selamanya.</span>
                            </h1>
                        </AnimatedSection>

                        <AnimatedSection delay={200}>
                            <p
                                className="body-text"
                                style={{
                                    fontSize: "1.1rem",
                                    maxWidth: "100%",
                                    width: "100%",
                                    margin: "0 auto 40px",
                                    padding: "0 10px",
                                    boxSizing: "border-box"
                                }}
                            >
                                Sebuah mesin waktu digital. Rangkai foto-foto penuh memori dan
                                rekam pesan suara Anda sendiri menjadi kado personal yang{" "}
                                <strong
                                    className="italic-accent"
                                    style={{
                                        fontWeight: 600,
                                        color: "var(--accent)"
                                    }}
                                >
                                    sangat istimewa.
                                </strong>
                            </p>
                        </AnimatedSection>

                        <AnimatedSection delay={300}>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 16,
                                    alignItems: "center",
                                    width: "100%",
                                    maxWidth: "100%",
                                }}
                            >
                                <a href="#pesan" className="btn-primary" style={{ width: "100%", maxWidth: "300px" }}>
                                    <span>Mulai Merangkai Kenangan</span>
                                    <svg
                                        width="18"
                                        height="18"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        style={{ position: "relative", zIndex: 1 }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                </a>
                                <a href="#showcase" className="btn-secondary" style={{ width: "100%", maxWidth: "300px" }}>
                                    Lihat Lebih Dekat
                                    <svg
                                        width="16"
                                        height="16"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </AnimatedSection>
                    </div>

                    {/* Hero Product Cards */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))",
                            gap: 24,
                            maxWidth: 800,
                            margin: "0 auto",
                            width: "100%",
                        }}
                    >
                        <ProductCard
                            label="Voices Gift"
                            title="Kado Suara & Foto"
                            description="Rangkai foto kenangan + rekam pesan suara pribadimu. Lengkap dengan musik latar pilihan."
                            price="Mulai Rp 10.000"
                            gifSrc="https://bpahzgewtgfjwobjrpdk.supabase.co/storage/v1/object/public/assets/voices.gif"
                            ctaHref="#showcase"
                            ctaLabel="Lihat Detail"
                            delay={400}
                        />
                        <ProductCard
                            label="Arcade Edition"
                            title="10 Rooms of Memories"
                            description="Kado digital interaktif dengan 10 ruangan unik — dari Quiz, Journey, Atlas, hingga Star Catcher."
                            price="Rp 20.000"
                            gifSrc="https://cdn.for-you-always.my.id/1773426766916-7k8labq.gif"
                            ctaHref="/arcade"
                            ctaLabel="Lihat Detail"
                            isNew
                            delay={550}
                        />
                    </div>

                </div>
            </section >

            {/* ════════════════════════════════════
          SHOWCASE — Art of Sound
         ════════════════════════════════════ */}
            <section
                id="showcase"
                className="section-spacing"
                style={{ position: "relative", background: "var(--bg-warm)", overflow: "hidden" }}
            >
                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px, 4vw, 24px)", boxSizing: "border-box", width: "100%" }}>
                    {/* Section Header */}
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
                                Bukan Sekadar Kado.
                                <br />
                                <span className="italic-accent">
                                    Ini Kapsul Waktu Digital.
                                </span>
                            </h2>
                        </div>
                    </AnimatedSection>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
                            gap: 20,
                        }}
                    >
                        <FeatureCard
                            index={0}
                            icon={
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                    <circle cx="12" cy="12" r="10" />
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                                </svg>
                            }
                            title="The Glass Viewport"
                            description="Bingkai interaktif yang memutar foto kenangan satu per satu. Lengkap dengan teks cerita di setiap momen."
                        />
                        <FeatureCard
                            index={1}
                            icon={
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                                </svg>
                            }
                            title="The Golden Waveform"
                            description="
Gelombang emas yang bergerak mengikuti suara dan musik latar pilihanmu. Setiap kata terasa lebih hidup."
                        />
                        <FeatureCard
                            index={2}
                            icon={
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            }
                            title="The Interactive Touch"
                            description="Setiap tema punya cara uniknya sendiri — putar tuas, atau balik foto dan temukan pesan tersembunyi di baliknya."
                        />
                    </div>

                    {/* Cinematic Quote */}
                    <AnimatedSection delay={400}>
                        <div
                            style={{
                                marginTop: 64,
                                padding: "48px 40px",
                                borderRadius: "var(--radius-lg)",
                                background: "var(--bg-card)",
                                border: "1px solid var(--border)",
                                textAlign: "center",
                            }}
                        >
                            <p
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontStyle: "italic",
                                    fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                                    color: "var(--text-secondary)",
                                    lineHeight: 1.6,
                                    maxWidth: 600,
                                    margin: "0 auto",
                                }}
                            >
                                &ldquo;Foto bercerita lewat mata, suara menyentuh langsung ke hati. Gabungkan keduanya menjadi kado istimewa yang {" "}
                                <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                                    takkan lekang oleh waktu.
                                </span>
                                &rdquo;
                            </p>
                        </div>
                    </AnimatedSection>
                </div>
            </section >

            {/* ════════════════════════════════════
          CARA KERJA
         ════════════════════════════════════ */}
            < section
                id="cara-kerja"
                className="section-spacing"
                style={{ position: "relative", overflow: "hidden" }}
            >
                {/* Ambient decorations */}
                < div
                    className="ambient-blob"
                    style={{
                        top: 0,
                        right: 0,
                        width: "min(500px, 80vw)",
                        height: "min(500px, 80vw)",
                        background: "rgba(166,124,82,0.05)",
                        transform: "translate(10%, -30%)",
                    }}
                />

                < div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px, 4vw, 24px)", boxSizing: "border-box", width: "100%" }}>
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
                                Sempurnakan Momen
                                <br />
                                <span className="italic-accent">Melalui Sentuhan Digital.</span>
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
                                title="Kustomisasi"
                                description="Akses studio editor untuk memilih tema warna, unggah foto kenangan, dan rekam pesan suara Anda."
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
                                title="Bagikan"
                                description="Dapatkan link unik yang dilindungi password dan bagikan keajaiban hadiah digital Anda seketika kepada orang tercinta."
                                icon={
                                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0-10.628a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5zm0 10.628a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5z" />
                                    </svg>
                                }
                            />
                        </AnimatedSection>
                    </div>
                </div >
            </section >

            {/* ════════════════════════════════════
          STUDIO PREVIEW (HIDDEN TEMP)
         ════════════════════════════════════ */}
            {/* <StudioPreview /> */}

            {/* ════════════════════════════════════
          TESTIMONI — Carousel
         ════════════════════════════════════ */}
            <TestimoniCarousel />

            {/* ════════════════════════════════════
          FINAL CTA — Dark Section
         ════════════════════════════════════ */}
            < section
                id="pesan"
                className="dark-section section-spacing"
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
                                background: "rgba(166,124,82,0.15)",
                                border: "1px solid rgba(166,124,82,0.25)",
                                borderRadius: 999,
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: "0.2em",
                                textTransform: "uppercase" as const,
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
                                color: "#f5efe6",
                                lineHeight: 1.15,
                                marginBottom: 20,
                            }}
                        >
                            Satu Hadiah.
                            <br />
                            <span
                                style={{
                                    fontStyle: "italic",
                                    color: "var(--accent-light)",
                                }}
                            >
                                Satu Juta Makna.
                            </span>
                        </h2>
                    </AnimatedSection>

                    <AnimatedSection delay={200}>
                        <p
                            style={{
                                fontSize: "1.05rem",
                                color: "rgba(245,239,230,0.6)",
                                lineHeight: 1.7,
                                maxWidth: 480,
                                margin: "0 auto 48px",
                            }}
                        >
                            Cukup satu kali investasi untuk kebahagiaan yang tak lekang oleh
                            waktu. Tanpa langganan. Akses selamanya.
                        </p>
                    </AnimatedSection>

                    {/* Pricing Cards — 2 column grid */}
                    <AnimatedSection delay={300}>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
                            gap: 20,
                            maxWidth: 720,
                            margin: "0 auto 48px",
                        }}>

                            {/* ── Voices Regular Card ── */}
                            <div style={{
                                padding: "36px 32px",
                                borderRadius: "var(--radius-lg)",
                                background: "rgba(255,252,247,0.06)",
                                border: "1px solid rgba(166,124,82,0.2)",
                                backdropFilter: "blur(12px)",
                                WebkitBackdropFilter: "blur(12px)",
                                display: "flex",
                                flexDirection: "column",
                            }}>
                                <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18, color: "var(--accent-light)", marginBottom: 8 }}>
                                    Voices. Regular
                                </div>
                                <div style={{ marginBottom: 24 }}>
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "rgba(245,239,230,0.4)" }}>Rp </span>
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 600, color: "#f5efe6", letterSpacing: "-0.03em" }}>10</span>
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "#f5efe6" }}>.000</span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28, flex: 1 }}>
                                    {["Maksimal 10 foto", "Pesan suara personal", "5 Pilihan Tema Warna", "Link standar (untuk dikirim)", "Akses selamanya"].map((f, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(245,239,230,0.7)", lineHeight: 1.4 }}>
                                            <div style={{ flexShrink: 0, width: 18, height: 18, borderRadius: "50%", background: "rgba(166,124,82,0.2)", border: "1px solid rgba(166,124,82,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            {f}
                                        </div>
                                    ))}
                                </div>
                                <a
                                    href="https://wa.me/6281381543981?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Voices%20Edition%20(Regular)*%20seharga%20Rp%2010.000.%0A%0AMohon%20info%20langkah%20selanjutnyaya.%20Terima%20kasih!"
                                    target="_blank" rel="noopener noreferrer"
                                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "16px 0", borderRadius: "var(--radius-md)", background: "rgba(166,124,82,0.15)", border: "1px solid rgba(166,124,82,0.3)", color: "var(--accent-light)", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, textDecoration: "none", transition: "all 0.3s ease", textAlign: "center" }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(166,124,82,0.25)"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(166,124,82,0.15)"; }}
                                >
                                    Pesan Sekarang
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </a>
                            </div>

                            {/* ── Voices Premium Card (Featured) ── */}
                            <div style={{
                                padding: "36px 32px",
                                borderRadius: "var(--radius-lg)",
                                background: "rgba(255,252,247,0.1)",
                                border: "1.5px solid rgba(201,168,124,0.5)",
                                backdropFilter: "blur(12px)",
                                WebkitBackdropFilter: "blur(12px)",
                                display: "flex",
                                flexDirection: "column",
                                position: "relative" as const,
                            }}>
                                {/* Featured badge */}
                                <div style={{
                                    position: "absolute" as const,
                                    top: -14,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    background: "var(--accent-light)",
                                    color: "#2c1e12",
                                    fontSize: 10,
                                    fontWeight: 700,
                                    padding: "4px 16px",
                                    borderRadius: 999,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase" as const,
                                    whiteSpace: "nowrap" as const,
                                }}>
                                    ✦ Lebih Eksklusif
                                </div>
                                <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18, color: "var(--accent-light)", marginBottom: 8 }}>
                                    Voices. Premium
                                </div>
                                <div style={{ marginBottom: 6 }}>
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "rgba(245,239,230,0.4)" }}>Rp </span>
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 600, color: "#f5efe6", letterSpacing: "-0.03em" }}>15</span>
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "#f5efe6" }}>.000</span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28, flex: 1, marginTop: 14 }}>
                                    {["Maksimal 20 foto", "Pesan suara personal", "5 Pilihan Tema Warna", "Link khusus", "Akses selamanya"].map((f, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(245,239,230,0.85)", lineHeight: 1.4 }}>
                                            <div style={{ flexShrink: 0, width: 18, height: 18, borderRadius: "50%", background: "rgba(166,124,82,0.25)", border: "1px solid rgba(201,168,124,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            {f}
                                        </div>
                                    ))}
                                </div>
                                <a
                                    href="https://wa.me/6281381543981?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Voices%20Edition%20(Premium)*%20seharga%20Rp%2015.000.%0A%0AMohon%20info%20langkah%20selanjutnyaya.%20Terima%20kasih!"
                                    target="_blank" rel="noopener noreferrer"
                                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "16px 0", borderRadius: "var(--radius-md)", background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%)", color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, textDecoration: "none", transition: "all 0.4s ease", boxShadow: "0 12px 30px -8px rgba(166,124,82,0.4)", textAlign: "center" }}
                                >
                                    Pesan Sekarang
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </a>
                            </div>

                        </div>
                    </AnimatedSection>

                    {/* Trust */}
                    <AnimatedSection delay={400}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 20,
                                fontSize: 11,
                                color: "rgba(245,239,230,0.35)",
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
                                        background: "rgba(201,168,124,0.5)",
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
                                        background: "rgba(201,168,124,0.5)",
                                    }}
                                />
                                PASSWORD PROTECTED
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span
                                    style={{
                                        width: 5,
                                        height: 5,
                                        borderRadius: "50%",
                                        background: "rgba(201,168,124,0.5)",
                                    }}
                                />
                                LIFETIME ACCESS
                            </span>
                        </div>
                    </AnimatedSection>
                </div>
            </section >

            {/* ════════════════════════════════════
          FOOTER
         ════════════════════════════════════ */}
            < footer
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

            {/* ── Floating WhatsApp Button ── */}
            <a
                href="https://wa.me/6281381543981?text=Halo%20Digital%20Atelier!%20Saya%20ingin%20bertanya%20tentang%20Voices%20Gift."
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
                    background: "#594a3e", // Warm chocolate brown
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 24px -4px rgba(89, 74, 62, 0.4)",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                }}
            >
                <svg width="26" height="26" fill="white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </a>
        </div>
    );
}