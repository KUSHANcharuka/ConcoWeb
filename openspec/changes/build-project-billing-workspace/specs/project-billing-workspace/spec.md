## ADDED Requirements

### Requirement: Project billing workspace is the primary billing surface
The system SHALL provide a billing workspace within each admin project so billing operations are performed in the context of a specific client project.

#### Scenario: Admin opens billing for a project
- **WHEN** an admin navigates to a project's billing tab
- **THEN** the system shows billing information scoped to that project only
- **AND** the system does not require the admin to leave the project workspace to create or review invoices

### Requirement: Project billing supports many invoices over time
The system SHALL allow each project to contain multiple billing artifacts over time, where each billing artifact represents one invoice or payment request with its own commercial terms.

#### Scenario: Admin reviews billing history
- **WHEN** a project has multiple past and upcoming invoices
- **THEN** the billing workspace shows them as separate billing artifacts within the same project
- **AND** each artifact preserves its own status, dates, and totals

### Requirement: Each invoice can expose multiple payment methods
The system SHALL allow a single invoice to present one or more payment methods so the client can choose an appropriate way to pay the same request.

#### Scenario: Invoice offers card and wire
- **WHEN** an admin configures an invoice with Stripe and wire transfer methods
- **THEN** the invoice exposes both methods as alternatives for the same amount and due bundle
- **AND** the invoice remains a single billing artifact

### Requirement: Access state is separate from due date state
The system SHALL track entitlement validity separately from invoice due dates so project access decisions do not depend on a single billing deadline field.

#### Scenario: Verified payment extends access
- **WHEN** a payment is verified for a project
- **THEN** the system can update access validity independently of the invoice due date
- **AND** billing summary views can show both the next due date and the access expiry date

### Requirement: Billing artifacts can collect proofs and attachments
The system SHALL support billing-related file attachments, including manual payment proofs and invoice-related supporting files, within the same project scope.

#### Scenario: Client submits a wire proof
- **WHEN** a client or admin uploads a payment proof for an invoice
- **THEN** the file is stored as a billing-scoped asset attached to that project and billing artifact
- **AND** authorized reviewers can inspect it from the billing workspace
