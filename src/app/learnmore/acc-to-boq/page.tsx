"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer";
import {
  ArrowLeft, Play, Calendar, Check, X,
  Cloud, FileSpreadsheet, RefreshCw, Zap, Lock,
  Building, Plus, Minus, FileText, Download, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccToBoqPage() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Video Lightbox State
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoPassword, setVideoPassword] = useState("");
  const [isVideoUnlocked, setIsVideoUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

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

  const handleVideoUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mockup password check
    if (videoPassword.length > 3) {
      setIsVideoUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  // Scroll animations for Apple-like section
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: howItWorksRef,
    offset: ["start start", "end end"]
  });

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-blue-500/30 selection:text-white">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#FAFAF8] dark:bg-zinc-950">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_70%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-400/10 via-transparent to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative w-full z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto px-6 pt-28"
          >
            <Link
              href="/learnmore"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors group"
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
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Tendering
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400">
                  UK & Australia
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.1]">
                Autodesk Construction Cloud <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">to BOQ</span>
              </h1>

              <p className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-300 font-medium leading-normal">
                BOQ from ACC. Instantly repriced as design changes.
              </p>

              <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
                Your UK and Australian clients work in Autodesk Construction Cloud. Generate a BOQ natively from the cloud model — with automatic repricing when design changes. No export, no Excel, no re-entry.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  onClick={() => setIsVideoOpen(true)}
                  variant="outline"
                  size="lg"
                  className="rounded-xl px-6 py-6 font-bold shadow-sm cursor-pointer border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl px-6 py-6 font-bold shadow-md cursor-pointer bg-blue-600 hover:bg-blue-700 text-white border-none"
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="relative bg-white dark:bg-zinc-900 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-900/5">
                <div className="flex items-center justify-between mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <h3 className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-50">
                    Compare Workflows
                  </h3>
                  <div className="relative flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl w-48 justify-between">
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
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm items-start">
                            <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span>Download model data from ACC</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm items-start">
                            <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span>Export to Excel</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm items-start">
                            <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span>Manually apply measurement rules and rates</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm items-start">
                            <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span>When design changes, start over completely</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm items-start font-medium text-red-500/80">
                            <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span>Takes 1–2 weeks per BOQ</span>
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
                        <div className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                          Autodesk Construction Cloud to BOQ
                        </div>
                        <ul className="space-y-3.5">
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm items-start">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Model changes in ACC</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm items-start">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Click &quot;Generate BOQ&quot; directly in cloud</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm items-start">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>BOQ updated with new costs automatically</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm items-start">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Repricing done instantly</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm items-start font-medium text-emerald-500/90">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Takes 5 minutes per BOQ</span>
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

      {/* ─── PROBLEM SECTION ─── */}
      <section className="bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-6">
              Cloud-first workflow.<br />
              <span className="text-zinc-400">Excel-bound BOQ.</span>
            </h2>
            <div className="space-y-6 text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed max-w-3xl mx-auto">
              <p>
                UK and Australian QS firms are moving to Autodesk Construction Cloud for cloud-native collaboration. But the BOQ still gets produced by exporting model data to Excel, manually applying measurement rules, and typing rates.
              </p>
              <p>
                The workflow breaks at the most time-consuming step. When the design changes (and it always does), the cost consultant has to re-export, recalculate, and re-price, a process that takes days.
              </p>
              <p className="font-medium text-zinc-900 dark:text-zinc-200">
                Autodesk Construction Cloud to BOQ builds the BOQ directly in the cloud, eliminating the export step entirely. When design changes, the BOQ reprices automatically.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── APPLE-STYLE "HOW IT WORKS" SCROLL SECTION ─── */}
      <section ref={howItWorksRef} className="bg-zinc-950 relative h-[400vh]">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
          
          {/* Background Elements */}
          <motion.div 
            className="absolute inset-0 z-0 opacity-40"
            style={{
              background: useTransform(
                scrollYProgress,
                [0, 0.33, 0.66, 1],
                [
                  "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 50% 50%, rgba(16,185,129,0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 50% 50%, rgba(249,115,22,0.1) 0%, transparent 50%)",
                ]
              )
            }}
          />

          <div className="absolute top-20 left-0 right-0 text-center z-20">
             <h2 className="text-3xl font-bold tracking-tight text-white/90">How it works</h2>
          </div>

          {/* Central Animated Content */}
          <div className="relative w-full max-w-5xl mx-auto px-6 z-10 flex flex-col items-center justify-center h-full">
            
            {/* Step 1 */}
            <motion.div 
              className="absolute text-center space-y-6 w-full"
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.1, 0.2, 0.3], [1, 1, 0, 0]),
                scale: useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1.1, 1.2]),
                y: useTransform(scrollYProgress, [0, 0.3], [0, -50]),
                pointerEvents: useTransform(scrollYProgress, v => v < 0.25 ? "auto" : "none")
              }}
            >
              <div className="w-24 h-24 mx-auto rounded-3xl bg-blue-500/20 flex items-center justify-center backdrop-blur-xl border border-blue-500/30">
                <Cloud className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">Model updated in ACC</h3>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Architects and designers work in Autodesk Construction Cloud as normal.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              className="absolute text-center space-y-6 w-full"
              style={{
                opacity: useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.5], [0, 1, 1, 0]),
                scale: useTransform(scrollYProgress, [0.2, 0.3, 0.5], [0.9, 1, 1.1]),
                y: useTransform(scrollYProgress, [0.2, 0.5], [50, -50]),
                pointerEvents: useTransform(scrollYProgress, v => (v > 0.25 && v < 0.5) ? "auto" : "none")
              }}
            >
              <div className="w-24 h-24 mx-auto rounded-3xl bg-purple-500/20 flex items-center justify-center backdrop-blur-xl border border-purple-500/30">
                <Zap className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">Generate BOQ</h3>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Cost consultant clicks &quot;Generate BOQ&quot; in ACC — no exports needed.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              className="absolute text-center space-y-6 w-full"
              style={{
                opacity: useTransform(scrollYProgress, [0.4, 0.5, 0.65, 0.75], [0, 1, 1, 0]),
                scale: useTransform(scrollYProgress, [0.4, 0.5, 0.75], [0.9, 1, 1.1]),
                y: useTransform(scrollYProgress, [0.4, 0.75], [50, -50]),
                pointerEvents: useTransform(scrollYProgress, v => (v > 0.5 && v < 0.7) ? "auto" : "none")
              }}
            >
              <div className="w-24 h-24 mx-auto rounded-3xl bg-emerald-500/20 flex items-center justify-center backdrop-blur-xl border border-emerald-500/30">
                <FileSpreadsheet className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">BOQ produced</h3>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Tool identifies all elements, measures them, and applies your firm&apos;s standard current rates.
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div 
              className="absolute text-center space-y-6 w-full"
              style={{
                opacity: useTransform(scrollYProgress, [0.65, 0.75, 1, 1], [0, 1, 1, 1]),
                scale: useTransform(scrollYProgress, [0.65, 0.75, 1], [0.9, 1, 1]),
                y: useTransform(scrollYProgress, [0.65, 1], [50, 0]),
                pointerEvents: useTransform(scrollYProgress, v => v > 0.7 ? "auto" : "none")
              }}
            >
              <div className="w-24 h-24 mx-auto rounded-3xl bg-orange-500/20 flex items-center justify-center backdrop-blur-xl border border-orange-500/30">
                <RefreshCw className="w-10 h-10 text-orange-400" />
              </div>
              <h3 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">Design changes</h3>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                When the model is updated, regenerate the BOQ instantly to see how costs have changed.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES & INTEGRATION ─── */}
      <section className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold text-blue-500 uppercase tracking-widest block mb-2">Capabilities</span>
              <h3 className="text-3xl font-bold text-zinc-950 dark:text-white">Features that empower QS</h3>
            </div>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Live measurement</h4>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">BOQ always reflects current model state, directly pulling from ACC.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Rate tables by location</h4>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">Configure rate tables by project type or location. Your rate data stays in your control.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Version history</h4>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">Track how costs have changed across design iterations with built-in comparison.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Export anywhere</h4>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">Export to CSV, XLS, or directly into your specialist BOQ software when needed.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-8 bg-[#FAFAF8] dark:bg-zinc-950 p-8 sm:p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none">
            <div>
              <span className="text-xs font-bold text-blue-500 uppercase tracking-widest block mb-2">Integration</span>
              <h3 className="text-3xl font-bold text-zinc-950 dark:text-white">Fits into your workflow</h3>
            </div>
            
            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">What feeds in:</p>
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <Cloud className="w-6 h-6 text-blue-500" />
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">Autodesk Construction Cloud model (cloud-native)</span>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-px h-8 bg-zinc-300 dark:bg-zinc-700"></div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">The Process:</p>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-xl border border-blue-200 dark:border-blue-800/50 text-sm font-medium">
                  Design in ACC → Generate BOQ plugin → BOQ with current rates
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-px h-8 bg-zinc-300 dark:bg-zinc-700"></div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">What it feeds into:</p>
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <Check className="w-6 h-6 text-emerald-500" />
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">Tendering & Live cost proposals</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 px-2 mt-2">
                  Client sees cost impact of design changes in real time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTENT WITH SIDEBAR ─── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Main Content */}
          <div className="lg:w-2/3 space-y-20">
            
            {/* Comparison */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-zinc-950 dark:text-white">Why choose ACC to BOQ</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-2xl border border-red-100 dark:border-red-900/30">
                  <h4 className="font-bold text-red-800 dark:text-red-400 mb-4">Export + Excel + Manual</h4>
                  <ul className="space-y-3">
                    <li className="flex gap-2 text-sm text-red-900/70 dark:text-red-300/70"><X className="w-4 h-4 shrink-0" /> 1–2 weeks per BOQ</li>
                    <li className="flex gap-2 text-sm text-red-900/70 dark:text-red-300/70"><X className="w-4 h-4 shrink-0" /> Design changes require re-work</li>
                    <li className="flex gap-2 text-sm text-red-900/70 dark:text-red-300/70"><X className="w-4 h-4 shrink-0" /> Multiple versions, no single truth</li>
                    <li className="flex gap-2 text-sm text-red-900/70 dark:text-red-300/70"><X className="w-4 h-4 shrink-0" /> Client sees proposals days later</li>
                  </ul>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 shadow-lg shadow-emerald-500/5">
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-400 mb-4">ACC to BOQ (Concolabs)</h4>
                  <ul className="space-y-3">
                    <li className="flex gap-2 text-sm text-emerald-900/80 dark:text-emerald-300/80"><Check className="w-4 h-4 shrink-0" /> Minutes per BOQ</li>
                    <li className="flex gap-2 text-sm text-emerald-900/80 dark:text-emerald-300/80"><Check className="w-4 h-4 shrink-0" /> Design changes repriced instantly</li>
                    <li className="flex gap-2 text-sm text-emerald-900/80 dark:text-emerald-300/80"><Check className="w-4 h-4 shrink-0" /> Single cloud source of truth</li>
                    <li className="flex gap-2 text-sm text-emerald-900/80 dark:text-emerald-300/80"><Check className="w-4 h-4 shrink-0" /> Client sees cost impact real time</li>
                  </ul>
                </div>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">Other BOQ Plugins</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Most plugins work in Revit only (not cloud-native) and do not handle repricing on design change well. This is the only native ACC BOQ tool that eliminates export and re-entry entirely.
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-zinc-950 dark:text-white">Pricing & Availability</h3>
              <div className="flex flex-col sm:flex-row gap-6 items-center p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
                <div className="sm:w-1/2 space-y-2 text-center sm:text-left">
                  <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Monthly Subscription</p>
                  <p className="text-4xl font-black text-zinc-900 dark:text-white">USD 1,200<span className="text-lg font-normal text-zinc-500">/mo</span></p>
                  <p className="text-sm text-zinc-500">per firm (includes customisation)</p>
                </div>
                <div className="hidden sm:block w-px h-24 bg-zinc-200 dark:bg-zinc-800"></div>
                <div className="sm:w-1/2 space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <Check className="w-4 h-4 text-emerald-500" /> Integration with Revit standards
                    </li>
                    <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <Check className="w-4 h-4 text-emerald-500" /> 1–2 weeks implementation
                    </li>
                    <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <Check className="w-4 h-4 text-emerald-500" /> Scaling with sales
                    </li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none shadow-sm cursor-pointer" asChild>
                    <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                      Get Started
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-zinc-950 dark:text-white">Frequently Asked Questions</h3>
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
                      className="w-full px-6 py-4 flex items-center justify-between font-semibold text-left text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                    >
                      {faq.q}
                      {activeFaq === i ? <Minus className="w-5 h-5 text-zinc-400" /> : <Plus className="w-5 h-5 text-zinc-400" />}
                    </button>
                    <AnimatePresence>
                      {activeFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-6 pb-4 text-sm text-zinc-600 dark:text-zinc-400">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 w-full space-y-6 lg:sticky lg:top-28">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
              <h4 className="font-bold text-zinc-950 dark:text-white mb-6 uppercase tracking-wider text-sm">Quick Facts</h4>
              
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <span className="text-zinc-500">Stage</span>
                  <span className="font-medium text-zinc-900 dark:text-white">Tendering</span>
                </li>
                <li className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <span className="text-zinc-500">Best for</span>
                  <span className="font-medium text-zinc-900 dark:text-white">QS & Cost Consultancies</span>
                </li>
                <li className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <span className="text-zinc-500">Regions</span>
                  <span className="font-medium text-zinc-900 dark:text-white">UK, Australia (primary)</span>
                </li>
                <li className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <span className="text-zinc-500">Time to implement</span>
                  <span className="font-medium text-zinc-900 dark:text-white">1–2 weeks</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-zinc-500">Pricing</span>
                  <span className="font-medium text-zinc-900 dark:text-white">USD 1,200/month</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#FAFAF8] dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6">
              <h4 className="font-bold text-zinc-950 dark:text-white mb-4 uppercase tracking-wider text-sm">Related Products</h4>
              <div className="space-y-3">
                <Link href="/learnmore/revit-to-boq" className="group flex items-center justify-between p-3 rounded-xl hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Revit to BOQ</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-600" />
                </Link>
                <Link href="/learnmore/cost-plan-calculator" className="group flex items-center justify-between p-3 rounded-xl hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Cost Plan Calculator</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-600" />
                </Link>
                <Link href="/learnmore/measureonair" className="group flex items-center justify-between p-3 rounded-xl hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">MeasureonAir</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-600" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER CTA ─── */}
      <section className="py-32 px-6 bg-blue-600 text-white text-center rounded-t-[3rem] mt-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-black/10 blur-3xl rounded-full"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Let your BOQ grow with your design. Not lag behind it.
          </h2>
          <p className="text-blue-100 text-lg sm:text-xl font-medium max-w-xl mx-auto">
            See how Autodesk Construction Cloud to BOQ keeps costs current in real time.
          </p>
          <div className="pt-4 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full px-10 py-7 text-lg font-bold shadow-2xl bg-white text-blue-600 hover:bg-blue-50 cursor-pointer"
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

      {/* ─── RESTRICTED VIDEO LIGHTBOX ─── */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/90 backdrop-blur-md"
          >
            <div className="absolute inset-0" onClick={() => setIsVideoOpen(false)} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl z-10"
            >
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {!isVideoUnlocked ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">Restricted Content</h3>
                    <p className="text-zinc-400 max-w-md mx-auto text-sm">
                      This demo is internal and restricted. Please enter any access code to continue.
                    </p>
                  </div>
                  
                  <form onSubmit={handleVideoUnlock} className="w-full max-w-sm space-y-4">
                    <input
                      type="password"
                      placeholder="Access Code"
                      value={videoPassword}
                      onChange={(e) => setVideoPassword(e.target.value)}
                      className={`w-full px-4 py-3 bg-zinc-950 border ${passwordError ? 'border-red-500' : 'border-zinc-800'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {passwordError && <p className="text-red-500 text-xs text-left">Incorrect access code.</p>}
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                      Unlock Video
                    </Button>
                    <p className="text-xs text-zinc-500 pt-4">
                      Security Note: This video is restricted. Implement access control before public launch.
                    </p>
                  </form>
                </div>
              ) : (
                <div className="aspect-video bg-black flex items-center justify-center relative">
                  <div className="absolute inset-0 flex items-center justify-center flex-col space-y-4 bg-zinc-900">
                     <p className="text-zinc-400">Video unlocked. Click below to view demo on Google Drive.</p>
                     <a href="https://drive.google.com/file/d/1V0bIZCuIMfOVcrqw2iaIcLcD-pksGPXU/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-2">
                        Open Demo in Google Drive <ArrowUpRight className="w-4 h-4"/>
                     </a>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
