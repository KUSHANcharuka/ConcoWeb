"use client";

import { DocusealForm } from "@docuseal/react";

export function DocusealFormEmbed({
  host,
  src,
  email,
}: {
  host?: string | null;
  src: string;
  email?: string | null;
}) {
  return (
    <DocusealForm
      className="min-h-[760px]"
      email={email ?? undefined}
      host={host ?? undefined}
      src={src}
    />
  );
}
