"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq?: (command: string, event: string) => void;
  }
}

export default function MetaPixelPageView() {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    if (previousPathname.current === null) {
      previousPathname.current = pathname;
      return;
    }

    if (pathname !== previousPathname.current) {
      previousPathname.current = pathname;
      window.fbq?.("track", "PageView");
    }
  }, [pathname]);

  return null;
}
