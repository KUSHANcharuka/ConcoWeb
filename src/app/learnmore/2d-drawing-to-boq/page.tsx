
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
  ChevronRight,
  ChevronDown,
  Check,
  X,
  FileText,
  FileSearch,
  ArrowUpRight,
  Box,
  Calculator,
  Eye,
  Layers,
  Play,
  Minimize2,
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
            <span className="font-bold text-zinc-600 text-zinc-900 dark:text-zinc-100 pr-4 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
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
                <div className="px-6 pb-6 text-zinc-600 text-zinc-600 dark:text-zinc-400 leading-relaxed border-lime/30 border-zinc-100 dark:border-zinc-800 pt-4">
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
    title: "Upload 2D Drawing",
    description: "Start by uploading the structural drawing in PDF, DWG, or TIFF format directly into our secure cloud workspace.",
    image: "/images/2d_structural_drawing.png",
  },
  {
    id: "step2",
    stepNumber: "02",
    title: "Computer Vision Analysis",
    description: "Lines, thickness, symbols, dimensions, and structural annotations are scanned and parsed by our advanced vision AI.",
    image: "/images/cv_blueprint_analysis.png",
  },
  {
    id: "step3",
    stepNumber: "03",
    title: "Element Categorization",
    description: "AI automatically identifies and groups components (slabs, beams, columns, foundation walls) based on structural rules.",
    image: "/images/2d_structural_drawing.png",
  },
  {
    id: "step4",
    stepNumber: "04",
    title: "Measurement Extraction",
    description: "Areas, lengths, volumes, and material thicknesses are calculated dynamically from annotations and drawing geometries.",
    image: "/images/3d_revit_model.png",
  },
  {
    id: "step5",
    stepNumber: "05",
    title: "BOQ Generation",
    description: "A complete, priced BOQ is created instantly with custom rate tables applied, ready for your QS team to download.",
    image: "/images/cv_blueprint_analysis.png",
  },
];

