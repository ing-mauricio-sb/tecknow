import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import type { Article, CategorySlug } from "@/types";
import type { RSSItem } from "@/lib/rss-parser";
import { slugify, estimateReadingTime } from "@/lib/utils";

export interface ScoredItem extends RSSItem {
  defaultCategory: string;
  score: number;
  suggestedCategory: CategorySlug;
}

export async function scoreRelevance(
  items: (RSSItem & { defaultCategory: string })[]
): Promise<ScoredItem[]> {
  if (items.length === 0) return [];

  const itemList = items
    .map((item, i) => `[${i}] "${item.title}" — ${item.description.slice(0, 150)}`)
    .join("\n");

  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `Eres editor jefe de TECKNOW.NEWS, portal tech para ingenieros de Latinoamerica.
Evalua cada noticia del 1 al 10 para nuestro publico (tech, IA, fintech, startups, Latam, regulacion tech).
Tambien sugiere la mejor categoria: tech|finanzas|negocios|global|curiosidad|latam

Noticias:
${itemList}

Responde SOLO con JSON array valido, sin markdown ni backticks:
[{"index":0,"score":8,"category":"tech"}, ...]`,
    });

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed: { index: number; score: number; category: string }[] =
      JSON.parse(jsonMatch[0]);

    return parsed
      .filter((p) => p.index >= 0 && p.index < items.length)
      .map((p) => ({
        ...items[p.index],
        score: p.score,
        suggestedCategory: p.category as CategorySlug,
      }));
  } catch (err) {
    console.error("Gemini scoring failed:", err);
    return [];
  }
}

export async function writeArticle(
  item: ScoredItem
): Promise<Omit<Article, "id">> {
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `Eres periodista tech senior escribiendo para TECKNOW.NEWS (ingenieros de Latinoamerica).
Basandote en esta fuente, redacta un articulo COMPLETO en ESPANOL.

FUENTE:
Titulo: ${item.title}
Descripcion: ${item.description}
URL: ${item.link}
Medio: ${item.source}

Responde SOLO con JSON valido, sin markdown ni backticks, con esta estructura exacta:
{
  "titulo": "titular impactante en espanol, max 100 chars, sin clickbait",
  "subtitulo": "contexto en una linea, max 200 chars",
  "resumen": ["dato clave 1", "dato clave 2", "dato clave 3"],
  "urgencia": "normal",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "cuerpo": "articulo completo en markdown, 300-500 palabras, tono profesional-tecnico, en espanol. Usa ## para subtitulos. Cita datos concretos.",
  "porQueImporta": "2-3 oraciones explicando por que esto importa a un ingeniero o PM tech en Peru/Latam",
  "preguntasChat": [
    {"pregunta": "pregunta relevante en espanol", "respuesta": "respuesta concisa basada en el articulo"},
    {"pregunta": "otra pregunta", "respuesta": "otra respuesta"},
    {"pregunta": "tercera pregunta", "respuesta": "tercera respuesta"}
  ]
}`,
  });

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Gemini returned invalid JSON for: ${item.title}`);

  const parsed = JSON.parse(jsonMatch[0]);
  const slug = slugify(parsed.titulo || item.title);

  return {
    slug,
    titulo: parsed.titulo,
    subtitulo: parsed.subtitulo,
    resumen: parsed.resumen || [],
    categoria: item.suggestedCategory,
    urgencia: parsed.urgencia || "normal",
    tags: parsed.tags || [],
    fuenteOriginal: item.link,
    imagenUrl: null,
    publishedAt: new Date().toISOString(),
    readingTimeMinutes: estimateReadingTime(parsed.cuerpo || ""),
    cuerpo: parsed.cuerpo,
    porQueImporta: parsed.porQueImporta,
    preguntasChat: parsed.preguntasChat || [],
  };
}
