## Context

The current admin and client shells already expose a notification bell, but there is no durable notification model, no archive page, and no shared policy for reminder timing. The repository already has adjacent primitives that this change should reuse instead of bypassing: Clerk webhooks for invitation acceptance, billing artifacts and access-expiry state in Postgres, an admin settings shell, email settings/template assignment tables, and a cron-style email suggestion run model.

This change is cross-cutting. It touches both portal shells, billing behavior, settings behavior, email drafting rules, and a new external realtime dependency. It must also respect the v1 operating model agreed in planning:

- Main product stays on Vercel.
- Scheduled reminder generation runs from an external cron host, currently Railway cron.
- Realtime UI updates use Pusher.
- Postgres is the source of truth.
- Cron-created reminder emails are drafted in v1, not auto-sent.
- Immediate business notifications such as invoice send and proposal send still support actual client email delivery.
- Reminder timing uses Sri Lanka time and the day-of reminder triggers at 8:00 AM.

## Goals / Non-Goals

**Goals:**
- Provide a real notification center for both admin and client portals with unread counts, popover lists, and archive pages.
- Persist notification events and per-recipient inbox rows in Postgres so notification history survives refreshes, reconnects, and missed realtime sessions.
- Support realtime fanout for newly created notifications to open browser sessions.
- Generate billing and access reminder notifications on fixed business windows: `T-7`, `T-1`, `T0 at 8:00 AM`, `+1`, `+3`, and `+7`.
- Make reminder windows, enablement, and message copy configurable from admin settings.
- Reuse the existing email workspace and settings model for reminder email draft copy rather than creating a second independent copy system.

**Non-Goals:**
- A generic user-defined cron builder with arbitrary expressions or arbitrary entity scopes.
- A queue broker or always-on worker service in v1.
- Full automatic multi-channel sending for every reminder email drafted by cron.
- Fine-grained per-user notification preferences UI in v1.
- SMS, WhatsApp, mobile push, or digest batching in this change.

## Decisions

### 1. Use a fixed scheduler with configurable business windows

The cron host will run on a stable cadence, and the application will decide which reminder windows are due. Admins will not define raw cron expressions per reminder type.

Why:
- The business rules are stable and known up front.
- Fixed windows are safer to validate and dedupe than arbitrary cron definitions.
- It preserves room for future per-window enablement without turning settings into a workflow engine.

Alternative considered:
- Let admins create fully custom crons. Rejected for v1 because it adds schedule validation, conflict resolution, migration semantics, and high support risk.

### 2. Store notifications in two layers: event and inbox

The data model will separate immutable source events from recipient-facing inbox rows.

- `notification_events`: the canonical occurrence such as `invoice.sent`, `payment.reminder_due`, `access.expiry_tomorrow`, `invitation.accepted`
- `notifications`: one row per recipient and portal surface, with read state and deep-link metadata

Why:
- One event can fan out to many admins or many client members.
- Recipient read state must not mutate the source event.
- Dedupe rules belong at the event layer, while UI behavior belongs at the inbox layer.

Alternative considered:
- Only store per-recipient notification rows. Rejected because it makes dedupe, audit, and future channel fanout harder.

### 3. Use a separate delivery record for channel outcomes

Each email draft or send outcome tied to a notification will be tracked in a delivery table, separate from the inbox record itself.

- Immediate invoice/proposal notifications can create a delivery record and perform real sending in the same action flow.
- Cron-created reminder notifications can create a delivery record in draft/pending state without sending automatically.

Why:
- The user explicitly chose draft-only reminder emails in v1.
- Delivery state must be inspectable independently from inbox state.
- This keeps the model extensible if reminder auto-send is enabled later.

Alternative considered:
- Put email metadata directly on notification rows. Rejected because one notification can have multiple delivery channels and states over time.

### 4. Realtime is an optimization, not the source of truth

Pusher will publish new inbox notifications to open sessions, but queries always read from Postgres.

