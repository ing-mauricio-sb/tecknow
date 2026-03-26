"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, Menu } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { NavbarMobileDrawer } from "./NavbarMobileDrawer";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-white/[0.06] bg-[var(--color-bg-primary)]/70 backdrop-blur-2xl"
            : "bg-transparent"
        )}
        style={{ animationDelay: "0ms" }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5 group">
            <span className="font-[family-name:var(--font-mono)] text-lg font-bold text-[var(--color-text-primary)] transition-colors">
              TEC
            </span>
            <span className="text-xl font-bold text-[var(--color-accent)] transition-transform duration-200 group-hover:scale-110">
              K
            </span>
            <span className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text-primary)]">
              NOW
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 font-[family-name:var(--font-ui)] text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/buscar"
              className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
              aria-label="Buscar"
            >
              <Search size={18} />
            </Link>
            <button
              className="hidden rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)] sm:block"
              aria-label="Notificaciones"
            >
              <Bell size={18} />
            </button>
            <Link
              href="#newsletter"
              className="hidden rounded-md bg-[var(--color-accent)] px-4 py-2 font-[family-name:var(--font-ui)] text-sm font-semibold text-white transition-all hover:bg-[var(--color-accent-light)] hover:shadow-lg hover:shadow-[var(--color-accent)]/20 sm:block"
            >
              Suscribirse
            </Link>
            <button
              className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)] lg:hidden"
              onClick={() => setDrawerOpen(true)}
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      <NavbarMobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
