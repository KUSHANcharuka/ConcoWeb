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
  ArrowRight,
  Layers,
  Zap,
  Download,
  Bot,
  Workflow,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComparisonGrid from "@/components/learnmore/comparison-grid";

// ─────────────────────────────────────────────────────────────────
// FORMAT-SPECIFIC SLOT VALUES — swap these six slots per clone
// ─────────────────────────────────────────────────────────────────
const FORMAT = {
  pageTitle: "Quanto for Revit | BOQ from Revit Models | Concolabs",
  metaDescription:
    "Quanto reads your Revit model and returns a priced BOQ. AI rate prediction from your firm's pricing history. Hours not weeks.",
  h1: "Quanto for Revit",
  subheading: "The BOQ that used to take three weeks. Done today.",
  heroBody:
    "Your estimators are manually measuring every element in a Revit model, applying standard measurement rules, and typing the bill by hand. Quanto automates the measurement and the rate prediction, so your team focuses on the advice clients are paying for.",
  regionBadges: ["Middle East", "Sri Lanka"],
  statusBadge: "Scaling" as "Scaling" | "Custom / R&D",
  beforeLabel: "Manual Revit + Excel",
  beforeItems: [
    "Estimators manually measure every element in the Revit model",
    "Apply standard measurement rules and type rates by hand",
    "Same process repeated every project — weeks per bill",
    "Expert QS time consumed by data entry, not advice",
  ],
  step1Title: "Revit Integration",
  step1Body:
    "Plugin extracts take-off files and raw data natively from your Revit model.",
  price: "$1,000",
  priceNote:
    "Includes native Revit plugin and rate prediction module with customisations.",
  quickFactsBestFor: "QS Consultancies",
  faqQ5: "How does the Revit plugin differ from the ACC connection?",
  faqA5:
    "Revit reads your local model file directly through the plugin. ACC connects to the cloud project and reprices automatically as the model changes. Same engine, different connection.",
  ctaBody:
    "See how Quanto compresses the BOQ production cycle from weeks into hours, working directly from your Revit model.",
  relatedQuantoLinks: [
    { href: "/learnmore/quanto-acc", label: "Quanto for ACC" },
    { href: "/learnmore/quanto-costx", label: "Quanto for CostX" },
    { href: "/learnmore/quanto-2d", label: "Quanto for 2D Drawings" },
  ],
  showAutoConversionCard: false,
};

// ─────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

// ─────────────────────────────────────────────────────────────────
// FAQ ACCORDION (shared component)
// ─────────────────────────────────────────────────────────────────
function AppleAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300"
        >
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full flex items-center justify-between p-6 text-left cursor-pointer group"
          >
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 pr-4 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
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
                <div className="px-6 pb-6 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 pt-4">
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

