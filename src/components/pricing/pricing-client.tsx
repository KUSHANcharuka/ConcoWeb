"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Sparkles,
  Users,
  ChevronDown,
  Calendar,
  DollarSign,
  FileText,
  Bot,
  Zap,
  ArrowRight,
  ShieldCheck,
  Percent,
  Search,
  Filter,
  Layers,
  Wrench,
  Scale,
  ClipboardList,
  MessageSquare,
  Timer,
  UserCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutModal, type CheckoutProduct } from "./checkout-modal";

// Product Definition
interface Product {
  id: string;
  name: string;
  category: "design" | "estimation" | "operations" | "legal";
  icon: any;
  description: string;
  priceType: "one-off" | "per-seat" | "flat-monthly" | "custom";
  basePrice: number; // Price for the product
  maintenancePrice?: number; // For one-off licenses
  features: string[];
  pill: string;
  status: string;
  demoLink: string;
  externalLink?: string;
}

const PRODUCTS: Product[] = [
  {
    id: "planning_law",
    name: "Planning Law Chatbot",
    category: "estimation",
    icon: Scale,
    description:
      "Enter plot details to get allowable uses, maximum heights, floor area ratios, and local sanitary requirements instantly.",
    priceType: "one-off",
    basePrice: 4500,
    maintenancePrice: 400,
    pill: "Middle East, Sri Lanka, KSA",
    status: "Scaling",
    features: [
      "Auto-generates formatted PDF feasibility briefs",
      "Instant zoning & planning envelope calculation",
      "Tailored compliance checks",
    ],
    demoLink: "http://localhost:3000/learnmore/planning-law-chatbot",
  },
  {
    id: "hand_drawn_cad",
    name: "Hand Drawn to AutoCAD",
    category: "design",
    icon: FileText,
    description:
      "Converts photographed hand-drawn architectural plans into clean, editable AutoCAD files.",
    priceType: "one-off",
    basePrice: 4000,
    maintenancePrice: 300,
    pill: "Architects — UK, Australia",
    status: "Scaling",
    features: [
      "No outsourcing redraw back-and-forth lag",
      "AI learns your style and handwriting",
      "Delivers clean, properly layered CAD files",
    ],
    demoLink:
      "https://drive.google.com/file/d/11wUzRrAVFkZ9ODdBVGoduafccBcFRRqP/view?usp=sharing",
  },
  {
    id: "conversion_2d_3d",
    name: "Auto Conversion 2D to 3D",
    category: "design",
    icon: Layers,
    description:
      "Reads flat 2D blueprint drawings and converts slab/geometry elements automatically into a 3D BIM model.",
    priceType: "one-off",
    basePrice: 2200,
    maintenancePrice: 200,
    pill: "Modellers — Australia",
    status: "Scaling",
    features: [
      "Production-ready slab automation",
      "Saves days of drawing geometry twice",
      "Customized modules built per client requirements",
    ],
    demoLink:
      "https://drive.google.com/drive/folders/1H63HxhRAEjOyEDD424G4Yh1BNrKz-6U9?usp=sharing",
  },
  {
    id: "word_to_bim",
    name: "WordtoBIM",
    category: "design",
    icon: Bot,
    description:
      "Generates compliant 3D models and schedules directly from plain text natural language commands.",
    priceType: "per-seat",
    basePrice: 10,
    pill: "Architecture Firms — Global",
    status: "Custom / R&D",
    features: [
      "Generates 3D models from text prompts",
      "Integrates live regulatory check during modeling",
      "No separate export steps required for schedules",
    ],
    demoLink:
      "https://drive.google.com/drive/folders/1C8KTwemod1FyxAuZr7jefJLqbs1LCn2L?usp=sharing",
  },
  {
    id: "cost_calculator",
    name: "Cost Plan Calculator",
    category: "estimation",
    icon: DollarSign,
    description:
      "Analyzes concept sketches to compute Gross Floor Area (GFA) and generate immediate cost plans.",
    priceType: "one-off",
    basePrice: 3500,
    maintenancePrice: 300,
    pill: "Developers & QS Firms — Universal",
    status: "Scaling",
    features: [
      "Calculates project GFA from concept drawings",
      "Outputs instant early benchmarking report",
      "Includes cost pipeline tracking module",
    ],
    demoLink:
      "https://drive.google.com/file/d/1hCtxWtFzPzOcWqu7VBon84aMdadLac35/view?usp=sharing",
  },
  {
    id: "erp_automation",
    name: "ERP Automations",
    category: "operations",
    icon: Zap,
    description:
      "Translates emails and mobile field entries directly into back-office ERP records and work cards.",
    priceType: "one-off",
    basePrice: 1500, // Staging an average base price from the document range $500 - $6,000
    pill: "Developers & Contractors — Global",
    status: "Scaling",
    features: [
      "Email instruction parser for ERP work order cards",
      "Eliminates delays between site and book office",
      "Custom ML models built per client environment",
    ],
    demoLink:
      "https://drive.google.com/drive/folders/18J2VjOiLVjqKuZjIgUzGHVGSg2eFR1hd?usp=sharing",
  },
  {
    id: "tender_eval",
    name: "Tender Evaluations from Email",
    category: "estimation",
    icon: Filter,
    description:
      "Retrieves bid pricing files from subcontractor emails and tabulates comparisons automatically.",
    priceType: "one-off",
    basePrice: 1500,
    pill: "Contractors — Middle East, Sri Lanka",
    status: "Scaling",
    features: [
      "Downloads email attachments automatically",
      "Extracts bid figures to side-by-side sheet tables",
      "Maintains secure bid confidentiality logs",
    ],
    demoLink:
      "https://drive.google.com/file/d/1D9wgpsdrfEMBNuGDxDVoDXgRtpkwTegW/view?usp=sharing",
  },
  {
    id: "auto_rebar",
    name: "Auto Reinforcement Plugin",
    category: "estimation",
    icon: Wrench,
    description:
      "Scans structural blueprints using computer vision to build rebar measurement schedules.",
    priceType: "flat-monthly",
    basePrice: 800,
    pill: "Contractors & QS — UAE, Australia",
    status: "Custom / R&D",
    features: [
      "Scans notations, spans, lengths, and radii",
      "Zero manual typing in Excel required",
      "Generates fully completed reinforcement schedules",
    ],
    demoLink:
      "https://drive.google.com/file/d/1XBMGXEbDW-rCS--nutSVrk7YtacQY0KW/view?usp=sharing",
  },
  {
    id: "drawing_boq",
    name: "2D Drawing to BOQ",
    category: "estimation",
    icon: FileText,
    description:
      "Identifies structural elements on flat plans to compute a fully priced Bill of Quantities.",
    priceType: "one-off",
    basePrice: 1800,
    maintenancePrice: 150,
    pill: "QS Firms & Contractors — Universal",
    status: "Scaling",
    features: [
      "Works from flat 2D blueprints directly",
      "No 3D Revit file or model needed to take-off",
      "Extends BOQ automation to early estimate jobs",
    ],
    demoLink: "https://calendar.app.google/mCq7zBhXrDnEAJvB7", // Requires request, linking to calendar
  },
  {
    id: "build_monitor",
    name: "BuildMonitor Mobile App",
    category: "operations",
    icon: Users,
    description:
      "Field application for project site managers to record logs, sync photos, and auto-submit Daily Progress Reports (DPR).",
    priceType: "per-seat",
    basePrice: 8, // Billed annually at $100/yr (~$8.33/mo)
    pill: "Contractors & Builders — Middle East, SL",
    status: "Scaling",
    features: [
      "Site managers submit entries via mobile",
      "Auto-generates progress reports in contract format",
      "Syncs field progress straight to project ERP",
    ],
    demoLink:
      "https://drive.google.com/file/d/1bof_YpZZdzkxGAQEfGqYNdAASqSkiZ0p/view?usp=sharing",
  },
  {
    id: "measure_on_air",
    name: "MeasureonAir Plan App",
    category: "operations",
    icon: Layers,
    description:
      "Allows surveyors to register dimensions directly on site drawings, auto-calculating payment claims.",
    priceType: "flat-monthly",
    basePrice: 200,
    pill: "Consultancies & Contractors — Middle East, SL",
    status: "Scaling",
    features: [
      "Records dimensions straight onto drawings on site",
      "Auto-compiles payment application certificates",
      "Replaces manual site sketches with digital timeline",
    ],
    demoLink: "https://www.youtube.com/watch?v=1u8_royKFEE&t=1s",
  },
  {
    id: "build_market",
    name: "BuildMarketlk.com License",
    category: "operations",
    icon: Wrench,
    description:
      "Searchable constructor supplier marketplace and pricing benchmarks portal license.",
    priceType: "flat-monthly",
    basePrice: 14,
    pill: "Contractors — Sri Lanka (Universal Extension)",
    status: "Scaling",
    features: [
      "Search material suppliers and builders",
      "Benchmarked local construction cost quotes",
      "Custom licensing available for other countries",
    ],
    demoLink:
      "https://drive.google.com/file/d/1SZPURCcouuLthXbbxqzcg7uSmoWpw2fQ/view?usp=sharing",
  },
  {
    id: "builder_bot",
    name: "BuilderBot.ai Chatbot",
    category: "legal",
    icon: Scale,
    description:
      "FIDIC contract and drawing intelligence chatbot trained to parse project records and legal clauses.",
    priceType: "per-seat",
    basePrice: 20, // Single user $20/mo
    pill: "Legal & Consultancies — UAE, Global",
    status: "Scaling",
    features: [
      "FIDIC-trained QA with clause citations",
      "Reads 3D models alongside contracts",
      "WhatsApp & SharePoint native integrations",
    ],
    demoLink:
      "https://drive.google.com/drive/folders/1LjhYwDP6qtu6pAY0qc6H226xLNhB7z-L?usp=sharing",
    externalLink: "https://builderbot.ai",
  },
  {
    id: "prelim",
    name: "Prelim",
    category: "operations",
    icon: ClipboardList,
    description:
      "Run your QS team from one platform: tasks, time, attendance, team chat and productivity benchmarking.",
    priceType: "one-off",
    basePrice: 3900,
    maintenancePrice: 240, // USD 20/month = 240/year
    pill: "QS Consultancies & Teams — Sri Lanka, ME, AU",
    status: "Available",
    features: [
      "Task creation with structured IDs and designation-based assignment",
      "Live timer or manual time entry with five-stage status workflow",
      "Self-service attendance with check-in/out and leave approvals",
      "Planned vs actual productivity benchmarking on every task",
    ],
    demoLink: "/learnmore/prelim",
  },
];

