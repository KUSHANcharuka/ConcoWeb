export const projectStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
] as const;

export const projectTypeOptions = [
  { value: "custom_build", label: "Custom Build" },
  { value: "saas_setup", label: "SaaS Setup" },
  { value: "website", label: "Website" },
  { value: "mobile_app", label: "Mobile App" },
  { value: "internal_tool", label: "Internal Tool" },
  { value: "other", label: "Other" },
] as const;

export type ProjectStatusValue = (typeof projectStatusOptions)[number]["value"];
export type ProjectTypeValue = (typeof projectTypeOptions)[number]["value"];

export function getProjectStatusLabel(status: ProjectStatusValue | string) {
  return (
    projectStatusOptions.find((option) => option.value === status)?.label ?? status
  );
}

export function getProjectTypeLabel(projectType: ProjectTypeValue | string) {
  return (
    projectTypeOptions.find((option) => option.value === projectType)?.label ??
    projectType
  );
}
