"use client"

import Link from "next/link"
import { BookOpen, FileText, Video, HelpCircle, Newspaper, GraduationCap } from "lucide-react"

const resources = [
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Guides and API reference",
    href: "/resources/docs",
  },
  {
    icon: Newspaper,
    title: "Blog",
    description: "Industry insights and updates",
    href: "/resources/blog",
  },
  {
    icon: Video,
    title: "Webinars",
    description: "Live and on-demand sessions",
    href: "/resources/webinars",
  },
  {
    icon: HelpCircle,
    title: "Help Center",
    description: "FAQs and support articles",
    href: "/resources/help",
  },
]

const featured = [
  {
    icon: GraduationCap,
    title: "Concolabs Academy",
    description: "Free courses to master construction management",
    href: "/academy",
  },
  {
    icon: FileText,
    title: "Construction Guides",
    description: "Best practices for modern construction",
    href: "/resources/guides",
  },
]

export function ResourcesMenu() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Resources */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Resources
        </h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {resources.map((resource) => (
            <Link
              key={resource.title}
              href={resource.href}
              className="group flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <resource.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
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

      {/* Featured */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Featured
        </h3>
        <div className="space-y-3">
          {featured.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/30 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
