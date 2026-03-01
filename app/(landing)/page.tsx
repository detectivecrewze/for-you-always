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

/* ═════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═════════════════════════════════════════════ */
export default function VoicesLandingPage() {
    return (
        <div style={{ minHeight: "100vh", position: "relative" }}>
            {/* ── Background Ambient Blobs ── */}
            <div
                style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: -1 }}
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
          NAVIGATION
         ════════════════════════════════════ */}
            <nav
                style={{
                    position: "fixed",
                    top: 0,
                    width: "100%",
                    zIndex: 50,
                    padding: "20px 24px",
                }}
            >
                <div
                    style={{
                        maxWidth: 1100,
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 28px",
                        borderRadius: "var(--radius-lg)",
                        background: "rgba(245, 239, 230, 0.75)",
                        backdropFilter: "blur(24px)",
                        WebkitBackdropFilter: "blur(24px)",
                        border: "1px solid rgba(255,255,255,0.5)",
                        boxShadow: "0 8px 32px -6px rgba(59, 47, 37, 0.06)",
                    }}
                >
                    {/* Logo */}
                    <a
                        href="/"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            textDecoration: "none",
                        }}
                    >
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
                            <span
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontStyle: "italic",
                                    fontWeight: 600,
                                    fontSize: 15,
                                    color: "var(--text-primary)",
                                    lineHeight: 1,
                                    marginBottom: 2,
                                }}
                            >
                                For you, Always.
                            </span>
                            <span className="label-text" style={{ fontSize: 8, margin: 0 }}>
                                Digital Atelier
                            </span>
                        </div>
                    </a>

                    {/* CTA */}
                    <a
                        href="#pesan"
                        className="btn-primary"
                        style={{ padding: "12px 28px", fontSize: "0.7rem" }}
                    >
                        <span>Pesan Sekarang</span>
                    </a>
                </div>
            </nav>

            {/* ════════════════════════════════════
          HERO SECTION
         ════════════════════════════════════ */}
            <section
                style={{
                    position: "relative",
                    paddingTop: 160,
                    paddingBottom: 100,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
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
                    <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
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
                            <h1 className="heading-xl" style={{ marginBottom: 28 }}>
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
                                    maxWidth: 540,
                                    margin: "0 auto 40px",
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
                                    flexWrap: "wrap",
                                    gap: 16,
                                    justifyContent: "center",
                                }}
                            >
                                <a href="#pesan" className="btn-primary">
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
                                <a href="#showcase" className="btn-secondary">
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

                    {/* Hero Mockup — Original Voices Edition Showcase */}
                    <AnimatedSection delay={400}>
                        <div
                            style={{
                                position: "relative",
                                maxWidth: 400,
                                margin: "0 auto",
                            }}
                            className="animate-float-gentle"
                        >
                            {/* Main Premium Mockup */}
                            <div className="relative group" style={{ perspective: 1000 }}>
                                <div
                                    style={{
                                        position: "relative",
                                        background: "rgba(255, 252, 247, 0.8)",
                                        backdropFilter: "blur(8px)",
                                        WebkitBackdropFilter: "blur(8px)",
                                        borderRadius: "3rem",
                                        padding: 12,
                                        boxShadow: "0 50px 100px -20px rgba(59, 47, 37, 0.15)",
                                        border: "1px solid rgba(255, 255, 255, 0.6)",
                                        transition: "all 1s ease",
                                    }}
                                >
                                    {/* Mockup Top Detail */}
                                    <div style={{ position: "absolute", top: 32, left: 40, display: "flex", gap: 8, zIndex: 20 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(166,124,82,0.4)" }} />
                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(166,124,82,0.4)" }} />
                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(166,124,82,0.4)" }} />
                                    </div>

                                    {/* High-Res Image Container */}
                                    <div
                                        style={{
                                            position: "relative",
                                            borderRadius: "2.2rem",
                                            overflow: "hidden",
                                            background: "var(--bg-card)",
                                            aspectRatio: "4/5",
                                            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
                                        }}
                                    >
                                        <img
                                            src="https://bpahzgewtgfjwobjrpdk.supabase.co/storage/v1/object/public/assets/voices.gif"
                                            alt="Voices Edition Preview"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />



                                        {/* Glass Overlay for depth */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                inset: 0,
                                                background: "linear-gradient(to top right, rgba(255,255,255,0.1), transparent, rgba(0,0,0,0.05))",
                                                pointerEvents: "none",
                                            }}
                                        />
                                        <div
                                            style={{
                                                position: "absolute",
                                                inset: 0,
                                                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
                                                borderRadius: "2.2rem",
                                                pointerEvents: "none",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section >

            {/* ════════════════════════════════════
          SHOWCASE — Art of Sound
         ════════════════════════════════════ */}
            < section
                id="showcase"
                className="section-spacing"
                style={{ position: "relative", background: "var(--bg-warm)" }
                }
            >
                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
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

                    {/* Feature Cards */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
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
                            description="Bingkai kaca interaktif tempat kepingan foto kenangan berputar secara memukau. Rasakan sensasi nostalgia layaknya mengintip ke dalam mesin waktu memori Anda."
                        />
                        <FeatureCard
                            index={1}
                            icon={
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                                </svg>
                            }
                            title="The Golden Waveform"
                            description="Gelombang suara emas yang menari seirama dengan setiap kata dan tawa dari pesan suara Anda, membuat momen terasa lebih hidup dan hangat."
                        />
                        <FeatureCard
                            index={2}
                            icon={
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            }
                            title="The Brass Crank"
                            description="Sentuhan tuas kuningan klasik untuk memutar memori secara manual. Sebuah pengalaman interaktif unik yang membawa sensasi nostalgia pada kado digital Anda."
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
                        width: 500,
                        height: 500,
                        background: "rgba(166,124,82,0.05)",
                        transform: "translate(30%, -30%)",
                    }}
                />

                < div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
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
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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

                    {/* Pricing Card */}
                    <AnimatedSection delay={300}>
                        <div
                            style={{
                                maxWidth: 400,
                                margin: "0 auto 48px",
                                padding: "48px 40px",
                                borderRadius: "var(--radius-lg)",
                                background: "rgba(255,252,247,0.06)",
                                border: "1px solid rgba(166,124,82,0.2)",
                                backdropFilter: "blur(12px)",
                                WebkitBackdropFilter: "blur(12px)",
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontStyle: "italic",
                                    fontSize: 18,
                                    color: "var(--accent-light)",
                                    marginBottom: 8,
                                }}
                            >
                                Voices. Edition
                            </div>
                            <div style={{ marginBottom: 28 }}>
                                <span
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: 18,
                                        color: "rgba(245,239,230,0.4)",
                                    }}
                                >
                                    Rp{" "}
                                </span>
                                <span
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: 56,
                                        fontWeight: 600,
                                        color: "#f5efe6",
                                        letterSpacing: "-0.03em",
                                    }}
                                >
                                    10
                                </span>
                                <span
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: 28,
                                        fontWeight: 600,
                                        color: "#f5efe6",
                                    }}
                                >
                                    .000
                                </span>
                            </div>

                            {/* Feature list */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 14,
                                    marginBottom: 32,
                                    textAlign: "left",
                                }}
                            >
                                {[
                                    "Upload foto kenangan tanpa batas",
                                    "Pesan suara personal",
                                    "5 Pilihan Tema Warna",
                                    "Link unik + Password Gate",
                                    "Akses selamanya",
                                ].map((f, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                            fontSize: 13,
                                            color: "rgba(245,239,230,0.7)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                flexShrink: 0,
                                                width: 18,
                                                height: 18,
                                                borderRadius: "50%",
                                                background: "rgba(166,124,82,0.2)",
                                                border: "1px solid rgba(166,124,82,0.3)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <svg
                                                width="10"
                                                height="10"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="var(--accent-light)"
                                                strokeWidth={3}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        {f}
                                    </div>
                                ))}
                            </div>

                            {/* WhatsApp Order Button */}
                            <a
                                href="https://wa.me/6281381543981?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Voices%20Edition*%20dengan%20harga%20spesial%20Rp%2010.000.%0A%0AMohon%20info%20langkah%20selanjutnya%20untuk%20proses%20pemesanannya%20ya.%20Terima%20kasih!"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 10,
                                    width: "100%",
                                    padding: "18px 0",
                                    borderRadius: "var(--radius-md)",
                                    background:
                                        "linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%)",
                                    color: "#fff",
                                    fontSize: 14,
                                    fontWeight: 700,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase" as const,
                                    textDecoration: "none",
                                    transition: "all 0.4s ease",
                                    boxShadow: "0 12px 30px -8px rgba(166,124,82,0.4)",
                                }}
                            >
                                Pesan Sekarang
                                <svg
                                    width="16"
                                    height="16"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </a>
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
