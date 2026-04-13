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

const ARTICLE_TYPES = ["analisis", "explainer", "comparativa", "reporte"] as const;
type ArticleType = (typeof ARTICLE_TYPES)[number];

function pickArticleType(): ArticleType {
  return ARTICLE_TYPES[Math.floor(Math.random() * ARTICLE_TYPES.length)];
}

const STRUCTURE_PROMPTS: Record<ArticleType, string> = {
  analisis: `Estructura tipo ANALISIS:
## [Titulo de seccion sobre el hecho]
(Describe que paso con datos concretos)
## Contexto y antecedentes
(Background, historia relevante, actores involucrados)
## Implicaciones tecnicas
(Que significa esto para desarrolladores, ingenieros, PMs)
## Impacto en Latinoamerica
(Regulacion, adopcion, oportunidades y riesgos para la region)`,

  explainer: `Estructura tipo EXPLAINER:
## Que es [tema] y por que importa ahora
(Definicion accesible, por que es noticia hoy)
## Como funciona
(Mecanismo tecnico explicado con claridad)
## Que cambia para los profesionales tech
(Impacto practico, que deben saber o hacer)
## Que viene despues
(Proximos pasos, timeline, que observar)`,

  comparativa: `Estructura tipo COMPARATIVA:
## El panorama actual
(Situacion que genera la comparacion)
## [Opcion/Actor A] vs [Opcion/Actor B]
(Comparacion directa con datos, ventajas, desventajas)
## Los datos hablan
(Cifras, benchmarks, estadisticas concretas)
## Que significa para Latam
(Cual es mas relevante para la region y por que)`,

  reporte: `Estructura tipo REPORTE DE DATOS:
## Los numeros clave
(Datos y cifras principales de la noticia)
## Analisis de la tendencia
(Que patron revela esto, hacia donde va)
## Contexto regional
(Como se compara con Latam, datos locales si existen)
## Perspectiva a futuro
(Predicciones informadas, que vigilar)`,
};

