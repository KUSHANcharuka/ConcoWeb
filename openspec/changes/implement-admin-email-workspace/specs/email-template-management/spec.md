## ADDED Requirements

### Requirement: Global starter layout
The system SHALL use a global Concolabs starter layout as the initial source for every new email template and draft created without an existing template.

#### Scenario: New template uses starter layout
- **WHEN** an admin creates a new template from scratch
- **THEN** the system initializes the template builder source from the current global starter layout

### Requirement: Editable template source
The system SHALL store editable template content as `builder_source_json` and preserve it for future editing.

#### Scenario: Template is reopened
- **WHEN** an admin opens an existing template for editing
- **THEN** the system loads the stored `builder_source_json` into the visual builder

### Requirement: Template types
The system SHALL support typed templates for `welcome`, `proposal`, `payment_reminder`, `invoice`, and `general_outreach`.

#### Scenario: Template type selected
- **WHEN** an admin creates or updates a template
- **THEN** the system requires one supported template type

### Requirement: Template lifecycle
The system SHALL support `draft`, `active`, and `archived` lifecycle states for templates.

#### Scenario: Archived template hidden from selection
- **WHEN** an admin chooses a template for a new draft
- **THEN** the system excludes archived templates from normal selection

### Requirement: Template assignment precedence
The system SHALL resolve templates using project-level overrides before global defaults.

#### Scenario: Project override exists
- **WHEN** the system creates a draft for a project and that project has an override for the requested template type
- **THEN** the system uses the project override instead of the global default

#### Scenario: No project override exists
- **WHEN** the system creates a draft for a project without an override for the requested template type
- **THEN** the system uses the active global default for that template type
