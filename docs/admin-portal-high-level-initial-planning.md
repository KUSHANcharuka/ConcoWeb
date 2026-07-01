# Admin Portal — High-Level Initial Planning

> Status: **Exploratory / pre-implementation.** Captures the agreed shape of the admin portal before schema or screen work begins. Supersedes the admin sections of `centralized-client-portal-plan.md` (which is half-baked and stays only for historical context).

## Hosting & route layout

The Next.js app on `concolabs.com` hosts three surfaces:

- **Public marketing** — the existing site, served from public routes at the root (`/`, `/customers/...`, etc.). No auth.
- **Client portal** — `/client-portal/...`. Clerk-gated. Sidebar-only navigation. Detailed in its own spec.
- **Admin portal** — `/admin/...`. Clerk-gated, role `admin` enforced by middleware. Has both top navigation and a contextual sidebar.



## Mental model

- The admin portal is an **edit/operate view** layered on top of the same data the client sees. For every project, the admin sees what the client sees plus internal affordances.
- **One project detail surface, two reader modes.** The admin's project page reuses the client portal's project layout. Edit toggles, internal-only tabs, and preview-as-client are the only differences.
- Top navigation drives **primary admin sections** (operate-level concerns: dashboard, projects, requests, billing, emails, clients, settings). Sidebar appears only inside drill-down workspaces (project detail, email detail, etc.) and mirrors the client portal's sidebar pattern where relevant.
- The client portal has **no top navigation** — only a left sidebar. This is non-negotiable; mirror the visual shell, do not mirror the navigation model.

## Top navigation (admin only)

Order, left to right:

1. **Dashboard** — `/admin`
2. **Projects** — `/admin/projects`
3. **Requests** — `/admin/requests`
4. **Billing** — `/admin/billing` (internals deferred; placeholder for now)
5. **Emails** — `/admin/emails`
6. **Clients** — `/admin/clients`
7. **Settings** — `/admin/settings`

Topbar utility cluster (right side, persistent across tabs):

- `⌘K` global search
- `+ New` quick-create menu (Client, Project, Invoice, Proposal, Email)
- Notifications bell (links through to `/admin/notifications`)
- Scope tag (optional pin to a single client — keeps top nav, scopes inner data)
- User card / role badge

## Sidebar behaviour

The sidebar is **contextual**, not global:

- Hidden on Dashboard, Requests, Billing list, Clients list, Settings list, Notifications — these get full-width canvases.
- Visible inside **Project detail** — mirrors the client portal sidebar exactly: `Overview · Timeline · Proposals · Payments · Change Requests · Files · Messages · Internal`. The `Internal` tab is admin-only.
- Visible inside **Email detail / Emails section** — sub-sections: `Inbox · Outbox · Sending · Scheduled · Failed · Sent · Suggested · Templates`.
- Visible inside **Client detail** — sub-tabs: `Projects · Contacts · Billing · Files · Activity · Internal Notes`.

Same 260px width, same wash, same component primitives as the client portal sidebar to keep the design system uniform.

## Pages

### 1. `/admin` — Dashboard

The default landing. Operational overview at a glance plus the unified action queue.

- **Header**: small-caps eyebrow (date), serif display greeting.
- **KPI strip**: MRR · Outstanding AR · Pending verifications · Overdue · Pending project requests · This-month revenue.
- **Action queue (inbox-style block)** — shows the same urgent items the dedicated Inbox would, embedded here so daily work begins on the dashboard. Item types: bank proofs awaiting verification, project requests pending, change-request quotes to send, proposals stuck at T+3 unsigned, failed Stripe events, dead-lettered outbound webhooks. Each row: client avatar + project + action label + age pill + quick-action button. Filters: assigned-to-me / unassigned / all.
- **Cash forecast mini-chart** + **recent activity feed** alongside.
- **Sparkline strip** at the bottom: revenue last 6 months per currency.

### 2. `/admin/projects` — Projects list

Cross-client list of every project.

- **View toggle** persisted per-user: **Cards** (default) and **Table**. Both views always available.
- **Card view** mirrors the project switcher card from the client portal, scaled up. Each card: client logo, project name, stage pill, next milestone, next payment due, assignees.
- **Table view** for dense scanning: client, project, product, stage, % complete, next payment, origin (`admin / client-requested`), assignees.
- Filter bar: stage, product, origin, currency, assignee, search.
- Clicking a card or row opens `/admin/projects/[id]`.

