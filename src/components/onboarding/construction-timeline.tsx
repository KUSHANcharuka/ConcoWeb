"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  FileText,
  HardHat,
  Package,
  Plus,
  Search,
  ShieldAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";

type DashboardTheme = "light" | "dark";

type ConstructionTimelineProps = {
  theme: DashboardTheme;
  onAction: (label: string) => void;
};

// Main category tabs for Construction Timeline dashboard
const categoryTabs = [
  { label: "Progress Dynamics", icon: Search },
  { label: "Site Visits", icon: CalendarDays },
  { label: "Materials", icon: Package },
];

const bottomTimelineMonths = [
  { label: "Jan", year: "2026", icon: CalendarDays },
  { label: "Feb", icon: Package, badge: "6" },
  { label: "Mar", icon: CheckCircle2 },
  { label: "Apr", icon: FileText },
  { label: "May", icon: Package, badge: "2" },
  { label: "Jun", icon: CheckCircle2, badge: "3" },
  { label: "Jul", icon: FileText },
  { label: "Aug", icon: Package, badge: "6" },
  { label: "Sep", icon: CheckCircle2, badge: "2" },
];

// SVG building skeleton map for active zones/incidents
function SiteMapSilhouette({ theme }: { theme: DashboardTheme }) {
  const isDark = theme === "dark";
  return (
    <svg className="w-16 h-28" viewBox="0 0 100 200" fill="none">
      {/* Building shape silhouette */}
      <rect x="20" y="20" width="60" height="160" rx="4" fill={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"} stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"} strokeWidth="2" />
      {/* Floor lines */}
      <line x1="20" y1="52" x2="80" y2="52" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"} strokeWidth="2" />
      <line x1="20" y1="84" x2="80" y2="84" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"} strokeWidth="2" />
      <line x1="20" y1="116" x2="80" y2="116" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"} strokeWidth="2" />
      <line x1="20" y1="148" x2="80" y2="148" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"} strokeWidth="2" />
      {/* active check and alert indicators */}
      <circle cx="50" cy="52" r="5" fill="#f8e71c" className="animate-pulse" /> {/* L04 Slab active */}
      <circle cx="50" cy="116" r="4.5" fill="#ff6b6b" /> {/* Foundation alert */}
      <circle cx="50" cy="116" r="4" fill="#ff6b6b" className="animate-ping" />
    </svg>
  );
}

