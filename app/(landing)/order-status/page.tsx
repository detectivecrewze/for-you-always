"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Link from "next/link";

// ── Product metadata (mirrors gateway) ───────────────────────────────────
const PRODUCT_META: Record<string, { name: string; icon: React.ReactNode; color: string; desc: string }> = {
    letter:     { name: "Letter Edition",      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>, color: "#b5806a", desc: "Surat digital interaktif dengan amplop" },
    voices:     { name: "Voices Gift",         icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/><line x1="8" x2="16" y1="22" y2="22"/></svg>, color: "#7a6a9a", desc: "Rekaman suara & galeri foto" },
    arcade:     { name: "Arcade Edition",      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>, color: "#4a7a6a", desc: "Game interaktif berbasis kenangan" },
    retro:      { name: "Retro Edition",       icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M10 8v4l3-2-3-2Z"/><line x1="12" x2="12" y1="17" y2="21"/><line x1="8" x2="16" y1="21" y2="21"/></svg>, color: "#6a5a9a", desc: "Kado nostalgia bertema Windows 98" },
    wrapped:    { name: "Wrapped Edition",     icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect width="20" height="5" x="2" y="7"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>, color: "#9a6a7a", desc: "Recap interaktif ala Spotify Wrapped" },
    mixtape:    { name: "Mixtape Edition",     icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>, color: "#6a8a9a", desc: "Kaset retro dengan playlist personal" },
    invitation: { name: "Invitation Edition",  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>, color: "#9a8a6a", desc: "Tiket undangan kencan digital" },
    loves:      { name: "Memoria Edition",     icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>, color: "#8b2252", desc: "Kado premium penuh kenangan" },
    birthday:   { name: "Birthday Scrapbook",  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v2"/><path d="M12 8v2"/><path d="M17 8v2"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg>, color: "#e88c8c", desc: "Scrapbook ulang tahun interaktif" },
};


type MagicLinks = string | Record<string, string>;

function parseMagicLinks(raw: string): MagicLinks {
    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") return parsed;
    } catch (_) { /* not JSON */ }
    return raw;
}

// Single product card shown in the paid state
function ProductCard({ productKey, link }: { productKey: string; link: string }) {
    const isThreeSlot = productKey.endsWith("_3slot");
    const isUnbox = productKey.startsWith("unbox_") || productKey.startsWith("giftbox_");
    const baseKey = productKey.replace("unbox_", "").replace("giftbox_", "").replace("_3slot", "");
    const baseMeta = PRODUCT_META[baseKey] || { name: baseKey, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect width="20" height="5" x="2" y="7"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>, color: "#a88365", desc: "Kado digital" };
    
    const meta = {
        ...baseMeta,
        name: isUnbox ? `${baseMeta.name} (The Gift Box)` : isThreeSlot ? `${baseMeta.name} (3 Gift)` : baseMeta.name,
    };

    let token = "";
    if (link) {
        if (link.includes("token=")) {
            token = link.split("token=")[1]?.split("&")[0] || "";
        } else if (link.includes("/bundle/")) {
            token = link.split("/bundle/")[1]?.split("?")[0] || "";
        } else if (link.includes("/dashboard/")) {
            token = link.split("/dashboard/")[1]?.split("?")[0] || "";
        }
    }

    const isLoves = baseKey === "loves";
    const isBirthday = baseKey === "birthday";
    const label = isLoves ? "Isi Form Kreasi" : isBirthday ? "Buka Studio Birthday" : isThreeSlot ? "Buka Dashboard (3 Kuota)" : "Buka Studio";
    const [hovered, setHovered] = useState(false);
    const [copied, setCopied] = useState(false);

    return (
        <div style={{
            border: "1.5px solid rgba(205,171,143,0.25)",
            borderRadius: 16,
            padding: "20px 24px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 18,
            transition: "box-shadow 0.25s, transform 0.25s",
            boxShadow: hovered ? "0 8px 32px -8px rgba(56,42,36,0.12)" : "0 2px 12px -4px rgba(56,42,36,0.06)",
            transform: hovered ? "translateY(-2px)" : "none",
        }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Icon */}
            <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: `${meta.color}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, flexShrink: 0,
            }}>
                {meta.icon}
            </div>

            {/* Text */}
            <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                <p style={{ margin: "0 0 2px", fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: "#382a24" }}>
                    {meta.name}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "#9a8a80", fontFamily: "var(--font-sans)" }}>
                    {meta.desc}
                </p>
                {token && (
                    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700, padding: "3px 8px", background: "rgba(56,42,36,0.06)", borderRadius: 6, color: "#382a24", letterSpacing: "0.05em" }}>
                            Token: {token}
                        </span>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(token);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}
                            style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6, border: "1px solid rgba(56,42,36,0.15)", background: "#fff", cursor: "pointer", color: "#5a483e" }}
                        >
                            {copied ? "✓ Tersalin" : "Salin"}
                        </button>
                    </div>
                )}
            </div>

            {/* CTA */}
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                role="button"
                aria-label={`Buka ${meta.name}`}
                style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "10px 18px", borderRadius: 999,
                    background: meta.color, color: "#fff",
                    fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
                    textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
                    transition: "opacity 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
                {label}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
            </a>
        </div>
    );
}

export default function OrderStatusPage() {
    const [status, setStatus] = useState<"loading" | "paid" | "pending" | "error" | "search">("loading");
    const [orderId, setOrderId] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState("");
    const [magicLinks, setMagicLinks] = useState<MagicLinks | null>(null);
    const [productId, setProductId] = useState<string>("");
    const [fulfillmentStatus, setFulfillmentStatus] = useState<string | null>(null);
    const [customizationStatus, setCustomizationStatus] = useState<string | null>(null);
    const [trackingNumber, setTrackingNumber] = useState<string | null>(null);
    const [courier, setCourier] = useState<string | null>(null);
    const [copiedResi, setCopiedResi] = useState(false);
    const [liveTracking, setLiveTracking] = useState<{
        loading: boolean;
        data: any;
        error: string | null;
        showHistory: boolean;
    } | null>(null);

    const handleFetchLiveTracking = async (waybill: string, courierName: string) => {
        if (liveTracking?.data) {
            setLiveTracking(prev => prev ? { ...prev, showHistory: !prev.showHistory } : null);
            return;
        }
        setLiveTracking({ loading: true, data: null, error: null, showHistory: true });
        try {
            const res = await fetch(`/api/shipping/track?waybill_id=${encodeURIComponent(waybill)}&courier=${encodeURIComponent(courierName)}`);
            const result = await res.json();
            if (res.ok && result.success) {
                setLiveTracking({ loading: false, data: result, error: null, showHistory: true });
            } else {
                setLiveTracking({ loading: false, data: null, error: result.message || "Gagal memuat status live.", showHistory: true });
            }
        } catch {
            setLiveTracking({ loading: false, data: null, error: "Gagal terhubung ke layanan pelacakan.", showHistory: true });
        }
    };

    const fetchOrder = async (id: string) => {
        setStatus("loading");
        setOrderId(id);
        try {
            const gatewayUrl = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_URL || "https://pakasir-gateway-sandbox.aldoramadhan16.workers.dev";
            const res = await fetch(`${gatewayUrl}/api/status?order_id=${id}`);
            const data = await res.json();

            if (!res.ok || data.error) {
                setStatus("error");
                return;
            }

            if (data.status === "paid" || data.status === "success") {
                setStatus("paid");
                if (data.magic_link) {
                    let linksData = data.magic_link;
                    if (typeof linksData === "string") {
                        try {
                            const parsed = JSON.parse(linksData);
                            if (parsed && typeof parsed === "object") {
                                linksData = parsed;
                            }
                        } catch (_) {}
                    }

                    if (typeof linksData === "object" && linksData !== null) {
                        setMagicLinks(linksData);
                    } else {
                        setMagicLinks(data.product_id
                            ? { [data.product_id]: linksData as string }
                            : linksData as string
                        );
                    }
                }
                if (data.product_id) setProductId(data.product_id);
                setFulfillmentStatus(data.fulfillment_status || null);
                setCustomizationStatus(data.customization_status || null);
                setTrackingNumber(data.tracking_number || null);
                setCourier(data.courier || null);
            } else {
                setStatus("pending");
            }
        } catch (err) {
            console.error("Failed to check status", err);
            setStatus("error");
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("order_id") || urlParams.get("invoice_number");

        if (!id) {
            setStatus("search");
            return;
        }

        fetchOrder(id);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanId = searchInput.trim();
        if (!cleanId) return;
        window.history.pushState({}, "", `/order-status?order_id=${encodeURIComponent(cleanId)}`);
        fetchOrder(cleanId);
    };

    // Build product cards from magicLinks
    const renderProductCards = () => {
        if (!magicLinks) return null;

        if (typeof magicLinks === "object") {
            const entries = Object.entries(magicLinks).filter(([, link]) => link && !link.startsWith("ERROR:") && !link.startsWith("PENDING_"));
            if (entries.length === 0) return null;
            return (
                <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", marginBottom: 32 }}>
                    {entries.map(([key, link]) => (
                        <ProductCard key={key} productKey={key} link={link} />
                    ))}
                </div>
            );
        }

        // Plain string (old orders)
        const key = productId || "letter";
        if (!magicLinks.startsWith("ERROR:") && !magicLinks.startsWith("PENDING_")) {
            return (
                <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", marginBottom: 32 }}>
                    <ProductCard productKey={key} link={magicLinks} />
                </div>
            );
        }
        return null;
    };

    const productCount = magicLinks && typeof magicLinks === "object"
        ? Object.keys(magicLinks).length
        : 1;
    const isBundle = productCount > 1;
    const isUnbox = Boolean(productId?.startsWith("unbox_") || productId?.startsWith("giftbox_") || productId?.includes("gift-box") || orderId?.startsWith("ORDER-UNBOX") || orderId?.startsWith("ORDER-GIFTBOX"));

    return (
        <div style={{ minHeight: "100vh", background: "#faf7f2", overflowX: "clip" }}>
            <Navbar />

            <main style={{
                position: "relative", zIndex: 1,
                paddingTop: "clamp(120px, 15vh, 160px)",
                paddingBottom: "clamp(80px, 12vh, 130px)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                minHeight: "80vh",
            }}>
                <div style={{ width: "100%", maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>

                    {/* ── Loading ── */}
                    {status === "loading" && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: "50%",
                                border: "3px solid rgba(205,171,143,0.3)",
                                borderTopColor: "#a88365",
                                animation: "spin 1s linear infinite",
                            }} />
                            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "#382a24", marginTop: 16 }}>
                                Memeriksa Status Pembayaran...
                            </h2>
                            <p style={{ color: "#6e5c53", fontSize: 14 }}>Mohon tunggu sebentar, kami sedang menyinkronkan dengan sistem bank.</p>
                        </div>
                    )}

                    {/* ── Paid ── */}
                    {status === "paid" && (
                        <div style={{ animation: "fadeIn 0.5s ease-out" }}>

                            {/* Success icon */}
                            <div style={{ textAlign: "center", marginBottom: 32 }}>
                                <div style={{
                                    width: 80, height: 80, borderRadius: "50%", background: "#e8f5e9",
                                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                                    boxShadow: "0 12px 32px -8px rgba(76,175,80,0.25)", marginBottom: 24,
                                }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                </div>

                                <h1 style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "clamp(2.2rem, 5.5vw, 3.5rem)",
                                    fontWeight: 400, lineHeight: 1.1,
                                    letterSpacing: "-0.03em", color: "#382a24", margin: "0 0 12px",
                                }}>
                                    Pembayaran <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Berhasil!</span>
                                </h1>

                                <p style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "clamp(0.9rem, 2vw, 1rem)",
                                    color: "#6e5c53", lineHeight: 1.7,
                                    maxWidth: 440, margin: "0 auto",
                                }}>
                                    {isBundle
                                        ? `Terima kasih atas pesanan bundle-mu! Berikut akses ke ${productCount} kado digital yang kamu beli.`
                                        : "Terima kasih atas pesananmu! Berikut akses ke kado digital kamu."}
                                    {" "}<strong>Link juga sudah dikirimkan ke email kamu.</strong>
                                </p>
                            </div>

                            {/* Unbox Physical Reminder Banner */}
                            {isUnbox && (
                                <div style={{
                                    background: "#fff8f0",
                                    border: "1px solid #ffe0b2",
                                    borderRadius: 16,
                                    padding: "18px 20px",
                                    marginBottom: 24,
                                    textAlign: "left",
                                    fontFamily: "var(--font-sans)",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e65100" }} />
                                        <strong style={{ fontSize: 13, color: "#e65100", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                            Informasi Pengiriman Gift Box
                                        </strong>
                                    </div>
                                    <p style={{ margin: 0, fontSize: 12.5, color: "#8c5b23", lineHeight: 1.55 }}>
                                        Paket Gift Box fisik kamu akan segera kami rakit dan kirimkan ke kurir <strong>setelah kamu menyelesaikan pengisian foto dan pesan di Studio Editor digital</strong> di bawah ini.
                                    </p>
                                </div>
                            )}

                            {/* Product Cards */}
                            {renderProductCards()}

                            {/* Unbox Physical Delivery Stepper */}
                            {isUnbox && (() => {
                                const isShipped = fulfillmentStatus === "shipped" || Boolean(trackingNumber);
                                const isPackingDone = isShipped;
                                const isCustomizationDone = isPackingDone || customizationStatus === "published" || fulfillmentStatus === "ready_to_pack";
                                const isPackingActive = (fulfillmentStatus === "ready_to_pack" || customizationStatus === "published") && !isPackingDone;

                                return (
                                    <div style={{
                                        background: "#ffffff",
                                        border: "1.5px solid rgba(205,171,143,0.25)",
                                        borderRadius: 16,
                                        padding: "20px 24px",
                                        marginBottom: 32,
                                        textAlign: "left",
                                        fontFamily: "var(--font-sans)",
                                    }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                            <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: "#1d1816", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                                Status Pemrosesan Paket Fisik
                                            </h4>
                                            {isShipped ? (
                                                <span style={{ fontSize: 11, fontWeight: 700, color: "#2e7d32", background: "#e8f5e9", padding: "3px 8px", borderRadius: 999, border: "1px solid #c8e6c9" }}>
                                                    Dalam Pengiriman
                                                </span>
                                            ) : isPackingActive ? (
                                                <span style={{ fontSize: 11, fontWeight: 700, color: "#a67c52", background: "#fdf8f4", padding: "3px 8px", borderRadius: 999, border: "1px solid #ecdacf" }}>
                                                    Sedang Dikemas
                                                </span>
                                            ) : null}
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                            {/* STEP 1 */}
                                            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#4CAF50", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
                                                    ✓
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1d1816" }}>
                                                        1. Pembayaran Berhasil Dikonfirmasi
                                                    </div>
                                                    <div style={{ fontSize: 11.5, color: "#7a685e", marginTop: 2 }}>
                                                        Pesanan telah masuk ke antrean atelier kami
                                                    </div>
                                                </div>
                                            </div>

                                            {/* STEP 2 */}
                                            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                                <div style={{
                                                    width: 24, height: 24, borderRadius: "50%",
                                                    background: isCustomizationDone ? "#4CAF50" : "#a67c52",
                                                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                                                    fontSize: isCustomizationDone ? 12 : 11, fontWeight: 700, flexShrink: 0, marginTop: 1
                                                }}>
                                                    {isCustomizationDone ? "✓" : "2"}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1d1816" }}>
                                                        2. Kustomisasi Studio Digital {isCustomizationDone ? "(Selesai)" : "(Sedang Berlangsung)"}
                                                    </div>
                                                    <div style={{ fontSize: 11.5, color: isCustomizationDone ? "#2e7d32" : "#7a685e", marginTop: 2 }}>
                                                        {isCustomizationDone
                                                            ? "Kreasi foto & pesan kado digitalmu telah selesai diisi & disimpan."
                                                            : "Klik tombol di atas untuk mulai mengisi foto & pesan kado digitalmu."}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* STEP 3 */}
                                            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                                <div style={{
                                                    width: 24, height: 24, borderRadius: "50%",
                                                    background: isPackingDone ? "#4CAF50" : isPackingActive ? "#a67c52" : "#e2d7ce",
                                                    color: (isPackingDone || isPackingActive) ? "#fff" : "#7a685e",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    fontSize: isPackingDone ? 12 : 11, fontWeight: 700, flexShrink: 0, marginTop: 1
                                                }}>
                                                    {isPackingDone ? "✓" : "3"}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 13, fontWeight: 700, color: (isPackingDone || isPackingActive) ? "#1d1816" : "#7a685e" }}>
                                                        3. Perakitan & Pengemasan Box Fisik {isPackingDone ? "(Selesai)" : isPackingActive ? "(Sedang Diproses)" : ""}
                                                    </div>
                                                    <div style={{ fontSize: 11.5, color: isPackingDone ? "#2e7d32" : isPackingActive ? "#a67c52" : "#a6968c", marginTop: 2 }}>
                                                        {isPackingDone
                                                            ? "Hampers fisik telah selesai dirakit dan dikemas rapi."
                                                            : isPackingActive
                                                            ? "Atelier sedang merakit & mengemas kado fisik pesananmu."
                                                            : "Akan dimulai setelah kustomisasi digital selesai."}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* STEP 4 */}
                                            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                                <div style={{
                                                    width: 24, height: 24, borderRadius: "50%",
                                                    background: isShipped ? "#2e7d32" : "#e2d7ce",
                                                    color: isShipped ? "#fff" : "#7a685e",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    fontSize: isShipped ? 12 : 11, fontWeight: 700, flexShrink: 0, marginTop: 1
                                                }}>
                                                    {isShipped ? "✓" : "4"}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 13, fontWeight: 700, color: isShipped ? "#1d1816" : "#7a685e" }}>
                                                        4. {isShipped ? "Paket Sedang Dalam Pengiriman" : "Penyerahan ke Kurir & Pengiriman"}
                                                    </div>
                                                    <div style={{ fontSize: 11.5, color: isShipped ? "#2e7d32" : "#a6968c", marginTop: 2 }}>
                                                        {isShipped
                                                            ? (courier ? `Kurir: ${courier}` : "Paket sedang dalam perjalanan ekspedisi.")
                                                            : "Nomor resi pengiriman akan otomatis muncul di sini setelah kurir dipanggil."}
                                                    </div>

                                                    {isShipped && trackingNumber ? (
                                                        <div style={{ marginTop: 8 }}>
                                                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                                                <span style={{ fontSize: 11.5, color: "#6e5c53" }}>No. Resi:</span>
                                                                <span style={{
                                                                    fontFamily: "monospace",
                                                                    fontSize: 12,
                                                                    fontWeight: 700,
                                                                    color: "#1d1816",
                                                                    background: "#f3ede7",
                                                                    padding: "3px 8px",
                                                                    borderRadius: 6,
                                                                    border: "1px solid #dcd1c6"
                                                                }}>
                                                                    {trackingNumber}
                                                                </span>
                                                                <button
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(trackingNumber);
                                                                        setCopiedResi(true);
                                                                        setTimeout(() => setCopiedResi(false), 2000);
                                                                    }}
                                                                    style={{
                                                                        background: "none",
                                                                        border: "none",
                                                                        color: "#a67c52",
                                                                        fontSize: 11,
                                                                        fontWeight: 700,
                                                                        cursor: "pointer",
                                                                        textDecoration: "underline",
                                                                        padding: 0
                                                                    }}
                                                                >
                                                                    {copiedResi ? "Disalin" : "Salin Resi"}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleFetchLiveTracking(trackingNumber, courier || "jnt")}
                                                                    style={{
                                                                        display: "inline-flex",
                                                                        alignItems: "center",
                                                                        padding: "4px 9px",
                                                                        borderRadius: 6,
                                                                        border: "1px solid #2e7d32",
                                                                        background: "#e8f5e9",
                                                                        color: "#2e7d32",
                                                                        fontSize: 10.5,
                                                                        fontWeight: 700,
                                                                        cursor: "pointer"
                                                                    }}
                                                                >
                                                                    {liveTracking?.loading ? "Memuat..." : (liveTracking?.data ? (liveTracking.showHistory ? "Tutup Riwayat" : "Lacak Posisi Paket") : "Lacak Posisi Paket")}
                                                                </button>
                                                            </div>

                                                            {/* Live Tracking Timeline */}
                                                            {liveTracking?.showHistory && (
                                                                <div style={{
                                                                    marginTop: 12,
                                                                    background: "#fdfbfa",
                                                                    border: "1px solid #ebdcd0",
                                                                    borderRadius: 10,
                                                                    padding: "12px 14px",
                                                                    fontSize: "0.82rem"
                                                                }}>
                                                                    {liveTracking.loading && (
                                                                        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#8d7971", fontSize: "0.8rem" }}>
                                                                            <div style={{ width: 14, height: 14, border: "2px solid #a67c52", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                                                                            Menghubungkan ke server kurir {courier || "Biteship"}...
                                                                        </div>
                                                                    )}

                                                                    {liveTracking.error && (
                                                                        <div style={{ color: "#c62828", fontSize: "0.8rem" }}>
                                                                            {liveTracking.error}
                                                                        </div>
                                                                    )}

                                                                    {liveTracking.data && (
                                                                        <div>
                                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #eee5dd", paddingBottom: 8, marginBottom: 10, gap: 8 }}>
                                                                                <div>
                                                                                    <span style={{
                                                                                        display: "inline-block",
                                                                                        padding: "2px 8px",
                                                                                        borderRadius: 999,
                                                                                        fontSize: "0.72rem",
                                                                                        fontWeight: 800,
                                                                                        color: "#ffffff",
                                                                                        backgroundColor: liveTracking.data.status_color || "#2e7d32"
                                                                                    }}>
                                                                                        {liveTracking.data.status_display}
                                                                                    </span>
                                                                                    <div style={{ fontSize: "0.78rem", color: "#6e5c53", marginTop: 4, lineHeight: 1.4 }}>
                                                                                        {liveTracking.data.status_desc}
                                                                                    </div>
                                                                                </div>
                                                                                {liveTracking.data.tracking_link && (
                                                                                    <a
                                                                                        href={liveTracking.data.tracking_link}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        style={{
                                                                                            fontSize: "0.75rem",
                                                                                            fontWeight: 700,
                                                                                            color: "#2563eb",
                                                                                            textDecoration: "underline",
                                                                                            whiteSpace: "nowrap"
                                                                                        }}
                                                                                    >
                                                                                        Website Ekspedisi ↗
                                                                                    </a>
                                                                                )}
                                                                            </div>

                                                                            {/* History checkpoints */}
                                                                            {liveTracking.data.history && liveTracking.data.history.length > 0 ? (
                                                                                <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative", paddingLeft: 12 }}>
                                                                                    <div style={{ position: "absolute", left: 3, top: 4, bottom: 4, width: 2, background: "#ebdcd0" }} />
                                                                                    {liveTracking.data.history.map((item: any, idx: number) => {
                                                                                        const dateStr = item.updated_at ? new Date(item.updated_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "-";
                                                                                        return (
                                                                                            <div key={idx} style={{ position: "relative" }}>
                                                                                                <div style={{
                                                                                                    position: "absolute",
                                                                                                    left: -13,
                                                                                                    top: 3,
                                                                                                    width: 8,
                                                                                                    height: 8,
                                                                                                    borderRadius: "50%",
                                                                                                    backgroundColor: idx === 0 ? "#2e7d32" : "#a67c52"
                                                                                                }} />
                                                                                                <div style={{ fontSize: "0.78rem", fontWeight: idx === 0 ? 700 : 500, color: idx === 0 ? "#1d1816" : "#59483f" }}>
                                                                                                    {item.note || item.status}
                                                                                                </div>
                                                                                                <div style={{ fontSize: "0.7rem", color: "#a6968c", marginTop: 1 }}>
                                                                                                    {dateStr}
                                                                                                </div>
                                                                                            </div>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            ) : (
                                                                                <div style={{ fontSize: "0.76rem", color: "#8d7971" }}>
                                                                                    Belum ada riwayat checkpoint transit baru dari kurir.
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Fallback text if no cards */}
                            {!magicLinks && (
                                <p style={{
                                    fontFamily: "var(--font-sans)", fontSize: "1rem",
                                    color: "#6e5c53", lineHeight: 1.8, textAlign: "center",
                                    maxWidth: 480, margin: "0 auto 40px",
                                }}>
                                    Link studio kado digital kamu telah dikirimkan ke email <strong>{orderId}</strong>.
                                    Silakan periksa folder Inbox atau Spam.
                                </p>
                            )}

                            {/* Email reminder pill */}
                            <div style={{
                                display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
                                background: "rgba(205,171,143,0.1)", border: "1px solid rgba(205,171,143,0.25)",
                                borderRadius: 999, padding: "10px 20px", marginBottom: 32,
                            }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a88365" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                <span style={{ fontSize: 12, color: "#a88365", fontFamily: "var(--font-sans)", fontWeight: 600 }}>
                                    Link juga dikirim ke email kamu · Cek Inbox / Spam
                                </span>
                            </div>

                            {/* Action buttons */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                                <Link
                                    href="/"
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center",
                                        padding: "14px 36px", borderRadius: 999, width: "100%", maxWidth: 320,
                                        background: "#1d1816", color: "#faf7f2",
                                        fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                        textDecoration: "none", transition: "all 0.3s ease",
                                        boxShadow: "0 8px 32px -8px rgba(29,24,22,0.25)",
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.background = "#cdab8f"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.background = "#1d1816"; }}
                                >
                                    Kembali ke Beranda
                                </Link>
                                <a
                                    href={`https://wa.me/6281936109076?text=Halo%20Admin%2C%20saya%20sudah%20membayar%20pesanan%20(${orderId})%20namun%20link%20belum%20masuk%20ke%20email.`}
                                    target="_blank" rel="noopener noreferrer"
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center",
                                        padding: "14px 36px", borderRadius: 999, width: "100%", maxWidth: 320,
                                        background: "transparent", color: "#6e5c53",
                                        fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                        textDecoration: "none", transition: "all 0.3s ease",
                                        border: "1.5px solid rgba(205,171,143,0.35)",
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#cdab8f"; (e.currentTarget as HTMLElement).style.color = "#a88365"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(205,171,143,0.35)"; (e.currentTarget as HTMLElement).style.color = "#6e5c53"; }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.477 2 2 6.477 2 12c0 1.821.486 3.53 1.337 5.006L2.001 22l5.13-1.322A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                                    </svg>
                                    Email belum masuk? Hubungi Bantuan
                                </a>
                            </div>
                        </div>
                    )}

                    {/* ── Pending ── */}
                    {status === "pending" && (
                        <div style={{ animation: "fadeIn 0.5s ease-out", textAlign: "center" }}>
                            <div style={{
                                width: 80, height: 80, borderRadius: "50%", background: "#fff3e0",
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                margin: "0 auto 28px", boxShadow: "0 12px 32px -8px rgba(255,152,0,0.3)",
                            }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF9800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>

                            <h1 style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                                fontWeight: 400, lineHeight: 1.1,
                                letterSpacing: "-0.03em", color: "#382a24", marginBottom: 20,
                            }}>
                                Menunggu <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Pembayaran</span>
                            </h1>

                            <p style={{
                                fontFamily: "var(--font-sans)", fontSize: "clamp(1rem, 2vw, 1.05rem)",
                                color: "#6e5c53", lineHeight: 1.8, maxWidth: 440, margin: "0 auto 40px",
                            }}>
                                Pesanan <strong>{orderId}</strong> belum terbayar.
                                Ingin bayar lebih cepat? Hubungi Admin via WhatsApp.
                            </p>

                            <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                                <Link href="/"
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center",
                                        padding: "14px 36px", borderRadius: 999, width: "100%", maxWidth: 320,
                                        background: "#1d1816", color: "#faf7f2",
                                        fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                        textDecoration: "none", transition: "all 0.3s ease",
                                        boxShadow: "0 8px 32px -8px rgba(29,24,22,0.25)",
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.background = "#cdab8f"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.background = "#1d1816"; }}
                                >
                                    Kembali ke Beranda
                                </Link>
                                <a
                                    href={`https://wa.me/6281936109076?text=Halo%20Admin%2C%20saya%20punya%20pesanan%20(${orderId})%20dan%20ingin%20bayar%20manual%20via%20QRIS.`}
                                    target="_blank" rel="noopener noreferrer"
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center",
                                        padding: "14px 36px", borderRadius: 999, width: "100%", maxWidth: 320,
                                        background: "transparent", color: "#6e5c53",
                                        fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                        textDecoration: "none", transition: "all 0.3s ease",
                                        border: "1.5px solid rgba(205,171,143,0.35)",
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#cdab8f"; (e.currentTarget as HTMLElement).style.color = "#a88365"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(205,171,143,0.35)"; (e.currentTarget as HTMLElement).style.color = "#6e5c53"; }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.477 2 2 6.477 2 12c0 1.821.486 3.53 1.337 5.006L2.001 22l5.13-1.322A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                                    </svg>
                                    Bayar via QRIS (WhatsApp)
                                </a>
                            </div>
                        </div>
                    )}

                    {/* ── Search Form (Lacak Pesanan) ── */}
                    {status === "search" && (
                        <div style={{ animation: "fadeIn 0.5s ease-out", textAlign: "center", width: "100%" }}>
                            <div style={{
                                width: 72, height: 72, borderRadius: "50%", background: "rgba(205,171,143,0.15)",
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                margin: "0 auto 20px", color: "#a67c52",
                            }}>
                                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>

                            <h1 style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(2rem, 5vw, 3rem)",
                                fontWeight: 400, lineHeight: 1.1,
                                letterSpacing: "-0.02em", color: "#382a24", marginBottom: 12,
                            }}>
                                Lacak <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Pesanan Kamu</span>
                            </h1>

                            <p style={{
                                fontFamily: "var(--font-sans)", fontSize: "clamp(0.92rem, 2vw, 1rem)",
                                color: "#6e5c53", lineHeight: 1.6, maxWidth: 460, margin: "0 auto 28px",
                            }}>
                                Masukkan <strong>Order ID</strong> untuk memeriksa status pembayaran, nomor resi pengiriman, dan link studio kado digitalmu.
                            </p>

                            <form onSubmit={handleSearchSubmit} style={{ maxWidth: 440, margin: "0 auto 32px" }}>
                                <div style={{
                                    display: "flex",
                                    gap: 8,
                                    backgroundColor: "#ffffff",
                                    padding: "6px",
                                    borderRadius: "16px",
                                    border: "1.5px solid rgba(205,171,143,0.35)",
                                    boxShadow: "0 4px 20px rgba(56,42,36,0.06)",
                                }}>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: ORDER-UNBOX-..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        style={{
                                            flex: 1,
                                            padding: "12px 16px",
                                            border: "none",
                                            outline: "none",
                                            fontSize: "0.95rem",
                                            color: "#1d1816",
                                            backgroundColor: "transparent",
                                            fontFamily: "var(--font-sans)",
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        style={{
                                            padding: "12px 24px",
                                            borderRadius: "12px",
                                            backgroundColor: "#1d1816",
                                            color: "#faf7f2",
                                            fontSize: "0.88rem",
                                            fontWeight: 700,
                                            border: "none",
                                            cursor: "pointer",
                                            whiteSpace: "nowrap",
                                            transition: "background 0.2s ease",
                                        }}
                                    >
                                        Cari
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ── Error ── */}
                    {status === "error" && (
                        <div style={{ animation: "fadeIn 0.5s ease-out", textAlign: "center", width: "100%" }}>
                            <div style={{
                                width: 72, height: 72, borderRadius: "50%", background: "#ffebee",
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                margin: "0 auto 20px", boxShadow: "0 8px 24px -6px rgba(244,67,54,0.25)",
                            }}>
                                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#F44336" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                            </div>

                            <h1 style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(1.8rem, 4.5vw, 2.5rem)",
                                fontWeight: 400, lineHeight: 1.1,
                                letterSpacing: "-0.02em", color: "#382a24", marginBottom: 12,
                            }}>
                                Pesanan <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Tidak Ditemukan</span>
                            </h1>

                            <p style={{
                                fontFamily: "var(--font-sans)", fontSize: "clamp(0.9rem, 2vw, 0.96rem)",
                                color: "#6e5c53", lineHeight: 1.6, maxWidth: 440, margin: "0 auto 24px",
                            }}>
                                Kami tidak dapat menemukan data pesanan dengan ID <strong>{orderId || "-"}</strong>. Silakan periksa kembali atau masukkan Order ID yang benar.
                            </p>

                            <form onSubmit={handleSearchSubmit} style={{ maxWidth: 440, margin: "0 auto 24px" }}>
                                <div style={{
                                    display: "flex",
                                    gap: 8,
                                    backgroundColor: "#ffffff",
                                    padding: "6px",
                                    borderRadius: "16px",
                                    border: "1.5px solid rgba(205,171,143,0.35)",
                                    boxShadow: "0 4px 20px rgba(56,42,36,0.06)",
                                }}>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ketik Order ID..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        style={{
                                            flex: 1,
                                            padding: "12px 16px",
                                            border: "none",
                                            outline: "none",
                                            fontSize: "0.95rem",
                                            color: "#1d1816",
                                            backgroundColor: "transparent",
                                            fontFamily: "var(--font-sans)",
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        style={{
                                            padding: "12px 24px",
                                            borderRadius: "12px",
                                            backgroundColor: "#1d1816",
                                            color: "#faf7f2",
                                            fontSize: "0.88rem",
                                            fontWeight: 700,
                                            border: "none",
                                            cursor: "pointer",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        Cari Ulang
                                    </button>
                                </div>
                            </form>

                            <Link href="/catalog"
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center",
                                    padding: "12px 28px", borderRadius: 999,
                                    background: "transparent", color: "#6e5c53",
                                    border: "1.5px solid rgba(205,171,143,0.35)",
                                    fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                                    textDecoration: "none",
                                }}
                            >
                                Kembali ke Katalog
                            </Link>
                        </div>
                    )}

                    <style>{`
                        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
                    `}</style>
                </div>
            </main>
        </div>
    );
}
