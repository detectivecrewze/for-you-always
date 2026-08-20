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
                                    Birthday Scrapbook <span style={{ opacity: 0.5 }}>•</span> New Release 🎂
                                </div>
                            }
                            title="Kado Ulang Tahun Interaktif"
                            description="Rayakan momen ulang tahun spesial dengan scrapbook digital interaktif. Lengkap dengan 15 galeri foto/video kenangan, 3 playlist musik personal, surat hangat, dan wish inbox untuk kado yang tak terlupakan."
                            features={[
                                "2 Pilihan Tema: Snoopy & Dubu",
                                "Hingga 15 Foto & Video Galeri",
                                "3 Playlist Musik Favorit",
                                "Surat Digital + Wish Inbox Interaktif",
                                "QR Code & Link Akses Instan"
                            ]}
                            price="Rp 25.000"
                            demoLink="https://snoopy.for-you-always.my.id/"
                            demoLabel="Buka Demo Scrapbook"
                            fallbackImgSrc="/assets/birthday/snoopy/welcome.webp"
                            mediaType="image"
                            accentColor="#d94238"
                            accentGlow="rgba(217, 66, 56, 0.25)"
                            onAddToCart={() => addToCart({
                                id: "birthday",
                                title: "Birthday Scrapbook",
                                numericPrice: 25000,
                                themeColor: "#d94238"
                            })}
                            themesLabel="Pilihan Tema Scrapbook"
                            themes={[
                                {
                                    name: "Snoopy Comic",
                                    desc: "Tema scrapbook comic yang cerah, hangat, dan playful bersama Snoopy & Woodstock",
                                    demoLink: "https://snoopy.for-you-always.my.id/",
                                    demoLabel: "Lihat Demo Snoopy",
                                    fallbackImgSrc: "/assets/birthday/snoopy/welcome.webp",
                                    defaultSubThemeIndex: 0,
                                    subThemes: [
                                        { name: "Welcome", fallbackImgSrc: "/assets/birthday/snoopy/welcome.webp" },
                                        { name: "Memories", fallbackImgSrc: "/assets/birthday/snoopy/cozy.webp" },
                                        { name: "Music", fallbackImgSrc: "/assets/birthday/snoopy/dance.webp" },
                                        { name: "Letter", fallbackImgSrc: "/assets/birthday/snoopy/letter.webp" },
                                        { name: "Celebrate", fallbackImgSrc: "/assets/birthday/snoopy/finale.webp" },
                                    ]
                                },
                                {
                                    name: "Dubu & Dudu",
                                    desc: "Tema warm pastel yang manis, menggemaskan, dan penuh kehangatan",
                                    demoLink: "https://snoopy.for-you-always.my.id/",
                                    demoLabel: "Lihat Demo Dubu",
                                    fallbackImgSrc: "/assets/birthday/dubu/welcome.webp",
                                    defaultSubThemeIndex: 0,
                                    subThemes: [
                                        { name: "Welcome", fallbackImgSrc: "/assets/birthday/dubu/welcome.webp" },
                                        { name: "Affection", fallbackImgSrc: "/assets/birthday/dubu/affection.webp" },
                                        { name: "Together", fallbackImgSrc: "/assets/birthday/dubu/together.webp" },
                                        { name: "Music", fallbackImgSrc: "/assets/birthday/dubu/dance.webp" },
                                        { name: "Celebrate", fallbackImgSrc: "/assets/birthday/dubu/celebrate.webp" },
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

