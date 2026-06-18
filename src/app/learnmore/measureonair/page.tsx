"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  Smartphone,
  Layers,
  ShieldCheck,
  BarChart3,
  MapPin,
  Clock,
  FileText,
  FileSearch,
  Pencil,
  Send,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComparisonGrid from "@/components/learnmore/comparison-grid";
import Carousel from "@/components/learnmore/carousel";
import { VideoLightbox } from "@/components/persona/video-lightbox";

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

// Carousel Steps for How it Works
const carouselSteps = [
  {
    id: "step1",
    stepNumber: "01",
    title: "Launch MeasureonAir",
    description: "Open the web or mobile app on site. Works 100% offline, caching all records locally until connectivity is restored.",
    image: "/images/isometric_tablet_3d_1781764710102.png",
  },
  {
    id: "step2",
    stepNumber: "02",
    title: "Select Drawing Section",
    description: "Zoom into structural plans. Building elements (slabs, columns, walls) map directly to BOQ baseline entities.",
    image: "/images/2d_structural_drawing.png",
  },
  {
    id: "step3",
    stepNumber: "03",
    title: "Record Measurements",
    description: "Enter linear meters, square areas, item counts, or 3D depth parameters. Attach photos as permanent audit proof.",
    image: "/images/isometric_tablet_3d_1781764710102.png",
  },
  {
    id: "step4",
    stepNumber: "04",
    title: "Apply Contract Rules",
    description: "The engine auto-checks tolerance bands (e.g. +/- 5%), applies defects holdbacks, and validates bill boundaries.",
    image: "/images/cv_blueprint_analysis.png",
  },
  {
    id: "step5",
    stepNumber: "05",
    title: "Export Payment App",
    description: "A fully auditable interim certificate and formatted payment application are compiled instantly for submittal.",
    image: "/images/3d_revit_model.png",
  },
];

