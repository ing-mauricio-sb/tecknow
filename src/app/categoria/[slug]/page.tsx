import { notFound } from "next/navigation";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getArticles, getArticleCount } from "@/lib/articles";
import { getCategoryBySlug } from "@/lib/categories";
import { CATEGORY_CONFIG } from "@/lib/constants";
import { NewsCard } from "@/components/news";
import { AdSlot } from "@/components/ads";
import type { Metadata } from "next";
import type { CategorySlug } from "@/types";

const ARTICLES_PER_PAGE = 12;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug as CategorySlug);

  if (!category) return { title: "Categoria no encontrada" };

  return {
    title: `${category.name} — Noticias de ${category.name}`,
    description: category.description,
    keywords: [`noticias ${category.name.toLowerCase()}`, "tecnologia", "latinoamerica", category.slug],
    alternates: {
      canonical: `https://tecknow.news/categoria/${slug}`,
    },
    openGraph: {
      type: "website",
      title: `${category.name} | TECKNOW`,
      description: category.description,
      url: `https://tecknow.news/categoria/${slug}`,
      images: [{ url: "/og-default.svg", width: 1200, height: 630 }],
    },
  };
}

export const revalidate = 3600;

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const category = await getCategoryBySlug(slug as CategorySlug);

  if (!category) notFound();

  const currentPage = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const offset = (currentPage - 1) * ARTICLES_PER_PAGE;

  const [articles, totalCount] = await Promise.all([
    getArticles({
      category: category.slug,
      limit: ARTICLES_PER_PAGE,
      offset,
    }),
    getArticleCount(category.slug),
  ]);

  const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE);
  const config = CATEGORY_CONFIG[category.slug];
  const IconComponent = LucideIcons[
    config.icon as keyof typeof LucideIcons
  ] as React.ComponentType<{ size: number; className?: string }>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Category Header */}
      <header className="glass relative mb-10 overflow-hidden rounded-2xl p-8 md:p-12">
        {IconComponent && (
          <IconComponent
            size={200}
            className="absolute -right-8 -bottom-8 opacity-[0.03]"
          />
        )}
        <div className="relative">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold"
            style={{
              color: config.color,
              backgroundColor: `${config.color}15`,
            }}
          >
            {IconComponent && <IconComponent size={16} className="shrink-0" />}
            {config.label}
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
            {category.name}
          </h1>
          <p className="mt-2 max-w-xl font-[family-name:var(--font-ui)] text-base text-[var(--color-text-muted)]">
            {category.description}
          </p>
          <p className="mt-1 font-[family-name:var(--font-mono)] text-xs text-[var(--color-text-muted)]">
            {totalCount} articulo{totalCount !== 1 && "s"}
          </p>
        </div>
      </header>

      <AdSlot format="horizontal" />

      {/* Articles grid */}
      {articles.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <NewsCard key={article.id} article={article} index={i} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="font-[family-name:var(--font-ui)] text-[var(--color-text-muted)]">
            No hay articulos en esta categoria aun.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Paginacion">
          {currentPage > 1 ? (
            <Link
              href={`/categoria/${slug}?page=${currentPage - 1}`}
              className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-4 py-2 font-[family-name:var(--font-ui)] text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)]"
            >
              <ChevronLeft size={16} />
              Anterior
            </Link>
          ) : (
            <span className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-4 py-2 font-[family-name:var(--font-ui)] text-sm text-[var(--color-text-muted)] opacity-40">
              <ChevronLeft size={16} />
              Anterior
            </span>
          )}

          <span className="px-4 font-[family-name:var(--font-mono)] text-sm text-[var(--color-text-muted)]">
            {currentPage} / {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Link
              href={`/categoria/${slug}?page=${currentPage + 1}`}
              className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-4 py-2 font-[family-name:var(--font-ui)] text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)]"
            >
              Siguiente
              <ChevronRight size={16} />
            </Link>
          ) : (
            <span className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-4 py-2 font-[family-name:var(--font-ui)] text-sm text-[var(--color-text-muted)] opacity-40">
              Siguiente
              <ChevronRight size={16} />
            </span>
          )}
        </nav>
      )}

      {articles.length > 3 && <AdSlot format="rectangle" />}
    </div>
  );
}
