"use client";

import React from "react";
import "./landing.css";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";
import CartToast from "../components/CartToast";

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