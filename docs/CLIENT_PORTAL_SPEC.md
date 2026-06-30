# Client Portal — UI & Feature Spec

Daily-touch surface for paying clients. Premium feel, low friction, single source of truth between Concolabs and client through full engagement lifecycle.

---

## 1. Surface model

- **One portal per client org** (e.g. Acme Co.).
- One org → many projects (Terrance, Prelim, etc.).
- One project → many blocks (proposal, timeline, payments, files, change requests, messages).
- Client users scoped to their org only. Cannot see other clients.
- Multi-user per org supported (founder + finance + PM seats).

---

## 2. Lifecycle stages

`Lead → Proposal sent → Proposal signed → Active (sprints + payments) → Change cycles → Delivered → Hypercare → Archived`

Stage gates visibility:
- Payment blocks locked until proposal signed.
- Change request flow only available in Active+.
- Archived = read-only; portal stays accessible for audit.

---

## 3. Global shell

### Sidebar (260px, left)
- Brand mark + wordmark (Concolabs).
- **Project switcher** card — current project + dropdown for org's other projects.
- Workspace nav: `Overview · Timeline · Proposals · Payments · Change Requests · Files · Messages`.
- Badge counts on Payments (due), Messages (unread), Change Requests (awaiting action).
- Support group: `Help & Support · Settings`.
- User card pinned bottom (avatar, name, email).

### Topbar (64px)
- Breadcrumb: `Org / Project / Section`.
- Global search (⌘K) — searches across docs, payments, messages, change requests.
- Icon utility cluster: notifications (w/ unread dot), calendar quick-view, settings.
- Workspace tag (avatar + name + org).

---

## 4. Pages

### 4.1 Overview (home)
- Hero header: serif greeting w/ first name, date eyebrow.
- **Next-action banner** — single most urgent CTA (Sign proposal / Pay invoice / Approve quote / Review delivery). Amethyst soft bg, full-width.
- **KPI strip** — 3-4 cards: Project stage · Next payment · Outstanding balance · Days to next milestone.
- **Timeline mini** — horizontal compressed view, click → Timeline page.
- **Recent activity feed** — events, avatars, timestamps (left col).
- **Quick pay card** — right col, shows next due invoice w/ one-click pay.

### 4.2 Timeline
- **Infinite horizontal canvas** w/ pan + zoom.
- Central horizontal rail = time axis.
- **Milestone nodes** on rail (icon by type: doc, payment, review, launch).
- **Per-node clusters** branching off rail w/ curved SVG:
  - Phase label (serif month + week)
  - Pill chips (quick facts)
  - Detail card (mini chart, value, status)
- States: past (solid border, success), current (amethyst ring + glow + progress), future (dashed muted).
- Canvas controls top-right: zoom in/out, "Jump to today".
- Drag to pan, scroll to zoom.

### 4.3 Proposals
- List of proposal versions (v1, v1.1, v1.2 final).
- Inline PDF/rich-text viewer.
- E-signature flow (integrate Dropbox Sign or Stripe-style inline draw).
- Counter-signed copy auto-archived.
- Comments thread per proposal.

### 4.4 Payments
- Outstanding balance hero (big mono numeral).
- **Invoice list** w/ state pills: `Draft / Sent / Pending / Verifying / Paid / Overdue / Refunded`.
- Per-invoice detail:
  - Amount + currency + due date
  - Pay-method picker:
    - **Stripe** (card / ACH) → instant, auto-reconcile
    - **US bank wire** → show bank details, client uploads receipt → admin verifies
    - **LKR bank transfer** → show LK bank details, receipt upload → admin verifies
    - **Check** → mailing address, mark "sent", admin confirms received
  - State machine per payment: `pending → submitted → verifying → verified | failed`.
  - Downloadable PDF invoice + receipt after payment.
- Multi-currency: store amount + currency + fx_snapshot. USD invoice paid in LKR records both.
- Payment history archive w/ filters.

### 4.5 Change Requests
- Client-initiated: upload doc + structured form (affected area / urgency / budget cap / desired date).
- State machine: `submitted → admin reviewing → quote sent → client deciding → approved → payment due → paid → in progress → delivered`.
- Quote card: scope summary + amount + timeline impact + accept/reject.
- Approved CR auto-generates linked payment block.
- History of all CRs per project.

### 4.6 Files
- Folder tree: `Proposals / Deliverables / Receipts / Brand / Misc`.
- Upload, download, preview (PDF, images, video).
- Version history per file.
- Permissions: admin-only vs client-visible toggle.

### 4.7 Messages
- Thread per project (extensible: thread per CR / proposal later).
- Inline file attachments.
- @mention support.
- Email mirror (reply via email creates portal message).
- Unread badge syncs sidebar.

### 4.8 Settings
- Org profile: name, logo, billing address, tax ID.
- Users: invite teammates, role (Owner / Finance / Member).
- Notifications: per-channel toggles (email digest, payment due, CR updates).
- Connected accounts: Stripe, Google Drive.

---

## 5. Cross-cutting components

- **Status pill system** — unified per state across all surfaces (color + label).
- **Toast notifications** (Sonner pattern) — bottom-right, auto-dismiss.
- **Drawer/sheet** (Vaul) for detail views, not modal stacks.
- **Empty states** w/ illustration + single CTA, never blank tables.
- **Skeleton loaders** for cards/tables, spinners only for buttons.
- **⌘K command bar** global.

---

## 6. Auth & permissions

- Email + magic link (default) or password.
- Optional SSO v2 (Google).
- Roles per user: `Owner / Finance / Member / Viewer`.
  - Owner: all
  - Finance: payments + proposals
  - Member: timeline + files + messages
  - Viewer: read-only

---

## 7. Notifications

- In-app (bell + sidebar badges).
- Email digest (configurable: instant / daily / weekly).
- Triggers: proposal sent, payment due (T-7, T-3, T-0, overdue), CR quote ready, file uploaded by admin, message received.

---

## 8. Out of scope v1

- Mobile native app (responsive web only).
- White-label theming per client.
- API access for clients.
- In-portal video calls.
- Two-way calendar sync.