const FAQS = [
  {
    q: "Do subcontractors need a paid subscription to collaborate?",
    a: "No! Subcontractors, vendors, and external design consultants can be invited to view schedules, upload logs, and submit field sheets completely for free. You only pay for your internal project management and admin seats.",
  },
  {
    q: "Can I import my existing schedules from MS Project or Primavera P6?",
    a: "Yes. Concolabs supports native XML file uploads, letting you import complex projects from Primavera P6 and MS Project with all dependencies intact. You can also export back to P6/XML files at any time.",
  },
  {
    q: "How does the volume discount work?",
    a: "We automatically apply team discounts directly based on active seats. 11-30 seats get a 5% discount; 31-75 seats get a 10% discount; and 76-150 seats get a 15% discount. If your team is larger than 150, our Enterprise team customizes a volume discount contract.",
  },
  {
    q: "What training and onboarding support is included?",
    a: "Every Professional plan includes an onboarding consultation with our construction workflows team. Enterprise plans include a dedicated Customer Success Manager, team training webinars, and a custom migration of your active drawing logs.",
  },
  {
    q: "Is my drawing and budget data secure?",
    a: "Absolutely. Concolabs utilizes SOC 2 Type II certified data centers, implements strict AES 256-bit encryption for stored files, and encrypts all network requests. Enterprise clients can customize internal SSO authentication policies.",
  },
  {
    q: "Can we switch between Monthly and Annual billing?",
    a: "Yes. You can switch to annual billing at any point from your team dashboard to immediately save 20%. Plan upgrades apply immediately, while downgrades take effect at the end of your current billing period.",
  },
];

