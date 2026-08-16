import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY;

// In-memory cache for fast lookup
let cachedProvinces: { id: string; name: string }[] | null = null;
const cachedRegencies: Map<string, { id: string; province_id: string; name: string }[]> = new Map();
const cachedDistricts: Map<string, { id: string; regency_id: string; name: string }[]> = new Map();
const cachedVillages: Map<string, { id: string; district_id: string; name: string }[]> = new Map();

function toTitleCase(str: string): string {
    return str
        .toLowerCase()
        .replace(/(^|\s|-|\/)\w/g, (c) => c.toUpperCase());
}

export interface AreaItem {
    name: string;
    id: string;
    postal_code?: string;
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const province = searchParams.get("province") || "";
        const city = searchParams.get("city") || "";
        const districtId = searchParams.get("district_id") || "";
        const districtName = searchParams.get("district") || "";
        const villageName = searchParams.get("village") || "";

        // 1. Fetch Villages (Kelurahan / Desa) by district_id
        if (districtId) {
            let vills = cachedVillages.get(districtId);
            if (!vills) {
                const villRes = await fetch(
                    `https://emsifa.github.io/api-wilayah-indonesia/api/villages/${districtId}.json`,
                    { next: { revalidate: 86400 } }
                );
                if (villRes.ok) {
                    vills = await villRes.json();
                    if (vills) cachedVillages.set(districtId, vills);
                }
            }

            if (vills && Array.isArray(vills)) {
                const villages: AreaItem[] = vills
                    .map((v) => ({
                        name: toTitleCase(v.name),
                        id: v.id,
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name));

                return NextResponse.json({
                    success: true,
                    villages,
                });
            }
            return NextResponse.json({ success: true, villages: [] });
        }

        // 2. Fetch Postal Code for a specific district / village
        if (districtName && city) {
            const cleanCity = city.replace(/^(Kota|Kab\.|Kabupaten)\s+/i, "").trim();
            const query = villageName
                ? `${villageName}, ${districtName}, ${cleanCity}`
                : `${districtName}, ${cleanCity}`;

            if (BITESHIP_API_KEY) {
                try {
                    const res = await fetch(
                        `https://api.biteship.com/v1/maps/areas?countries=ID&input=${encodeURIComponent(query)}`,
                        {
                            headers: {
                                Authorization: `Bearer ${BITESHIP_API_KEY}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    const data = await res.json();
                    if (res.ok && data.success && Array.isArray(data.areas) && data.areas.length > 0) {
                        const first = data.areas[0];
                        const postal =
                            first.postal_code ||
                            first.name?.match(/\b\d{5}\b/)?.[0] ||
                            "";
                        return NextResponse.json({
                            success: true,
                            postal_code: String(postal),
                            area_id: first.id,
                        });
                    }
                } catch (e) {
                    console.warn("Biteship postal lookup error:", e);
                }
            }
            return NextResponse.json({ success: true, postal_code: "" });
        }

        if (!city) {
            return NextResponse.json({ success: true, districts: [] });
        }

        // 3. Fetch Provinces from official emsifa dataset
        if (!cachedProvinces) {
            const provRes = await fetch(
                "https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json",
                { next: { revalidate: 86400 } }
            );
            if (provRes.ok) {
                cachedProvinces = await provRes.json();
            }
        }

        if (cachedProvinces && province) {
            const cleanProv = province.toLowerCase().replace(/^(dki|di)\s+/i, "");
            const provMatch = cachedProvinces.find((p) => {
                const pLower = p.name.toLowerCase();
                return (
                    pLower.includes(cleanProv) ||
                    cleanProv.includes(
                        pLower.replace(/^(daerah khusus ibukota|daerah istimewa)\s+/i, "")
                    )
                );
            });

            if (provMatch) {
                // Fetch Regencies
                let regs = cachedRegencies.get(provMatch.id);
                if (!regs) {
                    const regRes = await fetch(
                        `https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${provMatch.id}.json`,
                        { next: { revalidate: 86400 } }
                    );
                    if (regRes.ok) {
                        regs = await regRes.json();
                        if (regs) cachedRegencies.set(provMatch.id, regs);
                    }
                }

                if (regs) {
                    const cleanCity = city
                        .toLowerCase()
                        .replace(/^(kota|kab\.|kabupaten)\s+/i, "")
                        .trim();
                    const isKab = city.toLowerCase().startsWith("kab");
                    const isKota = city.toLowerCase().startsWith("kota");

                    let regMatch = regs.find((r) => {
                        const rLower = r.name.toLowerCase();
                        if (isKab && !rLower.startsWith("kabupaten")) return false;
                        if (isKota && !rLower.startsWith("kota")) return false;
                        return rLower.includes(cleanCity);
                    });

                    if (!regMatch) {
                        regMatch = regs.find((r) => r.name.toLowerCase().includes(cleanCity));
                    }

                    if (regMatch) {
                        // Fetch Districts
                        let dists = cachedDistricts.get(regMatch.id);
                        if (!dists) {
                            const distRes = await fetch(
                                `https://emsifa.github.io/api-wilayah-indonesia/api/districts/${regMatch.id}.json`,
                                { next: { revalidate: 86400 } }
                            );
                            if (distRes.ok) {
                                dists = await distRes.json();
                                if (dists) cachedDistricts.set(regMatch.id, dists);
                            }
                        }

                        if (dists && Array.isArray(dists)) {
                            const districts: AreaItem[] = dists
                                .map((d) => ({
                                    name: toTitleCase(d.name),
                                    id: d.id,
                                }))
                                .sort((a, b) => a.name.localeCompare(b.name));

                            return NextResponse.json({
                                success: true,
                                source: "official_indonesia_db",
                                count: districts.length,
                                districts,
                            });
                        }
                    }
                }
            }
        }

        // Fallback: If emsifa is unreachable, query Biteship Maps
        if (BITESHIP_API_KEY) {
            const cleanCity = city.replace(/^(Kota|Kab\.|Kabupaten)\s+/i, "").trim();
            const res = await fetch(
                `https://api.biteship.com/v1/maps/areas?countries=ID&input=${encodeURIComponent(cleanCity)}`,
                {
                    headers: {
                        Authorization: `Bearer ${BITESHIP_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await res.json();
            if (res.ok && data.success && Array.isArray(data.areas)) {
                const districtMap = new Map<string, AreaItem>();
                for (const area of data.areas) {
                    const dName =
                        area.administrative_division_level_3_name ||
                        area.name.split(",")[0]?.trim();
                    if (!dName) continue;
                    if (!districtMap.has(dName.toLowerCase())) {
                        districtMap.set(dName.toLowerCase(), {
                            name: toTitleCase(dName),
                            id: area.id,
                            postal_code: area.postal_code || area.name.match(/\b\d{5}\b/)?.[0] || "",
                        });
                    }
                }
                const districts = Array.from(districtMap.values()).sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                return NextResponse.json({
                    success: true,
                    source: "biteship_fallback",
                    districts,
                });
            }
        }

        return NextResponse.json({ success: true, districts: [] });
    } catch (error) {
        console.error("Failed to load areas:", error);
        return NextResponse.json({ success: false, error: String(error), districts: [] });
    }
}
