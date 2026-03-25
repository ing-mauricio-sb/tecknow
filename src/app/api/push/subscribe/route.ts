import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { subscription } = await req.json();
    if (!subscription?.endpoint || !subscription?.keys) {
      return Response.json({ error: "Invalid subscription" }, { status: 400 });
    }

    await query(
      `INSERT INTO push_subscriptions (endpoint, keys_p256dh, keys_auth)
       VALUES ($1, $2, $3)
       ON CONFLICT (endpoint) DO UPDATE SET keys_p256dh = $2, keys_auth = $3`,
      [subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth]
    );

    return Response.json({ success: true });
  } catch (err) {
    console.error("Push subscribe error:", err);
    return Response.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
