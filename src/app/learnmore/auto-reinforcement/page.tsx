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
  Check, // Imported here
  X,
  Minimize2,
  Upload,
  Cpu,
  Settings,
  FileText,
  Factory,
  Layers,
  Activity,
  Maximize2,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComparisonGrid from "@/components/learnmore/comparison-grid";

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

const customSteps = [
  {
    stepNumber: "1",
    id: "step1",
    title: "Upload Drawing",
    description: "Upload the structural drawing in PDF or image format. The system supports complex layouts with overlapping reinforcement details.",
    bgClass: "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950",
    borderColor: "border-zinc-300 dark:border-zinc-700",
    image: "/images/2d_structural_drawing.png",
    icon: Upload,
  },
  {
    stepNumber: "2",
    id: "step2",
    title: "Notation Identification",
    description: "Our vision model scans and parses all rebar notation standards including diameter, bar count, and steel grade.",
    bgClass: "bg-zinc-150 text-zinc-900 dark:bg-zinc-800 dark:text-white",
    borderColor: "border-zinc-300 dark:border-zinc-700",
    image: "/images/cv_blueprint_analysis.png",
    icon: Cpu,
  },
  {
    stepNumber: "3",
    id: "step3",
    title: "Measurement Extraction",
    description: "The system calculates span lengths, clear covers, hooks, bends, and spatial distributions automatically.",
    bgClass: "bg-zinc-250 text-zinc-900 dark:bg-zinc-800 dark:text-white",
    borderColor: "border-zinc-300 dark:border-zinc-700",
    image: "/images/2d_structural_drawing.png",
    icon: Settings,
  },
  {
    stepNumber: "4",
    id: "step4",
    title: "Schedule Generation",
    description: "AI agents compile the complete reinforcement schedule with bar bending diagrams and material weights.",
    bgClass: "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-white",
    borderColor: "border-zinc-300 dark:border-zinc-700",
    image: "/images/3d_revit_model.png",
    icon: FileText,
  },
  {
    stepNumber: "5",
    id: "step5",
    title: "Factory Integration",
    description: "Direct production formatting pushes cutting schedules straight into fabricator machinery pipelines.",
    bgClass: "bg-zinc-800 text-white dark:bg-zinc-900 dark:text-zinc-100",
    borderColor: "border-zinc-300 dark:border-zinc-700",
    image: "/images/3d_revit_model.png",
    icon: Factory,
  },
];

