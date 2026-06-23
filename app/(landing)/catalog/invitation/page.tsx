"use client";

import React, { useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import { useCart } from "../../../context/CartContext";
import Link from "next/link";

export default function InvitationCatalogPage() {
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
                            label="Invitation Edition"
                            title="Undangan Kencan Interaktif"
                            description="Kirimkan undangan kencan yang manis dan interaktif kepada orang spesialmu. Lengkap dengan amplop digital, pilih tanggal berdua, aktivitas, dress code, dan tiket kencan eksklusif sebagai kenangan."
                            features={[
                                "Amplop Digital Interaktif",
                                "Pilih Tanggal Kencan Berdua",
                                "Pilih Aktivitas & Dress Code",
                                "Tiket Kencan Digital",
                                "Background Music Pilihan"
                            ]}
                            price="Rp 15.000"
                            demoLink="https://invitation.for-you-always.my.id/WRcVb-mY0f"

                            mediaSrc="https://cdn.for-you-always.my.id/1782232677562-8sosah.webp"
                            fallbackImgSrc="https://cdn.for-you-always.my.id/1782232677562-8sosah.webp"
                            mediaType="image"
                            accentColor="#e8789a"
                            accentGlow="rgba(232,120,154,0.2)"
                            onAddToCart={() => addToCart({ id: "invitation", title: "Invitation Edition", numericPrice: 15000, themeColor: "#8a3050" })}
                            themesLabel="Alur Undangan"
                            themes={[
                                { name: "Opening", desc: "Animasi amplop terbuka", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210841269-q6ybib.webp" },
                                { name: "Invitation", desc: "Kartu undangan utama", fallbackImgSrc: "https://cdn.for-you-always.my.id/1782232677562-8sosah.webp" },
                                { name: "Date Picker", desc: "Pemilihan tanggal & waktu", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210838838-b3w88t.webp" },
                                { name: "Date Activity", desc: "Pilihan aktivitas kencan", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210838139-qf8gc.webp" },
                                { name: "Dress Code", desc: "Tentukan dress code", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210839542-jybloo.webp" },
                                { name: "Notes", desc: "Pesan khusus & catatan", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210840694-hzo19n.webp" },
                                { name: "Ending", desc: "Card invitation download", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210842087-xguq5o.webp" }
                            ]}
                            delay={0}
                            reverse={false}
                            initialSelectedIndex={0}
                            autoCycle={false}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
