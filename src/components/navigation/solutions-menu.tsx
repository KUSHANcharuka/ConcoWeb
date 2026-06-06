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
  ArrowRight 
} from "lucide-react"

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
      <div className="lg:col-span-2">
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

      {/* View All CTA */}
      <div className="flex flex-col justify-between">
        <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20 h-full flex flex-col justify-center">
          <h4 className="text-sm font-medium text-foreground mb-1">
            See all solutions
          </h4>
          <p className="text-xs text-muted-foreground mb-4">
            Explore our complete platform, industry case studies, and customer stories.
          </p>
          <Link
            href="/solutions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:underline"
          >
            <span>View all solutions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
