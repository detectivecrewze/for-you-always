import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const COOKIE_NAME = "fya_admin_session";
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_D1_DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID;
const CF_API_KEY = process.env.CLOUDFLARE_D1_API_KEY;

export async function GET(req: NextRequest) {
    const sessionCookie = req.cookies.get(COOKIE_NAME);
    if (!sessionCookie || sessionCookie.value !== "authenticated_session_valid") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const tab = searchParams.get("tab") || "all"; // "digital" | "physical" | "all"
    const q = (searchParams.get("q") || "").trim();
    const status = searchParams.get("status") || "all";
    const product = searchParams.get("product") || "all";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
    const offset = (page - 1) * limit;

    try {
        if (!CF_ACCOUNT_ID || !CF_D1_DATABASE_ID || !CF_API_KEY) {
            return NextResponse.json({ success: false, message: "D1 credentials not configured" }, { status: 500 });
        }

        const conditions: string[] = [];

        // Tab filter (Physical vs Digital)
        if (tab === "physical") {
            conditions.push("(product_id LIKE '%unbox%' OR order_id LIKE '%UNBOX%' OR shipping_details IS NOT NULL)");
        } else if (tab === "digital") {
            conditions.push("(product_id NOT LIKE '%unbox%' AND order_id NOT LIKE '%UNBOX%' AND shipping_details IS NULL)");
        }

        // Search query
        if (q) {
            const escapedQ = q.replace(/'/g, "''");
            conditions.push(`(order_id LIKE '%${escapedQ}%' OR customer_name LIKE '%${escapedQ}%' OR customer_email LIKE '%${escapedQ}%' OR customer_phone LIKE '%${escapedQ}%' OR shipping_details LIKE '%${escapedQ}%')`);
        }

        // Product filter
        if (product && product !== "all") {
            const escapedProduct = product.replace(/'/g, "''");
            conditions.push(`product_id LIKE '%${escapedProduct}%'`);
        }

        // Status filter
        if (status === "paid" || status === "paid_only") {
            conditions.push("status IN ('paid', 'success')");
        } else if (status === "pending" || status === "pending_payment") {
            conditions.push("status = 'pending'");
        } else if (status === "expired") {
            conditions.push("status = 'expired'");
        } else if (status === "pending_customization") {
            conditions.push("status IN ('paid', 'success') AND (customization_status != 'published' OR customization_status IS NULL) AND (fulfillment_status != 'shipped' OR fulfillment_status IS NULL)");
        } else if (status === "ready_to_pack") {
            conditions.push("status IN ('paid', 'success') AND customization_status = 'published' AND (fulfillment_status != 'shipped' OR fulfillment_status IS NULL)");
        } else if (status === "shipped") {
            conditions.push("status IN ('paid', 'success') AND fulfillment_status = 'shipped'");
        }

        const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        // Query 1: Total matching count
        const countSql = `SELECT COUNT(*) as total FROM orders ${whereSql};`;

        // Query 2: Paginated data
        const dataSql = `SELECT * FROM orders ${whereSql} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset};`;

        // Query 3: Physical counters (only if tab is physical)
        const physicalCountersSql = `
            SELECT 
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as unpaid_count,
                COUNT(CASE WHEN status IN ('paid', 'success') AND (customization_status != 'published' OR customization_status IS NULL) AND (fulfillment_status != 'shipped' OR fulfillment_status IS NULL) THEN 1 END) as pending_customization_count,
                COUNT(CASE WHEN status IN ('paid', 'success') AND customization_status = 'published' AND (fulfillment_status != 'shipped' OR fulfillment_status IS NULL) THEN 1 END) as ready_to_pack_count,
                COUNT(CASE WHEN status IN ('paid', 'success') AND fulfillment_status = 'shipped' THEN 1 END) as shipped_count
            FROM orders
            WHERE (product_id LIKE '%unbox%' OR order_id LIKE '%UNBOX%' OR shipping_details IS NOT NULL);
        `;

        const fullSql = tab === "physical"
            ? `${countSql} ${dataSql} ${physicalCountersSql}`
            : `${countSql} ${dataSql}`;

        const cfRes = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${CF_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ sql: fullSql }),
                cache: "no-store",
            }
        );

        if (!cfRes.ok) {
            const errText = await cfRes.text();
            return NextResponse.json({ success: false, error: errText }, { status: 500 });
        }

        const cfData = await cfRes.json();
        const total = cfData.result?.[0]?.results?.[0]?.total || 0;
        const orders = cfData.result?.[1]?.results || [];
        const counters = cfData.result?.[2]?.results?.[0] || null;

        return NextResponse.json({
            success: true,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
            orders,
            counters: counters ? {
                unpaidCount: counters.unpaid_count || 0,
                pendingCustomizationCount: counters.pending_customization_count || 0,
                readyToPackCount: counters.ready_to_pack_count || 0,
                shippedCount: counters.shipped_count || 0,
            } : undefined,
        });
    } catch (error) {
        console.error("Failed to query D1 orders:", error);
        return NextResponse.json({ success: false, orders: [], error: String(error) }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const sessionCookie = req.cookies.get(COOKIE_NAME);
    if (!sessionCookie || sessionCookie.value !== "authenticated_session_valid") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { order_id } = await req.json();
        if (!order_id) {
            return NextResponse.json({ success: false, message: "Missing order_id" }, { status: 400 });
        }

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
                        sql: "DELETE FROM orders WHERE order_id = ?",
                        params: [order_id],
                    }),
                }
            );

            if (cfRes.ok) {
                return NextResponse.json({ success: true, message: `Pesanan ${order_id} berhasil dihapus.` });
            }
        }

        return NextResponse.json({ success: false, message: "Gagal menghapus pesanan dari database." }, { status: 500 });
    } catch (error) {
        console.error("Failed to delete order:", error);
        return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
    }
}
