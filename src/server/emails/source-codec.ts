import * as ts from "typescript";

import {
  cloneBuilderSource,
  createStarterEmailSource,
  type EmailBuilderSource,
} from "./starter-layout";

const REACT_IMPORT = `import { EmailTemplate, Hero, Heading, TextBlock, ButtonBlock, ImageBlock, DividerBlock, SpacerBlock } from "@concolabs/email";`;

function stringifyValue(value: string | number | null | undefined) {
  if (value == null) return "undefined";
  return JSON.stringify(value);
}

function stringifyObject(value: Record<string, unknown>) {
  return JSON.stringify(value, null, 2).replace(/"([^"]+)":/g, "$1:");
}

function isJsxElementNamed(
  node: ts.JsxSelfClosingElement | ts.JsxOpeningElement,
  name: string,
) {
  return node.tagName.getText() === name;
}

function getAttribute(node: ts.JsxAttributes, name: string) {
  return node.properties.find(
    (property): property is ts.JsxAttribute =>
      ts.isJsxAttribute(property) && property.name.getText() === name,
  );
}

function literalFromExpression(expression: ts.Expression): unknown {
  if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
    return expression.text;
  }
  if (ts.isNumericLiteral(expression)) {
    return Number(expression.text);
  }
  if (expression.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (expression.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isArrayLiteralExpression(expression)) {
    return expression.elements.map((element) => literalFromExpression(element as ts.Expression));
  }
  if (ts.isObjectLiteralExpression(expression)) {
    const result: Record<string, unknown> = {};
    for (const property of expression.properties) {
      if (ts.isPropertyAssignment(property)) {
        const key = property.name.getText().replaceAll('"', "").replaceAll("'", "");
        result[key] = literalFromExpression(property.initializer);
      }
    }
    return result;
  }
  return undefined;
}

function getStringAttribute(node: ts.JsxAttributes, name: string) {
  const attribute = getAttribute(node, name);
  if (!attribute?.initializer) return undefined;
  if (ts.isStringLiteral(attribute.initializer)) return attribute.initializer.text;
  if (
    ts.isJsxExpression(attribute.initializer) &&
    attribute.initializer.expression
  ) {
    const value = literalFromExpression(attribute.initializer.expression);
    return typeof value === "string" ? value : value == null ? undefined : String(value);
  }
  return undefined;
}

function getNumberAttribute(node: ts.JsxAttributes, name: string) {
  const attribute = getAttribute(node, name);
  if (!attribute?.initializer) return undefined;
  if (
    ts.isJsxExpression(attribute.initializer) &&
    attribute.initializer.expression
  ) {
    const value = literalFromExpression(attribute.initializer.expression);
    return typeof value === "number" ? value : undefined;
  }
  return undefined;
}

function getObjectAttribute(node: ts.JsxAttributes, name: string) {
  const attribute = getAttribute(node, name);
  if (!attribute?.initializer) return undefined;
  if (
    ts.isJsxExpression(attribute.initializer) &&
    attribute.initializer.expression
  ) {
    const value = literalFromExpression(attribute.initializer.expression);
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : undefined;
  }
  return undefined;
}

function collectChildrenText(
  children: readonly ts.JsxChild[],
  startIndex = 0,
  endIndex = children.length,
) {
  const values: string[] = [];
  for (const child of children.slice(startIndex, endIndex)) {
    if (ts.isJsxText(child)) {
      const text = child.getText().replace(/\s+/g, " ").trim();
      if (text) values.push(text);
    }
    if (ts.isJsxExpression(child) && child.expression) {
      const value = literalFromExpression(child.expression);
      if (typeof value === "string" && value.trim()) values.push(value.trim());
    }
  }
  return values.join(" ").trim();
}

export function normalizeEmailSource(source: unknown): EmailBuilderSource {
  const cloned = cloneBuilderSource(source);
  if (!cloned.previewText) {
    cloned.previewText = cloned.subject ?? "A message from Concolabs";
  }
  if (!cloned.theme) {
    cloned.theme = createStarterEmailSource().theme;
  }
  if (!cloned.brand?.brandLabel) {
    cloned.brand = {
      ...cloned.brand,
      brandLabel: "Concolabs",
      socials: cloned.brand?.socials ?? [],
    };
  }
  if (!cloned.blocks || cloned.blocks.length === 0) {
    cloned.blocks = createStarterEmailSource().blocks;
  }
  return cloned;
}

