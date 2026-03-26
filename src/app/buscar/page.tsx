import { Search } from "lucide-react";
import { searchArticles } from "@/lib/articles";
import { NewsCard } from "@/components/news";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buscar noticias",
  description: "Busca noticias de tecnologia, finanzas y negocios en TECKNOW.",
};

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function BuscarPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const results = query.length >= 2 ? await searchArticles(query) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
        Buscar noticias
      </h1>

      {/* Search form */}
      <form action="/buscar" method="GET" className="mt-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--color-text-muted)]"
            />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Buscar por titulo, tema o etiqueta..."
              autoFocus
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-3.5 pl-11 pr-4 font-[family-name:var(--font-ui)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none transition-all focus:border-[var(--color-accent-text)]/30 focus:shadow-[0_0_20px_var(--color-accent-glow)]"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-[var(--color-accent)] px-6 py-3.5 font-[family-name:var(--font-ui)] text-sm font-semibold text-white transition-all hover:bg-[var(--color-accent-light)]"
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Results */}
      {query && (
        <div className="mt-8">
          <p className="mb-4 font-[family-name:var(--font-ui)] text-sm text-[var(--color-text-muted)]">
            {results.length > 0
              ? `${results.length} resultado(s) para "${query}"`
              : `No se encontraron resultados para "${query}"`}
          </p>
          {results.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((article, i) => (
                <NewsCard key={article.id} article={article} index={i} />
              ))}
            </div>
          )}
        </div>
      )}

      {!query && (
        <p className="mt-12 text-center font-[family-name:var(--font-ui)] text-sm text-[var(--color-text-muted)]">
          Escribe al menos 2 caracteres para buscar.
        </p>
      )}
    </div>
  );
}
