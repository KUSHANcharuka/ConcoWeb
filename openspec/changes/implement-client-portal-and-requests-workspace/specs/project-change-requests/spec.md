## ADDED Requirements

### Requirement: Project-scoped change request submission
The system SHALL allow client users to submit change requests from within a specific project workspace.

#### Scenario: Client submits change request
- **WHEN** a client submits a change request from `Request Change` inside a project workspace
- **THEN** the system creates a change request linked to that project and client organization

### Requirement: Change request form fields
The system SHALL collect a rich-text change description and supporting context for each project change request.

#### Scenario: Client opens request-change page
- **WHEN** a client navigates to the `Request Change` section in a project workspace
- **THEN** the system presents a client-facing submission form for describing the requested change

### Requirement: Change request attachments
The system SHALL support multiple uploaded attachments for each change request using the existing asset-backed upload infrastructure.

#### Scenario: Client uploads multiple change-request files
- **WHEN** a client attaches multiple files to a change request
- **THEN** the system stores those files and links them to that change request

### Requirement: Change request history
The system SHALL show project-scoped change request history within the `Request Change` section.

#### Scenario: Client reviews prior change requests
- **WHEN** a client opens the `Request Change` section for a project with existing requests
- **THEN** the system lists prior change requests for that same project and client

### Requirement: Change request review lifecycle
The system SHALL track change requests through `pending`, `approved`, and `rejected` review states.

#### Scenario: Admin reviews change request
- **WHEN** an admin marks a change request as approved or rejected
- **THEN** future admin and client reads show the updated review status for that request
