"use client";

import React, { useEffect, useState, useRef } from "react";

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Animated Section (Intersection Observer)
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function AnimatedSection({
    children,
    className = "",
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setTimeout(() => setIsVisible(true), delay);
            },
            { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [delay]);

    return (
        <div
            ref={ref}
            style={{
                transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(32px)",
            }}
            className={className}
        >
            {children}
        </div>
    );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   SVG Room Icons (no emoji)
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const RoomIcons: Record<string, React.ReactNode> = {
    Music: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
        </svg>
    ),
    Journey: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18M12 3l9 9-9 9" />
            <circle cx="5" cy="12" r="2" fill="currentColor" stroke="none" opacity="0.6" />
            <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" opacity="0.6" />
            <circle cx="19" cy="12" r="2" fill="currentColor" stroke="none" opacity="0.6" />
        </svg>
    ),
    Moments: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="12" cy="12" r="3" />
            <path d="M3 9h18" opacity="0.4" />
        </svg>
    ),
    Quiz: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <circle cx="12" cy="17" r="0.5" fill="currentColor" strokeWidth="2" />
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        </svg>
    ),
    Catcher: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    Fortune: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
            <path d="M8.5 8.5l1.5 1.5M15.5 8.5l-1.5 1.5M8.5 15.5l1.5-1.5M15.5 15.5l-1.5-1.5" opacity="0.5" />
        </svg>
    ),
    Things: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    ),
    Bucket: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
    ),
    Message: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h8M8 13h5" opacity="0.5" />
        </svg>
    ),
    Atlas: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
            <line x1="9" y1="3" x2="9" y2="18" />
            <line x1="15" y1="6" x2="15" y2="21" />
        </svg>
    ),
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   10 Arcade Rooms Data
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const ARCADE_ROOMS = [
    {
        title: "Atlas",
        description: "Peta kenangan kita - setiap titik lokasi menyimpan foto dan cerita spesial.",
        color: "#b8956a",
    },
    {
        title: "Music",
        description: "Putar lagu spesial dengan visualizer bintang-bintang yang menari mengikuti irama.",
        color: "#c4a882",
    },
    {
        title: "Journey",
        description: "Petualangan visual perjalanan hubungan kalian - dari awal bertemu hingga hari ini.",
        color: "#a89070",
    },
    {
        title: "Moments",
        description: "Galeri foto kenangan yang berputar sinematik - setiap foto punya ceritanya sendiri.",
        color: "#b8956a",
    },
    {
        title: "Quiz",
        description: "Tebak jawaban dari kamu - penuh kejutan dan tawa di setiap pertanyaan.",
        color: "#c4a882",
    },
    {
        title: "Catcher",
        description: "Mini-game interaktif menangkap bintang - seru dan ringan",
        color: "#d4b896",
    },
    {
        title: "Fortune",
        description: "Ramalan romantis yang ditulis khusus - buka satu per satu untuk kata-kata manis.",
        color: "#b89878",
    },
    {
        title: "Things",
        description: "Tulis h   al-hal kecil yang kamu cintai dari dia - because the little things matter most.",
        color: "#c4a882",
    },
    {
        title: "Bucket",
        description: "Daftar impian bersama yang bisa di-check off - dari yang sederhana hingga yang besar.",
        color: "#a89070",
    },
    {
        title: "Message",
        description: "Pesan cinta penutup yang menyentuh hati - kata terakhir yang paling berkesan.",
        color: "#c4a882",
    },
];

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Room Showcase - Cinematic Fullscreen Slideshow
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

// For each room: provide video MP4 url + image fallback url
// If video fails to load, image will show automatically
const ROOM_MEDIA: Record<string, { video: string; image: string }> = {
    MainMenu: { video: "https://cdn.for-you-always.my.id/1773433190382-k7de49.mp4", image: "https://cdn.for-you-always.my.id/1773430308266-v83pts.png" }, // <- isi URL video/image main menu di sini
    Music: { video: "https://cdn.for-you-always.my.id/1773426110433-1feui.mp4", image: "https://cdn.for-you-always.my.id/1773426246132-1fboiq.png" },
    Journey: { video: "https://cdn.for-you-always.my.id/1773426101549-nd559h.mp4", image: "https://cdn.for-you-always.my.id/1773426243996-qo142o.png" },
    Moments: { video: "https://cdn.for-you-always.my.id/1773426107508-yc067a.mp4", image: "https://cdn.for-you-always.my.id/1773426241684-7nyd8.png" },
    Quiz: { video: "https://cdn.for-you-always.my.id/1773426113479-uu9xep.mp4", image: "https://cdn.for-you-always.my.id/1773426240184-e8e9g.png" },
    Catcher: { video: "https://cdn.for-you-always.my.id/1773426115531-1f4i3u.mp4", image: "https://cdn.for-you-always.my.id/1773426249831-jdt8p.png" },
    Fortune: { video: "https://cdn.for-you-always.my.id/1773426099696-jzm23i.mp4", image: "https://cdn.for-you-always.my.id/1773426247705-uljtlq.png" },
    Things: { video: "https://cdn.for-you-always.my.id/1773426093227-u7iyto.mp4", image: "https://cdn.for-you-always.my.id/1773426238625-g67c6g.png" },
    Bucket: { video: "https://cdn.for-you-always.my.id/1773426095486-zsqvxo.mp4", image: "https://cdn.for-you-always.my.id/1773426236078-a34r3.png" },
    Atlas: { video: "https://cdn.for-you-always.my.id/1773525779608-nzn9pr.mp4", image: "https://cdn.for-you-always.my.id/1773525723347-lotpid.png" },
    Message: { video: "https://cdn.for-you-always.my.id/1773426105222-2tovrh.mp4", image: "https://cdn.for-you-always.my.id/1773426233907-oti0c8.png" },
};

