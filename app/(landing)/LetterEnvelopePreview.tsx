"use client";

import React, { useState, useCallback } from "react";

interface EnvelopeTheme {
    bg: string; envBg: string; envFold: string; envFoldBtm: string;
    envFlap: string; labelBg: string; text: string; textLight: string;
    accent: string; shadow: string; petals: string[]; isDark: boolean;
}

const THEME_MAP: Record<string, EnvelopeTheme> = {
    Blush: {
        bg: "#fdf6ee", envBg: "#ecdccb", envFold: "#d1bba4", envFoldBtm: "#c4ab92",
        envFlap: "#e8dfd0", labelBg: "#faf7f2", text: "#2c1b14", textLight: "#7a5c4d",
        accent: "#d4a5a5", shadow: "rgba(160,130,110,0.25)",
        petals: ["#f2c4c4","#e8a8a8","#f7dada","#d4a5a5","#fbe8e8","#c49090"],
        isDark: false,
    },
    Sage: {
        bg: "#f4f7f2", envBg: "#e6ede5", envFold: "#dee6dd", envFoldBtm: "#d0dccf",
        envFlap: "#dde5dc", labelBg: "#f8faf7", text: "#2d3a2e", textLight: "#6a856b",
        accent: "#7a9e7e", shadow: "rgba(80,100,80,0.15)",
        petals: ["#9ec49f","#b8d4b9","#7a9e7e","#c8ddc9","#6a8e6c","#d4e8d5"],
        isDark: false,
    },
    Rose: {
        bg: "#fdf0f0", envBg: "#f2e4e4", envFold: "#dbbfbf", envFoldBtm: "#c9a9a9",
        envFlap: "#dfcece", labelBg: "#fffafa", text: "#2b1820", textLight: "#804051",
        accent: "#c4858a", shadow: "rgba(180,130,130,0.2)",
        petals: ["#e8a0a6","#c4858a","#f0bcbf","#d4959a","#f5cdd0","#b87880"],
        isDark: false,
    },
    Midnight: {
        bg: "#0f1729", envBg: "#141e35", envFold: "#18243e", envFoldBtm: "#1c2b4a",
        envFlap: "#0f1729", labelBg: "#141e35", text: "#e8dcc8", textLight: "#a0947c",
        accent: "#6b8cba", shadow: "rgba(0,0,0,0.5)",
        petals: ["#6b8cba","#4a6a9c","#8aabce","#3d5a82","#9bbad8","#c8d8ea"],
        isDark: true,
    },
    Crimson: {
        bg: "#1a0508", envBg: "#250a10", envFold: "#3a0f18", envFoldBtm: "#4a1520",
        envFlap: "#1a0508", labelBg: "#200810", text: "#fce8ea", textLight: "#d4848e",
        accent: "#c0394f", shadow: "rgba(100,0,20,0.6)",
        petals: ["#e05570","#c0394f","#f07090","#a02040","#f59090","#8c1f33"],
        isDark: true,
    },
    Obsidian: {
        bg: "#0a0a0a", envBg: "#1a1a1a", envFold: "#222222", envFoldBtm: "#2a2a2a",
        envFlap: "#0a0a0a", labelBg: "#141414", text: "#e8e8e8", textLight: "#9a9a9a",
        accent: "#b8a890", shadow: "rgba(0,0,0,0.8)",
        petals: ["#d4c8b4","#b8a890","#e0d4c0","#8a7c68","#c8bca8","#f0e8d8"],
        isDark: true,
    },
};

const PETAL_PATHS = [
    "M0,-14 C4,-10 6,0 0,10 C-6,0 -4,-10 0,-14 Z",
    "M0,-12 C6,-8 8,2 0,11 C-8,2 -6,-8 0,-12 Z",
    "M0,-16 C2,-10 3,2 0,12 C-3,2 -2,-10 0,-16 Z",
    "M0,-10 C5,-8 7,4 0,9 C-7,4 -5,-8 0,-10 Z",
    "M0,-13 C4,-9 5,1 0,10 C-5,1 -4,-9 0,-13 Z",
];

