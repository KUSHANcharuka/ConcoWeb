"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer";
import {
  ArrowLeft,
  Play,
  Calendar,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  FileText,
  Calculator,
  BarChart3,
  Cpu,
  Upload,
  Wallet,
  TrendingUp,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CostPlanCalculatorPage() {

  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev === "before" ? "after" : "before"));
    }, 3500);
    return () => clearInterval(timer);
  }, [autoToggleKey]);

  const handleTabClick = (tab: "before" | "after") => {
    setActiveTab(tab);
    setAutoToggleKey((k) => k + 1);
  };

  const scrollToVideo = useCallback(() => {
    videoSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-lime/30 selection:text-black">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#FAFAF8]"
      >
        {/* Background lime/yellow fade */}
        <div className="absolute inset-0 z-0">
          {/* Lime/yellow radial gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(202,236,69,0.15),rgba(250,250,248,0.95))]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-to-br from-[var(--color-lime)]/10 via-transparent to-emerald-400/5 rounded-full blur-3xl" />

          <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAF8]/60 via-transparent to-[#FAFAF8]/80" />
        </div>

        {/* Hero Content */}
        <div className="relative w-full z-10">
          <motion.div
            className="max-w-6xl mx-auto px-6 pt-28"
          >
            <Link
              href="/learnmore"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Learn More
            </Link>
          </motion.div>

          <motion.div
            className="px-6 pt-10 pb-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Left Column - Text Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-lime)]/15 border border-[var(--color-lime)]/30 text-zinc-700">
                  Pre-design
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 border border-zinc-200 text-zinc-500">
                  QS Firms &amp; Cost Consultancies
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-tight">
                Cost Plan Calculator<br />
                <span className="text-black-600">+ Financial Management</span>
              </h1>

              <p className="text-xl sm:text-2xl text-zinc-600 font-medium leading-normal">
                GFA to budget in minutes. Not days.
              </p>

              <p className="text-base sm:text-lg text-zinc-500 leading-relaxed max-w-xl">
                Upload a concept drawing. Get the Gross Floor Area, project cost, and consultancy fee automatically — with a financial planning module built in.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  onClick={scrollToVideo}
                  size="lg"
                  className="rounded-xl px-6 py-6 font-bold shadow-lg cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl px-6 py-6 font-bold shadow-md cursor-pointer bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50"
                >
                  <a
                    href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book a demo →
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Column - Before/After Widget */}
            <motion.div
              className="lg:col-span-5"
            >
              <div className="relative bg-white backdrop-blur-xl border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-zinc-200/50">
                <div className="flex items-center justify-between mb-6 border-b border-zinc-100 pb-4">
                  <h3 className="font-bold text-base tracking-tight text-zinc-900">
                    Compare Workflows
                  </h3>
                  <div className="relative flex bg-zinc-100 p-1 rounded-xl w-48 justify-between">
                    <button
                      onClick={() => handleTabClick("before")}
                      className={`relative z-10 w-24 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${activeTab === "before"
                          ? "text-zinc-900"
                          : "text-zinc-400"
                        }`}
                    >
                      Before
                    </button>
                    <button
                      onClick={() => handleTabClick("after")}
                      className={`relative z-10 w-24 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${activeTab === "after"
                          ? "text-zinc-900"
                          : "text-zinc-400"
                        }`}
                    >
                      After
                    </button>
                    <motion.div
                      layoutId="toggle-pill"
                      className="absolute top-1 bottom-1 bg-white shadow-sm border border-zinc-200/50 rounded-lg"
                      animate={{
                        left: activeTab === "before" ? 4 : 92,
                        width: 92,
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  </div>
                </div>

                <div className="min-h-[220px] flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {activeTab === "before" ? (
                      <motion.div
                        key="before"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="text-xs font-bold text-red-500 uppercase tracking-wider">
                          Manual Cost Planning
                        </div>
                        <ul className="space-y-3.5">
                          <li className="flex gap-3 text-zinc-600 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>QS calculates GFA by hand from a PDF concept drawing.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>Plugs numbers into Excel with manual formulas.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>Cost plan takes 1-2 days to produce.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>No integrated project tracking.</span>
                          </li>
                        </ul>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="after"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                          Cost Plan Calculator
                        </div>
                        <ul className="space-y-3.5">
                          <li className="flex gap-3 text-zinc-600 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Upload concept drawing — GFA generated in minutes.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Cost estimate &amp; consultancy fee computed automatically.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Financial planning module tracks your own project pipeline.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Outputs ready for client presentation.</span>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>


      </section>

      {/* ─── Video Showcase Section ─── */}
      <section ref={videoSectionRef} className="py-24 px-6 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
              See It In Action
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
              Cost Plan Calculator Demo
            </h2>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto">
              Watch how a concept drawing becomes a complete cost plan in minutes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-zinc-300/40">
              <video
                src="/videos/cost-plan-calculator-showcase.mp4"
                className="w-full h-auto object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Problem Section ─── */}
      <section className="bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
              The Friction
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              The cost planning bottleneck
            </h2>
            <div className="w-16 h-1 bg-[var(--color-lime)] rounded-full" />
          </div>
          <div className="lg:col-span-7 text-zinc-650 dark:text-zinc-450 text-base sm:text-lg leading-relaxed space-y-6">
            <p>QS firms are still calculating Gross Floor Area by hand from PDF concept drawings and plugging numbers into Excel to produce a cost plan at the feasibility stage.</p>
            <p>This is the moment when speed matters most — the client is waiting for budget validation before committing to design. But the process takes 1-2 days and relies on manual Excel formulas that differ from firm to firm.</p>
            <p>Cost Plan Calculator automates this, turning the cost planning step from a bottleneck into a two-minute output that is ready to present.</p>
          </div>
        </div>
      </section>

      {/* ─── How it Works Section ─── */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Full-section background video */}
        <div className="absolute inset-0 z-0">
          <video
            src="/videos/cost-plan-calculator-bg.mp4"
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Semi-transparent overlay for readability */}
          <div className="absolute inset-0 bg-[#FAFAF8]/70 dark:bg-black/60" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-6 space-y-8"
          >
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">How it works</h2>
            </div>
            <div className="space-y-6">
              <p className="text-zinc-650 dark:text-zinc-400">
                Upload a concept drawing (PDF, image, or Revit file) and the tool:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <li className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-400 font-semibold items-start">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                  <span>Identifies the building footprint and storeys</span>
                </li>
                <li className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-400 font-semibold items-start">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                  <span>Calculates Gross Floor Area automatically</span>
                </li>
                <li className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-400 font-semibold items-start">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                  <span>Applies benchmarked rates per building type</span>
                </li>
                <li className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-400 font-semibold items-start">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                  <span>Produces initial project cost estimate</span>
                </li>
                <li className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-400 font-semibold items-start">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                  <span>Calculates consultancy fee (configurable %)</span>
                </li>
                <li className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-400 font-semibold items-start">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                  <span>Generates a formatted cost plan PDF</span>
                </li>
              </ul>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 italic pt-4">
                Technology: AI vision engine trained on thousands of construction drawings. Rate benchmarks cover 50+ building types across UAE, UK, Australia, and Sri Lanka.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Financial Planning Module */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
            className="lg:col-span-6 relative"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/5">
                {/* Content overlay */}
                <div className="relative p-6 sm:p-8 space-y-6">
                  <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Integrated financial planning module:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl space-y-2 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <BarChart3 className="w-5 h-5 text-primary" />
                      <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Project Dashboard</h5>
                      <p className="text-xs text-zinc-500 leading-normal">Track your firm&apos;s projects in one dashboard.</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl space-y-2 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <Wallet className="w-5 h-5 text-primary" />
                      <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Budget Monitoring</h5>
                      <p className="text-xs text-zinc-500 leading-normal">Monitor budgets across clients and engagements.</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl space-y-2 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Revenue Forecasting</h5>
                      <p className="text-xs text-zinc-500 leading-normal">Forecast revenue from cost planning work.</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl space-y-2 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <Download className="w-5 h-5 text-primary" />
                      <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Export Reports</h5>
                      <p className="text-xs text-zinc-500 leading-normal">Export reports for internal reporting and ERP.</p>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="mt-3 flex items-center justify-between px-1">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
                  Product in Action
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  Upload → GFA → Cost Plan
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Workflow / Integration Section ─── */}
      <section className="bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Animated Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
              Workflow Hook
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Fits into your workflow
            </h2>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto">
              From concept drawing to cost plan in four automated steps
            </p>
          </motion.div>

          {/* What feeds in / feeds out */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pb-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3 hover:shadow-md transition-shadow duration-300"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">What feeds in</span>
              <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Concept drawing</h4>
              <p className="text-sm text-zinc-500">Accepts PDF concept drawings, PNG/JPG images, Revit RVT files, and DWG drawings up to 50MB.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3 hover:shadow-md transition-shadow duration-300"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">What it feeds into</span>
              <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Design Brief + Revit to BOQ</h4>
              <p className="text-sm text-zinc-500">The cost plan constrains the estimating process. Design brief locked to budget, and Revit to BOQ plugin uses the cost plan as validation baseline.</p>
            </motion.div>
          </div>

          {/* 4-Step Interactive Workflow Cards */}
          {(() => {
            const workflowSteps = [
              {
                number: 1,
                title: "Concept Drawing",
                subtitle: "File Upload",
                description: "Upload a concept drawing in PDF, image, or Revit format.",
                icon: Upload,
                detail: "Drag and drop your concept drawing. Supports PDF, PNG/JPG, RVT, and DWG formats up to 50MB per file.",
              },
              {
                number: 2,
                title: "AI Analysis",
                subtitle: "GFA Calculation",
                description: "AI vision identifies building footprint, storeys, and structural elements.",
                icon: Cpu,
                detail: "Computer vision trained on thousands of construction drawings identifies the building footprint, storey count, structural grid, and circulation cores automatically.",
              },
              {
                number: 3,
                title: "Rate Application",
                subtitle: "Cost Estimation",
                description: "Benchmarked rates applied per building type and region.",
                icon: Calculator,
                detail: "Proprietary rate mapping algorithms apply benchmarked construction rates per building type and region. Custom rates configurable per client or project.",
              },
              {
                number: 4,
                title: "Cost Plan Output",
                subtitle: "PDF Generation",
                description: "Formatted cost plan PDF ready for client presentation.",
                icon: FileText,
                detail: "Download a professional cost plan PDF with all assumptions documented. Also available in XLSX and JSON formats for ERP import.",
              },
            ];

            return (
              <>
                {/* Workflow flow diagram */}
                <div className="relative max-w-5xl mx-auto">
                  {/* Connecting line */}
                  <div className="absolute top-12 left-[10%] right-[10%] h-0.5 bg-zinc-200 dark:bg-zinc-800 hidden md:block" />

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {workflowSteps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.4, delay: i * 0.12 }}
                        className="relative text-center space-y-3"
                      >
                        <div className={`relative z-10 w-24 h-24 mx-auto rounded-2xl flex items-center justify-center shadow-sm ${i === 0 ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" :
                            i === 1 ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" :
                              i === 2 ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" :
                                "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                          }`}>
                          <step.icon className="w-10 h-10" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Step {step.number}</span>
                          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{step.title}</h4>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">{step.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Full workflow text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-center pt-8"
                >
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">Workflow:</span> Concept drawing → Cost Plan Calculator → Cost plan + budget → Design brief locked to budget → Revit to BOQ plugin uses cost plan as validation baseline
                  </p>
                </motion.div>
              </>
            );
          })()}
        </div>
      </section>

      {/* ─── Pricing & Quick Facts Section ─── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-16">
            <div className="space-y-6">
              <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">Deployment</span>
              <h2 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">Pricing &amp; Availability</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-xs">
                  <span className="text-xs text-zinc-450 font-bold uppercase tracking-widest">One-Off Implementation</span>
                  <p className="text-3xl font-black tracking-tight">$3,500</p>
                  <p className="text-xs text-zinc-500">Includes setup, custom rate integration, and team training.</p>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-xs">
                  <span className="text-xs text-zinc-450 font-bold uppercase tracking-widest">Annual Support</span>
                  <p className="text-3xl font-black tracking-tight">$300<span className="text-sm font-normal text-zinc-450">/year</span></p>
                  <p className="text-xs text-zinc-500">Covers quarterly rate updates and priority support.</p>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-xs">
                  <span className="text-xs text-zinc-450 font-bold uppercase tracking-widest">Enterprise</span>
                  <p className="text-3xl font-black tracking-tight">Custom</p>
                  <p className="text-xs text-zinc-500">Multi-user licensing and custom database integrations.</p>
                </div>
              </div>
            </div>

            {/* Related Products */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-zinc-200 to-transparent dark:from-zinc-800" />
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Related Products in this suite</span>
                <div className="h-px flex-1 bg-gradient-to-l from-zinc-200 to-transparent dark:from-zinc-800" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  <Link
                    href="/learnmore/planning-law-chatbot"
                    className="group block p-5 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
                          Planning Law Chatbot
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          Instant planning regulations at your fingertips. Parallel stage product.
                        </p>
                      </div>
                      <span className="shrink-0 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Parallel
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[10px] font-semibold text-primary">Learn more</span>
                      <ChevronRight className="w-3 h-3 text-primary transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 0 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  <Link
                    href="/learnmore/revit-to-boq"
                    className="group block p-5 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
                          Revit to BOQ
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          Automated BOQ generation from Revit models with AI-powered rate prediction.
                        </p>
                      </div>
                      <span className="shrink-0 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Next stage
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[10px] font-semibold text-primary">Learn more</span>
                      <ChevronRight className="w-3 h-3 text-primary transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  <Link
                    href="/learnmore/measureonair"
                    className="group block p-5 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
                          MeasureonAir
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          Site measurement to payment certificate, fully digital and automated.
                        </p>
                      </div>
                      <span className="shrink-0 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Construction
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[10px] font-semibold text-primary">Learn more</span>
                      <ChevronRight className="w-3 h-3 text-primary transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="text-center"
              >
                <Link
                  href="/learnmore"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors group"
                >
                  View full product suite
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Quick Facts Sidebar */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-3">Quick Facts</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 gap-4">
                  <span className="text-zinc-500 font-semibold shrink-0">Stage</span>
                  <span className="font-bold text-zinc-850 dark:text-zinc-200 text-right">Pre-design</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 gap-4">
                  <span className="text-zinc-500 font-semibold shrink-0">Best For</span>
                  <span className="font-bold text-zinc-850 dark:text-zinc-200 text-right">QS Firms, Cost Consultancies, Developers</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 gap-4">
                  <span className="text-zinc-500 font-semibold shrink-0">Target Regions</span>
                  <span className="font-bold text-zinc-850 dark:text-zinc-200 text-right">UAE, UK, Australia, Sri Lanka</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 gap-4">
                  <span className="text-zinc-500 font-semibold shrink-0">Time to Implement</span>
                  <span className="font-bold text-zinc-850 dark:text-zinc-200 text-right">3-5 Days</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 gap-4">
                  <span className="text-zinc-500 font-semibold shrink-0">Pricing</span>
                  <span className="font-bold text-zinc-850 dark:text-zinc-200 text-right">$3,500 + $300/yr</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  asChild
                  className="w-full rounded-xl py-6 font-bold shadow-md bg-primary text-black hover:bg-primary/90 cursor-pointer"
                >
                  <Link href="/pricing">
                    Buy Products →
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Comparison Section ─── */}
      <section className="bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
              Comparative Advantage
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Why choose Cost Plan Calculator
            </h2>
          </div>

          <div className="relative pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              {/* Manual */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-col justify-between shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Manual Method (Excel)</h4>
                  <div className="h-0.5 bg-zinc-200 dark:bg-zinc-800 w-full" />
                  <ul className="space-y-3 pt-2 text-sm text-zinc-650 dark:text-zinc-400">
                    <li className="flex gap-3 items-start">
                      <X className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                      1-2 days per cost plan
                    </li>
                    <li className="flex gap-3 items-start">
                      <X className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                      Different formulas per QS
                    </li>
                    <li className="flex gap-3 items-start">
                      <X className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                      No audit trail for assumptions
                    </li>
                    <li className="flex gap-3 items-start">
                      <X className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                      Not integrated with project tracking
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Cost Plan Calculator - highlighted */}
              <motion.div
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.08 }}
                whileHover={{ y: -18, scale: 1.04 }}
                className="relative p-8 rounded-3xl border-2 border-transparent bg-gradient-to-br from-[#071022] to-[#0b1724] text-zinc-100 flex flex-col justify-between shadow-2xl transform-gpu"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--color-lime)] text-black text-[10px] font-bold uppercase tracking-wider">
                  Recommended Choice
                </div>
                <div className="space-y-5">
                  <h4 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">Cost Plan Calculator</h4>
                  <div className="h-0.5 bg-zinc-800 w-full" />
                  <ul className="space-y-3 pt-2 text-sm">
                    <li className="flex gap-3 items-start">
                      <Check className="w-5 h-5 text-[var(--color-lime)] mt-1 shrink-0" />
                      2 minutes per cost plan
                    </li>
                    <li className="flex gap-3 items-start">
                      <Check className="w-5 h-5 text-[var(--color-lime)] mt-1 shrink-0" />
                      Consistent methodology across firm
                    </li>
                    <li className="flex gap-3 items-start">
                      <Check className="w-5 h-5 text-[var(--color-lime)] mt-1 shrink-0" />
                      All assumptions documented
                    </li>
                    <li className="flex gap-3 items-start">
                      <Check className="w-5 h-5 text-[var(--color-lime)] mt-1 shrink-0" />
                      Integrated project tracking built in
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* General AI */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-col justify-between shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">General spreadsheet tools</h4>
                  <div className="h-0.5 bg-zinc-200 dark:border-zinc-800 w-full" />
                  <ul className="space-y-3 pt-2 text-sm text-zinc-650 dark:text-zinc-400">
                    <li className="flex gap-3 items-start">
                      <X className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                      Still requires manual data entry
                    </li>
                    <li className="flex gap-3 items-start">
                      <X className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                      No automation of GFA calculation
                    </li>
                    <li className="flex gap-3 items-start">
                      <X className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                      No financial planning module
                    </li>
                    <li className="flex gap-3 items-start">
                      <X className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                      Time spent building vs. delivering
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { q: 'Can we customize the rates used for cost estimates?', a: 'Yes. You can set your own unit rates per building type, location, and complexity. Rates are configurable per client or project type.' },
              { q: 'What if we are working in a market with no standard rates?', a: 'We have training data for rates in UAE, Australia, UK, and Sri Lanka. For other markets, we can train the model on your historical project data (6+ previous projects required).' },
              { q: 'Can it integrate with our ERP?', a: 'Yes. We have pre-built integrations with SAP, Oracle, and NetSuite. Other ERPs available via API. Contact us for integration details.' },
              { q: 'What file formats does it accept?', a: 'PDF, PNG/JPG images, Revit RVT files, and DWG drawings. File size limit is 50MB.' },
              { q: 'How accurate are the cost estimates?', a: 'Within 10-15% of final tender cost in the majority of cases, assuming market-standard rates and no unusual site conditions.' },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                >
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-50 pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-300 shrink-0 ${activeFaq === idx ? "rotate-180" : ""
                      }`}
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer CTA ─── */}
      <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
            Give clients a cost estimate on day one.
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            See how Cost Plan Calculator turns a 2-day manual task into a 2-minute output.
          </p>
          <div className="pt-4 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-xl px-8 py-6 font-bold shadow-md bg-primary text-black hover:bg-primary/90 cursor-pointer"
            >
              <a
                href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a demo →
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
