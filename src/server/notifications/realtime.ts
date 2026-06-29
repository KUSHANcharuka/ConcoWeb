import crypto from "node:crypto";

import { env } from "~/env";

type RealtimeNotificationPayload = {
  id: string;
  portal: "admin" | "client";
  clientId: string | null;
  eventType: string;
  title: string;
  body: string;
  href: string | null;
  severity: string;
  createdAt: string;
};

function isPusherConfigured() {
  return Boolean(env.PUSHER_APP_ID && env.PUSHER_KEY && env.PUSHER_SECRET && env.PUSHER_CLUSTER);
}

export function buildPrivateNotificationChannel(userId: string) {
  return `private-notifications-user-${userId}`;
}

export async function publishRealtimeNotification(
  userId: string,
  payload: RealtimeNotificationPayload,
) {
  if (!isPusherConfigured()) return;

  const appId = env.PUSHER_APP_ID!;
  const key = env.PUSHER_KEY!;
  const secret = env.PUSHER_SECRET!;
  const cluster = env.PUSHER_CLUSTER!;
  const channel = buildPrivateNotificationChannel(userId);
  const body = JSON.stringify({
    name: "notification.new",
    channels: [channel],
    data: JSON.stringify(payload),
  });
  const bodyMd5 = crypto.createHash("md5").update(body).digest("hex");
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params = new URLSearchParams({
    auth_key: key,
    auth_timestamp: timestamp,
    auth_version: "1.0",
    body_md5: bodyMd5,
    name: "notification.new",
  });
  const path = `/apps/${appId}/events?${params.toString()}`;
  const stringToSign = `POST\n${path}\n`;
  const authSignature = crypto.createHmac("sha256", secret).update(stringToSign).digest("hex");
  params.set("auth_signature", authSignature);

  await fetch(`https://api-${cluster}.pusher.com/apps/${appId}/events?${params.toString()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  }).catch(() => undefined);
}

export function signPrivateChannel({
  socketId,
  channel,
}: {
  socketId: string;
  channel: string;
}) {
  if (!isPusherConfigured()) {
    throw new Error("Pusher is not configured.");
  }

  const auth = crypto
    .createHmac("sha256", env.PUSHER_SECRET!)
    .update(`${socketId}:${channel}`)
    .digest("hex");

  return `${env.PUSHER_KEY}:${auth}`;
}
