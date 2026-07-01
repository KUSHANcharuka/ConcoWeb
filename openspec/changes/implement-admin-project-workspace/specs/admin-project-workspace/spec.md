## ADDED Requirements

### Requirement: Admin project workspace routes
The system SHALL provide admin-only project workspace routes under `/admin/projects/[projectId]` with section routes for Overview, Timeline, Proposals, and Files.

#### Scenario: Opening a project root route
- **WHEN** an admin opens `/admin/projects/[projectId]`
- **THEN** the system redirects to `/admin/projects/[projectId]/overview`

#### Scenario: Opening a project section route
- **WHEN** an admin opens a valid project section route
- **THEN** the system renders the project workspace shell with the requested section selected

### Requirement: Admin and client preview mode switch
The system SHALL show a persistent segmented `Admin View / Client View` switch below the admin top navigation on project workspace routes.

#### Scenario: Switching to client preview
- **WHEN** an admin selects `Client View`
- **THEN** the system navigates to the equivalent `/admin/projects/[projectId]/client-view/...` route

#### Scenario: Switching to admin view
- **WHEN** an admin selects `Admin View` from a client preview route
- **THEN** the system navigates to the equivalent `/admin/projects/[projectId]/...` route

### Requirement: Client preview route
The system SHALL provide admin-authenticated client preview routes under `/admin/projects/[projectId]/client-view` that render the client-facing project UI read-only.

#### Scenario: Rendering client preview
- **WHEN** an admin opens `/admin/projects/[projectId]/client-view/timeline`
- **THEN** the system keeps the admin navigation visible and renders the client-facing timeline with edit controls disabled

#### Scenario: Showing preview banner
- **WHEN** an admin views any client preview route
- **THEN** the system shows a small preview banner indicating that the page is an admin preview

### Requirement: Shared project shell
The system SHALL render Admin View and Client View using shared project workspace shell components and the same project data source.

#### Scenario: Shared shell consistency
- **WHEN** the same project is opened in Admin View and Client View
- **THEN** the sidebar, breadcrumb, project identity, section navigation, and content layout use the same underlying shell structure

### Requirement: Paper-inspired project layout
The system SHALL implement the project workspace visual structure from the Paper design reference.

#### Scenario: Project shell layout
- **WHEN** an admin opens a project workspace route
- **THEN** the page includes a left project sidebar, top breadcrumb/search utility row, serif section heading, compact date/filter controls where applicable, and a central content slot

### Requirement: Overview dashboard
The system SHALL provide a real Overview dashboard with core project summary data.

#### Scenario: Overview data display
- **WHEN** an admin opens the Overview section
- **THEN** the system displays project status, date range or target date, current timeline item, latest proposal status, and file count

### Requirement: Deferred tabs
The system SHALL show Payments and Messages as visible but deferred placeholders in the project workspace navigation.

#### Scenario: Opening deferred tab
- **WHEN** an admin opens a deferred Payments or Messages section
- **THEN** the system displays a clear placeholder state and does not expose incomplete workflow controls
