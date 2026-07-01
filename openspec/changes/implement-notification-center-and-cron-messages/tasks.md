## 1. Notification data model and server primitives

- [x] 1.1 Add Postgres schema for notification events, recipient inbox notifications, delivery records, reminder policy settings, and reminder run observability.
- [x] 1.2 Add typed notification event definitions and shared helper utilities for dedupe keys, recipient fanout, and link/metadata shaping.
- [x] 1.3 Implement a central server entrypoint for recording immediate notification events and expanding them into recipient inbox rows and delivery rows.

## 2. Immediate notification producers

- [x] 2.1 Wire invoice send flows to create client notification events, inbox rows, and delivery state.
- [x] 2.2 Wire proposal send flows to create client notification events, inbox rows, and delivery state.
- [x] 2.3 Wire request review, payment proof, and invitation-acceptance paths to create the agreed admin/client notification outcomes.

## 3. Read APIs and realtime fanout

- [x] 3.1 Add admin notification tRPC procedures for unread count, recent list, archive list, mark-read, and mark-all-read.
- [x] 3.2 Add client-portal notification tRPC procedures with active-client scoping and matching read-state operations.
- [x] 3.3 Integrate Pusher-based realtime fanout for newly created inbox notifications while keeping Postgres reads authoritative.

## 4. Portal notification UI

- [x] 4.1 Replace the admin bell placeholder behavior with a real popover, unread badge, and archive route implementation at `/admin/notifications`.
- [x] 4.2 Add the client portal notification popover, unread badge, and archive route at `/client-portal/notifications`.
- [x] 4.3 Add top-right “new notification” surfacing for realtime arrivals without duplicating archive state.

## 5. Cron reminder policy and settings

- [x] 5.1 Add a dedicated admin settings tab for cron notification messages and reminder policy management.
- [x] 5.2 Implement settings forms for Sri Lanka timezone, reminder enablement, supported reminder windows, in-app copy, and reminder email draft copy.
- [x] 5.3 Expose scheduler status, last run data, and configuration previews in the new settings section.

## 6. Railway cron reminder generation

- [x] 6.1 Implement the cron entrypoint that loads reminder policy settings and evaluates billing/access reminder windows in Sri Lanka time.
- [x] 6.2 Generate deduped reminder notification events for `T-7`, `T-1`, `T0 at 8:00 AM`, `+1`, `+3`, and `+7` windows for both payment due and access expiry flows.
- [x] 6.3 Create reminder inbox notifications and reminder email draft/delivery rows from cron runs without auto-sending those reminder emails in v1.

## 7. Verification and rollout readiness

- [x] 7.1 Add automated coverage for notification read-state, client scoping, dedupe behavior, and immediate invoice/proposal notification outcomes.
- [x] 7.2 Add automated coverage for cron reminder window evaluation, day-of 8:00 AM Sri Lanka time handling, and reminder draft-only email behavior.
- [x] 7.3 Verify admin/client settings visibility, archive flows, realtime fallback behavior, and run observability before implementation handoff.
