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
  Maximize,
  Minimize,
  MessageSquare,
  CalendarDays,
  Monitor,
  Bell,
  ClipboardList,
  Timer,
  UserCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComparisonGrid from "@/components/learnmore/comparison-grid";
import PrelimWorkflow from "@/components/learnmore/prelim-workflow";

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

// ─── Project Chat Panel (Hero Visual) ───
function ProjectChatPanel() {
  return (
    <div className="relative rounded-[28px] overflow-hidden border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl shadow-xl max-w-sm mx-auto group">
      <div className="absolute -inset-1 bg-gradient-to-r from-lime/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[28px]" />

      {/* Chat Header */}
      <div className="px-5 pt-5 pb-3 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lime to-emerald-500 flex items-center justify-center text-black font-black text-xs shadow-md">
              MT
            </div>
            <div className="text-left">
              <h4 className="font-extrabold text-zinc-900 dark:text-white text-sm leading-tight">Marina Tower</h4>
              <p className="text-[9px] text-zinc-500 font-bold tracking-wider uppercase">Project Chat</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-bold text-emerald-500">4 online</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="px-5 py-3 space-y-3">
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-white text-[8px] font-black shrink-0 mt-0.5">SN</div>
          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%]">
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 block">Samantha N. (QS Lead)</span>
            <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">L3 slab measurements uploaded — ready for review ✅</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-white text-[8px] font-black shrink-0 mt-0.5">RK</div>
          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%]">
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 block">Ravi K. (Sr. QS)</span>
            <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">Noted. I'll check the column quantities too.</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-white text-[8px] font-black shrink-0 mt-0.5">AC</div>
          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%]">
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 block">Amal C. (Junior QS)</span>
            <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">Do we need to remeasure the basement walls?</span>
          </div>
        </div>

        {/* Task Chip */}
        <div className="bg-lime/10 border border-lime/30 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-3.5 h-3.5 text-lime" />
            <span className="text-[11px] font-bold text-zinc-900 dark:text-white">Measure L3 slab</span>
          </div>
          <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">Sent to Review</span>
        </div>
      </div>

      {/* Chat Input */}
      <div className="px-5 pb-5 pt-2">
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-full px-4 py-2.5 border border-zinc-200/50 dark:border-zinc-700/50">
          <MessageSquare className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="text-[11px] text-zinc-400 font-medium">Message the project team...</span>
        </div>
      </div>
    </div>
  );
}

