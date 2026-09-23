"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { trackAddToCart } from "@/lib/pixel";

export interface CartItem {
    id: string;
    cartItemId?: string;
    title: string;
    numericPrice: number;
    oldNumericPrice?: number; // harga asli sebelum diskon (untuk display coret)
    themeColor: string;
    themeImgSrc?: string;
    isThreeSlot?: boolean;   // true = user membeli 3 slot (bundle code)
    slotCount?: number;       // jumlah slot, default 1
}

interface CartContextValue {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (cartItemIdOrId: string) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    isDrawerOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
    lastAdded: CartItem | null;
}

interface TikTokPixel {
    track: (event: string, properties: Record<string, unknown>) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "fya_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [lastAdded, setLastAdded] = useState<CartItem | null>(null);
    const [hydrated, setHydrated] = useState(false);
    const itemsRef = useRef<CartItem[]>([]);
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    itemsRef.current = parsed;
                    setItems(parsed);
                }
            }
        } catch {
            // ignore
        }
        setHydrated(true);
    }, []);

    // Persist to localStorage when items change
    useEffect(() => {
        if (!hydrated) return;
        itemsRef.current = items;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // ignore
        }
    }, [items, hydrated]);

    useEffect(() => () => {
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    }, []);

    const addToCart = useCallback((item: CartItem) => {
        const DEFAULT_IMAGES: Record<string, string> = {
            voices: "https://cdn.for-you-always.my.id/1777881039502-bav595.webp",
            mixtape: "https://cdn.for-you-always.my.id/1781034685666-udzbps.png",
            retro: "https://cdn.for-you-always.my.id/1778444079509-72xi4d.png",
            arcade: "https://cdn.for-you-always.my.id/1777884639353-xogjtd.webp",
            wrapped: "https://cdn.for-you-always.my.id/1777887751232-efe0ge.webp",
            letter: "https://cdn.for-you-always.my.id/1777883950201-eede1i.webp",
            invitation: "https://cdn.for-you-always.my.id/1782232677562-8sosah.webp",
            loves: "/assets/opening_gate.png",
            birthday: "/assets/snoopy-features/main-card-updatesnoopy.webp",
            storybook: "/assets/storybook-features/spiderman-box.jpg",
        };

        if (['birthday', 'storybook'].includes(item.id) && itemsRef.current.some(existing => existing.id === item.id)) {
            setIsDrawerOpen(true);
            return;
        }

        const itemWithUniqueId = {
            ...item, 
            cartItemId: item.cartItemId || Math.random().toString(36).substring(2, 9),
            themeImgSrc: item.themeImgSrc || DEFAULT_IMAGES[item.id]
        };
        const nextItems = [...itemsRef.current, itemWithUniqueId];
        itemsRef.current = nextItems;
        setItems(nextItems);
        setLastAdded(itemWithUniqueId);
        setIsDrawerOpen(true);
        void import("posthog-js").then(({ default: posthog }) => {
            const packageType = item.isThreeSlot ? "3_gift" : "regular";
            posthog.capture('product_added_to_cart', {
                product_id: item.id,
                product_name: item.title,
                package: packageType,
                price: item.numericPrice,
                currency: 'IDR',
            });
            posthog.capture('cart_opened', {
                source: 'add_to_cart',
                product_id: item.id,
                product_name: item.title,
                package: packageType,
                price: item.numericPrice,
                currency: 'IDR',
            });
        }).catch(() => {});
        
        const ttq = typeof window !== "undefined"
            ? (window as Window & { ttq?: TikTokPixel }).ttq
            : undefined;
        if (ttq) {
            ttq.track('AddToCart', {
                content_type: 'product',
                content_id: item.id,
                content_name: item.title,
                value: item.numericPrice,
                currency: 'IDR'
            });
        }
        trackAddToCart({ id: item.id, name: item.title, price: item.numericPrice });

        // Clear lastAdded after toast duration
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setLastAdded(null), 3500);
    }, []);

    const removeFromCart = useCallback((identifier: string) => {
        const nextItems = itemsRef.current.filter(i => i.cartItemId !== identifier && i.id !== identifier);
        itemsRef.current = nextItems;
        setItems(nextItems);
    }, []);

    const clearCart = useCallback(() => {
        itemsRef.current = [];
        setItems([]);
    }, []);

    const openDrawer = useCallback(() => {
        setIsDrawerOpen(true);
        void import("posthog-js").then(({ default: posthog }) => {
            const currentItems = itemsRef.current;
            posthog.capture('cart_opened', {
                source: 'navbar',
                item_count: currentItems.length,
                cart_value: currentItems.reduce((sum, item) => sum + item.numericPrice, 0),
                currency: 'IDR',
                products: currentItems.map(item => ({
                    product_id: item.id,
                    product_name: item.title,
                    package: item.isThreeSlot ? '3_gift' : 'regular',
                    price: item.numericPrice,
                })),
            });
        }).catch(() => {});
    }, []);
    const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

    const cartCount = items.length;
    const cartTotal = items.reduce((sum, i) => sum + i.numericPrice, 0);

    return (
        <CartContext.Provider value={{
            items, addToCart, removeFromCart, clearCart,
            cartCount, cartTotal,
            isDrawerOpen, openDrawer, closeDrawer,
            lastAdded
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
}
