"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Linkedin, MapPin, Award, Users, ChevronRight, ChevronLeft, Briefcase } from "lucide-react"
import { leaders } from "@/lib/team-data"
import type { Leader } from "@/lib/team-data"
import { LeaderProfileModal } from "@/components/about/leader-modal"
import { WorldGlobe } from "@/components/about/world-globe"
import { useIsMobile } from "@/hooks/use-mobile"

// Types
interface Milestone {
  title: string
  description: string
  details: string[]
  stats?: { value: string; label: string }
}

const getMilestone = (nodeName: string, currentYear: number, currentMonth: string): Milestone => {
  if (nodeName === "2024") {
    return {
      title: "The Genesis",
      description: "Concolabs was founded in San Francisco and London by construction tech industry veterans.",
      details: [
        "Founded with a mission to eliminate paper logs and disjointed software in the field.",
        "Launched private beta with 10 leading mid-market design partners.",
        "Secured seed funding to build the core real-time data sync architecture."
      ],
      stats: { value: "10+", label: "Initial Design Partners" }
    }
  }
  if (nodeName === "2025") {
    return {
      title: "Platform Expansion",
      description: "Launched the AI Cost Control Engine and entered enterprise markets.",
      details: [
        "Introduced AI-driven budget tracking and real-time project cost prediction features.",
        "Released out-of-the-box integrations with top ERP/accounting packages like Sage, Procore, and QuickBooks.",
        "Expanded team to 50+ builders and researchers across the globe."
      ],
      stats: { value: "150+", label: "Active Construction Sites" }
    }
  }
  if (nodeName === currentMonth) {
    const monthNamesFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const monthNamesAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentMonthIndex = monthNamesAbbr.indexOf(currentMonth)
    const fullMonthName = currentMonthIndex !== -1 ? monthNamesFull[currentMonthIndex] : currentMonth
    return {
      title: `${fullMonthName} ${currentYear}: AI & Voice Workflows`,
      description: "Launched BuilderBot 2.0 and reached new project volume milestones.",
      details: [
        "Released BuilderBot 2.0, allowing field teams to generate daily logs and RFIs via voice messages and site photos.",
        "Surpassed $5 Billion in total construction volume managed across the platform.",
        "Established strategic engineering and customer hubs in Mumbai and Sydney."
      ],
      stats: { value: "$5B+", label: "Project Volume Managed" }
    }
  }
  
  // Fallback for intermediate years Y < currentYear (e.g. 2026 if today is 2027)
  return {
    title: `${nodeName}: Global Scale`,
    description: `Released Mobile App 3.0 and hit major enterprise adoption milestones in ${nodeName}.`,
    details: [
      "Rolled out Mobile 3.0 with complete offline-first database sync for remote jobsites.",
      "Surpassed 500+ active construction enterprises using Concolabs daily.",
      "Expanded global spend and multicurrency support across 30+ currencies."
    ],
    stats: { value: "500+", label: "Enterprise Customers" }
  }
}

