"use client";

import { useState, useEffect, useRef } from "react";
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
  ArrowRight,
  Play,
  Minimize2,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  FileText,
  Camera,
  Upload,
  Cpu,
  Box,
  MessageSquare,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComparisonGrid from "@/components/learnmore/comparison-grid";


// Apple-style animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function HandDrawnToAutoCADPage() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const stepImages = [
    "/images/2d_structural_drawing.png",
    "/images/cv_blueprint_analysis.png",
    "/images/3d_revit_model.png",
  ];

  const stepCaptions = [
    "Upload DXF or DWG structural drawing",
    "Computer vision detects outlines, thickness, and dimensions",
    "3D Revit/IFC model generated, completed via WordToBIM prompts",
  ];

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const heroY = useTransform(heroScrollProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(heroScrollProgress, [0, 1], [0, -100]);

  // Intersection observers for scroll animations
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

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev === "before" ? "after" : "before"));
    }, 3000);
    return () => clearInterval(timer);
  }, [autoToggleKey]);

  // Exit video mode on wheel/touch/escape and scroll back to hero
  const exitVideoMode = () => {
    if (!isVideoPlaying) return;
    setIsVideoPlaying(false);
    heroRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isVideoPlaying) return;
    const handleWheel = () => exitVideoMode();
    const handleTouchMove = () => exitVideoMode();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitVideoMode();
    };
    window.addEventListener("wheel", handleWheel, { once: true, passive: true });
    window.addEventListener("touchmove", handleTouchMove, { once: true, passive: true });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVideoPlaying]);

  const handleTabClick = (tab: "before" | "after") => {
    setActiveTab(tab);
    setAutoToggleKey((k) => k + 1);
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-lime/30 selection:text-black">
      <Navbar />



      {/* ─── Apple-Style Hero Section ─── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-[#FAFAF8]">
        {/* Animated Background with Video */}
        <motion.div
          style={!isVideoPlaying ? { y: heroY, scale: heroScale } : {}}
          className={`transition-all duration-700 ease-in-out ${isVideoPlaying
            ? "fixed inset-0 z-50 bg-black"
            : "absolute inset-0 z-0"
            }`}
          onClick={() => isVideoPlaying && exitVideoMode()}
        >
          {/* Background Video */}
          <video
            src="/videos/hand-drawn-to-autocad/hero-bg.mp4"
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Overlay for readability - reduced when video playing */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${isVideoPlaying ? 'bg-black/30' : 'bg-[#FAFAF8]/60 dark:bg-black/50'}`} />
          <div className={`absolute inset-0 bg-gradient-to-b transition-opacity duration-500 ${isVideoPlaying ? 'from-black/20 via-transparent to-black/40' : 'from-[#FAFAF8]/60 via-transparent to-[#FAFAF8]/90'}`} />

          {/* Floating sketch elements - hidden during demo mode */}
          {!isVideoPlaying && (
            <>
              <motion.div
                aria-hidden="true"
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-32 right-20 w-32 h-32 bg-white/40 backdrop-blur-sm rounded-2xl border border-zinc-200/50 shadow-lg"
              >
                <div className="p-4">
                  <div className="w-full h-2 bg-zinc-300 rounded mb-2" />
                  <div className="w-3/4 h-2 bg-zinc-200 rounded mb-2" />
                  <div className="w-1/2 h-2 bg-zinc-200 rounded" />
                </div>
              </motion.div>

              <motion.div
                aria-hidden="true"
                animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-40 left-16 w-40 h-28 bg-white/40 backdrop-blur-sm rounded-2xl border border-zinc-200/50 shadow-lg"
              >
                <div className="p-3">
                  <div className="w-full h-1.5 bg-zinc-300 rounded mb-1.5" />
                  <div className="w-2/3 h-1.5 bg-zinc-200 rounded mb-1.5" />
                  <div className="w-4/5 h-1.5 bg-zinc-200 rounded" />
                </div>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Breadcrumb */}
        <div className="absolute top-28 left-6 z-30">
          <Link
            href="/learnmore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-black/60 backdrop-blur-md text-sm font-semibold text-zinc-650 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-all hover:bg-white/80 dark:hover:bg-black/80 hover:scale-105 active:scale-95 group shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Learn More
          </Link>
        </div>

        {/* Hero Content */}
        <motion.div
          style={!isVideoPlaying ? { y: textY, opacity: heroOpacity } : {}}
          className={`relative w-full z-10 transition-opacity duration-500 ${isVideoPlaying ? 'opacity-0 pointer-events-none' : ''}`}
        >
          <div className="px-6 pt-32 pb-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="lg:col-span-7 space-y-8">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.div variants={fadeInUp} className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-primary/10 border border-primary/20 text-primary">
                    Design
                  </span>
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-zinc-200/50 border border-zinc-300 text-zinc-600">
                    UK & Australia
                  </span>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-950 leading-[1.05] product-title-sweep"
                >
                  Hand Drawn
                  <br />
                  
                    to AutoCAD
                  
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-2xl sm:text-3xl text-zinc-500 font-medium leading-relaxed max-w-xl"
                >
                  From drawing to working 3D model,
                  <br />
                  <span className="text-zinc-400">without the manual rebuild.</span>
                </motion.p>

                <motion.p
                  variants={fadeInUp}
                  className="text-lg text-zinc-600 leading-relaxed max-w-xl"
                >
                  Computer vision reads your 2D DXF structural drawing and converts elements straight into 3D BIM, accurate to a solid working level. It comes paired with WordToBIM, our Revit plugin that models elements straight from a text prompt, so your modellers add and complete elements by typing what they need instead of drawing them by hand. Slab automation is production-ready now.
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
                  <Button
                    onClick={() => setIsVideoPlaying(true)}
                    variant="outline"
                    size="lg"
                    className="rounded-2xl px-8 py-7 font-bold shadow-sm cursor-pointer border-zinc-300 hover:bg-zinc-100 hover:scale-105 transition-all duration-300"
                  >
                    <Play className="w-5 h-5 mr-2 text-primary" />
                    Watch Demo
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="rounded-2xl px-8 py-7 font-bold shadow-lg cursor-pointer bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime)]/90 hover:scale-105 transition-all duration-300"
                  >
                    <a
                      href="/pricing"
                    >
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Buy Products →
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
              <div className="relative bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-[2rem] p-8 shadow-2xl shadow-zinc-200/50">
                <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-5">
                  <h3 className="font-bold text-lg tracking-tight text-zinc-900">
                    Before & After
                  </h3>
                  <div className="relative flex bg-zinc-100 p-1.5 rounded-2xl w-52 justify-between">
                    <button
                      onClick={() => handleTabClick("before")}
                      className={`relative z-10 w-24 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${activeTab === "before" ? "text-zinc-900" : "text-zinc-400"
                        }`}
                    >
                      Before
                    </button>
                    <button
                      onClick={() => handleTabClick("after")}
                      className={`relative z-10 w-24 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${activeTab === "after" ? "text-zinc-900" : "text-zinc-400"
                        }`}
                    >
                      After
                    </button>
                    <motion.div
                      layoutId="toggle-pill"
                      className="absolute top-1.5 bottom-1.5 bg-white shadow-sm border border-zinc-200/50 rounded-xl"
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
                          Manual Polyline Tracing
                        </div>
                        <ul className="space-y-4">
                          <li className="flex gap-3 text-zinc-600 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>1 to 2 weeks per drawing set</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>Labor-intensive, error-prone</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>Require manual redraw and validation at every step</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>Not trained on structural drawings, no prompt-based modelling layer inside Revit</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>Geometry duplicated unnecessarily</span>
                          </li>
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
                        <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                          Auto Conversion 2D to 3D
                        </div>
                        <ul className="space-y-4">
                          <li className="flex gap-3 text-zinc-600 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>1 to 2 days per drawing set (vector files processed in minutes)</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>AI conversion plus prompt-based modelling, consistent results</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Slab automation production-ready, WordToBIM Revit plugin included</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Modeller time freed for coordination</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Modeller starts from a working model, not a blank screen</span>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>


        {/* Demo Mode - Full Screen Video Controls */}
        <AnimatePresence>
          {isVideoPlaying && (
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
                  onClick={exitVideoMode}
                  className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <Minimize2 className="w-4 h-4" />
                  Exit Full Screen
                </button>
                <span className="text-xs text-white/50 font-medium">
                  Hand Drawn to AutoCAD Demo
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
                onClick={exitVideoMode}
              />
            </>
          )}
        </AnimatePresence>
      </section>

      {/* ─── Problem Section - Apple Style ─── */}
      <section ref={problemRef} className="relative py-32 px-6 bg-white overflow-hidden">
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
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 leading-tight">
                The hand-drawn-to-digital gap
              </h2>
              <div className="w-20 h-1.5 bg-[var(--color-lime)] rounded-full" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={isProblemInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:col-span-7 space-y-6"
            >
              <p className="text-xl text-zinc-600 leading-relaxed">
                ...recreating that same geometry in 3D, tracing every slab, beam, column, and opening with polylines...
              </p>
              <p className="text-lg text-zinc-500 leading-relaxed">
                It is the same geometry, drawn twice, and the second pass is mechanical, time your modellers could spend on coordination, clash detection, and detailed design. Auto Conversion takes that repetitive pass off their plate so their hours go where their expertise actually matters.
              </p>

              <p className="text-lg font-semibold text-zinc-900 leading-relaxed">
                Auto Conversion 2D to 3D handles the heavy lifting of that conversion step, so the duplication leaves your workflow and your modeller starts from a working model.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-zinc-50 to-transparent pointer-events-none" />
      </section>

      {/* ─── Solution / How it Works - Sticky Scroll ─── */}
      <section ref={solutionRef} className="relative py-32 px-6 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isSolutionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-4">
              The Solution
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950">
              How it works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left - Sticky Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isSolutionInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:sticky lg:top-32"
            >
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-zinc-200/50 w-full h-[500px] bg-zinc-950">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeStep}
                    src={stepImages[activeStep]}
                    alt="Hand Drawn to AutoCAD workflow step"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-8 left-8 right-8 z-10">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={activeStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="text-white text-lg font-semibold"
                    >
                      {stepCaptions[activeStep]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Right - Scroll Steps */}
            <div className="space-y-24">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={isSolutionInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                onViewportEnter={() => setActiveStep(0)}
                viewport={{ margin: "-40% 0px -40% 0px" }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Camera className="w-7 h-7 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Step 1</span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-950">
                  Upload your 2D structural drawing in PDF, DWG, or DXF format.
                </h3>
                <p className="text-lg text-zinc-600 leading-relaxed">
                  Upload your 2D structural drawing as DXF or DWG, the clean CAD vector formats the tool reads most accurately. PDF is supported best-effort, since flattened PDFs carry less reliable geometry.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={isSolutionInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                onViewportEnter={() => setActiveStep(1)}
                viewport={{ margin: "-40% 0px -40% 0px" }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
                    <Upload className="w-7 h-7 text-purple-600" />
                  </div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Step 2</span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-950">
                  Walls, slabs, beams, columns, and openings are converted to 3D Revit or IFC elements with accurate dimensions. Slab automation is production-ready now.
                </h3>
                <p className="text-lg text-zinc-600 leading-relaxed">
                  Walls, slabs, beams, columns, and openings are converted to 3D Revit or IFC elements, accurate to a working level. Your modeller then completes the model with WordToBIM, our Revit plugin that creates elements from a text prompt, so missing or custom geometry is added by prompt rather than manual redraw. Slab automation is production-ready now.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={isSolutionInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.7 }}
                onViewportEnter={() => setActiveStep(2)}
                viewport={{ margin: "-40% 0px -40% 0px" }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                    <FileText className="w-7 h-7 text-emerald-600" />
                  </div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Step 3</span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-950">
                  Slab automation, PRODUCTION READY.
                </h3>
                <p className="text-lg text-zinc-600 leading-relaxed">
                  Reliable conversion of floor slabs with accurate thickness, slopes, and openings identified, ready for your modeller to extend in Revit, prompting WordToBIM for any elements outside the slab scope.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Learning Section */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mt-32 p-12 bg-white rounded-[2rem] shadow-xl shadow-zinc-100"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-zinc-950">The tool learns</h3>
                <p className="text-lg text-zinc-600">
                  Accuracy improves with every drawing, by the 5th project, accuracy approaches 95%.
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-zinc-700">Your specific line weights and drawing conventions</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-zinc-700">How you draw doors, windows, stairs, and other elements</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-zinc-700">Your annotation style and text placement</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-zinc-700">Your preferred layer structure</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-emerald-200/20 rounded-3xl blur-xl" />
                <img
                  src="/images/cv_blueprint_analysis.png"
                  alt="AI learning process"
                  className="relative rounded-2xl shadow-lg w-full h-80 object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Workflow Section - Apple Style ─── */}
      <section ref={workflowRef} className="py-32 px-6 bg-zinc-900 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isWorkflowInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-4">
              Integration
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Fits into your workflow
            </h2>
          </motion.div>

          {/* Input/Output Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isWorkflowInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 bg-zinc-800/50 border border-zinc-700/50 rounded-3xl space-y-4 backdrop-blur-sm"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">What feeds in</span>
              <h4 className="font-bold text-2xl text-white">DXF and DWG Vector Files</h4>
              <p className="text-zinc-400">Accepts DXF and DWG vector files from architects or structural engineers. PDF and TIFF are accepted best-effort, with lower geometry confidence.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isWorkflowInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-8 bg-zinc-800/50 border border-zinc-700/50 rounded-3xl space-y-4 backdrop-blur-sm"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">What it feeds into</span>
              <h4 className="font-bold text-2xl text-white">Automated Estimating</h4>
              <p className="text-zinc-400">The working model opens in Revit, where WordToBIM lets your modeller add or adjust elements by prompt, then it flows on into automated estimating via Revit to BOQ and site measurement via MeasureonAir.</p>
            </motion.div>
          </div>

          {/* Static Workflow Steps */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isWorkflowInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {/* Step 1 */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-lime" />
                </div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Step 1</span>
                <h4 className="font-bold text-lg text-white">Upload</h4>
                <p className="text-sm text-zinc-400">Upload your 2D structural drawing (DXF or DWG, PDF best-effort).</p>
              </div>

              {/* Step 2 */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-lime" />
                </div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Step 2</span>
                <h4 className="font-bold text-lg text-white">Computer Vision</h4>
                <p className="text-sm text-zinc-400">AI scans layout, thickness, dimensions, and annotations</p>
              </div>

              {/* Step 3 */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <Box className="w-8 h-8 text-lime" />
                </div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Step 3</span>
                <h4 className="font-bold text-lg text-white">3D Generation</h4>
                <p className="text-sm text-zinc-400">3D Revit/IFC model generated to a working level, completed by prompt in WordToBIM.</p>
              </div>

              {/* Step 4 */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-lime" />
                </div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Step 4</span>
                <h4 className="font-bold text-lg text-white">Prompt in WordToBIM</h4>
                <p className="text-sm text-zinc-400">Revit plugin models custom or detailed elements from text prompts</p>
              </div>

              {/* Step 5 */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <Layers className="w-8 h-8 text-lime" />
                </div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Step 5</span>
                <h4 className="font-bold text-lg text-white">BOQ & Coordination</h4>
                <p className="text-sm text-zinc-400">modeller prompts WordToBIM for remaining elements, then the model feeds estimating, clash detection, and site workflows.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Pricing & Quick Facts ─── */}
      <section ref={pricingRef} className="py-32 px-6 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={isPricingInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="lg:col-span-8 space-y-16"
            >
              <div className="space-y-8">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">Deployment</span>
                <h2 className="text-4xl sm:text-5xl font-bold text-zinc-950">Pricing & Availability</h2>
                <div className="grid grid-cols-1 gap-6 max-w-md">
                  <div className="p-8 bg-white border border-zinc-200 rounded-3xl space-y-3 shadow-sm hover:shadow-xl transition-shadow duration-300">
                    <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Auto Conversion 2D to 3D</span>
                    <p className="text-4xl font-black tracking-tight">$3,500 to $4,500</p>
                    <p className="text-sm text-zinc-500 font-medium">Final price depends on drawing complexity and module scope.</p>
                    <p className="text-xs text-zinc-400">IFC or DWG export and the WordToBIM Revit plugin included.</p>
                  </div>
                </div>

                {/* Related Products - Moved from sidebar */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-6">Related Products</h4>
                  <ul className="space-y-4 text-sm">
                    <li>
                      <Link href="/learnmore/auto-conversion-2d-to-3d" className="font-bold hover:text-primary transition-colors flex items-center justify-between">
                        <span>Auto Conversion 2D to 3D</span>
                        <span className="text-xs text-zinc-400 font-medium">Next step</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/learnmore/revit-to-boq" className="font-bold hover:text-primary transition-colors flex items-center justify-between">
                        <span>Revit to BOQ</span>
                        <span className="text-xs text-zinc-400 font-medium">Workflow</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/learnmore/planning-law-chatbot" className="font-bold hover:text-primary transition-colors flex items-center justify-between">
                        <span>Planning Law Chatbot</span>
                        <span className="text-xs text-zinc-400 font-medium">Pre-design</span>
                      </Link>
                    </li>
                  </ul>
                  <div className="pt-4 mt-4 border-t border-zinc-100">
                    <Link href="/learnmore" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                      View full suite <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Quick Facts Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={isPricingInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-4 sticky top-32"
            >
              <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-lg space-y-8">
                <h3 className="font-bold text-xl border-b border-zinc-100 pb-4">Quick Facts</h3>
                <div className="space-y-5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500 font-semibold">Stage</span>
                    <span className="font-bold text-zinc-900">Design</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500 font-semibold">Best For</span>
                    <span className="font-bold text-zinc-900 text-right">Architects, Firms</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500 font-semibold">Calibration</span>
                    <span className="font-bold text-zinc-900">1 week</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500 font-semibold">Pricing</span>
                    <span className="font-bold text-zinc-900">USD 3,500 to 4,500, depending on complexity</span>
                  </div>
                </div>



                <Button
                  asChild
                  className="w-full rounded-2xl py-7 font-bold shadow-lg bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime)]/90 cursor-pointer"
                >
                  <a
                    href="/pricing"
                  >
                    Buy Products →
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Comparison Section - Apple Style ─── */}
      <div ref={comparisonRef}>
        <ComparisonGrid
          sectionTitle="Why choose Auto Conversion 2D to 3D"
          card1={{
            title: "Manual Tracing",
            subtitle: "Manual Polyline Tracing",
            features: [
              "1 to 2 weeks per drawing set",
              "Labor-intensive, error-prone",
              "Modeller time wasted on conversion",
              "Geometry duplicated unnecessarily",
            ],
            metric: { value: "1-2", label: "WEEKS" },
            button: { text: "Traditional Route", href: "/pricing" },
          }}
          card2={{
            title: "Auto Conversion",
            subtitle: "Hand Drawn to AutoCAD",
            features: [
              "1 to 2 days per drawing set",
              "AI conversion plus prompt-based modelling, consistent results",
              "Modeller time freed for coordination",
              "Slab automation production-ready, WordToBIM Revit plugin included",
            ],
            metric: { value: "1-2", label: "DAYS" },
            button: { text: "Book A Demo", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
          }}
          card3={{
            title: "Other Tools",
            subtitle: "Other PDF-to-3D Tools",
            features: [
              "Require manual redraw and validation at every step",
              "Work only for simple geometry",
              "Not trained on structural drawings, no prompt layer",
            ],
            metric: { value: "UNRELIABLE", label: "FAST /" },
            button: { text: "Other Tools", href: "https://chat.openai.com" },
          }}
        />
      </div>

      {/* ─── FAQ Section ─── */}
      <section ref={faqRef} className="py-32 px-6 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isFaqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-4">
              FAQ
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: 'Does it work with sketches on whiteboard or paper?', a: 'Yes to both. Paper sketches photograph well with standard smartphone camera. Whiteboard sketches work best if photographed in good light (avoid reflections).' },
              { q: 'What file formats does it accept?', a: 'We recommend DXF and DWG formats for the highest accuracy. PDF and TIFF work best-effort because flattened drawings lose vector precision.' },
              { q: 'Can it handle complex sketches with lots of detail?', a: 'Yes, but best results are with clear floor plan sketches. Complex sections and details are handled as separate uploads.' },
              { q: 'How long does the calibration take?', a: '1 week. We process 3 to 5 sample drawings from the architect to train the model to recognize their specific drawing conventions.' },
              { q: 'What if the architect\'s drawing style changes?', a: 'The model adapts automatically with each new drawing. If a significant change occurs, we can recalibrate (recommend annually or after style shift).' },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={isFaqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                >
                  <span className="font-bold text-zinc-900 pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 transition-transform duration-300 shrink-0 ${activeFaq === idx ? "rotate-180" : ""
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
                      <div className="px-6 pb-6 text-zinc-600 leading-relaxed border-t border-zinc-100 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer CTA - Apple Style ─── */}
      <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-955 dark:text-zinc-50 leading-tight uppercase"
          >
            Keep designing creatively.
            <br />
            <span className="text-zinc-500 dark:text-zinc-400">Let us handle the digital conversion.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            See how Auto Conversion 2D to 3D eliminates geometry duplication from your workflow.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-4 flex justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 py-6 font-bold border border-zinc-300 dark:border-zinc-700 text-zinc-955 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-all duration-300"
            >
              <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                Book a Demo →
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 py-6 font-bold shadow-xl            bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime)]/90 cursor-pointer transition-all duration-300"
            >
              <a href="/pricing">
                Buy Products →
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

