"use client"

import { useRef } from "react"
import { useInView, motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

const cards = [
  {
    id: "wordtobim",
    title: "WordtoBIM",
    highlight: "Specification to BIM model",
    route: "/learnmore/wordtobim",
    description: "Convert word specifications and requirements into structural BIM elements automatically.",
    image: "/images/Home Page cards/WordToBIM.png",
  },
  {
    id: "boq",
    title: "Revit to BOQ",
    highlight: "Automatic quantity takeoff",
    route: "/learnmore/revit-to-boq",
    description: "Generate Bills of Quantities from drawings and models with AI-guided accuracy.",
    image: "/images/Home Page cards/RevitToBOQ.png",
  },
  {
    id: "builderbot",
    title: "BuilderBot AI",
    highlight: "Legal contract expert",
    route: "/learnmore/builderbot",
    description: "Get clause-referenced legal contract audit reports and answers in seconds.",
    image: "/images/Home Page cards/BuilderBot.AI.png",
  },
  {
    id: "buildmonitor",
    title: "BuildMonitorAPP",
    highlight: "Automatic progress tracking",
    route: "/learnmore/buildmonitor",
    description: "Generate daily progress reports automatically from mobile site updates in real-time.",
    image: "/images/Home Page cards/buildMonitorAPP.png",
  },
  {
    id: "buildmarketlk",
    title: "Buildmarketlk",
    highlight: "Construction materials marketplace",
    route: "/learnmore/buildmarketlk",
    description: "Source construction materials, compare supplier rates, and manage procurement pipelines.",
    image: "/images/Home Page cards/BuidldMArket.lk.png",
  },
]

export function PlatformSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const router = useRouter()

  return (
    <section ref={containerRef} className="px-6 pt-24 pb-10 sm:pb-16 lg:pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            A complete AI suite for<br />
            modern construction firms
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            AI agents that work alongside your team, around the clock.
          </p>
        </motion.div>

        {/* Top Row — 2 large cards */}
        <div className="mb-4 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-7">
          {cards.slice(0, 2).map((card, index) => {
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                onClick={() => router.push(card.route)}
                className="group relative flex h-[400px] flex-col rounded-[1.65rem] border border-zinc-300 bg-[#F4F2F0] overflow-hidden cursor-pointer shadow-xs transition-shadow duration-300 hover:shadow-md sm:h-[500px] lg:h-[80vh] lg:min-h-[520px]"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 px-5 pt-7 pb-3 sm:p-7 sm:pb-5">
                  <div className="min-w-0 flex-1 pr-2 sm:pr-0">
                    <h3 className="max-w-[15.5ch] text-[1.3rem] font-medium leading-[1.02] tracking-[-0.025em] text-zinc-900 sm:max-w-none sm:text-3xl sm:leading-tight sm:tracking-normal">
                      <span className="block">{card.title}</span>
                      <span className="mt-2 block max-w-[18ch] text-[1.08rem] font-normal leading-[1.02] text-zinc-600 sm:max-w-none sm:text-[2rem] sm:leading-[1.05]">{card.highlight}</span>
                    </h3>
                    <p className="mt-3 hidden max-w-[85%] text-sm text-zinc-500 sm:block sm:text-lg sm:leading-[1.35]">{card.description}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(card.route);
                    }}
                    aria-label={`Open ${card.title}`}
                    className="platform-card-link relative mt-1 flex size-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 transition-colors duration-200 cursor-pointer sm:ml-4 sm:size-9 sm:rounded-lg sm:bg-zinc-100"
                  >
                    <ArrowUpRight className="platform-card-arrow h-4 w-4" />
                  </button>
                </div>

                {/* Mockup Area */}
                <div className="mt-3 min-h-0 flex-1 px-5 pb-5 sm:mt-0 sm:px-6 sm:pb-6">
                  <div className="relative flex h-full max-h-full w-full items-center justify-center overflow-hidden rounded-[1.1rem] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50 sm:rounded-xl">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Row — 3 equal cards */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-4">
          {cards.slice(2).map((card, index) => {
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                onClick={() => router.push(card.route)}
                className="group relative flex h-[360px] flex-col rounded-[1.65rem] border border-zinc-300 bg-[#F4F2F0] overflow-hidden cursor-pointer shadow-xs transition-shadow duration-300 hover:shadow-md sm:h-[420px] lg:h-[62vh] lg:min-h-[460px]"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 px-5 pt-7 pb-3 sm:p-6 sm:pb-4">
                  <div className="min-w-0 flex-1 pr-2 sm:pr-0">
                    <h3 className="max-w-[16ch] text-[1.3rem] font-medium leading-[1.04] tracking-[-0.025em] text-zinc-900 sm:max-w-none sm:text-2xl sm:leading-tight sm:tracking-normal">
                      <span className="block">{card.title}</span>
                      <span className="mt-2 block max-w-[19ch] text-[1.06rem] font-normal leading-[1.04] text-zinc-600 sm:max-w-none sm:text-[1.7rem] sm:leading-[1.08]">{card.highlight}</span>
                    </h3>
                    <p className="mt-3 hidden max-w-[85%] text-xs text-zinc-500 sm:block sm:text-base sm:leading-[1.4]">{card.description}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(card.route);
                    }}
                    aria-label={`Open ${card.title}`}
                    className="platform-card-link relative mt-1 flex size-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 transition-colors duration-200 cursor-pointer sm:ml-3 sm:mt-0.5 sm:rounded-lg sm:bg-zinc-100"
                  >
                    <ArrowUpRight className="platform-card-arrow h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Mockup Area */}
                <div className="mt-3 min-h-0 flex-1 px-5 pb-5 sm:mt-0">
                  <div className="relative flex h-full max-h-full w-full items-center justify-center overflow-hidden rounded-[1.1rem] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50 sm:rounded-xl">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