export default function MeasureonairPage() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

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
    }, 4000);
    return () => clearInterval(timer);
  }, [autoToggleKey]);

  const handleTabClick = (tab: "before" | "after") => {
    setActiveTab(tab);
    setAutoToggleKey((k) => k + 1);
  };

  const beforeBullets = [
    "Take printed plans to site",
    "Annotate measurements by hand",
    "Back in office, type into Excel manually",
    "Calculate the certified quantity",
    "Produce payment application manually",
    "Cross-reference drawings (multiple windows)",
    "2–3 days per valuation, high error rate",
  ];

  const afterBullets = [
    "Open MeasureonAir app on site",
    "Record measurements against digital drawing",
    "App calculates certified quantity automatically",
    "Payment application generated in real-time",
    "Send directly to client from the field",
    "1–2 hours per valuation, zero manual steps",
  ];

  const faqs = [
    {
      q: "How does it handle site measurements that don't match the drawing?",
      a: "All measurements are compared to the baseline drawing. Discrepancies outside configured tolerances are automatically flagged for manager review.",
    },
    {
      q: "What if site conditions change or require rework?",
      a: "You can adjust certified quantities down for defective work. All adjustments are historically tracked with audit notes for full traceability.",
    },
    {
      q: "Can we use measurements from previous projects?",
      a: "Yes, previous measurements are visible for historical reference, but each valuation period uses only measurements recorded for that specific period.",
    },
    {
      q: "How does it handle variations or contract changes?",
      a: "The baseline BOQ can be updated dynamically to reflect approved variations. New site measurements are automatically measured against the updated baseline.",
    },
    {
      q: "What formats does the payment application export to?",
      a: "You can export to fully formatted PDFs, Excel spreadsheets, or email directly to the contract administrator. Direct API integrations with ERPs are also supported.",
    },
    {
      q: "Is an internet connection required on site?",
      a: "No. The app functions fully offline. Measurements are stored locally on your device and sync automatically when internet connectivity is re-established.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-lime/30 selection:text-black">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-zinc-50 dark:bg-zinc-950 pt-16">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-gradient-to-br from-lime/20 via-lime/10 to-transparent rounded-full blur-[130px] mix-blend-multiply dark:mix-blend-screen opacity-75 animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] bg-gradient-to-tr from-lime/10 via-zinc-400/5 to-transparent rounded-full blur-[140px] mix-blend-multiply dark:mix-blend-screen opacity-65" />
          <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/60 backdrop-blur-[1px]" />
          
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
            
            {/* Left Column - Hero Content & Switcher */}
            <div className="lg:col-span-7 space-y-8">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.div variants={fadeInUp} className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-lime/10 border border-lime/30 text-zinc-900 dark:text-white backdrop-blur-md">
                    Construction Stage
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-250/50 dark:bg-zinc-800 border border-zinc-350 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 text-lime" />
                    Middle East · Sri Lanka
                  </span>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.05]"
                >
                  MeasureonAir
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-950 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-300 dark:to-zinc-500">
                    Digital Site Valuation
                  </span>
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-300 font-semibold leading-relaxed max-w-xl"
                >
                  From site measurements to certified payment applications.
                  <br />
                  <span className="text-lime dark:text-lime font-bold">One continuous workflow.</span>
                </motion.p>

                {/* Switcher Widget inside Hero Left */}
                <motion.div
                  variants={fadeInUp}
                  className="relative bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/70 dark:border-zinc-800/70 rounded-3xl p-6 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4 border-b border-zinc-150 dark:border-zinc-850 pb-3">
                    <h3 className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white">
                      Compare Site Workflows
                    </h3>
                    <div className="relative flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl w-48 justify-between border border-zinc-200/50 dark:border-zinc-850/50">
                      <button
                        onClick={() => handleTabClick("before")}
                        className={`relative z-10 w-[50%] py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          activeTab === "before"
                            ? "text-zinc-900 dark:text-white"
                            : "text-zinc-400"
                        }`}
                      >
                        Before
                      </button>
                      <button
                        onClick={() => handleTabClick("after")}
                        className={`relative z-10 w-[50%] py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          activeTab === "after"
                            ? "text-zinc-900 dark:text-white"
                            : "text-zinc-400"
                        }`}
                      >
                        After
                      </button>

                      <motion.div
                        layout
                        className="absolute top-1 bottom-1 bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-lg"
                        style={{ width: "calc(50% - 4px)" }}
                        animate={{
                          left:
                            activeTab === "before" ? 4 : "calc(100% / 2 + 4px)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25,
                        }}
                      />
                    </div>
                  </div>

                  <div className="min-h-[140px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      {activeTab === "before" ? (
                        <motion.div
                          key="before"
                          initial={{ opacity: 0, x: -14 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 14 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2.5"
                        >
                          <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                            Traditional Manual Steps
                          </div>
                          <ul className="space-y-1.5">
                            {beforeBullets.slice(0, 4).map((t, i) => (
                              <li key={i} className="flex gap-2 text-zinc-600 dark:text-zinc-400 text-xs">
                                <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="after"
                          initial={{ opacity: 0, x: 14 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -14 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2.5"
                        >
                          <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            MeasureonAir Automation
                          </div>
                          <ul className="space-y-1.5">
                            {afterBullets.slice(0, 4).map((t, i) => (
                              <li key={i} className="flex gap-2 text-zinc-650 dark:text-zinc-350 text-xs">
                                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* CTAs */}
                <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-2">
                  <Button
                    onClick={() => setLightboxOpen(true)}
                    variant="outline"
                    size="lg"
                    className="rounded-2xl px-8 py-7 font-bold shadow-sm cursor-pointer border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 transition-transform hover:scale-105"
                  >
                    <Play className="w-4 h-4 mr-2 text-lime dark:text-lime fill-lime" />
                    Watch Demo
                  </Button>
                  
                  <Button
                    asChild
                    size="lg"
                    className="rounded-2xl px-8 py-7 font-bold shadow-xl shadow-lime/10 cursor-pointer bg-lime text-black hover:bg-lime/90 border-0 transition-transform hover:scale-105"
                  >
                    <a
                      href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Book a demo →
                    </a>
                  </Button>
                </motion.div>

                <motion.div variants={fadeInUp} className="text-xs text-zinc-550 dark:text-zinc-450 pt-2 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-lime" />
                  Native iOS & Android apps + collaborative Web dashboard
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column - Mockup Player */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute -inset-1 rounded-[30px] bg-gradient-to-tr from-lime to-transparent opacity-20 blur-lg" />
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-lime/5 via-transparent to-transparent rounded-[28px] pointer-events-none" />
                  <VideoMockupPlayer onPlayClick={() => setLightboxOpen(true)} />
                </div>
              </motion.div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* Video Lightbox */}
      <VideoLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=1u8_royKFEE"
      />

      {/* ─── PROBLEM SECTION ─── */}
      <section ref={problemRef} className="relative py-32 px-6 bg-white dark:bg-zinc-950 overflow-hidden border-y border-zinc-200 dark:border-zinc-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isProblemInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-5 space-y-6"
          >
            <span className="text-xs font-bold text-zinc-450 dark:text-zinc-550 uppercase tracking-widest block">
              The Pain Point
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight uppercase">
              Valuations should take hours, not days
            </h2>
            <div className="w-16 h-1 bg-lime rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isProblemInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-7 space-y-6 text-zinc-650 dark:text-zinc-400 text-base sm:text-lg leading-relaxed"
          >
            <p>
              Traditional interim site valuation is an archaic manual bottleneck. Engineers walk the site carrying rolled plans, annotating dimensions and quantities with physical pens, only to spend the next two days in the office re-typing those records into disconnected Excel sheets.
            </p>
            <p>
              Data gets corrupted. Transcription errors slip in, and when audits happen, tracing a certified quantity back to a specific spot on the drawing is nearly impossible.
            </p>
            <p className="font-semibold text-zinc-950 dark:text-white">
              MeasureonAir brings the BOQ directly onto site. You measure once on a digital tablet screen, and our engine automatically calculates, audits, and builds the interim payment application.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (CAROUSEL) ─── */}
      <section ref={solutionRef} className="relative py-32 px-6 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-900 pb-10">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                How It Works
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.1] uppercase">
                The Site Workflow
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg font-medium">
                Record, certify, and submit. Learn how simple site valuations are with MeasureonAir.
              </p>
            </div>
          </div>

          <div className="w-full">
            <Carousel items={carouselSteps} themeColor="#ecf000" />
          </div>
        </div>
      </section>

      {/* ─── WORKFLOW BENTO GRID ─── */}
      <section ref={workflowRef} className="bg-zinc-950 text-white border-t border-zinc-900 py-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-10">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-bold text-lime uppercase tracking-widest block">
                Workflow Integration
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] uppercase">
                Fits into your workflow
              </h2>
              <p className="text-zinc-400 text-base sm:text-lg font-medium">
                From structural drawings to automated quantity takeoff and AI-assisted contract verification.
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
            
            {/* Bento Card 1: Input (What Feeds In) */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-zinc-800 transition-all duration-300 shadow-sm">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">What Feeds In</span>
                <h3 className="text-2xl font-bold tracking-tight text-white">Baseline Baselines</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Imports priced BOQ files generated directly from our 2D Drawing to BOQ engine or Revit to BOQ plugin to set contract rules.
                </p>
              </div>

              <div className="mt-10 bg-zinc-950 border border-zinc-900 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Source baseline</span>
                  <span className="text-[10px] font-mono text-lime bg-lime/10 px-2 py-0.5 rounded">Active</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-900">
                    <span className="text-xs font-mono text-zinc-300">Revit_Model_Final.rvt</span>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-900">
                    <span className="text-xs font-mono text-zinc-300">Priced_BOQ_v2.xlsx</span>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Processing (Core Engine) */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-zinc-800 transition-all duration-300 shadow-sm">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Core Engine</span>
                <h3 className="text-2xl font-bold tracking-tight text-white">Auto-Calculations</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  The system applies tolerancing rules, checks maximum allowable quantities, and prevents over-valuation automatically.
                </p>
              </div>

              <div className="mt-10 bg-zinc-950 border border-zinc-900 rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-center text-xs mb-3">
                  <span className="font-mono text-zinc-400">Concrete Slab (Level 2)</span>
                  <span className="font-bold text-emerald-400">98.5% measured</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                  <div className="bg-lime h-2 rounded-full" style={{ width: '98.5%' }} />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-550 mt-2">
                  <span>Target: 450 m³</span>
                  <span>Certified: 443 m³</span>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Output (What it Feeds Into) */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-zinc-800 transition-all duration-300 shadow-sm">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">What it feeds into</span>
                <h3 className="text-2xl font-bold tracking-tight text-white">Payment Certificates</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Generates professional payment applications. Feeds contract logs directly into BuilderBot.ai to run contract risk analysis.
                </p>
              </div>

              <div className="mt-10 bg-zinc-950 border border-zinc-900 rounded-2xl p-4 shadow-sm space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-zinc-400 bg-zinc-900/40 p-2 rounded-xl">
                  <span>BuilderBot.ai Sync</span>
                  <span className="text-emerald-400 font-bold">Linked</span>
                </div>
                <div className="flex items-center justify-between text-zinc-450 bg-zinc-900/40 p-2 rounded-xl">
                  <span>ERP/Excel Export</span>
                  <span className="text-zinc-350">Formatted</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── PRICING & SIDEBAR ─── */}
      <section ref={pricingRef} className="py-32 px-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-16">
              <div className="space-y-6">
                <span className="text-xs font-bold text-zinc-450 dark:text-zinc-550 uppercase tracking-widest block">Deployment</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-zinc-50">Pricing &amp; Availability</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-sm">
                    <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Pricing Model</span>
                    <p className="text-4xl font-black tracking-tight">USD 200<span className="text-sm font-normal text-zinc-450">/month</span></p>
                    <p className="text-xs text-zinc-500">Billed monthly per enterprise, covering unlimited active projects and users.</p>
                  </div>
                  <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-sm">
                    <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Enterprise Add-on</span>
                    <p className="text-4xl font-black tracking-tight">Custom Plan</p>
                    <p className="text-xs text-zinc-500">Tailored ERP connections (SAP, Oracle) and custom workflow setup.</p>
                  </div>
                </div>
              </div>

              {/* Related Products */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-zinc-200 to-transparent dark:from-zinc-800" />
                  <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest">Related Products</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-zinc-200 to-transparent dark:from-zinc-800" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      href: "/learnmore/revit-to-boq",
                      title: "Revit to BOQ",
                      desc: "Automate raw material takeoff from Revit models to set baseline records.",
                      tag: "Baseline Setup",
                    },
                    {
                      href: "/learnmore/buildmonitor",
                      title: "BuildMonitor",
                      desc: "Track execution progress live, sync site logs with quantities.",
                      tag: "Execution",
                    },
                    {
                      href: "/learnmore/builderbot",
                      title: "BuilderBot.ai",
                      desc: "Interactive contract reviews and claim risk checking.",
                      tag: "Contract Bot",
                    },
                  ].map((rel, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -4, scale: 1.01 }}
                      className="h-full"
                    >
                      <Link
                        href={rel.href}
                        className="group flex flex-col justify-between p-5 h-full bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:shadow-lg hover:border-lime/30 transition-all duration-300"
                      >
                        <div className="space-y-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-zinc-150 dark:bg-zinc-800 text-[8px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                            {rel.tag}
                          </span>
                          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-lime transition-colors pt-1">
                            {rel.title}
                          </h4>
                          <p className="text-xs text-zinc-500 leading-relaxed">{rel.desc}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-[10px] font-semibold text-lime">Explore</span>
                          <ChevronRight className="w-3 h-3 text-lime transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Facts Sidebar */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-8">
                <h3 className="font-bold text-xl border-b border-zinc-100 dark:border-zinc-800 pb-4">Quick Facts</h3>
                
                <div className="space-y-5">
                  {[
                    { label: "Project Stage", value: "Construction" },
                    { label: "Ideal Target", value: "Quantity Surveyors, Site Engineers" },
                    { label: "Target Regions", value: "Middle East, Sri Lanka" },
                    { label: "Time to Implement", value: "1 week (with baseline BOQ)" },
                    { label: "Pricing Model", value: "USD 200/month flat-rate" },
                  ].map((fact, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 gap-4">
                      <span className="text-zinc-500 font-semibold shrink-0">{fact.label}</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-200 text-right">{fact.value}</span>
                    </div>
                  ))}
                </div>

                <Button
                  asChild
                  className="w-full rounded-2xl py-7 font-bold shadow-xl border-0 bg-lime text-black hover:bg-lime/90 cursor-pointer"
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

          </div>
        </div>
      </section>

      {/* ─── COMPARISON GRID ─── */}
      <ComparisonGrid
        sectionTitle="Why choose MeasureonAir"
        card1={{
          title: "Manual Method",
          subtitle: "Manual Takeoff & Excel",
          features: [
            "2–3 days per interim valuation",
            "Prone to copy-paste transcription errors",
            "Traceability and audit logs are difficult",
            "Contract maximum boundaries checked by hand",
          ],
          metric: { value: "DAYS", label: "TIMELINE" },
          button: { text: "Traditional Route", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
        }}
        card2={{
          title: "MeasureonAir",
          subtitle: "Digital Site Measurements",
          features: [
            "1–2 hours per valuation",
            "Completely digital from site to client certificate",
            "Interactive drawing verification",
            "Auto-calculates quantity tolerance boundaries",
          ],
          metric: { value: "HOURS", label: "TIMELINE" },
          button: { text: "Book A Demo", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
        }}
        card3={{
          title: "Standard Take-off Apps",
          subtitle: "Partial Tools",
          features: [
            "Annotate plans but don't export BOQs",
            "Do not enforce contract tolerance limits",
            "No audit trace linking coordinates back to bills",
            "Excel format exports only",
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
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <AppleAccordion items={faqs} />
        </div>
      </section>

      {/* ─── Footer CTA ─── */}
      <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-955 dark:text-zinc-50 leading-tight uppercase">
            YOUR PAYMENT APPLICATIONS SHOULD TAKE HOURS, NOT DAYS.
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Eliminate hand annotations and manual calculations today.
          </p>

          <div className="pt-4 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 py-6 font-bold shadow-xl border-0 bg-lime text-zinc-955 hover:bg-lime/90 cursor-pointer"
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

// Custom Video Player Mockup Wrapper
function VideoMockupPlayer({ onPlayClick }: { onPlayClick: () => void }) {
  return (
    <div className="relative rounded-[28px] overflow-hidden border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-900/5 dark:bg-zinc-900/40 shadow-xl group">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--color-lime-rgb,0.15),transparent_55%)]" />
      <div className="relative p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest">
              Demo Preview
            </div>
            <div className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">MEASUREONAIR</div>
            <div className="text-xs text-zinc-500">
              Watch how site measurements generate payment apps
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-lime/10 border border-lime/30 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-lime" />
          </div>
        </div>

        <button
          onClick={onPlayClick}
          className="mt-6 w-full rounded-2xl overflow-hidden border border-zinc-200/70 dark:border-zinc-800/70 bg-white/50 dark:bg-zinc-900/30 hover:bg-white/80 dark:hover:bg-zinc-900/50 transition-all cursor-pointer group-hover:scale-[1.01] duration-300"
        >
          <div className="relative aspect-[16/10]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.1),rgba(0,0,0,0.4))]" />
            <video
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              muted
              playsInline
              autoPlay
              loop
              preload="metadata"
              src="/videos/hand-drawn-to-autocad/hero-bg.mp4"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-black/60 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Play className="w-6 h-6 text-lime fill-lime ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                  Watch demo
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-lime" />
                <span className="text-[10px] text-white/80">
                  1:00 min overview
                </span>
              </div>
            </div>
          </div>
        </button>

        <div className="mt-4 flex flex-wrap gap-2.5 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/60">
            <FileSearch className="w-3.5 h-3.5 text-lime" />
            Digital Drawings
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/60">
            <ShieldCheck className="w-3.5 h-3.5 text-lime" />
            Auto Certification
          </span>
        </div>
      </div>
    </div>
  );
}
