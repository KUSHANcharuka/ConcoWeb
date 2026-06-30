## ADDED Requirements

### Requirement: Request notification recipients
The system SHALL let admins configure a list of internal email recipients for request-submission notifications.

#### Scenario: Admin saves recipient list
- **WHEN** an admin updates and saves the request-notification recipient list in settings
- **THEN** the system stores that list for future request notifications

### Requirement: Project request notifications
The system SHALL send a notification email to the configured recipient list when a client submits a new project request.

#### Scenario: New project request submitted
- **WHEN** a client successfully submits a new project request
- **THEN** the system sends a request notification email to the configured internal recipients

### Requirement: Change request notifications
The system SHALL send a notification email to the configured recipient list when a client submits a project change request.

#### Scenario: New change request submitted
- **WHEN** a client successfully submits a project change request
- **THEN** the system sends a request notification email to the configured internal recipients

### Requirement: Empty recipient handling
The system SHALL allow request submission to succeed even if no notification recipients are configured, while skipping outbound request notification delivery.

#### Scenario: Request submitted without configured recipients
- **WHEN** a client submits a request and the recipient list is empty
- **THEN** the system stores the request successfully and does not fail the submission because of missing notification recipients
