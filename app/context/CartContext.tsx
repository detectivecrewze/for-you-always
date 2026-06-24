"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CartItem {
    id: string;
    cartItemId?: string;
    title: string;
    numericPrice: number;
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

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "fya_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [lastAdded, setLastAdded] = useState<CartItem | null>(null);
    const [hydrated, setHydrated] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    // eslint-disable-next-line
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
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // ignore
        }
    }, [items, hydrated]);

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
        };

        const itemWithUniqueId = { 
            ...item, 
            cartItemId: item.cartItemId || Math.random().toString(36).substring(2, 9),
            themeImgSrc: item.themeImgSrc || DEFAULT_IMAGES[item.id]
        };
        setItems(prev => [...prev, itemWithUniqueId]);
        setLastAdded(itemWithUniqueId);
        // Clear lastAdded after toast duration
        setTimeout(() => setLastAdded(null), 3500);
    }, []);

    const removeFromCart = useCallback((identifier: string) => {
        setItems(prev => prev.filter(i => i.cartItemId !== identifier && i.id !== identifier));
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
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