Why:
- Realtime should update the UI immediately, but must not be required for correctness.
- Users can reconnect, refresh, or open the archive later without losing state.
- Polling fallback remains possible if Pusher is unavailable.

Alternative considered:
- Poll-only v1. Rejected because the requested bell experience calls for immediate updates and top-right popovers.

### 5. Scheduler time semantics are workspace-defined, not per-client

Reminder windows will be evaluated in Sri Lanka time for v1.

Why:
- The user explicitly chose Sri Lanka time.
- It avoids adding client-level timezone storage and conversion rules in the first version.

Trade-off:
- Future multi-region clients may need per-client timezone overrides. The policy model should store timezone as a settings field so this can be changed later without redesigning the scheduler.

### 6. Reminder messages live in settings, but rendering stays structured

Settings will expose editable copy fields for both in-app and email-draft reminders, but those templates will use structured variables instead of free-form arbitrary rendering logic.

Expected token set:
- `{{clientName}}`
- `{{projectName}}`
- `{{invoiceTitle}}`
- `{{amount}}`
- `{{currency}}`
- `{{dueDate}}`
- `{{accessExpiryDate}}`
- `{{portalUrl}}`

Why:
- Admins need control over wording.
- Structured placeholders keep rendering safe, testable, and previewable.
- This fits the existing template/settings direction better than embedding arbitrary code.

Alternative considered:
- Reuse only the full email template editor for all reminder copy. Rejected because in-app notification copy and reminder scheduling policy need a lighter settings workflow.

### 7. Settings get a dedicated cron notification section

Add a new admin settings area, exposed as a dedicated tab, for:
- scheduler status and last run visibility
- timezone
- reminder enablement
- reminder windows per reminder family
- in-app title/body templates
- reminder email subject/body templates

Why:
- The current settings shell already groups shared operational configuration.
- Reminder policy is an operations concern, not a project-local billing detail.

Alternative considered:
- Put cron settings under billing only. Rejected because access reminders and notification copy span billing, notifications, and email behavior together.

## Risks / Trade-offs

- **[Draft-only cron emails may confuse operators]** → Make the settings copy explicit that cron creates reminder drafts, and expose draft counts/last run status in settings and email workspace.
- **[Duplicate reminders on repeated cron runs]** → Use stable dedupe keys composed from entity id, reminder family, reminder offset, and scheduled local date.
- **[Reminder misses due to long cron cadence or cron failure]** → Keep cadence shorter than the smallest reminder window boundary needed for day-of 8:00 AM behavior, and record run failures visibly in settings.
- **[Immediate email send failure during invoice/proposal actions]** → Keep the core domain action durable first, then record failed delivery state and surface it to admins instead of rolling back the underlying business action.
- **[Settings become too powerful without preview]** → Require preview rendering for reminder message copy before saving or before marking a template active in implementation.
- **[Future per-client timezone support becomes hard]** → Store timezone on the reminder policy record even if v1 defaults it to Sri Lanka time.

## Migration Plan

1. Add notification schema tables and reminder policy settings storage.
2. Backfill a default reminder policy seeded with Sri Lanka timezone and the agreed windows.
3. Add admin and client read APIs with archive and unread count support.
4. Add bell popovers and archive page UIs.
5. Wire immediate event producers for invoice send, proposal send, approvals, proof flows, and invitation acceptance.
6. Add Railway cron entrypoint for scheduled reminder generation and run metadata.
7. Add settings UI for reminder policy and copy management.
8. Verify that cron-created reminder emails remain drafts in v1 while immediate invoice/proposal notifications preserve real email sends.

Rollback:
- The UI can be disabled independently from the cron entrypoint if needed.
- Realtime can be disabled without losing archive correctness because Postgres remains authoritative.
- Cron reminder creation can be paused by disabling the cron service and/or policy flags.

## Open Questions

- Whether admin operators need a separate operational notification email mode beyond the existing emails workspace remains deferred.
- Whether reminder emails should later auto-send from cron can be added on top of the delivery model without redesigning the event/inbox structure.
