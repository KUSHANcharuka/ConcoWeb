## ADDED Requirements

### Requirement: Scheduled payment reminders use fixed business windows
The system SHALL support scheduled payment reminder windows for upcoming and overdue billing events.

#### Scenario: Payment reminder windows are evaluated
- **WHEN** the scheduler evaluates billing reminders for an invoice with an eligible due date
- **THEN** the system supports reminder windows at `7 days before`, `1 day before`, `day-of`, `1 day overdue`, `3 days overdue`, and `7 days overdue`

### Requirement: Scheduled access reminders use fixed business windows
The system SHALL support scheduled access reminder windows for upcoming and expired access states.

#### Scenario: Access reminder windows are evaluated
- **WHEN** the scheduler evaluates access reminders for a project with an eligible access expiry date
- **THEN** the system supports reminder windows at `7 days before`, `1 day before`, `day-of`, `1 day expired`, `3 days expired`, and `7 days expired`

### Requirement: Day-of reminders use workspace-defined local time
The system SHALL evaluate day-of reminder windows using the configured workspace timezone and local trigger time.

#### Scenario: Day-of reminder becomes due
- **WHEN** a payment or access reminder reaches its day-of window
- **THEN** the system treats the reminder as due at `8:00 AM` in the configured workspace timezone
- **AND** the default workspace timezone for this change is Sri Lanka time

### Requirement: Scheduled reminders create in-app inbox notifications
The system SHALL create persisted recipient inbox notifications when a scheduled reminder window becomes due.

#### Scenario: Cron run reaches a due reminder window
- **WHEN** the scheduler finds a payment or access reminder window that is due
- **THEN** the system creates recipient inbox notifications for the eligible audience
- **AND** the created notification is available in the relevant bell and archive surfaces

### Requirement: Scheduled reminder emails are drafted instead of auto-sent in v1
The system SHALL create reminder email delivery state without automatically sending cron-generated reminder emails in v1.

#### Scenario: Cron creates reminder email work
- **WHEN** the scheduler creates a payment or access reminder
- **THEN** the system creates reminder email draft or pending delivery records for the eligible recipients
- **AND** the reminder email is not automatically delivered by the cron process in v1

### Requirement: Scheduled reminders are deduped per entity and window
The system SHALL dedupe scheduled reminders so the same reminder window is not created repeatedly for the same entity and audience.

#### Scenario: Cron repeats after a prior successful reminder creation
- **WHEN** the scheduler runs again for an invoice or access state that already has a created reminder for the same reminder family and window
- **THEN** the system does not create duplicate reminder outcomes for that same window

### Requirement: Scheduled reminder runs are observable
The system SHALL record run metadata for scheduled reminder processing.

#### Scenario: Scheduler completes a run
- **WHEN** a scheduled reminder run finishes
- **THEN** the system records run status, started time, completed time, created counts, skipped counts, and any error information
