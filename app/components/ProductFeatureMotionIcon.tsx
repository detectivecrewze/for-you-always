import type { CSSProperties } from "react";
import styles from "./ProductFeatureMotionIcon.module.css";

interface ProductFeatureMotionIconProps {
    feature: string;
    color: string;
}

export default function ProductFeatureMotionIcon({ feature, color }: ProductFeatureMotionIconProps) {
    const normalized = feature.toLowerCase();
    const iconStyle = { "--feature-color": color, color } as CSSProperties;
    const common = {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.9,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        "aria-hidden": true,
    };

    if (normalized.includes("puzzle")) {
        return (
            <span className={styles.icon} style={iconStyle}>
                <svg {...common}>
                    <path className={styles.draw} d="M5 4h5a2 2 0 1 1 4 0h5v5a2 2 0 1 1 0 4v6h-6a2 2 0 1 1-4 0H5v-5a2 2 0 1 1 0-4Z" />
                    <path className={styles.float} d="m9 13 2 2 4-5" />
                </svg>
            </span>
        );
    }

    if (normalized.includes("printer") || normalized.includes("invitation") || normalized.includes("rundown")) {
        return (
            <span className={styles.icon} style={iconStyle}>
                <svg {...common}>
                    <path className={styles.draw} d="M6 9V3h12v6M6 18H4V9h16v9h-2" />
                    <path className={styles.paper} d="M7 14h10v7H7z" />
                    <circle className={styles.pulse} cx="17" cy="12" r="1" fill="currentColor" stroke="none" />
                </svg>
            </span>
        );
    }

    if (normalized.includes("tiket") || normalized.includes("ticket") || normalized.includes("unduh") || normalized.includes("bagikan")) {
        return (
            <span className={styles.icon} style={iconStyle}>
                <svg {...common}>
                    <path className={styles.draw} d="M4 7h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4Z" />
                    <path className={styles.blink} d="M12 9v8M9 13h6" />
                </svg>
            </span>
        );
    }

    if (normalized.includes("tim") || normalized.includes("terima jadi")) {
        return (
            <span className={styles.icon} style={iconStyle}>
                <svg {...common}>
                    <circle className={styles.pulse} cx="9" cy="8" r="3" />
                    <circle className={styles.pulse} cx="17" cy="9" r="2" style={{ animationDelay: "0.28s" }} />
                    <path className={styles.draw} d="M3.5 20c.4-4 2.2-6 5.5-6s5.1 2 5.5 6M14 15c3.6-.6 5.7 1.1 6.5 4" />
                </svg>
            </span>
        );
    }

    if (normalized.includes("musik") || normalized.includes("lagu") || normalized.includes("audio") || normalized.includes("foto") || normalized.includes("video") || normalized.includes("surat")) {
        return (
            <span className={styles.icon} style={iconStyle}>
                <svg {...common}>
                    <path className={styles.float} d="M9 18V6l10-2v12" />
                    <circle className={styles.pulse} cx="6" cy="18" r="2.7" />
                    <circle className={styles.pulse} cx="16" cy="16" r="2.7" style={{ animationDelay: "0.28s" }} />
                </svg>
            </span>
        );
    }

    if (normalized.includes("maskot") || normalized.includes("warna") || normalized.includes("palet") || normalized.includes("karakter")) {
        return (
            <span className={styles.icon} style={iconStyle}>
                <svg {...common}>
                    <path className={styles.draw} d="M12 3a9 9 0 1 0 0 18h1.4a1.6 1.6 0 0 0 1.1-2.7l-.5-.5a1.7 1.7 0 0 1 1.2-2.9H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3Z" />
                    <circle className={styles.pulse} cx="7.5" cy="10" r="1" fill="currentColor" stroke="none" />
                    <circle className={styles.pulse} cx="11" cy="7" r="1" fill="currentColor" stroke="none" style={{ animationDelay: "0.2s" }} />
                    <circle className={styles.pulse} cx="15" cy="8" r="1" fill="currentColor" stroke="none" style={{ animationDelay: "0.4s" }} />
                </svg>
            </span>
        );
    }

    if (normalized.includes("ending") || normalized.includes("respons") || normalized.includes("jawaban")) {
        return (
            <span className={styles.icon} style={iconStyle}>
                <svg {...common}>
                    <path className={styles.draw} d="M5 5v4a3 3 0 0 0 3 3h8" />
                    <path className={styles.draw} d="m13 8 4 4-4 4" />
                    <circle className={styles.pulse} cx="5" cy="5" r="2" />
                    <circle className={styles.pulse} cx="18" cy="12" r="2" style={{ animationDelay: "0.35s" }} />
                </svg>
            </span>
        );
    }

    if (normalized.includes("studio") || normalized.includes("preview") || normalized.includes("editor")) {
        return (
            <span className={styles.icon} style={iconStyle}>
                <svg {...common}>
                    <rect className={styles.draw} x="3" y="4" width="18" height="13" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                    <path className={styles.blink} d="M8 10s1.5-2.5 4-2.5S16 10 16 10s-1.5 2.5-4 2.5S8 10 8 10Z" />
                    <circle className={styles.pulse} cx="12" cy="10" r="1.2" fill="currentColor" stroke="none" />
                </svg>
            </span>
        );
    }

    return (
        <span className={styles.icon} style={iconStyle}>
            <svg {...common}>
                <rect className={styles.draw} x="3" y="5" width="18" height="14" rx="2" />
                <path className={styles.float} d="m4 7 8 6 8-6" />
                <path className={styles.blink} d="M18 3v4M16 5h4" />
            </svg>
        </span>
    );
}
