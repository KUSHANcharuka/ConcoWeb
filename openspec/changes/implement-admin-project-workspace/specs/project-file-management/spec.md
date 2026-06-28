## ADDED Requirements

### Requirement: Project folder tree
The system SHALL support nested folders for project files.

#### Scenario: Creating a folder
- **WHEN** an admin creates a folder in the Files section
- **THEN** the system persists the folder under the selected parent folder or project root

#### Scenario: Viewing nested folders
- **WHEN** an admin opens the Files section
- **THEN** the system displays the project folder hierarchy and files within the selected folder

### Requirement: Project file uploads
The system SHALL upload project files to R2 and store metadata in the asset and project file records.

#### Scenario: Uploading a project file
- **WHEN** an admin uploads a file into a project folder
- **THEN** the system stores the object in R2, creates asset metadata, and links it to the selected folder

### Requirement: File and folder management
The system SHALL allow admins to rename, delete, and move project files and folders.

#### Scenario: Renaming a folder
- **WHEN** an admin renames a folder
- **THEN** the system persists the new folder name and keeps its child contents

#### Scenario: Moving a file
- **WHEN** an admin moves a file to another folder
- **THEN** the system updates the file's folder reference without changing the underlying R2 object

#### Scenario: Moving a folder
- **WHEN** an admin moves a folder
- **THEN** the system updates the folder parent and prevents invalid moves into itself or its descendants

#### Scenario: Deleting a file
- **WHEN** an admin deletes a file
- **THEN** the system removes it from the active file manager view without exposing it in future reads

### Requirement: File downloads
The system SHALL provide authorized download/read URLs for project files.

#### Scenario: Downloading a file
- **WHEN** an admin requests to download a project file
- **THEN** the system verifies project access and returns a usable read URL for the R2 object

### Requirement: Client preview files
The system SHALL render project files in Client View as read-only.

#### Scenario: Viewing files in client preview
- **WHEN** an admin opens `/admin/projects/[projectId]/client-view/files`
- **THEN** the system displays the same folder tree and files without upload, rename, delete, or move controls

### Requirement: File authorization
The system SHALL scope every folder and file operation by project and client.

#### Scenario: Cross-project file access attempt
- **WHEN** a file operation references an asset or folder from another project
- **THEN** the system rejects the operation and does not expose the file metadata or R2 URL
