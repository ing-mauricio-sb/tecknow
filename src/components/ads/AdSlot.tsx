"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AdSlotProps {
  format?: "auto" | "rectangle" | "horizontal" | "fluid";
  className?: string;
}

export function AdSlot({ format = "auto", className }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (isDev || initialized.current || !adRef.current || !adsenseId) return;
    try {
      ((window as unknown as Record<string, unknown[]>).adsbygoogle =
        (window as unknown as Record<string, unknown[]>).adsbygoogle || []).push(
        {}
      );
      initialized.current = true;
    } catch {
      // AdSense blocked or not loaded
    }
  }, [isDev, adsenseId]);

  return (
    <div
      className={cn(
        "glass-subtle mx-auto my-6 max-w-[740px] rounded-lg p-2 text-center",
        className
      )}
      role="complementary"
      aria-label="Publicidad"
    >
      <span className="mb-1 block font-[family-name:var(--font-ui)] text-[10px] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
        Publicidad
      </span>
      {isDev || !adsenseId ? (
        <div className="flex min-h-[90px] items-center justify-center rounded border border-dashed border-[var(--color-border-hover)] text-xs text-[var(--color-text-muted)]">
          Ad Placeholder
        </div>
      ) : (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adsenseId}
          data-ad-slot=""
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
