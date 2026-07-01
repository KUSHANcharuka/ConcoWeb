export const clientStatusOptions = [
  { value: "lead", label: "Lead" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "archived", label: "Archived" },
] as const;

export type ClientStatusValue = (typeof clientStatusOptions)[number]["value"];

export function getClientStatusLabel(value: ClientStatusValue) {
  return clientStatusOptions.find((option) => option.value === value)?.label ?? value;
}
