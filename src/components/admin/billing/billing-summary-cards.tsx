import { CalendarDays, CircleDollarSign, ShieldCheck } from "lucide-react";

type SummaryCardProps = {
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
};

function SummaryCard({ label, value, hint, icon: Icon }: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-zinc-500">{label}</p>
          <div className="text-2xl font-semibold text-zinc-950">{value}</div>
          <p className="text-xs text-zinc-500">{hint}</p>
        </div>
        <div className="rounded-full bg-zinc-100 p-2 text-zinc-600">
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}

export function BillingSummaryCards({
  nextDueAt,
  accessExpiresAt,
  showAccessExpires = true,
  showNextDue = true,
  totalOutstanding,
}: {
  nextDueAt: string;
  accessExpiresAt: string;
  showAccessExpires?: boolean;
  showNextDue?: boolean;
  totalOutstanding: string;
}) {
  const columnCount = [showNextDue, showAccessExpires, true].filter(Boolean).length;

  return (
    <div className={`grid gap-4 ${columnCount === 3 ? "md:grid-cols-3" : "md:grid-cols-1"}`}>
      {showNextDue ? (
        <SummaryCard
          hint="Billing deadline that operations need to monitor."
          icon={CalendarDays}
          label="Next Due"
          value={nextDueAt}
        />
      ) : null}
      {showAccessExpires ? (
        <SummaryCard
          hint="Entitlement truth stays separate from the payment deadline."
          icon={ShieldCheck}
          label="Access Expires"
          value={accessExpiresAt}
        />
      ) : null}
      <SummaryCard
        hint="Sum of open invoice totals in the current project."
        icon={CircleDollarSign}
        label="Outstanding"
        value={totalOutstanding}
      />
    </div>
  );
}
