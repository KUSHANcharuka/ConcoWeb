"use client"

import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/footer"
import { useInView, motion, AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  FileText,
  PencilRuler,
  Box,
  MessageSquare,
  Calculator,
  Cog,
  Hammer,
  Ruler,
  BarChart3,
  Store,
  Scale,
  FileSearch,
  Layers,
  Wrench,
  BrainCircuit,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Globe,
  Users,
  Zap,
  Shield,
  Clock,
  TrendingUp,
} from "lucide-react"

/* ─── Typewriter Paragraph ─── */
interface TypewriterParagraphProps {
  text: string
  speed?: number
  delay?: number
}

function TypewriterParagraph({ text, speed = 8, delay = 0 }: TypewriterParagraphProps) {
  const [displayedText, setDisplayedText] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!isInView) return

    let timer: any
    const startTyping = () => {
      let index = 0
      timer = setInterval(() => {
        if (index < text.length) {
          setDisplayedText((prev) => prev + text.charAt(index))
          index++
        } else {
          clearInterval(timer)
        }
      }, speed)
    }

    const delayTimer = setTimeout(startTyping, delay)

    return () => {
      clearTimeout(delayTimer)
      clearInterval(timer)
    }
  }, [isInView, text, speed, delay])

  return (
    <div ref={ref} className="text-lg sm:text-xl md:text-2xl font-medium text-zinc-700 leading-relaxed min-h-[3em] relative text-pretty">
      <span>{displayedText}</span>
      {isInView && displayedText.length < text.length && (
        <span className="inline-block w-[3px] h-6 bg-zinc-800 ml-1 animate-pulse align-middle rounded-sm" />
      )}
    </div>
  )
}

