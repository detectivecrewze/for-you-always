"use client";

import React from "react";
import dynamic from "next/dynamic";
import "./landing.css";
import { CartProvider } from "../context/CartContext";

const CartDrawer = dynamic(() => import("../components/CartDrawer"), { ssr: false });
const CartToast = dynamic(() => import("../components/CartToast"), { ssr: false });

export default function LandingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <CartProvider>
            {children}
            <CartDrawer />
            <CartToast />
        </CartProvider>
    );
}