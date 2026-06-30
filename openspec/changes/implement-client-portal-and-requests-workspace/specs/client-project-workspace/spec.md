## ADDED Requirements

### Requirement: Client projects listing
The system SHALL list only projects belonging to the authenticated client organization on `/client-portal/projects`.

#### Scenario: Viewing client projects
- **WHEN** a client opens `/client-portal/projects`
- **THEN** the system shows project cards for projects scoped to that client's organization only

### Requirement: Client project filters and request entry point
The system SHALL provide search and client-relevant filters on the client projects page and SHALL expose a `Request project` action instead of an admin `New project` action.

#### Scenario: Client filters projects
- **WHEN** a client applies search text, status, or project-type filters
- **THEN** the project listing updates using those filters without exposing admin project-creation actions

#### Scenario: Client opens request project flow
- **WHEN** a client activates the `Request project` action
- **THEN** the system opens the new project request workflow from the client projects page

### Requirement: Client project workspace sections
The system SHALL expose project workspace sections for `Overview`, `Timeline`, `Proposals`, `Files`, `Payments`, `Messages`, and `Request Change`.

#### Scenario: Client opens a project workspace
- **WHEN** a client opens `/client-portal/projects/[projectId]`
- **THEN** the system routes the client into the project workspace with the supported client sections

### Requirement: Client-safe project workspace behavior
The system SHALL reuse existing project feature surfaces only in client-safe form and SHALL hide admin-only controls such as admin/client mode toggles, workspace search strips, file-management mutations, and other admin editing actions.

#### Scenario: Client views shared workspace surface
- **WHEN** a client opens a shared project workspace section
- **THEN** the system renders the section without admin-only controls or admin preview labels

### Requirement: Client project access scoping
The system SHALL reject project workspace reads for projects not owned by the authenticated client organization.

#### Scenario: Client attempts cross-client project access
- **WHEN** a client requests a project workspace route for a project owned by another client
- **THEN** the system returns not-found or access-denied behavior without exposing project data
