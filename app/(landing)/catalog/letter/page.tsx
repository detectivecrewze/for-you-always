"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import Link from "next/link";

export default function LetterCatalogPage() {
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
                    order_id: `ORDER-LETTER-${Date.now()}`,
                    gross_amount: 15000,
                    product_type: "letter",
                    customer_details: {
                        first_name: customerDetails.firstName,
                        email: customerDetails.email,
                        phone: customerDetails.phone
                    },
                    item_details: [{
                        id: "letter-edition",
                        price: 15000,
                        quantity: 1,
                        name: "Letter Edition (Digital)"
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
                            label="Letter Edition"
                            title="Surat Digital Aesthetic"
                            description="Sampaikan pesan bermakna melalui surat digital bernuansa sinematik. Hadir dengan amplop interaktif, efek typewriter klasik, dan kustomisasi tema eksklusif."
                            features={[
                                "Amplop Digital Interaktif",
                                "Efek Typewriter Sinematik",
                                "Bisa Kirim Pesan Anonymous",
                                "Foto / Video di Akhir Surat",
                                "Background Music Pilihan"
                            ]}
                            price="Rp 15.000"
                            demoLink="https://letter.for-you-always.my.id/letter-test"
                            addonText="Tersedia opsi Terima Jadi: Rp 30.000"
                            mediaSrc="https://cdn.for-you-always.my.id/1776679814124-0f7fq5.mp4"
                            fallbackImgSrc="https://cdn.for-you-always.my.id/1777883950201-eede1i.webp"
                            mediaType="image"
                            accentColor="#c4858a"
                            accentGlow="rgba(196,133,138,0.2)"
                            onOrderClick={() => setIsCheckoutOpen(true)}
                            href="https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Letter%20Edition*%20seharga%20Rp%2015.000.%0A%0AMohon%20info%20langkah%20selanjutnyaya.%20Terima%20kasih!"
                            themesLabel="Koleksi Template"
                            themes={[
                                {
                                    name: "Classic Wax Seal",
                                    desc: "Desain amplop minimalis dengan segel lilin",
                                    defaultSubThemeIndex: 3,
                                    subThemes: [
                                        { name: "Parchment", color: "#a68a64", videoSrc: "https://cdn.for-you-always.my.id/1776679812683-gngv0r.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1777883951336-1eoxe7.webp" },
                                        { name: "Forest", color: "#4d6b53", videoSrc: "https://cdn.for-you-always.my.id/1776432454559-0o85rd.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1777883950505-o8x5o7.webp" },
                                        { name: "Midnight", color: "#2a3d5c", videoSrc: "https://cdn.for-you-always.my.id/1776432449348-uxmvjp.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1777883951055-ml1py.webp" },
                                        { name: "Crimson", color: "#c03050", fallbackImgSrc: "https://cdn.for-you-always.my.id/1777913945610-6kxb7.webp" },
                                        { name: "Obsidian", color: "#2d6a4f", fallbackImgSrc: "https://cdn.for-you-always.my.id/1777913945923-vqo0rr.webp" }
                                    ]
                                },
                                {
                                    name: "Vintage Airmail",
                                    desc: "Desain surat pos udara klasik",
                                    subThemes: [
                                        { name: "Parchment", color: "#a68a64", fallbackImgSrc: "https://cdn.for-you-always.my.id/1779464837721-ukwgwd.webp" },
                                        { name: "Lilac", color: "#d4cadd", fallbackImgSrc: "https://cdn.for-you-always.my.id/1779464836965-9zahl.webp" },
                                        { name: "Sage", color: "#7a9e7e", fallbackImgSrc: "https://cdn.for-you-always.my.id/1779464838382-funvvg.webp" },
                                        { name: "Rose", color: "#c4858a", fallbackImgSrc: "https://cdn.for-you-always.my.id/1779464838087-ztk2sl.webp" },
                                        { name: "Midnight", color: "#2a3d5c", fallbackImgSrc: "https://cdn.for-you-always.my.id/1779464837348-a40rot.webp" },
                                        { name: "Bordeaux", color: "#581824", fallbackImgSrc: "https://cdn.for-you-always.my.id/1779464838763-2y25so.webp" }
                                    ]
                                },
                                {
                                    name: "Ribbon & Seal",
                                    desc: "Desain elegan dengan pita dan segel wax",
                                    defaultSubThemeIndex: 2,
                                    subThemes: [
                                        { name: "Parchment", color: "#e8dbce", fallbackImgSrc: "https://cdn.for-you-always.my.id/1780253357350-fp09fd.webp" },
                                        { name: "Forest", color: "#4d6b53", fallbackImgSrc: "https://cdn.for-you-always.my.id/1780253356127-1es344.webp" },
                                        { name: "Midnight", color: "#2a3d5c", fallbackImgSrc: "https://cdn.for-you-always.my.id/1780253357024-sb9db.webp" },
                                        { name: "Rose", color: "#c4858a", fallbackImgSrc: "https://cdn.for-you-always.my.id/1780253355831-swb14.webp" },
                                        { name: "Bordeaux", color: "#581824", fallbackImgSrc: "https://cdn.for-you-always.my.id/1780253356734-jbzz6.webp" },
                                        { name: "Violet", color: "#8a6b96", fallbackImgSrc: "https://cdn.for-you-always.my.id/1780253356407-czstjw.webp" }
                                    ]
                                }
                            ]}
                            delay={0}
                            reverse={false}
                            initialSelectedIndex={0}
                            autoCycle={false}
                            tiktokHref="https://www.tiktok.com/@foryoualways.id/video/7629604229094591764?is_from_webapp=1&sender_device=pc"
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
                        
                        <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: 28, color: "#1d1816", marginBottom: 8, marginTop: 0 }}>Letter Edition</h3>
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
                                    background: "#c4858a", color: "#fff", fontSize: 15, fontWeight: 600,
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
                    borderTop: "3px solid #c4858a"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c4858a" }}>⏳ Menunggu Pembayaran</p>
                            <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: "#1d1816" }}>Letter Edition</p>
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
                        style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: "#c4858a", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 12 }}
                    >
                        Lanjut Bayar
                    </button>
                </div>
            )}
        </div>
    );
}
