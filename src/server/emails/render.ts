import "server-only";

import type { EmailBuilderSource } from "./starter-layout";
import { normalizeEmailSource } from "./source-codec";

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
  const normalized = normalizeEmailSource(source);
  const brand = normalized.brand ?? {};
  const theme = normalized.theme ?? {};
  const blocks = normalized.blocks?.length
    ? normalized.blocks
    : [
        { type: "heading" as const, value: normalized.subject ?? "A note from Concolabs" },
        { type: "text" as const, value: "Your Concolabs update is ready." },
      ];

  const bodyHtml = blocks
    .map((block) => {
      if (block.type === "hero") {
        const image = block.src
          ? `<img src="${escapeHtml(block.src)}" alt="" style="width:100%;border-radius:20px;display:block;margin:0 0 24px;" />`
          : "";
        return `<section style="margin:0 0 24px;">
          ${image}
          ${
            block.eyebrow
              ? `<div style="margin:0 0 12px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:${theme.mutedColor ?? "#71717a"};">${escapeHtml(block.eyebrow)}</div>`
              : ""
          }
          <h1 style="margin:0 0 14px;font-size:42px;line-height:1.05;font-family:${escapeHtml(theme.fontFamily ?? "Georgia, 'Times New Roman', serif")};font-weight:400;color:${theme.textColor ?? "#18181b"};">${escapeHtml(block.title ?? normalized.subject ?? "")}</h1>
          ${
            block.body
              ? `<p style="margin:0;font-size:17px;line-height:1.7;color:${theme.mutedColor ?? "#52525b"};">${escapeHtml(block.body)}</p>`
              : ""
          }
        </section>`;
      }
      if (block.type === "heading") {
        return `<h2 style="margin:0 0 18px;font-size:30px;line-height:1.18;font-family:${escapeHtml(theme.fontFamily ?? "Georgia, 'Times New Roman', serif")};font-weight:400;color:${theme.textColor ?? "#18181b"};">${escapeHtml(block.value ?? "")}</h2>`;
      }
      if (block.type === "button") {
        const href = escapeHtml(block.href ?? "#");
        const align = block.align === "center" ? "center" : "left";
        return `<p style="margin:28px 0;text-align:${align};"><a href="${href}" style="display:inline-block;border-radius:999px;background:${theme.accentColor ?? "#18181b"};color:#ffffff;padding:12px 18px;text-decoration:none;font-weight:600;">${escapeHtml(block.value ?? "Open")}</a></p>`;
      }
      if (block.type === "image" && block.src) {
        const caption = block.caption
          ? `<div style="margin:10px 0 0;font-size:13px;color:${theme.mutedColor ?? "#71717a"};">${escapeHtml(block.caption)}</div>`
          : "";
        return `<div style="margin:18px 0;"><img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt ?? "")}" style="max-width:100%;border-radius:18px;display:block;" />${caption}</div>`;
      }
      if (block.type === "divider") {
        return `<hr style="margin:28px 0;border:none;border-top:1px solid #e7e5e4;" />`;
      }
      if (block.type === "spacer") {
        return `<div style="height:${block.height ?? 24}px;"></div>`;
      }
      return `<p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#3f3f46;">${escapeHtml(block.value ?? "")}</p>`;
    })
    .join("");

  const logo = brand.logoUrl
    ? `<img src="${escapeHtml(brand.logoUrl)}" alt="${escapeHtml(brand.brandLabel ?? "Concolabs")}" style="max-height:34px;max-width:160px;" />`
    : `<div style="font-weight:700;letter-spacing:.04em;color:${theme.textColor ?? "#18181b"};">${escapeHtml((brand.brandLabel ?? "Concolabs").toUpperCase())}</div>`;

  const footerLines = [
    brand.footerCompanyName ?? "Concolabs",
    brand.footerAddress ?? null,
    brand.footerContactEmail ?? "hello@concolabs.com",
  ].filter(Boolean);
  const socialLinks =
    brand.socials?.length
      ? `<div style="margin:12px 0 0;">${brand.socials
          .map(
            (social) =>
              `<a href="${escapeHtml(social.href)}" style="color:${theme.mutedColor ?? "#71717a"};text-decoration:none;margin-right:12px;">${escapeHtml(social.label)}</a>`,
          )
          .join("")}</div>`
      : "";

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:${theme.canvasColor ?? "#f4f2ef"};padding:32px;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:${theme.surfaceColor ?? "#ffffff"};border:1px solid #e7e5e4;border-radius:26px;overflow:hidden;">
            <tr>
              <td style="padding:30px 34px 12px;">
                <table role="presentation" width="100%"><tr><td>${logo}</td><td align="right" style="font-size:14px;color:${theme.mutedColor ?? "#71717a"};">${escapeHtml(brand.brandLabel ?? "Concolabs")}</td></tr></table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 34px 18px;">${bodyHtml}</td>
            </tr>
            <tr>
              <td style="padding:22px 34px;background:#fafaf9;color:${theme.mutedColor ?? "#71717a"};font-size:13px;line-height:1.55;">${footerLines.map((line) => escapeHtml(String(line))).join("<br />")}${socialLinks}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    html,
    text: stripHtml(
      `${blocks
        .map((block) => block.title ?? block.body ?? block.value ?? "")
        .join("\n\n")}\n\n${footerLines.join("\n")}`,
    ),
  };
}

export async function renderEmailSource(source: unknown) {
  const typedSource = normalizeEmailSource(source as EmailBuilderSource);

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
