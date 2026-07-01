## ADDED Requirements

### Requirement: Admin and client portals provide a durable notification inbox
The system SHALL provide durable in-app notifications for both the admin portal and the client portal, backed by persisted inbox records rather than transient UI state.

#### Scenario: User opens the notification bell
- **WHEN** an authenticated admin or client user opens the notification bell
- **THEN** the system shows recent notifications from persisted inbox records for that user
- **AND** the result includes unread/read state and a deep link to the source entity when one exists

### Requirement: Notification archives are available per portal surface
The system SHALL provide a full notification archive page for both admin and client portal users.

#### Scenario: User opens the full archive
- **WHEN** a user clicks through from the notification bell to the archive page
- **THEN** the system shows a paginated or scrollable list of that user’s persisted notifications
- **AND** the archive can be filtered by read state and notification type

### Requirement: Notifications support read-state transitions
The system SHALL track read state independently for each recipient inbox notification.

#### Scenario: User reads a notification
- **WHEN** a user opens or explicitly marks an inbox notification as read
- **THEN** the system marks only that recipient’s inbox row as read
- **AND** the unread count updates accordingly

### Requirement: New notifications fan out in realtime without replacing persisted reads
The system SHALL push new inbox notifications to open sessions in realtime while keeping Postgres as the source of truth.

#### Scenario: New notification arrives while user is online
- **WHEN** a new inbox notification is created for a user who has an open session
- **THEN** the system pushes a realtime update to that user’s active portal session
- **AND** the UI updates from the persisted inbox data rather than from ephemeral client-only state

### Requirement: Immediate invoice send creates client notification outcomes
The system SHALL create client notification outcomes when an admin sends an invoice.

#### Scenario: Admin sends an invoice
- **WHEN** an admin sends an invoice to a client
- **THEN** the system creates in-app inbox notifications for the eligible client recipients
- **AND** the system records email delivery state for that invoice notification flow

### Requirement: Immediate proposal send creates client notification outcomes
The system SHALL create client notification outcomes when an admin sends a proposal.

#### Scenario: Admin sends a proposal
- **WHEN** an admin sends a proposal to a client
- **THEN** the system creates in-app inbox notifications for the eligible client recipients
- **AND** the system records email delivery state for that proposal notification flow

### Requirement: Client notifications are scoped to the active client organization
The system SHALL scope client portal notifications to the current client organization context.

#### Scenario: User belongs to multiple client organizations
- **WHEN** a user opens notifications in one active client portal organization
- **THEN** the system returns only notifications for that organization’s eligible inbox rows
- **AND** the user does not see notifications from a different client organization in that portal context
