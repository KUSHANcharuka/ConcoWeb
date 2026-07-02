export interface Product {
  id: string
  title: string
  painPoint: string
  features: string[]
  targetMarket: string
  status: string
  pricing: string
  videoUrl: string
  visitUrl?: string
  requestDemoOnly?: boolean
}

export interface HandoffConnector {
  fromStage: string
  toStage: string
  text: string
  pillText: string
}

export interface Stage {
  id: string
  label: string
  headline: string
  description: string
  products: Product[]
}

export interface ComparisonColumn {
  label: string
  description: string
  highlight?: boolean
}

export interface ComparisonSection {
  title: string
  columns: ComparisonColumn[]
}

export interface PersonaData {
  id: string
  url: string
  eyebrow: string
  heroTitle: string
  heroTitleNormal?: string
  heroTitleHighlight?: string
  heroSubtext: string
  stages: Stage[]
  handoffs: HandoffConnector[]
  comparison?: ComparisonSection
  footerTitle: string
  footerSubtext: string
}

const planningLawChatbot: Product = {
    id: "planning-law-chatbot",
    title: "Planning Law Chatbot",
    painPoint: "Your team is checking planning books and calling consultants to find out what can be built on a site — before you have even decided whether to buy it.",
    features: [
      "Enter the plot location. Get the allowable use, maximum height, floor area ratio, and sanitary requirements instantly.",
      "Outputs a formatted feasibility PDF you can present directly to the client at the first meeting.",
      "No competitor exists for this in the Middle East, Sri Lanka, or KSA."
    ],
    targetMarket: "Architecture firms, Developers — Middle East, Sri Lanka, UK",
    status: "Scaling",
    pricing: "USD 4,500 one-off enterprise. USD 400/year maintenance.",
    videoUrl: "https://drive.google.com/drive/folders/1WbhlgnVj0X2F73J6R_TlOxBr1JHJmkDI?usp=sharing"
};

const costPlanCalculator: Product = {
    id: "cost-plan-calculator",
    title: "Cost Plan Calculator + Financial Management",
    painPoint: "Early cost estimates are still calculated by hand from a concept drawing — a process that takes days and produces a number no one fully trusts.",
    features: [
      "Reads the concept drawing, calculates Gross Floor Area, and produces an initial project cost estimate automatically.",
      "Includes a financial planning and task management module for tracking the project's own cost pipeline.",
      "Replaces the ERP-plus-Excel workaround most development teams are still using at feasibility stage."
    ],
    targetMarket: "Real Estate Developers, QS firms — universal",
    status: "Scaling",
    pricing: "USD 3,500 one-off. USD 300/year maintenance.",
    videoUrl: "https://drive.google.com/file/d/1hCtxWtFzPzOcWqu7VBon84aMdadLac35/view?usp=sharing"
};

const handDrawnToAutocad: Product = {
    id: "hand-drawn-to-autocad",
    title: "Hand Drawn to AutoCAD",
    painPoint: "You hand-draw to preserve creative flow. Then you wait days for an outsourcing firm to redraw it — and something always gets lost in translation.",
    features: [
      "Photograph your hand-drawn floor plan. Receive a clean CAD file.",
      "The tool learns your specific drawing style and handwriting over time — so accuracy improves with every project.",
      "Eliminates outsourcing costs and the back-and-forth correction cycle entirely."
    ],
    targetMarket: "Architects — UK, Australia",
    status: "Scaling",
    pricing: "USD 4,000 one-off per architect. USD 300/year maintenance.",
    videoUrl: "https://drive.google.com/file/d/11wUzRrAVFkZ9ODdBVGoduafccBcFRRqP/view?usp=sharing"
};

