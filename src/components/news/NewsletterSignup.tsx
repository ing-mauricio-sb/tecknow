"use client";

import { useState } from "react";
import { Mail, ArrowRight, Check, AlertCircle } from "lucide-react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="newsletter"
      className="mx-auto max-w-7xl px-4 py-16 lg:px-8"
    >
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[#4C1D95] p-6 sm:p-8 md:p-12">
        <div className="flex flex-col items-center text-center md:flex-row md:text-left">
          <div className="flex-1">
            <Mail
              size={32}
              className="mb-4 text-white/70 md:mb-0"
              aria-hidden="true"
            />
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Tu cron job de informacion.
            </h2>
            <p className="mt-2 font-[family-name:var(--font-body)] text-sm text-white/80 sm:text-base md:text-lg">
              La tech que ya deberias saber, cada semana en tu inbox.
            </p>
          </div>

          <div className="mt-6 w-full max-w-md md:mt-0 md:ml-8">
            {status === "success" ? (
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-6 py-4 backdrop-blur-sm">
                <Check size={20} className="shrink-0 text-green-300" />
                <span className="font-[family-name:var(--font-ui)] text-sm text-white">
                  Suscrito. Recibiras noticias en tu correo.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3 font-[family-name:var(--font-ui)] text-sm text-white placeholder-white/50 backdrop-blur-sm outline-none transition-all focus:border-white/40 focus:ring-2 focus:ring-white/20"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 font-[family-name:var(--font-ui)] text-sm font-semibold text-[var(--color-accent)] transition-transform hover:scale-105 active:scale-95 disabled:opacity-70 sm:w-auto"
                >
                  {status === "loading" ? "Enviando..." : "Suscribirse"}
                  {status !== "loading" && <ArrowRight size={14} />}
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="mt-2 flex items-center gap-1 font-[family-name:var(--font-ui)] text-xs text-red-300">
                <AlertCircle size={12} /> Error al suscribirse. Intenta de nuevo.
              </p>
            )}
            <p className="mt-3 font-[family-name:var(--font-ui)] text-xs text-white/50">
              Sin spam. Cancelar cuando quieras.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
