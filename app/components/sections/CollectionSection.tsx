"use client";

import React from "react";
import Link from "next/link";
import AutoScrollCarousel from "../ProductCarousel";
import { useCart } from "../../context/CartContext";

export default function CollectionSection() {
    const { addToCart } = useCart();

    return (
        <section id="collection" style={{ position: "relative", zIndex: 1, padding: "120px 0 40px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>

                {/* Minimal header */}
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, marginBottom: 28 }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                            <div style={{ width: 24, height: 1, background: "rgba(168,131,101,0.5)" }} />
                            <p style={{
                                fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700,
                                letterSpacing: "0.2em", textTransform: "uppercase",
                                color: "#a88365", margin: 0
                            }}>Pilih Kado</p>
                        </div>
                        <h2 style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
                            fontWeight: 400,
                            color: "#1d1816", margin: 0,
                            letterSpacing: "-0.02em", lineHeight: 1.05
                        }}>
                            Temukan <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Gift-mu</span>
                        </h2>
                    </div>
                    <Link href="/catalog" style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "12px 24px", borderRadius: 999,
                        border: "1px solid rgba(205,171,143,0.3)",
                        fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700,
                        letterSpacing: "0.05em", textTransform: "uppercase",
                        color: "#8a7060", textDecoration: "none", whiteSpace: "nowrap",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseEnter={e => { 
                        e.currentTarget.style.background = "rgba(205,171,143,0.08)";
                        e.currentTarget.style.borderColor = "rgba(205,171,143,0.6)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={e => { 
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "rgba(205,171,143,0.3)";
                        e.currentTarget.style.transform = "translateY(0)";
                    }}
                    >
                        Lihat Semua
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </Link>
                </div>

                {/* ─── Auto-Scrolling Carousel ─── */}
                <div style={{ margin: "0 -24px", paddingBottom: 48 }}>
                    <AutoScrollCarousel
                        speed={55}
                        cards={[
                            {
                                badgeText: "#1 Exclusive",
                                badgeColor: "#d4af37",
                                badgeVariant: "solid",
                                imageSrc: "/assets/opening_gate.png",
                                price: "Rp 40.000",
                                title: "Memoria (Premium)",
                                titleColor: "#581824",
                                description: "Kado eksklusif done-for-you paling premium untuk momen anniversary dan ulang tahun.",
                                href: "/catalog/memoria",
                                onAddToCart: () => addToCart({ id: "loves", title: "Memoria Premium", numericPrice: 40000, themeColor: "#581824" })
                            },
                            {
                                badgeText: "#1 Terlaris",
                                badgeColor: "#e91e63",
                                badgeVariant: "solid",
                                imageSrc: "https://cdn.for-you-always.my.id/1777881039502-bav595.webp",
                                price: "Rp 15.000",
                                title: "Voices Gift",
                                titleColor: "#a67c52",
                                description: "Website kado romantis dengan rekaman suaramu, galeri foto sinematik, dan musik latar pilihan.",
                                href: "/catalog/voices",
                                onAddToCart: () => addToCart({ id: "voices", title: "Voices Gift", numericPrice: 15000, themeColor: "#a67c52" }),
                                isThreeSlotEligible: true,
                                onAddThreeSlotToCart: () => addToCart({ id: "voices", title: "Voices Gift (3 Slot)", numericPrice: 20000, themeColor: "#a67c52", isThreeSlot: true, slotCount: 3 })
                            },
                            {
                                badgeText: "Popular",
                                badgeColor: "#2a3d5c",
                                badgeVariant: "solid",
                                imageSrc: "https://cdn.for-you-always.my.id/1780253357024-sb9db.webp",
                                price: "Rp 15.000",
                                title: "Letter Edition",
                                titleColor: "#2a3d5c",
                                description: "Amplop digital interaktif dengan efek typewriter sinematik dan foto/video di akhir surat.",
                                href: "/catalog/letter",
                                onAddToCart: () => addToCart({ id: "letter", title: "Letter Edition", numericPrice: 15000, themeColor: "#2a3d5c" }),
                                isThreeSlotEligible: true,
                                onAddThreeSlotToCart: () => addToCart({ id: "letter", title: "Letter Edition (3 Slot)", numericPrice: 20000, themeColor: "#2a3d5c", isThreeSlot: true, slotCount: 3 })
                            },
                            {
                                badgeText: "Premium Bundle",
                                badgeColor: "#4a7c8e",
                                badgeVariant: "soft",
                                imageSrc: "https://cdn.for-you-always.my.id/1781034685666-udzbps.png",
                                price: "Rp 20.000",
                                title: "Mixtape Edition",
                                titleColor: "#5a8d9e",
                                description: "Desain kaset klasik dengan galeri foto & video untuk momen yang tak terlupakan.",
                                href: "/catalog/mixtape",
                                onAddToCart: () => addToCart({ id: "mixtape", title: "Mixtape Edition (3 Slot)", numericPrice: 20000, themeColor: "#5a8d9e", isThreeSlot: true, slotCount: 3 })
                            },
                            {
                                badgeText: "New ✨",
                                badgeColor: "#e8789a",
                                badgeVariant: "solid",
                                imageSrc: "https://cdn.for-you-always.my.id/1782232677562-8sosah.webp",
                                price: "Rp 15.000",
                                title: "Invitation Edition",
                                titleColor: "#8a3050",
                                description: "Undangan kencan interaktif — pilih tanggal, aktivitas, dan kirim tiket kencan digital.",
                                href: "/catalog/invitation",
                                onAddToCart: () => addToCart({ id: "invitation", title: "Invitation Edition (3 Slot)", numericPrice: 15000, themeColor: "#8a3050", isThreeSlot: true, slotCount: 3 })
                            },
                            {
                                badgeText: "10 Rooms",
                                badgeColor: "#5c8c5c",
                                badgeVariant: "solid",
                                imageSrc: "https://cdn.for-you-always.my.id/1781032826300-poixyb.png",
                                price: "Rp 20.000",
                                title: "Arcade Edition",
                                titleColor: "#5c8c5c",
                                description: "10 ruangan interaktif penuh kejutan dengan background music pilihan.",
                                href: "/catalog/arcade",
                                onAddToCart: () => addToCart({ id: "arcade", title: "Arcade Edition", numericPrice: 20000, themeColor: "#5c8c5c" })
                            },
                            {
                                badgeText: "Nostalgic",
                                badgeColor: "#008689",
                                badgeVariant: "soft",
                                imageSrc: "https://cdn.for-you-always.my.id/1778444079509-72xi4d.png",
                                price: "Rp 15.000",
                                title: "Retro Edition",
                                titleColor: "#008689",
                                description: "Tampilan retro Windows 98 dengan 5 stages of surprises dan custom GIF pilihan.",
                                href: "/catalog/retro",
                                onAddToCart: () => addToCart({ id: "retro", title: "Retro Edition", numericPrice: 15000, themeColor: "#008689" }),
                                isThreeSlotEligible: true,
                                onAddThreeSlotToCart: () => addToCart({ id: "retro", title: "Retro Edition (3 Slot)", numericPrice: 20000, themeColor: "#008689", isThreeSlot: true, slotCount: 3 })
                            },
                            {
                                badgeText: "Storytelling",
                                badgeColor: "#c9184a",
                                badgeVariant: "soft",
                                imageSrc: "https://cdn.for-you-always.my.id/1777887751232-efe0ge.webp",
                                price: "Rp 20.000",
                                title: "Wrapped Edition",
                                titleColor: "#c9184a",
                                description: "6 halaman interaktif bercerita — perfect untuk anniversary dan year-end recap.",
                                href: "/catalog/wrapped",
                                onAddToCart: () => addToCart({ id: "wrapped", title: "Wrapped Edition", numericPrice: 20000, themeColor: "#c9184a" })
                            },
                        ]}
                    />
                </div>

            </div>
        </section>
    );
}
