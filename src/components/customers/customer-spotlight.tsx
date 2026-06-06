"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, ShieldCheck, Database, Zap, ArrowRight, Activity, TrendingUp } from "lucide-react"

type ProductModule = "cost-control" | "field-ops" | "erp-sync" | "offline-sync"

interface SpotlightData {
  company: string
  logo: string
  metric: string
  metricLabel: string
  title: string
  quote: string
  author: string
  role: string
  description: string
}

const spotlightData: Record<ProductModule, SpotlightData> = {
  "cost-control": {
    company: "Novus Development",
    logo: "ND",
    metric: "98.4%",
    metricLabel: "Budget Forecasting Accuracy",
    title: "AI-Powered Budget Control",
    quote: "Before Concolabs, we were always reacting to cost overruns weeks after they happened. Now, the AI engine flags potential anomalies in real-time, letting us adjust on the fly and stay on budget.",
    author: "Elena Rostova",
    role: "VP of Product Development",
    description: "Novus Development scales residential housing projects across the state with predictive costing.",
  },
  "field-ops": {
    company: "Turner Construction",
    logo: "TC",
    metric: "20 hrs",
    metricLabel: "Saved Weekly Per Site Manager",
    title: "Streamlined Field Workflows",
    quote: "By keeping our field logs, delivery schedules, and subcontractor notes in one unified dashboard, we eliminated the end-of-day admin bottleneck. Managers spend more time directing and less time typing.",
    author: "Marcus Vance",
    role: "Director of Operations",
    description: "Turner Construction streamlines commercial projects, coordinating 100+ daily field crew.",
  },
  "erp-sync": {
    company: "Summit Structures",
    logo: "SS",
    metric: "3 Days",
    metricLabel: "Faster Financial Close",
    title: "Real-time ERP Integrations",
    quote: "Integrating our jobsite operations directly with Procore and Sage meant no more manual data entry. The finance office in London and field site in Manchester are now in perfect lockstep.",
    author: "Elena Rostova",
    role: "VP of Finance",
    description: "Summit Structures automates billing and project accounting for mid-market developments.",
  },
  "offline-sync": {
    company: "Vertex Infrastructure",
    logo: "VI",
    metric: "0.0%",
    metricLabel: "Offline Data Loss",
    title: "Offline-First Mobile Sync",
    quote: "Our crews work in remote mountainous regions with zero cell service. Concolabs saves inspections locally and uploads the second they hit connectivity. It's transformed site reports.",
    author: "Elena Rostova",
    role: "Infrastructure Lead",
    description: "Vertex Infrastructure builds bridges and highways under extreme weather and remote conditions.",
  },
}