interface Petal {
    id: number; x: number; y: number; size: number; color: string;
    rotation: number; vx: number; vy: number; vr: number; opacity: number; path: string;
}

const T = "0.6s cubic-bezier(0.4,0,0.2,1)";

export function LetterEnvelopePreview({ activeThemeName }: { activeThemeName: string | null }) {
    const theme = THEME_MAP[activeThemeName ?? "Blush"] ?? THEME_MAP.Blush;
    const [petals, setPetals] = useState<Petal[]>([]);
    const [counter, setCounter] = useState(0);

    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const newPetals: Petal[] = Array.from({ length: 18 }, (_, i) => {
            const angle = (i / 18) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
            const speed = 2.5 + Math.random() * 4;
            return {
                id: counter + i,
                x: cx + (Math.random() - 0.5) * 20,
                y: cy + (Math.random() - 0.5) * 20,
                size: 10 + Math.random() * 14,
                color: theme.petals[Math.floor(Math.random() * theme.petals.length)],
                rotation: Math.random() * 360,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5,
                vr: (Math.random() - 0.5) * 12,
                opacity: 0.85 + Math.random() * 0.15,
                path: PETAL_PATHS[Math.floor(Math.random() * PETAL_PATHS.length)],
            };
        });

        setCounter(c => c + 18);
        setPetals(prev => [...prev, ...newPetals]);

        const start = Date.now();
        const duration = 1800;
        const ids = new Set(newPetals.map(p => p.id));

        const tick = () => {
            const elapsed = Date.now() - start;
            const progress = elapsed / duration;
            if (progress >= 1) { setPetals(prev => prev.filter(p => !ids.has(p.id))); return; }
            const t2 = elapsed / 1000;
            setPetals(prev => prev.map(p => {
                if (!ids.has(p.id)) return p;
                return { ...p, x: p.x + p.vx, y: p.y + p.vy + t2 * 1.2, rotation: p.rotation + p.vr, opacity: (1 - progress) * 0.9, vx: p.vx * 0.97, vy: p.vy * 0.97 };
            }));
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [theme.petals, counter]);

    return (
        <>
            <style>{`
                @keyframes float-env-preview { 0%,100%{transform:translateY(0px) rotate(-0.5deg)} 50%{transform:translateY(-10px) rotate(0.5deg)} }
                @keyframes seal-pulse-preview { 0%,100%{filter:drop-shadow(0 2px 8px rgba(191,76,48,0.4))} 50%{filter:drop-shadow(0 4px 16px rgba(191,76,48,0.65))} }
                .env-preview-wrapper { animation:float-env-preview 4.5s ease-in-out infinite; will-change:transform; cursor:pointer; }
                .seal-preview { animation:seal-pulse-preview 2.8s ease-in-out infinite; }
            `}</style>

            <div onClick={handleClick} style={{ width:"100%", height:"100%", background:theme.bg, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", transition:`background ${T}` }}>
                {/* Ambient blobs */}
                <div style={{ position:"absolute", width:"55%", height:"55%", borderRadius:"50%", background:`radial-gradient(circle,${theme.accent}28 0%,transparent 70%)`, top:"5%", left:"15%", pointerEvents:"none", transition:`background ${T}` }} />
                <div style={{ position:"absolute", width:"40%", height:"40%", borderRadius:"50%", background:`radial-gradient(circle,${theme.accent}18 0%,transparent 70%)`, bottom:"10%", right:"10%", pointerEvents:"none", transition:`background ${T}` }} />

                {/* Petals SVG layer */}
                <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:20, overflow:"visible" }}>
                    {petals.map(p => (
                        <g key={p.id} transform={`translate(${p.x},${p.y}) rotate(${p.rotation})`} opacity={p.opacity}>
                            <path d={p.path} fill={p.color} transform={`scale(${p.size / 10})`} />
                        </g>
                    ))}
                </svg>

                {/* Envelope + Seal */}
                <div className="env-preview-wrapper" style={{ display:"flex", flexDirection:"column", alignItems:"center", position:"relative", zIndex:10, userSelect:"none" }}>
                    <svg width="240" height="162" viewBox="0 0 240 162" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter:`drop-shadow(0 20px 40px ${theme.shadow})`, transition:`filter ${T}`, display:"block" }}>
                        <rect x="0.5" y="0.5" width="239" height="161" rx="3" fill={theme.envBg} stroke={theme.accent + "40"} strokeWidth="1" style={{ transition:`fill ${T}` }} />
                        <path d="M0 0 L120 88 L0 162 Z" fill={theme.envFold} style={{ transition:`fill ${T}` }} />
                        <path d="M240 0 L120 88 L240 162 Z" fill={theme.envFold} style={{ transition:`fill ${T}` }} />
                        <path d="M0 162 L120 88 L240 162 Z" fill={theme.envFoldBtm} style={{ transition:`fill ${T}` }} />
                        <path d="M0 0 L120 76 L240 0 Z" fill={theme.envFlap} stroke={theme.accent + "30"} strokeWidth="0.8" style={{ transition:`fill ${T}` }} />
                        <rect x="62" y="98" width="116" height="44" rx="2" fill={theme.labelBg} stroke={theme.accent + "30"} strokeWidth="0.8" style={{ transition:`fill ${T}` }} />
                        <text x="120" y="113" textAnchor="middle" fontSize="7" letterSpacing="4" fill={theme.textLight} fontFamily="DM Sans,system-ui,sans-serif" style={{ transition:`fill ${T}` }}>FOR</text>
                        <text x="120" y="132" textAnchor="middle" fontSize="18" fill={theme.text} fontFamily="Caveat,cursive" style={{ transition:`fill ${T}` }}>Kiara</text>
                        <line x1="80" y1="38" x2="108" y2="58" stroke={theme.accent + "25"} strokeWidth="0.6" strokeDasharray="2 3" />
                        <line x1="160" y1="38" x2="132" y2="58" stroke={theme.accent + "25"} strokeWidth="0.6" strokeDasharray="2 3" />
                    </svg>

                    {/* Wax seal */}
                    <div className="seal-preview" style={{ position:"absolute", top:"28px", left:"50%", transform:"translateX(-50%)", zIndex:10 }}>
                        <svg width="44" height="44" viewBox="0 0 72 72" fill="none">
                            <circle cx="36" cy="36" r="34" fill="#9b3b24" opacity="0.1"/>
                            <circle cx="36" cy="36" r="29" fill="#8b2d1a"/>
                            <circle cx="36" cy="36" r="27" fill="#a83a23"/>
                            <circle cx="36" cy="36" r="25" fill="#bf4c30"/>
                            <ellipse cx="29" cy="27" rx="8" ry="5" fill="white" opacity="0.13" transform="rotate(-35 29 27)"/>
                            <circle cx="36" cy="36" r="21" fill="none" stroke="#e8957a" strokeWidth="0.9" opacity="0.55"/>
                            <circle cx="36" cy="36" r="18" fill="none" stroke="#e8957a" strokeWidth="0.4" opacity="0.3"/>
                            <text x="36" y="43" textAnchor="middle" fontSize="20" fill="#fde8e0" fontFamily="Georgia,serif" opacity="0.92">✦</text>
                        </svg>
                    </div>

                    {/* Tap hint */}
                    <p style={{ marginTop:18, fontFamily:"DM Sans,system-ui,sans-serif", fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:theme.textLight, opacity:0.7, userSelect:"none", transition:`color ${T}` }}>
                        ❦&ensp;tap to open&ensp;❦
                    </p>
                </div>
            </div>
        </>
    );
}
