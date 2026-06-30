"use client";

import { DocusealBuilder } from "@docuseal/react";

export function DocusealBuilderEmbed({
  host,
  token,
  onSave,
  onSend,
}: {
  host?: string | null;
  token: string;
  onSave?: (detail: unknown) => void;
  onSend?: (detail: unknown) => void;
}) {
  return (
    <DocusealBuilder
      className="min-h-[760px]"
      host={host ?? undefined}
      onSave={onSave}
      onSend={onSend}
      token={token}
      withRecipientsButton={false}
      withSendButton={false}
    />
  );
}
