export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

function extractTag(xml: string, tag: string): string {
  const cdataMatch = xml.match(
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`)
  );
  if (cdataMatch) return cdataMatch[1].trim();

  const simpleMatch = xml.match(
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
  );
  return (simpleMatch?.[1] || "").replace(/<[^>]*>/g, "").trim();
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

export async function fetchRSSFeed(
  url: string,
  sourceName: string
): Promise<RSSItem[]> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "TECKNOW-Bot/1.0 (+https://www.tecknow.news)" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const items: RSSItem[] = [];

    // RSS 2.0 <item> blocks
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match: RegExpExecArray | null;
    while ((match = itemRegex.exec(xml)) !== null && items.length < 20) {
      const block = match[1];
      const title = stripHtml(extractTag(block, "title"));
      const link = extractTag(block, "link");
      const desc = stripHtml(extractTag(block, "description"));
      const pubDate = extractTag(block, "pubDate");
      if (title && link) {
        items.push({ title, link, description: desc, pubDate, source: sourceName });
      }
    }

    // Atom <entry> fallback
    if (items.length === 0) {
      const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
      while ((match = entryRegex.exec(xml)) !== null && items.length < 20) {
        const block = match[1];
        const title = stripHtml(extractTag(block, "title"));
        const linkMatch = block.match(/<link[^>]*href="([^"]*)"/);
        const link = linkMatch?.[1] || extractTag(block, "link");
        const desc = stripHtml(
          extractTag(block, "summary") || extractTag(block, "content")
        );
        const pubDate =
          extractTag(block, "published") || extractTag(block, "updated");
        if (title && link) {
          items.push({ title, link, description: desc, pubDate, source: sourceName });
        }
      }
    }

    return items;
  } catch {
    console.error(`RSS fetch failed for ${sourceName}: ${url}`);
    return [];
  }
}
