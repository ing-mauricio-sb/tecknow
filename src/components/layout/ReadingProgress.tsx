"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";

export function ReadingProgress() {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 right-0 left-0 z-[60] h-[3px]">
      <div
        className="h-full bg-[var(--color-accent)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
