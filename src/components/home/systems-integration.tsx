"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import {
  RefreshCw,
  LayoutGrid,
  Sparkles,
  Users,
} from "lucide-react"
import { GlobalSpendGlobe } from "@/components/home/global-spend-globe"

const features = [
  {
    icon: Users,
    title: "We study how your firm works, then build the system around it",
    description:
      "No generic software. We study how your firm works, configure the suite to match, and deploy it ready to run from day one.",
  },
  {
    icon: RefreshCw,
    title: "From tool clutter to one integrated suite",
    description:
      "One integrated suite replaces the clutter, cuts software spend, and eliminates the admin overhead that comes with it.",
  },
  {
    icon: LayoutGrid,
    title: "Automate entire workflows, not just steps",
    description:
      "Project management, cost control, and contract admin connected in one pipeline. No switching, no gaps.",
  },
  {
    icon: Sparkles,
    title: "AI that knows construction, deeply",
    description:
      "Trained on construction datasets since 2023, our AI has the context to answer real questions, take real action, and understand your projects the way your best QS does.",
  },
]

export function SystemsIntegration() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-4xl text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance leading-tight">
            When everything runs on one system, work moves faster
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Replace dozens of tools, handoffs, and manual work with one unified platform.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — heading + feature list */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.12 }}
                >
                  <div className="flex items-start gap-5 py-8">
                    <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  {index < features.length - 1 && (
                    <div className="h-px bg-border w-full" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Globe Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="w-full flex items-center justify-center"
          >
            <div className="mx-auto flex h-full w-full max-w-[480px] flex-col justify-between overflow-hidden rounded-2xl border border-zinc-300 bg-[#ECEBEA] p-6 min-h-[470px]">
              {/* Globe Animation Container linked to customers page */}
              <Link href="/customers" className="relative flex h-[340px] w-full items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xs sm:h-[360px]">
                <GlobalSpendGlobe />
              </Link>

              {/* Description Text under the globe */}
              <div className="mt-6 flex flex-col justify-between flex-grow text-left">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 leading-tight">
                    One platform supporting customers running worldwide.
                  </h3>
                  <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
                    Our portfolio runs across firms in Sri Lanka, India, Singapore, Australia, New Zealand, the UK, the Gulf, and Africa, with Concolabs systems live wherever their teams operate.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
