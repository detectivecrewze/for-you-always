import React from "react";
import { AnimatedSection } from "../LandscapeProductCard";

const faqs = [
    {
        q: "Berapa lama proses pengerjaan?",
        a: "Akses instan (langsung) setelah pembayaran untuk produk Self-Edit. Khusus layanan Terima Jadi (Memoria), pengerjaan maksimal 1x24 jam."
    },
    {
        q: "Bagaimana cara pembayaran?",
        a: "Sistem otomatis 24 jam via QRIS, Virtual Account, atau E-Wallet (GoPay/OVO/DANA). Akses langsung didapat tanpa perlu konfirmasi admin."
    },
    {
        q: "Apakah bisa request custom desain atau tema?",
        a: "Untuk saat ini tema dan desain sudah tersedia di dalam studio. Jika ada kebutuhan khusus, silakan tanyakan langsung via WhatsApp dan kami akan bantu sesuaikan."
    },
    {
        q: "Apakah penerima perlu punya akun untuk membukanya?",
        a: "Tidak perlu. Penerima hanya perlu membuka link dan memasukkan passcode yang kamu tentukan sendiri. Sangat mudah dan tidak perlu registrasi apapun."
    },
];

export default function FAQSection() {
    return (
        <section id="faq" style={{ position: "relative", zIndex: 1, padding: "120px 0", background: "#faf7f2" }}>
            <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
                <AnimatedSection>
                    <div style={{ textAlign: "center", marginBottom: 64 }}>
                        <span style={{
                            fontFamily: "var(--font-sans)", fontSize: 8.5, fontWeight: 700,
                            letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#a88365",
                            display: "inline-block", padding: "6px 20px",
                            border: "1.2px solid rgba(205,171,143,0.2)", borderRadius: 999,
                            background: "rgba(205,171,143,0.08)", marginBottom: 24,
                        }}>
                            FAQ
                        </span>
                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 400, color: "#382a24", lineHeight: 1, letterSpacing: "-0.03em" }}>
                            Pertanyaan <span style={{ fontStyle: "italic", color: "#cdab8f" }}>yang Sering Ditanya.</span>
                        </h2>
                    </div>
                </AnimatedSection>

                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {faqs.map((item, i) => (
                        <AnimatedSection key={i} delay={i * 80}>
                            <details style={{
                                borderBottom: "1px solid rgba(205,171,143,0.2)",
                                padding: "24px 0",
                                cursor: "pointer",
                                listStyle: "none",
                            }}>
                                <summary style={{
                                    fontFamily: "var(--font-sans)", fontSize: "0.95rem",
                                    fontWeight: 700, color: "#382a24",
                                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                                    cursor: "pointer", userSelect: "none" as const,
                                    listStyle: "none",
                                }}>
                                    {item.q}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cdab8f" strokeWidth={2.5} style={{ flexShrink: 0 }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <p style={{
                                    fontFamily: "var(--font-sans)", fontSize: "0.9rem",
                                    color: "#6e5c53", lineHeight: 1.75,
                                    marginTop: 16, paddingRight: 32,
                                }}>
                                    {item.a}
                                </p>
                            </details>
                        </AnimatedSection>
                    ))}
                </div>

                <AnimatedSection delay={500}>
                    <div style={{ textAlign: "center", marginTop: 56 }}>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "#a6968c", marginBottom: 16 }}>
                            Masih ada pertanyaan lain?
                        </p>
                        <a
                            href="https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20punya%20pertanyaan%20tentang%20produk%20kalian."
                            target="_blank" rel="noopener noreferrer"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: 8,
                                padding: "12px 28px", borderRadius: 999,
                                background: "#1d1816", color: "#faf7f2",
                                fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                textDecoration: "none", transition: "all 0.3s ease",
                            }}
                        >
                            Chat via WhatsApp
                        </a>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
