"use client";

import { useEffect, useRef } from "react";

export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!element) return;
          const rect = element.getBoundingClientRect();
          const scrolled = window.innerHeight - rect.top;
          const offset = scrolled * speed * 0.15;
          element.style.transform = `translate3d(0, ${offset}px, 0)`;
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return ref;
}
