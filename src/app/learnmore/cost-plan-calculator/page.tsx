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
  ChevronLeft,
  ChevronDown,
  Check,
  X,
  FileText,
  Calculator,
  BarChart3,
  Cpu,
  Upload,
  Wallet,
  TrendingUp,
  Download,
  ArrowUpRight,
  Plus,
  Minus,
  Layers,
  Sparkles,
  HelpCircle,
  Maximize,
  Minimize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComparisonGrid from "@/components/learnmore/comparison-grid";

export default function CostPlanCalculatorPage() {
  const [activeCard, setActiveCard] = useState(1);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoAreaRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoAreaRef.current?.requestFullscreen().catch((err) => {
        console.error("Error going fullscreen:", err);
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

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
        document.exitFullscreen().catch(() => {});
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToVideo = useCallback(() => {
    videoSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const cards = [
    {
      id: 0,
      title: "Manual Cost Planning",
      badge: "Traditional Route",
      badgeColor: "text-red-650 bg-red-500/10 border-red-500/20 dark:text-red-400",
      icon: X,
      iconColor: "text-red-500",
      bullets: [
        "QS GFA takeoff takes 1-2 days",
        "QS GFA manual calculations from PDF blueprints.",
        "Plugs numbers into Excel with manual formulas.",
        "No integrated project pipeline forecasting."
      ]
    },
    {
      id: 1,
      title: "Cost Plan Calculator",
      badge: "AI Platform",
      badgeColor: "text-emerald-650 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400",
      icon: Check,
      iconColor: "text-emerald-500",
      bullets: [
        "Upload concept drawing — GFA generated instantly.",
        "Estimate & consultancy fee computed automatically.",
        "Financial planning module tracks project pipeline.",
        "Outputs ready for client presentation."
      ]
    },
    {
      id: 2,
      title: "Pipeline Control Mode",
      badge: "Dashboard Sync",
      badgeColor: "text-blue-650 bg-blue-500/10 border-blue-500/20 dark:text-blue-400",
      icon: BarChart3,
      iconColor: "text-blue-500",
      bullets: [
        "Track GFA and consultancy fees per region.",
        "Live sync to pipeline revenue forecast charts.",
        "Standardized rates applied across the entire firm.",
        "Clear visibility on project pipeline statuses."
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-lime/30 selection:text-black">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-zinc-50 dark:bg-zinc-950/40 border-b border-zinc-200/60 dark:border-zinc-900 pt-32 pb-24"
      >
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-gradient-to-br from-lime/20 via-lime/10 to-transparent rounded-full blur-[130px] opacity-75 animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] bg-gradient-to-tr from-lime/10 via-zinc-400/5 to-transparent rounded-full blur-[140px] opacity-65" />
          <div className="absolute inset-0 bg-white/45 dark:bg-zinc-950/65 backdrop-blur-[1px]" />
          <div
            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Back Button */}
        <div className="relative max-w-6xl mx-auto w-full px-6 z-20 mb-8">
          <Link
            href="/learnmore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-black/60 backdrop-blur-md text-sm font-semibold text-zinc-650 hover:text-zinc-955 dark:text-zinc-400 dark:hover:text-white transition-all hover:bg-white/80 dark:hover:bg-black/80 hover:scale-105 active:scale-95 group shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Learn More
          </Link>
        </div>

        {/* Centered Typography Hero Header */}
        <div className="relative w-full z-10 text-center max-w-4xl mx-auto px-6 space-y-6 flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-zinc-955 dark:text-white leading-[1.05] uppercase product-title-sweep">
              Cost Plan Calculator
            </h1>
            <p className="text-xl sm:text-2xl text-zinc-650 dark:text-zinc-300 font-medium max-w-2xl mx-auto leading-relaxed">
              GFA to budget in minutes. Not days.
            </p>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-medium">
              Upload a concept drawing. Get the Gross Floor Area, project cost, and consultancy fee automatically — with a financial planning module built in.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 pt-2"
          >
            <Button
              onClick={scrollToVideo}
              size="lg"
              className="rounded-2xl px-8 py-7 font-bold shadow-sm cursor-pointer border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 transition-transform hover:scale-105"
            >
              <Play className="w-4 h-4 mr-2 text-zinc-900 dark:text-zinc-300" />
              Watch Demo
            </Button>
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 py-7 font-bold shadow-md cursor-pointer bg-lime text-black hover:bg-lime/90 border-0 transition-transform hover:scale-105"
            >
              <a
                href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book a Demo
              </a>
            </Button>
          </motion.div>
        </div>

        {/* 3D Overlapping Card Stack Slider */}
        <div className="relative w-full max-w-5xl mx-auto px-6 mt-16 z-20">
          <div className="relative w-full max-w-xl mx-auto h-[380px] flex items-center justify-center">

            {cards.map((card, idx) => {
              const isActive = idx === activeCard;
              const isLeft = idx < activeCard;
              const isRight = idx > activeCard;

              let x = 0;
              let scale = 1;
              let zIndex = 30;
              let rotate = 0;
              let opacity = 1;

              if (isActive) {
                x = 0;
                scale = 1.02;
                zIndex = 30;
                rotate = 0;
                opacity = 1;
              } else if (isLeft) {
                x = -150;
                scale = 0.88;
                zIndex = 10;
                rotate = -5;
                opacity = 0.5;
              } else if (isRight) {
                x = 150;
                scale = 0.88;
                zIndex = 10;
                rotate = 5;
                opacity = 0.5;
              }

              return (
                <motion.div
                  key={card.id}
                  style={{ zIndex }}
                  animate={{
                    x,
                    scale,
                    rotate,
                    opacity,
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  onClick={() => setActiveCard(idx)}
                  className={`absolute w-[330px] p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl shadow-zinc-200/50 dark:shadow-black/60 flex flex-col justify-between ${isActive ? "cursor-default border-zinc-300 dark:border-zinc-700" : "cursor-pointer hover:opacity-75 transition-opacity"
                    }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                      <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50">
                        {card.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    </div>

                    <ul className="space-y-3">
                      {card.bullets.map((bullet, i) => (
                        <li key={i} className="flex gap-2.5 text-zinc-650 dark:text-zinc-350 text-xs">
                          <card.icon className={`w-4 h-4 shrink-0 mt-0.5 ${card.iconColor}`} />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-4 text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                    <span>{`Canvas node 0${idx + 1}`}</span>
                    {isActive && <span className="text-zinc-900 dark:text-white animate-pulse">Active View</span>}
                  </div>
                </motion.div>
              );
            })}

            {/* Slider Controls */}
            <div className="absolute inset-x-0 bottom-[-50px] flex justify-center gap-6 z-40">
              <button
                onClick={() => setActiveCard((prev) => (prev > 0 ? prev - 1 : cards.length - 1))}
                className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 flex items-center justify-center hover:scale-105 hover:bg-white dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer shadow-md text-zinc-900 dark:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveCard((prev) => (prev < cards.length - 1 ? prev + 1 : 0))}
                className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 flex items-center justify-center hover:scale-105 hover:bg-white dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer shadow-md text-zinc-900 dark:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* ─── REALISE YOUR IDEAS (THE BOTTLENECK LAYERED SECTION) ─── */}
      <section className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-900 py-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
              The Friction
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-955 dark:text-white leading-[1.1] uppercase">
              The cost planning bottleneck
            </h2>
            <div className="w-16 h-1 bg-lime rounded-full" />
            <div className="text-zinc-650 dark:text-zinc-400 text-sm sm:text-base leading-relaxed space-y-4">
              <p>QS firms are still calculating Gross Floor Area by hand from PDF concept drawings and plugging numbers into Excel to produce a cost plan at the feasibility stage.</p>
              <p>This is the moment when speed matters most — the client is waiting for budget validation before committing to design. But the process takes 1-2 days and relies on manual Excel formulas that differ from firm to firm.</p>
              <p className="text-zinc-955 dark:text-zinc-200 font-bold">Cost Plan Calculator automates this, turning the cost planning step from a bottleneck into a two-minute output that is ready to present.</p>
            </div>

            <div className="pt-4">
              <Button
                onClick={scrollToVideo}
                className="rounded-2xl px-6 py-5 font-bold shadow-md cursor-pointer border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-transform hover:scale-105"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right Column: Layered 3D Mockup Stack */}
          <div className="lg:col-span-7 flex items-center justify-center relative min-h-[380px] lg:min-h-[440px]">
            {/* Grid canvas background decoration */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] rounded-3xl" />

            {/* Back Card: Concept PDF Blueprint */}
            <div className="absolute w-[80%] max-w-[420px] aspect-[4/3] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl p-4 -rotate-6 -translate-x-12 -translate-y-6 opacity-60 transition-transform duration-500 hover:rotate-0 hover:-translate-x-6 hover:opacity-90">
              <div className="flex justify-between items-center border-b border-zinc-250 dark:border-zinc-800 pb-2 mb-3 text-[10px] text-zinc-400 font-mono">
                <span>Drawing Set 01</span>
                <span>PDF Blueprint</span>
              </div>
              <div className="w-full h-[80%] border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl p-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="h-1 bg-zinc-350 dark:bg-zinc-850 rounded w-1/2" />
                  <div className="h-1 bg-zinc-305 dark:bg-zinc-850 rounded w-1/3" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-12 border border-zinc-250 dark:border-zinc-800 rounded flex items-center justify-center text-[9px] text-zinc-400 font-bold">Zone A</div>
                  <div className="h-12 border border-zinc-250 dark:border-zinc-800 rounded flex items-center justify-center text-[9px] text-zinc-400 font-bold">Zone B</div>
                  <div className="h-12 border border-zinc-250 dark:border-zinc-800 rounded flex items-center justify-center text-[9px] text-zinc-400 font-bold">Zone C</div>
                </div>
              </div>
            </div>

            {/* Front Card: GFA Pricer Canvas with vertical scanning animation line */}
            <div className="absolute w-[80%] max-w-[420px] aspect-[4/3] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl p-5 translate-x-8 translate-y-6 transition-transform duration-500 hover:scale-[1.02]">
              {/* Scanning Line */}
              <motion.div
                animate={{ top: ["8%", "90%", "8%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-4 right-4 h-0.5 bg-lime shadow-[0_0_8px_rgba(163,230,53,0.8)] z-30"
              />

              <div className="flex justify-between items-center border-b border-zinc-150 dark:border-zinc-850 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-lime animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">Live Calculation Canvas</span>
                </div>
                <span className="text-[9px] font-bold text-zinc-400 font-mono">CostPlanCalc.ai</span>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-150 dark:border-zinc-850 rounded-xl space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-500 font-medium">Calculated GFA</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">14,850 m²</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-500 font-medium">Construction Budget</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">$22,450,000</span>
                  </div>
                  <div className="flex justify-between text-[11px] border-t border-zinc-200/50 dark:border-zinc-800/50 pt-2 mt-2">
                    <span className="text-zinc-500 font-medium">Consultancy Fee</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">$340,000</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Output Compiled</span>
                  <span className="font-bold text-zinc-650 dark:text-zinc-350">100% Verified</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── OUR FEATURES (4-COLUMN GRID) ─── */}
      <section className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-900 py-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">

          <div className="text-center space-y-4 max-w-2xl mx-auto border-b border-zinc-200 dark:border-zinc-900 pb-10">

            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-955 dark:text-white leading-[1.1] uppercase">
              Fits into your workflow
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base font-medium">
              Connected estimations, GFA detection, and pipeline forecasting modules in one place.
            </p>
          </div>

          {/* 4 Column Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Card 1: Concept Blueprints */}
            <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between min-h-[360px] relative group hover:border-zinc-350 dark:hover:border-zinc-700 hover:shadow-lg transition-all duration-300">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-zinc-900 dark:text-zinc-300" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white uppercase">Concept Blueprints</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                  Support for multi-page concept files, PDF blueprints, Revit models, or DWG exports up to 50MB.
                </p>
              </div>

              {/* Graphical insert */}
              <div className="mt-8 bg-zinc-50 dark:bg-zinc-950/60 p-3 rounded-2xl border border-zinc-150 dark:border-zinc-850 flex items-center justify-between text-[9px] font-mono">
                <span className="text-zinc-500 truncate max-w-[120px]">Alpha_Project.pdf</span>
                <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded text-zinc-650 dark:text-zinc-350">50MB</span>
              </div>
            </div>

            {/* Card 2: Live Pricer Canvas */}
            <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between min-h-[360px] relative group hover:border-zinc-350 dark:hover:border-zinc-700 hover:shadow-lg transition-all duration-300">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-zinc-900 dark:text-zinc-300" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white uppercase">Pricer Canvas</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                  Instantly detects building footprint zones, floor numbers, and calculates consultancy fees based on region standard rules.
                </p>
              </div>

              {/* Graphical flowchart mockup */}
              <div className="mt-8 bg-zinc-50 dark:bg-zinc-950/60 rounded-2xl p-3 border border-zinc-150 dark:border-zinc-850 h-16 relative overflow-hidden flex items-center justify-center shadow-inner">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:8px_8px]" />
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 10,40 Q 60,10 120,50 T 220,10" fill="none" stroke="#a3e635" strokeWidth="1.5" />
                </svg>
                <span className="relative z-10 text-[9px] font-mono font-bold bg-white dark:bg-zinc-950 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-250">GFA Sync</span>
              </div>
            </div>

            {/* Card 3: Pipeline Control */}
            <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between min-h-[360px] relative group hover:border-zinc-350 dark:hover:border-zinc-700 hover:shadow-lg transition-all duration-300">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-zinc-900 dark:text-zinc-300" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white uppercase">Pipeline Control</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                  Track GFA estimates, consultancy fees, and pipeline revenue forecasts directly in your firm's pipeline.
                </p>
              </div>

              {/* Mini revenue chart mockup */}
              <div className="mt-8 bg-zinc-50 dark:bg-zinc-950/60 p-3 rounded-2xl border border-zinc-150 dark:border-zinc-850 flex items-end justify-between h-16 gap-1.5">
                {[40, 65, 35, 80, 50, 95, 60].map((height, i) => (
                  <div key={i} className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-t-sm relative group" style={{ height: `${height}%` }}>
                    <div className="absolute inset-0 bg-lime opacity-0 group-hover:opacity-100 transition-opacity rounded-t-sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4: Revit Integration */}
            <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between min-h-[360px] relative group hover:border-zinc-350 dark:hover:border-zinc-700 hover:shadow-lg transition-all duration-300">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-zinc-900 dark:text-zinc-300" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white uppercase">Revit integration</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                  Lock cost plans to design briefs, feeding directly into Revit to BOQ baseline models.
                </p>
              </div>

              {/* Icon visual link */}
              <div className="mt-8 bg-zinc-50 dark:bg-zinc-950/60 p-3 rounded-2xl border border-zinc-150 dark:border-zinc-850 flex items-center justify-between text-[9px] font-mono">
                <span className="text-zinc-500">BOQ Model Feed</span>
                <span className="text-emerald-500 font-bold uppercase">Linked</span>
              </div>
            </div>

          </div>



        </div>
      </section>

      {/* ─── Video Showcase Section ─── */}
      <section
        ref={videoSectionRef}
        className="py-24 px-6 bg-zinc-950 text-white relative overflow-hidden border-t border-zinc-900"
      >
        {/* High-tech radial glow effects */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-lime/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Subtle Mesh blueprint grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: "44px 44px",
          }}
        />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

          {/* Left Column: Stacked High-Impact Typography & Metadata */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
                See It In Action
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1] uppercase">
                Cost Plan Calculator Demo
              </h2>
              <p className="text-zinc-450 text-sm sm:text-base leading-relaxed">
                Watch how a concept drawing becomes a complete cost plan in minutes.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              <a
                href="https://drive.google.com/drive/folders/1C8KTwemod1FyxAuZr7jefJLqbs1LCn2L?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white hover:text-white/80 font-bold uppercase tracking-wider text-sm group transition-colors cursor-pointer"
              >
                Open Demo Walkthrough in Google Drive
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Autoplay Active Indicator */}
              <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 rounded-full py-1.5 px-3 w-fit text-[11px] text-zinc-450">


              </div>
            </div>

            {/* Pagination numbers at the bottom */}
            <div className="flex items-center gap-4 pt-8 border-t border-zinc-900">





            </div>
          </div>

          {/* Right Column: Premium Glass-Bordered Mockup Player */}
          <div className="lg:col-span-7 w-full">
            <div
              ref={videoAreaRef}
              onDoubleClick={toggleFullscreen}
              className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900 group cursor-pointer select-none"
            >
              {/* Decorative green glow inside the border on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-lime/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]" />

              <div className="relative rounded-[2rem] overflow-hidden bg-black aspect-video flex items-center justify-center">
                <video
                  ref={videoRef}
                  src="/videos/check_video_exact_interface_an.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
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
            </div>
          </div>

        </div>
      </section>

      {/* ─── PRICING & DETAILS (PRICING & FAQ) ─── */}
      <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
        <div className="max-w-6xl mx-auto space-y-16">

          <div className="text-center space-y-4 max-w-2xl mx-auto">

            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-955 dark:text-white leading-[1.1] uppercase">
              Pricing &amp; Availability
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base font-medium">
              Flexible setups, related estimating tools, and deployment FAQs tailored to your company scale.
            </p>
          </div>

          {/* Gallery-style pricing cards */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

              {/* Plan 1 */}
              <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group relative">
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-450 font-extrabold uppercase tracking-widest block">Standard Tier</span>
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">One-Off Setup</h4>
                </div>
                <p className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">$3,500</p>
                <p className="text-xs text-zinc-550 leading-normal">Includes deployment, customized cost database rate setup, and dedicated training.</p>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-zinc-900 dark:text-white" />
                </div>
              </div>

              {/* Plan 2 */}
              <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group relative">
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-450 font-extrabold uppercase tracking-widest block">Updates Tier</span>
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">Annual Support</h4>
                </div>
                <p className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">$300<span className="text-xs font-normal text-zinc-400">/yr</span></p>
                <p className="text-xs text-zinc-550 leading-normal">Covers quarterly cost index updates, API maintenance, and standard system support.</p>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-zinc-900 dark:text-white" />
                </div>
              </div>

              {/* Plan 3 */}
              <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative text-white">
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest block">Enterprise Tier</span>
                  <h4 className="font-extrabold text-sm text-white">Custom Setup</h4>
                </div>
                <p className="text-3xl font-black tracking-tight text-white">Enterprise</p>
                <p className="text-xs text-zinc-400 leading-normal">Custom licensing limits, custom ERP integrations, and custom regional models.</p>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16 border-t border-zinc-200 dark:border-zinc-800 text-left">
            {/* Quick Facts Widget */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 shadow-sm space-y-6 flex flex-col justify-between">
              <div>
                {/* Header Facts */}
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <h3 className="font-extrabold text-base uppercase tracking-tight text-zinc-900 dark:text-white">Quick Facts</h3>
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">

                  </div>
                </div>

                <div className="space-y-4 text-xs pt-4">
                  {[
                    { label: "Stage", value: "Pre-design" },
                    { label: "Best For", value: "QS Firms, Cost Consultancies, Developers" },
                    { label: "Target Regions", value: "UAE, UK, Australia, Sri Lanka" },
                    { label: "Time to Implement", value: "3-5 Days" },
                    { label: "Pricing Model", value: "$3,500 + $300/yr" },
                  ].map((fact, i) => (
                    <div key={i} className="flex justify-between items-start border-b border-zinc-50 dark:border-zinc-850/50 pb-2.5 gap-4">
                      <span className="text-zinc-505 font-semibold shrink-0">{fact.label}</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-200 text-right">{fact.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                asChild
                className="w-full rounded-2xl py-6 font-bold shadow-md bg-lime text-black hover:bg-lime/90 border-0 mt-8 cursor-pointer"
              >
                <a
                  href="/pricing?product=cost_calculator"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy Products <ArrowUpRight />
                </a>
              </Button>
            </div>

            {/* Related Estimating Modules */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6">
                  <h3 className="font-extrabold text-base uppercase tracking-tight text-zinc-900 dark:text-white">Related Products</h3>
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-505">

                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { href: "/learnmore/planning-law-chatbot", label: "Planning Law Chatbot", tag: "Parallel" },
                    { href: "/learnmore/revit-to-boq", label: "Revit to BOQ", tag: "Next Stage" },
                    { href: "/learnmore/measureonair", label: "MeasureonAir", tag: "Construction" },
                  ].map((item, i) => (
                    <Link
                      key={i}
                      href={item.href}
                      className="flex justify-between items-center p-4 rounded-xl bg-[#FAFAF8] dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 hover:border-lime/40 dark:hover:border-lime/30 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-300 group"
                    >
                      <div className="text-left">
                        <span className="font-bold text-sm text-zinc-900 dark:text-white group-hover:text-primary transition-colors block">{item.label}</span>
                      </div>
                      <span className="text-xs text-zinc-400 font-medium shrink-0">{item.tag}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
                <Link
                  href="/learnmore"
                  className="text-xs font-bold text-primary hover:underline flex items-center justify-center gap-1"
                >
                  View full suite <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Comparison Section ─── */}
      <ComparisonGrid
        sectionTitle="Why choose Cost Plan Calculator"
        card1={{
          title: "Manual Method",
          subtitle: "Manual Excel",
          features: [
            "1-2 days per cost plan",
            "Different formulas per QS",
            "No audit trail for assumptions",
            "Not integrated with project tracking",
          ],
          metric: { value: "1-2", label: "DAYS" },
          button: { text: "Traditional Route", href: "/pricing" },
        }}
        card2={{
          title: "Cost Plan",
          subtitle: "Cost Plan Calculator",
          features: [
            "2 minutes per cost plan",
            "Consistent methodology across firm",
            "All assumptions documented",
            "Integrated project tracking built in",
          ],
          metric: { value: "2", label: "MINUTES" },
          button: { text: "Book A Demo", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
        }}
        card3={{
          title: "Generic spreadsheets",
          subtitle: "Generic Tools",
          features: [
            "Still requires manual data entry",
            "No automation of GFA calculation",
            "No financial planning module",
            "Time spent building vs. delivering",
          ],
          metric: { value: "UNRELIABLE", label: "FAST /" },
          button: { text: "Other Tools", href: "#" },
        }}
      />

      {/* ─── FAQ Section ─── */}
      <section className="py-24 px-6 bg-[#FAFAF8] dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-955 dark:text-zinc-50 uppercase">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { q: 'Can we customize the rates used for cost estimates?', a: 'Yes. You can set your own unit rates per building type, location, and complexity. Rates are configurable per client or project type.' },
              { q: 'What if we are working in a market with no standard rates?', a: 'We have training data for rates in UAE, Australia, UK, and Sri Lanka. For other markets, we can train the model on your historical project data (6+ previous projects required).' },
              { q: 'Can it integrate with our ERP?', a: 'Yes. We have pre-built integrations with SAP, Oracle, and NetSuite. Other ERPs available via API. Contact us for integration details.' },
              { q: 'What file formats does it accept?', a: 'PDF, PNG/JPG images, Revit RVT files, and DWG drawings. File size limit is 50MB.' },
              { q: 'How accurate are the cost estimates?', a: 'Within 10-15% of final tender cost in the majority of cases, assuming market-standard rates and no unusual site conditions.' },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-md animate-fade-in"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-zinc-900 dark:text-zinc-50 cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-zinc-400" />
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full shrink-0 ml-4 flex items-center justify-center transition-colors duration-300 ${activeFaq === idx ? "bg-zinc-900 dark:bg-white text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-555"}`}>
                    {activeFaq === idx ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
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
                      <div className="px-5 pb-5 text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed border-t border-zinc-150 dark:border-zinc-800/80 pt-4 ml-7 pr-8">
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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-zinc-955 dark:text-zinc-50 uppercase">
            Give clients a cost estimate on day one.
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            See how Cost Plan Calculator turns a 2-day manual task into a 2-minute output.
          </p>
          <div className="pt-4 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 py-6 font-bold shadow-md border-0 bg-lime text-black hover:bg-lime/90 cursor-pointer"
            >
              <a
                href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a Demo →
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
