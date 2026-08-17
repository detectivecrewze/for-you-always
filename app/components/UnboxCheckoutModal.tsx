"use client";

import React, { useState, useEffect } from "react";
import posthog from 'posthog-js';
import { trackInitiateCheckout } from "@/lib/pixel";
import { INDONESIA_SHIPPING_DATA, getShippingRate } from "@/lib/indonesiaShipping";

interface UnboxCheckoutModalProps {
    onClose: () => void;
    initialDigitalProduct?: string;
}

const DIGITAL_OPTIONS = [
    { id: "loves", title: "Memoria", subtitle: "Kisah Sinematik & Galeri", color: "#d4af37", badge: "Signature", price: 149000, oldPrice: 200000 },
    { id: "letter", title: "Letter Edition", subtitle: "Surat Digital & Typewriter", color: "#a67c52", badge: "Favorit", price: 129000, oldPrice: 180000 },
    { id: "voices", title: "Voices Gift", subtitle: "Pesan Suara & Galeri Foto", color: "#e91e63", badge: "Best Seller", price: 129000, oldPrice: 180000 },
];

export default function UnboxCheckoutModal({ onClose, initialDigitalProduct = "loves" }: UnboxCheckoutModalProps) {
    const [step, setStep] = useState<"details" | "review">("details");
    const [isLoading, setIsLoading] = useState(false);
    const [closing, setClosing] = useState(false);

    // Form States
    const [selectedDigital, setSelectedDigital] = useState(initialDigitalProduct);
    const [customerDetails, setCustomerDetails] = useState({
        senderName: "",
        email: "",
        whatsapp: "",
    });
    const [shippingDetails, setShippingDetails] = useState({
        recipientName: "",
        recipientPhone: "",
        address: "",
        province: "DKI Jakarta",
        city: "Jakarta Selatan",
        district: "",
        postalCode: "",
    });

    // Dynamic Shipping Rate Calculation
    const currentProvinceObj = INDONESIA_SHIPPING_DATA.find(p => p.name === shippingDetails.province) || INDONESIA_SHIPPING_DATA[0];
    const availableCities = currentProvinceObj.cities;

    const { cost: shippingCost, estimate: shippingEstimate } = getShippingRate(
        shippingDetails.province,
        shippingDetails.city
    );

    const selectedDigitalObj = DIGITAL_OPTIONS.find(d => d.id === selectedDigital) || DIGITAL_OPTIONS[0];
    const boxPrice = selectedDigitalObj.price;
    const boxOldPrice = selectedDigitalObj.oldPrice;
    const totalAmount = boxPrice + shippingCost;

    useEffect(() => {
        trackInitiateCheckout(
            [{ id: `unbox_${selectedDigital}`, title: `Unbox the Memory (${selectedDigitalObj.title})`, numericPrice: totalAmount }],
            totalAmount
        );
    }, []);

    const handleProvinceChange = (newProv: string) => {
        const provObj = INDONESIA_SHIPPING_DATA.find(p => p.name === newProv);
        const firstCity = provObj && provObj.cities.length > 0 ? provObj.cities[0].name : "";
        setShippingDetails(prev => ({
            ...prev,
            province: newProv,
            city: firstCity,
        }));
    };

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
            const orderId = `ORDER-UNBOX-${Date.now()}`;
            const gatewayUrl = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_URL || "https://pakasir-gateway.aldoramadhan16.workers.dev";
            const res = await fetch(`${gatewayUrl}/api/checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_id: orderId,
                    gross_amount: totalAmount,
                    product_type: `unbox_${selectedDigital}`,
                    customer_details: {
                        first_name: customerDetails.senderName,
                        email: customerDetails.email,
                        phone: customerDetails.whatsapp,
                    },
                    shipping_details: {
                        recipient_name: shippingDetails.recipientName,
                        recipient_phone: shippingDetails.recipientPhone,
                        address: shippingDetails.address,
                        district: shippingDetails.district,
                        city: shippingDetails.city,
                        province: shippingDetails.province,
                        postal_code: shippingDetails.postalCode,
                        zone: shippingDetails.province,
                        shipping_cost: shippingCost,
                        shipping_estimate: shippingEstimate,
                    },
                    item_details: [
                        {
                            id: `unbox-box`,
                            price: boxPrice,
                            quantity: 1,
                            name: `Unbox the Memory Gift Box + ${selectedDigitalObj.title} QR`,
                        },
                        {
                            id: `shipping-rate`,
                            price: shippingCost,
                            quantity: 1,
                            name: `Ekspedisi Reguler (${shippingDetails.city}, ${shippingDetails.province})`,
                        }
                    ],
                }),
            });

            const data = await res.json();
            if (data.redirectUrl) {
                posthog.capture('unbox_payment_submitted', {
                    order_id: orderId,
                    total: totalAmount,
                    digital_product: selectedDigital,
                    shipping_city: shippingDetails.city,
                    shipping_province: shippingDetails.province,
                    shipping_cost: shippingCost,
                });
                if (typeof window !== 'undefined' && (window as any).ttq) {
                    (window as any).ttq.track('CompletePayment', {
                        content_type: 'product',
                        content_id: `unbox_${selectedDigital}`,
                        content_name: `Unbox the Memory - ${selectedDigitalObj.title}`,
                        value: totalAmount,
                        currency: 'IDR'
                    });
                }
                handleClose();
                setIsLoading(false);
                window.location.href = data.redirectUrl;
            } else {
                console.error("Checkout error:", data);
                alert("Gagal memproses pembayaran. Silakan coba lagi ya.");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Checkout system error:", error);
            alert("Terjadi kesalahan sistem. Silakan coba lagi.");
            setIsLoading(false);
        }
    };

    return (
        <>
            <style>{`
                .unbox-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(29, 24, 22, 0.6);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    z-index: 999999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 12px;
                    box-sizing: border-box;
                }
                .unbox-modal-box {
                    background: #faf7f2;
                    width: 100%;
                    max-width: 490px;
                    border-radius: 20px;
                    padding: 24px 20px;
                    position: relative;
                    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
                    max-height: 90vh;
                    overflow-y: auto;
                    overflow-x: hidden;
                    box-sizing: border-box;
                    border: 1px solid rgba(205, 171, 143, 0.3);
                }
                @media (max-width: 480px) {
                    .unbox-modal-box {
                        padding: 20px 14px;
                        border-radius: 18px;
                        max-height: 92vh;
                    }
                }
                .unbox-digital-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 8px;
                }
                @media (max-width: 480px) {
                    .unbox-digital-grid {
                        grid-template-columns: 1fr;
                        gap: 6px;
                    }
                }
                .unbox-digital-card {
                    padding: 10px 12px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    background: #ffffff;
                    border: 1px solid #e2d7ce;
                    box-sizing: border-box;
                }
                .unbox-digital-card.selected {
                    border: 2px solid #a67c52;
                    background: rgba(166, 124, 82, 0.08);
                }
                .unbox-grid-2col {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                }
                @media (max-width: 440px) {
                    .unbox-grid-2col {
                        grid-template-columns: 1fr;
                        gap: 8px;
                    }
                }
                .unbox-input {
                    width: 100%;
                    padding: 10px 12px;
                    border-radius: 10px;
                    border: 1px solid #dcd1c6;
                    background: #ffffff;
                    outline: none;
                    font-size: 13px;
                    color: #382a24;
                    font-family: var(--font-sans);
                    box-sizing: border-box;
                    transition: border-color 0.2s ease;
                }
                .unbox-input:focus {
                    border-color: #a67c52;
                }
                .unbox-select {
                    width: 100%;
                    padding: 10px 12px;
                    border-radius: 10px;
                    border: 1px solid #dcd1c6;
                    background: #ffffff;
                    outline: none;
                    font-size: 12.5px;
                    font-weight: 600;
                    color: #1d1816;
                    font-family: var(--font-sans);
                    box-sizing: border-box;
                    cursor: pointer;
                    transition: border-color 0.2s ease;
                }
                .unbox-select:focus {
                    border-color: #a67c52;
                }
                .unbox-label {
                    display: block;
                    font-size: 10.5px;
                    font-weight: 700;
                    color: #7a685e;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    margin-bottom: 6px;
                    font-family: var(--font-sans);
                }
            `}</style>

            <div
                className="unbox-modal-overlay"
                style={{
                    opacity: closing ? 0 : 1,
                    transition: "opacity 0.18s ease",
                }}
            >
                <div
                    className="unbox-modal-box"
                    style={{
                        transform: closing ? "scale(0.96) translateY(8px)" : "scale(1) translateY(0)",
                        transition: "transform 0.18s cubic-bezier(0.4,0,0.2,1)",
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        aria-label="Tutup modal"
                        style={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            background: "#ffffff",
                            border: "1px solid #dcd1c6",
                            borderRadius: "50%",
                            width: 30,
                            height: 30,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#7a685e",
                            transition: "all 0.2s ease",
                            zIndex: 10,
                        }}
                    >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {step === "details" ? (
                        <>
                            {/* Header Section */}
                            <div style={{ marginBottom: 16, paddingRight: 32 }}>
                                <span style={{
                                    fontSize: 8.5,
                                    fontWeight: 700,
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                    color: "#a67c52",
                                    background: "rgba(166,124,82,0.1)",
                                    padding: "3px 10px",
                                    borderRadius: 999,
                                    display: "inline-block",
                                    marginBottom: 6,
                                }}>
                                    Physical Gift Box + Custom QR
                                </span>
                                <h3 style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "clamp(22px, 5vw, 26px)",
                                    color: "#1d1816",
                                    margin: "0 0 4px",
                                    letterSpacing: "-0.02em",
                                    lineHeight: 1.15,
                                }}>
                                    Pesan <span style={{ fontStyle: "italic", color: "#a67c52" }}>Unbox the Memory</span>
                                </h3>
                                <p style={{ fontSize: 12, color: "#7a685e", margin: 0, fontFamily: "var(--font-sans)", lineHeight: 1.45 }}>
                                    Lengkapi alamat pengiriman dan pilih kado digital yang ingin kamu tautkan ke kartu QR.
                                </p>
                            </div>

                            <form onSubmit={handleNext} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                {/* 1. PILIH DIGITAL GIFT */}
                                <div>
                                    <label className="unbox-label">1. Format Kado Digital di Kartu QR</label>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                        {DIGITAL_OPTIONS.map((opt) => {
                                            const isSelected = selectedDigital === opt.id;
                                            return (
                                                <div
                                                    key={opt.id}
                                                    onClick={() => setSelectedDigital(opt.id)}
                                                    style={{
                                                        padding: "9px 12px",
                                                        borderRadius: 11,
                                                        border: isSelected ? "1.8px solid #a67c52" : "1px solid #e2d7ce",
                                                        background: isSelected ? "rgba(166, 124, 82, 0.08)" : "#ffffff",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        gap: 10,
                                                        transition: "all 0.18s ease",
                                                    }}
                                                >
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                                                        <div style={{
                                                            width: 15,
                                                            height: 15,
                                                            borderRadius: "50%",
                                                            border: isSelected ? "4.5px solid #a67c52" : "1.5px solid #c0b4ac",
                                                            background: "#ffffff",
                                                            flexShrink: 0,
                                                        }} />
                                                        <div style={{ minWidth: 0 }}>
                                                            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1d1816", fontFamily: "var(--font-sans)", lineHeight: 1.2 }}>
                                                                {opt.title}
                                                            </div>
                                                            <div style={{ fontSize: 10.5, color: "#7a685e", fontFamily: "var(--font-sans)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                {opt.subtitle}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {opt.badge && (
                                                        <span style={{
                                                            fontSize: 9,
                                                            fontWeight: 700,
                                                            color: opt.color,
                                                            background: `${opt.color}14`,
                                                            border: `1px solid ${opt.color}30`,
                                                            padding: "2px 8px",
                                                            borderRadius: 999,
                                                            whiteSpace: "nowrap",
                                                            flexShrink: 0,
                                                            letterSpacing: "0.03em",
                                                        }}>
                                                            {opt.badge}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 2. DATA PENGIRIM */}
                                <div>
                                    <label className="unbox-label">2. Data Pemesan (Akses Studio Digital)</label>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Nama Lengkap Pemesan"
                                            value={customerDetails.senderName}
                                            onChange={(e) => setCustomerDetails({ ...customerDetails, senderName: e.target.value })}
                                            className="unbox-input"
                                        />
                                        <div className="unbox-grid-2col">
                                            <input
                                                required
                                                type="email"
                                                placeholder="Email (Akses Studio)"
                                                value={customerDetails.email}
                                                onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                                                className="unbox-input"
                                            />
                                            <input
                                                required
                                                type="tel"
                                                placeholder="WhatsApp (Info Resi)"
                                                value={customerDetails.whatsapp}
                                                onChange={(e) => setCustomerDetails({ ...customerDetails, whatsapp: e.target.value })}
                                                className="unbox-input"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. ALAMAT PENGIRIMAN FISIK (PROVINSI & KOTA SEPERTI BOX AND TALE) */}
                                <div>
                                    <label className="unbox-label">3. Alamat Pengiriman Hampers Fisik</label>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        <div className="unbox-grid-2col">
                                            <input
                                                required
                                                type="text"
                                                placeholder="Nama Penerima Kado"
                                                value={shippingDetails.recipientName}
                                                onChange={(e) => setShippingDetails({ ...shippingDetails, recipientName: e.target.value })}
                                                className="unbox-input"
                                            />
                                            <input
                                                required
                                                type="tel"
                                                placeholder="No. HP Penerima"
                                                value={shippingDetails.recipientPhone}
                                                onChange={(e) => setShippingDetails({ ...shippingDetails, recipientPhone: e.target.value })}
                                                className="unbox-input"
                                            />
                                        </div>

                                        {/* Dropdown Provinsi & Kota */}
                                        <div className="unbox-grid-2col">
                                            <div>
                                                <select
                                                    value={shippingDetails.province}
                                                    onChange={(e) => handleProvinceChange(e.target.value)}
                                                    className="unbox-select"
                                                >
                                                    {INDONESIA_SHIPPING_DATA.map((p) => (
                                                        <option key={p.name} value={p.name}>
                                                            {p.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <select
                                                    value={shippingDetails.city}
                                                    onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                                                    className="unbox-select"
                                                >
                                                    {availableCities.map((c) => (
                                                        <option key={c.name} value={c.name}>
                                                            {c.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="unbox-grid-2col">
                                            <input
                                                type="text"
                                                placeholder="Kecamatan (Opsional)"
                                                value={shippingDetails.district}
                                                onChange={(e) => setShippingDetails({ ...shippingDetails, district: e.target.value })}
                                                className="unbox-input"
                                            />
                                            <input
                                                required
                                                type="text"
                                                placeholder="Kode Pos"
                                                value={shippingDetails.postalCode}
                                                onChange={(e) => setShippingDetails({ ...shippingDetails, postalCode: e.target.value })}
                                                className="unbox-input"
                                            />
                                        </div>

                                        <textarea
                                            required
                                            rows={2}
                                            placeholder="Alamat Lengkap (Nama Jalan, No. Rumah, RT/RW, Patokan)"
                                            value={shippingDetails.address}
                                            onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                                            className="unbox-input"
                                            style={{ resize: "none" }}
                                        />
                                    </div>
                                </div>

                                {/* 4. KARTU TARIF EKSPEDISI OTOMATIS */}
                                <div>
                                    <label className="unbox-label">4. Ekspedisi Pengiriman Reguler (1 kg)</label>
                                    <div style={{
                                        background: "#ffffff",
                                        borderRadius: 12,
                                        border: "1.5px solid #a67c52",
                                        padding: "10px 14px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: 8,
                                                background: "rgba(166,124,82,0.12)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#a67c52",
                                            }}>
                                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 12, fontWeight: 700, color: "#1d1816" }}>
                                                    SiCepat / J&T / JNE Reguler
                                                </div>
                                                <div style={{ fontSize: 10, color: "#7a685e" }}>
                                                    {shippingDetails.city} • Estimasi {shippingEstimate}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#a67c52" }}>
                                                Rp {shippingCost.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* TOTAL & SUBMIT */}
                                <div style={{ paddingTop: 6, borderTop: "1px solid rgba(205,171,143,0.2)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                                        <div>
                                            <span style={{ fontSize: 10.5, fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                                Total Biaya
                                            </span>
                                            <div style={{ fontSize: 10, color: "#a67c52" }}>
                                                Box + Ongkir ({shippingDetails.city})
                                            </div>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <span style={{ fontSize: 10.5, color: "#a6968c", textDecoration: "line-through", marginRight: 6 }}>
                                                Rp {(boxOldPrice + shippingCost).toLocaleString("id-ID")}
                                            </span>
                                            <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#1d1816" }}>
                                                Rp {totalAmount.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        style={{
                                            width: "100%",
                                            padding: "14px",
                                            borderRadius: 12,
                                            border: "none",
                                            background: "#1d1816",
                                            color: "#faf7f2",
                                            fontSize: 12,
                                            fontWeight: 700,
                                            letterSpacing: "0.1em",
                                            textTransform: "uppercase",
                                            cursor: "pointer",
                                            boxShadow: "0 6px 20px rgba(29,24,22,0.18)",
                                            transition: "all 0.2s ease",
                                        }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#a67c52"; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#1d1816"; }}
                                    >
                                        Lanjut ke Review Pesanan
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        /* STEP 2: REVIEW & PAYMENT */
                        <div>
                            <button
                                onClick={() => setStep("details")}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#a67c52",
                                    fontSize: 11,
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4,
                                    marginBottom: 14,
                                    padding: 0,
                                }}
                            >
                                ← Ubah Rincian Pesanan
                            </button>

                            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 5vw, 24px)", color: "#1d1816", margin: "0 0 4px" }}>
                                Konfirmasi Pesanan
                            </h3>
                            <p style={{ fontSize: 12, color: "#7a685e", margin: "0 0 16px", lineHeight: 1.4 }}>
                                Periksa kembali data pengiriman dan format kado sebelum melanjutkan pembayaran.
                            </p>

                            <div style={{ background: "#ffffff", borderRadius: 14, border: "1px solid #e8dfd8", padding: "16px", marginBottom: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                                <div>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                        Produk yang Dipesan
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1d1816", marginTop: 2 }}>
                                        Unbox the Memory Gift Box
                                    </div>
                                    <div style={{ fontSize: 11.5, color: "#a67c52", fontWeight: 600 }}>
                                        Tautan Kartu QR: {selectedDigitalObj.title}
                                    </div>
                                </div>

                                <div style={{ borderTop: "1px dashed #e8dfd8", paddingTop: 10 }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                        Tujuan Pengiriman
                                    </div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1d1816", marginTop: 2 }}>
                                        {shippingDetails.recipientName} ({shippingDetails.recipientPhone})
                                    </div>
                                    <div style={{ fontSize: 11, color: "#59483f", marginTop: 2, lineHeight: 1.35 }}>
                                        {shippingDetails.address}
                                    </div>
                                    <div style={{ fontSize: 11, color: "#7a685e", marginTop: 2 }}>
                                        {shippingDetails.district ? `${shippingDetails.district}, ` : ""}{shippingDetails.city}, {shippingDetails.province} {shippingDetails.postalCode}
                                    </div>
                                </div>

                                <div style={{ borderTop: "1px dashed #e8dfd8", paddingTop: 10 }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                        Layanan Pengiriman
                                    </div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "#1d1816", marginTop: 2, display: "flex", justifyContent: "space-between" }}>
                                        <span>SiCepat / J&T / JNE (1 kg)</span>
                                        <span style={{ fontWeight: 700 }}>Rp {shippingCost.toLocaleString("id-ID")}</span>
                                    </div>
                                    <div style={{ fontSize: 10.5, color: "#7a685e" }}>
                                        Estimasi {shippingEstimate}
                                    </div>
                                </div>

                                <div style={{ borderTop: "1px solid #e8dfd8", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: "#1d1816" }}>Total Pembayaran</span>
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "#a67c52" }}>
                                        Rp {totalAmount.toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isLoading}
                                style={{
                                    width: "100%",
                                    padding: "14px",
                                    borderRadius: 12,
                                    border: "none",
                                    background: "#1d1816",
                                    color: "#faf7f2",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    cursor: isLoading ? "not-allowed" : "pointer",
                                    boxShadow: "0 6px 20px rgba(29,24,22,0.18)",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                {isLoading ? "Menyiapkan Pembayaran..." : "Bayar Sekarang (QRIS / Bank / E-Wallet)"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
