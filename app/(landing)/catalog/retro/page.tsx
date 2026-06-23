"use client";

import React, { useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import { useCart } from "../../../context/CartContext";
import Link from "next/link";

export default function ProductCatalogPage() {
    const { addToCart } = useCart();

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
                                    Retro Edition <span style={{ opacity: 0.5 }}>ΓÇó</span> NEW
                                </div>
                            }
                            title="Retro Gift Card"
                            description="Kado digital bergaya Windows 98/XP yang nostalgia. Cocok untuk birthday, apology, atau momen spesial apapun. Lengkap dengan GIF pilihan, surat digital, dan musik."
                            features={[
                                "Tampilan Retro Windows 98",
                                "Custom GIF Pilihan",
                                "5 Stages of Surprises",
                                "Support Mobile Experiences",
                                "Background Music Pilihan"
                            ]}
                            price={
                                <>
                                    <span style={{ marginLeft: 8 }}>Promo Rp 15.000</span>
                                </>
                            }
                            demoLink="https://retro.for-you-always.my.id/?to=retro-test"

                            fallbackImgSrc="https://cdn.for-you-always.my.id/1778444079509-72xi4d.png"
                            mediaType="image"
                            accentColor="#008689"
                            accentGlow="rgba(0,134,137,0.2)"
                            onAddToCart={() => addToCart({ id: "retro", title: "Retro Edition", numericPrice: 15000, themeColor: "#008689" })}
                            themesLabel="Koleksi Halaman"
                            themes={[
                                { name: "Greeting", desc: "Tampilan awal greeting card", color: "#008689", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778444079509-72xi4d.png" },
                                { name: "Music Player", desc: "Pemutar musik bergaya Winamp retro", color: "#008689", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778445055394-kwtv5o.png" },
                                { name: "Notepad.exe", desc: "Surat digital bergaya editor klasik", color: "#008689", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778445055893-z63rma.png" },
                                { name: "Secret Gallery", desc: "Galeri rahasia yang muncul di akhir pesan", color: "#008689", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778445056536-xvpcth.png" }
                            ]}
                            delay={250}
                            reverse={false}
                            initialSelectedIndex={0}
                            autoCycle={false}
                            tiktokHref="https://www.tiktok.com/@foryoualways.id/video/7641893530503351573?is_from_webapp=1&sender_device=pc"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}