## ADDED Requirements

### Requirement: Proposal records
The system SHALL store project proposals with project scope, title, status, source asset, DocuSeal template metadata, DocuSeal submission metadata, and timestamps.

#### Scenario: Listing proposals
- **WHEN** an admin opens the Proposals section
- **THEN** the system lists proposals belonging only to the current project

### Requirement: Proposal source upload
The system SHALL let admins upload proposal source documents to R2 before sending them to DocuSeal Builder.

#### Scenario: Uploading proposal source document
- **WHEN** an admin uploads a valid proposal source document
- **THEN** the system stores the file as an R2-backed asset scoped to the project and proposal

### Requirement: DocuSeal Builder embed
The system SHALL embed self-hosted DocuSeal Builder in Admin View for proposal document preparation.

#### Scenario: Opening builder
- **WHEN** an admin opens a proposal builder session
- **THEN** the system renders `<docuseal-builder>` using a server-generated token and a source document URL

### Requirement: DocuSeal Form embed
The system SHALL embed self-hosted DocuSeal Form in Client View when a proposal has a submitter embed URL.

#### Scenario: Opening signing form preview
- **WHEN** an admin opens a client preview proposal with a DocuSeal submitter embed URL
- **THEN** the system renders `<docuseal-form>` in read-only preview context for that proposal signer surface

### Requirement: Proposal side comments
The system SHALL store and display proposal side comments in Concolabs DB separately from DocuSeal.

#### Scenario: Adding side comment
- **WHEN** an admin adds a proposal side comment
- **THEN** the system stores the comment against the proposal and displays it in the proposal comment panel

#### Scenario: Viewing side comments
- **WHEN** an admin opens a proposal with comments
- **THEN** the system displays those comments alongside the DocuSeal surface

### Requirement: DocuSeal webhook status updates
The system SHALL handle DocuSeal complete and decline webhook events and update proposal status idempotently.

#### Scenario: Completed webhook
- **WHEN** DocuSeal sends a completed event for a known submission
- **THEN** the system marks the related proposal as signed or completed without duplicating state changes

#### Scenario: Declined webhook
- **WHEN** DocuSeal sends a declined event for a known submission
- **THEN** the system marks the related proposal as declined without duplicating state changes

### Requirement: Proposal integration configuration
The system SHALL expose a clear error state when self-hosted DocuSeal configuration is missing or invalid.

#### Scenario: Missing DocuSeal configuration
- **WHEN** an admin opens the Proposals section and DocuSeal is not configured
- **THEN** the system displays an actionable integration configuration error instead of a broken embed
