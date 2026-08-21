import { NextRequest, NextResponse } from "next/server";
import { getShippingRate, isJabodetabek } from "@/lib/indonesiaShipping";

export const dynamic = "force-dynamic";

const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY;
const DEFAULT_ORIGIN_POSTAL = process.env.BITESHIP_ORIGIN_POSTAL_CODE || "16820";
const DEFAULT_ORIGIN_LAT = process.env.BITESHIP_ORIGIN_LATITUDE || "-6.364016";
const DEFAULT_ORIGIN_LNG = process.env.BITESHIP_ORIGIN_LONGITUDE || "106.970905";

export interface CourierOption {
    courier_name: string;
    courier_code: string;
    service_type: string;
    service_name: string;
    category: "instant" | "sameday" | "nextday" | "regular";
    price: number;
    etd: string;
    description?: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            destination_postal_code,
            destination_province,
            destination_city,
            items_value = 150000,
        } = body;

        // Strict Jabodetabek Validation for Physical Gift Box Shipping
        if (destination_city && !isJabodetabek(destination_city, destination_province)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Pengiriman The Gift Box saat ini hanya melayani wilayah Jabodetabek (Jakarta, Bogor, Depok, Tangerang, Bekasi).",
                    options: [],
                },
                { status: 400 }
            );
        }

        const postalCode = parseInt(destination_postal_code, 10);

        // 1. If Biteship API Key is configured and postal code is valid, attempt live rates query
        if (BITESHIP_API_KEY && postalCode && !isNaN(postalCode)) {
            try {
                const biteshipRes = await fetch("https://api.biteship.com/v1/rates/couriers", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${BITESHIP_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        origin_postal_code: parseInt(DEFAULT_ORIGIN_POSTAL, 10),
                        origin_latitude: parseFloat(DEFAULT_ORIGIN_LAT),
                        origin_longitude: parseFloat(DEFAULT_ORIGIN_LNG),
                        destination_postal_code: postalCode,
                        couriers: "jne,jnt,anteraja",
                        items: [
                            {
                                name: "The Gift Box",
                                description: "Hampers Kado Fisik & Kartu QR",
                                value: items_value,
                                length: 20,
                                width: 20,
                                height: 10,
                                weight: 1000,
                            },
                        ],
                    }),
                });

                const biteshipData = await biteshipRes.json();

                if (biteshipRes.ok && biteshipData.success && Array.isArray(biteshipData.pricing)) {
                    const mappedOptions: CourierOption[] = biteshipData.pricing
                        .filter((p: any) => {
                            const combined = `${p.type || ""} ${p.service_type || ""} ${p.courier_service_code || ""} ${p.courier_service_name || ""} ${p.courier_name || ""} ${p.courier_code || ""}`.toLowerCase();
                            // Filter out SiCepat, cargo, heavy trucking, and same-day/instant
                            if (
                                combined.includes("sicepat") ||
                                p.courier_code?.toLowerCase() === "sicepat" ||
                                combined.includes("jtr") ||
                                combined.includes("trucking") ||
                                combined.includes("cargo") ||
                                combined.includes("giga") ||
                                combined.includes("same_day") ||
                                combined.includes("sameday") ||
                                combined.includes("same day") ||
                                combined.includes("instant")
                            ) {
                                return false;
                            }
                            return true;
                        })
                        .map((p: any) => {
                            const typeLower = (p.type || p.service_type || p.courier_service_code || "").toLowerCase();
                            const serviceNameLower = (p.courier_service_name || "").toLowerCase();

                            let category: CourierOption["category"] = "regular";
                            if (
                                typeLower.includes("overnight") ||
                                typeLower.includes("next_day") ||
                                typeLower.includes("nextday") ||
                                serviceNameLower.includes("esok") ||
                                serviceNameLower.includes("besok") ||
                                typeLower.includes("yes") ||
                                typeLower.includes("best")
                            ) {
                                category = "nextday";
                            }

                            const courier = p.courier_name || p.courier_code?.toUpperCase() || "Ekspedisi";
                            const service = p.courier_service_name || p.type;
                            
                            // Clean professional name: e.g. "JNE — Reguler" or "J&T — EZ"
                            const cleanDisplayName = service.toLowerCase().includes(courier.toLowerCase())
                                ? service
                                : `${courier} — ${service}`;

                            return {
                                courier_name: courier,
                                courier_code: p.courier_code,
                                service_type: p.courier_service_code || p.type,
                                service_name: cleanDisplayName,
                                category,
                                price: p.price,
                                etd: p.duration || p.etd || "1-2 hari",
                                description: p.description,
                            };
                        })
                        .sort((a: CourierOption, b: CourierOption) => {
                            const orderPriority: Record<CourierOption["category"], number> = {
                                instant: 1,
                                sameday: 2,
                                nextday: 3,
                                regular: 4,
                            };
                            if (orderPriority[a.category] !== orderPriority[b.category]) {
                                return orderPriority[a.category] - orderPriority[b.category];
                            }
                            return a.price - b.price;
                        });

                    if (mappedOptions.length > 0) {
                        return NextResponse.json({
                            success: true,
                            source: "biteship_live",
                            options: mappedOptions,
                        });
                    }
                }
            } catch (biteshipErr) {
                console.warn("Biteship API request failed, falling back to local matrix:", biteshipErr);
            }
        }

        // 2. Intelligent Local Matrix Fallback (Zero Downtime)
        const regularRate = getShippingRate(destination_province, destination_city);
        const fallbackOptions: CourierOption[] = [
            {
                courier_name: "J&T / JNE",
                courier_code: "jnt",
                service_type: "standard",
                service_name: "Ekspedisi Reguler",
                category: "regular",
                price: regularRate.cost,
                etd: regularRate.estimate,
                description: "Pengiriman reguler dengan nomor resi & asuransi",
            }
        ];

        return NextResponse.json({
            success: true,
            source: "local_matrix",
            options: fallbackOptions,
        });
    } catch (error) {
        console.error("Failed to calculate shipping rates:", error);
        return NextResponse.json(
            {
                success: false,
                error: String(error),
                options: [
                    {
                        courier_name: "J&T / JNE",
                        courier_code: "jnt",
                        service_type: "standard",
                        service_name: "Ekspedisi Reguler",
                        category: "regular",
                        price: 15000,
                        etd: "1-3 hari",
                    },
                ],
            },
            { status: 200 }
        );
    }
}
