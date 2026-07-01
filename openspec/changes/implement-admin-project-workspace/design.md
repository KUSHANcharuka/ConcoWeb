## Context

The current admin project area is placeholder-level, while the intended project workspace has been clarified through the Paper design reference at `https://app.paper.design/file/01KVSYSVQ8ZZPTN6TK0JVFRS9T/1-0` and the repo planning docs. V1 focuses on admin pages only: the real client portal route is not part of this change. Admin users still need a client-facing preview inside the admin area so they can verify what clients would see.

The Paper reference defines the visual direction: a light project shell with a left workspace sidebar, breadcrumb/search utility row, serif page headings, compact date/filter controls, and a timeline canvas that feels like a designed work surface rather than a table. The admin implementation must preserve that shell while adding edit controls for Concolabs staff.

The current repo already has a Next.js App Router admin shell, Clerk-based admin gating, Drizzle/Neon schema files, R2 helpers, Kibo dropzone components, and the admin project data model document. The new work should extend those patterns instead of introducing a separate app architecture.

## Goals / Non-Goals

**Goals:**

- Build admin-only project workspace routes under `/admin/projects/[projectId]/...`.
- Build admin-authenticated client preview routes under `/admin/projects/[projectId]/client-view/...`.
- Keep a persistent segmented `Admin View / Client View` switch below the admin top navigation.
- Reuse shared project workspace components for Admin View and Client View.
- Implement Overview, Timeline, Proposals, and Files as real DB-backed tabs.
- Use React Flow for the editable timeline canvas.
- Use self-hosted DocuSeal for proposal builder/signing embeds.
- Use R2 and the asset model for proposal source documents and project files.
- Use Kibo UI components where they reduce boilerplate, especially upload/dropzone interactions.

**Non-Goals:**

- Do not build the real `/client-portal/projects/[projectId]` route in this change.
- Do not build billing/payment workflows.
- Do not build messages/chat workflows.
- Do not build a custom proposal document editor or PDF viewer.
- Do not implement admin-only/private file visibility in V1; all project files are visible in the admin client preview.
- Do not replace Clerk admin authorization or R2 object authorization boundaries.

## Decisions

### Use admin routes with client-preview subroutes

Project workspace routes will use the existing admin namespace:

- `/admin/projects/[projectId]/overview`
- `/admin/projects/[projectId]/timeline`
- `/admin/projects/[projectId]/proposals`
- `/admin/projects/[projectId]/files`
- `/admin/projects/[projectId]/client-view/overview`
- `/admin/projects/[projectId]/client-view/timeline`
- `/admin/projects/[projectId]/client-view/proposals`
- `/admin/projects/[projectId]/client-view/files`

Rationale: this preserves admin auth, keeps the implementation admin-only for V1, and still gives each project section a direct URL. The root `/admin/projects/[projectId]` should redirect to `/overview`.

Alternative considered: use the real client portal route. Rejected for V1 because it requires client org context and true client authorization flows that are outside the admin-only scope.

### Build one shared project workspace shell with view mode

The shell should be shared and receive a mode such as `admin` or `client-preview`. The shell owns the Paper-inspired layout: project sidebar, project breadcrumb/top utility row, section heading area, date/filter controls, and content slot. Admin mode enables edit affordances. Client-preview mode renders read-only UI with a subtle preview banner and keeps the admin top nav visible.

Rationale: the admin view is a richer edit view of the same client-facing project data, not a separate product.

### Use React Flow for timeline editing

The timeline tab should use `@xyflow/react` for pan, zoom, custom nodes, connectors, controlled node state, and persisted node positions. Timeline items should store business fields such as title, type, status, dates, and description, plus layout fields for canvas position.

Rationale: full drag editing, repositioning, zoom controls, and connectors are high-risk to hand-roll. React Flow provides the interaction model while custom node components preserve the Paper visual style.

Alternative considered: custom SVG/canvas pointer logic. Rejected because it would create unnecessary interaction and accessibility risk.

### Use DocuSeal as the proposal document surface

The proposals tab should integrate with a self-hosted DocuSeal deployment:

- Admin View embeds `<docuseal-builder>` using a server-generated builder token and an R2 source document URL.
- Client View embeds `<docuseal-form>` using the stored DocuSeal submitter embed URL.
- Concolabs stores proposal records, source asset references, DocuSeal template/submission/submitter metadata, comments, and proposal state.
- DocuSeal complete/decline webhooks update Concolabs proposal status.

Rationale: the user explicitly wants DocuSeal for document creation/signing. Concolabs should own workflow context and comments, but not rebuild DocuSeal's document editing/signing UI.

### Keep proposal comments separate from DocuSeal

Proposal comments should be stored in Concolabs DB and shown in a side panel. V1 comments are proposal-level side comments, not exact text-selection anchors inside the embedded DocuSeal document.

Rationale: DocuSeal does not provide the requested comment model as a first-class embedded API. A separate side panel is reliable and keeps comments under Concolabs permissions/audit.

### Use R2 assets for files and proposal sources

All project files, folders, and proposal source documents should use R2-backed assets. The app should use short-lived upload/read URLs and DB metadata for authorization and UI state.

Rationale: project documents are confidential. R2 object keys are storage details, not access rules. Authorization must go through `client_id` and `project_id`.

### Files are project-visible in V1

The Files tab should not expose admin-only file visibility in V1. Admin View has management controls. Client-preview view shows the same file tree read-only.

Rationale: this matches the latest scope decision and keeps the first file manager simpler. The data model may still keep visibility fields for future expansion, but the V1 UI should not expose them.

## Risks / Trade-offs

- React Flow may not exactly match the Paper visual timeline by default. Mitigation: hide/default-minimize library chrome and use custom node, edge, panel, and control styling.
- DocuSeal builder/form web components can be difficult to type in React/TypeScript. Mitigation: wrap each embed in small client-only components with explicit script loading and typed event bridges.
- DocuSeal webhooks can arrive out of order or more than once. Mitigation: make webhook updates idempotent by DocuSeal submission/submitter id and only allow valid state transitions.
- R2 signed URL access can leak if cached in client state for too long. Mitigation: keep read URLs short-lived and fetch them through authorized tRPC/server procedures.
- A one-pass build across shell, timeline, proposals, and files is large. Mitigation: keep modules separated by tab, with shared shell contracts and independent procedures per domain.
- Client-preview is not the real client portal. Mitigation: label it clearly with a small preview banner and keep client mutations disabled unless explicitly admin-safe.

## Migration Plan

1. Extend schema for project timeline, proposals, proposal comments, DocuSeal metadata, project folders, and project files.
2. Generate/apply Drizzle migration for the new tables and enum changes.
3. Add required environment variables for self-hosted DocuSeal and ensure R2 env remains configured.
4. Add shared project workspace shell and routes with placeholder content.
5. Add Overview dashboard from real project/timeline/proposal/file data.
6. Add Timeline tab and React Flow dependency.
7. Add Files tab and R2 file manager.
8. Add Proposals tab, DocuSeal embeds, and webhook route.
9. Run typecheck and manual admin-route QA.

Rollback strategy: disable links to the new project workspace routes and revert the migration before data is relied on in production. If DocuSeal integration fails independently, keep proposal tab visible with an integration error state while Overview, Timeline, and Files remain usable.

## Open Questions

- Exact self-hosted DocuSeal base URL and API key values are environment-specific.
- Whether completed DocuSeal PDFs/audit logs should be copied into R2 is deferred.
- Whether future real client portal routes should reuse the same shell directly or wrap the admin preview shell with stricter auth is deferred.
