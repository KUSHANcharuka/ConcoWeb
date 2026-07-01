## ADDED Requirements

### Requirement: Project request submission
The system SHALL allow client users to submit new project requests from the client projects page.

#### Scenario: Client submits project request
- **WHEN** a client completes the request-project form and submits it
- **THEN** the system creates a new project request scoped to that client organization

### Requirement: Project request form fields
The system SHALL collect a request name, a rich-text requirements body, and optional related product context for a new project request.

#### Scenario: Client fills request-project form
- **WHEN** a client opens the request-project workflow
- **THEN** the system presents fields for the request name and detailed requirements, with optional product context if configured by the form

### Requirement: Project request attachments
The system SHALL support multiple uploaded attachments for each project request using the existing asset-backed upload infrastructure.

#### Scenario: Client uploads multiple request files
- **WHEN** a client attaches more than one supporting file to a new project request
- **THEN** the system stores all uploaded files and links them to that request

### Requirement: Client request visibility
The system SHALL make submitted new project requests visible from the client projects experience even without a dedicated top-level Requests navigation item.

#### Scenario: Client reviews submitted project requests
- **WHEN** a client returns to the projects area after submitting a project request
- **THEN** the system exposes the request's status and core details from within the projects experience
