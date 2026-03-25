import type { RSSItem } from "@/lib/rss-parser";

type NewsItem = RSSItem & { defaultCategory: string };

// ── GNews API ──────────────────────────────────────────────
// Docs: https://gnews.io/docs/v4
// Free: 100 req/dia. Topics: technology, business, science
export async function fetchGNews(): Promise<NewsItem[]> {
  const key = process.env.GNEWS_API_KEY;
  if (!key) return [];

  try {
    const url = `https://gnews.io/api/v4/top-headlines?topic=technology&lang=es&max=10&apikey=${key}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return [];

    const data = await res.json();
    const articles: { title: string; description: string; url: string; publishedAt: string; source: { name: string } }[] =
      data.articles || [];

    return articles.map((a) => ({
      title: a.title || "",
      link: a.url || "",
      description: a.description || "",
      pubDate: a.publishedAt || "",
      source: `GNews:${a.source?.name || "unknown"}`,
      defaultCategory: "tech",
    }));
  } catch (err) {
    console.error("GNews fetch failed:", err);
    return [];
  }
}

// ── Currents API ───────────────────────────────────────────
// Docs: https://currentsapi.services/en/docs/
// Free: 600 req/dia. Categories: technology, business, science
export async function fetchCurrentsAPI(): Promise<NewsItem[]> {
  const key = process.env.CURRENTS_API_KEY;
  if (!key) return [];

  try {
    const url = `https://api.currentsapi.services/v1/latest-news?language=en&category=technology&apiKey=${key}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return [];

    const data = await res.json();
    const news: { title: string; description: string; url: string; published: string; author: string }[] =
      data.news || [];

    return news.slice(0, 10).map((n) => ({
      title: n.title || "",
      link: n.url || "",
      description: n.description || "",
      pubDate: n.published || "",
      source: `Currents:${n.author || "unknown"}`,
      defaultCategory: "tech",
    }));
  } catch (err) {
    console.error("Currents API fetch failed:", err);
    return [];
  }
}

// ── Spaceflight News API v4 ────────────────────────────────
// Docs: https://api.spaceflightnewsapi.net/v4/docs/
// Free: ilimitado, sin API key
export async function fetchSpaceflightNews(): Promise<NewsItem[]> {
  try {
    const url = "https://api.spaceflightnewsapi.net/v4/articles/?limit=10&ordering=-published_at";
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return [];

    const data = await res.json();
    const results: { title: string; url: string; summary: string; published_at: string; news_site: string }[] =
      data.results || [];

    return results.map((r) => ({
      title: r.title || "",
      link: r.url || "",
      description: r.summary || "",
      pubDate: r.published_at || "",
      source: `Spaceflight:${r.news_site || "unknown"}`,
      defaultCategory: "curiosidad",
    }));
  } catch (err) {
    console.error("Spaceflight News fetch failed:", err);
    return [];
  }
}

// ── Alpha Vantage NEWS_SENTIMENT ───────────────────────────
// Docs: https://www.alphavantage.co/documentation/
// Free: 25 req/dia. Topics: technology, mergers_and_acquisitions
export async function fetchAlphaVantageNews(): Promise<NewsItem[]> {
  const key = process.env.ALPHA_VANTAGE_API_KEY;
  if (!key) return [];

  try {
    const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=technology&limit=10&apikey=${key}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return [];

    const data = await res.json();
    const feed: { title: string; url: string; summary: string; time_published: string; source: string }[] =
      data.feed || [];

    return feed.slice(0, 10).map((f) => ({
      title: f.title || "",
      link: f.url || "",
      description: f.summary || "",
      pubDate: f.time_published || "",
      source: `AlphaVantage:${f.source || "unknown"}`,
      defaultCategory: "finanzas",
    }));
  } catch (err) {
    console.error("Alpha Vantage fetch failed:", err);
    return [];
  }
}