const autoConversion2dTo3d: Product = {
    id: "auto-conversion-2d-to-3d",
    title: "Auto Conversion 2D to 3D",
    painPoint: "You produce a 2D drawing. A modeller then spends days tracing every element to recreate it in 3D — the same geometry, drawn twice.",
    features: [
      "Computer vision reads your 2D PDF drawing and converts elements directly into a 3D BIM model — no modeller needed for the conversion.",
      "Slab automation is production-ready today. Other elements available as customised modules.",
      "The only complete AI-automated PDF-to-3D product available — all competitors are still in R&D."
    ],
    targetMarket: "Architecture firms, Modellers — Australia",
    status: "Custom / R&D",
    pricing: "USD 2,200 per customised module.",
    videoUrl: "https://drive.google.com/drive/folders/1H63HxhRAEjOyEDD424G4Yh1BNrKz-6U9?usp=sharing"
};

const wordtobim: Product = {
    id: "wordtobim",
    title: "WordtoBIM",
    painPoint: "BIM software was built for modellers, not architects. Getting a design intent into a 3D model still requires skills that have nothing to do with architecture.",
    features: [
      "Describe a building element or layout in plain text. The 3D model is generated from your words.",
      "Pulls live planning and regulatory information into the modelling session automatically.",
      "Generates schedules and analysis material directly — no separate export step."
    ],
    targetMarket: "Architecture firms — universal",
    status: "Custom / R&D",
    pricing: "USD 10/month. USD 1,000–6,000 one-off for customisations.",
    videoUrl: "https://drive.google.com/drive/folders/1C8KTwemod1FyxAuZr7jefJLqbs1LCn2L?usp=sharing"
};

const quantoRevit: Product = {
    id: "revit-to-boq",
    title: "Revit to BOQ Plugin (Quanto for Revit)",
    painPoint: "Your estimators are manually measuring every element in a Revit model, applying standard measurement rules, and typing the bill by hand — the same process, every project.",
    features: [
      "Identifies all elements directly from the Revit model and generates a standard BOQ automatically.",
      "AI predicts rates for each line item — existing non-AI tools stop at measurement. This one goes further.",
      "Targets QS firms in the Middle East and Sri Lanka where Revit is the primary modelling environment."
    ],
    targetMarket: "QS firms — Middle East, Sri Lanka",
    status: "Scaling",
    pricing: "USD 1,000/month with customisations.",
    videoUrl: "https://drive.google.com/file/d/15uOlpBeHmQtmWE9ONeX3FOEfpz2OhTfU/view?usp=sharing"
};

const quantoAcc: Product = {
    id: "acc-to-boq",
    title: "Autodesk Construction Cloud to BOQ (Quanto for ACC)",
    painPoint: "Your UK and Australian clients are working in Autodesk Construction Cloud — but the BOQ still gets produced by exporting to Excel and starting again manually.",
    features: [
      "Same BOQ automation as the Revit plugin, built natively for Autodesk Construction Cloud — no export step.",
      "Automatically reprices when the design proposal changes — live cost proposals as the design evolves.",
      "Built for cloud-first QS practices in the UK and Australia."
    ],
    targetMarket: "QS firms — UK, Australia",
    status: "Scaling",
    pricing: "USD 1,200/month with customisations.",
    videoUrl: "https://drive.google.com/file/d/1V0bIZCuIMfOVcrqw2iaIcLcD-pksGPXU/view?usp=sharing"
};

const quanto2d: Product = {
    id: "2d-drawing-to-boq",
    title: "2D Drawing to BOQ (Quanto for 2D Drawings)",
    painPoint: "Not every project has a 3D model. On early-stage or non-BIM projects, your estimator is still measuring off a PDF flat drawing by hand.",
    features: [
      "Reads a 2D PDF structural drawing, identifies elements using computer vision, and produces a priced BOQ — no 3D model required.",
      "The only BOQ automation tool that works from flat drawings alone.",
      "Extends automation to the full range of projects your firm takes on, not just those with BIM."
    ],
    targetMarket: "Contractors, QS firms — Middle East, Sri Lanka, Australia",
    status: "Custom / R&D",
    pricing: "Available on request.",
    videoUrl: "https://calendar.app.google/mCq7zBhXrDnEAJvB7",
    requestDemoOnly: true
};

