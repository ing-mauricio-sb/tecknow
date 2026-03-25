import type { Metadata } from "next";
import { Mail, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacta al equipo de TECKNOW.NEWS. Estamos disponibles por email y redes sociales.",
};

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">
        Contacto
      </h1>
      <p className="mt-3 font-[family-name:var(--font-body)] text-lg leading-relaxed text-[var(--color-text-secondary)]">
        Tienes preguntas, sugerencias o quieres colaborar? Estamos a tu
        disposicion.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <a
          href="mailto:contacto@tecknow.news"
          className="glass-card flex items-center gap-4 rounded-xl p-5 transition-all hover:-translate-y-1"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]/10">
            <Mail size={22} className="text-[var(--color-accent-text)]" />
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-text-primary)]">
              Email
            </h3>
            <p className="font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)]">
              contacto@tecknow.news
            </p>
          </div>
        </a>

        <a
          href="https://x.com/tecknow"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card flex items-center gap-4 rounded-xl p-5 transition-all hover:-translate-y-1"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-text-primary)]/5">
            <XIcon size={22} />
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-text-primary)]">
              X (Twitter)
            </h3>
            <p className="font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)]">
              @tecknow
            </p>
          </div>
        </a>

        <a
          href="https://linkedin.com/company/tecknow"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card flex items-center gap-4 rounded-xl p-5 transition-all hover:-translate-y-1"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0A66C2]/10">
            <LinkedInIcon size={22} />
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-text-primary)]">
              LinkedIn
            </h3>
            <p className="font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)]">
              TECKNOW
            </p>
          </div>
        </a>

        <div className="glass-card flex items-center gap-4 rounded-xl p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-cat-negocios)]/10">
            <MessageSquare
              size={22}
              className="text-[var(--color-cat-negocios)]"
            />
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-text-primary)]">
              Publicidad
            </h3>
            <p className="font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)]">
              ads@tecknow.news
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
