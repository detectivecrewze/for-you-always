"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SalesCountBadge from "./SalesCountBadge";
import ProductFeatureMotionIcon from "./ProductFeatureMotionIcon";
import styles from "./CompactProductCard.module.css";

interface CompactProductCardProps {
    badgeText?: string;
    badgeColor?: string;
    slotBadgeText?: string;
    imageSrc: string;
    title: string;
    titleColor?: string;
    oldPrice?: string;
    newPrice: string;
    hashtag?: string;
    productId?: string;
    href: string;
    features?: string[];
    occasions?: string[];
    animatedFeatureIcons?: boolean;
    addonText?: string;
    onAddToCart?: () => void;
    priority?: boolean;
}

const ExternalIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 5h5v5" /><path d="M10 14L19 5" /><path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
    </svg>
);

const CartIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);

export default function CompactProductCard({
    badgeText,
    badgeColor = "#a88365",
    slotBadgeText,
    imageSrc,
    title,
    titleColor = "#382a24",
    newPrice,
    productId,
    href,
    features,
    occasions,
    animatedFeatureIcons = false,
    onAddToCart,
    priority = false,
}: CompactProductCardProps) {
    const [isNavigating, setIsNavigating] = useState(false);
    const rootStyle = {
        "--product-color": titleColor,
        "--badge-color": badgeColor,
    } as React.CSSProperties;

    const titleParts = title.includes(" (") ? title.split(" (") : null;

    return (
        <article className={styles.card} style={rootStyle}>
            <div className={styles.media}>
                <Link href={href} aria-label={`Lihat detail ${title}`} className={styles.imageLink}>
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        sizes="(max-width: 639px) calc(50vw - 17px), (max-width: 899px) 46vw, 360px"
                        priority={priority}
                        loading={priority ? undefined : "lazy"}
                        className={`${styles.image} ${badgeText === "UPCOMING" ? styles.upcomingImage : ""}`}
                    />
                </Link>

                {badgeText === "UPCOMING" && (
                    <div className={styles.lockBadge}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <rect x="4" y="10" width="16" height="10" rx="2" />
                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                        </svg>
                        <span>Revealing Soon</span>
                    </div>
                )}

                {badgeText && <span className={styles.badge}>{badgeText}</span>}

                {slotBadgeText && (
                    <span className={styles.slotBadge}>
                        <span className={styles.slotDot} aria-hidden="true" />
                        <span>{slotBadgeText}</span>
                    </span>
                )}

                <div className={styles.mobileSalesOverlay}>
                    <SalesCountBadge productId={productId} color={titleColor} compact />
                </div>

            </div>

            <div className={styles.content}>
                <div className={styles.headingRow}>
                    <div className={styles.metaColumn}>
                        <Link href={href} className={styles.titleLink} aria-label={`Lihat detail ${title}`}>
                            <h3 className={`${styles.title} ${title.length > 15 ? styles.longTitle : ""}`}>
                                {titleParts ? (
                                    <>{titleParts[0]} <span className={styles.titleSuffix}>({titleParts[1]}</span></>
                                ) : title}
                            </h3>
                        </Link>

                        <div className={styles.salesRow}>
                            <SalesCountBadge productId={productId} color={titleColor} compact />
                        </div>

                        {occasions && occasions.length > 0 && (
                            <div className={styles.occasions}>
                                <span className={styles.occasionHeading}>
                                    <span className={styles.occasionLabel}>For</span>
                                </span>
                                <span
                                    className={styles.occasionList}
                                    role="list"
                                    tabIndex={occasions.length > 2 ? 0 : -1}
                                    aria-label={`Occasion: ${occasions.join(", ")}`}
                                >
                                    {occasions.map((occasion) => (
                                        <span key={occasion} className={styles.occasionChip} role="listitem">{occasion}</span>
                                    ))}
                                </span>
                            </div>
                        )}
                    </div>

                </div>

                {features && features.length > 0 && (
                    <div className={styles.features}>
                        {features.map((feature) => (
                            <div key={feature} className={styles.feature}>
                                {animatedFeatureIcons ? (
                                    <ProductFeatureMotionIcon feature={feature} color={titleColor} />
                                ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={titleColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.purchaseBlock}>
                    <div className={styles.purchaseRail} aria-label={`Harga ${newPrice}`}>
                        <span className={styles.purchaseLabel}>Harga</span>
                        <div className={styles.priceColumn}>
                            <div className={styles.regularPrice}>
                                <span>{newPrice}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.desktopActions}>
                        <Link href={href} prefetch onClick={() => setIsNavigating(true)} className={styles.secondaryAction} aria-label={`Lihat detail ${title}`}>
                            {isNavigating ? <><span className={styles.spinner} aria-hidden="true" /> Memuat...</> : <><ExternalIcon /> Lihat</>}
                        </Link>
                        {onAddToCart && (
                            <button type="button" onClick={onAddToCart} className={styles.primaryAction} aria-label={`Pesan ${title}`}>
                                <CartIcon /> Pesan
                            </button>
                        )}
                    </div>
                </div>

                <div className={styles.mobileActions}>
                    <Link href={href} prefetch onClick={() => setIsNavigating(true)} className={styles.secondaryAction} aria-label={`Lihat detail ${title}`}>
                        {isNavigating ? <><span className={styles.spinner} aria-hidden="true" /> Memuat...</> : <><ExternalIcon /> Lihat</>}
                    </Link>
                    {onAddToCart && (
                        <button type="button" onClick={onAddToCart} className={styles.primaryAction} aria-label={`Pesan ${title}`}>
                            <CartIcon /> Pesan
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}
