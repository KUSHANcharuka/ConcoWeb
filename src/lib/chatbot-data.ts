export interface Product {
  id: string;
  name: string;
  glyph: string;
  badge: [string, "rnd" | "scaling" | "avail"];
  vp: string;
  bullets: string[];
  tags: string[];
  price: string;
}

export const PRODUCTS: Record<string, Product> = {
  quanto2d: {
    id: "quanto2d",
    name: "Quanto for 2D Drawings",
    glyph: "BOQ",
    badge: ["Custom / R&D", "rnd"],
    vp: "Priced BOQ from flat drawings — no 3D model needed.",
    bullets: [
      "Computer vision reads PDF / DXF",
      "AI rate prediction from your history",
      "Priced BOQ in minutes",
    ],
    tags: ["QS", "Contractors", "ME", "LK", "AU"],
    price: "Custom — quoted in proposal",
  },
  quantorevit: {
    id: "quantorevit",
    name: "Quanto for Revit",
    glyph: "BOQ",
    badge: ["Scaling", "scaling"],
    vp: "Reads your Revit model and returns a priced BOQ.",
    bullets: [
      "AI rate prediction from pricing history",
      "Hours, not weeks",
      "Direct from the model",
    ],
    tags: ["QS", "Cost Consultancies", "ME", "LK"],
    price: "From $/seat — see proposal",
  },
  costx: {
    id: "costx",
    name: "CostX to BOQ",
    glyph: "BOQ",
    badge: ["Available", "avail"],
    vp: "Client-ready BOQ straight from your CostX workbooks.",
    bullets: [
      "Maps to NRM2 or your template",
      "Reads dimension groups & workbook data",
      "Priced BOQ in minutes",
    ],
    tags: ["QS", "Cost Consultancies", "Contractors"],
    price: "From $/mo — see proposal",
  },
  planning: {
    id: "planning",
    name: "Planning Law Chatbot",
    glyph: "LAW",
    badge: ["Scaling", "scaling"],
    vp: "Instant planning regulations from a plot location.",
    bullets: [
      "Allowable use, height, FAR, sanitary",
      "Formatted feasibility PDF",
      "Client-ready output",
    ],
    tags: ["Architects", "Developers", "ME", "UK", "LK"],
    price: "From $/mo — see proposal",
  },
  handdrawn: {
    id: "handdrawn",
    name: "Hand Drawn to AutoCAD",
    glyph: "CAD",
    badge: ["Scaling", "scaling"],
    vp: "Your sketches become clean CAD files.",
    bullets: [
      "Photograph a hand-drawn plan",
      "Learns your drawing style",
      "Accuracy improves each project",
    ],
    tags: ["Architects", "Modelling Firms", "UK", "AU"],
    price: "From $/mo — see proposal",
  },
  builderbot: {
    id: "builderbot",
    name: "BuilderBot.ai",
    glyph: "FID",
    badge: ["Scaling", "scaling"],
    vp: "FIDIC-trained AI that reads contracts, models & records together.",
    bullets: [
      "Clause-referenced answers",
      "Upload 3D models with contracts",
      "Cross-document questions",
    ],
    tags: ["Legal", "Consulting", "UAE", "Global"],
    price: "From $/mo — see proposal",
  },
  buildmonitor: {
    id: "buildmonitor",
    name: "BuildMonitor Mobile App",
    glyph: "SITE",
    badge: ["Scaling", "scaling"],
    vp: "Daily progress reports that write themselves.",
    bullets: [
      "Site staff log photos & quantities",
      "DPR in your contract format",
      "Offline-first sync",
    ],
    tags: ["Contractors", "Builders", "ME", "LK"],
    price: "From $/mo — see proposal",
  },
  measureonair: {
    id: "measureonair",
    name: "MeasureonAir",
    glyph: "PAY",
    badge: ["Scaling", "scaling"],
    vp: "From site measurement to payment certificate, digitally.",
    bullets: [
      "Measure against the digital drawing",
      "No printed plans",
      "Auto interim certificates",
    ],
    tags: ["Contractors", "Consultancies", "ME", "LK"],
    price: "From $/mo — see proposal",
  },
};

export const ROLES: Record<string, Array<[string, string[]]>> = {
  "Quantity Surveyor": [
    ["Taking BOQ off drawings", ["quanto2d", "quantorevit", "costx"]],
    ["Re-pricing when the design changes", ["quantorevit", "costx"]],
    ["Rate lookups eat my week", ["quantorevit", "costx"]],
  ],
  Architect: [
    ["Feasibility & planning checks", ["planning"]],
    ["Redrawing hand sketches in CAD", ["handdrawn"]],
  ],
  Developer: [
    ["Feasibility & planning checks", ["planning"]],
    ["Early cost & budget certainty", ["quanto2d", "planning"]],
  ],
  Contractor: [
    ["Daily progress reporting", ["buildmonitor"]],
    ["Site measurement to payment", ["measureonair"]],
    ["BOQ from flat drawings", ["quanto2d"]],
  ],
  "3D Modeller": [
    ["Redrawing hand sketches in CAD", ["handdrawn"]],
    ["BOQ from models", ["quantorevit"]],
  ],
  "Legal & Contracts": [
    ["Reading & checking contracts", ["builderbot"]],
  ],
  "Just exploring": [
    ["Cut estimating time", ["quanto2d", "quantorevit"]],
    ["Automate site paperwork", ["buildmonitor", "measureonair"]],
    ["Speed up feasibility", ["planning"]],
  ],
};

export const STORY = {
  region: "QS firm · UAE",
  metric: "85%+",
  sub: "reduction in estimating time with Quanto",
};

export function calculateROI(estimates: number, hours: number, rate: number) {
  const savedHours = Math.round(estimates * hours * 0.85);
  const savedCost = savedHours * rate;
  return { savedHours, savedCost };
}
