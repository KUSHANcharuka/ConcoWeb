"use client"

import Link from "next/link"
import { Building, Users2, TrendingUp, BookOpen } from "lucide-react"

const segments = [
  {
    icon: Building,
    title: "Enterprise",
    description: "For large construction firms",
    href: "/customers/enterprise",
  },
  {
    icon: Users2,
    title: "Mid-Market",
    description: "Growing construction companies",
    href: "/customers/mid-market",
  },
  {
    icon: TrendingUp,
    title: "Emerging Builders",
    description: "Startups and small teams",
    href: "/customers/emerging",
  },
]

const caseStudies = [
  {
    company: "Turner Construction",
    result: "40% faster project delivery",
    href: "/customers/case-studies/turner",
  },
  {
    company: "Berkeley Group",
    result: "60% reduction in paperwork",
    href: "/customers/case-studies/berkeley",
  },
  {
    company: "Lendlease Projects",
    result: "3x improvement in collaboration",
    href: "/customers/case-studies/lendlease",
  },
]

export function CustomersMenu() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* By Company Size */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          By Company Size
        </h3>
        <div className="space-y-2">
          {segments.map((segment) => (
            <Link
              key={segment.title}
              href={segment.href}
              className="group flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <segment.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {segment.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {segment.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Case Studies */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Featured Stories
        </h3>
        <div className="space-y-3">
          {caseStudies.map((study) => (
            <Link
              key={study.company}
              href={study.href}
              className="group block p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/30 transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {study.company}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {study.result}
              </p>
            </Link>
          ))}
        </div>

        <Link
          href="/customers"
          className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary hover:underline"
        >
          View all customers →
        </Link>
      </div>
    </div>
  )
}
