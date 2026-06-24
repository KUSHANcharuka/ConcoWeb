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
  Search,
  FileText,
  MapPin,
  Sparkles,
  Layers,
  Maximize,
  Minimize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComparisonGrid from "@/components/learnmore/comparison-grid";

// ─── Apple-style animation variants ───
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

// ─── Apple-Style Accordion Component ───
function AppleAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="bg-white border border-zinc-200 rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-md"
        >
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full flex items-center justify-between p-6 text-left cursor-pointer group"
          >
            <span className="font-bold text-sm text-zinc-900 pr-4 group-hover:text-zinc-700 transition-colors">
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
                <div className="px-6 pb-6 text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 pt-4">
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

// ─── Main Page Component ───
export default function PlanningLawChatbotPage() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
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
        document.exitFullscreen().catch(() => { });
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
      document.exitFullscreen().catch(() => { });
    }
  };

  // Auto play/pause full screen showcase video to save system resources and allow smooth transitions
  useEffect(() => {
    if (videoRef.current) {
      if (isDemoMode) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => { });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isDemoMode]);

  // ─── Parallax scroll refs ───
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroScrollProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(heroScrollProgress, [0, 1], [0, -100]);

  // ─── Section refs for scroll-triggered animations ───
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

  const showcaseRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: showcaseScrollProgress } = useScroll({
    target: showcaseRef,
    offset: ["start start", "end end"],
  });

  // Video scroll transforms (disappears between 0.25 and 0.32)
  const videoOpacity = useTransform(showcaseScrollProgress, [0, 0.25, 0.32], [1, 1, 0]);
  const videoScale = useTransform(showcaseScrollProgress, [0, 0.25, 0.32], [1, 1, 0.96]);
  const videoBlur = useTransform(showcaseScrollProgress, [0, 0.25, 0.32], ["blur(0px)", "blur(0px)", "blur(20px)"]);
  const videoDisplay = useTransform(showcaseScrollProgress, (latest) => latest > 0.32 ? "none" : "block");

  // --- Text Transitions ---
  // Step 1 Text
  const step1Opacity = useTransform(showcaseScrollProgress, [0.32, 0.38, 0.44, 0.50], [0, 1, 1, 0]);
  const step1Y = useTransform(showcaseScrollProgress, [0.32, 0.38, 0.44, 0.50], [60, 0, 0, -60]);
  const step1Scale = useTransform(showcaseScrollProgress, [0.32, 0.38, 0.44, 0.50], [0.95, 1, 1, 1.05]);

  // Step 2 Text
  const step2Opacity = useTransform(showcaseScrollProgress, [0.48, 0.54, 0.60, 0.66], [0, 1, 1, 0]);
  const step2Y = useTransform(showcaseScrollProgress, [0.48, 0.54, 0.60, 0.66], [60, 0, 0, -60]);
  const step2Scale = useTransform(showcaseScrollProgress, [0.48, 0.54, 0.60, 0.66], [0.95, 1, 1, 1.05]);

  // Step 3 Text
  const step3Opacity = useTransform(showcaseScrollProgress, [0.64, 0.70, 0.76, 0.82], [0, 1, 1, 0]);
  const step3Y = useTransform(showcaseScrollProgress, [0.64, 0.70, 0.76, 0.82], [60, 0, 0, -60]);
  const step3Scale = useTransform(showcaseScrollProgress, [0.64, 0.70, 0.76, 0.82], [0.95, 1, 1, 1.05]);

  // Step 4 Text
  const step4Opacity = useTransform(showcaseScrollProgress, [0.80, 0.86, 0.96, 1.0], [0, 1, 1, 1]);
  const step4Y = useTransform(showcaseScrollProgress, [0.80, 0.86, 0.96, 1.0], [60, 0, 0, 0]);
  const step4Scale = useTransform(showcaseScrollProgress, [0.80, 0.86, 0.96, 1.0], [0.95, 1, 1, 1]);

  // --- Screenshot/Mockup Transitions ---
  // Step 1 Screenshot (visible during Step 1 and Step 2 text)
  const screenshot1Opacity = useTransform(showcaseScrollProgress, [0.32, 0.38, 0.60, 0.66], [0, 1, 1, 0]);
  const screenshot1Y = useTransform(showcaseScrollProgress, [0.32, 0.38, 0.60, 0.66], [60, 0, 0, -60]);
  const screenshot1Scale = useTransform(showcaseScrollProgress, [0.32, 0.38, 0.60, 0.66], [0.95, 1, 1, 1.05]);

  // Step 4 Screenshot (visible during Step 3 and Step 4 text)
  const screenshot4Opacity = useTransform(showcaseScrollProgress, [0.64, 0.70, 0.96, 1.0], [0, 1, 1, 1]);
  const screenshot4Y = useTransform(showcaseScrollProgress, [0.64, 0.70, 0.96, 1.0], [60, 0, 0, 0]);
  const screenshot4Scale = useTransform(showcaseScrollProgress, [0.64, 0.70, 0.96, 1.0], [0.95, 1, 1, 1]);

  // Demo video URL placeholder
  const demoVideoUrl = "https://drive.google.com/file/d/11wUzRrAVFkZ9ODdBVGoduafccBcFRRqP/preview";

  // Exit demo mode
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

  // Auto-cycle workflow steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWorkflowStep((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const workflowSteps = [
    {
      number: 1,
      title: "Input",
      subtitle: "Enter plot location",
      description: "Simply input the plot location or coordinates.",
      detail: "No need to manually browse through massive planning law documents. Just drop the location of the plot you are evaluating into the chat.",
    },
    {
      number: 2,
      title: "Analyze",
      subtitle: "Instant regulatory check",
      description: "AI extracts FAR, height limits, and allowable uses.",
      detail: "The AI cross-references local building codes, correctly interpreting tables and nuances that general-purpose AI tools get wrong.",
    },
    {
      number: 3,
      title: "Output",
      subtitle: "Feasibility PDF",
      description: "Download a presentation-ready feasibility report.",
      detail: "Instantly generate a formatted PDF report with clause-referenced answers that you can present directly to your client at the first meeting.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-lime/30 selection:text-black">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════
         HERO - Parallax Scroll
         ═══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden bg-[#FAFAF8] dark:bg-zinc-950"
      >
        {/* Parallax Background */}
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-black" />
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[var(--color-lime)]/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" />

          <div
            className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03] text-zinc-900 dark:text-white"
            style={{
              backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
        </motion.div>

        {/* Video Overlay coming from inside the page */}
        <motion.div
          initial={{ opacity: 0, scale: 0.05, borderRadius: "64px", filter: "blur(40px)" }}
          animate={{
            opacity: isDemoMode ? 1 : 0,
            scale: isDemoMode ? 1 : 0.05,
            borderRadius: isDemoMode ? "0px" : "64px",
            filter: isDemoMode ? "blur(0px)" : "blur(40px)",
          }}
          transition={{ duration: 1.5, ease: [0.85, 0, 0.15, 1] }}
          style={{ pointerEvents: isDemoMode ? "auto" : "none" }}
          className="fixed inset-0 z-50 bg-black overflow-hidden flex items-center justify-center shadow-2xl"
          onClick={exitDemoMode}
        >
          <div
            ref={videoAreaRef}
            onDoubleClick={toggleFullscreen}
            className="relative w-full h-full cursor-pointer select-none"
          >
            <video
              ref={videoRef}
              src="/videos/beira-lake-zoning-showcase.mp4"
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              onClick={(e) => {
                e.stopPropagation();
                exitDemoMode();
              }}
            />

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
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
              <div className="h-4 w-[1px] bg-zinc-800" />
              <button
                onClick={toggleFullscreen}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{
            y: isDemoMode ? -150 : 0,
            opacity: isDemoMode ? 0 : 1,
            filter: isDemoMode ? "blur(5px)" : "blur(0px)",
          }}
          transition={{ duration: 1.5, ease: [0.85, 0, 0.15, 1] }}
          className="absolute top-28 left-6 z-30"
        >
          <Link
            href="/learnmore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-black/60 backdrop-blur-md text-sm font-semibold text-zinc-650 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-all hover:bg-white/80 dark:hover:bg-black/80 hover:scale-105 active:scale-95 group shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Learn More
          </Link>
        </motion.div>

        <motion.div
          style={!isDemoMode ? { y: textY, opacity: heroOpacity } : {}}
          className={`relative w-full z-10 ${isDemoMode ? "pointer-events-none" : ""}`}
        >
          <div className="px-6 pt-32 pb-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              animate={{
                x: isDemoMode ? -1200 : 0,
                scale: isDemoMode ? 0.7 : 1,
                rotate: isDemoMode ? -10 : 0,
                opacity: isDemoMode ? 0 : 1,
                filter: isDemoMode ? "blur(10px)" : "blur(0px)",
              }}
              transition={{ duration: 1.5, ease: [0.85, 0, 0.15, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >


                <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.05] uppercase product-title-sweep">
                  Planning Law Chatbot
                </motion.h1>

                <motion.p variants={fadeInUp} className="text-2xl sm:text-3xl text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed max-w-xl">
                  Know what you can build.
                  <br />
                  <span className="text-zinc-500">Instantly.</span>
                </motion.p>

                <motion.p variants={fadeInUp} className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
                  Enter a plot location. Get the allowable uses, height limits, floor area ratio, and sanitary requirements in seconds — before you spend on design.
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      enterDemoMode();
                    }}
                    variant="outline"
                    size="lg"
                    className="rounded-xl px-6 py-6 font-bold shadow-lg cursor-pointer border-zinc-300 dark:border-white/40 bg-white/50 dark:bg-white/10 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/25 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Demo
                  </Button>
                  <Button asChild size="lg" className="rounded-xl px-6 py-6 font-bold shadow-lg cursor-pointer shadow-xl bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime)]/90 cursor-pointer border-0 hover:scale-105 transition-all duration-300">
                    <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                      Book a Demo →
                    </a>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              animate={{
                x: isDemoMode ? 1200 : 0,
                scale: isDemoMode ? 0.7 : 1,
                rotate: isDemoMode ? 10 : 0,
                opacity: isDemoMode ? 0 : 1,
                filter: isDemoMode ? "blur(10px)" : "blur(0px)",
              }}
              transition={{ duration: 1.5, ease: [0.85, 0, 0.15, 1] }}
              className="lg:col-span-5"
            >
              <div className="relative bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-[2rem] p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8 border-b border-zinc-200 dark:border-white/10 pb-5">
                  <h3 className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">
                    Compare Workflows
                  </h3>
                  <div className="relative flex bg-zinc-200/50 dark:bg-black/40 p-1.5 rounded-2xl w-52 justify-between border border-zinc-300 dark:border-white/5">
                    <button
                      onClick={() => handleTabClick("before")}
                      className={`relative z-10 w-24 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${activeTab === "before" ? "text-zinc-900" : "text-zinc-500 dark:text-zinc-400"
                        }`}
                    >
                      Before
                    </button>
                    <button
                      onClick={() => handleTabClick("after")}
                      className={`relative z-10 w-24 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${activeTab === "after" ? "text-zinc-900" : "text-zinc-500 dark:text-zinc-400"
                        }`}
                    >
                      After
                    </button>
                    <motion.div
                      layoutId="toggle-pill-planning"
                      className="absolute top-1.5 bottom-1.5 bg-white shadow-sm rounded-xl"
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
                          Manual Planning Research
                        </div>
                        <ul className="space-y-4">
                          <li className="flex gap-3 text-zinc-700 dark:text-zinc-300 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>Architect spends 2–3 days cross-referencing planning books</span>
                          </li>
                          <li className="flex gap-3 text-zinc-700 dark:text-zinc-300 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>ChatGPT misreads tabular content and planning nuances</span>
                          </li>
                          <li className="flex gap-3 text-zinc-700 dark:text-zinc-300 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>No verified answers before client presentation</span>
                          </li>
                          <li className="flex gap-3 text-zinc-700 dark:text-zinc-300 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>Feasibility decision delayed by consultant fees and timelines</span>
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
                        <div className="text-xs font-bold text-zinc-650 dark:text-zinc-400 uppercase tracking-wider">
                          Planning Law Chatbot
                        </div>
                        <ul className="space-y-4">
                          <li className="flex gap-3 text-zinc-700 dark:text-zinc-300 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Enter plot location</span>
                          </li>
                          <li className="flex gap-3 text-zinc-700 dark:text-zinc-300 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Get instant feasibility PDF with all constraints</span>
                          </li>
                          <li className="flex gap-3 text-zinc-700 dark:text-zinc-300 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Verified answers based on actual planning codes</span>
                          </li>
                          <li className="flex gap-3 text-zinc-700 dark:text-zinc-300 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Present to client on day one</span>
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


      </section>

      {/* ═══════════════════════════════════════════════════════
         PROBLEM SECTION
         ═══════════════════════════════════════════════════════ */}
      <section ref={problemRef} className="relative py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={isProblemInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:col-span-5 space-y-6"
            >
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 leading-tight">
                The planning bottleneck
              </h2>
              <div className="w-20 h-1.5 bg-[var(--color-lime)] rounded-full" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={isProblemInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:col-span-7 space-y-6"
            >
              <p className="text-xl text-zinc-600 leading-relaxed">Architects and developers spend days manually researching what can be built on a plot before the design process even starts.</p>
              <p className="text-lg text-zinc-500 leading-relaxed">Planning books are fragmented across regulations from multiple authorities. ChatGPT misreads tables and nuances in construction law. The result is delayed feasibility, uncertain client conversations, and consultant fees that eat into the project budget.</p>
              <p className="text-lg font-semibold text-zinc-900 leading-relaxed">The Planning Law Chatbot automates this, turning planning research from a multi-day manual task into a one-minute answer.</p>
            </motion.div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-zinc-50 to-transparent pointer-events-none" />
      </section>


      {/* ═══════════════════════════════════════════════════════
         SCROLL-LINKED STORYTELLING SECTION (Apple-Style Parallax)
         ═══════════════════════════════════════════════════════ */}
      <section
        ref={showcaseRef}
        className="relative h-[400vh] w-full bg-white text-zinc-900 overflow-visible"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
          {/* Background Video (Stage 1) */}
          <motion.div
            style={{
              opacity: videoOpacity,
              scale: videoScale,
              filter: videoBlur,
              display: videoDisplay,
            }}
            className="absolute inset-0 z-0 bg-black pointer-events-none"
          >
            <video
              src="/videos/MVP_Vid_1_202606081311.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Glass-style overlay effect */}
            <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-[6px] border-b border-white/10 flex flex-col items-center justify-center text-center p-6">
              <div className="max-w-3xl space-y-6">
                <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tight leading-none drop-shadow-lg">
                  How it works<br />
                  <span className="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                    AI Chatbot in Action
                  </span>
                </h2>
                <p className="text-lg sm:text-xl text-zinc-200 font-medium max-w-xl mx-auto drop-shadow-md">
                  Scroll down to see the real-time AI interface and step-by-step workspace walkthrough.
                </p>
                <div className="flex flex-col items-center gap-2 pt-8 text-zinc-400">
                  <span className="text-xs uppercase tracking-widest font-semibold animate-pulse">Scroll to explore</span>
                  <ChevronDown className="w-5 h-5 animate-bounce" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Screenshot Walkthrough (Stage 2) */}
          <div className="relative w-full max-w-6xl mx-auto h-full grid grid-cols-1 lg:grid-cols-12 gap-12 px-6 items-center z-10 pointer-events-none">
            {/* Left Side: Dynamic Text Columns Stack */}
            <div className="relative lg:col-span-5 h-[350px] flex items-center">

              {/* Step 1 Text */}
              <motion.div
                style={{
                  opacity: step1Opacity,
                  y: step1Y,
                  scale: step1Scale,
                }}
                className="absolute inset-x-0 flex flex-col space-y-4 max-w-md"
              >
                <span className="text-xs font-black uppercase tracking-widest text-zinc-550 dark:text-zinc-400">
                  Step 01 — Plot Data Entry
                </span>
                <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
                  Input
                </h3>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Enter the plot location and the tool returns: maximum allowable height in metres or storeys, floor area ratio (FAR) and density constraints, allowable use classes, sanitary and parking requirements per local code, and any special overlay zones or restrictions.
                </p>
              </motion.div>

              {/* Step 2 Text */}
              <motion.div
                style={{
                  opacity: step2Opacity,
                  y: step2Y,
                  scale: step2Scale,
                }}
                className="absolute inset-x-0 flex flex-col space-y-4 max-w-md"
              >
                <span className="text-xs font-black uppercase tracking-widest text-zinc-550 dark:text-zinc-400">
                  Step 02 — AI Processing
                </span>
                <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
                  Planning Law Chatbot
                </h3>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  AI reads the active zoning codes and extracts allowable height, FAR, setbacks, and use classes for that plot. FIDIC-grade accuracy trained on 50+ international planning codes including UAE, Sri Lanka, KSA, UK, and Australia regulations.
                </p>
              </motion.div>

              {/* Step 3 Text */}
              <motion.div
                style={{
                  opacity: step3Opacity,
                  y: step3Y,
                  scale: step3Scale,
                }}
                className="absolute inset-x-0 flex flex-col space-y-4 max-w-md"
              >
                <span className="text-xs font-black uppercase tracking-widest text-zinc-550 dark:text-zinc-400">
                  Step 03 — Envelope Summary
                </span>
                <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
                  Feasibility Summary
                </h3>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Constraints are compiled into a buildable envelope, max storeys, FAR, sanitary requirements, parking ratios, and heritage overlays. Output formats include interactive chatbot answers (ask follow-up questions) and a formatted feasibility PDF ready to present to clients.
                </p>
              </motion.div>

              {/* Step 4 Text */}
              <motion.div
                style={{
                  opacity: step4Opacity,
                  y: step4Y,
                  scale: step4Scale,
                }}
                className="absolute inset-x-0 flex flex-col space-y-4 max-w-md"
              >
                <span className="text-xs font-black uppercase tracking-widest text-zinc-550 dark:text-zinc-400">
                  Step 04 — Feasibility Output
                </span>
                <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
                  Feasibility PDF
                </h3>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  A formatted summary you can take into client meetings, ready to feed the design brief and cost plan. Plot location → Planning Law Chatbot → Feasibility PDF + Height/FAR constraints → Cost Plan Calculator → Design brief with budget and planning envelope locked in.
                </p>
              </motion.div>

            </div>

            {/* Right Side: Screenshot Laptop/Browser Viewport Mockups Stack */}
            <div className="relative lg:col-span-7 h-[480px]">

              {/* Step 1 Screenshot */}
              <motion.div
                style={{
                  opacity: screenshot1Opacity,
                  y: screenshot1Y,
                  scale: screenshot1Scale,
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-full bg-zinc-900/90 rounded-2xl border border-white/10 p-2 shadow-2xl shadow-zinc-400/20 dark:shadow-black/80 backdrop-blur-md overflow-hidden">
                  <div className="flex items-center gap-1.5 pb-2 px-2 border-b border-white/5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-lime/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="ml-4 text-[9px] text-zinc-500 font-mono select-none">concolabs.ai/planning-chatbot</span>
                  </div>
                  <img
                    src="/images/planning-law-chatbot/step-1-ask.png"
                    alt="Step 1 — Ask Questions"
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
              </motion.div>

              {/* Step 4 Screenshot */}
              <motion.div
                style={{
                  opacity: screenshot4Opacity,
                  y: screenshot4Y,
                  scale: screenshot4Scale,
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-full bg-zinc-900/90 rounded-2xl border border-white/10 p-2 shadow-2xl shadow-zinc-400/20 dark:shadow-black/80 backdrop-blur-md overflow-hidden">
                  <div className="flex items-center gap-1.5 pb-2 px-2 border-b border-white/5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-lime/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="ml-4 text-[9px] text-zinc-500 font-mono select-none">concolabs.ai/planning-chatbot</span>
                  </div>
                  <img
                    src="/images/planning-law-chatbot/step-4-cost.png"
                    alt="Step 4 — Feasibility PDF"
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
         INTEGRATION SECTION
         ═══════════════════════════════════════════════════════ */}
      <section ref={workflowRef} className="py-32 px-6 bg-zinc-900 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isWorkflowInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">Fits into your workflow</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={isWorkflowInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="p-8 bg-zinc-800/50 border border-zinc-700/50 rounded-3xl space-y-4 backdrop-blur-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">What feeds in</span>
              <h4 className="font-bold text-2xl text-white">Plot Location Data</h4>
              <p className="text-zinc-400">Plot location data (address or coordinates) that feeds into the chatbot for instant feasibility analysis.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} animate={isWorkflowInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="p-8 bg-zinc-800/50 border border-zinc-700/50 rounded-3xl space-y-4 backdrop-blur-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">What it feeds into</span>
              <h4 className="font-bold text-2xl text-white">Cost Plan Calculator</h4>
              <p className="text-zinc-400">The planning envelope becomes the design constraint for the Cost Plan Calculator, creating a design brief with budget and planning envelope locked in.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
         PRICING & QUICK FACTS
         ═══════════════════════════════════════════════════════ */}
      <section ref={pricingRef} className="py-32 px-6 bg-[#FAFAF8]">
        <div className="space-y-16 max-w-4xl mx-auto">
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={isPricingInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
              <h2 className="text-4xl sm:text-5xl font-bold text-zinc-955 dark:text-zinc-50 uppercase">Pricing & Availability</h2>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={isPricingInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[

                { label: "Per User Subscriptions for companies", price: "$15", desc: "Monthly Subscription instead of an one time implementation fee.", suffix: "/month" },
              ].map((card, i) => (
                <motion.div key={i} whileHover={{ y: -8, scale: 1.02 }} className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-sm hover:shadow-xl transition-all duration-300">
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest">{card.label}</span>
                  <p className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">{card.price}{card.suffix && <span className="text-base font-normal text-zinc-400 dark:text-zinc-500">{card.suffix}</span>}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{card.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16 border-t border-zinc-200 dark:border-zinc-800">
            {/* Quick Facts Card */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={isPricingInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-8">
              <h3 className="font-bold text-xl border-b border-zinc-100 dark:border-zinc-800 pb-4 text-zinc-900 dark:text-white">Quick Facts</h3>
              <div className="space-y-5 flex-1">
                {[
                  { label: "Best For", value: "Architects, real estate developers, consultancies" },
                  { label: "Status", value: "Scaling with sales" },
                  { label: "Stage", value: "Pre-design" },
                  { label: "Regions", value: "UAE, Sri Lanka, KSA, UK, Australia" },
                  { label: "Time to Implement", value: "1-2 weeks" },
                  { label: "Pricing", value: "USD 4,500 + USD 400/yr" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2">
                    <span className="text-zinc-500 font-semibold">{item.label}</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-right">{item.value}</span>
                  </div>
                ))}
              </div>
              <Button asChild className="w-full rounded-2xl py-7 font-bold shadow-lg bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime)]/90 cursor-pointer border-0">
                <a href="/pricing?product=planning_law" target="_blank" rel="noopener noreferrer">
                  Buy Products →
                </a>
              </Button>
            </motion.div>

            {/* Related Products Card */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={isPricingInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-6">Related Products</h4>
                <ul className="space-y-4 text-sm">
                  {[
                    { href: "/learnmore/cost-plan-calculator", label: "Cost Plan Calculator", tag: "Next stage" },
                    { href: "/learnmore/hand-drawn-to-autocad", label: "Hand Drawn to AutoCAD", tag: "Design stage" },
                    { href: "/learnmore/revit-to-boq", label: "Revit to BOQ", tag: "Tendering stage" },
                  ].map((item, i) => (
                    <li key={i}>
                      <Link href={item.href} className="font-bold hover:text-primary transition-colors flex items-center justify-between">
                        <span>{item.label}</span>
                        <span className="text-xs text-zinc-400 font-medium">{item.tag}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <Link href="/learnmore" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                    View full suite <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Comparison Section ─── */}
      <div ref={comparisonRef}>
        <ComparisonGrid
          sectionTitle="Why choose Planning Law Chatbot"
          card1={{
            title: "Manual Method",
            subtitle: "Manual Planning Research",
            features: [
              "2-3 days per site",
              "Consultant fees: USD 500-2,000",
              "Risk of misinterpretation",
              "No audit trail",
            ],
            metric: { value: "2-3", label: "DAYS" },
            button: { text: "Traditional Route", href: "#" },
          }}
          card2={{
            title: "Planning Law Chatbot",
            subtitle: "Concolabs",
            features: [
              "1 minute per site",
              "Fixed fee + annual maintenance",
              "Verified against planning codes",
              "Outputs saved for audit",
            ],
            metric: { value: "1", label: "MINUTE" },
            button: { text: "Book A Demo", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
          }}
          card3={{
            title: "ChatGPT + PDF",
            subtitle: "General AI",
            features: [
              "Misreads tabular codes & formatting",
              "Not trained on building codes",
              "No clause verification or source links",
              "Cannot be used for client presentations",
            ],
            metric: { value: "UNRELIABLE", label: "FAST /" },
            button: { text: "General Chat", href: "#" },
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════
         FAQ SECTION
         ═══════════════════════════════════════════════════════ */}
      <section ref={faqRef} className="py-32 px-6 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 60 }} animate={isFaqInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950">Frequently Asked Questions</h2>
          </motion.div>

          <AppleAccordion
            items={[
              {
                q: "Which countries' planning codes does it cover?",
                a: "Currently trained on UAE, Sri Lanka, KSA, UK, and Australia regulations. We are expanding coverage quarterly. Contact us if your target market is not yet included.",
              },
              {
                q: "Can it handle plot overlays or special zones?",
                a: "Yes. If a plot is in a heritage zone, industrial area, or special development corridor, the tool identifies the overlay and applies the relevant restrictions.",
              },
              {
                q: "How is this different from ChatGPT?",
                a: "ChatGPT is not trained on construction law and misreads tabular content in planning books. Our tool is FIDIC-grade accurate and trained specifically on planning regulations across multiple jurisdictions.",
              },
              {
                q: "Can we integrate it into our own portal?",
                a: "Yes, via API. We have integration packages for architecture firms and consultancies. Pricing starts at USD 2,000/month.",
              },
              {
                q: "What if the planning rules change?",
                a: "We update the knowledge base quarterly. Your maintenance fee covers these updates automatically.",
              },
            ]}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
         FOOTER CTA
         ═══════════════════════════════════════════════════════ */}
      <section ref={ctaRef} className="py-32 px-6 bg-card/50 backdrop-blur-xl border-t border-border relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <motion.h2 initial={{ opacity: 0, y: 40 }} animate={isCtaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
            Start your feasibility with data, not guesswork.
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={isCtaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="text-zinc-600 dark:text-zinc-400 text-xl max-w-2xl mx-auto leading-relaxed">
            See how Planning Law Chatbot answers planning questions before your team picks up the phone.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isCtaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }} className="pt-6 flex justify-center">
            <Button asChild size="lg" className="rounded-2xl px-10 py-7 font-bold shadow-xl bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime)]/90 cursor-pointer hover:scale-105 transition-all duration-300">
              <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                Book a Demo →
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
