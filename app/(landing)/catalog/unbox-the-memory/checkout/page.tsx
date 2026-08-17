"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UnboxCheckoutRedirectPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/catalog/the-gift-box/checkout");
    }, [router]);

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#faf7f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "#8a7569", fontFamily: "sans-serif" }}>Mengalihkan ke Checkout The Gift Box...</p>
        </div>
    );
}
