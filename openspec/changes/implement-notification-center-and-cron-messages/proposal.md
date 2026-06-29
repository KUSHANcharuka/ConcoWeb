## Why

The admin and client portal shells already expose notification affordances, but there is no durable notification system behind them. Concolabs now needs a real notification center because invoices, payment proofs, request approvals, proposal sends, invitation acceptance, and access-expiry reminders are core portal behaviors rather than optional follow-up communication.

## What Changes

- Add a shared notification center for both `/admin` and `/client-portal`, including bell unread counts, recent popovers, and full archive pages.
- Introduce durable notification event and recipient inbox records in Postgres so notifications can be read, marked read, and replayed independently of live sessions.
- Add realtime fanout for newly created inbox notifications so open portal sessions update immediately.
- Add scheduled reminder generation for payment due dates and access expiry windows using a dedicated external cron runner.
- Support reminder windows for `T-7`, `T-1`, `day-of at 8:00 AM Sri Lanka time`, and overdue/expired follow-ups at `+1`, `+3`, and `+7` days.
- Add admin settings to manage cron-driven reminder policies and the copy used for reminder notifications and reminder email drafts.
- Create draft email delivery records for cron reminders in v1 without automatically sending them; admins can explicitly send those emails after review.
- Send immediate client notifications for admin-triggered invoice sends and proposal sends, with both in-app notification creation and email delivery behavior covered by the change.

## Capabilities

### New Capabilities
- `notification-center`: Shared in-app notifications for admin and client portals, including inbox state, unread counts, realtime updates, and archive views.
- `scheduled-notification-policy`: Configurable cron-driven reminder windows and reminder message configuration for billing and access-expiry workflows.
- `notification-settings-management`: Admin settings for cron reminder cadence, reminder windows, in-app message copy, and reminder email draft copy.

### Modified Capabilities
- None.

## Impact

- Affected code includes portal shell UI, admin notifications route, future client notifications route, settings navigation, settings forms, billing flows, proposal send flows, and webhook-triggered membership/invitation sync paths.
- Affected server systems include Postgres schema, tRPC routers, reminder-generation logic, email draft creation, and realtime fanout infrastructure.
- New external dependencies or integrations are expected for realtime delivery and the external cron host.
