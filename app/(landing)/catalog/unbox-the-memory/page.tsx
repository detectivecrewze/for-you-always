"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UnboxRedirectPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/catalog/the-gift-box");
    }, [router]);

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#faf7f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "#8a7569", fontFamily: "sans-serif" }}>Mengalihkan ke The Gift Box...</p>
        </div>
    );
}
