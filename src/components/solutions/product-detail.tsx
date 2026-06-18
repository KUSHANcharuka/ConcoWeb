"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  CheckCircle2, 
  ChevronRight, 
  Bot, 
  LayoutDashboard, 
  Calculator, 
  FileText, 
  Users, 
  BarChart3,
  DollarSign,
  TrendingUp,
  FileCheck,
  MessageSquare,
  Shield,
  Clock,
  ArrowRight,
  Info
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

// ----------------------------------------------------
// Product Interactive Simulator Components
// ----------------------------------------------------

// 1. Project Management Timeline Simulator
function ProjectTimelineSimulator() {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Site Clearance & Excavation", duration: 5, status: "completed", progress: 100 },
    { id: 2, name: "Pour Foundation Slab", duration: 7, status: "in-progress", progress: 60 },
    { id: 3, name: "Erect Steel Framework", duration: 12, status: "pending", progress: 0 },
    { id: 4, name: "Mechanical & Electrical Rough-Ins", duration: 10, status: "pending", progress: 0 }
  ])

  const completeTask = (id: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: "completed", progress: 100 }
      }
      // If we complete task 2, auto trigger progress on task 3
      if (id === 2 && t.id === 3) {
        return { ...t, status: "in-progress", progress: 15 }
      }
      return t
    }))
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-md flex flex-col gap-4">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Timeline & Dependencies</h4>
          <p className="text-[10px] text-zinc-400">Interactive live scheduling tool</p>
        </div>
        <span className="text-[10px] font-mono bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-full font-bold">Gantt View</span>
      </div>
      <div className="space-y-4 py-2">
        {tasks.map(task => (
          <div key={task.id} className="grid grid-cols-12 gap-3 items-center">
            <div className="col-span-5">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block truncate">{task.name}</span>
              <span className="text-[9px] text-zinc-400">{task.duration} Days Duration</span>
            </div>
            <div className="col-span-5 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  task.status === "completed" ? "bg-zinc-950 dark:bg-zinc-50" : "bg-primary"
                }`}
                style={{ width: `${task.progress}%` }}
              />
            </div>
            <div className="col-span-2 text-right">
              {task.status === "completed" ? (
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-500">Done</span>
              ) : task.status === "in-progress" ? (
                <button 
                  onClick={() => completeTask(task.id)}
                  className="text-[9px] font-bold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-2 py-1 rounded hover:opacity-90 transition-all cursor-pointer"
                >
                  Complete
                </button>
              ) : (
                <span className="text-[9px] font-semibold text-zinc-400">Pending</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 p-3 rounded-xl flex items-center gap-2">
        <Info className="w-4 h-4 text-zinc-500 shrink-0" />
        <p className="text-[10px] text-zinc-500">Completing tasks recalculates dependencies instantly down the chain, keeping milestones synced.</p>
      </div>
    </div>
  )
}

// 2. Budget cost matching control simulator
function BudgetCostSimulator() {
  const [budget, setBudget] = useState(150000)
  const [spent, setSpent] = useState(115000)
  const [invoices, setInvoices] = useState([
    { id: 1, vendor: "Apex Concrete", amount: 15400, desc: "Slab concrete deliver", status: "pending" },
    { id: 2, vendor: "Steel Works Ltd", amount: 24000, desc: "H-Beam framework load", status: "pending" }
  ])

  const processInvoice = (id: number, approve: boolean) => {
    const inv = invoices.find(i => i.id === id)
    if (!inv) return
    if (approve) {
      setSpent(prev => prev + inv.amount)
    }
    setInvoices(prev => prev.filter(i => i.id !== id))
  }

  const budgetProgress = (spent / budget) * 100

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-md flex flex-col gap-4">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Commitment Control</h4>
          <p className="text-[10px] text-zinc-400">Match invoices directly to budget categories</p>
        </div>
        <span className="text-[10px] font-mono bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-full font-bold">Cost Center</span>
      </div>

      {/* Budget Summary Card */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <span>Spent: ${spent.toLocaleString()}</span>
          <span>Budget Limit: ${budget.toLocaleString()}</span>
        </div>
        <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-zinc-950 dark:bg-zinc-50 transition-all duration-500 rounded-full" 
            style={{ width: `${Math.min(budgetProgress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-zinc-400">
          <span>{budgetProgress.toFixed(0)}% Utilized</span>
          <span>Remaining: ${(budget - spent).toLocaleString()}</span>
        </div>
      </div>

      {/* Pending invoice queue */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Pending Site Invoices ({invoices.length})</span>
        {invoices.length > 0 ? (
          <div className="space-y-2">
            {invoices.map(inv => (
              <div key={inv.id} className="flex justify-between items-center p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <div>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">{inv.vendor}</span>
                  <span className="text-[9px] text-zinc-400">{inv.desc}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">${inv.amount.toLocaleString()}</span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => processInvoice(inv.id, true)}
                      className="text-[9px] font-bold bg-emerald-600 text-white px-2 py-1 rounded hover:opacity-90 transition-all cursor-pointer"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => processInvoice(inv.id, false)}
                      className="text-[9px] font-bold bg-rose-600 text-white px-2 py-1 rounded hover:opacity-90 transition-all cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-xs text-zinc-400">All invoices processed. Budget remains aligned.</div>
        )}
      </div>
    </div>
  )
}

// 3. Document comparison overlay simulator
function DocumentRevisionSimulator() {
  const [rev, setRev] = useState("rev3")

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-md flex flex-col gap-4">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Blueprint Version overlay</h4>
          <p className="text-[10px] text-zinc-400">See changes overlayed in real time</p>
        </div>
        <div className="flex gap-1.5">
          <button 
            onClick={() => setRev("rev2")}
            className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold border transition-all cursor-pointer ${
              rev === "rev2" ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "bg-transparent border-zinc-200 text-zinc-400"
            }`}
          >
            Rev 2
          </button>
          <button 
            onClick={() => setRev("rev3")}
            className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold border transition-all cursor-pointer ${
              rev === "rev3" ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "bg-transparent border-zinc-200 text-zinc-400"
            }`}
          >
            Rev 3 (Overlay)
          </button>
        </div>
      </div>

      {/* Blueprint drawing box */}
      <div className="relative w-full aspect-video rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 100 60" className="w-full h-full stroke-zinc-400 dark:stroke-zinc-700 stroke-[0.5] fill-none">
          {/* Grid lines */}
          <line x1="10" y1="0" x2="10" y2="60" />
          <line x1="30" y1="0" x2="30" y2="60" />
          <line x1="50" y1="0" x2="50" y2="60" />
          <line x1="70" y1="0" x2="70" y2="60" />
          <line x1="90" y1="0" x2="90" y2="60" />
          <line x1="0" y1="15" x2="100" y2="15" />
          <line x1="0" y1="30" x2="100" y2="30" />
          <line x1="0" y1="45" x2="100" y2="45" />

          {/* Main foundations structure (Rev 2 and Rev 3) */}
          <rect x="20" y="10" width="60" height="40" className="stroke-zinc-900 dark:stroke-zinc-100 stroke-1" />
          <circle cx="50" cy="30" r="8" className="stroke-zinc-900 dark:stroke-zinc-100 stroke-1" />

          {/* Rev 3 overlay edits in RED highlight */}
          {rev === "rev3" && (
            <>
              {/* Added pipeline/support structure */}
              <line x1="20" y1="10" x2="50" y2="30" className="stroke-rose-600 dark:stroke-rose-400 stroke-1.5" />
              <line x1="80" y1="10" x2="50" y2="30" className="stroke-rose-600 dark:stroke-rose-400 stroke-1.5" />
              <rect x="42" y="22" width="16" height="16" className="stroke-rose-600 dark:stroke-rose-400 stroke-[1.5]" />
              {/* Highlight callout text */}
              <text x="36" y="52" className="fill-rose-600 dark:fill-rose-400 font-mono text-[4px] font-semibold stroke-none">ADDED BRACING UNIT (D-2)</text>
            </>
          )}
        </svg>
      </div>

      <p className="text-[10px] text-zinc-500 text-center">Overlay shows drawing modifications between file versions automatically, avoiding coordination errors.</p>
    </div>
  )
}

// 4. Team collaboration chat simulator
function TeamChatSimulator() {
  const [messages, setMessages] = useState([
    { sender: "Supt. Jack Miller", text: "Water pipe clash detected on grid D-3. Drawings say 4 inch, existing pipe is 8 inch.", time: "10:14 AM" }
  ])

  const sendAnswer = (ans: string) => {
    if (messages.length > 1) return // only allow one interaction in simulator
    setMessages(prev => [
      ...prev,
      { sender: "You (PM)", text: ans, time: "10:15 AM" },
      { sender: "Concolabs AI", text: "Logged Clash #142 automatically in drawing revisions and notified design lead Elena Rostova.", time: "10:15 AM" }
    ])
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-md flex flex-col gap-4">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">On-Site Collaboration Feed</h4>
          <p className="text-[10px] text-zinc-400">Contextual messaging logs</p>
        </div>
        <span className="text-[10px] font-mono bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-full font-bold">Field-to-Office</span>
      </div>

      {/* Messages container */}
      <div className="space-y-3 min-h-[160px] flex flex-col justify-end">
        {messages.map((m, idx) => {
          const isAI = m.sender === "Concolabs AI"
          const isUser = m.sender.startsWith("You")
          return (
            <div key={idx} className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
              {!isUser && (
                <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold ${
                  isAI ? "bg-primary text-black" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                }`}>
                  {isAI ? <Bot className="w-3.5 h-3.5" /> : "JM"}
                </div>
              )}
              <div className={`p-3 rounded-xl max-w-[80%] text-[10px] leading-relaxed border ${
                isUser 
                  ? "bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 border-transparent"
                  : isAI 
                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/40"
                    : "bg-zinc-50 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 border-zinc-100 dark:border-zinc-800"
              }`}>
                <div className="flex justify-between items-center gap-4 mb-1">
                  <span className="font-bold text-[9px] uppercase tracking-wide opacity-90">{m.sender}</span>
                  <span className="text-[8px] opacity-60 font-mono">{m.time}</span>
                </div>
                {m.text}
              </div>
            </div>
          )
        })}
      </div>

      {/* Action buttons (options) */}
      {messages.length === 1 && (
        <div className="space-y-2 border-t border-zinc-100 dark:border-zinc-800 pt-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Choose Response:</span>
          <div className="flex flex-col gap-1.5">
            <button 
              onClick={() => sendAnswer("Elena is drafting the bypass bypass blueprint. Requesting inspector check-in.")}
              className="text-left text-xs font-semibold p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all cursor-pointer"
            >
              "Tell Elena to draft bypass blueprint..."
            </button>
            <button 
              onClick={() => sendAnswer("Flagging this as critical safety roadblock. Pausing excavators.")}
              className="text-left text-xs font-semibold p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all cursor-pointer"
            >
              "Flag as critical roadblock..."
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// 5. Reporting & Analytics dashboard simulator
function ReportingAnalyticsSimulator() {
  const [activeMetric, setActiveMetric] = useState("schedule")

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-md flex flex-col gap-4">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Insight Center</h4>
          <p className="text-[10px] text-zinc-400">Live dashboard reporting dashboard</p>
        </div>
        <div className="flex gap-1.5">
          {["schedule", "costs", "safety"].map(metric => (
            <button
              key={metric}
              onClick={() => setActiveMetric(metric)}
              className={`text-[9px] px-2 py-0.5 rounded font-bold capitalize transition-all cursor-pointer ${
                activeMetric === metric 
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" 
                  : "bg-transparent text-zinc-400"
              }`}
            >
              {metric}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Graph representation */}
      <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
        <AnimatePresence mode="wait">
          {activeMetric === "schedule" && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-850 dark:text-zinc-250">Schedule Efficiency</span>
                <span className="text-xs font-bold text-emerald-600">+12% vs Q1</span>
              </div>
              <div className="flex items-end gap-2 h-20 pt-2">
                {[30, 45, 60, 50, 75, 90, 85].map((h, i) => (
                  <div key={i} className="flex-1 bg-zinc-900 dark:bg-zinc-100 rounded-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
              <span className="text-[8px] text-zinc-400 block text-center">Weekly milestones complete (Past 7 Weeks)</span>
            </motion.div>
          )}

          {activeMetric === "costs" && (
            <motion.div
              key="costs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-850 dark:text-zinc-250">Cost Variance</span>
                <span className="text-xs font-bold text-emerald-600">-$34k under bid</span>
              </div>
              <div className="flex items-end gap-2 h-20 pt-2">
                {[80, 70, 65, 55, 48, 42, 38].map((h, i) => (
                  <div key={i} className="flex-1 bg-zinc-900 dark:bg-zinc-100 rounded-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
              <span className="text-[8px] text-zinc-400 block text-center">Monthly materials variance overruns (reduced)</span>
            </motion.div>
          )}

          {activeMetric === "safety" && (
            <motion.div
              key="safety"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-850 dark:text-zinc-250">Compliance Inspections</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">100% Pass Rate</span>
              </div>
              <div className="flex items-end gap-2 h-20 pt-2">
                {[100, 100, 100, 100, 100, 100, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-zinc-900 dark:bg-zinc-100 rounded-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
              <span className="text-[8px] text-zinc-400 block text-center">Safety audit log verification rate</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-[10px] text-zinc-500 text-center">Click dashboard tabs to filter performance analytics. Export dashboards to PDF in one click.</p>
    </div>
  )
}

// ----------------------------------------------------
// Product detail data map
// ----------------------------------------------------
export interface ProductDetailData {
  title: string
  tagline: string
  intro: string
  statValue: string
  statLabel: string
  features: { title: string; desc: string }[]
  mockup: React.FC
  quoteText: string
  quoteAuthor: string
  quoteCompany: string
  faqs: { q: string; a: string }[]
}

export const productDetailMap: Record<string, ProductDetailData> = {
  "project-management": {
    title: "Project Management",
    tagline: "Track construction projects from bid to final delivery.",
    intro: "Eliminate superintendent phone tags, outdated paper logs, and manual spreadsheets. Concolabs connects dynamic scheduling milestones and task dependency charts directly with site updates, keeping field and office teams in sync 24/7.",
    statValue: "40%",
    statLabel: "Faster milestone execution",
    features: [
      { title: "Dynamic Gantt Milestones", desc: "Interactive dependency tracks that update instantly when tasks are adjusted in the field." },
      { title: "Offline Field Diaries", desc: "Superintendents log daily crew counts, site weather, safety checklist reports, and photos with zero network friction." },
      { title: "Smart RFIs & Submittals", desc: "Submit, route, and track project inquiries with automatic due-date reminders, attachments, and digital signature signoffs." }
    ],
    mockup: ProjectTimelineSimulator,
    quoteText: "We delivered our commercial development Phase 2 three weeks ahead of schedule. Linking daily logs directly with the office schedule saved countless hours.",
    quoteAuthor: "David Miller",
    quoteCompany: "Director of Projects, Lendlease",
    faqs: [
      { q: "Can our subcontractors update the daily log?", a: "Yes. Concolabs supports granular permissions. You can invite external subcontractors to update their crew logs and daily diaries without displaying internal budgets or cost items." },
      { q: "Does the scheduler sync with Microsoft Project or Primavera P6?", a: "Yes. Concolabs supports native XML file imports and exports, making schedule transfers back and forth with Primavera P6 and MS Project seamless." }
    ]
  },
  "budget-control": {
    title: "Budget & Cost Control",
    tagline: "Real-time budget tracking, commitment mapping, and ERP syncing.",
    intro: "Say goodbye to post-payment financial surprises. Concolabs links commitments, subcontractor contracts, and field invoices dynamically to your cost codes, catching cost variances and protecting your project margins.",
    statValue: "4.8%",
    statLabel: "Average savings on total budget",
    features: [
      { title: "Commit-to-Spend Linking", desc: "Tie invoices and purchases directly to budget codes to catch deviations and pricing differences early." },
      { title: "ERP & Accounting Integration", desc: "Sync invoice details, payroll logs, and change orders with QuickBooks Online, Sage 100/300 CRE, and Xero." },
      { title: "Change Order Approval Tiers", desc: "Configure threshold rules that route subcontractor change order requests to project managers or CFOs for digital signatures." }
    ],
    mockup: BudgetCostSimulator,
    quoteText: "The commitment tracker has been a game-changer. We flagged a major concrete subcontractor pricing variance before submitting our monthly draw request.",
    quoteAuthor: "Sarah Jenkins",
    quoteCompany: "Chief Financial Officer, Berkeley Group",
    faqs: [
      { q: "What accounting platforms do you integrate with?", a: "We support integrations with QuickBooks Online, Sage 100 CRE, Sage 300 CRE, Xero, and offer API access for custom internal billing databases." },
      { q: "How are field change orders processed?", a: "Superintendents request change orders via mobile. Rules route requests to estimators and PMs based on cost tier rules. Subcontractors sign electronically once approved." }
    ]
  },
  "documents": {
    title: "Document Management",
    tagline: "Cloud blueprint logs, drawing version overlays, and file organization.",
    intro: "Ensure field crews never work off outdated sheets. Concolabs indexes drawing log structures, hyper-links detail callouts, and compares revisions with color overlays, keeping your drawing sets accurate.",
    statValue: "60%",
    statLabel: "Less blueprint alignment overhead",
    features: [
      { title: "OCR Drawing Indexing", desc: "Upload a multi-page blueprint PDF, and our OCR engine auto-reads sheet labels, numbers, and title blocks." },
      { title: "Detail Callout Hyperlinking", desc: "Sheet detail tags and elevation marks are automatically linked for fast drawing navigation." },
      { title: "Visual Revision Comparison", desc: "Overlay drawing versions on screen, displaying differences in contrasting red/green outlines." }
    ],
    mockup: DocumentRevisionSimulator,
    quoteText: "With over 400 sheets on our building, version control was a constant challenge. Concolabs OCR made drawing log organization fast and simple.",
    quoteAuthor: "James Chen",
    quoteCompany: "Principal Architect, Vertex Design",
    faqs: [
      { q: "What drawing file types are supported?", a: "We support PDFs, DWG CAD sheets, Revit files, and standard document formats like Word, Excel, and image logs." },
      { q: "Is mobile markup support offline?", a: "Yes. Crew members can annotate drawings, draw markups, drop pins, and save files locally. Everything syncs once connected." }
    ]
  },
  "collaboration": {
    title: "Team Collaboration",
    tagline: "Direct office-to-field live messaging, photo markups, and handover reports.",
    intro: "Replace chaotic personal SMS threads and lost emails. Document site challenges directly context-linked to drawing points and daily logs, tagging estimators and architects to resolve roadblocks.",
    statValue: "2.5x",
    statLabel: "Faster on-site roadblock resolution",
    features: [
      { title: "Contextual Team Chat", desc: "Start direct chat logs inside individual RFI logs, submittal items, or drawing markers, keeping text history intact." },
      { title: "Photo Annotation Pins", desc: "Snap site issue photos, draw redline annotations, and drop markers on blueprints, triggering team alerts." },
      { title: "Automated Shift Handovers", desc: "Create night-to-day logs automatically, summarizing task status, crew counts, and roadblocks." }
    ],
    mockup: TeamChatSimulator,
    quoteText: "Aligning night and day shifts on civil bridge projects used to take hours of sync calls. Handover reports compile safety and project status automatically now.",
    quoteAuthor: "Maria Santos",
    quoteCompany: "VP Operations, Vertex Infrastructure",
    faqs: [
      { q: "Can collaboration tools be used offline?", a: "Yes. All comments, draft messages, and photo uploads queue up offline. The app uploads files and syncs threads when internet access is restored." },
      { q: "Can we control subcontractor notifications?", a: "Yes. You can customize notification preferences (SMS, push notifications, emails) for internal and external contractor groups." }
    ]
  },
  "analytics": {
    title: "Reporting & Analytics",
    tagline: "Automated compliance logs, progress tracking, and client executive dashboards.",
    intro: "Establish ultimate visibility across your construction operations. Aggregate daily log summaries, invoice tracking, and schedule metrics into live dashboard reports.",
    statValue: "100%",
    statLabel: "Real-time project cost visibility",
    features: [
      { title: "Dashboard KPI Builder", desc: "Design custom panels showing safety pass rates, milestone progression, and budget performance." },
      { title: "Automated Report Scheduler", desc: "Deliver weekly summaries and project financial statistics automatically to stakeholders." },
      { title: "Historical Cost Trends", desc: "Analyze historical sub-contractor performance and waste tracking to draft future bids." }
    ],
    mockup: ReportingAnalyticsSimulator,
    quoteText: "We present cost summaries and milestone charts to our lenders monthly. The clean reports built massive confidence, speeding up draw clearances.",
    quoteAuthor: "Robert Vance",
    quoteCompany: "Managing Director, Novus Developers",
    faqs: [
      { q: "Can we schedule automated reports?", a: "Yes. You can configure reports to run weekly or monthly and auto-email summary PDFs to partners." },
      { q: "Where does reporting data come from?", a: "Data compiles directly from live mobile diaries, invoice logs, schedule updates, and submittals inside the platform." }
    ]
  }
}

interface ProductDetailProps {
  slug: string
}

export function ProductDetail({ slug }: ProductDetailProps) {
  const product = productDetailMap[slug]
  const [backHref, setBackHref] = useState("/solutions")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("active_persona")
      if (stored) {
        setBackHref(`/solutions/${stored}`)
      }
    }
  }, [])

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-zinc-500 mb-8">The requested product page does not exist.</p>
        <Button asChild>
          <Link href={backHref}>Back to Solutions</Link>
        </Button>
      </div>
    )
  }

  const Simulator = product.mockup

  return (
    <div className="pt-24 bg-background">
      {/* Back button header */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Link 
          href={backHref} 
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Solutions Suite</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="bg-[#F4F2F0] dark:bg-zinc-950 py-20 px-6 relative overflow-hidden">
        {/* Subtle Background Radial Gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-zinc-900/5 dark:bg-zinc-50/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero left: Title & Intro */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
              {product.title}
            </h1>
            <p className="text-lg text-zinc-500 leading-normal">
              <span className="text-lime font-bold">{product.tagline}</span>
            </p>
            <p className="text-zinc-650 dark:text-zinc-400 leading-relaxed text-sm sm:text-base">
              {product.intro}
            </p>
            <div className="pt-4 flex gap-4">
              <Button asChild size="lg" className="rounded-xl px-6 font-bold bg-primary text-black hover:bg-primary/90">
                <Link href="/demo">Request a Demo</Link>
              </Button>
            </div>
          </div>

          {/* Hero right: Key Metric Card */}
          <div className="lg:col-span-5">
            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono text-[9px] font-bold tracking-widest uppercase">
                Gains Highlight
              </div>
              <div className="mb-6">
                <div className="text-5xl font-serif font-black text-zinc-950 dark:text-zinc-50 tracking-tight">
                  {product.statValue}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mt-1">
                  {product.statLabel}
                </div>
              </div>
              <div className="h-[1px] w-full bg-zinc-100 dark:bg-zinc-800 mb-6" />
              <blockquote className="text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm italic leading-relaxed mb-6 font-medium">
                &ldquo;{product.quoteText}&rdquo;
              </blockquote>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                  {product.quoteAuthor[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">{product.quoteAuthor}</h4>
                  <p className="text-[9px] text-zinc-400 font-semibold">{product.quoteCompany}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator Section */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side: Text Details */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-zinc-50 mb-2">How it works on site</h2>
              <p className="text-sm text-zinc-500">Explore the interactive preview tool on the right to see the feature in action.</p>
            </div>
            
            <div className="space-y-6">
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mb-1">{feat.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Interactive Simulator Panel */}
          <div className="lg:col-span-6">
            <Simulator />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Product FAQs</h2>
            <p className="text-zinc-500 text-sm">Common questions regarding Concolabs {product.title}</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xs">
            <Accordion type="single" collapsible className="w-full">
              {product.faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-zinc-100 dark:border-zinc-800 py-2">
                  <AccordionTrigger className="text-sm font-bold text-zinc-850 dark:text-zinc-150 hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-zinc-500 leading-relaxed pt-1">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Bar CTA */}
      <div className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 py-10 px-6 border-t border-zinc-800 dark:border-zinc-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold">Unify your construction workforce with Concolabs {product.title}</h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">Get custom estimator pricing guides and pilot timelines.</p>
          </div>
          <div className="flex gap-4">
            <Button asChild size="lg" className="rounded-xl font-bold bg-primary text-black hover:bg-primary/90">
              <Link href="/demo">Book a Live Demo</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl font-bold border-zinc-800 text-zinc-300 dark:border-zinc-300 dark:text-zinc-700 bg-transparent hover:bg-zinc-900 dark:hover:bg-zinc-100">
              <Link href={backHref}>View Other Solutions</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
