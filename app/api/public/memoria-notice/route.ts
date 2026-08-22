import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_D1_DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID;
const CF_API_KEY = process.env.CLOUDFLARE_D1_API_KEY;

const DEFAULT_MEMORIA_NOTICE = {
    isActive: false,
    title: "Info Khusus Memoria:",
    message: "Untuk pemesanan produk Memoria hari ini, pengerjaannya baru akan dilakukan besok. Namun, kamu tetap bisa mengisi form materi kado (teks/foto) hari ini juga. Terima kasih atas pengertiannya.",
};

export async function GET() {
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
                        sql: `SELECT value FROM store_settings WHERE key = 'memoria_notice' LIMIT 1;`,
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
                        return NextResponse.json(
                            { success: true, notice: parsed },
                            { headers: { "Cache-Control": "no-store, max-age=0" } }
                        );
                    } catch {
                        return NextResponse.json(
                            { success: true, notice: { ...DEFAULT_MEMORIA_NOTICE, message: valStr } },
                            { headers: { "Cache-Control": "no-store, max-age=0" } }
                        );
                    }
                }
            }
        }

        return NextResponse.json(
            { success: true, notice: DEFAULT_MEMORIA_NOTICE },
            { headers: { "Cache-Control": "no-store, max-age=0" } }
        );
    } catch (error) {
        console.error("Failed to fetch public memoria notice:", error);
        return NextResponse.json(
            { success: true, notice: DEFAULT_MEMORIA_NOTICE },
            { headers: { "Cache-Control": "no-store, max-age=0" } }
        );
    }
}
