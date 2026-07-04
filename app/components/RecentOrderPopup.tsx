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

// ── SVG Icons ─────────────────────────────────────────────────────────────────

const IconLetter = ({ color }: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="3"/>
        <polyline points="2,4 12,13 22,4"/>
    </svg>
);

const IconVoices = ({ color }: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
);

const IconMixtape = ({ color }: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
    </svg>
);

const IconInvitation = ({ color }: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
        <path d="M13 5v2"/>
        <path d="M13 17v2"/>
        <path d="M13 11v2"/>
    </svg>
);

const IconRetro = ({ color }: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
);

const IconArcade = ({ color }: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="11" x2="10" y2="11"/>
        <line x1="8" y1="9" x2="8" y2="13"/>
        <line x1="15" y1="12" x2="15.01" y2="12" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="18" y1="10" x2="18.01" y2="10" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59l-.9 7.163A2 2 0 0 0 3.8 18h.001a2 2 0 0 0 1.789-1.106L7 14h10l1.41 2.894A2 2 0 0 0 20.2 18h.001a2 2 0 0 0 1.998-2.247l-.9-7.163A4 4 0 0 0 17.32 5z"/>
    </svg>
);

const IconWrapped = ({ color }: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12"/>
        <rect x="2" y="7" width="20" height="5"/>
        <line x1="12" y1="22" x2="12" y2="7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
);

const IconMemoria = ({ color }: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
);

const PRODUCT_ICONS: Record<string, React.ComponentType<{ color: string }>> = {
    "Letter Edition":     IconLetter,
    "Voices Gift":        IconVoices,
    "Mixtape Edition":    IconMixtape,
    "Invitation Edition": IconInvitation,
    "Retro Edition":      IconRetro,
    "Arcade Edition":     IconArcade,
    "Wrapped Edition":    IconWrapped,
    "Memoria Premium":    IconMemoria,
};

const PRODUCTS = [
    { label: "Letter Edition",     color: "#2a3d5c" },
    { label: "Voices Gift",        color: "#a67c52" },
    { label: "Mixtape Edition",    color: "#5a8d9e" },
    { label: "Invitation Edition", color: "#8a3050" },
    { label: "Retro Edition",      color: "#008689" },
    { label: "Arcade Edition",     color: "#5c8c5c" },
    { label: "Wrapped Edition",    color: "#c9184a" },
    { label: "Memoria Premium",    color: "#7b2d3a" },
];

const TIME_OPTIONS = [
    "35 menit lalu",
    "42 menit lalu",
    "50 menit lalu",
    "1 jam lalu", "1 jam lalu",
    "2 jam lalu", "2 jam lalu",
    "3 jam lalu", "3 jam lalu",
    "4 jam lalu",
    "5 jam lalu",
    "6 jam lalu",
    "8 jam lalu",
    "11 jam lalu",
    "14 jam lalu",
    "18 jam lalu",
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
        // Delay awal 4 detik sebelum pertama muncul
        const initial = 4000;

        const cycle = () => {
            showNext();
            // Muncul ~45 detik sekali (39–51 detik), termasuk durasi popup tampil 5.5 detik
            timerRef.current = setTimeout(cycle, 39500 + Math.random() * 12000);
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
                        boxShadow:    "0 2px 8px rgba(0,0,0,0.07)",
                    }}
                >
                    {(() => {
                        const Icon = PRODUCT_ICONS[notif.product.label];
                        return Icon ? <Icon color={notif.product.color} /> : null;
                    })()}
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
