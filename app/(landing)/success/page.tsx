"use client";

import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function SuccessPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ minHeight: "100vh", background: "#faf7f2", overflowX: "clip" }}>
            <Navbar />
            
            <section style={{ 
                position: "relative", zIndex: 1, 
                paddingTop: "clamp(120px, 15vh, 160px)", 
                paddingBottom: "clamp(80px, 12vh, 130px)", 
                textAlign: "center",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                minHeight: "80vh"
            }}>
                <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
                    {/* Animated Checkmark */}
                    <div style={{
                        width: 90, height: 90, borderRadius: "50%", background: "#e8f5e9",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 32px",
                        boxShadow: "0 12px 32px -8px rgba(76, 175, 80, 0.3)"
                    }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>

                    <h1 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(2.5rem, 6vw, 4rem)",
                        fontWeight: 400, lineHeight: 1.1,
                        letterSpacing: "-0.03em", color: "#382a24", marginBottom: 24,
                    }}>
                        Pembayaran <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Berhasil!</span>
                    </h1>

                    <p style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "clamp(1rem, 2vw, 1.1rem)",
                        color: "#6e5c53", lineHeight: 1.8,
                        maxWidth: 480, margin: "0 auto 48px",
                        letterSpacing: "-0.01em"
                    }}>
                        Terima kasih atas pesanan Anda. Link studio untuk mulai menyunting kado digital Anda <strong>telah dikirimkan ke email Anda.</strong>
                        <br/><br/>
                        Silakan periksa folder Inbox atau Spam Anda.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
                        <Link
                            href="/"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center",
                                padding: "16px 36px", borderRadius: 999, width: "100%", maxWidth: 300,
                                background: "#1d1816", color: "#faf7f2",
                                fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                textDecoration: "none", transition: "all 0.3s ease",
                                boxShadow: "0 8px 32px -8px rgba(29,24,22,0.25)"
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.background = "#cdab8f"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.background = "#1d1816"; }}
                        >
                            Kembali ke Beranda
                        </Link>

                        <a
                            href="https://wa.me/6281936109076?text=Halo%20Admin,%20saya%20sudah%20membayar%20pesanan%20kado%20digital%20namun%20link%20belum%20masuk%20ke%20email."
                            target="_blank" rel="noopener noreferrer"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center",
                                padding: "16px 36px", borderRadius: 999, width: "100%", maxWidth: 300,
                                background: "transparent", color: "#6e5c53",
                                fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                textDecoration: "none", transition: "all 0.3s ease",
                                border: "1.5px solid rgba(205,171,143,0.35)",
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#cdab8f"; (e.currentTarget as HTMLElement).style.color = "#a88365"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(205,171,143,0.35)"; (e.currentTarget as HTMLElement).style.color = "#6e5c53"; }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.477 2 2 6.477 2 12c0 1.821.486 3.53 1.337 5.006L2.001 22l5.13-1.322A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" /></svg>
                            Hubungi Bantuan
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