export default function AboutUsPage() {
  const [activeLeader, setActiveLeader] = useState<Leader | null>(null)
  const isMobile = useIsMobile()
  const visibleCount = isMobile ? 3 : 5

  // Dynamic timeline items based on current date
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const monthNamesAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentMonthName = monthNamesAbbr[currentDate.getMonth()]
  const futureYear = String(currentYear + 1)

  // Build the nodes array dynamically from 2024 to currentYear + 1
  const allNodes = useMemo(() => {
    const nodes: string[] = []
    for (let y = 2024; y <= currentYear; y++) {
      nodes.push(String(y))
    }
    nodes.push(currentMonthName)
    nodes.push(futureYear)
    return nodes
  }, [currentYear, currentMonthName, futureYear])

  const [selectedYear, setSelectedYear] = useState<string>(currentMonthName)
  const [startIndex, setStartIndex] = useState<number>(Math.max(0, allNodes.length - visibleCount))

  const visibleNodes = useMemo(() => {
    return allNodes.slice(startIndex, startIndex + visibleCount)
  }, [allNodes, startIndex, visibleCount])

  const showArrows = allNodes.length > visibleCount

  useEffect(() => {
    setStartIndex((prev) => Math.min(Math.max(0, allNodes.length - visibleCount), prev))
  }, [visibleCount, allNodes.length])

  // If selectedYear is not in visibleNodes, select the closest visible clickable node
  useEffect(() => {
    if (!visibleNodes.includes(selectedYear)) {
      const clickableVisible = visibleNodes.filter(n => n !== futureYear)
      if (clickableVisible.length > 0) {
        const selectedIdx = allNodes.indexOf(selectedYear)
        const startIdx = allNodes.indexOf(visibleNodes[0])
        if (selectedIdx < startIdx) {
          setSelectedYear(clickableVisible[0])
        } else {
          setSelectedYear(clickableVisible[clickableVisible.length - 1])
        }
      }
    }
  }, [startIndex, visibleNodes, selectedYear, allNodes, futureYear])

  const fillPercentages = useMemo(() => {
    const pct: Record<string, string> = {}
    const btnWidth = isMobile ? 40 : 56 // w-10 vs w-14
    const offset = 24 + btnWidth / 2 // offset from left: "-24px"
    
    visibleNodes.forEach((node, i) => {
      if (i === 0) {
        pct[node] = `${offset}px`
      } else {
        if (isMobile) {
          if (i === 1) pct[node] = "calc(50% + 20px)"
          if (i === 2) pct[node] = "calc(100% - 4px)"
        } else {
          if (i === 1) pct[node] = "calc(25% + 38px)"
          if (i === 2) pct[node] = "calc(50% + 24px)"
          if (i === 3) pct[node] = "calc(75% + 10px)"
          if (i === 4) pct[node] = "calc(100% - 4px)"
        }
      }
    })
    return pct
  }, [visibleNodes, isMobile])

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setStartIndex((prev) => Math.min(allNodes.length - visibleCount, prev + 1))
  }

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch((err) => {
        console.error("Autoplay failed:", err)
      })
    }
  }, [])

  const missionRef = useRef<HTMLDivElement>(null)
  const isMissionInView = useInView(missionRef, { once: true, margin: "-100px" })

  const frictionRef = useRef<HTMLDivElement>(null)
  const isFrictionInView = useInView(frictionRef, { once: true, margin: "-100px" })

  const journeyRef = useRef<HTMLDivElement>(null)
  const isJourneyInView = useInView(journeyRef, { once: true, margin: "-100px" })

  const teamRef = useRef<HTMLDivElement>(null)
  const isTeamInView = useInView(teamRef, { once: true, margin: "-100px" })

  const officesRef = useRef<HTMLDivElement>(null)
  const isOfficesInView = useInView(officesRef, { once: true, margin: "-100px" })

  return (
    <main className="min-h-screen bg-background pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center px-6 py-24 overflow-hidden bg-zinc-950">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted={true}
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80"
          >
            <source
              src="/team-video.mp4"
              type="video/mp4"
            />
          </video>
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
        </div>

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              We free smart teams <br />
              <span className="text-white/70">
                to build great things.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl leading-relaxed">
              Concolabs is on a mission to eliminate administrative drag and busywork from construction operations, freeing field and office teams to focus on building.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Eliminating Friction Section */}
      <section ref={frictionRef} className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isFrictionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-955 dark:text-zinc-50 leading-tight">
              Concolabs unifies field operations, finance, and workflows
            </h2>
            <div className="w-20 h-1 bg-lime rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isFrictionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6 space-y-6 text-zinc-600 dark:text-zinc-400 leading-relaxed text-base sm:text-lg"
          >
            <p>
              We believe that running a construction company shouldn&apos;t require shuffling through paper logs, chasing spreadsheet updates, or wrestling with disconnected software.
            </p>
            <p>
              Concolabs is the single operating system that brings project management, spend, integrations, and field operations together. Built on a single source of truth for site and office data, it allows businesses to execute more efficiently, build faster, and manage less.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Journey Timeline Section */}
      <section ref={journeyRef} className="py-24 px-6 bg-background dark:bg-zinc-955 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-left mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Our Journey</h2>
            <p className="text-sm text-muted-foreground">How we are building the future of construction ops</p>
          </div>

          <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-12 shadow-sm">
            {/* Timeline navigation bar */}
            <div className={`relative flex items-center justify-between max-w-2xl mx-auto mb-16 ${showArrows ? "px-12" : ""}`}>
              {showArrows && (
                <button
                  onClick={handlePrev}
                  disabled={startIndex === 0}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center bg-white dark:bg-zinc-900 shadow-sm transition-all ${ startIndex === 0 ? "opacity-30 cursor-not-allowed" : "opacity-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer" }`}
                >
                  <ChevronLeft className="w-5 h-5 text-zinc-500" />
                </button>
              )}

              <div className="relative flex items-center justify-between w-full">
                <div className="absolute -left-6 -right-6 h-1 bg-zinc-200 dark:bg-zinc-800 top-1/2 -translate-y-1/2 z-0" />
                
                {/* Animated fill line */}
                <motion.div
                  className="absolute h-1 bg-lime top-1/2 -translate-y-1/2 z-0 origin-left"
                  style={{ left: "-24px" }}
                  initial={{ width: "0%" }}
                  animate={{ width: fillPercentages[selectedYear] || "0%" }}
                  transition={{ type: "spring", stiffness: 70, damping: 15 }}
                />

                {visibleNodes.map((node) => (
                  <button
                    key={node}
                    disabled={node === futureYear}
                    onClick={() => setSelectedYear(node)}
                    className={`relative z-10 focus:outline-none group ${
                      node === futureYear ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold transition-all duration-300 border ${ node === currentMonthName ? "text-xs sm:text-sm" : "text-sm sm:text-base" } ${ node === futureYear ? "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500" : selectedYear === node ? "bg-primary border-primary text-primary-foreground shadow-md scale-110" : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-400 hover:border-zinc-800 dark:hover:border-zinc-200 hover:text-zinc-800 dark:hover:text-zinc-200" }`}
                    >
                      {node}
                    </div>
                  </button>
                ))}
              </div>

              {showArrows && (
                <button
                  onClick={handleNext}
                  disabled={startIndex + visibleCount >= allNodes.length}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center bg-white dark:bg-zinc-900 shadow-sm transition-all ${
                    startIndex + visibleCount >= allNodes.length
                      ? "opacity-30 cursor-not-allowed"
                      : "opacity-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer"
                  }`}
                >
                  <ChevronRight className="w-5 h-5 text-zinc-500" />
                </button>
              )}
            </div>

            {/* Timeline content cards */}
            <div className="min-h-[300px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedYear}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-7 space-y-6">
                    <h3 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">
                      {getMilestone(selectedYear, currentYear, currentMonthName).title}
                    </h3>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {getMilestone(selectedYear, currentYear, currentMonthName).description}
                    </p>
                    <ul className="space-y-3">
                      {getMilestone(selectedYear, currentYear, currentMonthName).details.map((detail, idx) => (
                        <li key={idx} className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-xs">
                          <ChevronRight className="w-5 h-5 text-lime shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {getMilestone(selectedYear, currentYear, currentMonthName).stats && (
                    <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-[#F4F2F0] dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                      <span className="text-4xl sm:text-5xl font-black text-zinc-955 dark:text-zinc-50 tracking-tight">
                        {getMilestone(selectedYear, currentYear, currentMonthName).stats?.value}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2 text-center">
                        {getMilestone(selectedYear, currentYear, currentMonthName).stats?.label}
                      </span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section ref={teamRef} className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-left mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Meet our leadership team</h2>
            <p className="text-sm text-muted-foreground">Concolabs executives have helped grow the likes of Autodesk, Procore, and Salesforce.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaders.map((leader, index) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isTeamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setActiveLeader(leader)}
                className="group relative overflow-hidden rounded-2xl border border-zinc-300 dark:border-zinc-800 bg-[#F4F2F0] dark:bg-zinc-900/50 p-5 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-lg hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-300 cursor-pointer"
              >
                <div>
                  {/* Portrait Container */}
                  <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-zinc-200 dark:bg-zinc-800 mb-6 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-103 transition-all duration-500"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">{leader.name}</h3>
                  <p className="text-xs font-semibold text-zinc-500 mt-0.5">{leader.role}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-4 leading-relaxed">{leader.bio}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-250 dark:border-zinc-800">
                  <a
                    href={leader.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-955 dark:hover:text-zinc-50 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations Section */}
      <section ref={officesRef} className="py-24 px-6 bg-background dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-left mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-955 dark:text-zinc-50">Where we work</h2>
            <p className="text-sm text-muted-foreground">Our offices span four continents, bringing together world-class talent.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isOfficesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <WorldGlobe />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900/30 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <div className="w-[800px] h-[800px] bg-lime/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
            Ready to make an impact?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Join us to modernize finance and help every business thrive.
          </p>
          <div className="flex justify-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 rounded-xl font-bold shadow-md min-w-[200px]">
              <Link href="/careers">See open positions</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      <AnimatePresence>
        {activeLeader && (
          <LeaderProfileModal
            isOpen={!!activeLeader}
            onClose={() => setActiveLeader(null)}
            leader={activeLeader}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
