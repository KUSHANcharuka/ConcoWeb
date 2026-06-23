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
  Play,
  Minimize2,
  Box,
  Bot,
  Zap,
  Download,
  Calendar,
  FileSpreadsheet,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComparisonGrid from "@/components/learnmore/comparison-grid";
import RevitToBoqWorkflow from "@/components/learnmore/revit-to-boq-workflow";

// Apple-style animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

// 3D Isometric Holographic Building Mascot SVG
function RevitHologramMascot() {
  return (
    <div className="relative w-72 h-72 sm:w-[380px] sm:h-[380px] mx-auto flex items-center justify-center">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-lime/10 rounded-full filter blur-3xl opacity-50 animate-pulse" />
      <motion.svg
        viewBox="0 0 400 400"
        className="w-full h-full text-lime-400 dark:text-lime-300 drop-shadow-[0_0_20px_rgba(163,230,53,0.25)]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Isometric Grid Floor (Background) */}
        <g className="stroke-zinc-300 dark:stroke-zinc-800" strokeWidth="0.75" fill="none" opacity="0.3">
          <path d="M 50,200 L 200,120 L 350,200 L 200,280 Z" />
          <path d="M 50,200 L 200,280 L 350,200" />
          <path d="M 200,120 L 200,280" />
          <path d="M 125,160 L 275,240" />
          <path d="M 275,160 L 125,240" />
        </g>

        {/* 3D Wireframe building structure */}
        <g stroke="currentColor" strokeWidth="1.25" fill="none" className="text-lime-500 dark:text-lime-400">
          {/* Main Tower (Left Block) */}
          <path d="M 120,240 L 180,210 L 240,240 L 180,270 Z" />
          <path d="M 120,240 L 120,150" />
          <path d="M 180,270 L 180,180" />
          <path d="M 240,240 L 240,150" />
          <path d="M 180,210 L 180,150" />
          <path d="M 120,150 L 180,120 L 240,150 L 180,180 Z" />

          {/* Floor Slab Slices */}
          <path d="M 120,195 L 180,165 L 240,195 L 180,225 Z" className="opacity-60 stroke-emerald-500" />

          {/* Right Annex Block */}
          <path d="M 240,240 L 300,210 L 240,180" />
          <path d="M 300,210 L 300,140" />
          <path d="M 240,150 L 300,120 L 240,90 Z" />
          <path d="M 300,120 L 240,150" strokeWidth="0.75" />

          {/* Hologram Data Connectors (Glowing Circles) */}
          <circle cx="120" cy="150" r="3.5" fill="#a3e635" className="animate-ping" />
          <circle cx="180" cy="120" r="3" fill="#10b981" />
          <circle cx="240" cy="150" r="3" fill="#a3e635" />
          <circle cx="300" cy="120" r="3.5" fill="#10b981" />
          <circle cx="180" cy="180" r="3" fill="#a3e635" />
          <circle cx="180" cy="270" r="3" fill="#10b981" />
        </g>

        {/* Scanning Laser Line */}
        <motion.line
          x1="80"
          y1="100"
          x2="320"
          y2="100"
          stroke="#10b981"
          strokeWidth="1.5"
          initial={{ y: 20 }}
          animate={{ y: 150 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 4,
            ease: "easeInOut",
          }}
          className="drop-shadow-[0_0_6px_#10b981]"
        />
      </motion.svg>
    </div>
  );
}

