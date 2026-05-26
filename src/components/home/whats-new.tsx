"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Sparkles, Zap, Rocket } from "lucide-react"
import Link from "next/link"

const news = [
  {
    category: "Feature",
    title: "AI Schedule Optimization",
    description: "Our new AI engine predicts and prevents project delays with 95% accuracy.",
    image: "/placeholder-feature-1.jpg",
    date: "May 2026",
    icon: Sparkles,
    gradient: "from-primary/20 to-transparent",
  },
  {
    category: "Product",
    title: "Mobile App 3.0",
    description: "Completely redesigned mobile experience for field teams with offline support.",
    image: "/placeholder-feature-2.jpg",
    date: "April 2026",
    icon: Rocket,
    gradient: "from-blue-500/20 to-transparent",
  },
  {
    category: "Integration",
    title: "BIM Sync Released",
    description: "Seamless two-way sync with Revit, AutoCAD, and other BIM tools.",
    image: "/placeholder-feature-3.jpg",
    date: "April 2026",
    icon: Zap,
    gradient: "from-emerald-500/20 to-transparent",
  },
]

export function WhatsNew() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section ref={containerRef} className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              What&apos;s new at Concolabs
            </h2>
            <p className="text-lg text-muted-foreground">
              The latest features and updates
            </p>
          </div>
          <Link
            href="/changelog"
            className="inline-flex items-center gap-2 text-primary font-medium mt-4 sm:mt-0 hover:gap-3 transition-all"
          >
            View changelog
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link href="/changelog" className="block">
                <div className="relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300">
                  {/* Image/Gradient Area */}
                  <div className={`relative h-48 bg-gradient-to-br ${item.gradient} overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <item.icon className="w-16 h-16 text-primary/30" />
                    </div>
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium text-foreground">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-xs text-muted-foreground mb-2">{item.date}</p>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
