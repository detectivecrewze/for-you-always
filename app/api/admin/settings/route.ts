import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "fya_admin_session";
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_D1_DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID;
const CF_API_KEY = process.env.CLOUDFLARE_D1_API_KEY;

const DEFAULT_MEMORIA_NOTICE = {
    isActive: false,
    title: "Info Khusus Memoria:",
    message: "Untuk pemesanan produk Memoria hari ini, pengerjaannya baru akan dilakukan besok. Namun, kamu tetap bisa mengisi form materi kado (teks/foto) hari ini juga. Terima kasih atas pengertiannya.",
};

export async function GET(req: NextRequest) {
    const sessionCookie = req.cookies.get(COOKIE_NAME);
    if (!sessionCookie || sessionCookie.value !== "authenticated_session_valid") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key") || "memoria_notice";

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
                        sql: `SELECT value FROM store_settings WHERE key = ? LIMIT 1;`,
                        params: [key],
                    }),
                }
            );

            if (queryRes.ok) {
                const data = await queryRes.json();
                let valStr: string | null = null;
                if (Array.isArray(data.result)) {
                    for (const r of data.result) {
                        if (Array.isArray(r.results) && r.results.length > 0) {
                            valStr = r.results[0]?.value || null;
                            break;
                        }
                    }
                }

                if (valStr) {
                    try {
                        const parsed = JSON.parse(valStr);
                        return NextResponse.json({ success: true, key, value: parsed });
                    } catch {
                        return NextResponse.json({ success: true, key, value: valStr });
                    }
                }
            }
        }

        return NextResponse.json({ success: true, key, value: DEFAULT_MEMORIA_NOTICE });
    } catch (error) {
        console.error("Failed to fetch setting:", error);
        return NextResponse.json({ success: true, key, value: DEFAULT_MEMORIA_NOTICE });
    }
}

export async function POST(req: NextRequest) {
    const sessionCookie = req.cookies.get(COOKIE_NAME);
    if (!sessionCookie || sessionCookie.value !== "authenticated_session_valid") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { key = "memoria_notice", value } = body;

        if (!value) {
            return NextResponse.json({ success: false, message: "Value is required" }, { status: 400 });
        }

        const valueStr = typeof value === "object" ? JSON.stringify(value) : String(value);

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
                        sql: `INSERT INTO store_settings (key, value, updated_at)
                              VALUES (?, ?, CURRENT_TIMESTAMP)
                              ON CONFLICT(key) DO UPDATE SET
                                value = excluded.value,
                                updated_at = CURRENT_TIMESTAMP;`,
                        params: [key, valueStr],
                    }),
                }
            );

            if (queryRes.ok) {
                return NextResponse.json({ success: true, message: "Setting saved successfully", key, value });
            } else {
                const errData = await queryRes.json();
                console.error("D1 query error:", errData);
                return NextResponse.json({ success: false, message: "D1 update failed", error: errData }, { status: 500 });
            }
        }

        return NextResponse.json({ success: false, message: "D1 configuration missing" }, { status: 500 });
    } catch (error) {
        console.error("Failed to save setting:", error);
        return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
    }
}
