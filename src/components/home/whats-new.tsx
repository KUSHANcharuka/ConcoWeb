"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const news = [
  {
    category: "Feature",
    title: "AI Schedule Optimization",
    description: "Our new AI engine predicts and prevents project delays with 95% accuracy.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    date: "May 2026",
    cta: "Learn more",
    link: "/resources/blog",
  },
  {
    category: "Product",
    title: "Mobile App 3.0",
    description: "Completely redesigned mobile experience for field teams with offline support.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
    date: "April 2026",
    cta: "Explore App 3.0",
    link: "/resources/blog",
  },
  {
    category: "Integration",
    title: "BIM Sync Released",
    description: "Seamless two-way sync with Revit, AutoCAD, and other BIM tools.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
    date: "April 2026",
    cta: "Read story",
    link: "/resources/blog",
  },
  {
    category: "Finance",
    title: "Cost Control Engine",
    description: "Real-time budget tracking and automated expense auditing for site managers.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
    date: "March 2026",
    cta: "Learn more",
    link: "/resources/blog",
  },
  {
    category: "Collaboration",
    title: "Field Collaboration 2.0",
    description: "Instantly assign tasks, upload photos, and sync daily logs from the jobsite.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
    date: "March 2026",
    cta: "Explore Collaboration",
    link: "/resources/blog",
  },
  {
    category: "Security",
    title: "Enterprise Security",
    description: "Bank-grade encryption, custom roles, and SSO integration for large operations.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
    date: "February 2026",
    cta: "Read security whitepaper",
    link: "/resources/blog",
  },
]

export function WhatsNew() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [width, setWidth] = useState(1200)

  useEffect(() => {
    if (typeof window === "undefined") return
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const cardsToShow = width >= 1024 ? 3 : width >= 640 ? 2 : 1
  const maxIndex = Math.max(0, news.length - cardsToShow)
  const displayIndex = Math.min(currentIndex, maxIndex)

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  const progressPercent = maxIndex > 0 ? (displayIndex / maxIndex) * 100 : 100

  return (
    <section ref={containerRef} className="py-24 px-6 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12"
        >
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
              What&apos;s new at Concolabs
            </h2>
            <p className="text-lg text-muted-foreground">
              The latest features and product updates
            </p>
          </div>
          <div>
            <Link
              href="/resources/blog"
              className="inline-flex items-center gap-1.5 text-foreground hover:opacity-85 font-semibold transition-opacity group underline underline-offset-4 decoration-muted-foreground/30 hover:decoration-foreground"
            >
              View blog
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Carousel Window */}
        <div className="relative w-full overflow-hidden mb-6">
          <motion.div
            animate={{ x: `-${displayIndex * (100 / cardsToShow)}%` }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="flex -mx-3 w-full"
          >
            {news.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="w-full sm:w-1/2 lg:w-1/3 px-3 shrink-0 flex flex-col group"
              >
                <Link href={item.link} className="flex flex-col h-full w-full rounded-3xl bg-[#f6f5f2] dark:bg-muted/10 border border-border/30 overflow-hidden shadow-xs hover:shadow-sm transition-all duration-300">
                  {/* Image Container */}
                  <div className="relative h-56 w-full overflow-hidden bg-muted/20">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-xs text-xs font-semibold text-foreground border border-border/20 shadow-2xs">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-8 flex flex-col justify-between flex-grow">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-3">{item.date}</p>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 leading-snug tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-8">
                        {item.description}
                      </p>
                    </div>
                    <div>
                      <span className="inline-block text-sm font-bold text-foreground border-b-2 border-foreground/80 pb-0.5 group-hover:border-foreground transition-colors">
                        {item.cta}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Navigation & Progress Controls */}
        <div className="flex items-center justify-between">
          {/* Progress bar line */}
          <div className="w-32 sm:w-48 h-1 bg-secondary rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-foreground"
            />
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={displayIndex === 0}
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none shadow-sm cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <button
              onClick={handleNext}
              disabled={displayIndex === maxIndex}
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none shadow-sm cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
