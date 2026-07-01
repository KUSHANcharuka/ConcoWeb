## 1. Billing data model

- [x] 1.1 Define the Drizzle schema additions for project billing artifacts, invoice line items, invoice payment methods, payment proofs, and access state/override tracking.
- [x] 1.2 Define how billing assets attach to projects and invoices using the existing R2-backed asset model.
- [x] 1.3 Define product integration fields and relationships needed for project-scoped product account context and downstream webhook delivery.

## 2. Project workspace routes and components

- [x] 2.1 Add the project workspace route structure for `Billing` and `Product Account` under the admin project detail surface.
- [x] 2.2 Create shared React component primitives for project billing summary blocks, invoice lists, payment method sections, proof attachments, and empty states using Kibo UI where it reduces custom work.
- [x] 2.3 Add the admin/client workspace tab model so the new tabs fit the existing reusable project-shell strategy.

## 3. Billing workflows

- [x] 3.1 Implement project billing queries and mutations for listing billing artifacts, creating invoices, attaching payment methods, and recording status transitions.
- [x] 3.2 Implement payment-proof upload and review plumbing using billing-scoped assets.
- [x] 3.3 Implement billing summary state that surfaces next due date, access expiry, payment status, and invoice history separately.

## 4. Product account and settings surfaces

- [x] 4.1 Add the initial `Product Account` tab shell with project/product/client-scoped context and a deferred-feature placeholder.
- [x] 4.2 Replace the `/admin/settings` placeholder with a real tabbed settings page for `Templates`, `Payment Methods`, and `Webhooks`.
- [x] 4.3 Build the initial tab shells and supporting data flows for those settings tabs.
- [x] 4.4 Wire reusable settings data into project billing flows without duplicating configuration inside each project.

## 5. Validation and rollout

- [x] 5.1 Validate the billing and settings route flows against the current admin shell and navigation.
- [x] 5.2 Verify the schema and API design support recurring, prepaid-term, and milestone billing patterns without collapsing access state into due date state.
- [x] 5.3 Document any unresolved webhook, Stripe-subscription, or client-view rollout decisions before implementation begins.
