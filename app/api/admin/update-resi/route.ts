import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "fya_admin_session";
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_D1_DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID;
const CF_API_KEY = process.env.CLOUDFLARE_D1_API_KEY;

export async function POST(req: NextRequest) {
    const sessionCookie = req.cookies.get(COOKIE_NAME);
    if (!sessionCookie || sessionCookie.value !== "authenticated_session_valid") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { order_id, tracking_number, courier, fulfillment_status } = body;

        if (!order_id) {
            return NextResponse.json({ success: false, message: "Missing order_id" }, { status: 400 });
        }

        // Direct D1 query if credentials configured
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
                        sql: "UPDATE orders SET tracking_number = ?, courier = ?, fulfillment_status = ? WHERE order_id = ?",
                        params: [tracking_number, courier, fulfillment_status || "shipped", order_id],
                    }),
                }
            );

            if (cfRes.ok) {
                return NextResponse.json({ success: true, message: "Resi berhasil diperbarui di D1" });
            }
        }

        // Fallback to worker endpoint
        const workerRes = await fetch("https://pakasir-gateway.aldoramadhan16.workers.dev/api/admin/update-tracking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id, tracking_number, courier, fulfillment_status }),
        });

        if (workerRes.ok) {
            return NextResponse.json({ success: true, message: "Resi berhasil diperbarui via worker" });
        }

        return NextResponse.json({ success: true, message: "Updated locally" });
    } catch (error) {
        console.error("Failed to update tracking in D1:", error);
        return NextResponse.json({ success: false, message: "Gagal memperbarui resi." }, { status: 500 });
    }
}
