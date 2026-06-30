## MODIFIED Requirements

### Requirement: Proposal records
The system SHALL store project proposals with project scope, title, status, source asset, DocuSeal template metadata, DocuSeal submission metadata, timestamps, and sufficient list data to render a proposal dashboard and proposal detail workspace.

#### Scenario: Listing proposals
- **WHEN** an admin opens the Proposals section
- **THEN** the system lists proposals belonging only to the current project

#### Scenario: Showing proposal dashboard metadata
- **WHEN** an admin views the proposals dashboard
- **THEN** each proposal entry includes proposal identity and lifecycle information needed to distinguish drafts, sent proposals, commented proposals, signed proposals, and declined proposals

### Requirement: Proposal source upload
The system SHALL let admins upload proposal source documents to R2 before sending them to DocuSeal Builder, and SHALL restrict that capability to draft proposals only.

#### Scenario: Uploading proposal source document
- **WHEN** an admin uploads a valid proposal source document for a draft proposal
- **THEN** the system stores the file as an R2-backed asset scoped to the project and proposal

#### Scenario: Blocking source replacement after send
- **WHEN** an admin attempts to upload or replace a source document for a non-draft proposal
- **THEN** the system rejects the action and preserves the existing proposal state

### Requirement: DocuSeal Builder embed
The system SHALL embed self-hosted DocuSeal Builder in Admin View for proposal document preparation, and SHALL restrict builder editing to draft proposals only.

#### Scenario: Opening builder for draft proposal
- **WHEN** an admin opens a draft proposal detail workspace
- **THEN** the system renders `<docuseal-builder>` using a server-generated token and a source document URL

#### Scenario: Blocking builder editing after send
- **WHEN** an admin opens a non-draft proposal detail workspace
- **THEN** the system does not expose proposal editing controls or DocuSeal builder actions

### Requirement: DocuSeal Form embed
The system SHALL embed self-hosted DocuSeal Form in Client View when a proposal has a submitter embed URL, and SHALL use a read-only proposal detail route for non-draft proposals.

#### Scenario: Opening signing form preview
- **WHEN** an admin opens a client preview proposal with a DocuSeal submitter embed URL
- **THEN** the system renders `<docuseal-form>` in read-only preview context for that proposal signer surface

### Requirement: Proposal side comments
The system SHALL store and display proposal side comments in Concolabs DB separately from DocuSeal, and SHALL make comments available only after a proposal has been sent.

#### Scenario: Hiding comments for draft proposal
- **WHEN** an admin opens a draft proposal detail workspace
- **THEN** the system does not show proposal comments or draft comment entry controls

#### Scenario: Adding side comment after send
- **WHEN** an admin adds a proposal side comment to a sent or later-state proposal
- **THEN** the system stores the comment against the proposal and displays it in the proposal comment panel

#### Scenario: Viewing side comments
- **WHEN** an admin opens a non-draft proposal with comments
- **THEN** the system displays those comments alongside the proposal viewing surface

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
- **WHEN** an admin opens the proposal authoring surface and DocuSeal is not configured
- **THEN** the system displays an actionable integration configuration error instead of a broken embed

### Requirement: Proposal immutability after send
The system SHALL treat a proposal as immutable once its status leaves `draft`, and revisions SHALL be created through duplication into a new draft proposal.

#### Scenario: Locking proposal editing after send
- **WHEN** a proposal status becomes `sent`, `commented`, `accepted`, `signed`, `declined`, or `archived`
- **THEN** the system rejects proposal editing mutations and renders the proposal in read-only mode

#### Scenario: Preserving sent proposal history
- **WHEN** an admin needs to revise a previously sent proposal
- **THEN** the system requires creation of a duplicate draft instead of editing the sent proposal directly

### Requirement: Proposal duplication
The system SHALL allow admins to duplicate an existing proposal into a new draft revision without copying proposal comments or prior send state.

#### Scenario: Duplicating a proposal
- **WHEN** an admin selects duplicate on a proposal from the proposals dashboard
- **THEN** the system creates a new draft proposal under the same project using the source proposal content needed for revision work

#### Scenario: Excluding comments from duplicate
- **WHEN** a proposal is duplicated
- **THEN** the system does not copy proposal comments from the source proposal into the new draft

### Requirement: Proposal send workflow
The system SHALL let admins send a draft proposal to selected active client members, create the DocuSeal submission, and trigger Concolabs-managed proposal notification.

#### Scenario: Sending a proposal to selected client recipients
- **WHEN** an admin selects one or more active client members and confirms send for a draft proposal
- **THEN** the system creates the DocuSeal submission for that proposal, marks the proposal as sent, and stores the resulting submission metadata

#### Scenario: Notifying proposal recipients
- **WHEN** a proposal is successfully sent
- **THEN** the system triggers Concolabs-managed proposal notification for the selected client recipients
