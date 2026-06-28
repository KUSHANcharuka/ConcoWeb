import "server-only";

import type { EmailBuilderSource } from "./starter-layout";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function renderFallback(source: EmailBuilderSource) {
  const brand = source.brand ?? {};
  const blocks = source.blocks?.length
    ? source.blocks
    : [
        { type: "heading" as const, value: source.subject ?? "A note from Concolabs" },
        { type: "text" as const, value: "Your Concolabs update is ready." },
      ];

  const bodyHtml = blocks
    .map((block) => {
      if (block.type === "heading") {
        return `<h1 style="margin:0 0 18px;font-size:30px;line-height:1.18;font-family:Georgia,serif;font-weight:400;color:#18181b;">${escapeHtml(block.value ?? "")}</h1>`;
      }
      if (block.type === "button") {
        const href = escapeHtml(block.href ?? "#");
        return `<p style="margin:28px 0;"><a href="${href}" style="display:inline-block;border-radius:999px;background:#18181b;color:#ffffff;padding:12px 18px;text-decoration:none;font-weight:600;">${escapeHtml(block.value ?? "Open")}</a></p>`;
      }
      if (block.type === "image" && block.src) {
        return `<img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt ?? "")}" style="max-width:100%;border-radius:12px;margin:18px 0;" />`;
      }
      return `<p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#3f3f46;">${escapeHtml(block.value ?? "")}</p>`;
    })
    .join("");

  const logo = brand.logoUrl
    ? `<img src="${escapeHtml(brand.logoUrl)}" alt="Concolabs" style="max-height:34px;max-width:160px;" />`
    : `<div style="font-weight:700;letter-spacing:.04em;color:#18181b;">CONCOLABS</div>`;

  const footerLines = [
    brand.footerCompanyName ?? "Concolabs",
    brand.footerAddress ?? null,
    brand.footerContactEmail ?? "hello@concolabs.com",
  ].filter(Boolean);

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#f4f2ef;padding:32px;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e7e5e4;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:30px 34px 12px;">${logo}</td>
            </tr>
            <tr>
              <td style="padding:24px 34px 18px;">${bodyHtml}</td>
            </tr>
            <tr>
              <td style="padding:22px 34px;background:#fafaf9;color:#71717a;font-size:13px;line-height:1.55;">${footerLines.map((line) => escapeHtml(String(line))).join("<br />")}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    html,
    text: stripHtml(`${blocks.map((block) => block.value ?? "").join("\n\n")}\n\n${footerLines.join("\n")}`),
  };
}

export async function renderEmailSource(source: unknown) {
  const typedSource = source as EmailBuilderSource;

  if (typedSource?.content) {
    try {
      const [{ JsonToMjml }, mjmlModule] = await Promise.all([
        import("easy-email-core"),
        import("mjml-browser"),
      ]);
      const mjml = (JsonToMjml as unknown as (input: Record<string, unknown>) => string)({
        data: typedSource.content as unknown,
        mode: "production",
        context: typedSource.content as unknown,
        beautify: false,
      });
      const renderResult = (mjmlModule.default ?? mjmlModule)(mjml, {
        validationLevel: "soft",
        minify: false,
      }) as { html: string; errors?: unknown[] };

      if (renderResult.html) {
        return {
          html: renderResult.html,
          text: stripHtml(renderResult.html),
        };
      }
    } catch {
      // Easy Email/MJML rendering is best-effort in V1. Fallback rendering keeps drafts usable.
    }
  }

  return renderFallback(typedSource);
}
