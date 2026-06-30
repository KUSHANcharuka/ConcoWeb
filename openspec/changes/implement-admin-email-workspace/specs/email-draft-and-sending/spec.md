## ADDED Requirements

### Requirement: Draft source and preview
The system SHALL store editable draft content as `builder_source_json` and store the latest rendered HTML/text preview before send.

#### Scenario: Draft is saved
- **WHEN** an admin saves an email draft
- **THEN** the system stores the builder source and updates the rendered preview output

### Requirement: Recipient modes
The system SHALL support selected client members and client-level default contacts as recipient modes.

#### Scenario: Selected member recipients
- **WHEN** an admin selects specific client members as recipients
- **THEN** the system stores those member email addresses as draft recipients

#### Scenario: Client default contact recipient
- **WHEN** an admin chooses client default contact mode
- **THEN** the system resolves the client primary contact email as the recipient

### Requirement: Manual send
The system SHALL only send V1 emails after an admin explicitly confirms send.

#### Scenario: Admin sends draft
- **WHEN** an admin confirms send for a valid draft with at least one recipient
- **THEN** the system renders the draft, creates an immutable sent email snapshot, and sends through Resend

### Requirement: Immutable sent snapshot
The system SHALL preserve sent email subject, rendered HTML, rendered text, recipients, context, and provider metadata independently from future template or draft changes.

#### Scenario: Template changes after send
- **WHEN** a template used by a sent email is edited later
- **THEN** the sent email still displays the original stored snapshot

### Requirement: Send failure visibility
The system SHALL record failed send attempts and expose the failure status in the admin email workspace.

#### Scenario: Resend send fails
- **WHEN** Resend rejects or fails an email send request
- **THEN** the system records the failure and shows the failed status to admins
