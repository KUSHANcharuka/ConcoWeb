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
      {
        id: "pre-design",
        label: "Pre-design",
        headline: "Answer the client's first question before the first meeting.",
        description: "What can be built on this plot, how high, and at what rough cost. Answered from the plot details alone — before a design brief is even written.",
        products: [
          {
            id: "planning-law-chatbot",
            title: "Planning Law Chatbot",
            painPoint: "You are cross-referencing planning regulations in a book that ChatGPT cannot read accurately — before you have even been paid for the job.",
            features: [
              "Enter the plot location. Get the allowable use, maximum height, floor area ratio, and sanitary requirements instantly.",
              "Outputs a formatted feasibility PDF you can present directly to the client at the first meeting.",
              "No competitor exists for this in the Middle East, Sri Lanka, or KSA."
            ],
            targetMarket: "Architecture firms — Middle East, Sri Lanka, UK",
            status: "Scaling",
            pricing: "USD 4,500 one-off enterprise. USD 400/year maintenance. USD 15/month for SL architects (SLIA — in discussion).",
            videoUrl: "https://drive.google.com/drive/folders/1WbhlgnVj0X2F73J6R_TlOxBr1JHJmkDI?usp=sharing"
          }
        ]
      },
      {
        id: "design",
        label: "Design",
        headline: "Your sketch becomes a CAD file. Your prompt becomes a 3D model. Nothing needs to be redrawn.",
        description: "Three tools that sit between the way architects actually work and the digital files every other team needs — without changing how you design.",
        products: [
          {
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
          },
          {
            id: "auto-conversion-2d-to-3d",
            title: "Auto Conversion 2D to 3D",
            painPoint: "You produce a 2D drawing. A modeller then spends days tracing every element to recreate it in 3D — the same geometry, drawn twice.",
            features: [
              "Computer vision reads your 2D PDF drawing and converts elements directly into a 3D BIM model — no modeller needed for the conversion.",
              "Slab automation is production-ready today. Other elements available as customised modules.",
              "The only complete AI-automated PDF-to-3D product available — all competitors are still in R&D."
            ],
            targetMarket: "Architecture firms — Australia",
            status: "Custom / R&D",
            pricing: "USD 2,200 per customised module.",
            videoUrl: "https://drive.google.com/drive/folders/1H63HxhRAEjOyEDD424G4Yh1BNrKz-6U9?usp=sharing"
          },
          {
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
          }
        ]
      }
    ],
    handoffs: [
      {
        fromStage: "pre-design",
        toStage: "design",
        text: "The planning envelope and height limits confirmed here become the constraints your design works within from the first line drawn.",
        pillText: "Planning Law Chatbot → Hand Drawn to AutoCAD"
      }
    ],
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
      {
        id: "pre-design",
        label: "Pre-design",
        headline: "Faster feasibility. Better land decisions.",
        description: "Two tools that give developers the numbers they need before committing to a site — planning constraints and cost benchmarks, automated from the plot details alone.",
        products: [
          {
            id: "planning-law-chatbot",
            title: "Planning Law Chatbot",
            painPoint: "Your team is checking planning books and calling consultants to find out what can be built on a site — before you have even decided whether to buy it.",
            features: [
              "Enter the plot. Get allowable uses, maximum height, floor area ratio, and key building requirements instantly.",
              "Outputs a feasibility PDF formatted for client or board presentation.",
              "Replaces days of manual research and consultant fees at the earliest stage of a project."
            ],
            targetMarket: "Real estate developers — Middle East, Sri Lanka, UK",
            status: "Scaling",
            pricing: "USD 4,500 one-off enterprise. USD 400/year maintenance.",
            videoUrl: "https://drive.google.com/drive/folders/1WbhlgnVj0X2F73J6R_TlOxBr1JHJmkDI?usp=sharing"
          },
          {
            id: "cost-plan-calculator",
            title: "Cost Plan Calculator + Financial Management",
            painPoint: "Early cost estimates are still calculated by hand from a concept drawing — a process that takes days and produces a number no one fully trusts.",
            features: [
              "Reads the concept drawing, calculates Gross Floor Area, and produces an initial project cost estimate automatically.",
              "Includes a financial planning and task management module for tracking the project's own cost pipeline.",
              "Replaces the ERP-plus-Excel workaround most development teams are still using at feasibility stage."
            ],
            targetMarket: "Real estate developers — universal",
            status: "Scaling",
            pricing: "USD 3,500 one-off. USD 300/year maintenance.",
            videoUrl: "https://drive.google.com/file/d/1hCtxWtFzPzOcWqu7VBon84aMdadLac35/view?usp=sharing"
          }
        ]
      },
      {
        id: "operations",
        label: "Operations",
        headline: "Close the gap between site and finance.",
        description: "Development projects lose money in the space between what happens on site and what gets recorded in the back office. ERP Automations eliminates that gap.",
        products: [
          {
            id: "erp-automations",
            title: "ERP Automations",
            painPoint: "Your ERP is only as accurate as the last person who remembered to update it — and on a development project, that is rarely the same day something happens on site.",
            features: [
              "Email instructions are automatically converted into ERP job cards — no manual transcription by admin staff.",
              "Site app data syncs directly to the ERP, eliminating the lag between field activity and financial records.",
              "Machine learning customisations built per client — already delivered across China, Bangladesh, Sri Lanka, and the UK."
            ],
            targetMarket: "Real estate developers — global",
            status: "Scaling",
            pricing: "USD 500–6,000 one-off customised solution.",
            videoUrl: "https://drive.google.com/drive/folders/18J2VjOiLVjqKuZjIgUzGHVGSg2eFR1hd?usp=sharing"
          }
        ]
      }
    ],
    handoffs: [
      {
        fromStage: "pre-design",
        toStage: "operations",
        text: "Once a project is underway, the ERP automation layer connects field data and financial records — so your development team always has a live view of where money is being spent.",
        pillText: "Cost Plan Calculator → ERP Automations"
      }
    ],
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
      {
        id: "tendering",
        label: "Tendering",
        headline: "Evaluate every bid. Miss nothing. Decide faster.",
        description: "Bid evaluation is still done by copying supplier emails into Excel and building comparison tables by hand. There is a faster way.",
        products: [
          {
            id: "tender-evaluations",
            title: "Tender Evaluations from Email",
            painPoint: "Your team is downloading bid emails one by one, copying prices into a spreadsheet, and building a comparison table manually — for every trade package, on every project.",
            features: [
              "Automatically downloads emails from suppliers and bidders and extracts pricing data for evaluation — no manual data entry.",
              "Produces a side-by-side bid comparison report ready for the award decision.",
              "Handles confidential bidding information with restricted access controls built in."
            ],
            targetMarket: "Contractors — Middle East, Sri Lanka",
            status: "Scaling",
            pricing: "USD 1,500 one-off customised solution.",
            videoUrl: "https://drive.google.com/file/d/1D9wgpsdrfEMBNuGDxDVoDXgRtpkwTegW/view?usp=sharing"
          },
          {
            id: "auto-reinforcement",
            title: "Auto Reinforcement Plugin",
            painPoint: "Reinforcement scheduling is the most time-consuming task your estimators face — every notation identified and measured by hand, then typed into Excel.",
            features: [
              "Computer vision reads rebar notations, lengths, spans, and radii directly from structural drawings.",
              "AI agents generate the complete reinforcement schedule automatically — no manual steps required.",
              "Competing tools still require the estimator to intervene at key points. This one does not."
            ],
            targetMarket: "Contractors — UAE, Australia",
            status: "Custom / R&D",
            pricing: "USD 800/month with customisations.",
            videoUrl: "https://drive.google.com/file/d/1XBMGXEbDW-rCS--nutSVrk7YtacQY0KW/view?usp=sharing"
          },
          {
            id: "2d-drawing-to-boq",
            title: "2D Drawing to BOQ",
            painPoint: "Not every job comes with a Revit model. When it is a 2D drawing, your estimator is back to measuring off the PDF by hand.",
            features: [
              "Reads a 2D PDF structural drawing, identifies building elements using computer vision, and produces a priced BOQ.",
              "Works without a 3D model — the only BOQ automation tool that operates from flat drawings alone.",
              "Extends the estimation workflow to early-stage and non-BIM projects."
            ],
            targetMarket: "Contractors — Middle East, Sri Lanka, Australia",
            status: "Custom / R&D",
            pricing: "Available on request.",
            videoUrl: "https://calendar.app.google/mCq7zBhXrDnEAJvB7", // booking link placeholder as requested
            requestDemoOnly: true
          }
        ]
      },
      {
        id: "construction",
        label: "Construction",
        headline: "Record it once. Report it automatically. Get paid on time.",
        description: "Two tools that replace the printed plan, the Excel DPR, and the manual payment application with a single continuous digital workflow from site to certificate.",
        products: [
          {
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
          },
          {
            id: "measureonair",
            title: "MeasureonAir",
            painPoint: "Getting a payment application out means taking printed plans to site, annotating measurements by hand, then converting everything to Excel in the office. Data gets lost at every step.",
            features: [
              "Record measurements directly against the digital drawing on site — no printed plans, no annotations on paper.",
              "Payment applications and interim certificates generate automatically from the recorded measurements.",
              "A three-step manual process replaced by one continuous digital workflow."
            ],
            targetMarket: "Contractors — Middle East, Sri Lanka",
            status: "Scaling",
            pricing: "USD 200/month per enterprise.",
            videoUrl: "https://www.youtube.com/watch?v=1u8_royKFEE&t=1s"
          }
        ]
      },
      {
        id: "operations",
        label: "Operations",
        headline: "Your back office, running without the bottlenecks.",
        description: "The admin layer that runs underneath every project — connecting site, finance, and management without manual data entry.",
        products: [
          {
            id: "erp-automations",
            title: "ERP Automations",
            painPoint: "Your ERP is updated manually by people who have other jobs to do — and the delay between what happens on site and what gets recorded is where budget overruns hide.",
            features: [
              "Email instructions automatically converted to ERP job cards — no admin transcription required.",
              "Mobile app data syncs directly to the ERP in real time.",
              "Machine learning customisations built per client — delivered across China, Bangladesh, Sri Lanka, and the UK."
            ],
            targetMarket: "Contractors — global",
            status: "Scaling",
            pricing: "USD 500–6,000 one-off customised solution.",
            videoUrl: "https://drive.google.com/drive/folders/18J2VjOiLVjqKuZjIgUzGHVGSg2eFR1hd?usp=sharing"
          },
          {
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
          }
        ]
      }
    ],
    handoffs: [
      {
        fromStage: "tendering",
        toStage: "construction",
        text: "The awarded BOQ and reinforcement schedules become the measurement baseline your site team works from — no re-entry, no version confusion.",
        pillText: "Tender Evaluations → BuildMonitor"
      },
      {
        fromStage: "construction",
        toStage: "operations",
        text: "Site progress data and payment records feed into the ERP automatically — closing the loop between what is built and what is recorded in the back office.",
        pillText: "MeasureonAir → ERP Automations"
      }
    ],
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
      {
        id: "pre-design",
        label: "Pre-design",
        headline: "Give clients a number before the design even starts.",
        description: "Early cost advice is where QS firms win or lose a client relationship. These tools let you produce defensible estimates from a concept drawing in hours, not days.",
        products: [
          {
            id: "cost-plan-calculator",
            title: "Cost Plan Calculator + Financial Management",
            painPoint: "You are calculating GFA from a PDF concept drawing by hand, plugging it into Excel, and producing a cost plan that takes longer than it should at the stage where speed matters most.",
            features: [
              "Reads the concept drawing, calculates Gross Floor Area, and produces the initial cost plan and consultancy fee automatically.",
              "Financial planning and task management module built in — for managing your own firm's project pipeline alongside client deliverables.",
              "Replaces the ERP-plus-Excel combination most QS firms use at feasibility stage."
            ],
            targetMarket: "QS firms — universal",
            status: "Scaling",
            pricing: "USD 3,500 one-off. USD 300/year maintenance.",
            videoUrl: "https://drive.google.com/file/d/1hCtxWtFzPzOcWqu7VBon84aMdadLac35/view?usp=sharing"
          }
        ]
      },
      {
        id: "tendering",
        label: "Tendering",
        headline: "Automate the measurement. Keep the expertise.",
        description: "Four tools that compress the BOQ production and bid evaluation cycle — removing the time-consuming manual steps without removing the QS professional's judgment.",
        products: [
          {
            id: "revit-to-boq",
            title: "Revit to BOQ Plugin",
            painPoint: "Your estimators are manually measuring every element in a Revit model, applying standard measurement rules, and typing the bill by hand — the same process, every project.",
            features: [
              "Identifies all building elements from the Revit model's take-off files and generates a standard BOQ automatically.",
              "AI predicts rates for each line item — existing non-AI tools stop at measurement. This one goes further.",
              "Targets QS firms in the Middle East and Sri Lanka where Revit is the primary modelling environment."
            ],
            targetMarket: "QS firms — Middle East, Sri Lanka",
            status: "Scaling",
            pricing: "USD 1,000/month with customisations.",
            videoUrl: "https://drive.google.com/file/d/15uOlpBeHmQtmWE9ONeX3FOEfpz2OhTfU/view?usp=sharing"
          },
          {
            id: "acc-to-boq",
            title: "Autodesk Construction Cloud to BOQ",
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
          },
          {
            id: "2d-drawing-to-boq",
            title: "2D Drawing to BOQ",
            painPoint: "Not every project has a 3D model. On early-stage or non-BIM projects, your estimator is still measuring off a PDF flat drawing by hand.",
            features: [
              "Reads a 2D PDF structural drawing, identifies elements using computer vision, and produces a priced BOQ — no 3D model required.",
              "The only BOQ automation tool that works from flat drawings alone.",
              "Extends automation to the full range of projects your firm takes on, not just those with BIM."
            ],
            targetMarket: "QS firms — Middle East, Sri Lanka, Australia",
            status: "Custom / R&D",
            pricing: "Available on request.",
            videoUrl: "https://calendar.app.google/mCq7zBhXrDnEAJvB7",
            requestDemoOnly: true
          },
          {
            id: "auto-reinforcement",
            title: "Auto Reinforcement Plugin",
            painPoint: "Reinforcement scheduling is consistently cited as the single most time-consuming task in construction estimating — and it is still done manually in Excel from a structural drawing.",
            features: [
              "Computer vision identifies every rebar notation, length, span, and radius from structural drawings automatically.",
              "Produces the complete reinforcement schedule with no manual intervention at any step.",
              "Competing products still require the estimator to validate and correct at key stages. This one does not."
            ],
            targetMarket: "QS consultancies — UAE, Australia",
            status: "Custom / R&D",
            pricing: "USD 800/month with customisations.",
            videoUrl: "https://drive.google.com/file/d/1XBMGXEbDW-rCS--nutSVrk7YtacQY0KW/view?usp=sharing"
          }
        ]
      },
      {
        id: "construction",
        label: "Construction",
        headline: "Valuations and certificates — without the site visit paperwork.",
        description: "One tool that replaces the printed plan, the hand-annotated measurement, and the Excel conversion with a single digital workflow from site measurement to interim certificate.",
        products: [
          {
            id: "measureonair",
            title: "MeasureonAir",
            painPoint: "Your QS is taking printed drawings to site, annotating measurements by hand, then rebuilding everything in Excel back in the office — a process designed to introduce errors at every stage.",
            features: [
              "Record on-site measurements directly against the digital drawing — no printed plans, no paper annotations.",
              "Payment applications and interim certificates generate automatically from the recorded measurements.",
              "Replaces a multi-step manual process with one continuous digital workflow from measurement to document."
            ],
            targetMarket: "Construction consultancies — Middle East, Sri Lanka",
            status: "Scaling",
            pricing: "USD 200/month per enterprise.",
            videoUrl: "https://www.youtube.com/watch?v=1u8_royKFEE&t=1s"
          }
        ]
      }
    ],
    handoffs: [
      {
        fromStage: "pre-design",
        toStage: "tendering",
        text: "The cost plan produced here sets the budget frame that your BOQ and tender evaluation tools work within throughout the project.",
        pillText: "Cost Plan Calculator → Revit to BOQ Plugin"
      },
      {
        fromStage: "tendering",
        toStage: "construction",
        text: "The BOQ produced here becomes the measurement baseline for site valuation and interim payment certificates in the construction stage.",
        pillText: "Revit to BOQ → MeasureonAir"
      }
    ],
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
      {
        id: "design",
        label: "Design",
        headline: "The conversion work, automated. The creative work, yours.",
        description: "Three tools that remove the most repetitive parts of a modeller's workflow — so the team spends time on complex geometry, coordination, and quality control rather than transcription.",
        products: [
          {
            id: "auto-conversion-2d-to-3d",
            title: "Auto Conversion 2D to 3D",
            painPoint: "The architect draws it in 2D. You trace it in 3D. It is the same geometry, drawn twice — and the tracing is your least valuable work.",
            features: [
              "Computer vision reads a 2D PDF structural drawing and converts elements directly into a 3D BIM model.",
              "Slab automation is production-ready and in use today. Other elements available as customised modules.",
              "The only complete AI-automated PDF-to-3D tool on the market — all competitors are still in R&D."
            ],
            targetMarket: "Structural and architectural modellers — Australia",
            status: "Custom / R&D",
            pricing: "USD 2,200 per customised module.",
            videoUrl: "https://drive.google.com/drive/folders/1H63HxhRAEjOyEDD424G4Yh1BNrKz-6U9?usp=sharing"
          },
          {
            id: "wordtobim",
            title: "WordtoBIM",
            painPoint: "Clients and architects describe what they want in words. You translate that into model geometry line by line — a translation step that should not exist.",
            features: [
              "Generates a 3D model from a plain text prompt — no CAD input required from the requesting party.",
              "Pulls live planning and legal information into the session so the model is compliant from the start.",
              "Generates schedules and analysis material directly from the model in the same interface."
            ],
            targetMarket: "Modelling firms — universal",
            status: "Custom / R&D",
            pricing: "USD 10/month. USD 1,000–6,000 one-off for customisations.",
            videoUrl: "https://drive.google.com/drive/folders/1C8KTwemod1FyxAuZr7jefJLqbs1LCn2L?usp=sharing"
          },
          {
            id: "hand-drawn-to-autocad",
            title: "Hand Drawn to AutoCAD",
            painPoint: "Architects send hand-drawn sketches that need to be converted to CAD before you can begin modelling — a step that is not your job but regularly lands on your desk.",
            features: [
              "Converts a hand-drawn floor plan photograph into a clean CAD file automatically — before it reaches the modelling team.",
              "Adapts to each architect's specific drawing style over time so accuracy improves across a client relationship.",
              "Removes the sketch-to-CAD conversion step from the modelling team's workload entirely."
            ],
            targetMarket: "Modelling firms supporting architects — UK, Australia",
            status: "Scaling",
            pricing: "USD 4,000 one-off per architect. USD 300/year maintenance.",
            videoUrl: "https://drive.google.com/file/d/11wUzRrAVFkZ9ODdBVGoduafccBcFRRqP/view?usp=sharing"
          }
        ]
      }
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
      {
        id: "contract",
        label: "Contract",
        headline: "Contract intelligence that reads the whole project — not just the document.",
        description: "Construction disputes are expensive because the relevant information is spread across the contract, the drawings, the correspondence, and the site records. BuilderBot.ai reads all of them together.",
        products: [
          {
            id: "builderbot",
            title: "BuilderBot.ai",
            painPoint: "Your team searches FIDIC by keyword and uploads documents to ChatGPT — but ChatGPT cannot read 3D models, misreads tables, and has no construction law training. The answers it gives require verification before you can use them.",
            features: [
              "FIDIC-trained legal AI that returns clause-referenced answers — accuracy independently validated against UNSW research, above general-purpose AI tools.",
              "Upload 3D models alongside contract documents and correspondence — ask questions that span the model, the contract, and the project records simultaneously. No other tool does this.",
              "WhatsApp integration and SharePoint/OneDrive connector — works inside the communication and document infrastructure your team already uses."
            ],
            targetMarket: "Construction legal and consulting firms — UAE (primary), global",
            status: "Scaling",
            pricing: "USD 20/month single user. USD 250/month enterprise.",
            videoUrl: "https://drive.google.com/drive/folders/1LjhYwDP6qtu6pAY0qc6H226xLNhB7z-L?usp=sharing",
            visitUrl: "https://builderbot.ai"
          }
        ]
      }
    ],
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
    handoffs: [],
    footerTitle: "Contract intelligence when it matters most.",
    footerSubtext: "Book a 30-minute walkthrough to see how BuilderBot.ai analyzes your contracts and project records."
  }
}
