"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../../components/Navbar";
import { JABODETABEK_SHIPPING_DATA, getShippingRate } from "@/lib/indonesiaShipping";
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
    kraftPrice: string;
    kraftOldPrice: string;
    kraftNumericPrice: number;
    hardboxPrice: string;
    hardboxOldPrice: string;
    hardboxNumericPrice: number;
}

const BOX_PRICE_MAP: Record<string, { label: string }> = {
    hardbox: { label: "Signature Hardbox" },
    kraft: { label: "Classic Kraft Box" },
};

const DIGITAL_OPTIONS: DigitalOption[] = [
    {
        id: "loves",
        title: "Memoria",
        tagline: "Kisah Sinematik, Musik Latar & Galeri",
        badge: "Signature",
        badgeColor: "#b38742",
        image: "/assets/opening_gate.png",
        demoUrl: "https://anniv.for-you-always.my.id/",
        kraftPrice: "Rp 85.000",
        kraftOldPrice: "Rp 110.000",
        kraftNumericPrice: 85000,
        hardboxPrice: "Rp 150.000",
        hardboxOldPrice: "Rp 200.000",
        hardboxNumericPrice: 150000,
    },
    {
        id: "letter",
        title: "Letter Edition",
        tagline: "Surat Digital Klasik & Typewriter",
        badge: "Best Seller",
        badgeColor: "#a67c52",
        image: "https://cdn.for-you-always.my.id/1783163306081-l92p1h.webp",
        demoUrl: "https://letter.for-you-always.my.id/",
        kraftPrice: "Rp 75.000",
        kraftOldPrice: "Rp 100.000",
        kraftNumericPrice: 75000,
        hardboxPrice: "Rp 135.000",
        hardboxOldPrice: "Rp 180.000",
        hardboxNumericPrice: 135000,
    },
    {
        id: "voices",
        title: "Voices Gift",
        tagline: "Pesan Suara / Voice Note & Foto Kenangan",
        badge: "",
        badgeColor: "#994d5d",
        image: "https://cdn.for-you-always.my.id/1777881039502-bav595.webp",
        demoUrl: "https://voices.for-you-always.my.id/",
        kraftPrice: "Rp 75.000",
        kraftOldPrice: "Rp 100.000",
        kraftNumericPrice: 75000,
        hardboxPrice: "Rp 135.000",
        hardboxOldPrice: "Rp 180.000",
        hardboxNumericPrice: 135000,
    },
];

