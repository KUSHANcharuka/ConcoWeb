"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  FileSpreadsheet,
  Box,
  Bot,
  BarChart3,
  FileText,
  Calculator,
  Users,
  Zap,
  Download,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RevitToBOQPage() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const demoSectionRef = useRef<HTMLDivElement>(null);

  // Auto-toggle Before/After every 3.5 seconds
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

  const scrollToDemo = useCallback(() => {
    demoSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-lime/30 selection:text-black">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#FAFAF8] dark:bg-zinc-950">
        {/* Background gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(202,236,69,0.15),rgba(250,250,248,0.95))]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-to-br from-[var(--color-lime)]/10 via-transparent to-yellow-400/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAF8]/60 via-transparent to-[#FAFAF8]/80 dark:from-zinc-950/60 dark:to-zinc-950/80" />
        </div>

        {/* Hero Content */}
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
            {/* Left Column - Text Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-lime)]/15 border border-[var(--color-lime)]/30 text-zinc-700 dark:text-zinc-300">
                  Tendering & Estimation
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400">
                  QS Firms · Middle East & Sri Lanka
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
                Revit to BOQ Plugin
              </h1>

              <p className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 font-medium leading-normal">
                The BOQ that used to take three weeks. Done today.
              </p>

              <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
                Your estimators are manually measuring every element in a Revit model, applying standard measurement rules, and typing the bill by hand — the same process, every project. Concolabs automates the measurement so your team focuses on the advice clients are actually paying for.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  onClick={scrollToDemo}
                  size="lg"
                  className="rounded-xl px-6 py-6 font-bold shadow-lg cursor-pointer bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl px-6 py-6 font-bold shadow-md cursor-pointer bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime)]/90"
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
              <div className="relative bg-white dark:bg-zinc-900 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50">
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
                      layoutId="rtb-toggle-pill"
                      className="absolute top-1 bottom-1 bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-lg"
                      animate={{ left: activeTab === "before" ? 4 : 92, width: 92 }}
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
                          Manual Measurement
                        </div>
                        <ul className="space-y-3.5">
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>QS isolates elements visually in the Revit model.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>Rules of measurement applied manually line by line.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>Rates are looked up and typed into Excel by hand.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>Process takes weeks and is prone to human error.</span>
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
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                          Revit to BOQ Plugin
                        </div>
                        <ul className="space-y-3.5">
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Identifies all elements directly from Revit take-off files.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>AI predicts and applies rates for each line item automatically.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Existing non-AI tools stop at measurement. This goes further.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Priced BOQ generated in hours, ready for expert review.</span>
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
      <section ref={demoSectionRef} className="py-24 px-6 bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800">
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
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Revit to BOQ Plugin Demo
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
              Watch how building elements are identified, measured, and priced using AI rate prediction instantly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}

          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-zinc-300/40 dark:shadow-zinc-900/40">
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
      <section className="bg-[#FAFAF8] dark:bg-zinc-950 py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
              The Friction
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Your value is in judgment, not in measurement.
            </h2>
            <div className="w-16 h-1 bg-[var(--color-lime)] rounded-full" />
          </div>
          <div className="lg:col-span-7 text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed space-y-6">
            <p>
              Your estimators are manually measuring every element in a Revit model, applying standard measurement rules, and typing the bill by hand — it's the exact same process for every project.
            </p>
            <p>
              This manual data entry creates a bottleneck during the tendering phase, increasing the risk of human error and pulling expert Quantity Surveyors away from strategic cost advice. Concolabs automates the measurement and the rate predictions, so your team focuses entirely on the advice clients are actually paying for.
            </p>
          </div>
        </div>
      </section>

      {/* ─── How it Works / Workflow Section ─── */}
      <section className="bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">
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
              Steps to use this product
            </h2>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto">
              From standard Revit model to a fully priced Bill of Quantities in 4 steps.
            </p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute top-12 left-[10%] right-[10%] h-0.5 bg-zinc-200 dark:bg-zinc-800 hidden md:block" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  number: 1,
                  title: "Revit Integration",
                  description: "Plugin extracts take-off files and raw data natively from your Revit model.",
                  icon: Box,
                  highlight: false,
                },
                {
                  number: 2,
                  title: "Element Identification",
                  description: "AI groups and identifies all building elements according to standard measurement rules.",
                  icon: Settings,
                  highlight: false,
                },
                {
                  number: 3,
                  title: "AI Rate Prediction",
                  description: "Machine learning predicts and maps historical pricing rates for each line item.",
                  icon: Bot,
                  highlight: true,
                },
                {
                  number: 4,
                  title: "Priced BOQ Output",
                  description: "Generates a fully formatted, priced Bill of Quantities ready for your expert review.",
                  icon: FileSpreadsheet,
                  highlight: false,
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.12 }}
                  className="relative text-center space-y-3"
                >
                  <div
                    className={`relative z-10 w-24 h-24 mx-auto rounded-2xl flex items-center justify-center shadow-sm ${step.highlight
                      ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-xl"
                      : i === 0
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : i === 1
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                          : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                      }`}
                  >
                    <step.icon className="w-10 h-10" />
                    {step.highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[var(--color-lime)] text-black text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">
                        The Concolabs Edge
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Step {step.number}</span>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{step.title}</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center pt-10"
            >
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">Handoff:</span> The BOQ produced here becomes the measurement baseline for site valuation and interim payment certificates in the construction stage using MeasureonAir.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Pricing & Quick Facts Section ─── */}
      <section className="py-24 px-6 max-w-6xl mx-auto bg-[#FAFAF8] dark:bg-zinc-950">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-16">
            <div className="space-y-6">
              <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">Deployment</span>
              <h2 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">Pricing &amp; Availability</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-xs">
                  <span className="text-xs text-zinc-450 font-bold uppercase tracking-widest">Monthly Subscription</span>
                  <p className="text-3xl font-black tracking-tight">$1,000<span className="text-sm font-normal text-zinc-450">/mo</span></p>
                  <p className="text-xs text-zinc-500">Includes core plugin features and rate prediction module with customisations.</p>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-xs">
                  <span className="text-xs text-zinc-450 font-bold uppercase tracking-widest">Enterprise / Custom</span>
                  <p className="text-3xl font-black tracking-tight">Contact Us</p>
                  <p className="text-xs text-zinc-500">For multi-office deployment and complex proprietary historical rate training.</p>
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
                {[
                  {
                    href: "/learnmore/acc-to-boq",
                    title: "ACC to BOQ",
                    desc: "Alternative — built natively for Autodesk Construction Cloud. Best for UK/AUS markets.",
                    tag: "Alternative",
                  },
                  {
                    href: "/learnmore/measureonair",
                    title: "MeasureonAir",
                    desc: "Next step — push the BOQ to site for digital valuation and interim certificates.",
                    tag: "Construction",
                  },
                  {
                    href: "/learnmore/cost-plan-calculator",
                    title: "Cost Plan Calculator",
                    desc: "Pre-design — sets the budget frame that your BOQ works within.",
                    tag: "Pre-design",
                  },
                ].map((rel, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                  >
                    <Link
                      href={rel.href}
                      className="group block p-5 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
                            {rel.title}
                          </h4>
                          <p className="text-xs text-zinc-500 leading-relaxed">{rel.desc}</p>
                        </div>
                        <span className="shrink-0 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                          {rel.tag}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-[10px] font-semibold text-primary">Learn more</span>
                        <ChevronRight className="w-3 h-3 text-primary transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
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
                {[
                  { label: "Stage", value: "Tendering" },
                  { label: "Best For", value: "QS Consultancies" },
                  { label: "Target Regions", value: "Middle East, Sri Lanka" },
                  { label: "Status", value: "Scaling" },
                  { label: "Pricing", value: "$1,000/mo" },
                ].map((fact, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 gap-4">
                    <span className="text-zinc-500 font-semibold shrink-0">{fact.label}</span>
                    <span className="font-bold text-zinc-850 dark:text-zinc-200 text-right">{fact.value}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Button
                  asChild
                  className="w-full rounded-xl py-6 font-bold shadow-md bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime)]/90 cursor-pointer"
                >
                  <a
                    href="/pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buy Products →
                  </a>
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
              Why choose Revit to BOQ
            </h2>
          </div>

          <div className="relative pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              {/* Manual Method */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-col justify-between shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                    Manual Method (Excel)
                  </h4>
                  <div className="h-0.5 bg-zinc-200 dark:bg-zinc-800 w-full" />
                  <ul className="space-y-3 pt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <li className="flex gap-3 items-start"><X className="w-4 h-4 text-red-500 mt-1 shrink-0" />Weeks to produce a single bill</li>
                    <li className="flex gap-3 items-start"><X className="w-4 h-4 text-red-500 mt-1 shrink-0" />Manual element measuring</li>
                    <li className="flex gap-3 items-start"><X className="w-4 h-4 text-red-500 mt-1 shrink-0" />Prone to human error & omissions</li>
                    <li className="flex gap-3 items-start"><X className="w-4 h-4 text-red-500 mt-1 shrink-0" />Rates looked up manually</li>
                  </ul>
                </div>
              </motion.div>

              {/* Revit to BOQ - highlighted */}
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
                  <h4 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">Revit to BOQ Plugin</h4>
                  <div className="h-0.5 bg-zinc-800 w-full" />
                  <ul className="space-y-3 pt-2 text-sm">
                    <li className="flex gap-3 items-start text-zinc-100"><Check className="w-5 h-5 text-[var(--color-lime)] mt-1 shrink-0" />Done in hours instead of weeks</li>
                    <li className="flex gap-3 items-start text-zinc-100"><Check className="w-5 h-5 text-[var(--color-lime)] mt-1 shrink-0" />Automated element identification</li>
                    <li className="flex gap-3 items-start text-zinc-100"><Check className="w-5 h-5 text-[var(--color-lime)] mt-1 shrink-0" />AI predicts rates automatically</li>
                    <li className="flex gap-3 items-start text-zinc-100"><Check className="w-5 h-5 text-[var(--color-lime)] mt-1 shrink-0" />Direct native Revit integration</li>
                  </ul>
                </div>
              </motion.div>

              {/* Traditional Take-off tools */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.12 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-col justify-between shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                    Standard Take-off Tools
                  </h4>
                  <div className="h-0.5 bg-zinc-200 dark:bg-zinc-800 w-full" />
                  <ul className="space-y-3 pt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <li className="flex gap-3 items-start"><X className="w-4 h-4 text-red-500 mt-1 shrink-0" />Stop at measurement only</li>
                    <li className="flex gap-3 items-start"><X className="w-4 h-4 text-red-500 mt-1 shrink-0" />No rate prediction engine</li>
                    <li className="flex gap-3 items-start"><X className="w-4 h-4 text-red-500 mt-1 shrink-0" />Require heavy manual configuration</li>
                    <li className="flex gap-3 items-start">
                      <Check className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>Better than manual Excel, but still incomplete</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="py-24 px-6 max-w-4xl mx-auto space-y-12 bg-[#FAFAF8] dark:bg-zinc-950">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
            Questions
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Can the AI rate prediction adapt to our firm's historical pricing?",
              a: "Yes. The AI model can be securely trained on your firm's historical priced BOQs and market rates to ensure the predictions match your pricing strategies.",
            },
            {
              q: "What measurement standards are supported?",
              a: "The tool is pre-configured to apply standard measurement rules commonly used in the Middle East and Sri Lanka. Specific standards (like POMI, NRM2) can be selected.",
            },
            {
              q: "Does it replace our estimators?",
              a: "No. It automates the tedious transcription and measuring process. Your QS professionals will still need to review the output, adjust specific complex rates, and apply their commercial judgment before finalising.",
            },
            {
              q: "How does this differ from the ACC to BOQ product?",
              a: "Revit to BOQ works as a plugin directly inside your local or server-based Revit environment. ACC to BOQ operates natively on the cloud for firms primarily using Autodesk Construction Cloud (usually preferred in UK/Australia).",
            },
            {
              q: "Can we export the final BOQ to Excel?",
              a: "Yes. The output can be exported to standard Excel formats, PDF, or integrated directly into your ERP system.",
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left font-bold text-sm tracking-tight text-zinc-950 dark:text-zinc-50 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-300 shrink-0 ml-4 ${activeFaq === idx ? "rotate-180" : "rotate-0"
                    }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="p-6 pt-0 text-sm text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/60 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Final CTA Footer ─── */}
      <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
            Automate the measurement. Keep the expertise.
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            See how the Revit to BOQ Plugin compresses the BOQ production cycle from weeks into hours.
          </p>
          <div className="pt-4 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-xl px-8 py-6 font-bold shadow-md bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime)]/90 cursor-pointer"
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
