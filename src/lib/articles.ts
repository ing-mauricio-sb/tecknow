import { query } from "@/lib/db";
import type {
  Article,
  ArticleSummary,
  ArticleUrgency,
  ArticleFAQ,
  CategorySlug,
} from "@/types";

function rowToArticle(row: Record<string, unknown>): Article {
  return {
    id: String(row.id),
    slug: String(row.slug),
    titulo: String(row.titulo),
    subtitulo: String(row.subtitulo),
    resumen: row.resumen as string[],
    categoria: row.categoria as CategorySlug,
    urgencia: row.urgencia as ArticleUrgency,
    tags: row.tags as string[],
    fuenteOriginal: String(row.fuente_original),
    imagenUrl: row.imagen_url ? String(row.imagen_url) : null,
    publishedAt: new Date(row.published_at as string).toISOString(),
    readingTimeMinutes: Number(row.reading_time_minutes),
    cuerpo: String(row.cuerpo),
    porQueImporta: String(row.por_que_importa),
    preguntasChat: row.preguntas_chat as ArticleFAQ[],
  };
}

function rowToSummary(row: Record<string, unknown>): ArticleSummary {
  return {
    id: String(row.id),
    slug: String(row.slug),
    titulo: String(row.titulo),
    subtitulo: String(row.subtitulo),
    resumen: row.resumen as string[],
    categoria: row.categoria as CategorySlug,
    urgencia: row.urgencia as ArticleUrgency,
    tags: row.tags as string[],
    fuenteOriginal: String(row.fuente_original),
    imagenUrl: row.imagen_url ? String(row.imagen_url) : null,
    publishedAt: new Date(row.published_at as string).toISOString(),
    readingTimeMinutes: Number(row.reading_time_minutes),
  };
}

export async function getArticles(options?: {
  category?: CategorySlug;
  limit?: number;
  urgency?: ArticleUrgency;
}): Promise<ArticleSummary[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];
  let i = 1;

  if (options?.category) {
    conditions.push(`categoria = $${i++}`);
    params.push(options.category);
  }
  if (options?.urgency) {
    conditions.push(`urgencia = $${i++}`);
    params.push(options.urgency);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit = options?.limit ? `LIMIT $${i++}` : "";
  if (options?.limit) params.push(options.limit);

  const rows = await query(
    `SELECT id, slug, titulo, subtitulo, resumen, categoria, urgencia,
            tags, fuente_original, imagen_url, published_at, reading_time_minutes
     FROM articles ${where} ORDER BY published_at DESC ${limit}`,
    params
  );

  return rows.map(rowToSummary);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const rows = await query("SELECT * FROM articles WHERE slug = $1 LIMIT 1", [slug]);
  if (rows.length === 0) return null;
  return rowToArticle(rows[0]);
}

export async function getBreakingArticles(): Promise<ArticleSummary[]> {
  return getArticles({ urgency: "breaking" });
}

export async function getRelatedArticles(
  articleId: string,
  category: CategorySlug,
  limit: number = 3
): Promise<ArticleSummary[]> {
  const rows = await query(
    `SELECT id, slug, titulo, subtitulo, resumen, categoria, urgencia,
            tags, fuente_original, imagen_url, published_at, reading_time_minutes
     FROM articles WHERE categoria = $1 AND id != $2
     ORDER BY published_at DESC LIMIT $3`,
    [category, articleId, limit]
  );
  return rows.map(rowToSummary);
}

// --- Search ---

export async function searchArticles(
  searchTerm: string,
  limit: number = 20
): Promise<ArticleSummary[]> {
  const pattern = `%${searchTerm}%`;
  const rows = await query(
    `SELECT id, slug, titulo, subtitulo, resumen, categoria, urgencia,
            tags, fuente_original, imagen_url, published_at, reading_time_minutes
     FROM articles
     WHERE titulo ILIKE $1 OR subtitulo ILIKE $1 OR EXISTS (
       SELECT 1 FROM unnest(tags) AS t WHERE t ILIKE $1
     )
     ORDER BY published_at DESC LIMIT $2`,
    [pattern, limit]
  );
  return rows.map(rowToSummary);
}

// --- Ingestion pipeline functions ---

export async function createArticle(article: Omit<Article, "id">): Promise<Article> {
  const rows = await query(
    `INSERT INTO articles (slug, titulo, subtitulo, resumen, categoria, urgencia,
      tags, fuente_original, imagen_url, published_at, reading_time_minutes,
      cuerpo, por_que_importa, preguntas_chat)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     RETURNING *`,
    [
      article.slug,
      article.titulo,
      article.subtitulo,
      article.resumen,
      article.categoria,
      article.urgencia,
      article.tags,
      article.fuenteOriginal,
      article.imagenUrl,
      article.publishedAt,
      article.readingTimeMinutes,
      article.cuerpo,
      article.porQueImporta,
      JSON.stringify(article.preguntasChat),
    ]
  );
  return rowToArticle(rows[0]);
}

export async function articleHashExists(hash: string): Promise<boolean> {
  const rows = await query("SELECT 1 FROM published_hashes WHERE hash = $1", [hash]);
  return rows.length > 0;
}

export async function saveArticleHash(
  hash: string,
  sourceUrl: string,
  title: string
): Promise<void> {
  await query(
    "INSERT INTO published_hashes (hash, source_url, title) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
    [hash, sourceUrl, title]
  );
}
