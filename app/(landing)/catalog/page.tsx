"use client";

import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import CompactProductCard from "../../components/CompactProductCard";

export default function CatalogPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const catalogItems = [
        {
            badgeText: "#1 Exclusive",
            badgeColor: "#d4af37",
            titleColor: "#581824",
            imageSrc: "/assets/opening_gate.png",
            title: "Memoria (Premium)",
            newPrice: "Rp 40.000",
            href: "/catalog/memoria",
            occasions: ["Anniversary", "Birthday"],
            features: ["Done For You", "Premium & Eksklusif"]
        },
        {
            badgeText: "#1 Terlaris",
            badgeColor: "#e91e63",
            titleColor: "#a67c52",
            imageSrc: "https://cdn.for-you-always.my.id/1777881039502-bav595.webp",
            title: "Voices Gift",
            oldPrice: "Rp 30.000",
            newPrice: "Rp 15.000",
            hashtag: "#BESTSELLER",
            soldCount: "1.2k+ terjual",
            href: "/catalog/voices",
            occasions: ["Long Dist", "Any Occasion", "Birthday", "Apology"],
            features: ["Rekam Suara & Custom Pesan", "Galeri Foto Sinematik", "Background Music Pilihan"]
        },
        {
            badgeText: "Premium Bundle",
            badgeColor: "#4a7c8e",
            titleColor: "#5a8d9e",
            imageSrc: "https://cdn.for-you-always.my.id/1781034685666-udzbps.png",
            title: "Mixtape Edition",
            oldPrice: "Rp 50.000",
            newPrice: "Rp 25.000",
            hashtag: "#3QUOTAS",
            soldCount: "New Release",
            href: "/catalog/mixtape",
            occasions: ["Crush", "Birthday", "Any Occasion", "Apology"],
            features: ["3 Slot Mixtape Sekaligus", "Desain Kaset Klasik", "Galeri Foto / Video"]
        },
        {
            badgeText: "Popular",
            badgeColor: "#9c27b0",
            titleColor: "#2a3d5c",
            imageSrc: "https://cdn.for-you-always.my.id/1781032720701-5lb1a.png",
            title: "Letter Edition",
            oldPrice: "Rp 25.000",
            newPrice: "Rp 15.000",
            hashtag: "#AESTHETIC",
            soldCount: "850+ terjual",
            href: "/catalog/letter",
            occasions: ["Graduation", "Apology", "Anniversary"],
            features: ["Amplop Digital Interaktif", "Efek Typewriter Sinematik", "Foto / Video di Akhir Surat"]
        },
        {
            badgeText: "10 Rooms",
            badgeColor: "#5c8c5c",
            titleColor: "#5c8c5c",
            imageSrc: "https://cdn.for-you-always.my.id/1781032826300-poixyb.png",
            title: "Arcade Edition",
            oldPrice: "Rp 40.000",
            newPrice: "Rp 20.000",
            hashtag: "#10ROOMS",
            soldCount: "560+ terjual",
            href: "/catalog/arcade",
            occasions: ["Anniversary", "Birthday", "Bestie"],
            features: ["10 Ruangan Interaktif", "Bisa On / Off Room", "Background Music Pilihan"]
        },
        {
            badgeText: "Nostalgic",
            badgeColor: "#008689",
            titleColor: "#008689",
            imageSrc: "https://cdn.for-you-always.my.id/1778444079509-72xi4d.png",
            title: "Retro Edition",
            oldPrice: "Rp 30.000",
            newPrice: "Rp 15.000",
            hashtag: "#NOSTALGIA",
            soldCount: "430+ terjual",
            href: "/catalog/retro",
            occasions: ["Bestie", "Birthday", "Apology"],
            features: ["Tampilan Retro Windows 98", "Custom GIF Pilihan", "5 Stages of Surprises"]
        },
        {
            badgeText: "Storytelling",
            badgeColor: "#c9184a",
            titleColor: "#c9184a",
            imageSrc: "https://cdn.for-you-always.my.id/1777887751232-efe0ge.webp",
            title: "Wrapped Edition",
            oldPrice: "Rp 40.000",
            newPrice: "Rp 20.000",
            hashtag: "#MEMORIES",
            soldCount: "920+ terjual",
            href: "/catalog/wrapped",
            occasions: ["Year End", "Anniversary", "Birthday"],
            features: ["6 Halaman Interaktif", "Bisa On / Off Halaman", "Background Music Pilihan"]
        }
    ];

    return (
        <div style={{ minHeight: "100vh", background: "#faf7f2" }}>
            <Navbar />

            <div style={{ 
                maxWidth: 1100, 
                margin: "0 auto", 
                padding: "160px clamp(16px, 4vw, 40px) 100px",
                position: "relative",
                zIndex: 1
            }}>
                <div style={{ textAlign: "center", marginBottom: 60 }}>
                    <h1 style={{ 
                        fontFamily: "var(--font-display)", 
                        fontSize: "clamp(2.5rem, 6vw, 4rem)", 
                        fontWeight: 400, 
                        color: "#382a24", 
                        lineHeight: 1.1, 
                        letterSpacing: "-0.03em",
                        marginBottom: 16
                    }}>
                        Semua <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Koleksi.</span>
                    </h1>
                    <p style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "1.1rem",
                        color: "#6e5c53",
                        maxWidth: 540,
                        margin: "0 auto"
                    }}>
                        Temukan seluruh katalog kado digital spesial kami. Pilih template yang paling menggambarkan ceritamu.
                    </p>
                </div>

                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
                    gap: 32 
                }}>
                    {catalogItems.map((item, index) => (
                        <div key={index} style={{ 
                            animation: `fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 100}ms forwards`,
                            opacity: 0,
                            transform: "translateY(20px)"
                        }}>
                            <CompactProductCard {...item} />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes fade-in-up {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
