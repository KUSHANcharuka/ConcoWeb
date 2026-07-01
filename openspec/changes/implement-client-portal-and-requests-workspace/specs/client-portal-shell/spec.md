## ADDED Requirements

### Requirement: Client portal top navigation
The system SHALL render the authenticated client portal with a top navigation that exposes `Dashboard`, `Projects`, `Billing`, and `Settings` only.

#### Scenario: Client opens the portal shell
- **WHEN** an authenticated client user opens any `/client-portal` route
- **THEN** the system shows the Concolabs client portal shell with top navigation entries for `Dashboard`, `Projects`, `Billing`, and `Settings`

### Requirement: Client utility header actions
The system SHALL render client portal utility actions for search, notifications, and the authenticated Clerk user menu.

#### Scenario: Client views topbar utilities
- **WHEN** an authenticated client user opens the portal
- **THEN** the topbar includes search, notifications, and the Clerk user control

### Requirement: Client portal authorization
The system SHALL authorize client portal access by the active Clerk organization and the mapped client record.

#### Scenario: User without matching client org
- **WHEN** a signed-in user opens a client portal route without an active organization or without a mapped client record
- **THEN** the system denies access and redirects to the no-access route

### Requirement: V1 placeholder sections remain visible
The system SHALL keep the client dashboard, billing, and settings routes available in V1 even where the inner workflows remain limited or placeholder-level.

#### Scenario: Client opens placeholder sections
- **WHEN** a client opens `Dashboard`, `Billing`, or `Settings`
- **THEN** the system renders the route inside the new client portal shell instead of failing or exposing admin-only controls
