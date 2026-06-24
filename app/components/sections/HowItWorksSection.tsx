import React from "react";
import { AnimatedSection } from "../LandscapeProductCard";

export default function HowItWorksSection() {
    const steps = [
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
    ];

    return (
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
                    {steps.map((step, i) => (
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
    );
}
