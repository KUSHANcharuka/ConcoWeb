import assert from "node:assert/strict";
import test from "node:test";

process.env.SKIP_ENV_VALIDATION = "1";
process.env.PUSHER_KEY = "pusher-key";
process.env.PUSHER_SECRET = "pusher-secret";
process.env.PUSHER_APP_ID = "app-id";
process.env.PUSHER_CLUSTER = "ap1";

const realtimeModule = await import("./realtime");

test("buildPrivateNotificationChannel scopes events by user", () => {
  assert.equal(
    realtimeModule.buildPrivateNotificationChannel("user_123"),
    "private-notifications-user-user_123",
  );
});

test("signPrivateChannel returns a pusher auth token", () => {
  const token = realtimeModule.signPrivateChannel({
    socketId: "1234.5678",
    channel: "private-notifications-user-user_123",
  });

  assert.match(token, /^pusher-key:/);
});
