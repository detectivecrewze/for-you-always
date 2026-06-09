"use client";

import React, { useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import Link from "next/link";

export default function ProductCatalogPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ minHeight: "100vh", background: "#faf7f2" }}>
            <Navbar />
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px clamp(16px, 4vw, 40px) 40px" }}>
                <Link href="/catalog" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "#a88365", textDecoration: "none", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Katalog
                </Link>
            </div>
            <section style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <LandscapeProductCard
                        label={
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                Done For You <span style={{ opacity: 0.5 }}>ΓÇó</span> Premium
                            </div>
                        }
                        title="Memoria"
                        description="Serahkan materinya kepada Digital Atelier kami, dan kami akan menciptakan pengalaman kado digital paling premium untuk orang tersayang Anda."
                        features={[
                            "Desain Premium & Eksklusif",
                            "Bebas Kustomisasi Tema & Teks",
                            "Animasi Visual Interaktif",
                            "Kustomisasi Galeri & Musik Audio",
                            "Dikerjakan Langsung oleh Kami"
                        ]}
                        price="Rp 40.000"
                        mediaSrc=""
                        fallbackImgSrc="/assets/opening_gate.png"
                        mediaType="image"
                        accentColor="#faf7f2"
                        accentGlow="rgba(250,247,242,0.15)"
                        href="https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20ingin%20memesan%20*Premium%20Edition*%20(Done-For-You)%20seharga%20Rp%2040.000.%20Mohon%20info%20langkah%20selanjutnya.%20Terima%20kasih!"
                        themesLabel="Koleksi Pages"
                        themes={[
                            { name: "Opening Gate", desc: "Animasi kado pembuka", color: "#faf7f2", fallbackImgSrc: "/assets/opening_gate.png" },
                            { name: "Opening Section", desc: "Sapaan & musik latar", color: "#faf7f2", fallbackImgSrc: "/assets/opening_section.webp" },
                            { name: "Time Section", desc: "Hitung mundur momen", color: "#faf7f2", fallbackImgSrc: "/assets/time_section.webp" },
                            { name: "Letter Section", desc: "Pesan menyentuh hati", color: "#faf7f2", fallbackImgSrc: "/assets/letter_section.webp" },
                            { name: "Reason Section", desc: "Bebas ubah tema/konsep", color: "#faf7f2", fallbackImgSrc: "/assets/reason_section.webp" },
                            { name: "Garden Section", desc: "Bebas ubah tema/konsep", color: "#faf7f2", fallbackImgSrc: "/assets/metafora-gardeon_section.webp" },
                            { name: "Gallery Section", desc: "Koleksi memori indah", color: "#faf7f2", fallbackImgSrc: "/assets/gallery_section.webp" },
                            { name: "Closing Section", desc: "Penutup yang manis", color: "#faf7f2", fallbackImgSrc: "/assets/closing%20section.webp" }
                        ]}
                        delay={100}
                        reverse={false}
                        initialSelectedIndex={0}
                        autoCycle={false}
                        tiktokHref="https://www.tiktok.com/@foryoualways.id/video/7647125933169675541?is_from_webapp=1&sender_device=pc"
                    />
                    </div>
                </div>
            </section>
        </div>
    );
}