const costxToBoq: Product = {
    id: "costx-to-boq",
    title: "CostX to BOQ",
    painPoint: "You already measure and estimate in RIB CostX, but the deliverable your client signs off is a formatted, priced BOQ in their template, structured to NRM2. Getting there still means exporting to Excel and rebuilding the bill by hand.",
    features: [
      "Reads your dimension groups and workbook data, maps them to NRM2 or your client's template.",
      "Produces a priced BOQ in minutes.",
      "Reprices automatically when your CostX estimate changes."
    ],
    targetMarket: "QS firms, cost consultancies and contractors already using RIB CostX — Middle East, Sri Lanka, Australia",
    status: "Available",
    pricing: "USD 1,200/month per seat.",
    videoUrl: "https://calendar.app.google/mCq7zBhXrDnEAJvB7"
};

const quantoCostx: Product = {
    id: "quanto-costx",
    title: "Quanto for CostX",
    painPoint: "Measuring in CostX is just step one. Generating a fully priced, formatted BOQ still requires manual rate lookups and Excel manipulation.",
    features: [
      "Reads your CostX workbook and adds AI rate prediction on top.",
      "Produces a priced BOQ without the manual rate lookup.",
      "Works directly with the workbooks your team already maintains."
    ],
    targetMarket: "QS Firms — UK, Australia, UAE",
    status: "Scaling",
    pricing: "USD 1,200/month with customisations.",
    videoUrl: "https://drive.google.com/file/d/15uOlpBeHmQtmWE9ONeX3FOEfpz2OhTfU/view?usp=sharing"
};

const autoReinforcement: Product = {
    id: "auto-reinforcement",
    title: "Auto Reinforcement Plugin",
    painPoint: "Reinforcement scheduling is consistently cited as the single most time-consuming task in construction estimating — and it is still done manually in Excel from a structural drawing.",
    features: [
      "Computer vision identifies every rebar notation, length, span, and radius from structural drawings automatically.",
      "Produces the complete reinforcement schedule with no manual intervention at any step.",
      "Competing products still require the estimator to validate and correct at key stages. This one does not."
    ],
    targetMarket: "QS consultancies, Contractors — UAE, Australia",
    status: "Custom / R&D",
    pricing: "USD 800/month with customisations.",
    videoUrl: "https://drive.google.com/file/d/1XBMGXEbDW-rCS--nutSVrk7YtacQY0KW/view?usp=sharing"
};

const tenderEvaluations: Product = {
    id: "tender-evaluations",
    title: "Tender Evaluations from Email",
    painPoint: "Your team is downloading bid emails one by one, copying prices into a spreadsheet, and building a comparison table manually — for every trade package, on every project.",
    features: [
      "Automatically downloads emails from suppliers and bidders and extracts pricing data for evaluation — no manual data entry.",
      "Produces a side-by-side bid comparison report ready for the award decision.",
      "Handles confidential bidding information with restricted access controls built in."
    ],
    targetMarket: "Contractors, QS — Middle East, Sri Lanka",
    status: "Scaling",
    pricing: "USD 1,500 one-off customised solution.",
    videoUrl: "https://drive.google.com/file/d/1D9wgpsdrfEMBNuGDxDVoDXgRtpkwTegW/view?usp=sharing"
};

const buildmarketlk: Product = {
    id: "buildmarketlk",
    title: "BuildMarketlk.com",
    painPoint: "Finding a reliable subcontractor or comparing material prices in Sri Lanka still runs on personal contacts and Google — there is no verified central source.",
    features: [
      "Searchable marketplace of material suppliers, builders, and subcontractors across Sri Lanka.",
      "Displays average construction prices so you can benchmark supplier quotes without calling around.",
      "Professional bodies in other countries can license the platform for their own market."
    ],
    targetMarket: "Contractors — Sri Lanka (primary), global licensing",
    status: "Scaling",
    pricing: "USD 14/month for Sri Lanka. USD 7,000 to develop for other countries.",
    videoUrl: "https://drive.google.com/file/d/1SZPURCcouuLthXbbxqzcg7uSmoWpw2fQ/view?usp=sharing"
};

