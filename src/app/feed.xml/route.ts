import { query } from "@/lib/db";

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const articles = await query(
    `SELECT slug, titulo, subtitulo, published_at, categoria
     FROM articles
     ORDER BY published_at DESC
     LIMIT 50`
  );

  const lastBuild = articles.length > 0
    ? new Date(articles[0].published_at as string).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TECKNOW — Tech. Know. Repeat.</title>
    <link>https://tecknow.news</link>
    <description>Noticias de tecnologia, finanzas y negocios para ingenieros y profesionales de Latinoamerica.</description>
    <language>es</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="https://tecknow.news/feed.xml" rel="self" type="application/rss+xml"/>
${articles
  .map(
    (a) => `    <item>
      <title>${escapeXml(a.titulo as string)}</title>
      <link>https://tecknow.news/${a.slug}</link>
      <guid isPermaLink="true">https://tecknow.news/${a.slug}</guid>
      <description>${escapeXml(a.subtitulo as string)}</description>
      <pubDate>${new Date(a.published_at as string).toUTCString()}</pubDate>
      <category>${escapeXml(a.categoria as string)}</category>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
