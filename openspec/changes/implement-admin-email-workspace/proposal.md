## Why

The admin email area is currently a placeholder, but email is becoming a core operating surface for client onboarding, proposal follow-up, billing reminders, and sales outreach. Concolabs needs a polished, editable, admin-controlled email workspace that keeps the customer experience high while preserving exact send history and avoiding automatic workflow emails in V1.

## What Changes

- Add a real `/admin/emails` workspace with V1 sections for Templates, Compose, Suggested, and Sent.
- Add an in-app visual email authoring workflow, using Easy Email as the preferred editor, so admins can create and edit branded email templates without code changes.
- Add a global Concolabs starter layout that every new email and template starts from, including logo, shared brand structure, and footer company information.
- Add typed templates for welcome, proposal, payment reminder, invoice, and general outreach emails.
- Add template lifecycle states: `draft`, `active`, and `archived`.
- Add email draft records that store editable `builder_source_json` plus current rendered preview output.
- Add immutable sent-email snapshots storing `rendered_html`, `rendered_text`, recipients, provider metadata, and delivery status.
- Add recipient selection for both selected client members and client-level default contacts.
- Add global default template assignments with project-level overrides.
- Add a cron-driven suggested draft generation process that runs on a 12h or 24h cadence and dedupes drafts by event/context key.
- Add Resend API delivery for manually approved sends.
- Extend `/admin/settings` with email configuration for sender identity, reply-to address, brand footer/starter layout settings, default template assignments, and cron status/configuration visibility.
- Keep inbound email, future send scheduling, and real client preference management out of V1.

## Capabilities

### New Capabilities

- `admin-email-workspace`: Admin workspace navigation and UI behavior for Templates, Compose, Suggested, and Sent email sections.
- `email-template-management`: Branded starter layout, typed templates, template lifecycle, template rendering, and default/override assignment behavior.
- `email-draft-and-sending`: Draft composition, recipient selection, rendered preview, Resend delivery, immutable sent snapshots, and failure visibility.
- `email-suggestion-cron`: Scheduled suggested draft generation, dedupe behavior, workflow context scanning, and cron run observability.
- `email-settings-management`: Admin settings for Resend sender configuration, reply-to, starter layout/brand footer, template defaults, and cron configuration/status.

### Modified Capabilities

- None.

## Impact

- Adds new Drizzle schema for email templates, template assignments, email drafts, draft recipients, sent emails, delivery events, email settings, and cron generation state.
- Adds admin tRPC procedures for template management, draft management, recipient lookup, send actions, sent archive reads, suggested draft review, and email settings.
- Adds a server-side Resend delivery service and rendering pipeline from Easy Email source to HTML/text.
- Adds or extends a cron route/job for suggested email generation and centralized background work related to billing/product webhook invalidation.
- Adds Easy Email and supporting render dependencies.
- Replaces the placeholder `/admin/emails` page with a real admin workspace.
- Extends `/admin/settings` with an email configuration surface.
