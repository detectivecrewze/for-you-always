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

            <section style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <LandscapeProductCard
                            label="Invitation Edition"
                            title="Undangan Kencan Interaktif"
                            description="Kirimkan undangan kencan yang manis dan interaktif kepada orang spesialmu. Setiap pembelian sudah termasuk paket 3 gift — bisa buat 3 undangan berbeda."
                            features={[
                                "3 Gift Bundle Otomatis",
                                "Amplop Digital Interaktif",
                                "Pilih Tanggal Kencan Berdua",
                                "Pilih Aktivitas & Dress Code",
                                "Background Music Pilihan"
                            ]}
                            price="Rp 20.000"
                            oldPrice="Rp 30.000"
                            demoLink="https://invitation.for-you-always.my.id/WRcVb-mY0f"
                            mediaSrc="https://cdn.for-you-always.my.id/1782232677562-8sosah.webp"
                            fallbackImgSrc="https://cdn.for-you-always.my.id/1782232677562-8sosah.webp"
                            mediaType="image"
                            accentColor="#e8789a"
                            accentGlow="rgba(232,120,154,0.2)"
                            onAddToCart={() => addToCart({ id: "invitation", title: "Invitation Edition", numericPrice: 20000, oldNumericPrice: 30000, themeColor: "#8a3050" })}
                            onAddThreeSlotToCart={() => addToCart({ id: "invitation", title: "Invitation Edition (3 Gift)", numericPrice: 25000, themeColor: "#8a3050", isThreeSlot: true, slotCount: 3 })}
                            themesLabel="Pilih Mode & Template"
                            themes={[
                                {
                                    name: "Invitation Date",
                                    desc: "Kartu undangan kencan interaktif dengan date picker & dress code",
                                    title: "Undangan Kencan Interaktif",
                                    description: "Kirimkan undangan kencan yang manis dan interaktif kepada orang spesialmu. Setiap pembelian sudah termasuk paket 3 gift — bisa buat 3 undangan berbeda.",
                                    color: "#e8789a",
                                    features: [
                                        "3 Gift Bundle Otomatis",
                                        "Amplop Digital Interaktif",
                                        "Pilih Tanggal Kencan Berdua",
                                        "Pilih Aktivitas & Dress Code",
                                        "Background Music Pilihan"
                                    ],
                                    demoLink: "https://invitation.for-you-always.my.id/WRcVb-mY0f",
                                    demoLabel: "Lihat Demo Invitation",
                                    defaultSubThemeIndex: 0,
                                    subThemes: [
                                        { name: "Opening", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210841269-q6ybib.webp" },
                                        { name: "Invitation", fallbackImgSrc: "https://cdn.for-you-always.my.id/1782232677562-8sosah.webp" },
                                        { name: "Date Picker", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210838838-b3w88t.webp" },
                                        { name: "Date Activity", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210838139-qf8gc.webp" },
                                        { name: "Dress Code", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210839542-jybloo.webp" },
                                        { name: "Notes", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210840694-hzo19n.webp" },
                                        { name: "Ending", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210842087-xguq5o.webp" }
                                    ]
                                },
                                {
                                    name: "Rundown Date",
                                    desc: "Jadwal & susunan acara kencan interaktif bernuansa estetik",
                                    title: "Rundown Kencan Interaktif",
                                    description: "Buat susunan acara kencan yang rapi dan estetik untuk hari spesialmu. Pasanganmu bisa melihat jadwal kencan, dress code, dan catatan manis secara interaktif.",
                                    color: "#2b5c8f",
                                    features: [
                                        "3 Gift Bundle Otomatis",
                                        "Amplop Digital Interaktif",
                                        "Kartu Rundown & Susunan Acara",
                                        "Pilih Dress Code & Catatan",
                                        "Background Music Pilihan"
                                    ],
                                    demoLink: "https://invitation.for-you-always.my.id/rundown-tqthew7",
                                    demoLabel: "Lihat Demo Rundown",
                                    defaultSubThemeIndex: 0,
                                    subThemes: [
                                        { name: "Opening", fallbackImgSrc: "/assets/rundown-photo/1-ticket-card-opening.webp" },
                                        { name: "Flower Burst", fallbackImgSrc: "/assets/rundown-photo/2-flower-burst-transistion.webp" },
                                        { name: "Invitation", fallbackImgSrc: "/assets/rundown-photo/3-step1-photos-invitation.webp" },
                                        { name: "Rundown", fallbackImgSrc: "/assets/rundown-photo/4-rundown.webp" },
                                        { name: "Dress Code", fallbackImgSrc: "/assets/rundown-photo/4-dress-code.webp" },
                                        { name: "Notes", fallbackImgSrc: "/assets/rundown-photo/5-note-from-user.webp" },
                                        { name: "Ending Ticket", fallbackImgSrc: "/assets/rundown-photo/7-ticket-rundown.webp" }
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