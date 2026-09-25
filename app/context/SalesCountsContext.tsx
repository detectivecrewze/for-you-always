"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type SalesCounts = Record<string, number>;

const SalesCountsContext = createContext<SalesCounts | null>(null);

export function SalesCountsProvider({ children }: { children: React.ReactNode }) {
    const [counts, setCounts] = useState<SalesCounts | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        fetch("/api/sales-counts", { signal: controller.signal })
            .then((response) => {
                if (!response.ok) throw new Error("Sales counts unavailable");
                return response.json();
            })
            .then((payload) => {
                if (!payload || typeof payload.counts !== "object" || payload.counts === null) return;
                const safeCounts = Object.fromEntries(
                    Object.entries(payload.counts)
                        .filter(([, value]) => typeof value === "number" && Number.isFinite(value) && value >= 0)
                        .map(([productId, value]) => [productId, Math.floor(value as number)]),
                );
                setCounts(safeCounts);
            })
            .catch((error) => {
                if (error instanceof DOMException && error.name === "AbortError") return;
                // Social proof is optional; product cards stay usable when the gateway is unavailable.
            });

        return () => controller.abort();
    }, []);

    const value = useMemo(() => counts, [counts]);
    return <SalesCountsContext.Provider value={value}>{children}</SalesCountsContext.Provider>;
}

export function useSalesCount(productId?: string) {
    const counts = useContext(SalesCountsContext);
    if (!productId || !counts || typeof counts[productId] !== "number") return null;
    return counts[productId];
}
