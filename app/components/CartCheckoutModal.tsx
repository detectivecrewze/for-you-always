"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";

interface CartCheckoutModalProps {
    onClose: () => void;
}

export default function CartCheckoutModal({ onClose }: CartCheckoutModalProps) {
    const { items, cartTotal, clearCart } = useCart();
    const [step, setStep] = useState<"form" | "review">("form");
    const [isLoading, setIsLoading] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({ firstName: "", email: "", phone: "" });
    const [closing, setClosing] = useState(false);

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => { setClosing(false); onClose(); }, 180);
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("review");
    };

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const orderId = items.length === 1
                ? `ORDER-${items[0].id.toUpperCase()}-${Date.now()}`
                : `ORDER-BUNDLE-${Date.now()}`;
            const res = await fetch("https://pakasir-gateway-sandbox.aldoramadhan16.workers.dev/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_id: orderId,
                    gross_amount: cartTotal,
                    product_type: items.map(i => i.isThreeSlot ? `${i.id}_3slot` : i.id).join(","),
                    customer_details: {
                        first_name: customerDetails.firstName,
                        email: customerDetails.email,
                        phone: customerDetails.phone,
                    },
                    item_details: items.map(i => ({
                        id: i.id,
                        price: i.numericPrice,
                        quantity: 1,
                        name: i.title,
                    })),
                }),
            });

            const data = await res.json();
            if (data.redirectUrl) {
                handleClose();
                clearCart();
                setIsLoading(false);
                window.location.href = data.redirectUrl;
            } else {
                console.error("Checkout error:", data);
                alert("Gagal memproses pembayaran. Coba lagi ya.");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Checkout system error:", error);
            alert("Terjadi kesalahan sistem. Coba lagi.");
            setIsLoading(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "14px 16px",
        borderRadius: 12,
        border: "1px solid #e0d4cc",
        background: "rgba(250,247,242,0.5)",
        outline: "none",
        fontSize: 15,
        color: "#382a24",
        transition: "all 0.3s ease",
        boxSizing: "border-box",
    };

    return (
        <div style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 999999,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20,
            opacity: closing ? 0 : 1,
            transition: "opacity 0.2s ease",
        }}>
            <div style={{
                background: "#fff",
                width: "100%", maxWidth: 460,
                borderRadius: 28,
                padding: "36px 32px",
                position: "relative",
                boxShadow: "0 32px 64px rgba(0,0,0,0.15)",
                transform: closing ? "scale(0.95) translateY(10px)" : "scale(1) translateY(0)",
                transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
                maxHeight: "92vh",
                overflowY: "auto",
            }}>
                {/* Close button */}
                <button
                    onClick={handleClose}
                    style={{
                        position: "absolute", top: 20, right: 20,
                        background: "white",
                        border: "1px solid #e0d4cc",
                        borderRadius: "50%",
                        width: 34, height: 34,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "#8b7e75",
                        transition: "all 0.2s ease",
                    }}
                >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {step === "form" ? (
                    <>
                        <h3 style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 30, color: "#1d1816",
                            margin: "0 0 6px", letterSpacing: "-0.02em", lineHeight: 1,
                        }}>
                            Checkout <span style={{ fontStyle: "italic", color: items.length > 1 ? "#a67c52" : items[0]?.themeColor || "#a67c52" }}>
                                {items.length > 1 ? "Bundle" : items[0]?.title || "Kado"}
                            </span>
                        </h3>
                        <p style={{ fontSize: 13, color: "#8b7e75", margin: "0 0 28px", lineHeight: 1.6, fontFamily: "var(--font-sans)" }}>
                            {items.length > 1
                                ? "Akses semua kado digital akan dikirim otomatis ke email kamu."
                                : "Akses kado digital akan dikirim otomatis ke email kamu."}
                        </p>

                        <form onSubmit={handleNext} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            {[
                                { label: "Nama Panggilan", type: "text", key: "firstName", placeholder: "Contoh: Budi", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                                { label: "Email Kamu", type: "email", key: "email", placeholder: "Akses akan dikirim ke sini", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                                { label: "Nomor WhatsApp", type: "tel", key: "phone", placeholder: "Contoh: 08123456789", icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" },
                            ].map(field => (
                                <div key={field.key} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#8b7e75", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
                                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#cdab8f" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={field.icon} />
                                        </svg>
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        required
                                        value={customerDetails[field.key as keyof typeof customerDetails]}
                                        onChange={e => setCustomerDetails({ ...customerDetails, [field.key]: e.target.value })}
                                        style={inputStyle}
                                        onFocus={e => { e.target.style.background = "#fff"; e.target.style.borderColor = "#cdab8f"; e.target.style.boxShadow = "0 0 0 4px rgba(205,171,143,0.1)"; }}
                                        onBlur={e => { e.target.style.background = "rgba(250,247,242,0.5)"; e.target.style.borderColor = "#e0d4cc"; e.target.style.boxShadow = "none"; }}
                                        placeholder={field.placeholder}
                                    />
                                </div>
                            ))}

                            <button
                                type="submit"
                                style={{
                                    width: "100%", padding: "15px", marginTop: 8,
                                    borderRadius: 12, border: "none",
                                    background: "#1d1816", color: "#fff",
                                    fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                    boxShadow: "0 8px 24px rgba(29,24,22,0.25)",
                                    cursor: "pointer", transition: "all 0.3s ease",
                                    fontFamily: "var(--font-sans)",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = "#a67c52"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "#1d1816"; }}
                            >
                                Lanjutkan Review
                                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "#1d1816", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                            Review Pesanan
                        </h3>
                        <p style={{ fontSize: 13, color: "#8b7e75", margin: "0 0 22px", fontFamily: "var(--font-sans)" }}>
                            Pastikan detail pesanan dan email kamu sudah benar.
                        </p>

                        <div style={{
                            background: "rgba(250,247,242,0.8)",
                            borderRadius: 16,
                            border: "1px solid rgba(205,171,143,0.3)",
                            overflow: "hidden",
                        }}>
                            {/* Customer info */}
                            <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(205,171,143,0.15)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                    <span style={{ fontSize: 12, color: "#8b7e75", fontFamily: "var(--font-sans)" }}>Nama</span>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: "#382a24", fontFamily: "var(--font-sans)" }}>{customerDetails.firstName}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, background: "#fef1f2", padding: "8px 10px", borderRadius: 8, border: "1px solid #fbd5da", margin: "0 -2px" }}>
                                    <span style={{ fontSize: 12, color: "#c9184a", fontWeight: 700, fontFamily: "var(--font-sans)" }}>Email</span>
                                    <span style={{ fontSize: 12, fontWeight: 900, color: "#c9184a", fontFamily: "var(--font-sans)", wordBreak: "break-all", textAlign: "right", maxWidth: "60%" }}>{customerDetails.email}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                                    <span style={{ fontSize: 12, color: "#8b7e75", fontFamily: "var(--font-sans)" }}>WhatsApp</span>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: "#382a24", fontFamily: "var(--font-sans)" }}>{customerDetails.phone}</span>
                                </div>
                            </div>

                            {/* Item list */}
                            <div style={{ padding: "12px 18px" }}>
                                <p style={{ fontSize: 10, fontWeight: 700, color: "#8b7e75", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 10px", fontFamily: "var(--font-sans)" }}>
                                    Kado yang dibeli
                                </p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {items.map(item => (
                                        <div key={item.cartItemId || `${item.id}-${Math.random()}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.themeColor || "#cdab8f", flexShrink: 0 }} />
                                                <span style={{ fontSize: 13, color: "#382a24", fontFamily: "var(--font-sans)", fontWeight: 500 }}>{item.title}</span>
                                            </div>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: "#382a24", fontFamily: "var(--font-sans)" }}>
                                                Rp {item.numericPrice.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Total */}
                                <div style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "baseline",
                                    marginTop: 14, paddingTop: 12,
                                    borderTop: "1px dashed rgba(205,171,143,0.4)",
                                }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: "#6e5c53", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-sans)" }}>
                                        Total
                                    </span>
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#1d1816", letterSpacing: "-0.02em" }}>
                                        Rp {cartTotal.toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                            <button
                                onClick={() => setStep("form")}
                                disabled={isLoading}
                                style={{
                                    flex: 0.8, padding: "15px",
                                    borderRadius: 12, border: "2px solid #e0d4cc",
                                    background: "transparent", color: "#6e5c53",
                                    fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                    cursor: isLoading ? "not-allowed" : "pointer",
                                    opacity: isLoading ? 0.5 : 1, transition: "all 0.3s ease",
                                    fontFamily: "var(--font-sans)",
                                }}
                            >
                                Ubah
                            </button>
                            <button
                                onClick={handleCheckout}
                                disabled={isLoading}
                                style={{
                                    flex: 1.2, padding: "15px",
                                    borderRadius: 12, border: "none",
                                    background: "#1d1816", color: "#fff",
                                    fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                    boxShadow: "0 8px 24px rgba(29,24,22,0.25)",
                                    cursor: isLoading ? "not-allowed" : "pointer",
                                    opacity: isLoading ? 0.7 : 1, transition: "all 0.3s ease",
                                    fontFamily: "var(--font-sans)",
                                }}
                                onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background = "#a67c52"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                                onMouseLeave={e => { if (!isLoading) { e.currentTarget.style.background = "#1d1816"; e.currentTarget.style.transform = "translateY(0)"; } }}
                            >
                                {isLoading ? (
                                    <>
                                        <svg style={{ animation: "spin 1s linear infinite", width: 14, height: 14 }} fill="none" viewBox="0 0 24 24">
                                            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Proses...
                                    </>
                                ) : (
                                    <>
                                        Bayar Sekarang
                                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
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
