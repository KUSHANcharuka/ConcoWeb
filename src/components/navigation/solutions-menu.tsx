"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Paintbrush,
  Building2,
  HardHat,
  Calculator,
  Box,
  FileText,
  ArrowRight,
  PencilRuler,
  Layers,
  BrainCircuit,
  BarChart3,
  Store,
  Hammer,
  ShieldCheck,
  MessageSquare,
  FileSearch,
  Wrench,
  Scale,
  Ruler,
  ClipboardList,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { allProducts } from "~/lib/products-data"

const productIconMap: Record<string, React.ElementType> = {
  FileText, PencilRuler, Box, MessageSquare, Calculator, Layers,
  BarChart3, FileSearch, Wrench, Scale, Store, Hammer, Ruler,
  BrainCircuit, ClipboardList, ShieldCheck
}

const personas = [
  {
    icon: Paintbrush,
    title: "Architects",
    description: "Design freely. Redraw automatically.",
    href: "/solutions/architects",
  },
  {
    icon: Building2,
    title: "Real Estate Developers",
    description: "Feasibility and cost benchmarking.",
    href: "/solutions/real-estate-developers",
  },
  {
    icon: HardHat,
    title: "Contractors & Builders",
    description: "Less paperwork, more site control.",
    href: "/solutions/contractors",
  },
  {
    icon: Calculator,
    title: "Consultancies & QS",
    description: "Automate BOQs and measurements.",
    href: "/solutions/construction-consultancies",
  },
  {
    icon: Box,
    title: "3D Modellers",
    description: "Stop tracing. Start modeling geometry.",
    href: "/solutions/modellers",
  },
  {
    icon: FileText,
    title: "Legal & Contract Professionals",
    description: "FIDIC-trained contract intelligence.",
    href: "/solutions/legal-professionals",
  },
]

// viewBox: 400 × 370 (Winding road geometry)
// Tier Y centres: top=55 (14.86%), mid=175 (47.30%), bot=295 (79.73%)
// Col X centres: left=110 (27.5%), right=290 (72.5%)
const roadmapSteps = [
  { number: "01", title: "Feasibility",          subtitle: "Viability & site checks",     icon: BarChart3,    x: 27.5, y: 14.86, id: "Feasibility" },
  { number: "02", title: "Architecture & Modelling", subtitle: "Concept & engineering",       icon: PencilRuler,  x: 72.5, y: 14.86, id: "Architecture & Modelling" },
  { number: "03", title: "BOQ Preparation",     subtitle: "Quantities & compliance",           icon: Layers,       x: 72.5, y: 47.30, id: "BOQ Preparation" },
  { number: "04", title: "Tendering",          subtitle: "Sourcing & bidding",          icon: Store,        x: 27.5, y: 47.30, id: "Tendering" },
  { number: "05", title: "Construction Stage",         subtitle: "Site management",             icon: Hammer,       x: 27.5, y: 79.73, id: "Construction Stage" },
  { number: "06", title: "Claims & Legal Disputes", subtitle: "Asset delivery",              icon: ShieldCheck,     x: 72.5, y: 79.73, id: "Claims & Legal Disputes" },
]


const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.25,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.45, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 220,
      damping: 18,
    },
  },
}

