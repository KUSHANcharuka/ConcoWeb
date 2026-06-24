"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Calendar, CheckCircle2, ChevronRight, ShieldCheck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PersonaData } from "@/lib/persona-data"
import Link from "next/link"
import { VideoLightbox } from "./video-lightbox"

interface PersonaTimelineProps {
  data: PersonaData
}

export function PersonaTimeline({ data }: PersonaTimelineProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeVideoUrl, setActiveVideoUrl] = useState("")
  const [activeStageId, setActiveStageId] = useState<string>(data.stages[0]?.id || "")

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -70% 0px",
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace("stage-", "")
          setActiveStageId(id)
        }
      })
    }, observerOptions)

    data.stages.forEach((stage) => {
      const el = document.getElementById(`stage-${stage.id}`)
      if (el) observer.observe(el)
    })

    return () => {
      observer.disconnect()
    }
  }, [data.stages])

  const bookingUrl = "https://calendar.app.google/mCq7zBhXrDnEAJvB7"

  const handleWatchDemo = (url: string) => {
    setActiveVideoUrl(url)
    setLightboxOpen(true)
  }

  return (
    <div className="w-full bg-[#FAFAF8] dark:bg-zinc-950 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          
          {/* Left Timeline Guide (Lg screen only) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-36 h-fit self-start pl-4">
            <div className="relative border-l border-zinc-200 dark:border-zinc-800 pl-6 py-2 space-y-8">
              {data.stages.map((stage, idx) => {
                const isActive = stage.id === activeStageId
                return (
                  <a
                    key={stage.id}
                    href={`#stage-${stage.id}`}
                    className="group block text-left transition-colors"
                  >
                    <div className="relative">
                      {/* Dot on line */}
                      <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-primary transition-colors flex items-center justify-center ${
                        isActive ? "bg-primary" : "bg-[#FAFAF8] dark:bg-zinc-950 group-hover:bg-primary"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          isActive ? "bg-zinc-950 dark:bg-zinc-950" : "bg-zinc-950 dark:bg-zinc-50"
                        }`} />
                      </div>
                      <span className={`text-xs font-semibold uppercase tracking-widest block mb-0.5 transition-colors ${
                        isActive ? "text-zinc-950 dark:text-zinc-50" : "text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-50"
                      }`}>
                        Stage 0{idx + 1}
                      </span>
                      <span className={`text-sm font-bold transition-colors ${
                        isActive ? "text-zinc-950 dark:text-zinc-50" : "text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-zinc-50"
                      }`}>
                        {stage.label}
                      </span>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Right Main Content Block */}
          <div className="lg:col-span-9 space-y-16">
            {data.stages.map((stage, stageIdx) => {
              // Find if there is a handoff from this stage to the next
              const nextStage = data.stages[stageIdx + 1]
              const handoff = data.handoffs?.find(
                (h) => h.fromStage === stage.id && h.toStage === (nextStage?.id || "")
              )

              return (
                <div key={stage.id} id={`stage-${stage.id}`} className="space-y-8 scroll-mt-36">
                  {/* Stage Header */}
                  <div className="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/5 dark:bg-zinc-50/5 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                      Stage 0{stageIdx + 1} — {stage.label}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                      {stage.headline}
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-500 max-w-3xl leading-relaxed">
                      {stage.description}
                    </p>
                  </div>

                  {/* Stage Product Cards list */}
                  <div className="space-y-6">
                    {stage.products.map((product) => (
                      <div 
                        key={product.id}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
                      >
                        {/* Left Side (55%) */}
                        <div className="md:col-span-7 space-y-4">
                          <div>
                            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                              <Link 
                                href={`/learnmore/${product.id}`}
                                className="hover:text-lime-dark dark:hover:text-lime transition-colors hover:underline inline-flex items-center gap-1.5 group/title cursor-pointer"
                              >
                                {product.title}
                                <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all duration-200 text-lime" />
                              </Link>
                            </h3>
                            <p className="text-[13px] text-zinc-500 italic mt-0.5 leading-relaxed">
                              {product.painPoint}
                            </p>
                          </div>

                          {/* Feature Bullets */}
                          <ul className="space-y-2">
                            {product.features.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-[13px] text-zinc-650 dark:text-zinc-400">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Pill Badges (Target & Status) */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50">
                              {product.targetMarket}
                            </span>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                              product.status === "Scaling" 
                                ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/40" 
                                : "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/40"
                            }`}>
                              {product.status}
                            </span>
                          </div>

                        </div>

                        {/* Right Side (45%) */}
                        <div className="md:col-span-5 flex flex-col gap-4">
                          {/* Video Thumbnail (Opens Modal or Booking Link) */}
                          {product.requestDemoOnly ? (
                            <a
                              href={bookingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative aspect-video rounded-2xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden flex items-center justify-center group shadow-inner cursor-pointer block"
                            >
                              {/* Abstract decorative video background overlay */}
                              <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200/60 dark:from-zinc-900 dark:to-zinc-950 group-hover:scale-[1.02] transition-transform duration-500" />
                              
                              <div className="relative z-10 flex flex-col items-center gap-1.5 text-center px-4">
                                <span className="w-10 h-10 rounded-full bg-zinc-950/80 dark:bg-zinc-50/80 text-white dark:text-zinc-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                  <Play className="w-4.5 h-4.5 fill-current" />
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                                  Request Demo
                                </span>
                              </div>
                            </a>
                          ) : (
                            <button
                              onClick={() => handleWatchDemo(product.videoUrl)}
                              className="relative aspect-video rounded-2xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden flex items-center justify-center group shadow-inner cursor-pointer block w-full text-left"
                            >
                              {/* Abstract decorative video background overlay */}
                              <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200/60 dark:from-zinc-900 dark:to-zinc-950 group-hover:scale-[1.02] transition-transform duration-500" />
                              
                              <div className="relative z-10 flex flex-col items-center gap-1.5 text-center px-4 mx-auto">
                                <span className="w-10 h-10 rounded-full bg-zinc-950/80 dark:bg-zinc-50/80 text-white dark:text-zinc-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                  <Play className="w-4.5 h-4.5 fill-current" />
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                                  Watch Product Demo
                                </span>
                              </div>
                            </button>
                          )}

                          {/* CTA Actions */}
                          <div className="grid grid-cols-2 gap-3">
                            {product.requestDemoOnly ? (
                              <Button
                                asChild
                                variant="outline"
                                className="col-span-2 rounded-xl text-xs font-bold cursor-pointer"
                              >
                                <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
                                  Request a demo
                                </a>
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  onClick={() => handleWatchDemo(product.videoUrl)}
                                  className="rounded-xl text-xs font-bold cursor-pointer"
                                >
                                  Watch demo
                                </Button>
                                <Button
                                  asChild
                                  className="rounded-xl text-xs font-bold cursor-pointer bg-primary text-black hover:bg-primary/90"
                                >
                                  <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
                                    Book a demo →
                                  </a>
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                  {/* Stage Handoff Connector */}
                  {handoff && (
                    <div className="relative py-8 pl-8 md:pl-16 border-l border-dashed border-zinc-300 dark:border-zinc-800 ml-4 md:ml-10">
                      {/* Anchor arrow visual */}
                      <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-400" />

                      <div className="max-w-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Handoff workflow connector
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[8px] font-mono font-bold">
                            {handoff.pillText}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                          {handoff.text}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Special Three-Column Comparison for Legal Professionals */}
            {data.comparison && (
              <div className="pt-10 space-y-8 border-t border-zinc-200 dark:border-zinc-800 scroll-mt-36">
                <div className="text-center space-y-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Comparative breakdown
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                    {data.comparison.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                  {data.comparison.columns.map((col, idx) => (
                    <div
                      key={idx}
                      className={`rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 ${
                        col.highlight
                          ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent shadow-xl md:scale-[1.03]"
                          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-xs"
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-end h-5">
                          {col.highlight && (
                            <span className="px-2 py-0.5 rounded-full bg-primary text-zinc-950 text-[8px] font-bold uppercase tracking-wider">
                              Recommended
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold font-serif leading-tight">
                          {col.label}
                        </h3>
                        <p className={`text-xs leading-relaxed ${
                          col.highlight ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-500"
                        }`}>
                          {col.description}
                        </p>
                      </div>
                      
                      {col.highlight && (
                        <div className="pt-6">
                          <Button asChild className="w-full rounded-xl text-xs font-bold cursor-pointer bg-primary text-black hover:bg-primary/90">
                            <a href="https://builderbot.ai" target="_blank" rel="noopener noreferrer">
                              Visit BuilderBot.ai →
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Video Lightbox Portal Component */}
      <VideoLightbox 
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        videoUrl={activeVideoUrl}
      />
    </div>
  )
}