// ─────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────
export default function QuantoRevitPage() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [heroVideoActive, setHeroVideoActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoAreaRef = useRef<HTMLDivElement>(null);

  const stopHeroVideo = useCallback(() => setHeroVideoActive(false), []);

  useEffect(() => {
    const onFSChange = () =>
      setIsFullscreen(document.fullscreenElement !== null);
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
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

  useEffect(() => {
    const timer = setInterval(
      () => setActiveTab((p) => (p === "before" ? "after" : "before")),
      4500
    );
    return () => clearInterval(timer);
  }, [autoToggleKey]);

  const handleTabClick = (tab: "before" | "after") => {
    setActiveTab(tab);
    setAutoToggleKey((k) => k + 1);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoAreaRef.current?.requestFullscreen().catch(() => { });
    } else {
      document.exitFullscreen().catch(() => { });
    }
  };

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroSP } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroSP, [0, 0.8], [1, 0]);
  const textY = useTransform(heroSP, [0, 1], [0, -80]);

  const frictionRef = useRef<HTMLDivElement>(null);
  const howRef = useRef<HTMLDivElement>(null);
  const capsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const isFrictionInView = useInView(frictionRef, { once: true, margin: "-80px" });
  const isHowInView = useInView(howRef, { once: true, margin: "-80px" });
  const isCapsInView = useInView(capsRef, { once: true, margin: "-80px" });
  const isPricingInView = useInView(pricingRef, { once: true, margin: "-80px" });
  const isFaqInView = useInView(faqRef, { once: true, margin: "-80px" });

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-lime/30 selection:text-black">
      <Navbar />

      {/* ─── SECTION 1 + 2: HERO ─── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-[#E8F3F6] via-[#F4F9FA] to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 pt-28 pb-12 border-b border-zinc-200/40 dark:border-zinc-900"
      >
        {/* Hero video overlay */}
        <AnimatePresence>
          {heroVideoActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-40 bg-zinc-950 flex items-center justify-center"
            >
              <div
                ref={videoAreaRef}
                onDoubleClick={toggleFullscreen}
                className="absolute inset-0 z-50 cursor-pointer select-none"
              >
                <video
                  ref={videoRef}
                  src="/videos/revit-to-boq-showcase.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                {isFullscreen && (
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                    className="absolute top-6 right-6 z-50 p-3 bg-zinc-900/80 border border-zinc-700 hover:bg-zinc-800 text-white rounded-full transition-colors cursor-pointer shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <div
                  className="absolute bottom-4 right-4 z-30 flex items-center gap-3 bg-zinc-950/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 backdrop-blur-md"
                  onClick={(e) => e.stopPropagation()}
                >
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

        {/* Background blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[700px] h-[700px] bg-gradient-to-br from-lime/12 via-emerald-500/8 to-transparent rounded-full blur-[120px] opacity-70 animate-pulse" style={{ animationDuration: "12s" }} />
          <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/8 via-zinc-400/4 to-transparent rounded-full blur-[130px] opacity-60" />
          <div className="absolute inset-0 bg-white/30 dark:bg-zinc-950/60" />
          <div
            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
              backgroundSize: "44px 44px",
            }}
          />
        </div>

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
          <span className="text-[18vw] font-black text-zinc-900/[0.02] dark:text-white/[0.01] tracking-widest uppercase">
            BOQ
          </span>
        </div>

        {/* Back link */}
        <div className="absolute top-28 left-6 z-30">
          <Link
            href="/learnmore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all hover:bg-white/80 dark:hover:bg-black/80 hover:scale-105 active:scale-95 group shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Learn More
          </Link>
        </div>

        <motion.div
          style={{ y: textY, opacity: heroOpacity }}
          className="relative w-full z-10"
        >
          <div className="max-w-4xl mx-auto text-center px-6 space-y-4 pb-8 pt-12">

            {/* Eyebrow + badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 px-3 py-1 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm">
                Quantity Take Off &amp; Estimation
              </span>
              {FORMAT.regionBadges.map((r) => (
                <span key={r} className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/40 dark:border-emerald-800/40">
                  {r}
                </span>
              ))}
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${FORMAT.statusBadge === "Scaling" ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/40 dark:border-emerald-800/40" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200/60 dark:border-zinc-800/60"}`}>
                {FORMAT.statusBadge}
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05] uppercase product-title-sweep">
              {FORMAT.h1}
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl font-bold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-300 dark:to-zinc-500 mt-2">
              {FORMAT.subheading}
            </p>

            {/* Body */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-medium pb-2">
              {FORMAT.heroBody}
            </p>

            {/* CTAs */}
            <div className="flex flex-col items-center justify-center space-y-3 pt-2">
              <div className="flex gap-3">
                <Button
                  onClick={(e) => { e.stopPropagation(); setHeroVideoActive(true); }}
                  variant="outline"
                  className="rounded-full bg-white dark:bg-zinc-950 font-extrabold text-xs px-5 py-3 cursor-pointer border-zinc-200 dark:border-zinc-800"
                >
                  <Play className="w-3 h-3 mr-1.5 fill-current" />
                  Watch Demo
                </Button>
                <Button
                  asChild
                  className="rounded-full bg-lime text-black hover:bg-lime/90 font-extrabold text-xs px-5 py-3 cursor-pointer border-0 shadow-md transition-transform hover:scale-105"
                >
                  <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                    Book a demo →
                  </a>
                </Button>
              </div>
            </div>

            {/* Compare Workflows Card */}
            <div className="max-w-2xl mx-auto w-full px-2 relative z-10 pt-8 pb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white/50 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 p-8 rounded-[2.5rem] shadow-xl space-y-6 flex flex-col items-center text-center hover:scale-[1.005] transition-transform duration-300"
              >
                <div className="space-y-3 w-full">
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                    Compare Workflows
                  </h3>
                </div>

                <div className="w-full border-t border-zinc-200/50 dark:border-zinc-800/50 pt-5">
                  {/* Toggle */}
                  <div className="flex justify-center mb-6">
                    <div className="relative flex bg-zinc-100/80 dark:bg-zinc-950/80 p-1 rounded-xl border border-zinc-200/50 dark:border-zinc-850/50">
                      <button
                        onClick={() => handleTabClick("before")}
                        className={`relative z-10 w-24 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${activeTab === "before" ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}
                      >
                        Before
                      </button>
                      <button
                        onClick={() => handleTabClick("after")}
                        className={`relative z-10 w-24 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${activeTab === "after" ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}
                      >
                        After
                      </button>
                      <motion.div
                        layoutId="quanto-revit-toggle-pill"
                        className="absolute top-1 bottom-1 bg-white dark:bg-zinc-850 shadow-sm border border-zinc-200 dark:border-zinc-700 rounded-lg"
                        animate={{ left: activeTab === "before" ? 4 : 96, width: 92 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="min-h-[200px] flex flex-col justify-center text-left w-full">
                    <AnimatePresence mode="wait">
                      {activeTab === "before" ? (
                        <motion.div
                          key="before"
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 12 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-3"
                        >
                          <div className="text-xs font-bold text-red-500 uppercase tracking-wider">
                            {FORMAT.beforeLabel}
                          </div>
                          <ul className="space-y-2.5">
                            {FORMAT.beforeItems.map((item, i) => (
                              <li key={i} className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm items-start bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50">
                                <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="after"
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -12 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-3"
                        >
                          <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                            Quanto — AI Rate Prediction Engine
                          </div>
                          <ul className="space-y-2.5">
                            {[
                              "Quanto identifies all elements directly from your model, workbook, or drawing.",
                              "AI predicts and applies rates for each line item automatically, based on your firm's pricing history.",
                              "Existing non-AI tools stop at measurement. Quanto goes further.",
                              "Priced BOQ generated in hours, ready for expert review.",
                            ].map((item, i) => (
                              <li key={i} className={`flex gap-3 text-sm items-start bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50 ${i === 3 ? "text-zinc-900 dark:text-zinc-100 font-bold" : "text-zinc-600 dark:text-zinc-400"}`}>
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
          </div>
        </motion.div>
      </section>

      {/* ─── SECTION 3: DEMO VIDEO ─── */}
      <section className="py-24 px-6 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Quanto in Action</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Watch it work
          </h2>
          <p className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed">
            Watch how building elements are identified, measured, and priced using AI rate prediction.
          </p>
          <div
            className="relative w-full aspect-video rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl cursor-pointer group"
            onClick={() => setHeroVideoActive(true)}
          >
            <video
              src="/videos/revit-to-boq-showcase.mp4"
              muted
              playsInline
              loop
              autoPlay
              className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-950/80 px-3 py-1.5 rounded-full border border-zinc-800">
              Click to expand
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: THE FRICTION ─── */}
      <section
        ref={frictionRef}
        className="py-28 px-6 bg-white dark:bg-zinc-950 border-t border-zinc-150 dark:border-zinc-900"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial="hidden"
            animate={isFrictionInView ? "visible" : "hidden"}
            variants={stagger}
            className="space-y-6"
          >
            <motion.span variants={fadeInUp} className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
              The Problem
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white leading-tight max-w-3xl mx-auto">
              Your value is in judgment, not in measurement.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Whatever format your model or drawing is in, the bottleneck is the same. Someone has to measure every element and price it by hand, the same process every project.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              This manual data entry creates a bottleneck during the tendering phase, increasing the risk of human error and pulling expert Quantity Surveyors away from strategic cost advice. Quanto automates the measurement and the rate prediction, so your team focuses entirely on the advice clients are paying for.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 5: HOW IT WORKS ─── */}
      <section
        ref={howRef}
        className="py-28 px-6 bg-zinc-50 dark:bg-zinc-900/30 border-t border-zinc-200 dark:border-zinc-900"
      >
        <div className="max-w-5xl mx-auto space-y-16">
          <motion.div
            initial="hidden"
            animate={isHowInView ? "visible" : "hidden"}
            variants={stagger}
            className="text-center space-y-4"
          >
            <motion.span variants={fadeInUp} className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
              How It Works
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
              Four steps from source to priced BOQ
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isHowInView ? "visible" : "hidden"}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                num: "01",
                title: FORMAT.step1Title,
                body: FORMAT.step1Body,
                isFormatSpecific: true,
              },
              {
                num: "02",
                title: "Element Identification",
                body: "AI groups and identifies all building elements according to standard measurement rules.",
                isFormatSpecific: false,
              },
              {
                num: "03",
                title: "AI Rate Prediction",
                body: "Machine learning predicts and maps historical pricing rates for each line item, based on your firm's historical data.",
                isFormatSpecific: false,
              },
              {
                num: "04",
                title: "Priced BOQ Output",
                body: "Generates a fully formatted, priced Bill of Quantities ready for your expert review.",
                isFormatSpecific: false,
              },
            ].map((step) => (
              <motion.div
                key={step.num}
                variants={fadeInUp}
                className={`relative p-6 rounded-3xl border shadow-sm space-y-4 flex flex-col ${step.isFormatSpecific ? "bg-zinc-950 dark:bg-white border-zinc-800 dark:border-zinc-200" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"}`}
              >
                <span className={`text-[10px] font-black tracking-widest uppercase ${step.isFormatSpecific ? "text-lime" : "text-zinc-400"}`}>
                  {step.num}
                </span>
                <h3 className={`text-base font-black tracking-tight leading-tight ${step.isFormatSpecific ? "text-white dark:text-zinc-900" : "text-zinc-900 dark:text-white"}`}>
                  {step.title}
                </h3>
                <p className={`text-sm leading-relaxed ${step.isFormatSpecific ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-600 dark:text-zinc-400"}`}>
                  {step.body}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Handoff note */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isHowInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm max-w-2xl mx-auto"
          >
            <ArrowRight className="w-5 h-5 text-lime shrink-0 mt-0.5" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">Handoff — </span>
              The BOQ produced here becomes the measurement baseline for site valuation and interim payment certificates in the construction stage using MeasureonAir.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 6: KEY CAPABILITIES ─── */}
      <section
        ref={capsRef}
        className="py-28 px-6 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900"
      >
        <div className="max-w-5xl mx-auto space-y-14">
          <motion.div
            initial="hidden"
            animate={isCapsInView ? "visible" : "hidden"}
            variants={stagger}
            className="text-center space-y-4"
          >
            <motion.span variants={fadeInUp} className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
              Key Capabilities
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
              Built for every QS workflow
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isCapsInView ? "visible" : "hidden"}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {[
              {
                icon: Bot,
                title: "AI Rate Prediction",
                body: "Trained on your firm's historical pricing. Rates are predicted per line item, not looked up manually.",
              },
              {
                icon: Layers,
                title: "Standard Measurement Rules",
                body: "Supports NRM2 and other measurement standards. Elements are grouped and measured to your firm's rules.",
              },
              {
                icon: Zap,
                title: "Four Input Formats, One Engine",
                body: "Revit, ACC, CostX, or PDF and DXF. The same AI rate prediction engine regardless of what you start with.",
              },
              {
                icon: Download,
                title: "Export Anywhere",
                body: "Export to Excel, CSV, or directly into your specialist BOQ software when needed.",
              },
            ].map((cap) => (
              <motion.div
                key={cap.title}
                variants={fadeInUp}
                className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 group hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors duration-300 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-lime/15 flex items-center justify-center">
                  <cap.icon className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
                </div>
                <h3 className="text-base font-black text-zinc-900 dark:text-white tracking-tight">
                  {cap.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {cap.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 7: FITS INTO YOUR WORKFLOW ─── */}
      <section className="py-28 px-6 bg-zinc-50 dark:bg-zinc-900/30 border-t border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto space-y-14">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Integration</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
              Fits into your workflow
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 items-stretch">
            {/* What feeds in */}
            <div className="p-8 rounded-3xl md:rounded-r-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">What feeds in</span>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                A Revit model, an Autodesk Construction Cloud project, a CostX workbook, or a 2D PDF or DXF drawing — whichever you already have.
              </p>
            </div>

            {/* Process */}
            <div className="p-8 border border-zinc-900 dark:border-zinc-100 bg-zinc-950 dark:bg-white space-y-4 shadow-xl relative">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">The process</span>
              <div className="space-y-3">
                {[
                  "Upload or connect your source",
                  "Quanto identifies elements",
                  "AI predicts rates",
                  "Priced BOQ output",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-zinc-300 dark:text-zinc-700">
                    <span className="w-5 h-5 rounded-full bg-lime flex items-center justify-center text-[9px] font-black text-black shrink-0">{i + 1}</span>
                    <span>{step}</span>
                    {i < 3 && <ArrowRight className="w-3 h-3 text-zinc-600 dark:text-zinc-400 ml-auto shrink-0" />}
                  </div>
                ))}
              </div>
            </div>

            {/* What it feeds into */}
            <div className="p-8 rounded-3xl md:rounded-l-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">What it feeds into</span>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                The priced BOQ becomes the measurement baseline for MeasureonAir during construction and the cost framework for Cost Plan Calculator at pre-design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 8: WHY CHOOSE QUANTO ─── */}
      <ComparisonGrid
        sectionTitle="Why Choose Quanto"
        card1={{
          title: "Manual Method (Excel)",
          subtitle: "The traditional approach",
          features: [
            "Weeks to produce a single bill",
            "Manual element measuring throughout",
            "Rates looked up and applied by hand",
            "Any format accepted — but all manual work",
            "High error risk, prone to omissions",
          ],
          metric: { value: "WEEKS", label: "TIMELINE" },
          button: { text: "Traditional Route", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
        }}
        card2={{
          title: "Quanto",
          subtitle: "Recommended",
          features: [
            "Done in hours instead of weeks",
            "Automated element identification from your source",
            "AI predicts rates from your firm's pricing history",
            "Works with Revit, ACC, CostX, or 2D drawings",
            "Low risk — AI flags low-confidence elements for review",
          ],
          metric: { value: "HOURS", label: "TIMELINE" },
          button: { text: "Book A Demo", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
        }}
        card3={{
          title: "Standard Take-off Tools",
          subtitle: "Partial automation",
          features: [
            "Faster than Excel, still hours to days",
            "Stop at measurement only — no rate prediction",
            "No rate prediction engine, rates entered manually",
            "Locked to one input format, heavy manual config",
            "Medium risk — better than Excel but still incomplete",
          ],
          metric: { value: "PARTIAL", label: "AUTOMATION" },
          button: { text: "Other Tools", href: "#" },
        }}
      />

      {/* ─── SECTION 9: PRICING & AVAILABILITY ─── */}
      <section
        ref={pricingRef}
        className="py-32 px-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900"
      >
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="space-y-4">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Pricing &amp; Availability</span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-zinc-50 tracking-tight">
              Simple, transparent pricing
            </h2>
          </div>

          {/* Price card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-sm">
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Monthly Subscription</span>
              <p className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
                USD {FORMAT.price}
                <span className="text-sm font-normal text-zinc-400">/mo</span>
              </p>
              <p className="text-xs text-zinc-500 leading-relaxed">{FORMAT.priceNote}</p>
            </div>
            <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-sm">
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Enterprise Add-on</span>
              <p className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">Custom Plan</p>
              <p className="text-xs text-zinc-500 leading-relaxed">For multi-office deployment and training on complex proprietary historical rates.</p>
            </div>
          </div>

          {/* Bundle callout */}
          <div className="p-5 rounded-2xl bg-lime/10 border border-lime/20 flex items-start gap-3">
            <Zap className="w-4 h-4 text-lime shrink-0 mt-0.5" />
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              <span className="font-bold">Using more than one input format?</span>{" "}
              Bundle pricing is available. <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-zinc-900 dark:hover:text-white transition-colors">Contact us.</a>
            </p>
          </div>

          {/* Quick Facts + Related Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            {/* Quick Facts */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-8 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-xl border-b border-zinc-100 dark:border-zinc-800 pb-4 text-zinc-900 dark:text-white">Quick Facts</h3>
                <div className="space-y-4 pt-4">
                  {[
                    { label: "Stage", value: "Quantity Take Off" },
                    { label: "Best For", value: FORMAT.quickFactsBestFor },
                    { label: "Target Regions", value: FORMAT.regionBadges.join(", ") },
                    { label: "Status", value: FORMAT.statusBadge },
                    { label: "Pricing", value: `USD ${FORMAT.price}/month` },
                  ].map((fact, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 gap-4">
                      <span className="text-zinc-500 font-semibold shrink-0">{fact.label}</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 text-right">{fact.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button asChild className="w-full rounded-2xl py-6 font-bold shadow-lg border-0 bg-lime text-black hover:bg-lime/90 cursor-pointer">
                <a href="/pricing" target="_blank" rel="noopener noreferrer">
                  Buy Products →
                </a>
              </Button>
            </motion.div>

            {/* Related Products */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-6">Related Products</h4>
                <ul className="space-y-5 text-sm">
                  <li>
                    <Link href="/learnmore/measureonair" className="group flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                      </div>
                      <div>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors block">MeasureonAir</span>
                        <span className="text-xs text-zinc-400">Next step — construction stage. Push the BOQ to site for digital valuation and interim certificates.</span>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/learnmore/cost-plan-calculator" className="group flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                        <Layers className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                      </div>
                      <div>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors block">Cost Plan Calculator</span>
                        <span className="text-xs text-zinc-400">Pre-design. Sets the budget frame that your BOQ works within.</span>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Also in Quanto</span>
                      <div className="flex flex-wrap gap-2">
                        {FORMAT.relatedQuantoLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Link href="/learnmore" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  View full product suite <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 10: FAQ ─── */}
      <section
        ref={faqRef}
        className="py-32 px-6 bg-[#FAFAF8] dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate={isFaqInView ? "visible" : "hidden"}
            variants={stagger}
            className="text-center mb-14 space-y-3"
          >
            <motion.span variants={fadeInUp} className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">FAQ</motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
              Frequently Asked Questions
            </motion.h2>
          </motion.div>

          <AppleAccordion
            items={[
              {
                q: "Can the AI rate prediction adapt to our firm's historical pricing?",
                a: "Yes. Quanto is trained on your firm's historical rate data before deployment. The predictions improve over time as more project data is added.",
              },
              {
                q: "What measurement standards are supported?",
                a: "NRM2 is supported as the primary standard. Other regional standards are available on request.",
              },
              {
                q: "Does it replace our estimators?",
                a: "No. Quanto removes the manual measuring and rate lookup so your estimators focus on reviewing, validating, and advising rather than data entry.",
              },
              {
                q: "Can we export the final BOQ to Excel?",
                a: "Yes. Export to Excel, CSV, or directly into your specialist BOQ software.",
              },
              {
                q: FORMAT.faqQ5,
                a: FORMAT.faqA5,
              },
            ]}
          />
        </div>
      </section>

      {/* ─── SECTION 11: FINAL CTA ─── */}
      <section className="relative bg-zinc-100 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 overflow-hidden py-32 border-t border-zinc-200 dark:border-zinc-800">
        <div
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 px-6 relative z-10">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Get Started</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase text-zinc-950 dark:text-white">
            Automate the measurement. Keep the expertise.
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-medium">
            {FORMAT.ctaBody}
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 py-6 font-bold shadow-xl border-0 bg-lime text-black hover:bg-lime/90 cursor-pointer transition-transform hover:scale-105"
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
