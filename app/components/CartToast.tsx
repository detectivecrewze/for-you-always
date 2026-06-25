"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function CartToast() {
    const { lastAdded, openDrawer } = useCart();
    const [visible, setVisible] = useState(false);
    const [animOut, setAnimOut] = useState(false);

    useEffect(() => {
        if (!lastAdded) {
            requestAnimationFrame(() => setAnimOut(true));
            const t = setTimeout(() => { setVisible(false); setAnimOut(false); }, 350);
            return () => clearTimeout(t);
        }
        requestAnimationFrame(() => {
            setVisible(true);
            setAnimOut(false);
        });
    }, [lastAdded]);

    if (!visible) return null;

    return (
        <>
            <style>{`
                @keyframes toastSlideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes toastSlideDown {
                    from { opacity: 1; transform: translateY(0) scale(1); }
                    to   { opacity: 0; transform: translateY(20px) scale(0.96); }
                }
                .cart-toast {
                    animation: toastSlideUp 0.32s cubic-bezier(0.34,1.56,0.64,1) forwards;
                }
                .cart-toast.out {
                    animation: toastSlideDown 0.3s ease forwards;
                }
            `}</style>
            <div
                className={`cart-toast${animOut ? " out" : ""}`}
                style={{
                    position: "fixed",
                    bottom: 28,
                    right: 20,
                    zIndex: 999998,
                    background: "#1d1816",
                    color: "#faf7f2",
                    borderRadius: 16,
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.28)",
                    maxWidth: 320,
                    cursor: "pointer",
                    border: "1px solid rgba(205,171,143,0.2)",
                }}
                onClick={() => openDrawer()}
            >
                {/* Check icon */}
                <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "rgba(166,124,82,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cdab8f" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "var(--font-sans)", color: "#faf7f2", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {lastAdded?.title}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(250,247,242,0.55)", fontFamily: "var(--font-sans)", fontWeight: 500 }}>
                        Berhasil dipesan · Tap untuk lihat
                    </div>
                </div>

                {/* Chevron */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(250,247,242,0.4)" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </>
    );
}
