
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useMotionValueEvent,
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

interface Step {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  image: string;
}

function CircularProcessFlow({ steps }: { steps: Step[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
  });

  // Vertical offsets for step nodes (subtle floating parallax)
  const y1 = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const y2 = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const y3 = useTransform(scrollYProgress, [0, 1], [-15, 15]);
  const y4 = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const y5 = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const yTarget = useTransform(scrollYProgress, [0, 1], [25, -25]);

  const parallaxTransforms = [y1, y2, y3, y4, y5];

  // Icons array matching steps 1 to 5
  const icons = [FileText, FileSearch, Layers, Calculator, Box];

  // Coordinates on a 1152x700 viewBox canvas
  const desktopNodes = [
    { left: "67.19%", top: "27.71%" },  // Step 1: x = 774, y = 194
    { left: "73.48%", top: "58.14%" },  // Step 2: x = 846.5, y = 407
    { left: "56.3%", top: "80.36%" },   // Step 3: x = 648.5, y = 562.5
    { left: "32.81%", top: "72.23%" },  // Step 4: x = 378, y = 505.6
    { left: "25.69%", top: "45.71%" },  // Step 5: x = 296, y = 320
  ];

  const textPositions = [
    { left: "calc(67.19% + 60px)", top: "27.71%", textAlign: "left" as const, isLeft: false },
    { left: "calc(73.48% + 60px)", top: "58.14%", textAlign: "left" as const, isLeft: false },
    { left: "calc(56.3% + 60px)", top: "80.36%", textAlign: "left" as const, isLeft: false },
    { left: "calc(32.81% - 60px)", top: "72.23%", textAlign: "right" as const, isLeft: true },
    { left: "calc(25.69% - 60px)", top: "45.71%", textAlign: "right" as const, isLeft: true },
  ];

  // Thresholds for step highlight
  const thresholds = [0.12, 0.32, 0.52, 0.70, 0.88];

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#FAFAF8] dark:bg-zinc-950/20 border-y border-zinc-200 dark:border-zinc-800 select-none lg:h-[220vh]"
    >
      {/* Sticky wrapper for desktop, natural container for mobile */}
      <div className="lg:sticky lg:top-[80px] lg:h-[calc(100vh-80px)] w-full flex items-center justify-center overflow-hidden py-16 lg:py-0">

        {/* Blueprint Grid Background */}
        <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15] bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* ─── DESKTOP CIRCULAR CANVAS ─── */}
        <div className="hidden lg:block relative w-full max-w-6xl mx-auto aspect-[1152/700]">

          {/* Connected C-Shape Arc Flow Line (SVG) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none stroke-zinc-350 dark:stroke-zinc-800 fill-none"
            viewBox="0 0 1152 700"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background Dashed Track Line */}
            <path
              d="M 576,130 A 280,220 0 1 1 296,350 L 296,150"
              className="stroke-zinc-200 dark:stroke-zinc-800/60"
              strokeWidth="4"
              strokeDasharray="6 6"
              vectorEffect="non-scaling-stroke"
            />

            {/* Foreground Liquid Flowing Line */}
            <motion.path
              d="M 576,130 A 280,220 0 1 1 296,350 L 296,150"
              className="stroke-lime"
              strokeWidth="5"
              strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
              vectorEffect="non-scaling-stroke"
            />

            {/* Arrowhead at Target */}
            <path
              d="M 288,165 L 296,150 L 304,165"
              className={progress > 0.98 ? "stroke-lime" : "stroke-zinc-350 dark:stroke-zinc-800"}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: "stroke 0.3s ease" }}
            />
          </svg>

          {/* Target Node: GOAL REACHED! */}
          <div
            style={{
              position: "absolute",
              left: "25.69%",
              top: "20.0%",
              transform: "translate(-50%, -50%)",
            }}
            className="pointer-events-none"
          >
            <motion.div
              style={{ y: yTarget }}
              className={`w-[112px] h-[112px] rounded-full border-2 transition-all duration-500 flex flex-col items-center justify-center p-2 text-center ${progress > 0.98
                ? "bg-lime text-black border-lime shadow-[0_0_35px_rgba(132,204,22,0.4)] scale-105"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 shadow-sm"
                }`}
            >
              <span className="text-[10px] font-black tracking-widest uppercase">Goal</span>
              <span className="text-[11px] font-black uppercase leading-tight">Reached!</span>
            </motion.div>
          </div>

          {/* Render Step Circles */}
          {steps.map((step, idx) => {
            const coords = desktopNodes[idx];
            const yTransform = parallaxTransforms[idx];
            const StepIcon = icons[idx];
            const isActive = progress > thresholds[idx];

            return (
              <div
                key={step.id}
                style={{
                  position: "absolute",
                  left: coords.left,
                  top: coords.top,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <motion.div
                  style={{
                    y: yTransform
                  }}
                  className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer group shadow-md ${isActive
                    ? "bg-zinc-900 dark:bg-zinc-900 border-lime text-white shadow-[0_0_20px_rgba(132,204,22,0.25)]"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-650"
                    }`}
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  {/* Number overlay */}
                  <div className={`absolute -top-1 -left-1 w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-black transition-all duration-300 ${isActive
                    ? "bg-lime text-black border-lime"
                    : "bg-white dark:bg-zinc-950 text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800"
                    }`}>
                    {step.stepNumber}
                  </div>

                  {/* Step Icon */}
                  <StepIcon className={`w-8 h-8 transition-all duration-300 ${isActive ? "text-lime scale-105" : "text-zinc-350 dark:text-zinc-700"
                    }`} />
                </motion.div>
              </div>
            );
          })}

          {/* Render Step Descriptions */}
          {steps.map((step, idx) => {
            const pos = textPositions[idx];
            const yTransform = parallaxTransforms[idx];
            const isActive = progress > thresholds[idx];

            return (
              <div
                key={`text-${step.id}`}
                style={{
                  position: "absolute",
                  left: pos.left,
                  top: pos.top,
                  transform: pos.isLeft ? "translate(-100%, -50%)" : "translateY(-50%)",
                }}
              >
                <motion.div
                  style={{
                    y: yTransform,
                  }}
                  className="space-y-1 select-none pointer-events-none transition-all duration-300 w-[240px]"
                >
                  <h4
                    className={`text-sm font-black uppercase tracking-wider leading-tight transition-colors duration-300 ${isActive ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-600"
                      }`}
                    style={{ textAlign: pos.textAlign }}
                  >
                    {step.title}
                  </h4>
                  <p
                    className={`text-[11px] font-medium leading-relaxed transition-colors duration-300 ${isActive ? "text-zinc-655 dark:text-zinc-400" : "text-zinc-400/80 dark:text-zinc-700"
                      }`}
                    style={{ textAlign: pos.textAlign }}
                  >
                    {step.description}
                  </p>
                </motion.div>
              </div>
            );
          })}

        </div>

        {/* ─── MOBILE RESPONSIVE LAYOUT (Timeline card view) ─── */}
        <div className="block lg:hidden w-full max-w-xl mx-auto space-y-6 px-4">
          {steps.map((step, idx) => {
            const isEven = idx % 2 === 0;
            const StepIcon = icons[idx];
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={`flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md ${isEven ? "" : "sm:flex-row-reverse"}`}
              >
                {/* Circular step badge */}
                <div className="shrink-0 w-16 h-16 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-2xl shadow-md border border-zinc-800 dark:border-zinc-250 relative">
                  <span className="text-zinc-400 dark:text-zinc-550 absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center text-[10px] font-black border border-zinc-250 dark:border-zinc-800 shadow-xs">
                    {step.stepNumber}
                  </span>
                  <StepIcon className="w-7 h-7 text-lime" />
                </div>

                {/* Text content */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <h4 className="text-lg font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                    {step.title}
                  </h4>
                  <p className="text-sm text-zinc-550 dark:text-zinc-400 font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Drawing2DToBOQPage() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const startScrollYRef = useRef(0);

  useEffect(() => {
    if (isDemoMode) {
      startScrollYRef.current = window.scrollY;
    }
  }, [isDemoMode]);

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

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = Math.abs(currentScrollY - startScrollYRef.current);
      if (diff > 80) {
        exitDemoMode();
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (videoContainerRef.current && videoContainerRef.current.contains(e.target as Node)) {
        return;
      }
      exitDemoMode();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitDemoMode();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    const clickTimeout = setTimeout(() => {
      window.addEventListener("click", handleClick);
    }, 150);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(clickTimeout);
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
                  <div className="lg:col-span-7 space-y-8">
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="space-y-6"
                    >
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
                        <span className="text-zinc-950 dark:text-white font-bold">No 3D model required.</span>
                      </motion.p>

                      <motion.p
                        variants={fadeInUp}
                        className="text-sm sm:text-base text-zinc-655 dark:text-zinc-400 leading-relaxed max-w-xl"
                      >
                        Not every project starts with a BIM model. When you work from 2D structural plans, you still need precise quantities. Our AI vision engine reads PDF drawings, extracts dimensions, and automatically maps elements to priced BOQ formats.
                      </motion.p>

                      <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDemoMode(true);
                          }}
                          variant="outline"
                          size="lg"
                          className="rounded-2xl px-8 py-7 font-bold shadow-sm cursor-pointer border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 transition-transform hover:scale-105"
                        >
                          <Play className="w-4 h-4 mr-2 text-zinc-900 dark:text-zinc-300 fill-zinc-900 dark:fill-zinc-300" />
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
                                    <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
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
                </motion.div>
              ) : (
                <motion.div
                  ref={videoContainerRef}
                  key="hero-video"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="w-full max-w-5xl mx-auto aspect-video rounded-[2rem] overflow-hidden bg-zinc-900 shadow-2xl border border-zinc-200/50 dark:border-zinc-850/50 relative"
                  onClick={(e) => {
                    // Prevent propagation to allow player controls interaction
                    e.stopPropagation();
                  }}
                >
                  <video
                    src="/videos/MVP_Vid_1_202606081311.mp4"
                    autoPlay
                    controls
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* ─── Problem Section ─── */}
      <section ref={problemRef} className="bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isProblemInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-5 space-y-4"
          >
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
              The Challenge
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Not every project is BIM
            </h2>
            <div className="w-16 h-1 bg-lime rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isProblemInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-7 text-zinc-655 dark:text-zinc-400 text-base sm:text-lg leading-relaxed space-y-6 font-medium"
          >
            <p>
              Not every project comes with a 3D Revit model. Early-stage projects have 2D structural drawings. Non-BIM firms submit 2D PDFs. Budget-constrained projects use traditional 2D drawings.
            </p>
            <p>
              But your estimators still need to produce a BOQ from that drawing — which means manually measuring every element by hand, identifying items from line work, and building the estimate in Excel. It is error-prone and takes days.
            </p>
            <p className="font-bold text-zinc-900 dark:text-zinc-100">
              2D Drawing to BOQ extends the automation benefits of BIM-based BOQ tools to projects that are entirely 2D.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Solution Section - Snap Carousel ─── */}
      <section ref={solutionRef} className="relative py-24 px-6 bg-white dark:bg-zinc-950 overflow-visible">
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
            <CircularProcessFlow steps={carouselSteps} />
          </div>
        </div>
      </section>

      {/* ─── Integration Section - Bento Grid ─── */}
      <section ref={workflowRef} className="bg-zinc-50 dark:bg-zinc-900/40 text-zinc-900 dark:text-white border-t border-zinc-200/50 dark:border-zinc-800/50 py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-10">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block">
                Workflow Hook
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] uppercase">
                Fits into your workflow
              </h2>
              <p className="text-zinc-650 dark:text-zinc-400 text-base sm:text-lg font-medium">
                Integrates seamlessly from raw structural drawings to professional Quantity Surveying tools.
              </p>
            </div>

            <div className="flex md:justify-end items-center shrink-0">
              <Button
                asChild
                size="lg"
                className="rounded-xl px-6 py-5 font-bold shadow-md bg-lime text-black hover:bg-lime/90 border-0 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                  Book a Demo →
                </a>
              </Button>
            </div>
          </div>

          {/* Three-card mockup row */}
          <div className="flex flex-col xl:flex-row gap-8 items-stretch pt-4 overflow-x-auto pb-4 scrollbar-none">
            
            {/* Card 1: Input (Upload 2D Plan) */}
            <div className="flex-1 min-w-[280px] bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-900 rounded-[2rem] p-8 flex flex-col justify-between shadow-sm relative group hover:shadow-md transition-all duration-300">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-amber-600 dark:text-lime uppercase tracking-widest block">01 / SOURCE INTAKE</span>
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Upload Drawings</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                  Support for PDF sheets, DWG plans, or blueprints. The AI instantly parses visual layouts.
                </p>
              </div>
              
              <div className="mt-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 bg-zinc-50/50 dark:bg-zinc-950/40 flex flex-col items-center justify-center text-center py-10">
                <FileText className="w-12 h-12 text-zinc-400 dark:text-zinc-700 mb-2" />
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-400">drop_plan_sheets.pdf</span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">take-off processing...</span>
              </div>
            </div>

            {/* Card 2: Wide Interactive Canvas */}
            <div className="flex-[2] min-w-[320px] lg:min-w-[580px] bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-900 rounded-[2rem] p-8 flex flex-col justify-between shadow-md relative group">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-600 dark:text-lime uppercase tracking-widest block">02 / DATA LINKING</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wider">AI Takeoff Engaged</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">Takeoff Workspace</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                  Automatically pairs recognized layout lines with cost schedule taking. Select elements to trace them in real-time.
                </p>
              </div>

              {/* Web UI mockup */}
              <div className="w-full bg-[#FFFBF6] dark:bg-zinc-950 border border-amber-100/60 dark:border-zinc-900 rounded-2xl overflow-hidden shadow-inner flex flex-col min-h-[300px]">
                {/* Header bar */}
                <div className="bg-[#FFF4E8] dark:bg-zinc-900/60 px-4 py-3 border-b border-amber-100/50 dark:border-zinc-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-900 dark:text-zinc-300 ml-2">takeoff_sheet_s02.pdf</span>
                  </div>
                  {/* Initials indicators (Bespoke initials instead of photos) */}
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-amber-500 border border-white text-white flex items-center justify-center text-[9px] font-black shadow-xs">AI</div>
                    <div className="w-6 h-6 rounded-full bg-zinc-900 border border-white text-white flex items-center justify-center text-[9px] font-black shadow-xs">QS</div>
                    <div className="w-6 h-6 rounded-full bg-lime border border-white text-black flex items-center justify-center text-[9px] font-black shadow-xs">ENG</div>
                    <button className="bg-amber-600 text-white rounded-lg px-2.5 py-1 text-[9px] font-bold ml-2 shadow-xs cursor-pointer hover:bg-amber-700 transition-colors">Share</button>
                  </div>
                </div>

                {/* Workspace grid body */}
                <div className="flex-1 p-4 relative flex flex-col md:flex-row gap-4 items-stretch min-h-[240px] bg-[#FFFDFC] dark:bg-zinc-950/20">
                  {/* Schematic outline view */}
                  <div className="flex-1 bg-white dark:bg-zinc-900 border border-amber-100/40 dark:border-zinc-800 rounded-xl p-3 relative overflow-hidden flex flex-col justify-center min-h-[160px] shadow-xs">
                    {/* Grid pattern background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(217,119,6,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(217,119,6,0.02)_1px,transparent_1px)] bg-[size:16px_16px]" />
                    
                    {/* Blueprint SVG graphics */}
                    <svg className="absolute inset-0 w-full h-full stroke-zinc-300 dark:stroke-zinc-800 fill-none" viewBox="0 0 300 200">
                      {/* Layout columns grids */}
                      <line x1="40" y1="20" x2="40" y2="180" strokeDasharray="3 3" />
                      <line x1="140" y1="20" x2="140" y2="180" strokeDasharray="3 3" />
                      <line x1="240" y1="20" x2="240" y2="180" strokeDasharray="3 3" />
                      <line x1="20" y1="50" x2="280" y2="50" strokeDasharray="3 3" />
                      <line x1="20" y1="150" x2="280" y2="150" strokeDasharray="3 3" />

                      {/* Outline elements */}
                      <rect x="25" y="35" width="30" height="30" className="stroke-zinc-400 dark:stroke-zinc-700 fill-zinc-50 dark:fill-zinc-900/50" strokeWidth="1.5" />
                      <rect x="125" y="35" width="30" height="30" className="stroke-amber-500 fill-amber-50/20" strokeWidth="2" />
                      <rect x="225" y="35" width="30" height="30" className="stroke-zinc-400 dark:stroke-zinc-700 fill-zinc-50 dark:fill-zinc-900/50" strokeWidth="1.5" />

                      <rect x="25" y="135" width="30" height="30" className="stroke-zinc-400 dark:stroke-zinc-700 fill-zinc-50 dark:fill-zinc-900/50" strokeWidth="1.5" />
                      <rect x="125" y="135" width="30" height="30" className="stroke-zinc-400 dark:stroke-zinc-700 fill-zinc-50 dark:fill-zinc-900/50" strokeWidth="1.5" />
                      <rect x="225" y="135" width="30" height="30" className="stroke-zinc-400 dark:stroke-zinc-700 fill-zinc-50 dark:fill-zinc-900/50" strokeWidth="1.5" />

                      {/* Dimension label */}
                      <path d="M 55,50 L 125,50" className="stroke-amber-500" strokeWidth="1" />
                      <path d="M 58,46 L 55,50 L 58,54 M 122,46 L 125,50 L 122,54" className="stroke-amber-500" strokeWidth="1" />
                    </svg>
                    
                    <div className="absolute top-[32px] left-[70px] bg-amber-500 text-white font-mono text-[8px] px-1 rounded shadow-xs">5.40 m</div>
                    <div className="absolute top-[72px] left-[132px] bg-amber-100 dark:bg-zinc-850 text-amber-800 dark:text-amber-400 font-bold text-[8px] px-1.5 py-0.5 rounded border border-amber-200/50">C2 Concrete Column</div>
                  </div>

                  {/* Overlaid Data Table */}
                  <div className="w-full md:w-[200px] bg-white dark:bg-zinc-900 border border-amber-200/50 dark:border-zinc-800 rounded-xl p-3 shadow-md flex flex-col justify-between shrink-0">
                    <div>
                      <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-850 pb-2 mb-2">
                        <span className="text-[9px] font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Data Takeoff</span>
                        <span className="text-[7px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Linked</span>
                      </div>
                      
                      <div className="space-y-1.5 text-[8.5px] font-semibold text-zinc-650 dark:text-zinc-400">
                        <div className="flex justify-between items-center bg-amber-50/50 dark:bg-zinc-800/50 p-2 rounded border border-amber-100/50 dark:border-zinc-800">
                          <span className="text-zinc-900 dark:text-white font-bold">Column C2</span>
                          <span className="text-amber-600 dark:text-amber-450 font-bold">3.8 m³</span>
                        </div>
                        <div className="flex justify-between items-center p-2">
                          <span>Slab S02</span>
                          <span className="text-zinc-800 dark:text-zinc-300 font-bold">45.0 m³</span>
                        </div>
                        <div className="flex justify-between items-center p-2">
                          <span>Wall W01</span>
                          <span className="text-zinc-800 dark:text-zinc-300 font-bold">112.5 m²</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2.5 border-t border-zinc-150 dark:border-zinc-850 mt-2.5 flex justify-between items-center text-[7.5px] text-zinc-450 dark:text-zinc-500 font-semibold">
                      <span>Takeoff validated</span>
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[7px] font-bold shadow-xs">✓</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Output (Excel & ACC Sync) */}
            <div className="flex-1 min-w-[280px] bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-900 rounded-[2rem] p-8 flex flex-col justify-between shadow-sm relative group hover:shadow-md transition-all duration-300">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-amber-600 dark:text-lime uppercase tracking-widest block">03 / EXPORT & SYNC</span>
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Excel & ERP Sync</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                  Export directly to Excel sheets, ERP solutions, or import into Autodesk Construction Cloud docs.
                </p>
              </div>
              
              <div className="mt-8 space-y-2">
                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-150/50 dark:border-zinc-850 p-3.5 rounded-2xl hover:border-zinc-250 transition-colors duration-300">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-xs">XLS</div>
                  <div className="text-left leading-tight">
                    <span className="text-[10px] font-bold text-zinc-900 dark:text-white block">Takeoff_BOQ.xlsx</span>
                    <span className="text-[8px] text-zinc-400 dark:text-zinc-500">Download Ready</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-150/50 dark:border-zinc-850 p-3.5 rounded-2xl hover:border-zinc-250 transition-colors duration-300">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 font-extrabold text-[8px]">ACC</div>
                  <div className="text-left leading-tight">
                    <span className="text-[10px] font-bold text-zinc-900 dark:text-white block">Autodesk Docs</span>
                    <span className="text-[8px] text-zinc-400 dark:text-zinc-500">Synced 1 min ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing & Quick Facts ─── */}
      <section ref={pricingRef} className="py-32 px-6 bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-200/50 dark:border-zinc-800/50">
        <div className="space-y-16 max-w-4xl mx-auto text-left">
          <div className="space-y-8">
            <div>

              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-955 dark:text-zinc-50 tracking-tight uppercase">Pricing &amp; Availability</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="p-8 bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-sm hover:shadow-xl transition-shadow duration-300">
                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block">Custom Project Pricing</span>
                <p className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-550">$1,000–$3,000</p>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">Per drawing set, varying by complexity.</p>
              </div>
              <div className="p-8 bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-sm hover:shadow-xl transition-shadow duration-300">
                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block">Enterprise</span>
                <p className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-550">Annual License</p>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">Available on request for high-volume firms.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16 border-t border-zinc-200 dark:border-zinc-800">
            {/* Quick Facts Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-8 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-4 uppercase">Quick Facts</h3>
                <div className="space-y-5 pt-4">
                  <div className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 gap-4">
                    <span className="text-zinc-500 font-semibold shrink-0">Stage</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">Tendering</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 gap-4">
                    <span className="text-zinc-500 font-semibold shrink-0">Best For</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-right">QS firms, contractors, consultancies</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 gap-4">
                    <span className="text-zinc-500 font-semibold shrink-0">Regions</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-right">Middle East, Sri Lanka, Australia</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 gap-4">
                    <span className="text-zinc-500 font-semibold shrink-0">Implementation</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">2–3 weeks per project</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 gap-4">
                    <span className="text-zinc-500 font-semibold shrink-0">Status</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">Custom / R&D</span>
                  </div>
                </div>
              </div>

              <Button
                asChild
                className="w-full rounded-2xl py-7 font-bold shadow-xl border-0 bg-lime text-black hover:bg-lime/90 cursor-pointer mt-8"
              >
                <a href="/pricing" target="_blank" rel="noopener noreferrer">
                  Buy Products <ArrowUpRight />
                </a>
              </Button>
            </motion.div>

            {/* Related Products Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550 mb-6 font-mono">Related Products</h4>
                <ul className="space-y-4 text-sm">
                  <li>
                    <Link href="/learnmore/revit-to-boq" className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-zinc-650 dark:hover:text-zinc-300 hover:underline transition-colors flex items-center justify-between">
                      <span>Revit to BOQ</span>
                      <span className="text-zinc-405 dark:text-zinc-500">3D alternative</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/learnmore/auto-conversion-2d-to-3d" className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-zinc-650 dark:hover:text-zinc-300 hover:underline transition-colors flex items-center justify-between">
                      <span>Auto Conversion 2D to 3D</span>
                      <span className="text-zinc-405 dark:text-zinc-500">Convert to 3D first</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/learnmore/auto-reinforcement" className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-zinc-650 dark:hover:text-zinc-300 hover:underline transition-colors flex items-center justify-between">
                      <span>Auto Reinforcement Plugin</span>
                      <span className="text-zinc-405 dark:text-zinc-500">Rebar scheduling</span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="pt-4 mt-4 border-t border-zinc-150 dark:border-zinc-800">
                <Link href="/learnmore" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  View full suite <ChevronRight className="w-3.5 h-3.5" />
                </Link>
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
              className="rounded-2xl px-8 py-6 font-bold shadow-xl border-0 bg-lime text-black hover:bg-lime/90 cursor-pointer"
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

