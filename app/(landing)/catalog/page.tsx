"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import CompactProductCard from "../../components/CompactProductCard";
import { AnimatedSection } from "../../components/LandscapeProductCard";
import CheckoutModal from "../../components/CheckoutModal";

export default function CatalogPage() {
    const [checkoutProduct, setCheckoutProduct] = useState<{ id: string, title: string, numericPrice: number, themeColor: string } | null>(null);
    const [pendingProduct, setPendingProduct] = useState<{ id: string, title: string, numericPrice: number, themeColor: string } | null>(null);
    const [paymentToken, setPaymentToken] = useState<string | null>(null);
    const [showPendingWidget, setShowPendingWidget] = useState(false);

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
            newPrice: "Rp 30.000",
            id: "loves",
            numericPrice: 30000,
            href: "/catalog/memoria",
            occasions: ["Anniversary", "Birthday", "Crush", "LDR"],
            features: ["Desain Eksklusif Kustom", "Galeri Foto Sinematik", "Layanan Terima Beres"]
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
            features: ["3 Pesan Suara Pribadi", "Galeri Foto & Musik", "Desain Player Estetik"]
        },
        {
            badgeText: "Premium Bundle",
            badgeColor: "#4a7c8e",
            titleColor: "#5a8d9e",
            imageSrc: "https://cdn.for-you-always.my.id/1781034685666-udzbps.png",
            title: "Mixtape Edition",
            oldPrice: "Rp 50.000",
            newPrice: "Rp 15.000",
            id: "mixtape",
            numericPrice: 15000,
            hashtag: "#3QUOTAS",
            soldCount: "New Release",
            href: "/catalog/mixtape",
            occasions: ["Crush", "Birthday", "Any Occasion", "Apology"],
            features: ["3 Playlist Kustom", "Kaset Retro Interaktif", "Galeri Multimedia Lengkap"]
        },
        {
            badgeText: "New ✨",
            badgeColor: "#e8789a",
            titleColor: "#8a3050",
            imageSrc: "https://cdn.for-you-always.my.id/1781210840115-m9v0xv.webp",
            title: "Invitation Edition",
            oldPrice: "Rp 30.000",
            newPrice: "Rp 15.000",
            id: "invitation",
            numericPrice: 15000,
            hashtag: "#DATEINVITATION",
            soldCount: "New Release",
            href: "/catalog/invitation",
            occasions: ["Crush", "LDR", "Anniversary", "Birthday"],
            features: ["3 Undangan Kencan", "Pilih Aktivitas Bebas", "Tiket Digital Animasi"]
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
            features: ["3 Surat Estetik", "Efek Typewriter Klasik", "Kejutan Amplop Foto"]
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
            features: ["10 Ruangan Game", "Kustomisasi Bebas", "Background Music Pilihan"]
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
            features: ["3 Tema Klasik OS", "Nostalgia Windows 98", "5 Tahapan Kejutan"]
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
            features: ["6 Halaman Recap", "Kustomisasi Fleksibel", "Storytelling Sinematik"]
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
                    {catalogItems.map((item, idx) => (
                        <AnimatedSection key={idx} delay={idx * 100}>
                            <CompactProductCard 
                                {...item} 
                                onOrder={() => setCheckoutProduct({ id: item.id, title: item.title, numericPrice: item.numericPrice, themeColor: item.titleColor })}
                            />
                        </AnimatedSection>
                    ))}
                </div>
            </div>

            {showPendingWidget && paymentToken && pendingProduct ? (
                <div style={{ 
                    position: "fixed", bottom: 24, left: 24, zIndex: 999999, 
                    background: "#fff", width: 320, borderRadius: 20, 
                    padding: 20, boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                    border: "1px solid #e0d4cc",
                    display: "flex", flexDirection: "column", gap: 12,
                    animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                }}>
                    <style>{`
                        @keyframes slideUp {
                            from { transform: translateY(20px); opacity: 0; }
                            to { transform: translateY(0); opacity: 1; }
                        }
                    `}</style>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: pendingProduct.themeColor || "#e8789a" }}>⏳ Menunggu Pembayaran</p>
                            <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: "#1d1816" }}>{pendingProduct.title}</p>
                            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6e5c53" }}>Rp {pendingProduct.numericPrice.toLocaleString('id-ID')}</p>
                        </div>
                        <button 
                            onClick={() => {
                                setPendingProduct(null);
                                setPaymentToken(null);
                                setShowPendingWidget(false);
                            }}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#a6968c", padding: 4 }}
                            title="Batalkan Pesanan"
                        >
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#faf7f2", padding: "10px 12px", borderRadius: 10, marginTop: 12 }}>
                        <span style={{ fontSize: 12, color: "#6e5c53" }}>Total</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: pendingProduct.themeColor || "#e8789a" }}>Rp {pendingProduct.numericPrice.toLocaleString('id-ID')}</span>
                    </div>

                    <button 
                        onClick={() => {
                            (window as any).snap.pay(paymentToken, {
                                onSuccess: () => { 
                                    window.location.href = '/success'; 
                                },
                                onPending: () => { },
                                onError: () => { },
                                onClose: () => { 
                                    setShowPendingWidget(true);
                                }
                            });
                        }}
                        style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: pendingProduct.themeColor || "#e8789a", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "background 0.3s ease", marginTop: 12 }}
                    >
                        Lanjut Bayar
                    </button>
                </div>
            ) : (
                <CheckoutModal 
                    product={checkoutProduct} 
                    onClose={() => {
                        setCheckoutProduct(null);
                        setPaymentToken(null);
                        setShowPendingWidget(false);
                    }} 
                />
            )}

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
