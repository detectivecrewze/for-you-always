import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 300;

const PRODUCT_IDS = new Set([
    "letter", "voices", "arcade", "retro", "wrapped", "mixtape",
    "invitation", "loves", "birthday", "storybook", "the-gift-box",
]);

export async function GET() {
    const gatewayBase = (
        process.env.PAYMENT_GATEWAY_URL ||
        process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_URL ||
        "https://pakasir-gateway.aldoramadhan16.workers.dev"
    ).replace(/\/$/, "");

    try {
        const response = await fetch(`${gatewayBase}/api/public/sales-counts`, {
            next: { revalidate: 300 },
            headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`Gateway responded with ${response.status}`);

        const payload = await response.json();
        const source = payload?.counts && typeof payload.counts === "object" ? payload.counts : {};
        const counts = Object.fromEntries(
            [...PRODUCT_IDS].map((productId) => {
                const value = Number(source[productId]);
                return [productId, Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0];
            }),
        );

        return NextResponse.json(
            { counts, updatedAt: typeof payload?.updatedAt === "string" ? payload.updatedAt : null },
            { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
        );
    } catch (error) {
        console.error("Sales count proxy error:", error);
        return NextResponse.json(
            { error: "Sales counts unavailable" },
            { status: 503, headers: { "Cache-Control": "no-store" } },
        );
    }
}
