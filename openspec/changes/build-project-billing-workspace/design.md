## Context

The repo already has an admin shell, project creation flow, product/client schema, and R2-backed assets, but the billing page and settings page are still placeholders. The project planning discussions established a clear operating model:

- Billing lives inside a specific client project, not as a separate operational workspace.
- "Centralized billing" means this platform is the authoritative billing engine for all Concolabs products, while actual billing work still happens inside a project such as `JCC -> Prelim`.
- Each project can represent a downstream product engagement, a custom build, or a service lifecycle, so the billing surface must support recurring, prepaid-term, and milestone patterns.
- Shared React components are important because the admin view and client view follow the same project structure with different affordances.

This change is cross-cutting because it touches route structure, data model, settings, project navigation, and future downstream product activation.

## Goals / Non-Goals

**Goals:**
- Establish the implementation contract for a project-scoped billing workspace.
- Keep billing aligned with the existing project/client/product data model rather than creating a separate billing hierarchy.
- Define the initial admin project tabs so `Billing` and `Product Account` can land cleanly beside the existing workspace tabs.
- Define the settings surfaces required to support reusable billing behavior across products and projects.
- Preserve a shared component model so admin and client project surfaces can reuse structure while exposing different actions.

**Non-Goals:**
- Full downstream product account provisioning in this phase.
- Automatic Stripe subscription orchestration in this phase; admin-created payment links remain valid.
- Full messaging or notification system design beyond the billing touchpoints.
- Replacing DocuSeal proposal/signing decisions; those remain part of the separate proposal capability.

## Decisions

### 1. Billing is project-scoped, even though the platform is centrally authoritative

Billing UI and workflow SHALL live under a specific project workspace because the business object being billed is a client's project or product engagement, not a generic global account. This keeps payment state, files, proposals, timeline, and product activation adjacent.

Alternative considered:
- A global `/admin/billing` operational module as the main billing home.

Why rejected:
- It is useful for reporting and queue views, but it is the wrong primary write surface. The user explicitly clarified that billing always belongs inside a specific project.

### 2. `next_due_at` and `access_expires_at` remain separate pieces of truth

The billing model SHALL not collapse access validity into the next invoice due date. A project may be financially overdue yet intentionally left active, or a verified payment may extend access beyond the next bookkeeping milestone.

Alternative considered:
- Only storing the next deadline because that is what developers check most often.

Why rejected:
- It mixes commercial expectation with actual entitlement state and creates avoidable bugs in downstream product activation.

### 3. Each invoice is a billing artifact; payment methods are attached per invoice

The system SHALL model project billing as:

- one project
- many invoices over time
- each invoice carrying one amount/due/terms bundle
- each invoice exposing one or more payment methods

This matches the agreed commercial model where the same payment request may offer Stripe and wire as alternatives.

Alternative considered:
- Treat payment methods as a project-level configuration only.

Why rejected:
- Available methods often vary by invoice, geography, or deal phase.

### 4. The first implementation should emphasize reusable workspace components

The billing page and project tab shell SHALL be built from composable React components that can be reused across admin and client surfaces. Kibo UI kit elements SHALL be preferred where they reduce bespoke UI work, especially for structured inputs, upload interactions, and list/filter primitives.

Alternative considered:
- Build billing as an isolated page with custom admin-only widgets.

Why rejected:
- It works against the existing project-shell strategy and makes the future client surface harder to reuse.

### 5. `Product Account` ships as a visible project tab in this phase, but not as a complete product control plane

The project workspace SHALL include a `Product Account` tab in admin view so the information architecture is stable. The tab may initially render a scoped placeholder or summary shell while the actual provisioning/stats feature lands later.

Alternative considered:
- Exclude the tab until the full feature is ready.

Why rejected:
- The user wants the tab present now to reflect the real product lifecycle and avoid later navigation churn.

### 6. Billing-related global settings stay under `/admin/settings`

The settings navigation SHALL gain billing-specific tabs for:

- `Templates`
- `Payment Methods`
- `Webhooks` or product integration configuration

Currency selection remains invoice-level input for this phase instead of a dedicated billing settings area.

This change SHALL include the settings page implementation needed to render these tabs inside the existing settings navigation entry, rather than deferring the page shell to a later pass.

Alternative considered:
- Put reusable billing configuration inside the project billing tab only.

Why rejected:
- Templates and payment rails need a workspace-level source of truth reused across multiple products and projects.

### 7. The settings page scope for this change is intentionally narrow

The `/admin/settings` route SHALL ship as a real tabbed page in this change, but only for the billing-related tabs already locked for this phase:

- `Templates`
- `Payment Methods`
- `Webhooks`

Broader workspace settings such as team administration, currencies, audit logs, or unrelated integrations remain outside this change unless they are directly required by one of these tabs.

Alternative considered:
- Expand this change to include the full long-term settings suite.

Why rejected:
- The implementation target for this phase is the billing workspace and the shared billing configuration it depends on. Expanding beyond that would blur scope and make the change harder to land cleanly.

## Risks / Trade-offs

- [Risk] Schema sprawl across invoices, payment methods, proofs, and access overrides can become hard to reason about. → Mitigation: keep invoices as the primary billing artifact and hang related tables from it with explicit foreign keys and status enums.
- [Risk] Reusable components may be over-abstracted too early. → Mitigation: share layout and form primitives first, not every domain decision.
- [Risk] Stripe link-based billing leaves some reconciliation manual. → Mitigation: design webhook and reconciliation tables now so the system can evolve without changing the project workspace shape.
- [Risk] A visible `Product Account` tab may imply more functionality than ships initially. → Mitigation: ship it as a clearly scoped admin shell with explicit empty states and deferred actions.

## Migration Plan

1. Add the billing schema tables and enums behind a migration set.
2. Add server-side routers/selectors for project billing summary, invoice lists, payment methods, and settings data.
3. Add project workspace navigation updates so `Billing` and `Product Account` exist in the route tree.
4. Land the admin billing workspace first, using placeholder client-facing affordances only where necessary.
5. Replace the `/admin/settings` placeholder with a real tabbed settings page for templates, payment methods, and webhook/product integration configuration.
6. Add billing-proof asset flows and entitlement state plumbing before any downstream activation logic is switched on.

Rollback strategy:
- Route-level UI can be reverted independently from schema.
- New billing tables should be additive; existing project creation and product linkage flows stay intact if the workspace is hidden.

## Open Questions

- Whether Stripe subscriptions should eventually be first-class objects or continue as externally generated URLs plus reconciliation state.
- Whether product webhook configuration belongs entirely in the `Webhooks` settings tab or should split into `Products` and `Webhooks`.
- Which project tabs should be visible in client view during the first billing release versus added later behind feature flags.
