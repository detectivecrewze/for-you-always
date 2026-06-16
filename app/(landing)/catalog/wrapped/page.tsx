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
            <section style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <LandscapeProductCard
                            label="Wrapped Edition"
                            title="Memories Wrapped"
                            description="Kado digital 6 halaman interaktif. Pilih lagu, galeri, rekap perjalanan, hingga surat yang bisa dibuka kapan saja."
                            features={[
                                "6 Halaman Berbeda",
                                "Bisa Turn On / Off Halaman",
                                "Background Music Pilihan"
                            ]}
                            price={
                                <>
                                    <span style={{ marginLeft: 8 }}>Promo Rp 20.000</span>
                                </>
                            }
                            addonText="Tersedia opsi Terima Jadi: Rp 40.000"
                            demoLink="https://love.for-you-always.my.id/love-test"
                            tiktokHref="https://www.tiktok.com/@foryoualways.id/video/7627348817905470741?is_from_webapp=1&sender_device=pc"
                            fallbackImgSrc="https://cdn.for-you-always.my.id/1777887751232-efe0ge.webp"
                            mediaType="image"
                            accentColor="#c9184a"
                            accentGlow="rgba(201,24,74,0.15)"
                            onOrder={() => setCheckoutProduct({ id: "wrapped", title: "Wrapped Edition", numericPrice: 20000, themeColor: "#c9184a" })}
                            themesLabel="Koleksi Halaman"
                            themes={[
                                { name: "Login", desc: "Halaman masuk", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015209230-zboaxw.webp" },
                                { name: "Music", desc: "Pilihan lagu favorit", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015209591-bgprs5.webp" },
                                { name: "Galleries", desc: "Kumpulan foto & video manis", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015208474-m5rlwh.webp" },
                                { name: "Wrapped", desc: "Ringkasan momen spesial", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015210238-kw2r9r.webp" },
                                { name: "Letter", desc: "Surat cinta dari hati", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778052950263-rgp29.webp" },
                                { name: "Invitation", desc: "Pertanyaan Lucu Dan Romantis", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015209910-p31n5.webp" }
                            ]}
                            delay={450}
                            reverse={false}
                            initialSelectedIndex={3}
                        />
                    </div>
                </div>
            </section>
            <CheckoutModal product={checkoutProduct} onClose={() => setCheckoutProduct(null)} />
</div>
    );
}