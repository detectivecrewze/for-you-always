"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";

interface LoopCard {
    badgeText?: string;
    badgeColor?: string;
    badgeVariant?: "solid" | "soft"; // solid=white bg, soft=tinted
    imageSrc: string;
    title: string;
    titleColor?: string;
    description: string;
    demoLink?: string;
    href: string;
    price?: string;
    onOrder?: () => void;
}

interface AutoScrollCarouselProps {
    cards: LoopCard[];
    speed?: number; // px per second, default 60
}

export default function AutoScrollCarousel({ cards, speed = 55 }: AutoScrollCarouselProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<number | null>(null);
    const pausedRef = useRef(false);
    const posRef = useRef(0);

    // Drag-to-scroll state
    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const dragStartPos = useRef(0);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const totalItems = cards.length;
        // track has 2x items for seamless loop
        const singleWidth = track.scrollWidth / 2;

        let lastTime: number | null = null;

        const animate = (now: number) => {
            if (lastTime === null) lastTime = now;
            const delta = now - lastTime;
            lastTime = now;

            if (!pausedRef.current && !isDragging.current) {
                posRef.current += (speed * delta) / 1000;
                if (posRef.current >= singleWidth) {
                    posRef.current -= singleWidth;
                }
                track.style.transform = `translateX(-${posRef.current}px)`;
            }

            animRef.current = requestAnimationFrame(animate);
        };

        animRef.current = requestAnimationFrame(animate);
        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [cards.length, speed]);

    // Pause on hover
    const handleMouseEnter = () => { pausedRef.current = true; };
    const handleMouseLeave = () => {
        if (!isDragging.current) pausedRef.current = false;
    };

    // Drag-to-scroll
    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        pausedRef.current = true;
        dragStartX.current = e.clientX;
        dragStartPos.current = posRef.current;
        if (trackRef.current) trackRef.current.style.cursor = "grabbing";
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        const track = trackRef.current;
        if (!track) return;
        const delta = dragStartX.current - e.clientX;
        const singleWidth = track.scrollWidth / 2;
        let newPos = dragStartPos.current + delta;
        // clamp within loop range
        if (newPos < 0) newPos += singleWidth;
        if (newPos >= singleWidth) newPos -= singleWidth;
        posRef.current = newPos;
        track.style.transform = `translateX(-${posRef.current}px)`;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        pausedRef.current = false;
        if (trackRef.current) trackRef.current.style.cursor = "grab";
    };

    // Render a single card
    const renderCard = (card: LoopCard, key: string) => (
        <article
            key={key}
            style={{
                width: 360,
                flexShrink: 0,
                borderRadius: "1.6rem",
                background: "#ffffff",
                padding: "12px",
                boxShadow: "0 4px 24px -4px rgba(0,0,0,0.07), 0 0 0 1px rgba(205,171,143,0.1)",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                userSelect: "none",
                display: "flex",
                flexDirection: "column",
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px -8px rgba(0,0,0,0.14), 0 0 0 1px rgba(205,171,143,0.18)";
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px -4px rgba(0,0,0,0.07), 0 0 0 1px rgba(205,171,143,0.1)";
            }}
        >
            {/* Image Container with rounded corners all around */}
            <div style={{ position: "relative", overflow: "hidden", borderRadius: "1.2rem" }}>
                <img
                    src={card.imageSrc}
                    alt={card.title}
                    draggable={false}
                    style={{
                        width: "100%",
                        height: 260,
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.5s ease",
                        pointerEvents: "none",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                />
                {/* Badge */}
                {card.badgeText && (
                    <span style={{
                        position: "absolute",
                        top: 12,
                        left: card.badgeVariant === "soft" ? "auto" : 12,
                        right: card.badgeVariant === "soft" ? 12 : "auto",
                        borderRadius: 999,
                        background: card.badgeVariant === "soft"
                            ? `${card.badgeColor || "#a88365"}22`
                            : "rgba(255,255,255,0.88)",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                        color: card.badgeVariant === "soft"
                            ? (card.badgeColor || "#a88365")
                            : (card.badgeColor || "#382a24"),
                        fontSize: 9,
                        fontWeight: 800,
                        padding: "4px 12px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                    }}>
                        {card.badgeText}
                    </span>
                )}

                {/* Price overlay */}
                {card.price && (
                    <div
                        style={{
                            position: "absolute", bottom: 12, left: 12,
                            display: "flex", alignItems: "center", gap: 5,
                            background: "rgba(250,247,242,0.85)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                            border: "1px solid rgba(56,42,36,0.1)",
                            borderRadius: 999,
                            padding: "5px 12px",
                            fontSize: 10, fontWeight: 800,
                            color: "#382a24",
                            letterSpacing: "0.05em",
                        }}
                    >
                        {card.price}
                    </div>
                )}

            </div>

            {/* Content */}
            <div style={{ padding: "16px 8px 8px 8px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <h3 style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 24, fontWeight: 800,
                    color: card.titleColor || "#382a24",
                    margin: "0 0 8px 0",
                    letterSpacing: "-0.02em", lineHeight: 1.15,
                }}>
                    {card.title}
                </h3>
                <p style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 13, fontWeight: 400,
                    color: "#7a6a62", lineHeight: 1.6,
                    margin: "0 0 20px 0",
                }}>
                    {card.description}
                </p>

                {/* Buttons — stacked like letter4u */}
                <button
                    onClick={card.onOrder}
                    style={{
                        width: "100%", padding: "12px 0", borderRadius: 12,
                        background: card.titleColor || "#382a24", color: "#faf7f2",
                        fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 800,
                        border: "none", cursor: "pointer",
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        marginBottom: 6,
                        transition: "all 0.2s ease",
                        boxShadow: `0 4px 14px ${card.titleColor || "#382a24"}33`,
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 20px ${card.titleColor || "#382a24"}44`;
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 14px ${card.titleColor || "#382a24"}33`;
                    }}
                >
                    Order Gift
                </button>
                <Link href={card.href} style={{
                    display: "flex", justifyContent: "center", alignItems: "center", gap: 6,
                    width: "100%", padding: "12px 0", borderRadius: 12,
                        border: "1.5px solid rgba(205,171,143,0.3)",
                        background: "transparent", color: "#6e5c53",
                        fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
                        textDecoration: "none",
                        letterSpacing: "0.07em", textTransform: "uppercase",
                        transition: "all 0.2s ease",
                        boxSizing: "border-box",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#faf7f2"; e.currentTarget.style.borderColor = "rgba(205,171,143,0.5)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(205,171,143,0.3)"; }}
                >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 5h5v5"/><path d="M10 14L19 5"/><path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4"/>
                    </svg>
                    Preview
                </Link>
            </div>
        </article>
    );

    return (
        <div
            style={{ position: "relative", width: "100%", overflow: "hidden" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {/* The moving track — duplicated for seamless loop */}
            <div
                ref={trackRef}
                style={{
                    display: "flex",
                    gap: 20,
                    willChange: "transform",
                    cursor: "grab",
                    paddingBottom: 16,
                    paddingTop: 8,
                }}
            >
                {/* Original set */}
                {cards.map((c, i) => renderCard(c, `card-a-${i}`))}
                {/* Duplicate set for seamless loop */}
                {cards.map((c, i) => renderCard(c, `card-b-${i}`))}
            </div>

            {/* Fade edges */}
            <div style={{
                position: "absolute", left: 0, top: 0, bottom: 16,
                width: 80, background: "linear-gradient(90deg, rgba(250,247,242,1) 0%, transparent 100%)",
                pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute", right: 0, top: 0, bottom: 16,
                width: 80, background: "linear-gradient(270deg, rgba(250,247,242,1) 0%, transparent 100%)",
                pointerEvents: "none",
            }} />
        </div>
    );
}
