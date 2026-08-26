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
                                    Birthday Scrapbook <span style={{ opacity: 0.5 }}>•</span> New Release
                                </div>
                            }
                            title="Birthday Scrapbook"
                            description="Rayakan momen ulang tahun spesial dengan scrapbook digital interaktif. Tersedia pilihan tema Snoopy Comic, Dubu & Dudu, dan Nailong, lengkap dengan 15 galeri foto/video polaroid, 3 playlist soundtrack musik, surat personal, dan wish inbox interaktif."
                            features={[
                                "Pilihan Tema: Snoopy, Dubu & Nailong",
                                "4 Ruangan Interaktif",
                                "3 Playlist Soundtrack Musik",
                                "Surat Digital & Wish Inbox",
                                "Akses Instan & Custom Studio"
                            ]}
                            price="Rp 25.000"
                            oldPrice="Rp 35.000"
                            demoLink="https://snoopy.for-you-always.my.id/gift?project=gift-f0d02efd7edcbf62"
                            demoLabel="Lihat"
                            fallbackImgSrc="/assets/snoopy-features/main-card-updatesnoopy.webp"
                            mediaType="image"
                            accentColor="#bf7b19"
                            accentGlow="rgba(191, 123, 25, 0.2)"
                            onAddToCart={() => addToCart({
                                id: "birthday",
                                title: "Birthday Scrapbook",
                                numericPrice: 25000,
                                oldNumericPrice: 35000,
                                themeColor: "#bf7b19"
                            })}
                            themesLabel="Pilih Tema Scrapbook"
                            themes={[
                                {
                                    name: "Snoopy Comic",
                                    desc: "Tema scrapbook komik retro yang hangat & ceria bersama Snoopy & Woodstock",
                                    title: "Snoopy Birthday Scrapbook",
                                    description: "Kado ulang tahun digital interaktif bergaya komik retro Snoopy. Hadir dengan 4 ruangan kejutan lengkap: amplop interaktif, galeri hingga 15 foto/video polaroid, 3 playlist musik, surat personal, dan wish inbox.",
                                    color: "#bf7b19",
                                    features: [
                                        "4 Ruangan Interaktif",
                                        "Hingga 15 Foto & Video Polaroid",
                                        "3 Playlist Soundtrack Musik",
                                        "Surat Digital & Wish Inbox",
                                        "Akses Instan & Custom Studio"
                                    ],
                                    demoLink: "https://snoopy.for-you-always.my.id/gift?project=gift-f0d02efd7edcbf62",
                                    demoLabel: "Lihat",
                                    defaultSubThemeIndex: 0,
                                    subThemes: [
                                        { name: "Opening", fallbackImgSrc: "/assets/snoopy-features/opening-1.webp" },
                                        { name: "Wishes", fallbackImgSrc: "/assets/snoopy-features/wishes-2.webp" },
                                        { name: "Scrapbook", fallbackImgSrc: "/assets/snoopy-features/main-card-updatesnoopy.webp" },
                                        { name: "Wish Inbox", fallbackImgSrc: "/assets/snoopy-features/wish-card-update-snoopy.webp" },
                                        { name: "Galeri", fallbackImgSrc: "/assets/snoopy-features/room-galleries-5.webp" },
                                        { name: "Musik", fallbackImgSrc: "/assets/snoopy-features/room-music-6.webp" },
                                        { name: "Surat", fallbackImgSrc: "/assets/snoopy-features/letter-7.webp" },
                                        { name: "Perayaan", fallbackImgSrc: "/assets/snoopy-features/ending-8.webp" }
                                    ]
                                },
                                {
                                    name: "Dubu & Dudu",
                                    desc: "Tema warm pastel yang manis, menggemaskan, dan penuh kehangatan",
                                    title: "Dubu & Dudu Scrapbook",
                                    description: "Rayakan hari ulang tahun orang tersayang bersama karakter menggemaskan Dubu & Dudu. Penuh nuansa lembut pastel dengan 4 ruangan kenangan, pemutar musik, surat cinta, dan perayaan meriah.",
                                    color: "#bf7b19",
                                    features: [
                                        "Nuansa Visual Warm Pastel",
                                        "4 Ruangan Interaktif",
                                        "3 Playlist Soundtrack Musik",
                                        "Surat Digital & Wish Inbox",
                                        "Akses Instan & Custom Studio"
                                    ],
                                    demoLink: "https://snoopy.for-you-always.my.id/gift/index.html?project=gift-ab79b22216982751",
                                    demoLabel: "Lihat",
                                    defaultSubThemeIndex: 0,
                                    subThemes: [
                                        { name: "Opening", fallbackImgSrc: "/assets/dubu-features/opening-dubu-1.webp" },
                                        { name: "Wishes", fallbackImgSrc: "/assets/dubu-features/opening-dubu-2.webp" },
                                        { name: "Scrapbook", fallbackImgSrc: "/assets/dubu-features/main-carddubu-3.webp" },
                                        { name: "Wish Inbox", fallbackImgSrc: "/assets/dubu-features/room-wishdubu-4.webp" },
                                        { name: "Galeri", fallbackImgSrc: "/assets/dubu-features/room-galleriesdubu-5.jpg" },
                                        { name: "Musik", fallbackImgSrc: "/assets/dubu-features/room-musicdubu-6.webp" },
                                        { name: "Surat", fallbackImgSrc: "/assets/dubu-features/room-letterdubu-7.webp" },
                                        { name: "Perayaan", fallbackImgSrc: "/assets/dubu-features/room-endingdubu-8.webp" }
                                    ]
                                },
                                {
                                    name: "Nailong",
                                    desc: "Tema naga kuning ceria yang riang, menggemaskan, playful, dan penuh energi",
                                    title: "Nailong Birthday Scrapbook",
                                    description: "Rayakan hari ulang tahun spesial bersama karakter naga kuning Nailong yang lucu dan playful. Hadir dengan 4 ruangan kejutan interaktif, galeri foto/video polaroid, pemutar musik, surat personal, dan wish inbox.",
                                    color: "#f5a623",
                                    features: [
                                        "Nuansa Visual Ceria & Playful",
                                        "4 Ruangan Interaktif",
                                        "3 Playlist Soundtrack Musik",
                                        "Surat Digital & Wish Inbox",
                                        "Akses Instan & Custom Studio"
                                    ],
                                    demoLink: "https://snoopy.for-you-always.my.id/gift?project=gift-f0d02efd7edcbf62",
                                    demoLabel: "Lihat",
                                    defaultSubThemeIndex: 0,
                                    subThemes: [
                                        { name: "Opening", fallbackImgSrc: "/assets/snoopy-features/opening-1.webp" },
                                        { name: "Wishes", fallbackImgSrc: "/assets/snoopy-features/wishes-2.webp" },
                                        { name: "Scrapbook", fallbackImgSrc: "/assets/snoopy-features/main-card-updatesnoopy.webp" },
                                        { name: "Wish Inbox", fallbackImgSrc: "/assets/snoopy-features/wish-card-update-snoopy.webp" },
                                        { name: "Galeri", fallbackImgSrc: "/assets/snoopy-features/room-galleries-5.webp" },
                                        { name: "Musik", fallbackImgSrc: "/assets/snoopy-features/room-music-6.webp" },
                                        { name: "Surat", fallbackImgSrc: "/assets/snoopy-features/letter-7.webp" },
                                        { name: "Perayaan", fallbackImgSrc: "/assets/snoopy-features/ending-8.webp" }
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

