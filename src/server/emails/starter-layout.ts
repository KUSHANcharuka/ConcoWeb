export type EmailBuilderSource = {
  subject?: string;
  subTitle?: string;
  content?: unknown;
  blocks?: Array<{
    type: "heading" | "text" | "button" | "image";
    value?: string;
    href?: string;
    src?: string;
    alt?: string;
  }>;
  brand?: {
    logoUrl?: string | null;
    footerCompanyName?: string | null;
    footerAddress?: string | null;
    footerContactEmail?: string | null;
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
    subTitle: "",
    brand: {
      logoUrl: input?.logoUrl ?? null,
      footerCompanyName: input?.footerCompanyName ?? "Concolabs",
      footerAddress: input?.footerAddress ?? null,
      footerContactEmail: input?.footerContactEmail ?? "hello@concolabs.com",
    },
    blocks: [
      {
        type: "heading",
        value: input?.heading ?? "A note from Concolabs",
      },
      {
        type: "text",
        value:
          input?.body ??
          "We are glad to partner with you. This workspace will keep the project, documents, payments, and updates organized in one place.",
      },
      {
        type: "button",
        value: "Open workspace",
        href: "/admin",
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
