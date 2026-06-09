"use client"

import { useRef } from "react"
import { useInView, motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowUpRight,
  Bot,
  LayoutDashboard,
  Calculator,
  FileText,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileCheck,
  Users,
  Clock
} from "lucide-react"

// --- Mock UI Components for each card ---

function AIMockup() {
  return (
    <div className="w-full h-full bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm flex flex-col">
      <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-zinc-100">
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
        <span className="ml-2 text-xs text-zinc-400 font-mono">Concolabs AI · Project Omega</span>
      </div>
      <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
            <Bot className="w-3 h-3 text-zinc-500" />
          </div>
          <div className="bg-zinc-50 rounded-lg rounded-tl-none px-3 py-2 text-xs text-zinc-700 max-w-[85%]">
            Detected a 3-day delay risk in Foundation Phase. Rescheduling 4 tasks automatically.
          </div>
        </div>
        <div className="flex items-start gap-2 justify-end">
          <div className="bg-zinc-900 rounded-lg rounded-tr-none px-3 py-2 text-xs text-white max-w-[75%]">
            What&apos;s the impact on the overall budget?
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
            <Bot className="w-3 h-3 text-zinc-500" />
          </div>
          <div className="bg-zinc-50 rounded-lg rounded-tl-none px-3 py-2 text-xs text-zinc-700 max-w-[85%]">
            Current overage estimate: <span className="font-semibold text-zinc-900">$12,400</span>. I&apos;ve flagged 2 line items for review.
          </div>
        </div>
        <div className="mt-auto grid grid-cols-3 gap-2 pt-2">
          {[
            { label: "Tasks at Risk", value: "4", color: "text-orange-500" },
            { label: "Budget Impact", value: "-$12k", color: "text-red-500" },
            { label: "Resolved Today", value: "11", color: "text-emerald-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-zinc-50 rounded-lg p-2 text-center">
              <div className={`text-sm font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DashboardMockup() {
  const bars = [40, 65, 50, 80, 70, 90, 60, 75, 85, 55, 95, 72]
  return (
    <div className="w-full h-full bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm flex flex-col">
      <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-zinc-100">
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
        <span className="ml-2 text-xs text-zinc-400 font-mono">Concolabs · Dashboard</span>
      </div>
      <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Active Projects", value: "24", trend: "+3" },
            { label: "On Schedule", value: "87%", trend: "+5%" },
            { label: "Open Issues", value: "12", trend: "-4" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-zinc-50 rounded-lg p-2.5">
              <div className="text-lg font-bold text-zinc-900">{kpi.value}</div>
              <div className="text-[10px] text-zinc-400">{kpi.label}</div>
              <div className="text-[10px] text-emerald-600 font-medium mt-0.5">{kpi.trend} this week</div>
            </div>
          ))}
        </div>
        <div className="flex-1 bg-zinc-50 rounded-lg p-3">
          <div className="text-[10px] text-zinc-400 mb-2 font-medium uppercase tracking-wide">Project Progress</div>
          <div className="flex items-end gap-1 h-16">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-zinc-900"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-zinc-400">Jan</span>
            <span className="text-[9px] text-zinc-400">Dec</span>
          </div>
        </div>
        <div className="space-y-1.5">
          {[
            { name: "Tower Block A", progress: 82, status: "on-track" },
            { name: "Bridge Expansion", progress: 47, status: "delayed" },
            { name: "Residential Complex", progress: 91, status: "on-track" },
          ].map((proj) => (
            <div key={proj.name} className="flex items-center gap-2">
              <div className="text-[10px] text-zinc-600 w-28 truncate flex-shrink-0">{proj.name}</div>
              <div className="flex-1 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${proj.status === "on-track" ? "bg-zinc-900" : "bg-orange-400"}`}
                  style={{ width: `${proj.progress}%` }}
                />
              </div>
              <div className="text-[10px] text-zinc-400 w-6 text-right">{proj.progress}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BudgetMockup() {
  return (
    <div className="w-full h-full bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm flex flex-col">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-zinc-100">
        <span className="w-2 h-2 rounded-full bg-zinc-300" />
        <span className="w-2 h-2 rounded-full bg-zinc-300" />
        <span className="w-2 h-2 rounded-full bg-zinc-300" />
        <span className="ml-2 text-xs text-zinc-400 font-mono">Budget Tracker</span>
      </div>
      <div className="flex-1 p-3 flex flex-col gap-2 overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-semibold text-zinc-700">Total Budget</span>
          <span className="text-xs font-bold text-zinc-900">$2,400,000</span>
        </div>
        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
          <div className="h-full w-[68%] bg-zinc-900 rounded-full" />
        </div>
        <div className="flex justify-between text-[9px] text-zinc-400">
          <span>Spent: $1,632,000</span>
          <span>Remaining: $768,000</span>
        </div>
        <div className="space-y-1.5 mt-1">
          {[
            { label: "Materials", pct: 45, amount: "$1.08M" },
            { label: "Labour", pct: 30, amount: "$720K" },
            { label: "Equipment", pct: 15, amount: "$360K" },
            { label: "Overheads", pct: 10, amount: "$240K" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-[9px] text-zinc-500 w-16 flex-shrink-0">{item.label}</span>
              <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-800 rounded-full" style={{ width: `${item.pct}%` }} />
              </div>
              <span className="text-[9px] text-zinc-500 w-10 text-right">{item.amount}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-1.5 mt-auto">
          <div className="flex-1 bg-emerald-50 rounded-lg p-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
            <span className="text-[9px] text-emerald-700 font-medium">Under budget by 4%</span>
          </div>
          <div className="flex-1 bg-orange-50 rounded-lg p-2 flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3 text-orange-500 flex-shrink-0" />
            <span className="text-[9px] text-orange-600 font-medium">2 items need review</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function DocumentsMockup() {
  return (
    <div className="w-full h-full bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm flex flex-col">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-zinc-100">
        <span className="w-2 h-2 rounded-full bg-zinc-300" />
        <span className="w-2 h-2 rounded-full bg-zinc-300" />
        <span className="w-2 h-2 rounded-full bg-zinc-300" />
        <span className="ml-2 text-xs text-zinc-400 font-mono">Smart Documents</span>
      </div>
      <div className="flex-1 p-3 flex flex-col gap-1.5 overflow-hidden">
        {[
          { name: "Site Blueprint Rev.3", type: "PDF", tag: "Approved", tagColor: "bg-emerald-100 text-emerald-700", icon: FileCheck },
          { name: "Structural Report Q2", type: "PDF", tag: "Review", tagColor: "bg-orange-100 text-orange-700", icon: FileCheck },
          { name: "Subcontractor Contract", type: "DOC", tag: "Signed", tagColor: "bg-emerald-100 text-emerald-700", icon: FileCheck },
          { name: "Safety Checklist W22", type: "XLS", tag: "Draft", tagColor: "bg-zinc-100 text-zinc-600", icon: FileCheck },
          { name: "Permit Application", type: "PDF", tag: "Pending", tagColor: "bg-blue-100 text-blue-700", icon: FileCheck },
        ].map((doc) => (
          <div key={doc.name} className="flex items-center gap-2 bg-zinc-50 rounded-lg px-2.5 py-1.5">
            <doc.icon className="w-3 h-3 text-zinc-400 flex-shrink-0" />
            <span className="flex-1 text-[10px] text-zinc-700 truncate">{doc.name}</span>
            <span className="text-[8px] text-zinc-400 font-mono">{doc.type}</span>
            <span className={`text-[8px] font-medium px-1.5 py-0.5 rounded-full ${doc.tagColor}`}>{doc.tag}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReportsMockup() {
  const data = [30, 50, 40, 70, 60, 85, 75]
  return (
    <div className="w-full h-full bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm flex flex-col">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-zinc-100">
        <span className="w-2 h-2 rounded-full bg-zinc-300" />
        <span className="w-2 h-2 rounded-full bg-zinc-300" />
        <span className="w-2 h-2 rounded-full bg-zinc-300" />
        <span className="ml-2 text-xs text-zinc-400 font-mono">Analytics & Reports</span>
      </div>
      <div className="flex-1 p-3 flex flex-col gap-2 overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-semibold text-zinc-700">Weekly Performance</span>
          <TrendingUp className="w-3 h-3 text-emerald-600" />
        </div>
        <div className="flex items-end gap-1.5 h-14 mt-1">
          {data.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full rounded-t-sm bg-zinc-900" style={{ height: `${h}%` }} />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[9px] text-zinc-400">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <span key={d} className="flex-1 text-center">{d[0]}</span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1.5 mt-auto">
          {[
            { label: "Efficiency", value: "94%", up: true },
            { label: "Compliance", value: "100%", up: true },
            { label: "Incidents", value: "0", up: true },
            { label: "Overruns", value: "2", up: false },
          ].map((m) => (
            <div key={m.label} className="bg-zinc-50 rounded-lg px-2 py-1.5 flex justify-between items-center">
              <span className="text-[9px] text-zinc-500">{m.label}</span>
              <span className={`text-[10px] font-bold ${m.up ? "text-zinc-900" : "text-orange-500"}`}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const cards = [
  {
    id: "ai",
    title: "Cards & Expenses",
    highlight: "that handle themselves",
    href: "/solutions/project-management",
    description: "Concolabs AI monitors every project milestone 24/7, flagging risks before they become costly setbacks.",
    mockup: AIMockup,
    span: 1,
  },
  {
    id: "dashboard",
    title: "Procure to pay",
    highlight: "without chasing approvals",
    href: "/solutions/budget-control",
    description: "Connect field teams and back-office into a single real-time workspace — no more spreadsheet chaos.",
    mockup: DashboardMockup,
    span: 1,
  },
  {
    id: "budget",
    title: "Budget controls",
    highlight: "that stay on track",
    href: "/solutions/analytics",
    description: "Track every dollar in real time across all projects with automatic variance alerts.",
    mockup: BudgetMockup,
    span: 1,
  },
  {
    id: "docs",
    title: "Blueprints & contracts",
    highlight: "auto-organized",
    href: "/solutions/documents",
    description: "All your documents structured, version-controlled, and always findable — instantly.",
    mockup: DocumentsMockup,
    span: 1,
  },
  {
    id: "reports",
    title: "Stakeholder reports",
    highlight: "generated in seconds",
    href: "/solutions/analytics",
    description: "Generate compliance, financial, and progress reports for any audience with one click.",
    mockup: ReportsMockup,
    span: 1,
  },
]

export function PlatformSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

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
            One platform for your entire<br />
            construction workflow
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Infinite agents that work 24/7 to keep your projects on track
          </p>
        </motion.div>

        {/* Top Row — 2 large cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 mb-4">
          {cards.slice(0, 2).map((card, index) => {
            const Mockup = card.mockup
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="group relative h-[420px] sm:h-[500px] lg:h-[80vh] lg:min-h-[520px] rounded-2xl border border-zinc-300 bg-[#F4F2F0] overflow-hidden cursor-pointer"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between p-7 pb-5">
                  <div>
                    <h3 className="text-3xl font-medium text-zinc-900 leading-tight">
                      {card.title}{" "}
                      <span className="font-normal text-zinc-600">{card.highlight}</span>
                    </h3>
                  </div>
                  <Link
                    href={card.href}
                    aria-label={`Open ${card.title}`}
                    className="platform-card-link relative ml-4 mt-0.5 flex size-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-300 bg-zinc-100 text-zinc-900 transition-colors duration-200"
                  >
                    <ArrowUpRight className="platform-card-arrow h-4 w-4" />
                  </Link>
                </div>

                {/* Mockup Area */}
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-6" style={{ top: "130px" }}>
                  <Mockup />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Row — 3 equal cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {cards.slice(2).map((card, index) => {
            const Mockup = card.mockup
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="group relative h-[380px] sm:h-[420px] lg:h-[62vh] lg:min-h-[460px] rounded-2xl border border-zinc-300 bg-[#F4F2F0] overflow-hidden cursor-pointer"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between p-6 pb-4">
                  <div>
                    <h3 className="text-2xl font-medium text-zinc-900 leading-tight">
                      {card.title}{" "}
                      <span className="font-normal text-zinc-600">{card.highlight}</span>
                    </h3>
                  </div>
                  <Link
                    href={card.href}
                    aria-label={`Open ${card.title}`}
                    className="platform-card-link relative ml-3 mt-0.5 flex size-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-300 bg-zinc-100 text-zinc-900 transition-colors duration-200"
                  >
                    <ArrowUpRight className="platform-card-arrow h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* Mockup Area */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-5" style={{ top: "115px" }}>
                  <Mockup />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