const buildmonitor: Product = {
    id: "buildmonitor",
    title: "BuildMonitor Mobile App",
    painPoint: "Your site managers are writing the Daily Progress Report in Excel at the end of a twelve-hour shift — a contractual requirement that takes an hour of admin every single day.",
    features: [
      "Site personnel record progress on mobile — photos, quantities, activities — during the working day.",
      "Daily Progress Report generates automatically in your contract's required format. No additional input needed.",
      "All updates sync to the ERP, so the office always has a live picture of site progress."
    ],
    targetMarket: "Contractors, builders — Middle East, Sri Lanka",
    status: "Scaling",
    pricing: "USD 100 per user per year.",
    videoUrl: "https://drive.google.com/file/d/1bof_YpZZdzkxGAQEfGqYNdAASqSkiZ0p/view?usp=sharing"
};

const measureonair: Product = {
    id: "measureonair",
    title: "MeasureonAir",
    painPoint: "Getting a payment application out means taking printed plans to site, annotating measurements by hand, then converting everything to Excel in the office. Data gets lost at every step.",
    features: [
      "Record on-site measurements directly against the digital drawing — no printed plans, no paper annotations.",
      "Payment applications and interim certificates generate automatically from the recorded measurements.",
      "Replaces a multi-step manual process with one continuous digital workflow from measurement to document."
    ],
    targetMarket: "Construction consultancies, Contractors — Middle East, Sri Lanka",
    status: "Scaling",
    pricing: "USD 200/month per enterprise.",
    videoUrl: "https://www.youtube.com/watch?v=1u8_royKFEE&t=1s"
};

const builderbot: Product = {
    id: "builderbot",
    title: "BuilderBot.ai",
    painPoint: "Your team searches FIDIC by keyword and uploads documents to ChatGPT — but ChatGPT cannot read 3D models, misreads tables, and has no construction law training. The answers it gives require verification.",
    features: [
      "FIDIC-trained legal AI that returns clause-referenced answers — accuracy independently validated against UNSW research, above general-purpose AI tools.",
      "Upload 3D models alongside contract documents and correspondence — ask questions that span the model, the contract, and the project records simultaneously. No other tool does this.",
      "WhatsApp integration and SharePoint/OneDrive connector — works inside the communication and document infrastructure your team already uses."
    ],
    targetMarket: "Construction legal, Contractors, QS — UAE (primary), global",
    status: "Scaling",
    pricing: "USD 20/month single user. USD 250/month enterprise.",
    videoUrl: "https://drive.google.com/drive/folders/1LjhYwDP6qtu6pAY0qc6H226xLNhB7z-L?usp=sharing",
    visitUrl: "https://builderbot.ai"
};

const prelim: Product = {
    id: "prelim",
    title: "Prelim (Task & Productivity Management)",
    painPoint: "Managing QS tasks across projects, teams, and locations leads to disconnected tracking and inefficient resource allocation.",
    features: [
      "Runs the whole QS team from one place: structured task creation, designation-based assignment.",
      "Tracks time, attendance, and leave with self-service check-in.",
      "Benchmarks planned against actual productivity per task, person, and project."
    ],
    targetMarket: "QS Consultancies",
    status: "Available",
    pricing: "USD 50/month per team.",
    videoUrl: "https://drive.google.com/file/d/1XBMGXEbDW-rCS--nutSVrk7YtacQY0KW/view?usp=sharing"
};

const sArchModel = (products: Product[]): Stage => ({
  id: "architecture-and-modelling",
  label: "Architecture & Modelling",
  headline: "The conversion work, automated. The creative work, yours.",
  description: "Remove the most repetitive parts of the workflow — so the team spends time on complex geometry and coordination.",
  products
});

