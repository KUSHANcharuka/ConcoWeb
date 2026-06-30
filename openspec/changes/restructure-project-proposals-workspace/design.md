## Context

The current project proposals tab is implemented as one combined panel that keeps proposal selection, draft creation, source upload, DocuSeal builder/signing embed, and side comments on a single route. That shape no longer matches the rest of the project workspace, where users first land on a section dashboard and then drill into a deeper workspace for a specific record.

Proposal handling is also more sensitive than the current UI suggests. Once a proposal is sent to client recipients for signature or review, the admin must not retain edit access to that same proposal content. The current repo already stores proposal lifecycle states, DocuSeal template/submission metadata, comments, and webhook state, but it does not yet enforce immutable post-send behavior or revision-through-duplication.

The repo already has the backend foundations needed to support the revised UX:

- `proposals` and `proposal_comments` tables with proposal lifecycle fields
- DocuSeal builder and form embed helpers
- DocuSeal webhook handling for signed and declined states
- local `client_memberships` and `client_invitations` tables for client recipients
- email infrastructure that can create/send proposal-related drafts through Resend

This change should restructure the proposal workspace without introducing a new product area or replacing DocuSeal.

## Goals / Non-Goals

**Goals:**

- Split project proposals into a dashboard route and a proposal detail route.
- Make draft proposals editable and non-draft proposals read-only.
- Move comments out of proposal creation and make them available only after a proposal is sent.
- Add proposal duplication that creates a new draft revision without copying comments.
- Add recipient selection on send using local client membership data.
- Trigger Concolabs-managed proposal notification email when a proposal is sent.
- Preserve admin/client-preview parity in route structure and detail page rendering.

**Non-Goals:**

- Do not implement the real client portal route in this change.
- Do not allow reopening or mutating a sent proposal in V1.
- Do not build inline PDF annotations or text-selection comments inside the DocuSeal iframe.
- Do not redesign DocuSeal’s signing semantics beyond what is needed to configure recipients and embed the resulting surface.
- Do not introduce a full notifications center if the current repo only supports email-based proposal notification.

## Decisions

### Use list/detail proposal routes inside the existing project workspace

The project workspace should keep `Proposals` as a single left-nav section, but that section should now land on a proposal dashboard at `/admin/projects/[projectId]/proposals`. Proposal-specific work should move to `/admin/projects/[projectId]/proposals/[proposalId]`. The same route pattern should exist under `/client-view/...` for admin preview of client behavior.

Rationale: this aligns proposals with the rest of the workspace information architecture and removes the current in-page selected-proposal state.

Alternative considered: keep one route and split the UI with local state. Rejected because it produces fragile browser navigation, weak deep-linking, and a crowded page.

### Treat proposal status as the legal edit lock boundary

Only `draft` proposals should expose builder editing, source replacement, or proposal field mutations. Once status transitions to `sent`, `commented`, `accepted`, `signed`, `declined`, or `archived`, the proposal becomes immutable. Any revision must be created by duplicating the proposal into a new draft record.

Rationale: this matches the legal/compliance concern raised by the user and prevents document drift after client delivery.

Alternative considered: allow reopening a sent proposal. Rejected for V1 because it weakens the immutability rule and complicates auditability.

### Split proposal UI by lifecycle state

The proposal detail route should render different controls based on status:

- `draft`: proposal editing workspace with source upload, DocuSeal builder, and send action
- non-draft: read-only proposal/signing view with side comments and no edit controls

Comments should not appear during draft authoring. They should only be available after send.

Rationale: comments are a review workflow concern, not an authoring concern.

### Duplicate proposals by cloning proposal content only

The dashboard should expose a row/card menu with a duplicate action. Duplication should copy proposal content needed for revision work, but must not copy `proposal_comments`. The duplicate starts as a new `draft` proposal under the same project and client.

Rationale: revision workflows are common, but comment history belongs to the original negotiation context.

Alternative considered: edit sent proposals in place. Rejected because it breaks the immutability rule.

### Use local client memberships for send recipient selection

The send flow should resolve recipients from active local `client_memberships` for the project’s client. The modal should allow selecting one or more recipients. Those selected recipients should be passed into DocuSeal submission creation and also used for Concolabs notification email delivery.

Rationale: the local membership tables are now the app-facing source for client-member UI and already reflect Clerk org membership state.

### Keep DocuSeal submission creation separate from notification email

DocuSeal submission creation should remain responsible for signature workflow state. Concolabs should separately send its own proposal notification email through the existing email system. The DocuSeal API call currently uses `send_email: false`; that can remain if we want Concolabs to own the client-facing email language and portal link.

Rationale: Concolabs needs branded notification flow and portal routing, not a provider-owned outbound email as the only client notification.

Alternative considered: rely on DocuSeal email only. Rejected because it bypasses Concolabs email messaging and portal context.

## Risks / Trade-offs

- **[Recipient semantics with multiple DocuSeal submitters]** → Keep the first implementation simple: selected recipients are passed through as submitters, but the UI copy should avoid promising complex signing-order workflows until that is explicitly configured.
- **[Immutability enforcement only in UI]** → Enforce lock rules in tRPC mutations as well as in route rendering so sent proposals cannot be edited through direct API calls.
- **[Duplicate workflow may copy too much or too little]** → Explicitly define copied fields versus reset fields so each duplicate starts as a clean draft with no carryover comment history or send state.
- **[Email and DocuSeal send can drift]** → Create/send DocuSeal submission first, then trigger Concolabs email only after the proposal record is successfully updated to `sent`.
- **[Route split may break current proposal links]** → Add redirects or update all proposal entry points in the project workspace so existing navigation lands on the dashboard or correct detail page.

## Migration Plan

1. Add the new list/detail proposal routes under admin and client-preview project workspaces.
2. Replace the current combined panel with a proposal dashboard component and a proposal detail component.
3. Add server-side edit-lock guards so non-draft proposals reject update/builder/source mutations.
4. Add proposal duplication procedure and dashboard action.
5. Add proposal send modal backed by local client membership selection.
6. Wire Concolabs proposal notification email after successful DocuSeal submission creation.
7. Update proposal comments so they render only on non-draft detail pages.
8. Update project workspace links and overview affordances to point into the new proposal routes.

Rollback strategy: revert route split and restore the prior combined proposal page, while leaving proposal records and webhook fields intact. Since this change reuses existing schema concepts, rollback is primarily UI and procedure-level.

## Open Questions

- Whether multiple selected recipients should all be signers or whether future versions should distinguish “signers” from “review-only notified members.”
- Whether signed/declined proposals should later support downloading/storing rendered final documents into R2 as immutable artifacts.
- Whether proposal notification should also create an in-app notification record when a dedicated notification model is introduced.
