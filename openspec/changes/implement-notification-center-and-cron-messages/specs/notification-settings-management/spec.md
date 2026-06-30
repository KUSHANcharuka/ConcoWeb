## ADDED Requirements

### Requirement: Admin settings include a dedicated cron notification section
The system SHALL provide a dedicated admin settings section for cron-driven notification and reminder management.

#### Scenario: Admin opens cron notification settings
- **WHEN** an admin navigates to the cron notification settings section
- **THEN** the system shows a dedicated settings surface for reminder policy and reminder message management

### Requirement: Admins can configure reminder enablement and windows
The system SHALL allow admins to enable or disable reminder windows for supported reminder families.

#### Scenario: Admin edits reminder windows
- **WHEN** an admin updates the reminder policy for payment due or access expiry reminders
- **THEN** the system allows the admin to manage the supported reminder windows for that family
- **AND** the saved policy is used by future scheduled reminder runs

### Requirement: Admins can configure in-app reminder message copy
The system SHALL allow admins to manage the message copy used for cron-created in-app reminders.

#### Scenario: Admin edits in-app reminder template copy
- **WHEN** an admin updates the configured copy for a payment or access reminder window
- **THEN** the system saves the edited in-app title/body configuration
- **AND** future reminder notifications render using that saved configuration

### Requirement: Admins can configure reminder email draft copy
The system SHALL allow admins to manage the subject/body copy used for cron-created reminder email drafts.

#### Scenario: Admin edits reminder email draft copy
- **WHEN** an admin updates the configured email subject or body for a payment or access reminder window
- **THEN** the system saves the edited reminder email draft configuration
- **AND** future cron-created reminder email drafts render using that saved configuration

### Requirement: Settings expose scheduler status and recent run visibility
The system SHALL expose scheduler health information in the cron notification settings section.

#### Scenario: Admin reviews scheduler health
- **WHEN** an admin opens the cron notification settings section
- **THEN** the system shows the configured timezone, the effective scheduler cadence, and the most recent reminder run status data

### Requirement: Reminder policy uses a workspace timezone setting
The system SHALL allow the reminder policy to store the workspace timezone used for scheduler evaluation.

#### Scenario: Admin reviews timezone behavior
- **WHEN** an admin opens cron notification settings without changing the default timezone
- **THEN** the system shows Sri Lanka time as the configured workspace timezone for reminder evaluation
