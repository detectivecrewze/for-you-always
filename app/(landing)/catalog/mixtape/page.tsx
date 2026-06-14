"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import Link from "next/link";

export default function MixtapeCatalogPage() {
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
            const res = await fetch("https://payment-gateway.aldoramadhan16.workers.dev/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_id: `ORDER-MIXT-${Date.now()}`,
                    gross_amount: 20000,
                    product_type: "mixtape",
                    customer_details: {
                        first_name: customerDetails.firstName,
                        email: customerDetails.email,
                        phone: customerDetails.phone
                    },
                    item_details: [{ id: "mixtape-edition", price: 20000, quantity: 1, name: "Mixtape Edition (Premium Bundle)" }]
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
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "#faf7f2" }}>
            <Navbar />
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px clamp(16px, 4vw, 40px) 40px" }}>
                <Link href="/catalog" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "#4a7c8e", textDecoration: "none", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Katalog
                </Link>
            </div>
            <section style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <LandscapeProductCard
                            label={
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    Mixtape Edition <span style={{ opacity: 0.5 }}>•</span> Premium Bundle
                                </div>
                            }
                            title="Mixtape Edition"
                            description="Rangkai kenangan visual dan audio menjadi satu memori abadi bernuansa sinematik ala kaset retro. Setiap pembelian otomatis mendapatkan 3 kuota pembuatan mixtape untuk momen yang berbeda."
                            features={[
                                "Mendapatkan 3 Kuota / Slot Mixtape",
                                "Desain Aesthetic Kaset Klasik",
                                "Galeri Foto / Video",
                                "Background Music Pilihan",
                                "Rekam Suara & Custom Pesan"
                            ]}
                            price="Rp 20.000"
                            demoLink="https://mixtape.for-you-always.my.id/auto-w2ykcoi"
                            addonText="Token kuota (3 mixtape) akan otomatis dikirimkan via email setelah pembayaran selesai."
                            mediaSrc=""
                            fallbackImgSrc="https://cdn.for-you-always.my.id/1781034685666-udzbps.png"
                            mediaType="image"
                            accentColor="#5a8d9e"
                            accentGlow="rgba(90,141,158,0.3)"
                            onOrderClick={() => setIsCheckoutOpen(true)}
                            themes={[
                                { name: "Cassette Preview", desc: "Desain kaset retro original", color: "#5a8d9e", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781034685666-udzbps.png" },
                                { name: "Bundle Dashboard", desc: "Sistem quota bundle otomatis", color: "#5a8d9e", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781035640605-qnr98j.png" },
                                { name: "Studio Editor", desc: "Tampilan studio pembuatan mixtape", color: "#5a8d9e", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781035368915-b3d6f9.png" },
                                { name: "Login Gate", desc: "Gerbang masuk eksklusif (opsional)", color: "#5a8d9e", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781035286889-a2du4.png" },
                                { name: "Mixtape Gift", desc: "Tampilan pemutar kaset interaktif", color: "#5a8d9e", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781035695791-dxhu3.png" }
                            ]}
                            delay={100}
                            initialSelectedIndex={0}
                            autoCycle={false}
                        />
                    </div>
                </div>
            </section>
            
            {isCheckoutOpen && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", zIndex: 999999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                    <div style={{ background: "#fff", width: "100%", maxWidth: 400, borderRadius: 24, padding: "32px 24px", position: "relative", boxShadow: "0 24px 48px rgba(0,0,0,0.1)" }}>
                        <button onClick={() => setIsCheckoutOpen(false)} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", color: "#666", padding: 8 }}>
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: 28, color: "#1d1816", marginBottom: 8, marginTop: 0 }}>Mixtape Edition</h3>
                        <p style={{ color: "#6e5c53", fontSize: 14, marginBottom: 24 }}>Lengkapi data di bawah ini untuk menerima Token Akses Anda.</p>
                        
                        <form onSubmit={handleCheckout} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#382a24", marginBottom: 6 }}>Nama Panggilan</label>
                                <input type="text" required value={customerDetails.firstName} onChange={e => setCustomerDetails({...customerDetails, firstName: e.target.value})} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e0d4cc", outline: "none", fontSize: 14 }} placeholder="Contoh: Budi" />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#382a24", marginBottom: 6 }}>Email Anda</label>
                                <input type="email" required value={customerDetails.email} onChange={e => setCustomerDetails({...customerDetails, email: e.target.value})} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e0d4cc", outline: "none", fontSize: 14 }} placeholder="Token akan dikirim ke sini" />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#382a24", marginBottom: 6 }}>Nomor WhatsApp</label>
                                <input type="tel" required value={customerDetails.phone} onChange={e => setCustomerDetails({...customerDetails, phone: e.target.value})} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e0d4cc", outline: "none", fontSize: 14 }} placeholder="Contoh: 08123456789" />
                            </div>
                            
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 16, borderTop: "1px dashed #e0d4cc" }}>
                                <span style={{ color: "#6e5c53", fontSize: 14 }}>Total Pembayaran</span>
                                <span style={{ color: "#1d1816", fontSize: 18, fontWeight: 700 }}>Rp 20.000</span>
                            </div>

                            <button type="submit" disabled={isLoading} style={{ width: "100%", padding: 16, borderRadius: 12, border: "none", background: "#5a8d9e", color: "#fff", fontSize: 15, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1, marginTop: 8, transition: "background 0.3s ease" }}>
                                {isLoading ? "Memproses..." : "Lanjut Pembayaran"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showPendingWidget && paymentToken && (
                <div style={{ 
                    position: "fixed", bottom: 24, left: 24, zIndex: 999999, 
                    background: "#fff", width: 300, borderRadius: 20, 
                    boxShadow: "0 8px 32px rgba(0,0,0,0.18)", 
                    padding: "16px 20px",
                    borderTop: "3px solid #5b879c"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5b879c" }}>⏳ Menunggu Pembayaran</p>
                            <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: "#1d1816" }}>Mixtape Edition</p>
                            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6e5c53" }}>Rp 20.000</p>
                        </div>
                        <button 
                            onClick={() => {
                                setShowPendingWidget(false);
                                setPaymentToken(null);
                            }}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#a6968c", padding: 4 }}
                        >
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <button
                        onClick={() => {
                            (window as any).snap.pay(paymentToken, {
                                onSuccess: () => { window.location.href = '/success'; },
                                onPending: () => { },
                                onError: () => { },
                                onClose: () => { setShowPendingWidget(true); }
                            });
                        }}
                        style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: "#5b879c", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 12 }}
                    >
                        Lanjut Bayar
                    </button>
                </div>
            )}
        </div>
    );
}
