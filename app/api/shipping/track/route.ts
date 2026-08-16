import { NextRequest, NextResponse } from "next/server";

const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY;

function parseCourierCode(courierStr: string): string {
    const lower = (courierStr || "").toLowerCase();
    if (lower.includes("sicepat")) return "sicepat";
    if (lower.includes("jne")) return "jne";
    if (lower.includes("j&t") || lower.includes("jnt")) return "jnt";
    if (lower.includes("anteraja")) return "anteraja";
    if (lower.includes("ninja")) return "ninja";
    if (lower.includes("pos")) return "pos";
    if (lower.includes("tiki")) return "tiki";
    if (lower.includes("gojek") || lower.includes("gosend")) return "gosend";
    if (lower.includes("grab")) return "grab";
    return "sicepat";
}

function mapTrackingStatus(status: string): { label: string; desc: string; color: string } {
    switch ((status || "").toLowerCase()) {
        case "confirmed":
        case "allocated":
            return {
                label: "Menunggu Pick-up Kurir",
                desc: "Kurir telah dijadwalkan untuk menjemput paket dari atelier.",
                color: "#a67c52"
            };
        case "picking_up":
            return {
                label: "Kurir Menuju Lokasi",
                desc: "Driver kurir sedang dalam perjalanan menuju lokasi atelier untuk mengambil paket.",
                color: "#a67c52"
            };
        case "picked":
        case "dropping_off":
        case "sorting":
        case "departed":
            return {
                label: "Dalam Perjalanan Antar Kota",
                desc: "Paket telah diambil kurir dan sedang transit menuju kota tujuan.",
                color: "#2563eb"
            };
        case "delivering":
        case "out_for_delivery":
            return {
                label: "Sedang Diantar ke Alamat",
                desc: "Paket sedang dibawa kurir pengantar menuju ke alamat penerima hari ini.",
                color: "#e65100"
            };
        case "delivered":
            return {
                label: "Paket Berhasil Diterima",
                desc: "Paket kado telah sampai dengan selamat di tangan penerima.",
                color: "#2e7d32"
            };
        case "returned":
            return {
                label: "Paket Dikembalikan (RTS)",
                desc: "Paket sedang dalam proses kembali ke alamat pengirim.",
                color: "#c62828"
            };
        case "cancelled":
            return {
                label: "Pengiriman Dibatalkan",
                desc: "Pengiriman paket telah dibatalkan.",
                color: "#757575"
            };
        default:
            return {
                label: "Dalam Pengiriman",
                desc: "Paket sedang diproses oleh pihak ekspedisi.",
                color: "#2e7d32"
            };
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const waybillId = searchParams.get("waybill_id") || searchParams.get("tracking_number");
        const courierParam = searchParams.get("courier") || "sicepat";

        if (!waybillId) {
            return NextResponse.json({ success: false, message: "Nomor resi (waybill_id) diperlukan." }, { status: 400 });
        }

        if (!BITESHIP_API_KEY) {
            return NextResponse.json({ success: false, message: "BITESHIP_API_KEY tidak terkonfigurasi." }, { status: 500 });
        }

        const courierCode = parseCourierCode(courierParam);
        const biteshipUrl = `https://api.biteship.com/v1/trackings/${encodeURIComponent(waybillId)}/couriers/${courierCode}`;

        const res = await fetch(biteshipUrl, {
            headers: {
                "Authorization": `Bearer ${BITESHIP_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            return NextResponse.json({
                success: false,
                message: data.error || data.message || "Gagal mengambil data pelacakan dari Biteship.",
                raw: data
            }, { status: res.status });
        }

        const mapped = mapTrackingStatus(data.status);

        return NextResponse.json({
            success: true,
            waybill_id: data.waybill_id,
            status: data.status,
            status_display: mapped.label,
            status_desc: mapped.desc,
            status_color: mapped.color,
            courier: data.courier,
            origin: data.origin,
            destination: data.destination,
            history: data.history || [],
            tracking_link: data.link,
            weight: data.weight
        });
    } catch (err: any) {
        console.error("Error fetching Biteship tracking:", err);
        return NextResponse.json({
            success: false,
            message: "Terjadi kesalahan server saat melacak pengiriman."
        }, { status: 500 });
    }
}
