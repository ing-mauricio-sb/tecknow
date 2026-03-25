import { Clock, ExternalLink, Timer } from "lucide-react";
import { CategoryBadge } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";
import type { Article } from "@/types";

interface ArticleHeaderProps {
  article: Article;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="animate-fade-up mb-8">
      <CategoryBadge category={article.categoria} size="md" />

      <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl lg:text-[2.75rem]">
        {article.titulo}
      </h1>

      <p className="mt-3 font-[family-name:var(--font-body)] text-lg italic leading-relaxed text-[var(--color-text-secondary)] md:text-xl">
        {article.subtitulo}
      </p>

      {/* Metadata */}
      <div className="mt-5 flex flex-wrap items-center gap-4 border-b border-[var(--color-border)] pb-5 font-[family-name:var(--font-ui)] text-sm text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1.5">
          <Clock size={14} />
          {formatRelativeTime(article.publishedAt)}
        </span>
        <span className="flex items-center gap-1.5">
          <Timer size={14} />
          {article.readingTimeMinutes} min lectura
        </span>
        {article.fuenteOriginal && (
          <a
            href={article.fuenteOriginal}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[var(--color-accent-text)] transition-colors hover:text-[var(--color-accent-light)]"
          >
            <ExternalLink size={14} />
            Fuente original
          </a>
        )}
      </div>
    </header>
  );
}
