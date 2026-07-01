"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Briefcase, X, CheckCircle2 } from "lucide-react"

const departments = ["All", "Engineering", "Product", "Sales", "Operations"]

const openPositions = [
  {
    title: "Senior Full-Stack Engineer (Offline-First Database)",
    department: "Engineering",
    location: "Remote (US/Canada)",
    type: "Full-time",
    description: "Lead the design of our local-first SQLite synchronizer. Help builders sync site telemetry in zero-connectivity areas seamlessly."
  },
  {
    title: "AI/ML Engineer (Predictive Cost Control)",
    department: "Engineering",
    location: "Remote / Hybrid (San Francisco, CA)",
    type: "Full-time",
    description: "Develop ML forecasting engines to identify contractor billing anomalies, concrete curing rates, and delivery logistics delays."
  },
  {
    title: "Senior Product Designer",
    department: "Product",
    location: "Remote / Hybrid (San Francisco, CA)",
    type: "Full-time",
    description: "Redesign complex construction administrative worksheets into simple, fast, and tactile mobile/desktop user interfaces."
  },
  {
    title: "Director of Enterprise Sales (West Region)",
    department: "Sales",
    location: "Remote (West Coast, US)",
    type: "Full-time",
    description: "Establish and close partnership deals with Top-400 General Contractors and industrial infrastructure engineering firms."
  },
  {
    title: "Technical Customer Success Manager",
    department: "Operations",
    location: "Remote (US)",
    type: "Full-time",
    description: "Support construction administrative teams with Sage 300 and Procore database integrations, resolving financial sync queries."
  }
]

export function CareersPositions() {
  const [selectedDept, setSelectedDept] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeApplication, setActiveApplication] = useState<string | null>(null)
  const [emailInput, setEmailInput] = useState("")
  const [applied, setApplied] = useState(false)

  const filteredJobs = openPositions.filter((job) => {
    const deptMatch = selectedDept === "All" || job.department === selectedDept
    const searchMatch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
    return deptMatch && searchMatch
  })

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput) return
    setApplied(true)
    setTimeout(() => {
      setApplied(false)
      setActiveApplication(null)
      setEmailInput("")
    }, 2000)
  }

  return (
    <section id="positions" className="py-20 bg-[#FAFAF8] dark:bg-black border-t border-zinc-200/50 dark:border-zinc-900/50">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-550 block font-sans">
              Open Positions
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
              Help us shape the building tools of tomorrow
            </h2>
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-3 border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-2 bg-white dark:bg-zinc-950 min-w-[280px] self-start md:self-auto shadow-2xs">
            <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search positions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none border-none w-full text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-0 focus:outline-none font-sans"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none py-1 border-b border-zinc-200/60 dark:border-zinc-900/60">
          {departments.map((dept) => {
            const isActive = selectedDept === dept
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer select-none whitespace-nowrap ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {dept}
              </button>
            )
          })}
        </div>

        {/* Listings Stack */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, idx) => (
                <motion.div
                  key={job.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="p-8 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl bg-white dark:bg-zinc-950 hover:border-zinc-350 dark:hover:border-zinc-750 transition-all duration-300 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3 max-w-3xl">
                    <h3 className="text-xl md:text-2xl font-sans font-bold text-zinc-950 dark:text-zinc-50 leading-tight">
                      {job.title}
                    </h3>
                    
                    {/* Metadata chips */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-500 font-sans">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                    </div>

                    <p className="text-sm md:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 font-sans pt-1">
                      {job.description}
                    </p>
                  </div>

                  {/* Apply CTA */}
                  <div>
                    <button
                      onClick={() => setActiveApplication(job.title)}
                      className="px-6 py-2.5 rounded-full bg-zinc-900 text-white hover:bg-zinc-850 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 text-sm font-bold cursor-pointer transition-colors whitespace-nowrap font-sans"
                    >
                      Apply Now
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white dark:bg-zinc-950 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl"
              >
                <p className="text-zinc-550 font-medium font-sans">No open roles match your filters.</p>
                <button
                  onClick={() => {
                    setSelectedDept("All")
                    setSearchQuery("")
                  }}
                  className="text-zinc-950 dark:text-white font-bold text-sm mt-3 hover:underline cursor-pointer font-sans"
                >
                  Reset filters & search
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Application Modal (Notion-style simple overlay) */}
        <AnimatePresence>
          {activeApplication && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  if (!applied) setActiveApplication(null)
                }}
                className="absolute inset-0 bg-black/60 backdrop-blur-xs"
              />

              {/* Modal box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-3xl p-8 shadow-2xl z-10 space-y-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 leading-tight font-sans">
                      {activeApplication}
                    </h3>
                  </div>
                  
                  {!applied && (
                    <button
                      onClick={() => setActiveApplication(null)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-550 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Form overlay content */}
                <AnimatePresence mode="wait">
                  {!applied ? (
                    <motion.form
                      key="apply-form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleApplySubmit}
                      className="space-y-4"
                    >
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-400 font-sans">
                          Work Email
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-400 font-sans">
                          Resume URL (LinkedIn, Portfolio, or Drive link)
                        </label>
                        <input
                          type="url"
                          required
                          placeholder="https://linkedin.com/in/username"
                          className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors font-sans"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-full bg-zinc-950 text-white hover:bg-zinc-850 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 text-sm font-bold flex items-center justify-center cursor-pointer transition-colors font-sans mt-2"
                      >
                        Submit Application
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="apply-success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-6 space-y-3 flex flex-col items-center justify-center"
                    >
                      <CheckCircle2 className="w-12 h-12 text-zinc-900 dark:text-white" />
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 font-sans">
                          Application Received!
                        </h4>
                        <p className="text-xs text-zinc-500 font-sans">
                          We will reach out to you shortly at {emailInput}.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
