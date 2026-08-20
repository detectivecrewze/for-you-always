"use client";

import React, { useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import { useCart } from "../../../context/CartContext";
import Link from "next/link";
import { trackViewContent } from "@/lib/pixel";

export default function BirthdayCatalogPage() {
    const { addToCart } = useCart();

    useEffect(() => {
        window.scrollTo(0, 0);
        trackViewContent({ id: "birthday", name: "Birthday Scrapbook", price: 25000 });
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
                            label={
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    Birthday Scrapbook <span style={{ opacity: 0.5 }}>•</span> New
                                </div>
                            }
                            title="Kado Ulang Tahun Interaktif"
                            description="Rayakan hari spesial mereka dengan scrapbook digital penuh kenangan — foto, video, surat, musik, dan wish inbox dalam satu halaman yang bisa dibuat sendiri."
                            features={[
                                "2 Tema Visual: Snoopy & Dubu",
                                "Hingga 15 Foto / Video",
                                "3 Lagu Favorit di Playlist",
                                "Surat Personal + Wish Inbox",
                                "QR Code & Link Bisa Di-share"
                            ]}
                            price="Rp 25.000"
                            demoLink="https://snoopy.for-you-always.my.id/"
                            fallbackImgSrc="https://cdn.for-you-always.my.id/1777884639353-xogjtd.webp"
                            mediaType="image"
                            accentColor="#e88c8c"
                            accentGlow="rgba(232,140,140,0.2)"
                            onAddToCart={() => addToCart({
                                id: "birthday",
                                title: "Birthday Scrapbook",
                                numericPrice: 25000,
                                themeColor: "#e88c8c"
                            })}
                            themesLabel="Pilihan Tema"
                            themes={[
                                {
                                    name: "Snoopy",
                                    desc: "Tema Snoopy & Charlie Brown yang hangat dan ikonik",
                                    demoLink: "https://snoopy.for-you-always.my.id/",
                                    demoLabel: "Lihat Demo Snoopy",
                                    defaultSubThemeIndex: 0,
                                    subThemes: [
                                        {
                                            name: "Classic",
                                            color: "#f5e6c8",
                                            fallbackImgSrc: "https://cdn.for-you-always.my.id/1777884639353-xogjtd.webp"
                                        },
                                        {
                                            name: "Pastel",
                                            color: "#f0d6d6",
                                            fallbackImgSrc: "https://cdn.for-you-always.my.id/1777884639353-xogjtd.webp"
                                        }
                                    ]
                                },
                                {
                                    name: "Dubu & Dudu",
                                    desc: "Tema Dubu & Dudu yang lucu dan pastel",
                                    demoLink: "https://snoopy.for-you-always.my.id/",
                                    demoLabel: "Lihat Demo Dubu",
                                    defaultSubThemeIndex: 0,
                                    subThemes: [
                                        {
                                            name: "Cream",
                                            color: "#f0e6d3",
                                            fallbackImgSrc: "https://cdn.for-you-always.my.id/1777881039502-bav595.webp"
                                        },
                                        {
                                            name: "Lilac",
                                            color: "#d4cadd",
                                            fallbackImgSrc: "https://cdn.for-you-always.my.id/1777881039502-bav595.webp"
                                        }
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
