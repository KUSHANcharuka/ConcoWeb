"use client"

import Link from "next/link"
import { Plug, Users, Briefcase, ArrowRight } from "lucide-react"

const partnerTypes = [
  {
    icon: Plug,
    title: "Technology Partners",
    description: "Integrate your software with Concolabs",
    href: "/partners/technology",
  },
  {
    icon: Users,
    title: "Implementation Partners",
    description: "Help customers succeed with Concolabs",
    href: "/partners/implementation",
  },
  {
    icon: Briefcase,
    title: "Reseller Partners",
    description: "Grow your business with Concolabs",
    href: "/partners/reseller",
  },
]

export function PartnersMenu() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Partner Types */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Partner Programs
        </h3>
        <div className="space-y-2">
          {partnerTypes.map((partner) => (
            <Link
              key={partner.title}
              href={partner.href}
              className="group flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <partner.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {partner.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {partner.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Become a Partner CTA */}
      <div className="flex flex-col justify-center">
        <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Become a Partner
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Join our partner ecosystem and grow your business while helping construction companies succeed.
          </p>
          <Link
            href="/partners/apply"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Apply Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
