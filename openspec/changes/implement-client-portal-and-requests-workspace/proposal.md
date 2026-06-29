## Why

The real client portal is still placeholder-level even though the admin project workspace, client data model, and request concepts already exist in the repo. Concolabs now needs a client-authenticated operating surface for projects plus a clear request intake workflow so clients can request new work, request project changes, review proposals, and see files without relying on admin-preview routes.

## What Changes

- Replace the current sidebar-first client portal shell with a top-navigation client workspace that visually aligns with the admin portal while remaining its own route surface.
- Add real `/client-portal/projects` and `/client-portal/projects/[projectId]/...` routes using the existing project workspace components where the client and admin preview experiences already match.
- Keep the client top navigation limited to `Dashboard`, `Projects`, `Billing`, and `Settings`.
- Add a `Request project` flow from the client projects page with rich-text requirements and multiple attachments.
- Add a `Request change` section inside each client project workspace with rich-text input, multiple attachments, and project-scoped request history.
- Replace the placeholder `/admin/requests` page with a real admin request workspace split into `Project Requests` and `Change Requests`.
- Add configurable request-notification recipients in admin settings so submitted requests notify a maintained internal email list.
- Keep client billing, messages, and broader settings workflows narrow in V1:
  - billing stays placeholder/read-only,
  - messages stay placeholder,
  - settings stay profile/company-only.

## Capabilities

### New Capabilities

- `client-portal-shell`: Top-navigation client portal shell, routing, and authenticated client workspace behavior.
- `client-project-workspace`: Real client project list and project detail workspace using shared project feature surfaces with client-safe controls.
- `client-project-requests`: Client-submitted new project requests with rich-text details, multiple attachments, and client-side submission entry points.
- `project-change-requests`: Project-scoped change request creation and history for client workspaces, with attachments and admin review flow.
- `admin-request-workspace`: Admin request inbox with separate project-request and change-request views, request detail surfaces, and status handling.
- `request-notification-settings`: Admin-managed recipient settings for request submission notification emails.

### Modified Capabilities

- None.

## Impact

- Adds real client portal routes below `src/app/client-portal/...` and real request management UI below `src/app/admin/requests`.
- Extends shared project workspace components while keeping top-level admin and client portal shells separate for simplicity.
- Adds new request-side schema and procedures, including a dedicated change-request model and attachment handling through the existing asset/R2 system.
- Extends admin settings with request-notification recipient configuration and server-side request notification email delivery.
- Reuses Clerk org-scoped client auth, existing project workspace data loaders, Kibo upload primitives, and the current R2-backed asset infrastructure.
