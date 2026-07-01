# Admin Dashboard — UI & Feature Spec

Internal god-view for Concolabs team. Manage all client orgs, all projects, full lifecycle from lead to archive. Mirror data model of [Client Portal](./CLIENT_PORTAL_SPEC.md) but w/ edit affordances + cross-client overview.

---

## 1. Mental model

- **Single admin app** for Concolabs team (multi-admin).
- Top of hierarchy: list of all client orgs.
- Drill: Org → Projects → Project detail (same blocks as client portal but editable + internal-only fields).
- Admin shapes what client sees. Block-builder UI = primary creation tool.

**Rule:** same data model + same block renderer as client portal. Admin adds `edit=true` affordances + internal-only fields (notes, margin, internal status). Don't fork the UI tree — fork the affordances.

---

## 2. Global shell

### Sidebar (260px)
- Concolabs admin brand mark.
- **Admin nav**:
  - `Inbox` — unified action queue
  - `Clients` — all orgs
  - `Projects` — all projects across orgs
  - `Payments` — all invoices, all clients
  - `Change Requests` — global CR queue
  - `Proposals` — proposal builder + library
  - `Reports` — revenue, pipeline, forecast
- **Team section**: Team members, settings, integrations.
- User card pinned bottom w/ role badge.

### Topbar
- Global search (⌘K) — searches across all orgs/projects/payments/messages.
- **Org-switcher tag** if admin wants to scope view to one client (resets to global by default).
- Notifications.
- "+ New" CTA — quick-create: Client / Project / Proposal / Invoice / CR quote.

---

## 3. Core pages

### 3.1 Inbox (default landing)
- Unified action queue across all clients.
- Item types:
  - Payment awaiting verification (manual wire/check)
  - CR awaiting quote
  - CR quote accepted, payment pending
  - Proposal awaiting client signature (T+3 reminder)
  - Message reply needed
  - File uploaded by client
- Each row: client logo + project + action label + age + assignee + quick action button.
- Filters: assigned-to-me / unassigned / all.
- Bulk actions.

### 3.2 Clients
- Table view: org name, # active projects, lifetime value, outstanding balance, last activity, account owner.
- Kanban view: pipeline stage (Lead / Proposal / Active / Hypercare / Archived).
- Search + filter (stage, owner, currency, geography).
- Click row → Client detail.

#### Client detail
- Org profile: logo, billing address, tax ID, primary contact, notes (internal-only).
- Tabs: `Projects · Contacts · Payments · Files · Activity · Internal Notes`.
- Action: + New Project.

### 3.3 Projects
- Cross-org list. Same filters as Clients.
- Per-project row: client logo, project name, stage, current milestone, % complete, next payment due, assigned admin(s).

#### Project detail (primary work surface)
- Top header: client + project + stage pill + quick actions (Edit, Archive, Share preview link).
- Tab strip mirrors client portal pages: `Overview · Timeline · Proposals · Payments · Change Requests · Files · Messages · Internal`.
- **Internal tab** (admin-only):
  - Margin/cost tracking
  - Hours logged
  - Internal status notes
  - Risk flags
  - Profitability report
- Edit mode toggle: WYSIWYG block editor (Dribbble ref) for adding/reordering blocks client sees.

### 3.4 Block builder (the core creation UX)
- Side panel right: `Insert block` library — Text, Image, Video, Gallery, Proposal, Timeline, Payment, Change Request, File, Message thread, Status update.
- Main canvas: drag blocks in, reorder, edit inline.
- Top bar: Cancel · Save as draft · Continue/Publish.
- Live preview toggle (show what client sees).
- Versioning: every publish creates a snapshot, rollback supported.

### 3.5 Payments (global)
- Table: invoice #, client, project, amount, currency, method, state, due date, sent date, verified by.
- State filters: `pending verification / overdue / paid this month / failed`.
- Manual verification flow:
  - Wire/check submission → admin sees uploaded receipt → match against bank statement → mark verified.
  - Audit log per state transition (who, when, why).
