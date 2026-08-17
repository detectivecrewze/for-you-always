import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "fya_admin_session";
const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY;
const DEFAULT_ORIGIN_CONTACT_NAME = process.env.BITESHIP_ORIGIN_CONTACT_NAME || "For you, Always.";
const DEFAULT_ORIGIN_CONTACT_PHONE = process.env.BITESHIP_ORIGIN_CONTACT_PHONE || "081936109076";
const DEFAULT_ORIGIN_ADDRESS = process.env.BITESHIP_ORIGIN_ADDRESS || "Limus Pratama Regency Jl Kediri 7 Blok E16/22, Cileungsi Kab.Bogor";
const DEFAULT_ORIGIN_POSTAL = process.env.BITESHIP_ORIGIN_POSTAL_CODE || "16820";
const DEFAULT_ORIGIN_LAT = process.env.BITESHIP_ORIGIN_LATITUDE || "-6.3593181";
const DEFAULT_ORIGIN_LNG = process.env.BITESHIP_ORIGIN_LONGITUDE || "106.9736382";

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_D1_DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID;
const CF_API_KEY = process.env.CLOUDFLARE_D1_API_KEY;

function parseCourier(rawCourier: string = ""): { company: string; type: string; displayName: string } {
    const lower = rawCourier.toLowerCase();

    let company = "sicepat";
    let type = "standard";
    let displayName = "SiCepat Reguler";

    if (lower.includes("jne")) {
        company = "jne";
        if (lower.includes("yes") || lower.includes("esok") || lower.includes("besok")) {
            type = "yes";
            displayName = "JNE — Yakin Esok Sampai (YES)";
        } else {
            type = "reg";
            displayName = "JNE — Reguler (REG)";
        }
    } else if (lower.includes("j&t") || lower.includes("jnt")) {
        company = "jnt";
        type = "ez";
        displayName = "J&T — EZ Reguler";
    } else if (lower.includes("anteraja")) {
        company = "anteraja";
        if (lower.includes("next") || lower.includes("besok")) {
            type = "next_day";
            displayName = "Anteraja — Next Day";
        } else {
            type = "reg";
            displayName = "Anteraja — Reguler";
        }
    } else if (lower.includes("sicepat")) {
        company = "sicepat";
        if (lower.includes("best") || lower.includes("besok") || lower.includes("esok")) {
            type = "best";
            displayName = "SiCepat — Besok Sampai Tujuan (BEST)";
        } else {
            type = "standard";
            displayName = "SiCepat — Reguler (SIUNT)";
        }
    }

    return { company, type, displayName };
}