export default function Drawing2DToBOQPage() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroScrollProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(heroScrollProgress, [0, 1], [0, -100]);

  const problemRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const workflowRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const isProblemInView = useInView(problemRef, { once: true, margin: "-100px" });
  const isSolutionInView = useInView(solutionRef, { once: true, margin: "-100px" });
  const isWorkflowInView = useInView(workflowRef, { once: true, margin: "-100px" });
  const isPricingInView = useInView(pricingRef, { once: true, margin: "-100px" });
  const isComparisonInView = useInView(comparisonRef, { once: true, margin: "-100px" });
  const isFaqInView = useInView(faqRef, { once: true, margin: "-100px" });

  // Demo Mode Handlers
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

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev === "before" ? "after" : "before"));
    }, 4000);
    return () => clearInterval(timer);
  }, [autoToggleKey]);

  const demoSectionRef = useRef<HTMLDivElement>(null);

  const scrollToDemo = useCallback(() => {
    demoSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleTabClick = (tab: "before" | "after") => {
    setActiveTab(tab);
    setAutoToggleKey((k) => k + 1);
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-lime/30 selection:text-black">
      <Navbar />

      {/* ─── Apple-Style Hero Section ─── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-zinc-50 dark:bg-zinc-950 pt-16">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-gradient-to-br from-lime/20 via-lime/10 to-transparent rounded-full blur-[130px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse" style={{ animationDuration: '9s' }} />
          <div className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] bg-gradient-to-tr from-lime/10 via-zinc-400/5 to-transparent rounded-full blur-[140px] mix-blend-multiply dark:mix-blend-screen opacity-65" />
          <div className="absolute inset-0 bg-white/45 dark:bg-zinc-950/65 backdrop-blur-[1px]" />
          
          {/* Blueprint grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
              backgroundSize: "44px 44px",
            }}
          />
        </div>

        <div className="absolute top-28 left-6 z-30">
          <Link
            href="/learnmore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-sm font-semibold text-zinc-650 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-all hover:bg-white/80 dark:hover:bg-black/80 hover:scale-105 active:scale-95 group shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Link>
        </div>

        <motion.div
          style={{ y: textY, opacity: heroOpacity }}
          className="relative w-full z-10"
        >
          <div className="px-6 pt-32 pb-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.div variants={fadeInUp} className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-lime/10 border border-lime/30 text-zinc-900 dark:text-white backdrop-blur-md">
                    Estimation &amp; Tendering
                  </span>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.05]"
                >
                  2D Drawing
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-950 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-300 dark:to-zinc-500">
                    to BOQ
                  </span>
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-300 font-semibold leading-relaxed max-w-xl"
                >
                  Priced BOQ straight from any PDF drawing.
                  <br />
                  <span className="text-lime dark:text-lime font-bold">No 3D model required.</span>
                </motion.p>

                <motion.p
                  variants={fadeInUp}
                  className="text-sm sm:text-base text-zinc-655 dark:text-zinc-400 leading-relaxed max-w-xl"
                >
                  Not every project starts with a BIM model. When you work from 2D structural plans, you still need precise quantities. Our AI vision engine reads PDF drawings, extracts dimensions, and automatically maps elements to priced BOQ formats.
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
                  <Button
                    onClick={scrollToDemo}
                    variant="outline"
                    size="lg"
                    className="rounded-2xl px-8 py-7 font-bold shadow-sm cursor-pointer border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 transition-transform hover:scale-105"
                  >
                    <Play className="w-4 h-4 mr-2 text-lime dark:text-lime fill-lime dark:fill-lime" />
                    Watch Demo
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="rounded-2xl px-8 py-7 font-bold shadow-xl shadow-lime/15 cursor-pointer bg-lime text-black hover:bg-lime/90 border-0 transition-transform hover:scale-105"
                  >
                    <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                      Book a Demo
                    </a>
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 105, rotateY: -12 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:col-span-5"
            >
              <div className="relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl border border-white dark:border-zinc-800 rounded-[2rem] p-8 shadow-2xl shadow-lime/5">
                <div className="flex items-center justify-between mb-8 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-5">
                  <h3 className="font-bold text-zinc-900 dark:text-white tracking-tight">
                    Compare Workflows
                  </h3>
                  <div className="relative flex bg-zinc-150/80 dark:bg-zinc-950/80 p-1.5 rounded-xl w-52 justify-between border border-zinc-200/50 dark:border-zinc-800/50 shadow-inner">
                    <button
                      onClick={() => handleTabClick("before")}
                      className={`relative z-10 w-24 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${activeTab === "before" ? "text-zinc-900 dark:text-white" : "text-zinc-500"}`}
                    >
                      Before
                    </button>
                    <button
                      onClick={() => handleTabClick("after")}
                      className={`relative z-10 w-24 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${activeTab === "after" ? "text-zinc-900 dark:text-white" : "text-zinc-500"}`}
                    >
                      After
                    </button>
                    <motion.div
                      layoutId="toggle-pill"
                      className="absolute top-1.5 bottom-1.5 bg-white dark:bg-zinc-800 shadow-md border border-zinc-200/50 dark:border-zinc-700/50 rounded-lg"
                      animate={{
                        left: activeTab === "before" ? 6 : 100,
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
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                      >
                        <div className="text-zinc-550 dark:text-zinc-400 font-bold uppercase tracking-wider text-xs">
                          Manual BOQ from 2D drawing
                        </div>
                        <ul className="space-y-3.5">
                          {[
                            "Open 2D PDF drawing",
                            "Manually measure elements by hand",
                            "Identify all items in the drawing",
                            "Type measurements into Excel",
                            "Look up or calculate rates",
                            "1–2 weeks per BOQ, high error rate"
                          ].map((item, i) => (
                            <li key={i} className="flex gap-3 text-zinc-650 dark:text-zinc-350 text-sm bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50">
                              <X className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5" />
                              <span className="font-medium">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="after"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                      >
                        <div className="text-zinc-550 dark:text-zinc-400 font-bold uppercase tracking-wider text-xs">
                          2D Drawing to BOQ
                        </div>
                        <ul className="space-y-3.5">
                          {[
                            "Upload 2D PDF",
                            "Computer vision reads the drawing",
                            "BOQ with measurements generated",
                            "AI predicts rates automatically",
                            "1–2 hours including review",
                            "Extends automation to non-BIM projects"
                          ].map((item, i) => (
                            <li key={i} className="flex gap-3 text-zinc-650 dark:text-zinc-350 text-sm bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50">
                              <Check className="w-5 h-5 text-lime shrink-0 mt-0.5" />
                              <span className="font-medium">{item}</span>
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
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, delay: 0.2 }} className="fixed top-0 left-0 right-0 z-[70] flex items-center justify-between px-6 py-4 bg-lime/20 from-black/60 to-transparent">
                <button onClick={exitDemoMode} className="flex items-center gap-2 text-zinc-600 font-semibold text-white/80 hover:text-white transition-colors cursor-pointer">
                  <Minimize2 className="w-4 h-4" />
                  Exit Full Screen
                </button>
                <span className="text-zinc-600 text-white/50 font-medium">2D Drawing to BOQ Demo</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }} className="fixed inset-0 z-[55] flex items-center justify-center p-8">
                <div className="relative w-full max-w-6xl aspect-video rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl border border-white/10 flex flex-col items-center justify-center">
                  {/* Placeholder for future video */}
                  <Play className="w-12 h-12 mb-4 opacity-30 text-white" />
                  <p className="text-zinc-600 font-semibold text-white/50 uppercase tracking-widest">Demo video coming soon</p>
                  {/* <iframe src="YOUR_VIDEO_URL_HERE" className="w-full h-full absolute inset-0" allow="autoplay; encrypted-media" allowFullScreen /> */}
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, delay: 1.5 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70]">
                <p className="text-zinc-600 text-white/40 flex items-center gap-2">
                  <span>Press</span>
                  <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/60 text-zinc-600 font-mono">Esc</kbd>
                  <span>or scroll/wheel to exit</span>
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[45] bg-black/80 backdrop-blur-sm cursor-pointer" onClick={exitDemoMode} />
            </>
          )}
        </AnimatePresence>
      </section>

      {/* ─── Problem Section - Apple Style ─── */}
      <section ref={problemRef} className="relative py-32 px-6 bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isProblemInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-5 space-y-6"
          >
            <span className="text-zinc-600 font-bold text-zinc-450 uppercase tracking-widest block">
              The Challenge
            </span>
            <h2 className="text-zinc-600 sm:text-zinc-600 font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Not every project is BIM
            </h2>
            <div className="w-16 h-1 text-zinc-600 rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isProblemInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-7 space-y-6 text-zinc-600 sm:text-zinc-600 text-zinc-600 dark:text-zinc-400 leading-relaxed"
          >
            <p>
              Not every project comes with a 3D Revit model. Early-stage projects have 2D structural drawings. Non-BIM firms submit 2D PDFs. Budget-constrained projects use traditional 2D drawings.
            </p>
            <p>
              But your estimators still need to produce a BOQ from that drawing — which means manually measuring every element by hand, identifying items from line work, and building the estimate in Excel. It is error-prone and takes days.
            </p>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
              2D Drawing to BOQ extends the automation benefits of BIM-based BOQ tools to projects that are entirely 2D.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Solution Section - Snap Carousel ─── */}
      <section ref={solutionRef} className="relative py-24 px-6 bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-150 dark:border-zinc-850 pb-10">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block">
                The Solution
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.1] uppercase">
                How it works
              </h2>
              <p className="text-zinc-550 dark:text-zinc-400 text-base sm:text-lg font-medium">
                Upload your drawings, let the AI model elements, and export structured Excel or ERP-ready estimates.
              </p>
            </div>
          </div>

          <div className="w-full">
            <Carousel items={carouselSteps} themeColor="#ecf000" />
          </div>
        </div>
      </section>

      {/* ─── Integration Section - Bento Grid ─── */}
      <section ref={workflowRef} className="bg-zinc-950 text-white border-t border-zinc-900 py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-10">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-bold text-lime uppercase tracking-widest block">
                Workflow Hook
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] uppercase">
                Fits into your workflow
              </h2>
              <p className="text-zinc-400 text-base sm:text-lg font-medium">
                Integrates seamlessly from raw structural drawings to professional Quantity Surveying tools.
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
                <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block">Input Formats</span>
                <h3 className="text-2xl font-bold tracking-tight text-white">Upload Any Document</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Support for multi-page PDF plans, DWG exports, or scanned blueprints. Drag, drop, and start quantifying.
                </p>
              </div>
              
              <div className="mt-10 bg-zinc-950 border border-zinc-900 rounded-2xl p-4 shadow-sm space-y-4">
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[9px] font-extrabold uppercase tracking-wider">
                  <span className="px-2.5 py-1.5 bg-white text-black rounded-lg">All Files</span>
                  <span className="px-2.5 py-1.5 bg-zinc-900 text-zinc-400 rounded-lg">PDF</span>
                  <span className="px-2.5 py-1.5 bg-zinc-900 text-zinc-400 rounded-lg">DWG</span>
                </div>
                
                <div className="bg-zinc-900/60 rounded-xl p-3 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-lime" />
                    <span className="text-[8px] font-bold text-zinc-550 uppercase tracking-widest">Selected sheet</span>
                  </div>
                  <p className="text-[10px] font-mono text-zinc-350 bg-zinc-950/80 p-2.5 rounded-lg border border-zinc-850 leading-normal">
                    "Sheet_S02_Slab_Detailing.pdf"
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column Wide Card */}
            <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-900 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row justify-between gap-8 overflow-hidden relative group shadow-xl">
              <div className="flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-[9px] font-bold text-lime uppercase tracking-widest block">AI Vision Engine</span>
                  <h3 className="text-2xl font-bold tracking-tight text-white leading-tight">Extract structured elements from line geometries</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Our model processes raster vector outlines, detects dimension text annotations, and classifies concrete/steel elements accurately.
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-lime animate-ping" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-lime">Live Analysis Active</span>
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
                    <span className="text-[8px] font-bold text-white block">BOQ Table</span>
                    <span className="text-[6px] text-lime font-black uppercase tracking-wider">Generated</span>
                  </div>
                </div>

                <div className="absolute bottom-[24px] left-[20px] z-10 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                  <span className="text-[9px] font-bold text-zinc-300">2D Plan</span>
                </div>

                {/* Collaborative Cursors (yellow active style) */}
                <div className="absolute bottom-[48px] right-[88px] z-20 flex items-center gap-1 bg-lime text-black px-2 py-0.5 rounded-md text-[8px] font-extrabold tracking-wider shadow-md">
                  <svg className="w-2 h-2 fill-black" viewBox="0 0 24 24">
                    <path d="M7 2l12 11.2-5.8.8 3.8 6.5-2.2 1.3-3.8-6.5-4 4.7V2z" />
                  </svg>
                  AI Estimator
                </div>

                <div className="absolute top-[52px] left-[80px] z-20 flex items-center gap-1 bg-zinc-800 text-white px-2 py-0.5 rounded-md text-[8px] font-bold tracking-wider shadow-md border border-zinc-700">
                  <svg className="w-2 h-2 fill-white" viewBox="0 0 24 24">
                    <path d="M7 2l12 11.2-5.8.8 3.8 6.5-2.2 1.3-3.8-6.5-4 4.7V2z" />
                  </svg>
                  QS Consultant
                </div>
              </div>
            </div>

            {/* Bottom Left Card */}
            <div className="bg-[#12130e] text-white border border-lime/15 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-lime/30 transition-all duration-300 shadow-md">
              <div className="space-y-4">
                <span className="text-[9px] font-bold text-lime uppercase tracking-widest block">Cost Database Sync</span>
                <h3 className="text-xl font-bold tracking-tight text-white leading-tight">Instant Estimating</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Automatically pairs recognized elements with regional pricing standards or custom builder rate lists.
                </p>
              </div>
              <div className="mt-8 flex justify-end">
                <span className="text-xl font-bold text-zinc-700 group-hover:text-lime transition-colors duration-300 font-serif">→</span>
              </div>
            </div>

            {/* Bottom Right Card */}
            <div className="bg-[#0f1115] text-white border border-zinc-900 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-zinc-800 transition-all duration-300 shadow-md">
              <div className="space-y-4">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">System Handoff</span>
                <h3 className="text-xl font-bold tracking-tight text-white leading-tight">Export Anywhere</h3>
                <p className="text-zinc-450 text-sm leading-relaxed">
                  Export directly to Excel sheets, ERP solutions, or import into Autodesk Construction Cloud sheets.
                </p>
              </div>
              <div className="mt-8 flex justify-end">
                <span className="text-xl font-bold text-zinc-700 group-hover:text-lime transition-colors duration-300 font-serif">→</span>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ─── Pricing & Quick Facts ─── */}
      <section ref={pricingRef} className="py-32 px-6 bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={isPricingInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="lg:col-span-8 space-y-16"
            >
              <div className="space-y-8">
                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Deployment</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight uppercase">Pricing & Availability</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-sm hover:shadow-xl transition-shadow duration-300">
                    <span className="text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block">Custom Project Pricing</span>
                    <p className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">$1,000–$3,000</p>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">Per drawing set, varying by complexity.</p>
                  </div>
                  <div className="p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-sm hover:shadow-xl transition-shadow duration-300">
                    <span className="text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block">Enterprise</span>
                    <p className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">Annual License</p>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">Available on request for high-volume firms.</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550 mb-6">Related Products</h4>
                  <ul className="space-y-4">
                    <li>
                      <Link href="/learnmore/revit-to-boq" className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 hover:underline transition-colors flex items-center justify-between">
                        <span>Revit to BOQ</span>
                        <span className="text-zinc-400 dark:text-zinc-500 text-sm">3D alternative</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/learnmore/auto-conversion-2d-to-3d" className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 hover:underline transition-colors flex items-center justify-between">
                        <span>Auto Conversion 2D to 3D</span>
                        <span className="text-zinc-400 dark:text-zinc-500 text-sm">Convert to 3D first</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/learnmore/auto-reinforcement" className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 hover:underline transition-colors flex items-center justify-between">
                        <span>Auto Reinforcement Plugin</span>
                        <span className="text-zinc-400 dark:text-zinc-500 text-sm">Rebar scheduling</span>
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
            </motion.div>

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
                    <span className="text-zinc-500 font-semibold">Stage</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">Tendering</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500 font-semibold">Best For</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-right">QS firms, contractors, consultancies</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500 font-semibold">Regions</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-right">Middle East, Sri Lanka, Australia</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500 font-semibold">Implementation</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">2–3 weeks per project</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500 font-semibold">Status</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">Custom / R&D</span>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full rounded-2xl py-7 font-bold shadow-xl shadow-lime/15 bg-lime text-black hover:bg-lime/90 border-0 transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  <Link href="/pricing">
                    Buy Products &rarr;
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Comparison Section ─── */}
      <div ref={comparisonRef}>
        <ComparisonGrid
          sectionTitle="Why choose 2D Drawing to BOQ"
          card1={{
            title: "Traditional Route",
            subtitle: "Manual measurement",
            features: [
              "1–2 weeks spent per drawing",
              "Completely manual, high error rate",
              "Dimensions easily missed or misread",
              "No consistency across projects",
            ],
            metric: { value: "1-2", label: "WEEKS" },
            button: { text: "Traditional Route", href: "/pricing" },
          }}
          card2={{
            title: "2D Drawing to BOQ",
            subtitle: "2D Drawing to BOQ Plugin",
            features: [
              "1–2 hours spent per drawing",
              "Automated, consistent measurements",
              "Dimensions extracted, errors visible",
              "Only tool working without a 3D model",
            ],
            metric: { value: "1-2", label: "HOURS" },
            button: { text: "Book A Demo", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
          }}
          card3={{
            title: "Other Tools",
            subtitle: "Other BOQ Tools",
            features: [
              "Require Revit or full 3D model",
              "Cannot process 2D drawings at all",
              "Leave non-BIM projects behind entirely",
              "Forces designers to model in 3D first",
            ],
            metric: { value: "UNRELIABLE", label: "FAST /" },
            button: { text: "Other Tools", href: "https://chat.openai.com" },
          }}
        />
      </div>

      {/* ─── FAQ Section ─── */}
      <section ref={faqRef} className="py-32 px-6 bg-zinc-50 dark:bg-zinc-900/20 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isFaqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-zinc-650 mb-20"
          >
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-4">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 uppercase">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <AppleAccordion
            items={[
              { q: 'Does it work with hand-drawn 2D drawings?', a: 'Not ideally — hand-drawn dimensions are harder to read accurately. Best results with CAD-produced drawings. Hand Drawn to AutoCAD can convert sketches to CAD first.' },
              { q: 'What happens if dimensions are missing or unclear?', a: 'The tool estimates from scale and nearby measurements. Always recommend full dimensioning for best accuracy. Manual review and correction can be requested for critical elements.' },
              { q: 'Can it handle architectural drawings, or only structural?', a: 'Structural drawings are primary. Architectural floor plans work if clear dimensions are shown. Best results with structural.' },
              { q: 'What file formats does it accept?', a: 'PDF primary. DWG, DXF, and TIFF images also accepted. File size limit 50MB.' },
              { q: 'How accurate is the BOQ output?', a: 'Accuracy depends on drawing quality and dimensioning. Typical accuracy is 85–95% for well-dimensioned drawings. All outputs are reviewed for errors before delivery.' },
            ]}
          />
        </div>
      </section>

      {/* ─── Footer CTA ─── */}
      <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-zinc-955 dark:text-zinc-50 uppercase">
            Your 2D drawings don't have to mean manual BOQs.
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            See how 2D Drawing to BOQ automates non-BIM project estimation.
          </p>
          <div className="pt-4 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 py-6 font-bold shadow-xl border-0 bg-lime text-zinc-955 hover:bg-lime/90 cursor-pointer"
            >
              <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
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

