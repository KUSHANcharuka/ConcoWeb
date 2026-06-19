"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer";
import {
  ArrowLeft,
  Play,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  Minimize2,
  Upload,
  Cpu,
  Settings,
  FileText,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComparisonGrid from "@/components/learnmore/comparison-grid";
import Carousel from "@/components/learnmore/carousel";

// Apple-style animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

// Apple-Style Accordion Component
function AppleAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-md"
        >
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full flex items-center justify-between p-6 text-left cursor-pointer group"
          >
            <span className="font-bold text-zinc-900 dark:text-zinc-100 pr-4 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
              {item.q}
            </span>
            <motion.span
              animate={{ rotate: openIndex === idx ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.87, 0, 0.13, 1] }}
            >
              <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {openIndex === idx && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 text-zinc-650 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-4">
                  {item.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

const carouselSteps = [
  {
    id: "step1",
    stepNumber: "01",
    title: "Upload Drawing",
    description: "Upload the structural drawing in PDF or image format. The system supports complex layouts with overlapping reinforcement details.",
    image: "/images/2d_structural_drawing.png",
  },
  {
    id: "step2",
    stepNumber: "02",
    title: "Notation Identification",
    description: "Our vision model scans and parses all rebar notation standards including diameter, bar count, and steel grade.",
    image: "/images/cv_blueprint_analysis.png",
  },
  {
    id: "step3",
    stepNumber: "03",
    title: "Measurement Extraction",
    description: "The system calculates span lengths, clear covers, hooks, bends, and spatial distributions automatically.",
    image: "/images/2d_structural_drawing.png",
  },
  {
    id: "step4",
    stepNumber: "04",
    title: "Schedule Generation",
    description: "AI agents compile the complete reinforcement schedule with bar bending diagrams and material weights.",
    image: "/images/3d_revit_model.png",
  },
];

export default function AutoReinforcementPage() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Parallax scroll refs
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroScrollProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(heroScrollProgress, [0, 1], [0, -100]);

  // Section refs for scroll-triggered animations
  const problemRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const workflowRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const isProblemInView = useInView(problemRef, { once: true, margin: "-100px" });
  const isSolutionInView = useInView(solutionRef, { once: true, margin: "-100px" });
  const isWorkflowInView = useInView(workflowRef, { once: true, margin: "-100px" });
  const isPricingInView = useInView(pricingRef, { once: true, margin: "-100px" });
  const isComparisonInView = useInView(comparisonRef, { once: true, margin: "-100px" });
  const isFaqInView = useInView(faqRef, { once: true, margin: "-100px" });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const demoVideoUrl = "https://drive.google.com/file/d/1XBMGXEbDW-rCS--nutSVrk7YtacQY0KW/preview";

  const exitDemoMode = useCallback(() => {
    if (!isDemoMode) return;
    setIsDemoMode(false);
  }, [isDemoMode]);

  const enterDemoMode = useCallback(() => {
    setIsDemoMode(true);
  }, []);

  useEffect(() => {
    if (!isDemoMode) return;
    const handleWheel = () => exitDemoMode();
    const handleTouchMove = () => exitDemoMode();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitDemoMode();
    };
    window.addEventListener("wheel", handleWheel, { once: true, passive: true });
    window.addEventListener("touchmove", handleTouchMove, { once: true, passive: true });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDemoMode, exitDemoMode]);

  // Auto-cycle before/after tabs
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
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-lime/30 selection:text-black">
      <Navbar />

      {/* ─── Hero Section ─── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden bg-[#FAFAF8] dark:bg-zinc-950"
      >
        <motion.div
          style={!isDemoMode ? { y: heroY, scale: heroScale } : {}}
          className={`transition-all duration-700 ease-in-out ${isDemoMode ? "fixed inset-0 z-50 bg-black" : "absolute inset-0 z-0 pointer-events-none"
            }`}
          onClick={() => isDemoMode && exitDemoMode()}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-black" />
          <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-gradient-to-br from-lime/20 via-lime/10 to-transparent rounded-full blur-[130px] opacity-70 animate-pulse" style={{ animationDuration: '9s' }} />
          <div className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] bg-gradient-to-tr from-lime/10 via-zinc-400/5 to-transparent rounded-full blur-[140px] opacity-65" />
          <div className="absolute inset-0 bg-white/45 dark:bg-zinc-950/65 backdrop-blur-[1px]" />

          <div
            className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03] text-zinc-900 dark:text-white"
            style={{
              backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </motion.div>

        <div className="absolute top-28 left-6 z-30">
          <Link
            href="/learnmore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-black/60 backdrop-blur-md text-sm font-semibold text-zinc-650 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-all hover:bg-white/80 dark:hover:bg-black/80 hover:scale-105 active:scale-95 group shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Link>
        </div>

        <motion.div
          style={!isDemoMode ? { y: textY, opacity: heroOpacity } : {}}
          className={`relative w-full z-10 transition-opacity duration-500 ${isDemoMode ? "opacity-0 pointer-events-none" : ""
            }`}
        >
          <div className="px-6 pt-32 pb-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >


                <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.05] uppercase">
                  Auto Reinforcement
                </motion.h1>

                <motion.p variants={fadeInUp} className="text-2xl sm:text-3xl text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed max-w-xl">
                  Rebar schedules from drawings.
                  <br />
                  <span className="text-emerald-600 dark:text-lime font-bold">Automatically.</span>
                </motion.p>

                <motion.p variants={fadeInUp} className="text-sm sm:text-base text-zinc-650 dark:text-zinc-400 leading-relaxed max-w-xl font-medium">
                  Computer vision reads rebar notations, lengths, and spans from structural drawings and produces a complete reinforcement schedule. No manual notation counting, no Excel, no errors.
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
                  <Button onClick={enterDemoMode} variant="outline" size="lg" className="rounded-2xl px-8 py-7 font-bold shadow-sm cursor-pointer border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 transition-transform hover:scale-105">
                    <Play className="w-4 h-4 mr-2 text-emerald-600 dark:text-lime fill-emerald-600 dark:fill-lime" />
                    Watch Demo
                  </Button>
                  <Button asChild size="lg" className="rounded-2xl px-8 py-7 font-bold shadow-xl shadow-lime/15 cursor-pointer bg-lime text-black hover:bg-lime/90 border-0 transition-transform hover:scale-105">
                    <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                      Book a Demo
                    </a>
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column - Before/After Widget */}
            <motion.div
              initial={{ opacity: 0, x: 100, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:col-span-5"
            >
              <div className="relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8 border-b border-zinc-200 dark:border-white/10 pb-5">
                  <h3 className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">
                    Compare Workflows
                  </h3>
                  <div className="relative flex bg-zinc-150/80 dark:bg-zinc-950/80 p-1.5 rounded-2xl w-52 justify-between border border-zinc-200/50 dark:border-zinc-850/50">
                    <button
                      onClick={() => handleTabClick("before")}
                      className={`relative z-10 w-24 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${activeTab === "before" ? "text-zinc-900" : "text-zinc-550 dark:text-zinc-400"
                        }`}
                    >
                      Before
                    </button>
                    <button
                      onClick={() => handleTabClick("after")}
                      className={`relative z-10 w-24 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${activeTab === "after" ? "text-zinc-900" : "text-zinc-550 dark:text-zinc-400"
                        }`}
                    >
                      After
                    </button>
                    <motion.div
                      layoutId="toggle-pill-rebar"
                      className="absolute top-1.5 bottom-1.5 bg-white dark:bg-zinc-800 shadow-sm rounded-xl border border-zinc-200/50 dark:border-zinc-700/50"
                      animate={{
                        left: activeTab === "before" ? 6 : 102,
                        width: 96,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  </div>
                </div>

                <div className="min-h-[280px] flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {activeTab === "before" ? (
                      <motion.div
                        key="before"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        <div className="text-xs font-bold text-red-500 uppercase tracking-wider">
                          Manual Rebar Scheduling
                        </div>
                        <ul className="space-y-4">
                          {[
                            "Open structural drawing",
                            "Identify every rebar notation (B25, 4L12)",
                            "Measure every span and length",
                            "Identify rebar radius and position",
                            "Calculate total weight & type in Excel",
                            "2–3 weeks, highly error-prone"
                          ].map((item, i) => (
                            <li key={i} className="flex gap-3 text-zinc-650 dark:text-zinc-350 text-sm bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50">
                              <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="after"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        <div className="text-xs font-bold text-emerald-600 dark:text-lime uppercase tracking-wider">
                          Auto Reinforcement Plugin
                        </div>
                        <ul className="space-y-4">
                          {[
                            "Upload structural drawing set",
                            "Vision reads notations, spans, lengths",
                            "AI agents generate complete schedule",
                            "Schedule produced with bending diagrams",
                            "2–3 days, fully automated",
                            "Consistent results across projects"
                          ].map((item, i) => (
                            <li key={i} className="flex gap-3 text-zinc-650 dark:text-zinc-350 text-sm bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50">
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
          </div>
        </motion.div>

        {/* Demo Mode Overlay */}
        <AnimatePresence>
          {isDemoMode && (
            <>
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, delay: 0.2 }} className="fixed top-0 left-0 right-0 z-[70] flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/60 to-transparent">
                <button onClick={exitDemoMode} className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors cursor-pointer">
                  <Minimize2 className="w-4 h-4" />
                  Exit Full Screen
                </button>
                <span className="text-xs text-white/50 font-medium">Auto Reinforcement Plugin Demo</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }} className="fixed inset-0 z-[55] flex items-center justify-center p-8">
                <div className="relative w-full max-w-6xl aspect-video rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl border border-white/10 flex flex-col items-center justify-center">
                  <iframe src={demoVideoUrl} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, delay: 1.5 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70]">
                <p className="text-xs text-white/40 flex items-center gap-2">
                  <span>Press</span>
                  <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/60 text-[10px] font-mono">Esc</kbd>
                  <span>or scroll/wheel to exit</span>
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[45] cursor-pointer bg-black/80 backdrop-blur-sm" onClick={exitDemoMode} />
            </>
          )}
        </AnimatePresence>
      </section>

      {/* ─── Problem Section ─── */}
      <section ref={problemRef} className="relative py-32 px-6 bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={isProblemInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:col-span-5 space-y-6"
            >
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
                The Friction
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight uppercase">
                The most tedious task in estimating
              </h2>
              <div className="w-20 h-1.5 bg-lime rounded-full" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={isProblemInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:col-span-7 space-y-6"
            >
              <p className="text-xl text-zinc-650 dark:text-zinc-300 leading-relaxed font-medium">Reinforcement scheduling is consistently cited as the single most time-consuming task in structural estimating.</p>
              <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">An estimator has to read rebar notations from structural drawings, measure every span, calculate every length, identify position and radius, then compile a complete schedule in Excel. One large drawing can take a full day. A typical project has dozens of drawings.</p>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-relaxed">Auto Reinforcement Plugin automates this entirely: computer vision reads the drawing, AI generates the schedule, no manual steps required.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Solution Section - Snap Carousel ─── */}
      <section ref={solutionRef} className="relative py-24 px-6 bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-150 dark:border-zinc-850 pb-10">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                The Solution
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.1] uppercase">
                How it works
              </h2>
              <p className="text-zinc-550 dark:text-zinc-400 text-base sm:text-lg font-medium">
                Upload your plans, let our computer vision match bar markings, and export standard fabrication-ready bending schedules.
              </p>
            </div>
          </div>

          <div className="w-full">
            <Carousel items={carouselSteps} />
          </div>
        </div>
      </section>

      {/* ─── Bento Capabilities Section ─── */}
      <section ref={workflowRef} className="bg-zinc-950 text-white py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-10">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-bold text-emerald-600 dark:text-lime uppercase tracking-widest block">
                Capabilities
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] uppercase">
                Rebar detailing power
              </h2>
              <p className="text-zinc-400 text-base sm:text-lg font-medium">
                Deep structural intelligence packed into interactive, automated bento layouts.
              </p>
            </div>

            <div className="flex md:justify-end items-center shrink-0">
              <Button
                asChild
                size="lg"
                className="rounded-xl px-6 py-5 font-bold shadow-md bg-white text-black hover:bg-zinc-100 border-0 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                  Book a Demo →
                </a>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">

            {/* Left Column Tall Card */}
            <div className="lg:row-span-2 bg-zinc-900/40 border border-zinc-900 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-zinc-800 transition-all duration-300 shadow-sm">
              <div className="space-y-4">
                <span className="text-[9px] font-bold text-emerald-600 dark:text-lime uppercase tracking-widest block">Notations Scanner</span>
                <h3 className="text-2xl font-bold tracking-tight text-white">Full Notation Recognition</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Support for complex overlapping schedules, stirrup parameters, clear cover rules, and hooks automatically.
                </p>
              </div>

              <div className="mt-10 bg-zinc-950 border border-zinc-900 rounded-2xl p-4 shadow-sm space-y-4">
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[9px] font-extrabold uppercase tracking-wider">
                  <span className="px-2.5 py-1.5 bg-lime text-black rounded-lg">Indian Standards</span>
                  <span className="px-2.5 py-1.5 bg-zinc-900 text-zinc-450 rounded-lg">ACI Code</span>
                </div>

                <div className="bg-zinc-900/60 rounded-xl p-3 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-lime animate-ping" />
                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Selected code</span>
                  </div>
                  <p className="text-[10px] font-mono text-zinc-300 bg-zinc-950/80 p-2.5 rounded-lg border border-zinc-850 leading-normal">
                    "BS 8666 / IS 2502 Reinforcement Rules"
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column Wide Card */}
            <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-900 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row justify-between gap-8 overflow-hidden relative group shadow-xl">
              <div className="flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-lime uppercase tracking-widest block">3D detailing engine</span>
                  <h3 className="text-2xl font-bold tracking-tight text-white leading-tight">Match rebar sizes and geometries on a live flow canvas</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Instantly translates 2D schedules into fully-formed 3D rebar elements that map perfectly to Revit libraries.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-lime animate-ping" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-lime">ACC Synced Detailing</span>
                </div>
              </div>

              {/* Graphical flowchart mockup */}
              <div className="flex-1 bg-zinc-950/60 border border-zinc-900 rounded-2xl p-6 min-h-[190px] relative overflow-hidden flex flex-col justify-center shadow-inner">
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
                    <span className="text-[8px] font-bold text-white block">Rebar 3D</span>
                    <span className="text-[6px] text-emerald-600 dark:text-lime font-black uppercase tracking-wider">Coordinated</span>
                  </div>
                </div>

                <div className="absolute bottom-[24px] left-[20px] z-10 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                  <span className="text-[9px] font-bold text-zinc-300">2D Notation</span>
                </div>

                {/* Collaborative Cursors (yellow active style) */}
                <div className="absolute bottom-[48px] right-[88px] z-20 flex items-center gap-1 bg-lime text-black px-2 py-0.5 rounded-md text-[8px] font-extrabold tracking-wider shadow-md">
                  <svg className="w-2 h-2 fill-black" viewBox="0 0 24 24">
                    <path d="M7 2l12 11.2-5.8.8 3.8 6.5-2.2 1.3-3.8-6.5-4 4.7V2z" />
                  </svg>
                  Detailer AI
                </div>
              </div>
            </div>

            {/* Bottom Left Card */}
            <div className="bg-[#12130e] text-white border border-lime/15 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-lime/30 transition-all duration-300 shadow-md">
              <div className="space-y-4">
                <span className="text-[9px] font-bold text-emerald-600 dark:text-lime uppercase tracking-widest block">Bar-bending diagrams</span>
                <h3 className="text-xl font-bold tracking-tight text-white leading-tight">Code Compliance</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Generates precise bending profiles, hook types, and scheduling matrices aligned to national rules.
                </p>
              </div>
              <div className="mt-8 flex justify-end">
                <span className="text-xl font-bold text-zinc-700 group-hover:text-emerald-600 dark:group-hover:text-lime transition-colors duration-300 font-serif">→</span>
              </div>
            </div>

            {/* Bottom Right Card */}
            <div className="bg-[#0f1115] text-white border border-zinc-900 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-zinc-800 transition-all duration-300 shadow-md">
              <div className="space-y-4">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Fabrication exports</span>
                <h3 className="text-xl font-bold tracking-tight text-white leading-tight">Direct to Factory</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Export directly to CSV, XLS, or send bending parameters directly to rebar cutting machinery.
                </p>
              </div>
              <div className="mt-8 flex justify-end">
                <span className="text-xl font-bold text-zinc-700 group-hover:text-emerald-600 dark:group-hover:text-lime transition-colors duration-300 font-serif">→</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Pricing & Quick Facts ─── */}
      <section ref={pricingRef} className="py-32 px-6 bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-8 space-y-16">
              <div className="space-y-8">
                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Deployment</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-zinc-955 dark:text-zinc-50 tracking-tight uppercase">Pricing & Availability</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-sm hover:shadow-xl transition-shadow duration-300">
                    <span className="text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block">Monthly Subscription</span>
                    <p className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">$800<span className="text-sm font-normal text-zinc-400">/month</span></p>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">Includes customization and setup for your structural design standards.</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-955 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550 mb-6">Related Products</h4>
                  <ul className="space-y-4">
                    <li>
                      <Link href="/learnmore/revit-to-boq" className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 hover:underline transition-colors flex items-center justify-between">
                        <span>Revit to BOQ</span>
                        <span className="text-zinc-400 dark:text-zinc-500 text-sm">BOQ automation</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/learnmore/2d-drawing-to-boq" className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 hover:underline transition-colors flex items-center justify-between">
                        <span>2D Drawing to BOQ</span>
                        <span className="text-zinc-400 dark:text-zinc-500 text-sm">Other element BOQ</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/learnmore/auto-conversion-2d-to-3d" className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 hover:underline transition-colors flex items-center justify-between">
                        <span>Auto Conversion 2D to 3D</span>
                        <span className="text-zinc-400 dark:text-zinc-500 text-sm">Drawing conversion</span>
                      </Link>
                    </li>
                  </ul>
                  <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <Link href="/learnmore" className="text-zinc-900 dark:text-zinc-100 font-bold hover:underline flex items-center gap-1">
                      View full suite <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Facts Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={isPricingInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-4 lg:sticky lg:top-32"
            >
              <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-lg space-y-8">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-4 uppercase">Quick Facts</h3>
                <div className="space-y-5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-550 font-semibold">Stage</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">Tendering</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-555">Best For</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-right">Contractors, QS consultancies</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-555">Regions</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-right">UAE, Australia</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-555">Time to implement</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">1–2 weeks</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-555">Status</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">Custom / R&D</span>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full rounded-2xl py-7 font-bold shadow-xl shadow-lime/15 bg-lime text-black hover:bg-lime/90 border-0 transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  <a href="/pricing" target="_blank" rel="noopener noreferrer">
                    Buy Products &rarr;
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Comparison Section ─── */}
      <div ref={comparisonRef}>
        <ComparisonGrid
          sectionTitle="Why choose Auto Reinforcement Plugin"
          card1={{
            title: "Traditional Route",
            subtitle: "Manual measurement",
            features: [
              "1–2 days per drawing spent measuring",
              "Tedious and highly error-prone task",
              "Spans and lengths measured entirely by hand",
              "No consistency across projects and estimators",
            ],
            metric: { value: "1-2", label: "DAYS" },
            button: { text: "Traditional Route", href: "/pricing" },
          }}
          card2={{
            title: "Auto Reinforcement",
            subtitle: "Auto Reinforcement Plugin",
            features: [
              "30 minutes per drawing processing time",
              "Fully automated and highly consistent results",
              "All measurements extracted automatically",
              "Reinforcement schedule is deterministic",
            ],
            metric: { value: "30", label: "MINUTES" },
            button: { text: "Book A Demo", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
          }}
          card3={{
            title: "Other Tools",
            subtitle: "Other rebar tools",
            features: [
              "Still require estimator to validate notations",
              "Estimator must manually correct computer errors",
              "Saves only 20–30% of estimator's total time",
              "No other complete automated schedule product",
            ],
            metric: { value: "UNRELIABLE", label: "FAST /" },
            button: { text: "Other Tools", href: "https://chat.openai.com" },
          }}
        />
      </div>

      {/* ─── FAQ Section ─── */}
      <section ref={faqRef} className="py-32 px-6 bg-zinc-50 dark:bg-zinc-900/20 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 60 }} animate={isFaqInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-zinc-650 mb-16">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-4">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-550 uppercase">Frequently Asked Questions</h2>
          </motion.div>

          <AppleAccordion
            items={[
              { q: "What standards does it recognize?", a: "Indian Standards (IS), British Standards (BS), American Concrete Institute (ACI), Australian standards, and common Middle Eastern conventions. Custom standards can be added." },
              { q: "Can it handle hand-drawn structural drawings?", a: "Not ideally — hand-written notations are harder to read reliably. Best results with CAD-produced drawings. Can integrate with Hand Drawn to AutoCAD for conversion first." },
              { q: "What happens if notation is unclear or non-standard?", a: "Unclear notations are flagged for manual review. You always see which elements were automated and which need validation." },
              { q: "Does it produce bar bending diagrams?", a: "Yes, optional. The schedule includes standard bend configurations. Custom bending diagrams available with custom implementation." },
              { q: "How is accuracy validated?", a: "A structural engineer reviews every schedule before delivery. Accuracy rate is 95%+ for standard drawings." },
            ]}
          />
        </div>
      </section>

      {/* ─── FOOTER CTA ─── */}
      <section ref={ctaRef} className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <motion.h2 initial={{ opacity: 0, y: 40 }} animate={isCtaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-zinc-955 dark:text-zinc-50 uppercase">
            Stop counting rebar by hand. <br /><span className="text-zinc-500 dark:text-zinc-400">Let the computer do it.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={isCtaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed text-base sm:text-lg font-medium">
            See how Auto Reinforcement Plugin eliminates the most tedious estimation task.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isCtaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }} className="pt-4 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 py-6 font-bold shadow-xl border-0 bg-lime text-zinc-955 hover:bg-lime/90 cursor-pointer"
            >
              <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                Book a Demo &rarr;
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
