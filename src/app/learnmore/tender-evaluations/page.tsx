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
  Mail,
  Cpu,
  FileText,
  ShieldCheck,
  Calendar,
  Layers,
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
    title: "Forward Bids",
    description: "Forward supplier quote emails directly to your project's custom intake address. No portals or accounts needed for bidders.",
    image: "/images/isometric_laptop_blueprint_1781764693629.png",
  },
  {
    id: "step2",
    stepNumber: "02",
    title: "AI Parsing & Extraction",
    description: "The parsing engine extracts rates, terms, currencies, lead times, and specifications from email attachments and raw text.",
    image: "/images/cv_blueprint_analysis.png",
  },
  {
    id: "step3",
    stepNumber: "03",
    title: "Bid Comparison Grid",
    description: "Generate a fully normalized side-by-side comparison matrix. Compare line items, payment terms, and delivery schedules instantly.",
    image: "/images/schedule_validation_1781792655611.png",
  },
  {
    id: "step4",
    stepNumber: "04",
    title: "Compliance & Award Recs",
    description: "The system automatically ranks bids based on compliance constraints, highlighting deviations and suggesting optimal awards.",
    image: "/images/3d_revit_model.png",
  },
];

export default function TenderEvaluationsPage() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
                    Tendering & Intake
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-250/50 dark:bg-zinc-800 border border-zinc-350 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                    Middle East · Sri Lanka
                  </span>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.05]"
                >
                  Tender Evaluations
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-950 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-300 dark:to-zinc-500">
                    Direct from Email
                  </span>
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-300 font-semibold leading-relaxed max-w-xl"
                >
                  Side-by-side bid comparison reports compiled instantly.
                  <br />
                  <span className="text-lime dark:text-lime font-bold">No manual data entry.</span>
                </motion.p>

                {/* Switcher Widget inside Hero Left */}
                <motion.div
                  variants={fadeInUp}
                  className="relative bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/70 dark:border-zinc-800/70 rounded-3xl p-6 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4 border-b border-zinc-150 dark:border-zinc-850 pb-3">
                    <h3 className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white">
                      Compare Procurement Steps
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
                            Manual Tabulation
                          </div>
                          <ul className="space-y-1.5">
                            <li className="flex gap-2 text-zinc-650 dark:text-zinc-400 text-xs">
                              <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              <span>Open dozens of bid emails one by one.</span>
                            </li>
                            <li className="flex gap-2 text-zinc-650 dark:text-zinc-400 text-xs">
                              <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              <span>Copy rates, materials, and schedules into Excel manually.</span>
                            </li>
                            <li className="flex gap-2 text-zinc-650 dark:text-zinc-400 text-xs">
                              <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              <span>Spend days normalizing different formats and currencies.</span>
                            </li>
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
                            Tender Evaluations from Email
                          </div>
                          <ul className="space-y-1.5">
                            <li className="flex gap-2 text-zinc-650 dark:text-zinc-350 text-xs">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>Simply forward incoming supplier bid emails to the parser.</span>
                            </li>
                            <li className="flex gap-2 text-zinc-650 dark:text-zinc-350 text-xs">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>AI extracts specs, pricing lists, and payment terms in seconds.</span>
                            </li>
                            <li className="flex gap-2 text-zinc-650 dark:text-zinc-350 text-xs">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>Generates side-by-side compliance comparisons instantly.</span>
                            </li>
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
                <div className="relative rounded-[28px] overflow-hidden border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-900/5 dark:bg-zinc-900/40 shadow-xl p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-250 dark:border-zinc-800 pb-4">
                    <div>
                      <div className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest">Intake System</div>
                      <div className="text-base font-bold text-zinc-900 dark:text-white">Active Tender Packages</div>
                    </div>
                    <Mail className="w-5 h-5 text-lime" />
                  </div>
                  
                  {/* Parsing flow animation visual */}
                  <div className="bg-zinc-950/80 rounded-2xl p-4 space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>Analyzing bids...</span>
                      <span className="text-lime animate-pulse">Processing</span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-lime h-1.5 rounded-full" style={{ width: '92%' }} />
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between text-zinc-400">
                        <span>Bidder 1: Excel attachment</span>
                        <span className="text-emerald-500 font-bold">Extracted</span>
                      </div>
                      <div className="flex justify-between text-zinc-450">
                        <span>Bidder 2: Email text rates</span>
                        <span className="text-emerald-500 font-bold">Extracted</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <span className="px-2.5 py-1 bg-zinc-150 dark:bg-zinc-800 rounded-lg text-zinc-650 dark:text-zinc-350 border border-zinc-200/50 dark:border-zinc-700">Auto Normalizing</span>
                    <span className="px-2.5 py-1 bg-zinc-150 dark:bg-zinc-800 rounded-lg text-zinc-650 dark:text-zinc-350 border border-zinc-200/50 dark:border-zinc-700">Multi-Currency</span>
                  </div>
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
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-6"
          >
            <span className="text-xs font-bold text-zinc-450 dark:text-zinc-550 uppercase tracking-widest block">
              The Challenge
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight uppercase">
              Bid evaluation is manual data entry.
            </h2>
            <div className="w-16 h-1 bg-lime rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isProblemInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 space-y-6 text-zinc-650 dark:text-zinc-400 text-base sm:text-lg leading-relaxed"
          >
            <p>
              Procurement teams receive bids from suppliers and subcontractors over email. The evaluation process remains entirely manual: downloading attachments, copy-pasting bid columns into comparison sheets, and trying to align mismatched descriptions.
            </p>
            <p>
              Normalizing different currencies, payment conditions, and lead times across 20+ bids consumes days of expert time. Human copy-paste errors are common, and missing key exclusions or deviations leads to costly project variations later.
            </p>
            <p className="font-semibold text-zinc-950 dark:text-white">
              Tender Evaluations parses quotes directly from incoming emails, structuring data automatically into side-by-side matrices so you can make award decisions instantly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (CAROUSEL) ─── */}
      <section ref={solutionRef} className="relative py-32 px-6 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-900 pb-10">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-bold text-zinc-450 dark:text-zinc-550 uppercase tracking-widest block">
                How It Works
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.1] uppercase">
                The Procurement Flow
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg font-medium">
                Watch how standard emails turn into normalized comparison matrices automatically.
              </p>
            </div>
          </div>

          <div className="w-full">
            <Carousel items={carouselSteps} themeColor="#ecf000" />
          </div>
        </div>
      </section>

      {/* ─── BENTO GRID CAPABILITIES ─── */}
      <section ref={workflowRef} className="bg-zinc-950 text-white border-t border-zinc-900 py-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-10">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-bold text-lime uppercase tracking-widest block">
                Key Capabilities
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] uppercase">
                Tender Scoring &amp; Analysis
              </h2>
              <p className="text-zinc-400 text-base sm:text-lg font-medium">
                Automate compliance checking, currency matching, and bidder comparisons inside a single interface.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
            
            {/* Bento Card 1: Bidder Comparison Engine */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-zinc-800 transition-all duration-300 shadow-sm">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Comparison Engine</span>
                <h3 className="text-2xl font-bold tracking-tight text-white">Side-by-Side Normalization</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Extracts and pairs items side-by-side even if bidders write descriptions or use parameters differently.
                </p>
              </div>

              <div className="mt-10 bg-zinc-950 border border-zinc-900 rounded-2xl p-4 shadow-sm space-y-2.5 text-xs">
                <div className="flex justify-between items-center bg-zinc-900/60 p-2 rounded-xl text-zinc-300">
                  <span>Bidder A (Lowest price)</span>
                  <span className="text-emerald-400 font-bold">$13,800</span>
                </div>
                <div className="flex justify-between items-center bg-zinc-900/60 p-2 rounded-xl text-zinc-400">
                  <span>Bidder B (Best lead time)</span>
                  <span className="text-zinc-300 font-bold">$14,500</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Compliance Scoring */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-zinc-800 transition-all duration-300 shadow-sm">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Scoring &amp; Grading</span>
                <h3 className="text-2xl font-bold tracking-tight text-white">Compliance Evaluation</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Scores bids on criteria other than price — analyzing delivery dates, payment terms, and warranty exceptions.
                </p>
              </div>

              <div className="mt-10 bg-zinc-950 border border-zinc-900 rounded-2xl p-4 shadow-sm space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Compliance Grade</span>
                  <span className="text-lime font-bold">A+ (Compliant)</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5">
                  <div className="bg-lime h-1.5 rounded-full" style={{ width: '95%' }} />
                </div>
                <div className="text-[10px] text-zinc-550">0 exclusions found in bidder attachments.</div>
              </div>
            </div>

            {/* Bento Card 3: Email Integration */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-zinc-800 transition-all duration-300 shadow-sm">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Email Intake</span>
                <h3 className="text-2xl font-bold tracking-tight text-white">Multi-Currency Parser</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Reads and converts currencies automatically based on live bank conversion rates or custom project limits.
                </p>
              </div>

              <div className="mt-10 bg-zinc-950 border border-zinc-900 rounded-2xl p-4 shadow-sm space-y-2 text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>AED 45,000</span>
                  <span className="text-zinc-500">→</span>
                  <span className="text-white font-bold">$12,250 USD</span>
                </div>
                <div className="flex items-center justify-between text-zinc-450">
                  <span>LKR 2,400,000</span>
                  <span className="text-zinc-500">→</span>
                  <span className="text-white font-bold">$8,000 USD</span>
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
                    <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Per Tender Pricing</span>
                    <p className="text-4xl font-black tracking-tight">USD 1,500</p>
                    <p className="text-xs text-zinc-500">One-off setup and implementation fee for a single large-scale tender package.</p>
                  </div>
                  <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-sm">
                    <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Enterprise licensing</span>
                    <p className="text-4xl font-black tracking-tight">Annual Plan</p>
                    <p className="text-xs text-zinc-500">Custom volume licensing for developer organizations and commercial main contractors.</p>
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
                      desc: "Automates drawing material quantity takeoff to compile tender baselines.",
                      tag: "Estimation",
                    },
                    {
                      href: "/learnmore/2d-drawing-to-boq",
                      title: "2D Drawing to BOQ",
                      desc: "Generate bills of quantities directly from PDF blueprint drawings.",
                      tag: "Tendering",
                    },
                    {
                      href: "/learnmore/buildmonitor",
                      title: "BuildMonitor",
                      desc: "Track execution progress and compare field schedules on site.",
                      tag: "Construction",
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
                          <span className="px-2 py-0.5 rounded-full bg-zinc-150 dark:bg-zinc-800 text-[8px] font-bold text-zinc-550 dark:text-zinc-450 uppercase tracking-wider">
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
                    { label: "Project Stage", value: "Tendering & Sourcing" },
                    { label: "Ideal Target", value: "Contractors, Procurement Teams" },
                    { label: "Target Regions", value: "Middle East, Sri Lanka" },
                    { label: "Time to Implement", value: "1 week" },
                    { label: "Deployment Model", value: "Email intake setup" },
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
        sectionTitle="Why choose Tender Evaluations"
        card1={{
          title: "Manual spreadsheets",
          subtitle: "Copy-pasting from emails",
          features: [
            "1-2 days to process a trade package",
            "Frequent transcription and rate input errors",
            "Mismatched item descriptions cause confusion",
            "Confidentiality hard to trace on shared files",
          ],
          metric: { value: "DAYS", label: "TIMELINE" },
          button: { text: "Traditional Route", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
        }}
        card2={{
          title: "Tender Evaluations",
          subtitle: "AI Sourcing Normalization",
          features: [
            "Done in hours instead of days",
            "Automatic item description matching",
            "Normalize different currencies and tax rules",
            "Clear audit logs and bid sandboxing",
          ],
          metric: { value: "HOURS", label: "TIMELINE" },
          button: { text: "Book A Demo", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
        }}
        card3={{
          title: "Procurement Portals",
          subtitle: "Supplier Portals",
          features: [
            "Suppliers reject using complex interfaces",
            "Requires suppliers to re-type quotes into forms",
            "Does not support unstructured text quotes",
            "High friction for small subcontractor trades",
          ],
          metric: { value: "FRICTION", label: "SUPPLIER" },
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

          <AppleAccordion
            items={[
              {
                q: "What if bid emails use different layouts, formats, or languages?",
                a: "Our parser is trained on thousands of email types and subcontractor layout formats. It reads free-text rates as well as complex multi-page Excel/PDF attachments.",
              },
              {
                q: "How does it handle multi-currency conversions?",
                a: "The system identifies the quoted currency and converts all rates to your baseline currency automatically. You can choose to use live spot rates or custom contract rates.",
              },
              {
                q: "What if a supplier quotes multiple alternatives?",
                a: "The system parses all alternatives separately and presents them as options. You can compare the base bid against alternates (e.g. standard vs. premium specs) with one click.",
              },
              {
                q: "Can we apply weighted scoring rules beyond price?",
                a: "Yes. You can configure custom procurement scorecards that weigh pricing, delivery lead times, payment terms, and vendor track record scores to recommend awards.",
              },
            ]}
          />
        </div>
      </section>


      {/* ─── Footer CTA ─── */}
      <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-955 dark:text-zinc-50 leading-tight uppercase">
            STOP COPYING BID PRICES INTO SPREADSHEETS.
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Let AI extract, normalize, and score subcontractor quotes directly from emails.
          </p>

          <div className="pt-4 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 py-6 font-bold shadow-xl border-0 bg-lime text-zinc-950 hover:bg-lime/90 cursor-pointer"
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
