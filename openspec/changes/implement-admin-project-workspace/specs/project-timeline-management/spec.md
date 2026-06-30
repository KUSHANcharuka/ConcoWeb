## ADDED Requirements

### Requirement: Timeline records
The system SHALL store project timeline items with project scope, title, description, type, status, dates, and canvas layout coordinates.

#### Scenario: Listing timeline items
- **WHEN** an admin opens a project timeline
- **THEN** the system loads timeline items belonging only to that project

### Requirement: Timeline canvas
The system SHALL render project timeline items on a Paper-inspired canvas with a horizontal time rail, milestone nodes, cards, connectors, zoom controls, and jump-to-today control.

#### Scenario: Rendering timeline canvas
- **WHEN** a project has timeline items
- **THEN** the system displays those items on the visual timeline canvas according to their dates and saved layout positions

### Requirement: Admin timeline editing
The system SHALL allow admins to add, edit, delete, drag, and reposition timeline items from Admin View.

#### Scenario: Adding a timeline item
- **WHEN** an admin creates a timeline item
- **THEN** the system persists the item and renders it on the timeline canvas

#### Scenario: Editing a timeline item
- **WHEN** an admin updates a timeline item's details or status
- **THEN** the system persists the update and refreshes the rendered timeline item

#### Scenario: Dragging a timeline item
- **WHEN** an admin drags a timeline item to a new canvas position
- **THEN** the system persists the new layout coordinates for that item

#### Scenario: Deleting a timeline item
- **WHEN** an admin deletes a timeline item
- **THEN** the system removes it from the timeline canvas and future timeline reads

### Requirement: Client preview timeline
The system SHALL render the same timeline in Client View as read-only.

#### Scenario: Read-only preview
- **WHEN** an admin opens the timeline through `/client-view`
- **THEN** the system renders timeline items without add, edit, delete, or drag controls

### Requirement: Timeline authorization
The system SHALL reject timeline reads and mutations for projects the current admin route cannot access.

#### Scenario: Invalid project access
- **WHEN** a timeline procedure is called for a nonexistent or unauthorized project
- **THEN** the system returns an authorization or not-found error and does not leak timeline data
