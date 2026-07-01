## Why

The admin project workspace is the operating surface where Concolabs staff manage a client project after it is created. The current admin project area is still placeholder-level, while the product direction now requires a Paper-designed project shell with admin-only editing tools and an admin-authenticated client preview of the same project experience.

## What Changes

- Add an admin-only project workspace under `/admin/projects/[projectId]/...` with Overview, Timeline, Proposals, Files, and deferred placeholder tabs for Payments and Messages.
- Add `/admin/projects/[projectId]/client-view/...` routes that render the client-facing project view inside the admin area as a read-only preview.
- Add a persistent segmented `Admin View / Client View` switch below the admin top navigation on project workspace routes.
- Implement the Paper design reference for the project shell:
  - left project sidebar,
  - breadcrumb/search/utility top row,
  - serif section headings,
  - compact date/filter controls,
  - soft panel timeline canvas with a horizontal rail, milestone cards, zoom controls, and jump-to-today.
- Implement a real Overview dashboard using core project status, dates, current timeline item, latest proposal status, and file counts.
- Implement a real Timeline tab using React Flow for draggable editable admin timeline nodes and read-only client preview nodes.
- Implement a real Proposals tab using self-hosted DocuSeal:
  - admin embeds `<docuseal-builder>`,
  - client preview embeds `<docuseal-form>`,
  - source proposal documents are uploaded to R2,
  - proposal side comments are stored in Concolabs DB,
  - DocuSeal complete/decline webhooks update proposal status.
- Implement a real Files tab with R2-backed nested folders, uploads, downloads, rename/delete, and move support.
- Use shared React components for project shell and tab content so admin and client preview render the same project data with different capabilities.
- Use Kibo UI elements where they reduce custom UI work, especially file/dropzone interactions.
- Do not implement billing/payments or messages workflows in this change; keep those tabs as visible placeholders.

## Capabilities

### New Capabilities

- `admin-project-workspace`: Admin project workspace shell, routing, Admin View / Client View switching, overview dashboard, and preview behavior.
- `project-timeline-management`: Admin editable and client-preview read-only project timeline canvas backed by project timeline records.
- `project-proposal-docuseal`: Proposal document upload, DocuSeal builder/form embedding, proposal side comments, and complete/decline webhook state updates.
- `project-file-management`: R2-backed project folders and files with nested folder navigation, upload, download, rename/delete, and move operations.

### Modified Capabilities

- None.

## Impact

- Adds admin project detail routes below `src/app/admin/projects/[projectId]/...`.
- Adds shared project workspace components for shell, sidebar, topbar, mode switch, overview, timeline, proposals, and files.
- Adds or extends Drizzle schema for timeline items, proposals, proposal comments, DocuSeal integration metadata, folders, and project files, building on `docs/admin-project-data-model.md`.
- Extends admin tRPC procedures for project workspace reads and mutations.
- Adds self-hosted DocuSeal environment/API integration and webhook route.
- Adds `@xyflow/react` for the editable timeline canvas.
- Reuses existing R2 asset infrastructure and Kibo dropzone components for uploads.
