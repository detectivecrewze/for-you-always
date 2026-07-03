"use client";

import React, { useEffect, useState, useRef } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────

const MALE_NAMES = [
    "Adi", "Aldi", "Aldo", "Arga", "Arya", "Aksa", "Bima", "Bara", "Bayu",
    "Dafa", "Danu", "Dika", "Dion", "Dito", "Ega", "Eka", "Elang", "Fajar",
    "Faris", "Galih", "Gema", "Gilang", "Hafiz", "Iqbal", "Jaya", "Karel",
    "Kean", "Kevin", "Lazu", "Malik", "Nara", "Nino", "Niko", "Pandu",
    "Rama", "Raka", "Rangga", "Reno", "Reza", "Rizky", "Saka", "Sena",
    "Tegar", "Vino", "Yoga", "Yusuf", "Yuda", "Zidan", "Zaki", "Zio",
];

const FEMALE_NAMES = [
    "Alya", "Anya", "Aira", "Asha", "Ara", "Aurel", "Bella", "Caca", "Clara",
    "Dara", "Dinda", "Dita", "Elin", "Elsa", "Fira", "Gina", "Hana", "Indah",
    "Intan", "Jihan", "Kayla", "Keira", "Lala", "Lita", "Luna", "Maya",
    "Mita", "Nadya", "Naura", "Naya", "Nisa", "Putri", "Rara", "Rani",
    "Rena", "Sasa", "Salsa", "Sinta", "Tania", "Tiara", "Vina", "Wina",
    "Zahra", "Zara", "Zia", "Ziva", "Nayla", "Syifa", "Kirana", "Aluna",
];

const PRODUCTS = [
    { label: "Letter Edition", emoji: "✉️", color: "#2a3d5c" },
    { label: "Voices Gift", emoji: "🎙️", color: "#a67c52" },
    { label: "Mixtape Edition", emoji: "🎵", color: "#5a8d9e" },
    { label: "Invitation Edition", emoji: "🎟️", color: "#8a3050" },
    { label: "Retro Edition", emoji: "💾", color: "#008689" },
    { label: "Arcade Edition", emoji: "🕹️", color: "#5c8c5c" },
    { label: "Wrapped Edition", emoji: "🎁", color: "#c9184a" },
    { label: "Memoria Premium", emoji: "💌", color: "#7b2d3a" },
];

// Waktu – semakin sering yang pendek agar terasa fresh
const TIME_OPTIONS = [
    "baru saja", "baru saja",                        // double weight
    "1 menit lalu", "1 menit lalu",
    "2 menit lalu",
    "3 menit lalu",
    "5 menit lalu",
    "7 menit lalu",
    "10 menit lalu",
    "15 menit lalu",
    "20 menit lalu",
    "30 menit lalu",
    "45 menit lalu",
    "1 jam lalu",
    "2 jam lalu",
    "3 jam lalu",
];

interface NotifData {
    name: string;
    product: typeof PRODUCTS[0];
    time: string;
    isFemale: boolean;
}

