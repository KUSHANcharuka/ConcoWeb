# Billing Workspace Follow-ups

This change ships the first project-scoped billing workspace, the `Product Account`
tab shell, and the billing settings tabs under `/admin/settings`.

## Deferred decisions

### Stripe orchestration

- Current implementation assumes the admin provides payment links or equivalent
  external billing URLs.
- A later pass needs to decide whether subscriptions become first-class internal
  billing objects or remain externally managed plus reconciled.

### Webhook ownership model

- Current implementation stores downstream webhook configuration per product in the
  `Webhooks` settings tab.
- A later pass needs to decide whether product integrations should continue living
  inside that tab or split into separate `Products` and `Webhooks` settings surfaces.

### Client-view rollout

- The project workspace now has the route and component structure for admin billing.
- Client-facing billing parity remains deferred. The admin/client view model is visible
  in the workspace shell, but only the admin billing experience is implemented here.
