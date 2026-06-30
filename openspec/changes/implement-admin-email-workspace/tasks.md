## 1. Dependencies and Schema

- [x] 1.1 Add Easy Email editor/core/extensions and MJML render dependencies to the project
- [x] 1.2 Add Drizzle enums for email template type, template status, draft source, draft status, recipient mode, sent status, delivery event type, and cron run status
- [x] 1.3 Add `email_settings` schema for Resend sender identity, reply-to, starter layout source, footer/company information, cron cadence, and timestamps
- [x] 1.4 Add `email_templates` schema with type, status, subject, builder source JSON, rendered preview fields, audit fields, and timestamps
- [x] 1.5 Add `email_template_assignments` schema for global defaults and project-level overrides
- [x] 1.6 Add `email_drafts` schema with manual/suggested source, client/project context, template reference, subject, builder source JSON, rendered preview fields, dedupe key, trigger metadata, and timestamps
- [x] 1.7 Add `email_draft_recipients` schema for selected member recipients and client default contact recipients
- [x] 1.8 Add `sent_emails`, `sent_email_recipients`, and `email_delivery_events` schemas for immutable snapshots and provider status
- [x] 1.9 Add `email_generation_runs` and suggestion dedupe tracking schema for cron observability
- [x] 1.10 Generate and review the Drizzle migration for all new email tables and enums

## 2. Rendering, Resend, and Cron Services

- [x] 2.1 Implement a server email settings loader that creates or returns the default settings row
- [x] 2.2 Implement a starter layout factory for new templates and scratch drafts
- [x] 2.3 Implement an Easy Email render service that converts builder source JSON into rendered HTML and text
- [x] 2.4 Implement a Resend delivery service that sends rendered snapshots and returns provider metadata
- [x] 2.5 Implement immutable sent snapshot creation before provider delivery
- [x] 2.6 Implement send failure recording for Resend/API/render errors
- [x] 2.7 Implement template resolution using project override before global default
- [x] 2.8 Implement suggested draft generation for welcome, proposal, payment reminder, invoice, and general outreach contexts where source data exists
- [x] 2.9 Implement stable dedupe key generation and duplicate skipping for suggested drafts
- [x] 2.10 Add a scheduled cron route/job that records run status, creates suggested drafts, and keeps email results independent from billing/product invalidation failures

## 3. Admin API

- [x] 3.1 Add an `admin.emails` tRPC router and register it in the API root
- [x] 3.2 Add template list/get/create/update/archive/activate procedures
- [x] 3.3 Add template assignment procedures for global defaults and project overrides
- [x] 3.4 Add draft create/get/update/delete procedures for manual and suggested drafts
- [x] 3.5 Add recipient lookup procedures for clients, client members, and client default contacts
- [x] 3.6 Add draft recipient update procedures for selected-member and client-default modes
- [x] 3.7 Add draft preview/render procedure
- [x] 3.8 Add send procedure that validates recipients, renders the draft, creates the immutable snapshot, calls Resend, and records status
- [x] 3.9 Add sent email list/get procedures with read-only snapshot output
- [x] 3.10 Add settings get/update procedures for email sender, reply-to, starter layout, footer, default templates, and cron status

## 4. Email Workspace UI

- [x] 4.1 Replace the `/admin/emails` placeholder with a real email workspace shell
- [x] 4.2 Add workspace navigation for Templates, Compose, Suggested, and Sent
- [x] 4.3 Build the Easy Email builder wrapper with load/save/render controls and branded default dimensions
- [x] 4.4 Build Templates list with filters for type and status
- [x] 4.5 Build template create/edit flow using the global starter layout or existing template source
- [x] 4.6 Build template lifecycle controls for draft, active, and archived states
- [x] 4.7 Build Compose flow for creating a manual draft from a template or starter layout
- [x] 4.8 Build recipient selection UI for selected client members and client default contact mode
- [x] 4.9 Build Suggested list and review/edit/send flow for cron-created drafts
- [x] 4.10 Build Sent archive with read-only email snapshot viewer, recipients, and provider status
- [x] 4.11 Add empty, loading, error, and failed-send states for all email workspace sections

## 5. Settings UI

- [x] 5.1 Extend `/admin/settings` with an Email settings section
- [x] 5.2 Add controls for Resend sender/from identity and reply-to address
- [x] 5.3 Add controls for starter layout source, logo/header information, and footer company information
- [x] 5.4 Add default template assignment controls per template type
- [x] 5.5 Add cron cadence and last run status display
- [x] 5.6 Ensure settings changes affect new templates/drafts only and do not mutate sent snapshots

## 6. Integration Points

- [x] 6.1 Connect client onboarding/member registration contexts to suggested welcome draft generation
- [x] 6.2 Connect proposal contexts to suggested proposal follow-up draft generation without DocuSeal auto-email
- [x] 6.3 Connect billing due/payment request contexts to suggested payment reminder and invoice drafts
- [x] 6.4 Connect project-level template overrides to project workflows that create suggested drafts
- [x] 6.5 Keep inbound email and future scheduling hidden or disabled in V1 UI

## 7. Validation

- [x] 7.1 Run `npm run typecheck`
- [x] 7.2 Run OpenSpec validation for `implement-admin-email-workspace`
- [ ] 7.3 Manually verify template creation starts from the global starter layout
- [ ] 7.4 Manually verify template lifecycle states and archive filtering
- [ ] 7.5 Manually verify draft save persists builder source JSON and rendered preview
- [ ] 7.6 Manually verify selected-member and client-default recipient modes
- [ ] 7.7 Manually verify sending creates immutable sent snapshots and records Resend metadata
- [ ] 7.8 Manually verify template edits and settings edits do not mutate sent snapshots
- [ ] 7.9 Manually verify cron suggestion dedupe by invoking the cron twice for the same context
- [ ] 7.10 Manually verify project-level template override wins over global default
- [ ] 7.11 Manually verify failed Resend delivery appears in admin email status
