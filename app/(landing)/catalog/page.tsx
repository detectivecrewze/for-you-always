"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import CompactProductCard from "../../components/CompactProductCard";
import { AnimatedSection } from "../../components/AnimatedSection";
import { useCart, type CartItem } from "../../context/CartContext";
import PurchaseModeModal, { type PurchaseModeConfig } from "../../components/PurchaseModeModal";
import CartCheckoutModal from "../../components/CartCheckoutModal";
import { STOREFRONT_CATALOG, type StorefrontCatalogItem } from "@/lib/storefront-catalog";
import { createDoneForYouItem, getDigitalPurchaseOption } from "@/lib/purchase-options";
import styles from "./catalog.module.css";

const CATALOG_ITEMS = STOREFRONT_CATALOG;
const PREFERRED_OCCASION_ORDER = ["birthday", "anniversary", "ldr", "apology", "bestie", "crush"];

function normalizeOccasion(value: string) {
    return value.trim().toLocaleLowerCase("id-ID");
}

function formatOccasion(value: string) {
    if (value === "ldr") return "LDR";
    return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const occasionValues = Array.from(new Set(CATALOG_ITEMS.flatMap((item) => item.occasions.map(normalizeOccasion))));
const OCCASION_FILTERS = [
    ...PREFERRED_OCCASION_ORDER.filter((occasion) => occasionValues.includes(occasion)),
    ...occasionValues.filter((occasion) => !PREFERRED_OCCASION_ORDER.includes(occasion)).sort(),
];

export default function CatalogPage() {
    const router = useRouter();
    const { addToCart } = useCart();
    const [purchaseModeConfig, setPurchaseModeConfig] = useState<PurchaseModeConfig | null>(null);
    const [unboxStock, setUnboxStock] = useState<number | null>(null);
    const [directCheckoutItem, setDirectCheckoutItem] = useState<CartItem | null>(null);
    const [activeOccasion, setActiveOccasion] = useState("all");

    useEffect(() => {
        const syncFilterFromUrl = () => {
            const requested = normalizeOccasion(new URLSearchParams(window.location.search).get("occasion") || "all");
            setActiveOccasion(requested === "all" || OCCASION_FILTERS.includes(requested) ? requested : "all");
        };

        syncFilterFromUrl();
        window.addEventListener("popstate", syncFilterFromUrl);
        window.scrollTo(0, 0);
        fetch("/api/inventory?product_id=the-gift-box-kraft")
            .then((response) => response.json())
            .then((data) => {
                if (data && typeof data.stock === "number") setUnboxStock(data.stock);
            })
            .catch(() => {});
        return () => window.removeEventListener("popstate", syncFilterFromUrl);
    }, []);

    const selectOccasion = useCallback((occasion: string) => {
        setActiveOccasion(occasion);
        const nextUrl = new URL(window.location.href);
        if (occasion === "all") nextUrl.searchParams.delete("occasion");
        else nextUrl.searchParams.set("occasion", occasion);
        window.history.pushState({}, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
    }, []);

    const visibleItems = useMemo(() => {
        if (activeOccasion === "all") return CATALOG_ITEMS;
        return CATALOG_ITEMS.filter((item) => item.occasions.some((occasion) => normalizeOccasion(occasion) === activeOccasion));
    }, [activeOccasion]);

    const handlePesan = useCallback((item: Pick<StorefrontCatalogItem, "id" | "title" | "numericPrice" | "titleColor" | "oldPrice">) => {
        if (item.id === "the-gift-box" || item.id === "unbox-the-memory") {
            router.push("/catalog/the-gift-box");
            return;
        }

        const oldNumericPrice = item.oldPrice ? Number.parseInt(item.oldPrice.replace(/\D/g, ""), 10) : undefined;
        const selfServiceItem: CartItem = { id: item.id, title: item.title, numericPrice: item.numericPrice, oldNumericPrice, themeColor: item.titleColor };
        const option = getDigitalPurchaseOption(item.id);

        const selectSelfService = () => {
            if (item.id === "plan") {
                setDirectCheckoutItem({ ...selfServiceItem, themeImgSrc: "/assets/the-plan/hero.webp" });
                return;
            }
            if (item.id === "sorry") setDirectCheckoutItem({ ...selfServiceItem, themeImgSrc: "/assets/sorry-features/sorry-envelope.webp", fulfillmentMode: "self_service" });
            else addToCart({ ...selfServiceItem, fulfillmentMode: "self_service" });
        };

        if (!option) {
            selectSelfService();
            return;
        }

        setPurchaseModeConfig({
            productId: option.id,
            productTitle: option.title,
            themeColor: option.themeColor,
            selfServicePrice: option.basePrice,
            doneForYouPrice: option.doneForYouPrice,
            onSelectSelfService: selectSelfService,
            onSelectDoneForYou: () => {
                const doneForYouItem = createDoneForYouItem(item.id);
                if (doneForYouItem) setDirectCheckoutItem(doneForYouItem);
            },
        });
    }, [addToCart, router]);

    return (
        <main className={styles.page}>
            <Navbar />

            <div className={styles.shell}>
                <header className={styles.header}>
                    <h1>Semua <span>Koleksi.</span></h1>
                    <p>Jelajahi koleksi kado digital eksklusif kami. Temukan kanvas terbaik untuk merangkai kenanganmu.</p>
                    <Link href="/gift-finder" className={styles.finderLink}>Bantu Pilihkan Kado</Link>
                </header>

                <section className={styles.filterRegion} aria-label="Filter katalog berdasarkan occasion">
                    <div className={styles.filterScroller} role="group" aria-label="Pilihan occasion">
                        <button type="button" className={styles.filterChip} aria-pressed={activeOccasion === "all"} onClick={() => selectOccasion("all")}>Semua</button>
                        {OCCASION_FILTERS.map((occasion) => (
                            <button key={occasion} type="button" className={styles.filterChip} aria-pressed={activeOccasion === occasion} onClick={() => selectOccasion(occasion)}>
                                {formatOccasion(occasion)}
                            </button>
                        ))}
                    </div>
                    <p className={styles.resultMeta} aria-live="polite">{visibleItems.length} produk ditemukan</p>
                </section>

                <section className={styles.grid} aria-label="Daftar produk">
                    {visibleItems.map((item, index) => {
                        const slotText = item.id === "the-gift-box" || item.id === "unbox-the-memory"
                            ? (unboxStock !== null ? `Sisa ${unboxStock} Box` : (item.slotBadgeText || "Sisa 5 Box"))
                            : item.slotBadgeText;
                        return (
                            <AnimatedSection key={item.id} delay={0} priority={index < 2} className={styles.gridItem}>
                                <CompactProductCard
                                    {...item}
                                    productId={item.id}
                                    slotBadgeText={slotText}
                                    priority={index < 2}
                                    onAddToCart={() => handlePesan(item)}
                                />
                            </AnimatedSection>
                        );
                    })}

                    {visibleItems.length === 0 && (
                        <div className={styles.emptyState}>
                            <h2>Belum ada koleksi di kategori ini.</h2>
                            <p>Coba pilih occasion lain atau tampilkan kembali seluruh koleksi.</p>
                            <button type="button" className={styles.resetButton} onClick={() => selectOccasion("all")}>Lihat semua produk</button>
                        </div>
                    )}
                </section>
            </div>

            {purchaseModeConfig && <PurchaseModeModal config={purchaseModeConfig} onClose={() => setPurchaseModeConfig(null)} />}
            {directCheckoutItem && <CartCheckoutModal directItem={directCheckoutItem} onClose={() => setDirectCheckoutItem(null)} />}

            <a className={styles.whatsApp} href="https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20ingin%20bertanya%20tentang%20produk%20kalian." target="_blank" rel="noopener noreferrer" aria-label="Hubungi via WhatsApp">
                <span className={styles.whatsAppLabel}>Butuh bantuan?&nbsp; <strong>Chat Admin</strong></span>
                <span className={styles.whatsAppIcon}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#faf7f2" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.486 3.53 1.337 5.006L2.001 22l5.13-1.322A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.065-1.112l-.292-.174-3.046.784.813-2.934-.19-.302A7.965 7.965 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
                    </svg>
                </span>
            </a>
        </main>
    );
}
