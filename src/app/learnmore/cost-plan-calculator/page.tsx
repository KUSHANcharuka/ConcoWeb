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
  ArrowUpRight,
  Plus,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComparisonGrid from "@/components/learnmore/comparison-grid";

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
        className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#FAFAF8] dark:bg-zinc-950"
      >
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-gradient-to-br from-lime/20 via-lime/10 to-transparent rounded-full blur-[130px] opacity-70 animate-pulse" style={{ animationDuration: '9s' }} />
          <div className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] bg-gradient-to-tr from-lime/10 via-zinc-400/5 to-transparent rounded-full blur-[140px] opacity-65" />
          <div className="absolute inset-0 bg-white/45 dark:bg-zinc-950/65 backdrop-blur-[1px]" />
        </div>

        {/* Hero Content */}
        <div className="relative w-full z-10">
          <motion.div
            className="relative z-30 max-w-6xl mx-auto px-6 pt-28"
          >
            <Link
              href="/learnmore"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-black/60 backdrop-blur-md text-sm font-semibold text-zinc-650 hover:text-zinc-955 dark:text-zinc-405 dark:hover:text-white transition-all hover:bg-white/80 dark:hover:bg-black/80 hover:scale-105 active:scale-95 group shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back
            </Link>
          </motion.div>

          <motion.div
            className="px-6 pt-10 pb-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Left Column - Text Content */}
            <div className="lg:col-span-7 space-y-6">


              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight uppercase">
                Cost Plan Calculator
              </h1>

              <p className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-300 font-medium leading-normal">
                GFA to budget in minutes. Not days.
              </p>

              <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl font-medium">
                Upload a concept drawing. Get the Gross Floor Area, project cost, and consultancy fee automatically — with a financial planning module built in.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  onClick={scrollToVideo}
                  size="lg"
                  className="rounded-2xl px-8 py-7 font-bold shadow-sm cursor-pointer border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 transition-transform hover:scale-105"
                >
                  <Play className="w-4 h-4 mr-2 text-zinc-900 dark:text-zinc-300" />
                  Watch Demo
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl px-8 py-7 font-bold shadow-md cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 border-0 transition-transform hover:scale-105"
                >
                  <a
                    href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book a Demo
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Column - Before/After Widget */}
            <motion.div
              className="lg:col-span-5"
            >
              <div className="relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50">
                <div className="flex items-center justify-between mb-6 border-b border-zinc-150 dark:border-zinc-800 pb-4">
                  <h3 className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-50">
                    Compare Workflows
                  </h3>
                  <div className="relative flex bg-zinc-150/80 dark:bg-zinc-950/80 p-1 rounded-xl w-48 justify-between border border-zinc-200/50 dark:border-zinc-850/50">
                    <button
                      onClick={() => handleTabClick("before")}
                      className={`relative z-10 w-24 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${activeTab === "before"
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-500"
                        }`}
                    >
                      Before
                    </button>
                    <button
                      onClick={() => handleTabClick("after")}
                      className={`relative z-10 w-24 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${activeTab === "after"
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-500"
                        }`}
                    >
                      After
                    </button>
                    <motion.div
                      layoutId="toggle-pill-cost"
                      className="absolute top-1 bottom-1 bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50 rounded-lg"
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
                          {[
                            "QS calculates GFA by hand from PDF drawings.",
                            "Plugs numbers into Excel with manual formulas.",
                            "Cost plan takes 1-2 days to produce.",
                            "No integrated project pipeline tracking."
                          ].map((item, i) => (
                            <li key={i} className="flex gap-3 text-zinc-650 dark:text-zinc-350 text-sm bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50">
                              <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
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
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-wider">
                          Cost Plan Calculator
                        </div>
                        <ul className="space-y-3.5">
                          {[
                            "Upload concept drawing — GFA generated instantly.",
                            "Estimate & consultancy fee computed automatically.",
                            "Financial planning module tracks project pipeline.",
                            "Outputs ready for client presentation."
                          ].map((item, i) => (
                            <li key={i} className="flex gap-3 text-zinc-650 dark:text-zinc-355 text-sm bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50">
                              <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
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
      <section ref={videoSectionRef} className="py-24 px-6 bg-white dark:bg-zinc-950 border-t border-zinc-150 dark:border-zinc-900">
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
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase">
              Cost Plan Calculator Demo
            </h2>
            <p className="text-zinc-500 dark:text-zinc-450 text-sm max-w-lg mx-auto leading-relaxed">
              Watch how a concept drawing becomes a complete cost plan in minutes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 aspect-video max-w-4xl mx-auto bg-zinc-950 flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-br from-lime/10 via-transparent to-zinc-950 pointer-events-none" />
              <div className="relative z-10 text-center space-y-4">
                <a
                  href="https://drive.google.com/drive/folders/1C8KTwemod1FyxAuZr7jefJLqbs1LCn2L?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-full bg-lime text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform mx-auto cursor-pointer"
                >
                  <Play className="w-6 h-6 fill-black ml-1" />
                </a>
                <p className="text-xs text-zinc-350 font-bold uppercase tracking-wider">
                  Open Demo Walkthrough in Google Drive
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Problem Section ─── */}
      <section className="bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-200 dark:border-zinc-800 py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
              The Friction
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 uppercase">
              The cost planning bottleneck
            </h2>
            <div className="w-16 h-1 bg-lime rounded-full" />
          </div>
          <div className="lg:col-span-7 text-zinc-650 dark:text-zinc-450 text-base sm:text-lg leading-relaxed space-y-6 font-medium">
            <p>QS firms are still calculating Gross Floor Area by hand from PDF concept drawings and plugging numbers into Excel to produce a cost plan at the feasibility stage.</p>
            <p>This is the moment when speed matters most — the client is waiting for budget validation before committing to design. But the process takes 1-2 days and relies on manual Excel formulas that differ from firm to firm.</p>
            <p className="text-zinc-950 dark:text-zinc-200 font-bold">Cost Plan Calculator automates this, turning the cost planning step from a bottleneck into a two-minute output that is ready to present.</p>
          </div>
        </div>
      </section>

      {/* ─── Bento Grid Capabilities & Integration ─── */}
      <section className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-900 py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-150 dark:border-zinc-800 pb-10">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block">
                Capabilities
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-955 dark:text-white leading-[1.1] uppercase">
                Fits into your workflow
              </h2>
              <p className="text-zinc-550 dark:text-zinc-400 text-base sm:text-lg font-medium">
                Connected estimations, instant footprint measurements, and pipeline dashboards in one place.
              </p>
            </div>
            
            <div className="flex md:justify-end items-center shrink-0">
              <Button
                asChild
                size="lg"
                className="rounded-2xl px-6 py-5 font-bold shadow-md bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black border-0 transition-all hover:-translate-y-0.5 cursor-pointer text-sm"
              >
                <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                  Book a Demo
                </a>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
            
            {/* Left Column Tall Card */}
            <div className="lg:row-span-2 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-300 shadow-sm">
              <div className="space-y-4">
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block">Input Variables</span>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Concept Blueprints</h3>
                <p className="text-zinc-550 dark:text-zinc-400 text-sm leading-relaxed">
                  Support for multi-page concept files, PDF blueprints, Revit models, or DWG exports up to 50MB.
                </p>
              </div>
              
              <div className="mt-10 bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-900 rounded-2xl p-4 shadow-sm space-y-4">
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[9px] font-extrabold uppercase tracking-wider">
                  <span className="px-2.5 py-1.5 bg-zinc-950 text-white dark:bg-white dark:text-black rounded-lg">FILES</span>
                  <span className="px-2.5 py-1.5 bg-zinc-100 text-zinc-500 dark:bg-zinc-900 rounded-lg">RVT</span>
                  <span className="px-2.5 py-1.5 bg-zinc-100 text-zinc-500 dark:bg-zinc-900 rounded-lg">PDF</span>
                </div>
                
                <div className="bg-zinc-50 dark:bg-zinc-900/60 rounded-xl p-3 border border-zinc-100 dark:border-zinc-800/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[8px] font-bold text-zinc-450 uppercase tracking-widest">Active Calculator</span>
                  </div>
                  <p className="text-[10px] font-mono text-zinc-650 dark:text-zinc-300 bg-white dark:bg-zinc-950/80 p-2.5 rounded-lg border border-zinc-150 dark:border-zinc-800/80 leading-normal">
                    "GFA_Calculated_Project_Alpha.pdf"
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column Wide Card */}
            <div className="lg:col-span-2 bg-zinc-950 text-white border border-zinc-900 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row justify-between gap-8 overflow-hidden relative group shadow-xl">
              <div className="flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">AI Estimating Engine</span>
                  <h3 className="text-2xl font-bold tracking-tight text-white leading-tight">Your cost plans calculated on a live connected pricer canvas</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Instantly detects building footprint zones, floor numbers, and calculates consultancy fees based on region standard rules.
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Calculation Engine Sync Active</span>
                </div>
              </div>

              {/* Graphical flowchart mockup */}
              <div className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 min-h-[190px] relative overflow-hidden flex flex-col justify-center shadow-inner">
                {/* Grid canvas background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:14px_20px]" />
                
                {/* Connected flow path SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 30,120 Q 90,60 160,105 T 280,45" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-30" />
                  <path d="M 30,120 Q 90,60 160,105 T 280,45" fill="none" stroke="url(#flow)" strokeWidth="2.5" />
                  <defs>
                    <linearGradient id="flow" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="white" stopOpacity="0.05" />
                      <stop offset="60%" stopColor="white" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="white" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Floating Mockup Nodes */}
                <div className="absolute top-[32px] right-[24px] z-10 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                  <div className="text-left leading-none">
                    <span className="text-[8px] font-bold text-white block">Budget</span>
                    <span className="text-[6px] text-white font-black uppercase tracking-wider">Calculated</span>
                  </div>
                </div>

                <div className="absolute bottom-[24px] left-[20px] z-10 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                  <span className="text-[9px] font-bold text-zinc-300">GFA</span>
                </div>

                {/* Collaborative Cursors */}
                <div className="absolute bottom-[48px] right-[88px] z-20 flex items-center gap-1 bg-zinc-900 text-white dark:bg-white dark:text-black px-2 py-0.5 rounded-md text-[8px] font-extrabold tracking-wider shadow-md">
                  <svg className="w-2 h-2 fill-white dark:fill-black" viewBox="0 0 24 24">
                    <path d="M7 2l12 11.2-5.8.8 3.8 6.5-2.2 1.3-3.8-6.5-4 4.7V2z" />
                  </svg>
                  QS Estimator
                </div>
              </div>
            </div>

            {/* Bottom Left Card */}
            <div className="bg-[#12130e] text-white border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-zinc-700 transition-all duration-300 shadow-md">
              <div className="space-y-4">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Dashboard Sync</span>
                <h3 className="text-xl font-bold tracking-tight text-white leading-tight">Pipeline Control</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Track consultancy fees, revenue forecasts, and project lists directly in your firm's pipeline.
                </p>
              </div>
              <div className="mt-8 flex justify-end">
                <span className="text-xl font-bold text-zinc-700 group-hover:text-white transition-colors duration-300 font-serif">→</span>
              </div>
            </div>

            {/* Bottom Right Card */}
            <div className="bg-[#0f1115] text-white border border-zinc-900 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-zinc-800 transition-all duration-300 shadow-md">
              <div className="space-y-4">
                <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block">Downstream Workflow</span>
                <h3 className="text-xl font-bold tracking-tight text-white leading-tight">Revit integration</h3>
                <p className="text-zinc-455 text-sm leading-relaxed">
                  Lock cost plans to design briefs, feeding directly into Revit to BOQ baseline models.
                </p>
              </div>
              <div className="mt-8 flex justify-end">
                <span className="text-xl font-bold text-zinc-700 group-hover:text-white transition-colors duration-300 font-serif">→</span>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ─── Pricing & Quick Facts Section ─── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-16">
            <div className="space-y-6">
              <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">Deployment</span>
              <h2 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight uppercase">Pricing &amp; Availability</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-sm">
                  <span className="text-xs text-zinc-450 font-bold uppercase tracking-widest">One-Off Implementation</span>
                  <p className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">$3,500</p>
                  <p className="text-xs text-zinc-500">Includes setup, custom rate integration, and team training.</p>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-sm">
                  <span className="text-xs text-zinc-450 font-bold uppercase tracking-widest">Annual Support</span>
                  <p className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">$300<span className="text-sm font-normal text-zinc-450">/year</span></p>
                  <p className="text-xs text-zinc-500">Covers quarterly rate updates and priority support.</p>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-sm">
                  <span className="text-xs text-zinc-450 font-bold uppercase tracking-widest">Enterprise</span>
                  <p className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">Custom</p>
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
                    className="group block p-5 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:shadow-lg hover:border-lime/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-955 dark:group-hover:text-white transition-colors">
                          Planning Law Chatbot
                        </h4>
                        <p className="text-xs text-zinc-550 leading-relaxed">
                          Instant planning regulations at your fingertips. Parallel stage product.
                        </p>
                      </div>
                      <span className="shrink-0 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-805 text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Parallel
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[10px] font-semibold text-zinc-900 dark:text-zinc-300">Learn more</span>
                      <ChevronRight className="w-3 h-3 text-zinc-900 dark:text-zinc-300 transition-transform group-hover:translate-x-0.5" />
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
                    className="group block p-5 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:shadow-lg hover:border-lime/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-955 dark:group-hover:text-white transition-colors">
                          Revit to BOQ
                        </h4>
                        <p className="text-xs text-zinc-550 leading-relaxed">
                          Automated BOQ generation from Revit models with AI-powered rate prediction.
                        </p>
                      </div>
                      <span className="shrink-0 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-805 text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Next stage
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[10px] font-semibold text-zinc-900 dark:text-zinc-300">Learn more</span>
                      <ChevronRight className="w-3 h-3 text-zinc-900 dark:text-zinc-300 transition-transform group-hover:translate-x-0.5" />
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
                    className="group block p-5 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:shadow-lg hover:border-lime/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-955 dark:group-hover:text-white transition-colors">
                          MeasureonAir
                        </h4>
                        <p className="text-xs text-zinc-555 leading-relaxed">
                          Site measurement to payment certificate, fully digital and automated.
                        </p>
                      </div>
                      <span className="shrink-0 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-805 text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Construction
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[10px] font-semibold text-zinc-900 dark:text-zinc-300">Learn more</span>
                      <ChevronRight className="w-3 h-3 text-zinc-900 dark:text-zinc-300 transition-transform group-hover:translate-x-0.5" />
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
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white hover:text-zinc-650 transition-colors group"
                >
                  View full product suite
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Quick Facts Sidebar */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-3 uppercase">Quick Facts</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2 gap-4">
                  <span className="text-zinc-500 font-semibold shrink-0">Stage</span>
                  <span className="font-bold text-zinc-900 dark:text-white text-right">Pre-design</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2 gap-4">
                  <span className="text-zinc-500 font-semibold shrink-0">Best For</span>
                  <span className="font-bold text-zinc-900 dark:text-white text-right">QS Firms, Cost Consultancies, Developers</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2 gap-4">
                  <span className="text-zinc-500 font-semibold shrink-0">Target Regions</span>
                  <span className="font-bold text-zinc-900 dark:text-white text-right">UAE, UK, Australia, Sri Lanka</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2 gap-4">
                  <span className="text-zinc-500 font-semibold shrink-0">Time to Implement</span>
                  <span className="font-bold text-zinc-900 dark:text-white text-right">3-5 Days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-semibold shrink-0">Pricing</span>
                  <span className="font-bold text-zinc-900 dark:text-white text-right">$3,500 + $300/yr</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  asChild
                  className="w-full rounded-2xl py-7 font-bold shadow-md bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 border-0 transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  <Link href="/pricing">
                    Buy Products &rarr;
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Comparison Section ─── */}
      <ComparisonGrid
        sectionTitle="Why choose Cost Plan Calculator"
        card1={{
          title: "Manual Method",
          subtitle: "Manual Excel",
          features: [
            "1-2 days per cost plan",
            "Different formulas per QS",
            "No audit trail for assumptions",
            "Not integrated with project tracking",
          ],
          metric: { value: "1-2", label: "DAYS" },
          button: { text: "Traditional Route", href: "/pricing" },
        }}
        card2={{
          title: "Cost Plan",
          subtitle: "Cost Plan Calculator",
          features: [
            "2 minutes per cost plan",
            "Consistent methodology across firm",
            "All assumptions documented",
            "Integrated project tracking built in",
          ],
          metric: { value: "2", label: "MINUTES" },
          button: { text: "Book A Demo", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
        }}
        card3={{
          title: "Generic spreadsheets",
          subtitle: "Generic Tools",
          features: [
            "Still requires manual data entry",
            "No automation of GFA calculation",
            "No financial planning module",
            "Time spent building vs. delivering",
          ],
          metric: { value: "UNRELIABLE", label: "FAST /" },
          button: { text: "Other Tools", href: "https://chat.openai.com" },
        }}
      />

      {/* ─── FAQ Section ─── */}
      <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900/20 border-y border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-955 dark:text-zinc-50 uppercase">
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
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-zinc-900 dark:text-zinc-50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full shrink-0 ml-4 flex items-center justify-center transition-colors duration-300 ${activeFaq === idx ? "bg-zinc-900 dark:bg-white text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-555"}`}>
                    {activeFaq === idx ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
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
                      <div className="px-5 pb-5 text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-4">
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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-zinc-955 dark:text-zinc-50 uppercase">
            Give clients a cost estimate on day one.
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            See how Cost Plan Calculator turns a 2-day manual task into a 2-minute output.
          </p>
          <div className="pt-4 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 py-6 font-bold shadow-md border-0 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 cursor-pointer"
            >
              <a
                href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a Demo →
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
