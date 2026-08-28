const steps = [
    {
        num: "01",
        title: "Pilih & Personalisasi",
        desc: "Pilih format kado digital favoritmu (Letter, Voices, Birthday, atau Memoria) dan lengkapi alamat pengiriman saat checkout.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
        )
    },
    {
        num: "02",
        title: "Kami Rangkai & Kirim",
        desc: "Kami merangkai gift box eksklusif, mencetak Kartu Akses QR Custom, dan mengirimkannya dengan aman.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
        )
    },
    {
        num: "03",
        title: "Pindai & Buka Kado",
        desc: "Penerima cukup memindai Kartu Akses QR Custom dengan kamera HP. Halaman kado digital langsung terbuka dengan musik dan animasi.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
            </svg>
        )
    }
] as const;

export default function GiftBoxProcessSection() {
    return (
        <section id="cara-kerja" style={{ position: "relative", zIndex: 1, padding: "90px 24px", background: "#f2ebe1", overflow: "hidden" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "70px" }}>
                    <span style={{
                        fontSize: "0.8rem", fontWeight: 700,
                        letterSpacing: "0.22em", textTransform: "uppercase", color: "#a88365",
                        display: "inline-block", padding: "6px 20px",
                        border: "1.2px solid rgba(205,171,143,0.2)", borderRadius: 999,
                        background: "rgba(205,171,143,0.08)", marginBottom: "20px"
                    }}>
                        Alur Pemesanan
                    </span>
                    <h2 style={{ fontFamily: "var(--font-display, Cormorant Garamond, serif)", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 400, color: "#382a24", lineHeight: 0.98 }}>
                        Semudah<br />
                        <span style={{ fontStyle: "italic", color: "#cdab8f" }}>Tiga Langkah.</span>
                    </h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                    {steps.map((step, i) => (
                        <div key={step.num} style={{
                            padding: "44px 36px",
                            background: i === 1 ? "#1d1816" : "#ffffff",
                            borderRadius: "24px",
                            border: i === 1 ? "1px solid rgba(205,171,143,0.2)" : "1px solid rgba(205,171,143,0.25)",
                            boxShadow: i === 1 ? "0 25px 50px -12px rgba(29,24,22,0.4)" : "0 8px 30px -8px rgba(29,24,22,0.04)",
                            height: "100%"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                                <span style={{ fontSize: 12, color: i === 1 ? "#cdab8f" : "#a6968c", fontWeight: 700, letterSpacing: "0.1em" }}>{step.num}</span>
                                <div style={{ flex: 1, height: 1, background: "rgba(205,171,143,0.15)" }} />
                                <div style={{ color: i === 1 ? "#cdab8f" : "#a6968c", display: "flex" }}>
                                    {step.icon}
                                </div>
                            </div>
                            <h3 style={{ fontFamily: "var(--font-display, Cormorant Garamond, serif)", fontSize: "1.6rem", fontWeight: 500, color: i === 1 ? "#faf7f2" : "#382a24", marginBottom: 14, lineHeight: 1.15 }}>
                                {step.title}
                            </h3>
                            <p style={{ fontSize: "0.9rem", color: i === 1 ? "rgba(250,247,242,0.65)" : "#6e5c53", lineHeight: 1.65, margin: 0 }}>
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

