import { BillingHistoryPageClient } from "~/components/admin/billing/billing-history-page-client";

export default function AdminBillingPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-subtle)]">
        Billing
      </p>
      <h1 className="mt-2 font-serif text-[var(--text-2xl)] font-normal leading-tight text-[var(--color-ink)]">
        Billing history.
      </h1>
      <p className="mt-4 max-w-3xl text-[var(--color-ink-muted)]">
        Review invoice history across every client project and open any record to inspect payment
        status, proof uploads, and billing documents in the project workspace.
      </p>
      <div className="mt-8">
        <BillingHistoryPageClient mode="admin" />
      </div>
    </div>
  );
}
