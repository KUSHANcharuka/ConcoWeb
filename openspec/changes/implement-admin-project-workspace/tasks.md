## 1. Data Model and Configuration

- [x] 1.1 Add Drizzle schema for project timeline items with project/client scope, business fields, and React Flow layout coordinates
- [x] 1.2 Add Drizzle schema for proposals, proposal comments, DocuSeal template/submission/submitter metadata, and webhook state fields
- [x] 1.3 Add Drizzle schema for project folders and project files linked to R2 assets
- [x] 1.4 Generate and review the Drizzle migration for the new project workspace tables
- [x] 1.5 Add self-hosted DocuSeal env vars to `.env.example` and `src/env.js`
- [x] 1.6 Add required dependencies for React Flow and DocuSeal embedding if not already installed

## 2. Project Workspace Routing and Shell

- [x] 2.1 Add `/admin/projects/[projectId]` redirect to `/admin/projects/[projectId]/overview`
- [x] 2.2 Add admin section routes for overview, timeline, proposals, files, and deferred payments/messages placeholders
- [x] 2.3 Add matching `/admin/projects/[projectId]/client-view/...` preview routes
- [x] 2.4 Build shared project workspace shell with left project sidebar, breadcrumb/search row, section heading, and content slot matching the Paper reference
- [x] 2.5 Add the segmented Admin View / Client View switch below the admin top navigation
- [x] 2.6 Add the subtle client preview banner and disable preview mutations
- [x] 2.7 Add shared status badges, section nav items, loading states, empty states, and not-found states

## 3. Admin API Layer

- [x] 3.1 Add admin tRPC procedures to load project workspace context by project id
- [x] 3.2 Add admin tRPC procedures for overview summary data
- [x] 3.3 Add admin tRPC procedures for timeline list/create/update/delete/reposition
- [x] 3.4 Add admin tRPC procedures for proposal list/create/update/comment operations
- [x] 3.5 Add admin tRPC procedures for project folder and file list/create/rename/delete/move operations
- [x] 3.6 Add authorized R2 read/upload URL procedures for proposal source documents and project files
- [x] 3.7 Ensure every procedure validates project/client scope before returning data or R2 URLs

## 4. Overview Tab

- [x] 4.1 Build the Admin View overview dashboard using real project status, dates, current timeline item, latest proposal status, and file count
- [x] 4.2 Build the Client View overview preview with the same summary data and no admin controls
- [x] 4.3 Add loading, empty, and error states for overview data

## 5. Timeline Tab

- [x] 5.1 Add `@xyflow/react` setup and base timeline canvas component
- [x] 5.2 Build custom timeline node/card components matching the Paper timeline style
- [x] 5.3 Render timeline rail, connectors, milestone cards, zoom controls, and jump-to-today control
- [x] 5.4 Implement admin add/edit/delete timeline item interactions
- [x] 5.5 Implement admin drag/reposition persistence for timeline nodes
- [x] 5.6 Implement client preview read-only timeline rendering with edit and drag controls disabled
- [x] 5.7 Add timeline validation and optimistic or refetch-based mutation refresh behavior

## 6. Files Tab

- [x] 6.1 Build project file manager shell with nested folder tree and current-folder content panel
- [x] 6.2 Use Kibo dropzone for project file uploads through R2 signed upload URLs
- [x] 6.3 Implement create, rename, delete, and move operations for nested folders
- [x] 6.4 Implement upload, download, delete, rename, and move operations for files
- [x] 6.5 Prevent invalid folder moves into the same folder or descendant folders
- [x] 6.6 Build client preview file manager in read-only mode using the same folder/file data
- [x] 6.7 Add empty states for root folder, empty folder, upload failure, and unauthorized file access

## 7. Proposals and DocuSeal

- [x] 7.1 Add DocuSeal server helper for API calls, builder token generation, and base URL construction
- [x] 7.2 Build proposal list and proposal detail layout inside the project workspace
- [x] 7.3 Implement proposal source document upload to R2
- [x] 7.4 Embed `<docuseal-builder>` in Admin View using the self-hosted DocuSeal builder script and server-generated token
- [x] 7.5 Store DocuSeal template/submission/submitter metadata against the proposal
- [x] 7.6 Embed `<docuseal-form>` in Client View when a submitter embed URL exists
- [x] 7.7 Implement proposal side comments stored in Concolabs DB and displayed beside the DocuSeal surface
- [x] 7.8 Add a DocuSeal webhook route for complete and decline events
- [x] 7.9 Make DocuSeal webhook updates idempotent by stored submission/submitter identifiers
- [x] 7.10 Add clear integration error states when DocuSeal configuration is missing or invalid

## 8. Deferred Tabs

- [x] 8.1 Add Payments placeholder section explaining that billing is deferred for this version
- [x] 8.2 Add Messages placeholder section explaining that communication workflows are deferred for this version
- [x] 8.3 Ensure deferred sections do not expose incomplete mutation controls

## 9. Verification

- [x] 9.1 Run `npm run typecheck`
- [ ] 9.2 Verify admin project workspace routes render for an admin session
- [ ] 9.3 Verify client-view routes keep admin navigation, show the preview banner, and disable mutations
- [ ] 9.4 Verify timeline create/edit/delete/drag operations persist and client preview remains read-only
- [ ] 9.5 Verify project file upload/download/folder move operations enforce project scope
- [ ] 9.6 Verify DocuSeal builder/form embeds load when configured and show actionable errors when not configured
- [ ] 9.7 Verify DocuSeal complete/decline webhook payloads update proposal state idempotently
- [ ] 9.8 Verify Payments and Messages render as placeholders only
