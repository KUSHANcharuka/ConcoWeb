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
  ShieldCheck
} from "lucide-react"
import { motion } from "framer-motion"

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

const roadmapSteps = [
  {
    number: "01",
    title: "Concept & Design",
    icon: PencilRuler,
    x: 16.67,
    y: 16.67,
  },
  {
    number: "02",
    title: "Architectural Modeling (BIM)",
    icon: Layers,
    x: 50.00,
    y: 16.67,
  },
  {
    number: "03",
    title: "Engineering & Simulation (AI‑Driven)",
    icon: BrainCircuit,
    x: 83.33,
    y: 16.67,
  },
  {
    number: "04",
    title: "Quantity Surveying & Cost Estimation",
    icon: BarChart3,
    x: 83.33,
    y: 50.00,
  },
  {
    number: "05",
    title: "Procurement & Resource Optimization",
    icon: Store,
    x: 50.00,
    y: 50.00,
  },
  {
    number: "06",
    title: "Smart Construction Execution",
    icon: Hammer,
    x: 16.67,
    y: 50.00,
  },
  {
    number: "07",
    title: "AI‑Powered Quality & Safety Checks",
    icon: ShieldCheck,
    x: 16.67,
    y: 83.33,
  },
  {
    number: "08",
    title: "Digital Handover & Maintenance Analytics",
    icon: FileText,
    x: 50.00,
    y: 83.33,
  },
]

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 15,
    },
  },
}

export function SolutionsMenu() {
  const [targetHref, setTargetHref] = useState("/solutions")
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const personaIds = [
        "architects",
        "real-estate-developers",
        "contractors",
        "construction-consultancies",
        "modellers",
        "legal-professionals"
      ]

      // If we are currently on a persona page, save it
      if (pathname && pathname.startsWith("/solutions/")) {
        const parts = pathname.split("/")
        const slug = parts[2]
        if (slug && personaIds.includes(slug)) {
          localStorage.setItem("active_persona", slug)
          setTargetHref(`/solutions/${slug}`)
          return
        }
      }

      // Otherwise, check if we have a stored persona
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
      {/* Personas Grid */}
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

        {/* View All Solutions CTA to fill empty space */}
        <div className="mt-4 pt-4 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            Explore our complete platform, industry case studies, and customer stories.
          </p>
          <Link
            href="/solutions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:underline shrink-0"
          >
            <span>View all solutions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Lifecycle Roadmap Serpentine Timeline */}
      <div className="hidden lg:flex flex-col h-full min-h-[360px]">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
          Construction Lifecycle
        </h3>
        <div className="relative rounded-xl border border-border/80 bg-zinc-50/50 dark:bg-zinc-950/20 p-4 overflow-hidden h-[320px] w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="w-full h-full relative"
          >
            {/* Winding SVG Connector Line */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none text-muted-foreground/25 dark:text-muted/15"
              viewBox="0 0 320 320"
              preserveAspectRatio="none"
              fill="none"
            >
              <motion.path
                d="M 53.3,53.3 L 266.7,53.3 C 315,53.3 315,160 266.7,160 L 53.3,160 C 5,160 5,266.7 53.3,266.7 L 160,266.7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="5 5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
            </svg>

            {roadmapSteps.map((step) => {
              const Icon = step.icon
              const isLongStep = step.number === "07" || step.number === "08"
              return (
                <Link
                  href="/solutions"
                  key={step.number}
                  className={`absolute group flex flex-col items-center text-center cursor-pointer select-none ${
                    isLongStep ? "w-[135px]" : "w-28"
                  }`}
                  style={{
                    left: `${step.x}%`,
                    top: `${step.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center w-full"
                  >
                    {/* Node Icon Container */}
                    <div className="w-11 h-11 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-center shrink-0 group-hover:border-zinc-900 dark:group-hover:border-zinc-100 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800 group-hover:scale-105 transition-all duration-300 relative">
                      {/* Step Number Badge */}
                      <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-sm transition-transform duration-300 group-hover:scale-110">
                        {step.number}
                      </span>
                      {/* Icon */}
                      <Icon className="w-5 h-5 text-muted-foreground group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors duration-300" />
                    </div>

                    {/* Step Title */}
                    <div className="mt-1.5 w-full flex flex-col items-center">
                      <span className="text-[10px] font-semibold text-foreground/80 group-hover:text-foreground transition-colors line-clamp-none leading-tight px-1">
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
    </div>
  )
}