- Bulk reconciliation tool: paste bank statement, auto-match.
- Stripe events stream w/ reconcile status.
- Refund flow.
- Per-row drill: payment detail w/ full history.

### 3.6 Change Requests (global queue)
- Table of incoming CRs across all clients.
- State filters: `new / quoting / awaiting client / approved / in progress / delivered`.
- Per-CR detail: submitted doc viewer + structured form data + thread + quote builder + scope diff vs. original SOW.
- Quote builder: line items, total, timeline impact (auto-shifts downstream milestones if approved).
- Approve & convert → auto-creates linked payment block + extends timeline.

### 3.7 Proposals
- Proposal library: templates (Web app / Mobile / Custom tool / Marketing site).
- Proposal editor: rich text + pricing tables + timeline draft + scope of work.
- Send flow: select client → preview → send → client portal notified.
- Version diff tool when client requests changes.
- E-signature integration (Dropbox Sign / DocuSign / built-in).

### 3.8 Reports
- Revenue by month/quarter (Stripe + manual reconciled).
- Pipeline value by stage.
- Cash forecast (next 90 days based on payment schedules).
- Client lifetime value table.
- Outstanding receivables aging (0-30, 30-60, 60-90, 90+).
- Project profitability (revenue - tracked cost).
- Export CSV / PDF.

### 3.9 Team & settings
- Team members: invite, role (Owner / Admin / Member / Read-only), assign clients.
- Workspace settings: brand, default currency, tax rates, bank details (per region — US, LK).
- Integrations: Stripe accounts, email (postmark/resend), file storage (Drive/S3), e-signature provider.
- Audit log: full system event stream.

---

## 4. Cross-cutting capabilities

### 4.1 Block-builder editor (shared w/ client view)
- Same block renderer powers client portal. Admin = edit mode, client = read mode w/ action buttons.
- Block library extensible (new block types added centrally apply everywhere).
- Internal-only blocks (notes, margin) hidden in client view via permission flag.

### 4.2 Multi-currency
- Per-client default currency.
- Per-invoice currency override.
- FX snapshot at invoice issue + at payment received.
- Reports default to org base currency (USD).

### 4.3 Notifications
- In-app + email + optional Slack webhook per workspace.
- Triggers: client signs proposal, manual payment submitted, CR submitted, CR quote accepted, message from client, file uploaded.

### 4.4 Audit log
- Every mutation (create/update/delete/state change) logged: actor, timestamp, before/after, reason.
- Filter by entity, actor, date.
- Required for payment + contract trails.

### 4.5 Permissions
- Roles: `Owner / Admin / Member / Read-only`.
- Per-client assignment — Members see only assigned clients.
- Sensitive actions (refund, delete client, override audit) require Owner.

### 4.6 Share preview link
- Generate temporary token URL to preview a client's portal exactly as they see it.
- Useful for QA before publishing.

---

## 5. Critical user flows

1. **New client onboarding**: Create client → create project → assemble project blocks (proposal + timeline + first payment) → publish → invite client user → client receives magic link → portal live.
2. **Manual payment verification**: Inbox notification → open payment → view uploaded receipt → match bank statement → mark verified → client portal updates + receipt PDF auto-issued.
3. **Change request cycle**: Client submits CR → Inbox alert → admin reviews doc → builds quote in CR detail → sends → client approves → linked payment auto-created → client pays → admin marks in progress → on delivery, marks done.
4. **Proposal send**: Pick template → fill scope + pricing → preview as client → send → client signs → auto-archive signed PDF + activate project.

---

## 6. Out of scope v1

- Mobile native admin app.
- AI-assisted proposal/quote generation.
- Time tracking integrations beyond basic hour log.
- Public client review/case-study capture.
- Marketplace of admin extensions.

---

## 7. Open decisions

- E-signature: integrate (Dropbox Sign / DocuSign) vs build inline?
- File storage: S3 direct vs Google Drive shared folder per client?
- Internal team chat: build into Messages or stay on Slack?
- Reporting depth v1: dashboard only or include export-to-CSV from day one?
