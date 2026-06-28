"use client"

import Link from "next/link"
import { ArrowRight, TrendingUp, Headphones, BarChart3, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

const benefits = [
  {
    icon: TrendingUp,
    title: "Recurring Revenue",
    description: "Earn a percentage of every contract, recurring on renewals",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Named partner manager, co-selling, and technical pre-sales",
  },
  {
    icon: BarChart3,
    title: "Sales Enablement",
    description: "Demo environments, pitch decks, case studies, and training",
  },
  {
    icon: ShieldCheck,
    title: "Deal Protection",
    description: "Register opportunities and protect the accounts you source",
  },
]

export function PartnersMenu() {
  return (
    <div>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Become a Partner CTA */}
        <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Become a Partner
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Join our partner ecosystem and grow your business while helping construction companies succeed.
          </p>
          <Button asChild>
            <Link href="/partner">
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Partner Benefits */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Partner Benefits
          </h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="flex items-start gap-2.5 p-3 rounded-lg border border-border/60 bg-card/50"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <benefit.icon className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    {benefit.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

