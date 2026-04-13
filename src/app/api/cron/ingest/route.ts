import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createHash } from "crypto";
import { fetchRSSFeed } from "@/lib/rss-parser";
import { RSS_SOURCES } from "@/lib/rss-sources";
import {
  createArticle,
  articleHashExists,
  saveArticleHash,
} from "@/lib/articles";
import { scoreRelevance, writeArticle, researchTopic } from "@/lib/gemini";
import {
  fetchGNews,
  fetchCurrentsAPI,
  fetchSpaceflightNews,
  fetchAlphaVantageNews,
} from "@/lib/news-apis";
import { fetchOGImage } from "@/lib/og-image";
import type { RSSItem } from "@/lib/rss-parser";

export const maxDuration = 300;

const MAX_ARTICLES_PER_RUN = 3;
const RELEVANCE_THRESHOLD = 7;
const MAX_ITEM_AGE_HOURS = 48;

function isRecent(pubDate: string): boolean {
  if (!pubDate) return true; // If no date, assume recent
  const date = new Date(pubDate);
  if (isNaN(date.getTime())) return true;
  const hoursAgo = (Date.now() - date.getTime()) / (1000 * 60 * 60);
  return hoursAgo <= MAX_ITEM_AGE_HOURS;
}

export async function GET(req: NextRequest) {
  // Auth check
  const secret =
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    req.nextUrl.searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const log: string[] = [];

  try {
    // Step 1a: Fetch all RSS feeds in parallel
    log.push(`Fetching ${RSS_SOURCES.length} RSS feeds + 4 news APIs...`);
    const feedResults = await Promise.allSettled(
      RSS_SOURCES.map(async (source) => {
        const items = await fetchRSSFeed(source.url, source.name);
        return items.map((item) => ({
          ...item,
          defaultCategory: source.defaultCategory,
        }));
      })
    );

    const allItems: (RSSItem & { defaultCategory: string })[] = [];
    for (const result of feedResults) {
      if (result.status === "fulfilled") allItems.push(...result.value);
    }
    const rssCount = allItems.length;

    // Step 1b: Fetch news APIs in parallel
    const apiResults = await Promise.allSettled([
      fetchGNews(),
      fetchCurrentsAPI(),
      fetchSpaceflightNews(),
      fetchAlphaVantageNews(),
    ]);
    for (const result of apiResults) {
      if (result.status === "fulfilled") allItems.push(...result.value);
    }
    log.push(`Fetched ${rssCount} RSS + ${allItems.length - rssCount} API = ${allItems.length} total items`);

    // Step 2: Filter recent + deduplicate
    const candidates: typeof allItems = [];
    for (const item of allItems) {
      if (!isRecent(item.pubDate)) continue;

      const hash = createHash("sha256")
        .update(`${item.title}|${item.link}`)
        .digest("hex");

      if (!(await articleHashExists(hash))) {
        candidates.push(item);
        if (candidates.length >= MAX_ARTICLES_PER_RUN * 3) break;
      }
    }
    log.push(`${candidates.length} new candidates after dedup`);

    if (candidates.length === 0) {
      return Response.json({
        message: "No new items to process",
        published: 0,
        log,
        durationMs: Date.now() - startTime,
      });
    }

    // Step 3: Score relevance with Gemini (1 batch call)
    log.push("Scoring relevance with Gemini...");
    const scored = await scoreRelevance(candidates.slice(0, 15));
    const relevant = scored
      .filter((s) => s.score >= RELEVANCE_THRESHOLD)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_ARTICLES_PER_RUN);
    log.push(
      `${scored.length} scored, ${relevant.length} above threshold (>=${RELEVANCE_THRESHOLD})`
    );

    if (relevant.length === 0) {
      return Response.json({
        message: "No relevant items found",
        published: 0,
        log,
        durationMs: Date.now() - startTime,
      });
    }

    // Step 4: Write articles with Gemini + publish
    const published: string[] = [];
    for (const item of relevant) {
      try {
        log.push(`Researching: ${item.title.slice(0, 60)}...`);
        const researchContext = await researchTopic(item);
        log.push(`Writing article: ${item.title.slice(0, 60)}...`);
        const articleData = await writeArticle(item, researchContext);

        // Fetch OG image from source
        const ogImage = await fetchOGImage(item.link);
        if (ogImage) {
          articleData.imagenUrl = ogImage;
          log.push(`Image found: ${ogImage.slice(0, 80)}`);
        }

        const created = await createArticle(articleData);

        const hash = createHash("sha256")
          .update(`${item.title}|${item.link}`)
          .digest("hex");
        await saveArticleHash(hash, item.link, item.title);

        published.push(created.slug);
        log.push(`Published: ${created.slug} (${articleData.readingTimeMinutes} min)`);
      } catch (err) {
        log.push(`Failed: ${item.title} — ${String(err)}`);
      }
    }

    // Step 5: Revalidate pages
    if (published.length > 0) {
      revalidatePath("/");
      revalidatePath("/categoria/[slug]", "page");
      log.push("Pages revalidated");

      // Step 6: Push notifications (import dynamically to avoid issues if web-push not configured)
      try {
        const { sendPushToAll } = await import("@/lib/push");
        const result = await sendPushToAll({
          title: "TECKNOW — Nueva noticia",
          body: `${published.length} articulo(s) nuevo(s) publicado(s)`,
          url: `/${published[0]}`,
        });
        log.push(`Push sent: ${result.sent} ok, ${result.failed} failed`);
      } catch (err) {
        log.push(`Push skipped: ${String(err)}`);
      }

      // Step 7: Send email to newsletter subscribers
      try {
        const { sendNewsletterToAll } = await import("@/lib/email");
        const articleLinks = relevant
          .filter((_, i) => published[i])
          .map((item, i) => ({
            titulo: published[i] ? item.title : item.title,
            slug: published[i] || "",
            categoria: item.suggestedCategory || item.defaultCategory,
          }))
          .filter((a) => a.slug);
        const emailResult = await sendNewsletterToAll(articleLinks);
        log.push(
          `Email sent: ${emailResult.sent} ok, ${emailResult.failed} failed`
        );
      } catch (err) {
        log.push(`Email skipped: ${String(err)}`);
      }
    }

    return Response.json({
      message: "Ingestion complete",
      published: published.length,
      slugs: published,
      log,
      durationMs: Date.now() - startTime,
    });
  } catch (err) {
    log.push(`Fatal error: ${String(err)}`);
    return Response.json(
      { error: "Ingestion failed", log, durationMs: Date.now() - startTime },
      { status: 500 }
    );
  }
}
