import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return Response.json({ error: "Email invalido" }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();

    await query(
      `INSERT INTO newsletter_subscribers (email) VALUES ($1)
       ON CONFLICT (email) DO UPDATE SET active = true`,
      [normalized]
    );

    return Response.json({ success: true });
  } catch (err) {
    console.error("Newsletter subscribe error:", err);
    return Response.json({ error: "Error al suscribirse" }, { status: 500 });
  }
}
