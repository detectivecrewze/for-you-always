"use client";

import React, { useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import { useCart } from "../../../context/CartContext";
import Link from "next/link";

export default function LetterCatalogPage() {
    const { addToCart } = useCart();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ minHeight: "100vh", background: "#faf7f2" }}>
            <Navbar />

            {/* Back to Catalog Button */}
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px clamp(16px, 4vw, 40px) 40px" }}>
                <Link href="/catalog" style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#a88365",
                    textDecoration: "none",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase"
                }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Katalog
                </Link>
            </div>

            {/* Product Detail Section */}
            <section style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <LandscapeProductCard
                            label="Letter Edition"
                            title="Surat Digital Aesthetic"
                            description="Sampaikan pesan bermakna melalui surat digital bernuansa sinematik. Hadir dengan amplop interaktif, efek typewriter klasik, dan kustomisasi tema eksklusif."
                            features={[
                                "Amplop Digital Interaktif",
                                "Efek Typewriter Sinematik",
                                "Bisa Kirim Pesan Anonymous",
                                "Foto / Video di Akhir Surat",
                                "Background Music Pilihan"
                            ]}
                            price="Rp 15.000"
                            demoLink="https://letter.for-you-always.my.id/ribbon/letter-test"

                            fallbackImgSrc="https://cdn.for-you-always.my.id/1777883950201-eede1i.webp"
                            mediaType="image"
                            accentColor="#c4858a"
                            accentGlow="rgba(196,133,138,0.2)"
                            onAddToCart={() => addToCart({ id: "letter", title: "Letter Edition", numericPrice: 15000, themeColor: "#2a3d5c", isThreeSlot: true })}
                            themesLabel="Koleksi Template"
                            themes={[
                                {
                                    name: "Classic Wax Seal",
                                    desc: "Desain amplop minimalis dengan segel lilin",
                                    demoLink: "https://letter.for-you-always.my.id/letter-test",
                                    demoLabel: "Lihat Demo Wax",
                                    defaultSubThemeIndex: 0,
                                    subThemes: [
                                        { name: "Blush", color: "#e3b5b4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781975354379-zs8pmj.webp" },
                                        { name: "Sage", color: "#7a9e7e", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781975355062-7dvbi2.webp" },
                                        { name: "Obsidian Green", color: "#2d6a4f", fallbackImgSrc: "https://cdn.for-you-always.my.id/1782119885711-hczmpi.webp" },
                                        { name: "Rose Pink", color: "#c4858a", fallbackImgSrc: "https://cdn.for-you-always.my.id/1782119887163-8kand7.webp" },
                                        { name: "Red Burgundy", color: "#7b2434", fallbackImgSrc: "https://cdn.for-you-always.my.id/1782119887798-toxu2f.webp" },
                                        { name: "Midnight", color: "#2a3d5c", fallbackImgSrc: "https://cdn.for-you-always.my.id/1782119888422-pdxnom.webp" }
                                    ]
                                },
                                {
                                    name: "Vintage Airmail",
                                    desc: "Desain surat pos udara klasik",
                                    demoLink: "https://letter.for-you-always.my.id/airmail/letter-test",
                                    demoLabel: "Lihat Demo Airmail",
                                    subThemes: [
                                        { name: "Parchment", color: "#a68a64", fallbackImgSrc: "https://cdn.for-you-always.my.id/1779464837721-ukwgwd.webp" },
                                        { name: "Lilac", color: "#d4cadd", fallbackImgSrc: "https://cdn.for-you-always.my.id/1779464836965-9zahl.webp" },
                                        { name: "Sage", color: "#7a9e7e", fallbackImgSrc: "https://cdn.for-you-always.my.id/1779464838382-funvvg.webp" },
                                        { name: "Rose", color: "#c4858a", fallbackImgSrc: "https://cdn.for-you-always.my.id/1779464838087-ztk2sl.webp" },
                                        { name: "Midnight", color: "#2a3d5c", fallbackImgSrc: "https://cdn.for-you-always.my.id/1779464837348-a40rot.webp" },
                                        { name: "Bordeaux", color: "#581824", fallbackImgSrc: "https://cdn.for-you-always.my.id/1779464838763-2y25so.webp" }
                                    ]
                                },
                                {
                                    name: "Ribbon & Seal",
                                    desc: "Desain elegan dengan pita dan segel wax",
                                    demoLink: "https://letter.for-you-always.my.id/ribbon/letter-test",
                                    demoLabel: "Lihat Demo Ribbon",
                                    defaultSubThemeIndex: 2,
                                    subThemes: [
                                        { name: "Parchment", color: "#e8dbce", fallbackImgSrc: "https://cdn.for-you-always.my.id/1780253357350-fp09fd.webp" },
                                        { name: "Forest", color: "#4d6b53", fallbackImgSrc: "https://cdn.for-you-always.my.id/1780253356127-1es344.webp" },
                                        { name: "Midnight", color: "#2a3d5c", fallbackImgSrc: "https://cdn.for-you-always.my.id/1780253357024-sb9db.webp" },
                                        { name: "Rose", color: "#c4858a", fallbackImgSrc: "https://cdn.for-you-always.my.id/1780253355831-swb14.webp" },
                                        { name: "Bordeaux", color: "#581824", fallbackImgSrc: "https://cdn.for-you-always.my.id/1780253356734-jbzz6.webp" },
                                        { name: "Violet", color: "#8a6b96", fallbackImgSrc: "https://cdn.for-you-always.my.id/1780253356407-czstjw.webp" }
                                    ]
                                }
                            ]}
                            delay={0}
                            reverse={false}
                            initialSelectedIndex={2}
                            autoCycle={false}
                            tiktokHref="https://www.tiktok.com/@foryoualways.id/video/7629604229094591764?is_from_webapp=1&sender_device=pc"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