### 3. `/admin/projects/[id]` — Project workspace

This is the admin's primary work surface and the place where the "edit version of the client project page" idea lives.

- Layout identical to the client portal's project detail: left sidebar tabs (`Overview · Timeline · Proposals · Payments · Change Requests · Files · Messages`), serif page headers, status pills, block-style content.
- **Internal tab** appended (admin-only): margin, hours logged, internal notes, risk flags.
- **Topbar additions** inside the project: `Edit` toggle, `Preview as client`, stage pill, archive menu, share-preview-link generator.
- Edit toggle exposes inline edit affordances on each block (drag handles, inline forms, save indicator). Off by default — read mode matches what the client sees.
- Preview-as-client opens the client view through a signed token in a new tab, banner showing "Preview mode".

### 4. `/admin/requests` — Project requests

Client-initiated project requests queue.

- Table of submitted requests with status filter pills (`pending / approved / rejected`).
- Row click → side drawer: requester, client org, requested label, suggested product, summary, message thread.
- Approve → creates the `projects` row with `origin=client_requested`, links back via `source_request_id`, redirects to the new project detail.
- Reject → captures reason, notifies the client.
- Bulk approve/reject supported.

### 5. `/admin/billing` — Billing (deferred internals)

Placeholder shell for now. Internal structure (invoices, payments, proofs, subscriptions, reports) will be designed in a dedicated billing-planning pass. Top nav reserves the slot; the page renders a "coming soon" empty state and a link to the planning doc once written.

### 6. `/admin/emails` — Emails

The communications surface. Houses everything the platform sends or receives, plus the future AI-suggestion area.

- **Sidebar sub-sections**:
  - `Inbox` — inbound mail threaded by client + project.
  - `Outbox` — drafts being composed.
  - `Sending` — currently in flight at the provider.
  - `Scheduled` — queued for a future time (T-7 reminders, milestone nudges, etc.).
  - `Failed` — provider failures, bounces, undeliverables.
  - `Sent` — full archive with delivery, open, click status if the provider tracks it.
  - `Suggested` — empty for now; reserved for future AI-generated suggestions (weekly check-ins, payment nudges, milestone follow-ups). The sub-section ships disabled with a "coming soon" empty state so the surface exists when the feature lands.
  - `Templates` — invoice issued, proof received, proposal sent, payment due, change-request quote.
- Inbound mechanism (Resend inbound, IMAP forward, or `support+{clientslug}@concolabs.com`) is **deferred**. UI is designed as if it works; the integration decision happens when this tab is built.
- Each email row carries: direction, from/to, subject, related client + project, status pill, trigger, timestamp.

Data model placeholder: an `emails` table holding `id, direction, client_id?, project_id?, thread_id?, from, to, subject, body, status (draft|scheduled|sending|sent|delivered|opened|failed|inbound|suggested), scheduled_at?, sent_at?, trigger, template_id?, related_entity_type?, related_entity_id?, created_at`. Single table for both suggestions and real mail — status enum disambiguates.

### 7. `/admin/clients` — Clients

Cross-portfolio client management.

- View toggle: **Table** and **Kanban** (pipeline stage: Lead / Proposal / Active / Hypercare / Archived).
- Table columns: org, # active projects, lifetime value, outstanding, base currency, last activity, account owner.
- `**+ Add client`** opens a creation drawer (name, primary contact email, country, base currency). On submit the platform provisions a Clerk Organization and stores the `clerk_org_id` on the new `clients` row, sends the first invite, redirects to the client detail.
- Per-row actions: archive, suspend, open detail.
- **Client detail** sub-tabs in a contextual sidebar: `Projects · Contacts · Billing · Files · Activity · Internal Notes`. Internal Notes never reach the client portal.

### 8. `/admin/settings`

Workspace-level configuration. Sub-tabs in a contextual sidebar:

- `Workspace` — brand, default base currency, supported currencies.
- `Team` — admin members, roles, per-client assignment.
- `Integrations` — Stripe accounts (US/LK), Resend, file storage, e-signature provider, products catalogue + outbound webhook URLs / secrets.
- `Bank details` — per-region bank instructions surfaced on invoices.
- `Currencies & FX` — supported currencies list, FX provider config.
- `Audit log` — append-only mutation stream, filterable by actor / entity / date.
- `Webhooks` — outbound delivery log + manual retry.

