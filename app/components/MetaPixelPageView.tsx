"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackMetaEvent } from "@/lib/pixel";

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
      trackMetaEvent("PageView");
    }
  }, [pathname]);

  return null;
}
