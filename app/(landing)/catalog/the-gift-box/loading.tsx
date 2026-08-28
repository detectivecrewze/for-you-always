export default function GiftBoxLoading() {
    return (
        <main
            aria-busy="true"
            aria-label="Memuat halaman The Gift Box"
            style={{
                minHeight: "100vh",
                background: "#faf7f2",
                color: "#382a24",
                fontFamily: "var(--font-sans, system-ui, sans-serif)",
                padding: "24px",
            }}
        >
            <div
                style={{
                    height: 64,
                    maxWidth: 1160,
                    margin: "0 auto",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(205,171,143,0.18)",
                }}
            />

            <section
                style={{
                    maxWidth: 1160,
                    margin: "72px auto 0",
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 0.9fr)",
                    gap: "clamp(28px, 5vw, 64px)",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        aspectRatio: "16 / 10",
                        borderRadius: 24,
                        background: "linear-gradient(135deg, #eee4d8, #e4d5c5)",
                    }}
                />
                <div style={{ display: "grid", gap: 18 }}>
                    <div style={{ width: 150, height: 14, borderRadius: 8, background: "#e7d9cb" }} />
                    <div style={{ width: "88%", height: 52, borderRadius: 12, background: "#e1d0c0" }} />
                    <div style={{ width: "100%", height: 16, borderRadius: 8, background: "#eadfd5" }} />
                    <div style={{ width: "76%", height: 16, borderRadius: 8, background: "#eadfd5" }} />
                    <div style={{ width: 190, height: 52, borderRadius: 14, background: "#d7c0aa" }} />
                </div>
            </section>

            <style>{`
                @media (max-width: 768px) {
                    main > section {
                        grid-template-columns: 1fr !important;
                        margin-top: 36px !important;
                    }
                }
            `}</style>
        </main>
    );
}

