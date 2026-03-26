export const revalidate = 3600;

import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { getArticles, getBreakingArticles } from "@/lib/articles";
import { CategoryBadge } from "@/components/ui";
import { BreakingTicker, NewsCard, CategoryTabs, NewsletterSignup } from "@/components/news";
import { AdSlot } from "@/components/ads";
import { formatRelativeTime } from "@/lib/utils";
import type { CategorySlug } from "@/types";

export default async function HomePage() {
  const [allArticles, breakingArticles] = await Promise.all([
    getArticles({ limit: 20 }),
    getBreakingArticles(),
  ]);

  const heroArticle = allArticles[0];
  const sideArticles = allArticles.slice(1, 4);
  const gridArticles = allArticles.slice(4, 10);
  const latamArticles = allArticles.filter((a) => a.categoria === "latam");

  // Group articles by category for tabs
  const articlesByCategory = {} as Record<CategorySlug, typeof allArticles>;
  for (const article of allArticles) {
    if (!articlesByCategory[article.categoria]) {
      articlesByCategory[article.categoria] = [];
    }
    articlesByCategory[article.categoria].push(article);
  }

  return (
    <>
      {/* SEO H1 — visually hidden but accessible to search engines */}
      <h1 className="sr-only">
        TECKNOW — Noticias de Tecnologia, Economia y Negocios para Latinoamerica
      </h1>

      {/* Breaking News Ticker */}
      <BreakingTicker articles={breakingArticles} />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Main hero — 60% */}
          {heroArticle && (
            <div className="lg:col-span-3">
              <NewsCard article={heroArticle} variant="featured" />
            </div>
          )}

          {/* Side articles — 40% */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            {sideArticles.map((article) => (
              <Link
                key={article.id}
                href={`/${article.slug}`}
                className="glass-card group flex gap-4 rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5"
              >
                {article.imagenUrl && (
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={article.imagenUrl}
                      alt={article.titulo}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <CategoryBadge category={article.categoria} />
                  <h3 className="mt-1.5 line-clamp-2 font-[family-name:var(--font-display)] text-sm font-bold leading-snug text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-accent-text)]">
                    {article.titulo}
                  </h3>
                  <span className="mt-1 flex items-center gap-1 font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)]">
                    <Clock size={10} />
                    {formatRelativeTime(article.publishedAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ad — Leaderboard post-hero */}
      <AdSlot format="horizontal" />

      {/* News Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl font-bold">
          Ultimas noticias
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gridArticles.map((article, i) => (
            <NewsCard key={article.id} article={article} index={i} />
          ))}
        </div>
      </section>

      {/* Latam Focus Section */}
      {latamArticles.length > 0 && (
        <section className="bg-gradient-to-br from-[var(--color-bg-surface)] to-[#12102A] py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-6 flex items-center gap-3">
              <MapPin
                size={24}
                className="text-[var(--color-cat-latam)]"
                aria-hidden="true"
              />
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold">
                Latam Focus
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {latamArticles.slice(0, 4).map((article, i) => (
                <Link
                  key={article.id}
                  href={`/${article.slug}`}
                  className="glass-card group rounded-xl border-l-2 border-l-[var(--color-accent)] p-4 transition-all duration-200 hover:-translate-y-1"
                >
                  <CategoryBadge category={article.categoria} />
                  <h3 className="mt-2 line-clamp-2 font-[family-name:var(--font-display)] text-sm font-bold leading-snug text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-accent-text)]">
                    {article.titulo}
                  </h3>
                  <p className="mt-1 line-clamp-2 font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)]">
                    {article.subtitulo}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 font-[family-name:var(--font-ui)] text-xs font-medium text-[var(--color-accent-text)] transition-transform group-hover:translate-x-1">
                    Leer <ArrowRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ad — Rectangle in-feed */}
      <AdSlot format="rectangle" />

      {/* Category Tabs */}
      <CategoryTabs articlesByCategory={articlesByCategory} />

      {/* Newsletter */}
      <NewsletterSignup />
    </>
  );
}
