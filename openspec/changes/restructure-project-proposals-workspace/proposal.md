## Why

The current project proposals tab combines proposal selection, draft editing, DocuSeal embedding, and comments into one page. That makes the proposal workflow harder to navigate and leaves a legal gap: once a proposal has been sent for signature, admins can still access editing behavior that should be locked.

## What Changes

- Restructure the project proposals area into a two-level workspace:
  - `/admin/projects/[projectId]/proposals` becomes a proposal dashboard with proposal cards and create actions.
  - `/admin/projects/[projectId]/proposals/[proposalId]` becomes the proposal detail workspace.
- Move DocuSeal builder/signing and proposal comments out of the list page and into the proposal detail route.
- Make proposal editing draft-only:
  - draft proposals can upload a source document, open the DocuSeal builder, and edit proposal data.
  - sent and later statuses become view-only for both admin and client preview.
- Show proposal comments only after a proposal has been sent.
- Add proposal duplication from the dashboard so admins can create a new draft revision from an existing proposal without copying comments.
- Add a send workflow that selects client members as proposal recipients, creates the DocuSeal submission, and triggers Concolabs-managed email notification.
- Align client preview routing with the same list/detail structure, while keeping the real client portal out of scope for this change.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `admin-project-workspace`: Change proposal workspace routing and navigation from a single combined page to list/detail proposal routes within the existing project workspace shell.
- `project-proposal-docuseal`: Change proposal lifecycle behavior to enforce draft-only editing, sent-state immutability, route-based detail pages, post-send comments, duplication without comment carryover, and recipient-driven send/notification flow.

## Impact

- Affects admin project workspace routes under `src/app/admin/projects/[projectId]/proposals` and client preview equivalents.
- Refactors the current `ProjectProposalsPanel` into separate dashboard and detail workspace components.
- Extends proposal tRPC procedures to support duplication, recipient-aware sending, and server-enforced edit locks.
- Reuses local client membership data for recipient selection and existing email infrastructure for proposal notifications.
- Tightens DocuSeal integration rules so proposal records become immutable after send and are revised through duplication rather than direct edits.