/* ─── Product Data ─── */
const allProducts = [
  {
    id: "planning-law-chatbot",
    title: "Planning Law Chatbot",
    icon: FileText,
    tagline: "Instant planning regulations at your fingertips",
    description: "Enter a plot location and get allowable use, maximum height, floor area ratio, and sanitary requirements instantly. Outputs a formatted feasibility PDF ready for client meetings.",
    industries: ["Architecture Firms", "Real Estate Developers"],
    regions: ["Middle East", "Sri Lanka", "UK"],
    status: "Scaling",
    color: "from-emerald-500/10 to-teal-500/10",
    borderColor: "border-emerald-500/20",
    iconColor: "text-emerald-600",
  },
  {
    id: "hand-drawn-to-autocad",
    title: "Hand Drawn to AutoCAD",
    icon: PencilRuler,
    tagline: "Your sketches become clean CAD files",
    description: "Photograph your hand-drawn floor plan and receive a clean CAD file. The tool learns your specific drawing style and handwriting over time — accuracy improves with every project.",
    industries: ["Architects", "Modelling Firms"],
    regions: ["UK", "Australia"],
    status: "Scaling",
    color: "from-blue-500/10 to-indigo-500/10",
    borderColor: "border-blue-500/20",
    iconColor: "text-blue-600",
  },
  {
    id: "auto-conversion-2d-to-3d",
    title: "Auto Conversion 2D to 3D",
    icon: Box,
    tagline: "2D drawings to 3D BIM models automatically",
    description: "Computer vision reads your 2D PDF drawing and converts elements directly into a 3D BIM model — no modeller needed. The only complete AI-automated PDF-to-3D product available.",
    industries: ["Architecture Firms", "Structural Modellers"],
    regions: ["Australia"],
    status: "Custom / R&D",
    color: "from-violet-500/10 to-purple-500/10",
    borderColor: "border-violet-500/20",
    iconColor: "text-violet-600",
  },
  {
    id: "wordtobim",
    title: "WordtoBIM",
    icon: MessageSquare,
    tagline: "Describe a building, get a 3D model",
    description: "Describe a building element or layout in plain text and the 3D model is generated from your words. Pulls live planning and regulatory information into the modelling session automatically.",
    industries: ["Architecture Firms", "Modelling Firms"],
    regions: ["Universal"],
    status: "Custom / R&D",
    color: "from-fuchsia-500/10 to-pink-500/10",
    borderColor: "border-fuchsia-500/20",
    iconColor: "text-fuchsia-600",
  },
  {
    id: "cost-plan-calculator",
    title: "Cost Plan Calculator",
    icon: Calculator,
    tagline: "From concept drawing to cost estimate in minutes",
    description: "Reads the concept drawing, calculates Gross Floor Area, and produces an initial project cost estimate automatically. Includes a financial planning and task management module.",
    industries: ["Real Estate Developers", "QS Firms"],
    regions: ["Universal"],
    status: "Scaling",
    color: "from-amber-500/10 to-orange-500/10",
    borderColor: "border-amber-500/20",
    iconColor: "text-amber-600",
  },
  {
    id: "revit-to-boq",
    title: "Revit to BOQ Plugin",
    icon: Layers,
    tagline: "Automated BOQ generation from Revit models",
    description: "Identifies all building elements from Revit take-off files and generates a standard BOQ automatically. AI predicts rates for each line item — existing tools stop at measurement.",
    industries: ["QS Firms", "Cost Consultancies"],
    regions: ["Middle East", "Sri Lanka"],
    status: "Scaling",
    color: "from-cyan-500/10 to-sky-500/10",
    borderColor: "border-cyan-500/20",
    iconColor: "text-cyan-600",
  },
  {
    id: "acc-to-boq",
    title: "Autodesk CC to BOQ",
    icon: BarChart3,
    tagline: "Cloud-native BOQ from Autodesk Construction Cloud",
    description: "Same BOQ automation as the Revit plugin, built natively for Autodesk Construction Cloud — no export step. Automatically reprices when the design proposal changes.",
    industries: ["QS Firms", "Cloud-First Practices"],
    regions: ["UK", "Australia"],
    status: "Scaling",
    color: "from-sky-500/10 to-blue-500/10",
    borderColor: "border-sky-500/20",
    iconColor: "text-sky-600",
  },
  {
    id: "2d-drawing-to-boq",
    title: "2D Drawing to BOQ",
    icon: FileSearch,
    tagline: "BOQ from flat drawings — no 3D model needed",
    description: "Reads a 2D PDF structural drawing, identifies building elements using computer vision, and produces a priced BOQ. The only BOQ automation tool that operates from flat drawings alone.",
    industries: ["Contractors", "QS Firms"],
    regions: ["Middle East", "Sri Lanka", "Australia"],
    status: "Custom / R&D",
    color: "from-rose-500/10 to-red-500/10",
    borderColor: "border-rose-500/20",
    iconColor: "text-rose-600",
  },
  {
    id: "auto-reinforcement",
    title: "Auto Reinforcement Plugin",
    icon: Wrench,
    tagline: "Complete reinforcement schedules, zero manual steps",
    description: "Computer vision reads rebar notations, lengths, spans, and radii directly from structural drawings. AI agents generate the complete reinforcement schedule automatically.",
    industries: ["Contractors", "QS Consultancies"],
    regions: ["UAE", "Australia"],
    status: "Custom / R&D",
    color: "from-orange-500/10 to-amber-500/10",
    borderColor: "border-orange-500/20",
    iconColor: "text-orange-600",
  },
  {
    id: "tender-evaluations",
    title: "Tender Evaluations",
    icon: Scale,
    tagline: "Bid comparison reports from supplier emails",
    description: "Automatically downloads emails from suppliers and bidders and extracts pricing data for evaluation. Produces a side-by-side bid comparison report ready for the award decision.",
    industries: ["Contractors", "Builders"],
    regions: ["Middle East", "Sri Lanka"],
    status: "Scaling",
    color: "from-teal-500/10 to-emerald-500/10",
    borderColor: "border-teal-500/20",
    iconColor: "text-teal-600",
  },
  {
    id: "buildmonitor",
    title: "BuildMonitor Mobile App",
    icon: Hammer,
    tagline: "Daily progress reports that write themselves",
    description: "Site personnel record progress on mobile — photos, quantities, activities. Daily Progress Report generates automatically in your contract's required format. No additional input needed.",
    industries: ["Contractors", "Builders"],
    regions: ["Middle East", "Sri Lanka"],
    status: "Scaling",
    color: "from-lime-500/10 to-green-500/10",
    borderColor: "border-lime-500/20",
    iconColor: "text-lime-600",
  },
  {
    id: "measureonair",
    title: "MeasureonAir",
    icon: Ruler,
    tagline: "From site measurement to payment certificate digitally",
    description: "Record measurements directly against the digital drawing on site — no printed plans. Payment applications and interim certificates generate automatically from the recorded measurements.",
    industries: ["Contractors", "Construction Consultancies"],
    regions: ["Middle East", "Sri Lanka"],
    status: "Scaling",
    color: "from-indigo-500/10 to-violet-500/10",
    borderColor: "border-indigo-500/20",
    iconColor: "text-indigo-600",
  },
  {
    id: "erp-automations",
    title: "ERP Automations",
    icon: Cog,
    tagline: "Bridge the gap between site and back office",
    description: "Email instructions automatically converted into ERP job cards. Site app data syncs directly to the ERP, eliminating the lag between field activity and financial records.",
    industries: ["Real Estate Developers", "Contractors"],
    regions: ["Global"],
    status: "Scaling",
    color: "from-gray-500/10 to-slate-500/10",
    borderColor: "border-gray-500/20",
    iconColor: "text-gray-600",
  },
  {
    id: "builderbot",
    title: "BuilderBot.ai",
    icon: BrainCircuit,
    tagline: "FIDIC-trained AI that reads contracts, models, and records together",
    description: "FIDIC-trained legal AI that returns clause-referenced answers. Upload 3D models alongside contract documents — ask questions that span models, contracts, and project records simultaneously.",
    industries: ["Construction Legal", "Consulting Firms"],
    regions: ["UAE", "Global"],
    status: "Scaling",
    color: "from-purple-500/10 to-fuchsia-500/10",
    borderColor: "border-purple-500/20",
    iconColor: "text-purple-600",
  },
  {
    id: "buildmarketlk",
    title: "BuildMarketlk.com",
    icon: Store,
    tagline: "Construction marketplace for suppliers and subcontractors",
    description: "Searchable marketplace of material suppliers, builders, and subcontractors. Displays average construction prices so you can benchmark supplier quotes without calling around.",
    industries: ["Contractors", "Builders", "Suppliers"],
    regions: ["Sri Lanka", "Global Licensing"],
    status: "Scaling",
    color: "from-green-500/10 to-emerald-500/10",
    borderColor: "border-green-500/20",
    iconColor: "text-green-600",
  },
]

