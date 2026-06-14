"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { LandscapeProductCard } from "../../../components/LandscapeProductCard";
import Link from "next/link";

export default function InvitationCatalogPage() {
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
                    order_id: `ORDER-INVT-${Date.now()}`,
                    gross_amount: 10000,
                    product_type: "invitation",
                    customer_details: {
                        first_name: customerDetails.firstName,
                        email: customerDetails.email,
                        phone: customerDetails.phone
                    },
                    item_details: [{ id: "invitation-edition", price: 10000, quantity: 1, name: "Invitation Edition" }]
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
                            label="Invitation Edition"
                            title="Undangan Kencan Interaktif"
                            description="Kirimkan undangan kencan yang manis dan interaktif kepada orang spesialmu. Lengkap dengan amplop digital, pilih tanggal berdua, aktivitas, dress code, dan tiket kencan eksklusif sebagai kenangan."
                            features={[
                                "Amplop Digital Interaktif",
                                "Pilih Tanggal Kencan Berdua",
                                "Pilih Aktivitas & Dress Code",
                                "Tiket Kencan Digital",
                                "Background Music Pilihan"
                            ]}
                            price="Rp 10.000"
                            demoLink="https://invitation.for-you-always.my.id/WRcVb-mY0f"
                            addonText="Token kuota (3 invitation) akan otomatis dikirimkan via email setelah pembayaran selesai."
                            mediaSrc="https://cdn.for-you-always.my.id/1781210840115-m9v0xv.webp"
                            fallbackImgSrc="https://cdn.for-you-always.my.id/1781210840115-m9v0xv.webp"
                            mediaType="image"
                            accentColor="#e8789a"
                            accentGlow="rgba(232,120,154,0.2)"
                            onOrderClick={() => setIsCheckoutOpen(true)}
                            themesLabel="Alur Undangan"
                            themes={[
                                { name: "Opening", desc: "Animasi amplop terbuka", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210841269-q6ybib.webp" },
                                { name: "Invitation", desc: "Kartu undangan utama", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210840115-m9v0xv.webp" },
                                { name: "Date Picker", desc: "Pemilihan tanggal & waktu", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210838838-b3w88t.webp" },
                                { name: "Date Activity", desc: "Pilihan aktivitas kencan", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210838139-qf8gc.webp" },
                                { name: "Dress Code", desc: "Tentukan dress code", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210839542-jybloo.webp" },
                                { name: "Notes", desc: "Pesan khusus & catatan", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210840694-hzo19n.webp" },
                                { name: "Ending", desc: "Card invitation download", fallbackImgSrc: "https://cdn.for-you-always.my.id/1781210842087-xguq5o.webp" }
                            ]}
                            delay={0}
                            reverse={false}
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
                        
                        <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: 28, color: "#1d1816", marginBottom: 8, marginTop: 0 }}>Invitation Edition</h3>
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
                                <span style={{ color: "#1d1816", fontSize: 18, fontWeight: 700 }}>Rp 10.000</span>
                            </div>

                            <button type="submit" disabled={isLoading} style={{ width: "100%", padding: 16, borderRadius: 12, border: "none", background: "#e8789a", color: "#fff", fontSize: 15, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1, marginTop: 8, transition: "background 0.3s ease" }}>
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
                    borderTop: "3px solid #e8789a"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e8789a" }}>⏳ Menunggu Pembayaran</p>
                            <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: "#1d1816" }}>Invitation Edition</p>
                            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6e5c53" }}>Rp 10.000</p>
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
                        style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: "#e8789a", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 12 }}
                    >
                        Lanjut Bayar
                    </button>
                </div>
            )}
        </div>
    );
}
