"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { cn } from "@/lib/utils";

interface NavbarMobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function NavbarMobileDrawer({ open, onClose }: NavbarMobileDrawerProps) {
  useLockBodyScroll(open);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-72 bg-[var(--color-bg-surface)] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--color-border)] px-4">
          <span className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-text-muted)]">
            Menu
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated)]"
            aria-label="Cerrar menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="rounded-lg px-3 py-3 font-[family-name:var(--font-ui)] text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-4 px-4">
          <Link
            href="#newsletter"
            onClick={onClose}
            className="block w-full rounded-md bg-[var(--color-accent)] py-3 text-center font-[family-name:var(--font-ui)] text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-light)]"
          >
            Suscribirse
          </Link>
        </div>
      </div>
    </>
  );
}
