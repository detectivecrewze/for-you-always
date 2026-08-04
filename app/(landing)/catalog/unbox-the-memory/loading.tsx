import React from "react";

export default function UnboxTheMemoryLoading() {
    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#faf7f2",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center"
        }}>
            <style>{`
                @keyframes gold-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes text-pulse {
                    0%, 100% { opacity: 0.55; }
                    50% { opacity: 1; }
                }
            `}</style>

            <div style={{
                position: "relative",
                width: 64,
                height: 64,
                marginBottom: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                {/* Outer Gold Spinning Ring */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: "2.5px solid rgba(205,171,143,0.25)",
                    borderTopColor: "#cdab8f",
                    animation: "gold-spin 0.9s linear infinite"
                }} />

                {/* Inner Gift Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a67c52" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="8" width="18" height="12" rx="2" />
                    <path d="M12 8v12" />
                    <path d="M19 12H5" />
                    <path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5" />
                </svg>
            </div>

            {/* Atelier Brand Title */}
            <span style={{
                fontFamily: "var(--font-sans, DM Sans, sans-serif)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#a88365",
                marginBottom: "8px"
            }}>
                For you, Always.
            </span>

            {/* Subtitle */}
            <h2 style={{
                fontFamily: "var(--font-display, Cormorant Garamond, serif)",
                fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
                fontWeight: 400,
                color: "#382a24",
                margin: 0,
                animation: "text-pulse 1.8s ease-in-out infinite"
            }}>
                Menyiapkan Pengalaman Unboxing...
            </h2>
        </div>
    );
}
