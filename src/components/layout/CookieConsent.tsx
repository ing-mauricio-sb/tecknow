"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const consent = localStorage.getItem("tk-cookie-consent");
    if (consent === null) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem("tk-cookie-consent", "accepted");
    setShow(false);
    window.location.reload();
  }

  function reject() {
    localStorage.setItem("tk-cookie-consent", "rejected");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="animate-fade-up fixed right-0 bottom-0 left-0 z-[100] border-t border-white/[0.08] bg-[var(--color-bg-surface)]/95 px-4 py-5 backdrop-blur-xl sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Cookie
            size={20}
            className="mt-0.5 shrink-0 text-[var(--color-accent-text)]"
          />
          <div>
            <p className="font-[family-name:var(--font-ui)] text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Usamos cookies y tecnologias similares para mostrar anuncios
              personalizados (Google AdSense) y analizar el trafico del sitio.
              Al aceptar, consientes el uso de cookies.{" "}
              <Link
                href="/privacidad"
                className="text-[var(--color-accent-text)] underline underline-offset-2"
              >
                Politica de Privacidad
              </Link>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={reject}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 font-[family-name:var(--font-ui)] text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)]"
          >
            Rechazar
          </button>
          <button
            onClick={accept}
            className="rounded-lg bg-[var(--color-accent)] px-4 py-2 font-[family-name:var(--font-ui)] text-xs font-semibold text-white transition-all hover:bg-[var(--color-accent-light)]"
          >
            Aceptar cookies
          </button>
        </div>
      </div>
    </div>
  );
}
