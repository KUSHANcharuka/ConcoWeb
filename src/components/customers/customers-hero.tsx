"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"


const companies = [
  {
    name: "Ark Draft Pty Ltd",
    logo: "https://images.squarespace-cdn.com/content/v1/65fa19a21657386c527d70e8/2f5be0b6-6c14-478f-bd47-7480ef0ced4c/Arkdraft+Logo+Text.png?format=1500w",
  },
  {
    name: "International Construction Consortium",
    logo: "https://icc-construct.com/wp-content/uploads/2023/01/cropped-ICC-LOGO-192x192.jpg",
  },
  {
    name: "Sanken overseas Pvt Ltd",
    logo: "https://www.sankenoverseas.com/wp-content/themes/sanken/assets/img/logo.svg",
  },
  {
    name: "Design Group Five Pvt Ltd",
    logo: "https://www.dgfivei.com/wp-content/uploads/2025/11/Main-LOGO-2048x1098-1sss.png",
  },
  {
    name: "Downer Group Nz",
    logo: "https://downergroup.co.nz/wp-content/uploads/sites/5/2025/10/Downer-Logo.svg",
  },
  {
    name: "John Keells Properties",
    logo: "https://www.johnkeellsproperties.com/images/logos/sitelogo.svg",
  },
  {
    name: "Land Sterling",
    logo: "https://landsterling.com/wp-content/uploads/2023/12/LS-logo.svg",
  },
  {
    name: "NEOM",
    logo: "https://neom.scene7.com/is/image/neom/logo-neom-en-spaced?fmt=png-alpha&scl=1",
  },
]

const featuredReviews = [
  {
    metric: "20 hrs",
    metricLabel: "weekly saved per project manager",
    quote: "Concolabs has completely transformed how we manage our construction projects. We've reduced paperwork by 60% and improved team coordination dramatically.",
    author: "Michael Chen",
    role: "CEO, Turner Construction",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    slug: "turner-construction",
  },
  {
    metric: "15%",
    metricLabel: "reduction in concrete wastage cost",
    quote: "The real-time budget tracking alone has saved us millions. We catch cost overruns before they spiral out of control.",
    author: "Sarah Williams",
    role: "CFO, Berkeley Group",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    slug: "berkeley-group",
  },
  {
    metric: "3.5x",
    metricLabel: "increase in logistics speed",
    quote: "Our field teams and office staff finally speak the same language. Project handoffs are seamless now.",
    author: "David Park",
    role: "Project Director, Lendlease Projects",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    slug: "lendlease-projects",
  },
  {
    metric: "3 Days",
    metricLabel: "faster financial close",
    quote: "Integrating our jobsite operations directly with Procore and Sage meant no more manual data entry. The finance office in London and field site in Manchester are now in perfect lockstep.",
    author: "Elena Rostova",
    role: "VP of Finance, Summit Structures",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    slug: "summit-structures",
  },
]

export function CustomersHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredReviews.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const scrollToGrid = () => {
    window.scrollTo({
      top: window.innerHeight * 0.9,
      behavior: "smooth",
    })
  }

  return (
    <section ref={containerRef} className="pt-32 pb-20 px-6 relative overflow-hidden bg-[#F4F2F0] dark:bg-zinc-950">
      {/* Subtle Background Radial Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-zinc-900/5 dark:bg-zinc-50/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Left Column: Heading and CTAs (Harvey AI inspired) */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-zinc-800 dark:text-zinc-100 leading-tight tracking-tight text-balance">
                Built for high stakes:<br />
                <span className="relative inline-block text-zinc-500 mt-2">
                  How builders run on Concolabs.
                </span>
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg sm:text-xl max-w-xl leading-relaxed">
                Discover how leading contractors, developers, and engineers streamline site management, automate compliance, and eliminate project risk.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Button asChild size="lg" className="rounded-xl px-6 font-bold cursor-pointer">
                <Link href="/demo">Request a Demo</Link>
              </Button>
              
              <button
                onClick={scrollToGrid}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-800 text-sm font-bold text-zinc-800 dark:text-zinc-200 bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <span>Browse customer stories</span>
                <ArrowDown className="w-4 h-4" />
              </button>
            </motion.div>
          </div>

          {/* Right Column: Featured Case Study (Ramp inspired) */}
          <div className="lg:col-span-5">
            <div className="relative p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden min-h-[380px] flex flex-col justify-between">
              {/* Highlight badge */}
              <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono text-[9px] font-bold tracking-widest uppercase z-20">
                FEATURED
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="flex flex-col justify-between h-full flex-1"
                >
                  <div>
                    {/* Large statistical highlight */}
                    <div className="mb-6">
                      <div className="text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-1">
                        {featuredReviews[activeIndex].metric}
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        {featuredReviews[activeIndex].metricLabel}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-[1px] w-full bg-zinc-100 dark:bg-zinc-800 mb-6" />

                    <blockquote className="text-zinc-650 dark:text-zinc-300 text-sm italic leading-relaxed mb-6 font-medium">
                      &ldquo;{featuredReviews[activeIndex].quote}&rdquo;
                    </blockquote>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      {/* Spokesperson Avatar Badge */}
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                        <img
                          src={featuredReviews[activeIndex].avatar}
                          alt={featuredReviews[activeIndex].author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-zinc-950 dark:text-zinc-50">
                          {featuredReviews[activeIndex].author}
                        </h3>
                        <p className="text-[10px] text-zinc-500 font-semibold">
                          {featuredReviews[activeIndex].role}
                        </p>
                      </div>
                    </div>
                    
                    <Link
                      href={`/customers/${featuredReviews[activeIndex].slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white hover:underline"
                    >
                      <span>Read story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Client Logos Wall (Rippling inspired) */}
        <div className="border-t border-zinc-300/60 dark:border-zinc-800 pt-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="text-xs font-semibold text-zinc-400 uppercase tracking-widest text-center mb-8"
          >
            TRUSTED BY BUILDING EXPERTS WORLDWIDE
          </motion.p>
          
          <div className="relative w-full overflow-hidden py-4" style={{ maskImage: "linear-gradient(to right, transparent, white 15%, white 85%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, white 15%, white 85%, transparent)" }}>
            <div className="animate-marquee-ltr flex items-center gap-12">
              {[...companies, ...companies].map((company, index) => (
                <div
                  key={`${company.name}-${index}`}
                  className="flex items-center justify-center min-w-[150px] shrink-0"
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    loading="lazy"
                    className={`h-7 w-auto object-contain opacity-50 dark:opacity-70 transition-opacity hover:opacity-100 duration-300 ${
                      company.name === "John Keells Properties"
                        ? "brightness-0 dark:brightness-100"
                        : "grayscale hover:grayscale-0 dark:invert"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
