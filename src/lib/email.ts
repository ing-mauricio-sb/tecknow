import { Resend } from "resend";
import { query } from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ArticleLink {
  titulo: string;
  slug: string;
  categoria: string;
}

export async function sendNewsletterToAll(
  articles: ArticleLink[]
): Promise<{ sent: number; failed: number }> {
  if (!process.env.RESEND_API_KEY) return { sent: 0, failed: 0 };

  const subscribers = await query(
    "SELECT email FROM newsletter_subscribers WHERE active = true"
  );

  if (subscribers.length === 0 || articles.length === 0) {
    return { sent: 0, failed: 0 };
  }

  const articleListHtml = articles
    .map(
      (a) =>
        `<li style="margin-bottom:12px;">
          <a href="https://tecknow.news/${a.slug}" style="color:#A78BFA;text-decoration:none;font-weight:600;">${a.titulo}</a>
          <br/><span style="color:#6B6B8A;font-size:12px;">${a.categoria}</span>
        </li>`
    )
    .join("");

  const html = `
    <div style="background:#080810;padding:32px;font-family:sans-serif;max-width:600px;margin:0 auto;">
      <div style="border-bottom:2px solid #7B2FBE;padding-bottom:16px;margin-bottom:24px;">
        <span style="font-family:monospace;font-size:18px;font-weight:bold;color:#E8E8F0;">TEC</span><span style="font-size:20px;font-weight:bold;color:#7B2FBE;">K</span><span style="font-size:18px;font-weight:bold;color:#E8E8F0;">NOW</span>
      </div>
      <h1 style="color:#E8E8F0;font-size:22px;margin:0 0 8px;">Nuevas noticias publicadas</h1>
      <p style="color:#9999AA;font-size:14px;margin:0 0 24px;">Aqui tienes las ultimas noticias de TECKNOW:</p>
      <ul style="list-style:none;padding:0;margin:0;">
        ${articleListHtml}
      </ul>
      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #1E1E32;">
        <p style="color:#6B6B8A;font-size:11px;margin:0;">
          Recibes este email porque te suscribiste a TECKNOW.NEWS.
          <a href="https://tecknow.news" style="color:#A78BFA;">Visitar sitio</a>
        </p>
      </div>
    </div>
  `;

  let sent = 0;
  let failed = 0;

  // Resend free tier: send to each subscriber individually
  // (batch sending requires paid plan)
  for (const sub of subscribers) {
    try {
      await resend.emails.send({
        from: "TECKNOW <onboarding@resend.dev>",
        to: sub.email as string,
        subject: `TECKNOW — ${articles.length} nueva(s) noticia(s)`,
        html,
      });
      sent++;
    } catch {
      failed++;
    }
  }

  return { sent, failed };
}
