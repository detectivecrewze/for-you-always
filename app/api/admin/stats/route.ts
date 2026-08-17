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
    const range = searchParams.get("range") || "all";

    try {
        if (!CF_ACCOUNT_ID || !CF_D1_DATABASE_ID || !CF_API_KEY) {
            return NextResponse.json({ success: false, message: "D1 credentials not configured" }, { status: 500 });
        }

        let whereClause = "";
        if (range === "today") {
            whereClause = "WHERE date(datetime(created_at, '+7 hours')) = date('now', '+7 hours')";
        } else if (range === "yesterday") {
            whereClause = "WHERE date(datetime(created_at, '+7 hours')) = date('now', '+7 hours', '-1 day')";
        } else if (range === "7days") {
            whereClause = "WHERE datetime(created_at, '+7 hours') >= datetime('now', '+7 hours', '-7 days')";
        } else if (range === "30days") {
            whereClause = "WHERE datetime(created_at, '+7 hours') >= datetime('now', '+7 hours', '-30 days')";
        }

        const statsSql = `
            SELECT 
                COALESCE(SUM(CASE WHEN status IN ('paid', 'success') THEN gross_amount ELSE 0 END), 0) as total_revenue,
                COUNT(CASE WHEN status IN ('paid', 'success') THEN 1 ELSE NULL END) as paid_count,
                COUNT(CASE WHEN status = 'pending' THEN 1 ELSE NULL END) as pending_count,
                COUNT(CASE WHEN (product_id LIKE '%unbox%' OR order_id LIKE '%UNBOX%' OR shipping_details IS NOT NULL) AND status IN ('paid', 'success') THEN 1 ELSE NULL END) as physical_count
            FROM orders
            ${whereClause};
        `;

        const recentSql = `
            SELECT order_id, status, gross_amount, customer_name, customer_email, product_id, created_at, shipping_details
            FROM orders
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT 10;
        `;

        const cfRes = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${CF_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sql: `${statsSql} ${recentSql}`,
                }),
                cache: "no-store",
            }
        );

        if (!cfRes.ok) {
            const errText = await cfRes.text();
            return NextResponse.json({ success: false, error: errText }, { status: 500 });
        }

        const cfData = await cfRes.json();
        const stats = cfData.result?.[0]?.results?.[0] || {
            total_revenue: 0,
            paid_count: 0,
            pending_count: 0,
            physical_count: 0,
        };
        const recentOrders = cfData.result?.[1]?.results || [];

        return NextResponse.json({
            success: true,
            range,
            stats: {
                totalRevenue: stats.total_revenue || 0,
                paidCount: stats.paid_count || 0,
                pendingCount: stats.pending_count || 0,
                physicalCount: stats.physical_count || 0,
            },
            recentOrders,
        });
    } catch (error) {
        console.error("Failed to query D1 stats:", error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
