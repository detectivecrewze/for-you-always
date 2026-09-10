"use client";

import dynamic, { type DynamicOptionsLoadingProps } from "next/dynamic";
import { createPortal } from "react-dom";
import type { DemoPreviewModalProps } from "./DemoPreviewModal";

let modalModulePromise: ReturnType<typeof importDemoPreviewModal> | null = null;

function importDemoPreviewModal() {
    return import("./DemoPreviewModal");
}

function loadDemoPreviewModal() {
    if (!modalModulePromise) {
        modalModulePromise = importDemoPreviewModal().catch((error) => {
            modalModulePromise = null;
            throw error;
        });
    }
    return modalModulePromise;
}

export function preloadDemoPreviewModal() {
    void loadDemoPreviewModal().catch(() => {});
}

export function scheduleDemoPreviewPreload() {
    if (typeof window === "undefined") return () => {};

    if (typeof window.requestIdleCallback === "function") {
        const idleId = window.requestIdleCallback(preloadDemoPreviewModal, { timeout: 1_500 });
        return () => window.cancelIdleCallback(idleId);
    }

    const timerId = window.setTimeout(preloadDemoPreviewModal, 700);
    return () => window.clearTimeout(timerId);
}

function DemoPreviewLoadingShell({ error, retry }: DynamicOptionsLoadingProps) {
    if (typeof document === "undefined") return null;

    return createPortal(
        <div
            role={error ? "alert" : "status"}
            aria-live="polite"
            aria-label={error ? "Demo gagal disiapkan" : "Menyiapkan demo"}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1_000_000,
                display: "grid",
                placeItems: "center",
                padding: 16,
                background: "rgba(24, 16, 13, 0.82)",
                WebkitTapHighlightColor: "transparent",
            }}
        >
            <style>{`
                @keyframes demoPreviewShellSpin {
                    to { transform: rotate(360deg); }
                }
                @media (prefers-reduced-motion: reduce) {
                    .demo-preview-shell-spinner { animation-duration: 1.6s !important; }
                }
            `}</style>
            <div
                style={{
                    width: "min(340px, 100%)",
                    padding: "28px 24px",
                    border: "1px solid rgba(210, 176, 143, 0.3)",
                    borderRadius: 24,
                    background: "linear-gradient(155deg, #2B201A 0%, #19110E 100%)",
                    boxShadow: "0 24px 70px rgba(0, 0, 0, 0.5)",
                    color: "#FAF1E8",
                    textAlign: "center",
                }}
            >
                {!error && (
                    <span
                        className="demo-preview-shell-spinner"
                        aria-hidden="true"
                        style={{
                            width: 30,
                            height: 30,
                            display: "inline-block",
                            borderRadius: 999,
                            border: "2px solid rgba(250, 241, 232, 0.2)",
                            borderTopColor: "#D4AF87",
                            animation: "demoPreviewShellSpin 0.8s linear infinite",
                        }}
                    />
                )}
                <div style={{ marginTop: error ? 0 : 14, fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600 }}>
                    {error ? "Demo belum berhasil disiapkan" : "Menyiapkan demo…"}
                </div>
                <p style={{ margin: "7px 0 0", fontFamily: "var(--font-sans)", fontSize: 12, lineHeight: 1.5, color: "#C9B6A8" }}>
                    {error ? "Koneksi mungkin sedang lambat. Silakan coba sekali lagi." : "Sebentar, pengalaman kadonya sedang dibuka."}
                </p>
                {error && retry && (
                    <button
                        type="button"
                        onClick={retry}
                        style={{
                            minHeight: 44,
                            marginTop: 16,
                            padding: "10px 20px",
                            border: 0,
                            borderRadius: 999,
                            background: "linear-gradient(135deg, #D4AF87 0%, #B88B5E 100%)",
                            color: "#241A15",
                            fontFamily: "var(--font-sans)",
                            fontWeight: 800,
                            cursor: "pointer",
                        }}
                    >
                        Coba Lagi
                    </button>
                )}
            </div>
        </div>,
        document.body
    );
}

const LazyDemoPreviewModal = dynamic<DemoPreviewModalProps>(loadDemoPreviewModal, {
    ssr: false,
    loading: DemoPreviewLoadingShell,
});

export default LazyDemoPreviewModal;
