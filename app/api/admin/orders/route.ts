import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "fya_admin_session";
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_D1_DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID;
const CF_API_KEY = process.env.CLOUDFLARE_D1_API_KEY;

export async function GET(req: NextRequest) {
    const sessionCookie = req.cookies.get(COOKIE_NAME);
    if (!sessionCookie || sessionCookie.value !== "authenticated_session_valid") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        // If Cloudflare D1 direct credentials are provided in env, query D1 REST API directly
        if (CF_ACCOUNT_ID && CF_D1_DATABASE_ID && CF_API_KEY) {
            const cfRes = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${CF_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sql: "SELECT * FROM orders ORDER BY created_at DESC LIMIT 100",
                    }),
                }
            );

            if (cfRes.ok) {
                const cfData = await cfRes.json();
                const results = cfData.result?.[0]?.results || [];
                return NextResponse.json({ success: true, orders: results, source: "cloudflare_d1" });
            }
        }

        // Fallback: Query via pakasir-gateway worker endpoint
        const workerRes = await fetch("https://pakasir-gateway.aldoramadhan16.workers.dev/api/admin/orders", {
            headers: { "Content-Type": "application/json" }
        });

        if (workerRes.ok) {
            const workerData = await workerRes.json();
            return NextResponse.json({ success: true, orders: workerData.orders || [], source: "pakasir_worker" });
        }

        return NextResponse.json({ success: true, orders: [], source: "empty" });
    } catch (error) {
        console.error("Failed to query D1 orders:", error);
        return NextResponse.json({ success: false, orders: [], error: String(error) }, { status: 500 });
    }
}
