"use client"

import Link from "next/link"
import { 
  LayoutDashboard, 
  Calculator, 
  FileText, 
  Users, 
  BarChart3,
  Building2,
  HardHat,
  Wrench,
  Clock
} from "lucide-react"

const products = [
  {
    icon: LayoutDashboard,
    title: "Project Management",
    description: "Track projects from bid to completion",
    href: "/solutions/project-management",
  },
  {
    icon: Calculator,
    title: "Budget & Cost Control",
    description: "Real-time budget tracking and forecasting",
    href: "/solutions/budget-control",
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Centralize blueprints, contracts, and reports",
    href: "/solutions/documents",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Connect field and office teams seamlessly",
    href: "/solutions/collaboration",
  },
  {
    icon: BarChart3,
    title: "Reporting & Analytics",
    description: "Data-driven insights for better decisions",
    href: "/solutions/analytics",
  },
]

const industries = [
  {
    icon: Building2,
    title: "Commercial Construction",
    href: "/solutions/commercial",
  },
  {
    icon: HardHat,
    title: "Residential Projects",
    href: "/solutions/residential",
  },
  {
    icon: Wrench,
    title: "Infrastructure",
    href: "/solutions/infrastructure",
  },
  {
    icon: Clock,
    title: "Renovation & Remodeling",
    href: "/solutions/renovation",
  },
]

export function SolutionsMenu() {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Products Column */}
      <div className="lg:col-span-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Products
        </h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {products.map((product) => (
            <Link
              key={product.title}
              href={product.href}
              className="group flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <product.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {product.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {product.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Industries Column */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          By Industry
        </h3>
        <div className="space-y-1">
          {industries.map((industry) => (
            <Link
              key={industry.title}
              href={industry.href}
              className="group flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <industry.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                {industry.title}
              </span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-6 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
          <h4 className="text-sm font-medium text-foreground mb-1">
            See all solutions
          </h4>
          <p className="text-xs text-muted-foreground mb-3">
            Explore our complete platform
          </p>
          <Link
            href="/solutions"
            className="text-xs font-medium text-primary hover:underline"
          >
            View all →
          </Link>
        </div>
      </div>
    </div>
  )
}
