"use client";

import React, { useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import Link from "next/link";

export default function InvitationCatalogPage() {
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
                                "6 Pilihan Tema Warna",
                                "Tiket Kencan Digital",
                                "Background Music Pilihan"
                            ]}
                            price="Rp 10.000"
                            demoLink="https://invitation.for-you-always.my.id/WRcVb-mY0f"
                            addonText="Tersedia opsi Terima Jadi: Rp 20.000"
                            mediaSrc="https://cdn.for-you-always.my.id/1781210840115-m9v0xv.webp"
                            fallbackImgSrc="https://cdn.for-you-always.my.id/1781210840115-m9v0xv.webp"
                            mediaType="image"
                            accentColor="#e8789a"
                            accentGlow="rgba(232,120,154,0.2)"
                            href="https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Invitation%20Edition*%20seharga%20Rp%2010.000.%0A%0AMohon%20info%20langkah%20selanjutnya%20ya.%20Terima%20kasih!"
                            themesLabel="Preview Experience"
                            themes={[
                                {
                                    name: "Alur Undangan Kencan",
                                    desc: "Pengalaman interaktif dari awal hingga mendapat tiket",
                                    defaultSubThemeIndex: 1,
                                    subThemes: [
                                        { name: "1. Amplop", color: "#e8789a", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210841269-q6ybib.webp" },
                                        { name: "2. Undangan", color: "#6b8ddb", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210840115-m9v0xv.webp" },
                                        { name: "3. Tanggal", color: "#9b72d0", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210838838-b3w88t.webp" },
                                        { name: "4. Aktivitas", color: "#5dab78", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210838139-qf8gc.webp" },
                                        { name: "5. Dresscode", color: "#e07b4a", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210839542-jybloo.webp" },
                                        { name: "6. Pesan", color: "#3bbda0", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210840694-hzo19n.webp" },
                                        { name: "7. Tiket Akhir", color: "#5c2d3f", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210842087-xguq5o.webp" }
                                    ]
                                }
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
