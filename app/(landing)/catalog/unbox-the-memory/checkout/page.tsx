"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../../components/Navbar";
import { INDONESIA_SHIPPING_DATA, getShippingRate } from "@/lib/indonesiaShipping";
import posthog from "posthog-js";
import { trackInitiateCheckout } from "@/lib/pixel";

interface DigitalOption {
    id: string;
    title: string;
    tagline: string;
    badge: string;
    badgeColor: string;
    image: string;
    demoUrl: string;
}

const DIGITAL_OPTIONS: DigitalOption[] = [
    {
        id: "loves",
        title: "Memoria",
        tagline: "Kisah Sinematik, Musik Latar & Galeri",
        badge: "Signature",
        badgeColor: "#b38742",
        image: "/assets/opening_gate.png",
        demoUrl: "https://anniv.for-you-always.my.id/",
    },
    {
        id: "letter",
        title: "Letter Edition",
        tagline: "Surat Digital Klasik & Typewriter",
        badge: "Favorit",
        badgeColor: "#a67c52",
        image: "https://cdn.for-you-always.my.id/1783163306081-l92p1h.webp",
        demoUrl: "https://letter.for-you-always.my.id/",
    },
    {
        id: "voices",
        title: "Voices Gift",
        tagline: "Pesan Suara / Voice Note & Foto Kenangan",
        badge: "Best Seller",
        badgeColor: "#994d5d",
        image: "https://cdn.for-you-always.my.id/1777881039502-bav595.webp",
        demoUrl: "https://voices.for-you-always.my.id/",
    },
];

const BOX_PRICE = 150000;
const BOX_OLD_PRICE = 200000;

