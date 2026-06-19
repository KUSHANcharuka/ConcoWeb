"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  )
}

const G2Logo = () => (
  <div className="flex items-center gap-1.5 select-none">
    <div className="w-6 h-6 rounded-full bg-[#ff492c] flex items-center justify-center text-white font-black text-xs">
      G
    </div>
    <span className="font-extrabold text-foreground text-sm tracking-tight">G2 Crowd</span>
  </div>
)

const CapterraLogo = () => (
  <div className="flex items-center gap-1.5 select-none">
    <svg viewBox="0 0 100 100" className="w-5 h-5 text-[#006dfa] fill-current">
      <path d="M50 10 L85 45 L50 80 L15 45 Z" />
      <path d="M50 25 L70 45 L50 65 L30 45 Z" className="text-[#f6f5f2] fill-current" />
    </svg>
    <span className="font-extrabold text-foreground text-sm tracking-tight">Capterra</span>
  </div>
)

const SoftwareAdviceLogo = () => (
  <div className="flex items-center gap-1.5 select-none">
    <div className="flex gap-0.5">
      <div className="w-2.5 h-2.5 rounded-full bg-[#004e8d]" />
      <div className="w-2.5 h-2.5 rounded-full bg-[#ffc300]" />
    </div>
    <span className="font-extrabold text-foreground text-sm tracking-tight">Software Advice</span>
  </div>
)

const GetAppLogo = () => (
  <div className="flex items-center gap-1.5 select-none">
    <div className="w-5 h-5 rounded-md bg-[#5b32a2] flex items-center justify-center text-white font-extrabold text-[10px]">
      GA
    </div>
    <span className="font-extrabold text-foreground text-sm tracking-tight">GetApp</span>
  </div>
)

const BADGES = [
  {
    logo: <G2Logo />,
    title: "Winter 2026",
    award: "G2 Leader",
    rating: "4.8",
  },
  {
    logo: <CapterraLogo />,
    title: "Best Value",
    award: "Best Ease of Use",
    rating: "4.8",
  },
  {
    logo: <SoftwareAdviceLogo />,
    title: "Most Recommended",
    award: "Front Runners",
    rating: "4.8",
  },
  {
    logo: <GetAppLogo />,
    title: "Category Leader",
    award: "Best Functionality",
    rating: "4.8",
  },
]

export function AwardsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section ref={containerRef} className="py-24 px-6 bg-card/30 border-y border-border/40">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading and summary info */}
          <div className="lg:col-span-5 text-left">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6"
            >
              Award-Winning Software<br />
              <span className="text-foreground">Trusted by Users</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
            >
              Concolabs is consistently recognized by leading software review platforms for our ease of use, customer support, and value. See how we rank.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-[#f6f5f2] dark:bg-muted/10 border border-border/40 w-fit"
            >
              <div className="text-4xl font-extrabold text-foreground">4.8</div>
              <div className="flex flex-col">
                <div className="flex gap-0.5 text-lime">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Average user rating across 5,000+ reviews</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Badges Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {BADGES.map((badge, index) => (
                <motion.div
                  key={badge.award}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="flex flex-col items-center text-center p-8 rounded-3xl bg-[#f6f5f2] dark:bg-muted/10 border border-border/40 hover:border-foreground/15 hover:shadow-xs transition-all duration-300"
                >
                  {/* Badge Brand Header */}
                  <div className="mb-4">
                    {badge.logo}
                  </div>
                  {/* Badge Certificate Title */}
                  <h3 className="text-lg font-bold text-foreground mb-1 leading-snug">
                    {badge.award}
                  </h3>
                  <p className="text-sm font-semibold text-muted-foreground mb-4">
                    {badge.title}
                  </p>
                  {/* Stars */}
                  <div className="flex gap-0.5 text-lime mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Rating {badge.rating} / 5
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
