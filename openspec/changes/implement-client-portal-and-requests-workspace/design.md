## Context

The repo already contains three partial building blocks for the target product:

- a real admin project workspace under `/admin/projects/[projectId]/...`,
- an admin-authenticated client-preview mode for that workspace,
- a placeholder `/client-portal` shell that already enforces Clerk org-scoped access through `requireClientPortalAccess()`.

The missing piece is the real client-facing operating surface. Clients need to browse their projects, open the same workspace concepts that admins preview today, request new projects, and request scoped changes on existing projects. The admin side also needs a real intake workspace for those requests instead of the current placeholder `/admin/requests` page.

The user explicitly prefers lower complexity over aggressive abstraction. That means the implementation should keep top-level admin and client portal shells separate, while reusing only the deeper project features that already match across admin preview and real client usage.

## Goals / Non-Goals

**Goals:**

- Build a top-navigation client portal with `Dashboard`, `Projects`, `Billing`, and `Settings`.
- Add a real client projects page and real client project detail routes.
- Reuse existing project feature components where client behavior already matches admin client-preview behavior.
- Add a project request flow from the client projects page with rich text and multiple attachments.
- Add a project-scoped change request flow inside client project workspaces with rich text, multiple attachments, and request history.
- Replace `/admin/requests` with a real admin request workspace split into `Project Requests` and `Change Requests`.
- Add configurable request-notification recipients in admin settings and send request submission emails to that list.

**Non-Goals:**

- Do not unify admin and client top-level shells into one configurable master shell.
- Do not expand client settings beyond profile/company information in this change.
- Do not implement client-side billing actions, invoice payment flows, or new billing engine behavior in this change.
- Do not implement client-side messaging/chat in this change.
- Do not merge new project requests and change requests into one table or one workflow model.

## Decisions

### Keep admin and client shells separate

The admin shell and client portal shell will remain separate top-level components and routes. The client portal will get its own topbar, nav items, and page shell instead of turning admin and client into one configurable layout abstraction.

Rationale: the product directions are similar, but not identical. Separate top-level shells keep the code easier to read and change while still allowing shared lower-level project components.

Alternative considered: one shared app shell with variant props. Rejected because it increases indirection in the part of the app the user most wants kept simple.

### Reuse project feature surfaces, not shell orchestration

The real client project workspace will reuse feature-level pieces that are already aligned:

- project identity card,
- section navigation presentation,
- overview surface,
- timeline canvas in read-only mode,
- proposal list/detail surfaces,
- file list surface,
- read-only payments surface scaffolding.

The outer client workspace wrapper will be a separate component built for `/client-portal/projects/[projectId]/...`, but it may call shared child components where the behavior is the same.

Rationale: this preserves reuse where the UI is genuinely shared, while avoiding a large polymorphic shell component.

Alternative considered: extend the current `ProjectWorkspaceShell` into a three-mode shell (`admin`, `client-preview`, `client`). Rejected because it makes the highest-level workspace component carry too many concerns for a low-complexity codebase.

### Use two request tables and two admin inbox tabs

The admin requests workspace will expose two tabs:

- `Project Requests`
- `Change Requests`

Those tabs will map to two separate storage models:

- existing `project_requests` for new project requests,
- new `project_change_requests` for project-scoped change requests.

Rationale: the user explicitly wants the concepts kept separate. Change requests are project-bound and have different context from new project requests even if their UI patterns look similar.

Alternative considered: one unified request table with a `requestType`. Rejected by product direction.

### Use asset-backed attachments with request-specific link tables

Both request flows support multiple attachments. Attachments should reuse the existing `assets` table and R2 upload model, but request ownership should remain explicit in relational tables:

- `project_request_attachments`
- `project_change_request_attachments`

Each row links one asset to one request, preserving timestamps and future ordering flexibility.

Rationale: assets already own file metadata and storage identity, while request-specific link tables make request history and cleanup straightforward without overloading `scopeType/scopeId` as the only source of truth.

Alternative considered: rely only on `assets.scopeType/scopeId`. Rejected because multiple attachments and future per-request metadata become harder to reason about.

### Store request-notification recipients in email settings

Request-notification recipients will be configured in admin settings by extending the existing singleton `email_settings` model with a dedicated JSON array field such as `requestNotificationEmails`.

Rationale: this is operationally an email configuration concern, the settings surface already exists, and a validated JSON array is the simplest implementation that still supports multiple recipients.

Alternative considered: a standalone `request_notification_recipients` table. Rejected for V1 because it adds CRUD surface and schema complexity without changing the actual product behavior.

### Keep request review lifecycle simple

Both request types will use the same simple review lifecycle in V1:

- `pending`
- `approved`
- `rejected`

Project requests may optionally link to a created `projectId` after approval. Change requests remain project-scoped and do not create a second project entity.

Rationale: the repo already uses that lifecycle for `project_requests`, and the user’s current need is intake, visibility, and review rather than a larger workflow engine.

### Client portal authorization stays org-scoped and project-filtered

Client portal route access continues to start from the active Clerk org via `requireClientPortalAccess()`. Every client project workspace read must then be filtered by `clientId` ownership so clients only see projects, proposals, files, payments, and requests for their own organization.

Rationale: the current auth helper already resolves the active client cleanly. The new work should extend that boundary rather than introduce a parallel auth model.

## Risks / Trade-offs

- Separate shells can duplicate some markup → Mitigation: accept small duplication at the top level and share only deeper feature components.
- Client reuse of admin-preview feature components can accidentally leak admin controls → Mitigation: keep client routes on separate wrappers and pass only client-safe props/actions to shared children.
- Multiple request attachments increase storage/orphan risk → Mitigation: create attachment rows only after successful asset registration and keep assets client-scoped.
- Reusing placeholder billing and messages pages can feel incomplete → Mitigation: make those states clearly read-only/coming-soon rather than exposing broken actions.
- Request-notification recipient emails stored as JSON reduce relational flexibility → Mitigation: validate strictly in server procedures and keep the field isolated so it can be promoted to a table later if needed.

## Migration Plan

1. Extend schema for `project_change_requests`, request attachment link tables, and the request-notification emails field on `email_settings`.
2. Generate and apply the Drizzle migration.
3. Add client portal routes and top-nav shell, replacing the current sidebar-first portal shell.
4. Add client projects list and project detail pages using shared project feature components where safe.
5. Add client request project and request change submission flows with upload support.
6. Replace `/admin/requests` placeholder with the real split-tab workspace.
7. Extend admin settings with request-notification recipient editing.
8. Add request notification email sending on successful request submission.
9. Run typecheck and route-level QA for both admin and client portal paths.

Rollback strategy: remove links to the new client project/request surfaces, revert the schema migration, and restore the placeholder admin requests/settings behavior. Because the request models are additive, rollback does not require altering existing project workspace data.

## Open Questions

- None for this change package. Environment-specific recipient values are runtime configuration, not product design blockers.
