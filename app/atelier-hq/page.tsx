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
        village?: string;
        district?: string;
        city?: string;
        province?: string;
        postal_code?: string;
        courier?: string;
        zone?: string;
        shipping_cost?: number;
    };
    studio_link?: string;
    magic_link?: string;
    customization_status?: "draft" | "published";
    fulfillment_status?: "pending_customization" | "ready_to_pack" | "shipped";
    tracking_number?: string;
    courier?: string;
    tracking_link?: string;
    biteship_order_id?: string;
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
    const [statusFilter, setStatusFilter] = useState("paid_only");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Resi Edit State
    const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
    const [trackingInput, setTrackingInput] = useState("");
    const [courierInput, setCourierInput] = useState("SiCepat");
    const [savingTracking, setSavingTracking] = useState(false);

    // Biteship Shipping Dispatch & Origin Selection States
    const [dispatchingOrderId, setDispatchingOrderId] = useState<string | null>(null);
    const [dispatchConfirmOrder, setDispatchConfirmOrder] = useState<OrderItem | null>(null);
    const [selectedOriginPreset, setSelectedOriginPreset] = useState<"loc1" | "loc2">("loc1");
    const [loc2Origin, setLoc2Origin] = useState({
        contact_name: "For you, Always. (Studio 2)",
        contact_phone: "081381543981",
        address: "",
        postal_code: "",
        note: "Paket kado hampers siap pick up",
    });

    // Recipient Address Edit State
    const [editingAddressOrder, setEditingAddressOrder] = useState<OrderItem | null>(null);
    const [addressForm, setAddressForm] = useState({
        recipient_name: "",
        recipient_phone: "",
        address: "",
        village: "",
        district: "",
        city: "",
        province: "",
        postal_code: "",
        courier: "SiCepat",
    });
    const [savingAddress, setSavingAddress] = useState(false);

    // Gift Link & Customization Edit States
    const [editingGiftOrderId, setEditingGiftOrderId] = useState<string | null>(null);
    const [giftLinkInput, setGiftLinkInput] = useState("");
    const [customizationStatusInput, setCustomizationStatusInput] = useState<"draft" | "published">("draft");
    const [savingGiftStatus, setSavingGiftStatus] = useState(false);
    const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);
    const [qrModalTitle, setQrModalTitle] = useState<string>("");

    // Inventory & Physical Stock State
    const [inventoryStock, setInventoryStock] = useState<number>(12);
    const [inventoryThreshold, setInventoryThreshold] = useState<number>(3);
    const [stockInputVal, setStockInputVal] = useState<string>("12");
    const [loadingInventory, setLoadingInventory] = useState(false);
    const [savingInventory, setSavingInventory] = useState(false);
    const [inventoryFeedback, setInventoryFeedback] = useState<string | null>(null);

    // Order Delete State
    const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

    const handleDeleteOrder = async (orderId: string) => {
        const confirmed = window.confirm(`Hapus pesanan ${orderId}? Tindakan ini tidak dapat dibatalkan.`);
        if (!confirmed) return;

        setDeletingOrderId(orderId);
        try {
            const res = await fetch("/api/admin/orders", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order_id: orderId }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setOrders((prev) => prev.filter((o) => o.order_id !== orderId));
            } else {
                alert(data.message || "Gagal menghapus pesanan.");
            }
        } catch (e) {
            console.error("Failed to delete order:", e);
            alert("Terjadi kesalahan jaringan.");
        } finally {
            setDeletingOrderId(null);
        }
    };

    useEffect(() => {
        checkAuth();
        try {
            const savedLoc2 = localStorage.getItem("fya_origin_warehouse_loc2");
            if (savedLoc2) {
                setLoc2Origin(JSON.parse(savedLoc2));
            }
        } catch (_) {}
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch("/api/admin/auth");
            if (res.ok) {
                setIsAuthenticated(true);
                fetchOrders();
                fetchInventory();
            } else {
                setIsAuthenticated(false);
            }
        } catch {
            setIsAuthenticated(false);
        }
    };

    const fetchInventory = async () => {
        setLoadingInventory(true);
        try {
            const res = await fetch("/api/admin/inventory");
            const data = await res.json();
            if (res.ok && data.success && data.inventory?.length > 0) {
                const item = data.inventory[0];
                setInventoryStock(item.stock);
                setStockInputVal(String(item.stock));
                setInventoryThreshold(item.low_stock_threshold || 3);
            }
        } catch (e) {
            console.error("Failed to fetch inventory:", e);
        } finally {
            setLoadingInventory(false);
        }
    };

    const handleUpdateStock = async (newVal: number) => {
        const targetStock = Math.max(0, newVal);
        setSavingInventory(true);
        setInventoryFeedback(null);
        try {
            const res = await fetch("/api/admin/inventory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    product_id: "unbox-the-memory",
                    stock: targetStock,
                    low_stock_threshold: inventoryThreshold,
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setInventoryStock(targetStock);
                setStockInputVal(String(targetStock));
                setInventoryFeedback(`Stok berhasil diupdate jadi ${targetStock} Box!`);
                setTimeout(() => setInventoryFeedback(null), 3500);
            }
        } catch (e) {
            console.error("Failed to update stock:", e);
            setInventoryFeedback("Gagal memperbarui stok.");
        } finally {
            setSavingInventory(false);
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
                fetchInventory();
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

    const getDigitalFormatName = (order: OrderItem) => {
        const raw = (order.product_type || order.product_id || "").replace("unbox_", "").replace("_3slot", "");
        const map: Record<string, string> = {
            loves: "Memoria",
            letter: "Letter",
            voices: "Voices",
            arcade: "Arcade",
            retro: "Retro",
            wrapped: "Wrapped",
            mixtape: "Mixtape",
            invitation: "Invitation",
        };
        return map[raw] || raw || "Memoria";
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

    const handleOpenEditAddress = (order: OrderItem) => {
        const ship = parseMeta(order.shipping_details);
        setAddressForm({
            recipient_name: ship.recipient_name || order.customer_name || "",
            recipient_phone: ship.recipient_phone || order.customer_phone || "",
            address: ship.address || "",
            village: ship.village || "",
            district: ship.district || "",
            city: ship.city || "",
            province: ship.province || "",
            postal_code: ship.postal_code || "",
            courier: ship.courier || order.courier || "SiCepat",
        });
        setEditingAddressOrder(order);
    };

    const handleSaveRecipientAddress = async () => {
        if (!editingAddressOrder) return;
        setSavingAddress(true);
        try {
            const res = await fetch("/api/admin/update-resi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_id: editingAddressOrder.order_id,
                    shipping_details: addressForm,
                    courier: addressForm.courier,
                }),
            });
            if (res.ok) {
                setOrders(orders.map(o => o.order_id === editingAddressOrder.order_id ? {
                    ...o,
                    shipping_details: JSON.stringify(addressForm),
                    courier: addressForm.courier,
                } : o));
                setEditingAddressOrder(null);
            } else {
                alert("Gagal memperbarui alamat penerima.");
            }
        } catch {
            alert("Terjadi kesalahan sistem saat menyimpan alamat.");
        } finally {
            setSavingAddress(false);
        }
    };

    const handleOpenDispatchModal = (order: OrderItem) => {
        setDispatchConfirmOrder(order);
    };

    const handleExecuteDispatch = async (order: OrderItem, originDetails: any) => {
        setDispatchingOrderId(order.order_id);
        try {
            const res = await fetch("/api/shipping/dispatch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_id: order.order_id,
                    order_data: order,
                    origin_details: originDetails,
                }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                alert(`🎉 ${data.message}\n\nNomor Resi: ${data.tracking_number}\nKurir: ${data.courier}`);
                const updatedOrder: OrderItem = {
                    ...order,
                    tracking_number: data.tracking_number,
                    courier: data.courier,
                    tracking_link: data.tracking_link,
                    biteship_order_id: data.biteship_order_id,
                    fulfillment_status: "shipped",
                };
                // Update local state
                setOrders((prev) =>
                    prev.map((o) => (o.order_id === order.order_id ? updatedOrder : o))
                );
                setDispatchConfirmOrder(null);
            } else {
                alert(`⚠️ Gagal dispatch Biteship: ${data.message || "Terjadi kesalahan."}`);
            }
        } catch (err) {
            console.error("Failed to dispatch order to Biteship:", err);
            alert("Terjadi kesalahan jaringan saat memproses ke Biteship.");
        } finally {
            setDispatchingOrderId(null);
        }
    };

    const handleSaveGiftStatus = async (orderId: string) => {
        setSavingGiftStatus(true);
        try {
            const currentOrder = orders.find(o => o.order_id === orderId);
            const isFinished = customizationStatusInput === "published";
            const targetFulfillment = (currentOrder?.tracking_number || currentOrder?.fulfillment_status === "shipped")
                ? "shipped"
                : (isFinished ? "ready_to_pack" : "pending_customization");

            const res = await fetch("/api/admin/update-resi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_id: orderId,
                    magic_link: giftLinkInput.trim() || undefined,
                    customization_status: customizationStatusInput,
                    fulfillment_status: targetFulfillment,
                }),
            });

            if (res.ok) {
                setOrders(orders.map(o => o.order_id === orderId ? {
                    ...o,
                    magic_link: giftLinkInput.trim() || o.magic_link,
                    customization_status: customizationStatusInput,
                    fulfillment_status: targetFulfillment,
                } : o));
                setEditingGiftOrderId(null);
            } else {
                alert("Gagal memperbarui status kado.");
            }
        } catch {
            alert("Terjadi kesalahan sistem saat memperbarui status kado.");
        } finally {
            setSavingGiftStatus(false);
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

    // Physical metrics (calculated from PAID orders)
    const paidPhysicalOrders = physicalOrders.filter(o => o.status === "paid" || o.status === "success");
    const pendingCustomizationCount = paidPhysicalOrders.filter(o => o.customization_status !== "published" && o.fulfillment_status !== "shipped").length;
    const readyToPackCount = paidPhysicalOrders.filter(o => o.customization_status === "published" && o.fulfillment_status !== "shipped").length;
    const shippedPhysicalCount = paidPhysicalOrders.filter(o => o.fulfillment_status === "shipped").length;
    const unpaidPhysicalCount = physicalOrders.filter(o => o.status === "pending").length;

    // Filtered physical view
    const filteredPhysical = physicalOrders.filter(o => {
        const cust = getCustomer(o);
        const ship = parseMeta(o.shipping_details);
        const matchesSearch =
            o.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (ship.recipient_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            cust.phone.includes(searchQuery);

        if (!matchesSearch) return false;

        const isPaid = o.status === "paid" || o.status === "success";
        if (statusFilter === "paid_only") return isPaid;
        if (statusFilter === "all") return true;
        if (statusFilter === "pending_payment") return o.status === "pending";
        if (statusFilter === "pending_customization") return isPaid && (o.customization_status !== "published" && o.fulfillment_status !== "shipped");
        if (statusFilter === "ready_to_pack") return isPaid && (o.customization_status === "published" && o.fulfillment_status !== "shipped");
        if (statusFilter === "shipped") return isPaid && o.fulfillment_status === "shipped";
        return true;
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

                            {/* Live Stock & Inventory Control */}
                            <div style={{
                                background: "#ffffff",
                                padding: "18px 20px",
                                borderRadius: 14,
                                border: "1px solid #e8dfd8",
                                marginBottom: 16,
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                                boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 10,
                                            background: "rgba(166,124,82,0.1)",
                                            color: "#a67c52",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                            </svg>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                                Inventaris Gift Box Fisik (Unbox the Memory)
                                            </div>
                                            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 2 }}>
                                                <span style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "#1d1816" }}>
                                                    {inventoryStock} <span style={{ fontSize: 16, fontWeight: 600, color: "#7a685e" }}>Box Tersedia</span>
                                                </span>
                                                <span style={{
                                                    padding: "3px 8px",
                                                    borderRadius: 6,
                                                    fontSize: 10.5,
                                                    fontWeight: 700,
                                                    background: inventoryStock === 0 ? "#ffebee" : inventoryStock <= inventoryThreshold ? "#fff3e0" : "#e8f5e9",
                                                    color: inventoryStock === 0 ? "#c62828" : inventoryStock <= inventoryThreshold ? "#e65100" : "#2e7d32",
                                                }}>
                                                    {inventoryStock === 0 ? "HABIS (SOLD OUT)" : inventoryStock <= inventoryThreshold ? "STOK MENIPIS" : "STOK AMAN"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Increment Controls & Manual Input */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                        <div style={{ display: "flex", gap: 4 }}>
                                            <button
                                                onClick={() => handleUpdateStock(inventoryStock - 1)}
                                                disabled={savingInventory || inventoryStock <= 0}
                                                style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #dcd1c6", background: "#faf7f2", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                                                title="Kurangi 1"
                                            >
                                                -1
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStock(inventoryStock + 1)}
                                                disabled={savingInventory}
                                                style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #dcd1c6", background: "#faf7f2", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                                                title="Tambah 1"
                                            >
                                                +1
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStock(inventoryStock + 5)}
                                                disabled={savingInventory}
                                                style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #dcd1c6", background: "#faf7f2", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                                                title="Tambah 5"
                                            >
                                                +5
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStock(inventoryStock + 10)}
                                                disabled={savingInventory}
                                                style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #dcd1c6", background: "#faf7f2", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                                                title="Tambah 10"
                                            >
                                                +10
                                            </button>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <input
                                                type="number"
                                                min="0"
                                                value={stockInputVal}
                                                onChange={(e) => setStockInputVal(e.target.value)}
                                                style={{
                                                    width: 65,
                                                    padding: "6px 8px",
                                                    borderRadius: 6,
                                                    border: "1px solid #dcd1c6",
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                    textAlign: "center"
                                                }}
                                            />
                                            <button
                                                onClick={() => handleUpdateStock(parseInt(stockInputVal, 10) || 0)}
                                                disabled={savingInventory}
                                                style={{
                                                    padding: "7px 12px",
                                                    borderRadius: 6,
                                                    border: "none",
                                                    background: "#1d1816",
                                                    color: "#fff",
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    cursor: "pointer"
                                                }}
                                            >
                                                {savingInventory ? "..." : "Set Stok"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {inventoryFeedback && (
                                    <div style={{ fontSize: 11, fontWeight: 600, color: "#2e7d32", background: "#e8f5e9", padding: "6px 10px", borderRadius: 6 }}>
                                        {inventoryFeedback}
                                    </div>
                                )}
                            </div>

                            {/* Physical Counters */}
                            <div className="dash-stats-grid-3">
                                <div style={{ background: "#ffffff", padding: "14px 16px", borderRadius: 12, border: "1px solid #e8dfd8" }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: "#b26a00", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                        Belum Bayar (Pending)
                                    </div>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#b26a00", marginTop: 2 }}>
                                        {unpaidPhysicalCount}
                                    </div>
                                </div>
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
                                        Siap Cetak & Packing
                                    </div>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#a67c52", marginTop: 2 }}>
                                        {readyToPackCount}
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
                                    <option value="paid_only">Hanya Pesanan Lunas (Siap Diproses)</option>
                                    <option value="all">Semua Pesanan (Termasuk Belum Bayar)</option>
                                    <option value="pending_payment">Belum Bayar (Pending)</option>
                                    <option value="pending_customization">Menunggu Customer Mengisi</option>
                                    <option value="ready_to_pack">Siap Cetak & Packing</option>
                                    <option value="shipped">Terkirim (Resi Ada)</option>
                                </select>
                            </div>

                            {/* Physical Orders Table */}
                            <div className="dash-table-wrap">
                                {loadingOrders ? (
                                    <div style={{ padding: "30px", textAlign: "center", color: "#7a685e", fontSize: 12.5 }}>Memuat pesanan fisik...</div>
                                ) : filteredPhysical.length === 0 ? (
                                    <div style={{ padding: "30px", textAlign: "center", color: "#7a685e", fontSize: 12.5 }}>Tidak ada pesanan fisik yang cocok.</div>
                                ) : (
                                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 11.5, minWidth: 720 }}>
                                        <thead>
                                            <tr style={{ background: "#faf7f2", borderBottom: "1px solid #e8dfd8" }}>
                                                <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>ID & Waktu</th>
                                                <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Bayar</th>
                                                <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Pemesan</th>
                                                <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Format Kado</th>
                                                <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Alamat Penerima</th>
                                                <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Kado Digital & QR</th>
                                                <th style={{ padding: "10px 12px", fontWeight: 700, color: "#7a685e" }}>Pengiriman & Resi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPhysical.map((order) => {
                                                const cust = getCustomer(order);
                                                const ship = parseMeta(order.shipping_details);
                                                const isPaid = order.status === "paid" || order.status === "success";
                                                const giftLink = order.magic_link || order.studio_link || "";
                                                const isCustomized = order.customization_status === "published";

                                                return (
                                                    <tr key={order.order_id} style={{ borderBottom: "1px solid #f0e9e2" }}>
                                                        <td style={{ padding: "12px", verticalAlign: "top" }}>
                                                            <div style={{ fontWeight: 700, color: "#1d1816" }}>{order.order_id}</div>
                                                            <div style={{ fontSize: 10.5, color: "#8a7b73" }}>{formatWIB(order.created_at)}</div>
                                                            <div style={{ fontSize: 11, fontWeight: 700, color: "#a67c52", marginTop: 2 }}>
                                                                Rp {order.gross_amount?.toLocaleString("id-ID")}
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteOrder(order.order_id)}
                                                                disabled={deletingOrderId === order.order_id}
                                                                style={{
                                                                    marginTop: 6,
                                                                    padding: "2px 7px",
                                                                    borderRadius: 4,
                                                                    border: "1px solid #ffcdd2",
                                                                    background: "#fff5f5",
                                                                    color: "#c62828",
                                                                    fontSize: 9.5,
                                                                    fontWeight: 600,
                                                                    cursor: "pointer",
                                                                    display: "inline-block",
                                                                }}
                                                                title="Hapus pesanan ini"
                                                            >
                                                                {deletingOrderId === order.order_id ? "Menghapus..." : "Hapus"}
                                                            </button>
                                                        </td>
                                                        <td style={{ padding: "12px", verticalAlign: "top" }}>
                                                            <span style={{
                                                                display: "inline-block", padding: "3px 8px", borderRadius: 6,
                                                                fontSize: 10, fontWeight: 700,
                                                                background: isPaid ? "#e8f5e9" : order.status === "pending" ? "#fff8e1" : "#ffebee",
                                                                color: isPaid ? "#2e7d32" : order.status === "pending" ? "#b26a00" : "#c62828",
                                                            }}>
                                                                {isPaid ? "LUNAS" : order.status === "pending" ? "BELUM BAYAR" : "BATAL"}
                                                            </span>
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
                                                                {getDigitalFormatName(order)}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: "12px", verticalAlign: "top", maxWidth: 220 }}>
                                                            <div style={{ fontWeight: 700, color: "#1d1816" }}>
                                                                {ship.recipient_name || "-"} ({ship.recipient_phone || "-"})
                                                            </div>
                                                            <div style={{ fontSize: 10.5, color: "#59483f", lineHeight: 1.3, marginTop: 2 }}>
                                                                {ship.address ? (
                                                                    <>
                                                                        {ship.address}
                                                                        {ship.village ? `, Kel. ${ship.village}` : ""}
                                                                        {ship.district ? `, Kec. ${ship.district}` : ""}
                                                                        {ship.city ? `, ${ship.city}` : ""}
                                                                        {ship.province ? `, ${ship.province}` : ""}
                                                                        {ship.postal_code ? ` ${ship.postal_code}` : ""}
                                                                    </>
                                                                ) : (
                                                                    <span style={{ color: "#d32f2f", fontStyle: "italic", fontSize: 10 }}>
                                                                        Alamat belum diisi / kosong
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                                                                {ship.address && (
                                                                    <button
                                                                        onClick={() => handleCopyAddress(order)}
                                                                        style={{
                                                                            padding: "3px 8px", borderRadius: 6, border: "1px solid #dcd1c6",
                                                                            background: copiedId === `addr_${order.order_id}` ? "#2e7d32" : "#faf7f2",
                                                                            color: copiedId === `addr_${order.order_id}` ? "#fff" : "#7a685e",
                                                                            fontSize: 9.5, fontWeight: 700, cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        {copiedId === `addr_${order.order_id}` ? "Tersalin" : "Salin Alamat"}
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => handleOpenEditAddress(order)}
                                                                    style={{
                                                                        padding: "3px 8px", borderRadius: 6, border: "1px solid #dcd1c6",
                                                                        background: "#faf7f2", color: "#a67c52",
                                                                        fontSize: 9.5, fontWeight: 700, cursor: "pointer",
                                                                    }}
                                                                >
                                                                    ✏️ Edit Alamat
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: "12px", verticalAlign: "top", minWidth: 160 }}>
                                                            {editingGiftOrderId === order.order_id ? (
                                                                <div style={{ display: "flex", flexDirection: "column", gap: 5, background: "#faf7f2", padding: 8, borderRadius: 8, border: "1px solid #dcd1c6" }}>
                                                                    <div style={{ fontSize: 10, fontWeight: 700, color: "#7a685e" }}>Status Kustomisasi:</div>
                                                                    <select
                                                                        value={customizationStatusInput}
                                                                        onChange={(e) => setCustomizationStatusInput(e.target.value as any)}
                                                                        style={{ padding: "4px", borderRadius: 6, border: "1px solid #dcd1c6", fontSize: 10.5 }}
                                                                    >
                                                                        <option value="draft">Menunggu Pengisian</option>
                                                                        <option value="published">Selesai Diisi / Siap Packing</option>
                                                                    </select>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Link Kado (https://...)"
                                                                        value={giftLinkInput}
                                                                        onChange={(e) => setGiftLinkInput(e.target.value)}
                                                                        style={{ padding: "4px 6px", borderRadius: 6, border: "1px solid #dcd1c6", fontSize: 10.5 }}
                                                                    />
                                                                    <div style={{ display: "flex", gap: 4 }}>
                                                                        <button
                                                                            onClick={() => handleSaveGiftStatus(order.order_id)}
                                                                            disabled={savingGiftStatus}
                                                                            style={{ padding: "4px 8px", borderRadius: 6, border: "none", background: "#1d1816", color: "#fff", fontSize: 9.5, fontWeight: 700, cursor: "pointer" }}
                                                                        >
                                                                            {savingGiftStatus ? "..." : "Simpan"}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setEditingGiftOrderId(null)}
                                                                            style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #dcd1c6", background: "#fff", fontSize: 9.5, cursor: "pointer" }}
                                                                        >
                                                                            Batal
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                                                    <span style={{
                                                                        display: "inline-block", padding: "3px 7px", borderRadius: 6, fontSize: 10, fontWeight: 700, width: "fit-content",
                                                                        background: isCustomized ? "#e8f5e9" : "#fff3e0",
                                                                        color: isCustomized ? "#2e7d32" : "#e65100",
                                                                    }}>
                                                                        {isCustomized ? "Selesai Diisi / Siap Packing" : "Menunggu Pengisian"}
                                                                    </span>

                                                                    {giftLink && (
                                                                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 2 }}>
                                                                            <a
                                                                                href={giftLink}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                style={{ fontSize: 9.5, fontWeight: 700, color: "#a67c52", textDecoration: "none", background: "#faf7f2", padding: "2px 6px", borderRadius: 4, border: "1px solid #e8dfd8" }}
                                                                            >
                                                                                Buka Kado ↗
                                                                            </a>
                                                                            <button
                                                                                onClick={() => {
                                                                                    setQrModalUrl(giftLink);
                                                                                    setQrModalTitle(`${order.order_id} - ${cust.name}`);
                                                                                }}
                                                                                style={{ fontSize: 9.5, fontWeight: 700, color: "#1d1816", background: "#faf7f2", border: "1px solid #e8dfd8", padding: "2px 6px", borderRadius: 4, cursor: "pointer" }}
                                                                            >
                                                                                Cetak QR
                                                                            </button>
                                                                        </div>
                                                                    )}

                                                                    <button
                                                                        onClick={() => {
                                                                            setEditingGiftOrderId(order.order_id);
                                                                            setGiftLinkInput(giftLink);
                                                                            setCustomizationStatusInput(order.customization_status || "draft");
                                                                        }}
                                                                        style={{ background: "none", border: "none", color: "#a67c52", fontSize: 9.5, fontWeight: 700, cursor: "pointer", padding: 0, textAlign: "left", marginTop: 2 }}
                                                                    >
                                                                        {giftLink ? "Ubah Status / Link" : "+ Masukkan Link Kado"}
                                                                    </button>
                                                                </div>
                                                            )}
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
                                                                        <option value="GoSend">GoSend</option>
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
                                                                            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                                                                                <span style={{
                                                                                    fontSize: 10,
                                                                                    fontWeight: 800,
                                                                                    color: "#1b5e20",
                                                                                    backgroundColor: "#e8f5e9",
                                                                                    padding: "2px 6px",
                                                                                    borderRadius: 4,
                                                                                    border: "1px solid #c8e6c9"
                                                                                }}>
                                                                                    {order.courier || "Kurir"}
                                                                                </span>
                                                                                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#1d1816", fontFamily: "monospace" }}>
                                                                                    {order.tracking_number}
                                                                                </span>
                                                                            </div>

                                                                            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6, flexWrap: "wrap" }}>
                                                                                {order.tracking_link && (
                                                                                    <a
                                                                                        href={order.tracking_link}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        style={{
                                                                                            display: "inline-flex",
                                                                                            alignItems: "center",
                                                                                            gap: 4,
                                                                                            padding: "4px 8px",
                                                                                            borderRadius: 6,
                                                                                            border: "1px solid #2e7d32",
                                                                                            background: "#e8f5e9",
                                                                                            color: "#2e7d32",
                                                                                            fontSize: 9.5,
                                                                                            fontWeight: 700,
                                                                                            textDecoration: "none"
                                                                                        }}
                                                                                    >
                                                                                        🌐 Buka di Biteship
                                                                                    </a>
                                                                                )}

                                                                                <button
                                                                                    onClick={() => {
                                                                                        setEditingOrderId(order.order_id);
                                                                                        setTrackingInput(order.tracking_number || "");
                                                                                        setCourierInput(order.courier || "SiCepat");
                                                                                    }}
                                                                                    style={{ background: "none", border: "none", color: "#a67c52", fontSize: 9.5, fontWeight: 700, cursor: "pointer", padding: 0 }}
                                                                                >
                                                                                    Edit Resi
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                                                            <div style={{ fontSize: 9.5, color: "#6e5c53" }}>
                                                                                Kurir: <strong>{ship.courier || "SiCepat"}</strong>
                                                                            </div>

                                                                            <button
                                                                                onClick={() => handleOpenDispatchModal(order)}
                                                                                disabled={dispatchingOrderId === order.order_id}
                                                                                style={{
                                                                                    padding: "5px 9px",
                                                                                    borderRadius: 6,
                                                                                    border: "none",
                                                                                    background: dispatchingOrderId === order.order_id ? "#8d7971" : "#2e7d32",
                                                                                    color: "#fff",
                                                                                    fontSize: 10,
                                                                                    fontWeight: 800,
                                                                                    cursor: dispatchingOrderId === order.order_id ? "not-allowed" : "pointer",
                                                                                    display: "inline-flex",
                                                                                    alignItems: "center",
                                                                                    gap: 4,
                                                                                    width: "fit-content",
                                                                                    boxShadow: "0 2px 4px rgba(46,125,50,0.15)"
                                                                                }}
                                                                            >
                                                                                {dispatchingOrderId === order.order_id ? "Memproses..." : "Request Pick-up (Biteship)"}
                                                                            </button>

                                                                            <button
                                                                                onClick={() => {
                                                                                    setEditingOrderId(order.order_id);
                                                                                    setTrackingInput("");
                                                                                    setCourierInput(ship.courier || "SiCepat");
                                                                                }}
                                                                                style={{
                                                                                    background: "none",
                                                                                    border: "none",
                                                                                    color: "#8d7971",
                                                                                    fontSize: 9,
                                                                                    fontWeight: 600,
                                                                                    cursor: "pointer",
                                                                                    padding: 0,
                                                                                    textAlign: "left"
                                                                                }}
                                                                            >
                                                                                + Input Resi Manual
                                                                            </button>
                                                                        </div>
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
                                                            <button
                                                                onClick={() => handleDeleteOrder(order.order_id)}
                                                                disabled={deletingOrderId === order.order_id}
                                                                style={{
                                                                    marginTop: 6,
                                                                    padding: "2px 7px",
                                                                    borderRadius: 4,
                                                                    border: "1px solid #ffcdd2",
                                                                    background: "#fff5f5",
                                                                    color: "#c62828",
                                                                    fontSize: 9.5,
                                                                    fontWeight: 600,
                                                                    cursor: "pointer",
                                                                    display: "inline-block",
                                                                }}
                                                                title="Hapus pesanan ini"
                                                            >
                                                                {deletingOrderId === order.order_id ? "Menghapus..." : "Hapus"}
                                                            </button>
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

            {/* ── QR CODE MODAL FOR PRINTING ── */}
            {qrModalUrl && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(6px)",
                    zIndex: 100000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px"
                }}>
                    <div style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "20px",
                        padding: "28px",
                        maxWidth: "400px",
                        width: "100%",
                        textAlign: "center",
                        boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
                        border: "1px solid rgba(205,171,143,0.3)"
                    }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#a67c52", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
                            Cetak Kartu QR Fisik
                        </div>
                        <h3 style={{ fontFamily: "var(--font-display, Cormorant Garamond, serif)", fontSize: "1.4rem", fontWeight: 600, color: "#1d1816", margin: "0 0 16px" }}>
                            {qrModalTitle || "QR Code Kado Digital"}
                        </h3>

                        <div style={{
                            padding: "16px",
                            backgroundColor: "#faf7f2",
                            borderRadius: "16px",
                            border: "1px solid #e8dfd8",
                            display: "inline-block",
                            marginBottom: "16px"
                        }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(qrModalUrl)}`}
                                alt="QR Code Preview"
                                style={{ width: "240px", height: "240px", display: "block", borderRadius: "8px" }}
                            />
                        </div>

                        <div style={{ fontSize: "0.8rem", color: "#6e5c53", wordBreak: "break-all", background: "#f5eee6", padding: "8px 12px", borderRadius: "8px", marginBottom: "20px" }}>
                            {qrModalUrl}
                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>
                            <a
                                href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(qrModalUrl)}`}
                                download="qr_code_kado.png"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    flex: 1,
                                    padding: "12px",
                                    borderRadius: "10px",
                                    backgroundColor: "#1d1816",
                                    color: "#faf7f2",
                                    fontSize: "0.86rem",
                                    fontWeight: 700,
                                    textDecoration: "none",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                Download HD
                            </a>
                            <button
                                onClick={() => setQrModalUrl(null)}
                                style={{
                                    padding: "12px 18px",
                                    borderRadius: "10px",
                                    backgroundColor: "#faf7f2",
                                    color: "#6e5c53",
                                    border: "1px solid #dcd1c6",
                                    fontSize: "0.86rem",
                                    fontWeight: 700,
                                    cursor: "pointer"
                                }}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── 5. MODAL: EDIT ALAMAT PENERIMA ── */}
            {editingAddressOrder && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(29, 24, 22, 0.65)",
                    backdropFilter: "blur(4px)",
                    zIndex: 9999,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "16px",
                    fontFamily: "var(--font-sans)",
                }}>
                    <div style={{
                        background: "#ffffff",
                        width: "100%", maxWidth: "520px",
                        borderRadius: "16px",
                        padding: "24px",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                        maxHeight: "90vh",
                        overflowY: "auto",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#1d1816" }}>
                                    ✏️ Edit Alamat Penerima
                                </h3>
                                <div style={{ fontSize: "0.8rem", color: "#8d7971", marginTop: 2 }}>
                                    Order ID: {editingAddressOrder.order_id}
                                </div>
                            </div>
                            <button
                                onClick={() => setEditingAddressOrder(null)}
                                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#8d7971" }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#59483f", display: "block", marginBottom: 4 }}>Nama Penerima</label>
                                <input
                                    type="text"
                                    value={addressForm.recipient_name}
                                    onChange={(e) => setAddressForm({ ...addressForm, recipient_name: e.target.value })}
                                    style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #dcd1c6", fontSize: "0.85rem" }}
                                    placeholder="Nama Lengkap"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#59483f", display: "block", marginBottom: 4 }}>No. WhatsApp / HP</label>
                                <input
                                    type="text"
                                    value={addressForm.recipient_phone}
                                    onChange={(e) => setAddressForm({ ...addressForm, recipient_phone: e.target.value })}
                                    style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #dcd1c6", fontSize: "0.85rem" }}
                                    placeholder="08123456789"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: "12px" }}>
                            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#59483f", display: "block", marginBottom: 4 }}>Alamat Lengkap (Jalan, No Rumah, RT/RW, Patokan)</label>
                            <textarea
                                rows={2}
                                value={addressForm.address}
                                onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                                style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #dcd1c6", fontSize: "0.85rem", resize: "vertical" }}
                                placeholder="Jl. Mawar No. 12, RT 01/RW 02..."
                            />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#59483f", display: "block", marginBottom: 4 }}>Kelurahan / Desa</label>
                                <input
                                    type="text"
                                    value={addressForm.village}
                                    onChange={(e) => setAddressForm({ ...addressForm, village: e.target.value })}
                                    style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #dcd1c6", fontSize: "0.85rem" }}
                                    placeholder="Kelurahan"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#59483f", display: "block", marginBottom: 4 }}>Kecamatan</label>
                                <input
                                    type="text"
                                    value={addressForm.district}
                                    onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                                    style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #dcd1c6", fontSize: "0.85rem" }}
                                    placeholder="Kecamatan"
                                />
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#59483f", display: "block", marginBottom: 4 }}>Kota / Kabupaten</label>
                                <input
                                    type="text"
                                    value={addressForm.city}
                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                    style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #dcd1c6", fontSize: "0.85rem" }}
                                    placeholder="Kota / Kabupaten"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#59483f", display: "block", marginBottom: 4 }}>Provinsi</label>
                                <input
                                    type="text"
                                    value={addressForm.province}
                                    onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                                    style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #dcd1c6", fontSize: "0.85rem" }}
                                    placeholder="Provinsi"
                                />
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#59483f", display: "block", marginBottom: 4 }}>Kode Pos</label>
                                <input
                                    type="text"
                                    value={addressForm.postal_code}
                                    onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                                    style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #dcd1c6", fontSize: "0.85rem" }}
                                    placeholder="Contoh: 16820"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#59483f", display: "block", marginBottom: 4 }}>Pilihan Kurir</label>
                                <select
                                    value={addressForm.courier}
                                    onChange={(e) => setAddressForm({ ...addressForm, courier: e.target.value })}
                                    style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #dcd1c6", fontSize: "0.85rem" }}
                                >
                                    <option value="SiCepat">SiCepat (Reguler)</option>
                                    <option value="JNE">JNE (Reguler)</option>
                                    <option value="J&T">J&T (EZ)</option>
                                    <option value="Anteraja">Anteraja (Reguler)</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                onClick={handleSaveRecipientAddress}
                                disabled={savingAddress}
                                style={{
                                    flex: 1, padding: "12px", borderRadius: "10px",
                                    background: "#1d1816", color: "#fff",
                                    fontSize: "0.88rem", fontWeight: 700, border: "none", cursor: "pointer"
                                }}
                            >
                                {savingAddress ? "Menyimpan..." : "Simpan Alamat"}
                            </button>
                            <button
                                onClick={() => setEditingAddressOrder(null)}
                                style={{
                                    padding: "12px 18px", borderRadius: "10px",
                                    background: "#faf7f2", color: "#6e5c53",
                                    border: "1px solid #dcd1c6", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer"
                                }}
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── 6. MODAL: KONFIRMASI DISPATCH & PILIH ASAL PICK-UP ── */}
            {dispatchConfirmOrder && (() => {
                const ship = parseMeta(dispatchConfirmOrder.shipping_details);
                const courierName = ship.courier || dispatchConfirmOrder.courier || "SiCepat Reguler";
                const recipientName = ship.recipient_name || dispatchConfirmOrder.customer_name || "-";
                const fullAddr = [ship.address, ship.village, ship.district, ship.city, ship.province, ship.postal_code].filter(Boolean).join(", ");

                const loc1 = {
                    contact_name: "For you, Always.",
                    contact_phone: "081381543981",
                    address: "Limus Pratama Regency, Limus Nunggal, Kec. Cileungsi, Kabupaten Bogor, Jawa Barat 16820",
                    postal_code: "16820",
                    note: "Paket kado hampers siap pick up di depan rumah",
                };

                const handleSaveLoc2ToStorage = (updated: typeof loc2Origin) => {
                    setLoc2Origin(updated);
                    try {
                        localStorage.setItem("fya_origin_warehouse_loc2", JSON.stringify(updated));
                    } catch (_) {}
                };

                const currentOrigin = selectedOriginPreset === "loc1" ? loc1 : loc2Origin;

                return (
                    <div style={{
                        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: "rgba(29, 24, 22, 0.65)",
                        backdropFilter: "blur(4px)",
                        zIndex: 9999,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "16px",
                        fontFamily: "var(--font-sans)",
                    }}>
                        <div style={{
                            background: "#ffffff",
                            width: "100%", maxWidth: "560px",
                            borderRadius: "16px",
                            padding: "24px",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                            maxHeight: "92vh",
                            overflowY: "auto",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#1d1816" }}>
                                        📦 Request Pick-up Kurir (Biteship)
                                    </h3>
                                    <div style={{ fontSize: "0.8rem", color: "#8d7971", marginTop: 2 }}>
                                        Order: {dispatchConfirmOrder.order_id}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setDispatchConfirmOrder(null)}
                                    style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#8d7971" }}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Recipient summary card */}
                            <div style={{ background: "#faf7f2", border: "1px solid #dcd1c6", borderRadius: 12, padding: "14px 16px", marginBottom: 18 }}>
                                <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "#8d7971", marginBottom: 4 }}>
                                    Tujuan Pengantaran (Penerima)
                                </div>
                                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#1d1816" }}>
                                    {recipientName} ({ship.recipient_phone || "-"})
                                </div>
                                <div style={{ fontSize: "0.85rem", color: "#59483f", marginTop: 2, lineHeight: 1.35 }}>
                                    {fullAddr || <span style={{ color: "#d32f2f", fontWeight: 700 }}>⚠️ Alamat penerima masih kosong! Klik tombol Edit Alamat dulu di tabel.</span>}
                                </div>
                                <div style={{ marginTop: 6, fontSize: "0.82rem", fontWeight: 700, color: "#2e7d32" }}>
                                    Kurir: {courierName}
                                </div>
                            </div>

                            {/* Warehouse Origin Selection */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1d1816", display: "block", marginBottom: 8 }}>
                                    📍 Pilih Lokasi Penjemputan Paket (Alamat Pengirim):
                                </label>

                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {/* Preset 1: Cileungsi */}
                                    <div
                                        onClick={() => setSelectedOriginPreset("loc1")}
                                        style={{
                                            border: selectedOriginPreset === "loc1" ? "2px solid #2e7d32" : "1.5px solid #dcd1c6",
                                            borderRadius: 12,
                                            padding: "12px 14px",
                                            background: selectedOriginPreset === "loc1" ? "#f1f8e9" : "#fff",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                            <input
                                                type="radio"
                                                name="originPreset"
                                                checked={selectedOriginPreset === "loc1"}
                                                onChange={() => setSelectedOriginPreset("loc1")}
                                            />
                                            <strong style={{ fontSize: "0.9rem", color: "#1d1816" }}>
                                                Lokasi 1 (Cileungsi - Rumah)
                                            </strong>
                                            <span style={{ fontSize: "0.72rem", background: "#e8f5e9", color: "#2e7d32", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>
                                                Default
                                            </span>
                                        </div>
                                        <div style={{ fontSize: "0.82rem", color: "#59483f", marginLeft: 22, lineHeight: 1.35 }}>
                                            {loc1.contact_name} — {loc1.contact_phone}<br />
                                            {loc1.address} (Kode Pos: {loc1.postal_code})
                                        </div>
                                    </div>

                                    {/* Preset 2: Tempat Kedua */}
                                    <div
                                        onClick={() => setSelectedOriginPreset("loc2")}
                                        style={{
                                            border: selectedOriginPreset === "loc2" ? "2px solid #2e7d32" : "1.5px solid #dcd1c6",
                                            borderRadius: 12,
                                            padding: "12px 14px",
                                            background: selectedOriginPreset === "loc2" ? "#f1f8e9" : "#fff",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                            <input
                                                type="radio"
                                                name="originPreset"
                                                checked={selectedOriginPreset === "loc2"}
                                                onChange={() => setSelectedOriginPreset("loc2")}
                                            />
                                            <strong style={{ fontSize: "0.9rem", color: "#1d1816" }}>
                                                Lokasi 2 (Tempat Kedua / Studio Lain)
                                            </strong>
                                        </div>

                                        {selectedOriginPreset === "loc2" ? (
                                            <div style={{ marginTop: 10, marginLeft: 22, display: "flex", flexDirection: "column", gap: 8 }} onClick={e => e.stopPropagation()}>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Nama Pengirim / PIC"
                                                        value={loc2Origin.contact_name}
                                                        onChange={(e) => handleSaveLoc2ToStorage({ ...loc2Origin, contact_name: e.target.value })}
                                                        style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #dcd1c6", fontSize: "0.8rem" }}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="No. HP Pengirim"
                                                        value={loc2Origin.contact_phone}
                                                        onChange={(e) => handleSaveLoc2ToStorage({ ...loc2Origin, contact_phone: e.target.value })}
                                                        style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #dcd1c6", fontSize: "0.8rem" }}
                                                    />
                                                </div>
                                                <textarea
                                                    rows={2}
                                                    placeholder="Alamat Lengkap Penjemputan..."
                                                    value={loc2Origin.address}
                                                    onChange={(e) => handleSaveLoc2ToStorage({ ...loc2Origin, address: e.target.value })}
                                                    style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #dcd1c6", fontSize: "0.8rem", resize: "vertical" }}
                                                />
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Kode Pos (misal: 12190)"
                                                        value={loc2Origin.postal_code}
                                                        onChange={(e) => handleSaveLoc2ToStorage({ ...loc2Origin, postal_code: e.target.value })}
                                                        style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #dcd1c6", fontSize: "0.8rem" }}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Catatan untuk Kurir"
                                                        value={loc2Origin.note}
                                                        onChange={(e) => handleSaveLoc2ToStorage({ ...loc2Origin, note: e.target.value })}
                                                        style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #dcd1c6", fontSize: "0.8rem" }}
                                                    />
                                                </div>
                                                <span style={{ fontSize: "0.72rem", color: "#8d7971" }}>
                                                    💡 Alamat Lokasi 2 otomatis tersimpan di browser untuk order berikutnya.
                                                </span>
                                            </div>
                                        ) : (
                                            <div style={{ fontSize: "0.82rem", color: "#59483f", marginLeft: 22, lineHeight: 1.35 }}>
                                                {loc2Origin.address ? `${loc2Origin.contact_name} — ${loc2Origin.address}` : "(Klik untuk mengisi alamat kedua)"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                    onClick={() => handleExecuteDispatch(dispatchConfirmOrder, currentOrigin)}
                                    disabled={dispatchingOrderId === dispatchConfirmOrder.order_id || !ship.address}
                                    style={{
                                        flex: 1, padding: "12px", borderRadius: "10px",
                                        background: !ship.address ? "#9e9e9e" : "#2e7d32",
                                        color: "#fff",
                                        fontSize: "0.88rem", fontWeight: 800, border: "none",
                                        cursor: !ship.address ? "not-allowed" : "pointer"
                                    }}
                                >
                                    {dispatchingOrderId === dispatchConfirmOrder.order_id ? "Memproses..." : "Panggil Kurir Sekarang (Biteship)"}
                                </button>
                                <button
                                    onClick={() => setDispatchConfirmOrder(null)}
                                    style={{
                                        padding: "12px 18px", borderRadius: "10px",
                                        background: "#faf7f2", color: "#6e5c53",
                                        border: "1px solid #dcd1c6", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer"
                                    }}
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </>
    );
}
