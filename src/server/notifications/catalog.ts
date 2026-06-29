export const reminderWindowKeys = [
  "t_minus_7d",
  "t_minus_1d",
  "day_of",
  "plus_1d",
  "plus_3d",
  "plus_7d",
] as const;

export type ReminderWindowKey = (typeof reminderWindowKeys)[number];

export const reminderFamilies = ["payment", "access"] as const;
export type ReminderFamily = (typeof reminderFamilies)[number];

export const notificationEventTypes = [
  "invoice.sent",
  "proposal.sent",
  "proposal.comment_added",
  "project_request.submitted",
  "project_request.reviewed",
  "change_request.submitted",
  "change_request.reviewed",
  "payment.proof_submitted",
  "invitation.accepted",
  "payment.reminder",
  "access.reminder",
] as const;

export type NotificationEventType = (typeof notificationEventTypes)[number];

export const defaultReminderWindows: ReminderWindowKey[] = [...reminderWindowKeys];

type MessageTemplate = { title?: string; subject?: string; body: string };

export const defaultReminderInAppTemplates: Record<
  `${ReminderFamily}.${ReminderWindowKey}`,
  Required<Pick<MessageTemplate, "title" | "body">>
> = {
  "payment.t_minus_7d": {
    title: "Payment due in one week",
    body: "{{invoiceTitle}} for {{projectName}} is due in one week on {{dueDate}}.",
  },
  "payment.t_minus_1d": {
    title: "Payment due tomorrow",
    body: "{{invoiceTitle}} for {{projectName}} is due tomorrow on {{dueDate}}.",
  },
  "payment.day_of": {
    title: "Payment due today",
    body: "{{invoiceTitle}} for {{projectName}} is due today. Please complete payment through the portal.",
  },
  "payment.plus_1d": {
    title: "Payment overdue since yesterday",
    body: "{{invoiceTitle}} for {{projectName}} was due yesterday on {{dueDate}} and is still unpaid.",
  },
  "payment.plus_3d": {
    title: "Payment overdue by 3 days",
    body: "{{invoiceTitle}} for {{projectName}} is now 3 days overdue. Please review the invoice and payment options.",
  },
  "payment.plus_7d": {
    title: "Payment overdue by 7 days",
    body: "{{invoiceTitle}} for {{projectName}} is now 7 days overdue. Please resolve payment as soon as possible.",
  },
  "access.t_minus_7d": {
    title: "Access expiry in one week",
    body: "Access for {{projectName}} expires in one week on {{accessExpiryDate}}.",
  },
  "access.t_minus_1d": {
    title: "Access expiry tomorrow",
    body: "Access for {{projectName}} expires tomorrow on {{accessExpiryDate}}. Please complete payment or extension steps.",
  },
  "access.day_of": {
    title: "Access expires today",
    body: "Access for {{projectName}} expires today. Please complete payment or extension steps to avoid interruption.",
  },
  "access.plus_1d": {
    title: "Access expired yesterday",
    body: "Access for {{projectName}} expired yesterday on {{accessExpiryDate}} and has not been extended yet.",
  },
  "access.plus_3d": {
    title: "Access expired 3 days ago",
    body: "Access for {{projectName}} expired 3 days ago. Please resolve billing or extension steps.",
  },
  "access.plus_7d": {
    title: "Access expired 7 days ago",
    body: "Access for {{projectName}} expired 7 days ago and still needs resolution.",
  },
};

export const defaultReminderEmailTemplates: Record<
  `${ReminderFamily}.${ReminderWindowKey}`,
  Required<MessageTemplate>
> = {
  "payment.t_minus_7d": {
    subject: "Payment due in one week: {{invoiceTitle}}",
    title: "Payment due in one week",
    body: "{{invoiceTitle}} for {{projectName}} is due in one week on {{dueDate}}. Review the invoice in the Concolabs portal.",
  },
  "payment.t_minus_1d": {
    subject: "Payment due tomorrow: {{invoiceTitle}}",
    title: "Payment due tomorrow",
    body: "{{invoiceTitle}} for {{projectName}} is due tomorrow on {{dueDate}}. Please review payment options in the Concolabs portal.",
  },
  "payment.day_of": {
    subject: "Payment due today: {{invoiceTitle}}",
    title: "Payment due today",
    body: "{{invoiceTitle}} for {{projectName}} is due today. Please complete payment through the Concolabs portal.",
  },
  "payment.plus_1d": {
    subject: "Payment overdue since yesterday: {{invoiceTitle}}",
    title: "Payment overdue since yesterday",
    body: "{{invoiceTitle}} for {{projectName}} was due yesterday on {{dueDate}} and remains unpaid.",
  },
  "payment.plus_3d": {
    subject: "Payment overdue by 3 days: {{invoiceTitle}}",
    title: "Payment overdue by 3 days",
    body: "{{invoiceTitle}} for {{projectName}} is now 3 days overdue. Please resolve payment in the portal.",
  },
  "payment.plus_7d": {
    subject: "Payment overdue by 7 days: {{invoiceTitle}}",
    title: "Payment overdue by 7 days",
    body: "{{invoiceTitle}} for {{projectName}} is now 7 days overdue. Please resolve payment as soon as possible.",
  },
  "access.t_minus_7d": {
    subject: "Access expiry in one week: {{projectName}}",
    title: "Access expiry in one week",
    body: "Access for {{projectName}} expires in one week on {{accessExpiryDate}}. Review payment or extension steps in the portal.",
  },
  "access.t_minus_1d": {
    subject: "Access expiry tomorrow: {{projectName}}",
    title: "Access expiry tomorrow",
    body: "Access for {{projectName}} expires tomorrow on {{accessExpiryDate}}. Please complete payment or extension steps.",
  },
  "access.day_of": {
    subject: "Access expires today: {{projectName}}",
    title: "Access expires today",
    body: "Access for {{projectName}} expires today. Please complete payment or extension steps to avoid interruption.",
  },
  "access.plus_1d": {
    subject: "Access expired yesterday: {{projectName}}",
    title: "Access expired yesterday",
    body: "Access for {{projectName}} expired yesterday on {{accessExpiryDate}} and has not yet been extended.",
  },
  "access.plus_3d": {
    subject: "Access expired 3 days ago: {{projectName}}",
    title: "Access expired 3 days ago",
    body: "Access for {{projectName}} expired 3 days ago and still needs resolution.",
  },
  "access.plus_7d": {
    subject: "Access expired 7 days ago: {{projectName}}",
    title: "Access expired 7 days ago",
    body: "Access for {{projectName}} expired 7 days ago and still needs resolution.",
  },
};

export function buildReminderTemplateKey(
  family: ReminderFamily,
  window: ReminderWindowKey,
) {
  return `${family}.${window}` as const;
}
