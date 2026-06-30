## Context

The admin email route currently exists as a placeholder, while the admin portal plan already reserves `/admin/emails` for a communications workspace. The platform also already models clients, client members, projects, proposals, products, billing-related settings, and Resend configuration. Email now needs to become a real admin-operated system for onboarding, proposal follow-up, payment reminders, invoice/payment requests, and manual client outreach.

V1 is intentionally admin-only. Workflow events do not send emails automatically. They create suggested drafts that an admin can review, edit, and manually send. This keeps customer-facing communication deliberate while still letting the platform prepare the next best emails from project and billing state.

## Goals / Non-Goals

**Goals:**

- Replace the `/admin/emails` placeholder with a workspace for Templates, Compose, Suggested, and Sent.
- Use Easy Email as the preferred in-app visual builder for templates and drafts.
- Use Resend API as the only V1 outbound delivery provider.
- Persist editable builder source separately from rendered and sent output.
- Create a global Concolabs starter layout used by every new template and draft.
- Add typed templates, lifecycle states, global defaults, and project-level overrides.
- Add recipient selection for selected client members and client-level default contacts.
- Add cron-driven suggested draft generation with idempotent dedupe keys.
- Extend `/admin/settings` with email sender, reply-to, starter layout, template defaults, and cron status/configuration.

**Non-Goals:**

- Do not implement inbound email.
- Do not implement future send scheduling.
- Do not send workflow-triggered emails automatically in V1.
- Do not add client-facing email preference management.
- Do not support multiple outbound providers in V1.

## Decisions

### Use Easy Email for in-app authoring

Templates and drafts should use Easy Email source JSON as the editable representation. The admin UI owns the builder surface inside `/admin/emails`; external hosted builders such as Waypoint remain design references, not runtime dependencies.

Rationale: admins need a real visual block editor for images, text, buttons, and branded layouts. React Email is better for code-owned templates, but the product decision is that templates must be admin-editable.

### Keep a global starter layout

Every new template and manual draft should start from a global Concolabs starter layout stored in settings. The starter layout includes the logo/header structure and footer company information. Admins can still customize templates after creation.

Rationale: full editability without a shared starting point will make email quality drift. The starter layout keeps brand consistency while preserving admin control.

### Store editable source and immutable sends

Email templates and drafts store `builder_source_json`. Drafts also store the latest preview output. Sent emails store immutable `rendered_html` and `rendered_text` snapshots, plus subject, recipients, provider ids, and delivery status.

Rationale: source JSON is needed to reopen templates and drafts in editable mode. Sent snapshots are needed to prove exactly what was sent even after templates or settings change.

### Model templates, drafts, sends, and events separately

The schema should separate:

- `email_templates` for reusable typed templates.
- `email_template_assignments` for global defaults and project overrides.
- `email_drafts` for editable manual or suggested emails.
- `email_draft_recipients` for explicit resolved recipients before send.
- `sent_emails` for immutable send records.
- `sent_email_recipients` for final per-recipient delivery state.
- `email_delivery_events` for provider events and failures.
- `email_generation_runs` and/or `email_suggestion_keys` for cron observability and dedupe.
- `email_settings` for sender identity, reply-to, starter layout, footer, and cron configuration.

Rationale: a single email table would collapse editable work, immutable history, provider status, and cron dedupe into one ambiguous record. Separate tables keep admin workflows auditable.

### Use suggested drafts for workflow communication

The scheduled job scans due project and billing contexts, chooses the active template by project override then global default, and creates suggested drafts when a matching dedupe key does not already exist. Suggested drafts are normal drafts with `source = suggested` and can be edited before sending.

Rationale: this matches the V1 manual-send rule and lets the cron prepare work without sending customer-facing mail.

### Use Resend as the delivery boundary

The send action renders the draft, validates recipients, writes an immutable send record, calls Resend, and records provider metadata or failure. DocuSeal and billing flows can create suggested drafts, but the final email delivery still goes through this admin email service.

Rationale: Resend is already the planned provider and is simpler than introducing an SMTP abstraction before there is a second provider.

### Put operational defaults in Settings

Settings should expose sender identity, reply-to, starter layout/footer configuration, default template assignment per type, cron cadence, and last run status. Product webhook dispatch configuration remains part of the broader billing/product settings, but the email suggestion job should show its own status.

Rationale: admins need one place to understand how outbound email behaves before using the email workspace.

## Risks / Trade-offs

- Easy Email output may need extra validation before Resend delivery. Mitigation: render and validate on the server before send, and block sends when HTML/text output cannot be produced.
- Admins can create weak templates if everything is editable. Mitigation: enforce the starter layout for new records and show active/draft/archive states clearly.
- Cron can create duplicate suggestions. Mitigation: use stable dedupe keys such as `templateType:clientId:projectId:entityType:entityId:window`.
- Sent emails can diverge from current templates. Mitigation: this is intentional; immutable snapshots are the audit source.
- Resend failures can happen after a send is requested. Mitigation: write delivery status records and surface failures in Sent/Suggested status areas.
- The email workspace touches clients, projects, proposals, billing, settings, and cron. Mitigation: keep the first implementation modular around an `admin.emails` router and a server email service.

## Migration Plan

1. Add dependencies for Easy Email and MJML/HTML rendering support.
2. Add Drizzle schema and migration for email settings, templates, assignments, drafts, recipients, sent snapshots, delivery events, and suggestion dedupe/run tables.
3. Seed or lazily create the default email settings row with the global starter layout.
4. Add server render and Resend delivery services.
5. Add admin tRPC procedures for templates, drafts, recipients, sends, sent archive, suggestions, and settings.
6. Replace `/admin/emails` placeholder with the workspace UI.
7. Extend `/admin/settings` with email configuration.
8. Add a cron route/job for suggested drafts and billing/product invalidation handoff.
9. Run typecheck and manual QA for template creation, draft composition, sending, settings, and cron dedupe.

Rollback strategy: hide the Emails nav entry or route content, leave sent snapshots untouched, and disable the cron route. Existing sent email records are append-only audit data and should not be deleted during rollback.

## Open Questions

- Exact cron cadence defaults to 24h unless product needs force a 12h schedule.
- Exact Resend verified sender address is environment-specific.
- Whether Resend webhooks should be wired in V1 is optional; the send action must still record immediate API success/failure.