function generateNotif(lastUsed: Set<string>): NotifData {
    const isFemale = Math.random() > 0.45;
    const pool = isFemale ? FEMALE_NAMES : MALE_NAMES;

    // Hindari nama yang baru saja muncul (max 5 terakhir di-block)
    const available = pool.filter((n) => !lastUsed.has(n));
    const namePool = available.length > 0 ? available : pool;
    const name = namePool[Math.floor(Math.random() * namePool.length)];

    const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    const time = TIME_OPTIONS[Math.floor(Math.random() * TIME_OPTIONS.length)];

    return { name, product, time, isFemale };
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const KEYFRAMES = `
@keyframes fya-slide-in {
    0%   { opacity: 0; transform: translateY(20px) scale(0.95); }
    100% { opacity: 1; transform: translateY(0)    scale(1); }
}
@keyframes fya-slide-out {
    0%   { opacity: 1; transform: translateY(0)    scale(1); }
    100% { opacity: 0; transform: translateY(12px) scale(0.95); }
}
@keyframes fya-pulse-dot {
    0%, 100% { transform: scale(1);    opacity: 1; }
    50%       { transform: scale(1.25); opacity: 0.7; }
}
`;

// ── Component ──────────────────────────────────────────────────────────────────

export default function RecentOrderPopup() {
    const [notif, setNotif] = useState<NotifData | null>(null);
    const [visible, setVisible]   = useState(false);
    const [exiting, setExiting]   = useState(false);
    const lastUsedRef = useRef<Set<string>>(new Set());
    const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clear = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    const dismiss = () => {
        clear();
        setExiting(true);
        timerRef.current = setTimeout(() => {
            setVisible(false);
            setExiting(false);
        }, 420);
    };

    const showNext = () => {
        const data = generateNotif(lastUsedRef.current);

        // Jaga maks 5 nama terakhir di-block
        lastUsedRef.current.add(data.name);
        if (lastUsedRef.current.size > 5) {
            const first = lastUsedRef.current.values().next().value;
            if (first) lastUsedRef.current.delete(first);
        }

        setExiting(false);
        setVisible(true);
        setNotif(data);

        // Auto dismiss setelah 5.5 detik
        timerRef.current = setTimeout(() => dismiss(), 5500);
    };

    useEffect(() => {
        // Delay awal acak 5–10 detik
        const initial = 5000 + Math.random() * 5000;

        const cycle = () => {
            showNext();
            // Schedule berikutnya 14–25 detik setelah popup muncul
            timerRef.current = setTimeout(cycle, 14000 + Math.random() * 11000);
        };

        timerRef.current = setTimeout(cycle, initial);
        return () => clear();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!visible || !notif) return null;

    return (
        <>
            <style>{KEYFRAMES}</style>

            {/* Wrapper */}
            <div
                role="alert"
                aria-live="polite"
                onClick={dismiss}
                style={{
                    position:           "fixed",
                    bottom:             "28px",
                    left:               "20px",
                    zIndex:             9999,
                    display:            "flex",
                    alignItems:         "center",
                    gap:                "12px",
                    background:         "rgba(255,253,250,0.92)",
                    backdropFilter:     "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    border:             "1px solid rgba(56,42,36,0.09)",
                    borderRadius:       "22px",
                    padding:            "11px 16px 11px 13px",
                    boxShadow:
                        "0 4px 6px rgba(56,42,36,0.04), 0 12px 40px rgba(56,42,36,0.10), 0 1px 2px rgba(56,42,36,0.06)",
                    cursor:             "pointer",
                    animation:          exiting
                        ? "fya-slide-out 0.42s cubic-bezier(0.4,0,1,1) forwards"
                        : "fya-slide-in  0.45s cubic-bezier(0.16,1,0.3,1) forwards",
                    maxWidth:           "290px",
                    minWidth:           "210px",
                    userSelect:         "none",
                }}
            >
                {/* Avatar / ikon produk */}
                <div
                    style={{
                        width:        "44px",
                        height:       "44px",
                        borderRadius: "50%",
                        flexShrink:   0,
                        background:   notif.isFemale
                            ? "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)"
                            : "linear-gradient(135deg, #e8f0fe 0%, #c5d8fb 100%)",
                        display:      "flex",
                        alignItems:   "center",
                        justifyContent: "center",
                        fontSize:     "19px",
                        boxShadow:    "0 2px 8px rgba(0,0,0,0.07)",
                    }}
                >
                    {notif.product.emoji}
                </div>

                {/* Teks */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                        margin:       0,
                        fontSize:     "13.5px",
                        fontWeight:   700,
                        color:        "#382a24",
                        fontFamily:   "var(--font-dm-sans, 'DM Sans', sans-serif)",
                        lineHeight:   1.3,
                        letterSpacing: "-0.015em",
                        whiteSpace:   "nowrap",
                        overflow:     "hidden",
                        textOverflow: "ellipsis",
                    }}>
                        {notif.name} baru saja order
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "4px" }}>
                        {/* Live dot */}
                        <span style={{
                            width:        "6px",
                            height:       "6px",
                            borderRadius: "50%",
                            background:   notif.product.color,
                            flexShrink:   0,
                            animation:    "fya-pulse-dot 1.8s ease-in-out infinite",
                            display:      "inline-block",
                        }} />

                        <p style={{
                            margin:       0,
                            fontSize:     "11.5px",
                            fontFamily:   "var(--font-dm-sans, 'DM Sans', sans-serif)",
                            whiteSpace:   "nowrap",
                            overflow:     "hidden",
                            textOverflow: "ellipsis",
                            color:        "#b09a87",
                        }}>
                            <span style={{ color: notif.product.color, fontWeight: 600 }}>
                                {notif.product.label}
                            </span>
                            {" · "}
                            {notif.time}
                        </p>
                    </div>
                </div>

                {/* Tutup */}
                <button
                    onClick={(e) => { e.stopPropagation(); dismiss(); }}
                    aria-label="Tutup notifikasi"
                    style={{
                        background:  "none",
                        border:      "none",
                        cursor:      "pointer",
                        color:       "#d4c4b8",
                        fontSize:    "12px",
                        lineHeight:  1,
                        padding:     "3px",
                        flexShrink:  0,
                        display:     "flex",
                        alignItems:  "center",
                        transition:  "color 0.2s",
                        borderRadius: "50%",
                    }}
                >
                    ✕
                </button>
            </div>
        </>
    );
}
