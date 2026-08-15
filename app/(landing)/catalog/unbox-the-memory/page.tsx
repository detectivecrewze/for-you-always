"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/Navbar";

import { trackViewContent } from "@/lib/pixel";
import UnboxCheckoutModal from "../../../components/UnboxCheckoutModal";
import DiscountPrice from "../../../components/DiscountPrice";

// SHOPEE STORE LINK
const SHOPEE_URL = "https://shopee.co.id"; // Link toko Shopee resmi Aldo saat siap

// ULTRA-LIGHT SECTION WRAPPER (MAXIMUM MOBILE PERFORMANCE)
function SpringAnimatedSection({ children }: { children: React.ReactNode; delay?: number }) {
    return <>{children}</>;
}

export default function UnboxTheMemoryPage() {
    const [selectedDigitalExperience, setSelectedDigitalExperience] = useState<"memoria" | "letter" | "voices">("memoria");
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);

    useEffect(() => {
        trackViewContent({ id: "unbox-the-memory", name: "Unbox the Memory" });
    }, []);

    const handleTabChange = (key: keyof typeof digitalExperiences) => {
        if (key === selectedDigitalExperience) return;
        setSelectedDigitalExperience(key);
    };

    const digitalExperiences = {
        memoria: {
            title: "Memoria",
            subtitle: "Kisah Cinta Sinematik Eksklusif",
            desc: "Halaman interaktif ultra-premium dengan animasi kelas atas, menceritakan perjalanan kasih kalian secara spesial.",
            badge: "Signature",
            color: "#d4af37",
            previewUrl: "/catalog/memoria",
            imageSrc: "/assets/opening_gate.png"
        },
        letter: {
            title: "Letter Edition",
            subtitle: "Surat Digital & Amplop Interaktif",
            desc: "Penerima akan membuka amplop digital dengan animasi typewriter sinematik, musik latar syahdu, serta galeri kenangan tersembunyi.",
            badge: "Favorit",
            color: "#a67c52",
            previewUrl: "/catalog/letter",
            imageSrc: "https://cdn.for-you-always.my.id/1783163306081-l92p1h.webp"
        },
        voices: {
            title: "Voices Gift",
            subtitle: "Rekaman Suara Pribadi & Galeri Foto",
            desc: "Pesan suara penuh kehangatan yang diputar otomatis bersama kompilasi foto kenangan terbaik kalian berdua.",
            badge: "Best Seller",
            color: "#e91e63",
            previewUrl: "/catalog/voices",
            imageSrc: "https://cdn.for-you-always.my.id/1777881039502-bav595.webp"
        }
    };

    return (
        <div style={{ backgroundColor: "#faf7f2", color: "#382a24", minHeight: "100vh", fontFamily: "var(--font-sans, system-ui, sans-serif)", position: "relative", overflowX: "hidden" }}>

            {/* GLOBAL FLOATING NAVBAR */}
            <Navbar />

            {/* AMBIENT BACKGROUND BLOBS */}
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-10%", left: "-5%", width: "50vw", height: "50vw", borderRadius: "50%", background: "rgba(205,171,143,0.08)", filter: "blur(130px)" }} />
                <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50vw", height: "50vw", borderRadius: "50%", background: "rgba(205,171,143,0.05)", filter: "blur(130px)" }} />
            </div>

            {/* ── HERO SECTION ── */}
            <section style={{
                position: "relative",
                zIndex: 1,
                paddingTop: "clamp(110px, 14vh, 150px)",
                paddingBottom: "clamp(60px, 8vh, 90px)",
                maxWidth: "1160px",
                margin: "0 auto",
                paddingLeft: "24px",
                paddingRight: "24px"
            }}>
                {/* BREADCRUMB BACK BUTTON */}
                <div style={{ marginBottom: "24px" }}>
                    <Link
                        href="/catalog"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "#6e5c53",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            textDecoration: "none",
                            padding: "6px 14px",
                            borderRadius: "999px",
                            backgroundColor: "rgba(255,255,255,0.6)",
                            border: "1px solid rgba(205,171,143,0.25)",
                            backdropFilter: "blur(8px)",
                            transition: "all 0.2s ease"
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color = "#a67c52";
                            e.currentTarget.style.backgroundColor = "#ffffff";
                            e.currentTarget.style.borderColor = "rgba(205,171,143,0.5)";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = "#6e5c53";
                            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.6)";
                            e.currentTarget.style.borderColor = "rgba(205,171,143,0.25)";
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        <span>Kembali ke Katalog Produk</span>
                    </Link>
                </div>

                {/* HERO 2-COLUMN LAYOUT: PHOTO ON LEFT, TEXT ON RIGHT */}
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "56px"
                }}>
                    {/* LEFT COLUMN: HERO HAMPERS SHOWCASE IMAGE CARD WITH BLUR SILHOUETTE & UPCOMING BADGE */}
                    <div
                        style={{
                            flex: "1 1 400px",
                            position: "relative",
                            display: "flex",
                            justifyContent: "center"
                        }}
                    >
                        <div style={{
                            position: "relative",
                            width: "100%",
                            maxWidth: "480px",
                            borderRadius: "28px",
                            overflow: "hidden",
                            border: "1px solid rgba(205,171,143,0.3)",
                            boxShadow: "0 20px 50px -15px rgba(56,42,36,0.15)",
                            background: "#1d1816"
                        }}>
                            <Image
                                src="/assets/unbox_hampers_hero.jpg"
                                alt="Unbox the Memory Gift Box Hampers Showcase"
                                width={560}
                                height={420}
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    display: "block",
                                    objectFit: "cover",
                                    borderRadius: "28px",
                                }}
                                priority
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: HEADLINE, SUBTITLE, PRICE & CTAS */}
                    <div style={{ flex: "1 1 480px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>

                        {/* 1. HEADLINE */}
                        <h1 style={{
                            fontFamily: "var(--font-display, Cormorant Garamond, Georgia, serif)",
                            fontSize: "clamp(2.5rem, 5vw, 4.2rem)",
                            fontWeight: 400,
                            lineHeight: 1.08,
                            color: "#382a24",
                            marginBottom: "20px",
                            letterSpacing: "-0.03em",
                            textAlign: "left"
                        }}>
                            Sentuhan Fisik,<br />
                            <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Keajaiban Digital.</span>
                        </h1>

                        {/* 2. SUBTITLE PARAGRAPH */}
                        <p style={{
                            fontSize: "clamp(1rem, 1.8vw, 1.12rem)",
                            color: "#6e5c53",
                            lineHeight: 1.7,
                            marginBottom: "20px",
                            fontWeight: 400,
                            maxWidth: "520px",
                            textAlign: "left"
                        }}>
                            Pengalaman gift box hampers fisik eksklusif berpadu dengan kado digital interaktif. Segera hadir untuk momen terindahmu.
                        </p>

                        {/* 3. ATELIER SIGNATURE PRICE PILL */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "28px",
                            flexWrap: "wrap",
                        }}>
                            <div style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 18px",
                                borderRadius: "999px",
                                backgroundColor: "#ffffff",
                                border: "1px solid rgba(205, 171, 143, 0.35)",
                                boxShadow: "0 2px 10px rgba(56, 42, 36, 0.04)",
                                whiteSpace: "nowrap",
                            }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a67c52" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                    <line x1="7" y1="7" x2="7.01" y2="7" />
                                </svg>
                                <DiscountPrice oldPrice="Rp 200.000" newPrice="Rp 150.000" size="md" layout="inline" />
                            </div>

                            <span style={{
                                fontSize: "0.8rem",
                                color: "#8a7569",
                                letterSpacing: "0.02em",
                                fontWeight: 500,
                                fontFamily: "var(--font-sans)",
                                whiteSpace: "nowrap",
                            }}>
                                Termasuk Kartu QR Digital
                            </span>
                        </div>

                        {/* 4. CTA BUTTONS: VIP WA NOTIFICATION WAITLIST */}
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
                            <button
                                onClick={() => setShowCheckoutModal(true)}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    backgroundColor: "#382a24",
                                    color: "#faf7f2",
                                    fontWeight: 700,
                                    fontSize: "0.92rem",
                                    padding: "16px 32px",
                                    borderRadius: "14px",
                                    border: "none",
                                    cursor: "pointer",
                                    boxShadow: "0 10px 30px -8px rgba(56,42,36,0.3)",
                                    transition: "all 0.3s ease"
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.backgroundColor = "#523e35";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.backgroundColor = "#382a24";
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg>
                                <span>Pesan Gift Box Sekarang</span>
                            </button>

                            <Link
                                href="/catalog"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    color: "#6e5c53",
                                    fontWeight: 600,
                                    fontSize: "0.92rem",
                                    padding: "16px 26px",
                                    borderRadius: "14px",
                                    textDecoration: "none",
                                    backgroundColor: "#ffffff",
                                    border: "1px solid rgba(205,171,143,0.3)",
                                    transition: "all 0.3s ease"
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.color = "#382a24";
                                    e.currentTarget.style.borderColor = "rgba(205,171,143,0.6)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.color = "#6e5c53";
                                    e.currentTarget.style.borderColor = "rgba(205,171,143,0.3)";
                                }}
                            >
                                <span>Coba Kado Digital Instan</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </Link>
                        </div>

                        {/* 5. TRUST BADGES ROW */}
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "20px",
                            paddingTop: "24px",
                            borderTop: "1px solid rgba(205,171,143,0.18)",
                            width: "100%"
                        }}>
                            {[
                                { title: "Gift Box Hampers Eksklusif" },
                                { title: "Kartu QR Code Custom" },
                                { title: "Akses Web Tanpa App" },
                                { title: "Pengiriman Garansi Safepack" }
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "#6e5c53", fontWeight: 500 }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a67c52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    <span>{item.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PRODUCT SHOWCASE GALLERY GRID (KOMPONEN HAMPERS) ── */}
            <section style={{ padding: "80px 24px", maxWidth: "1160px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                <div style={{ textAlign: "center", marginBottom: "60px" }}>
                    <span style={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "#a88365",
                        display: "inline-block",
                        padding: "6px 20px",
                        border: "1.2px solid rgba(205,171,143,0.2)",
                        borderRadius: 999,
                        background: "rgba(205,171,143,0.08)",
                        marginBottom: "16px"
                    }}>
                        Detail Sentuhan Fisik
                    </span>
                    <h2 style={{
                        fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                        fontSize: "clamp(2rem, 4vw, 3.2rem)",
                        fontWeight: 400,
                        color: "#382a24",
                        lineHeight: 1.1
                    }}>
                        Apa Saja Isi Di Dalam <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Gift Box?</span>
                    </h2>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "24px"
                }}>
                    {[
                        {
                            img: "/assets/unbox_hampers_hero.jpg",
                            tag: "Kemasan Premium",
                            title: "Gift Box Exclusive",
                            desc: "Kotak kado fisik eksklusif berdesain elegan yang dirancang untuk momen kejutan istimewa."
                        },
                        {
                            img: "/assets/unbox_qr_card.jpg",
                            tag: "Kartu QR Code",
                            title: "QR Experience Card",
                            desc: "Kartu QR code unik yang langsung terhubung ke halaman kado digital buatanmu."
                        },
                        {
                            img: "/assets/unbox_flowers_detail.jpg",
                            tag: "Sentuhan Manis",
                            title: "Special Touch",
                            desc: "Elemen pendukung eksklusif yang mempercantik tampilan unboxing kado saat dibuka."
                        },
                        {
                            img: "/assets/unbox_box_detail.jpg",
                            tag: "Kartu Akses",
                            title: "Panduan Unboxing",
                            desc: "Petunjuk mudah agar penerima bisa langsung scan dan menikmati kejutan kado."
                        }
                    ].map((card, idx) => (
                        <SpringAnimatedSection key={idx} delay={idx * 100}>
                            <div style={{
                                backgroundColor: "#ffffff",
                                border: "1px solid rgba(205,171,143,0.25)",
                                borderRadius: "24px",
                                overflow: "hidden",
                                boxShadow: "0 10px 30px -10px rgba(56,42,36,0.06)",
                                transition: "all 0.3s ease"
                            }}>
                                <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                                    <Image
                                        src={card.img}
                                        alt={card.title}
                                        width={400}
                                        height={300}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            filter: "blur(12px) contrast(1.05) brightness(0.95)",
                                            transform: "scale(1.06)"
                                        }}
                                    />
                                    <span style={{
                                        position: "absolute",
                                        top: "14px",
                                        left: "14px",
                                        backgroundColor: "rgba(29,24,22,0.8)",
                                        backdropFilter: "blur(10px)",
                                        color: "#cdab8f",
                                        fontSize: "0.72rem",
                                        fontWeight: 700,
                                        padding: "4px 12px",
                                        borderRadius: "50px",
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase"
                                    }}>
                                        {card.tag}
                                    </span>
                                </div>
                                <div style={{ padding: "24px" }}>
                                    <h3 style={{
                                        fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                                        fontSize: "1.45rem",
                                        fontWeight: 600,
                                        color: "#382a24",
                                        marginBottom: "8px"
                                    }}>
                                        {card.title}
                                    </h3>
                                    <p style={{ fontSize: "0.88rem", color: "#6e5c53", lineHeight: 1.6, margin: 0 }}>
                                        {card.desc}
                                    </p>
                                </div>
                            </div>
                        </SpringAnimatedSection>
                    ))}
                </div>
            </section>

            {/* ── WORKFLOW / 3-STEP JOURNEY SECTION ── */}
            <section id="cara-kerja" style={{ position: "relative", zIndex: 1, padding: "90px 24px", background: "#f2ebe1", overflow: "hidden" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "70px" }}>
                        <span style={{
                            fontSize: "0.8rem", fontWeight: 700,
                            letterSpacing: "0.22em", textTransform: "uppercase", color: "#a88365",
                            display: "inline-block", padding: "6px 20px",
                            border: "1.2px solid rgba(205,171,143,0.2)", borderRadius: 999,
                            background: "rgba(205,171,143,0.08)", marginBottom: "20px"
                        }}>
                            Alur Unboxing
                        </span>
                        <h2 style={{ fontFamily: "var(--font-display, Cormorant Garamond, serif)", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 400, color: "#382a24", lineHeight: 0.98 }}>
                            Semudah<br />
                            <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Tiga Langkah.</span>
                        </h2>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                        {[
                            {
                                num: "01",
                                title: "Notifikasi Rilis",
                                desc: "Klik 'Kabari Saya Saat Rilis' untuk mendaftarkan WhatsApp kamu agar mendapatkan pemberitahuan saat hampers resmi diluncurkan.",
                                icon: (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                    </svg>
                                )
                            },
                            {
                                num: "02",
                                title: "Terima & Open The Box",
                                desc: "Buka kemasan hampers eksklusif dan temukan Kartu Akses QR Code spesial di dalam gift box.",
                                icon: (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                                        <line x1="12" y1="18" x2="12.01" y2="18"></line>
                                    </svg>
                                )
                            },
                            {
                                num: "03",
                                title: "Scan QR & Nikmati Kado",
                                desc: "Cukup gunakan kamera HP untuk scan kartu. Halaman kado digital sinematik langsung terbuka di browser tanpa perlu install aplikasi!",
                                icon: (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                )
                            }
                        ].map((step, i) => (
                            <SpringAnimatedSection key={i} delay={i * 120}>
                                <div style={{
                                    padding: "44px 36px",
                                    background: i === 1 ? "#1d1816" : "#ffffff",
                                    borderRadius: "24px",
                                    border: i === 1 ? "1px solid rgba(205,171,143,0.2)" : "1px solid rgba(205,171,143,0.25)",
                                    boxShadow: i === 1 ? "0 25px 50px -12px rgba(29,24,22,0.4)" : "0 8px 30px -8px rgba(29,24,22,0.04)",
                                    height: "100%"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                                        <span style={{ fontSize: 12, color: i === 1 ? "#cdab8f" : "#a6968c", fontWeight: 700, letterSpacing: "0.1em" }}>{step.num}</span>
                                        <div style={{ flex: 1, height: 1, background: i === 1 ? "rgba(205,171,143,0.15)" : "rgba(205,171,143,0.15)" }} />
                                        <div style={{ color: i === 1 ? "#cdab8f" : "#a6968c", display: "flex" }}>
                                            {step.icon}
                                        </div>
                                    </div>
                                    <h3 style={{ fontFamily: "var(--font-display, Cormorant Garamond, serif)", fontSize: "1.6rem", fontWeight: 500, color: i === 1 ? "#faf7f2" : "#382a24", marginBottom: 14, lineHeight: 1.15 }}>
                                        {step.title}
                                    </h3>
                                    <p style={{ fontSize: "0.9rem", color: i === 1 ? "rgba(250,247,242,0.65)" : "#6e5c53", lineHeight: 1.65, margin: 0 }}>
                                        {step.desc}
                                    </p>
                                </div>
                            </SpringAnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── INTERACTIVE DIGITAL EXPERIENCE PREVIEW ── */}
            <section style={{ padding: "90px 24px", maxWidth: "1160px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                <div style={{ textAlign: "center", marginBottom: "48px" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#a88365" }}>
                        Pilihan Konten Digital
                    </span>
                    <h2 style={{
                        fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                        fontSize: "clamp(2rem, 4vw, 3.2rem)",
                        fontWeight: 400,
                        color: "#382a24",
                        marginTop: "8px"
                    }}>
                        Apa Isi QR Code Di Dalam <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Kotak?</span>
                    </h2>
                    <p style={{ color: "#6e5c53", maxWidth: "580px", margin: "12px auto 0", fontSize: "0.98rem", lineHeight: 1.6 }}>
                        Pilih salah satu edisi digital favorit untuk disematkan secara eksklusif ke dalam Kartu QR Code hampers fisikmu.
                    </p>
                </div>

                {/* EXPERIENCE TABS CONTAINER WITH LEFT & RIGHT NAVIGATION ARROWS */}
                {/* 3 DIGITAL EXPERIENCE TABS (CENTERED) */}
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginBottom: "36px",
                }}>
                    {(Object.keys(digitalExperiences) as Array<keyof typeof digitalExperiences>).map((key) => {
                        const exp = digitalExperiences[key];
                        const isSelected = selectedDigitalExperience === key;
                        return (
                            <button
                                key={key}
                                onClick={() => handleTabChange(key)}
                                style={{
                                    padding: "12px 28px",
                                    borderRadius: "999px",
                                    border: isSelected ? `2px solid ${exp.color}` : "1.2px solid rgba(205,171,143,0.3)",
                                    backgroundColor: isSelected ? "#ffffff" : "rgba(255,255,255,0.6)",
                                    color: isSelected ? exp.color : "#5a483e",
                                    fontWeight: isSelected ? 700 : 600,
                                    fontSize: "0.95rem",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    boxShadow: isSelected ? "0 8px 24px rgba(0,0,0,0.08)" : "none",
                                    transform: isSelected ? "scale(1.04)" : "scale(1)",
                                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
                                }}
                            >
                                {exp.title}
                            </button>
                        );
                    })}
                </div>

                {/* DISPLAY SELECTED PREVIEW CARD */}
                {(() => {
                    const currentExp = digitalExperiences[selectedDigitalExperience];
                    return (
                        <div style={{
                            backgroundColor: "rgba(255,255,255,0.8)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255,255,255,0.9)",
                            borderRadius: "28px",
                            padding: "clamp(24px, 4vw, 48px)",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: "36px",
                            alignItems: "center",
                            boxShadow: "0 20px 45px -15px rgba(56,42,36,0.08)"
                        }}>
                            <div>
                                <span style={{
                                    backgroundColor: `${currentExp.color}15`,
                                    color: currentExp.color,
                                    fontSize: "0.78rem",
                                    fontWeight: 700,
                                    padding: "6px 14px",
                                    borderRadius: "20px",
                                    display: "inline-block",
                                    marginBottom: "18px",
                                    letterSpacing: "0.05em"
                                }}>
                                    {currentExp.badge}
                                </span>
                                <h3 style={{
                                    fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                                    fontSize: "clamp(2rem, 3.5vw, 2.5rem)",
                                    fontWeight: 500,
                                    color: "#382a24",
                                    marginBottom: "6px"
                                }}>
                                    {currentExp.title}
                                </h3>
                                <h4 style={{ fontSize: "1.02rem", color: currentExp.color, fontWeight: 600, marginBottom: "16px" }}>
                                    {currentExp.subtitle}
                                </h4>
                                <p style={{ fontSize: "0.93rem", color: "#6e5c53", lineHeight: 1.7, marginBottom: "28px" }}>
                                    {currentExp.desc}
                                </p>
                                <Link
                                    href={currentExp.previewUrl}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        color: currentExp.color,
                                        fontWeight: 700,
                                        textDecoration: "none",
                                        fontSize: "0.95rem"
                                    }}
                                >
                                    <span>Prinjau Detail Emas Digital Ini</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </Link>
                            </div>

                            {/* DYNAMIC SCREENSHOT PREVIEW MOCKUP */}
                            <div style={{
                                position: "relative",
                                borderRadius: "24px",
                                overflow: "hidden",
                                border: "1px solid rgba(205,171,143,0.3)",
                                backgroundColor: "#1d1816",
                                boxShadow: "0 15px 35px -10px rgba(56,42,36,0.2)"
                            }}>
                                <div style={{
                                    height: "260px",
                                    position: "relative",
                                    overflow: "hidden"
                                }}>
                                    <Image
                                        key={selectedDigitalExperience}
                                        src={currentExp.imageSrc}
                                        alt={`Preview ${currentExp.title}`}
                                        width={480}
                                        height={320}
                                        priority
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block"
                                        }}
                                    />
                                    {/* TOP-RIGHT SCANNER BADGE */}
                                    <div style={{
                                        position: "absolute",
                                        top: "14px",
                                        right: "14px",
                                        backgroundColor: "rgba(29,24,22,0.85)",
                                        backdropFilter: "blur(12px)",
                                        border: "1px solid rgba(205,171,143,0.3)",
                                        color: "#cdab8f",
                                        fontSize: "0.72rem",
                                        fontWeight: 700,
                                        padding: "4px 12px",
                                        borderRadius: "999px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase"
                                    }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                                            <line x1="12" y1="18" x2="12.01" y2="18"></line>
                                        </svg>
                                        <span>QR Scan Result Preview</span>
                                    </div>
                                </div>

                                <div style={{ padding: "18px 24px", color: "#faf7f2", backgroundColor: "#1d1816" }}>
                                    <p style={{ fontWeight: 600, fontSize: "0.95rem", margin: 0, color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cdab8f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                        </svg>
                                        <span>Tampilan Saat QR Discanned</span>
                                    </p>
                                    <p style={{ fontSize: "0.82rem", color: "rgba(250,247,242,0.65)", marginTop: "4px", lineHeight: 1.5, margin: "4px 0 0 0" }}>
                                        Saat QR pada kartu di-scan, halaman <strong>{currentExp.title}</strong> ini akan langsung terbuka di HP penerima.
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </section>

            {/* ── FREQUENTLY ASKED QUESTIONS (FAQ) SECTION ── */}
            <section style={{ padding: "90px 24px", maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                <SpringAnimatedSection>
                    <div style={{ textAlign: "center", marginBottom: "56px" }}>
                        <span style={{
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            letterSpacing: "0.22em",
                            textTransform: "uppercase",
                            color: "#a88365",
                            display: "inline-block",
                            padding: "6px 20px",
                            border: "1.2px solid rgba(205,171,143,0.2)",
                            borderRadius: 999,
                            background: "rgba(205,171,143,0.08)",
                            marginBottom: "16px"
                        }}>
                            Panduan & Jawaban
                        </span>
                        <h2 style={{
                            fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                            fontSize: "clamp(2rem, 4vw, 3.2rem)",
                            fontWeight: 400,
                            color: "#382a24",
                            lineHeight: 1.1
                        }}>
                            Pertanyaan Yang Sering <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Diajukan</span>
                        </h2>
                        <p style={{ color: "#6e5c53", maxWidth: "540px", margin: "12px auto 0", fontSize: "0.95rem", lineHeight: 1.6 }}>
                            Temukan jawaban lengkap mengenai pemesanan hampers fisik, kartu QR emas, hingga akses kado digital.
                        </p>
                    </div>
                </SpringAnimatedSection>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {[
                        {
                            q: "Berapa lama estimasi pengiriman hampers ke kota tujuan?",
                            a: "Hampers fisik dikirim menggunakan ekspedisi terpercaya dengan pengemasan aman dan garansi sampai di tujuan. Estimasi pengiriman 1-3 hari kerja untuk wilayah Jabodetabek & Jawa, serta 3-5 hari kerja untuk luar pulau Jawa."
                        },
                        {
                            q: "Bagaimana cara memasukkan ucapan & foto ke dalam kado digital?",
                            a: "Setelah pemesanan terkonfirmasi, kamu akan menerima link Studio Pembuat Kado. Di sana kamu dapat mengunggah foto kenangan, menuliskan pesan puitis, dan memilih lagu favorit dengan sangat mudah."
                        },
                        {
                            q: "Apakah penerima harus meng-install aplikasi khusus untuk membuka QR Code?",
                            a: "Tidak perlu aplikasi apapun. Penerima cukup mengarahkan kamera bawaan HP (iPhone / Android) ke Kartu Akses QR. Halaman kado digital sinematik akan langsung terbuka otomatis di browser bawaan HP."
                        },
                        {
                            q: "Bisakah hampers dikirimkan langsung ke alamat penerima (sebagai hadiah)?",
                            a: "Tentu saja! Saat pemesanan, kamu bisa langsung memasukkan nama & alamat penerima sebagai tujuan pengiriman. Kami akan mengemas hampers dengan sangat rapi dan aman."
                        }
                    ].map((faq, i) => {
                        const isOpen = openFaqIndex === i;
                        return (
                            <SpringAnimatedSection key={i} delay={i * 70}>
                                <div
                                    style={{
                                        backgroundColor: isOpen ? "#ffffff" : "#fdfbf7",
                                        border: isOpen ? "1.5px solid rgba(205,171,143,0.5)" : "1px solid rgba(205,171,143,0.25)",
                                        borderRadius: "20px",
                                        overflow: "hidden",
                                        boxShadow: isOpen ? "0 12px 30px -10px rgba(56,42,36,0.08)" : "0 4px 15px -5px rgba(56,42,36,0.02)",
                                        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                                    }}
                                >
                                    <button
                                        onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                                        style={{
                                            width: "100%",
                                            padding: "22px 28px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: "16px",
                                            background: "none",
                                            border: "none",
                                            textAlign: "left",
                                            cursor: "pointer",
                                            color: "#382a24",
                                            outline: "none"
                                        }}
                                    >
                                        <span style={{
                                            fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                                            fontSize: "1.25rem",
                                            fontWeight: 600,
                                            lineHeight: 1.3,
                                            color: isOpen ? "#a67c52" : "#382a24"
                                        }}>
                                            {faq.q}
                                        </span>
                                        <div style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "50%",
                                            backgroundColor: isOpen ? "rgba(205,171,143,0.15)" : "rgba(205,171,143,0.08)",
                                            color: isOpen ? "#a67c52" : "#6e5c53",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                            transition: "all 0.3s ease"
                                        }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </button>
                                    {isOpen && (
                                        <div style={{
                                            padding: "0 28px 24px 28px",
                                            fontSize: "0.93rem",
                                            color: "#6e5c53",
                                            lineHeight: 1.7,
                                            borderTop: "1px solid rgba(205,171,143,0.12)",
                                            paddingTop: "16px"
                                        }}>
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            </SpringAnimatedSection>
                        );
                    })}
                </div>
            </section>

            {/* ── FOOTER CTA BANNER ── */}
            <section style={{
                backgroundColor: "#1d1816",
                color: "#faf7f2",
                padding: "90px 24px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden"
            }}>
                <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 2 }}>
                    <span style={{ color: "#cdab8f", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                        SPECIAL EDITION
                    </span>
                    <h2 style={{
                        fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                        fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)",
                        fontWeight: 400,
                        marginTop: "14px",
                        marginBottom: "16px",
                        color: "#ffffff"
                    }}>
                        Pesan <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Unbox the Memory</span>
                    </h2>
                    <p style={{ fontSize: "1.05rem", color: "rgba(250,247,242,0.7)", lineHeight: 1.7, marginBottom: "20px" }}>
                        Dapatkan paket hampers fisik eksklusif lengkap dengan kado digital interaktif pilihanmu.
                    </p>

                    <div style={{
                        display: "inline-flex",
                        alignItems: "baseline",
                        gap: "10px",
                        marginBottom: "32px",
                        whiteSpace: "nowrap",
                    }}>
                        <span style={{ fontFamily: "var(--font-display, Cormorant Garamond, serif)", fontSize: "clamp(1.8rem, 3.5vw, 2.2rem)", fontWeight: 600, color: "#ffffff", whiteSpace: "nowrap" }}>
                            Rp 150.000
                        </span>
                        <span style={{ fontSize: "0.95rem", color: "rgba(250,247,242,0.45)", textDecoration: "line-through", whiteSpace: "nowrap" }}>
                            Rp 200.000
                        </span>
                    </div>
                    <br />

                    <button
                        onClick={() => setShowCheckoutModal(true)}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "12px",
                            backgroundColor: "#cdab8f",
                            color: "#1d1816",
                            fontWeight: 700,
                            fontSize: "1.05rem",
                            padding: "18px 42px",
                            borderRadius: "14px",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 12px 35px rgba(205,171,143,0.3)",
                            transition: "all 0.3s ease"
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.backgroundColor = "#d8b99d";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.backgroundColor = "#cdab8f";
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        <span>Pesan Gift Box Sekarang</span>
                    </button>
                </div>
            </section>

            {/* UNBOX CHECKOUT MODAL */}
            {showCheckoutModal && (
                <UnboxCheckoutModal
                    onClose={() => setShowCheckoutModal(false)}
                    initialDigitalProduct={selectedDigitalExperience}
                />
            )}

            {/* CSS KEYFRAME ANIMATIONS */}
            <style>{`
                @keyframes ribbon-beam-sweep {
                    0% { transform: translateX(-140%); }
                    30%, 100% { transform: translateX(240%); }
                }

                @keyframes shopee-icon-bounce {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    15% { transform: translateY(-3px) rotate(-6deg); }
                    30% { transform: translateY(0) rotate(4deg); }
                    45% { transform: translateY(-1px) rotate(0deg); }
                }

                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
