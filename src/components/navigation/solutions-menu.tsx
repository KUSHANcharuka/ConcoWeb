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
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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

// viewBox: 400 × 340
// Row Y centres: top=56, mid=170, bot=296
// Col X centres: left=88, mid=200, right=312
const roadmapSteps = [
  { number: "01", title: "Concept & Design",                      icon: PencilRuler,  x: 22, y: 16 },
  { number: "02", title: "Architectural Modeling (BIM)",          icon: Layers,       x: 50, y: 16 },
  { number: "03", title: "Engineering & Simulation",              icon: BrainCircuit, x: 78, y: 16 },
  { number: "04", title: "Quantity Surveying & Cost",             icon: BarChart3,    x: 78, y: 50 },
  { number: "05", title: "Procurement & Resources",               icon: Store,        x: 50, y: 50 },
  { number: "06", title: "Smart Construction Execution",          icon: Hammer,       x: 22, y: 50 },
  { number: "07", title: "AI Quality & Safety Checks",            icon: ShieldCheck,  x: 22, y: 84 },
  { number: "08", title: "Digital Handover & Maintenance",        icon: FileText,     x: 57, y: 84 },
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
      <div className="hidden lg:flex flex-col h-full min-h-[360px]">
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
            style={{ minHeight: 300 }}
          >
            {/* ── SVG path ── */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 400 340"
              preserveAspectRatio="none"
              fill="none"
            >
              {/* Ghost guide */}
              <path
                d="M 88,54 H 312 C 352,54 352,170 312,170 H 88 C 48,170 48,286 88,286 H 228"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5 5"
                className="text-muted-foreground/15 dark:text-muted/10"
              />

              {/* Animated draw */}
              <motion.path
                key={animationKey}
                d="M 88,54 H 312 C 352,54 352,170 312,170 H 88 C 48,170 48,286 88,286 H 228"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="5 5"
                strokeLinecap="round"
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
                <Link
                  href="/solutions"
                  key={step.number}
                  onMouseEnter={() => setHoveredStep(step.number)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className="absolute flex flex-col items-center text-center select-none w-[100px]"
                  style={{
                    left: `${step.x}%`,
                    top: `${step.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <motion.div variants={itemVariants} className="flex flex-col items-center w-full">

                    {/* Node */}
                    <div className="relative">
                      {/* Pulsing expand ring */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            key="ring"
                            initial={{ scale: 1, opacity: 0.45 }}
                            animate={{ scale: 2.1, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.65, ease: "easeOut" }}
                            className="absolute inset-0 rounded-xl bg-zinc-400/30 dark:bg-zinc-500/20 z-0"
                          />
                        )}
                      </AnimatePresence>

                      <motion.div
                        animate={isHovered ? { scale: 1.12 } : { scale: 1 }}
                        transition={{ type: "spring", stiffness: 320, damping: 22 }}
                        className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900
                                   border border-zinc-200 dark:border-zinc-800
                                   shadow-sm flex items-center justify-center shrink-0
                                   relative z-10 transition-[border-color,box-shadow] duration-200"
                        style={isHovered ? {
                          borderColor: "rgb(63 63 70)",
                          boxShadow: "0 0 0 3px rgba(113,113,122,0.15), 0 4px 14px rgba(0,0,0,0.12)",
                        } : {}}
                      >
                        {/* Badge */}
                        <motion.span
                          animate={isHovered ? { scale: 1.18 } : { scale: 1 }}
                          className="absolute -top-1.5 -right-1.5 text-[8px] font-bold font-mono
                                     px-1 py-0.5 rounded-full shadow-sm leading-none
                                     bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950"
                        >
                          {step.number}
                        </motion.span>

                        <Icon
                          className="w-[18px] h-[18px] transition-colors duration-200"
                          style={isHovered ? { color: "rgb(39 39 42)" } : { color: "rgb(113 113 122)" }}
                        />
                      </motion.div>
                    </div>

                    {/* Label */}
                    <div className="mt-1.5 w-full">
                      <span
                        className="text-[8.5px] font-semibold leading-tight block px-0.5 transition-colors duration-200"
                        style={isHovered
                          ? { color: "var(--foreground)", opacity: 1 }
                          : { color: "var(--foreground)", opacity: 0.68 }}
                      >
                        {step.title}
                      </span>
                    </div>

                  </motion.div>
                </Link>
              )
            })}
          </motion.div>
        </div>
      </div>

      {/* RIGHT — Personas Grid */}
      <div className="lg:col-span-2 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Solutions by Role
          </h3>
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
