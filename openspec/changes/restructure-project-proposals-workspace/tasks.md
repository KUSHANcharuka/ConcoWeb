## 1. Route and workspace split

- [x] 1.1 Add admin proposal dashboard and proposal detail routes under `/admin/projects/[projectId]/proposals` and `/admin/projects/[projectId]/proposals/[proposalId]`
- [x] 1.2 Add matching client-preview dashboard and detail routes under `/admin/projects/[projectId]/client-view/proposals` and `/admin/projects/[projectId]/client-view/proposals/[proposalId]`
- [x] 1.3 Update project workspace navigation, redirects, and overview links so proposal entry points land on the new dashboard/detail structure

## 2. Proposal dashboard UI

- [x] 2.1 Replace the current combined `ProjectProposalsPanel` entry surface with a proposal dashboard component that lists proposal cards and create actions
- [x] 2.2 Add proposal card metadata for lifecycle state, version, timestamps, and summary fields needed by the dashboard
- [x] 2.3 Add proposal card actions for open detail view and duplicate proposal

## 3. Proposal detail lifecycle controls

- [x] 3.1 Split proposal detail rendering into draft authoring mode and non-draft read-only mode
- [x] 3.2 Show source upload and DocuSeal builder controls only for draft proposals
- [x] 3.3 Show comments and read-only proposal viewing only for sent and later proposal states
- [x] 3.4 Remove client/admin comment entry and editing affordances from draft proposals

## 4. Server-side proposal rules

- [x] 4.1 Enforce draft-only editing in proposal update, source upload, and builder-related server procedures
- [x] 4.2 Add a proposal duplication procedure that creates a new draft revision without copying comments or prior send state
- [x] 4.3 Extend proposal list/detail queries with the fields required by the dashboard and read-only detail views

## 5. Send and notification workflow

- [x] 5.1 Add a proposal send flow that loads active client members from local membership data and lets admin select recipients
- [x] 5.2 Update proposal submission creation to store send metadata and mark the proposal as immutable once sent
- [x] 5.3 Trigger Concolabs-managed proposal notification email after successful DocuSeal submission creation

## 6. Verification

- [ ] 6.1 Verify draft proposals can be created, edited, and sent from the new routes
- [ ] 6.2 Verify sent proposals are read-only in both admin and client-preview routes and can only be revised through duplication
- [ ] 6.3 Verify duplicated proposals start as drafts with no copied comments and that proposal notification flow still works after route split
