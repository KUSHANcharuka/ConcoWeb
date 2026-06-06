"use client"

import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"

export function CareersHero() {
  const scrollToPositions = () => {
    const el = document.getElementById("positions")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="min-h-screen flex flex-col justify-center pt-28 pb-20 bg-[#FAFAF8] dark:bg-black relative overflow-hidden border-b border-zinc-200/50 dark:border-zinc-900/50">
      {/* Background patterns representing grid/organization */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Gradient effect behind tagline */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/12 dark:bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 relative z-10 flex flex-col items-center text-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 max-w-4xl leading-[1.05] font-sans"
        >
          Join us in building the future <br />
          <span className="text-gradient">of construction operations</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed font-sans"
        >
          We are on a mission to eliminate paper bottlenecks, predict budget overruns, and empower builders globally with unified operational engines.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={scrollToPositions}
            className="px-8 py-3.5 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs select-none transition-all font-sans"
          >
            <span>View open roles</span>
            <ArrowDown className="w-4 h-4" />
          </button>
        </motion.div>

      </div>
    </section>
  )
}
