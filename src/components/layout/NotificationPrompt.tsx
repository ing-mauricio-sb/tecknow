"use client";

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";

export function NotificationPrompt() {
  const [show, setShow] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    if (Notification.permission === "granted") return;
    if (localStorage.getItem("tk-push-dismissed")) return;

    // Show after 10 seconds of browsing
    const timer = setTimeout(() => setShow(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  async function handleSubscribe() {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        dismiss();
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });

      setSubscribed(true);
      setTimeout(() => setShow(false), 2000);
    } catch (err) {
      console.error("Push subscribe failed:", err);
      dismiss();
    }
  }

  function dismiss() {
    localStorage.setItem("tk-push-dismissed", "true");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="animate-fade-up fixed right-4 bottom-4 z-40 max-w-sm rounded-2xl border border-white/[0.08] bg-[var(--color-bg-surface)]/95 p-4 shadow-2xl backdrop-blur-xl lg:right-8 lg:bottom-8">
      {subscribed ? (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <Bell size={18} className="text-emerald-400" />
          </div>
          <p className="font-[family-name:var(--font-ui)] text-sm text-emerald-400">
            Notificaciones activadas
          </p>
        </div>
      ) : (
        <>
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 rounded-lg p-1 text-[var(--color-text-muted)] transition-colors hover:bg-white/5"
            aria-label="Cerrar"
          >
            <X size={14} />
          </button>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]/10">
              <Bell size={18} className="text-[var(--color-accent-text)]" />
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-text-primary)]">
                No te pierdas nada
              </p>
              <p className="mt-0.5 font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)]">
                Recibe notificaciones cuando publiquemos noticias importantes.
              </p>
              <button
                onClick={handleSubscribe}
                className="mt-3 rounded-lg bg-[var(--color-accent)] px-4 py-2 font-[family-name:var(--font-ui)] text-xs font-semibold text-white transition-all hover:bg-[var(--color-accent-light)] hover:shadow-lg hover:shadow-[var(--color-accent)]/20"
              >
                Activar notificaciones
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
