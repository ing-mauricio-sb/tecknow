import type { MetadataRoute } from "next";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await query(
    "SELECT slug, published_at FROM articles ORDER BY published_at DESC"
  );

  const categories = await query(
    `SELECT c.slug, MAX(a.published_at) as last_article_date
     FROM categories c
     LEFT JOIN articles a ON a.categoria = c.slug
     GROUP BY c.slug`
  );

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `https://tecknow.news/${a.slug}`,
    lastModified: new Date(a.published_at as string),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `https://tecknow.news/categoria/${c.slug}`,
    lastModified: c.last_article_date
      ? new Date(c.last_article_date as string)
      : new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [
    {
      url: "https://tecknow.news",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    ...categoryEntries,
    // Legal pages
    {
      url: "https://tecknow.news/sobre-nosotros",
      lastModified: new Date("2026-03-25"),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://tecknow.news/contacto",
      lastModified: new Date("2026-03-25"),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://tecknow.news/privacidad",
      lastModified: new Date("2026-03-25"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://tecknow.news/terminos",
      lastModified: new Date("2026-03-25"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...articleEntries,
  ];
}
