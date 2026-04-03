import { query } from "@/lib/db";

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

  const articles = await query(
    `SELECT slug, titulo, tags, published_at
     FROM articles
     WHERE published_at >= $1
     ORDER BY published_at DESC
     LIMIT 1000`,
    [twoDaysAgo]
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${articles
  .map(
    (a) => `  <url>
    <loc>https://www.tecknow.news/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>TECKNOW</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${new Date(a.published_at as string).toISOString()}</news:publication_date>
      <news:title>${escapeXml(a.titulo as string)}</news:title>
      <news:keywords>${escapeXml((a.tags as string[])?.join(", ") || "")}</news:keywords>
    </news:news>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
