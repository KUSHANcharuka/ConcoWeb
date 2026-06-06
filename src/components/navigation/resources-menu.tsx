"use client"

import Link from "next/link"
import { BookOpen, HelpCircle, Newspaper } from "lucide-react"

const resources = [
  {
    icon: BookOpen,
    title: "Learn More",
    description: "Guides and resources",
    href: "/learnmore",
  },
  {
    icon: Newspaper,
    title: "Blog",
    description: "Industry insights and updates",
    href: "/resources/blog",
  },
  {
    icon: HelpCircle,
    title: "Help Center",
    description: "FAQs and support articles",
    href: "/resources/help",
  },
]

export function ResourcesMenu() {
  return (
    <div className="max-w-4xl">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Resources
      </h3>
      <div className="grid sm:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <Link
            key={resource.title}
            href={resource.href}
            className="group flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <resource.icon className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground group-hover:text-foreground transition-colors">
                {resource.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {resource.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
