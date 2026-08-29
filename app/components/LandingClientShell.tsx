"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { CartProvider, useCart } from "../context/CartContext";

const CartDrawer = dynamic(() => import("./CartDrawer"), { ssr: false });
const CartToast = dynamic(() => import("./CartToast"), { ssr: false });

function LandingCartUi() {
    const { isDrawerOpen, lastAdded } = useCart();
    const [hasMountedDrawer, setHasMountedDrawer] = useState(false);

    useEffect(() => {
        if (isDrawerOpen) setHasMountedDrawer(true);
    }, [isDrawerOpen]);

    return (
        <>
            {hasMountedDrawer ? <CartDrawer /> : null}
            {lastAdded ? <CartToast /> : null}
        </>
    );
}

export default function LandingClientShell({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            {children}
            <LandingCartUi />
        </CartProvider>
    );
}
