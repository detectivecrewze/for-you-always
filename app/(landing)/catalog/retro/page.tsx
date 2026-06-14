"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import Link from "next/link";

export default function ProductCatalogPage() {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({
        firstName: "",
        email: "",
        phone: ""
    });
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
                    order_id: `ORDER-RETRO-${Date.now()}`,
                    gross_amount: 15000,
                    product_type: "retro",
                    customer_details: {
                        first_name: customerDetails.firstName,
                        email: customerDetails.email,
                        phone: customerDetails.phone
                    },
                    item_details: [{
                        id: "retro-edition",
                        price: 15000,
                        quantity: 1,
                        name: "Retro Edition (Digital)"
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
                <Link href="/catalog" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "#a88365", textDecoration: "none", letterSpacing: "0.05em", textTransform: "uppercase" }}>
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
                                    Retro Edition <span style={{ opacity: 0.5 }}>•</span> NEW
                                </div>
                            }
                            title="Retro Gift Card"
                            description="Kado digital bergaya Windows 98/XP yang nostalgia. Cocok untuk birthday, apology, atau momen spesial apapun. Lengkap dengan GIF pilihan, surat digital, dan musik."
                            features={[
                                "Tampilan Retro Windows 98",
                                "Custom GIF Pilihan",
                                "5 Stages of Surprises",
                                "Support Mobile Experiences",
                                "Background Music Pilihan"
                            ]}
                            price={
                                <>
                                    <span style={{ marginLeft: 8 }}>Promo Rp 15.000</span>
                                </>
                            }
                            demoLink="https://retro.for-you-always.my.id/?to=retro-test"
                            addonText="Tersedia opsi Terima Jadi: Rp 30.000"
                            mediaSrc="https://cdn.for-you-always.my.id/1778444022368-wu278.mp4"
                            fallbackImgSrc="https://cdn.for-you-always.my.id/1778444079509-72xi4d.png"
                            mediaType="image"
                            accentColor="#008689"
                            accentGlow="rgba(0,134,137,0.2)"
                            onOrderClick={() => setIsCheckoutOpen(true)}
                            themesLabel="Koleksi Halaman"
                            themes={[
                                { name: "Greeting", desc: "Tampilan awal greeting card", color: "#008689", videoSrc: "https://cdn.for-you-always.my.id/1778444022368-wu278.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778444079509-72xi4d.png" },
                                { name: "Music Player", desc: "Pemutar musik bergaya Winamp retro", color: "#008689", videoSrc: "https://cdn.for-you-always.my.id/1778444904917-83vbnc.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778445055394-kwtv5o.png" },
                                { name: "Notepad.exe", desc: "Surat digital bergaya editor klasik", color: "#008689", videoSrc: "https://cdn.for-you-always.my.id/1778444905827-1feuiq.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778445055893-z63rma.png" },
                                { name: "Secret Gallery", desc: "Galeri rahasia yang muncul di akhir pesan", color: "#008689", videoSrc: "https://cdn.for-you-always.my.id/1778444906361-ehz9q.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778445056536-xvpcth.png" }
                            ]}
                            delay={250}
                            reverse={false}
                            initialSelectedIndex={0}
                            autoCycle={false}
                            tiktokHref="https://www.tiktok.com/@foryoualways.id/video/7641893530503351573?is_from_webapp=1&sender_device=pc"
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
                        
                        <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: 28, color: "#1d1816", marginBottom: 8, marginTop: 0 }}>Retro Edition</h3>
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
                                    placeholder="Link akan dikirim ke sini"
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
                                <span style={{ color: "#1d1816", fontSize: 18, fontWeight: 700 }}>Rp 15.000</span>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                style={{
                                    width: "100%", padding: 16, borderRadius: 12, border: "none",
                                    background: "#008689", color: "#fff", fontSize: 15, fontWeight: 600,
                                    cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1,
                                    marginTop: 8, transition: "background 0.3s ease"
                                }}
                            >
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
                    borderTop: "3px solid #008689"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#008689" }}>⏳ Menunggu Pembayaran</p>
                            <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: "#1d1816" }}>Retro Edition</p>
                            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6e5c53" }}>Rp 15.000</p>
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
                        style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: "#008689", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 12 }}
                    >
                        Lanjut Bayar
                    </button>
                </div>
            )}
        </div>
    );
}