export function SolutionsMenu() {
  const [targetHref, setTargetHref] = useState("/solutions")
  const [animationKey, setAnimationKey] = useState(0)
  const [hoveredStep, setHoveredStep] = useState<string | null>(null)
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    setAnimationKey((k) => k + 1)
    setHoveredStep(null)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const personaIds = [
        "architects",
        "real-estate-developers",
        "contractors",
        "construction-consultancies",
        "modellers",
        "legal-professionals",
      ]

      if (pathname && pathname.startsWith("/solutions/")) {
        const parts = pathname.split("/")
        const slug = parts[2]
        if (slug && personaIds.includes(slug)) {
          localStorage.setItem("active_persona", slug)
          setTargetHref(`/solutions/${slug}`)
          return
        }
      }

      const stored = localStorage.getItem("active_persona")
      if (stored) {
        setTargetHref(`/solutions/${stored}`)
      } else {
        setTargetHref("/solutions/architects")
      }
    }
  }, [pathname])

  return (
    <div className="grid lg:grid-cols-3 gap-8">

      {/* LEFT — Construction Lifecycle */}
      <div className="hidden lg:flex flex-col h-full min-h-[380px]">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
          Construction Lifecycle
        </h3>

        {/* Card */}
        <div className="relative rounded-xl border border-border/80 bg-zinc-50/50 dark:bg-zinc-950/20 overflow-hidden flex-1">

          {/* Subtle dot-grid background */}
          <div
            className="absolute inset-0 opacity-25 dark:opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, #a1a1aa 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          <motion.div
            key={animationKey}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="relative w-full h-full"
            style={{ minHeight: 350 }}
          >
            {/* ── SVG Winding Connecting Line ── */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 400 370"
              preserveAspectRatio="none"
              fill="none"
            >
              {/* Subtle ghost track */}
              <path
                d="M 40,55 H 320 A 60 60 0 0 1 320,175 H 80 A 60 60 0 0 0 80,295 H 360"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-200 dark:text-zinc-800"
              />

              {/* Sleek animated connecting line */}
              <motion.path
                key={animationKey}
                d="M 40,55 H 320 A 60 60 0 0 1 320,175 H 80 A 60 60 0 0 0 80,295 H 360"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray="6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-400 dark:text-zinc-500"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.8, ease: "easeInOut", delay: 0.1 }}
              />
            </svg>

            {/* ── Nodes ── */}
            {roadmapSteps.map((step) => {
              const Icon = step.icon
              const isHovered = hoveredStep === step.number

              return (
                <button
                  type="button"
                  key={step.number}
                  onMouseEnter={() => setHoveredStep(step.number)}
                  onMouseLeave={() => setHoveredStep(null)}
                  onClick={() => setSelectedStage(step.id === selectedStage ? null : step.id)}
                  className="absolute flex flex-col items-center text-center select-none w-[110px]"
                  style={{
                    left: `${step.x}%`,
                    top: `${step.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <motion.div variants={itemVariants} className="flex flex-col items-center w-full">

                    {/* Node Circle Badge */}
                    <div className="relative">
                      {/* Pulsing expand ring */}
                      <AnimatePresence>
                        {(isHovered || selectedStage === step.id) && (
                          <motion.div
                            key="ring"
                            initial={{ scale: 1, opacity: 0.45 }}
                            animate={{ scale: 2.1, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.65, ease: "easeOut" }}
                            className="absolute inset-0 rounded-full bg-zinc-400/30 dark:bg-zinc-500/20 z-0"
                          />
                        )}
                      </AnimatePresence>

                      <motion.div
                        animate={(isHovered || selectedStage === step.id) ? { scale: 1.15 } : { scale: 1 }}
                        transition={{ type: "spring", stiffness: 320, damping: 22 }}
                        className={`w-11 h-11 rounded-full border-2 shadow-md flex items-center justify-center shrink-0 relative z-10 transition-[border-color,box-shadow,background-color] duration-200 ${
                          selectedStage === step.id 
                            ? "bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100" 
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                        }`}
                        style={(isHovered || selectedStage === step.id) ? {
                          borderColor: selectedStage === step.id ? "inherit" : "rgb(39 39 42)",
                          boxShadow: "0 0 0 3px rgba(113,113,122,0.2), 0 6px 16px rgba(0,0,0,0.15)",
                        } : {}}
                      >
                        {/* Number Badge */}
                        <motion.span
                          animate={(isHovered || selectedStage === step.id) ? { scale: 1.15 } : { scale: 1 }}
                          className={`absolute -top-1 -right-1 text-[8px] font-bold font-mono px-1.5 py-0.5 rounded-full shadow-sm leading-none ${
                            selectedStage === step.id 
                              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100" 
                              : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950"
                          }`}
                        >
                          {step.number}
                        </motion.span>

                        <Icon
                          className="w-5 h-5 transition-colors duration-200"
                          style={selectedStage === step.id 
                            ? { color: "var(--background)" }
                            : isHovered ? { color: "rgb(24 24 27)" } : { color: "rgb(82 82 91)" }}
                        />
                      </motion.div>
                    </div>

                    {/* Label & Subtitle */}
                    <div className="mt-1.5 w-full">
                      <span
                        className="text-[9.5px] font-bold leading-tight block px-0.5 transition-colors duration-200"
                        style={(isHovered || selectedStage === step.id)
                          ? { color: "var(--foreground)", opacity: 1 }
                          : { color: "var(--foreground)", opacity: 0.85 }}
                      >
                        {step.title}
                      </span>
                      <span className="text-[8px] text-zinc-500 dark:text-zinc-400 block leading-tight mt-0.5 font-normal">
                        {step.subtitle}
                      </span>
                    </div>

                  </motion.div>
                </button>
              )
            })}
          </motion.div>
        </div>
      </div>


      {/* RIGHT — Personas Grid */}
      <div className="lg:col-span-2 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            {selectedStage ? `Products for ${selectedStage}` : "Solutions by Role"}
          </h3>
          {selectedStage ? (
            <div className="grid sm:grid-cols-2 gap-2">
              {allProducts.filter(p => p.lifecycleStage === selectedStage).map((product) => {
                const PIcon = productIconMap[product.icon] || FileText;
                return (
                  <Link
                    key={product.id}
                    href={`/learnmore/${product.id}`}
                    className="group flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <PIcon className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground group-hover:text-foreground transition-colors">
                        {product.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {product.tagline}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-2">
              {personas.map((persona) => (
                <Link
                  key={persona.title}
                  href={persona.href}
                  className="group flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <persona.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground group-hover:text-foreground transition-colors">
                      {persona.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {persona.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* View All Solutions CTA */}
        <div className="mt-4 pt-4 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            Explore our complete platform, industry case studies, and customer stories.
          </p>
          <Link
            href="/learnmore#products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:underline shrink-0"
          >
            <span>View all solutions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

    </div>
  )
}
