"use client";

import { Badge } from "@/components/ui/badge";

const statusConfig = {
  draft: { label: "Draft", className: "border-zinc-300 bg-zinc-100 text-zinc-700" },
  sent: { label: "Sent", className: "border-amber-200 bg-amber-50 text-amber-700" },
  pending_payment: {
    label: "Pending",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  proof_submitted: {
    label: "Verifying",
    className: "border-orange-200 bg-orange-50 text-orange-700",
  },
  paid: { label: "Paid", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  overdue: { label: "Overdue", className: "border-rose-200 bg-rose-50 text-rose-700" },
  void: { label: "Void", className: "border-zinc-200 bg-zinc-50 text-zinc-500" },
} as const;

export function ProjectPaymentStatusPill({
  status,
}: {
  status: keyof typeof statusConfig;
}) {
  const config = statusConfig[status] ?? statusConfig.draft;

  return (
    <Badge className={config.className} variant="outline">
      {config.label}
    </Badge>
  );
}
