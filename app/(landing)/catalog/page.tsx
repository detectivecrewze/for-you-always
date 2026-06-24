"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import CompactProductCard from "../../components/CompactProductCard";
import { AnimatedSection } from "../../components/LandscapeProductCard";
import SlotPickerModal, { SlotPickerConfig } from "../../components/SlotPickerModal";
import { useCart } from "../../context/CartContext";

export default function CatalogPage() {
    const { addToCart } = useCart();
    const [slotPickerConfig, setSlotPickerConfig] = useState<SlotPickerConfig | null>(null);

    useEffect(() => {
    }, []);

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
            id: "loves",
            numericPrice: 40000,
            href: "/catalog/memoria",
            occasions: ["Anniversary", "Birthday", "Crush", "LDR"],
            features: ["Custom Desain Eksklusif", "Galeri Foto Sinematik", "Terima Beres (Done For You)"]
        },
        {
            badgeText: "#1 Terlaris",
            badgeColor: "#e91e63",
            titleColor: "#a67c52",
            imageSrc: "https://cdn.for-you-always.my.id/1777881039502-bav595.webp",
            title: "Voices Gift",
            newPrice: "Rp 15.000",
            oldPrice: "Rp 30.000",
            id: "voices",
            numericPrice: 15000,
            hashtag: "#BESTSELLER",
            soldCount: "1.2k+ terjual",
            href: "/catalog/voices",
            occasions: ["LDR", "Any Occasion", "Birthday", "Apology"],
            features: ["3 Kuota Voices Sekaligus", "Rekam Suara & Pesan Pribadi", "Galeri Foto & Music Pilihan"]
        },
        {
            badgeText: "Premium Bundle",
            badgeColor: "#4a7c8e",
            titleColor: "#5a8d9e",
            imageSrc: "https://cdn.for-you-always.my.id/1781034685666-udzbps.png",
            title: "Mixtape Edition",
            oldPrice: "Rp 50.000",
            newPrice: "Rp 20.000",
            id: "mixtape",
            numericPrice: 20000,
            hashtag: "#3QUOTAS",
            soldCount: "New Release",
            href: "/catalog/mixtape",
            occasions: ["Crush", "Birthday", "Any Occasion", "Apology"],
            features: ["3 Kuota Mixtape Sekaligus", "Desain Kaset Retro Interaktif", "Galeri Foto, Video & Musik"]
        },
        {
            badgeText: "New ✨",
            badgeColor: "#e8789a",
            titleColor: "#8a3050",
            imageSrc: "https://cdn.for-you-always.my.id/1782232677562-8sosah.webp",
            title: "Invitation Edition",
            oldPrice: "Rp 30.000",
            newPrice: "Rp 15.000",
            id: "invitation",
            numericPrice: 15000,
            hashtag: "#DATEINVITATION",
            soldCount: "New Release",
            href: "/catalog/invitation",
            occasions: ["Crush", "LDR", "Anniversary", "Birthday"],
            features: ["3 Kuota Invitation Sekaligus", "Pilih Tanggal & Aktivitas Kencan", "Tiket Digital Interaktif"]
        },
        {
            badgeText: "Popular",
            badgeColor: "#9c27b0",
            titleColor: "#2a3d5c",
            imageSrc: "https://cdn.for-you-always.my.id/1780253357024-sb9db.webp",
            title: "Letter Edition",
            oldPrice: "Rp 25.000",
            newPrice: "Rp 15.000",
            id: "letter",
            numericPrice: 15000,
            hashtag: "#AESTHETIC",
            soldCount: "2.1k+ terjual",
            href: "/catalog/letter",
            occasions: ["Graduation", "Apology", "Anniversary", "LDR"],
            features: ["3 Kuota Letter Sekaligus", "Efek Typewriter Sinematik", "Kejutan Amplop & Foto/Video"]
        },
        {
            badgeText: "10 Rooms",
            badgeColor: "#5c8c5c",
            titleColor: "#5c8c5c",
            imageSrc: "https://cdn.for-you-always.my.id/1781032826300-poixyb.png",
            title: "Arcade Edition",
            oldPrice: "Rp 40.000",
            newPrice: "Rp 20.000",
            id: "arcade",
            numericPrice: 20000,
            hashtag: "#10ROOMS",
            soldCount: "560+ terjual",
            href: "/catalog/arcade",
            occasions: ["Anniversary", "Birthday", "Bestie"],
            features: ["10 Ruangan Game Interaktif", "Kustomisasi On/Off Ruangan", "Dilengkapi Background Music"]
        },
        {
            badgeText: "Nostalgic",
            badgeColor: "#008689",
            titleColor: "#008689",
            imageSrc: "https://cdn.for-you-always.my.id/1778444079509-72xi4d.png",
            title: "Retro Edition",
            oldPrice: "Rp 30.000",
            newPrice: "Rp 15.000",
            id: "retro",
            numericPrice: 15000,
            hashtag: "#NOSTALGIA",
            soldCount: "340+ terjual",
            href: "/catalog/retro",
            occasions: ["Bestie", "Birthday", "Apology"],
            features: ["3 Kuota Retro Sekaligus", "Tema Klasik Windows 98", "5 Tahapan Kejutan Interaktif"]
        },
        {
            badgeText: "Storytelling",
            badgeColor: "#c9184a",
            titleColor: "#c9184a",
            imageSrc: "https://cdn.for-you-always.my.id/1777887751232-efe0ge.webp",
            title: "Wrapped Edition",
            oldPrice: "Rp 40.000",
            newPrice: "Rp 20.000",
            id: "wrapped",
            numericPrice: 20000,
            hashtag: "#MEMORIES",
            soldCount: "420+ terjual",
            href: "/catalog/wrapped",
            occasions: ["Year End", "Anniversary", "Birthday"],
            features: ["6 Halaman Recap Interaktif", "Kustomisasi On/Off Halaman", "Dilengkapi Background Music"]
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
                        Semua <span style={{ fontStyle: "italic", color: "#b58c6d" }}>Koleksi.</span>
                    </h1>
                    <p style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "1.1rem",
                        color: "#6e5c53",
                        maxWidth: 540,
                        margin: "0 auto"
                    }}>
                        Jelajahi koleksi kado digital eksklusif kami. Temukan kanvas terbaik untuk merangkai kenanganmu.
                    </p>
                </div>

                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
                    gap: 32 
                }}>
                    {catalogItems.map((item, idx) => {
                        const isEligible = ["letter", "voices", "retro"].includes(item.id);
                        
                        const handleAddToCart = () => {
                            addToCart({ id: item.id, title: item.title, numericPrice: item.numericPrice, themeColor: item.titleColor });
                        };

                        const handlePesanClick = () => {
                            if (isEligible) {
                                setSlotPickerConfig({
                                    productId: item.id,
                                    productTitle: item.title,
                                    themeColor: item.titleColor,
                                    onSelectSingle: handleAddToCart,
                                    onSelectThreeSlot: () => addToCart({ id: item.id, title: `${item.title} (3 Slot)`, numericPrice: 20000, themeColor: item.titleColor, isThreeSlot: true, slotCount: 3 }),
                                });
                            } else if (item.id === "mixtape" || item.id === "invitation") {
                                // Add as 3-slot bundle directly
                                addToCart({ id: item.id, title: `${item.title} (3 Slot)`, numericPrice: item.numericPrice, themeColor: item.titleColor, isThreeSlot: true, slotCount: 3 });
                            } else {
                                handleAddToCart();
                            }
                        };

                        return (
                            <AnimatedSection key={idx} delay={idx * 100}>
                                <CompactProductCard 
                                    {...item} 
                                    onAddToCart={handlePesanClick}
                                />
                            </AnimatedSection>
                        );
                    })}
                </div>
            </div>

            {/* Slot Picker Modal */}
            {slotPickerConfig && (
                <SlotPickerModal
                    config={slotPickerConfig}
                    onClose={() => setSlotPickerConfig(null)}
                />
            )}


            {/* Floating WhatsApp with label */}
            <a href="https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20ingin%20bertanya%20tentang%20produk%20kalian." target="_blank" rel="noopener noreferrer" aria-label="Hubungi via WhatsApp"
                style={{ position: "fixed", bottom: 28, right: 28, zIndex: 100, display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}
                onMouseEnter={e => { 
                    const btn = e.currentTarget.children[1] as HTMLElement;
                    if (btn) { btn.style.background = "#cdab8f"; btn.style.transform = "scale(1.05)"; }
                    const bubble = e.currentTarget.children[0] as HTMLElement;
                    if (bubble) { bubble.style.transform = "translateY(-2px)"; bubble.style.boxShadow = "0 12px 28px -4px rgba(29, 24, 22, 0.15)"; }
                }}
                onMouseLeave={e => { 
                    const btn = e.currentTarget.children[1] as HTMLElement;
                    if (btn) { btn.style.background = "#1d1816"; btn.style.transform = "scale(1)"; }
                    const bubble = e.currentTarget.children[0] as HTMLElement;
                    if (bubble) { bubble.style.transform = "translateY(0)"; bubble.style.boxShadow = "0 8px 24px -4px rgba(29, 24, 22, 0.12)"; }
                }}
            >
                {/* Text Bubble */}
                <div className="hidden md:flex items-center gap-[6px]" style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    padding: "10px 20px",
                    borderRadius: "999px",
                    boxShadow: "0 8px 24px -4px rgba(29, 24, 22, 0.12)",
                    border: "1px solid rgba(205, 171, 143, 0.2)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}>
                    <span style={{ fontSize: 12.5, fontWeight: 500, color: "#6e5c53", fontFamily: "var(--font-sans)", letterSpacing: "-0.01em" }}>
                        Butuh bantuan? <strong style={{ color: "#382a24", fontWeight: 700 }}>Chat Admin</strong>
                    </span>
                </div>

                {/* WA Icon */}
                <div
                    style={{ width: 48, height: 48, borderRadius: "50%", background: "#1d1816", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px -4px rgba(29,24,22,0.25)", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", flexShrink: 0 }}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#faf7f2">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.486 3.53 1.337 5.006L2.001 22l5.13-1.322A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.065-1.112l-.292-.174-3.046.784.813-2.934-.19-.302A7.965 7.965 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
                    </svg>
                </div>
            </a>

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
