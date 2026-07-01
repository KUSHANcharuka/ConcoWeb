"use client"

import { motion } from "framer-motion"

export function HeroTagline() {
  return (
    <section className="relative min-h-[30vh] flex flex-col items-center justify-center px-6 pt-32 pb-8">
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative text-center max-w-4xl mx-auto z-10"
      >
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-zinc-800 leading-tight tracking-tight text-balance"
        >
          Every workflow your construction firm runs,{" "}
          <span className="text-zinc-500">made smarter by AI</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto text-pretty"
        >
          Concolabs unifies design, project management, cost control, and contract
          administration into an interconnected AI-powered suite for the business of building.
        </motion.p>
      </motion.div>
    </section>
  )
}
