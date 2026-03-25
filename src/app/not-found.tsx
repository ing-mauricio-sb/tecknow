import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 font-[family-name:var(--font-mono)] text-8xl font-bold text-[var(--color-accent)]/20">
        404
      </div>
      <h1 className="mb-2 font-[family-name:var(--font-display)] text-2xl font-bold">
        Pagina no encontrada
      </h1>
      <p className="mb-8 max-w-md font-[family-name:var(--font-ui)] text-sm text-[var(--color-text-muted)]">
        La pagina que buscas no existe o fue movida. Pero no te preocupes, hay
        mucho mas por descubrir en TECKNOW.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 py-2.5 font-[family-name:var(--font-ui)] text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-light)]"
        >
          <ArrowLeft size={14} />
          Volver al inicio
        </Link>
        <button className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-5 py-2.5 font-[family-name:var(--font-ui)] text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)]">
          <Search size={14} />
          Buscar
        </button>
      </div>
    </div>
  );
}
