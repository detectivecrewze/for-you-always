"use client";

import React, { useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import CheckoutModal, { CheckoutProduct } from "../../../components/CheckoutModal";
import { useState } from "react";
import Link from "next/link";

export default function ProductCatalogPage() {
    const [checkoutProduct, setCheckoutProduct] = useState<CheckoutProduct | null>(null);

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
            <section id="loves-edition" style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
                <style>{`
                    #loves-edition .hub-showcase-media {
                        background-color: #faf7f2 !important;
                    }
                    #loves-edition .hub-showcase-content {
                        background-color: #2D141E !important;
                        border-color: rgba(250, 247, 242, 0.25) !important;
                    }
                    #loves-edition .hub-showcase-content h3 { color: #faf7f2 !important; }
                    #loves-edition .hub-showcase-content p { color: rgba(250, 247, 242, 0.85) !important; }
                    #loves-edition .hub-showcase-content > div > div > span { color: #faf7f2 !important; opacity: 1 !important; }
                    
                    /* Themes Section */
                    #loves-edition .hub-showcase-media-wrapper > div:last-child {
                        background: #2D141E !important;
                        border-color: rgba(250, 247, 242, 0.25) !important;
                    }
                    #loves-edition .hub-showcase-media-wrapper > div:last-child button {
                        background: rgba(255, 255, 255, 0.2) !important;
                        border-color: rgba(255, 255, 255, 0.4) !important;
                        color: #faf7f2 !important;
                    }
                    #loves-edition .hub-showcase-media-wrapper > div:last-child button:hover {
                        background: rgba(255, 255, 255, 0.3) !important;
                        border-color: rgba(255, 255, 255, 0.6) !important;
                    }
                    #loves-edition .hub-showcase-media-wrapper > div:last-child span { color: #faf7f2 !important; }
                    #loves-edition .hub-showcase-media-wrapper > div:last-child span[style*="opacity: 0.8"] { color: rgba(250, 247, 242, 0.85) !important; opacity: 1 !important; }
                `}</style>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <LandscapeProductCard
                        label={
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                Done For You <span style={{ opacity: 0.5 }}>•</span> Premium
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
                        price="Rp 30.000"
                        demoLink="https://anniv.for-you-always.my.id/"
                        mediaSrc=""
                        fallbackImgSrc="/assets/opening_gate.png"
                        mediaType="image"
                        accentColor="#faf7f2"
                        accentGlow="rgba(250,247,242,0.15)"
                        onOrder={() => setCheckoutProduct({ id: "loves", title: "Memoria Premium", numericPrice: 30000, themeColor: "#581824" })}
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
            <CheckoutModal product={checkoutProduct} onClose={() => setCheckoutProduct(null)} />
</div>
    );
}