// 3D Glowing Rotating Network Globe SVG
function GlowingDigitalGlobe({ className = "w-32 h-32 text-emerald-500" }: { className?: string }) {
  return (
    <div className={`relative ${className} mx-auto flex items-center justify-center overflow-hidden`}>
      <div className="absolute inset-0 bg-emerald-500/10 rounded-full filter blur-xl opacity-60" />
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" fill="none" className="opacity-30" />
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.75" fill="none" className="opacity-70" />

        <ellipse cx="50" cy="50" rx="38" ry="12" stroke="currentColor" strokeWidth="0.5" fill="none" className="opacity-30" />
        <ellipse cx="50" cy="50" rx="12" ry="38" stroke="currentColor" strokeWidth="0.5" fill="none" className="opacity-30" />
        <line x1="12" y1="50" x2="88" y2="50" stroke="currentColor" strokeWidth="0.5" className="opacity-25" />
        <line x1="50" y1="12" x2="50" y2="88" stroke="currentColor" strokeWidth="0.5" className="opacity-25" />

        <circle cx="28" cy="30" r="2" fill="#a3e635" />
        <circle cx="72" cy="30" r="2.5" fill="#10b981" />
        <circle cx="34" cy="65" r="2" fill="#10b981" />
        <circle cx="66" cy="65" r="2" fill="#a3e635" />
        <circle cx="50" cy="12" r="1.5" fill="#a3e635" />
        <circle cx="50" cy="88" r="1.5" fill="#10b981" />

        <path d="M 28,30 Q 50,20 72,30" stroke="#a3e635" strokeWidth="0.5" fill="none" className="opacity-50" />
        <path d="M 34,65 Q 50,80 66,65" stroke="#10b981" strokeWidth="0.5" fill="none" className="opacity-50" />
        <path d="M 28,30 Q 30,50 34,65" stroke="#a3e635" strokeWidth="0.5" fill="none" className="opacity-40" />
        <path d="M 72,30 Q 70,50 66,65" stroke="#10b981" strokeWidth="0.5" fill="none" className="opacity-40" />
      </motion.svg>
    </div>
  );
}

// Estimator Avatar Profile Card
function EstimatorAvatarCard() {
  return (
    <div className="relative rounded-[28px] overflow-hidden border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl shadow-xl p-6 space-y-6 max-w-sm mx-auto group">
      <div className="absolute -inset-1 bg-gradient-to-r from-lime/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[28px]" />

      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-lime to-emerald-500 flex items-center justify-center text-black font-black text-lg shadow-md border-2 border-white dark:border-zinc-800 shrink-0">
          EW
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-800" />
        </div>
        <div className="text-left">
          <h4 className="font-extrabold text-zinc-900 dark:text-white text-sm">Emily Watson</h4>
          <p className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase">BIM Lead &amp; QS Coordinator</p>
          <p className="text-[10px] text-emerald-500 font-bold">@qs_lead</p>
        </div>
      </div>

      <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

      <div className="space-y-2.5 font-mono text-[11px] text-left">
        <div className="flex justify-between items-center text-zinc-700 dark:text-zinc-300">
          <span>Active Extraction</span>
          <span className="text-emerald-500 font-bold">100% Sync</span>
        </div>
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1 overflow-hidden">
          <div className="bg-lime h-1 rounded-full" style={{ width: '100%' }} />
        </div>
        <div className="space-y-1 text-zinc-500 dark:text-zinc-400 text-[10px]">
          <div>&gt; Model: Terminal_T3_Final.rvt</div>
          <div>&gt; Mapping elements to SMM7 standard...</div>
          <div>&gt; 4,821 elements mapped successfully.</div>
        </div>
      </div>
    </div>
  );
}

// FAQ Accordion
function AppleAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md"
        >
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full flex items-center justify-between p-6 text-left cursor-pointer group"
          >
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 pr-4 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
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
                <div className="px-6 pb-6 text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 pt-4">
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