Configuration sinks here so the top nav stays focused on daily work surfaces.

### 9. `/admin/notifications`

Full-page expansion of the topbar bell. Shows every system notification: failed webhook deliveries, Stripe errors, inbound emails awaiting triage, project requests, proof uploads, change-request submissions, message replies, scheduled-email failures. Filterable, markable as read, linkable to source entity. The bell shows unread count; this page shows the archive.

## Client portal touch-points (called out for cross-reference)

These belong to the client portal spec, but the admin plan depends on them:

- Client portal lives entirely under `/client-portal/...`.
- Client portal has **sidebar navigation only**, no top navigation.
- The projects landing in the client portal shows the org's projects as a **card grid** with a prominent `+ New project` button that opens the project request flow. This is the entry point that produces the rows the admin sees under `/admin/requests`.

## Cross-cutting components (admin)

- `**+ New` quick-create** in topbar — drawer-based forms for Client, Project, Invoice, Proposal, Email; does not navigate away.
- **Preview-as-client** — signed-token URL opens client-portal view in a new tab with a "Preview mode" banner.
- **Scope tag** in topbar — pin to a single client; subsequent pages scope their queries to that client. ⌫ clears scope.
- **Status pill system** — unified vocabulary and palette across admin and client portal.
- **Drawer-first detail UX** (Vaul) — row click opens a drawer; "Open full" link escalates to a dedicated route. Avoids modal stacks.
- **Bulk action bar** — appears sticky at bottom when rows are selected.
- **Empty states** with illustration + single CTA on every list page; never blank tables.
- **⌘K command bar** — global. Searches clients, projects, invoices, messages, emails. Commands: `New invoice for {client}`, `Approve proof #...`, `Switch to {client} scope`.

## Permissions (sketch, to be hardened later)

Roles: `Owner / Admin / Member / Read-only`.


| Action                         | Owner | Admin | Member (assigned) | Read-only |
| ------------------------------ | ----- | ----- | ----------------- | --------- |
| Create client / project        | ✓     | ✓     | ✓                 | —         |
| Approve project request        | ✓     | ✓     | ✓                 | —         |
| Approve bank proof             | ✓     | ✓     | ✓                 | —         |
| Issue / void invoice           | ✓     | ✓     | issue only        | —         |
| Refund / delete client         | ✓     | —     | —                 | —         |
| Rotate webhook secret          | ✓     | ✓     | —                 | —         |
| View internal margin           | ✓     | ✓     | ✓                 | ✓         |
| Manage team / billing settings | ✓     | —     | —                 | —         |


Members see only assigned clients; the rest of the UI silently filters.

## Route summary

```
/                              → public marketing (existing)
/customers/...                 → public marketing (existing)

/client-portal/...             → Clerk-gated client portal (sidebar nav, no top nav)

/admin                         → Dashboard
/admin/projects                → Projects list (card + table)
/admin/projects/[id]           → Project workspace (client-portal layout + edit mode + Internal tab)
/admin/projects/[id]/preview   → Signed preview-as-client target
/admin/requests                → Project requests queue
/admin/billing                 → Billing placeholder (internals TBD)
/admin/emails                  → Emails (sidebar: Inbox / Outbox / Sending / Scheduled / Failed / Sent / Suggested / Templates)
/admin/clients                 → Clients list (table + kanban)
/admin/clients/[id]            → Client detail (sidebar tabs)
/admin/settings                → Settings (sidebar tabs)
/admin/notifications           → Full notifications archive
```

## What this doc does *not* cover

- Internal structure of `/admin/billing` — invoices, payments, proofs, subscriptions, reconciliation, reports. Designed in a follow-up billing-planning pass.
- AI-suggested emails — surface reserved, feature deferred.
- Inbound email mechanism — designed when the Emails tab is built.
- Block-builder edit mode for the project workspace — deferred; v1 ships fixed sections with inline edit affordances.
- Schema and migrations — covered by the centralized platform plan and will be revisited once the admin surface lands.

## Open items to revisit when implementation starts

- Card vs table default per user — confirm Cards as the default before shipping.
- Scope-tag persistence — per-tab session or per-user setting.
- Notifications fan-out — push, email digest, in-app only, or all three.
- E-signature provider for proposals — DocuSign vs Dropbox Sign vs inline.
- Inbound email mechanism — Resend inbound vs IMAP vs forwarding address.
- Whether the contextual sidebar inside a project should be collapsible.

