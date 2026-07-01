## ADDED Requirements

### Requirement: Scheduled suggestion generation
The system SHALL provide a scheduled job that creates suggested email drafts from due workflow contexts.

#### Scenario: Cron runs
- **WHEN** the email suggestion cron is invoked
- **THEN** the system scans supported project, proposal, billing, and onboarding contexts and creates eligible suggested drafts

### Requirement: Suggested drafts are not sent automatically
The system SHALL create suggested drafts without sending them.

#### Scenario: Suggestion created
- **WHEN** the cron creates a suggested email draft
- **THEN** the draft remains pending admin review and no email is delivered

### Requirement: Suggestion dedupe
The system SHALL dedupe suggested drafts using a stable context key.

#### Scenario: Cron repeats for same context
- **WHEN** the cron runs again for a context that already has an unsent suggested draft with the same dedupe key
- **THEN** the system does not create a duplicate draft

### Requirement: Cron observability
The system SHALL record cron run status, started time, completed time, created draft count, skipped duplicate count, and errors.

#### Scenario: Cron completes
- **WHEN** a cron run finishes
- **THEN** the system records run metadata visible to admins in settings

### Requirement: Billing and product invalidation handoff
The system SHALL allow the same scheduled background process to run email suggestion generation alongside billing/product invalidation dispatch work without coupling email sends to product webhook success.

#### Scenario: Product invalidation fails
- **WHEN** product invalidation dispatch fails during the scheduled run
- **THEN** the system still records email suggestion results independently
