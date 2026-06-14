"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import Link from "next/link";

export default function ProductCatalogPage() {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({ firstName: "", email: "", phone: "" });
    const [showPendingWidget, setShowPendingWidget] = useState(false);
    const [paymentToken, setPaymentToken] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Note: Update to production URL when deploying
            const res = await fetch("https://payment-gateway.aldoramadhan16.workers.dev/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_id: `ORDER-LOVES-${Date.now()}`,
                    gross_amount: 30000,
                    product_type: "loves",
                    customer_details: {
                        first_name: customerDetails.firstName,
                        email: customerDetails.email,
                        phone: customerDetails.phone
                    },
                    item_details: [{
                        id: "loves",
                        price: 30000,
                        quantity: 1,
                        name: "Memoria (Premium)"
                    }]
                })
            });
            const data = await res.json();
            if (data.token) {
                const savedToken = data.token;
                setPaymentToken(savedToken);
                setIsCheckoutOpen(false);
                setIsLoading(false);

                (window as any).snap.pay(savedToken, {
                    onSuccess: () => { window.location.href = '/success'; },
                    onPending: () => { },
                    onError: () => { },
                    onClose: () => { setShowPendingWidget(true); }
                });
            } else {
                console.error(data);
            }
        } catch (err) {
            console.error(err);
        }
        setIsLoading(false);
    };

    return (
        <div style={{ minHeight: "100vh", background: "#faf7f2" }}>
            <Navbar />
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px clamp(16px, 4vw, 40px) 40px" }}>
                <Link href="/catalog" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "#a88365", textDecoration: "none", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Katalog
                </Link>
            </div>
            <section id="loves-edition" style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
                <style>{`
                    #loves-edition .hub-showcase-media {
                        background-color: #faf7f2 !important;
                    }
                    #loves-edition .hub-showcase-content {
                        background-color: #2D141E !important;
                        border-color: rgba(250, 247, 242, 0.25) !important;
                    }
                    #loves-edition .hub-showcase-content h3 { color: #faf7f2 !important; }
                    #loves-edition .hub-showcase-content p { color: rgba(250, 247, 242, 0.85) !important; }
                    #loves-edition .hub-showcase-content > div > div > span { color: #faf7f2 !important; opacity: 1 !important; }
                    
                    /* Themes Section */
                    #loves-edition .hub-showcase-media-wrapper > div:last-child {
                        background: #2D141E !important;
                        border-color: rgba(250, 247, 242, 0.25) !important;
                    }
                    #loves-edition .hub-showcase-media-wrapper > div:last-child button {
                        background: rgba(255, 255, 255, 0.2) !important;
                        border-color: rgba(255, 255, 255, 0.4) !important;
                        color: #faf7f2 !important;
                    }
                    #loves-edition .hub-showcase-media-wrapper > div:last-child button:hover {
                        background: rgba(255, 255, 255, 0.3) !important;
                        border-color: rgba(255, 255, 255, 0.6) !important;
                    }
                    #loves-edition .hub-showcase-media-wrapper > div:last-child span { color: #faf7f2 !important; }
                    #loves-edition .hub-showcase-media-wrapper > div:last-child span[style*="opacity: 0.8"] { color: rgba(250, 247, 242, 0.85) !important; opacity: 1 !important; }
                `}</style>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <LandscapeProductCard
                        label={
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                Done For You <span style={{ opacity: 0.5 }}>•</span> Premium
                            </div>
                        }
                        title="Memoria"
                        description="Serahkan materinya kepada Digital Atelier kami, dan kami akan menciptakan pengalaman kado digital paling premium untuk orang tersayang Anda."
                        features={[
                            "Desain Premium & Eksklusif",
                            "Bebas Kustomisasi Tema & Teks",
                            "Animasi Visual Interaktif",
                            "Kustomisasi Galeri & Musik Audio",
                            "Dikerjakan Langsung oleh Kami"
                        ]}
                        price="Rp 30.000"
                        demoLink="https://anniv.for-you-always.my.id/"
                        mediaSrc=""
                        fallbackImgSrc="/assets/opening_gate.png"
                        mediaType="image"
                        accentColor="#faf7f2"
                        accentGlow="rgba(250,247,242,0.15)"
                        onOrderClick={() => setIsCheckoutOpen(true)}
                        themesLabel="Koleksi Pages"
                        themes={[
                            { name: "Opening Gate", desc: "Animasi kado pembuka", color: "#faf7f2", fallbackImgSrc: "/assets/opening_gate.png" },
                            { name: "Opening Section", desc: "Sapaan & musik latar", color: "#faf7f2", fallbackImgSrc: "/assets/opening_section.webp" },
                            { name: "Time Section", desc: "Hitung mundur momen", color: "#faf7f2", fallbackImgSrc: "/assets/time_section.webp" },
                            { name: "Letter Section", desc: "Pesan menyentuh hati", color: "#faf7f2", fallbackImgSrc: "/assets/letter_section.webp" },
                            { name: "Reason Section", desc: "Bebas ubah tema/konsep", color: "#faf7f2", fallbackImgSrc: "/assets/reason_section.webp" },
                            { name: "Garden Section", desc: "Bebas ubah tema/konsep", color: "#faf7f2", fallbackImgSrc: "/assets/metafora-gardeon_section.webp" },
                            { name: "Gallery Section", desc: "Koleksi memori indah", color: "#faf7f2", fallbackImgSrc: "/assets/gallery_section.webp" },
                            { name: "Closing Section", desc: "Penutup yang manis", color: "#faf7f2", fallbackImgSrc: "/assets/closing%20section.webp" }
                        ]}
                        delay={100}
                        reverse={false}
                        initialSelectedIndex={0}
                        autoCycle={false}
                        tiktokHref="https://www.tiktok.com/@foryoualways.id/video/7647125933169675541?is_from_webapp=1&sender_device=pc"
                    />
                    </div>
                </div>
            </section>

            {/* Checkout Modal Overlay */}
            {isCheckoutOpen && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999
                }}>
                    <div style={{
                        background: "#fff", padding: 32, borderRadius: 24, width: "90%", maxWidth: 400,
                        boxShadow: "0 24px 48px rgba(0,0,0,0.2)", position: "relative"
                    }}>
                        <button onClick={() => setIsCheckoutOpen(false)} style={{
                            position: "absolute", top: 16, right: 16, background: "none", border: "none",
                            cursor: "pointer", color: "#666", padding: 8
                        }}>
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: 28, color: "#1d1816", marginBottom: 8, marginTop: 0 }}>Memoria (Premium)</h3>
                        <p style={{ color: "#6e5c53", fontSize: 14, marginBottom: 24 }}>Lengkapi data di bawah ini untuk menerima Link Kado Digital Anda.</p>
                        
                        <form onSubmit={handleCheckout} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#382a24", marginBottom: 6 }}>Nama Panggilan</label>
                                <input 
                                    type="text" required
                                    value={customerDetails.firstName} onChange={e => setCustomerDetails({...customerDetails, firstName: e.target.value})}
                                    style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e0d4cc", outline: "none", fontSize: 14 }}
                                    placeholder="Contoh: Budi"
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#382a24", marginBottom: 6 }}>Email Anda</label>
                                <input 
                                    type="email" required
                                    value={customerDetails.email} onChange={e => setCustomerDetails({...customerDetails, email: e.target.value})}
                                    style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e0d4cc", outline: "none", fontSize: 14 }}
                                    placeholder="Akses akan dikirim ke sini"
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#382a24", marginBottom: 6 }}>Nomor WhatsApp</label>
                                <input 
                                    type="tel" required
                                    value={customerDetails.phone} onChange={e => setCustomerDetails({...customerDetails, phone: e.target.value})}
                                    style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e0d4cc", outline: "none", fontSize: 14 }}
                                    placeholder="Contoh: 08123456789"
                                />
                            </div>
                            
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 16, borderTop: "1px dashed #e0d4cc" }}>
                                <span style={{ color: "#6e5c53", fontSize: 14 }}>Total Pembayaran</span>
                                <span style={{ color: "#1d1816", fontSize: 18, fontWeight: 700 }}>Rp 30.000</span>
                            </div>

                            <button type="submit" disabled={isLoading} style={{ width: "100%", padding: 16, borderRadius: 12, border: "none", background: "#d4af37", color: "#fff", fontSize: 15, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1, marginTop: 8, transition: "background 0.3s ease" }}>
                                {isLoading ? "Memproses..." : "Lanjut Pembayaran"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Pending Payment Widget */}
            {showPendingWidget && paymentToken && (
                <div style={{
                    position: "fixed", bottom: 24, left: 24, zIndex: 99999,
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
                            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#d4af37" }}>⏳ Menunggu Pembayaran</p>
                            <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: "#1d1816" }}>Memoria (Premium)</p>
                            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6e5c53" }}>Rp 30.000</p>
                        </div>
                        <button onClick={() => {
                            setPaymentToken(null);
                            setShowPendingWidget(false);
                        }} style={{ background: "none", border: "none", cursor: "pointer", color: "#a6968c", padding: 4 }}>
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <button onClick={() => {
                        (window as any).snap.pay(paymentToken, {
                            onSuccess: () => { window.location.href = '/success'; },
                            onPending: () => { },
                            onError: () => { },
                            onClose: () => { setShowPendingWidget(true); }
                        });
                    }} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "#d4af37", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 12 }}>
                        Lanjut Bayar
                    </button>
                </div>
            )}
        </div>
    );
}