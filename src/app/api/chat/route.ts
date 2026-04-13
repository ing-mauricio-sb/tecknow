import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { getArticleBySlug } from "@/lib/articles";

const DAILY_LIMIT = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

const rateLimitMap = new Map<
  string,
  { count: number; resetAt: number }
>();

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + DAY_MS });
    return { allowed: true, remaining: DAILY_LIMIT - 1 };
  }

  if (entry.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: DAILY_LIMIT - entry.count };
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    return new Response(
      JSON.stringify({
        error: "rate_limit",
        message: "Has alcanzado el limite de 3 preguntas por dia. Vuelve manana.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const { messages: rawMessages, articleSlug } = await req.json();

  const messages = rawMessages.map(
    (msg: { role: string; parts?: { type: string; text?: string }[]; content?: string }) => ({
      role: msg.role,
      content:
        msg.content ??
        msg.parts
          ?.filter((p: { type: string }) => p.type === "text")
          .map((p: { text?: string }) => p.text)
          .join("") ??
        "",
    })
  );

  const article = await getArticleBySlug(articleSlug);

  if (!article) {
    return new Response("Articulo no encontrado", { status: 404 });
  }

  const faqContext = article.preguntasChat
    .map((faq) => `P: ${faq.pregunta}\nR: ${faq.respuesta}`)
    .join("\n\n");

  const systemPrompt = `Eres el asistente de noticias de TECKNOW.NEWS. Tienes acceso al articulo y a busqueda web en tiempo real.

ARTICULO BASE:
TITULO: ${article.titulo}
SUBTITULO: ${article.subtitulo}
CONTENIDO: ${article.cuerpo}
POR QUE IMPORTA: ${article.porQueImporta}
FUENTE ORIGINAL: ${article.fuenteOriginal}

PREGUNTAS FRECUENTES:
${faqContext}

REGLAS:
- Responde siempre en espanol, de forma concisa y tecnica
- Para preguntas sobre el contenido del articulo, responde con la informacion del articulo
- Para preguntas sobre actualizaciones, novedades posteriores, o temas que van mas alla del articulo, USA LA BUSQUEDA WEB para encontrar informacion actualizada
- Cuando uses busqueda web, indica brevemente que buscaste informacion actualizada
- Tono: profesional pero cercano, como un colega senior explicando
- Maximo 250 palabras por respuesta
- Si no encuentras informacion relevante ni en el articulo ni en la web, dilo honestamente`;

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: systemPrompt,
    messages,
    tools: {
      google_search: google.tools.googleSearch({}),
    },
  });

  const response = result.toUIMessageStreamResponse();
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  return response;
}
