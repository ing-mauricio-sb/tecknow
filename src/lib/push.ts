import webpush from "web-push";
import { query } from "@/lib/db";

if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:admin@tecknow.news",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
}

export async function sendPushToAll(
  payload: PushPayload
): Promise<{ sent: number; failed: number }> {
  const subs = await query(
    "SELECT endpoint, keys_p256dh, keys_auth FROM push_subscriptions"
  );

  let sent = 0;
  let failed = 0;

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint as string,
            keys: {
              p256dh: sub.keys_p256dh as string,
              auth: sub.keys_auth as string,
            },
          },
          JSON.stringify(payload)
        );
        sent++;
      } catch (err: unknown) {
        failed++;
        if (
          err &&
          typeof err === "object" &&
          "statusCode" in err &&
          (err as { statusCode: number }).statusCode === 410
        ) {
          await query("DELETE FROM push_subscriptions WHERE endpoint = $1", [
            sub.endpoint,
          ]);
        }
      }
    })
  );

  return { sent, failed };
}
