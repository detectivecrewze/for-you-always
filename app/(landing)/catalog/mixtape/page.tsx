"use client";

import React, { useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import CheckoutModal, { CheckoutProduct } from "../../../components/CheckoutModal";
import { useState } from "react";
import Link from "next/link";

export default function MixtapeCatalogPage() {
    const [checkoutProduct, setCheckoutProduct] = useState<CheckoutProduct | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ minHeight: "100vh", background: "#faf7f2" }}>
            <Navbar />
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px clamp(16px, 4vw, 40px) 40px" }}>
                <Link href="/catalog" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "#4a7c8e", textDecoration: "none", letterSpacing: "0.05em", textTransform: "uppercase" }}>
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
                                    Mixtape Edition <span style={{ opacity: 0.5 }}>•</span> Premium Bundle
                                </div>
                            }
                            title="Mixtape Edition"
                            description="Rangkai kenangan visual dan audio menjadi satu memori abadi bernuansa sinematik ala kaset retro. Setiap pembelian otomatis mendapatkan 3 kuota pembuatan mixtape untuk momen yang berbeda."
                            features={[
                                "Mendapatkan 3 Kuota",
                                "Desain kaset retro yang bisa di-play",
                                "Bebas custom foto/video & lagu",
                                "Bebas custom pesan personal",
                                "Rekam Suara & Custom Pesan"
                            ]}
                            price="Rp 20.000"
                            demoLink="https://mixtape.for-you-always.my.id/auto-w2ykcoi"
                            addonText="Kode bundle akan dikirimkan via DM/WA setelah pesanan dikonfirmasi."
                            mediaSrc=""
                            fallbackImgSrc="https://cdn.for-you-always.my.id/1781034685666-udzbps.png"
                            mediaType="image"
                            accentColor="#5a8d9e"
                            accentGlow="rgba(90,141,158,0.3)"
                            onOrder={() => setCheckoutProduct({ id: "mixtape", title: "Mixtape Edition", numericPrice: 15000, themeColor: "#5a8d9e" })}
                            themes={[
                                { name: "Cassette Preview", desc: "Desain kaset retro original", color: "#5a8d9e", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781034685666-udzbps.png" },
                                { name: "Bundle Dashboard", desc: "Sistem quota bundle otomatis", color: "#5a8d9e", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781035640605-qnr98j.png" },
                                { name: "Studio Editor", desc: "Tampilan studio pembuatan mixtape", color: "#5a8d9e", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781035368915-b3d6f9.png" },
                                { name: "Login Gate", desc: "Gerbang masuk eksklusif (opsional)", color: "#5a8d9e", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781035286889-a2du4.png" },
                                { name: "Mixtape Gift", desc: "Tampilan pemutar kaset interaktif", color: "#5a8d9e", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781035695791-dxhu3.png" }
                            ]}
                            delay={100}
                            initialSelectedIndex={0}
                            autoCycle={false}
                        />
                    </div>
                </div>
            </section>
            <CheckoutModal product={checkoutProduct} onClose={() => setCheckoutProduct(null)} />
</div>
    );
}
