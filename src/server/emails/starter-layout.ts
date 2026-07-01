export type EmailBuilderSource = {
  subject?: string;
  previewText?: string;
  content?: unknown;
  theme?: {
    canvasColor?: string | null;
    surfaceColor?: string | null;
    textColor?: string | null;
    mutedColor?: string | null;
    accentColor?: string | null;
    fontFamily?: string | null;
  };
  blocks?: Array<{
    type: "hero" | "heading" | "text" | "button" | "image" | "divider" | "spacer";
    value?: string;
    title?: string;
    eyebrow?: string;
    body?: string;
    href?: string;
    src?: string;
    alt?: string;
    caption?: string;
    align?: "left" | "center";
    height?: number;
  }>;
  brand?: {
    logoUrl?: string | null;
    brandLabel?: string | null;
    footerCompanyName?: string | null;
    footerAddress?: string | null;
    footerContactEmail?: string | null;
    socials?: Array<{
      label: string;
      href: string;
    }>;
  };
};

export function createStarterEmailSource(input?: {
  logoUrl?: string | null;
  footerCompanyName?: string | null;
  footerAddress?: string | null;
  footerContactEmail?: string | null;
  heading?: string;
  body?: string;
}): EmailBuilderSource {
  return {
    subject: input?.heading ?? "A note from Concolabs",
    previewText: "A message from Concolabs",
    theme: {
      canvasColor: "#efede7",
      surfaceColor: "#ffffff",
      textColor: "#18181b",
      mutedColor: "#71717a",
      accentColor: "#18181b",
      fontFamily: "Georgia, 'Times New Roman', serif",
    },
    brand: {
      logoUrl: input?.logoUrl ?? null,
      brandLabel: "Concolabs",
      footerCompanyName: input?.footerCompanyName ?? "Concolabs",
      footerAddress: input?.footerAddress ?? null,
      footerContactEmail: input?.footerContactEmail ?? "hello@concolabs.com",
      socials: [
        { label: "Instagram", href: "https://instagram.com/concolabs" },
        { label: "LinkedIn", href: "https://linkedin.com/company/concolabs" },
      ],
    },
    blocks: [
      {
        type: "hero",
        eyebrow: "Thanks for joining us",
        title: input?.heading ?? "A note from Concolabs",
        body:
          input?.body ??
          "We are glad to partner with you. This workspace keeps the project, documents, billing, and updates organized in one place.",
      },
      {
        type: "text",
        value:
          "This email can be fully customized before it reaches the client. Update the content, add media, and tailor the CTA to the exact situation.",
      },
      {
        type: "button",
        value: "Open workspace",
        href: "/admin",
        align: "left",
      },
    ],
  };
}

export function cloneBuilderSource(source: unknown): EmailBuilderSource {
  if (!source || typeof source !== "object") {
    return createStarterEmailSource();
  }

  return JSON.parse(JSON.stringify(source)) as EmailBuilderSource;
}
