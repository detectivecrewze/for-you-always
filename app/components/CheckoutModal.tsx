"use client";

import React, { useState } from "react";

export interface CheckoutProduct {
    id: string;
    title: string;
    numericPrice: number;
    themeColor: string;
}

interface CheckoutModalProps {
    product: CheckoutProduct | null;
    onClose: () => void;
}

export default function CheckoutModal({ product, onClose }: CheckoutModalProps) {
    const [step, setStep] = useState<"form" | "review">("form");
    const [isLoading, setIsLoading] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({ firstName: "", email: "", phone: "" });
    const [closing, setClosing] = useState(false);

    if (!product) return null;

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => {
            setClosing(false);
            onClose();
        }, 180);
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("review");
    };

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("https://pakasir-gateway.aldoramadhan16.workers.dev/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_id: `ORDER-${product.id.toUpperCase()}-${Date.now()}`,
                    gross_amount: product.numericPrice,
                    product_type: product.id,
                    customer_details: {
                        first_name: customerDetails.firstName,
                        email: customerDetails.email,
                        phone: customerDetails.phone
                    },
                    item_details: [{ id: product.id, price: product.numericPrice, quantity: 1, name: product.title }]
                })
            });

            const data = await res.json();
            if (data.redirectUrl) {
                handleClose();
                setIsLoading(false);
                window.location.href = data.redirectUrl;
            } else {
                console.error("Checkout error:", data);
                alert("Gagal memproses pembayaran");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Checkout system error:", error);
            alert("Terjadi kesalahan sistem");
            setIsLoading(false);
        }
    };

    return (
        <div style={{ 
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 999999, 
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
            opacity: closing ? 0 : 1,
            transition: "opacity 0.2s ease"
        }}>
            <div style={{ 
                background: "#fff", width: "100%", maxWidth: 420, borderRadius: 28, padding: "36px 32px", 
                position: "relative", boxShadow: "0 32px 64px rgba(0,0,0,0.15)",
                transform: closing ? "scale(0.95) translateY(10px)" : "scale(1) translateY(0)",
                transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            }}>
                <button onClick={handleClose} className="absolute top-6 right-6 bg-white border border-[#e0d4cc] text-[#8b7e75] hover:text-[#1d1816] hover:bg-[#faf7f2] hover:scale-105 rounded-full p-2 transition-all shadow-sm">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                {step === "form" ? (
                    <>
                        <h3 style={{ fontSize: "32px", color: "#1d1816", marginBottom: "8px", lineHeight: 1, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", marginTop: 0 }}>
                            {product.title.split(' ')[0]} <span style={{ fontStyle: "italic", color: product.themeColor || "#cdab8f" }}>{product.title.split(' ').slice(1).join(' ')}</span>
                        </h3>
                        <p style={{ fontSize: "14px", color: "#8b7e75", marginBottom: "32px", lineHeight: 1.6, marginTop: 0 }}>
                            Lengkapi detail di bawah ini. Akses kado digital akan otomatis dikirimkan ke email Anda.
                        </p>
                        
                        <form onSubmit={handleNext} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "#8b7e75", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} color="#cdab8f">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Nama Panggilan
                                </label>
                                <input type="text" required value={customerDetails.firstName} onChange={e => setCustomerDetails({...customerDetails, firstName: e.target.value})} 
                                    style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e0d4cc", background: "rgba(250,247,242,0.5)", outline: "none", fontSize: "15px", color: "#382a24", transition: "all 0.3s ease" }}
                                    onFocus={e => { e.target.style.background = "#fff"; e.target.style.borderColor = "#cdab8f"; e.target.style.boxShadow = "0 0 0 4px rgba(205,171,143,0.1)"; }}
                                    onBlur={e => { e.target.style.background = "rgba(250,247,242,0.5)"; e.target.style.borderColor = "#e0d4cc"; e.target.style.boxShadow = "none"; }}
                                    placeholder="Contoh: Budi" />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "#8b7e75", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} color="#cdab8f">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Email Anda
                                </label>
                                <input type="email" required value={customerDetails.email} onChange={e => setCustomerDetails({...customerDetails, email: e.target.value})} 
                                    style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e0d4cc", background: "rgba(250,247,242,0.5)", outline: "none", fontSize: "15px", color: "#382a24", transition: "all 0.3s ease" }}
                                    onFocus={e => { e.target.style.background = "#fff"; e.target.style.borderColor = "#cdab8f"; e.target.style.boxShadow = "0 0 0 4px rgba(205,171,143,0.1)"; }}
                                    onBlur={e => { e.target.style.background = "rgba(250,247,242,0.5)"; e.target.style.borderColor = "#e0d4cc"; e.target.style.boxShadow = "none"; }}
                                    placeholder="Akses akan dikirim ke sini" />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "#8b7e75", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} color="#cdab8f">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Nomor WhatsApp
                                </label>
                                <input type="tel" required value={customerDetails.phone} onChange={e => setCustomerDetails({...customerDetails, phone: e.target.value})} 
                                    style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e0d4cc", background: "rgba(250,247,242,0.5)", outline: "none", fontSize: "15px", color: "#382a24", transition: "all 0.3s ease" }}
                                    onFocus={e => { e.target.style.background = "#fff"; e.target.style.borderColor = "#cdab8f"; e.target.style.boxShadow = "0 0 0 4px rgba(205,171,143,0.1)"; }}
                                    onBlur={e => { e.target.style.background = "rgba(250,247,242,0.5)"; e.target.style.borderColor = "#e0d4cc"; e.target.style.boxShadow = "none"; }}
                                    placeholder="Contoh: 08123456789" />
                            </div>
                            
                            <button type="submit" 
                                style={{ width: "100%", padding: "16px", marginTop: "24px", borderRadius: "12px", border: "none", background: product.themeColor || "#e8789a", color: "#fff", fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 8px 24px -4px rgba(29,24,22,0.25)", cursor: "pointer", transition: "all 0.3s ease" }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px -4px rgba(29,24,22,0.35)"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px -4px rgba(29,24,22,0.25)"; }}
                            >
                                Lanjutkan Checkout
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#1d1816", marginBottom: "4px", letterSpacing: "-0.02em", marginTop: 0 }}>Review Pesanan</h3>
                        <p style={{ fontSize: "14px", color: "#8b7e75", marginBottom: "24px", marginTop: 0 }}>Pastikan detail pesanan dan email Anda sudah benar.</p>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px", background: "rgba(250,247,242,0.8)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(205,171,143,0.3)", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "13px", color: "#8b7e75", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4M20 12l-6-6M20 12l-6 6" /></svg>
                                    Produk
                                </span>
                                <span style={{ fontSize: "14px", color: "#382a24", fontWeight: 700, textAlign: "right", maxWidth: "60%", wordBreak: "break-word" }}>{product.title}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "13px", color: "#8b7e75", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    Nama
                                </span>
                                <span style={{ fontSize: "14px", color: "#382a24", fontWeight: 700, textAlign: "right", maxWidth: "60%", wordBreak: "break-word" }}>{customerDetails.firstName}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fef1f2", padding: "12px", borderRadius: "12px", margin: "4px -12px", border: "1px solid #fbd5da" }}>
                                <span style={{ fontSize: "13px", color: "#c9184a", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    Email
                                </span>
                                <span style={{ fontSize: "14px", color: "#c9184a", fontWeight: 900, textAlign: "right", maxWidth: "60%", wordBreak: "break-all" }}>{customerDetails.email}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "13px", color: "#8b7e75", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                    WhatsApp
                                </span>
                                <span style={{ fontSize: "14px", color: "#382a24", fontWeight: 700, textAlign: "right", maxWidth: "60%", wordBreak: "break-word" }}>{customerDetails.phone}</span>
                            </div>
                            
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", paddingTop: "16px", borderTop: "1px dashed rgba(205,171,143,0.4)" }}>
                                <span style={{ fontSize: "13px", color: "#6e5c53", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Total Harga</span>
                                <span style={{ fontSize: "20px", color: "#1d1816", fontWeight: 900 }}>Rp {product.numericPrice.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
                            <button onClick={() => setStep("form")} disabled={isLoading} 
                                style={{ flex: 0.8, padding: "16px", borderRadius: "12px", border: "2px solid #e0d4cc", background: "transparent", color: "#6e5c53", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.5 : 1, transition: "all 0.3s ease" }}
                                onMouseEnter={e => { if(!isLoading){ e.currentTarget.style.background = "#faf7f2"; e.currentTarget.style.color = "#382a24"; } }}
                                onMouseLeave={e => { if(!isLoading){ e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6e5c53"; } }}
                            >
                                Ubah
                            </button>
                            <button onClick={handleCheckout} disabled={isLoading} 
                                style={{ flex: 1.2, padding: "16px", borderRadius: "12px", border: "none", background: product.themeColor || "#e8789a", color: "#fff", fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 8px 24px -4px rgba(29,24,22,0.25)", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1, transition: "all 0.3s ease" }}
                                onMouseEnter={e => { if(!isLoading){ e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px -4px rgba(29,24,22,0.35)"; } }}
                                onMouseLeave={e => { if(!isLoading){ e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px -4px rgba(29,24,22,0.25)"; } }}
                            >
                                {isLoading ? (
                                    <>
                                        <svg style={{ animation: "spin 1s linear infinite", marginLeft: "-4px", marginRight: "8px", height: "16px", width: "16px", color: "white" }} fill="none" viewBox="0 0 24 24"><circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Proses...
                                    </>
                                ) : (
                                    <>
                                        Bayar Sekarang
                                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
