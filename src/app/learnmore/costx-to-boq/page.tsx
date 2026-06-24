"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer";
import {
  ArrowLeft, Calendar, Check, X,
  FileSpreadsheet, RefreshCw, Zap, Lock, Cpu,
  Plus, Minus, ArrowUpRight, BarChart3,
  Play, Pause, Maximize, Minimize
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComparisonGrid from "@/components/learnmore/comparison-grid";

export default function CostXToBoqPage() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoAreaRef = useRef<HTMLDivElement>(null);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Exit fullscreen on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoAreaRef.current?.requestFullscreen().catch((err) => {
        console.error("Error going fullscreen:", err);
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Auto-toggle Before/After every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev === "before" ? "after" : "before"));
    }, 4000);
    return () => clearInterval(timer);
  }, [autoToggleKey]);

  const handleTabClick = (tab: "before" | "after") => {
    setActiveTab(tab);
    setAutoToggleKey((k) => k + 1);
  };

  const enterDemoMode = useCallback(() => {
    setIsDemoMode(true);
  }, []);

  const exitDemoMode = useCallback(() => {
    if (!isDemoMode) return;
    setIsDemoMode(false);
  }, [isDemoMode]);

  // Track video play/pause state
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, [isDemoMode]);

  // Close demo on Escape
  useEffect(() => {
    if (!isDemoMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitDemoMode();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDemoMode, exitDemoMode]);

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-555 antialiased selection:bg-lime/30 selection:text-black">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#FAFAF8] dark:bg-zinc-950">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-gradient-to-br from-lime/20 via-lime/10 to-transparent rounded-full blur-[130px] opacity-70 animate-pulse" style={{ animationDuration: "9s" }} />
          <div className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] bg-gradient-to-tr from-lime/10 via-zinc-400/5 to-transparent rounded-full blur-[140px] opacity-65" />
          <div className="absolute inset-0 bg-white/45 dark:bg-zinc-950/65 backdrop-blur-[1px]" />
        </div>

        <div className="relative w-full z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-30 max-w-6xl mx-auto px-6 pt-28"
          >
            <Link
              href="/learnmore"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-black/60 backdrop-blur-md text-sm font-semibold text-zinc-650 hover:text-zinc-955 dark:text-zinc-405 dark:hover:text-white transition-all hover:bg-white/80 dark:hover:bg-black/80 hover:scale-105 active:scale-95 group shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Learn More
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="px-6 pt-10 pb-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.1] uppercase product-title-sweep">
                CostX to BOQ
              </h1>

              <p className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-300 font-medium leading-normal">
                Client-ready BOQ straight from your CostX workbooks. No manual reformatting.
              </p>

              <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl font-medium">
                You already measure and estimate in RIB CostX, with workbooks live-linked to your drawings. But the deliverable your client signs off is a formatted, priced BOQ in their template, structured to NRM2. Getting there still means exporting to Excel and rebuilding the bill by hand, then redoing it every time a dimension or rate changes. CostX to BOQ reads your dimension groups and workbook data, maps them to NRM2 or your client's template, and produces a priced BOQ in minutes, repriced automatically when your estimate changes.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl px-8 py-7 font-bold shadow-xl shadow-lime/15 cursor-pointer bg-lime text-black hover:bg-lime/90 border-0 transition-transform hover:scale-105"
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

                <Button
                  onClick={enterDemoMode}
                  size="lg"
                  variant="outline"
                  className="rounded-2xl px-8 py-7 font-bold shadow-sm cursor-pointer border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 transition-transform hover:scale-105 group relative overflow-hidden"
                >
                  {/* Pulse ring effect */}
                  <span className="absolute inset-0 rounded-2xl ring-1 ring-lime/30 ring-offset-0 animate-pulse group-hover:ring-lime/50" style={{ animationDuration: '3s' }} />
                  <Play className="w-4 h-4 mr-2 text-zinc-900 dark:text-zinc-100 fill-zinc-900 dark:fill-zinc-100" />
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Right Column - Before/After Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50">
                <div className="flex items-center justify-between mb-6 border-b border-zinc-150 dark:border-zinc-800 pb-4">
                  <h3 className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-50">
                    Compare Workflows
                  </h3>
                  <div className="relative flex bg-zinc-150/80 dark:bg-zinc-955/80 p-1 rounded-xl w-48 justify-between border border-zinc-200/50 dark:border-zinc-850/50">
                    <button
                      onClick={() => handleTabClick("before")}
                      className={`relative z-10 w-24 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${activeTab === "before" ? "text-zinc-900 dark:text-white" : "text-zinc-400"
                        }`}
                    >
                      Before
                    </button>
                    <button
                      onClick={() => handleTabClick("after")}
                      className={`relative z-10 w-24 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${activeTab === "after" ? "text-zinc-900 dark:text-white" : "text-zinc-400"
                        }`}
                    >
                      After
                    </button>
                    <motion.div
                      layoutId="costx-toggle-pill"
                      className="absolute top-1 bottom-1 bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 rounded-lg"
                      animate={{ left: activeTab === "before" ? 4 : 92, width: 92 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  </div>
                </div>

                <div className="min-h-[260px] flex flex-col justify-center text-left">
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
                          CostX to Excel (Traditional)
                        </div>
                        <ul className="space-y-3">
                          <li className="flex gap-3 text-zinc-650 dark:text-zinc-400 text-sm items-start">
                            <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span>Export the CostX workbook to Excel</span>
                          </li>
                          <li className="flex gap-3 text-zinc-650 dark:text-zinc-400 text-sm items-start">
                            <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span>Reformat into the client BOQ template by hand</span>
                          </li>
                          <li className="flex gap-3 text-zinc-650 dark:text-zinc-400 text-sm items-start">
                            <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span>Re-sort items into sections manually</span>
                          </li>
                          <li className="flex gap-3 text-zinc-650 dark:text-zinc-400 text-sm items-start">
                            <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span>Re-paste rates and totals</span>
                          </li>
                          <li className="flex gap-3 text-zinc-650 dark:text-zinc-400 text-sm items-start">
                            <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span>Redo the whole bill every change</span>
                          </li>
                          <li className="flex gap-3 text-zinc-900 dark:text-zinc-100 text-sm items-start font-bold">
                            <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span>Takes 1 to 2 days per BOQ</span>
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
                        <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                          CostX to BOQ (AI-Powered)
                        </div>
                        <ul className="space-y-3">
                          <li className="flex gap-3 text-zinc-650 dark:text-zinc-355 text-sm items-start">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Connect the CostX workbook directly, no rebuild</span>
                          </li>
                          <li className="flex gap-3 text-zinc-650 dark:text-zinc-355 text-sm items-start">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Items mapped to NRM2 or template automatically</span>
                          </li>
                          <li className="flex gap-3 text-zinc-650 dark:text-zinc-355 text-sm items-start">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>QS rules assign items to correct work sections</span>
                          </li>
                          <li className="flex gap-3 text-zinc-650 dark:text-zinc-355 text-sm items-start">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Rates carried through from your CostX rate library</span>
                          </li>
                          <li className="flex gap-3 text-zinc-650 dark:text-zinc-355 text-sm items-start">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>BOQ reprices automatically when estimate changes</span>
                          </li>
                          <li className="flex gap-3 text-zinc-900 dark:text-zinc-100 text-sm items-start font-bold">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Takes 15 minutes per BOQ</span>
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

      {/* ─── THE CHALLENGE SECTION ─── */}
      <section className="bg-white dark:bg-zinc-950 border-y border-zinc-200 dark:border-zinc-900 py-24 px-6 text-left">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-955 dark:text-white mb-6 uppercase">
              CostX gets you to the estimate.<br />
              <span className="text-zinc-400 dark:text-zinc-600">Not to the BOQ.</span>
            </h2>
            <div className="space-y-6 text-zinc-550 dark:text-zinc-450 text-base sm:text-lg leading-relaxed max-w-3xl font-medium">
              <p>
                RIB CostX is excellent at takeoff and estimating, and your workbooks stay live-linked to your drawings. The gap is the last step: the bill your client accepts has to sit in their format and follow a measurement standard like NRM2, SMM7 or POMI. Producing that still means exporting to Excel and rebuilding the structure by hand, then repeating the whole exercise on every revision. The takeoff is automated. The BOQ is not.
              </p>
              <p>
                CostX to BOQ closes that last gap, so the work you already did in CostX becomes an issue-ready bill without the rebuild.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (STEPS) ─── */}
      <section className="py-24 px-6 max-w-6xl mx-auto text-left">
        <div className="space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">Process</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white">How it works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                num: "01",
                title: "Connect your CostX data",
                desc: "Point CostX to BOQ at your CostX workbook or dimension export. Your dimension groups, quantities and rates come across intact.",
                icon: FileSpreadsheet
              },
              {
                num: "02",
                title: "Map to a BOQ standard",
                desc: "Items are matched to NRM2 work sections, or to your client's bespoke template, using quantity surveying rules rather than guesswork.",
                icon: Cpu
              },
              {
                num: "03",
                title: "Carry your rates through",
                desc: "Rates from your CostX rate library are applied, so the pricing logic stays consistent with the estimate you already built.",
                icon: Zap
              },
              {
                num: "04",
                title: "Generate the BOQ",
                desc: "A complete, structured, priced BOQ is produced in your house format, ready to issue to the client.",
                icon: Lock
              },
              {
                num: "05",
                title: "Reprice on change",
                desc: "Update the estimate in CostX, re-run, and the BOQ reprices automatically. No rebuild, no re-paste.",
                icon: RefreshCw
              }
            ].map((step, idx) => (
              <div key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-lime/40 transition-colors duration-300">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-black text-zinc-900 dark:text-white">{step.num}</span>
                    <step.icon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-wider">{step.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WORKFLOW / INTEGRATION ─── */}
      <section className="bg-zinc-950 text-white border-y border-zinc-900 py-24 px-6 text-left">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="max-w-2xl space-y-4">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Integration</span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] uppercase">Fits into your workflow</h2>
            <p className="text-zinc-400 text-base sm:text-lg font-medium">
              A smooth data flow from RIB CostX to standard client deliverables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-4">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider block">01. Source</span>
              <h3 className="text-xl font-bold uppercase text-white">CostX Workbook</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Connect your CostX workbook directly (Excel export, CSV or dimension data).
              </p>
            </div>
            <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-4">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider block">02. Structure</span>
              <h3 className="text-xl font-bold uppercase text-white">NRM2 &amp; Templates</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Map dimension groups and items to NRM2 or the client template automatically using QS rules.
              </p>
            </div>
            <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-4">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider block">03. Export</span>
              <h3 className="text-xl font-bold uppercase text-white">Excel &amp; PDF</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Issue as Excel or PDF, or sync into your downstream QS and ERP workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING & DETAILS ─── */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-left">
        <div className="space-y-20">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-zinc-955 dark:text-white uppercase">Pricing &amp; Availability</h3>
            <div className="flex flex-col sm:flex-row gap-6 items-center p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
              <div className="sm:w-1/2 space-y-2 text-center sm:text-left">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Seat Subscription</p>
                <p className="text-4xl font-black text-zinc-900 dark:text-white">USD 1,200<span className="text-lg font-normal text-zinc-500">/mo</span></p>
                <p className="text-sm text-zinc-500">per user seat (indicative)</p>
              </div>
              <div className="hidden sm:block w-px h-24 bg-zinc-200 dark:bg-zinc-800"></div>
              <div className="sm:w-1/2 space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-zinc-650 dark:text-zinc-400">
                    <Check className="w-4 h-4 text-emerald-500" /> Integration with RIB CostX workbooks
                  </li>
                  <li className="flex items-center gap-2 text-sm text-zinc-650 dark:text-zinc-400">
                    <Check className="w-4 h-4 text-emerald-500" /> 1 to 2 weeks implementation
                  </li>
                  <li className="flex items-center gap-2 text-sm text-zinc-650 dark:text-zinc-400">
                    <Check className="w-4 h-4 text-emerald-500" /> Excel and PDF output formats
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Grid for Facts and Related Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16 border-t border-zinc-200 dark:border-zinc-800">
            {/* Quick Facts Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col justify-between space-y-8">
              <div>
                <h4 className="font-bold text-zinc-955 dark:text-white pb-4 uppercase border-b border-zinc-100 dark:border-zinc-800 text-lg">Quick Facts</h4>
                <ul className="space-y-4 text-sm pt-4">
                  <li className="flex justify-between items-center border-b border-zinc-50 dark:border-zinc-850/50 pb-2">
                    <span className="text-zinc-500 font-semibold">Stage</span>
                    <span className="font-bold text-zinc-900 dark:text-white">Estimating and tendering</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-zinc-50 dark:border-zinc-850/50 pb-2">
                    <span className="text-zinc-555">Best for</span>
                    <span className="font-bold text-zinc-900 dark:text-white text-right">QS firms, cost consultancies and contractors already using RIB CostX</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-zinc-50 dark:border-zinc-850/50 pb-2">
                    <span className="text-zinc-555">Regions</span>
                    <span className="font-bold text-zinc-900 dark:text-white">Middle East, Sri Lanka, Australia</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-zinc-50 dark:border-zinc-850/50 pb-2">
                    <span className="text-zinc-555">Works with</span>
                    <span className="font-bold text-zinc-900 dark:text-white text-right">CostX exports (Excel, CSV)</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-zinc-50 dark:border-zinc-850/50 pb-2">
                    <span className="text-zinc-555">Output formats</span>
                    <span className="font-bold text-zinc-900 dark:text-white text-right">NRM2, SMM7, POMI or house templates</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-zinc-555">Status</span>
                    <span className="font-bold text-zinc-900 dark:text-white">Available</span>
                  </li>
                </ul>
              </div>

              <Button
                asChild
                className="w-full rounded-2xl py-7 font-bold shadow-xl border-0 bg-lime text-black hover:bg-lime/90 cursor-pointer mt-8"
              >
                <a href="/pricing" target="_blank" rel="noopener noreferrer">
                  Buy Products <ArrowUpRight />
                </a>
              </Button>
            </div>

            {/* Related Products Card */}
            <div className="bg-[#FAFAF8] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-zinc-955 dark:text-white mb-6 uppercase tracking-wider text-sm border-b border-zinc-100 dark:border-zinc-800 pb-4">Related Products</h4>
                <div className="space-y-3">
                  <Link href="/learnmore/revit-to-boq" className="group flex items-center justify-between p-3 rounded-xl hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-650 dark:group-hover:text-zinc-200 font-bold">Revit to BOQ</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-650" />
                  </Link>
                  <Link href="/learnmore/acc-to-boq" className="group flex items-center justify-between p-3 rounded-xl hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-650 dark:group-hover:text-zinc-200 font-bold">ACC to BOQ</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-650" />
                  </Link>
                  <Link href="/learnmore/2d-drawing-to-boq" className="group flex items-center justify-between p-3 rounded-xl hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-650 dark:group-hover:text-zinc-200 font-bold">2D Drawing to BOQ</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-650" />
                  </Link>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-zinc-150 dark:border-zinc-800">
                <Link href="/learnmore" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  View full suite
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-left">
        <div className="space-y-8">
          <h3 className="text-3xl font-bold text-zinc-955 dark:text-white uppercase">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {[
              {
                q: "Which CostX versions does it work with?",
                a: "It works with current RIB CostX (and earlier iTWO costX) workbooks, using your standard Excel or CSV exports, so no change to your CostX setup is required."
              },
              {
                q: "How does it get data out of CostX?",
                a: "Through your existing workbook and dimension exports. You do not need to give up your CostX workflow; CostX to BOQ picks up from where your estimate already is."
              },
              {
                q: "Can it output NRM2, SMM7, POMI or our own template?",
                a: "Yes. NRM2 is the default, and your own house or client templates can be configured during setup."
              },
              {
                q: "Does it keep our CostX rates and rate library?",
                a: "Yes. Rates come through from your CostX workbook, so the priced bill matches your estimate."
              },
              {
                q: "What happens when the estimate changes?",
                a: "Re-run the bill and it reprices automatically against the updated quantities and rates. You do not rebuild it by hand."
              },
              {
                q: "Is our project data secure?",
                a: "Files are processed in a secure cloud workspace and are not shared between clients."
              }
            ].map((faq, i) => (
              <div key={i} className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between font-bold text-left text-zinc-900 dark:text-zinc-100 hover:bg-zinc-55 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full shrink-0 ml-4 flex items-center justify-center transition-colors duration-300 ${activeFaq === i ? "bg-zinc-900 dark:bg-white text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-550"}`}>
                    {activeFaq === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 pt-2 text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed">
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

      <ComparisonGrid
        sectionTitle="Why choose CostX to BOQ"
        card1={{
          title: "Traditional Route",
          subtitle: "Manual reformatting",
          features: [
            "1 to 2 days per BOQ",
            "Excel rebuilt by hand",
            "Structure errors creep in",
            "Redone every revision",
          ],
          metric: { value: "1-2", label: "DAYS" },
          button: { text: "Traditional Route", href: "" },
        }}
        card2={{
          title: "CostX to BOQ",
          subtitle: "CostX to BOQ app",
          features: [
            "15 minutes per BOQ",
            "Automatic NRM2 or client mapping",
            "Rates carried through from CostX",
            "Reprices on change",
          ],
          metric: { value: "15", label: "MINUTES" },
          button: { text: "Book A Demo", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
        }}
        card3={{
          title: "Other Tools",
          subtitle: "Generic exporters",
          features: [
            "Dump quantities to Excel only",
            "No BOQ structure or work sections",
            "No repricing on change",
            "Manual cleanup still needed",
          ],
          metric: { value: "EXPORT", label: "ONLY" },
          button: { text: "Other Tools", href: "" },
        }}
      />

      {/* ─── Footer CTA ─── */}
      <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 relative overflow-hidden mt-12">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-zinc-955 dark:text-zinc-50 uppercase">
            Your takeoff is done in CostX. Your BOQ should be too.
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            See how CostX to BOQ turns your workbooks into a client-ready bill in minutes.
          </p>
          <div className="pt-4 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 py-6 font-bold shadow-xl border-0 bg-lime text-black hover:bg-lime/90 cursor-pointer"
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

      {/* ─── VIDEO DEMO OVERLAY ─── */}
      <AnimatePresence>
        {isDemoMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl"
            onClick={exitDemoMode}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 60 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 60 }}
              transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.8 }}
              className="relative w-full max-w-5xl mx-4 aspect-video rounded-[1.5rem] overflow-hidden bg-zinc-900 shadow-2xl border border-zinc-800/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top glow line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-lime/60 to-transparent z-20" />

              {/* Close button - top right */}
              <button
                onClick={exitDemoMode}
                className="absolute top-4 right-4 z-30 p-2.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 hover:bg-zinc-800 text-white rounded-full transition-all hover:scale-110 cursor-pointer shadow-lg group"
              >
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div
                ref={videoAreaRef}
                onDoubleClick={toggleFullscreen}
                className="relative w-full h-full cursor-pointer select-none"
              >
                <video
                  ref={videoRef}
                  src="/videos/cost-plan-calculator-demo.mp4"
                  autoPlay
                  className="w-full h-full object-cover"
                />

                {/* Center play/pause large button (hidden when playing) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.button
                    animate={{
                      opacity: isPlaying ? 0 : 1,
                      scale: isPlaying ? 0.8 : 1
                    }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    onClick={() => {
                      if (videoRef.current) {
                        if (isPlaying) videoRef.current.pause();
                        else videoRef.current.play();
                      }
                    }}
                    className="pointer-events-auto w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:bg-white/20 hover:scale-110 cursor-pointer shadow-2xl"
                  >
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </motion.button>
                </div>

                {/* Bottom HUD Controls */}
                <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-16 pb-4 px-5 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  {/* Seek bar */}
                  <div className="mb-3">
                    <input
                      type="range"
                      min={0}
                      max={videoRef.current?.duration || 0}
                      value={videoRef.current?.currentTime || 0}
                      onChange={(e) => {
                        if (videoRef.current) {
                          videoRef.current.currentTime = Number(e.target.value);
                        }
                      }}
                      className="w-full h-1 appearance-none bg-zinc-600/50 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-lime [&::-webkit-slider-thumb]:shadow-lg"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (videoRef.current) {
                            if (isPlaying) videoRef.current.pause();
                            else videoRef.current.play();
                          }
                        }}
                        className="text-white/80 hover:text-white transition-colors cursor-pointer p-1"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 fill-white" />
                        ) : (
                          <Play className="w-5 h-5 fill-white" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleFullscreen}
                        className="text-white/80 hover:text-white transition-colors cursor-pointer p-1"
                      >
                        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
