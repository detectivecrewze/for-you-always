"use client";\n\nimport React, { useEffect } from "react";\nimport Navbar from "../../../components/Navbar";\nimport { LandscapeProductCard } from "../../../components/LandscapeProductCard";\nimport Link from "next/link";\n\nexport default function ProductCatalogPage() {\n    useEffect(() => {\n        window.scrollTo(0, 0);\n    }, []);\n\n    return (\n        <div style={{ minHeight: "100vh", background: "#faf7f2" }}>\n            <Navbar />\n            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px clamp(16px, 4vw, 40px) 40px" }}>\n                <Link href="/catalog" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "#a88365", textDecoration: "none", letterSpacing: "0.05em", textTransform: "uppercase" }}>\n                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>\n                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />\n                    </svg>\n                    Kembali ke Katalog\n                </Link>\n            </div>\n            <section style={{ position: "relative", zIndex: 1, padding: "0 0 120px" }}>\n                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>\n                    <div style={{ display: "flex", flexDirection: "column" }}>\n                        <LandscapeProductCard
                            label={
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    Voices Gift <span style={{ opacity: 0.5 }}>ΓÇó</span> Best Seller
                                </div>
                            }
                            title="Kado Suara & Foto"
                            description="Rangkai kenangan visual dan audio menjadi satu memori abadi bernuansa sinematik. Ungkapkan perasaanmu secara langsung."
                            features={[
                                "Rekam Suara & Custom Pesan",
                                "Galeri Foto Sinematik",
                                "Background Music Pilihan"
                            ]}
                            price="Promo Rp 15.000"
                            addonText="Tersedia opsi Terima Jadi: Rp 30.000"
                            mediaSrc="https://cdn.for-you-always.my.id/1775620755494-cig1w.mp4"
                            fallbackImgSrc="https://cdn.for-you-always.my.id/1777881039502-bav595.webp"
                            mediaType="image"
                            accentColor="#a67c52"
                            accentGlow="rgba(166,124,82,0.2)"
                            href="https://wa.me/6281936109076?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Voices%20Edition*%20seharga%20Promo%20Rp%2015.000.%0A%0AMohon%20info%20langkah%20selanjutnyaya.%20Terima%20kasih!"
                            themes={[
                                { name: "Music Box", desc: "Nuansa kotak musik klasik", color: "#a67c52", videoSrc: "https://cdn.for-you-always.my.id/1775620755494-cig1w.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1777881039502-bav595.webp" },
                                { name: "Camera", desc: "Tampilan bergaya retro camera", color: "#9ca3af", videoSrc: "https://cdn.for-you-always.my.id/1777794147584-6sq29.mp4", fallbackImgSrc: "https://cdn.for-you-always.my.id/1777882686448-bkvu14.png" }
                            ]}
                            delay={100}
                            initialSelectedIndex={0}
                            autoCycle={true}
                            tiktokHref="https://www.tiktok.com/@foryoualways.id/video/7608960116141886740?is_from_webapp=1&sender_device=pc"
                        />\n                    </div>\n                </div>\n            </section>\n        </div>\n    );\n}