## ADDED Requirements

### Requirement: Sender configuration
The system SHALL let admins configure the Resend sender identity and reply-to address used for outbound admin emails.

#### Scenario: Sender settings updated
- **WHEN** an admin saves sender and reply-to settings
- **THEN** the system uses those values for future email sends

### Requirement: Starter layout settings
The system SHALL let admins configure the global starter layout source and footer company information.

#### Scenario: Starter layout updated
- **WHEN** an admin updates the starter layout settings
- **THEN** newly created templates and scratch drafts use the updated starter layout

### Requirement: Sent snapshots unaffected by settings changes
The system SHALL NOT mutate existing sent email snapshots when email settings change.

#### Scenario: Footer changes after send
- **WHEN** an admin changes footer company information
- **THEN** previously sent emails continue to display their original stored footer content

### Requirement: Default template assignments
The system SHALL let admins assign active templates as global defaults for each supported template type.

#### Scenario: Default template assigned
- **WHEN** an admin assigns an active template as the default for payment reminders
- **THEN** future payment reminder draft generation uses that template unless a project override exists

### Requirement: Cron configuration visibility
The system SHALL show email suggestion cron cadence and last run status in settings.

#### Scenario: Admin views cron status
- **WHEN** an admin opens email settings
- **THEN** the system shows configured cadence, last run time, last run result, created count, skipped count, and last error if present
