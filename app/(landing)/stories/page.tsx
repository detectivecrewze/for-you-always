"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import FooterSection from "../../components/sections/FooterSection";
import { TESTIMONIALS_DATA } from "@/lib/testimonials-data";
import "./stories.css";

const PRODUCT_FILTERS = [
    { id: "all", label: "Semua Format (20)" },
    { id: "the-gift-box", label: "The Gift Box" },
    { id: "letter", label: "Letter Edition" },
    { id: "voices", label: "Voices Gift" },
    { id: "mixtape", label: "Mixtape Edition" },
    { id: "memoria", label: "Memoria (Wrapped)" },
    { id: "arcade", label: "Arcade Edition" },
    { id: "retro", label: "Retro Win98" },
    { id: "invitation", label: "Invitation" },
];

const STATS_ITEMS = [
    { num: "1000+", label: "Kado Terkirim" },
    { num: "5.0", label: "Average Rating" },
    { num: "8", label: "Formats" },
];

export default function StoriesPage() {
    const [activeFilter, setActiveFilter] = useState<string>("all");

    const filteredTestimonials = activeFilter === "all"
        ? TESTIMONIALS_DATA
        : TESTIMONIALS_DATA.filter((t) => t.productId === activeFilter);

    return (
        <div className="stories-page-container">
            <Navbar />
            <div className="stories-ambient-glow-1" />
            <div className="stories-ambient-glow-2" />

            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)", position: "relative", zIndex: 1 }}>

                {/* ── HEADER SECTION ── */}
                <header style={{ textAlign: "center", marginBottom: "50px" }}>
                    <span style={{
                        fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
                        fontSize: 8,
                        fontWeight: 700,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "rgba(166,124,82,0.9)",
                        display: "inline-block",
                        padding: "6px 20px",
                        border: "1px solid rgba(205,171,143,0.3)",
                        borderRadius: 999,
                        background: "rgba(205,171,143,0.08)",
                        marginBottom: 24,
                    }}>
                        Community &middot; Real Memories
                    </span>

                    <h1 style={{
                        fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                        fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
                        fontWeight: 400,
                        color: "#382a24",
                        lineHeight: 1.02,
                        letterSpacing: "-0.03em",
                        margin: "0 0 18px"
                    }}>
                        Kind Words.<br />
                        <span style={{ fontStyle: "italic", color: "#a88365" }}> Authentic Stories.</span>
                    </h1>

                    <p style={{
                        fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
                        fontSize: "clamp(0.9rem, 2vw, 1rem)",
                        color: "#6e5c53",
                        maxWidth: "600px",
                        margin: "0 auto 36px",
                        lineHeight: 1.6
                    }}>
                        Setiap surat dan kado diciptakan untuk momen-momen yang terlalu berharga untuk sekadar diucapkan lewat chat biasa. Inilah pesan nyata dari mereka yang telah mempercayakan perasaannya.
                    </p>

                    {/* Stats Counter */}
                    <div style={{
                        display: "inline-flex",
                        justifyContent: "center",
                        gap: "clamp(24px, 6vw, 80px)",
                        flexWrap: "wrap",
                        padding: "18px 36px",
                        background: "rgba(255, 255, 255, 0.65)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(205, 171, 143, 0.25)",
                        borderRadius: "24px",
                        boxShadow: "0 10px 30px -10px rgba(56, 42, 36, 0.05)"
                    }}>
                        {STATS_ITEMS.map((stat, i) => (
                            <div key={i} style={{ textAlign: "center" }}>
                                <div style={{
                                    fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                                    fontSize: "clamp(2rem, 4vw, 2.6rem)",
                                    fontWeight: 400,
                                    color: "#382a24",
                                    lineHeight: 1,
                                    marginBottom: 6
                                }}>
                                    {stat.num}
                                </div>
                                <div style={{
                                    fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
                                    fontSize: 9,
                                    fontWeight: 700,
                                    letterSpacing: "0.2em",
                                    textTransform: "uppercase",
                                    color: "rgba(166,124,82,0.8)"
                                }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </header>

                {/* ── FILTER PILLS (8 PRODUK VARIANT) ── */}
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "8px",
                    marginBottom: "40px"
                }}>
                    {PRODUCT_FILTERS.map((f) => (
                        <button
                            key={f.id}
                            type="button"
                            className={`story-filter-btn ${activeFilter === f.id ? "active" : ""}`}
                            onClick={() => setActiveFilter(f.id)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* ── TESTIMONIALS GRID ── */}
                <div className="stories-grid-container">
                    {filteredTestimonials.map((item) => (
                        <article key={item.id} className="story-editorial-card">
                            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                {/* Card Top: Avatar, Name, and Product Tag */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: "50%",
                                            background: "rgba(205,171,143,0.15)",
                                            border: "1px solid rgba(205,171,143,0.3)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            flexShrink: 0
                                        }}>
                                            <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 13, color: "#a88365", fontWeight: 700 }}>
                                                {item.customerAlias.charAt(4) || "P"}
                                            </span>
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700, color: "#382a24" }}>
                                                {item.customerAlias}
                                            </div>
                                            <div style={{ fontFamily: "var(--font-sans)", fontSize: 9.5, fontWeight: 600, color: "#a6968c" }}>
                                                {item.occasion} &middot; {item.timeAgo}
                                            </div>
                                        </div>
                                    </div>

                                    <span style={{
                                        fontFamily: "var(--font-sans)",
                                        fontSize: 9,
                                        fontWeight: 700,
                                        letterSpacing: "0.06em",
                                        textTransform: "uppercase",
                                        color: "rgba(166,124,82,0.9)",
                                        background: "rgba(205,171,143,0.12)",
                                        padding: "4px 10px",
                                        borderRadius: 999,
                                        border: "1px solid rgba(205,171,143,0.25)"
                                    }}>
                                        {item.productName}
                                    </span>
                                </div>

                                {/* Star Rating */}
                                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                                    {Array.from({ length: item.rating }).map((_, s) => (
                                        <span key={s} style={{ color: "#cdab8f", fontSize: 11 }}>★</span>
                                    ))}
                                </div>

                                {/* Highlight Quote */}
                                <blockquote style={{
                                    fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                                    fontStyle: "italic",
                                    fontSize: "1.15rem",
                                    color: "#382a24",
                                    lineHeight: 1.45,
                                    margin: "0 0 16px",
                                    paddingLeft: "12px",
                                    borderLeft: "2px solid #a67c52"
                                }}>
                                    &ldquo;{item.highlightQuote}&rdquo;
                                </blockquote>

                                {/* Native WhatsApp Chat Box */}
                                <div className="story-chat-box">
                                    {item.messages.map((msg, mIdx) => (
                                        <div
                                            key={mIdx}
                                            className={msg.sender === "customer" ? "story-bubble-client" : "story-bubble-atelier"}
                                        >
                                            <div>{msg.text}</div>
                                            <div style={{
                                                fontSize: "0.62rem",
                                                opacity: 0.65,
                                                textAlign: msg.sender === "customer" ? "left" : "right",
                                                marginTop: "4px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: msg.sender === "customer" ? "flex-start" : "flex-end",
                                                gap: "4px"
                                            }}>
                                                <span>{msg.time}</span>
                                                {msg.sender === "admin" && (
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cdab8f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card Bottom Meta */}
                            <div style={{
                                marginTop: "18px",
                                paddingTop: "14px",
                                borderTop: "1px solid rgba(205,171,143,0.15)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <span style={{ fontFamily: "var(--font-sans)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a6968c" }}>
                                    Verified Interaction
                                </span>
                                <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, color: "#a67c52" }}>
                                    100% Authentic
                                </span>
                            </div>
                        </article>
                    ))}
                </div>

                {/* ── BOTTOM CTA SECTION ── */}
                <section style={{
                    marginTop: "90px",
                    textAlign: "center",
                    padding: "60px 24px",
                    background: "#1d1816",
                    borderRadius: "32px",
                    border: "1px solid rgba(205,171,143,0.15)",
                    boxShadow: "0 20px 50px -10px rgba(29, 24, 22, 0.25)",
                    position: "relative",
                    overflow: "hidden"
                }}>
                    <div style={{ position: "absolute", top: "-20%", left: "30%", width: "40vw", height: "40vw", borderRadius: "50%", background: "rgba(205,171,143,0.06)", filter: "blur(60px)", pointerEvents: "none" }} />

                    <div style={{ position: "relative", zIndex: 1 }}>
                        <span style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: 8,
                            fontWeight: 700,
                            letterSpacing: "0.22em",
                            textTransform: "uppercase",
                            color: "rgba(205,171,143,0.6)",
                            display: "inline-block",
                            padding: "6px 20px",
                            border: "1px solid rgba(205,171,143,0.2)",
                            borderRadius: 999,
                            background: "rgba(205,171,143,0.08)",
                            marginBottom: 20,
                        }}>
                            Begin Your Story
                        </span>

                        <h2 style={{
                            fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                            fontSize: "clamp(2rem, 5vw, 3.2rem)",
                            fontWeight: 400,
                            color: "#faf7f2",
                            lineHeight: 1.05,
                            margin: "0 0 14px"
                        }}>
                            Siap Memberikan Kejutan yang<br />
                            <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Tak Terlupakan untuk Dia?</span>
                        </h2>

                        <p style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.95rem",
                            color: "rgba(250,247,242,0.75)",
                            maxWidth: "520px",
                            margin: "0 auto 32px",
                            lineHeight: 1.6
                        }}>
                            Pilih edisi kado atau surat digital yang paling mewakili perasaanmu. Proses pembuatan hanya beberapa menit dengan akses kenangan selamanya.
                        </p>

                        <Link
                            href="/catalog"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "16px 36px",
                                borderRadius: "999px",
                                background: "#faf7f2",
                                color: "#1d1816",
                                fontFamily: "var(--font-sans)",
                                fontSize: "0.85rem",
                                fontWeight: 700,
                                letterSpacing: "0.05em",
                                textDecoration: "none",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                                transition: "all 0.3s ease"
                            }}
                        >
                            <span>Lihat Katalog Kado &amp; Surat</span>
                            <span>&rarr;</span>
                        </Link>
                    </div>
                </section>

            </div>

            {/* ── BRAND FOOTER SECTION ── */}
            <FooterSection />
        </div>
    );
}