function RoomShowcase() {
    // slide 0 = main menu, slides 1-10 = rooms
    const TOTAL_SLIDES = 11;
    const [active, setActive] = useState(0);
    const [fading, setFading] = useState(false);

    const goTo = (idx: number) => {
        if (idx === active || fading) return;
        setFading(true);
        setTimeout(() => {
            setActive(idx);
            setFading(false);
        }, 300);
    };

    const prev = () => goTo((active - 1 + TOTAL_SLIDES) % TOTAL_SLIDES);
    const next = () => goTo((active + 1) % TOTAL_SLIDES);

    const isMenu = active === 0;
    const room = isMenu ? null : ARCADE_ROOMS[active - 1];
    const media = room ? ROOM_MEDIA[room.title] : null;

    return (
        <section id="rooms" style={{ position: "relative", zIndex: 1, padding: "100px 0", background: "rgba(166,124,82,0.03)" }}>
            {/* Section Header */}
            <AnimatedSection>
                <div style={{ textAlign: "center", marginBottom: 56 }}>
                    <div className="arc-badge" style={{ marginBottom: 24 }}>
                        10 Interactive Rooms
                    </div>
                    <h2 className="arc-heading-lg">
                        Setiap Ruang, Satu Dunia.
                        <br />
                        <span className="arc-italic" style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)" }}>
                            Penuh Kejutan di Dalamnya.
                        </span>
                    </h2>
                </div>
            </AnimatedSection>

            {/* Slideshow */}
            <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>

                {/* Image Frame */}
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "16/9",
                        borderRadius: "var(--arc-radius-lg)",
                        overflow: "hidden",
                        background: "var(--arc-surface-raised)",
                        border: "1.5px solid var(--arc-border-gold)",
                        boxShadow: "var(--arc-shadow-elevated), 0 0 0 1px rgba(44,30,18,0.08)",
                        transition: "opacity 0.3s ease",
                        opacity: fading ? 0 : 1,
                    }}
                >
                    {/* Vignette overlay */}
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 2,
                        pointerEvents: "none",
                        borderRadius: "var(--arc-radius-lg)",
                        background: "radial-gradient(ellipse at center, transparent 55%, rgba(20,12,6,0.55) 100%)",
                    }} />
                    {isMenu ? (
                        /* â”€â”€ Slide 0: Main Menu - video/image from ROOM_MEDIA.MainMenu â”€â”€ */
                        ROOM_MEDIA.MainMenu.video || ROOM_MEDIA.MainMenu.image ? (
                            <video
                                ref={(el) => {
                                    if (el) {
                                        el.defaultMuted = true;
                                        el.muted = true;
                                        el.playsInline = true;
                                        el.play().catch(() => {});
                                    }
                                }}
                                key={ROOM_MEDIA.MainMenu.video}
                                autoPlay
                                loop
                                muted
                                playsInline
                                poster={ROOM_MEDIA.MainMenu.image}
                                x-webkit-airplay="deny"
                                disablePictureInPicture
                                controlsList="nodownload nofullscreen noremoteplayback"
                                style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
                            >
                                {ROOM_MEDIA.MainMenu.video && <source src={ROOM_MEDIA.MainMenu.video} type="video/mp4" />}
                            </video>
                        ) : (
                            /* Placeholder while URL belum diisi */
                            <div style={{
                                width: "100%", height: "100%",
                                background: "linear-gradient(160deg, #2a1f14 0%, #1e1409 60%, #2d2010 100%)",
                                display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center", gap: 12,
                            }}>
                                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="rgba(255,200,100,0.4)" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                                </svg>
                                <span style={{
                                    fontFamily: "monospace",
                                    fontSize: "0.42rem",
                                    color: "rgba(245,225,180,0.5)",
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                }}>Main Menu Preview</span>
                                <span style={{
                                    fontFamily: "monospace",
                                    fontSize: "0.35rem",
                                    color: "rgba(245,225,180,0.3)",
                                    letterSpacing: "0.1em",
                                }}>isi URL di ROOM_MEDIA.MainMenu</span>
                            </div>
                        )
                    ) : media && (media.video || media.image) ? (
                        <video
                            ref={(el) => {
                                if (el) {
                                    el.defaultMuted = true;
                                    el.muted = true;
                                    el.playsInline = true;
                                    el.play().catch(() => {});
                                }
                            }}
                            key={media.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            poster={media.image}
                            x-webkit-airplay="deny"
                            disablePictureInPicture
                            controlsList="nodownload nofullscreen noremoteplayback"
                            style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
                        >
                            {media.video && <source src={media.video} type="video/mp4" />}
                        </video>
                    ) : room ? (
                        /* Placeholder */
                        <div style={{
                            width: "100%", height: "100%",
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center",
                            gap: 16,
                            background: `linear-gradient(135deg, ${room.color}18 0%, ${room.color}08 100%)`,
                        }}>
                            <div style={{
                                width: 72, height: 72,
                                borderRadius: 20,
                                background: `${room.color}22`,
                                border: `2px solid ${room.color}44`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: room.color,
                            }}>
                                {RoomIcons[room.title]}
                            </div>
                            <span style={{
                                fontFamily: "var(--arc-font-pixel)",
                                fontSize: "0.5rem",
                                color: "var(--arc-text-muted)",
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                            }}>
                                Preview Coming Soon
                            </span>
                        </div>
                    ) : null}

                    {/* Badge top-left */}
                    {!isMenu && (
                        <div style={{
                            position: "absolute", top: 16, left: 16,
                            background: "rgba(253,246,232,0.9)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid var(--arc-border-gold)",
                            borderRadius: 999,
                            padding: "5px 14px",
                            fontFamily: "var(--arc-font-pixel)",
                            fontSize: "0.38rem",
                            color: "var(--arc-accent-warm)",
                            letterSpacing: "0.12em",
                        }}>
                            {String(active).padStart(2, "0")} / 10
                        </div>
                    )}
                </div>

                {/* Info + Navigation */}
                <div style={{
                    marginTop: 28,
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    transition: "opacity 0.3s ease",
                    opacity: fading ? 0 : 1,
                }}>
                    {/* Prev */}
                    <button
                        onClick={prev}
                        aria-label="Previous Room"
                        style={{
                            flexShrink: 0,
                            width: 44, height: 44,
                            borderRadius: "50%",
                            border: "1.5px solid var(--arc-border-gold)",
                            background: "var(--arc-surface-raised)",
                            color: "var(--arc-text-primary)",
                            cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.25s ease",
                            boxShadow: "var(--arc-shadow-soft)",
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = "var(--arc-accent)";
                            (e.currentTarget as HTMLElement).style.color = "#fff";
                            (e.currentTarget as HTMLElement).style.borderColor = "var(--arc-accent)";
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = "var(--arc-surface-raised)";
                            (e.currentTarget as HTMLElement).style.color = "var(--arc-text-primary)";
                            (e.currentTarget as HTMLElement).style.borderColor = "var(--arc-border-gold)";
                        }}
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Room Info */}
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <h3 className="arc-heading-md" style={{ marginBottom: 8, fontSize: "0.6rem" }}>
                            {isMenu ? "Arcade Edition" : `${room!.title} Room`}
                        </h3>
                        <p className="arc-body" style={{ fontSize: "0.9rem", margin: 0 }}>
                            {isMenu
                                ? "10 ruangan interaktif dalam satu hadiah digital - dari musik hingga pesan penutup yang menyentuh hati."
                                : room!.description}
                        </p>
                    </div>

                    {/* Next */}
                    <button
                        onClick={next}
                        aria-label="Next Room"
                        style={{
                            flexShrink: 0,
                            width: 44, height: 44,
                            borderRadius: "50%",
                            border: "1.5px solid var(--arc-border-gold)",
                            background: "var(--arc-surface-raised)",
                            color: "var(--arc-text-primary)",
                            cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.25s ease",
                            boxShadow: "var(--arc-shadow-soft)",
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = "var(--arc-accent)";
                            (e.currentTarget as HTMLElement).style.color = "#fff";
                            (e.currentTarget as HTMLElement).style.borderColor = "var(--arc-accent)";
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = "var(--arc-surface-raised)";
                            (e.currentTarget as HTMLElement).style.color = "var(--arc-text-primary)";
                            (e.currentTarget as HTMLElement).style.borderColor = "var(--arc-border-gold)";
                        }}
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Dot Navigation */}
                <div style={{
                    marginTop: 20,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 8,
                }}>
                    {Array.from({ length: 11 }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            title={i === 0 ? "Main Menu" : ARCADE_ROOMS[i - 1].title}
                            style={{
                                width: i === active ? 24 : 8,
                                height: 8,
                                borderRadius: 999,
                                border: "none",
                                background: i === active
                                    ? "var(--arc-accent)"
                                    : i === 0 && active !== 0
                                        ? "var(--arc-accent-warm)"
                                        : "var(--arc-border-gold)",
                                cursor: "pointer",
                                padding: 0,
                                transition: "all 0.3s ease",
                                opacity: i === 0 && active !== 0 ? 0.6 : 1,
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   ARCADE LANDING PAGE
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
/* ─────────────────────────────────────────────
   Arcade Testimoni Carousel
   ───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   Arcade Studio Preview Section
   ───────────────────────────────────────────── */
function ArcadeStudioPreview() {
    const videoRef = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.load();
                    video.play().catch(() => { });
                } else {
                    video.pause();
                }
            },
            { threshold: 0.2 }
        );
        observer.observe(video);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="arc-section" style={{ background: "var(--arc-bg-warm)", position: "relative", overflow: "hidden" }}>
            {/* Ambient blob */}
            <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "min(500px,70vw)", height: "min(500px,70vw)", borderRadius: "50%", background: "rgba(166,124,82,0.06)", filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }} />

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px,4vw,24px)", position: "relative", zIndex: 1 }}>

                {/* Header */}
                <AnimatedSection>
                    <div style={{ textAlign: "center", marginBottom: 56 }}>
                        <div className="arc-badge" style={{ marginBottom: 24 }}>
                            Studio Editor
                        </div>
                        <h2 className="arc-heading-lg">
                            Kamu yang Buat Sendiri.
                            <br />
                            <span className="arc-italic" style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)" }}>
                                Semudah Ini.
                            </span>
                        </h2>
                        <p className="arc-body" style={{ maxWidth: 520, margin: "16px auto 0", fontSize: "0.95rem" }}>
                            Tidak perlu skill coding. Tidak perlu nunggu admin. Isi sendiri, publish sendiri, kirim sendiri — dalam hitungan menit.
                        </p>
                    </div>
                </AnimatedSection>

                {/* Video Preview */}
                <AnimatedSection delay={150}>
                    <div style={{
                        maxWidth: 960,
                        margin: "0 auto 48px",
                        borderRadius: "var(--arc-radius-lg)",
                        overflow: "hidden",
                        border: "1.5px solid var(--arc-border-gold)",
                        boxShadow: "var(--arc-shadow-elevated)",
                        background: "var(--arc-bg-mid)",
                        aspectRatio: "2/1",
                    }}>
                        <video
                            ref={videoRef}
                            autoPlay
                            loop
                            muted
                            playsInline
                            x-webkit-airplay="deny"
                            disablePictureInPicture
                            controlsList="nodownload nofullscreen noremoteplayback"
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
                        >
                            <source src="https://cdn.for-you-always.my.id/1773611293880-nh6g6w.mp4" type="video/mp4" />
                        </video>
                    </div>
                </AnimatedSection>

                {/* Feature pills */}
                <AnimatedSection delay={250}>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
                        {[
                            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>, text: "Tidak perlu skill coding" },
                            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>, text: "Selesai dalam menit" },
                            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>, text: "Privat & aman" },
                            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>, text: "Preview sebelum kirim" },
                            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636A9 9 0 1 1 5.636 18.364 9 9 0 0 1 18.364 5.636M9 9h6M9 12h6M9 15h4" /></svg>, text: "Nonaktifkan room sesuka hati" },
                            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>, text: "Revisi bebas setelah publish" },
                        ].map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "10px 18px",
                                    borderRadius: 999,
                                    background: "var(--arc-surface-raised)",
                                    border: "1.5px solid var(--arc-border-gold)",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "var(--arc-text-secondary)",
                                    boxShadow: "var(--arc-shadow-soft)",
                                }}
                            >
                                <span style={{ color: "var(--arc-accent)", flexShrink: 0 }}>{item.icon}</span>
                                {item.text}
                            </div>
                        ))}
                    </div>
                </AnimatedSection>

            </div>
        </section>
    );
}

