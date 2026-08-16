import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_D1_DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID;
const CF_API_KEY = process.env.CLOUDFLARE_D1_API_KEY;

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product_id") || "unbox-the-memory";

    try {
        if (CF_ACCOUNT_ID && CF_D1_DATABASE_ID && CF_API_KEY) {
            // Ensure table exists & initial seed if missing
            await fetch(
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
                        VALUES ('inv_unbox', 'unbox-the-memory', 'Unbox the Memory Gift Box', 12, 3, 1);`,
                    }),
                }
            );

            // Fetch current stock record
            const queryRes = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${CF_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sql: "SELECT * FROM inventory WHERE product_id = ?",
                        params: [productId],
                    }),
                }
            );

            if (queryRes.ok) {
                const data = await queryRes.json();
                const record = data.result?.[0]?.results?.[0];
                if (record) {
                    return NextResponse.json({
                        success: true,
                        product_id: record.product_id,
                        product_name: record.product_name,
                        stock: record.stock,
                        in_stock: record.stock > 0,
                        is_low_stock: record.stock <= (record.low_stock_threshold || 3) && record.stock > 0,
                        low_stock_threshold: record.low_stock_threshold || 3,
                    });
                }
            }
        }

        // Fallback default
        return NextResponse.json({
            success: true,
            product_id: productId,
            product_name: "Unbox the Memory Gift Box",
            stock: 12,
            in_stock: true,
            is_low_stock: false,
            low_stock_threshold: 3,
        });
    } catch (error) {
        console.error("Failed to query inventory:", error);
        return NextResponse.json({
            success: true,
            product_id: productId,
            stock: 12,
            in_stock: true,
            is_low_stock: false,
            low_stock_threshold: 3,
        });
    }
}
