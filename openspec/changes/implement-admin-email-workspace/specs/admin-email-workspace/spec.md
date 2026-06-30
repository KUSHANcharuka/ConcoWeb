## ADDED Requirements

### Requirement: Email workspace sections
The system SHALL provide an admin-only email workspace with Templates, Compose, Suggested, and Sent sections.

#### Scenario: Admin opens email workspace
- **WHEN** an authenticated admin navigates to `/admin/emails`
- **THEN** the system shows navigation for Templates, Compose, Suggested, and Sent

#### Scenario: Non-admin cannot access email workspace
- **WHEN** a non-admin requests the admin email workspace
- **THEN** the system denies access using the existing admin authorization behavior

### Requirement: Templates section
The system SHALL let admins browse, filter, create, edit, archive, and activate typed email templates from the email workspace.

#### Scenario: Admin views templates
- **WHEN** an admin opens the Templates section
- **THEN** the system lists templates with type, lifecycle state, default assignment status, updated time, and last editor

### Requirement: Compose section
The system SHALL let admins create a manual draft from a template or the global starter layout and select recipients before sending.

#### Scenario: Admin starts manual compose
- **WHEN** an admin opens Compose and chooses a template
- **THEN** the system creates an editable draft using that template source and renders a preview

### Requirement: Suggested section
The system SHALL show cron-created suggested drafts separately from manual drafts.

#### Scenario: Admin reviews suggested draft
- **WHEN** an admin opens the Suggested section
- **THEN** the system lists suggested drafts with related client, project, trigger, dedupe context, and current status

### Requirement: Sent section
The system SHALL show immutable sent email records in a read-only archive.

#### Scenario: Admin opens sent email
- **WHEN** an admin opens a sent email record
- **THEN** the system displays the stored sent snapshot, recipients, provider metadata, and delivery status without editable builder controls
