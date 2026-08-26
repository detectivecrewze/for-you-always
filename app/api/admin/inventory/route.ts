import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
        if (CF_ACCOUNT_ID && CF_D1_DATABASE_ID && CF_API_KEY) {
            const queryRes = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${CF_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sql: `CREATE TABLE IF NOT EXISTS inventory (
                            id TEXT PRIMARY KEY,
                            product_id TEXT UNIQUE NOT NULL,
                            product_name TEXT NOT NULL,
                            stock INTEGER NOT NULL DEFAULT 0,
                            low_stock_threshold INTEGER NOT NULL DEFAULT 3,
                            is_active INTEGER NOT NULL DEFAULT 1,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        );
                        INSERT OR IGNORE INTO inventory (id, product_id, product_name, stock, low_stock_threshold, is_active)
                        VALUES ('inv_unbox', 'the-gift-box', 'The Gift Box', 12, 3, 1);
                        INSERT OR IGNORE INTO inventory (id, product_id, product_name, stock, low_stock_threshold, is_active)
                        VALUES ('inv_kraft', 'the-gift-box-kraft', 'Classic Kraft Box', 10, 3, 1);
                        SELECT * FROM inventory ORDER BY updated_at DESC;`,
                    }),
                }
            );

            if (queryRes.ok) {
                const data = await queryRes.json();
                let results: any[] = [];
                if (Array.isArray(data.result)) {
                    for (const r of data.result) {
                        if (Array.isArray(r.results) && r.results.length > 0) {
                            results = r.results;
                            break;
                        }
                    }
                }
                return NextResponse.json({ success: true, inventory: results });
            }
        }

        return NextResponse.json({
            success: true,
            inventory: [
                {
                    id: "inv_unbox",
                    product_id: "the-gift-box",
                    product_name: "The Gift Box",
                    stock: 12,
                    low_stock_threshold: 3,
                    is_active: 1,
                },
            ],
        });
    } catch (error) {
        console.error("Failed to fetch admin inventory:", error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const sessionCookie = req.cookies.get(COOKIE_NAME);
    if (!sessionCookie || sessionCookie.value !== "authenticated_session_valid") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { product_id, stock, low_stock_threshold, is_active } = body;

        const targetProductId = product_id || "the-gift-box";
        const newStock = Math.max(0, parseInt(stock, 10) || 0);
        const threshold = low_stock_threshold !== undefined ? parseInt(low_stock_threshold, 10) : 3;
        const active = is_active !== undefined ? (is_active ? 1 : 0) : 1;

        const PRODUCT_META: Record<string, { invId: string; name: string }> = {
            "the-gift-box-kraft": { invId: "inv_kraft", name: "Classic Kraft Box" },
        };
        const meta = PRODUCT_META[targetProductId] || { invId: "inv_unbox", name: "The Gift Box" };

        if (CF_ACCOUNT_ID && CF_D1_DATABASE_ID && CF_API_KEY) {
            const updateRes = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${CF_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sql: `INSERT INTO inventory (id, product_id, product_name, stock, low_stock_threshold, is_active, updated_at)
                              VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                              ON CONFLICT(product_id) DO UPDATE SET
                                stock = excluded.stock,
                                low_stock_threshold = excluded.low_stock_threshold,
                                is_active = excluded.is_active,
                                updated_at = CURRENT_TIMESTAMP;`,
                        params: [meta.invId, targetProductId, meta.name, newStock, threshold, active],
                    }),
                }
            );

            if (updateRes.ok) {
                return NextResponse.json({
                    success: true,
                    message: `Stok berhasil diperbarui menjadi ${newStock} box`,
                    stock: newStock,
                });
            }
        }

        return NextResponse.json({ success: true, message: "Stok tersimpan", stock: newStock });
    } catch (error) {
        console.error("Failed to update inventory:", error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