export async function scoreRelevance(
  items: (RSSItem & { defaultCategory: string })[]
): Promise<ScoredItem[]> {
  if (items.length === 0) return [];

  const itemList = items
    .map((item, i) => `[${i}] "${item.title}" — ${item.description.slice(0, 200)}`)
    .join("\n");

  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `Eres editor jefe de TECKNOW.NEWS, portal tech para ingenieros de Latinoamerica.
Evalua cada noticia del 1 al 10 segun relevancia para nuestro publico:
- Profesionales tech, desarrolladores, PMs, CTOs en Latam
- Temas: IA, cloud, fintech, startups, regulacion tech, hardware, ciencia
- Prioriza noticias con impacto directo en la region o en la industria tech global
- Penaliza noticias muy locales de EEUU sin relevancia global, clickbait, o temas triviales

Categorias disponibles: tech|finanzas|negocios|global|curiosidad|latam
- latam: noticias especificamente sobre Latinoamerica, startups latam, regulacion regional
- finanzas: fintech, mercados, criptomonedas, economia digital
- negocios: empresas, adquisiciones, estrategia corporativa
- tech: IA, desarrollo, cloud, hardware, software
- global: geopolitica tech, regulacion internacional
- curiosidad: ciencia, espacio, innovacion inusual

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

export async function researchTopic(item: ScoredItem): Promise<string> {
  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      tools: {
        google_search: google.tools.googleSearch({}),
      },
      prompt: `Eres un investigador de TECKNOW.NEWS (portal tech para Latinoamerica).

Investiga sobre esta noticia: "${item.title}"
Descripcion: ${item.description.slice(0, 300)}
Fuente: ${item.source} — ${item.link}

BUSCA informacion complementaria:
1. Al menos 2 fuentes adicionales que hablen del mismo tema o evento
2. Datos cuantitativos: cifras, porcentajes, montos, fechas
3. Contexto para Latinoamerica: regulacion regional, adopcion en la region, empresas locales afectadas
4. Reacciones de expertos, analistas o figuras relevantes del sector

Devuelve un RESUMEN ESTRUCTURADO de tu investigacion (max 500 palabras) con las fuentes encontradas.
NO escribas el articulo final — solo el resumen de investigacion.`,
    });
    return text;
  } catch (err) {
    console.error("Research failed:", err);
    return "Investigacion no disponible.";
  }
}

export async function writeArticle(
  item: ScoredItem,
  researchContext: string
): Promise<Omit<Article, "id">> {
  const articleType = pickArticleType();
  const structureGuide = STRUCTURE_PROMPTS[articleType];
  const bulletCount = 3 + Math.floor(Math.random() * 3); // 3 to 5

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `Eres periodista tech senior de TECKNOW.NEWS, portal para ingenieros y profesionales tech de Latinoamerica.
Redacta un articulo COMPLETO en ESPANOL sintetizando la fuente original y la investigacion adicional.

FUENTE ORIGINAL:
Titulo: ${item.title}
Descripcion: ${item.description}
URL: ${item.link}
Medio: ${item.source}

INVESTIGACION ADICIONAL:
${researchContext}

REGLAS DE REDACCION:
- MINIMO 800 palabras, idealmente 1000-1200. NUNCA menos de 800.
- Sintetiza MULTIPLES fuentes — no solo reescribas la fuente original
- Incluye datos concretos: cifras, fechas, porcentajes, nombres de empresas
- Tono: profesional-tecnico pero accesible. Como un colega senior explicando en la oficina
- NO uses clickbait. NO uses emojis. NO uses frases genericas como "en un mundo cada vez mas digital"
- Cita las fuentes cuando uses datos especificos ("segun Reuters...", "de acuerdo con...")
- Cada seccion debe aportar informacion nueva, no repetir lo anterior

${structureGuide}

SECCION ESPECIAL — "Por que importa":
Escribe un parrafo completo (80-120 palabras) explicando el impacto especifico para un profesional tech en Latinoamerica. Incluye al menos 1 dato o ejemplo concreto de la region.

Responde SOLO con JSON valido, sin markdown ni backticks, con esta estructura exacta:
{
  "titulo": "titular informativo en espanol, max 100 chars, sin clickbait",
  "subtitulo": "contexto en una linea que complemente el titular, max 200 chars",
  "resumen": [${Array.from({ length: bulletCount }, (_, i) => `"dato clave ${i + 1}"`).join(", ")}],
  "urgencia": "normal",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "cuerpo": "articulo completo en markdown. MINIMO 800 palabras. Usa ## para subtitulos segun la estructura indicada.",
  "porQueImporta": "parrafo completo de 80-120 palabras sobre impacto en Latam",
  "preguntasChat": [
    {"pregunta": "pregunta relevante 1", "respuesta": "respuesta detallada de 2-3 oraciones"},
    {"pregunta": "pregunta relevante 2", "respuesta": "respuesta detallada de 2-3 oraciones"},
    {"pregunta": "pregunta relevante 3", "respuesta": "respuesta detallada de 2-3 oraciones"},
    {"pregunta": "pregunta relevante 4", "respuesta": "respuesta detallada de 2-3 oraciones"},
    {"pregunta": "pregunta relevante 5", "respuesta": "respuesta detallada de 2-3 oraciones"}
  ]
}`,
  });

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Gemini returned invalid JSON for: ${item.title}`);

  const parsed = JSON.parse(jsonMatch[0]);

  // Validate minimum word count
  const wordCount = (parsed.cuerpo || "").split(/\s+/).length;
  if (wordCount < 600) {
    throw new Error(`Article too short (${wordCount} words) for: ${item.title}`);
  }

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
    imagenUrl: null, // Set by caller after OG image fetch
    publishedAt: new Date().toISOString(),
    readingTimeMinutes: estimateReadingTime(parsed.cuerpo || ""),
    cuerpo: parsed.cuerpo,
    porQueImporta: parsed.porQueImporta,
    preguntasChat: parsed.preguntasChat || [],
  };
}
