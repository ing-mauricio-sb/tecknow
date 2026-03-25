import type { MetadataRoute } from "next";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await query(
    "SELECT slug, published_at FROM articles ORDER BY published_at DESC"
  );

  const categories = await query("SELECT slug FROM categories");

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `https://tecknow.news/${a.slug}`,
    lastModified: new Date(a.published_at as string),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `https://tecknow.news/categoria/${c.slug}`,
    lastModified: new Date(),
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
    ...articleEntries,
  ];
}