export function PricingClient({ preselectedProduct }: { preselectedProduct?: string }) {
  const [activeTab, setActiveTab] = useState<
    "all" | "design" | "estimation" | "operations" | "legal"
  >("all");
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">(
    "annual",
  );
  const [seats, setSeats] = useState<number>(10);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    preselectedProduct && PRODUCTS.some((p) => p.id === preselectedProduct)
      ? [preselectedProduct]
      : PRODUCTS.filter((p) => p.priceType !== "custom").map((p) => p.id), // Default selecting standard tools
  );

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Toggle selection
  const handleToggleProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id],
    );
  };

  // Visual Category filtering
  const filteredProducts = useMemo(() => {
    if (activeTab === "all") return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === activeTab);
  }, [activeTab]);

  // Multi-Product Bundle Discount
  const bundleDiscountPercent = useMemo(() => {
    const count = selectedProducts.length;
    if (count === 2) return 10;
    if (count === 3) return 15;
    if (count >= 4) return 25;
    return 0;
  }, [selectedProducts]);

  // Volume Seat Discount
  const seatDiscountPercent = useMemo(() => {
    if (seats <= 10) return 0;
    if (seats <= 30) return 5;
    if (seats <= 75) return 10;
    if (seats <= 150) return 15;
    return 20;
  }, [seats]);

  // Calculate pricing subtotals
  const pricingSubtotals = useMemo(() => {
    let oneOffTotal = 0;
    let flatMonthlyTotal = 0;
    let perSeatUserRateSum = 0;
    let annualMaintenanceTotal = 0;

    const activeList = PRODUCTS.filter((p) => selectedProducts.includes(p.id));

    activeList.forEach((p) => {
      if (p.priceType === "one-off") {
        oneOffTotal += p.basePrice;
        if (p.maintenancePrice) {
          annualMaintenanceTotal += p.maintenancePrice;
        }
      } else if (p.priceType === "flat-monthly") {
        flatMonthlyTotal += p.basePrice;
      } else if (p.priceType === "per-seat") {
        perSeatUserRateSum += p.basePrice;
      }
    });

    // Apply seat discount on seat total
    const discountedPerSeatRate =
      perSeatUserRateSum * (1 - seatDiscountPercent / 100);
    const perSeatMonthlySubtotal = Math.round(discountedPerSeatRate * seats);

    // Total monthly subtotal
    const monthlyRecurringSubtotal = flatMonthlyTotal + perSeatMonthlySubtotal;

    // Apply bundle discount on all fees
    const finalMonthlyRecurring = Math.round(
      monthlyRecurringSubtotal * (1 - bundleDiscountPercent / 100),
    );
    const finalOneOff = Math.round(
      oneOffTotal * (1 - bundleDiscountPercent / 100),
    );
    const finalAnnualMaintenance = Math.round(
      annualMaintenanceTotal * (1 - bundleDiscountPercent / 100),
    );

    return {
      oneOffTotal: finalOneOff,
      monthlyRecurring: finalMonthlyRecurring,
      annualMaintenance: finalAnnualMaintenance,
      perSeatSubtotal: perSeatMonthlySubtotal,
      flatMonthlySubtotal: flatMonthlyTotal,
      rawSumOfProducts: oneOffTotal + flatMonthlyTotal + perSeatMonthlySubtotal,
      activeList,
    };
  }, [selectedProducts, seats, seatDiscountPercent, bundleDiscountPercent]);

  const totalImmediateDue =
    pricingSubtotals.oneOffTotal + pricingSubtotals.monthlyRecurring;

  return (
    <div className="relative min-h-screen bg-background pt-32 pb-24 pricing-page-root">
      {/* Background radial glows wrapped in overflow-hidden container to prevent breaking position: sticky */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-lime/10 rounded-full blur-[140px] opacity-60" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-lime/5 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6"
          >
            Real Products. <br />
            <span className="relative inline-block mt-2">
              Transparent Pricing.
              <span className="absolute left-0 right-0 bottom-1 h-3 bg-lime/20 -z-10 rounded-xs" />
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground"
          >
            Select the specific Concolabs tools you need. Drag the seat slider
            to adjust subscription tools, and unlock compound discounts on
            bundles.
          </motion.p>
        </div>

        {/* Global Selectors */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-6 mb-16 bg-card/25 border border-border/80 rounded-3xl p-6 max-w-4xl mx-auto"
        >
          <div className="flex flex-wrap justify-between items-center gap-6 w-full">
            {/* Billing Interval switch */}
            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-medium transition-colors ${billingCycle === "monthly" ? "text-foreground font-semibold" : "text-muted-foreground"}`}
              >
                Monthly billing
              </span>
              <button
                onClick={() =>
                  setBillingCycle((prev) =>
                    prev === "annual" ? "monthly" : "annual",
                  )
                }
                className="relative w-12 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full transition-colors focus:outline-none border border-border"
                aria-label="Toggle annual billing"
              >
                <motion.div
                  className="w-4.5 h-4.5 bg-foreground rounded-full absolute top-[3px] left-[3px]"
                  animate={{ x: billingCycle === "annual" ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <span
                className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${billingCycle === "annual" ? "text-foreground font-semibold" : "text-muted-foreground"}`}
              >
                Annual billing
                <span className="text-[10px] font-bold text-black bg-lime px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Save 20%
                </span>
              </span>
            </div>

            {/* Seat Capacity slider */}
            <div className="flex items-center gap-4 bg-zinc-100/50 dark:bg-zinc-900/30 border border-border px-5 py-2.5 rounded-2xl flex-1 max-w-sm w-full">
              <div className="flex flex-col gap-0.5 flex-1">
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>Workspace Seats (User-based products):</span>
                  <span className="text-foreground font-bold">
                    {seats} users
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="150"
                  value={seats}
                  onChange={(e) => setSeats(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-lime"
                />
              </div>

              {seatDiscountPercent > 0 && (
                <div className="bg-lime/10 border border-lime/30 text-foreground font-bold text-[10px] py-1 px-2 rounded-lg flex items-center gap-0.5 shrink-0 animate-pulse">
                  <Users className="w-3.5 h-3.5" />-{seatDiscountPercent}%
                </div>
              )}
            </div>
          </div>

          {/* Product Categories Switcher */}
          <div className="flex flex-wrap gap-2 justify-center border-t border-border/40 pt-4 w-full">
            {(
              ["all", "design", "estimation", "operations", "legal"] as const
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? "bg-foreground text-background shadow-xs"
                    : "bg-zinc-100/50 dark:bg-zinc-900/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "all"
                  ? "All Tools"
                  : tab === "design"
                    ? "Design AI"
                    : tab === "estimation"
                      ? "Estimation & BOQ"
                      : tab === "operations"
                        ? "Site Ops"
                        : "Legal"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Builder View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          {/* Products Grid (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((prod) => {
                  const isSelected = selectedProducts.includes(prod.id);
                  const isCustom = prod.priceType === "custom";

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      key={prod.id}
                      onClick={() => !isCustom && handleToggleProduct(prod.id)}
                      className={`border rounded-3xl p-6 flex flex-col justify-between transition-all select-none bg-card/45 backdrop-blur-xs relative overflow-hidden ${
                        isCustom
                          ? "border-border/40 opacity-90 cursor-default bg-zinc-50/20 dark:bg-zinc-900/5"
                          : isSelected
                            ? "border-foreground shadow-md ring-1 ring-foreground cursor-pointer"
                            : "border-border/60 hover:border-border cursor-pointer"
                      }`}
                    >
                      {/* Highlight blur */}
                      {isSelected && !isCustom && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-lime/10 rounded-full blur-xl pointer-events-none" />
                      )}

                      <div>
                        {/* Header card details */}
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[9px] font-bold text-muted-foreground bg-zinc-100 dark:bg-zinc-900 border border-border px-2 py-0.5 rounded-md uppercase">
                            {prod.status}
                          </span>

                          {/* Checkmark selection box */}
                          {!isCustom && (
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                                isSelected
                                  ? "bg-foreground border-foreground text-background"
                                  : "border-muted-foreground/30"
                              }`}
                            >
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              )}
                            </div>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-foreground mb-1 tracking-tight leading-snug">
                          {prod.name}
                        </h3>
                        <span className="text-[10px] text-muted-foreground font-semibold block mb-3.5">
                          {prod.pill}
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-6 min-h-[48px]">
                          {prod.description}
                        </p>

                        {/* Bullet list */}
                        <ul className="space-y-2 mb-6">
                          {prod.features.map((feat, fIdx) => (
                            <li
                              key={fIdx}
                              className="flex items-start gap-2 text-xs text-foreground/90 font-medium leading-normal"
                            >
                              <Check className="w-3.5 h-3.5 text-lime shrink-0 stroke-[3] mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pricing Tag footer */}
                      <div className="border-t border-border/40 pt-4 flex justify-between items-center mt-auto">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                          License Model
                        </span>
                        <div className="text-right">
                          {prod.priceType === "one-off" ? (
                            <div className="flex flex-col items-end">
                              <span className="font-extrabold text-foreground text-base">
                                ${prod.basePrice.toLocaleString()} one-off
                              </span>
                              {prod.maintenancePrice && (
                                <span className="text-[9px] text-muted-foreground">
                                  +${prod.maintenancePrice}/yr maintenance
                                </span>
                              )}
                            </div>
                          ) : prod.priceType === "flat-monthly" ? (
                            <span className="font-extrabold text-foreground text-base">
                              ${prod.basePrice}/mo flat
                            </span>
                          ) : prod.priceType === "per-seat" ? (
                            <div className="flex flex-col items-end">
                              <span className="font-extrabold text-foreground text-base">
                                ${prod.basePrice}/user/mo
                              </span>
                              {prod.basePrice === 8 && (
                                <span className="text-[9px] text-muted-foreground">
                                  Billed annually ($100/yr)
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="font-bold text-muted-foreground text-xs uppercase tracking-wide">
                              Custom / R&D
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Links */}
                      <div className="flex gap-2.5 mt-4 pt-3 border-t border-border/30">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex-1 py-3 text-[10px] h-auto font-bold rounded-lg cursor-pointer pricing-btn-outline"
                        >
                          {prod.id === "planning-law-chatbot" ? (
                            <a href="http://localhost:3000/learnmore/planning-law-chatbot">
                              Watch Demo
                            </a>
                          ) : (
                            <a
                              href={prod.demoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Watch Demo
                            </a>
                          )}
                        </Button>

                        {prod.externalLink ? (
                          <Button
                            size="sm"
                            asChild
                            className="flex-1 py-3 text-[10px] h-auto font-bold rounded-lg cursor-pointer bg-foreground text-background pricing-btn-primary"
                          >
                            <a
                              href={prod.externalLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Visit Website
                            </a>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            asChild
                            className="flex-1 py-3 text-[10px] h-auto font-bold rounded-lg cursor-pointer bg-foreground text-background pricing-btn-primary"
                          >
                            <a
                              href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Book a Demo &rarr;
                            </a>
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Custom calculation summary side panel (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-foreground p-6 rounded-3xl shadow-lg sticky top-28">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Pricing Breakdown
              </h3>

              {pricingSubtotals.activeList.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {/* Selections details */}
                  <div className="border-b border-border/60 pb-3 max-h-[160px] overflow-y-auto pr-1">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Selected Tools ({pricingSubtotals.activeList.length})
                    </h4>
                    <ul className="space-y-1.5">
                      {pricingSubtotals.activeList.map((p) => (
                        <li
                          key={p.id}
                          className="flex justify-between items-center text-xs font-semibold text-foreground/90 leading-tight"
                        >
                          <span className="truncate max-w-[155px] flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-lime stroke-[3]" />
                            {p.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {p.priceType === "one-off"
                              ? `$${p.basePrice.toLocaleString()}`
                              : p.priceType === "flat-monthly"
                                ? `$${p.basePrice}/mo`
                                : `$${p.basePrice}/user`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing Breakdown Rows */}
                  <div className="space-y-2 text-xs">
                    {/* Seats indicator */}
                    {selectedProducts.some(
                      (id) =>
                        PRODUCTS.find((p) => p.id === id)?.priceType ===
                        "per-seat",
                    ) && (
                      <div className="flex justify-between text-muted-foreground font-semibold">
                        <span>User seat count</span>
                        <span className="text-foreground">{seats} seats</span>
                      </div>
                    )}

                    {/* Seat discount details */}
                    {seatDiscountPercent > 0 &&
                      selectedProducts.some(
                        (id) =>
                          PRODUCTS.find((p) => p.id === id)?.priceType ===
                          "per-seat",
                      ) && (
                        <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                          <span>
                            Workspace Seat Discount (-{seatDiscountPercent}%)
                          </span>
                          <span>-{seatDiscountPercent}%</span>
                        </div>
                      )}

                    {/* Bundle discount details */}
                    {bundleDiscountPercent > 0 && (
                      <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                        <span>
                          Stacked Bundle Discount (-{bundleDiscountPercent}%)
                        </span>
                        <span>-{bundleDiscountPercent}%</span>
                      </div>
                    )}

                    {/* Cost subdivisions */}
                    <div className="space-y-1.5 border-t border-border/40 pt-3.5">
                      {pricingSubtotals.oneOffTotal > 0 && (
                        <div className="flex justify-between text-muted-foreground font-semibold">
                          <span>One-Time Licenses Total</span>
                          <span className="text-foreground">
                            ${pricingSubtotals.oneOffTotal.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {pricingSubtotals.oneOffTotal > 0 &&
                        pricingSubtotals.annualMaintenance > 0 && (
                          <div className="flex justify-between text-muted-foreground text-[10px]">
                            <span>Annual Maintenance Fee</span>
                            <span>
                              +$
                              {pricingSubtotals.annualMaintenance.toLocaleString()}
                              /yr
                            </span>
                          </div>
                        )}

                      {pricingSubtotals.monthlyRecurring > 0 && (
                        <div className="flex justify-between text-muted-foreground font-semibold">
                          <span>Ongoing Monthly Recurring</span>
                          <span className="text-foreground">
                            $
                            {pricingSubtotals.monthlyRecurring.toLocaleString()}
                            /mo
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Immediate Due Indicator */}
                  <div className="bg-secondary/40 dark:bg-muted/10 border border-border/80 rounded-2xl p-5">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block mb-1">
                      Immediate Total Due
                    </span>
                    <div className="text-3xl font-extrabold text-foreground tracking-tight flex items-baseline gap-1">
                      ${totalImmediateDue.toLocaleString()}
                    </div>
                    <span className="text-[9px] text-muted-foreground block mt-1.5 leading-normal">
                      Includes one-off enterprise licenses plus your first month
                      of workspace subscription services.
                    </span>
                  </div>

                  {/* Bundle Savings Tips */}
                  {selectedProducts.length < 4 && (
                    <div className="bg-lime/5 border border-lime/30 rounded-2xl p-3.5 text-[11px] text-muted-foreground flex gap-2">
                      <Percent className="w-4 h-4 text-foreground fill-lime shrink-0 mt-0.5" />
                      <div>
                        {selectedProducts.length === 1 && (
                          <span>
                            Add **1 more product** to unlock a **10% bundle
                            discount**!
                          </span>
                        )}
                        {selectedProducts.length === 2 && (
                          <span>
                            Add **1 more product** to step up to a **15% bundle
                            discount**!
                          </span>
                        )}
                        {selectedProducts.length === 3 && (
                          <span>
                            Add **1 more product** to activate a **25% bundle
                            discount** on all tools!
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Checkout Actions */}
                  <Button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-6 font-bold text-sm rounded-xl cursor-pointer pricing-btn-primary"
                  >
                    Subscribe & Configure Bundle
                  </Button>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Please select at least one product module to begin
                    configuring your workspace.
                  </p>
                  <Button
                    onClick={() =>
                      setSelectedProducts(
                        PRODUCTS.filter((p) => p.priceType !== "custom").map(
                          (p) => p.id,
                        ),
                      )
                    }
                    variant="outline"
                    className="w-full py-4 text-xs font-bold rounded-xl animate-pulse pricing-btn-outline"
                  >
                    Select Default Bundle
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FAQs */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-muted-foreground">
              Learn how product licensing, subcontractor seat credits, and
              billing renewals work.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <details
                key={idx}
                className="group border border-border/80 rounded-2xl bg-card/40 p-6 [&_summary::-webkit-details-marker]:hidden transition-all duration-300 open:border-foreground"
              >
                <summary className="flex items-center justify-between cursor-pointer focus:outline-none select-none">
                  <h3 className="font-bold text-foreground text-sm sm:text-base pr-4">
                    {faq.q}
                  </h3>
                  <span className="transition-transform group-open:rotate-180 text-muted-foreground">
                    <ChevronDown className="w-5 h-5" />
                  </span>
                </summary>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Trust Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-xs relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-lime/10 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-4">
            Custom corporate solutions?
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-8">
            Looking for enterprise-wide controls, dedicated sandbox workspaces,
            custom SSO integrations, or unlimited seat licensing packages?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              className="py-6 px-8 rounded-xl font-bold text-sm cursor-pointer bg-foreground text-background pricing-btn-primary"
            >
              <a href="mailto:sales@concolabs.com?subject=Enterprise%20Corporate%20Request">
                Talk to Enterprise Sales
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="py-6 px-8 rounded-xl font-bold text-sm cursor-pointer pricing-btn-outline"
            >
              <a
                href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a Workflows Consultation
              </a>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Checkout Simulator Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        products={pricingSubtotals.activeList.map((p) => ({
          name: p.name,
          priceType: p.priceType,
          price: p.basePrice,
          maintenancePrice: p.maintenancePrice,
        }))}
        seats={seats}
        isAnnual={billingCycle === "annual"}
        seatDiscountPercent={seatDiscountPercent}
        bundleDiscountPercent={bundleDiscountPercent}
      />
    </div>
  );
}
