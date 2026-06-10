"use client";

import React, { useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import Link from "next/link";

export default function LetterCatalogPage() {
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
                            demoLink="https://letter.for-you-always.my.id/letter-test"
                            addonText="Tersedia opsi Terima Jadi: Rp 30.000"
                            mediaSrc="https://cdn.for-you-always.my.id/1776679814124-0f7fq5.mp4"
                            fallbackImgSrc="https://cdn.for-you-always.my.id/1777883950201-eede1i.webp"
                            mediaType="image"
                            accentColor="#c4858a"
                            accentGlow="rgba(196,133,138,0.2)"
                            href="https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Letter%20Edition*%20seharga%20Rp%2015.000.%0A%0AMohon%20info%20langkah%20selanjutnyaya.%20Terima%20kasih!"
                            themesLabel="Koleksi Template"
                            themes={[
                                {
                                    name: "Classic Wax Seal",
                                    desc: "Desain amplop minimalis dengan segel lilin",
                                    defaultSubThemeIndex: 3,
                                    subThemes: [
                                        { name: "Parchment", color: "#a68a64", videoSrc: "https://cdn.for-you-always.my.id/1776679812683-gngv0r.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1777883951336-1eoxe7.webp" },
                                        { name: "Forest", color: "#4d6b53", videoSrc: "https://cdn.for-you-always.my.id/1776432454559-0o85rd.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1777883950505-o8x5o7.webp" },
                                        { name: "Midnight", color: "#2a3d5c", videoSrc: "https://cdn.for-you-always.my.id/1776432449348-uxmvjp.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1777883951055-ml1py.webp" },
                                        { name: "Crimson", color: "#c03050", fallbackImgSrc: "https://cdn.for-you-always.my.id/1777913945610-6kxb7.webp" },
                                        { name: "Obsidian", color: "#2d6a4f", fallbackImgSrc: "https://cdn.for-you-always.my.id/1777913945923-vqo0rr.webp" }
                                    ]
                                },
                                {
                                    name: "Vintage Airmail",
                                    desc: "Desain surat pos udara klasik",
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
                            initialSelectedIndex={0}
                            autoCycle={false}
                            tiktokHref="https://www.tiktok.com/@foryoualways.id/video/7629604229094591764?is_from_webapp=1&sender_device=pc"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
