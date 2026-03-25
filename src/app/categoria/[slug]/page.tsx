import { notFound } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { getArticles } from "@/lib/articles";
import { getCategoryBySlug, getCategories } from "@/lib/categories";
import { CATEGORY_CONFIG } from "@/lib/constants";
import { NewsCard } from "@/components/news";
import { AdSlot } from "@/components/ads";
import type { Metadata } from "next";
import type { CategorySlug } from "@/types";

type Props = {
  params: Promise<{ slug: string }>;
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

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug as CategorySlug);

  if (!category) notFound();

  const articles = await getArticles({ category: category.slug });
  const config = CATEGORY_CONFIG[category.slug];
  const IconComponent = LucideIcons[
    config.icon as keyof typeof LucideIcons
  ] as React.ComponentType<{ size: number; className?: string }>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Category Header */}
      <header className="glass relative mb-10 overflow-hidden rounded-2xl p-8 md:p-12">
        {/* Decorative icon */}
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
        </div>
      </header>

      {/* Ad — Leaderboard */}
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

      {/* Ad — In-feed */}
      {articles.length > 3 && <AdSlot format="rectangle" />}
    </div>
  );
}
