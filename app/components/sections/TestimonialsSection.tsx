import React from "react";
import { AnimatedSection } from "../LandscapeProductCard";

const testimonials = [
    { name: "Rara A.", product: "Voices Gift", text: "Pacarku nangis pas buka ini. Beneran ga nyangka bisa segitu indahnya. Foto-fotonya berasa kayak film pendek.", rating: 5, delay: 80 },
    { name: "Kevin M.", product: "Arcade Edition", text: "Buat ulang tahun pacar, dia main sampe lupa waktu. 10 ruangan semua seru banget, apalagi bagian kejutan di akhir.", rating: 5, delay: 160 },
    { name: "Sella D.", product: "Wrapped Edition", text: "Murah banget tapi hasilnya premium. Temen-temenku pada nanya bikin dimana, kirain jago coding.", rating: 5, delay: 240 },
    { name: "Bagas P.", product: "Letter Edition", text: "Awalnya skeptis, tapi begitu kirim ke dia... dia langsung video call sambil senyum-senyum salah tingkah. Bener-bener worth every penny.", rating: 5, delay: 320 },
];

const stats = [
    { num: "800+", label: "Happy Customers" },
    { num: "5.0", label: "Average Rating" },
    { num: "8", label: "Formats" },
];

export default function TestimonialsSection() {
    return (
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
                    {testimonials.map((r, i) => (
                        <AnimatedSection key={i} delay={r.delay}>
                            <div style={{
                                padding: "32px 28px", borderRadius: 20,
                                background: "rgba(250,247,242,0.03)",
                                border: "1px solid rgba(205,171,143,0.08)",
                                backdropFilter: "blur(12px)",
                                height: "100%", display: "flex", flexDirection: "column", gap: 16,
                                transition: "all 0.4s ease",
                            }}>
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
                        {stats.map((stat, i) => (
                            <div key={i} style={{ textAlign: "center" }}>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 400, color: "#faf7f2", lineHeight: 1, marginBottom: 8 }}>{stat.num}</div>
                                <div style={{ fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(205,171,143,0.5)" }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
