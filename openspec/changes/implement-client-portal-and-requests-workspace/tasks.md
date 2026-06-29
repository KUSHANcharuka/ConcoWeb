## 1. Schema and data foundations

- [x] 1.1 Extend the request schema by adding `project_change_requests` plus request attachment link tables for project requests and change requests.
- [x] 1.2 Extend `email_settings` with a validated request-notification email list field and update exported schema/index wiring.
- [x] 1.3 Generate the Drizzle migration for the new request tables, attachment links, and email settings field.

## 2. Client portal data and procedures

- [x] 2.1 Add client-portal server reads for project lists, project workspace context, and request history scoped by the active client org.
- [x] 2.2 Add client-portal mutations for new project request submission, change request submission, and request attachment upload preparation.
- [x] 2.3 Reuse the asset/R2 upload flow for request attachments and enforce client/project scope validation on every read and mutation.

## 3. Client portal shell and project surfaces

- [x] 3.1 Replace the current sidebar-first client portal shell with a top-navigation shell containing `Dashboard`, `Projects`, `Billing`, and `Settings`.
- [x] 3.2 Build the real `/client-portal/projects` page with project cards, search/status/type filters, contextual request visibility, and the `Request project` entry point.
- [x] 3.3 Add `/client-portal/projects/[projectId]/...` routes for `Overview`, `Timeline`, `Proposals`, `Files`, `Payments`, `Messages`, and `Request Change`.
- [x] 3.4 Reuse existing project feature components where safe, while removing admin-only controls from the real client workspace wrappers.

## 4. Client request flows

- [x] 4.1 Build the `Request project` dialog/form with rich text input, multiple attachments, and submission feedback.
- [x] 4.2 Build the project-scoped `Request Change` page with rich text input, multiple attachments, and request history.
- [x] 4.3 Keep Billing and Messages client routes visible but read-only/placeholder as defined for V1.

## 5. Admin requests and request settings

- [x] 5.1 Replace the placeholder `/admin/requests` page with a real workspace containing `Project Requests` and `Change Requests` tabs.
- [x] 5.2 Add admin request listing, search/filter behavior, detail surfaces, attachment visibility, and approve/reject actions for both request types.
- [x] 5.3 Extend admin settings with a request-notification recipient editor backed by `email_settings`.
- [x] 5.4 Send request notification emails on successful project request and change request submission, while allowing submission to succeed when the recipient list is empty.

## 6. Validation and rollout checks

- [ ] 6.1 Verify client portal auth and project scoping so cross-client project and request access is rejected.
- [x] 6.2 Run typecheck and any repo-standard validation for the new client portal, request workspace, and settings flows.
- [ ] 6.3 Manually QA the client and admin routes for request submission, request review, placeholder sections, and attachment handling.