export function CustomerSpotlight() {
  const [activeTab, setActiveTab] = useState<ProductModule>("cost-control")

  const current = spotlightData[activeTab]

  return (
    <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-950/40 border-y border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            How we solve operations
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg">
            See how different building teams use specialized Concolabs modules to achieve top results.
          </p>
        </div>

        {/* Tabs navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-4xl mx-auto">
          {[
            { id: "cost-control", label: "AI Cost Control", icon: BarChart3 },
            { id: "field-ops", label: "Field Operations", icon: ShieldCheck },
            { id: "erp-sync", label: "ERP Financial Sync", icon: Database },
            { id: "offline-sync", label: "Offline Mobile 3.0", icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ProductModule)}
                className={`relative px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md scale-103"
                    : "bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-zinc-400"}`} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-12 shadow-sm relative min-h-[500px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full"
            >
              {/* Left Column: Editorial Case Study */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-black text-sm shadow-xs">
                    {current.logo}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 leading-none">
                      {current.company}
                    </h3>
                    <p className="text-xs text-zinc-500 font-semibold mt-0.5">
                      {current.description}
                    </p>
                  </div>
                </div>

                <h4 className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-zinc-50 leading-tight">
                  {current.title}
                </h4>

                {/* Metric Spotlight */}
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/80">
                  <div className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-none mb-1">
                    {current.metric}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    {current.metricLabel}
                  </div>
                </div>

                <blockquote className="text-zinc-600 dark:text-zinc-300 text-[15px] leading-relaxed italic border-l-2 border-zinc-300 dark:border-zinc-700 pl-4">
                  &ldquo;{current.quote}&rdquo;
                </blockquote>

                <div className="pt-2">
                  <p className="text-sm font-bold text-zinc-950 dark:text-zinc-50">
                    {current.author}
                  </p>
                  <p className="text-xs font-semibold text-zinc-500">
                    {current.role}
                  </p>
                </div>

                <div className="pt-4">
                  <a
                    href={`/customers/${activeTab}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-zinc-50 hover:underline"
                  >
                    Explore {current.company} case study
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Right Column: Premium Dashboard/Mock Preview (Rippling inspired) */}
              <div className="lg:col-span-6 flex items-center justify-center">
                <div className="w-full max-w-[500px] aspect-[4/3] bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-inner relative overflow-hidden flex flex-col justify-between">
                  {/* Top bar mockup */}
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      <span className="text-xs font-mono text-zinc-400 ml-2">concolabs_cloud_v3.0</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-950 dark:bg-white text-[10px] font-mono font-bold text-white dark:text-zinc-950">
                      LIVE STATUS
                    </span>
                  </div>

                  {/* Dynamic Render based on Tab */}
                  {activeTab === "cost-control" && (
                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xs">
                          <span className="text-xs font-semibold text-zinc-400 block mb-1">PROJECTED COST</span>
                          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">$4.18M</span>
                          <span className="text-[10px] font-bold text-green-500 block mt-1">On Target</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xs">
                          <span className="text-xs font-semibold text-zinc-400 block mb-1">AI COST ENGINE</span>
                          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">98.4% Acc.</span>
                          <span className="text-[10px] font-bold text-zinc-400 block mt-1">Variance: +/- 1.6%</span>
                        </div>
                      </div>

                      {/* Small mock line graph */}
                      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex-1 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-zinc-500">Real-time Budget Forecast</span>
                          <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
                        </div>
                        <div className="flex-1 flex items-end justify-between h-20 px-2 relative pt-2">
                          {/* Graph lines (SVG) */}
                          <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 100 30" preserveAspectRatio="none">
                            {/* Forecast target line */}
                            <line x1="0" y1="15" x2="100" y2="15" stroke="currentColor" strokeDasharray="2" className="text-zinc-200 dark:text-zinc-800" strokeWidth="1" />
                            {/* Actual expenditure line */}
                            <path d="M 0,28 Q 15,22 30,23 T 60,16 T 90,15 T 100,15" fill="none" stroke="currentColor" className="text-zinc-900 dark:text-zinc-200" strokeWidth="2" />
                            <circle cx="100" cy="15" r="2" fill="currentColor" className="text-zinc-900 dark:text-zinc-200" />
                          </svg>
                          <span className="text-[9px] text-zinc-400">Jan</span>
                          <span className="text-[9px] text-zinc-400">Mar</span>
                          <span className="text-[9px] text-zinc-400">May</span>
                          <span className="text-[9px] text-zinc-400">Jul</span>
                          <span className="text-[9px] text-zinc-400">Sep</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "field-ops" && (
                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 shadow-2xs">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                          <div>
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">Daily Field Log Approved</span>
                            <span className="text-[10px] text-zinc-400">Turner Site Manager Chen, M. • 4 mins ago</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 text-[10px] font-bold">
                          Synced
                        </span>
                      </div>

                      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 shadow-2xs">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                          <div>
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">Subcontractor Checklist</span>
                            <span className="text-[10px] text-zinc-400">Safety Walkthrough • Completed</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 text-[10px] font-bold">
                          100%
                        </span>
                      </div>

                      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex-1 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-zinc-500">Site Operations Summary</span>
                          <Activity className="w-3.5 h-3.5 text-zinc-400" />
                        </div>
                        <div className="space-y-2 mt-2">
                          <div>
                            <div className="flex justify-between text-[10px] font-semibold text-zinc-500 mb-1">
                              <span>Weekly Time Reclaimed</span>
                              <span className="font-bold text-zinc-900 dark:text-zinc-100">20 hrs / site</span>
                            </div>
                            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-zinc-900 dark:bg-white h-full rounded-full" style={{ width: "85%" }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[10px] font-semibold text-zinc-500 mb-1">
                              <span>Log Submission Compliance</span>
                              <span className="font-bold text-zinc-900 dark:text-zinc-100">99.2%</span>
                            </div>
                            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-zinc-900 dark:bg-white h-full rounded-full" style={{ width: "99.2%" }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "erp-sync" && (
                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xs">
                        <div className="flex items-center justify-between mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                          <span className="text-xs font-bold text-zinc-400">CONNECTED INTEGRATIONS</span>
                          <span className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold">
                          <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">Sage 300</div>
                          <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">Procore</div>
                          <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">QuickBooks</div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[11px] font-bold text-zinc-500">Integration Audit Sync</span>
                          <span className="text-[9px] text-zinc-400">Last Sync: 1 min ago</span>
                        </div>
                        <div className="space-y-2 mt-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-500 font-medium">Field logs matching invoices</span>
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">182 / 182</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-500 font-medium">ERP Ledger sync status</span>
                            <span className="font-bold text-green-500">Perfect</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-500 font-medium">Financial close reduction</span>
                            <span className="font-bold text-zinc-950 dark:text-zinc-50">-3 Days</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "offline-sync" && (
                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xs text-center flex-1 flex flex-col justify-center">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 mx-auto flex items-center justify-center mb-3">
                          <Zap className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                        </div>
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">Mobile Offline Mode 3.0</span>
                        <span className="text-[10px] text-zinc-400 max-w-xs mx-auto mt-1">
                          Database offline sync engine is active and collecting field telemetry safely without network.
                        </span>
                      </div>

                      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700 animate-pulse" />
                          <span className="text-[11px] font-bold text-zinc-500">Pending Sync Cache</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">12 Logs Saved</span>
                      </div>

                      <div className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-xl p-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-[11px] font-bold">Network Reconnected</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Syncing: 100% complete</span>
                      </div>
                    </div>
                  )}

                  {/* Fine print */}
                  <div className="text-[9px] font-mono text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-3 flex justify-between">
                    <span>SECURE: AES-256</span>
                    <span>CLIENT ID: {current.company.replace(/\s+/g, '').toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
      </div>
    </section>
  )
}
