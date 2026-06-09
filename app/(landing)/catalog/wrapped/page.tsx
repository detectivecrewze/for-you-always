"use client";\n\nimport React, { useEffect } from "react";\nimport Navbar from "../../../components/Navbar";\nimport { LandscapeProductCard } from "../../../components/LandscapeProductCard";\nimport Link from "next/link";\n\nexport default function ProductCatalogPage() {\n    useEffect(() => {\n        window.scrollTo(0, 0);\n    }, []);\n\n    return (\n        <div style={{ minHeight: "100vh", background: "#faf7f2" }}>\n            <Navbar />\n            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px clamp(16px, 4vw, 40px) 40px" }}>\n                <Link href="/catalog" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "#a88365", textDecoration: "none", letterSpacing: "0.05em", textTransform: "uppercase" }}>\n                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>\n                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />\n                    </svg>\n                    Kembali ke Katalog\n                </Link>\n            </div>\n            <section style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>\n                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>\n                    <div style={{ display: "flex", flexDirection: "column" }}>\n                        <LandscapeProductCard
                            label="Wrapped Edition"
                            title="Memories Wrapped"
                            description="Kado digital 6 halaman interaktif. Pilih lagu, galeri, rekap perjalanan, hingga surat yang bisa dibuka kapan saja."
                            features={[
                                "6 Halaman Berbeda",
                                "Bisa Turn On / Off Halaman",
                                "Background Music Pilihan"
                            ]}
                            price={
                                <>
                                    <span style={{ textDecoration: "line-through", opacity: 0.6, fontWeight: 500 }}>Rp 25.000</span>
                                    <span style={{ marginLeft: 8 }}>Promo Rp 20.000</span>
                                </>\n                    </div>\n                </div>\n            </section>\n        </div>\n    );\n}