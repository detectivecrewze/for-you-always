import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_D1_DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID;
const CF_API_KEY = process.env.CLOUDFLARE_D1_API_KEY;

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product_id") || "the-gift-box";

    // Default stock per product type
    const defaultStock = productId === "the-gift-box-kraft" ? 10 : 12;

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
                        sql: "SELECT * FROM inventory WHERE product_id = ? LIMIT 1",
                        params: [productId],
                    }),
                }
            );

            if (queryRes.ok) {
                const data = await queryRes.json();
                const record = data.result?.[0]?.results?.[0];
                if (record) {
                    return NextResponse.json(
                        {
                            success: true,
                            product_id: record.product_id,
                            product_name: record.product_name || "The Gift Box",
                            stock: record.stock,
                            in_stock: record.stock > 0,
                            is_low_stock: record.stock <= (record.low_stock_threshold || 3) && record.stock > 0,
                            low_stock_threshold: record.low_stock_threshold || 3,
                        },
                        {
                            headers: {
                                "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
                            },
                        }
                    );
                }
            }
        }

        // Fallback default
        return NextResponse.json({
            success: true,
            product_id: productId,
            product_name: productId === "the-gift-box-kraft" ? "Classic Kraft Box" : "The Gift Box",
            stock: defaultStock,
            in_stock: true,
            is_low_stock: false,
            low_stock_threshold: 3,
        });
    } catch (error) {
        console.error("Failed to query inventory:", error);
        return NextResponse.json({
            success: true,
            product_id: productId,
            stock: defaultStock,
            in_stock: true,
            is_low_stock: false,
            low_stock_threshold: 3,
        });
    }
}
