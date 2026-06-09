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
                            label="Arcade Edition"
                            title="10 Rooms of Memories"
                            description="Bawa dia ke dalam petualangan menyusuri 10 ruangan interaktif yang menceritakan perjalanan hubungan kalian."
                            features={[
                                "10 Ruangan Berbeda",
                                "Bisa Turn On / Off Room",
                                "Background Music Pilihan"
                            ]}
                            price={
                                <>
                                    <span style={{ textDecoration: "line-through", opacity: 0.6, fontWeight: 500 }}>Rp 25.000</span>
                                    <span style={{ marginLeft: 8 }}>Promo Rp 20.000</span>
                                </>
                            }
                            addonText="Tersedia opsi Terima Jadi: Rp 40.000"
                            mediaSrc="https://cdn.for-you-always.my.id/1773433190382-k7de49.mp4"
                            fallbackImgSrc="https://cdn.for-you-always.my.id/1777884639353-xogjtd.webp"
                            mediaType="image"
                            accentColor="#5c8c5c"
                            accentGlow="rgba(92,140,92,0.2)"
                            href="https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Arcade%20Edition*%20seharga%20Promo%20Rp%2020.000.%0A%0AMohon%20info%20langkah%20selanjutnyaya.%20Terima%20kasih!"
                            themesLabel="Koleksi Ruangan"
                            themes={[
                                { name: "Main Menu", desc: "Tampilan utama Arcade", videoSrc: "https://cdn.for-you-always.my.id/1773433190382-k7de49.mp4" },
                                { name: "Atlas", desc: "Peta lokasi kenangan", videoSrc: "https://cdn.for-you-always.my.id/1773525779608-nzn9pr.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015764592-ca91hs.webp" },
                                { name: "Music", desc: "Ruangan musik interaktif", videoSrc: "https://cdn.for-you-always.my.id/1773426110433-1feui.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015765012-bsu6r.webp" },
                                { name: "Journey", desc: "Lini masa perjalanan", videoSrc: "https://cdn.for-you-always.my.id/1773426101549-nd559h.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015764186-4os3t9.webp" },
                                { name: "Moments", desc: "Galeri memori berharga", videoSrc: "https://cdn.for-you-always.my.id/1773426107508-yc067a.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015763822-vcvc9c.webp" },
                                { name: "Quiz", desc: "Kuis kenangan bersama", videoSrc: "https://cdn.for-you-always.my.id/1773426113479-uu9xep.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015762633-9y59gi.webp" },
                                { name: "Catcher", desc: "Mini game penangkap", videoSrc: "https://cdn.for-you-always.my.id/1773426115531-1f4i3u.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015762272-i7zhec.webp" },
                                { name: "Fortune", desc: "Pesan keberuntungan", videoSrc: "https://cdn.for-you-always.my.id/1773426099696-jzm23i.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778052907957-kkx9zv.webp" },
                                { name: "Things", desc: "Hal-hal yang kamu sukain dari dia", videoSrc: "https://cdn.for-you-always.my.id/1773426093227-u7iyto.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015761318-x6271.webp" },
                                { name: "Bucket", desc: "Daftar impian bersama", videoSrc: "https://cdn.for-you-always.my.id/1773426095486-zsqvxo.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015763359-9obyye.webp" },
                                { name: "Message", desc: "Pesan rahasia spesial", videoSrc: "https://cdn.for-you-always.my.id/1773426105222-2tovrh.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015763020-0nfkam.webp" }
                            ]}
                            delay={350}
                            reverse={true}
                            initialSelectedIndex={0}
                            tiktokHref="https://www.tiktok.com/@foryoualways.id/video/7617458730858319125?is_from_webapp=1&sender_device=pc"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}