const benefits = [
  {
    icon: Clock,
    title: "85%+ Time Savings",
    description: "Automate repetitive estimating, measurement, and documentation tasks",
  },
  {
    icon: Globe,
    title: "Offline-First Mobile",
    description: "Seamless sync from remote construction sites to the office",
  },
  {
    icon: Zap,
    title: "AI-Powered Accuracy",
    description: "Computer vision and ML that learn from your specific workflows",
  },
  {
    icon: Shield,
    title: "Compliance Built-In",
    description: "Planning regulations and FIDIC clauses integrated natively",
  },
  {
    icon: TrendingUp,
    title: "Real-Time Visibility",
    description: "Live project budgets, progress, and financial records",
  },
  {
    icon: Users,
    title: "Built for Specialists",
    description: "Purpose-built for architects, QS firms, contractors, and developers",
  },
]

/* ─── Product Card ─── */
function ProductCard({ product, index }: { product: typeof allProducts[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const Icon = product.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`group relative bg-gradient-to-br ${product.color} backdrop-blur-sm border ${product.borderColor} rounded-2xl p-6 sm:p-8 hover:shadow-lg hover:shadow-black/5 transition-all duration-500 hover:-translate-y-1`}
    >
      {/* Status badge */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
          product.status === "Scaling"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700"
        }`}>
          {product.status}
        </span>
      </div>

      {/* Icon + Title */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-white/80 border border-white shadow-sm flex items-center justify-center ${product.iconColor} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="min-w-0 pr-16 sm:pr-20">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 leading-tight">{product.title}</h3>
          <p className="text-sm text-zinc-500 mt-0.5 font-medium">{product.tagline}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-zinc-600 text-sm sm:text-base leading-relaxed mb-5">
        {product.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {product.industries.map((ind) => (
          <span key={ind} className="text-xs font-medium bg-white/70 text-zinc-600 px-2.5 py-1 rounded-lg border border-white/80">
            {ind}
          </span>
        ))}
        {product.regions.map((reg) => (
          <span key={reg} className="text-xs font-medium bg-zinc-900/5 text-zinc-500 px-2.5 py-1 rounded-lg">
            {reg}
          </span>
        ))}
      </div>

      {/* Hover arrow */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowRight className="w-5 h-5 text-zinc-400" />
      </div>
    </motion.div>
  )
}

/* ─── Benefit Card ─── */
function BenefitCard({ benefit, index }: { benefit: typeof benefits[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })
  const Icon = benefit.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="flex items-start gap-4 p-5 rounded-xl bg-white/60 backdrop-blur-sm border border-zinc-200/60 hover:bg-white/80 transition-colors duration-300"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center">
        <Icon className="w-5 h-5 text-lime" />
      </div>
      <div>
        <h4 className="font-bold text-zinc-900 text-sm">{benefit.title}</h4>
        <p className="text-zinc-500 text-sm mt-0.5 leading-relaxed">{benefit.description}</p>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
export default function LearnMorePage() {
  const para1 = "Concolabs was founded to eliminate the administrative drag that compromises construction teams globally. We replace manual blueprint tracing, double-entry Excel logs, and coordination bottlenecks with unified AI engines — turning days of repetitive drafting into instant, compliant outputs."
  const para2 = "Our tools are built specifically for architects, developers, quantity surveyors, and contractors operating across residential, commercial, and civil infrastructure projects. They bridge the workflow from the first feasibility plot checks to final on-site payment claim approvals."
  const para3 = "By automating structural geometry conversions and legal contract auditing, our users achieve 85%+ reductions in estimating time, secure real-time visibility into project budgets, and unlock seamless offline mobile sync — allowing teams to focus on construction rather than documentation."

  return (
    <main className="min-h-screen bg-white text-foreground antialiased selection:bg-lime/30 selection:text-black">
      <Navbar />

      {/* ───────── HERO with Background Image ───────── */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* BG Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/learnmore-hero-bg.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          {/* White gradient overlay — heavier at top, lighter at bottom to reveal image */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/75 to-white/50" />
          {/* Soft radial for central readability */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_35%,rgba(255,255,255,0.92),transparent)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24 text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/5 border border-zinc-200/60 text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            15 Specialized Construction Tools
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-zinc-900 leading-[1.05] text-pretty"
          >
            Powerful tools built for{" "}
            <span className="text-zinc-400">modern construction</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-base sm:text-lg text-zinc-500 mt-5 max-w-2xl mx-auto leading-relaxed text-pretty"
          >
            AI engines and offline-first mobile tools designed to eliminate administrative drag, automate quantities, and synchronize site-to-office operations.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8"
          >
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white font-semibold rounded-full text-sm hover:bg-zinc-800 transition-colors duration-300 shadow-lg shadow-zinc-900/20"
            >
              Talk to Sales
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ───────── Typewriter Vision Section ───────── */}
      <section className="relative py-24 sm:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-10">
            <TypewriterParagraph text={para1} speed={6} delay={100} />
            <TypewriterParagraph text={para2} speed={6} delay={200} />
            <TypewriterParagraph text={para3} speed={6} delay={300} />
          </div>
        </div>
      </section>

      {/* ───────── Benefits Grid ───────── */}
      <section className="relative py-20 sm:py-28 bg-zinc-50/80">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
              Why teams switch to Concolabs
            </h2>
            <p className="text-zinc-500 mt-3 text-base sm:text-lg max-w-xl mx-auto">
              Purpose-built for the construction industry — not adapted from general-purpose tools.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((b, i) => (
              <BenefitCard key={b.title} benefit={b} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────── All Products ───────── */}
      <section className="relative py-24 sm:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/5 border border-zinc-200/60 text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-6">
              Product Suite
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight">
              Every tool, one platform
            </h2>
            <p className="text-zinc-500 mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              From feasibility checks to payment certificates — 15 specialized AI tools covering every stage of the construction lifecycle.
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {allProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Final CTA ───────── */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* BG Image reused */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/learnmore-hero-bg.png"
            alt=""
            fill
            className="object-cover object-bottom"
            quality={80}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/80 to-white/60" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight leading-tight">
            Ready to eliminate the admin?
          </h2>
          <p className="text-zinc-500 mt-4 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Book a 30-minute walkthrough to see exactly which tools apply to the way your team works.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-zinc-900 text-white font-semibold rounded-full text-sm hover:bg-zinc-800 transition-colors duration-300 shadow-lg shadow-zinc-900/20"
            >
              Book a Demo
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/80 backdrop-blur border border-zinc-200 text-zinc-700 font-semibold rounded-full text-sm hover:bg-white transition-colors duration-300"
            >
              View Pricing
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
