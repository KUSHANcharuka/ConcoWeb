## ADDED Requirements

### Requirement: Project workspace includes product account navigation
The system SHALL expose a `Product Account` tab inside the admin project workspace whenever the project is linked to a downstream product or account-based service.

#### Scenario: Admin opens a product-backed project
- **WHEN** an admin views a project such as `JCC -> Prelim`
- **THEN** the project workspace shows a `Product Account` tab alongside the other project tabs

### Requirement: Product account tab ships as an admin shell in this phase
The system SHALL provide an initial product account surface that reserves the navigation slot and displays scoped account context, even if full account management is deferred.

#### Scenario: Product account is not fully implemented yet
- **WHEN** an admin opens the `Product Account` tab during the first billing release
- **THEN** the system shows a project-scoped placeholder or summary shell
- **AND** the shell communicates that deeper provisioning and stats controls land in a later phase

### Requirement: Product account context remains tied to the project record
The system SHALL derive product account context from the project and product relationship rather than from an unrelated global client screen.

#### Scenario: Admin inspects account scope
- **WHEN** an admin opens the `Product Account` tab for a project
- **THEN** the system identifies the linked client and product from that project
- **AND** future stats or actions are scoped to that relationship
