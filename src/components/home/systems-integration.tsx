"use client"

import { useRef, Suspense } from "react"
import { motion, useInView } from "framer-motion"
import {
  RefreshCw,
  LayoutGrid,
  Sparkles,
  Users,
} from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { RotatingDotGlobe } from "./global-presence"

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
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — heading + feature list */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance leading-tight">
              When everything runs on one system, work moves faster
            </h2>
            <p className="text-muted-foreground text-lg mb-12">
              Replace dozens of tools, handoffs, and manual work with one unified platform.
            </p>

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
            <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-300 bg-[#ECEBEA] p-6 min-h-[420px] h-full w-full max-w-[480px] mx-auto">
              {/* Globe Canvas Container */}
              <div className="relative w-full h-[280px] overflow-hidden rounded-lg bg-white border border-zinc-200 shadow-xs flex items-center justify-center">
                <div className="absolute inset-0">
                  <Canvas camera={{ position: [0, 0, 2.6], fov: 44 }}>
                    <Suspense fallback={null}>
                      <ambientLight intensity={1} />
                      <pointLight position={[4, 3, 5]} intensity={0.55} />
                      <RotatingDotGlobe />
                    </Suspense>
                  </Canvas>
                </div>
              </div>

              {/* Description Text under the globe */}
              <div className="mt-6 flex flex-col justify-between flex-grow text-left">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 leading-tight">
                    One platform for all your global spend.
                  </h3>
                  <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
                    Issue cards in 30+ currencies and reimburse employees in local currencies, including pounds, euros, yen, and pesos.
                  </p>
                </div>
                <div className="mt-6">
                  <a
                    href="/global-spend"
                    className="inline-flex items-center gap-1.5 font-semibold text-zinc-900 hover:opacity-80 transition-opacity group underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-900 text-sm"
                  >
                    Global Spend Management
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
