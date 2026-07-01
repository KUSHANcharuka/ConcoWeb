import assert from "node:assert/strict";
import test from "node:test";

process.env.SKIP_ENV_VALIDATION = "1";
const helperModule = await import("./helpers.js");

test("fillTemplate replaces known placeholders and blanks missing values", () => {
  const rendered = helperModule.fillTemplate("Invoice {{invoiceTitle}} for {{clientName}}", {
    clientName: "Acme",
    invoiceTitle: "INV-001",
    missing: undefined,
  });

  assert.equal(rendered, "Invoice INV-001 for Acme");
});

test("buildArchiveHref resolves client and admin deep links", () => {
  assert.equal(
    helperModule.buildArchiveHref({
      portal: "client",
      projectId: "project-1",
      entityType: "invoice",
      entityId: "invoice-1",
    }),
    "/client-portal/projects/project-1/payments/invoice-1",
  );

  assert.equal(
    helperModule.buildArchiveHref({
      portal: "admin",
      entityType: "project_request",
    }),
    "/admin/requests",
  );
});

test("buildReminderDedupeKey is stable for entity, family, window, and date", () => {
  assert.equal(
    helperModule.buildReminderDedupeKey({
      family: "payment",
      entityId: "invoice-1",
      window: "plus_3d",
      dateKey: "2026-07-01",
    }),
    "payment:invoice-1:plus_3d:2026-07-01",
  );
});

test("isWindowDue enforces day-of reminders at 8:00 AM Colombo time", () => {
  const targetDate = new Date("2026-07-07T00:00:00.000Z");

  assert.equal(
    helperModule.isWindowDue({
      targetDate,
      now: new Date("2026-07-07T01:59:00.000Z"),
      window: "day_of",
      timeZone: "Asia/Colombo",
    }),
    false,
  );

  assert.equal(
    helperModule.isWindowDue({
      targetDate,
      now: new Date("2026-07-07T02:30:00.000Z"),
      window: "day_of",
      timeZone: "Asia/Colombo",
    }),
    true,
  );
});

test("isWindowDue handles relative reminder windows", () => {
  const targetDate = new Date("2026-07-10T00:00:00.000Z");

  assert.equal(
    helperModule.isWindowDue({
      targetDate,
      now: new Date("2026-07-03T12:00:00.000Z"),
      window: "t_minus_7d",
      timeZone: "Asia/Colombo",
    }),
    true,
  );

  assert.equal(
    helperModule.isWindowDue({
      targetDate,
      now: new Date("2026-07-13T12:00:00.000Z"),
      window: "plus_3d",
      timeZone: "Asia/Colombo",
    }),
    true,
  );
});
