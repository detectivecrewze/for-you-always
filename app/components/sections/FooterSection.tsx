import React from "react";
import Image from "next/image";
import { AnimatedSection } from "../LandscapeProductCard";

const trustBadges = [
    { label: "5.0 Rating" },
    { label: "1000+ Stories" },
    { label: "Instant Access" },
    { label: "Private Link" },
];

const footerLinks = [
    { label: "Memoria", href: "https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Memoria%20Premium*.%20Mohon%20info%20selanjutnya%20ya.%20Terima%20kasih!" },
    { label: "Voices", href: "https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Voices%20Edition*.%20Mohon%20info%20selanjutnya%20ya.%20Terima%20kasih!" },
    { label: "Letter", href: "https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Letter%20Edition*.%20Mohon%20info%20selanjutnya%20ya.%20Terima%20kasih!" },
    { label: "Mixtape", href: "https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Mixtape%20Edition*.%20Mohon%20info%20selanjutnya%20ya.%20Terima%20kasih!" },
    { label: "Invitation", href: "https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Invitation%20Edition*.%20Mohon%20info%20selanjutnya%20ya.%20Terima%20kasih!" },
    { label: "Arcade", href: "https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Arcade%20Edition*.%20Mohon%20info%20selanjutnya%20ya.%20Terima%20kasih!" },
    { label: "Retro", href: "https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Retro%20Edition*.%20Mohon%20info%20selanjutnya%20ya.%20Terima%20kasih!" },
    { label: "Wrapped", href: "https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Wrapped%20Edition*.%20Mohon%20info%20selanjutnya%20ya.%20Terima%20kasih!" },
];

export default function FooterSection() {
    return (
        <>
            {/* ── FOOTER ── */}
            <section style={{ position: "relative", zIndex: 1, padding: "120px 24px 80px", background: "#faf7f2", textAlign: "center" }}>

                <AnimatedSection>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 80 }}>
                        {trustBadges.map((badge, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 24px", borderRadius: 999, border: "1px solid rgba(205,171,143,0.3)", fontSize: 11, fontWeight: 700, color: "#6e5c53", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                {badge.label}
                            </div>
                        ))}
                    </div>
                </AnimatedSection>

                <AnimatedSection delay={100}>
                    <div style={{ marginBottom: 40 }}>
                        <div style={{ position: "relative", width: 44, height: 44, borderRadius: 14, overflow: "hidden", border: "1.2px solid rgba(205,171,143,0.3)", margin: "0 auto 20px" }}>
                            <Image src="/logo.png" alt="Logo" fill style={{ objectFit: "cover", filter: "sepia(0.15) opacity(0.85)" }} />
                        </div>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 24, color: "#382a24", marginBottom: 8, letterSpacing: "-0.02em" }}>For you, Always.</div>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "#a6968c" }}>Preserving Memories Digitally</div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginBottom: 32 }}>
                        {footerLinks.map(link => (
                            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                                style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#6e5c53", textDecoration: "none", borderBottom: "1.5px solid transparent", transition: "all 0.3s ease" }}>
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 48 }}>
                        <a href="https://instagram.com/foryoualways.id" target="_blank" rel="noopener noreferrer" style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: 40, height: 40, borderRadius: "50%",
                            background: "rgba(205,171,143,0.1)", border: "1px solid rgba(205,171,143,0.3)",
                            color: "#6e5c53", textDecoration: "none", transition: "all 0.3s ease",
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <a href="https://tiktok.com/@foryoualways.id" target="_blank" rel="noopener noreferrer" style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: 40, height: 40, borderRadius: "50%",
                            background: "rgba(205,171,143,0.1)", border: "1px solid rgba(205,171,143,0.3)",
                            color: "#6e5c53", textDecoration: "none", transition: "all 0.3s ease",
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                        </a>
                    </div>

                    <div style={{ maxWidth: 600, margin: "0 auto 32px", textAlign: "center" }}>
                        <p style={{ fontSize: 10, color: "#8b7e75", lineHeight: 1.6, fontWeight: 400, fontFamily: "var(--font-sans)" }}>
                            For you, Always. adalah Digital Atelier yang menghadirkan pengalaman <strong>kado digital premium</strong> dan <strong>surat interaktif aesthetic</strong>. Cocok untuk hadiah anniversary, kado ulang tahun, merayakan momen spesial, atau kejutan LDR (Long Distance Relationship). Dari <em>Voices Gift</em>, <em>Arcade</em>, <em>Mixtape</em>, hingga <em>Retro Edition</em>, setiap karya didesain dengan animasi eksklusif untuk menciptakan memori yang tak terlupakan.
                        </p>
                    </div>

                    <p style={{ fontSize: 9, color: "#a6968c", fontWeight: 500, letterSpacing: "0.05em" }}>© 2026 FOR YOU, ALWAYS. — ALL RIGHTS RESERVED.</p>
                </AnimatedSection>
            </section>

            {/* Floating WhatsApp Button */}
            <a
                href="https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20ingin%20bertanya%20tentang%20produk%20kalian."
                target="_blank" rel="noopener noreferrer"
                aria-label="Hubungi via WhatsApp"
                style={{ position: "fixed", bottom: 28, right: 28, zIndex: 100, display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}
            >
                {/* Text Bubble */}
                <div className="hidden md:flex items-center gap-[6px]" style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    padding: "10px 20px",
                    borderRadius: "999px",
                    boxShadow: "0 8px 24px -4px rgba(29, 24, 22, 0.12)",
                    border: "1px solid rgba(205, 171, 143, 0.2)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}>
                    <span style={{ fontSize: 12.5, fontWeight: 500, color: "#6e5c53", fontFamily: "var(--font-sans)", letterSpacing: "-0.01em" }}>
                        Butuh bantuan? <strong style={{ color: "#382a24", fontWeight: 700 }}>Chat Admin</strong>
                    </span>
                </div>

                {/* WA Icon */}
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#1d1816", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px -4px rgba(29,24,22,0.25)", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#faf7f2">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.486 3.53 1.337 5.006L2.001 22l5.13-1.322A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.065-1.112l-.292-.174-3.046.784.813-2.934-.19-.302A7.965 7.965 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
                    </svg>
                </div>
            </a>
        </>
    );
}
