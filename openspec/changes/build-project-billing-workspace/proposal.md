## Why

The admin app already has the beginnings of project creation and product/client linkage, but the billing surface is still a placeholder and the project workspace does not yet model the billing lifecycle that the business actually runs. We need a concrete implementation plan now because project billing is the operational source of truth for client access, recurring renewals, milestone payments, and downstream product activation.

## What Changes

- Build a real project-level billing workspace inside each admin project rather than treating billing as a detached global module.
- Add a billing model that supports many invoices over time per project, with each invoice carrying one amount/due/terms bundle and one or more payment methods.
- Add a `Product Account` tab inside the project workspace so admins can later configure downstream product access and inspect account stats without inventing a new navigation model later.
- Replace the current `/admin/settings` placeholder with a real settings surface and build the billing-related tabs already agreed for this phase: `Templates`, `Payment Methods`, and `Webhooks`.
- Define the initial database and UI responsibilities for project billing, payment proof uploads, access expiry, due dates, and entitlement delivery.

## Capabilities

### New Capabilities
- `project-billing-workspace`: Project-scoped billing dashboard, invoice management, payment method presentation, proof handling, and access state visibility.
- `project-product-account`: Project workspace tab for downstream product account configuration and stats, shipping as a visible shell in this phase.
- `billing-settings-management`: Admin settings page and tabbed surfaces for billing templates, payment methods, and product webhook configuration that support the billing workspace.

### Modified Capabilities
- None.

## Impact

- Affected routes: `/admin/projects/[projectId]/...`, `/admin/settings`, and the existing `/admin/billing` placeholder strategy.
- Affected frontend areas: shared project workspace components, project tab navigation, billing page components, invoice forms/previews, settings tab scaffolding, and Kibo UI integration.
- Affected backend areas: Drizzle schema, TRPC admin routers, asset handling for payment proofs and billing attachments, product integration configuration, and future webhook delivery/reconciliation flows.
- External systems: Stripe payment links, manual bank/wire payment instructions, product webhook consumers, and R2-backed asset storage.