export default function ConstructionTimeline({ theme, onAction }: ConstructionTimelineProps) {
  const isDark = theme === "dark";
  const reduceMotion = useReducedMotion();
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<null | { x: number; y: number; panX: number; panY: number }>(null);
  const [activeTab, setActiveTab] = useState("Progress Dynamics");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRequestChangeModal, setShowRequestChangeModal] = useState(false);

  function matchesFilter(cardType: "materials" | "pour" | "safety" | "rfi" | "payments" | "proposals", textToSearch: string) {
    if (searchQuery.trim() !== "") {
      return textToSearch.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (activeTab === "Materials") {
      return cardType === "materials" || cardType === "payments" || cardType === "proposals";
    }
    if (activeTab === "Site Visits") {
      return cardType === "pour" || cardType === "rfi";
    }
    return true;
  }

  function startDrag(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragStart({ x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y });
  }

  function moveDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragStart) return;
    setPan({
      x: dragStart.panX + event.clientX - dragStart.x,
      y: dragStart.panY + event.clientY - dragStart.y,
    });
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragStart(null);
  }

  return (
    <section className={cn("flex min-h-0 flex-1 flex-col p-4 transition-colors sm:p-6 xl:p-8", isDark ? "bg-black/80" : "bg-gray-light/70")}>
      <div className={cn("relative min-h-[760px] flex-1 overflow-hidden rounded-[2rem] shadow-2xl transition-colors flex flex-col p-6", isDark ? "bg-[#121212] border border-white/10 shadow-black/40 text-white" : "bg-white border border-black/10 shadow-black/5 text-black")}>
        
        {/* Construction Site Info & Vitals Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10 z-20">
          <div className="flex items-center gap-6">
            {/* Timeline label bubble */}
            <div className={cn("rounded-3xl px-6 py-4 flex items-center justify-center font-bold text-2xl shadow-sm", isDark ? "bg-white/10 text-white" : "bg-black/5 text-black")}>
              Timeline
            </div>
          </div>

          {/* Site Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 flex-1 max-w-3xl">
            {[
              { label: "Project Stage", val: "Superstructure", color: "text-inherit" },
              { label: "Crew Strength", val: "126 Workers", color: "text-inherit" },
              { label: "Active RFIs", val: "8 Open", color: "text-inherit" },
              { label: "Inspections", val: "14 Passed", color: "text-inherit" },
              { label: "Safety Status", val: "0 Incidents", color: "text-inherit" },
            ].map((v) => (
              <div key={v.label} className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-medium">{v.label}</span>
                <span className={cn("text-base font-extrabold mt-1", v.color)}>{v.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Categories & Filter Tabs Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-white/5 z-20">
          <div className="flex flex-wrap gap-2">
            {categoryTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.label;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.label);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all",
                    isActive
                      ? isDark
                        ? "bg-white text-black font-bold"
                        : "bg-black text-white font-bold"
                      : isDark
                        ? "bg-white/5 text-white/70 hover:bg-white/10"
                        : "bg-black/5 text-black/75 hover:bg-black/10",
                  )}
                >
                  <TabIcon className="size-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Workable search component */}
          <div className="flex flex-wrap items-center gap-2 flex-1 justify-end min-w-[280px]">
            <div className="relative w-full max-w-xs">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-medium">
                <Search className="size-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveTab("Progress Dynamics");
                }}
                className={cn(
                  "w-full rounded-full border py-2 pl-10 pr-4 text-xs font-semibold outline-none transition focus:border-lemon-yellow",
                  isDark ? "border-white/10 bg-[#1c1c1e] text-white" : "border-black/10 bg-black/5 text-black",
                )}
                placeholder="Search materials, stages..."
              />
            </div>
          </div>
        </div>

        {/* Scrollable Timeline Container */}
        <div className="flex-1 min-h-[380px] relative overflow-hidden mt-4">
          <motion.div
            className={cn(
              "relative z-10 h-full min-h-[380px] w-[1380px] origin-center select-none",
              dragStart ? "cursor-grabbing" : "cursor-grab",
            )}
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`, transformOrigin: "center" }}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: reduceMotion ? 0 : 0.12, delayChildren: reduceMotion ? 0 : 0.1 } } }}
          >
            {/* Timeline connectors and line mapping */}
            <svg className="absolute left-0 top-[32px] h-[340px] w-full" viewBox="0 0 1380 340" fill="none" aria-hidden="true">
              <path d="M0 0H1200" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} strokeWidth="3" />
              
              {/* Vertical connector guide lines */}
              <path d="M120 0V340" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="2" />
              <path d="M480 0V340" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="2" />
              <path d="M840 0V340" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="2" />

              {/* Connector lines to cards */}
              <path d="M120 0H200C220 0 225 24 225 48V100" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"} strokeWidth="2" />
              
              <path d="M480 0H560C596 0 602 24 602 48V200C602 220 628 240 670 240H744" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"} strokeWidth="2" />
              <path d="M562 100H646C677 100 686 112 686 130V140C686 155 710 162 738 162H790" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"} strokeWidth="2" />
              
              <path d="M840 0H920C940 0 945 24 945 48V100" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"} strokeWidth="2" />
              <path d="M840 0H920C956 0 962 24 962 48V200C962 220 988 240 1030 240H1104" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"} strokeWidth="2" />
            </svg>

            {/* Start Point Milestone Node */}
            <div className="absolute left-[40px] top-[4px] z-20 flex flex-col items-center">
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => onAction("Overview")}
                className="flex size-14 items-center justify-center rounded-full bg-lemon-yellow text-black shadow-lg shadow-lemon-yellow/30"
              >
                <CalendarDays className="size-5" />
              </button>
              <div className="text-center mt-3 max-w-[160px]">
                <p className="text-xs font-extrabold leading-tight">Start Point</p>
                <p className="text-[9px] text-gray-medium uppercase tracking-wider font-extrabold mt-0.5">June 15, 2026 - 10:00 AM</p>
              </div>
            </div>

            {/* Requirement Gathering Milestone Node */}
            <div className="absolute left-[400px] top-[4px] z-20 flex flex-col items-center">
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => onAction("Messages")}
                className="flex size-14 items-center justify-center rounded-full bg-lemon-yellow text-black shadow-lg shadow-lemon-yellow/30"
              >
                <CalendarDays className="size-5" />
              </button>
              <div className="text-center mt-3 max-w-[160px]">
                <p className="text-xs font-extrabold leading-tight">Requirement Gathering</p>
                <p className="text-[9px] text-gray-medium uppercase tracking-wider font-extrabold mt-0.5">Initial Phase</p>
              </div>
            </div>

            {/* Advance Payment Milestone Node */}
            <div className="absolute left-[760px] top-[4px] z-20 flex flex-col items-center">
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => onAction("Payments")}
                className="flex size-14 items-center justify-center rounded-full bg-lemon-yellow text-black shadow-lg shadow-lemon-yellow/30 animate-pulse"
              >
                <CreditCard className="size-5" />
              </button>
              <div className="text-center mt-3 max-w-[160px]">
                <p className="text-xs font-extrabold leading-tight">Adcance Payment</p>
                <p className="text-[9px] text-gray-medium uppercase tracking-wider font-extrabold mt-0.5">Financing</p>
              </div>
            </div>

            {/* Plus Card Request a Change button node */}
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => setShowRequestChangeModal(true)}
              className="absolute left-[1120px] top-[4px] flex size-14 items-center justify-center rounded-full bg-[#1c1c1e] text-white hover:bg-[#2c2c2e] border border-white/10 shadow-lg"
            >
              <Plus className="size-6" />
            </button>

            {/* Timeline Lanes slider arrow selectors */}
            {[{ left: 120, top: 160 }, { left: 480, top: 160 }, { left: 840, top: 160 }].map((item, index) => (
              <button
                key={`${item.left}-${item.top}`}
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => setPan((value) => ({ ...value, y: value.y + (index % 2 === 0 ? -40 : 40) }))}
                className={cn("absolute flex h-16 w-10 flex-col items-center justify-center gap-1 rounded-2xl shadow-md transition-colors", isDark ? "bg-[#1c1c1e] border border-white/10 text-white" : "bg-white border border-black/10 text-black")}
                style={{ left: item.left - 20, top: item.top }}
              >
                <ChevronDown className="size-4 rotate-180" />
                <ChevronDown className="size-4" />
              </button>
            ))}

            {/* DATA CARDS */}

            {/* Card 1: Project Start -> Site Mobilization */}
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => onAction("Overview")}
              className={cn("absolute left-[120px] top-[120px] flex h-[62px] w-[210px] items-center rounded-full border py-2 pl-12 pr-6 shadow-md transition-all duration-300 text-left hover:border-lemon-yellow hover:scale-105", isDark ? "bg-[#1a1a1c] border-white/10 text-white" : "bg-white border-black/10 text-black", matchesFilter("materials", "Site Mobilization") ? "opacity-100 scale-100" : "opacity-10 scale-95 pointer-events-none")}
            >
              <div className="absolute -left-5 flex size-12 items-center justify-center rounded-full bg-lemon-yellow text-black shadow-md">
                <HardHat className="size-5" />
              </div>
              <span className="text-xs font-bold">Site Mobilization</span>
              <span className="ml-auto text-xs text-green-500 font-extrabold">Done</span>
            </button>

            {/* Card 2: Requirement Gathering -> Initial Meeting */}
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => onAction("Messages")}
              className={cn("absolute left-[480px] top-[120px] flex h-[62px] w-[210px] items-center rounded-full border py-2 pl-12 pr-6 shadow-md transition-all duration-300 text-left hover:border-lemon-yellow hover:scale-105", isDark ? "bg-[#1a1a1c] border-white/10 text-white" : "bg-white border-black/10 text-black", matchesFilter("materials", "Initial Meeting") ? "opacity-100 scale-100" : "opacity-10 scale-95 pointer-events-none")}
            >
              <div className="absolute -left-5 flex size-12 items-center justify-center rounded-full bg-lemon-yellow text-black shadow-md">
                <Building2 className="size-5" />
              </div>
              <span className="text-xs font-bold">Initial Meeting</span>
              <span className="ml-auto text-xs text-green-500 font-extrabold">Done</span>
            </button>

            {/* Card 3: Site Survey */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
              onClick={() => onAction("Overview")}
              className={cn("absolute left-[670px] top-[60px] w-[310px] rounded-[2.5rem] border p-5 shadow-xl transition-all duration-300 cursor-pointer hover:border-lemon-yellow", isDark ? "bg-[#1c1c1e] border-white/10 text-white" : "bg-white border-black/10 text-black", matchesFilter("pour", "Site Survey") ? "opacity-100 scale-100" : "opacity-10 scale-95 pointer-events-none")}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold">Site Survey</h3>
                <span className="text-[10px] text-gray-medium font-bold">Assessing</span>
              </div>
              <div className="relative h-20 overflow-hidden mb-3">
                <div className="absolute inset-x-0 bottom-6 h-6 bg-lemon-yellow/10" />
                <svg viewBox="0 0 280 70" className="absolute inset-0 h-full w-full">
                  <path d="M0 60 C40 30 80 50 120 20 C160 10 200 40 240 30 C260 25 270 35 280 32" fill="none" stroke="#f8e71c" strokeWidth="6" opacity="0.8" />
                  <path d="M0 60 C40 30 80 50 120 20 C160 10 200 40 240 30 C260 25 270 35 280 32" fill="none" stroke={isDark ? "#ffffff" : "#000000"} strokeWidth="2" />
                </svg>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-black px-3 py-1 text-xs font-extrabold text-white">
                  95%
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2 text-xs text-gray-medium">
                <span>Completed: <strong>14 / 15 steps</strong></span>
                <span className="font-extrabold text-green-500">+1</span>
              </div>
            </motion.div>

            {/* Card 4: Site Survey (Audit Map) */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
              onClick={() => onAction("Files")}
              className={cn("absolute left-[670px] top-[265px] w-[310px] rounded-[2.5rem] border p-5 shadow-xl transition-all duration-300 flex justify-between items-center cursor-pointer hover:border-lemon-yellow", isDark ? "bg-[#1c1c1e] border-white/10 text-white" : "bg-white border-black/10 text-black", matchesFilter("safety", "Site Survey Map") ? "opacity-100 scale-100" : "opacity-10 scale-95 pointer-events-none")}
            >
              <div>
                <h3 className="text-sm font-bold">Soil Assessment</h3>
                <div className="mt-3 rounded-full bg-black/5 dark:bg-white/5 px-3 py-1 text-xs font-semibold max-w-fit">
                  Structure Safe
                </div>
              </div>
              <SiteMapSilhouette theme={theme} />
            </motion.div>

            {/* Card 5: Proposal -> Draft Proposal */}
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => onAction("Proposals")}
              className={cn("absolute left-[920px] top-[120px] flex h-[62px] w-[210px] items-center rounded-full border py-2 pl-12 pr-6 shadow-md transition-all duration-300 text-left hover:border-lemon-yellow hover:scale-105", isDark ? "bg-[#1a1a1c] border-white/10 text-white" : "bg-white border-black/10 text-black", matchesFilter("proposals", "Draft Proposal") ? "opacity-100 scale-100" : "opacity-10 scale-95 pointer-events-none")}
            >
              <div className="absolute -left-5 flex size-12 items-center justify-center rounded-full bg-lemon-yellow text-black shadow-md">
                <FileText className="size-5" />
              </div>
              <span className="text-xs font-bold">Draft Proposal</span>
              <span className="ml-auto text-xs text-lemon-yellow font-extrabold">v2.1</span>
            </button>

            {/* Card 6: Adcance Payment -> Payment Portal */}
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => onAction("Payments")}
              className={cn("absolute left-[1100px] top-[265px] flex h-[62px] w-[210px] items-center rounded-full border py-2 pl-12 pr-6 shadow-md transition-all duration-300 text-left hover:border-lemon-yellow hover:scale-105", isDark ? "bg-[#1a1a1c] border-white/10 text-white" : "bg-white border-black/10 text-black", matchesFilter("payments", "Payment Portal") ? "opacity-100 scale-100" : "opacity-10 scale-95 pointer-events-none")}
            >
              <div className="absolute -left-5 flex size-12 items-center justify-center rounded-full bg-lemon-yellow text-black shadow-md">
                <CreditCard className="size-5" />
              </div>
              <span className="text-xs font-bold">Payment Portal</span>
            </button>

          </motion.div>
        </div>

        {/* Bottom Horizontal Calendar Timeline bar */}
        <div className={cn("absolute inset-x-6 bottom-5 z-[120] flex h-[62px] items-center overflow-hidden rounded-full border px-5 shadow-2xl backdrop-blur-xl transition-colors", isDark ? "border-white/10 bg-black/80" : "border-white/60 bg-white/82")}>
          <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-full text-white transition-colors", isDark ? "bg-[#27272a]" : "bg-[#202624]")}>
            <CalendarDays className="size-5" />
          </div>
          <div className="ml-4 flex min-w-0 flex-1 items-center gap-2 overflow-x-auto scrollbar-none">
            {bottomTimelineMonths.map(({ label, year, icon: Icon, badge }, index) => (
              <button
                key={label}
                type="button"
                onClick={() => onAction(`${label} timeline`)}
                className={cn(
                  "relative flex min-w-[92px] items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition hover:bg-lemon-yellow hover:text-black",
                  index >= 7 ? "bg-[#202624] text-white" : isDark ? "text-white/60" : "text-[#6f6f69]",
                )}
              >
                <span className="text-left leading-none">
                  <span className="block">{label}</span>
                  {year && <span className="text-[10px] font-medium opacity-70">{year}</span>}
                </span>
                <Icon className="size-4" />
                {badge && <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-lemon-yellow text-[10px] font-bold text-black">{badge}</span>}
              </button>
            ))}
          </div>
          <div className={cn("ml-4 flex items-center gap-2 rounded-full px-3 py-2 text-white transition-colors", isDark ? "bg-[#27272a]" : "bg-[#202624]")}>
            <HardHat className="size-4 text-lemon-yellow animate-bounce" />
            <span className="text-xs font-semibold">Live Site Feed</span>
            <CheckCircle2 className="size-4 text-green-500" />
          </div>
        </div>
      </div>

      {/* Request a Change pop-up modal */}
      {showRequestChangeModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "w-full max-w-lg rounded-[2rem] border p-8 shadow-2xl transition-colors",
              isDark ? "bg-[#1c1c1e] border-white/10 text-white" : "bg-white border-black/10 text-black"
            )}
          >
            <h3 className="text-2xl font-extrabold mb-4">Request a Change</h3>
            <p className="text-xs text-gray-medium mb-6">
              Submit details for any modification requests regarding blueprint, timeline milestones, or budget adjustments.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-medium mb-1.5">
                  Change Request Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Upgrade structural beam reinforcement"
                  className={cn(
                    "w-full rounded-full border px-4 py-2.5 text-xs font-semibold outline-none focus:border-lemon-yellow",
                    isDark ? "border-white/10 bg-black/30 text-white" : "border-black/10 bg-black/5 text-black"
                  )}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-medium mb-1.5">
                  Category
                </label>
                <select
                  className={cn(
                    "w-full rounded-full border px-4 py-2.5 text-xs font-semibold outline-none focus:border-lemon-yellow",
                    isDark ? "border-white/10 bg-[#1c1c1e] text-white" : "border-black/10 bg-black/5 text-black"
                  )}
                >
                  <option>Structural Reinforcement</option>
                  <option>Material Grade Upgrade</option>
                  <option>MEP System Modification</option>
                  <option>Timeline Sprint Adjustment</option>
                  <option>Budget Re-allocation</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-medium mb-1.5">
                  Description of Request
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the adjustment requirements..."
                  className={cn(
                    "w-full rounded-[1.25rem] border px-4 py-3 text-xs font-semibold outline-none focus:border-lemon-yellow",
                    isDark ? "border-white/10 bg-black/30 text-white" : "border-black/10 bg-black/5 text-black"
                  )}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={() => setShowRequestChangeModal(false)}
                className={cn(
                  "flex-1 rounded-full py-3 text-xs font-bold transition",
                  isDark ? "bg-white/5 hover:bg-white/10 text-white" : "bg-black/5 hover:bg-black/10 text-black"
                )}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRequestChangeModal(false);
                  onAction("Change Requests");
                }}
                className="flex-1 rounded-full py-3 text-xs font-bold bg-lemon-yellow text-black hover:bg-lemon-yellow/80 transition"
              >
                Submit Request
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}