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
    const [timeRangeFilter, setTimeRangeFilter] = useState<"today" | "yesterday" | "7days" | "30days" | "all">("today");
    const [overviewStats, setOverviewStats] = useState<{
        totalRevenue: number;
        paidCount: number;
        pendingCount: number;
        physicalCount: number;
    }>({ totalRevenue: 0, paidCount: 0, pendingCount: 0, physicalCount: 0 });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loadingStats, setLoadingStats] = useState(false);
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [productFilter, setProductFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("paid_only");
    const [digitalPage, setDigitalPage] = useState(1);
    const [physicalPage, setPhysicalPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [physicalCounters, setPhysicalCounters] = useState({
        unpaidCount: 0,
        pendingCustomizationCount: 0,
        readyToPackCount: 0,
        shippedCount: 0,
    });
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Resi Edit State
    const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
    const [trackingInput, setTrackingInput] = useState("");
    const [courierInput, setCourierInput] = useState("J&T");
    const [savingTracking, setSavingTracking] = useState(false);

    // Biteship Shipping Dispatch & Origin Selection States
    const [dispatchingOrderId, setDispatchingOrderId] = useState<string | null>(null);
    const [dispatchConfirmOrder, setDispatchConfirmOrder] = useState<OrderItem | null>(null);
    const [dispatchSuccessResult, setDispatchSuccessResult] = useState<{
        orderId: string;
        trackingNumber: string;
        courier: string;
        message: string;
        trackingLink?: string;
        collectionMethod?: "drop_off" | "pickup";
    } | null>(null);
    const [dispatchErrorResult, setDispatchErrorResult] = useState<string | null>(null);
    const [dispatchCollectionMethod, setDispatchCollectionMethod] = useState<"drop_off" | "pickup">("drop_off");
    const [copiedResi, setCopiedResi] = useState(false);
    const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const showToast = (text: string, type: "success" | "error" = "success") => {
        setToastMessage({ text, type });
        setTimeout(() => setToastMessage(null), 3500);
    };

    const [selectedOriginPreset, setSelectedOriginPreset] = useState<"loc1" | "loc2">("loc1");
    const [loc2Origin, setLoc2Origin] = useState({
        contact_name: "For you, Always. (Studio 2)",
        contact_phone: "081381543981",
        address: "Villa Nusa Indah 2 Blok U 21/6",
        village: "Bojong Kulur",
        district: "Gunung Putri",
        city: "Kabupaten Bogor",
        province: "Jawa Barat",
        postal_code: "16969",
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
        courier: "J&T",
    });
    const [savingAddress, setSavingAddress] = useState(false);

    // Gift Link & Customization Edit States
    const [editingGiftOrderId, setEditingGiftOrderId] = useState<string | null>(null);
    const [giftLinkInput, setGiftLinkInput] = useState("");
    const [customizationStatusInput, setCustomizationStatusInput] = useState<"draft" | "published">("draft");
    const [savingGiftStatus, setSavingGiftStatus] = useState(false);
    const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);
    const [qrModalTitle, setQrModalTitle] = useState<string>("");

    // Live Biteship Tracking Modal State
    const [liveTrackingModal, setLiveTrackingModal] = useState<{
        order_id: string;
        tracking_number: string;
        courier: string;
        loading: boolean;
        data: any;
        error: string | null;
    } | null>(null);

    const handleOpenTrackingModal = async (order: OrderItem) => {
        if (!order.tracking_number) return;
        setLiveTrackingModal({
            order_id: order.order_id,
            tracking_number: order.tracking_number,
            courier: order.courier || "J&T",
            loading: true,
            data: null,
            error: null,
        });
        try {
            const res = await fetch(`/api/shipping/track?waybill_id=${encodeURIComponent(order.tracking_number)}&courier=${encodeURIComponent(order.courier || "jnt")}`);
            const data = await res.json();
            if (res.ok && data.success) {
                setLiveTrackingModal(prev => prev ? { ...prev, loading: false, data, error: null } : null);
            } else {
                setLiveTrackingModal(prev => prev ? { ...prev, loading: false, data: null, error: data.message || "Gagal memuat status live dari Biteship." } : null);
            }
        } catch {
            setLiveTrackingModal(prev => prev ? { ...prev, loading: false, data: null, error: "Gagal menghubungkan ke server pelacakan." } : null);
        }
    };

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
                showToast("Pesanan berhasil dihapus.", "success");
            } else {
                showToast(data.message || "Gagal menghapus pesanan.", "error");
            }
        } catch (e) {
            console.error("Failed to delete order:", e);
            showToast("Terjadi kesalahan jaringan.", "error");
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

    const fetchStats = async (range: string = timeRangeFilter) => {
        setLoadingStats(true);
        try {
            const res = await fetch(`/api/admin/stats?range=${range}&t=${Date.now()}`, {
                cache: "no-store",
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setOverviewStats(data.stats || { totalRevenue: 0, paidCount: 0, pendingCount: 0, physicalCount: 0 });
                    setRecentOrders(data.recentOrders || []);
                }
            }
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        } finally {
            setLoadingStats(false);
        }
    };

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 250);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchOrders = async (
        targetTab: "physical" | "digital" = activeTab === "physical" ? "physical" : "digital",
        page: number = activeTab === "physical" ? physicalPage : digitalPage,
        search: string = debouncedSearch,
        prod: string = productFilter,
        st: string = statusFilter
    ) => {
        setLoadingOrders(true);
        try {
            const params = new URLSearchParams({
                tab: targetTab,
                page: String(page),
                limit: "25",
                q: search,
                product: prod,
                status: st,
                t: String(Date.now()),
            });
            const res = await fetch(`/api/admin/orders?${params.toString()}`, {
                cache: "no-store",
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
                setTotalOrders(data.total || 0);
                setTotalPages(data.totalPages || 1);
                if (data.counters) {
                    setPhysicalCounters(data.counters);
                }
            }
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleRefreshAll = () => {
        if (activeTab === "overview") {
            fetchStats(timeRangeFilter);
        } else {
            const page = activeTab === "physical" ? physicalPage : digitalPage;
            fetchOrders(activeTab, page, debouncedSearch, productFilter, statusFilter);
        }
        fetchInventory();
    };

    useEffect(() => {
        if (isAuthenticated) {
            if (activeTab === "overview") {
                fetchStats(timeRangeFilter);
            } else {
                const page = activeTab === "physical" ? physicalPage : digitalPage;
                fetchOrders(activeTab, page, debouncedSearch, productFilter, statusFilter);
            }
            if (activeTab === "physical" || activeTab === "overview") {
                fetchInventory();
            }
        }
    }, [activeTab, isAuthenticated, timeRangeFilter, physicalPage, digitalPage, debouncedSearch, productFilter, statusFilter]);

    useEffect(() => {
        setDigitalPage(1);
        setPhysicalPage(1);
    }, [debouncedSearch, productFilter, statusFilter]);

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

    const TIME_RANGE_LABELS: Record<string, string> = {
        today: "Hari Ini",
        yesterday: "Kemarin",
        "7days": "7 Hari Terakhir",
        "30days": "30 Hari Terakhir",
        all: "Semua Waktu",
    };

    const isWithinRange = (dateStr: string | undefined, range: "today" | "yesterday" | "7days" | "30days" | "all"): boolean => {
        if (range === "all") return true;
        if (!dateStr) return false;

        try {
            const cleanStr = dateStr.includes("T") || dateStr.endsWith("Z") ? dateStr : dateStr.replace(" ", "T") + "Z";
            const orderDate = new Date(cleanStr);
            if (isNaN(orderDate.getTime())) return true;

            const now = new Date();
            const nowWIB = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
            const orderWIB = new Date(orderDate.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));

            if (range === "today") {
                return (
                    orderWIB.getFullYear() === nowWIB.getFullYear() &&
                    orderWIB.getMonth() === nowWIB.getMonth() &&
                    orderWIB.getDate() === nowWIB.getDate()
                );
            }

            if (range === "yesterday") {
                const yesterdayWIB = new Date(nowWIB);
                yesterdayWIB.setDate(yesterdayWIB.getDate() - 1);
                return (
                    orderWIB.getFullYear() === yesterdayWIB.getFullYear() &&
                    orderWIB.getMonth() === yesterdayWIB.getMonth() &&
                    orderWIB.getDate() === yesterdayWIB.getDate()
                );
            }

            if (range === "7days") {
                const sevenDaysAgo = new Date(nowWIB);
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                sevenDaysAgo.setHours(0, 0, 0, 0);
                return orderWIB >= sevenDaysAgo;
            }

            if (range === "30days") {
                const thirtyDaysAgo = new Date(nowWIB);
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                thirtyDaysAgo.setHours(0, 0, 0, 0);
                return orderWIB >= thirtyDaysAgo;
            }

            return true;
        } catch {
            return true;
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
                showToast("Nomor resi berhasil diperbarui.", "success");
            } else {
                showToast("Gagal memperbarui nomor resi.", "error");
            }
        } catch {
            showToast("Terjadi kesalahan sistem saat menyimpan resi.", "error");
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
                showToast("Alamat penerima berhasil diperbarui.", "success");
            } else {
                showToast("Gagal memperbarui alamat penerima.", "error");
            }
        } catch {
            showToast("Terjadi kesalahan sistem saat menyimpan alamat.", "error");
        } finally {
            setSavingAddress(false);
        }
    };

    const handleOpenDispatchModal = (order: OrderItem) => {
        setDispatchConfirmOrder(order);
    };

    const handleExecuteDispatch = async (order: OrderItem, originDetails: any, collectionMethod: "drop_off" | "pickup" = dispatchCollectionMethod) => {
        setDispatchingOrderId(order.order_id);
        try {
            const res = await fetch("/api/shipping/dispatch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_id: order.order_id,
                    order_data: order,
                    origin_details: originDetails,
                    collection_method: collectionMethod,
                }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
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
                setDispatchSuccessResult({
                    orderId: order.order_id,
                    trackingNumber: data.tracking_number,
                    courier: data.courier,
                    message: data.message,
                    trackingLink: data.tracking_link,
                    collectionMethod: data.collection_method || collectionMethod,
                });
            } else {
                setDispatchErrorResult(data.message || "Gagal membuat pesanan pengiriman ke Biteship.");
            }
        } catch (err) {
            console.error("Failed to dispatch order to Biteship:", err);
            setDispatchErrorResult("Terjadi kesalahan jaringan saat memproses ke Biteship.");
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
                showToast("Status & link kado digital berhasil diperbarui.", "success");
            } else {
                showToast("Gagal memperbarui status kado.", "error");
            }
        } catch {
            showToast("Terjadi kesalahan sistem saat memperbarui status kado.", "error");
        } finally {
            setSavingGiftStatus(false);
        }
    };

    // Physical metrics (from server counters)
    const pendingCustomizationCount = physicalCounters.pendingCustomizationCount;
    const readyToPackCount = physicalCounters.readyToPackCount;
    const shippedPhysicalCount = physicalCounters.shippedCount;
    const unpaidPhysicalCount = physicalCounters.unpaidCount;

    const getTabTitle = () => {
        if (activeTab === "overview") return "Ringkasan Penjualan";
        if (activeTab === "physical") return "Pesanan Fisik (The Gift Box)";
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
                            <span>Pesanan Fisik (The Gift Box)</span>
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
                            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 14 }}>
                                <div>
                                    <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 30px)", fontWeight: 700, color: "#1d1816", margin: "0 0 2px" }}>
                                        Ringkasan Penjualan
                                    </h1>
                                    <p style={{ fontSize: 12, color: "#7a685e", margin: 0 }}>
                                        Performa transaksi dan status fulfillment toko For You, Always.
                                    </p>
                                </div>

                                {/* Time Filter Tabs & Refresh Button */}
                                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                                    <div style={{
                                        display: "inline-flex",
                                        background: "#f0e9e2",
                                        padding: "3px",
                                        borderRadius: "10px",
                                        border: "1px solid #e0d6cd"
                                    }}>
                                        {[
                                            { id: "today", label: "Hari Ini" },
                                            { id: "yesterday", label: "Kemarin" },
                                            { id: "7days", label: "7 Hari" },
                                            { id: "30days", label: "30 Hari" },
                                            { id: "all", label: "Semua Waktu" },
                                        ].map((tab) => {
                                            const isActive = timeRangeFilter === tab.id;
                                            return (
                                                <button
                                                    key={tab.id}
                                                    type="button"
                                                    onClick={() => setTimeRangeFilter(tab.id as any)}
                                                    style={{
                                                        padding: "6px 12px",
                                                        borderRadius: "8px",
                                                        border: "none",
                                                        background: isActive ? "#1d1816" : "transparent",
                                                        color: isActive ? "#faf7f2" : "#6e5c53",
                                                        fontSize: "0.78rem",
                                                        fontWeight: isActive ? 700 : 600,
                                                        cursor: "pointer",
                                                        transition: "all 0.18s ease",
                                                        whiteSpace: "nowrap"
                                                    }}
                                                >
                                                    {tab.label}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={handleRefreshAll}
                                        style={{
                                            padding: "8px 14px", borderRadius: 8, border: "1px solid #dcd1c6",
                                            background: "#ffffff", color: "#1d1816", fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                                            display: "inline-flex", alignItems: "center", gap: 5
                                        }}
                                    >
                                        <span>↻</span> Perbarui
                                    </button>
                                </div>
                            </header>

                            {/* Metrics Cards */}
                            <div className="dash-stats-grid">
                                <div style={{ background: "#ffffff", padding: "16px 18px", borderRadius: 14, border: "1px solid #e8dfd8" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: "#7a685e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                            Total Omzet (Paid)
                                        </div>
                                        <span style={{ fontSize: 10, color: "#a67c52", fontWeight: 700, background: "#faf7f2", padding: "1px 6px", borderRadius: 4 }}>
                                            {TIME_RANGE_LABELS[timeRangeFilter]}
                                        </span>
                                    </div>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#1d1816", marginTop: 4 }}>
                                        {loadingStats ? "..." : `Rp ${overviewStats.totalRevenue.toLocaleString("id-ID")}`}
                                    </div>
                                </div>
                                <div style={{ background: "#ffffff", padding: "16px 18px", borderRadius: 14, border: "1px solid #e8dfd8" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: "#2e7d32", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                            Pesanan Berhasil
                                        </div>
                                        <span style={{ fontSize: 10, color: "#2e7d32", fontWeight: 700, background: "#e8f5e9", padding: "1px 6px", borderRadius: 4 }}>
                                            {TIME_RANGE_LABELS[timeRangeFilter]}
                                        </span>
                                    </div>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#2e7d32", marginTop: 4 }}>
                                        {loadingStats ? "..." : `${overviewStats.paidCount} Transaksi`}
                                    </div>
                                </div>
                                <div style={{ background: "#ffffff", padding: "16px 18px", borderRadius: 14, border: "1px solid #e8dfd8" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: "#a67c52", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                            Pesanan The Gift Box
                                        </div>
                                        <span style={{ fontSize: 10, color: "#a67c52", fontWeight: 700, background: "#faf7f2", padding: "1px 6px", borderRadius: 4 }}>
                                            {TIME_RANGE_LABELS[timeRangeFilter]}
                                        </span>
                                    </div>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#a67c52", marginTop: 4 }}>
                                        {loadingStats ? "..." : `${overviewStats.physicalCount} Box`}
                                    </div>
                                </div>
                                <div style={{ background: "#ffffff", padding: "16px 18px", borderRadius: 14, border: "1px solid #e8dfd8" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: "#e65100", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                            Menunggu Bayar
                                        </div>
                                        <span style={{ fontSize: 10, color: "#e65100", fontWeight: 700, background: "#fff3e0", padding: "1px 6px", borderRadius: 4 }}>
                                            {TIME_RANGE_LABELS[timeRangeFilter]}
                                        </span>
                                    </div>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#e65100", marginTop: 4 }}>
                                        {loadingStats ? "..." : `${overviewStats.pendingCount} Order`}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders Overview */}
                            <div className="dash-table-wrap" style={{ padding: "18px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#1d1816", margin: 0 }}>
                                        Aktivitas Transaksi ({TIME_RANGE_LABELS[timeRangeFilter]})
                                    </h3>
                                    <button
                                        onClick={() => { setActiveTab("digital"); setStatusFilter("all"); }}
                                        style={{ background: "none", border: "none", color: "#a67c52", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}
                                    >
                                        Semua Pesanan →
                                    </button>
                                </div>

                                {loadingStats ? (
                                    <div style={{ padding: "24px", textAlign: "center", color: "#7a685e", fontSize: 12 }}>Menghitung ringkasan D1...</div>
                                ) : recentOrders.length === 0 ? (
                                    <div style={{ padding: "28px", textAlign: "center", color: "#7a685e", fontSize: 12 }}>
                                        Belum ada transaksi pada periode <strong>{TIME_RANGE_LABELS[timeRangeFilter].toLowerCase()}</strong>.
                                    </div>
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
                                                {recentOrders.map((o) => (
                                                    <tr key={o.order_id} style={{ borderBottom: "1px solid #f0e9e2" }}>
                                                        <td style={{ padding: "10px 12px", fontWeight: 700, color: "#1d1816" }}>{o.order_id}</td>
                                                        <td style={{ padding: "10px 12px", textTransform: "capitalize", color: "#59483f" }}>{o.product_type || o.product_id || "Digital Gift"}</td>
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

                    {/* ── TAB 2: PESANAN FISIK (THE GIFT BOX) ── */}
                    {activeTab === "physical" && (
                        <div>
                            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
                                <div>
                                    <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 30px)", fontWeight: 700, color: "#1d1816", margin: "0 0 2px" }}>
                                        Pesanan Fisik (The Gift Box)
                                    </h1>
                                    <p style={{ fontSize: 12, color: "#7a685e", margin: 0 }}>
                                        Kelola alamat pengiriman, status pengisian studio, dan nomor resi kurir.
                                    </p>
                                </div>
                                <button
                                    onClick={handleRefreshAll}
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
                                                Inventaris Gift Box Fisik (The Gift Box)
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
                                ) : orders.length === 0 ? (
                                    <div style={{ padding: "30px", textAlign: "center", color: "#7a685e", fontSize: 12.5 }}>Tidak ada pesanan fisik yang cocok.</div>
                                ) : (
                                    <>
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
                                            {orders.map((order) => {
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
                                                                        <option value="J&T">J&T Express</option>
                                                                        <option value="JNE">JNE</option>
                                                                        <option value="Anteraja">Anteraja</option>
                                                                        <option value="Paxel">Paxel</option>
                                                                        <option value="GoSend">GoSend</option>
                                                                        <option value="SiCepat">SiCepat</option>
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

                                                                            <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 6, flexWrap: "wrap" }}>
                                                                                <button
                                                                                    onClick={() => handleOpenTrackingModal(order)}
                                                                                    style={{
                                                                                        display: "inline-flex",
                                                                                        alignItems: "center",
                                                                                        gap: 3,
                                                                                        padding: "4px 8px",
                                                                                        borderRadius: 6,
                                                                                        border: "1px solid #1d1816",
                                                                                        background: "#1d1816",
                                                                                        color: "#faf7f2",
                                                                                        fontSize: 9.5,
                                                                                        fontWeight: 700,
                                                                                        cursor: "pointer"
                                                                                    }}
                                                                                >
                                                                                    Lacak Live
                                                                                </button>

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
                                                                                        🌐 Biteship
                                                                                    </a>
                                                                                )}

                                                                                <button
                                                                                    onClick={() => {
                                                                                        setEditingOrderId(order.order_id);
                                                                                        setTrackingInput(order.tracking_number || "");
                                                                                        setCourierInput(order.courier || "J&T");
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
                                                                                Kurir: <strong>{ship.courier || "J&T"}</strong>
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
                                                                                    setCourierInput(ship.courier || "J&T");
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

                                    {totalOrders > 25 && (
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "12px 18px",
                                            borderTop: "1px solid #f0e9e2",
                                            background: "#faf7f2",
                                            fontSize: 12,
                                            color: "#6e5c53",
                                            flexWrap: "wrap",
                                            gap: 10
                                        }}>
                                            <div>
                                                Menampilkan <strong>{Math.min((physicalPage - 1) * 25 + 1, totalOrders)}</strong> - <strong>{Math.min(physicalPage * 25, totalOrders)}</strong> dari <strong>{totalOrders}</strong> pesanan
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <button
                                                    type="button"
                                                    onClick={() => setPhysicalPage(p => Math.max(1, p - 1))}
                                                    disabled={physicalPage === 1}
                                                    style={{
                                                        padding: "5px 10px",
                                                        borderRadius: 6,
                                                        border: "1px solid #dcd1c6",
                                                        background: physicalPage === 1 ? "#f5efe9" : "#ffffff",
                                                        color: physicalPage === 1 ? "#b3a59c" : "#1d1816",
                                                        cursor: physicalPage === 1 ? "not-allowed" : "pointer",
                                                        fontWeight: 600,
                                                        fontSize: 11
                                                    }}
                                                >
                                                    ← Sebelumnya
                                                </button>
                                                <span style={{ fontWeight: 700, padding: "0 6px" }}>
                                                    Halaman {physicalPage} / {totalPages}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setPhysicalPage(p => Math.min(totalPages, p + 1))}
                                                    disabled={physicalPage >= totalPages}
                                                    style={{
                                                        padding: "5px 10px",
                                                        borderRadius: 6,
                                                        border: "1px solid #dcd1c6",
                                                        background: physicalPage >= totalPages ? "#f5efe9" : "#ffffff",
                                                        color: physicalPage >= totalPages ? "#b3a59c" : "#1d1816",
                                                        cursor: physicalPage >= totalPages ? "not-allowed" : "pointer",
                                                        fontWeight: 600,
                                                        fontSize: 11
                                                    }}
                                                >
                                                    Selanjutnya →
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
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
                                    onClick={handleRefreshAll}
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
                                ) : orders.length === 0 ? (
                                    <div style={{ padding: "30px", textAlign: "center", color: "#7a685e", fontSize: 12.5 }}>Tidak ada pesanan digital yang cocok.</div>
                                ) : (
                                    <>
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
                                            {orders.map((order) => {
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

                                    {totalOrders > 25 && (
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "12px 18px",
                                            borderTop: "1px solid #f0e9e2",
                                            background: "#faf7f2",
                                            fontSize: 12,
                                            color: "#6e5c53",
                                            flexWrap: "wrap",
                                            gap: 10
                                        }}>
                                            <div>
                                                Menampilkan <strong>{Math.min((digitalPage - 1) * 25 + 1, totalOrders)}</strong> - <strong>{Math.min(digitalPage * 25, totalOrders)}</strong> dari <strong>{totalOrders}</strong> pesanan
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <button
                                                    type="button"
                                                    onClick={() => setDigitalPage(p => Math.max(1, p - 1))}
                                                    disabled={digitalPage === 1}
                                                    style={{
                                                        padding: "5px 10px",
                                                        borderRadius: 6,
                                                        border: "1px solid #dcd1c6",
                                                        background: digitalPage === 1 ? "#f5efe9" : "#ffffff",
                                                        color: digitalPage === 1 ? "#b3a59c" : "#1d1816",
                                                        cursor: digitalPage === 1 ? "not-allowed" : "pointer",
                                                        fontWeight: 600,
                                                        fontSize: 11
                                                    }}
                                                >
                                                    ← Sebelumnya
                                                </button>
                                                <span style={{ fontWeight: 700, padding: "0 6px" }}>
                                                    Halaman {digitalPage} / {totalPages}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setDigitalPage(p => Math.min(totalPages, p + 1))}
                                                    disabled={digitalPage >= totalPages}
                                                    style={{
                                                        padding: "5px 10px",
                                                        borderRadius: 6,
                                                        border: "1px solid #dcd1c6",
                                                        background: digitalPage >= totalPages ? "#f5efe9" : "#ffffff",
                                                        color: digitalPage >= totalPages ? "#b3a59c" : "#1d1816",
                                                        cursor: digitalPage >= totalPages ? "not-allowed" : "pointer",
                                                        fontWeight: 600,
                                                        fontSize: 11
                                                    }}
                                                >
                                                    Selanjutnya →
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
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
                                    <option value="J&T">J&T (EZ)</option>
                                    <option value="JNE">JNE (Reguler)</option>
                                    <option value="Anteraja">Anteraja (Reguler)</option>
                                    <option value="SiCepat">SiCepat (Reguler)</option>
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
                const courierName = ship.courier || dispatchConfirmOrder.courier || "J&T Express Reguler";
                const recipientName = ship.recipient_name || dispatchConfirmOrder.customer_name || "-";
                const fullAddr = [ship.address, ship.village, ship.district, ship.city, ship.province, ship.postal_code].filter(Boolean).join(", ");

                const loc1 = {
                    contact_name: "For you, Always.",
                    contact_phone: "081936109076",
                    address: "Limus Pratama Regency Jl Kediri 7 Blok E16/22, Cileungsi Kab.Bogor",
                    postal_code: "16820",
                    latitude: "-6.364016",
                    longitude: "106.970905",
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
                                        Proses Pengiriman & Resi (Biteship)
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
                                    {fullAddr || <span style={{ color: "#d32f2f", fontWeight: 700 }}>Alamat penerima masih kosong! Klik tombol Edit Alamat dulu di tabel.</span>}
                                </div>
                                <div style={{ marginTop: 6, fontSize: "0.82rem", fontWeight: 700, color: "#2e7d32" }}>
                                    Kurir: {courierName}
                                </div>
                            </div>

                            {/* Collection Method Selection (Drop-off vs Pick-up) */}
                            <div style={{ marginBottom: 18 }}>
                                <label style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1d1816", display: "block", marginBottom: 8 }}>
                                    Pilih Metode Serah Paket:
                                </label>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                    {/* Drop-off Card */}
                                    <div
                                        onClick={() => setDispatchCollectionMethod("drop_off")}
                                        style={{
                                            border: dispatchCollectionMethod === "drop_off" ? "2px solid #2e7d32" : "1.5px solid #dcd1c6",
                                            borderRadius: 12,
                                            padding: "12px 14px",
                                            background: dispatchCollectionMethod === "drop_off" ? "#f1f8e9" : "#fff",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                            <input
                                                type="radio"
                                                name="collectionMethod"
                                                checked={dispatchCollectionMethod === "drop_off"}
                                                onChange={() => setDispatchCollectionMethod("drop_off")}
                                            />
                                            <strong style={{ fontSize: "0.88rem", color: "#1d1816" }}>
                                                Drop-off
                                            </strong>
                                            <span style={{ fontSize: "0.7rem", background: "#e8f5e9", color: "#2e7d32", padding: "1px 5px", borderRadius: 4, fontWeight: 700 }}>
                                                Rekomendasi
                                            </span>
                                        </div>
                                        <div style={{ fontSize: "0.78rem", color: "#59483f", marginLeft: 22, lineHeight: 1.35 }}>
                                            Resi terbit instan. Kamu serahkan paket langsung ke gerai/counter <strong>{courierName}</strong> terdekat tanpa bayar lagi.
                                        </div>
                                    </div>

                                    {/* Pick-up Card */}
                                    <div
                                        onClick={() => setDispatchCollectionMethod("pickup")}
                                        style={{
                                            border: dispatchCollectionMethod === "pickup" ? "2px solid #2e7d32" : "1.5px solid #dcd1c6",
                                            borderRadius: 12,
                                            padding: "12px 14px",
                                            background: dispatchCollectionMethod === "pickup" ? "#f1f8e9" : "#fff",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                            <input
                                                type="radio"
                                                name="collectionMethod"
                                                checked={dispatchCollectionMethod === "pickup"}
                                                onChange={() => setDispatchCollectionMethod("pickup")}
                                            />
                                            <strong style={{ fontSize: "0.88rem", color: "#1d1816" }}>
                                                Pick-up Kurir
                                            </strong>
                                        </div>
                                        <div style={{ fontSize: "0.78rem", color: "#59483f", marginLeft: 22, lineHeight: 1.35 }}>
                                            Kurir <strong>{courierName}</strong> akan datang menjemput paket ke alamat asal yang kamu pilih di bawah.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Warehouse Origin Selection */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1d1816", display: "block", marginBottom: 8 }}>
                                    Alamat Asal Pengirim (Untuk Cetak Resi & Titik Jemput):
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
                                                Lokasi 1 (Gudang Utama - Cileungsi)
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
                                                    <div>
                                                        <label style={{ fontSize: "0.72rem", color: "#59483f", fontWeight: 700, display: "block", marginBottom: 2 }}>Nama PIC / Pengirim</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Nama Pengirim / PIC"
                                                            value={loc2Origin.contact_name}
                                                            onChange={(e) => handleSaveLoc2ToStorage({ ...loc2Origin, contact_name: e.target.value })}
                                                            style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #dcd1c6", fontSize: "0.8rem", boxSizing: "border-box" }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontSize: "0.72rem", color: "#59483f", fontWeight: 700, display: "block", marginBottom: 2 }}>No. HP Pengirim</label>
                                                        <input
                                                            type="text"
                                                            placeholder="No. HP Pengirim"
                                                            value={loc2Origin.contact_phone}
                                                            onChange={(e) => handleSaveLoc2ToStorage({ ...loc2Origin, contact_phone: e.target.value })}
                                                            style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #dcd1c6", fontSize: "0.8rem", boxSizing: "border-box" }}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label style={{ fontSize: "0.72rem", color: "#59483f", fontWeight: 700, display: "block", marginBottom: 2 }}>Alamat Jalan / Komplek / No. Rumah</label>
                                                    <textarea
                                                        rows={2}
                                                        placeholder="Contoh: Villa Nusa Indah 2 Blok U 21/6..."
                                                        value={loc2Origin.address}
                                                        onChange={(e) => handleSaveLoc2ToStorage({ ...loc2Origin, address: e.target.value })}
                                                        style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #dcd1c6", fontSize: "0.8rem", resize: "vertical", boxSizing: "border-box" }}
                                                    />
                                                </div>

                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                                    <div>
                                                        <label style={{ fontSize: "0.72rem", color: "#59483f", fontWeight: 700, display: "block", marginBottom: 2 }}>Kelurahan / Desa</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Kelurahan / Desa"
                                                            value={loc2Origin.village || ""}
                                                            onChange={(e) => handleSaveLoc2ToStorage({ ...loc2Origin, village: e.target.value })}
                                                            style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #dcd1c6", fontSize: "0.8rem", boxSizing: "border-box" }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontSize: "0.72rem", color: "#59483f", fontWeight: 700, display: "block", marginBottom: 2 }}>Kecamatan</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Kecamatan"
                                                            value={loc2Origin.district || ""}
                                                            onChange={(e) => handleSaveLoc2ToStorage({ ...loc2Origin, district: e.target.value })}
                                                            style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #dcd1c6", fontSize: "0.8rem", boxSizing: "border-box" }}
                                                        />
                                                    </div>
                                                </div>

                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                                    <div>
                                                        <label style={{ fontSize: "0.72rem", color: "#59483f", fontWeight: 700, display: "block", marginBottom: 2 }}>Kota / Kabupaten</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Kota / Kabupaten"
                                                            value={loc2Origin.city || ""}
                                                            onChange={(e) => handleSaveLoc2ToStorage({ ...loc2Origin, city: e.target.value })}
                                                            style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #dcd1c6", fontSize: "0.8rem", boxSizing: "border-box" }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontSize: "0.72rem", color: "#59483f", fontWeight: 700, display: "block", marginBottom: 2 }}>Provinsi</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Provinsi (Jawa Barat / DKI Jakarta)"
                                                            value={loc2Origin.province || ""}
                                                            onChange={(e) => handleSaveLoc2ToStorage({ ...loc2Origin, province: e.target.value })}
                                                            style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #dcd1c6", fontSize: "0.8rem", boxSizing: "border-box" }}
                                                        />
                                                    </div>
                                                </div>

                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                                    <div>
                                                        <label style={{ fontSize: "0.72rem", color: "#59483f", fontWeight: 700, display: "block", marginBottom: 2 }}>Kode Pos</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Kode Pos (misal: 16969)"
                                                            value={loc2Origin.postal_code}
                                                            onChange={(e) => handleSaveLoc2ToStorage({ ...loc2Origin, postal_code: e.target.value })}
                                                            style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #dcd1c6", fontSize: "0.8rem", boxSizing: "border-box" }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontSize: "0.72rem", color: "#59483f", fontWeight: 700, display: "block", marginBottom: 2 }}>Catatan untuk Kurir</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Catatan Kurir"
                                                            value={loc2Origin.note}
                                                            onChange={(e) => handleSaveLoc2ToStorage({ ...loc2Origin, note: e.target.value })}
                                                            style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #dcd1c6", fontSize: "0.8rem", boxSizing: "border-box" }}
                                                        />
                                                    </div>
                                                </div>

                                                <span style={{ fontSize: "0.72rem", color: "#8d7971" }}>
                                                    Alamat Lokasi 2 otomatis tersimpan di browser untuk order berikutnya.
                                                </span>
                                            </div>
                                        ) : (
                                            <div style={{ fontSize: "0.82rem", color: "#59483f", marginLeft: 22, lineHeight: 1.35 }}>
                                                {loc2Origin.address ? `${loc2Origin.contact_name} — ${[loc2Origin.address, loc2Origin.village, loc2Origin.district, loc2Origin.city, loc2Origin.province, loc2Origin.postal_code].filter(Boolean).join(", ")}` : "(Klik untuk mengisi alamat kedua)"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                    onClick={() => handleExecuteDispatch(dispatchConfirmOrder, currentOrigin, dispatchCollectionMethod)}
                                    disabled={dispatchingOrderId === dispatchConfirmOrder.order_id || !ship.address}
                                    style={{
                                        flex: 1, padding: "12px", borderRadius: "10px",
                                        background: !ship.address ? "#9e9e9e" : (dispatchCollectionMethod === "drop_off" ? "#1d1816" : "#2e7d32"),
                                        color: "#fff",
                                        fontSize: "0.88rem", fontWeight: 800, border: "none",
                                        cursor: !ship.address ? "not-allowed" : "pointer"
                                    }}
                                >
                                    {dispatchingOrderId === dispatchConfirmOrder.order_id
                                        ? "Memproses ke Biteship..."
                                        : (dispatchCollectionMethod === "drop_off"
                                            ? `Terbitkan Resi & Kirim (Drop-off ke ${courierName})`
                                            : `Panggil Kurir Jemput (Pick-up ${courierName})`)}
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

            {/* ── 7. MODAL: LIVE BITESHIP TRACKING ── */}
            {liveTrackingModal && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(29, 24, 22, 0.65)",
                    backdropFilter: "blur(4px)",
                    zIndex: 100000,
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
                                <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                    Biteship Live Tracking
                                </div>
                                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#1d1816" }}>
                                    Status Pengiriman Paket
                                </h3>
                                <div style={{ fontSize: "0.8rem", color: "#8d7971", marginTop: 2 }}>
                                    Order: <strong>{liveTrackingModal.order_id}</strong> • Resi: <span style={{ fontFamily: "monospace", fontWeight: 700 }}>{liveTrackingModal.tracking_number}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setLiveTrackingModal(null)}
                                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#8d7971" }}
                            >
                                ✕
                            </button>
                        </div>

                        {liveTrackingModal.loading && (
                            <div style={{ padding: "30px 0", textAlign: "center", color: "#8d7971", fontSize: "0.88rem" }}>
                                <div style={{ width: 24, height: 24, border: "3px solid #a67c52", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" }} />
                                Mengambil data checkpoint dari server ekspedisi...
                            </div>
                        )}

                        {liveTrackingModal.error && (
                            <div style={{ padding: "16px", background: "#fde8e8", borderRadius: "10px", color: "#9b1c1c", fontSize: "0.85rem", marginBottom: 16 }}>
                                {liveTrackingModal.error}
                            </div>
                        )}

                        {liveTrackingModal.data && (
                            <div>
                                <div style={{ background: "#faf7f2", borderRadius: "12px", padding: "14px 16px", border: "1px solid #ebdcd0", marginBottom: 16 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{
                                            padding: "3px 10px",
                                            borderRadius: 999,
                                            fontSize: "0.75rem",
                                            fontWeight: 800,
                                            color: "#fff",
                                            backgroundColor: liveTrackingModal.data.status_color || "#2e7d32"
                                        }}>
                                            {liveTrackingModal.data.status_display}
                                        </span>
                                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#6e5c53" }}>
                                            {liveTrackingModal.courier}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: "0.84rem", color: "#382a24", marginTop: 8, fontWeight: 500 }}>
                                        {liveTrackingModal.data.status_desc}
                                    </div>
                                </div>

                                {/* Timeline History */}
                                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1d1816", marginBottom: 10 }}>
                                    Riwayat Perjalanan Paket:
                                </div>

                                {liveTrackingModal.data.history && liveTrackingModal.data.history.length > 0 ? (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "relative", paddingLeft: 16, marginBottom: 20 }}>
                                        <div style={{ position: "absolute", left: 5, top: 4, bottom: 4, width: 2, background: "#ebdcd0" }} />
                                        {liveTrackingModal.data.history.map((item: any, idx: number) => {
                                            const dateStr = item.updated_at ? new Date(item.updated_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "-";
                                            return (
                                                <div key={idx} style={{ position: "relative" }}>
                                                    <div style={{
                                                        position: "absolute",
                                                        left: -15,
                                                        top: 3,
                                                        width: 10,
                                                        height: 10,
                                                        borderRadius: "50%",
                                                        backgroundColor: idx === 0 ? "#2e7d32" : "#a67c52"
                                                    }} />
                                                    <div style={{ fontSize: "0.82rem", fontWeight: idx === 0 ? 700 : 500, color: idx === 0 ? "#1d1816" : "#59483f" }}>
                                                        {item.note || item.status}
                                                    </div>
                                                    <div style={{ fontSize: "0.72rem", color: "#a6968c", marginTop: 2 }}>
                                                        {dateStr}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div style={{ fontSize: "0.8rem", color: "#8d7971", marginBottom: 20 }}>
                                        Belum ada riwayat checkpoint transit baru dari kurir.
                                    </div>
                                )}

                                <div style={{ display: "flex", gap: "10px", marginTop: 12 }}>
                                    {liveTrackingModal.data.tracking_link && (
                                        <a
                                            href={liveTrackingModal.data.tracking_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                flex: 1, padding: "10px", borderRadius: "8px",
                                                background: "#2563eb", color: "#fff",
                                                fontSize: "0.84rem", fontWeight: 700,
                                                textDecoration: "none", textAlign: "center",
                                                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6
                                            }}
                                        >
                                            Buka di Portal Biteship ↗
                                        </a>
                                    )}
                                    <button
                                        onClick={() => setLiveTrackingModal(null)}
                                        style={{
                                            padding: "10px 18px", borderRadius: "8px",
                                            background: "#faf7f2", color: "#6e5c53",
                                            border: "1px solid #dcd1c6", fontSize: "0.84rem", fontWeight: 700, cursor: "pointer"
                                        }}
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── 8. MODAL: AESTHETIC DISPATCH SUCCESS POPUP ── */}
            {dispatchSuccessResult && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(29, 24, 22, 0.68)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    zIndex: 100001,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "16px",
                    fontFamily: "var(--font-sans)",
                }}>
                    <div style={{
                        background: "#ffffff",
                        width: "100%", maxWidth: "460px",
                        borderRadius: "24px",
                        padding: "32px 28px",
                        boxShadow: "0 25px 70px -10px rgba(29, 24, 22, 0.25)",
                        border: "1px solid rgba(205, 171, 143, 0.35)",
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden",
                    }}>
                        {/* Soft Gold Background Glow */}
                        <div style={{
                            position: "absolute",
                            top: "-60px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "200px",
                            height: "200px",
                            background: "radial-gradient(circle, rgba(205, 171, 143, 0.25) 0%, rgba(255,255,255,0) 70%)",
                            pointerEvents: "none"
                        }} />

                        {/* Top Success Icon Badge */}
                        <div style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
                            border: "2px solid #a5d6a7",
                            color: "#2e7d32",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 18px",
                            boxShadow: "0 8px 20px rgba(46, 125, 50, 0.15)"
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>

                        <span style={{
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            color: "#2e7d32",
                            background: "rgba(46, 125, 50, 0.08)",
                            padding: "4px 12px",
                            borderRadius: "999px",
                            display: "inline-block",
                            marginBottom: "10px",
                            border: "1px solid rgba(46, 125, 50, 0.15)"
                        }}>
                            {dispatchSuccessResult.collectionMethod === "drop_off" ? "Drop-off Ready" : "Pick-up Scheduled"}
                        </span>

                        <h3 style={{
                            fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                            fontSize: "1.75rem",
                            fontWeight: 600,
                            color: "#1d1816",
                            margin: "0 0 8px",
                            lineHeight: 1.15
                        }}>
                            {dispatchSuccessResult.collectionMethod === "drop_off" ? "Resi Berhasil Diterbitkan" : "Pesanan Siap Dijemput"}
                        </h3>

                        <p style={{
                            fontSize: "0.86rem",
                            color: "#6e5c53",
                            margin: "0 0 22px",
                            lineHeight: 1.5
                        }}>
                            {dispatchSuccessResult.collectionMethod === "drop_off"
                                ? `Nomor resi resmi sudah aktif. Silakan serahkan paket ke gerai/agen ${dispatchSuccessResult.courier} terdekat (ongkir otomatis lunas).`
                                : `Tiket penjemputan kurir ${dispatchSuccessResult.courier} berhasil dibuat ke sistem Biteship.`}
                        </p>

                        {/* WAYBILL / RESI CARD */}
                        <div style={{
                            background: "#faf7f2",
                            border: "1px solid #e8dfd8",
                            borderRadius: "16px",
                            padding: "16px",
                            marginBottom: "24px",
                            textAlign: "left"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#8d7971", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                    Nomor Resi / AWB
                                </span>
                                <span style={{ fontSize: "0.75rem", color: "#6e5c53", fontWeight: 600 }}>
                                    {dispatchSuccessResult.orderId}
                                </span>
                            </div>

                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                background: "#ffffff",
                                border: "1px solid rgba(205, 171, 143, 0.3)",
                                borderRadius: "10px",
                                padding: "8px 12px",
                                marginBottom: "10px"
                            }}>
                                <span style={{
                                    fontFamily: "monospace",
                                    fontSize: "1.05rem",
                                    fontWeight: 700,
                                    color: "#1d1816",
                                    letterSpacing: "0.04em"
                                }}>
                                    {dispatchSuccessResult.trackingNumber}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(dispatchSuccessResult.trackingNumber);
                                        setCopiedResi(true);
                                        setTimeout(() => setCopiedResi(false), 2000);
                                    }}
                                    style={{
                                        background: copiedResi ? "#2e7d32" : "#1d1816",
                                        color: "#ffffff",
                                        border: "none",
                                        borderRadius: "6px",
                                        padding: "5px 10px",
                                        fontSize: "0.72rem",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    {copiedResi ? "✓ Tersalin!" : "Salin Resi"}
                                </button>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "#382a24", fontWeight: 600 }}>
                                <span style={{ color: "#a67c52" }}>Ekspedisi:</span>
                                <span>{dispatchSuccessResult.courier}</span>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div style={{ display: "flex", gap: "10px" }}>
                            {dispatchSuccessResult.trackingLink && (
                                <a
                                    href={dispatchSuccessResult.trackingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        flex: 1,
                                        padding: "12px",
                                        borderRadius: "12px",
                                        background: "#1d1816",
                                        color: "#faf7f2",
                                        fontSize: "0.86rem",
                                        fontWeight: 700,
                                        textDecoration: "none",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "6px",
                                        boxShadow: "0 4px 14px rgba(29,24,22,0.15)"
                                    }}
                                >
                                    Lacak di Biteship ↗
                                </a>
                            )}
                            <button
                                type="button"
                                onClick={() => setDispatchSuccessResult(null)}
                                style={{
                                    flex: dispatchSuccessResult.trackingLink ? "initial" : 1,
                                    padding: "12px 20px",
                                    borderRadius: "12px",
                                    background: "#faf7f2",
                                    color: "#382a24",
                                    border: "1px solid #dcd1c6",
                                    fontSize: "0.86rem",
                                    fontWeight: 700,
                                    cursor: "pointer"
                                }}
                            >
                                Selesai & Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── 9. MODAL: AESTHETIC ERROR POPUP ── */}
            {dispatchErrorResult && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(29, 24, 22, 0.68)",
                    backdropFilter: "blur(8px)",
                    zIndex: 100001,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "16px",
                    fontFamily: "var(--font-sans)",
                }}>
                    <div style={{
                        background: "#ffffff",
                        width: "100%", maxWidth: "420px",
                        borderRadius: "20px",
                        padding: "28px 24px",
                        boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
                        border: "1px solid #ffcdd2",
                        textAlign: "center",
                    }}>
                        <div style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "50%",
                            background: "#ffebee",
                            color: "#c62828",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                            border: "1.5px solid #ffcdd2"
                        }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>

                        <h3 style={{
                            fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                            fontSize: "1.5rem",
                            fontWeight: 600,
                            color: "#1d1816",
                            margin: "0 0 8px"
                        }}>
                            Gagal Memproses
                        </h3>

                        <p style={{
                            fontSize: "0.85rem",
                            color: "#6e5c53",
                            lineHeight: 1.5,
                            margin: "0 0 20px"
                        }}>
                            {dispatchErrorResult}
                        </p>

                        <button
                            type="button"
                            onClick={() => setDispatchErrorResult(null)}
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "10px",
                                background: "#1d1816",
                                color: "#faf7f2",
                                fontSize: "0.85rem",
                                fontWeight: 700,
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            Mengerti & Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* ── 10. ATELIER FLOATING TOAST NOTIFICATION ── */}
            {toastMessage && (
                <div style={{
                    position: "fixed",
                    top: "24px",
                    right: "24px",
                    zIndex: 999999,
                    background: toastMessage.type === "success" ? "#1d1816" : "#7f1d1d",
                    color: "#faf7f2",
                    padding: "12px 18px",
                    borderRadius: "14px",
                    boxShadow: "0 12px 36px rgba(0,0,0,0.22)",
                    border: `1px solid ${toastMessage.type === "success" ? "rgba(205,171,143,0.4)" : "#f87171"}`,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    fontFamily: "var(--font-sans)",
                }}>
                    <span style={{ fontSize: "1rem" }}>{toastMessage.type === "success" ? "✓" : "⚠️"}</span>
                    <span>{toastMessage.text}</span>
                </div>
            )}
        </>
    );
}
