"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { CategoryBadge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { staggerStyle } from "@/lib/animations";
import type { ArticleSummary } from "@/types";

interface NewsCardProps {
  article: ArticleSummary;
  variant?: "featured" | "default" | "compact";
  index?: number;
}

export function NewsCard({ article, variant = "default", index = 0 }: NewsCardProps) {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  if (variant === "featured") {
    return (
      <Link href={`/${article.slug}`} className="group block">
        <article
          ref={ref}
          className={cn(
            "relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-border-hover)] hover:shadow-2xl hover:shadow-[var(--color-accent)]/10",
            isInView ? "animate-fade-scale opacity-100" : "opacity-0"
          )}
        >
          {/* Image */}
          <div className="relative aspect-[16/9] overflow-hidden">
            {article.imagenUrl ? (
              <Image
                src={article.imagenUrl}
                alt={article.titulo}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />
            ) : (
              <div className="h-full w-full bg-[var(--color-bg-elevated)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-[var(--color-bg-primary)]/40 to-transparent" />

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <CategoryBadge category={article.categoria} size="md" />
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
                {article.titulo}
              </h2>
              <p className="mt-2 line-clamp-2 font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)] md:text-base">
                {article.subtitulo}
              </p>
              <div className="mt-4 flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)]">
                  <Clock size={12} />
                  {formatRelativeTime(article.publishedAt)}
                </span>
                <span className="inline-flex items-center gap-1 font-[family-name:var(--font-ui)] text-sm font-medium text-[var(--color-accent-text)] transition-transform group-hover:translate-x-1">
                  Leer mas <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/${article.slug}`} className="group block">
        <article className="flex gap-3 rounded-lg p-2 transition-colors hover:bg-[var(--color-bg-elevated)]">
          {article.imagenUrl && (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
              <Image
                src={article.imagenUrl}
                alt={article.titulo}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="line-clamp-2 font-[family-name:var(--font-display)] text-sm font-semibold leading-snug text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-accent-text)]">
              {article.titulo}
            </h4>
            <span className="mt-1 flex items-center gap-1 font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)]">
              <Clock size={10} />
              {formatRelativeTime(article.publishedAt)}
            </span>
          </div>
        </article>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/${article.slug}`} className="group block">
      <article
        ref={ref}
        className={cn(
          "glass-card overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1.5",
          isInView ? "animate-fade-up opacity-100" : "opacity-0"
        )}
        style={isInView ? staggerStyle(index) : undefined}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {article.imagenUrl ? (
            <Image
              src={article.imagenUrl}
              alt={article.titulo}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-[var(--color-bg-elevated)]" />
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <CategoryBadge category={article.categoria} />
          <h3 className="mt-2 line-clamp-2 font-[family-name:var(--font-display)] text-lg font-bold leading-snug text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-accent-text)]">
            {article.titulo}
          </h3>
          <p className="mt-1.5 line-clamp-3 font-[family-name:var(--font-ui)] text-sm leading-relaxed text-[var(--color-text-muted)]">
            {article.resumen[0]}
          </p>
          <div className="mt-3 flex items-center gap-2 font-[family-name:var(--font-ui)] text-xs text-[var(--color-text-muted)]">
            <Clock size={12} />
            {formatRelativeTime(article.publishedAt)}
            <span className="text-[var(--color-border)]">&middot;</span>
            {article.readingTimeMinutes} min lectura
          </div>
        </div>
      </article>
    </Link>
  );
}
