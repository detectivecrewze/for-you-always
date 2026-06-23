"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CartItem {
    id: string;
    title: string;
    numericPrice: number;
    themeColor: string;
}

interface CartContextValue {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
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
        setItems(prev => {
            // Prevent duplicate — same product id
            if (prev.find(i => i.id === item.id)) return prev;
            return [...prev, item];
        });
        setLastAdded(item);
        // Clear lastAdded after toast duration
        setTimeout(() => setLastAdded(null), 3500);
    }, []);

    const removeFromCart = useCallback((id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
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
