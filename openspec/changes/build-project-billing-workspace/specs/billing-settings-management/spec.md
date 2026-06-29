## ADDED Requirements

### Requirement: Admin settings page is implemented in this change
The system SHALL implement the `/admin/settings` page as part of this change and expose the agreed billing-related tabs within that page.

#### Scenario: Admin opens settings during the billing release
- **WHEN** an admin navigates to `/admin/settings`
- **THEN** the system shows a settings surface with tab navigation
- **AND** the settings surface includes `Templates`, `Payment Methods`, and `Webhooks`

### Requirement: Billing settings are managed under admin settings
The system SHALL expose reusable billing configuration under `/admin/settings` rather than duplicating that configuration inside each project.

#### Scenario: Admin needs reusable billing configuration
- **WHEN** an admin needs to manage workspace-wide billing setup
- **THEN** the system provides the relevant controls under the settings area
- **AND** project billing views consume those settings as shared configuration

### Requirement: Settings include billing templates
The system SHALL provide a settings tab for billing templates used to speed up invoice and agreement creation.

#### Scenario: Admin manages invoice/agreement templates
- **WHEN** an admin opens billing templates in settings
- **THEN** the system shows reusable templates that can later be selected during billing workflows

### Requirement: Templates tab is scoped to billing workflows in this phase
The system SHALL scope the first settings templates tab to billing-related templates needed by project billing workflows.

#### Scenario: Admin reviews template scope
- **WHEN** an admin opens the templates tab in this release
- **THEN** the system presents billing-related templates rather than an unrelated general-purpose content template system

### Requirement: Settings include payment method configuration
The system SHALL provide a settings tab for reusable payment method definitions, including the details needed to present those methods on invoices.

#### Scenario: Admin manages payment rails
- **WHEN** an admin opens payment method settings
- **THEN** the system can show and maintain reusable payment rails such as Stripe, US wire transfer, or Sri Lankan bank transfer

### Requirement: Settings include product webhook configuration
The system SHALL provide a settings tab for downstream product billing integrations, including outbound webhook and related product activation configuration.

#### Scenario: Admin configures a product billing integration
- **WHEN** an admin opens webhook settings for a product
- **THEN** the system can store and manage the integration configuration needed for downstream account activation or reconciliation

### Requirement: Settings tabs act as the shared configuration source
The system SHALL make the three billing settings tabs the shared configuration source for project billing workflows.

#### Scenario: Project billing needs shared configuration
- **WHEN** an admin creates or edits billing data inside a project
- **THEN** the project billing workflow can consume templates, payment methods, and webhook configuration from the settings page