const ARCADE_TESTIMONI = [
    {
        quote: "Lucuu banget, gemes deh! Makasih banyak ya kak, hasilnya melebihi ekspektasi aku ♡",
        name: "Nabila",
        label: "Untuk Pacarnya",
        initial: "N",
    },
    {
        quote: "Makasih ya kak! Cowo aku terharu banget sama surprise aku, dia sama sekali ga expect bakal disurprise kayak gini 🤲🥹",
        name: "Arini",
        label: "Untuk Pacarnya",
        initial: "A",
    },
    {
        quote: "Huhuu makasih kak, lucuu banget hasilnya! Next time aku pasti bakal order di sini lagi pokoknya!",
        name: "Rara",
        label: "Untuk Sahabatnya",
        initial: "R",
    },
];

function ArcadeTestimoniCarousel() {
    const [active, setActive] = useState(0);
    const [fading, setFading] = useState(false);
    const total = ARCADE_TESTIMONI.length;

    const goTo = (idx: number) => {
        if (idx === active || fading) return;
        setFading(true);
        setTimeout(() => { setActive(idx); setFading(false); }, 250);
    };
    const prev = () => goTo((active - 1 + total) % total);
    const next = () => goTo((active + 1) % total);
    const t = ARCADE_TESTIMONI[active];

    return (
        <section className="arc-section" style={{ background: "var(--arc-section-alt)", position: "relative", overflow: "hidden" }}>
            {/* Ambient blob */}
            <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "min(400px,60vw)", height: "min(400px,60vw)", borderRadius: "50%", background: "rgba(196,132,138,0.06)", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px,4vw,24px)", position: "relative", zIndex: 1 }}>

                {/* Header */}
                <AnimatedSection>
                    <div style={{ textAlign: "center", marginBottom: 48 }}>
                        <div className="arc-badge" style={{ marginBottom: 28 }}>
                            100+ Happy Customers
                        </div>
                        <h2 className="arc-heading-lg">
                            Mereka Sudah Merasakan.
                            <br />
                            <span className="arc-italic" style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)" }}>
                                Giliranmu Selanjutnya.
                            </span>
                        </h2>
                    </div>
                </AnimatedSection>

                {/* Social proof bar */}
                <AnimatedSection delay={100}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 56, flexWrap: "wrap" }}>
                        {[
                            { icon: <span style={{ color: "var(--arc-gold)", fontSize: 14, letterSpacing: 2 }}>★★★★★</span>, text: "5.0 Rating" },
                            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--arc-rose)" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>, text: "100+ Customer Puas" },
                            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--arc-sage)" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>, text: "Trusted Since 2025" },
                        ].map((item, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--arc-border-gold)", flexShrink: 0 }} />}
                                <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--arc-font-pixel)", fontSize: "0.38rem", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--arc-text-muted)" }}>
                                    {item.icon}{item.text}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </AnimatedSection>

                {/* Carousel */}
                <AnimatedSection delay={200}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, maxWidth: 640, margin: "0 auto" }}>

                        {/* Prev */}
                        <button
                            onClick={prev}
                            aria-label="Previous"
                            style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--arc-border-gold)", background: "var(--arc-surface-raised)", color: "var(--arc-text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s ease", boxShadow: "var(--arc-shadow-soft)" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--arc-accent)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--arc-surface-raised)"; (e.currentTarget as HTMLElement).style.color = "var(--arc-text-primary)"; }}
                        >
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        {/* Card */}
                        <div
                            style={{ flex: 1, background: "var(--arc-surface-raised)", border: "1.5px solid var(--arc-border-gold)", borderRadius: "var(--arc-radius-lg)", overflow: "hidden", boxShadow: "var(--arc-shadow-soft)", transition: "opacity 0.25s ease", opacity: fading ? 0 : 1 }}
                        >
                            <div style={{ padding: "36px 32px 32px" }}>
                                {/* Quote mark — pixel font flavour */}
                                <div style={{ fontFamily: "var(--arc-font-display)", fontSize: 64, lineHeight: 1, color: "var(--arc-rose-light)", opacity: 0.4, marginBottom: 8, userSelect: "none" as const }}>
                                    &ldquo;
                                </div>
                                <p style={{ fontFamily: "var(--arc-font-display)", fontStyle: "italic", fontSize: "1.15rem", color: "var(--arc-text-secondary)", lineHeight: 1.75, marginBottom: 32 }}>
                                    {t.quote}
                                </p>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        {/* Avatar */}
                                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--arc-accent-glow)", border: "1.5px solid var(--arc-border-gold)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--arc-font-display)", fontStyle: "italic", fontSize: 16, fontWeight: 600, color: "var(--arc-accent)", flexShrink: 0 }}>
                                            {t.initial}
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: "var(--arc-font-display)", fontStyle: "italic", fontSize: 15, fontWeight: 600, color: "var(--arc-text-primary)", marginBottom: 2 }}>
                                                {t.name}
                                            </div>
                                            <div style={{ fontFamily: "var(--arc-font-pixel)", fontSize: "0.38rem", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--arc-rose)" }}>
                                                {t.label}
                                            </div>
                                        </div>
                                    </div>
                                    <span style={{ fontFamily: "var(--arc-font-pixel)", fontSize: "0.38rem", letterSpacing: "0.1em", color: "var(--arc-text-muted)" }}>
                                        {active + 1} / {total}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Next */}
                        <button
                            onClick={next}
                            aria-label="Next"
                            style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--arc-border-gold)", background: "var(--arc-surface-raised)", color: "var(--arc-text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s ease", boxShadow: "var(--arc-shadow-soft)" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--arc-accent)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--arc-surface-raised)"; (e.currentTarget as HTMLElement).style.color = "var(--arc-text-primary)"; }}
                        >
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>

                    {/* Dot nav */}
                    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
                        {ARCADE_TESTIMONI.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                style={{ width: i === active ? 24 : 8, height: 8, borderRadius: 999, border: "none", background: i === active ? "var(--arc-accent)" : "var(--arc-border-gold)", cursor: "pointer", padding: 0, transition: "all 0.3s ease" }}
                            />
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}

