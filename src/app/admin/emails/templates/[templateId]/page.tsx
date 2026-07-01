import { EmailTemplateEditorPageClient } from "~/components/admin/emails/email-template-editor-page-client";

export default async function AdminEmailTemplateDetailPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  return <EmailTemplateEditorPageClient kind="template" templateId={templateId} />;
}