export async function POST(req: NextRequest) {
    const sessionCookie = req.cookies.get(COOKIE_NAME);
    if (!sessionCookie || sessionCookie.value !== "authenticated_session_valid") {
        return NextResponse.json({ success: false, message: "Akses tidak diizinkan. Silakan login admin." }, { status: 401 });
    }

    if (!BITESHIP_API_KEY) {
        return NextResponse.json(
            { success: false, message: "BITESHIP_API_KEY belum dikonfigurasi di environment." },
            { status: 500 }
        );
    }

    try {
        const body = await req.json();
        const { order_id, order_data, origin_details } = body;

        if (!order_id || !order_data) {
            return NextResponse.json({ success: false, message: "Data pesanan tidak lengkap." }, { status: 400 });
        }

        // Parse Shipping Details
        let shipDetails = order_data.shipping_details;
        if (typeof shipDetails === "string") {
            try {
                shipDetails = JSON.parse(shipDetails);
            } catch (_) {
                shipDetails = {};
            }
        }
        shipDetails = shipDetails || {};

        const recipientName = shipDetails.recipient_name || order_data.customer_name || "Penerima Kado";
        const recipientPhone = shipDetails.recipient_phone || order_data.customer_phone || "081234567890";
        const address = shipDetails.address || "";
        const village = shipDetails.village || "";
        const district = shipDetails.district || "";
        const city = shipDetails.city || "";
        const province = shipDetails.province || "";
        const postalCode = parseInt(String(shipDetails.postal_code || "12190").replace(/\D/g, ""), 10) || 12190;

        const fullDestinationAddress = [
            address,
            village ? `Kel. ${village}` : "",
            district ? `Kec. ${district}` : "",
            city,
            province,
        ]
            .filter(Boolean)
            .join(", ");

        const courierChoice = parseCourier(shipDetails.courier || order_data.courier || "");

        const originContactName = origin_details?.contact_name || DEFAULT_ORIGIN_CONTACT_NAME;
        const originContactPhone = origin_details?.contact_phone || DEFAULT_ORIGIN_CONTACT_PHONE;
        const fullOriginAddress = [
            origin_details?.address,
            origin_details?.village ? `Kel. ${origin_details.village}` : "",
            origin_details?.district ? `Kec. ${origin_details.district}` : "",
            origin_details?.city,
            origin_details?.province,
        ]
            .filter(Boolean)
            .join(", ") || origin_details?.address || DEFAULT_ORIGIN_ADDRESS;
        const originNote = origin_details?.note || "Paket kado hampers siap pick up di depan rumah";
        const originPostalCode = parseInt(String(origin_details?.postal_code || DEFAULT_ORIGIN_POSTAL).replace(/\D/g, ""), 10) || 16820;
        
        // Only include GPS coordinate if explicitly provided (e.g. for Loc 1 / Cileungsi) so Biteship does not override custom address with Cileungsi geocode
        const hasCustomCoords = Boolean(origin_details?.latitude && origin_details?.longitude);
        const originLat = hasCustomCoords ? parseFloat(String(origin_details.latitude)) : null;
        const originLng = hasCustomCoords ? parseFloat(String(origin_details.longitude)) : null;

        // 1. Construct Biteship Create Order payload
        const biteshipPayload: Record<string, any> = {
            shipper_contact_name: "For you, Always.",
            shipper_contact_phone: originContactPhone,
            shipper_contact_email: "support@for-you-always.my.id",
            shipper_organization: "For you, Always. Atelier",
            origin_contact_name: originContactName,
            origin_contact_phone: originContactPhone,
            origin_address: fullOriginAddress,
            origin_note: originNote,
            origin_postal_code: originPostalCode,
            origin_collection_method: "pickup",
            destination_contact_name: recipientName,
            destination_contact_phone: recipientPhone,
            destination_address: fullDestinationAddress,
            destination_note: "Kado Spesial — Harap hati-hati saat pengantaran",
            destination_postal_code: postalCode,
            courier_company: courierChoice.company,
            courier_type: courierChoice.type,
            delivery_type: "now",
            reference_id: order_id,
            items: [
                {
                    name: "Unbox the Memory Gift Box",
                    description: "Hampers Kado Fisik & Kartu QR Kenangan",
                    category: "others",
                    value: 130000,
                    quantity: 1,
                    weight: 1000,
                    length: 20,
                    width: 20,
                    height: 10,
                },
            ],
        };

        if (originLat !== null && originLng !== null && !isNaN(originLat) && !isNaN(originLng)) {
            biteshipPayload.origin_coordinate = {
                latitude: originLat,
                longitude: originLng,
            };
        }

        // 2. Call Biteship Orders API
        const biteshipRes = await fetch("https://api.biteship.com/v1/orders", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${BITESHIP_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(biteshipPayload),
        });

        const biteshipData = await biteshipRes.json();

        if (!biteshipRes.ok || !biteshipData.success) {
            console.error("Biteship dispatch error:", biteshipData);
            let errMsg = biteshipData.message || biteshipData.error || "Gagal membuat pesanan ke kurir Biteship.";
            if (errMsg.toLowerCase().includes("balance") || errMsg.toLowerCase().includes("saldo")) {
                errMsg = "Saldo Biteship tidak mencukupi untuk membuat pesanan ini. Silakan top-up saldo di dashboard Biteship.";
            }
            return NextResponse.json({ success: false, message: errMsg, error_detail: biteshipData }, { status: 400 });
        }

        // 3. Extract Tracking Details
        const waybillId = biteshipData.courier?.waybill_id || biteshipData.courier?.tracking_id || biteshipData.id;
        const courierName = courierChoice.displayName;
        const trackingLink = biteshipData.courier?.link || `https://track.biteship.com/${biteshipData.courier?.tracking_id}`;
        const biteshipOrderId = biteshipData.id;

        // 4. Update order tracking status in Cloudflare D1 / Worker
        try {
            if (CF_ACCOUNT_ID && CF_D1_DATABASE_ID && CF_API_KEY) {
                await fetch(
                    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`,
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${CF_API_KEY}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            sql: `UPDATE orders SET 
                                    tracking_number = ?,
                                    courier = ?,
                                    fulfillment_status = 'shipped'
                                  WHERE order_id = ?`,
                            params: [waybillId, courierName, order_id],
                        }),
                    }
                );
            } else {
                await fetch("https://pakasir-gateway.aldoramadhan16.workers.dev/api/admin/update-tracking", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        order_id,
                        tracking_number: waybillId,
                        courier: courierName,
                        fulfillment_status: "shipped",
                    }),
                });
            }
        } catch (dbErr) {
            console.warn("Failed to update database after dispatch:", dbErr);
        }

        return NextResponse.json({
            success: true,
            message: `Pesanan berhasil di-dispatch! Kurir ${courierChoice.displayName} telah dijadwalkan untuk penjemputan.`,
            biteship_order_id: biteshipOrderId,
            tracking_number: waybillId,
            courier: courierName,
            tracking_link: trackingLink,
            biteship_data: biteshipData,
        });
    } catch (error) {
        console.error("Dispatch order exception:", error);
        return NextResponse.json(
            { success: false, message: `Terjadi kesalahan saat memproses pengiriman: ${String(error)}` },
            { status: 500 }
        );
    }
}
