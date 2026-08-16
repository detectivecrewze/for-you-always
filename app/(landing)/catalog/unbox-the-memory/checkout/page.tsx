"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "../../../../components/Navbar";
import { INDONESIA_SHIPPING_DATA, getShippingRate } from "@/lib/indonesiaShipping";
import DiscountPrice from "../../../../components/DiscountPrice";
import posthog from "posthog-js";
import { trackInitiateCheckout } from "@/lib/pixel";

const DIGITAL_OPTIONS = [
    {
        id: "loves",
        title: "Memoria",
        subtitle: "Kisah Sinematik Eksklusif & Galeri",
        color: "#d4af37",
        badge: "Signature",
        desc: "Halaman interaktif sinematik dengan musik, galeri kenangan, dan animasi kelas atas.",
        previewUrl: "/catalog/memoria",
        image: "/assets/opening_gate.png"
    },
    {
        id: "letter",
        title: "Letter Edition",
        subtitle: "Surat Digital & Typewriter",
        color: "#a67c52",
        badge: "Favorit",
        desc: "Surat digital dengan amplop interaktif, animasi typewriter, dan galeri kenangan.",
        previewUrl: "/catalog/letter",
        image: "https://cdn.for-you-always.my.id/1783163306081-l92p1h.webp"
    },
    {
        id: "voices",
        title: "Voices Gift",
        subtitle: "Pesan Suara & Galeri Foto",
        color: "#e91e63",
        badge: "Best Seller",
        desc: "Rekaman suara pribadi yang berputar otomatis bersama foto kenangan terindah.",
        previewUrl: "/catalog/voices",
        image: "https://cdn.for-you-always.my.id/1777881039502-bav595.webp"
    },
];

const BOX_PRICE = 150000;
const BOX_OLD_PRICE = 200000;

export default function UnboxCheckoutWizardPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [selectedDigital, setSelectedDigital] = useState("loves");
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
    const currentProvinceObj =
        INDONESIA_SHIPPING_DATA.find((p) => p.name === shippingDetails.province) ||
        INDONESIA_SHIPPING_DATA[0];
    const availableCities = currentProvinceObj.cities;

    const { cost: shippingCost, estimate: shippingEstimate } = getShippingRate(
        shippingDetails.province,
        shippingDetails.city
    );

    const totalAmount = BOX_PRICE + shippingCost;
    const selectedDigitalObj =
        DIGITAL_OPTIONS.find((d) => d.id === selectedDigital) || DIGITAL_OPTIONS[0];

    useEffect(() => {
        trackInitiateCheckout(
            [
                {
                    id: `unbox_${selectedDigital}`,
                    title: `Unbox the Memory (${selectedDigitalObj.title})`,
                    numericPrice: totalAmount,
                },
            ],
            totalAmount
        );
    }, []);

    const handleProvinceChange = (newProv: string) => {
        const provObj = INDONESIA_SHIPPING_DATA.find((p) => p.name === newProv);
        const firstCity = provObj && provObj.cities.length > 0 ? provObj.cities[0].name : "";
        setShippingDetails((prev) => ({
            ...prev,
            province: newProv,
            city: firstCity,
        }));
    };

    const handleStep1Submit = (e: React.FormEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        setCurrentStep(2);
    };

    const handleStep2Submit = (e: React.FormEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        setCurrentStep(3);
    };

    const handleCheckoutPayment = async () => {
        setIsLoading(true);
        try {
            const orderId = `ORDER-UNBOX-${Date.now()}`;
            const res = await fetch(
                "https://pakasir-gateway.aldoramadhan16.workers.dev/api/checkout",
                {
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
                                price: BOX_PRICE,
                                quantity: 1,
                                name: `Unbox the Memory Gift Box + ${selectedDigitalObj.title} QR`,
                            },
                            {
                                id: `shipping-rate`,
                                price: shippingCost,
                                quantity: 1,
                                name: `Ekspedisi Reguler (${shippingDetails.city}, ${shippingDetails.province})`,
                            },
                        ],
                    }),
                }
            );

            const data = await res.json();
            if (data.redirectUrl) {
                posthog.capture("unbox_payment_submitted", {
                    order_id: orderId,
                    total: totalAmount,
                    digital_product: selectedDigital,
                    shipping_city: shippingDetails.city,
                    shipping_province: shippingDetails.province,
                    shipping_cost: shippingCost,
                });
                if (typeof window !== "undefined" && (window as any).ttq) {
                    (window as any).ttq.track("CompletePayment", {
                        content_type: "product",
                        content_id: `unbox_${selectedDigital}`,
                        content_name: `Unbox the Memory - ${selectedDigitalObj.title}`,
                        value: totalAmount,
                        currency: "IDR",
                    });
                }
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
        <div
            style={{
                backgroundColor: "#faf7f2",
                color: "#382a24",
                minHeight: "100vh",
                fontFamily: "var(--font-sans, system-ui, sans-serif)",
                position: "relative",
                overflowX: "hidden",
            }}
        >
            <Navbar />

            {/* MAIN WIZARD CONTAINER */}
            <main
                style={{
                    maxWidth: "1040px",
                    margin: "0 auto",
                    paddingTop: "clamp(100px, 13vh, 130px)",
                    paddingBottom: "80px",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                }}
            >
                {/* TOP BREADCRUMB BACK */}
                <div style={{ marginBottom: "24px" }}>
                    <Link
                        href="/catalog/unbox-the-memory"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "#6e5c53",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            textDecoration: "none",
                            padding: "6px 14px",
                            borderRadius: "999px",
                            backgroundColor: "rgba(255,255,255,0.7)",
                            border: "1px solid rgba(205,171,143,0.3)",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        <span>Kembali ke Detail Produk</span>
                    </Link>
                </div>

                {/* STEPPER HEADER */}
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "20px",
                        border: "1px solid rgba(205,171,143,0.3)",
                        padding: "20px 24px",
                        marginBottom: "32px",
                        boxShadow: "0 4px 20px rgba(56,42,36,0.03)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            position: "relative",
                            maxWidth: "700px",
                            margin: "0 auto",
                        }}
                    >
                        {/* Connecting Line */}
                        <div
                            style={{
                                position: "absolute",
                                top: "18px",
                                left: "10%",
                                right: "10%",
                                height: "2px",
                                backgroundColor: "rgba(205,171,143,0.25)",
                                zIndex: 0,
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    backgroundColor: "#a67c52",
                                    width:
                                        currentStep === 1
                                            ? "0%"
                                            : currentStep === 2
                                            ? "50%"
                                            : "100%",
                                    transition: "width 0.35s ease",
                                }}
                            />
                        </div>

                        {/* Step 1 Node */}
                        <div
                            onClick={() => setCurrentStep(1)}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "6px",
                                cursor: "pointer",
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            <div
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    backgroundColor: currentStep >= 1 ? "#382a24" : "#ffffff",
                                    color: currentStep >= 1 ? "#faf7f2" : "#a6968c",
                                    border: currentStep >= 1 ? "2px solid #382a24" : "2px solid #dcd1c6",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    fontSize: "0.85rem",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                1
                            </div>
                            <span
                                style={{
                                    fontSize: "0.78rem",
                                    fontWeight: currentStep === 1 ? 700 : 500,
                                    color: currentStep === 1 ? "#1d1816" : "#7a685e",
                                    letterSpacing: "0.02em",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                1. Format Kado
                            </span>
                        </div>

                        {/* Step 2 Node */}
                        <div
                            onClick={() => {
                                if (customerDetails.senderName && customerDetails.email) {
                                    setCurrentStep(2);
                                }
                            }}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "6px",
                                cursor: "pointer",
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            <div
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    backgroundColor: currentStep >= 2 ? "#382a24" : "#ffffff",
                                    color: currentStep >= 2 ? "#faf7f2" : "#a6968c",
                                    border: currentStep >= 2 ? "2px solid #382a24" : "2px solid #dcd1c6",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    fontSize: "0.85rem",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                2
                            </div>
                            <span
                                style={{
                                    fontSize: "0.78rem",
                                    fontWeight: currentStep === 2 ? 700 : 500,
                                    color: currentStep === 2 ? "#1d1816" : "#7a685e",
                                    letterSpacing: "0.02em",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                2. Alamat & Kurir
                            </span>
                        </div>

                        {/* Step 3 Node */}
                        <div
                            onClick={() => {
                                if (
                                    customerDetails.senderName &&
                                    shippingDetails.recipientName &&
                                    shippingDetails.address
                                ) {
                                    setCurrentStep(3);
                                }
                            }}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "6px",
                                cursor: "pointer",
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            <div
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    backgroundColor: currentStep === 3 ? "#382a24" : "#ffffff",
                                    color: currentStep === 3 ? "#faf7f2" : "#a6968c",
                                    border: currentStep === 3 ? "2px solid #382a24" : "2px solid #dcd1c6",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    fontSize: "0.85rem",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                3
                            </div>
                            <span
                                style={{
                                    fontSize: "0.78rem",
                                    fontWeight: currentStep === 3 ? 700 : 500,
                                    color: currentStep === 3 ? "#1d1816" : "#7a685e",
                                    letterSpacing: "0.02em",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                3. Review & Bayar
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2-COLUMN SPLIT CONTAINER */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                        gap: "32px",
                        alignItems: "start",
                    }}
                >
                    {/* LEFT MAIN WIZARD COLUMN */}
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "24px",
                            border: "1px solid rgba(205,171,143,0.3)",
                            padding: "clamp(24px, 4vw, 36px)",
                            boxShadow: "0 8px 30px rgba(56,42,36,0.04)",
                        }}
                    >
                        {/* ── STEP 1: FORMAT KADO & PEMESAN ── */}
                        {currentStep === 1 && (
                            <form onSubmit={handleStep1Submit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                <div>
                                    <span
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                            color: "#a67c52",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.12em",
                                        }}
                                    >
                                        Langkah 1 dari 3
                                    </span>
                                    <h2
                                        style={{
                                            fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                                            fontSize: "clamp(1.8rem, 3.5vw, 2.3rem)",
                                            fontWeight: 500,
                                            color: "#1d1816",
                                            margin: "4px 0 8px",
                                            lineHeight: 1.15,
                                        }}
                                    >
                                        Pilih Format Kado Digital di Kartu QR
                                    </h2>
                                    <p style={{ fontSize: "0.92rem", color: "#6e5c53", margin: 0, lineHeight: 1.6 }}>
                                        Penerima akan membuka box fisik dan memindai (scan) kartu QR untuk menikmati kado interaktif yang kamu buat.
                                    </p>
                                </div>

                                {/* 3 Signature Digital Options */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    {DIGITAL_OPTIONS.map((opt) => {
                                        const isSelected = selectedDigital === opt.id;
                                        return (
                                            <div
                                                key={opt.id}
                                                onClick={() => setSelectedDigital(opt.id)}
                                                style={{
                                                    padding: "16px 18px",
                                                    borderRadius: "16px",
                                                    border: isSelected
                                                        ? "2px solid #a67c52"
                                                        : "1px solid #e2d7ce",
                                                    backgroundColor: isSelected
                                                        ? "rgba(166,124,82,0.06)"
                                                        : "#ffffff",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    gap: "14px",
                                                    transition: "all 0.2s ease",
                                                }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
                                                    <div
                                                        style={{
                                                            width: "20px",
                                                            height: "20px",
                                                            borderRadius: "50%",
                                                            border: isSelected
                                                                ? "6px solid #a67c52"
                                                                : "2px solid #c0b4ac",
                                                            backgroundColor: "#ffffff",
                                                            flexShrink: 0,
                                                            transition: "all 0.2s ease",
                                                        }}
                                                    />
                                                    <div style={{ minWidth: 0 }}>
                                                        <div
                                                            style={{
                                                                fontSize: "1.05rem",
                                                                fontWeight: 700,
                                                                color: "#1d1816",
                                                                fontFamily: "var(--font-sans)",
                                                            }}
                                                        >
                                                            {opt.title}
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize: "0.85rem",
                                                                color: "#7a685e",
                                                                marginTop: "2px",
                                                                lineHeight: 1.35,
                                                            }}
                                                        >
                                                            {opt.desc}
                                                        </div>
                                                    </div>
                                                </div>

                                                <span
                                                    style={{
                                                        fontSize: "0.75rem",
                                                        fontWeight: 700,
                                                        color: opt.color,
                                                        backgroundColor: `${opt.color}15`,
                                                        border: `1px solid ${opt.color}35`,
                                                        padding: "4px 10px",
                                                        borderRadius: "999px",
                                                        whiteSpace: "nowrap",
                                                        flexShrink: 0,
                                                        letterSpacing: "0.04em",
                                                    }}
                                                >
                                                    {opt.badge}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Form Data Pemesan */}
                                <div style={{ borderTop: "1px solid rgba(205,171,143,0.25)", paddingTop: "20px" }}>
                                    <h3
                                        style={{
                                            fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                                            fontSize: "1.35rem",
                                            fontWeight: 600,
                                            color: "#1d1816",
                                            marginBottom: "14px",
                                        }}
                                    >
                                        Data Pemesan (Akses Studio Digital)
                                    </h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        <div>
                                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                                                Nama Lengkap Pemesan
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Contoh: Aldo Ramadhan"
                                                value={customerDetails.senderName}
                                                onChange={(e) =>
                                                    setCustomerDetails({
                                                        ...customerDetails,
                                                        senderName: e.target.value,
                                                    })
                                                }
                                                style={{
                                                    width: "100%",
                                                    padding: "12px 16px",
                                                    borderRadius: "12px",
                                                    border: "1px solid #dcd1c6",
                                                    backgroundColor: "#faf7f2",
                                                    fontSize: "0.95rem",
                                                    color: "#1d1816",
                                                    outline: "none",
                                                    boxSizing: "border-box",
                                                }}
                                            />
                                        </div>

                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                                                    Email (Akses Link Studio)
                                                </label>
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="nama@email.com"
                                                    value={customerDetails.email}
                                                    onChange={(e) =>
                                                        setCustomerDetails({
                                                            ...customerDetails,
                                                            email: e.target.value,
                                                        })
                                                    }
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px 16px",
                                                        borderRadius: "12px",
                                                        border: "1px solid #dcd1c6",
                                                        backgroundColor: "#faf7f2",
                                                        fontSize: "0.95rem",
                                                        color: "#1d1816",
                                                        outline: "none",
                                                        boxSizing: "border-box",
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                                                    WhatsApp (Notifikasi Resi)
                                                </label>
                                                <input
                                                    required
                                                    type="tel"
                                                    placeholder="08123456789"
                                                    value={customerDetails.whatsapp}
                                                    onChange={(e) =>
                                                        setCustomerDetails({
                                                            ...customerDetails,
                                                            whatsapp: e.target.value,
                                                        })
                                                    }
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px 16px",
                                                        borderRadius: "12px",
                                                        border: "1px solid #dcd1c6",
                                                        backgroundColor: "#faf7f2",
                                                        fontSize: "0.95rem",
                                                        color: "#1d1816",
                                                        outline: "none",
                                                        boxSizing: "border-box",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    style={{
                                        marginTop: "12px",
                                        padding: "16px",
                                        borderRadius: "14px",
                                        backgroundColor: "#1d1816",
                                        color: "#faf7f2",
                                        fontSize: "0.92rem",
                                        fontWeight: 700,
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        border: "none",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                        boxShadow: "0 8px 24px rgba(29,24,22,0.2)",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <span>Lanjut ke Alamat Pengiriman</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </button>
                            </form>
                        )}

                        {/* ── STEP 2: ALAMAT PENGIRIMAN & EKSPEDISI ── */}
                        {currentStep === 2 && (
                            <form onSubmit={handleStep2Submit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                <div>
                                    <span
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                            color: "#a67c52",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.12em",
                                        }}
                                    >
                                        Langkah 2 dari 3
                                    </span>
                                    <h2
                                        style={{
                                            fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                                            fontSize: "clamp(1.8rem, 3.5vw, 2.3rem)",
                                            fontWeight: 500,
                                            color: "#1d1816",
                                            margin: "4px 0 8px",
                                            lineHeight: 1.15,
                                        }}
                                    >
                                        Alamat Pengiriman Hampers Fisik
                                    </h2>
                                    <p style={{ fontSize: "0.92rem", color: "#6e5c53", margin: 0, lineHeight: 1.6 }}>
                                        Masukkan data penerima kado dengan akurat. Box kado akan dikirim dengan packaging kardus tebal dan *bubble wrap* ekstra aman.
                                    </p>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                    {/* Penerima */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                        <div>
                                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                                                Nama Penerima Kado
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Nama Penerima"
                                                value={shippingDetails.recipientName}
                                                onChange={(e) =>
                                                    setShippingDetails({
                                                        ...shippingDetails,
                                                        recipientName: e.target.value,
                                                    })
                                                }
                                                style={{
                                                    width: "100%",
                                                    padding: "12px 16px",
                                                    borderRadius: "12px",
                                                    border: "1px solid #dcd1c6",
                                                    backgroundColor: "#faf7f2",
                                                    fontSize: "0.95rem",
                                                    color: "#1d1816",
                                                    outline: "none",
                                                    boxSizing: "border-box",
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                                                No. HP Penerima
                                            </label>
                                            <input
                                                required
                                                type="tel"
                                                placeholder="08123456789"
                                                value={shippingDetails.recipientPhone}
                                                onChange={(e) =>
                                                    setShippingDetails({
                                                        ...shippingDetails,
                                                        recipientPhone: e.target.value,
                                                    })
                                                }
                                                style={{
                                                    width: "100%",
                                                    padding: "12px 16px",
                                                    borderRadius: "12px",
                                                    border: "1px solid #dcd1c6",
                                                    backgroundColor: "#faf7f2",
                                                    fontSize: "0.95rem",
                                                    color: "#1d1816",
                                                    outline: "none",
                                                    boxSizing: "border-box",
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Dropdown Provinsi & Kota */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                        <div>
                                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                                                Provinsi Tujuan
                                            </label>
                                            <select
                                                value={shippingDetails.province}
                                                onChange={(e) => handleProvinceChange(e.target.value)}
                                                style={{
                                                    width: "100%",
                                                    padding: "12px 16px",
                                                    borderRadius: "12px",
                                                    border: "1px solid #dcd1c6",
                                                    backgroundColor: "#faf7f2",
                                                    fontSize: "0.95rem",
                                                    fontWeight: 600,
                                                    color: "#1d1816",
                                                    outline: "none",
                                                    cursor: "pointer",
                                                    boxSizing: "border-box",
                                                }}
                                            >
                                                {INDONESIA_SHIPPING_DATA.map((p) => (
                                                    <option key={p.name} value={p.name}>
                                                        {p.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                                                Kota / Kabupaten
                                            </label>
                                            <select
                                                value={shippingDetails.city}
                                                onChange={(e) =>
                                                    setShippingDetails({
                                                        ...shippingDetails,
                                                        city: e.target.value,
                                                    })
                                                }
                                                style={{
                                                    width: "100%",
                                                    padding: "12px 16px",
                                                    borderRadius: "12px",
                                                    border: "1px solid #dcd1c6",
                                                    backgroundColor: "#faf7f2",
                                                    fontSize: "0.95rem",
                                                    fontWeight: 600,
                                                    color: "#1d1816",
                                                    outline: "none",
                                                    cursor: "pointer",
                                                    boxSizing: "border-box",
                                                }}
                                            >
                                                {availableCities.map((c) => (
                                                    <option key={c.name} value={c.name}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Kecamatan & Kode Pos */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                        <div>
                                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                                                Kecamatan (Opsional)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Contoh: Sukajadi"
                                                value={shippingDetails.district}
                                                onChange={(e) =>
                                                    setShippingDetails({
                                                        ...shippingDetails,
                                                        district: e.target.value,
                                                    })
                                                }
                                                style={{
                                                    width: "100%",
                                                    padding: "12px 16px",
                                                    borderRadius: "12px",
                                                    border: "1px solid #dcd1c6",
                                                    backgroundColor: "#faf7f2",
                                                    fontSize: "0.95rem",
                                                    color: "#1d1816",
                                                    outline: "none",
                                                    boxSizing: "border-box",
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                                                Kode Pos
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Contoh: 40162"
                                                value={shippingDetails.postalCode}
                                                onChange={(e) =>
                                                    setShippingDetails({
                                                        ...shippingDetails,
                                                        postalCode: e.target.value,
                                                    })
                                                }
                                                style={{
                                                    width: "100%",
                                                    padding: "12px 16px",
                                                    borderRadius: "12px",
                                                    border: "1px solid #dcd1c6",
                                                    backgroundColor: "#faf7f2",
                                                    fontSize: "0.95rem",
                                                    color: "#1d1816",
                                                    outline: "none",
                                                    boxSizing: "border-box",
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Alamat Lengkap */}
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                                            Alamat Lengkap (Nama Jalan, No. Rumah, RT/RW, Patokan)
                                        </label>
                                        <textarea
                                            required
                                            rows={3}
                                            placeholder="Jl. Sukasenang No. 12, RT 02 / RW 05, Kel. Pasirkaliki (Dekat Masjid Al-Ikhlas)"
                                            value={shippingDetails.address}
                                            onChange={(e) =>
                                                setShippingDetails({
                                                    ...shippingDetails,
                                                    address: e.target.value,
                                                })
                                            }
                                            style={{
                                                width: "100%",
                                                padding: "12px 16px",
                                                borderRadius: "12px",
                                                border: "1px solid #dcd1c6",
                                                backgroundColor: "#faf7f2",
                                                fontSize: "0.95rem",
                                                color: "#1d1816",
                                                outline: "none",
                                                resize: "none",
                                                fontFamily: "var(--font-sans)",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Kartu Ekspedisi Terpilih */}
                                <div style={{ borderTop: "1px solid rgba(205,171,143,0.25)", paddingTop: "20px" }}>
                                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                                        Layanan Ekspedisi Reguler (1 kg)
                                    </label>
                                    <div
                                        style={{
                                            backgroundColor: "#faf7f2",
                                            border: "1.5px solid #a67c52",
                                            borderRadius: "16px",
                                            padding: "16px 20px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                            <div
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    borderRadius: "10px",
                                                    backgroundColor: "rgba(166,124,82,0.15)",
                                                    color: "#a67c52",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1d1816" }}>
                                                    SiCepat / J&T / JNE Reguler
                                                </div>
                                                <div style={{ fontSize: "0.85rem", color: "#7a685e" }}>
                                                    {shippingDetails.city} • Estimasi tiba {shippingEstimate}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#a67c52" }}>
                                                Rp {shippingCost.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(1)}
                                        style={{
                                            padding: "16px 24px",
                                            borderRadius: "14px",
                                            backgroundColor: "#faf7f2",
                                            color: "#6e5c53",
                                            border: "1px solid #dcd1c6",
                                            fontSize: "0.92rem",
                                            fontWeight: 700,
                                            cursor: "pointer",
                                        }}
                                    >
                                        ← Kembali
                                    </button>
                                    <button
                                        type="submit"
                                        style={{
                                            flex: 1,
                                            padding: "16px",
                                            borderRadius: "14px",
                                            backgroundColor: "#1d1816",
                                            color: "#faf7f2",
                                            fontSize: "0.92rem",
                                            fontWeight: 700,
                                            letterSpacing: "0.1em",
                                            textTransform: "uppercase",
                                            border: "none",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px",
                                            boxShadow: "0 8px 24px rgba(29,24,22,0.2)",
                                        }}
                                    >
                                        <span>Lanjut ke Review Pesanan</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ── STEP 3: REVIEW & PEMBAYARAN ── */}
                        {currentStep === 3 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                <div>
                                    <span
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                            color: "#a67c52",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.12em",
                                        }}
                                    >
                                        Langkah 3 dari 3
                                    </span>
                                    <h2
                                        style={{
                                            fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                                            fontSize: "clamp(1.8rem, 3.5vw, 2.3rem)",
                                            fontWeight: 500,
                                            color: "#1d1816",
                                            margin: "4px 0 8px",
                                            lineHeight: 1.15,
                                        }}
                                    >
                                        Konfirmasi & Pembayaran
                                    </h2>
                                    <p style={{ fontSize: "0.92rem", color: "#6e5c53", margin: 0, lineHeight: 1.6 }}>
                                        Periksa kembali rincian kado dan alamat pengiriman sebelum melanjutkan pembayaran.
                                    </p>
                                </div>

                                <div
                                    style={{
                                        backgroundColor: "#faf7f2",
                                        borderRadius: "18px",
                                        border: "1px solid rgba(205,171,143,0.3)",
                                        padding: "20px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "16px",
                                    }}
                                >
                                    {/* Produk */}
                                    <div>
                                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                            Kado Fisik + QR Digital
                                        </div>
                                        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1d1816", marginTop: "2px" }}>
                                            Unbox the Memory Gift Box
                                        </div>
                                        <div style={{ fontSize: "0.92rem", color: "#a67c52", fontWeight: 600, marginTop: "2px" }}>
                                            Kartu QR Terhubung: {selectedDigitalObj.title} ({selectedDigitalObj.badge})
                                        </div>
                                    </div>

                                    {/* Alamat */}
                                    <div style={{ borderTop: "1px dashed #dcd1c6", paddingTop: "14px" }}>
                                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                            Alamat Penerima
                                        </div>
                                        <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1d1816", marginTop: "2px" }}>
                                            {shippingDetails.recipientName} ({shippingDetails.recipientPhone})
                                        </div>
                                        <div style={{ fontSize: "0.88rem", color: "#59483f", marginTop: "2px", lineHeight: 1.4 }}>
                                            {shippingDetails.address}
                                        </div>
                                        <div style={{ fontSize: "0.88rem", color: "#7a685e", marginTop: "2px" }}>
                                            {shippingDetails.district ? `${shippingDetails.district}, ` : ""}
                                            {shippingDetails.city}, {shippingDetails.province} {shippingDetails.postalCode}
                                        </div>
                                    </div>

                                    {/* Kurir */}
                                    <div style={{ borderTop: "1px dashed #dcd1c6", paddingTop: "14px" }}>
                                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                            Ekspedisi Pengiriman
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
                                            <span style={{ fontSize: "0.92rem", fontWeight: 600, color: "#1d1816" }}>
                                                SiCepat / J&T / JNE Reguler
                                            </span>
                                            <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#a67c52" }}>
                                                Rp {shippingCost.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: "0.82rem", color: "#7a685e" }}>
                                            Estimasi tiba {shippingEstimate}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "12px" }}>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(2)}
                                        style={{
                                            padding: "16px 24px",
                                            borderRadius: "14px",
                                            backgroundColor: "#faf7f2",
                                            color: "#6e5c53",
                                            border: "1px solid #dcd1c6",
                                            fontSize: "0.92rem",
                                            fontWeight: 700,
                                            cursor: "pointer",
                                        }}
                                    >
                                        ← Ubah Alamat
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCheckoutPayment}
                                        disabled={isLoading}
                                        style={{
                                            flex: 1,
                                            padding: "16px",
                                            borderRadius: "14px",
                                            backgroundColor: "#1d1816",
                                            color: "#faf7f2",
                                            fontSize: "0.95rem",
                                            fontWeight: 700,
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            border: "none",
                                            cursor: isLoading ? "not-allowed" : "pointer",
                                            boxShadow: "0 8px 24px rgba(29,24,22,0.25)",
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        {isLoading
                                            ? "Menyiapkan Pembayaran..."
                                            : "Bayar Sekarang (QRIS / Bank / E-Wallet)"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT ORDER SUMMARY SIDEBAR */}
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "24px",
                            border: "1px solid rgba(205,171,143,0.3)",
                            padding: "24px",
                            position: "sticky",
                            top: "110px",
                            boxShadow: "0 8px 30px rgba(56,42,36,0.04)",
                        }}
                    >
                        <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "20px" }}>
                            <div
                                style={{
                                    width: "74px",
                                    height: "74px",
                                    borderRadius: "14px",
                                    overflow: "hidden",
                                    border: "1px solid rgba(205,171,143,0.3)",
                                    position: "relative",
                                    flexShrink: 0,
                                }}
                            >
                                <Image
                                    src="/assets/unbox_hampers_hero.jpg"
                                    alt="Unbox the Memory Gift Box"
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                            <div>
                                <span
                                    style={{
                                        fontSize: "0.72rem",
                                        fontWeight: 700,
                                        color: "#a67c52",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                    }}
                                >
                                    Physical Hampers
                                </span>
                                <h4
                                    style={{
                                        fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                                        fontSize: "1.35rem",
                                        fontWeight: 600,
                                        color: "#1d1816",
                                        margin: "2px 0 0",
                                        lineHeight: 1.2,
                                    }}
                                >
                                    Unbox the Memory
                                </h4>
                                <div style={{ fontSize: "0.82rem", color: "#7a685e" }}>
                                    QR Format: {selectedDigitalObj.title}
                                </div>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div
                            style={{
                                borderTop: "1px solid rgba(205,171,143,0.25)",
                                borderBottom: "1px solid rgba(205,171,143,0.25)",
                                padding: "16px 0",
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                                <span style={{ color: "#6e5c53" }}>Gift Box Eksklusif + Cetak QR</span>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <span style={{ fontSize: "0.8rem", color: "#a6968c", textDecoration: "line-through" }}>
                                        Rp {BOX_OLD_PRICE.toLocaleString("id-ID")}
                                    </span>
                                    <span style={{ fontWeight: 700, color: "#1d1816" }}>
                                        Rp {BOX_PRICE.toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                                <span style={{ color: "#6e5c53" }}>Ongkir Reguler ({shippingDetails.city})</span>
                                <span style={{ fontWeight: 700, color: "#1d1816" }}>
                                    Rp {shippingCost.toLocaleString("id-ID")}
                                </span>
                            </div>
                        </div>

                        {/* Total Bill */}
                        <div style={{ padding: "16px 0 6px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                            <div>
                                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                    Total Tagihan
                                </span>
                                <div style={{ fontSize: "0.78rem", color: "#a67c52" }}>
                                    Termasuk Box, QR & Ongkir
                                </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <span
                                    style={{
                                        fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                                        fontSize: "1.8rem",
                                        fontWeight: 700,
                                        color: "#1d1816",
                                    }}
                                >
                                    Rp {totalAmount.toLocaleString("id-ID")}
                                </span>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div
                            style={{
                                marginTop: "18px",
                                backgroundColor: "rgba(166,124,82,0.06)",
                                borderRadius: "14px",
                                padding: "12px 14px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "#6e5c53" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a67c52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                <span>Pembayaran Terverifikasi Otomatis (QRIS/Bank)</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "#6e5c53" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a67c52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>Akses Studio Digital langsung aktif setelah bayar</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