export default function AutoReinforcementPage() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [hoveredStep, setHoveredStep] = useState<typeof customSteps[number] | null>(null);

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
  const workflowRef = useRef<HTMLDivElement>(null);
  const capabilitiesRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const isProblemInView = useInView(problemRef, { once: true, margin: "-100px" });
  const isCapabilitiesInView = useInView(capabilitiesRef, { once: true, margin: "-100px" });
  const isPricingInView = useInView(pricingRef, { once: true, margin: "-100px" });
  const isFaqInView = useInView(faqRef, { once: true, margin: "-100px" });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const infographicRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: infoProgress } = useScroll({
    target: infographicRef,
    offset: ["start end", "end start"],
  });

  const centerSphereY = useTransform(infoProgress, [0, 1], [-80, 280]);
  const stepY1 = useTransform(infoProgress, [0, 1], [-20, 20]);
  const stepY2 = useTransform(infoProgress, [0, 1], [-40, 40]);
  const stepY3 = useTransform(infoProgress, [0, 1], [-10, 10]);
  const stepY4 = useTransform(infoProgress, [0, 1], [-50, 50]);
  const stepY5 = useTransform(infoProgress, [0, 1], [-30, 30]);

  const stepTransforms = [stepY1, stepY2, stepY3, stepY4, stepY5];

  const demoVideoUrl = "https://drive.google.com/file/d/1XBMGXEbDW-rCS--nutSVrk7YtacQY0KW/preview";

  const exitDemoMode = useCallback(() => {
    if (!isDemoMode) return;
    setIsDemoMode(false);
  }, [isDemoMode]);

  const enterDemoMode = useCallback(() => {
    setIsDemoMode(true);
  }, []);

  const startScrollYRef = useRef(0);

  useEffect(() => {
    if (isDemoMode) {
      startScrollYRef.current = window.scrollY;
    }
  }, [isDemoMode]);

  useEffect(() => {
    if (!isDemoMode) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = Math.abs(currentScrollY - startScrollYRef.current);
      if (diff > 80) {
        exitDemoMode();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitDemoMode();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDemoMode, exitDemoMode]);

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
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-[#FFEF1A]/30 selection:text-black">
      <Navbar />

      {/* ─── Hero Section ─── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden bg-[#FAFAF8] dark:bg-zinc-950"
      >
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-955 dark:to-black" />
          <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-gradient-to-br from-[#FFEF1A]/10 via-zinc-400/5 to-transparent rounded-full blur-[130px] opacity-70 animate-pulse" style={{ animationDuration: '9s' }} />
          <div className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] bg-gradient-to-tr from-zinc-300/20 via-zinc-400/5 to-transparent rounded-full blur-[140px] opacity-65" />
          <div className="absolute inset-0 bg-white/45 dark:bg-zinc-955/65 backdrop-blur-[1px]" />

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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-black/60 backdrop-blur-md text-sm font-semibold text-zinc-650 hover:text-zinc-955 dark:text-zinc-400 dark:hover:text-white transition-all hover:bg-white/80 dark:hover:bg-black/80 hover:scale-105 active:scale-95 group shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Link>
        </div>

        <motion.div
          style={{ y: textY, opacity: heroOpacity }}
          className="relative w-full z-10"
        >
          <div className="px-6 pt-32 pb-20 max-w-6xl mx-auto min-h-[500px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!isDemoMode ? (
                <motion.div
                  key="hero-content"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
                >
                  <div className="lg:col-span-7 space-y-6">
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="space-y-6"
                    >
                      <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-955 dark:text-white leading-[1.05] uppercase">
                        Auto Reinforcement
                      </motion.h1>

                      <motion.p variants={fadeInUp} className="text-2xl sm:text-3xl text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed max-w-xl">
                        Rebar schedules from drawings.
                        <br />
                        <span className="text-zinc-955 dark:text-white font-bold">Automatically.</span>
                      </motion.p>

                      <motion.p variants={fadeInUp} className="text-sm sm:text-base text-zinc-650 dark:text-zinc-400 leading-relaxed max-w-xl font-medium">
                        Computer vision reads rebar notations, lengths, and spans from structural drawings and produces a complete reinforcement schedule. No manual notation counting, no Excel, no errors.
                      </motion.p>

                      <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
                        <Button onClick={enterDemoMode} variant="outline" size="lg" className="rounded-2xl px-8 py-7 font-bold shadow-sm cursor-pointer border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 transition-transform hover:scale-105">
                          <Play className="w-4 h-4 mr-2 text-zinc-955 dark:text-zinc-300 fill-zinc-955 dark:fill-zinc-300" />
                          Watch Demo
                        </Button>
                        <Button asChild size="lg" className="rounded-2xl px-8 py-7 font-bold shadow-xl shadow-zinc-955/5 cursor-pointer bg-[#FFEF1A] text-zinc-955 hover:bg-[#e6d717] border-0 transition-transform hover:scale-105">
                          <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                            Book a Demo
                          </a>
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: 100, rotateY: -15 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="lg:col-span-5"
                  >
                    <div className="relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl">
                      <div className="flex items-center justify-between mb-8 border-b border-zinc-200 dark:border-white/10 pb-5">
                        <h3 className="font-bold text-lg tracking-tight text-zinc-955 dark:text-white">
                          Compare Workflows
                        </h3>
                        <div className="relative flex bg-zinc-150/80 dark:bg-zinc-950/80 p-1.5 rounded-2xl w-52 justify-between border border-zinc-200/50 dark:border-zinc-850/50">
                          <button
                            onClick={() => handleTabClick("before")}
                            className={`relative z-10 w-24 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${activeTab === "before" ? "text-zinc-955" : "text-zinc-550 dark:text-zinc-400"
                              }`}
                          >
                            Before
                          </button>
                          <button
                            onClick={() => handleTabClick("after")}
                            className={`relative z-10 w-24 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${activeTab === "after" ? "text-zinc-955" : "text-zinc-550 dark:text-zinc-400"
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
                              <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
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
                                  <li key={i} className="flex gap-3 text-zinc-650 dark:text-zinc-350 text-sm bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50 shadow-inner">
                                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span className="font-medium text-zinc-955 dark:text-white">{item}</span>
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
              ) : (
                <motion.div
                  key="hero-video"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="w-full max-w-5xl mx-auto aspect-video rounded-[2rem] overflow-hidden bg-black shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 relative"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <iframe
                    src={`${demoVideoUrl}?autoplay=1&rel=0`}
                    className="w-full h-full border-0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      exitDemoMode();
                    }}
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
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
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-955 dark:text-white leading-tight uppercase">
                The most tedious task in estimating
              </h2>
              <div className="w-20 h-1.5 bg-[#FFEF1A] rounded-full" />
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

      {/* ─── Solution Section ─── */}
      <section
        ref={workflowRef}
        className="relative py-32 px-6 bg-zinc-50 dark:bg-zinc-900/20 border-y border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-24">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
              The Architecture
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-955 dark:text-white uppercase">
              How It Works
            </h2>
            <p className="text-zinc-550 dark:text-zinc-400 text-sm sm:text-base font-medium">
              A high-precision modular flow map extracting automation vectors straight from source prints. Hover steps to preview engineering modules.
            </p>
          </div>

          <div ref={infographicRef} className="relative min-h-[950px] lg:min-h-[750px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-8">
            <div className="lg:col-span-7 space-y-8 z-10 relative">
              {customSteps.map((step, idx) => {
                const IconComponent = step.icon;
                const dynamicY = stepTransforms[idx];

                return (
                  <motion.div
                    key={idx}
                    style={{ y: dynamicY }}
                    onMouseEnter={() => setHoveredStep(step)}
                    onMouseLeave={() => setHoveredStep(null)}
                    className="relative flex items-center w-full max-w-xl group cursor-pointer"
                  >
                    <div className="text-7xl font-black font-mono leading-none select-none pr-4 w-16 text-center shrink-0 text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-955 dark:group-hover:text-white group-hover:scale-105 transition-all duration-300">
                      {step.stepNumber}
                    </div>

                    <div className="flex-1 flex items-center justify-between p-5 rounded-r-full rounded-l-2xl border-l-4 border-zinc-350 dark:border-zinc-700 shadow-lg bg-white dark:bg-zinc-900 hover:shadow-2xl hover:border-zinc-955 dark:hover:border-white transition-all duration-300">
                      <div className="pr-4 max-w-[72%]">
                        <h3 className="font-extrabold text-sm tracking-wide text-zinc-955 dark:text-white mb-1 uppercase group-hover:text-black dark:group-hover:text-white transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                          {step.description}
                        </p>
                      </div>

                      <div className="w-14 h-14 rounded-full flex flex-col items-center justify-center p-1.5 text-center shrink-0 shadow-md bg-white dark:bg-zinc-800 border border-zinc-150 dark:border-zinc-750 group-hover:rotate-6 transition-transform">
                        <IconComponent className="w-4 h-4 text-zinc-800 dark:text-zinc-200 mb-0.5" />
                        <span className="text-[6px] font-black text-zinc-400 dark:text-zinc-500 leading-tight uppercase tracking-tight">
                          Process Vector
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end relative h-full w-full min-h-[400px]">
              <motion.div
                style={{ y: centerSphereY }}
                className="w-80 h-80 rounded-full bg-white dark:bg-zinc-900 border-[6px] border-[#FFEF1A] flex flex-col items-center justify-center p-8 text-center shadow-2xl relative overflow-hidden sticky top-36 z-20"
              >
                <AnimatePresence mode="wait">
                  {hoveredStep ? (
                    <motion.div
                      key={hoveredStep.id}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-10 bg-zinc-950 flex flex-col items-center justify-center p-6 text-center"
                    >
                      <div
                        className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none filter brightness-50"
                        style={{ backgroundImage: `url(${hoveredStep.image})` }}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5),rgba(0,0,0,0.9))]" />

                      <div className="relative z-20 space-y-2">
                        <span className="text-[9px] font-black tracking-widest text-zinc-950 bg-[#FFEF1A] px-2.5 py-1 rounded-md uppercase">
                          Step {hoveredStep.stepNumber} Active
                        </span>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight pt-2 leading-tight">
                          {hoveredStep.title}
                        </h3>
                        <p className="text-[10px] text-zinc-400 font-medium leading-relaxed max-w-[210px] mx-auto">
                          {hoveredStep.description}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default-circle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center z-0"
                    >
                      <div className="absolute -inset-[6px] border-[6px] border-transparent border-r-[#FFEF1A] rounded-full animate-pulse pointer-events-none opacity-40" />

                      <h2 className="text-2xl font-black text-zinc-955 dark:text-white tracking-tight uppercase leading-none">
                        5 Steps
                      </h2>
                      <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1.5 mb-2">
                        Infographic Center
                      </h4>

                      <div className="w-12 h-0.5 bg-zinc-955 dark:bg-white my-1" />

                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal font-medium max-w-[190px]">
                        Hover process vector panels horizontally leftward to drive live sheet previews inside this coordinated core framework.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Integration Section (Updated to Vryno-style) ─── */}
      <section className="py-24 px-6 bg-[#FAFAF8] dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-955 dark:text-white uppercase">
              Get started in days, not weeks.
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium">
              Your workflow shouldn't take forever to fit in.
            </p>
          </div>

          {/* Main Integration Feature */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-12 items-center">

            {/* Text Content */}
            <div className="flex-1 space-y-6">
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <strong>Auto Reinforcement</strong> integrates instantly with your existing design suite. Just upload your files—PDFs, CAD images, and structural specs sync automatically.
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                No tech headaches, no long onboarding cycles. Just a plugin that feels like it’s always been part of your design workflow.
              </p>
            </div>

            {/* Visual Component */}
            <div className="flex-none w-full md:w-64 bg-zinc-50 dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-inner space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">PDF</div>
                <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold">DXF</div>
                <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold">IMG</div>
                <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full" />
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Auto-Sync Active
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing & Availability Section ─── */}
      <section ref={pricingRef} className="py-32 px-6 bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-zinc-955 dark:text-zinc-50 uppercase">Pricing & Availability</h2>
            </div>
            <div className="p-8 bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm border-l-4 border-l-[#FFEF1A]">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Monthly Subscription</span>
              <p className="text-3xl font-black mt-2 text-zinc-900 dark:text-white">$800<span className="text-sm font-normal text-zinc-400">/month per firm</span></p>
              <p className="text-xs text-zinc-500 mt-2">(includes customization)</p>
            </div>
            <div className="text-sm space-y-2">
              <p><strong className="text-zinc-900 dark:text-white">Status:</strong> Custom / R&D (core features stable)</p>
              <p><strong className="text-zinc-900 dark:text-white">Target markets:</strong> Contractors, QS consultancies (UAE, Australia primary)</p>
              <p><strong className="text-zinc-900 dark:text-white">Implementation:</strong> 1–2 weeks</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6 uppercase text-sm">Quick Facts</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between"><span className="text-zinc-500">Stage</span> <span className="font-bold">Tendering</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Best for</span> <span className="font-bold text-right">Contractors, QS, Rebar Specialists</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Regions</span> <span className="font-bold">UAE, Australia</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Implementation</span> <span className="font-bold">1–2 weeks</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Pricing</span> <span className="font-bold">$800/month</span></div>
              </div>

              {/* Buy Products Button with #FFEF1A background */}
              <Button
                asChild
                className="w-full mt-8 rounded-xl py-6 font-black text-zinc-955 hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: '#FFEF1A' }}
              >
                <Link href="/pricing">Buy Products</Link>
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Related Products</h4>
                {/* Grey View all products link */}
                <Link href="/learnmore#products" className="text-xs font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline">View all products</Link>
              </div>
              <ul className="space-y-3 text-sm font-bold">
                <li><Link href="#" className="hover:text-[#FFEF1A]">Revit to BOQ</Link></li>
                <li><Link href="#" className="hover:text-[#FFEF1A]">2D Drawing to BOQ</Link></li>
                <li><Link href="#" className="hover:text-[#FFEF1A]">Auto Conversion 2D to 3D</Link></li>
              </ul>
            </div>
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

      {/* ─── Footer CTA ─── */}
      <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl font-black tracking-tight text-zinc-955 dark:text-zinc-50 uppercase">
            Stop counting rebar by hand. Let the computer do it.
          </h2>
          <p className="text-zinc-600 text-lg">
            See how Auto Reinforcement Plugin eliminates the most tedious estimation task.
          </p>
          <Button asChild size="lg" className="rounded-2xl px-8 py-6 font-bold bg-[#FFEF1A] text-zinc-955 hover:bg-[#e6d717]">
            <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
              Book a demo →
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}