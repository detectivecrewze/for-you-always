"use client";

import React, { useEffect, useRef, useState } from "react";

type AnimatedSectionProps = {
    children: React.ReactNode;
    delay?: number;
    priority?: boolean;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Lightweight catalog reveal wrapper.
 * Kept separate from LandscapeProductCard so the catalog does not pull the
 * much larger interactive landscape card module into its client bundle.
 */
export function AnimatedSection({
    children,
    delay = 0,
    priority = false,
    className = "",
    style = {},
}: AnimatedSectionProps) {
    const [isVisible, setIsVisible] = useState(priority);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (priority || !ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setTimeout(() => setIsVisible(true), delay);
                observer.disconnect();
            },
            { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [delay, priority]);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                transition: priority ? "none" : `all 0.9s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(36px)",
                ...style,
            }}
        >
            {children}
        </div>
    );
}