export default function ArcadeLandingPage() {
    return (
        <div className="arcade-page">
            {/* â”€â”€ Atmospheric Layer â”€â”€ */}
            <div className="arcade-clouds">
                <div className="cloud cloud-1" />
                <div className="cloud cloud-2" />
                <div className="cloud cloud-3" />
            </div>

            {/* â”€â”€ Navbar â”€â”€ */}


            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          HERO SECTION
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <section
                style={{
                    position: "relative",
                    paddingTop: 160,
                    paddingBottom: 80,
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: 900,
                        margin: "0 auto",
                        padding: "0 24px",
                        textAlign: "center",
                    }}
                >
                    {/* Badge */}
                    <AnimatedSection>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
                            <div className="arc-badge">
                                <span
                                    style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: "50%",
                                        background: "var(--arc-rose)",
                                        animation: "arc-pulse 2s infinite",
                                        display: "inline-block",
                                    }}
                                />
                                Arcade Edition
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Heading */}
                    <AnimatedSection delay={100}>
                        <div
                            className="wood-sign"
                            style={{
                                display: "inline-block",
                                padding: "32px 48px",
                                marginBottom: 32,
                            }}
                        >
                            <h1 className="arc-heading-xl" style={{ margin: 0 }}>
                                Sepuluh Ruang.
                                <br />
                                <span className="arc-italic" style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)" }}>
                                    Satu Kenangan Penuh.
                                </span>
                            </h1>
                        </div>
                    </AnimatedSection>

                    {/* Description */}
                    <AnimatedSection delay={200}>
                        <p
                            className="arc-body"
                            style={{
                                fontSize: "1.05rem",
                                maxWidth: 560,
                                margin: "0 auto 40px",
                                color: "var(--arc-text-secondary)",
                            }}
                        >
                            Kado digital interaktif dengan 10 mini-experience unik - dari Quiz,
                            Journey, Atlas, hingga Star Catcher. Setiap ruang menyimpan{" "}
                            <strong style={{ color: "var(--arc-accent-warm)", fontWeight: 700 }}>
                                kejutan yang tak terlupakan.
                            </strong>
                        </p>
                    </AnimatedSection>

                    {/* CTA Buttons */}
                    <AnimatedSection delay={300}>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 16,
                                justifyContent: "center",
                            }}
                        >
                            <a href="#pesan" className="arc-btn-primary">
                                <span>Pesan Sekarang</span>
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                            <a href="#rooms" className="arc-btn-secondary">
                                Jelajahi 10 Ruang
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </a>
                        </div>
                    </AnimatedSection>

                    {/* Floating Room Preview */}
                    <AnimatedSection delay={500}>
                        <div
                            style={{
                                marginTop: 64,
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                gap: 16,
                            }}
                        >
                            {ARCADE_ROOMS.map((room, i) => (
                                <div
                                    key={room.title}
                                    className="arc-float"
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 8,
                                        animationDelay: `${i * 0.3}s`,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 16,
                                            background: "var(--arc-surface)",
                                            border: "1.5px solid var(--arc-border-gold)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "var(--arc-accent)",
                                            boxShadow: "var(--arc-shadow-soft)",
                                        }}
                                    >
                                        {RoomIcons[room.title]}
                                    </div>
                                    <span
                                        className="arc-label"
                                        style={{ fontSize: "0.4rem", color: "var(--arc-text-muted)" }}
                                    >
                                        {room.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          10 ROOMS SHOWCASE - Cinematic Slideshow
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <RoomShowcase />

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          CARA KERJA
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <section id="cara-kerja" className="arc-section">
                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
                    <AnimatedSection>
                        <div style={{ textAlign: "center", marginBottom: 64 }}>
                            <div className="arc-badge" style={{ marginBottom: 28 }}>
                                Cara Kerja
                            </div>
                            <h2 className="arc-heading-lg">
                                Semudah{" "}
                                <span className="arc-italic" style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)" }}>
                                    Tiga Langkah.
                                </span>
                            </h2>
                        </div>
                    </AnimatedSection>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: 24,
                        }}
                    >
                        {/* Step 1 */}
                        <AnimatedSection delay={100}>
                            <div className="arc-step-card">
                                <div
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 8,
                                        padding: "6px 16px",
                                        background: "var(--arc-accent-glow)",
                                        borderRadius: 999,
                                        border: "2px solid var(--arc-border-gold)",
                                        marginBottom: 24,
                                    }}
                                >
                                    <span className="arc-label" style={{ margin: 0 }}>Step</span>
                                    <span
                                        style={{
                                            fontFamily: "var(--arc-font-pixel)",
                                            fontSize: "0.55rem",
                                            color: "var(--arc-text-primary)",
                                        }}
                                    >
                                        01
                                    </span>
                                </div>
                                <div className="arc-step-icon" style={{ marginBottom: 20 }}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                        <path d="M8 10h8M8 13h5" opacity="0.6" />
                                    </svg>
                                </div>
                                <h3 className="arc-heading-md" style={{ marginBottom: 12 }}>
                                    Pesan & Dapat Akses
                                </h3>
                                <p className="arc-body" style={{ fontSize: "0.9rem" }}>
                                    Hubungi via WhatsApp, pilih paket yang sesuai, dan dapatkan link studio editor eksklusif milikmu.
                                </p>
                            </div>
                        </AnimatedSection>

                        {/* Step 2 */}
                        <AnimatedSection delay={200}>
                            <div className="arc-step-card">
                                <div
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 8,
                                        padding: "6px 16px",
                                        background: "var(--arc-accent-glow)",
                                        borderRadius: 999,
                                        border: "2px solid var(--arc-border-gold)",
                                        marginBottom: 24,
                                    }}
                                >
                                    <span className="arc-label" style={{ margin: 0 }}>Step</span>
                                    <span
                                        style={{
                                            fontFamily: "var(--arc-font-pixel)",
                                            fontSize: "0.55rem",
                                            color: "var(--arc-text-primary)",
                                        }}
                                    >
                                        02
                                    </span>
                                </div>
                                <div className="arc-step-icon" style={{ marginBottom: 20 }}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                                    </svg>
                                </div>
                                <h3 className="arc-heading-md" style={{ marginBottom: 12 }}>
                                    Kustomisasi Sendiri
                                </h3>
                                <p className="arc-body" style={{ fontSize: "0.9rem" }}>
                                    Isi semua 10 ruangan sesuai keinginanmu - foto, musik, pesan, quiz, dan lainnya. Privat, bebas, sepenuhnya milikmu.
                                </p>
                            </div>
                        </AnimatedSection>

                        {/* Step 3 */}
                        <AnimatedSection delay={300}>
                            <div className="arc-step-card">
                                <div
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 8,
                                        padding: "6px 16px",
                                        background: "var(--arc-accent-glow)",
                                        borderRadius: 999,
                                        border: "2px solid var(--arc-border-gold)",
                                        marginBottom: 24,
                                    }}
                                >
                                    <span className="arc-label" style={{ margin: 0 }}>Step</span>
                                    <span
                                        style={{
                                            fontFamily: "var(--arc-font-pixel)",
                                            fontSize: "0.55rem",
                                            color: "var(--arc-text-primary)",
                                        }}
                                    >
                                        03
                                    </span>
                                </div>
                                <div className="arc-step-icon" style={{ marginBottom: 20 }}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 12v10H4V12" />
                                        <path d="M22 7H2v5h20V7z" />
                                        <path d="M12 22V7" />
                                        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                                        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                                    </svg>
                                </div>
                                <h3 className="arc-heading-md" style={{ marginBottom: 12 }}>
                                    Publish & Kejutkan
                                </h3>
                                <p className="arc-body" style={{ fontSize: "0.9rem" }}>
                                    Setelah selesai, publish dengan satu klik` - `lalu kirim link Arcade ke orang tersayang dan biarkan mereka terkejut.
                                </p>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          STUDIO PREVIEW (HIDDEN TEMP)
         ══════════════════════════════════════ */}
            {/* <ArcadeStudioPreview /> */}

            {/* ══════════════════════════════════════
          TESTIMONI
         ══════════════════════════════════════ */}
            <ArcadeTestimoniCarousel />


            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          PRICING & CTA
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <section id="pesan" className="arc-section arc-dark-section">
                <div
                    style={{
                        maxWidth: 1100,
                        margin: "0 auto",
                        padding: "0 24px",
                        position: "relative",
                        zIndex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 40,
                    }}
                >
                    {/* Decorative pixel stars */}
                    <div className="pixel-star" style={{ top: "10%", left: "15%", animationDelay: "0s" }} />
                    <div className="pixel-star" style={{ top: "20%", right: "20%", animationDelay: "0.7s" }} />
                    <div className="pixel-star" style={{ top: "60%", left: "10%", animationDelay: "1.4s" }} />
                    <div className="pixel-star" style={{ top: "70%", right: "12%", animationDelay: "2.1s" }} />
                    <div className="pixel-star" style={{ top: "40%", left: "25%", animationDelay: "0.5s" }} />

                    <AnimatedSection>
                        <div className="arc-badge" style={{ marginBottom: 36 }}>
                            Harga Spesial
                        </div>
                    </AnimatedSection>

                    <AnimatedSection delay={100}>
                        <h2 style={{ fontFamily: "var(--arc-font-display)", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 400, color: "var(--arc-text-heading)", lineHeight: 1.15, marginBottom: 20, textAlign: "center" }}>
                            Satu Hadiah.
                            <br />
                            <span style={{ fontStyle: "italic", color: "var(--arc-accent)" }}>
                                Satu Juta Makna.
                            </span>
                        </h2>
                    </AnimatedSection>

                    <AnimatedSection delay={200}>
                        <p style={{ fontSize: "1.05rem", color: "var(--arc-text-secondary)", opacity: 0.8, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 48px", textAlign: "center" }}>
                            Cukup satu kali investasi untuk kebahagiaan yang tak lekang oleh waktu. Tanpa langganan. Akses selamanya.
                        </p>
                    </AnimatedSection>

                    <AnimatedSection delay={200}>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
                            gap: 20,
                            maxWidth: 720,
                            margin: "0 auto",
                            width: "100%",
                        }}>

                            {/* ── Arcade Regular Card ── */}
                            <div style={{
                                padding: "36px 28px",
                                background: "var(--arc-surface-raised)",
                                border: "1.5px solid var(--arc-border-subtle)",
                                borderRadius: "var(--arc-radius-lg)",
                                backdropFilter: "blur(16px)",
                                display: "flex",
                                flexDirection: "column",
                                boxShadow: "var(--arc-shadow-soft)"
                            }}>
                                <div style={{ fontFamily: "var(--arc-font-display)", fontStyle: "italic", fontSize: 17, color: "var(--arc-accent)", marginBottom: 10 }}>
                                    Arcade Regular
                                </div>
                                <div style={{ marginBottom: 20 }}>
                                    <span style={{ fontFamily: "var(--arc-font-pixel)", fontSize: "clamp(1.2rem,4vw,1.8rem)", color: "var(--arc-text-primary)" }}>Rp 20.000</span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 28, flex: 1 }}>
                                    {["10 Ruangan Interaktif", "Bebas Kustomisasi & Privasi", "Opsi Nonaktifkan Ruangan", "Link standar (untuk dikirim)", "Lifetime Access"].map((f) => (
                                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--arc-text-secondary)", fontWeight: 500, lineHeight: 1.4 }}>
                                            <div style={{ width: 18, height: 18, borderRadius: 6, background: "var(--arc-accent-glow)", border: "1.5px solid var(--arc-border-subtle)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--arc-accent)" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            {f}
                                        </div>
                                    ))}
                                </div>
                                <a
                                    href="https://wa.me/6281381543981?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Arcade%20Edition%20(Regular)*%20seharga%20Rp%2020.000.%0A%0AMohon%20info%20langkah%20selanjutnya%20ya.%20Terima%20kasih!"
                                    target="_blank" rel="noopener noreferrer"
                                    className="arc-btn-secondary"
                                    style={{ width: "100%", justifyContent: "center", padding: "15px 0", textAlign: "center" }}
                                >
                                    Pesan Sekarang
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </a>
                            </div>

                            {/* ── Arcade Premium Card (Featured) ── */}
                            <div style={{
                                padding: "36px 28px",
                                background: "var(--arc-surface-raised)",
                                border: "1.5px solid var(--arc-accent)",
                                borderRadius: "var(--arc-radius-lg)",
                                backdropFilter: "blur(16px)",
                                display: "flex",
                                flexDirection: "column",
                                position: "relative" as const,
                                boxShadow: "var(--arc-shadow-elevated)"
                            }}>
                                {/* Featured badge */}
                                <div style={{ position: "absolute" as const, top: -14, left: "50%", transform: "translateX(-50%)", background: "var(--arc-accent)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 16px", borderRadius: 999, letterSpacing: "0.1em", textTransform: "uppercase" as const, whiteSpace: "nowrap" as const }}>
                                    ✦ Lebih Eksklusif
                                </div>
                                <div style={{ fontFamily: "var(--arc-font-display)", fontStyle: "italic", fontSize: 17, color: "var(--arc-accent)", marginBottom: 10 }}>
                                    Arcade Premium
                                </div>
                                <div style={{ marginBottom: 20 }}>
                                    <span style={{ fontFamily: "var(--arc-font-pixel)", fontSize: "clamp(1.2rem,4vw,1.8rem)", color: "var(--arc-text-primary)" }}>Rp 25.000</span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 28, flex: 1 }}>
                                    {["10 Ruangan Interaktif", "Bebas Kustomisasi & Privasi", "Opsi Nonaktifkan Ruangan", "Link khusus", "Lifetime Access"].map((f) => (
                                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--arc-text-secondary)", fontWeight: 500, lineHeight: 1.4 }}>
                                            <div style={{ width: 18, height: 18, borderRadius: 6, background: "var(--arc-accent-glow)", border: "1.5px solid var(--arc-border-subtle)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--arc-accent)" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            {f}
                                        </div>
                                    ))}
                                </div>
                                <a
                                    href="https://wa.me/6281381543981?text=Halo%20Digital%20Atelier!%20Saya%20tertarik%20untuk%20memesan%20*Arcade%20Edition%20(Premium)*%20seharga%20Rp%2025.000.%0A%0AMohon%20info%20langkah%20selanjutnya%20ya.%20Terima%20kasih!"
                                    target="_blank" rel="noopener noreferrer"
                                    className="arc-btn-primary"
                                    style={{ width: "100%", justifyContent: "center", padding: "15px 0", textAlign: "center" }}
                                >
                                    Pesan Sekarang
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </a>
                            </div>

                        </div>
                    </AnimatedSection>

                    {/* Trust badges */}
                    <AnimatedSection delay={400}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 20,
                                flexWrap: "wrap",
                            }}
                        >
                            {["SECURE PAYMENT", "PASSWORD PROTECTED", "LIFETIME ACCESS"].map((badge) => (
                                <span
                                    key={badge}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        fontFamily: "var(--arc-font-pixel)",
                                        fontSize: "0.35rem",
                                        letterSpacing: "0.12em",
                                        color: "var(--arc-text-muted)",
                                        opacity: 0.5,
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 5,
                                            height: 5,
                                            borderRadius: 2,
                                            background: "rgba(196,154,60,0.45)",
                                        }}
                                    />
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          FOOTER
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <footer
                style={{
                    padding: "48px 24px",
                    background: "var(--arc-footer-bg)",
                    textAlign: "center",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <a
                    href="/"
                    style={{
                        display: "inline-flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                        textDecoration: "none",
                        marginBottom: 20,
                    }}
                >
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            overflow: "hidden",
                            border: "2px solid var(--arc-border-gold)",
                        }}
                    >
                        <img
                            src="/logo.png"
                            alt="Logo"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                    <span
                        style={{
                            fontFamily: "var(--arc-font-display)",
                            fontStyle: "italic",
                            fontWeight: 600,
                            fontSize: 15,
                            color: "var(--arc-text-light)",
                            textShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        }}
                    >
                        For you, Always.
                    </span>
                </a>

                <p
                    style={{
                        fontFamily: "var(--arc-font-pixel)",
                        fontSize: "0.35rem",
                        color: "rgba(255,248,231,0.4)",
                        fontWeight: 400,
                        letterSpacing: "0.08em",
                    }}
                >
                    Â© 2026 For you, Always. - Preserving Memories Digitally
                </p>
            </footer>

            {/* â”€â”€ Floating WhatsApp Button â”€â”€ */}
            <a
                href="https://wa.me/6281381543981?text=Halo%20Digital%20Atelier!%20Saya%20ingin%20bertanya%20tentang%20Arcade%20Edition."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hubungi via WhatsApp"
                style={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    zIndex: 50,
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: "linear-gradient(135deg, var(--arc-accent-warm) 0%, var(--arc-bg-wood-dark) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "var(--arc-shadow-wood), 0 3px 0 var(--arc-bg-wood-dark)",
                    border: "1.5px solid var(--arc-accent)",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                }}
            >
                <svg width="26" height="26" fill="white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </a>
        </div>
    );
}