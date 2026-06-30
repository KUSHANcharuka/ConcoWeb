export const billingHistoryFilterValues = ["all", "due", "paid", "overdue"] as const;

export type BillingHistoryFilter = (typeof billingHistoryFilterValues)[number];

export type BillingArtifactStatus =
  | "draft"
  | "sent"
  | "pending_payment"
  | "proof_submitted"
  | "paid"
  | "overdue"
  | "void";

export const dueBillingArtifactStatuses = [
  "draft",
  "sent",
  "pending_payment",
  "proof_submitted",
] as const satisfies readonly BillingArtifactStatus[];

type SummaryInputRow = {
  currency: string;
  totalAmount: number;
  status: BillingArtifactStatus;
  dueAt: Date | string | null;
};

export function matchesBillingHistoryFilter(
  status: BillingArtifactStatus,
  filter: BillingHistoryFilter,
) {
  switch (filter) {
    case "paid":
      return status === "paid";
    case "overdue":
      return status === "overdue";
    case "due":
      return (dueBillingArtifactStatuses as readonly BillingArtifactStatus[]).includes(status);
    case "all":
    default:
      return true;
  }
}

export function summarizeBillingRows(rows: SummaryInputRow[]) {
  let nextPaymentDueAt: Date | null = null;
  let overdueCount = 0;
  let paidCount = 0;
  let unpaidCount = 0;
  const remainingDueByCurrency = new Map<string, number>();

  for (const row of rows) {
    if (row.status === "void") {
      continue;
    }

    if (row.status === "paid") {
      paidCount += 1;
      continue;
    }

    unpaidCount += 1;

    if (row.status === "overdue") {
      overdueCount += 1;
    } else if (row.dueAt) {
      const dueDate = row.dueAt instanceof Date ? row.dueAt : new Date(row.dueAt);
      if (!Number.isNaN(dueDate.getTime()) && (!nextPaymentDueAt || dueDate < nextPaymentDueAt)) {
        nextPaymentDueAt = dueDate;
      }
    }

    remainingDueByCurrency.set(
      row.currency,
      (remainingDueByCurrency.get(row.currency) ?? 0) + row.totalAmount,
    );
  }

  return {
    nextPaymentDueAt,
    overdueCount,
    paidCount,
    unpaidCount,
    remainingDueByCurrency: Array.from(remainingDueByCurrency.entries()).map(
      ([currency, totalAmount]) => ({
        currency,
        totalAmount,
      }),
    ),
  };
}
