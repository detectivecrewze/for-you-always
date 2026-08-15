"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface OrderItem {
    order_id: string;
    gross_amount: number;
    product_type: string;
    status: "paid" | "pending" | "expired" | "success";
    customer_details?: string | { first_name?: string; email?: string; phone?: string };
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    product_id?: string;
    shipping_details?: string | {
        recipient_name?: string;
        recipient_phone?: string;
        address?: string;
        city?: string;
        province?: string;
        postal_code?: string;
        zone?: string;
        shipping_cost?: number;
    };
    studio_link?: string;
    magic_link?: string;
    customization_status?: "draft" | "published";
    fulfillment_status?: "pending_customization" | "ready_to_pack" | "shipped";
    tracking_number?: string;
    courier?: string;
    created_at?: string;
}

export default function Dashboard() {
    // Auth States
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [passwordInput, setPasswordInput] = useState("");
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState("");

    // Dashboard States
    const [activeTab, setActiveTab] = useState<"overview" | "physical" | "digital">("overview");
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [productFilter, setProductFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Resi Edit State
    const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
    const [trackingInput, setTrackingInput] = useState("");
    const [courierInput, setCourierInput] = useState("SiCepat");
    const [savingTracking, setSavingTracking] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch("/api/admin/auth");
            if (res.ok) {
                setIsAuthenticated(true);
                fetchOrders();
            } else {
                setIsAuthenticated(false);
            }
        } catch {
            setIsAuthenticated(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthError("");

        try {
            const res = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: passwordInput }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setIsAuthenticated(true);
                fetchOrders();
            } else {
                setAuthError(data.message || "Kata sandi salah. Akses ditolak.");
            }
        } catch {
            setAuthError("Terjadi kesalahan jaringan.");
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/admin/auth", { method: "DELETE" });
        setIsAuthenticated(false);
        setPasswordInput("");
        setMobileMenuOpen(false);
    };

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const res = await fetch("/api/admin/orders");
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        } finally {
            setLoadingOrders(false);
        }
    };

    // Helpers
    const parseMeta = (val: any) => {
        if (!val) return {};
        if (typeof val === "object") return val;
        try {
            return JSON.parse(val);
        } catch {
            return {};
        }
    };

    const formatWIB = (dateStr?: string) => {
        if (!dateStr) return "-";
        try {
            const cleanStr = dateStr.includes("T") || dateStr.endsWith("Z") ? dateStr : dateStr.replace(" ", "T") + "Z";
            const d = new Date(cleanStr);
            if (isNaN(d.getTime())) return dateStr;
            return new Intl.DateTimeFormat("id-ID", {
                timeZone: "Asia/Jakarta",
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }).format(d) + " WIB";
        } catch {
            return dateStr;
        }
    };

    const getCustomer = (order: any) => {
        const meta = parseMeta(order.customer_details);
        return {
            name: order.customer_name || meta.first_name || meta.name || "-",
            email: order.customer_email || meta.email || "-",
            phone: order.customer_phone || meta.phone || "-",
        };
    };

    const getProductType = (order: any) => {
        return order.product_type || order.product_id || "Digital Gift";
    };

    const handleCopyAddress = (order: OrderItem) => {
        const ship = parseMeta(order.shipping_details);
        const districtText = ship.district ? `${ship.district}, ` : "";
        const text = `Penerima: ${ship.recipient_name || "-"} (${ship.recipient_phone || "-"})\nAlamat: ${ship.address || "-"}\nWilayah: ${districtText}${ship.city || "-"}, ${ship.province || "-"} ${ship.postal_code || "-"}`;
        navigator.clipboard.writeText(text);
        setCopiedId(`addr_${order.order_id}`);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleCopyStudioLink = (order: OrderItem) => {
        const link = order.studio_link || order.magic_link || "";
        if (!link) return;
        navigator.clipboard.writeText(link);
        setCopiedId(`link_${order.order_id}`);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleSaveTracking = async (orderId: string) => {
        setSavingTracking(true);
        try {
            const res = await fetch("/api/admin/update-resi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_id: orderId,
                    tracking_number: trackingInput,
                    courier: courierInput,
                    fulfillment_status: "shipped",
                }),
            });

            if (res.ok) {
                setOrders(orders.map(o => o.order_id === orderId ? {
                    ...o,
                    tracking_number: trackingInput,
                    courier: courierInput,
                    fulfillment_status: "shipped"
                } : o));
                setEditingOrderId(null);
            } else {
                alert("Gagal memperbarui nomor resi.");
            }
        } catch {
            alert("Terjadi kesalahan sistem saat menyimpan resi.");
        } finally {
            setSavingTracking(false);
        }
    };

    // Filtered lists
    const physicalOrders = orders.filter(o => {
        const pType = getProductType(o);
        return pType.startsWith("unbox") || o.order_id?.startsWith("ORDER-UNBOX") || Boolean(o.shipping_details);
    });
    const digitalOrders = orders.filter(o => {
        const pType = getProductType(o);
        return !pType.startsWith("unbox") && !o.order_id?.startsWith("ORDER-UNBOX") && !o.shipping_details;
    });

    // Metrics
    const totalRevenue = orders
        .filter(o => o.status === "paid" || o.status === "success")
        .reduce((acc, curr) => acc + (curr.gross_amount || 0), 0);

    const paidOrdersCount = orders.filter(o => o.status === "paid" || o.status === "success").length;
    const pendingOrdersCount = orders.filter(o => o.status === "pending").length;

    // Physical metrics
    const pendingCustomizationCount = physicalOrders.filter(o => o.fulfillment_status === "pending_customization" || o.customization_status !== "published").length;
    const readyToPackCount = physicalOrders.filter(o => o.customization_status === "published" && o.fulfillment_status !== "shipped").length;
    const shippedPhysicalCount = physicalOrders.filter(o => o.fulfillment_status === "shipped").length;

    // Filtered physical view
    const filteredPhysical = physicalOrders.filter(o => {
        const cust = getCustomer(o);
        const ship = parseMeta(o.shipping_details);
        const matchesSearch =
            o.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (ship.recipient_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            cust.phone.includes(searchQuery);

        if (statusFilter === "all") return matchesSearch;
        if (statusFilter === "pending_customization") return matchesSearch && (o.fulfillment_status === "pending_customization" || o.customization_status !== "published");
        if (statusFilter === "ready_to_pack") return matchesSearch && (o.customization_status === "published" && o.fulfillment_status !== "shipped");
        if (statusFilter === "shipped") return matchesSearch && o.fulfillment_status === "shipped";
        return matchesSearch;
    });

    // Filtered digital view
    const filteredDigital = digitalOrders.filter(o => {
        const cust = getCustomer(o);
        const pType = getProductType(o);
        const matchesSearch =
            o.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cust.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cust.phone.includes(searchQuery);

        const matchesProduct = productFilter === "all" || pType.includes(productFilter);
        const matchesStatus = statusFilter === "all" || o.status === statusFilter;

        return matchesSearch && matchesProduct && matchesStatus;
    });

    const getTabTitle = () => {
        if (activeTab === "overview") return "Ringkasan Penjualan";
        if (activeTab === "physical") return "Pesanan Fisik (Unbox)";
        return "Semua Pesanan Digital";
    };

    // ── 1. LOADING SCREEN ──
    if (isAuthenticated === null) {
        return (
            <div style={{ minHeight: "100vh", background: "#faf7f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    border: "3px solid rgba(205,171,143,0.3)",
                    borderTopColor: "#a67c52",
                    animation: "spin 1s linear infinite",
                }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // ── 2. LOCK SCREEN / ADMIN GATE ──
    if (!isAuthenticated) {
        return (
            <div style={{
                minHeight: "100vh",
                background: "#faf7f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
                fontFamily: "var(--font-sans)",
            }}>
                <div style={{
                    background: "#ffffff",
                    width: "100%",
                    maxWidth: 400,
                    borderRadius: 20,
                    padding: "36px 24px",
                    boxShadow: "0 20px 50px rgba(29, 24, 22, 0.1)",
                    border: "1px solid rgba(205, 171, 143, 0.3)",
                    textAlign: "center",
                }}>
                    <div style={{ width: 44, height: 44, position: "relative", margin: "0 auto 14px", borderRadius: 10, overflow: "hidden" }}>
                        <Image src="/logo.png" alt="Logo" fill style={{ objectFit: "cover" }} />
                    </div>

                    <span style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                        color: "#a67c52", background: "rgba(166,124,82,0.1)", padding: "3px 10px",
                        borderRadius: 999, display: "inline-block", marginBottom: 10,
                    }}>
                        Atelier Administration
                    </span>

                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "#1d1816", margin: "0 0 6px" }}>
                        For You, Always.
                    </h2>
                    <p style={{ fontSize: 12.5, color: "#7a685e", margin: "0 0 24px", lineHeight: 1.45 }}>
                        Masukkan kata sandi master untuk mengakses dashboard atelier.
                    </p>

                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <input
                            type="password"
                            required
                            placeholder="Kata Sandi Master"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px 14px",
                                borderRadius: 10,
                                border: "1px solid #dcd1c6",
                                outline: "none",
                                fontSize: 13.5,
                                color: "#1d1816",
                                boxSizing: "border-box",
                                textAlign: "center",
                            }}
                        />

                        {authError && (
                            <div style={{ fontSize: 11.5, color: "#c92a2a", background: "#fff5f5", padding: "8px 12px", borderRadius: 8, border: "1px solid #ffc9c9" }}>
                                {authError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={authLoading}
                            style={{
                                width: "100%",
                                padding: "13px",
                                borderRadius: 10,
                                border: "none",
                                background: "#1d1816",
                                color: "#faf7f2",
                                fontSize: 12,
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                cursor: authLoading ? "not-allowed" : "pointer",
                                boxShadow: "0 6px 18px rgba(29,24,22,0.18)",
                                transition: "background 0.2s ease",
                            }}
                        >
                            {authLoading ? "Memverifikasi..." : "Buka Dashboard"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ── 3. AUTHENTICATED DASHBOARD WITH FULL MOBILE SUPPORT ──
    return (
        <>
            <style>{`
                .dash-container {
                    min-height: 100vh;
                    background: #f8f6f2;
                    display: flex;
                    font-family: var(--font-sans);
                    width: 100%;
                    position: relative;
                }
                .dash-sidebar {
                    width: 250px;
                    background: #ffffff;
                    border-right: 1px solid #e8dfd8;
                    padding: 24px 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    height: 100vh;
                    position: sticky;
                    top: 0;
                    box-sizing: border-box;
                    z-index: 100;
                    flex-shrink: 0;
                }
                .dash-mobile-bar {
                    display: none;
                }
                .dash-mobile-backdrop {
                    display: none;
                }
                .dash-main {
                    flex: 1;
                    min-width: 0;
                    padding: 28px 32px;
                    overflow-y: auto;
                    box-sizing: border-box;
                }
                .dash-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 14px;
                    margin-bottom: 24px;
                }
                .dash-stats-grid-3 {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                    margin-bottom: 18px;
                }
                .dash-filter-row {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 16px;
                }
                .dash-table-wrap {
                    background: #ffffff;
                    border-radius: 14px;
                    border: 1px solid #e8dfd8;
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    width: 100%;
                    box-sizing: border-box;
                }

                @media (max-width: 860px) {
                    .dash-container {
                        flex-direction: column;
                    }
                    .dash-mobile-bar {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        height: 56px;
                        background: #ffffff;
                        border-bottom: 1px solid #e8dfd8;
                        padding: 0 16px;
                        position: sticky;
                        top: 0;
                        z-index: 900;
                    }
                    .dash-sidebar {
                        position: fixed;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        width: 270px;
                        transform: translateX(-100%);
                        transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow: 0 0 30px rgba(0,0,0,0.2);
                        z-index: 9999;
                    }
                    .dash-sidebar.open {
                        transform: translateX(0);
                    }
                    .dash-mobile-backdrop.open {
                        display: block;
                        position: fixed;
                        inset: 0;
                        background: rgba(0,0,0,0.4);
                        backdrop-filter: blur(3px);
                        -webkit-backdrop-filter: blur(3px);
                        z-index: 9998;
                    }
                    .dash-main {
                        padding: 18px 14px;
                        width: 100%;
                    }
                    .dash-stats-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 10px;
                        margin-bottom: 18px;
                    }
                    .dash-stats-grid-3 {
                        grid-template-columns: 1fr;
                        gap: 10px;
                        margin-bottom: 16px;
                    }
                    .dash-filter-row {
                        flex-direction: column;
                        gap: 8px;
                    }
                }
            `}</style>

            <div className="dash-container">
                {/* Mobile Top App Bar */}
                <div className="dash-mobile-bar">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Buka Menu"
                            style={{
                                background: "#faf7f2",
                                border: "1px solid #dcd1c6",
                                borderRadius: 8,
                                width: 34,
                                height: 34,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "#1d1816",
                            }}
                        >
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div>
                            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "#1d1816" }}>
                                For You, Always.
                            </span>
                        </div>
                    </div>

                    <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#a67c52",
                        background: "rgba(166,124,82,0.1)",
                        padding: "3px 8px",
                        borderRadius: 999,
                        textTransform: "uppercase",
                    }}>
                        {getTabTitle()}
                    </span>
                </div>

                {/* Mobile Backdrop */}
                <div
                    className={`dash-mobile-backdrop ${mobileMenuOpen ? 'open' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                />

                {/* Sidebar */}
                <aside className={`dash-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 32, height: 32, position: "relative", borderRadius: 8, overflow: "hidden" }}>
                                <Image src="/logo.png" alt="Logo" fill style={{ objectFit: "cover" }} />
                            </div>
                            <div>
                                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "#1d1816", letterSpacing: "-0.01em" }}>
                                    For You, Always.
                                </span>
                                <div style={{ fontSize: 9, fontWeight: 700, color: "#a67c52", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                    Admin Atelier
                                </div>
                            </div>
                        </div>

                        {/* Mobile Close Button */}
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                background: "none", border: "none", color: "#7a685e", padding: 4, cursor: "pointer",
                            }}
                            className="md:hidden"
                        >
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                        <button
                            onClick={() => { setActiveTab("overview"); setStatusFilter("all"); setMobileMenuOpen(false); }}
                            style={{
                                display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10,
                                border: "none", background: activeTab === "overview" ? "#1d1816" : "transparent",
                                color: activeTab === "overview" ? "#faf7f2" : "#7a685e", fontWeight: 700, fontSize: 12.5,
                                cursor: "pointer", textAlign: "left", transition: "all 0.2s ease",
                            }}
                        >
                            Ringkasan Penjualan
                        </button>
                        <button
                            onClick={() => { setActiveTab("physical"); setStatusFilter("all"); setMobileMenuOpen(false); }}
                            style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderRadius: 10,
                                border: "none", background: activeTab === "physical" ? "#1d1816" : "transparent",
                                color: activeTab === "physical" ? "#faf7f2" : "#7a685e", fontWeight: 700, fontSize: 12.5,
                                cursor: "pointer", textAlign: "left", transition: "all 0.2s ease",
                            }}
                        >
                            <span>Pesanan Fisik (Unbox)</span>
                            {pendingCustomizationCount > 0 && (
                                <span style={{
                                    fontSize: 10, fontWeight: 700, background: activeTab === "physical" ? "#a67c52" : "#e65100",
                                    color: "#fff", padding: "1px 6px", borderRadius: 999,
                                }}>
                                    {pendingCustomizationCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => { setActiveTab("digital"); setStatusFilter("all"); setMobileMenuOpen(false); }}
                            style={{
                                display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10,
                                border: "none", background: activeTab === "digital" ? "#1d1816" : "transparent",
                                color: activeTab === "digital" ? "#faf7f2" : "#7a685e", fontWeight: 700, fontSize: 12.5,
                                cursor: "pointer", textAlign: "left", transition: "all 0.2s ease",
                            }}
                        >
                            Semua Pesanan Digital
                        </button>
                        <Link
                            href="/"
                            style={{
                                display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10,
                                color: "#a6968c", fontWeight: 600, fontSize: 12, textDecoration: "none", marginTop: 8,
                            }}
                        >
                            Lihat Toko Utama →
                        </Link>
                    </nav>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ background: "rgba(166,124,82,0.08)", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(166,124,82,0.2)" }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: "#a67c52", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                Database Active
                            </div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#1d1816", marginTop: 1 }}>
                                Cloudflare D1 SQLite
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            style={{
                                width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e8dfd8",
                                background: "#ffffff", color: "#c92a2a", fontSize: 11.5, fontWeight: 700,
                                cursor: "pointer", transition: "all 0.2s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            }}
                        >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="dash-main">
                    {/* ── TAB 1: OVERVIEW ── */}
                    {activeTab === "overview" && (
                        <div>
                            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
                                <div>
                                    <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 30px)", fontWeight: 700, color: "#1d1816", margin: "0 0 2px" }}>
                                        Ringkasan Penjualan
                                    </h1>
                                    <p style={{ fontSize: 12, color: "#7a685e", margin: 0 }}>
                                        Performa transaksi dan status fulfillment toko For You, Always.
                                    </p>
                                </div>
                                <button
                                    onClick={fetchOrders}
                                    style={{
                                        padding: "8px 14px", borderRadius: 8, border: "1px solid #dcd1c6",
                                        background: "#ffffff", color: "#1d1816", fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                                    }}
                                >
                                    Perbarui
                                </button>
                            </header>

                            {/* Metrics Cards */}
                            <div className="dash-stats-grid">
                                <div style={{ background: "#ffffff", padding: "16px 18px", borderRadius: 14, border: "1px solid #e8dfd8" }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                        Total Omzet (Paid)
                                    </div>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#1d1816", marginTop: 2 }}>
                                        Rp {totalRevenue.toLocaleString("id-ID")}
                                    </div>
                                </div>
                                <div style={{ background: "#ffffff", padding: "16px 18px", borderRadius: 14, border: "1px solid #e8dfd8" }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: "#2e7d32", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                        Pesanan Berhasil
                                    </div>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#2e7d32", marginTop: 2 }}>
                                        {paidOrdersCount} Transaksi
                                    </div>
                                </div>
                                <div style={{ background: "#ffffff", padding: "16px 18px", borderRadius: 14, border: "1px solid #e8dfd8" }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: "#a67c52", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                        Pesanan Fisik Unbox
                                    </div>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#a67c52", marginTop: 2 }}>
                                        {physicalOrders.length} Box
                                    </div>
                                </div>
                                <div style={{ background: "#ffffff", padding: "16px 18px", borderRadius: 14, border: "1px solid #e8dfd8" }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: "#e65100", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                        Menunggu Bayar
                                    </div>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#e65100", marginTop: 2 }}>
                                        {pendingOrdersCount} Order
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders Overview */}
                            <div className="dash-table-wrap" style={{ padding: "18px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#1d1816", margin: 0 }}>
                                        Aktivitas Transaksi Terbaru
                                    </h3>
                                    <button
                                        onClick={() => setActiveTab("digital")}
                                        style={{ background: "none", border: "none", color: "#a67c52", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}
                                    >
                                        Semua Pesanan →
                                    </button>
                                </div>

                                {loadingOrders ? (
                                    <div style={{ padding: "24px", textAlign: "center", color: "#7a685e", fontSize: 12 }}>Memuat data D1...</div>
                                ) : orders.length === 0 ? (
                                    <div style={{ padding: "24px", textAlign: "center", color: "#7a685e", fontSize: 12 }}>Belum ada transaksi di database.</div>
                                ) : (
                                    <div style={{ overflowX: "auto" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12, minWidth: 500 }}>
                                            <thead>
                                                <tr style={{ background: "#faf7f2", borderBottom: "1px solid #e8dfd8" }}>
                                                    <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Order ID</th>
                                                    <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Produk</th>
                                                    <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Nominal</th>
                                                    <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Status</th>
                                                    <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Waktu (WIB)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.slice(0, 8).map((o) => (
                                                    <tr key={o.order_id} style={{ borderBottom: "1px solid #f0e9e2" }}>
                                                        <td style={{ padding: "10px 12px", fontWeight: 700, color: "#1d1816" }}>{o.order_id}</td>
                                                        <td style={{ padding: "10px 12px", textTransform: "capitalize", color: "#59483f" }}>{o.product_type || "Digital Gift"}</td>
                                                        <td style={{ padding: "10px 12px", fontWeight: 700, color: "#1d1816" }}>Rp {o.gross_amount?.toLocaleString("id-ID")}</td>
                                                        <td style={{ padding: "10px 12px" }}>
                                                            <span style={{
                                                                fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 999,
                                                                background: o.status === "paid" || o.status === "success" ? "#e8f5e9" : "#fff3e0",
                                                                color: o.status === "paid" || o.status === "success" ? "#2e7d32" : "#e65100",
                                                            }}>
                                                                {o.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: "10px 12px", color: "#8a7b73", fontSize: 11 }}>{formatWIB(o.created_at)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── TAB 2: PESANAN FISIK (UNBOX THE MEMORY) ── */}
                    {activeTab === "physical" && (
                        <div>
                            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
                                <div>
                                    <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 30px)", fontWeight: 700, color: "#1d1816", margin: "0 0 2px" }}>
                                        Pesanan Fisik (Unbox the Memory)
                                    </h1>
                                    <p style={{ fontSize: 12, color: "#7a685e", margin: 0 }}>
                                        Kelola alamat pengiriman, status pengisian studio, dan nomor resi kurir.
                                    </p>
                                </div>
                                <button
                                    onClick={fetchOrders}
                                    style={{
                                        padding: "8px 14px", borderRadius: 8, border: "1px solid #dcd1c6",
                                        background: "#ffffff", color: "#1d1816", fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                                    }}
                                >
                                    Perbarui
                                </button>
                            </header>

                            {/* Physical Counters */}
                            <div className="dash-stats-grid-3">
                                <div style={{ background: "#ffffff", padding: "14px 16px", borderRadius: 12, border: "1px solid #e8dfd8" }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: "#e65100", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                        Menunggu Kustomisasi
                                    </div>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#e65100", marginTop: 2 }}>
                                        {pendingCustomizationCount}
                                    </div>
                                </div>
                                <div style={{ background: "#ffffff", padding: "14px 16px", borderRadius: 12, border: "1px solid #e8dfd8" }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: "#a67c52", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                        Siap Dirakit & Dipacking
                                    </div>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#a67c52", marginTop: 2 }}>
                                        {readyToPackCount}
                                    </div>
                                </div>
                                <div style={{ background: "#ffffff", padding: "14px 16px", borderRadius: 12, border: "1px solid #e8dfd8" }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: "#2e7d32", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                        Terkirim ke Ekspedisi
                                    </div>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#2e7d32", marginTop: 2 }}>
                                        {shippedPhysicalCount}
                                    </div>
                                </div>
                            </div>

                            {/* Search & Filter */}
                            <div className="dash-filter-row">
                                <input
                                    type="text"
                                    placeholder="Cari ID, Nama Pemesan, Penerima..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1px solid #dcd1c6", background: "#fff", fontSize: 12 }}
                                />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #dcd1c6", background: "#fff", fontSize: 12, fontWeight: 600 }}
                                >
                                    <option value="all">Semua Status Fulfillment</option>
                                    <option value="pending_customization">Menunggu Kustomisasi</option>
                                    <option value="ready_to_pack">Siap Dirakit / Packing</option>
                                    <option value="shipped">Terkirim</option>
                                </select>
                            </div>

                            {/* Physical Orders Table */}
                            <div className="dash-table-wrap">
                                {loadingOrders ? (
                                    <div style={{ padding: "30px", textAlign: "center", color: "#7a685e", fontSize: 12.5 }}>Memuat pesanan fisik...</div>
                                ) : filteredPhysical.length === 0 ? (
                                    <div style={{ padding: "30px", textAlign: "center", color: "#7a685e", fontSize: 12.5 }}>Tidak ada pesanan fisik yang cocok.</div>
                                ) : (
                                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 11.5, minWidth: 680 }}>
                                        <thead>
                                            <tr style={{ background: "#faf7f2", borderBottom: "1px solid #e8dfd8" }}>
                                                <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>ID & Waktu</th>
                                                <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Pemesan</th>
                                                <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Format Kado</th>
                                                <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Alamat Penerima</th>
                                                <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Status Studio</th>
                                                <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Pengiriman & Resi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPhysical.map((order) => {
                                                const cust = getCustomer(order);
                                                const ship = parseMeta(order.shipping_details);
                                                return (
                                                    <tr key={order.order_id} style={{ borderBottom: "1px solid #f0e9e2" }}>
                                                        <td style={{ padding: "12px", verticalAlign: "top" }}>
                                                            <div style={{ fontWeight: 700, color: "#1d1816" }}>{order.order_id}</div>
                                                            <div style={{ fontSize: 10.5, color: "#8a7b73" }}>{formatWIB(order.created_at)}</div>
                                                            <div style={{ fontSize: 11, fontWeight: 700, color: "#a67c52", marginTop: 2 }}>
                                                                Rp {order.gross_amount?.toLocaleString("id-ID")}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: "12px", verticalAlign: "top" }}>
                                                            <div style={{ fontWeight: 700, color: "#1d1816" }}>{cust.name}</div>
                                                            <div style={{ fontSize: 10.5, color: "#7a685e" }}>{cust.email}</div>
                                                            <div style={{ fontSize: 10.5, color: "#7a685e" }}>{cust.phone}</div>
                                                        </td>
                                                        <td style={{ padding: "12px", verticalAlign: "top" }}>
                                                            <span style={{
                                                                display: "inline-block", padding: "2px 7px", borderRadius: 6,
                                                                background: "rgba(166,124,82,0.1)", color: "#a67c52", fontWeight: 700,
                                                                fontSize: 10, textTransform: "capitalize",
                                                            }}>
                                                                {order.product_type?.replace("unbox_", "") || "Letter"}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: "12px", verticalAlign: "top", maxWidth: 220 }}>
                                                            <div style={{ fontWeight: 700, color: "#1d1816" }}>
                                                                {ship.recipient_name || "-"} ({ship.recipient_phone || "-"})
                                                            </div>
                                                            <div style={{ fontSize: 10.5, color: "#59483f", lineHeight: 1.3, marginTop: 2 }}>
                                                                {ship.address || "-"}, {ship.city || "-"}, {ship.province || "-"} {ship.postal_code || "-"}
                                                            </div>
                                                            <button
                                                                onClick={() => handleCopyAddress(order)}
                                                                style={{
                                                                    marginTop: 4, padding: "3px 8px", borderRadius: 6, border: "1px solid #dcd1c6",
                                                                    background: copiedId === `addr_${order.order_id}` ? "#2e7d32" : "#faf7f2",
                                                                    color: copiedId === `addr_${order.order_id}` ? "#fff" : "#7a685e",
                                                                    fontSize: 9.5, fontWeight: 700, cursor: "pointer",
                                                                }}
                                                            >
                                                                {copiedId === `addr_${order.order_id}` ? "Tersalin" : "Salin Alamat"}
                                                            </button>
                                                        </td>
                                                        <td style={{ padding: "12px", verticalAlign: "top" }}>
                                                            <span style={{
                                                                display: "inline-block", padding: "3px 7px", borderRadius: 6, fontSize: 10, fontWeight: 700,
                                                                background: order.customization_status === "published" ? "#e8f5e9" : "#fff3e0",
                                                                color: order.customization_status === "published" ? "#2e7d32" : "#e65100",
                                                            }}>
                                                                {order.customization_status === "published" ? "Selesai Diisi" : "Menunggu Pengisian"}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: "12px", verticalAlign: "top" }}>
                                                            {editingOrderId === order.order_id ? (
                                                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                                                    <select
                                                                        value={courierInput}
                                                                        onChange={(e) => setCourierInput(e.target.value)}
                                                                        style={{ padding: "4px", borderRadius: 6, border: "1px solid #dcd1c6", fontSize: 10.5 }}
                                                                    >
                                                                        <option value="SiCepat">SiCepat</option>
                                                                        <option value="JNE">JNE</option>
                                                                        <option value="J&T">J&T</option>
                                                                        <option value="Anteraja">Anteraja</option>
                                                                        <option value="Paxel">Paxel</option>
                                                                    </select>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Nomor Resi"
                                                                        value={trackingInput}
                                                                        onChange={(e) => setTrackingInput(e.target.value)}
                                                                        style={{ padding: "4px 6px", borderRadius: 6, border: "1px solid #dcd1c6", fontSize: 10.5 }}
                                                                    />
                                                                    <div style={{ display: "flex", gap: 4 }}>
                                                                        <button
                                                                            onClick={() => handleSaveTracking(order.order_id)}
                                                                            disabled={savingTracking}
                                                                            style={{ padding: "4px 7px", borderRadius: 6, border: "none", background: "#1d1816", color: "#fff", fontSize: 9.5, fontWeight: 700, cursor: "pointer" }}
                                                                        >
                                                                            {savingTracking ? "..." : "Simpan"}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setEditingOrderId(null)}
                                                                            style={{ padding: "4px 7px", borderRadius: 6, border: "1px solid #dcd1c6", background: "#fff", fontSize: 9.5, cursor: "pointer" }}
                                                                        >
                                                                            Batal
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    {order.tracking_number ? (
                                                                        <div>
                                                                            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#2e7d32" }}>
                                                                                {order.courier}: {order.tracking_number}
                                                                            </div>
                                                                            <button
                                                                                onClick={() => {
                                                                                    setEditingOrderId(order.order_id);
                                                                                    setTrackingInput(order.tracking_number || "");
                                                                                    setCourierInput(order.courier || "SiCepat");
                                                                                }}
                                                                                style={{ marginTop: 2, background: "none", border: "none", color: "#a67c52", fontSize: 9.5, fontWeight: 700, cursor: "pointer", padding: 0 }}
                                                                            >
                                                                                Edit Resi
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => {
                                                                                setEditingOrderId(order.order_id);
                                                                                setTrackingInput("");
                                                                            }}
                                                                            style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #a67c52", background: "#fff", color: "#a67c52", fontSize: 10, fontWeight: 700, cursor: "pointer" }}
                                                                        >
                                                                            Input Resi
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── TAB 3: SEMUA PESANAN DIGITAL ── */}
                    {activeTab === "digital" && (
                        <div>
                            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
                                <div>
                                    <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 30px)", fontWeight: 700, color: "#1d1816", margin: "0 0 2px" }}>
                                        Semua Pesanan Digital
                                    </h1>
                                    <p style={{ fontSize: 12, color: "#7a685e", margin: 0 }}>
                                        Daftar transaksi kado digital, link studio, dan data kontak pembeli.
                                    </p>
                                </div>
                                <button
                                    onClick={fetchOrders}
                                    style={{
                                        padding: "8px 14px", borderRadius: 8, border: "1px solid #dcd1c6",
                                        background: "#ffffff", color: "#1d1816", fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                                    }}
                                >
                                    Perbarui
                                </button>
                            </header>

                            {/* Search & Filter */}
                            <div className="dash-filter-row">
                                <input
                                    type="text"
                                    placeholder="Cari Order ID, Nama, Email, WA..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1px solid #dcd1c6", background: "#fff", fontSize: 12 }}
                                />
                                <select
                                    value={productFilter}
                                    onChange={(e) => setProductFilter(e.target.value)}
                                    style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #dcd1c6", background: "#fff", fontSize: 12, fontWeight: 600 }}
                                >
                                    <option value="all">Semua Produk</option>
                                    <option value="letter">Letter Edition</option>
                                    <option value="voices">Voices Gift</option>
                                    <option value="arcade">Arcade Edition</option>
                                    <option value="retro">Retro Edition</option>
                                    <option value="mixtape">Mixtape Edition</option>
                                    <option value="wrapped">Wrapped Edition</option>
                                    <option value="invitation">Invitation Edition</option>
                                    <option value="loves">Memoria (Loves)</option>
                                    <option value="bundle">Bundle</option>
                                </select>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #dcd1c6", background: "#fff", fontSize: 12, fontWeight: 600 }}
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="paid">Paid / Success</option>
                                    <option value="pending">Pending</option>
                                    <option value="expired">Expired</option>
                                </select>
                            </div>

                            {/* Digital Orders Table */}
                            <div className="dash-table-wrap">
                                {loadingOrders ? (
                                    <div style={{ padding: "30px", textAlign: "center", color: "#7a685e", fontSize: 12.5 }}>Memuat pesanan digital...</div>
                                ) : filteredDigital.length === 0 ? (
                                    <div style={{ padding: "30px", textAlign: "center", color: "#7a685e", fontSize: 12.5 }}>Tidak ada pesanan digital yang cocok.</div>
                                ) : (
                                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 11.5, minWidth: 600 }}>
                                        <thead>
                                            <tr style={{ background: "#faf7f2", borderBottom: "1px solid #e8dfd8" }}>
                                                <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Order ID & Waktu</th>
                                                <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Produk</th>
                                                <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Pembeli</th>
                                                <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Nominal & Status</th>
                                                <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Akses Studio Link</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredDigital.map((order) => {
                                                const cust = getCustomer(order);
                                                const pType = getProductType(order);
                                                const hasLink = Boolean(order.studio_link || order.magic_link);
                                                return (
                                                    <tr key={order.order_id} style={{ borderBottom: "1px solid #f0e9e2" }}>
                                                        <td style={{ padding: "12px", verticalAlign: "top" }}>
                                                            <div style={{ fontWeight: 700, color: "#1d1816" }}>{order.order_id}</div>
                                                            <div style={{ fontSize: 10.5, color: "#8a7b73" }}>{formatWIB(order.created_at)}</div>
                                                        </td>
                                                        <td style={{ padding: "12px", verticalAlign: "top" }}>
                                                            <span style={{
                                                                display: "inline-block", padding: "2px 7px", borderRadius: 6,
                                                                background: "rgba(166,124,82,0.1)", color: "#a67c52", fontWeight: 700,
                                                                fontSize: 10, textTransform: "capitalize",
                                                            }}>
                                                                {pType}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: "12px", verticalAlign: "top" }}>
                                                            <div style={{ fontWeight: 700, color: "#1d1816" }}>{cust.name}</div>
                                                            <div style={{ fontSize: 10.5, color: "#7a685e" }}>{cust.email}</div>
                                                            <div style={{ fontSize: 10.5, color: "#7a685e" }}>{cust.phone}</div>
                                                        </td>
                                                        <td style={{ padding: "12px", verticalAlign: "top" }}>
                                                            <div style={{ fontWeight: 700, color: "#1d1816" }}>
                                                                Rp {order.gross_amount?.toLocaleString("id-ID")}
                                                            </div>
                                                            <span style={{
                                                                display: "inline-block", marginTop: 2, padding: "1px 6px", borderRadius: 999,
                                                                fontSize: 9.5, fontWeight: 700,
                                                                background: order.status === "paid" || order.status === "success" ? "#e8f5e9" : "#fff3e0",
                                                                color: order.status === "paid" || order.status === "success" ? "#2e7d32" : "#e65100",
                                                            }}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: "12px", verticalAlign: "top" }}>
                                                            {hasLink ? (
                                                                <button
                                                                    onClick={() => handleCopyStudioLink(order)}
                                                                    style={{
                                                                        padding: "4px 8px", borderRadius: 6, border: "1px solid #dcd1c6",
                                                                        background: copiedId === `link_${order.order_id}` ? "#2e7d32" : "#faf7f2",
                                                                        color: copiedId === `link_${order.order_id}` ? "#fff" : "#7a685e",
                                                                        fontSize: 10, fontWeight: 700, cursor: "pointer",
                                                                    }}
                                                                >
                                                                    {copiedId === `link_${order.order_id}` ? "Link Tersalin" : "Salin Link Studio"}
                                                                </button>
                                                            ) : (
                                                                <span style={{ fontSize: 10.5, color: "#a6968c" }}>Belum terbit</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
