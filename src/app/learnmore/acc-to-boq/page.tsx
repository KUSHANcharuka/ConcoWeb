"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer";
import {
  ArrowLeft, Play, Calendar, Check, X,
  Cloud, FileSpreadsheet, RefreshCw, Zap, Lock, Cpu,
  Building, Plus, Minus, FileText, Download, ArrowUpRight,
  Maximize, Minimize
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComparisonGrid from "@/components/learnmore/comparison-grid";
import AccToBoqWorkflow from "@/components/learnmore/acc-to-boq-workflow";

export default function AccToBoqPage() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeBenefit, setActiveBenefit] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoAreaRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);

  const videoBenefits = [
    {
      title: "Cloud-Native BOQ",
      desc: "Generate your BOQ directly from ACC models without local files or manual exports."
    },
    {
      title: "Instant Delta Repricing",
      desc: "When the design changes, the cost delta is computed dynamically and updated immediately."
    },
    {
      title: "Standard Rate Sync",
      desc: "Maintain geographic standard rate lists directly synchronized to your estimating sheets."
    },
    {
      title: "QS Team Integration",
      desc: "Collaborate seamlessly with cost consultants and project managers on a single version of truth."
    }
  ];

  // Rotate benefits
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBenefit((prev) => (prev + 1) % videoBenefits.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

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

  const scrollToVideo = () => {
    videoSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-555 antialiased selection:bg-lime/30 selection:text-black">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#FAFAF8] dark:bg-zinc-950">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-gradient-to-br from-lime/20 via-lime/10 to-transparent rounded-full blur-[130px] opacity-70 animate-pulse" style={{ animationDuration: '9s' }} />
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-black/60 backdrop-blur-md text-sm font-semibold text-zinc-650 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-all hover:bg-white/80 dark:hover:bg-black/80 hover:scale-105 active:scale-95 group shadow-sm cursor-pointer"
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
            <div className="lg:col-span-7 space-y-6">


              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.1] uppercase product-title-sweep">
                ACC to BOQ
              </h1>

              <p className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-300 font-medium leading-normal">
                BOQ from ACC. Instantly repriced as design changes.
              </p>

              <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl font-medium">
                Working in Autodesk Construction Cloud? Generate a BOQ natively from the cloud model, with automatic repricing when the design changes. No export, no Excel, no re-entry.
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
                  onClick={scrollToVideo}
                  size="lg"
                  variant="outline"
                  className="rounded-2xl px-8 py-7 font-bold shadow-sm cursor-pointer border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 transition-transform hover:scale-105"
                >
                  <Play className="w-4 h-4 mr-2 text-zinc-900 dark:text-zinc-350 fill-zinc-900 dark:fill-zinc-350" />
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
                  <div className="relative flex bg-zinc-150/80 dark:bg-zinc-950/80 p-1 rounded-xl w-48 justify-between border border-zinc-200/50 dark:border-zinc-850/50">
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
                      layoutId="acc-toggle-pill"
                      className="absolute top-1 bottom-1 bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 rounded-lg"
                      animate={{ left: activeTab === "before" ? 4 : 92, width: 92 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  </div>
                </div>

                <div className="min-h-[260px] flex flex-col justify-center">
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
                          BOQ from ACC (the manual way)
                        </div>
                        <ul className="space-y-3.5">
                          {[
                            "Get model data: Export the ACC model out to Excel",
                            "Measurement rules: Applied by hand, every time",
                            "Rates: Typed in manually",
                            "Design changes: Re-export, recalculate, re-price",
                            "Version control: Many Excel files, no single truth",
                            "Client visibility: Sees cost impact days later",
                            "Time per BOQ: 1 to 2 weeks"
                          ].map((item, i) => (
                            <li key={i} className="flex gap-3 text-zinc-650 dark:text-zinc-400 text-sm items-start bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50">
                              <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
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
                          ACC to BOQ
                        </div>
                        <ul className="space-y-3.5">
                          {[
                            "Get model data: BOQ generated natively from the cloud model, no export",
                            "Measurement rules: Applied automatically to every element",
                            "Rates: Your firm's standard rates applied automatically",
                            "Design changes: BOQ reprices automatically on sync",
                            "Version control: One cloud source of truth",
                            "Client visibility: Sees cost impact in real time",
                            "Time per BOQ: 5 minutes"
                          ].map((item, i) => (
                            <li key={i} className="flex gap-3 text-zinc-650 dark:text-zinc-355 text-sm items-start bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
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

      {/* ─── PROBLEM SECTION ─── */}
      <section className="bg-white dark:bg-zinc-950 border-y border-zinc-200 dark:border-zinc-900 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-955 dark:text-white mb-6 uppercase">
              Your workflow is cloud-first.<br />
              <span className="text-zinc-400 dark:text-zinc-600">Your BOQ isn't.</span>
            </h2>
            <div className="space-y-6 text-zinc-550 dark:text-zinc-455 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto font-medium">
              <p>
                UK and Australian QS firms are moving to Autodesk Construction Cloud for cloud-native collaboration. But the BOQ still gets produced by exporting model data to Excel, manually applying measurement rules, and typing rates.
              </p>
              <p>
                The workflow breaks at the most time-consuming step. When the design changes (and it always does), the cost consultant has to re-export, recalculate, and re-price, a process that takes 1 to 2 weeks.
              </p>
              <p className="font-bold text-zinc-900 dark:text-zinc-200">
                ACC to BOQ builds the BOQ directly in the cloud, eliminating the export step entirely. When design changes, the BOQ reprices automatically.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── VIDEO SHOWCASE SECTION ─── */}
      <section ref={videoSectionRef} className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950/20 border-b border-zinc-200 dark:border-zinc-900 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-555 uppercase tracking-widest block">
              Watch Demo
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
              Watch ACC to BOQ in Action
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base font-medium max-w-xl mx-auto">
              See how we automate the workflow from Autodesk Construction Cloud models to pricing updates.
            </p>
          </div>

          <div className="w-full max-w-4xl mx-auto">
            <div 
              ref={videoAreaRef}
              onDoubleClick={toggleFullscreen}
              className="relative w-full aspect-video rounded-3xl border border-zinc-700/40 shadow-[0_0_35px_rgba(0,0,0,0.10)] bg-black overflow-hidden group select-none cursor-pointer"
            >
              <video
                ref={videoRef}
                src="/videos/MVP_Vid_1_202606081311.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Blue color square overlay card for benefits */}
              <div 
                className={`absolute left-8 top-8 bottom-8 w-[320px] bg-zinc-950/90 backdrop-blur-md rounded-2xl p-6 border border-lime/30 shadow-[0_0_30px_rgba(0,0,0,0.15)] flex flex-col justify-between text-white z-20 transition-all duration-500 ${
                  isFullscreen ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                    Product Advantage
                  </span>
                  <div className="h-[2px] bg-lime/50 w-12" />
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeBenefit}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="space-y-3"
                    >
                      <h4 className="text-xl font-bold tracking-tight text-white leading-tight">
                        {videoBenefits[activeBenefit].title}
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                        {videoBenefits[activeBenefit].desc}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center gap-1.5 pt-4">
                  {videoBenefits.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveBenefit(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === activeBenefit ? "w-6 bg-lime" : "w-1.5 bg-zinc-700 hover:bg-zinc-500"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Fullscreen Close Button */}
              {isFullscreen && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  className="absolute top-6 right-6 z-50 p-3 bg-zinc-900/80 border border-zinc-700 hover:bg-zinc-800 text-white rounded-full transition-colors cursor-pointer shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Hover HUD Controls */}
              <div 
                className="absolute bottom-4 right-4 z-30 flex items-center gap-3 bg-zinc-950/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => {
                    if (videoRef.current) {
                      if (videoRef.current.paused) {
                        videoRef.current.play();
                      } else {
                        videoRef.current.pause();
                      }
                    }
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>
                <div className="h-4 w-[1px] bg-zinc-800" />
                <button 
                  onClick={toggleFullscreen}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─── HOW IT WORKS (VERTICAL PARALLAX TIMELINE) ─── */}
      <AccToBoqWorkflow />



      {/* ─── Bento Grid Capabilities & Integration ─── */}
      <section className="bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-150 dark:border-zinc-800 pb-10">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block">
                Capabilities
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.1] uppercase">
                Fits into your workflow
              </h2>
              <p className="text-zinc-550 dark:text-zinc-400 text-base sm:text-lg font-medium">
                Connect your cloud models natively and keep your estimates up-to-date in real time.
              </p>
            </div>

            <div className="flex md:justify-end items-center shrink-0">
              <Button
                asChild
                size="lg"
                className="rounded-xl px-6 py-5 font-bold shadow-md bg-lime text-black hover:bg-lime/90 border-0 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                  Book a Demo →
                </a>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">

            {/* Left Column Tall Card */}
            <div className="lg:row-span-2 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-300 shadow-sm">
              <div className="space-y-4">
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block">Cloud Connection</span>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Autodesk Cloud Native</h3>
                <p className="text-zinc-550 dark:text-zinc-400 text-sm leading-relaxed">
                  Direct live connection to Autodesk Construction Cloud models. No local files, no conversions, fully browser-based.
                </p>
              </div>


            </div>

            {/* Right Column Wide Card */}
            <div className="lg:col-span-2 bg-zinc-950 text-white border border-zinc-900 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row justify-between gap-8 overflow-hidden relative group shadow-xl">
              <div className="flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-[9px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest block">Revit-to-ACC Cloud Sync</span>
                  <h3 className="text-2xl font-bold tracking-tight text-white leading-tight">Live cost engine updates directly inside ACC Hub</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Our cloud engine scans updated elements on sync and computes the pricing delta dynamically.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-lime animate-ping" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-650 dark:text-zinc-400">ACC Webhook Active</span>
                </div>
              </div>

              {/* Graphical flowchart mockup */}
              <div className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 min-h-[190px] relative overflow-hidden flex flex-col justify-center shadow-inner">
                {/* Grid canvas background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--color-lime-rgb,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--color-lime-rgb,0.02)_1px,transparent_1px)] bg-[size:14px_20px]" />

                {/* Connected flow path SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 30,120 Q 90,60 160,105 T 280,45" fill="none" stroke="var(--color-lime)" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-30" />
                  <path d="M 30,120 Q 90,60 160,105 T 280,45" fill="none" stroke="url(#lime-flow)" strokeWidth="2.5" />
                  <defs>
                    <linearGradient id="lime-flow" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--color-lime)" stopOpacity="0.05" />
                      <stop offset="60%" stopColor="var(--color-lime)" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="var(--color-lime)" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Floating Mockup Nodes */}
                <div className="absolute top-[32px] right-[24px] z-10 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                  <div className="text-left leading-none">
                    <span className="text-[8px] font-bold text-white block">ACC model</span>
                    <span className="text-[6px] text-zinc-950 dark:text-white font-black uppercase tracking-wider">Synced</span>
                  </div>
                </div>

                <div className="absolute bottom-[24px] left-[20px] z-10 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                  <span className="text-[9px] font-bold text-zinc-300">Estimator</span>
                </div>

                {/* Collaborative Cursors (yellow active style) */}
                <div className="absolute bottom-[48px] right-[88px] z-20 flex items-center gap-1 bg-lime text-black px-2 py-0.5 rounded-md text-[8px] font-extrabold tracking-wider shadow-md">
                  <svg className="w-2 h-2 fill-black" viewBox="0 0 24 24">
                    <path d="M7 2l12 11.2-5.8.8 3.8 6.5-2.2 1.3-3.8-6.5-4 4.7V2z" />
                  </svg>
                  Sync Engine
                </div>
              </div>
            </div>

            {/* Bottom Left Card */}
            <div className="bg-[#12130e] text-white border border-lime/15 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-lime/30 transition-all duration-300 shadow-md">
              <div className="space-y-4">
                <span className="text-[9px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest block">Standard Rates</span>
                <h3 className="text-xl font-bold tracking-tight text-white leading-tight">Dynamic Pricer</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Maintain standard rate lists by location, project scale, or building type directly in the cloud.
                </p>
              </div>

            </div>

            {/* Bottom Right Card */}
            <div className="bg-[#0f1115] text-white border border-zinc-900 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-zinc-800 transition-all duration-300 shadow-md">
              <div className="space-y-4">
                <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block">QS Collaboration</span>
                <h3 className="text-xl font-bold tracking-tight text-white leading-tight">Team Integration</h3>
                <p className="text-zinc-450 text-sm leading-relaxed">
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ─── CONTENT WITH SIDEBAR ─── */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-left">
        <div className="space-y-20">

          {/* Pricing */}
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-zinc-955 dark:text-white uppercase">Pricing &amp; Availability</h3>
            <div className="flex flex-col sm:flex-row gap-6 items-center p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
              <div className="sm:w-1/2 space-y-2 text-center sm:text-left">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Monthly Subscription</p>
                <p className="text-4xl font-black text-zinc-900 dark:text-white">USD 1,200<span className="text-lg font-normal text-zinc-500">/mo</span></p>
                <p className="text-sm text-zinc-500">per firm (includes customisation)</p>
              </div>
              <div className="hidden sm:block w-px h-24 bg-zinc-200 dark:bg-zinc-800"></div>
              <div className="sm:w-1/2 space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-zinc-650 dark:text-zinc-400">
                    <Check className="w-4 h-4 text-emerald-500" /> Syncs Revit-authored models through Autodesk Construction Cloud
                  </li>
                  <li className="flex items-center gap-2 text-sm text-zinc-650 dark:text-zinc-400">
                    <Check className="w-4 h-4 text-emerald-500" /> 1–2 weeks implementation
                  </li>
                  <li className="flex items-center gap-2 text-sm text-zinc-650 dark:text-zinc-400">
                    <Check className="w-4 h-4 text-emerald-500" /> Scaling with sales
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
                    <span className="font-bold text-zinc-900 dark:text-white">Tendering</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-zinc-50 dark:border-zinc-850/50 pb-2">
                    <span className="text-zinc-550">Best for</span>
                    <span className="font-bold text-zinc-900 dark:text-white">QS &amp; Cost Consultancies</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-zinc-50 dark:border-zinc-850/50 pb-2">
                    <span className="text-zinc-550">Regions</span>
                    <span className="font-bold text-zinc-900 dark:text-white text-right">UK, Australia (primary)</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-zinc-50 dark:border-zinc-850/50 pb-2">
                    <span className="text-zinc-555">Time to implement</span>
                    <span className="font-bold text-zinc-900 dark:text-white">1–2 weeks</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-zinc-555">Pricing</span>
                    <span className="font-bold text-zinc-950 dark:text-white">USD 1,200/month</span>
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
                  <Link href="/learnmore/cost-plan-calculator" className="group flex items-center justify-between p-3 rounded-xl hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Cost Plan Calculator</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-600" />
                  </Link>
                  <Link href="/learnmore/measureonair" className="group flex items-center justify-between p-3 rounded-xl hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-650 dark:group-hover:text-zinc-200 font-bold">MeasureonAir</span>
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
                q: "Does it work with Revit models too?",
                a: "Yes. If the project is also using Revit locally, the tool works with both ACC and Revit versions of the model."
              },
              {
                q: "Can we customize rates per project type?",
                a: "Yes. You maintain rate tables by building type, location, and project classification. Rates are configurable per client."
              },
              {
                q: "What happens when the model is updated?",
                a: "The next time the cost consultant generates the BOQ, it measures the current model and applies current rates. Previous versions are saved for comparison."
              },
              {
                q: "Can multiple team members generate BOQs?",
                a: "Yes. The tool works for any user with access to the ACC model. All BOQs are tracked and versioned."
              },
              {
                q: "How does it handle design conflicts or incomplete elements?",
                a: "Incomplete or conflicting elements are flagged in the BOQ for manual review. You always see which elements were automated and which need attention."
              },
              {
                q: "Can we integrate with our ERP?",
                a: "Yes. CSV and XLS exports work with any system. Direct integrations with SAP, Oracle, NetSuite available."
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
        sectionTitle="Why choose ACC to BOQ"
        card1={{
          title: "Traditional Route",
          subtitle: "Export + Excel + Manual",
          features: [
            "1–2 weeks spent per BOQ",
            "Design changes require manual re-work",
            "Multiple versions with no single truth",
            "Client sees proposals days later",
          ],
          metric: { value: "1-2", label: "WEEKS" },
          button: { text: "Traditional Route", href: "#" },
        }}
        card2={{
          title: "ACC to BOQ",
          subtitle: "ACC to BOQ App",
          features: [
            "5 minutes spent per BOQ",
            "Design changes repriced instantly",
            "Single cloud source of truth",
            "Client sees cost impact in real time",
          ],
          metric: { value: "5", label: "MINUTES" },
          button: { text: "Book A Demo", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
        }}
        card3={{
          title: "Other Plugins",
          subtitle: "Other BOQ Plugins",
          features: [
            "Work only in Revit locally (not cloud-native)",
            "Do not handle repricing on design change well",
            "Still require manual data verification",
            "Do not eliminate export and re-entry",
          ],
          metric: { value: "UNRELIABLE", label: "FAST /" },
          button: { text: "Other Tools", href: "#" },
        }}
      />

      {/* ─── Footer CTA ─── */}
      <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 relative overflow-hidden mt-12">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-zinc-955 dark:text-zinc-50 uppercase">
            Let your BOQ grow with your design. Not lag behind it.
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            See how Autodesk Construction Cloud to BOQ keeps costs current in real time.
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

      <Footer />

    </main >
  );
}