export default function RevitToBOQPage() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [heroVideoActive, setHeroVideoActive] = useState(false);

  const stopHeroVideo = useCallback(() => {
    setHeroVideoActive(false);
  }, []);

  useEffect(() => {
    if (heroVideoActive) {
      window.addEventListener("click", stopHeroVideo);
      window.addEventListener("scroll", stopHeroVideo, { passive: true });
    }
    return () => {
      window.removeEventListener("click", stopHeroVideo);
      window.removeEventListener("scroll", stopHeroVideo);
    };
  }, [heroVideoActive, stopHeroVideo]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroScrollProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 1.05]);
  const textY = useTransform(heroScrollProgress, [0, 1], [0, -100]);

  const problemRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const workflowRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const isProblemInView = useInView(problemRef, { once: true, margin: "-100px" });
  const isSolutionInView = useInView(solutionRef, { once: true, margin: "-100px" });
  const isWorkflowInView = useInView(workflowRef, { once: true, margin: "-100px" });
  const isPricingInView = useInView(pricingRef, { once: true, margin: "-100px" });
  const isFaqInView = useInView(faqRef, { once: true, margin: "-100px" });

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

      {/* ─── HERO SECTION ─── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-[#E8F3F6] via-[#F4F9FA] to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 pt-28 pb-12 border-b border-zinc-200/40 dark:border-zinc-900"
      >
        <AnimatePresence>
          {heroVideoActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 z-40 bg-zinc-950 flex items-center justify-center"
            >
              <video
                src="/videos/word2bim_video_3.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-[10px] text-zinc-400 font-extrabold tracking-widest px-4 py-2.5 rounded-full pointer-events-none select-none z-50 uppercase">
                Click or scroll anywhere to exit demo
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Neon blue and teal blur blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-gradient-to-br from-lime/15 via-emerald-500/10 to-transparent rounded-full blur-[130px] opacity-75 animate-pulse" style={{ animationDuration: '12s' }} />
          <div className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] bg-gradient-to-tr from-emerald-500/10 via-zinc-400/5 to-transparent rounded-full blur-[140px] opacity-65" />
          <div className="absolute inset-0 bg-white/30 dark:bg-zinc-950/60 backdrop-blur-[1px]" />

          {/* Blueprint grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
              backgroundSize: "44px 44px",
            }}
          />
        </div>

        {/* Massive Background Typography Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
          <span className="text-[20vw] font-black text-zinc-900/[0.02] dark:text-white/[0.01] tracking-widest uppercase">
            BOQ
          </span>
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
          {/* Hero Header Typography Block */}
          <div className="max-w-4xl mx-auto text-center px-6 space-y-4 pb-8 pt-12">

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05] uppercase">
              Revit to BOQ Plugin
            </h1>
            <p className="text-lg sm:text-xl font-bold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-550 dark:from-white dark:via-zinc-300 dark:to-zinc-500 mt-2">
              Automated Takeoff
            </p>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-medium pb-2">
              Natively parses 3D models to generate fully priced, SMM7-compliant Bill of Quantities in hours instead of weeks.
            </p>

            {/* Added Watch Demo & Book a demo buttons with tag line directly in Hero Section */}
            <div className="flex flex-col items-center justify-center space-y-3 pt-2">
              <div className="flex gap-3">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setHeroVideoActive(true);
                  }}
                  variant="outline"
                  className="rounded-full bg-white dark:bg-zinc-950 font-extrabold text-xs px-5 py-3 cursor-pointer border-zinc-200 dark:border-zinc-800"
                >
                  <Play className="w-3 h-3 mr-1 text-zinc-900 dark:text-white fill-zinc-900 dark:fill-white" />
                  Watch Demo
                </Button>
                <Button
                  asChild
                  className="rounded-full bg-lime text-black hover:bg-lime/90 font-extrabold text-xs px-5 py-3 cursor-pointer border-0 shadow-md transition-transform hover:scale-105"
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
              <h4 className="text-[10px] font-extrabold tracking-widest text-zinc-450 dark:text-zinc-500 leading-none uppercase pt-1">
                FAST EXTRACT, FASTER ESTIMATION
              </h4>
            </div>
          </div>

          {/* 3-Column Floating Card Deck */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-6 relative z-10 pb-16">

            {/* Left Column: Floating Globe Card */}
            <div className="lg:col-span-4 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white/50 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-[2.5rem] shadow-xl space-y-5"
              >
                <GlowingDigitalGlobe className="w-28 h-28 text-emerald-500" />
                <div className="space-y-2 text-left">
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                    Automatic Quantity Takeoff
                  </h3>
                  <p className="text-xs text-zinc-650 dark:text-zinc-450 leading-relaxed font-medium">
                    Concolabs extracts dimensions directly from RVT model schedules. Fast, secure, and completely error-free.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Workflow Compare Switcher Card */}
            <div className="lg:col-span-8 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative bg-white/50 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2.5rem] p-6 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3">
                  <h3 className="font-extrabold text-xs tracking-wider uppercase text-zinc-900 dark:text-white">
                    Compare Workflows
                  </h3>
                  <div className="relative flex bg-zinc-200/60 dark:bg-zinc-950 p-0.5 rounded-xl w-36 justify-between border border-zinc-200/30 dark:border-zinc-800/30">
                    <button
                      onClick={() => handleTabClick("before")}
                      className={`relative z-10 w-[50%] py-0.5 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${activeTab === "before"
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-500"
                        }`}
                    >
                      Before
                    </button>
                    <button
                      onClick={() => handleTabClick("after")}
                      className={`relative z-10 w-[50%] py-0.5 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${activeTab === "after"
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-500"
                        }`}
                    >
                      After
                    </button>

                    <motion.div
                      layout
                      className="absolute top-0.5 bottom-0.5 bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-850 rounded-lg"
                      style={{ width: "calc(50% - 2px)" }}
                      animate={{
                        left:
                          activeTab === "before" ? 2 : "calc(100% / 2 + 2px)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 26,
                      }}
                    />
                  </div>
                </div>

                <div className="min-h-[110px] flex flex-col justify-center text-left">
                  <AnimatePresence mode="wait">
                    {activeTab === "before" ? (
                      <motion.div
                        key="before"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-2"
                      >
                        <div className="text-[9px] font-bold text-red-500 uppercase tracking-wider">
                          Manual Measuring
                        </div>
                        <ul className="space-y-1">
                          <li className="flex gap-2 text-zinc-500 dark:text-zinc-400 text-[11px] font-medium">
                            <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                            <span>QS isolates elements visually in the Revit model.</span>
                          </li>
                          <li className="flex gap-2 text-zinc-500 dark:text-zinc-400 text-[11px] font-medium">
                            <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                            <span>Rules applied manually line by line.</span>
                          </li>
                        </ul>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="after"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-2"
                      >
                        <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">
                          Revit to BOQ Plugin
                        </div>
                        <ul className="space-y-1">
                          <li className="flex gap-2 text-zinc-650 dark:text-zinc-350 text-[11px] font-medium">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Identifies all elements directly from Revit files.</span>
                          </li>
                          <li className="flex gap-2 text-zinc-650 dark:text-zinc-350 text-[11px] font-medium">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>AI predicts and applies rates automatically.</span>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>


      {/* ─── MIDDLE FEATURE SECTION ─── */}
      <section
        ref={problemRef}
        className="py-24 px-6 bg-white dark:bg-zinc-950 border-t border-zinc-150 dark:border-zinc-900 overflow-hidden relative"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
              Standardized Takeoffs
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-955 dark:text-white leading-[1.1] uppercase">
              Manage and estimate globally with Revit to BOQ
            </h2>
            <p className="text-zinc-650 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
              Concolabs Revit to BOQ Plugin helps QS teams automate element matching across 150+ element families quickly, securely, and without manual takeoff errors. By mapping concrete volumes, steel weights, and wall areas directly to standard rules of measurement (POMI/SMM7), you deliver reliable baseline schedules on day one.
            </p>
            <div className="pt-2">
              <Button
                asChild
                className="rounded-2xl px-6 py-5 font-bold shadow-md cursor-pointer border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 transition-transform hover:scale-105"
              >
                <Link href="/learnmore/cost-plan-calculator">
                  Explore Feasibility Feeds →
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Portrait Card Mockup with floating badges */}
          <div className="lg:col-span-6 relative flex items-center justify-center py-12">
            <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-tr from-lime/10 to-emerald-500/5 blur-xl opacity-80" />

            {/* Central Portrait Card Mockup */}
            <div className="relative z-10 bg-zinc-50 dark:bg-zinc-900/60 p-6 rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl max-w-sm w-full">
              {/* Mock photo display using premium vector graphics */}
              <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] bg-zinc-900 flex items-center justify-center border border-zinc-200/20">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-lime/20" />
                <svg className="w-32 h-32 text-zinc-850 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/85 backdrop-blur-md px-4 py-3 rounded-2xl border border-zinc-850 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">QS Coordinator</span>
                    <span className="text-xs font-bold text-white">Emily Watson</span>
                  </div>
                  <span className="px-2 py-0.5 bg-lime text-black rounded text-[9px] font-bold uppercase tracking-wider">ONLINE</span>
                </div>
              </div>
            </div>

            {/* Floating Badge 1: Top Left */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 left-4 sm:left-12 z-20 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-lg flex items-center gap-2.5"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Check className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[9px] text-zinc-400 font-bold block uppercase tracking-wider">BOQ Schedule</span>
                <span className="text-xs font-bold text-zinc-850 dark:text-zinc-150">Generated Successfully</span>
              </div>
            </motion.div>

            {/* Floating Badge 2: Bottom Right */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-8 right-4 sm:right-12 z-20 bg-zinc-950/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-zinc-800 shadow-xl flex items-center gap-2.5 text-white"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                $
              </div>
              <div className="text-left font-mono">
                <span className="text-[8px] text-zinc-400 block uppercase tracking-wider">Predicted Rate</span>
                <span className="text-xs font-bold text-emerald-400">$1,250 / m³</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* ─── HOW IT WORKS (INFINITY PATH WORKFLOW) ─── */}
      <section ref={solutionRef}>
        <RevitToBoqWorkflow />
      </section>

      <section ref={pricingRef} className="py-32 px-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
        <div className="space-y-16 max-w-4xl mx-auto">
          <div className="space-y-8 text-left">
            <div>
              <span className="text-xs font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-widest block mb-2">Deployment</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-zinc-50">Pricing &amp; Availability</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-sm">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Monthly Subscription</span>
                <p className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">USD 1,000<span className="text-sm font-normal text-zinc-455">/mo</span></p>
                <p className="text-xs text-zinc-500">Includes core Revit plugin features and rate prediction module with customizations.</p>
              </div>
              <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-sm">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Enterprise Add-on</span>
                <p className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">Custom Plan</p>
                <p className="text-xs text-zinc-500">For multi-office deployment and training on complex proprietary historical rates.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16 border-t border-zinc-200 dark:border-zinc-800 text-left">
            {/* Quick Facts Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-8 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-xl border-b border-zinc-100 dark:border-zinc-800 pb-4 text-zinc-900 dark:text-white">Quick Facts</h3>
                <div className="space-y-5 pt-4">
                  {[
                    { label: "Project Stage", value: "Tendering & Estimation" },
                    { label: "Ideal Target", value: "QS Consultancies" },
                    { label: "Target Regions", value: "Middle East, Sri Lanka" },
                    { label: "Deployment", value: "Revit native plugin (1 week)" },
                    { label: "Pricing Model", value: "USD 1,000/month flat-rate" },
                  ].map((fact, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 gap-4">
                      <span className="text-zinc-500 font-semibold shrink-0">{fact.label}</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 text-right">{fact.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                asChild
                className="w-full rounded-2xl py-7 font-bold shadow-xl border-0 bg-lime text-black hover:bg-lime/90 cursor-pointer mt-8"
              >
                <a
                  href="/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy Products →
                </a>
              </Button>
            </motion.div>

            {/* Related Products Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-6">Related Products</h4>
                <ul className="space-y-4 text-sm">
                  {[
                    { href: "/learnmore/acc-to-boq", label: "ACC to BOQ", tag: "Cloud Alternative" },
                    { href: "/learnmore/measureonair", label: "MeasureonAir", tag: "Construction" },
                    { href: "/learnmore/cost-plan-calculator", label: "Cost Plan Calculator", tag: "Pre-design" },
                  ].map((item, i) => (
                    <li key={i}>
                      <Link href={item.href} className="font-bold hover:text-primary transition-colors flex items-center justify-between">
                        <span>{item.label}</span>
                        <span className="text-xs text-zinc-400 font-medium">{item.tag}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Link href="/learnmore" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  View full suite <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── COMPARISON GRID ─── */}
      <ComparisonGrid
        sectionTitle="Why choose Revit to BOQ"
        card1={{
          title: "Manual Method",
          subtitle: "Manual Revit isolates & Excel",
          features: [
            "2–3 weeks to build priced BOQ",
            "Manually classifying Revit model objects",
            "Prone to missing complex structural joints",
            "Price rate cards looked up by hand in Excel files",
          ],
          metric: { value: "WEEKS", label: "TIMELINE" },
          button: { text: "Traditional Route", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
        }}
        card2={{
          title: "Revit to BOQ",
          subtitle: "AI Native Plugin",
          features: [
            "Completed in hours instead of weeks",
            "Automated component identification SMM7/POMI",
            "Deep learning predicts local rate cards",
            "Native Revit schedule extraction",
          ],
          metric: { value: "HOURS", label: "TIMELINE" },
          button: { text: "Book A Demo", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
        }}
        card3={{
          title: "Standard Take-off Apps",
          subtitle: "Partial Tools",
          features: [
            "Extract dimensions but don't apply pricing",
            "No native SMM7 measurement logic mapping",
            "Heavy manual configuration steps needed",
            "Only partial process automation",
          ],
          metric: { value: "PARTIAL", label: "AUTOMATION" },
          button: { text: "Other Tools", href: "https://chat.openai.com" },
        }}
      />

      {/* ─── FAQ ─── */}
      <section ref={faqRef} className="py-32 px-6 bg-[#FAFAF8] dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
              FAQ
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-955 dark:text-white leading-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <AppleAccordion
            items={[
              {
                q: "Do we need a full 3D BIM model to run the extraction plugin?",
                a: "Yes. The plugin is built to work natively inside Autodesk Revit. If you only have 2D PDF drawings, you should use our 2D Drawing to BOQ product instead.",
              },
              {
                q: "Which rules of measurement does the mapping classifier support?",
                a: "The classifier supports POMI (Principles of Measurement (International)) and SMM7 (Standard Method of Measurement) natively. Custom corporate measurement rules can also be trained.",
              },
              {
                q: "How does the AI predict unit pricing rates?",
                a: "The engine runs a custom regression model trained against your historical project tender bills. It matches material keywords, dimensions, and regional context to suggest priced rates.",
              },
              {
                q: "Are my proprietary rate card models secure?",
                a: "Yes. Your pricing data and historical bills are sandboxed per enterprise. We never train public models using your proprietary cost intelligence.",
              },
            ]}
          />
        </div>
      </section>

      {/* ─── BOTTOM BANNER (GREY WITH DESIGN) ─── */}
      <section className="relative bg-zinc-100 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 overflow-hidden py-32 border-t border-zinc-200 dark:border-zinc-800">

        {/* Design: Subtle Blueprint Grid pattern overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        {/* Soft emerald radial glow to add a subtle design touch to the background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 px-6 relative z-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase text-zinc-955 dark:text-white">
            Scale beyond limits with Revit to BOQ
          </h2>
          <p className="text-zinc-550 dark:text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-medium">
            Whether you're pricing a high-rise tower or a residential complex, Revit to BOQ automates quantity takeoff instantly.
          </p>

          <div className="pt-4 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 py-6 font-bold shadow-xl border-0 bg-lime text-black hover:bg-lime/90 cursor-pointer transition-transform hover:scale-105"
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