const sFeas = (products: Product[]): Stage => ({
  id: "feasibility",
  label: "Feasibility",
  headline: "Answer the first question before the first meeting.",
  description: "What can be built, how high, and at what rough cost. Answered from the plot details alone — before a design brief is written.",
  products
});

const sBoq = (products: Product[]): Stage => ({
  id: "boq-preparation",
  label: "BOQ Preparation",
  headline: "Automate the measurement. Keep the expertise.",
  description: "Compress the BOQ production cycle — removing time-consuming manual steps without removing professional judgment.",
  products
});

const sTend = (products: Product[]): Stage => ({
  id: "tendering",
  label: "Tendering",
  headline: "Evaluate every bid. Miss nothing. Decide faster.",
  description: "Bid evaluation is still done by copying supplier emails into Excel. There is a faster way.",
  products
});

const sConst = (products: Product[]): Stage => ({
  id: "construction-stage",
  label: "Construction Stage",
  headline: "Record it once. Report it automatically.",
  description: "Tools that replace the printed plan and the manual payment application with a single continuous digital workflow.",
  products
});

const sClaims = (products: Product[]): Stage => ({
  id: "claims-and-legal-disputes",
  label: "Claims & Legal Disputes",
  headline: "Contract intelligence that reads the whole project.",
  description: "Construction disputes are expensive. BuilderBot.ai reads the contract, drawings, and site records together.",
  products
});

