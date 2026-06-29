import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { signPrivateChannel } from "~/server/notifications/realtime";

export async function POST(request: Request) {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const socketId = formData.get("socket_id");
  const channelName = formData.get("channel_name");

  if (typeof socketId !== "string" || typeof channelName !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const expectedChannel = `private-notifications-user-${session.userId}`;
  if (channelName !== expectedChannel) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const authValue = signPrivateChannel({
      socketId,
      channel: channelName,
    });

    return NextResponse.json({ auth: authValue });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Pusher not configured." },
      { status: 503 },
    );
  }
}
