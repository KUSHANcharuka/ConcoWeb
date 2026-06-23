"use client"

import { useRef } from "react"
import { useInView, motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

const cards = [
  {
    id: "wordtobim",
    title: "WordtoBIM",
    highlight: "specification to BIM model",
    route: "/learnmore/wordtobim",
    description: "Convert word specifications and requirements into structural BIM elements automatically.",
    image: "/images/Home Page cards/WordToBIM.png",
  },
  {
    id: "boq",
    title: "Revit to BOQ",
    highlight: "automatic quantity takeoff",
    route: "/learnmore/revit-to-boq",
    description: "Generate Bills of Quantities from drawings and models with AI-guided accuracy.",
    image: "/images/Home Page cards/RevitToBOQ.png",
  },
  {
    id: "builderbot",
    title: "BuilderBot AI",
    highlight: "legal contract expert",
    route: "/learnmore/builderbot",
    description: "Get clause-referenced legal contract audit reports and answers in seconds.",
    image: "/images/Home Page cards/BuilderBot.AI.png",
  },
  {
    id: "buildmonitor",
    title: "buildMonitorAPP",
    highlight: "automatic progress tracking",
    route: "/learnmore/buildmonitor",
    description: "Generate daily progress reports automatically from mobile site updates in real-time.",
    image: "/images/Home Page cards/buildMonitorAPP.png",
  },
  {
    id: "buildmarketlk",
    title: "BuidldMArket.lk",
    highlight: "construction materials marketplace",
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
    <section ref={containerRef} className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            The complete AI suite for<br />
            modern construction firms
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            AI agents that work alongside your team, around the clock.
          </p>
        </motion.div>

        {/* Top Row — 2 large cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 mb-4">
          {cards.slice(0, 2).map((card, index) => {
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                onClick={() => router.push(card.route)}
                className="group relative h-[420px] sm:h-[500px] lg:h-[80vh] lg:min-h-[520px] rounded-2xl border border-zinc-300 bg-[#F4F2F0] overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-shadow duration-300"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between p-7 pb-5">
                  <div>
                    <h3 className="text-3xl font-medium text-zinc-900 leading-tight">
                      {card.title}{" "}
                      <span className="font-normal text-zinc-650">{card.highlight}</span>
                    </h3>
                    <p className="text-sm text-zinc-500 mt-2 max-w-[85%]">{card.description}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(card.route);
                    }}
                    aria-label={`Open ${card.title}`}
                    className="platform-card-link relative ml-4 mt-0.5 flex size-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-300 bg-zinc-100 text-zinc-900 transition-colors duration-200 cursor-pointer"
                  >
                    <ArrowUpRight className="platform-card-arrow h-4 w-4" />
                  </button>
                </div>

                {/* Mockup Area */}
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-6" style={{ top: "155px" }}>
                  <div className="relative w-full h-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 shadow-sm flex items-center justify-center">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {cards.slice(2).map((card, index) => {
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                onClick={() => router.push(card.route)}
                className="group relative h-[380px] sm:h-[420px] lg:h-[62vh] lg:min-h-[460px] rounded-2xl border border-zinc-300 bg-[#F4F2F0] overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-shadow duration-300"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between p-6 pb-4">
                  <div>
                    <h3 className="text-2xl font-medium text-zinc-900 leading-tight">
                      {card.title}{" "}
                      <span className="font-normal text-zinc-650">{card.highlight}</span>
                    </h3>
                    <p className="text-xs text-zinc-500 mt-2 max-w-[85%]">{card.description}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(card.route);
                    }}
                    aria-label={`Open ${card.title}`}
                    className="platform-card-link relative ml-3 mt-0.5 flex size-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-300 bg-zinc-100 text-zinc-900 transition-colors duration-200 cursor-pointer"
                  >
                    <ArrowUpRight className="platform-card-arrow h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Mockup Area */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-5" style={{ top: "145px" }}>
                  <div className="relative w-full h-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 shadow-sm flex items-center justify-center">
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
