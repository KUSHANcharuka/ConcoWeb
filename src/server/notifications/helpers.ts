import type { ReminderFamily, ReminderWindowKey } from "./catalog";

type NotificationPortal = "admin" | "client";

export function fillTemplate(
  template: string,
  values: Record<string, string | null | undefined>,
) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, token: string) => {
    const value = values[token];
    return value == null ? "" : value;
  });
}

export function buildReminderDedupeKey(input: {
  family: ReminderFamily;
  entityId: string;
  window: ReminderWindowKey;
  dateKey: string;
}) {
  return `${input.family}:${input.entityId}:${input.window}:${input.dateKey}`;
}

export function buildArchiveHref(input: {
  portal: NotificationPortal;
  projectId?: string | null;
  entityType?: string | null;
  entityId?: string | null;
}) {
  if (input.portal === "client") {
    if (input.entityType === "proposal" && input.projectId && input.entityId) {
      return `/client-portal/projects/${input.projectId}/proposals/${input.entityId}`;
    }
    if (input.entityType === "invoice" && input.projectId && input.entityId) {
      return `/client-portal/projects/${input.projectId}/payments/${input.entityId}`;
    }
    if (input.projectId) {
      return `/client-portal/projects/${input.projectId}`;
    }
    return "/client-portal";
  }

  if (input.entityType === "proposal" && input.projectId && input.entityId) {
    return `/admin/projects/${input.projectId}/proposals/${input.entityId}`;
  }
  if (input.entityType === "invoice" && input.projectId && input.entityId) {
    return `/admin/projects/${input.projectId}/payments/${input.entityId}`;
  }
  if (input.projectId) {
    return `/admin/projects/${input.projectId}`;
  }
  if (input.entityType === "project_request" || input.entityType === "change_request") {
    return "/admin/requests";
  }
  return "/admin/notifications";
}

export function toColomboDateKey(value: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

export function shiftDate(value: Date, days: number) {
  const next = new Date(value);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function isWindowDue({
  targetDate,
  now,
  window,
  timeZone,
}: {
  targetDate: Date;
  now: Date;
  window: ReminderWindowKey;
  timeZone: string;
}) {
  const targetDateKey = toColomboDateKey(targetDate, timeZone);
  const nowKey = toColomboDateKey(now, timeZone);
  if (window === "day_of") {
    if (targetDateKey !== nowKey) return false;
    const localHour = Number(
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "2-digit",
        hour12: false,
      }).format(now),
    );
    return localHour >= 8;
  }

  const shifted =
    window === "t_minus_7d"
      ? shiftDate(targetDate, -7)
      : window === "t_minus_1d"
        ? shiftDate(targetDate, -1)
        : window === "plus_1d"
          ? shiftDate(targetDate, 1)
          : window === "plus_3d"
            ? shiftDate(targetDate, 3)
            : shiftDate(targetDate, 7);

  return toColomboDateKey(shifted, timeZone) === nowKey;
}
