"use client";

import { useState } from "react";
import * as LucideIcons from "lucide-react";
import { CATEGORY_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { NewsCard } from "./NewsCard";
import type { ArticleSummary, CategorySlug } from "@/types";

interface CategoryTabsProps {
  articlesByCategory: Record<CategorySlug, ArticleSummary[]>;
}

const tabCategories: CategorySlug[] = [
  "tech",
  "finanzas",
  "negocios",
  "global",
  "curiosidad",
  "latam",
];

export function CategoryTabs({ articlesByCategory }: CategoryTabsProps) {
  const [active, setActive] = useState<CategorySlug>("tech");

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl font-bold">
        Explorar por categoria
      </h2>

      {/* Tabs */}
      <div className="mb-8 flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {tabCategories.map((slug) => {
          const config = CATEGORY_CONFIG[slug];
          const IconComponent = LucideIcons[
            config.icon as keyof typeof LucideIcons
          ] as React.ComponentType<{ size: number }>;

          return (
            <button
              key={slug}
              onClick={() => setActive(slug)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 font-[family-name:var(--font-ui)] text-sm font-medium transition-all duration-200",
                active === slug
                  ? "glass-subtle text-[var(--color-accent-text)]"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-secondary)]"
              )}
              style={
                active === slug
                  ? { borderBottom: `2px solid var(--color-accent)` }
                  : undefined
              }
            >
              {IconComponent && <IconComponent size={16} />}
              <span className="hidden sm:inline">{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div key={active} className="animate-tab-in">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(articlesByCategory[active] || []).slice(0, 6).map((article, i) => (
            <NewsCard key={article.id} article={article} index={i} />
          ))}
        </div>
        {(!articlesByCategory[active] ||
          articlesByCategory[active].length === 0) && (
          <p className="py-12 text-center font-[family-name:var(--font-ui)] text-sm text-[var(--color-text-muted)]">
            No hay articulos en esta categoria aun.
          </p>
        )}
      </div>
    </section>
  );
}
