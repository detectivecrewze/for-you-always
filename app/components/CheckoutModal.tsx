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
                        <h3 className="text-[32px] text-[#1d1816] mb-2 leading-none" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
                            {product.title.split(' ')[0]} <span style={{ fontStyle: "italic", color: product.themeColor || "#cdab8f" }}>{product.title.split(' ').slice(1).join(' ')}</span>
                        </h3>
                        <p className="text-[14px] text-[#8b7e75] mb-8 leading-relaxed">
                            Lengkapi detail di bawah ini. Akses kado digital akan otomatis dikirimkan ke email Anda.
                        </p>
                        
                        <form onSubmit={handleNext} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-bold tracking-[0.1em] text-[#8b7e75] uppercase flex items-center gap-2">
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="text-[#cdab8f]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Nama Panggilan
                                </label>
                                <input type="text" required value={customerDetails.firstName} onChange={e => setCustomerDetails({...customerDetails, firstName: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-[#e0d4cc] bg-[#faf7f2]/50 focus:bg-white focus:border-[#cdab8f] focus:ring-4 focus:ring-[#cdab8f]/10 outline-none transition-all text-[15px] text-[#382a24] placeholder:text-[#a6968c]" placeholder="Contoh: Budi" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-bold tracking-[0.1em] text-[#8b7e75] uppercase flex items-center gap-2">
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="text-[#cdab8f]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Email Anda
                                </label>
                                <input type="email" required value={customerDetails.email} onChange={e => setCustomerDetails({...customerDetails, email: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-[#e0d4cc] bg-[#faf7f2]/50 focus:bg-white focus:border-[#cdab8f] focus:ring-4 focus:ring-[#cdab8f]/10 outline-none transition-all text-[15px] text-[#382a24] placeholder:text-[#a6968c]" placeholder="Akses akan dikirim ke sini" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-bold tracking-[0.1em] text-[#8b7e75] uppercase flex items-center gap-2">
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="text-[#cdab8f]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Nomor WhatsApp
                                </label>
                                <input type="tel" required value={customerDetails.phone} onChange={e => setCustomerDetails({...customerDetails, phone: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-[#e0d4cc] bg-[#faf7f2]/50 focus:bg-white focus:border-[#cdab8f] focus:ring-4 focus:ring-[#cdab8f]/10 outline-none transition-all text-[15px] text-[#382a24] placeholder:text-[#a6968c]" placeholder="Contoh: 08123456789" />
                            </div>
                            
                            <button type="submit" className="w-full py-4 mt-6 rounded-xl text-white font-bold tracking-[0.15em] uppercase text-[12px] flex items-center justify-center gap-2 shadow-[0_8px_24px_-4px_rgba(29,24,22,0.25)] hover:-translate-y-1 hover:shadow-[0_12px_32px_-4px_rgba(29,24,22,0.35)] transition-all duration-300" style={{ background: product.themeColor || "#e8789a" }}>
                                Lanjutkan Checkout
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h3 className="text-[24px] font-extrabold text-[#1d1816] mb-1 tracking-tight">Review Pesanan</h3>
                        <p className="text-[14px] text-[#8b7e75] mb-6">Pastikan detail pesanan dan email Anda sudah benar.</p>
                        
                        <div className="flex flex-col gap-3.5 bg-[#faf7f2]/80 p-5 rounded-2xl border border-[#cdab8f]/30 shadow-inner">
                            <div className="flex justify-between items-center">
                                <span className="text-[13px] text-[#8b7e75] font-medium flex items-center gap-2">
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4M20 12l-6-6M20 12l-6 6" /></svg>
                                    Produk
                                </span>
                                <span className="text-[14px] text-[#382a24] font-bold">{product.title}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[13px] text-[#8b7e75] font-medium flex items-center gap-2">
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    Nama
                                </span>
                                <span className="text-[14px] text-[#382a24] font-bold">{customerDetails.firstName}</span>
                            </div>
                            <div className="flex justify-between items-center bg-[#fef1f2] p-3 rounded-xl -mx-3 my-1 border border-[#fbd5da]">
                                <span className="text-[13px] text-[#c9184a] font-bold flex items-center gap-2">
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    Email
                                </span>
                                <span className="text-[14px] text-[#c9184a] font-black">{customerDetails.email}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[13px] text-[#8b7e75] font-medium flex items-center gap-2">
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                    WhatsApp
                                </span>
                                <span className="text-[14px] text-[#382a24] font-bold">{customerDetails.phone}</span>
                            </div>
                            
                            <div className="flex justify-between items-center mt-3 pt-4 border-t border-dashed border-[#cdab8f]/40">
                                <span className="text-[13px] text-[#6e5c53] font-bold tracking-[0.1em] uppercase">Total Harga</span>
                                <span className="text-[20px] text-[#1d1816] font-black">Rp {product.numericPrice.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setStep("form")} disabled={isLoading} className="flex-[0.8] py-4 rounded-xl border-2 border-[#e0d4cc] bg-transparent text-[#6e5c53] font-bold tracking-[0.1em] uppercase text-[11px] hover:bg-[#faf7f2] hover:text-[#382a24] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                Ubah
                            </button>
                            <button onClick={handleCheckout} disabled={isLoading} className="flex-[1.2] py-4 rounded-xl text-white font-bold tracking-[0.15em] uppercase text-[12px] flex items-center justify-center gap-2 shadow-[0_8px_24px_-4px_rgba(29,24,22,0.25)] hover:-translate-y-1 hover:shadow-[0_12px_32px_-4px_rgba(29,24,22,0.35)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none" style={{ background: product.themeColor || "#e8789a" }}>
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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
