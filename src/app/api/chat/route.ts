import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { getArticleBySlug } from "@/lib/articles";

// --- Rate limiter: 3 messages per IP per 24h ---
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

  // Convert UIMessage format (parts) to ModelMessage format (content)
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

  const systemPrompt = `Eres el asistente de noticias de TECKNOW.NEWS.
Solo puedes responder preguntas relacionadas con el siguiente articulo:

TITULO: ${article.titulo}
SUBTITULO: ${article.subtitulo}
CONTENIDO: ${article.cuerpo}
POR QUE IMPORTA: ${article.porQueImporta}
FUENTE ORIGINAL: ${article.fuenteOriginal}

PREGUNTAS FRECUENTES:
${faqContext}

REGLAS:
- Responde siempre en espanol, de forma concisa y tecnica.
- Si te preguntan algo que no esta en el articulo, responde amablemente que tu conocimiento se limita a este articulo y sugiere buscar en TECKNOW.NEWS.
- Usa un tono profesional pero cercano, como un colega senior explicando.
- Maximo 150 palabras por respuesta.`;

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: systemPrompt,
    messages,
  });

  const response = result.toUIMessageStreamResponse();
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  return response;
}
