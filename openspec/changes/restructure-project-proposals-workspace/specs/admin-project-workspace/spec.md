## MODIFIED Requirements

### Requirement: Admin project workspace routes
The system SHALL provide admin-only project workspace routes under `/admin/projects/[projectId]` with section routes for Overview, Timeline, Proposals, and Files. The Proposals section SHALL support a dashboard route and nested proposal detail routes.

#### Scenario: Opening a project root route
- **WHEN** an admin opens `/admin/projects/[projectId]`
- **THEN** the system redirects to `/admin/projects/[projectId]/overview`

#### Scenario: Opening a project section route
- **WHEN** an admin opens a valid project section route
- **THEN** the system renders the project workspace shell with the requested section selected

#### Scenario: Opening the proposals dashboard
- **WHEN** an admin opens `/admin/projects/[projectId]/proposals`
- **THEN** the system renders a proposals dashboard that lists proposals for the project and offers create actions without embedding the proposal builder or comments

#### Scenario: Opening a proposal detail route
- **WHEN** an admin opens `/admin/projects/[projectId]/proposals/[proposalId]`
- **THEN** the system renders the project workspace shell with the Proposals section selected and loads the specific proposal detail workspace

### Requirement: Client preview route
The system SHALL provide admin-authenticated client preview routes under `/admin/projects/[projectId]/client-view` that render the client-facing project UI read-only. The Proposals section SHALL mirror the same dashboard/detail route structure used by admin view.

#### Scenario: Rendering client preview
- **WHEN** an admin opens `/admin/projects/[projectId]/client-view/timeline`
- **THEN** the system keeps the admin navigation visible and renders the client-facing timeline with edit controls disabled

#### Scenario: Showing preview banner
- **WHEN** an admin views any client preview route
- **THEN** the system shows a small preview banner indicating that the page is an admin preview

#### Scenario: Opening client preview proposals dashboard
- **WHEN** an admin opens `/admin/projects/[projectId]/client-view/proposals`
- **THEN** the system renders a read-only proposals dashboard for that project

#### Scenario: Opening client preview proposal detail
- **WHEN** an admin opens `/admin/projects/[projectId]/client-view/proposals/[proposalId]`
- **THEN** the system renders the read-only proposal detail surface for that proposal without admin edit controls
