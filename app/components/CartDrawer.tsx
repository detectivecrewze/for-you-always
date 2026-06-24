"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart, CartItem } from "../context/CartContext";
import CartCheckoutModal from "./CartCheckoutModal";

export default function CartDrawer() {
    const { items, removeFromCart, clearCart, cartTotal, isDrawerOpen, closeDrawer } = useCart();
    const [showCheckout, setShowCheckout] = useState(false);

    return (
        <>
            <style>{`
                @keyframes backdropIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .cart-drawer-panel {
                    transform: translateX(100%);
                    transition: transform 0.38s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .cart-drawer-panel.open {
                    transform: translateX(0);
                }
                @media (max-width: 600px) {
                    .cart-drawer-panel {
                        top: auto !important;
                        bottom: 0 !important;
                        right: 0 !important;
                        left: 0 !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        height: 88vh !important;
                        border-radius: 24px 24px 0 0 !important;
                        transform: translateY(100%) !important;
                        transition: transform 0.38s cubic-bezier(0.34,1.2,0.64,1) !important;
                    }
                    .cart-drawer-panel.open {
                        transform: translateY(0) !important;
                    }
                }
                .cart-item-row:hover .cart-item-remove { opacity: 1 !important; }
            `}</style>

            {/* Backdrop */}
            {isDrawerOpen && (
                <div
                    onClick={closeDrawer}
                    style={{
                        position: "fixed", inset: 0, zIndex: 99998,
                        background: "rgba(0,0,0,0.45)",
                        backdropFilter: "blur(4px)",
                        animation: "backdropIn 0.25s ease forwards",
                    }}
                />
            )}

            {/* Drawer Panel */}
            <div
                className={`cart-drawer-panel ${isDrawerOpen ? 'open' : ''}`}
                style={{
                    position: "fixed",
                    top: 0, right: 0, bottom: 0,
                    width: 400,
                    maxWidth: "92vw",
                    background: "#faf7f2",
                    zIndex: 99999,
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "-8px 0 48px rgba(29,24,22,0.16)",
                    borderLeft: "1px solid rgba(205,171,143,0.2)",
                    pointerEvents: isDrawerOpen ? "auto" : "none",
                }}
            >
                {/* Header */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "24px 24px 20px",
                    borderBottom: "1px solid rgba(205,171,143,0.15)",
                }}>
                    <div>
                        <h2 style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 22, color: "#1d1816",
                            margin: 0, letterSpacing: "-0.02em",
                        }}>
                            Keranjang
                        </h2>
                        <p style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: 11, color: "#a67c52",
                            margin: 0, fontWeight: 600,
                            letterSpacing: "0.06em", textTransform: "uppercase",
                        }}>
                            {items.length} kado dipilih
                        </p>
                    </div>
                    <button
                        onClick={closeDrawer}
                        style={{
                            background: "rgba(205,171,143,0.1)",
                            border: "1px solid rgba(205,171,143,0.25)",
                            borderRadius: "50%",
                            width: 36, height: 36,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", color: "#6e5c53",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(205,171,143,0.2)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(205,171,143,0.1)"; }}
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Items or Empty State */}
                <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
                    {items.length === 0 ? (
                        <div style={{
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center",
                            height: "100%", gap: 16, padding: "40px 0",
                        }}>
                            <div style={{
                                width: 72, height: 72,
                                background: "rgba(205,171,143,0.1)",
                                borderRadius: "50%",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#cdab8f" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <p style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#382a24", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
                                    Keranjang masih kosong
                                </p>
                                <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#8b7e75", margin: 0 }}>
                                    Pilih kado dari katalog dulu, ya 🎁
                                </p>
                            </div>
                            <a
                                href="/catalog"
                                onClick={closeDrawer}
                                style={{
                                    marginTop: 8,
                                    padding: "10px 24px",
                                    borderRadius: 999,
                                    background: "#1d1816",
                                    color: "#faf7f2",
                                    fontFamily: "var(--font-sans)",
                                    fontSize: 11,
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    textDecoration: "none",
                                    transition: "background 0.2s ease",
                                }}
                            >
                                Lihat Katalog
                            </a>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {Object.values(items.reduce((acc, item) => {
                                if (!acc[item.id]) {
                                    acc[item.id] = { ...item, quantity: 1, cartItemIds: [item.cartItemId || item.id] };
                                } else {
                                    acc[item.id].quantity += 1;
                                    acc[item.id].cartItemIds.push(item.cartItemId || item.id);
                                }
                                return acc;
                            }, {} as Record<string, any>)).map((group: any) => (
                                <div
                                    key={group.id}
                                    className="cart-item-row"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 14,
                                        background: "#fff",
                                        borderRadius: 16,
                                        padding: "14px 16px",
                                        border: "1px solid rgba(205,171,143,0.15)",
                                        boxShadow: "0 2px 8px rgba(29,24,22,0.04)",
                                        transition: "box-shadow 0.2s ease",
                                        position: "relative",
                                    }}
                                >
                                    {/* Image or Color swatch */}
                                    <div style={{
                                        width: 40, height: 40,
                                        borderRadius: 12,
                                        background: group.themeColor || "#cdab8f",
                                        flexShrink: 0,
                                        position: "relative",
                                        overflow: "hidden",
                                        boxShadow: `0 4px 12px ${group.themeColor || "#cdab8f"}44`,
                                    }}>
                                        {group.themeImgSrc && (
                                            <Image 
                                                src={group.themeImgSrc} 
                                                alt={group.title}
                                                fill
                                                style={{ objectFit: "cover" }}
                                            />
                                        )}
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontFamily: "var(--font-sans)",
                                            fontSize: 13, fontWeight: 700,
                                            color: "#1d1816",
                                            marginBottom: 3,
                                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                        }}>
                                            {group.title} {group.quantity > 1 && <span style={{ color: "#a67c52", fontSize: 12, marginLeft: 4 }}>(x{group.quantity})</span>}
                                        </div>
                                        <div style={{
                                            fontFamily: "var(--font-sans)",
                                            fontSize: 12, fontWeight: 600,
                                            color: "#a67c52",
                                        }}>
                                            Rp {(group.numericPrice * group.quantity).toLocaleString("id-ID")}
                                        </div>
                                    </div>

                                    <button
                                        className="cart-item-remove"
                                        onClick={() => removeFromCart(group.cartItemIds[group.cartItemIds.length - 1])}
                                        style={{
                                            background: "rgba(220,50,50,0.07)",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: 30, height: 30,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            cursor: "pointer",
                                            color: "#c9184a",
                                            opacity: 0.6,
                                            transition: "all 0.2s ease",
                                            flexShrink: 0,
                                        }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.background = "rgba(220,50,50,0.12)"; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0.6"; (e.currentTarget as HTMLElement).style.background = "rgba(220,50,50,0.07)"; }}
                                        aria-label={`Hapus satu ${group.title}`}
                                    >
                                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}

                            {/* Clear all */}
                            {items.length > 1 && (
                                <button
                                    onClick={clearCart}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        fontFamily: "var(--font-sans)",
                                        fontSize: 11, color: "#8b7e75",
                                        cursor: "pointer",
                                        alignSelf: "center",
                                        letterSpacing: "0.05em",
                                        padding: "4px 8px",
                                        textDecoration: "underline",
                                        textUnderlineOffset: 3,
                                        opacity: 0.7,
                                        transition: "opacity 0.2s",
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
                                >
                                    Hapus semua
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer — only shown when cart has items */}
                {items.length > 0 && (
                    <div style={{
                        padding: "20px 24px 28px",
                        borderTop: "1px solid rgba(205,171,143,0.15)",
                        background: "#faf7f2",
                    }}>
                        {/* Total */}
                        <div style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "baseline",
                            marginBottom: 16,
                        }}>
                            <span style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: 11, fontWeight: 700,
                                color: "#8b7e75",
                                letterSpacing: "0.1em", textTransform: "uppercase",
                            }}>
                                Total
                            </span>
                            <span style={{
                                fontFamily: "var(--font-display)",
                                fontSize: 26, color: "#1d1816",
                                letterSpacing: "-0.02em",
                            }}>
                                Rp {cartTotal.toLocaleString("id-ID")}
                            </span>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={() => { closeDrawer(); setShowCheckout(true); }}
                            style={{
                                width: "100%",
                                padding: "16px",
                                borderRadius: 14,
                                border: "none",
                                background: "#1d1816",
                                color: "#faf7f2",
                                fontFamily: "var(--font-sans)",
                                fontSize: 12, fontWeight: 700,
                                letterSpacing: "0.12em", textTransform: "uppercase",
                                cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                boxShadow: "0 8px 24px rgba(29,24,22,0.25)",
                                transition: "all 0.3s ease",
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#a67c52"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#1d1816"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                        >
                            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Checkout Semua ({items.length} kado)
                        </button>

                        <p style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: 10, color: "#a67c52",
                            textAlign: "center", margin: "10px 0 0",
                            opacity: 0.7,
                        }}>
                            Akses digital dikirim otomatis ke email kamu
                        </p>
                    </div>
                )}
            </div>

            {showCheckout && (
                <CartCheckoutModal onClose={() => setShowCheckout(false)} />
            )}
        </>
    );
}