export default function UnboxCheckoutWizardPage() {
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
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

    const handleStep1Submit = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setCurrentStep(2);
    };

    const handleStep2Submit = (e: React.FormEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        setCurrentStep(3);
    };

    const handleStep3Submit = (e: React.FormEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        setCurrentStep(4);
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

    const stepTitles = [
        "Pilih Format Kado Digital",
        "Data Pemesan & Akses Studio",
        "Alamat Pengiriman Hampers",
        "Review Pesanan & Pembayaran",
    ];

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
                    maxWidth: "960px",
                    margin: "0 auto",
                    paddingTop: "clamp(90px, 12vh, 120px)",
                    paddingBottom: "80px",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                }}
            >
                {/* TOP BREADCRUMB */}
                <div style={{ marginBottom: "16px" }}>
                    <Link
                        href="/catalog/unbox-the-memory"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            color: "#7a685e",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            textDecoration: "none",
                            padding: "6px 12px",
                            borderRadius: "999px",
                            backgroundColor: "rgba(255,255,255,0.8)",
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
                        <span>Kembali ke Detail</span>
                    </Link>
                </div>

                {/* ELEGANT MINIMALIST STEPPER (ANTI-OVERFLOW ON MOBILE) */}
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "18px",
                        border: "1px solid rgba(205,171,143,0.25)",
                        padding: "16px 20px",
                        marginBottom: "24px",
                        boxShadow: "0 2px 12px rgba(56,42,36,0.03)",
                    }}
                >
                    {/* Step Label Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
                        <span
                            style={{
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                color: "#a67c52",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                            }}
                        >
                            Langkah {currentStep} dari 4
                        </span>
                        <span
                            style={{
                                fontSize: "0.85rem",
                                fontWeight: 700,
                                color: "#1d1816",
                                fontFamily: "var(--font-display, Cormorant Garamond, Georgia, serif)",
                                letterSpacing: "0.01em",
                            }}
                        >
                            {stepTitles[currentStep - 1]}
                        </span>
                    </div>

                    {/* Segmented Progress Bar */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
                        {[1, 2, 3, 4].map((stepNum) => {
                            const isCompleted = currentStep > stepNum;
                            const isActive = currentStep === stepNum;
                            return (
                                <div
                                    key={stepNum}
                                    onClick={() => {
                                        if (stepNum === 1) setCurrentStep(1);
                                        if (stepNum === 2 && customerDetails.senderName) setCurrentStep(2);
                                        if (stepNum === 3 && customerDetails.senderName && customerDetails.email) setCurrentStep(3);
                                        if (stepNum === 4 && customerDetails.senderName && shippingDetails.address) setCurrentStep(4);
                                    }}
                                    style={{
                                        height: "5px",
                                        borderRadius: "999px",
                                        backgroundColor: isCompleted || isActive ? "#382a24" : "rgba(205,171,143,0.25)",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* 2-COLUMN LUXURY ATELIER LAYOUT */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                        gap: "24px",
                        alignItems: "start",
                    }}
                >
                    {/* LEFT MAIN WIZARD COLUMN */}
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "20px",
                            border: "1px solid rgba(205,171,143,0.3)",
                            padding: "clamp(20px, 3.5vw, 30px)",
                            boxShadow: "0 4px 20px rgba(56,42,36,0.03)",
                        }}
                    >
                        {/* ── STEP 1: PILIH FORMAT KADO DIGITAL (MINIMALIST & VISUAL) ── */}
                        {currentStep === 1 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                                <div>
                                    <h2
                                        style={{
                                            fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                                            fontSize: "clamp(1.5rem, 3vw, 1.9rem)",
                                            fontWeight: 500,
                                            color: "#1d1816",
                                            margin: "0 0 6px",
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        Pilih Format Kado di Kartu QR
                                    </h2>
                                    <p style={{ fontSize: "0.86rem", color: "#6e5c53", margin: 0, lineHeight: 1.5 }}>
                                        Penerima akan membuka box kado dan memindai (scan) kartu ucapan fisik untuk membuka kado digital pilihanmu.
                                    </p>
                                </div>

                                {/* 3 Compact Visual Cards */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {DIGITAL_OPTIONS.map((opt) => {
                                        const isSelected = selectedDigital === opt.id;
                                        return (
                                            <div
                                                key={opt.id}
                                                onClick={() => setSelectedDigital(opt.id)}
                                                style={{
                                                    borderRadius: "16px",
                                                    border: isSelected
                                                        ? "2px solid #a67c52"
                                                        : "1px solid #e8ded6",
                                                    backgroundColor: isSelected
                                                        ? "rgba(166,124,82,0.04)"
                                                        : "#ffffff",
                                                    padding: "12px 14px",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "14px",
                                                    transition: "all 0.2s ease",
                                                }}
                                            >
                                                {/* Left Thumbnail with Badge */}
                                                <div
                                                    style={{
                                                        position: "relative",
                                                        width: "72px",
                                                        height: "72px",
                                                        borderRadius: "12px",
                                                        overflow: "hidden",
                                                        backgroundColor: "#1d1816",
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <Image
                                                        src={opt.image}
                                                        alt={opt.title}
                                                        fill
                                                        style={{ objectFit: "cover" }}
                                                    />
                                                </div>

                                                {/* Center Details */}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                                        <span
                                                            style={{
                                                                fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                                                                fontSize: "1.2rem",
                                                                fontWeight: 600,
                                                                color: "#1d1816",
                                                            }}
                                                        >
                                                            {opt.title}
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: "0.68rem",
                                                                fontWeight: 700,
                                                                color: opt.badgeColor,
                                                                backgroundColor: `${opt.badgeColor}15`,
                                                                padding: "2px 8px",
                                                                borderRadius: "999px",
                                                                letterSpacing: "0.04em",
                                                                textTransform: "uppercase",
                                                            }}
                                                        >
                                                            {opt.badge}
                                                        </span>
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "0.8rem",
                                                            color: "#7a685e",
                                                            marginTop: "2px",
                                                            lineHeight: 1.3,
                                                        }}
                                                    >
                                                        {opt.tagline}
                                                    </div>
                                                    <div style={{ marginTop: "4px" }}>
                                                        <a
                                                            href={opt.demoUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            style={{
                                                                fontSize: "0.76rem",
                                                                fontWeight: 600,
                                                                color: "#a67c52",
                                                                textDecoration: "none",
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                gap: "3px",
                                                            }}
                                                        >
                                                            <span>Lihat Contoh Live ↗</span>
                                                        </a>
                                                    </div>
                                                </div>

                                                {/* Right Radio Indicator */}
                                                <div
                                                    style={{
                                                        width: "20px",
                                                        height: "20px",
                                                        borderRadius: "50%",
                                                        border: isSelected ? "6px solid #a67c52" : "2px solid #d4c8bf",
                                                        backgroundColor: "#ffffff",
                                                        flexShrink: 0,
                                                        transition: "all 0.2s ease",
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleStep1Submit}
                                    style={{
                                        marginTop: "6px",
                                        padding: "15px",
                                        borderRadius: "14px",
                                        backgroundColor: "#1d1816",
                                        color: "#faf7f2",
                                        fontSize: "0.9rem",
                                        fontWeight: 700,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        border: "none",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                        boxShadow: "0 6px 20px rgba(29,24,22,0.18)",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <span>Lanjut ke Data Pemesan</span>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* ── STEP 2: DATA PEMESAN (AKSES STUDIO) ── */}
                        {currentStep === 2 && (
                            <form onSubmit={handleStep2Submit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                                <div>
                                    <h2
                                        style={{
                                            fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                                            fontSize: "clamp(1.5rem, 3vw, 1.9rem)",
                                            fontWeight: 500,
                                            color: "#1d1816",
                                            margin: "0 0 6px",
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        Data Pemesan
                                    </h2>
                                    <p style={{ fontSize: "0.86rem", color: "#6e5c53", margin: 0, lineHeight: 1.5 }}>
                                        Akses studio kado <strong>{selectedDigitalObj.title}</strong> akan dikirimkan otomatis ke Email & WhatsApp kamu.
                                    </p>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>
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
                                                padding: "12px 14px",
                                                borderRadius: "12px",
                                                border: "1px solid #dcd1c6",
                                                backgroundColor: "#faf7f2",
                                                fontSize: "0.92rem",
                                                color: "#1d1816",
                                                outline: "none",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                                        <div>
                                            <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>
                                                Email (Akses Studio)
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
                                                    padding: "12px 14px",
                                                    borderRadius: "12px",
                                                    border: "1px solid #dcd1c6",
                                                    backgroundColor: "#faf7f2",
                                                    fontSize: "0.92rem",
                                                    color: "#1d1816",
                                                    outline: "none",
                                                    boxSizing: "border-box",
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>
                                                No. WhatsApp (Resi)
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
                                                    padding: "12px 14px",
                                                    borderRadius: "12px",
                                                    border: "1px solid #dcd1c6",
                                                    backgroundColor: "#faf7f2",
                                                    fontSize: "0.92rem",
                                                    color: "#1d1816",
                                                    outline: "none",
                                                    boxSizing: "border-box",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(1)}
                                        style={{
                                            padding: "14px 20px",
                                            borderRadius: "12px",
                                            backgroundColor: "#faf7f2",
                                            color: "#6e5c53",
                                            border: "1px solid #dcd1c6",
                                            fontSize: "0.88rem",
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
                                            padding: "14px",
                                            borderRadius: "12px",
                                            backgroundColor: "#1d1816",
                                            color: "#faf7f2",
                                            fontSize: "0.9rem",
                                            fontWeight: 700,
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            border: "none",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "6px",
                                            boxShadow: "0 6px 20px rgba(29,24,22,0.18)",
                                        }}
                                    >
                                        <span>Lanjut ke Alamat</span>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ── STEP 3: ALAMAT PENGIRIMAN & EKSPEDISI ── */}
                        {currentStep === 3 && (
                            <form onSubmit={handleStep3Submit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                                <div>
                                    <h2
                                        style={{
                                            fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                                            fontSize: "clamp(1.5rem, 3vw, 1.9rem)",
                                            fontWeight: 500,
                                            color: "#1d1816",
                                            margin: "0 0 6px",
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        Alamat Pengiriman
                                    </h2>
                                    <p style={{ fontSize: "0.86rem", color: "#6e5c53", margin: 0, lineHeight: 1.5 }}>
                                        Box kado dikemas aman dengan kardus tebal dan *bubble wrap* ekstra.
                                    </p>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    {/* Penerima */}
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                                        <div>
                                            <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>
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
                                                    padding: "12px 14px",
                                                    borderRadius: "12px",
                                                    border: "1px solid #dcd1c6",
                                                    backgroundColor: "#faf7f2",
                                                    fontSize: "0.92rem",
                                                    color: "#1d1816",
                                                    outline: "none",
                                                    boxSizing: "border-box",
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>
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
                                                    padding: "12px 14px",
                                                    borderRadius: "12px",
                                                    border: "1px solid #dcd1c6",
                                                    backgroundColor: "#faf7f2",
                                                    fontSize: "0.92rem",
                                                    color: "#1d1816",
                                                    outline: "none",
                                                    boxSizing: "border-box",
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Dropdown Provinsi & Kota */}
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                                        <div>
                                            <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>
                                                Provinsi
                                            </label>
                                            <select
                                                value={shippingDetails.province}
                                                onChange={(e) => handleProvinceChange(e.target.value)}
                                                style={{
                                                    width: "100%",
                                                    padding: "12px 14px",
                                                    borderRadius: "12px",
                                                    border: "1px solid #dcd1c6",
                                                    backgroundColor: "#faf7f2",
                                                    fontSize: "0.92rem",
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
                                            <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>
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
                                                    padding: "12px 14px",
                                                    borderRadius: "12px",
                                                    border: "1px solid #dcd1c6",
                                                    backgroundColor: "#faf7f2",
                                                    fontSize: "0.92rem",
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

                                    {/* Alamat Lengkap */}
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>
                                            Alamat Lengkap & Kode Pos
                                        </label>
                                        <textarea
                                            required
                                            rows={2}
                                            placeholder="Jl. Sukasenang No. 12, RT 02 / RW 05, Kel. Pasirkaliki (Kode Pos 40162)"
                                            value={shippingDetails.address}
                                            onChange={(e) =>
                                                setShippingDetails({
                                                    ...shippingDetails,
                                                    address: e.target.value,
                                                })
                                            }
                                            style={{
                                                width: "100%",
                                                padding: "12px 14px",
                                                borderRadius: "12px",
                                                border: "1px solid #dcd1c6",
                                                backgroundColor: "#faf7f2",
                                                fontSize: "0.92rem",
                                                color: "#1d1816",
                                                outline: "none",
                                                resize: "none",
                                                fontFamily: "var(--font-sans)",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Ekspedisi Minimalis */}
                                <div
                                    style={{
                                        backgroundColor: "#faf7f2",
                                        border: "1.5px solid #a67c52",
                                        borderRadius: "14px",
                                        padding: "14px 16px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: "12px",
                                    }}
                                >
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#1d1816", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            Ekspedisi Reguler ({shippingDetails.city})
                                        </div>
                                        <div style={{ fontSize: "0.78rem", color: "#7a685e", marginTop: "2px" }}>
                                            Estimasi tiba {shippingEstimate}
                                        </div>
                                    </div>
                                    <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "#a67c52", whiteSpace: "nowrap", flexShrink: 0 }}>
                                        Rp {shippingCost.toLocaleString("id-ID")}
                                    </span>
                                </div>

                                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(2)}
                                        style={{
                                            padding: "14px 20px",
                                            borderRadius: "12px",
                                            backgroundColor: "#faf7f2",
                                            color: "#6e5c53",
                                            border: "1px solid #dcd1c6",
                                            fontSize: "0.88rem",
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
                                            padding: "14px",
                                            borderRadius: "12px",
                                            backgroundColor: "#1d1816",
                                            color: "#faf7f2",
                                            fontSize: "0.9rem",
                                            fontWeight: 700,
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            border: "none",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "6px",
                                            boxShadow: "0 6px 20px rgba(29,24,22,0.18)",
                                        }}
                                    >
                                        <span>Lanjut ke Review</span>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ── STEP 4: REVIEW & PEMBAYARAN ── */}
                        {currentStep === 4 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                                <div>
                                    <h2
                                        style={{
                                            fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                                            fontSize: "clamp(1.5rem, 3vw, 1.9rem)",
                                            fontWeight: 500,
                                            color: "#1d1816",
                                            margin: "0 0 6px",
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        Konfirmasi Pesanan
                                    </h2>
                                    <p style={{ fontSize: "0.86rem", color: "#6e5c53", margin: 0, lineHeight: 1.5 }}>
                                        Periksa kembali rincian kado sebelum melanjutkan pembayaran.
                                    </p>
                                </div>

                                <div
                                    style={{
                                        backgroundColor: "#faf7f2",
                                        borderRadius: "16px",
                                        border: "1px solid rgba(205,171,143,0.3)",
                                        padding: "16px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "14px",
                                    }}
                                >
                                    {/* Produk */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase" }}>
                                                Format Kado QR
                                            </div>
                                            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1d1816", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {selectedDigitalObj.title} ({selectedDigitalObj.badge})
                                            </div>
                                        </div>
                                        <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#a67c52", whiteSpace: "nowrap", flexShrink: 0 }}>
                                            Rp {BOX_PRICE.toLocaleString("id-ID")}
                                        </span>
                                    </div>

                                    {/* Alamat */}
                                    <div style={{ borderTop: "1px dashed #dcd1c6", paddingTop: "10px" }}>
                                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase" }}>
                                            Tujuan Pengiriman
                                        </div>
                                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1d1816", marginTop: "2px" }}>
                                            {shippingDetails.recipientName} ({shippingDetails.recipientPhone})
                                        </div>
                                        <div style={{ fontSize: "0.82rem", color: "#59483f", marginTop: "2px" }}>
                                            {shippingDetails.address}, {shippingDetails.city}, {shippingDetails.province}
                                        </div>
                                    </div>

                                    {/* Kurir */}
                                    <div style={{ borderTop: "1px dashed #dcd1c6", paddingTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase" }}>
                                                Ongkos Kirim
                                            </div>
                                            <div style={{ fontSize: "0.82rem", color: "#7a685e" }}>
                                                Estimasi {shippingEstimate}
                                            </div>
                                        </div>
                                        <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1d1816", whiteSpace: "nowrap", flexShrink: 0 }}>
                                            Rp {shippingCost.toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(3)}
                                        style={{
                                            padding: "14px 20px",
                                            borderRadius: "12px",
                                            backgroundColor: "#faf7f2",
                                            color: "#6e5c53",
                                            border: "1px solid #dcd1c6",
                                            fontSize: "0.88rem",
                                            fontWeight: 700,
                                            cursor: "pointer",
                                        }}
                                    >
                                        ← Ubah
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCheckoutPayment}
                                        disabled={isLoading}
                                        style={{
                                            flex: 1,
                                            padding: "14px",
                                            borderRadius: "12px",
                                            backgroundColor: "#1d1816",
                                            color: "#faf7f2",
                                            fontSize: "0.9rem",
                                            fontWeight: 700,
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            border: "none",
                                            cursor: isLoading ? "not-allowed" : "pointer",
                                            boxShadow: "0 6px 20px rgba(29,24,22,0.2)",
                                        }}
                                    >
                                        {isLoading
                                            ? "Menyiapkan Pembayaran..."
                                            : "Bayar Sekarang (QRIS/Bank)"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT ORDER SUMMARY (MINIMALIST BOX) */}
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "20px",
                            border: "1px solid rgba(205,171,143,0.3)",
                            padding: "20px",
                            boxShadow: "0 4px 20px rgba(56,42,36,0.03)",
                        }}
                    >
                        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
                            <div
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    position: "relative",
                                    flexShrink: 0,
                                }}
                            >
                                <Image
                                    src="/assets/unbox_hampers_hero.jpg"
                                    alt="Unbox the Memory"
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                            <div>
                                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#a67c52", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                    Physical Hampers
                                </span>
                                <h4 style={{ fontFamily: "var(--font-display, Cormorant Garamond, serif)", fontSize: "1.2rem", fontWeight: 600, color: "#1d1816", margin: "2px 0 0" }}>
                                    Unbox the Memory
                                </h4>
                                <div style={{ fontSize: "0.78rem", color: "#7a685e" }}>
                                    QR: {selectedDigitalObj.title}
                                </div>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div style={{ borderTop: "1px solid rgba(205,171,143,0.2)", borderBottom: "1px solid rgba(205,171,143,0.2)", padding: "12px 0", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                                <span style={{ color: "#6e5c53", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Gift Box + Cetak QR</span>
                                <span style={{ fontWeight: 700, color: "#1d1816", whiteSpace: "nowrap", flexShrink: 0 }}>Rp {BOX_PRICE.toLocaleString("id-ID")}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                                <span style={{ color: "#6e5c53", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Ongkir ({shippingDetails.city})</span>
                                <span style={{ fontWeight: 700, color: "#1d1816", whiteSpace: "nowrap", flexShrink: 0 }}>Rp {shippingCost.toLocaleString("id-ID")}</span>
                            </div>
                        </div>

                        {/* Total */}
                        <div style={{ padding: "14px 0 0", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
                            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", whiteSpace: "nowrap", flexShrink: 0 }}>
                                Total Tagihan
                            </span>
                            <span style={{ fontFamily: "var(--font-display, Cormorant Garamond, serif)", fontSize: "1.6rem", fontWeight: 700, color: "#1d1816", whiteSpace: "nowrap", flexShrink: 0 }}>
                                Rp {totalAmount.toLocaleString("id-ID")}
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