export const personasData: Record<string, PersonaData> = {
  architects: {
    id: "architects",
    url: "/solutions/architects",
    eyebrow: "For architects",
    heroTitle: "Design freely. Let the redrawing take care of itself.",
    heroTitleNormal: "Design freely. Let the redrawing",
    heroTitleHighlight: "take care of itself.",
    heroSubtext: "You hand-draw because it is faster to think that way. Concolabs makes sure the rest of the team gets a digital file — without you stopping to redraw it.",
    stages: [
      sArchModel([handDrawnToAutocad, autoConversion2dTo3d, wordtobim]),
      sFeas([planningLawChatbot]),
      sTend([builderbot]),
      sConst([buildmonitor]),
      sClaims([builderbot])
    ],
    handoffs: [],
    footerTitle: "See how Concolabs fits your practice.",
    footerSubtext: "Book a 30-minute walkthrough. We will show you exactly which tools apply to the way your firm works."
  },
  "real-estate-developers": {
    id: "real-estate-developers",
    url: "/solutions/real-estate-developers",
    eyebrow: "For real estate developers",
    heroTitle: "Know your numbers before you commit to the land.",
    heroTitleNormal: "Know your numbers",
    heroTitleHighlight: "before you commit to the land.",
    heroSubtext: "Feasibility, planning compliance, and early cost benchmarking — resolved with data before you spend on design. So the decisions that matter most get made with the right information.",
    stages: [
      sArchModel([wordtobim]),
      sFeas([planningLawChatbot, costPlanCalculator]),
      sBoq([quantoRevit, quantoAcc, quantoCostx, quanto2d, costxToBoq, autoReinforcement, buildmarketlk]),
      sTend([builderbot]),
      sConst([buildmonitor, measureonair, autoReinforcement]),
      sClaims([builderbot])
    ],
    handoffs: [],
    footerTitle: "Better data before the first decision.",
    footerSubtext: "Book a 30-minute walkthrough to see how Concolabs applies to your development pipeline."
  },
  contractors: {
    id: "contractors",
    url: "/solutions/contractors",
    eyebrow: "For contractors and builders",
    heroTitle: "Less time on paperwork. More control on site.",
    heroTitleNormal: "Less time on paperwork.",
    heroTitleHighlight: "More control on site.",
    heroSubtext: "From bid evaluation to payment certificates, the admin that slows your team down runs automatically — so your people spend their time building, not reporting.",
    stages: [
      sArchModel([wordtobim]),
      sFeas([planningLawChatbot]),
      sBoq([quanto2d, costxToBoq, autoReinforcement, buildmarketlk]),
      sTend([builderbot, tenderEvaluations, buildmarketlk]),
      sConst([buildmonitor, measureonair, autoReinforcement])
    ],
    handoffs: [],
    footerTitle: "Less admin. More site time.",
    footerSubtext: "Book a 30-minute walkthrough to see which Concolabs tools apply to your projects right now."
  },
  "construction-consultancies": {
    id: "construction-consultancies",
    url: "/solutions/construction-consultancies",
    eyebrow: "For quantity surveyors and cost consultancies",
    heroTitle: "The BOQ that used to take three weeks. Done today.",
    heroTitleNormal: "The BOQ that used to take three weeks.",
    heroTitleHighlight: "Done today.",
    heroSubtext: "Your value is in judgment, not in measurement. Concolabs automates the measurement so your team focuses on the advice clients are actually paying for.",
    stages: [
      sArchModel([autoConversion2dTo3d]),
      sFeas([costPlanCalculator, prelim]),
      sBoq([quantoRevit, quantoAcc, quantoCostx, quanto2d, costxToBoq, autoReinforcement, buildmarketlk]),
      sTend([tenderEvaluations, buildmarketlk, prelim]),
      sConst([measureonair, autoReinforcement]),
      sClaims([builderbot])
    ],
    handoffs: [],
    footerTitle: "Your team should be advising, not measuring.",
    footerSubtext: "Book a 30-minute walkthrough to see how the BOQ automation suite applies to your firm's current project pipeline."
  },
  modellers: {
    id: "modellers",
    url: "/solutions/modellers",
    eyebrow: "For architectural and structural modellers",
    heroTitle: "Stop redrawing what already exists. Start building what does not.",
    heroTitleNormal: "Stop redrawing what already exists.",
    heroTitleHighlight: "Start building what does not.",
    heroSubtext: "The conversion work — 2D to 3D, sketch to CAD, drawing to model — runs automatically. So your time goes on the complex modelling that actually requires your expertise.",
    stages: [
      sArchModel([handDrawnToAutocad, autoConversion2dTo3d, wordtobim]),
      sFeas([prelim]),
      sBoq([autoReinforcement])
    ],
    handoffs: [],
    footerTitle: "More time for the work that needs your expertise.",
    footerSubtext: "Book a walkthrough to see how the conversion tools integrate with your current modelling workflow."
  },
  "legal-professionals": {
    id: "legal-professionals",
    url: "/solutions/legal-professionals",
    eyebrow: "For construction legal and contract professionals",
    heroTitle: "Every clause. Every document. Every 3D model. One place to ask.",
    heroTitleNormal: "Every clause. Every document. Every 3D model.",
    heroTitleHighlight: "One place to ask.",
    heroSubtext: "BuilderBot.ai is the only AI tool trained on FIDIC that can also read the 3D model and the project records alongside the contract — so you get answers that reflect the full picture, not just the text.",
    stages: [
      sBoq([buildmarketlk]),
      sConst([buildmonitor]),
      sClaims([builderbot])
    ],
    handoffs: [],
    comparison: {
      title: "Why BuilderBot.ai is Different",
      columns: [
        {
          label: "Reading the book (Manual Method)",
          description: "Legal teams search FIDIC by keyword or read the relevant clauses manually. Cross-referencing with project records means switching between multiple documents with no automated connection."
        },
        {
          label: "ChatGPT / general AI",
          description: "Cannot read 3D models. Misinterprets tabular content in FIDIC. No construction law training. Answers require manual verification before they can be used in a professional context."
        },
        {
          label: "BuilderBot.ai",
          description: "FIDIC-trained. Reads 3D models alongside contracts. Clause-referenced answers. UNSW-validated accuracy. WhatsApp and SharePoint integrated. Built for the construction legal professional, not adapted from a general-purpose tool.",
          highlight: true
        }
      ]
    },
    footerTitle: "Contract intelligence when it matters most.",
    footerSubtext: "Book a 30-minute walkthrough to see how BuilderBot.ai analyzes your contracts and project records."
  }
};