export default function GiftBoxCheckoutWizardPage() {
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedBoxType, setSelectedBoxType] = useState<"hardbox" | "kraft">("kraft");
    const [stockData, setStockData] = useState<{
        stock: number;
        in_stock: boolean;
        is_low_stock: boolean;
    }>({ stock: 10, in_stock: true, is_low_stock: false });

    // Form States
    const [selectedDigital, setSelectedDigital] = useState("letter");
    const [customerDetails, setCustomerDetails] = useState({
        senderName: "",
        email: "",
        whatsapp: "",
    });
    const [shippingDetails, setShippingDetails] = useState({
        recipientName: "",
        recipientPhone: "",
        address: "",
        province: "",
        city: "",
        district: "",
        village: "",
        postalCode: "",
    });

    // Dynamic Shipping Rate Calculation (Jabodetabek Dedicated)
    const currentProvinceObj = JABODETABEK_SHIPPING_DATA.find((p) => p.name === shippingDetails.province);
    const availableCities = currentProvinceObj ? currentProvinceObj.cities : [];

    // Courier Rates Options from Biteship API / Local Matrix
    interface CourierRateOption {
        courier_name: string;
        courier_code: string;
        service_type: string;
        service_name: string;
        category: "instant" | "sameday" | "nextday" | "regular";
        price: number;
        etd: string;
        description?: string;
    }

    const [courierOptions, setCourierOptions] = useState<CourierRateOption[]>([]);
    const [selectedCourierCode, setSelectedCourierCode] = useState<string>("");
    const [selectedCourier, setSelectedCourier] = useState<CourierRateOption | null>(null);
    const [loadingRates, setLoadingRates] = useState(false);

    // District & Village (Kelurahan / Desa) Options
    interface AreaOption {
        name: string;
        id: string;
        postal_code?: string;
    }
    const [availableDistricts, setAvailableDistricts] = useState<AreaOption[]>([]);
    const [loadingDistricts, setLoadingDistricts] = useState(false);

    const [availableVillages, setAvailableVillages] = useState<AreaOption[]>([]);
    const [loadingVillages, setLoadingVillages] = useState(false);

    const shippingCost = selectedCourier ? selectedCourier.price : 0;
    const shippingEstimate = selectedCourier ? selectedCourier.etd : "-";
    const shippingCourierTitle = selectedCourier
        ? `${selectedCourier.service_name}`
        : "Belum dipilih";

    const selectedDigitalObj =
        DIGITAL_OPTIONS.find((d) => d.id === selectedDigital) || DIGITAL_OPTIONS[0];
    const boxMeta = BOX_PRICE_MAP[selectedBoxType] ?? BOX_PRICE_MAP["hardbox"];
    const isKraft = selectedBoxType === "kraft";
    const currentBoxPrice = isKraft ? selectedDigitalObj.kraftNumericPrice : selectedDigitalObj.hardboxNumericPrice;
    const totalAmount = currentBoxPrice + shippingCost;

    // Fetch dynamic districts whenever city changes
    useEffect(() => {
        if (!shippingDetails.city) {
            setAvailableDistricts([]);
            setAvailableVillages([]);
            return;
        }

        let isMounted = true;
        setLoadingDistricts(true);

        fetch(`/api/shipping/areas?city=${encodeURIComponent(shippingDetails.city)}&province=${encodeURIComponent(shippingDetails.province)}`)
            .then((res) => res.json())
            .then((data) => {
                if (isMounted && data && Array.isArray(data.districts)) {
                    setAvailableDistricts(data.districts);
                }
            })
            .catch((err) => {
                console.error("Failed to load districts:", err);
            })
            .finally(() => {
                if (isMounted) setLoadingDistricts(false);
            });

        return () => {
            isMounted = false;
        };
    }, [shippingDetails.city, shippingDetails.province]);

    // Fetch dynamic courier rates whenever address changes
    useEffect(() => {
        if (!shippingDetails.province || !shippingDetails.city) {
            setCourierOptions([]);
            setSelectedCourier(null);
            setSelectedCourierCode("");
            return;
        }

        let isMounted = true;
        setLoadingRates(true);

        fetch("/api/shipping/rates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                destination_postal_code: shippingDetails.postalCode,
                destination_province: shippingDetails.province,
                destination_city: shippingDetails.city,
                items_value: currentBoxPrice,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (isMounted && data && Array.isArray(data.options)) {
                    setCourierOptions(data.options);
                    const found =
                        data.options.find(
                            (o: CourierRateOption) =>
                                `${o.courier_code}_${o.service_type}` === selectedCourierCode
                        ) ||
                        data.options.find((o: CourierRateOption) => o.category === "regular") ||
                        data.options[0];
                    if (found) {
                        setSelectedCourier(found);
                        setSelectedCourierCode(`${found.courier_code}_${found.service_type}`);
                    }
                }
            })
            .catch((err) => {
                console.error("Failed to fetch rates:", err);
            })
            .finally(() => {
                if (isMounted) setLoadingRates(false);
            });

        return () => {
            isMounted = false;
        };
    }, [shippingDetails.province, shippingDetails.city, shippingDetails.postalCode, currentBoxPrice]);

    useEffect(() => {
        // Baca boxType dan digital dari URL query param
        const params = new URLSearchParams(window.location.search);
        const bt = params.get("boxType") === "hardbox" ? "hardbox" : "kraft";
        const dig = params.get("digital");
        if (dig && DIGITAL_OPTIONS.some((d) => d.id === dig)) {
            setSelectedDigital(dig);
        }
        setSelectedBoxType(bt);

        trackInitiateCheckout(
            [
                {
                    id: `unbox_${dig || "letter"}`,
                    title: `The Gift Box (${selectedDigitalObj.title})`,
                    numericPrice: totalAmount,
                },
            ],
            totalAmount
        );
    }, []);

    useEffect(() => {
        const stockProductId = selectedBoxType === "kraft" ? "the-gift-box-kraft" : "the-gift-box";
        fetch(`/api/inventory?product_id=${stockProductId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data && typeof data.stock === "number") {
                    setStockData({
                        stock: data.stock,
                        in_stock: data.in_stock,
                        is_low_stock: data.is_low_stock,
                    });
                }
            })
            .catch(() => {});
    }, [selectedBoxType]);

    const handleProvinceChange = (newProv: string) => {
        setShippingDetails((prev) => ({
            ...prev,
            province: newProv,
            city: "",
            district: "",
            village: "",
            postalCode: "",
        }));
        setSelectedCourier(null);
        setSelectedCourierCode("");
        setCourierOptions([]);
        setAvailableDistricts([]);
        setAvailableVillages([]);
    };

    const handleCityChange = (newCity: string) => {
        setShippingDetails((prev) => ({
            ...prev,
            city: newCity,
            district: "",
            village: "",
            postalCode: "",
        }));
        setSelectedCourier(null);
        setSelectedCourierCode("");
        setCourierOptions([]);
        setAvailableVillages([]);
    };

    const handleDistrictChange = (districtName: string) => {
        const found = availableDistricts.find((d) => d.name === districtName);
        setShippingDetails((prev) => ({
            ...prev,
            district: districtName,
            village: "",
        }));
        setAvailableVillages([]);

        // Load Villages for this district
        if (found && found.id) {
            setLoadingVillages(true);
            fetch(`/api/shipping/areas?district_id=${found.id}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data && Array.isArray(data.villages)) {
                        setAvailableVillages(data.villages);
                    }
                })
                .catch(() => {})
                .finally(() => setLoadingVillages(false));
        }

        // Auto-fetch Postal Code for district if available
        if (districtName && shippingDetails.city) {
            fetch(
                `/api/shipping/areas?city=${encodeURIComponent(shippingDetails.city)}&district=${encodeURIComponent(
                    districtName
                )}`
            )
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.postal_code) {
                        setShippingDetails((prev) => ({
                            ...prev,
                            postalCode: String(data.postal_code),
                        }));
                    }
                })
                .catch(() => {});
        }
    };

    const handleVillageChange = (villageName: string) => {
        setShippingDetails((prev) => ({
            ...prev,
            village: villageName,
        }));

        // Auto-fetch Postal Code for village
        if (villageName && shippingDetails.district && shippingDetails.city) {
            fetch(
                `/api/shipping/areas?city=${encodeURIComponent(shippingDetails.city)}&district=${encodeURIComponent(
                    shippingDetails.district
                )}&village=${encodeURIComponent(villageName)}`
            )
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.postal_code) {
                        setShippingDetails((prev) => ({
                            ...prev,
                            postalCode: String(data.postal_code),
                        }));
                    }
                })
                .catch(() => {});
        }
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
        if (!shippingDetails.province) {
            alert("Silakan pilih Provinsi tujuan pengiriman.");
            return;
        }
        if (!shippingDetails.city) {
            alert("Silakan pilih Kota / Kabupaten tujuan pengiriman.");
            return;
        }
        if (!shippingDetails.district) {
            alert("Silakan pilih Kecamatan tujuan pengiriman.");
            return;
        }
        if (!selectedCourier) {
            alert("Silakan pilih salah satu layanan kurir pengiriman.");
            return;
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
        setCurrentStep(4);
    };

    const handleCheckoutPayment = async () => {
        setIsLoading(true);
        try {
            // Pre-check stock availability
            try {
                const stockProductId = selectedBoxType === "kraft" ? "the-gift-box-kraft" : "the-gift-box";
                const checkRes = await fetch(`/api/inventory?product_id=${stockProductId}`);
                const checkData = await checkRes.json();
                if (checkData && typeof checkData.stock === "number" && checkData.stock <= 0) {
                    alert("Mohon maaf, slot gift box fisik untuk batch ini baru saja habis. Silakan hubungi admin kami untuk pre-order batch berikutnya.");
                    setIsLoading(false);
                    return;
                }
            } catch (e) {
                console.warn("Stock pre-check bypassed:", e);
            }

            const orderId = `ORDER-UNBOX-${Date.now()}`;
            const gatewayUrl = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_URL || "https://pakasir-gateway.aldoramadhan16.workers.dev";
            const res = await fetch(
                `${gatewayUrl}/api/checkout`,
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
                            village: shippingDetails.village,
                            district: shippingDetails.district,
                            city: shippingDetails.city,
                            province: shippingDetails.province,
                            postal_code: shippingDetails.postalCode,
                            zone: shippingDetails.province,
                            courier: shippingCourierTitle,
                            shipping_cost: shippingCost,
                            shipping_estimate: shippingEstimate,
                        },
                        item_details: [
                            {
                                id: `unbox-box-${selectedBoxType}`,
                                price: currentBoxPrice,
                                quantity: 1,
                                name: `${boxMeta.label} + ${selectedDigitalObj.title} (The Gift Box)`,
                            },
                            {
                                id: `shipping-rate`,
                                price: shippingCost,
                                quantity: 1,
                                name: `${shippingCourierTitle} (${shippingDetails.city})`,
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
                        content_name: `The Gift Box - ${selectedDigitalObj.title}`,
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
                        href="/catalog/the-gift-box"
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
                                        Pilih Kemasan Box Fisik
                                    </h2>
                                    <p style={{ fontSize: "0.86rem", color: "#6e5c53", margin: "0 0 12px", lineHeight: 1.5 }}>
                                        Pilih tipe box kemasan hampers fisik yang ingin kamu kirimkan.
                                    </p>

                                    {/* Dual Box Selector */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                                        <div
                                            onClick={() => setSelectedBoxType("kraft")}
                                            style={{
                                                padding: "12px 14px",
                                                borderRadius: "14px",
                                                border: selectedBoxType === "kraft" ? "2px solid #382a24" : "1px solid #e8ded6",
                                                backgroundColor: selectedBoxType === "kraft" ? "rgba(56,42,36,0.04)" : "#ffffff",
                                                cursor: "pointer",
                                                transition: "all 0.2s ease",
                                            }}
                                        >
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 4 }}>
                                                <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1d1816" }}>Classic Kraft</span>
                                                <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#2e7d32", backgroundColor: "#e8f5e9", padding: "2px 6px", borderRadius: "999px" }}>Rp 75.000</span>
                                            </div>
                                            <div style={{ fontSize: "0.75rem", color: "#7a685e", marginTop: "3px" }}>Kotak kraft hemat (All-in)</div>
                                        </div>

                                        <div
                                            onClick={() => setSelectedBoxType("hardbox")}
                                            style={{
                                                padding: "12px 14px",
                                                borderRadius: "14px",
                                                border: selectedBoxType === "hardbox" ? "2px solid #382a24" : "1px solid #e8ded6",
                                                backgroundColor: selectedBoxType === "hardbox" ? "rgba(56,42,36,0.04)" : "#ffffff",
                                                cursor: "pointer",
                                                transition: "all 0.2s ease",
                                            }}
                                        >
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 4 }}>
                                                <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1d1816" }}>Signature Hardbox</span>
                                                <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#a67c52", backgroundColor: "rgba(166,124,82,0.12)", padding: "2px 6px", borderRadius: "999px" }}>Signature</span>
                                            </div>
                                            <div style={{ fontSize: "0.75rem", color: "#7a685e", marginTop: "3px" }}>Hardbox rigid pita satin</div>
                                        </div>
                                    </div>

                                    <h3
                                        style={{
                                            fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                                            fontSize: "1.3rem",
                                            fontWeight: 600,
                                            color: "#1d1816",
                                            margin: "12px 0 4px",
                                        }}
                                    >
                                        Pilih Format Kado di Kartu QR
                                    </h3>
                                    <p style={{ fontSize: "0.84rem", color: "#6e5c53", margin: "0 0 12px", lineHeight: 1.4 }}>
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
                                                        {opt.badge ? (
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
                                                        ) : null}
                                                        {selectedBoxType === "kraft" ? (
                                                            <span
                                                                style={{
                                                                    fontSize: "0.78rem",
                                                                    fontWeight: 700,
                                                                    color: "#2e7d32",
                                                                    backgroundColor: "#e8f5e9",
                                                                    padding: "2px 8px",
                                                                    borderRadius: "999px",
                                                                }}
                                                            >
                                                                {opt.kraftPrice}
                                                            </span>
                                                        ) : (
                                                            <span
                                                                style={{
                                                                    fontSize: "0.82rem",
                                                                    fontWeight: 700,
                                                                    color: "#1d1816",
                                                                    backgroundColor: "rgba(205,171,143,0.18)",
                                                                    padding: "2px 8px",
                                                                    borderRadius: "999px",
                                                                }}
                                                            >
                                                                {opt.hardboxPrice}
                                                            </span>
                                                        )}
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
                                        Data Pemesan (Kamu / Pembeli)
                                    </h2>
                                    <p style={{ fontSize: "0.86rem", color: "#6e5c53", margin: 0, lineHeight: 1.5 }}>
                                        Data kamu sebagai pembuat & pembeli kado. Link akses studio kado <strong style={{ fontWeight: 700, color: "#1d1816" }}>{selectedDigitalObj.title}</strong> akan dikirimkan otomatis ke Email & WhatsApp kamu (bukan ke penerima kado).
                                    </p>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>
                                            Nama Lengkap Pemesan (Kamu / Pembeli)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Contoh: Nadya Safira"
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
                                                Email Pemesan (Akses Studio)
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
                                                No. WhatsApp Pemesan (Kamu)
                                            </label>
                                            <input
                                                required
                                                type="tel"
                                                placeholder="08123456789"
                                                value={customerDetails.whatsapp}
                                                onChange={(e) =>
                                                    setCustomerDetails({
                                                        ...customerDetails,
                                                        whatsapp: e.target.value.replace(/\D/g, ""),
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
                                        Box kado dikemas aman dengan kardus tebal dan <strong style={{ fontWeight: 700, color: "#1d1816" }}>bubble wrap</strong> ekstra.
                                    </p>
                                </div>

                                {/* JABODETABEK NOTICE (CLEAN LUXURY DESIGN - NO EMOJIS) */}
                                <div
                                    style={{
                                        padding: "12px 16px",
                                        borderRadius: "14px",
                                        backgroundColor: "rgba(166,124,82,0.06)",
                                        border: "1px solid rgba(166,124,82,0.22)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            borderRadius: "50%",
                                            backgroundColor: "#382a24",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#faf7f2"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                    </div>
                                    <p style={{ margin: 0, fontSize: "0.82rem", color: "#6e5c53", lineHeight: 1.45 }}>
                                        <strong style={{ color: "#1d1816", fontWeight: 700 }}>Khusus Pengiriman Wilayah Jabodetabek:</strong> Melayani pengiriman ke Jakarta, Bogor, Depok, Tangerang, dan Bekasi.
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
                                                required
                                                value={shippingDetails.province}
                                                onChange={(e) => handleProvinceChange(e.target.value)}
                                                style={{
                                                    width: "100%",
                                                    padding: "12px 10px",
                                                    borderRadius: "12px",
                                                    border: "1px solid #dcd1c6",
                                                    backgroundColor: "#faf7f2",
                                                    fontSize: "0.88rem",
                                                    fontWeight: 600,
                                                    color: "#1d1816",
                                                    outline: "none",
                                                    cursor: "pointer",
                                                    boxSizing: "border-box",
                                                }}
                                            >
                                                <option value="">Pilih Provinsi</option>
                                                {JABODETABEK_SHIPPING_DATA.map((p) => (
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
                                                required
                                                disabled={!shippingDetails.province}
                                                value={shippingDetails.city}
                                                onChange={(e) => handleCityChange(e.target.value)}
                                                style={{
                                                    width: "100%",
                                                    padding: "12px 10px",
                                                    borderRadius: "12px",
                                                    border: "1px solid #dcd1c6",
                                                    backgroundColor: shippingDetails.province ? "#faf7f2" : "#f0ece7",
                                                    fontSize: "0.88rem",
                                                    fontWeight: 600,
                                                    color: "#1d1816",
                                                    outline: "none",
                                                    cursor: shippingDetails.province ? "pointer" : "not-allowed",
                                                    boxSizing: "border-box",
                                                }}
                                            >
                                                <option value="">
                                                    {shippingDetails.province ? "Pilih Kota / Kab." : "Pilih Provinsi Dulu"}
                                                </option>
                                                {availableCities.map((c) => (
                                                    <option key={c.name} value={c.name}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Kecamatan & Kelurahan / Desa */}
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                                        <div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "5px" }}>
                                                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                                    Kecamatan
                                                </label>
                                                {loadingDistricts && (
                                                    <span style={{ fontSize: "0.68rem", color: "#a67c52", fontStyle: "italic" }}>
                                                        Memuat...
                                                    </span>
                                                )}
                                            </div>
                                            {availableDistricts.length > 0 ? (
                                                <select
                                                    required
                                                    value={shippingDetails.district}
                                                    onChange={(e) => handleDistrictChange(e.target.value)}
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px 10px",
                                                        borderRadius: "12px",
                                                        border: "1px solid #dcd1c6",
                                                        backgroundColor: "#faf7f2",
                                                        fontSize: "0.88rem",
                                                        fontWeight: 600,
                                                        color: "#1d1816",
                                                        outline: "none",
                                                        cursor: "pointer",
                                                        boxSizing: "border-box",
                                                    }}
                                                >
                                                    <option value="">Pilih Kecamatan</option>
                                                    {availableDistricts.map((d) => (
                                                        <option key={d.name} value={d.name}>
                                                            {d.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    required
                                                    disabled={!shippingDetails.city}
                                                    placeholder={
                                                        !shippingDetails.city
                                                            ? "Pilih Kota Dulu"
                                                            : loadingDistricts
                                                            ? "Memuat..."
                                                            : "Ketik nama kecamatan"
                                                    }
                                                    value={shippingDetails.district}
                                                    onChange={(e) =>
                                                        setShippingDetails({
                                                            ...shippingDetails,
                                                            district: e.target.value,
                                                        })
                                                    }
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px 10px",
                                                        borderRadius: "12px",
                                                        border: "1px solid #dcd1c6",
                                                        backgroundColor: shippingDetails.city ? "#faf7f2" : "#f0ece7",
                                                        fontSize: "0.88rem",
                                                        color: "#1d1816",
                                                        outline: "none",
                                                        boxSizing: "border-box",
                                                        cursor: shippingDetails.city ? "text" : "not-allowed",
                                                    }}
                                                />
                                            )}
                                        </div>

                                        <div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "5px" }}>
                                                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                                    Kelurahan / Desa
                                                </label>
                                                {loadingVillages && (
                                                    <span style={{ fontSize: "0.68rem", color: "#a67c52", fontStyle: "italic" }}>
                                                        Memuat...
                                                    </span>
                                                )}
                                            </div>
                                            {availableVillages.length > 0 ? (
                                                <select
                                                    value={shippingDetails.village}
                                                    onChange={(e) => handleVillageChange(e.target.value)}
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px 10px",
                                                        borderRadius: "12px",
                                                        border: "1px solid #dcd1c6",
                                                        backgroundColor: "#faf7f2",
                                                        fontSize: "0.88rem",
                                                        fontWeight: 600,
                                                        color: "#1d1816",
                                                        outline: "none",
                                                        cursor: "pointer",
                                                        boxSizing: "border-box",
                                                    }}
                                                >
                                                    <option value="">Pilih Kelurahan</option>
                                                    {availableVillages.map((v) => (
                                                        <option key={v.name} value={v.name}>
                                                            {v.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    disabled={!shippingDetails.district}
                                                    placeholder={
                                                        !shippingDetails.district
                                                            ? "Pilih Kecamatan Dulu"
                                                            : loadingVillages
                                                            ? "Memuat..."
                                                            : "Nama desa (opsional)"
                                                    }
                                                    value={shippingDetails.village}
                                                    onChange={(e) =>
                                                        setShippingDetails({
                                                            ...shippingDetails,
                                                            village: e.target.value,
                                                        })
                                                    }
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px 10px",
                                                        borderRadius: "12px",
                                                        border: "1px solid #dcd1c6",
                                                        backgroundColor: shippingDetails.district ? "#faf7f2" : "#f0ece7",
                                                        fontSize: "0.88rem",
                                                        color: "#1d1816",
                                                        outline: "none",
                                                        boxSizing: "border-box",
                                                        cursor: shippingDetails.district ? "text" : "not-allowed",
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Kode Pos */}
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>
                                            Kode Pos
                                        </label>
                                        <input
                                            type="text"
                                            maxLength={5}
                                            placeholder="Contoh: 12190"
                                            value={shippingDetails.postalCode}
                                            onChange={(e) =>
                                                setShippingDetails({
                                                    ...shippingDetails,
                                                    postalCode: e.target.value.replace(/\D/g, ""),
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

                                    {/* Alamat Lengkap */}
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>
                                            Alamat Lengkap & Patokan
                                        </label>
                                        <textarea
                                            required
                                            rows={2}
                                            placeholder="Nama jalan, nomor rumah, RT/RW, dan patokan dekat lokasi..."
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

                                {/* Pilihan Layanan Kurir (Biteship & SameDay) */}
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                                        <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                            Pilihan Layanan Pengiriman
                                        </label>
                                        {loadingRates && (
                                            <span style={{ fontSize: "0.72rem", color: "#a67c52", fontStyle: "italic" }}>
                                                Menghitung tarif...
                                            </span>
                                        )}
                                    </div>

                                    {!shippingDetails.province || !shippingDetails.city ? (
                                        <div
                                            style={{
                                                backgroundColor: "#faf7f2",
                                                border: "1px dashed #dcd1c6",
                                                borderRadius: "14px",
                                                padding: "22px 18px",
                                                textAlign: "center",
                                                color: "#8a7b73",
                                                fontSize: "0.86rem",
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            Pilih <strong>Provinsi</strong> dan <strong>Kota / Kabupaten</strong> di atas untuk memuat pilihan kurir & tarif ongkir.
                                        </div>
                                    ) : loadingRates ? (
                                        <div
                                            style={{
                                                backgroundColor: "#faf7f2",
                                                border: "1px solid #dcd1c6",
                                                borderRadius: "14px",
                                                padding: "22px 18px",
                                                textAlign: "center",
                                                color: "#a67c52",
                                                fontSize: "0.86rem",
                                            }}
                                        >
                                            Sedang mengambil tarif kurir pengiriman...
                                        </div>
                                    ) : courierOptions.length === 0 ? (
                                        <div
                                            style={{
                                                backgroundColor: "#faf7f2",
                                                border: "1px dashed #dcd1c6",
                                                borderRadius: "14px",
                                                padding: "22px 18px",
                                                textAlign: "center",
                                                color: "#8a7b73",
                                                fontSize: "0.86rem",
                                            }}
                                        >
                                            Tidak ada layanan kurir yang tersedia untuk area ini.
                                        </div>
                                    ) : (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                            {courierOptions.map((opt) => {
                                                const isSelected = selectedCourierCode === `${opt.courier_code}_${opt.service_type}`;
                                                const badgeBg =
                                                    opt.category === "instant"
                                                        ? "#fbe9e7"
                                                        : opt.category === "sameday"
                                                        ? "#e8f5e9"
                                                        : opt.category === "nextday"
                                                        ? "#e3f2fd"
                                                        : "#f5eee6";
                                                const badgeColor =
                                                    opt.category === "instant"
                                                        ? "#d84315"
                                                        : opt.category === "sameday"
                                                        ? "#2e7d32"
                                                        : opt.category === "nextday"
                                                        ? "#1565c0"
                                                        : "#8d6e63";
                                                const badgeText =
                                                    opt.category === "instant"
                                                        ? "Instant (1-2 Jam)"
                                                        : opt.category === "sameday"
                                                        ? "Same Day"
                                                        : opt.category === "nextday"
                                                        ? "Next Day (1 Hari)"
                                                        : "Reguler";

                                                return (
                                                    <div
                                                        key={`${opt.courier_code}_${opt.service_type}`}
                                                        onClick={() => {
                                                            setSelectedCourier(opt);
                                                            setSelectedCourierCode(`${opt.courier_code}_${opt.service_type}`);
                                                        }}
                                                        style={{
                                                            backgroundColor: isSelected ? "#ffffff" : "#faf7f2",
                                                            border: isSelected ? "1.5px solid #a67c52" : "1px solid #dcd1c6",
                                                            borderRadius: "14px",
                                                            padding: "12px 14px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "space-between",
                                                            gap: "12px",
                                                            cursor: "pointer",
                                                            boxShadow: isSelected ? "0 4px 14px rgba(166,124,82,0.12)" : "none",
                                                            transition: "all 0.2s ease",
                                                        }}
                                                    >
                                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                                                            <div
                                                                style={{
                                                                    width: 16,
                                                                    height: 16,
                                                                    borderRadius: "50%",
                                                                    border: isSelected ? "5px solid #a67c52" : "1.5px solid #a6968c",
                                                                    backgroundColor: "#ffffff",
                                                                    flexShrink: 0,
                                                                }}
                                                            />
                                                            <div style={{ minWidth: 0 }}>
                                                                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                                                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1d1816" }}>
                                                                        {opt.service_name || opt.courier_name}
                                                                    </span>
                                                                    <span
                                                                        style={{
                                                                            fontSize: "0.68rem",
                                                                            fontWeight: 700,
                                                                            padding: "1px 6px",
                                                                            borderRadius: "4px",
                                                                            backgroundColor: badgeBg,
                                                                            color: badgeColor,
                                                                        }}
                                                                    >
                                                                        {badgeText}
                                                                    </span>
                                                                </div>
                                                                <div style={{ fontSize: "0.75rem", color: "#7a685e", marginTop: "2px" }}>
                                                                    Estimasi: {opt.etd}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#a67c52", flexShrink: 0 }}>
                                                            Rp {opt.price.toLocaleString("id-ID")}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
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
                                                Pilihan Box &amp; Format QR
                                            </div>
                                            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1d1816", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {boxMeta.label} • {selectedDigitalObj.title}
                                            </div>
                                        </div>
                                        <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#a67c52", whiteSpace: "nowrap", flexShrink: 0 }}>
                                            Rp {currentBoxPrice.toLocaleString("id-ID")}
                                        </span>
                                    </div>

                                    {/* Pemesan & Email */}
                                    <div style={{ borderTop: "1px dashed #dcd1c6", paddingTop: "10px" }}>
                                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase" }}>
                                            Pemesan (Akses Studio Kado)
                                        </div>
                                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1d1816", marginTop: "2px" }}>
                                            {customerDetails.senderName} <span style={{ fontWeight: 400, color: "#7a685e" }}>({customerDetails.whatsapp ? `${customerDetails.whatsapp} • ` : ""}{customerDetails.email})</span>
                                        </div>
                                    </div>

                                    {/* Alamat */}
                                    <div style={{ borderTop: "1px dashed #dcd1c6", paddingTop: "10px" }}>
                                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase" }}>
                                            Tujuan Pengiriman
                                        </div>
                                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1d1816", marginTop: "2px" }}>
                                            {shippingDetails.recipientName} ({shippingDetails.recipientPhone})
                                        </div>
                                        <div style={{ fontSize: "0.82rem", color: "#59483f", marginTop: "2px", lineHeight: 1.4 }}>
                                            {shippingDetails.address}
                                            {shippingDetails.village ? `, ${shippingDetails.village}` : ""}
                                            {shippingDetails.district ? `, Kec. ${shippingDetails.district}` : ""}
                                            {shippingDetails.city ? `, ${shippingDetails.city}` : ""}
                                            {shippingDetails.province ? `, ${shippingDetails.province}` : ""}
                                            {shippingDetails.postalCode ? ` (${shippingDetails.postalCode})` : ""}
                                        </div>
                                    </div>

                                    {/* Kurir */}
                                    <div style={{ borderTop: "1px dashed #dcd1c6", paddingTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#7a685e", textTransform: "uppercase" }}>
                                                Layanan Pengiriman
                                            </div>
                                            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1d1816", marginTop: "2px" }}>
                                                {shippingCourierTitle}
                                            </div>
                                            <div style={{ fontSize: "0.8rem", color: "#7a685e" }}>
                                                Estimasi {shippingEstimate}
                                            </div>
                                        </div>
                                        <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#a67c52", whiteSpace: "nowrap", flexShrink: 0 }}>
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
                                    src="https://cdn.for-you-always.my.id/1786911997774-xrhcf4.jpg"
                                    alt="The Gift Box"
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                            <div>
                                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#a67c52", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                    {boxMeta.label}
                                </span>
                                <h4 style={{ fontFamily: "var(--font-display, Cormorant Garamond, serif)", fontSize: "1.2rem", fontWeight: 600, color: "#1d1816", margin: "2px 0 0" }}>
                                    The Gift Box
                                </h4>
                                <div style={{ fontSize: "0.78rem", color: "#7a685e" }}>
                                    QR: {selectedDigitalObj.title}
                                </div>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div style={{ borderTop: "1px solid rgba(205,171,143,0.2)", borderBottom: "1px solid rgba(205,171,143,0.2)", padding: "12px 0", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                                <span style={{ color: "#6e5c53", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {isKraft ? "Classic Kraft Box (All-in)" : "Signature Hardbox + QR"}
                                </span>
                                <span style={{ fontWeight: 700, color: "#1d1816", whiteSpace: "nowrap", flexShrink: 0 }}>Rp {currentBoxPrice.toLocaleString("id-ID")}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                                <span style={{ color: "#6e5c53", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {selectedCourier ? `Ongkir (${shippingDetails.city})` : "Ongkos Kirim"}
                                </span>
                                <span style={{ fontWeight: 700, color: selectedCourier ? "#1d1816" : "#a6968c", whiteSpace: "nowrap", flexShrink: 0 }}>
                                    {selectedCourier ? `Rp ${shippingCost.toLocaleString("id-ID")}` : "Dihitung di alamat"}
                                </span>
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