export default function PrelimPage() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [heroVideoActive, setHeroVideoActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoAreaRef = useRef<HTMLDivElement>(null);

  const stopHeroVideo = useCallback(() => {
    setHeroVideoActive(false);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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
  const workflowRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const isProblemInView = useInView(problemRef, { once: true, margin: "-100px" });
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
              <div
                ref={videoAreaRef}
                onDoubleClick={toggleFullscreen}
                className="absolute inset-0 z-50 cursor-pointer select-none"
              >
                <video
                  ref={videoRef}
                  src="/videos/Prelim/prelim_product_walkthrough_16x9_master-h264.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />

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

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-[10px] text-zinc-400 font-extrabold tracking-widest px-4 py-2.5 rounded-full pointer-events-none select-none z-40 uppercase">
                  Scroll anywhere to exit
                </div>
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
            PRELIM
          </span>
        </div>

        <div className="absolute top-28 left-6 z-30">
          <Link
            href="/learnmore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-sm font-semibold text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-all hover:bg-white/80 dark:hover:bg-black/80 hover:scale-105 active:scale-95 group shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Learn More
          </Link>
        </div>

        <motion.div
          style={{ y: textY, opacity: heroOpacity }}
          className="relative w-full z-10"
        >
          {/* Hero Header Typography Block */}
          <div className="max-w-4xl mx-auto text-center px-6 space-y-4 pb-8 pt-12">

            {/* Breadcrumb pill */}
            <span className="inline-block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 px-3 py-1 rounded-full uppercase tracking-widest">
              Tasks &amp; Productivity
            </span>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05] uppercase product-title-sweep">
              Prelim
            </h1>
            <p className="text-lg sm:text-xl font-bold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-300 dark:to-zinc-500 mt-2">
              Construction Task &amp; Productivity Management
            </p>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-medium pb-2">
              Run your whole QS team from one place. Create and assign work, track time and attendance, chat with your team where the work lives, and benchmark planned against actual productivity in real time.
            </p>

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
              <h4 className="text-[10px] font-extrabold tracking-widest text-zinc-400 dark:text-zinc-500 leading-none uppercase pt-1">
                PLAN · EXECUTE · BENCHMARK
              </h4>
            </div>

            {/* Chat Panel Visual — Messenger Placement #1 */}
            <div className="max-w-2xl mx-auto w-full px-6 relative z-10 pb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white/50 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 p-8 rounded-[2.5rem] shadow-xl space-y-6 flex flex-col items-center text-center hover:scale-[1.01] transition-transform duration-300"
              >
                <div className="space-y-3 w-full">
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                    Every task, tracked from brief to sign-off
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium max-w-md mx-auto">
                    Prelim turns scattered spreadsheets and chat threads into one structured workflow. Every task carries an owner, a deadline, a live timer and a clear status, so nothing slips and everyone knows what is next.
                  </p>
                </div>

                <div className="w-full border-t border-zinc-200/50 dark:border-zinc-800/50 pt-6">
                  <div className="flex items-center justify-between mb-6 pb-2">
                    <h4 className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-500 uppercase">
                      Compare Workflows
                    </h4>
                    <div className="relative flex bg-zinc-150/80 dark:bg-zinc-950/80 p-1 rounded-xl w-48 justify-between border border-zinc-200/50 dark:border-zinc-850/50">
                      <button
                        onClick={() => handleTabClick("before")}
                        className={`relative z-10 w-24 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          activeTab === "before" ? "text-zinc-900 dark:text-white" : "text-zinc-400"
                        }`}
                      >
                        Before
                      </button>
                      <button
                        onClick={() => handleTabClick("after")}
                        className={`relative z-10 w-24 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          activeTab === "after" ? "text-zinc-900 dark:text-white" : "text-zinc-400"
                        }`}
                      >
                        After
                      </button>
                      <motion.div
                        layoutId="prelim-toggle-pill"
                        className="absolute top-1 bottom-1 bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 rounded-lg"
                        animate={{ left: activeTab === "before" ? 4 : 92, width: 92 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      />
                    </div>
                  </div>

                  <div className="min-h-[220px] flex flex-col justify-center text-left w-full">
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
                            Without Prelim — spreadsheets, paper and WhatsApp
                          </div>
                          <ul className="space-y-3">
                            <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm items-start bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50">
                              <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              <span>Work tracked across spreadsheets, email and chat apps</span>
                            </li>
                            <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm items-start bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50">
                              <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              <span>Time and attendance logged on paper, or not at all</span>
                            </li>
                            <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm items-start bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50">
                              <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              <span>No clear view of who is overloaded or behind</span>
                            </li>
                            <li className="flex gap-3 text-zinc-900 dark:text-zinc-100 text-sm items-start bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50 font-bold">
                              <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              <span>Planned versus actual productivity never measured</span>
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
                            With Prelim — one workflow for the whole team
                          </div>
                          <ul className="space-y-3">
                            <li className="flex gap-3 text-zinc-600 dark:text-zinc-350 text-sm items-start bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>Every task assigned, timed and tracked in one place</span>
                            </li>
                            <li className="flex gap-3 text-zinc-600 dark:text-zinc-350 text-sm items-start bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>Self-service check-in and out: office, site or remote</span>
                            </li>
                            <li className="flex gap-3 text-zinc-600 dark:text-zinc-350 text-sm items-start bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>Colour-coded deadlines flag risk before it is late</span>
                            </li>
                            <li className="flex gap-3 text-zinc-900 dark:text-zinc-100 text-sm items-start bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50 font-bold">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>Planned versus actual benchmarking on every task</span>
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── MIDDLE FEATURE SECTION (Practice + Chat split) ─── */}
      <section
        ref={problemRef}
        className="py-24 px-6 bg-white dark:bg-zinc-950 border-t border-zinc-150 dark:border-zinc-900 overflow-hidden relative"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
              One place for work and talk
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.1] uppercase">
              Manage your whole practice with Prelim
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
              From task creation to delivery sign-off, Prelim keeps the work, the people and the conversation together. Discuss a task without leaving it, route every submission through a formal review gate, and keep a full activity trail on everything that happens.
            </p>

            {/* Chat feature callout — Messenger Placement #2 */}
            <div className="bg-lime/5 border border-lime/20 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-lime" />
                <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Built-in chat</span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                The In-Platform Messenger gives every project its own thread, so your team talks where the work lives instead of losing decisions in WhatsApp and email.
              </p>
            </div>

            <Link
              href="#feature-grid"
              className="inline-flex items-center gap-1 text-sm font-bold text-zinc-900 dark:text-white hover:underline mt-2"
            >
              Explore the full feature set <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Right Column: Task Activity Panel */}
          <div className="lg:col-span-6 relative flex items-center justify-center py-12">
            <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-tr from-lime/10 to-emerald-500/5 blur-xl opacity-80" />

            <div className="relative z-10 bg-zinc-50 dark:bg-zinc-900/60 p-6 rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl max-w-sm w-full">
              <div className="relative rounded-[2rem] overflow-hidden bg-zinc-900 border border-zinc-200/20 p-5">
                {/* Task Activity Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-lime" />
                    <span className="text-xs font-bold text-white">Task Activity</span>
                  </div>
                  <span className="text-[9px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full font-bold">TASK-042</span>
                </div>

                {/* Status Change */}
                <div className="space-y-3">
                  <div className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase">Status Change</span>
                      <span className="text-[8px] text-zinc-500">10:32 AM</span>
                    </div>
                    <p className="text-xs text-zinc-300">
                      <span className="text-emerald-400 font-bold">Sent to Review</span> — awaiting QS lead approval
                    </p>
                  </div>

                  {/* Flagged Query with replies in chat */}
                  <div className="bg-zinc-800/50 rounded-xl p-3 border border-lime/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase flex items-center gap-1.5">
                        <MessageSquare className="w-3 h-3 text-lime" />
                        Query
                      </span>
                      <span className="text-[8px] text-zinc-500">3 replies in chat</span>
                    </div>
                    <p className="text-xs text-zinc-300">
                      <span className="text-zinc-400">Ravi K.:</span> Column C3 dimensions don't match site measure — can we confirm?
                    </p>
                  </div>

                  {/* Logged Time */}
                  <div className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase">Logged Time</span>
                      <span className="text-[8px] text-zinc-500">Actual: 3.2h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-zinc-300">
                        <span className="text-lime font-bold">+12% efficient</span> vs planned
                      </p>
                      <span className="text-[9px] text-emerald-400 font-bold">On Track</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (TASK LIFECYCLE STEPPER) ─── */}
      <section ref={workflowRef}>
        <PrelimWorkflow />
      </section>

      {/* ─── FEATURE GRID ─── */}
      <section id="feature-grid" className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-left space-y-3">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
            Capabilities
          </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white uppercase">
              Everything your practice needs
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* A — Task Creation */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-lime/10 flex items-center justify-center mb-4">
                <ClipboardList className="w-5 h-5 text-lime" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Task Creation</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Structured task IDs, scope breakdown, designation-based assignment across every QS role, and projects grouped by client.
              </p>
            </div>

            {/* B — Task Execution */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-lime/10 flex items-center justify-center mb-4">
                <Timer className="w-5 h-5 text-lime" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Task Execution</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Live timer or manual time entry, measurement logging, a five-stage status workflow, risk and query flags, and colour-coded deadlines.
              </p>
            </div>

            {/* C — Attendance */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-lime/10 flex items-center justify-center mb-4">
                <UserCheck className="w-5 h-5 text-lime" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Attendance</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Self-service check-in and out with work location, present, absent, half-day and leave statuses, leave approvals and a full audit trail.
              </p>
            </div>

            {/* D — Productivity Benchmarking */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-lime/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-lime" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Productivity Benchmarking</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Planned versus actual rates, efficiency scores, and variance analytics across every task, person and project.
              </p>
            </div>

            {/* E — In-Platform Messenger (Highlighted dark card) — Messenger Placement #3 */}
            <div className="bg-zinc-900 dark:bg-zinc-950 border border-lime/30 rounded-3xl p-6 shadow-lg relative overflow-hidden group hover:border-lime/50 transition-all duration-300">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-lime/5 rounded-full blur-2xl pointer-events-none" />
              <div className="w-10 h-10 rounded-xl bg-lime/20 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5 text-lime" />
              </div>
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                In-Platform Messenger
                <span className="text-[8px] font-bold text-black bg-lime px-2 py-0.5 rounded-full uppercase tracking-wider">Highlight</span>
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Project-based messaging built into Prelim, so discussion stays attached to the task instead of scattering across WhatsApp and email.
              </p>
            </div>

            {/* F — Calendar & Events */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-lime/10 flex items-center justify-center mb-4">
                <CalendarDays className="w-5 h-5 text-lime" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Calendar &amp; Events</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Deadlines, milestones, meetings, submissions and hearing dates in one shared view, with deadline-approaching alerts.
              </p>
            </div>

            {/* G — Monitoring Layer */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-lime/10 flex items-center justify-center mb-4">
                <Monitor className="w-5 h-5 text-lime" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Monitoring Layer</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Dashboards for Heads of Country and Department to track workload, progress and performance across the practice.
              </p>
            </div>

            {/* H — Notifications */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-lime/10 flex items-center justify-center mb-4">
                <Bell className="w-5 h-5 text-lime" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Notifications</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                In-app and email notifications fire as task deadlines approach, so nothing is missed.
              </p>
            </div>

            {/* Add-on note card */}
            <div className="bg-zinc-100 dark:bg-zinc-800/50 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl p-6 flex flex-col justify-center items-center text-center">
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wider">Add-on</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Need BOQ export or auto-proposals? Proposal support and BOQ export sit outside the base platform and can be added later through a written variation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section ref={pricingRef} className="py-32 px-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
        <div className="space-y-16 max-w-4xl mx-auto">
          <div className="space-y-8 text-left">
            <div>
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-2">Deployment</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-zinc-50">Pricing &amp; Availability</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {/* Platform Build (highlighted) */}
              <div className="p-8 bg-white dark:bg-zinc-900 border-2 border-lime/40 dark:border-lime/30 rounded-3xl space-y-3 shadow-md relative">
                <div className="absolute -top-3 right-4 bg-lime text-black text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Popular</div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">Platform Build</span>
                <p className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">USD 3,900<span className="text-sm font-normal text-zinc-500"> one-off</span></p>
                <p className="text-xs text-zinc-500">Baseline platform (four core modules) plus the V2 feature set, delivered and signed off.</p>
              </div>
              <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-sm">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">Hosting &amp; Maintenance</span>
                <p className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">USD 20<span className="text-sm font-normal text-zinc-500">/mo</span></p>
                <p className="text-xs text-zinc-500">Server hosting, 100 GB storage, support and bug fixes, uptime monitoring, and roadmap improvements.</p>
              </div>
              <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-sm">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">Additional Scope</span>
                <p className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">USD 10<span className="text-sm font-normal text-zinc-500">/hr</span></p>
                <p className="text-xs text-zinc-500">Features beyond the agreed set, scoped and quoted in writing before any work begins.</p>
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
                    { label: "Project Stage", value: "Delivery & Operations" },
                    { label: "Ideal Target", value: "QS Consultancies & Teams" },
                    { label: "Target Regions", value: "Sri Lanka, Middle East, Australia" },
                    { label: "Deployment", value: "Cloud web app (~1 week)" },
                    { label: "Pricing Model", value: "Build + USD 20/month hosting" },
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
                <a href="/#">
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
                    { href: "/learnmore/revit-to-boq", label: "Revit to BOQ", tag: "Automated takeoff" },
                    { href: "/learnmore/measureonair", label: "MeasureonAir", tag: "On-screen measurement" },
                    { href: "/learnmore/builderbot", label: "BuilderBot.ai", tag: "FIDIC contract assistant" },
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

      {/* ─── COMPARISON GRID — Messenger Placement #4 ─── */}
      <ComparisonGrid
        sectionTitle="Why choose Prelim"
        card1={{
          title: "Spreadsheets & chat apps",
          subtitle: "Fragmented",
          features: [
            "Tasks in Excel, time on paper",
            "Decisions lost across WhatsApp and email",
            "No attendance or work-location record",
            "Productivity never benchmarked",
          ],
          metric: { value: "FRAGMENTED", label: "" },
          button: { text: "Traditional Route", href: "#" },
        }}
        card2={{
          title: "Prelim",
          subtitle: "Unified",
          features: [
            "One workflow from brief to sign-off",
            "Built-in project chat on every task",
            "Attendance, leave and work location",
            "Planned vs actual benchmarking",
          ],
          metric: { value: "UNIFIED", label: "" },
          button: { text: "Book A Demo", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
        }}
        card3={{
          title: "Generic PM tools",
          subtitle: "Not built for QS",
          features: [
            "Generic boards, no QS context",
            "No measurement or rate logic",
            "No attendance or leave handling",
            "No productivity norms or variance",
          ],
          metric: { value: "NOT QS", label: "BUILT FOR" },
          button: { text: "Other Tools", href: "#" },
        }}
      />

      {/* ─── FAQ ─── */}
      <section ref={faqRef} className="py-32 px-6 bg-[#FAFAF8] dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
              FAQ
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Can the team chat about tasks inside Prelim?", // Messenger Placement #5
                a: "Yes. The In-Platform Messenger gives every project its own chat thread, so conversation stays attached to the work. Discuss a task, flag a query or agree a change without leaving the platform, and keep the discussion in the same place as the activity trail instead of scattering it across WhatsApp and email.",
              },
              {
                q: "How does attendance and leave work?",
                a: "Staff check in and out from the platform and pick their work location: office, site or remote. Statuses cover present, absent, half-day and leave. Leave requests route to the Finance & Admin Executive for approval, and every event is logged with a timestamp for a complete audit trail.",
              },
              {
                q: "What does productivity benchmarking measure?",
                a: "It compares the rate you planned for a task against the rate actually achieved, then rolls that into efficiency scores and variance analytics per task, per person and per project.",
              },
              {
                q: "Can we manage several clients and projects at once?",
                a: "Yes. Projects are grouped and categorised under their respective clients, and every task carries a structured ID for traceability and audit across the whole practice.",
              },
              {
                q: "Are BOQ export and proposal generation included?",
                a: "Not in the base platform. BOQ export, Proposal Support and Auto Proposal sit outside the core scope and can be reinstated later through a written variation. Additional scope is charged at USD 10 per hour, scoped and agreed in writing first.",
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 open:border-lime/40 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between p-6 text-left cursor-pointer select-none">
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 pr-4 leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM BANNER ─── */}
      <section className="relative bg-zinc-100 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 overflow-hidden py-32 border-t border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }}
          />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 px-6 relative z-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase text-zinc-950 dark:text-white">
            Run your practice on Prelim
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-medium">
            Bring tasks, time, attendance, productivity and team chat into one platform built for quantity surveyors.
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
