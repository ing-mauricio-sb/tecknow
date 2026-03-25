"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, RefreshCw } from "lucide-react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

export function AdblockWall() {
  const [detected, setDetected] = useState(false);

  useLockBodyScroll(detected);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Create a bait element that ad blockers will hide/remove
    const bait = document.createElement("div");
    bait.className = "ad-banner adsbox ad-placement pub_300x250 textAd";
    bait.style.cssText =
      "position:absolute;top:-1px;left:-1px;width:1px;height:1px;overflow:hidden;";
    bait.innerHTML = "&nbsp;";
    document.body.appendChild(bait);

    const timer = setTimeout(() => {
      const isBlocked =
        !bait ||
        bait.offsetParent === null ||
        bait.offsetHeight === 0 ||
        bait.offsetWidth === 0 ||
        window.getComputedStyle(bait).display === "none" ||
        window.getComputedStyle(bait).visibility === "hidden";

      if (isBlocked) {
        setDetected(true);
      }

      // Cleanup bait
      if (bait.parentNode) bait.parentNode.removeChild(bait);
    }, 1500);

    return () => {
      clearTimeout(timer);
      if (bait.parentNode) bait.parentNode.removeChild(bait);
    };
  }, []);

  if (!detected) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--color-bg-primary)]/95 backdrop-blur-xl">
      <div className="mx-4 max-w-md rounded-2xl border border-white/[0.08] bg-[var(--color-bg-surface)] p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-breaking)]/10">
          <ShieldAlert size={32} className="text-[var(--color-breaking)]" />
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
          Bloqueador de anuncios detectado
        </h2>
        <p className="mt-3 font-[family-name:var(--font-ui)] text-sm leading-relaxed text-[var(--color-text-muted)]">
          TECKNOW es un portal gratuito gracias a la publicidad. Para poder
          acceder al contenido, desactiva tu bloqueador de anuncios y recarga la
          pagina.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-3 font-[family-name:var(--font-ui)] text-sm font-semibold text-white transition-all hover:bg-[var(--color-accent-light)]"
        >
          <RefreshCw size={16} />
          Ya lo desactive — Recargar
        </button>
        <p className="mt-4 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-text-muted)]">
          Si crees que es un error, contactanos en contacto@tecknow.news
        </p>
      </div>
    </div>
  );
}
