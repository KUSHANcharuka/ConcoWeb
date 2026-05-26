"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"

const awards = [
  {
    name: "G2 High Performer",
    badge: "Winter 2025",
    color: "from-orange-500/20 to-orange-500/5",
    borderColor: "border-orange-500/30",
  },
  {
    name: "G2 High Performer",
    badge: "Small Business",
    color: "from-orange-500/20 to-orange-500/5",
    borderColor: "border-orange-500/30",
  },
  {
    name: "G2 High Performer",
    badge: "Australia",
    color: "from-orange-500/20 to-orange-500/5",
    borderColor: "border-orange-500/30",
  },
  {
    name: "Capterra",
    badge: "Best Ease of Use 2024",
    color: "from-blue-500/20 to-blue-500/5",
    borderColor: "border-blue-500/30",
  },
  {
    name: "Capterra",
    badge: "Best Value 2024",
    color: "from-blue-500/20 to-blue-500/5",
    borderColor: "border-blue-500/30",
  },
  {
    name: "Software Advice",
    badge: "Most Recommended",
    color: "from-emerald-500/20 to-emerald-500/5",
    borderColor: "border-emerald-500/30",
  },
  {
    name: "Software Advice",
    badge: "Best Customer Support",
    color: "from-emerald-500/20 to-emerald-500/5",
    borderColor: "border-emerald-500/30",
  },
  {
    name: "GetApp",
    badge: "Best Functionality",
    color: "from-purple-500/20 to-purple-500/5",
    borderColor: "border-purple-500/30",
  },
]

export function AwardsSection() {
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
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Award-Winning Software<br />
            <span className="text-gradient">Trusted by Users</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recognized by leading software review platforms
          </p>
        </motion.div>

        {/* Awards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {awards.map((award, index) => (
            <motion.div
              key={`${award.name}-${award.badge}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`relative p-6 rounded-2xl bg-gradient-to-br ${award.color} border ${award.borderColor} min-w-[140px]`}
            >
              {/* Badge shape */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-3 relative">
                  {/* Shield/Badge icon */}
                  <svg viewBox="0 0 64 64" className="w-full h-full">
                    <path
                      d="M32 4L8 14v20c0 16 24 26 24 26s24-10 24-26V14L32 4z"
                      fill="currentColor"
                      className="text-card"
                    />
                    <path
                      d="M32 4L8 14v20c0 16 24 26 24 26s24-10 24-26V14L32 4z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-primary/50"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {award.name.split(" ")[0][0]}
                    </span>
                  </div>
                </div>
                <p className="text-xs font-semibold text-foreground">{award.name}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{award.badge}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* User provided award image reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Rated <span className="text-primary font-semibold">4.8/5</span> across all platforms
          </p>
        </motion.div>
      </div>
    </section>
  )
}
