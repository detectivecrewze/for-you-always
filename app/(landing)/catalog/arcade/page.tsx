"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import Link from "next/link";

export default function ArcadeCatalogPage() {
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
                    order_id: `ORDER-ARCADE-${Date.now()}`,
                    gross_amount: 20000,
                    product_type: "arcade",
                    customer_details: {
                        first_name: customerDetails.firstName,
                        email: customerDetails.email,
                        phone: customerDetails.phone
                    },
                    item_details: [{
                        id: "arcade-edition",
                        price: 20000,
                        quantity: 1,
                        name: "Arcade Edition (Digital)"
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
            <section style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <LandscapeProductCard
                            label="Arcade Edition"
                            title="10 Rooms of Memories"
                            description="Bawa dia ke dalam petualangan menyusuri 10 ruangan interaktif yang menceritakan perjalanan hubungan kalian."
                            features={[
                                "10 Ruangan Berbeda",
                                "Bisa Turn On / Off Room",
                                "Background Music Pilihan"
                            ]}
                            price={
                                <>
                                    <span style={{ marginLeft: 8 }}>Promo Rp 20.000</span>
                                </>
                            }
                            addonText="Tersedia opsi Terima Jadi: Rp 40.000"
                            mediaSrc="https://cdn.for-you-always.my.id/1773433190382-k7de49.mp4"
                            fallbackImgSrc="https://cdn.for-you-always.my.id/1777884639353-xogjtd.webp"
                            mediaType="image"
                            accentColor="#5c8c5c"
                            accentGlow="rgba(92,140,92,0.2)"
                            href="https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Arcade%20Edition*%20seharga%20Promo%20Rp%2020.000.%0A%0AMohon%20info%20langkah%20selanjutnyaya.%20Terima%20kasih!"
                            themesLabel="Koleksi Ruangan"
                            themes={[
                                { name: "Main Menu", desc: "Tampilan utama Arcade", videoSrc: "https://cdn.for-you-always.my.id/1773433190382-k7de49.mp4" },
                                { name: "Atlas", desc: "Peta lokasi kenangan", videoSrc: "https://cdn.for-you-always.my.id/1773525779608-nzn9pr.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015764592-ca91hs.webp" },
                                { name: "Music", desc: "Ruangan musik interaktif", videoSrc: "https://cdn.for-you-always.my.id/1773426110433-1feui.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015765012-bsu6r.webp" },
                                { name: "Journey", desc: "Lini masa perjalanan", videoSrc: "https://cdn.for-you-always.my.id/1773426101549-nd559h.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015764186-4os3t9.webp" },
                                { name: "Moments", desc: "Galeri memori berharga", videoSrc: "https://cdn.for-you-always.my.id/1773426107508-yc067a.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015763822-vcvc9c.webp" },
                                { name: "Quiz", desc: "Kuis kenangan bersama", videoSrc: "https://cdn.for-you-always.my.id/1773426113479-uu9xep.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015762633-9y59gi.webp" },
                                { name: "Catcher", desc: "Mini game penangkap", videoSrc: "https://cdn.for-you-always.my.id/1773426115531-1f4i3u.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015762272-i7zhec.webp" },
                                { name: "Fortune", desc: "Pesan keberuntungan", videoSrc: "https://cdn.for-you-always.my.id/1773426099696-jzm23i.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778052907957-kkx9zv.webp" },
                                { name: "Things", desc: "Hal-hal yang kamu sukain dari dia", videoSrc: "https://cdn.for-you-always.my.id/1773426093227-u7iyto.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015761318-x6271.webp" },
                                { name: "Bucket", desc: "Daftar impian bersama", videoSrc: "https://cdn.for-you-always.my.id/1773426095486-zsqvxo.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015763359-9obyye.webp" },
                                { name: "Message", desc: "Pesan rahasia spesial", videoSrc: "https://cdn.for-you-always.my.id/1773426105222-2tovrh.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1778015763020-0nfkam.webp" }
                            ]}
                            delay={350}
                            reverse={true}
                            initialSelectedIndex={0}
                            tiktokHref="https://www.tiktok.com/@foryoualways.id/video/7617458730858319125?is_from_webapp=1&sender_device=pc"
                            onOrderClick={() => setIsCheckoutOpen(true)}
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
                        
                        <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: 28, color: "#1d1816", marginBottom: 8, marginTop: 0 }}>Arcade Edition</h3>
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
                                <span style={{ color: "#1d1816", fontSize: 18, fontWeight: 700 }}>Rp 20.000</span>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                style={{
                                    width: "100%", padding: 16, borderRadius: 12, border: "none",
                                    background: "#5c8c5c", color: "#fff", fontSize: 15, fontWeight: 600,
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
                    borderTop: "3px solid #5c8c5c"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5c8c5c" }}>⏳ Menunggu Pembayaran</p>
                            <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: "#1d1816" }}>Arcade Edition</p>
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
                        style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: "#5c8c5c", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 12 }}
                    >
                        Lanjut Bayar
                    </button>
                </div>
            )}
        </div>
    );
}