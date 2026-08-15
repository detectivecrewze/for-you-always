import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "aldo123";
const COOKIE_NAME = "fya_admin_session";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { password } = body;

        if (!password || password !== ADMIN_PASSWORD) {
            return NextResponse.json(
                { success: false, message: "Kata sandi salah. Akses ditolak." },
                { status: 401 }
            );
        }

        const response = NextResponse.json({ success: true, message: "Autentikasi berhasil." });
        response.cookies.set(COOKIE_NAME, "authenticated_session_valid", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 hari
        });

        return response;
    } catch (error) {
        console.error("Auth error:", error);
        return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const sessionCookie = req.cookies.get(COOKIE_NAME);
    if (sessionCookie && sessionCookie.value === "authenticated_session_valid") {
        return NextResponse.json({ authenticated: true });
    }
    return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
    const response = NextResponse.json({ success: true, message: "Berhasil keluar." });
    response.cookies.set(COOKIE_NAME, "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
    });
    return response;
}
