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

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setIsLoading(true);
        try {
            const res = await fetch("https://doku-gateway.aldoramadhan16.workers.dev/api/checkout", {
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
            background: "rgba(0,0,0,0.4)", zIndex: 999999, 
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
            opacity: closing ? 0 : 1,
            transition: "opacity 0.18s ease"
        }}>
            <div style={{ 
                background: "#fff", width: "100%", maxWidth: 400, borderRadius: 24, padding: "32px 24px", 
                position: "relative", boxShadow: "0 24px 48px rgba(0,0,0,0.1)",
                transform: closing ? "scale(0.97) translateY(10px)" : "scale(1) translateY(0)",
                transition: "transform 0.18s cubic-bezier(0.4, 0, 0.2, 1)"
            }}>
                <button onClick={handleClose} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", color: "#666", padding: 8 }}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: 28, color: "#1d1816", marginBottom: 8, marginTop: 0 }}>{product.title}</h3>
                <p style={{ color: "#6e5c53", fontSize: 14, marginBottom: 24 }}>Lengkapi data di bawah ini untuk menerima Akses Kado Anda.</p>
                
                <form onSubmit={handleCheckout} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#382a24", marginBottom: 6 }}>Nama Panggilan</label>
                        <input type="text" required value={customerDetails.firstName} onChange={e => setCustomerDetails({...customerDetails, firstName: e.target.value})} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e0d4cc", outline: "none", fontSize: 14 }} placeholder="Contoh: Budi" />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#382a24", marginBottom: 6 }}>Email Anda</label>
                        <input type="email" required value={customerDetails.email} onChange={e => setCustomerDetails({...customerDetails, email: e.target.value})} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e0d4cc", outline: "none", fontSize: 14 }} placeholder="Akses akan dikirim ke sini" />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#382a24", marginBottom: 6 }}>Nomor WhatsApp</label>
                        <input type="tel" required value={customerDetails.phone} onChange={e => setCustomerDetails({...customerDetails, phone: e.target.value})} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e0d4cc", outline: "none", fontSize: 14 }} placeholder="Contoh: 08123456789" />
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 16, borderTop: "1px dashed #e0d4cc" }}>
                        <span style={{ color: "#6e5c53", fontSize: 14 }}>Total Pembayaran</span>
                        <span style={{ color: "#1d1816", fontSize: 18, fontWeight: 700 }}>Rp {product.numericPrice.toLocaleString('id-ID')}</span>
                    </div>

                    <button type="submit" disabled={isLoading} style={{ width: "100%", padding: 16, borderRadius: 12, border: "none", background: product.themeColor || "#e8789a", color: "#fff", fontSize: 15, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1, marginTop: 8, transition: "background 0.3s ease" }}>
                        {isLoading ? "Memproses..." : "Lanjut Pembayaran"}
                    </button>
                </form>
            </div>
        </div>
    );
}
