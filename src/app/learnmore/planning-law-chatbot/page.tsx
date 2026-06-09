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
  MessageSquare,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PlanningLawChatbotPage() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string; step: number } | null>(null);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Exit demo mode on wheel/touch/escape
  useEffect(() => {
    if (!isDemoMode) return;
    const handleWheel = () => setIsDemoMode(false);
    const handleTouchMove = () => setIsDemoMode(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDemoMode(false);
    };
    window.addEventListener("wheel", handleWheel, { once: true, passive: true });
    window.addEventListener("touchmove", handleTouchMove, { once: true, passive: true });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDemoMode]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev === "before" ? "after" : "before"));
    }, 3000);
    return () => clearInterval(timer);
  }, [autoToggleKey]);

  // Auto-cycle through workflow steps carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWorkflowStep((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // ESC key to close lightbox + lock body scroll
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setSelectedImage(null);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [selectedImage]);

  const handleTabClick = (tab: "before" | "after") => {
    setActiveTab(tab);
    setAutoToggleKey((k) => k + 1);
  };

  const enterDemoMode = useCallback(() => {
    setIsDemoMode(true);
  }, []);

  const exitDemoMode = useCallback(() => {
    setIsDemoMode(false);
  }, []);

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-lime/30 selection:text-black">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center overflow-hidden bg-black"
      >
        {/* Background Video */}
        <div
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            isDemoMode
              ? "fixed inset-0 z-50 bg-black"
              : "z-0"
          }`}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className={`w-full h-full object-cover transition-all duration-700 ${
              isDemoMode ? "scale-100" : "scale-105"
            }`}
          >
            <source src="/videos/planning-law-chatbot-demo.mp4" type="video/mp4" />
          </video>

          {/* Apple-style gradient overlay for text readability */}
          <AnimatePresence>
            {!isDemoMode && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20"
              />
            )}
          </AnimatePresence>

          {/* Extra dark overlay at bottom for section transition */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className={`relative w-full z-10 ${isDemoMode ? "pointer-events-none" : ""}`}>
          <motion.div
            animate={isDemoMode ? { y: -80, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="max-w-6xl mx-auto px-6 pt-28"
          >
            <Link
              href="/learnmore"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Learn More
            </Link>
          </motion.div>

          <motion.div
            animate={isDemoMode ? { y: -80, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.05 }}
            className="px-6 pt-10 pb-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Left Column - Text Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-white">
                  Pre-design
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-zinc-300">
                  Active Regions: UAE, LK, KSA, UK, AU
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                Planning Law Chatbot
              </h1>

              <p className="text-xl sm:text-2xl text-zinc-300 font-medium leading-normal">
                Know what you can build. Instantly.
              </p>

              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl">
                Enter a plot location. Get allowable uses, height limits, floor area ratio, and sanitary requirements in seconds — before you spend on design.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  onClick={enterDemoMode}
                  size="lg"
                  className="rounded-xl px-6 py-6 font-bold shadow-lg cursor-pointer bg-white text-black hover:bg-white/90"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl px-6 py-6 font-bold shadow-md cursor-pointer bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm"
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
              animate={isDemoMode ? { scale: 0.9, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
            >
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <h3 className="font-bold text-base tracking-tight text-white">
                    Compare Workflows
                  </h3>
                  <div className="relative flex bg-black/30 p-1 rounded-xl w-48 justify-between">
                    <button
                      onClick={() => handleTabClick("before")}
                      className={`relative z-10 w-24 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        activeTab === "before"
                          ? "text-white"
                          : "text-zinc-400"
                      }`}
                    >
                      Before
                    </button>
                    <button
                      onClick={() => handleTabClick("after")}
                      className={`relative z-10 w-24 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        activeTab === "after"
                          ? "text-white"
                          : "text-zinc-400"
                      }`}
                    >
                      After
                    </button>
                    <motion.div
                      layoutId="toggle-pill"
                      className="absolute top-1 bottom-1 bg-white/20 backdrop-blur-sm border border-white/10 shadow-xs rounded-lg"
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
                        <div className="text-xs font-bold text-red-400 uppercase tracking-wider">
                          Manual Planning Research
                        </div>
                        <ul className="space-y-3.5">
                          <li className="flex gap-3 text-zinc-300 text-sm">
                            <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <span>Architect spends 2-3 days cross-referencing planning books.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-300 text-sm">
                            <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <span>ChatGPT misreads tabular content and planning nuances.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-300 text-sm">
                            <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <span>No verified answers before client presentations.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-300 text-sm">
                            <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <span>Feasibility decision delayed by consultant fees and timelines.</span>
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
                        <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                          Planning Law Chatbot
                        </div>
                        <ul className="space-y-3.5">
                          <li className="flex gap-3 text-zinc-300 text-sm">
                            <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>Enter plot location and get instant feasibility rules.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-300 text-sm">
                            <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>Get a formatted feasibility PDF ready for meetings.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-300 text-sm">
                            <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>Verified answers based on active zoning codes.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-300 text-sm">
                            <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>Present key constraints to client on day one.</span>
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

        {/* Demo Mode - Full Screen Video Controls */}
        <AnimatePresence>
          {isDemoMode && (
            <>
              {/* Top bar with close button */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="fixed top-0 left-0 right-0 z-[70] flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/60 to-transparent"
              >
                <button
                  onClick={exitDemoMode}
                  className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <Minimize2 className="w-4 h-4" />
                  Exit Full Screen
                </button>
                <span className="text-xs text-white/50 font-medium">
                  Planning Law Chatbot Demo
                </span>
              </motion.div>

              {/* Subtle hint at bottom */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70]"
              >
                <p className="text-xs text-white/40 flex items-center gap-2">
                  <span>Press</span>
                  <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/60 text-[10px] font-mono">Esc</kbd>
                  <span>or scroll/wheel to exit</span>
                </p>
              </motion.div>

              {/* Backdrop click to exit */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[45] cursor-pointer"
                onClick={exitDemoMode}
              />
            </>
          )}
        </AnimatePresence>
      </section>

      {/* ─── Problem Section ─── */}
      <section className="bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
              The Friction
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              The planning bottleneck
            </h2>
            <div className="w-16 h-1 bg-[var(--color-lime)] rounded-full" />
          </div>
          <div className="lg:col-span-7 text-zinc-650 dark:text-zinc-450 text-base sm:text-lg leading-relaxed space-y-6">
            <p>Architects and developers spend days manually researching what can be built on a plot before the design process even starts. Planning books are fragmented across regulations from multiple authorities.</p>
            <p>ChatGPT misreads tables and nuances in construction law. The result is delayed feasibility, uncertain client conversations, and consultant fees that eat into the project budget. The Planning Law Chatbot automates this, turning planning research from a multi-day manual task into a one-minute answer.</p>
          </div>
        </div>
      </section>

      {/* ─── How it Works Section ─── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
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
                Enter the plot location and the tool returns a comprehensive feasibility summary:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <li className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-400 font-semibold items-start">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                      <span>Maximum height in storeys</span>
                    </li>
                    <li className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-400 font-semibold items-start">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                      <span>Floor area ratio (FAR) constraints</span>
                    </li>
                    <li className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-400 font-semibold items-start">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                      <span>Allowable use classes</span>
                    </li>
                    <li className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-400 font-semibold items-start">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                      <span>Sanitary requirements per code</span>
                    </li>
                    <li className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-400 font-semibold items-start">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                      <span>Parking ratios per area GFA</span>
                    </li>
                    <li className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-400 font-semibold items-start">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                      <span>Heritage & overlay restrictions</span>
                    </li>
              </ul>

              <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <h4 className="font-bold text-base">Key Outputs:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <h5 className="font-bold text-sm">Interactive Chat</h5>
                      <p className="text-xs text-zinc-500 leading-normal">Ask follow-up questions about clauses and deviations.</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <h5 className="font-bold text-sm">Feasibility PDF</h5>
                      <p className="text-xs text-zinc-500 leading-normal">Download a formatted summary ready for client meetings.</p>
                    </div>
                </div>
              </div>

              {/* __EXTRA_SOLUTION__ */}

              <p className="text-xs text-zinc-500 dark:text-zinc-400 italic pt-4">
                Technology: FIDIC-grade accuracy trained on 50+ international planning codes including UAE, Sri Lanka, KSA, UK, and Australia regulations.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Video Showcase (Apple.com style) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
            className="lg:col-span-6 relative"
          >
            {/* Glow gradient behind the video */}
            <div className="absolute -inset-8 bg-gradient-to-br from-emerald-400/10 via-lime-300/10 to-transparent rounded-[48px] blur-3xl opacity-60" />

            {/* Floating animation wrapper */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Device-style video frame */}
              <div className="relative bg-white/5 backdrop-blur-xl border border-zinc-200/20 dark:border-zinc-800/30 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/5">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover rounded-3xl"
                >
                  <source src="/videos/planning-law-chatbot-showcase.mp4" type="video/mp4" />
                </video>

                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Caption bar */}
              <div className="mt-3 flex items-center justify-between px-1">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
                  Product in Action
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  Beira Lake · Sri Lanka
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
              From plot data to cost model in four automated steps
            </p>
          </motion.div>

          {/* What feeds in / feeds out - animated info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pb-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3 hover:shadow-md transition-shadow duration-300"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">What feeds in</span>
              <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Plot location data</h4>
              <p className="text-sm text-zinc-500">Accepts street address, coordinates, or parcel boundaries.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3 hover:shadow-md transition-shadow duration-300"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">What it feeds into</span>
              <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Design Brief + Cost Plan</h4>
              <p className="text-sm text-zinc-500">The feasibility summary constrains the design brief and provides inputs for cost planning.</p>
            </motion.div>
          </div>

          {/* 4-Step Interactive Image Cards */}
          {(() => {
            const workflowSteps = [
              {
                number: 1,
                title: "Input",
                subtitle: "Plot Data Entry",
                description: "Plot location data (address, coordinates, or parcel boundaries).",
                image: "/images/planning-law-chatbot/step-1-input.png",
                detail: "Enter a street address, GPS coordinates, or parcel boundary. The chatbot instantly geocodes and cross-references the location against active planning zones.",
              },
              {
                number: 2,
                title: "Planning Law Chatbot",
                subtitle: "AI Processing",
                description: "Extracts zoning, allowable height, floor area ratio (FAR), and setbacks.",
                image: "/images/planning-law-chatbot/step-2-chatbot.png",
                detail: "FIDIC-grade AI reviews the applicable planning codes for your plot and returns structured feasibility data with source references.",
              },
              {
                number: 3,
                title: "Constraints Feed",
                subtitle: "Envelope Calculation",
                description: "Calculates maximum allowable envelope bounds dynamically.",
                image: "/images/planning-law-chatbot/step-3-constraints.png",
                detail: "Maximum height, FAR, setback distances, heritage overlays, and parking ratios — computed and presented in a clear constraint summary.",
              },
              {
                number: 4,
                title: "Cost Estimate",
                subtitle: "Budget Modeling",
                description: "Cost Plan Calculator models initial construction budget limits.",
                image: "/images/planning-law-chatbot/step-4-cost.png",
                detail: "Feasibility data flows directly into the Cost Plan Calculator. Get GFA-based cost estimates and budget ranges for client presentations.",
              },
            ];

            return (
              <>
                <div className="relative">
                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4">
                    {workflowSteps.map((step, index) => {
                      const isActive = activeWorkflowStep === index;
                      return (
                        <motion.div
                          key={step.number}
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 0.5, delay: index * 0.12 }}
                          whileHover={{ y: -10, scale: 1.02 }}
                          onClick={() => setSelectedImage({ src: step.image, title: `${step.number}. ${step.title}`, step: step.number })}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedImage({ src: step.image, title: `${step.number}. ${step.title}`, step: step.number }); }}
                          className={`group relative bg-white dark:bg-zinc-900/50 rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer ${
                            isActive
                              ? "border-primary/40 ring-2 ring-primary/20 shadow-lg shadow-primary/5"
                              : "border-zinc-200 dark:border-zinc-800"
                          }`}
                        >
                          {/* Active step glow pulse */}
                          {isActive && (
                            <motion.div
                              layoutId="workflow-glow"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0.4, 1, 0.4] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none z-0"
                            />
                          )}

                          {/* Step Number Badge */}
                          <div className="absolute top-3 left-3 z-20">
                            <motion.div
                              animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                              transition={{ duration: 1.5, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold shadow-md border-2 transition-all duration-300 ${
                                isActive
                                  ? "bg-primary text-black border-primary shadow-primary/30"
                                  : "bg-zinc-800 text-white border-zinc-600 shadow-black/20 dark:bg-white dark:text-zinc-900 dark:border-zinc-300"
                              }`}
                            >
                              {step.number}
                            </motion.div>
                          </div>

                          {/* View label */}
                          <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-[10px] font-semibold bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-zinc-700 dark:text-zinc-300 px-2 py-1 rounded-full shadow-xs border border-zinc-200/50 dark:border-zinc-700/50">
                              Click to enlarge
                            </span>
                          </div>

                          {/* Image Container */}
                          <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                            <img
                              src={step.image}
                              alt={step.title}
                              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                            />
                            {/* Gradient overlay at bottom */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* Subtle shimmer on active */}
                            {isActive && (
                              <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '200%' }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-5 space-y-2 relative z-10">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-primary' : 'text-zinc-400'}`}>
                                {step.number}. {step.title}
                              </span>
                            </div>
                            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                              {step.description}
                            </p>
                            {/* Expand indicator */}
                            <div className="pt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <span className="text-[10px] font-semibold text-primary">Click to expand</span>
                              <motion.span
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="text-primary text-[10px]"
                              >
                                →
                              </motion.span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Progress dots indicator */}
                  <div className="flex items-center justify-center gap-3 mt-10 lg:hidden">
                    {[0, 1, 2, 3].map((i) => (
                      <button
                        key={i}
                        onClick={() => setActiveWorkflowStep(i)}
                        className="relative cursor-pointer"
                      >
                        <motion.div
                          animate={{
                            width: activeWorkflowStep === i ? 24 : 8,
                            backgroundColor: activeWorkflowStep === i ? "var(--color-primary, #a3e635)" : "rgb(212 212 212)",
                          }}
                          transition={{ duration: 0.3 }}
                          className="h-2 rounded-full"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Step label under dots */}
                  <motion.p
                    key={activeWorkflowStep}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center text-xs text-zinc-400 font-medium mt-3 lg:hidden"
                  >
                    {workflowSteps[activeWorkflowStep].number}. {workflowSteps[activeWorkflowStep].title} — {workflowSteps[activeWorkflowStep].subtitle}
                  </motion.p>

                  {/* Desktop step captions */}
                  <div className="hidden lg:flex items-center justify-center gap-4 mt-6">
                    {workflowSteps.map((step, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveWorkflowStep(i)}
                        className={`text-xs font-semibold cursor-pointer transition-colors duration-300 ${
                          activeWorkflowStep === i
                            ? "text-primary font-bold"
                            : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                        }`}
                      >
                        {step.number}. {step.subtitle}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col"
            >
              {/* Top bar */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 text-primary flex items-center justify-center text-xs font-bold">
                    {selectedImage.step}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {selectedImage.title}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden bg-zinc-900/50 border border-white/10 shadow-2xl">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[75vh] object-contain"
                />
              </div>

              {/* Bottom hint */}
              <p className="text-[11px] text-zinc-500 text-center mt-3">
                Click outside the image or press ESC to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Pricing & Quick Facts Section ─── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-16">
            <div className="space-y-6">
              <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">Deployment</span>
              <h2 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">Pricing & Availability</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                                    <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-xs">
                      <span className="text-xs text-zinc-450 font-bold uppercase tracking-widest">Enterprise One-Off</span>
                      <p className="text-3xl font-black tracking-tight">$4,500</p>
                      <p className="text-xs text-zinc-500">Includes setup &amp; jurisdiction configuration.</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-xs">
                      <span className="text-xs text-zinc-450 font-bold uppercase tracking-widest">Annual Support</span>
                      <p className="text-3xl font-black tracking-tight">$400<span className="text-sm font-normal text-zinc-450">/year</span></p>
                      <p className="text-xs text-zinc-500">Covers quarterly zoning code updates.</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-xs">
                      <span className="text-xs text-zinc-450 font-bold uppercase tracking-widest">Architects Sub</span>
                      <p className="text-3xl font-black tracking-tight">$15<span className="text-sm font-normal text-zinc-450">/month</span></p>
                      <p className="text-xs text-zinc-500">Sri Lanka local package (discussing with SLIA).</p>
                    </div>
              </div>
            </div>

            {/* ─── Related Products (moved from sidebar) ─── */}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: 0.1 }}
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
                    <span className="text-zinc-500 font-semibold shrink-0">Zoning Stage</span>
                    <span className="font-bold text-zinc-850 dark:text-zinc-200 text-right">Pre-design &amp; Feasibility</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 gap-4">
                    <span className="text-zinc-500 font-semibold shrink-0">Best For</span>
                    <span className="font-bold text-zinc-850 dark:text-zinc-200 text-right">Architects, Developers</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 gap-4">
                    <span className="text-zinc-500 font-semibold shrink-0">Target Markets</span>
                    <span className="font-bold text-zinc-850 dark:text-zinc-200 text-right">UAE, LK, KSA, UK, AU</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 gap-4">
                    <span className="text-zinc-500 font-semibold shrink-0">Time to Implement</span>
                    <span className="font-bold text-zinc-850 dark:text-zinc-200 text-right">1-2 Weeks</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 gap-4">
                    <span className="text-zinc-500 font-semibold shrink-0">Coverage Updates</span>
                    <span className="font-bold text-zinc-850 dark:text-zinc-200 text-right">Quarterly</span>
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
              Why choose Planning Law Chatbot
            </h2>
          </div>

          <div className="relative pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0 }}
                    whileHover={{ y: -12, scale: 1.02 }}
                    className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-col justify-between shadow-sm hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Manual Research</h4>
                      <div className="h-0.5 bg-zinc-200 dark:bg-zinc-800 w-full" />
                      <ul className="space-y-3 pt-2 text-sm text-zinc-650 dark:text-zinc-400">
                                                <li className="flex gap-3 items-start">
                          <X className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                          2-3 days per feasibility check
                        </li>
                        <li className="flex gap-3 items-start">
                          <X className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                          Different approaches per architect
                        </li>
                        <li className="flex gap-3 items-start">
                          <X className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                          No audit trail for sources
                        </li>
                        <li className="flex gap-3 items-start">
                          <X className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                          Expensive consultant fees
                        </li>
                      </ul>
                    </div>
                  </motion.div>
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
                      <h4 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">Planning Law Chatbot</h4>
                      <div className="h-0.5 bg-zinc-800 w-full" />
                      <ul className="space-y-3 pt-2 text-sm">
                                                <li className="flex gap-3 items-start">
                          <Check className="w-5 h-5 text-[var(--color-lime)] mt-1 shrink-0" />
                          1 minute per feasibility check
                        </li>
                        <li className="flex gap-3 items-start">
                          <Check className="w-5 h-5 text-[var(--color-lime)] mt-1 shrink-0" />
                          Consistent methodology across firm
                        </li>
                        <li className="flex gap-3 items-start">
                          <Check className="w-5 h-5 text-[var(--color-lime)] mt-1 shrink-0" />
                          All sources documented
                        </li>
                        <li className="flex gap-3 items-start">
                          <Check className="w-5 h-5 text-[var(--color-lime)] mt-1 shrink-0" />
                          Feasibility ready on day one
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0 }}
                    whileHover={{ y: -12, scale: 1.02 }}
                    className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-col justify-between shadow-sm hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">General AI tools (ChatGPT)</h4>
                      <div className="h-0.5 bg-zinc-200 dark:border-zinc-800 w-full" />
                      <ul className="space-y-3 pt-2 text-sm text-zinc-650 dark:text-zinc-400">
                                                <li className="flex gap-3 items-start">
                          <X className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                          Misreads tabular content
                        </li>
                        <li className="flex gap-3 items-start">
                          <X className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                          Not trained on construction law
                        </li>
                        <li className="flex gap-3 items-start">
                          <X className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                          No FIDIC-grade accuracy
                        </li>
                        <li className="flex gap-3 items-start">
                          <X className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                          No jurisdiction-specific updates
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
                              { q: 'Which countries&apos; planning codes does it cover?', a: 'Currently trained on UAE, Sri Lanka, KSA, UK, and Australia regulations. We are expanding coverage quarterly. Contact us if your target market is not yet included.' },
                { q: 'Can it handle plot overlays or special zones?', a: 'Yes. If a plot is in a heritage zone, industrial area, or special development corridor, the tool identifies the overlay and applies the relevant restrictions.' },
                { q: 'How is this different from ChatGPT?', a: 'ChatGPT is not trained on construction law and misreads tabular content in planning books. Our tool is FIDIC-grade accurate and trained specifically on planning regulations across multiple jurisdictions.' },
                { q: 'Can we integrate it into our own portal?', a: 'Yes, via API. We have integration packages for architecture firms and consultancies. Pricing starts at USD 2,000/month.' },
                { q: 'What if the planning rules change?', a: 'We update the knowledge base quarterly. Your maintenance fee covers these updates automatically.' },
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
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-300 shrink-0 ${
                      activeFaq === idx ? "rotate-180" : ""
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
            Know what you can build before you design it.
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            See how Planning Law Chatbot answers planning questions before your team picks up the phone.
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