export function emailSourceToReactSource(source: unknown) {
  const normalized = normalizeEmailSource(source);
  const brand = normalized.brand ?? {};
  const theme = normalized.theme ?? {};
  const lines: string[] = [
    REACT_IMPORT,
    "",
    "export default function EmailTemplatePreview() {",
    "  return (",
    "    <EmailTemplate",
    `      subject=${stringifyValue(normalized.subject ?? "A note from Concolabs")}`,
    `      preview=${stringifyValue(normalized.previewText ?? "")}`,
    `      brand={${stringifyObject({
      logoUrl: brand.logoUrl ?? null,
      brandLabel: brand.brandLabel ?? "Concolabs",
      footerCompanyName: brand.footerCompanyName ?? "Concolabs",
      footerAddress: brand.footerAddress ?? "",
      footerContactEmail: brand.footerContactEmail ?? "hello@concolabs.com",
      socials: brand.socials ?? [],
    })}}`,
    `      theme={${stringifyObject({
      canvasColor: theme.canvasColor ?? "#efede7",
      surfaceColor: theme.surfaceColor ?? "#ffffff",
      textColor: theme.textColor ?? "#18181b",
      mutedColor: theme.mutedColor ?? "#71717a",
      accentColor: theme.accentColor ?? "#18181b",
      fontFamily: theme.fontFamily ?? "Georgia, 'Times New Roman', serif",
    })}}`,
    "    >",
  ];

  for (const block of normalized.blocks ?? []) {
    if (block.type === "hero") {
      lines.push(
        `      <Hero eyebrow=${stringifyValue(block.eyebrow ?? "")} title=${stringifyValue(block.title ?? "")} body=${stringifyValue(block.body ?? "")} imageUrl=${stringifyValue(block.src ?? "")} />`,
      );
      continue;
    }
    if (block.type === "heading") {
      lines.push(`      <Heading>${block.value ?? ""}</Heading>`);
      continue;
    }
    if (block.type === "text") {
      lines.push(`      <TextBlock>${block.value ?? ""}</TextBlock>`);
      continue;
    }
    if (block.type === "button") {
      lines.push(
        `      <ButtonBlock href=${stringifyValue(block.href ?? "#")} align=${stringifyValue(block.align ?? "left")}>${block.value ?? "Open"}</ButtonBlock>`,
      );
      continue;
    }
    if (block.type === "image") {
      lines.push(
        `      <ImageBlock src=${stringifyValue(block.src ?? "")} alt=${stringifyValue(block.alt ?? "")} caption=${stringifyValue(block.caption ?? "")} />`,
      );
      continue;
    }
    if (block.type === "divider") {
      lines.push("      <DividerBlock />");
      continue;
    }
    if (block.type === "spacer") {
      lines.push(`      <SpacerBlock height={${block.height ?? 24}} />`);
    }
  }

  lines.push("    </EmailTemplate>");
  lines.push("  );");
  lines.push("}");
  return lines.join("\n");
}

export function reactSourceToEmailSource(sourceText: string) {
  const file = ts.createSourceFile(
    "email-template.tsx",
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  let root:
    | ts.JsxSelfClosingElement
    | ts.JsxElement
    | null = null;

  function visit(node: ts.Node) {
    if (ts.isJsxElement(node) && node.openingElement.tagName.getText() === "EmailTemplate") {
      root = node;
      return;
    }
    if (ts.isJsxSelfClosingElement(node) && node.tagName.getText() === "EmailTemplate") {
      root = node;
      return;
    }
    ts.forEachChild(node, visit);
  }

  visit(file);

  if (!root) {
    throw new Error("React source must contain a single <EmailTemplate> root.");
  }

  const rootNode = root as {
    kind: ts.SyntaxKind;
    openingElement?: { attributes: ts.JsxAttributes };
    children?: readonly ts.JsxChild[];
    attributes?: ts.JsxAttributes;
  };
  const normalized = createStarterEmailSource();
  let openingAttributes: ts.JsxAttributes;
  let children: readonly ts.JsxChild[] = [];
  if (rootNode.kind === ts.SyntaxKind.JsxElement) {
    openingAttributes = rootNode.openingElement!.attributes;
    children = rootNode.children ?? [];
  } else {
    openingAttributes = rootNode.attributes!;
  }

  normalized.subject =
    getStringAttribute(openingAttributes, "subject") ?? normalized.subject;
  normalized.previewText =
    getStringAttribute(openingAttributes, "preview") ?? normalized.previewText;
  normalized.brand = {
    ...normalized.brand,
    ...(getObjectAttribute(openingAttributes, "brand") as EmailBuilderSource["brand"]),
  };
  normalized.theme = {
    ...normalized.theme,
    ...(getObjectAttribute(openingAttributes, "theme") as EmailBuilderSource["theme"]),
  };

  const blocks: NonNullable<EmailBuilderSource["blocks"]> = [];

  for (const child of children) {
    if (ts.isJsxText(child)) continue;
    if (!ts.isJsxElement(child) && !ts.isJsxSelfClosingElement(child)) continue;

    const opening = ts.isJsxElement(child) ? child.openingElement : child;

    if (isJsxElementNamed(opening, "Hero")) {
      blocks.push({
        type: "hero",
        eyebrow: getStringAttribute(opening.attributes, "eyebrow"),
        title: getStringAttribute(opening.attributes, "title"),
        body: getStringAttribute(opening.attributes, "body"),
        src: getStringAttribute(opening.attributes, "imageUrl"),
      });
      continue;
    }

    if (isJsxElementNamed(opening, "Heading") && ts.isJsxElement(child)) {
      blocks.push({
        type: "heading",
        value: collectChildrenText(child.children),
      });
      continue;
    }

    if (isJsxElementNamed(opening, "TextBlock") && ts.isJsxElement(child)) {
      blocks.push({
        type: "text",
        value: collectChildrenText(child.children),
      });
      continue;
    }

    if (isJsxElementNamed(opening, "ButtonBlock") && ts.isJsxElement(child)) {
      blocks.push({
        type: "button",
        href: getStringAttribute(opening.attributes, "href"),
        align: (getStringAttribute(opening.attributes, "align") as "left" | "center" | undefined) ?? "left",
        value: collectChildrenText(child.children),
      });
      continue;
    }

    if (isJsxElementNamed(opening, "ImageBlock")) {
      blocks.push({
        type: "image",
        src: getStringAttribute(opening.attributes, "src"),
        alt: getStringAttribute(opening.attributes, "alt"),
        caption: getStringAttribute(opening.attributes, "caption"),
      });
      continue;
    }

    if (isJsxElementNamed(opening, "DividerBlock")) {
      blocks.push({ type: "divider" });
      continue;
    }

    if (isJsxElementNamed(opening, "SpacerBlock")) {
      blocks.push({
        type: "spacer",
        height: getNumberAttribute(opening.attributes, "height") ?? 24,
      });
    }
  }

  normalized.blocks = blocks.length > 0 ? blocks : normalized.blocks;
  return normalizeEmailSource(normalized);
}
