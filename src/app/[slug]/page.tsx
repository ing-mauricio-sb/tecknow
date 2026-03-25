import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Copy, ExternalLink } from "lucide-react";
import { getArticleBySlug, getRelatedArticles, getArticles } from "@/lib/articles";
import { ArticleHeader, ArticleBody, WhyItMatters } from "@/components/article";
import { ArticleChatbot } from "@/components/article";
import { ReadingProgress } from "@/components/layout";
import { CategoryBadge } from "@/components/ui";
import { NewsCard } from "@/components/news";
import { AdSlot } from "@/components/ads";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return { title: "Articulo no encontrado" };

  return {
    title: article.titulo,
    description: article.subtitulo,
    keywords: article.tags,
    authors: [{ name: "TECKNOW" }],
    alternates: {
      canonical: `https://tecknow.news/${slug}`,
    },
    openGraph: {
      title: article.titulo,
      description: article.subtitulo,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.publishedAt,
      section: article.categoria,
      tags: article.tags,
      url: `https://tecknow.news/${slug}`,
      images: article.imagenUrl
        ? [{ url: article.imagenUrl, width: 1200, height: 630, alt: article.titulo }]
        : [{ url: "/og-default.svg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.titulo,
      description: article.subtitulo,
      images: article.imagenUrl ? [article.imagenUrl] : ["/og-default.svg"],
    },
  };
}

function XShareIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInShareIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const relatedArticles = await getRelatedArticles(
    article.id,
    article.categoria
  );

  // Split body into paragraphs for ad insertion
  const bodyParagraphs = article.cuerpo.split("\n\n");
  const adInsertIndex = Math.min(2, Math.floor(bodyParagraphs.length / 3));
  const bodyBefore = bodyParagraphs.slice(0, adInsertIndex).join("\n\n");
  const bodyAfter = bodyParagraphs.slice(adInsertIndex).join("\n\n");

  const shareUrl = `https://tecknow.news/${article.slug}`;
  const shareText = encodeURIComponent(article.titulo);

  return (
    <>
      <ArticleJsonLd article={article} />
      <ReadingProgress />

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
          {/* Main Content */}
          <article className="max-w-[720px]">
            {/* Hero image */}
            {article.imagenUrl && (
              <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-xl">
                <Image
                  src={article.imagenUrl}
                  alt={article.titulo}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 720px"
                  priority
                />
              </div>
            )}

            <ArticleHeader article={article} />

            {/* Why it matters */}
            <WhyItMatters content={article.porQueImporta} />

            {/* Summary bullets */}
            <div className="glass-subtle my-6 rounded-xl p-5">
              <h3 className="mb-3 font-[family-name:var(--font-ui)] text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Resumen clave
              </h3>
              <ul className="space-y-2">
                {article.resumen.map((bullet, i) => (
                  <li key={i} className="flex gap-2 font-[family-name:var(--font-ui)] text-[15px] text-[var(--color-text-secondary)]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            {/* Body — first part */}
            <ArticleBody content={bodyBefore} />

            {/* Ad — In-article */}
            <AdSlot format="fluid" />

            {/* Body — rest */}
            <ArticleBody content={bodyAfter} />

            {/* Tags */}
            <div className="mt-10 border-t border-[var(--color-border)] pt-6">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 py-1 font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Share buttons */}
              <div className="mt-4 flex items-center gap-3">
                <span className="font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)]">
                  Compartir:
                </span>
                <a
                  href={`https://x.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
                  aria-label="Compartir en X"
                >
                  <XShareIcon />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
                  aria-label="Compartir en LinkedIn"
                >
                  <LinkedInShareIcon />
                </a>
                <button
                  className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
                  aria-label="Copiar enlace"
                  onClick={undefined}
                >
                  <Copy size={16} />
                </button>
                <a
                  href={article.fuenteOriginal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-1 rounded-lg px-3 py-2 font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-accent-text)]"
                >
                  <ExternalLink size={12} />
                  Fuente original
                </a>
              </div>
            </div>

            {/* Related articles */}
            {relatedArticles.length > 0 && (
              <section className="mt-12 border-t border-[var(--color-border)] pt-8">
                <h2 className="mb-6 font-[family-name:var(--font-display)] text-xl font-bold">
                  Mas articulos
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedArticles.map((a) => (
                    <NewsCard key={a.id} article={a} variant="compact" />
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar — Desktop only */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-6">
              {/* Chatbot */}
              <ArticleChatbot article={article} />

              {/* Ad — Sidebar */}
              <AdSlot format="rectangle" />

              {/* Related articles sidebar */}
              {relatedArticles.length > 0 && (
                <div className="glass rounded-xl p-4">
                  <h3 className="mb-3 font-[family-name:var(--font-ui)] text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Articulos relacionados
                  </h3>
                  <div className="space-y-1">
                    {relatedArticles.map((a) => (
                      <NewsCard key={a.id} article={a} variant="compact" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Ad — Post-article (mobile/tablet visible, desktop has sidebar) */}
      <div className="lg:hidden">
        <AdSlot format="auto" />
      </div>

      {/* Mobile chatbot FAB */}
      <div className="lg:hidden">
        <ArticleChatbot article={article} />
      </div>
    </>
  );
}
