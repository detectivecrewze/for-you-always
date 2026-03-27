"use client";

import React, { useEffect, useState, useRef } from "react";

/* ─────────────────────────────────────────────
   AnimatedSection — identical to page.tsx
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
   StepCard — identical to page.tsx
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

            <h3 className="heading-md" style={{ marginBottom: 12, fontSize: "1.35rem" }}>
                {title}
            </h3>
            <p className="body-text" style={{ fontSize: "0.9rem" }}>
                {description}
            </p>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Shared WhatsApp CTA link
   ───────────────────────────────────────────── */
const WA_LINK =
    "https://wa.me/6281381543981?text=Halo%20For%20You%2C%20Always!%20Saya%20tertarik%20untuk%20membeli%20*Voices%20Gift%20Bundle*%20(Pembelian%20Pertama%20Rp%2030.000).%20Mohon%20info%20selanjutnya.";

/* ─────────────────────────────────────────────
   useIsMobile hook
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
   PAGE
   ───────────────────────────────────────────── */
export default function BundleSalesPage() {
    const isMobile = useIsMobile();

    return (
        <div
            style={{
                minHeight: "100vh",
                position: "relative",
                overflowX: "clip",
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
            }}
        >
            {/* ── Background Ambient Blobs ── */}
            <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: -1 }}>
                <div
                    className="ambient-blob"
                    style={{ top: "-8%", left: "-8%", width: "50%", height: "50%", background: "rgba(201, 168, 124, 0.10)" }}
                />
                <div
                    className="ambient-blob"
                    style={{ top: "30%", right: "-10%", width: "45%", height: "45%", background: "rgba(166, 124, 82, 0.06)" }}
                />
                <div
                    className="ambient-blob"
                    style={{ bottom: "-10%", left: "20%", width: "50%", height: "50%", background: "rgba(122, 90, 58, 0.05)" }}
                />
            </div>

            {/* ════════════════════════════════════
                SECTION 1 — HERO
               ════════════════════════════════════ */}
            <section
                style={{
                    position: "relative",
                    paddingTop: isMobile ? 104 : 168,
                    paddingBottom: isMobile ? 64 : 112,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: 1100,
                        margin: "0 auto",
                        padding: "0 24px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                    }}
                >
                    {/* Product context chip */}
                    <AnimatedSection>
                        <div style={{ marginBottom: 20 }}>
                            <div
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "8px 18px",
                                    background: "var(--bg-deep)",
                                    borderRadius: 999,
                                    border: "1px solid rgba(201,168,124,0.2)",
                                }}
                            >
                                {/* Headphones icon — Voices Gift identity */}
                                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="var(--accent-light)" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.1-1.34 2-3 2s-3-.9-3-2 1.34-2 3-2 3 .9 3 2zm12-3c0 1.1-1.34 2-3 2s-3-.9-3-2 1.34-2 3-2 3 .9 3 2z" />
                                </svg>
                                <span
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        letterSpacing: "0.15em",
                                        textTransform: "uppercase" as const,
                                        color: "var(--accent-light)",
                                    }}
                                >
                                    Voices Gift
                                </span>
                                <span style={{ width: 1, height: 10, background: "rgba(201,168,124,0.25)" }} />
                                <span
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 600,
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase" as const,
                                        color: "rgba(245,239,230,0.45)",
                                    }}
                                >
                                    Paket Bundle
                                </span>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Label pill */}
                    <AnimatedSection delay={50}>
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
                                color: "var(--accent)",
                            }}
                        >
                            <span
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: "var(--accent)",
                                    animation: "pulse-warm 2s infinite",
                                    flexShrink: 0,
                                }}
                            />
                            5 kado digital · satu harga spesial
                        </div>
                    </AnimatedSection>

                    {/* Headline */}
                    <AnimatedSection delay={120}>
                        <h1 className="heading-xl" style={{ marginBottom: 28, wordWrap: "break-word" }}>
                            Lima Kado Voices Gift.
                            <br />
                            <span className="italic-accent">Satu Harga.</span>
                        </h1>
                    </AnimatedSection>

                    {/* Subtext */}
                    <AnimatedSection delay={220}>
                        <p
                            className="body-text"
                            style={{
                                maxWidth: 560,
                                margin: "0 auto 48px",
                                fontSize: "1.05rem",
                                lineHeight: 1.75,
                            }}
                        >
                            Beli satu paket, dapatkan <strong style={{ color: "var(--text-primary)", fontWeight: 700 }}>5 kuota kado Voices Gift</strong> yang bisa kamu buat sendiri kapan saja — lewat studio editor tanpa skill coding.
                            Cocok untuk reseller yang ingin untung, atau kamu yang ingin kasih kado ke banyak orang sekaligus.
                        </p>
                    </AnimatedSection>

                    {/* CTA */}
                    <AnimatedSection delay={320}>
                        <a
                            href={WA_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                        >
                            <span>Pesan Bundle via WhatsApp</span>
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </AnimatedSection>

                    {/* Hero decorative divider */}
                    <AnimatedSection delay={420}>
                        <div
                            style={{
                                marginTop: 72,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: isMobile ? 12 : 20,
                                flexWrap: "wrap",
                                padding: "0 16px",
                            }}
                        >
                            {[
                                { text: "Voices Gift" },
                                { text: "5 Kuota Kado" },
                                { text: "Studio Self-Serve" },
                                { text: "Akses Selamanya" },
                            ].map((item, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && (
                                        <span
                                            style={{
                                                width: 4,
                                                height: 4,
                                                borderRadius: "50%",
                                                background: "var(--accent-light)",
                                                opacity: 0.4,
                                                flexShrink: 0,
                                            }}
                                        />
                                    )}
                                    <span
                                        style={{
                                            fontSize: 11,
                                            fontWeight: i === 0 ? 800 : 700,
                                            letterSpacing: "0.12em",
                                            textTransform: "uppercase" as const,
                                            color: i === 0 ? "var(--accent)" : "var(--text-muted)",
                                        }}
                                    >
                                        {item.text}
                                    </span>
                                </React.Fragment>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ════════════════════════════════════
                SECTION 2 — COCOK UNTUK KAMU YANG
               ════════════════════════════════════ */}
            <section
                className="section-spacing"
                style={{ background: "var(--bg-warm)", position: "relative", overflow: "hidden" }}
            >
                {/* Ambient blob */}
                <div
                    style={{
                        position: "absolute",
                        top: "-10%",
                        right: "-5%",
                        width: "min(400px, 60vw)",
                        height: "min(400px, 60vw)",
                        borderRadius: "50%",
                        background: "rgba(166,124,82,0.07)",
                        filter: "blur(100px)",
                        pointerEvents: "none",
                        zIndex: 0,
                    }}
                />

                <div
                    style={{
                        maxWidth: 1100,
                        margin: "0 auto",
                        padding: "0 clamp(16px, 4vw, 24px)",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    {/* Header */}
                    <AnimatedSection>
                        <div style={{ textAlign: "center", marginBottom: 64 }}>
                            <span
                                className="label-text"
                                style={{
                                    display: "inline-block",
                                    padding: "6px 16px",
                                    background: "var(--accent-glow)",
                                    border: "1px solid var(--border-warm)",
                                    borderRadius: 999,
                                    marginBottom: 28,
                                    color: "var(--accent)",
                                }}
                            >
                                Untuk Siapa
                            </span>
                            <h2 className="heading-lg">
                                Cocok Untuk Kamu Yang...
                            </h2>
                        </div>
                    </AnimatedSection>

                    {/* Cards grid */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
                            gap: 24,
                        }}
                    >
                        {/* Card 1 — Reseller */}
                        <AnimatedSection delay={100}>
                            <div
                                className="glass-surface"
                                style={{ padding: "40px 32px", height: "100%" }}
                            >
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 14,
                                        background: "var(--accent-glow)",
                                        border: "1px solid var(--border-warm)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "var(--accent)",
                                        marginBottom: 24,
                                    }}
                                >
                                    {/* Trending up icon */}
                                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                        <polyline points="17 6 23 6 23 12" />
                                    </svg>
                                </div>
                                <h3
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: "1.35rem",
                                        fontWeight: 600,
                                        color: "var(--text-primary)",
                                        marginBottom: 12,
                                        lineHeight: 1.2,
                                    }}
                                >
                                    Ingin jadi reseller kado digital
                                </h3>
                                <p className="body-text" style={{ fontSize: "0.9rem", margin: 0 }}>
                                    Beli paket Rp 30.000, jual di harga yang kamu tentukan sendiri.
                                    Keuntungan sepenuhnya milikmu.
                                </p>
                            </div>
                        </AnimatedSection>

                        {/* Card 2 — Komunitas */}
                        <AnimatedSection delay={200}>
                            <div
                                className="glass-surface"
                                style={{ padding: "40px 32px", height: "100%" }}
                            >
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 14,
                                        background: "var(--accent-glow)",
                                        border: "1px solid var(--border-warm)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "var(--accent)",
                                        marginBottom: 24,
                                    }}
                                >
                                    {/* Users icon */}
                                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>
                                <h3
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: "1.35rem",
                                        fontWeight: 600,
                                        color: "var(--text-primary)",
                                        marginBottom: 12,
                                        lineHeight: 1.2,
                                    }}
                                >
                                    Punya circle atau komunitas besar
                                </h3>
                                <p className="body-text" style={{ fontSize: "0.9rem", margin: 0 }}>
                                    Mau kasih kado ke semua teman, rekan kerja, atau anggota komunitas?
                                    Satu paket untuk semua.
                                </p>
                            </div>
                        </AnimatedSection>

                        {/* Card 3 — Banyak Orang */}
                        <AnimatedSection delay={300}>
                            <div
                                className="glass-surface"
                                style={{ padding: "40px 32px", height: "100%" }}
                            >
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 14,
                                        background: "var(--accent-glow)",
                                        border: "1px solid var(--border-warm)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "var(--accent)",
                                        marginBottom: 24,
                                    }}
                                >
                                    {/* Gift icon */}
                                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <polyline points="20 12 20 22 4 22 4 12" />
                                        <rect x="2" y="7" width="20" height="5" />
                                        <line x1="12" y1="22" x2="12" y2="7" />
                                        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                                        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                                    </svg>
                                </div>
                                <h3
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: "1.35rem",
                                        fontWeight: 600,
                                        color: "var(--text-primary)",
                                        marginBottom: 12,
                                        lineHeight: 1.2,
                                    }}
                                >
                                    Ingin kasih kado ke banyak orang
                                </h3>
                                <p className="body-text" style={{ fontSize: "0.9rem", margin: 0 }}>
                                    Tidak perlu order satu per satu. Buat semua kadonya sendiri,
                                    kapan saja kamu mau.
                                </p>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════
                SECTION 3 — CARA KERJA
               ════════════════════════════════════ */}
            <section className="section-spacing" style={{ position: "relative", overflow: "hidden" }}>
                {/* Ambient blob */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "-10%",
                        left: "-5%",
                        width: "min(500px, 70vw)",
                        height: "min(500px, 70vw)",
                        borderRadius: "50%",
                        background: "rgba(166,124,82,0.06)",
                        filter: "blur(100px)",
                        pointerEvents: "none",
                        zIndex: 0,
                    }}
                />

                <div
                    style={{
                        maxWidth: 1100,
                        margin: "0 auto",
                        padding: "0 clamp(16px, 4vw, 24px)",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    {/* Header */}
                    <AnimatedSection>
                        <div style={{ textAlign: "center", marginBottom: 64 }}>
                            <span
                                className="label-text"
                                style={{
                                    display: "inline-block",
                                    padding: "6px 16px",
                                    background: "var(--accent-glow)",
                                    border: "1px solid var(--border-warm)",
                                    borderRadius: 999,
                                    marginBottom: 28,
                                    color: "var(--accent)",
                                }}
                            >
                                Cara Kerja
                            </span>
                            <h2 className="heading-lg">
                                Semudah Tiga Langkah.
                            </h2>
                        </div>
                    </AnimatedSection>

                    {/* Steps Grid */}
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
                                title="Hubungi via WhatsApp"
                                description="Hubungi kami dan dapatkan kode akses bundle eksklusifmu."
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
                                title="Masuk Portal Bundle"
                                description="Gunakan kode akses untuk masuk ke portal. Buat link kado unik untuk setiap penerima — kapan saja, tanpa perlu WA lagi."
                                icon={
                                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <rect x="3" y="11" width="18" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                }
                            />
                        </AnimatedSection>

                        <AnimatedSection delay={300}>
                            <StepCard
                                number="3"
                                title="Bagikan ke Orang Tersayang"
                                description="Setiap penerima membuka kadonya sendiri lewat link unik yang sudah kamu buat. Lengkap dengan password."
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

            {/* ════════════════════════════════════
                SECTION 4 — PRICING
               ════════════════════════════════════ */}
            <section
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
                    {/* Label */}
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

                    {/* Heading */}
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
                            Satu Paket.
                            <br />
                            <span style={{ fontStyle: "italic", color: "var(--accent-light)" }}>
                                Lima Kenangan.
                            </span>
                        </h2>
                    </AnimatedSection>

                    {/* Subtext */}
                    <AnimatedSection delay={200}>
                        <p
                            style={{
                                fontSize: "1.05rem",
                                color: "rgba(245,239,230,0.6)",
                                lineHeight: 1.7,
                                maxWidth: 440,
                                margin: "0 auto 56px",
                            }}
                        >
                            Tanpa langganan. Akses selamanya.
                        </p>
                    </AnimatedSection>

                    {/* Pricing Card — single, centered */}
                    <AnimatedSection delay={300}>
                        <div
                            style={{
                                maxWidth: 380,
                                width: "100%",
                                margin: "0 auto 48px",
                                padding: isMobile ? "32px 24px" : "44px 40px",
                                borderRadius: "var(--radius-lg)",
                                background: "rgba(255,252,247,0.08)",
                                border: "1.5px solid rgba(201,168,124,0.3)",
                                backdropFilter: "blur(16px)",
                                WebkitBackdropFilter: "blur(16px)",
                                display: "flex",
                                flexDirection: "column",
                                textAlign: "left",
                                boxSizing: "border-box" as const,
                            }}
                        >
                            {/* Product name */}
                            <div
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontStyle: "italic",
                                    fontSize: 20,
                                    color: "var(--accent-light)",
                                    marginBottom: 10,
                                }}
                            >
                                Voices. Bundle
                            </div>

                            {/* Price */}
                            <div style={{ marginBottom: 4 }}>
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
                                        fontSize: 52,
                                        fontWeight: 600,
                                        color: "#f5efe6",
                                        letterSpacing: "-0.03em",
                                    }}
                                >
                                    30
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

                            {/* Crossed price & FOMO Text */}
                            <div style={{ marginBottom: 28, display: "flex", flexDirection: "column", gap: 8 }}>
                                <div
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 6,
                                        padding: "4px 10px",
                                        background: "rgba(166,124,82,0.15)",
                                        border: "1px solid rgba(201,168,124,0.3)",
                                        borderRadius: 6,
                                        width: "fit-content",
                                    }}
                                >
                                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="var(--accent-light)" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-light)", letterSpacing: "0.05em" }}>
                                        KHUSUS PEMBELIAN PERTAMA
                                    </span>
                                </div>
                                <div
                                    style={{
                                        fontSize: 12,
                                        color: "rgba(245,239,230,0.65)",
                                        fontWeight: 500,
                                    }}
                                >
                                    Pembelian berikutnya Rp 35.000 
                                    <span style={{ textDecoration: "line-through", color: "rgba(245,239,230,0.3)", marginLeft: 6 }}>
                                        (Harga asli Rp 50.000)
                                    </span>
                                </div>
                            </div>

                            {/* Feature list */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
                                {[
                                    "5 kuota kado Voices Gift",
                                    "Studio editor self-serve",
                                    "Setiap kado punya link & password unik",
                                    "Akses selamanya — tidak ada batas waktu",
                                    "Harga jual bebas — keuntungan sepenuhnya milikmu",
                                ].map((feature, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: 12,
                                            fontSize: 13,
                                            color: "rgba(245,239,230,0.8)",
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        <div
                                            style={{
                                                flexShrink: 0,
                                                width: 18,
                                                height: 18,
                                                borderRadius: "50%",
                                                background: "rgba(166,124,82,0.25)",
                                                border: "1px solid rgba(201,168,124,0.4)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginTop: 1,
                                            }}
                                        >
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            {/* Profit highlight box */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 12,
                                    padding: "16px 18px",
                                    background: "rgba(166,124,82,0.12)",
                                    border: "1px solid rgba(166,124,82,0.25)",
                                    borderRadius: "var(--radius-sm)",
                                    marginBottom: 32,
                                }}
                            >
                                {/* Lightbulb SVG */}
                                <div style={{ flexShrink: 0, color: "var(--accent-light)", marginTop: 1 }}>
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <p
                                    style={{
                                        fontSize: 12,
                                        color: "rgba(245,239,230,0.75)",
                                        lineHeight: 1.6,
                                        margin: 0,
                                        fontWeight: 500,
                                    }}
                                >
                                    Contoh: Jual{" "}
                                    <span style={{ color: "var(--accent-light)", fontWeight: 700 }}>
                                        @ Rp 15.000/kado
                                    </span>{" "}
                                    → total Rp 75.000 → untung{" "}
                                    <span style={{ color: "var(--accent-light)", fontWeight: 700 }}>
                                        Rp 45.000
                                    </span>
                                </p>
                            </div>

                            {/* CTA Button */}
                            <a
                                href={WA_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                                style={{ width: "100%", justifyContent: "center" }}
                            >
                                <span>Pesan Bundle via WhatsApp</span>
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
                    </AnimatedSection>

                    {/* Trust badges */}
                    <AnimatedSection delay={400}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 20,
                                flexWrap: "wrap",
                            }}
                        >
                            {["SELF-SERVE STUDIO", "LIFETIME ACCESS", "HARGA JUAL BEBAS"].map((badge, i) => (
                                <React.Fragment key={badge}>
                                    {i > 0 && (
                                        <span
                                            style={{
                                                width: 5,
                                                height: 5,
                                                borderRadius: "50%",
                                                background: "rgba(201,168,124,0.5)",
                                            }}
                                        />
                                    )}
                                    <span
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 600,
                                            letterSpacing: "0.12em",
                                            color: "rgba(245,239,230,0.35)",
                                        }}
                                    >
                                        {badge}
                                    </span>
                                </React.Fragment>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ════════════════════════════════════
                SECTION 5 — FAQ
               ════════════════════════════════════ */}
            <section
                className="section-spacing"
                style={{ background: "var(--bg-warm)", position: "relative", overflow: "hidden" }}
            >
                {/* Ambient blob */}
                <div
                    style={{
                        position: "absolute",
                        top: "-10%",
                        left: "-5%",
                        width: "min(400px, 60vw)",
                        height: "min(400px, 60vw)",
                        borderRadius: "50%",
                        background: "rgba(166,124,82,0.06)",
                        filter: "blur(90px)",
                        pointerEvents: "none",
                        zIndex: 0,
                    }}
                />

                <div
                    style={{
                        maxWidth: 680,
                        margin: "0 auto",
                        padding: "0 clamp(16px, 4vw, 24px)",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    {/* Header */}
                    <AnimatedSection>
                        <div style={{ textAlign: "center", marginBottom: 64 }}>
                            <span
                                className="label-text"
                                style={{
                                    display: "inline-block",
                                    padding: "6px 16px",
                                    background: "var(--accent-glow)",
                                    border: "1px solid var(--border-warm)",
                                    borderRadius: 999,
                                    marginBottom: 28,
                                    color: "var(--accent)",
                                }}
                            >
                                FAQ
                            </span>
                            <h2 className="heading-lg">Ada Pertanyaan?</h2>
                        </div>
                    </AnimatedSection>

                    {/* FAQ Items — static list */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {[
                            {
                                q: "Apakah kuota berlaku selamanya?",
                                a: "Ya. Tidak ada batas waktu penggunaan. Buat kadonya kapan saja kamu siap.",
                            },
                            {
                                q: "Kalau kuota 5 habis, bisa tambah?",
                                a: "Bisa. Hubungi kami via WhatsApp dan kami siapkan paket baru untukmu.",
                            },
                            {
                                q: "Setiap kado bisa tema berbeda?",
                                a: "Ya. Setiap kado dikustomisasi penuh di studio — tema, foto, musik, dan pesan suaranya bisa berbeda.",
                            },
                        ].map((item, i) => (
                            <AnimatedSection key={i} delay={i * 120}>
                                <div
                                    style={{
                                        padding: "32px 0",
                                        borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: 16,
                                        }}
                                    >
                                        {/* Question number dot */}
                                        <div
                                            style={{
                                                flexShrink: 0,
                                                width: 28,
                                                height: 28,
                                                borderRadius: "50%",
                                                background: "var(--accent-glow)",
                                                border: "1px solid var(--border-warm)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 11,
                                                fontWeight: 700,
                                                color: "var(--accent)",
                                                marginTop: 2,
                                                flexDirection: "column",
                                            }}
                                        >
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4
                                                style={{
                                                    fontFamily: "var(--font-display)",
                                                    fontSize: "1.2rem",
                                                    fontWeight: 600,
                                                    color: "var(--text-primary)",
                                                    marginBottom: 10,
                                                    lineHeight: 1.3,
                                                }}
                                            >
                                                {item.q}
                                            </h4>
                                            <p className="body-text" style={{ fontSize: "0.9rem", margin: 0 }}>
                                                {item.a}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════
                SECTION 6 — FINAL CTA
               ════════════════════════════════════ */}
            <section className="dark-section section-spacing">
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
                    {/* Label */}
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
                            Mulai Sekarang
                        </span>
                    </AnimatedSection>

                    {/* Heading */}
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
                            Siap Mulai Jualan?
                            <br />
                            <span style={{ fontStyle: "italic", color: "var(--accent-light)" }}>
                                Atau Buat Kado untuk Semua.
                            </span>
                        </h2>
                    </AnimatedSection>

                    {/* Subtext */}
                    <AnimatedSection delay={200}>
                        <p
                            style={{
                                fontSize: "1.05rem",
                                color: "rgba(245,239,230,0.6)",
                                lineHeight: 1.7,
                                maxWidth: 420,
                                margin: "0 auto 48px",
                            }}
                        >
                            Satu langkah saja — hubungi kami sekarang.
                        </p>
                    </AnimatedSection>

                    {/* CTA */}
                    <AnimatedSection delay={300}>
                        <a
                            href={WA_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                        >
                            <span>Pesan Bundle via WhatsApp</span>
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── Footer ── */}
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

            {/* ── Floating WhatsApp Button ── */}
            <a
                href={WA_LINK}
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
                    background: "#594a3e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 24px -4px rgba(89, 74, 62, 0.4)",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px -4px rgba(89, 74, 62, 0.5)";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px -4px rgba(89, 74, 62, 0.4)";
                }}
            >
                <svg width="26" height="26" fill="white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </a>
        </div>
    );
}
