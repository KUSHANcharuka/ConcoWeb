## ADDED Requirements

### Requirement: Admin request inbox sections
The system SHALL replace the placeholder admin requests page with a real workspace split into `Project Requests` and `Change Requests`.

#### Scenario: Admin opens requests workspace
- **WHEN** an admin opens `/admin/requests`
- **THEN** the system shows separate views for project requests and change requests

### Requirement: Admin request listing and filtering
The system SHALL allow admins to search and filter request lists by relevant request status.

#### Scenario: Admin filters requests
- **WHEN** an admin applies search text or status filters in either request tab
- **THEN** the system narrows the displayed request list to matching requests in that tab

### Requirement: Admin request detail review
The system SHALL let admins open a request detail surface that shows request content, attachments, requester context, and current status.

#### Scenario: Admin opens request detail
- **WHEN** an admin selects a request from the inbox
- **THEN** the system displays the request's full detail, including uploaded attachments and review status

### Requirement: Admin request status handling
The system SHALL let admins mark both project requests and change requests as `approved` or `rejected`.

#### Scenario: Admin approves project request
- **WHEN** an admin approves a project request
- **THEN** the system persists the updated request status for future admin and client reads

#### Scenario: Admin rejects change request
- **WHEN** an admin rejects a change request
- **THEN** the system persists the rejection status for that change request
