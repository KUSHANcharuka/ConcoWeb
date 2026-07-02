"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer";
import {
  ArrowLeft,
  Play,
  Calendar,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  MessageSquare,
  Box,
  Bot,
  BarChart3,
  FileText,
  Globe,
  Users,
  Zap,
  Download,
  PencilRuler,
  Calculator,
  Sparkles,
  Plus,
  Minus,
  Maximize,
  Minimize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComparisonGrid from "@/components/learnmore/comparison-grid";


const carouselSteps = [
  {
    id: "step1",
    stepNumber: "01",
    title: "Input Prompt",
    description: "Provide a natural language prompt, upload a hand-drawn sketch, or reference a 2D drawing right inside Revit.",
    image: "/images/2d_structural_drawing.png",
  },
  {
    id: "step2",
    stepNumber: "02",
    title: "AI Analysis",
    description: "The AI parser analyzes the active Revit session coordinates, workspace parameters, and architectural context.",
    image: "/images/cv_blueprint_analysis.png",
  },
  {
    id: "step3",
    stepNumber: "03",
    title: "Family Matching",
    description: "WordToBIM matches the geometry specifications to your firm's specific Revit family libraries and design standards.",
    image: "/images/2d_structural_drawing.png",
  },
  {
    id: "step4",
    stepNumber: "04",
    title: "Instant Modeling",
    description: "Generates fully coordinated, high-fidelity 3D Revit geometry in real time without any manual drafting.",
    image: "/images/3d_revit_model.png",
  },
  {
    id: "step5",
    stepNumber: "05",
    title: "Validation",
    description: "Performs instant building code compliance checks and automatically updates project schedule sheets.",
    image: "/images/cv_blueprint_analysis.png",
  },
  {
    id: "step6",
    stepNumber: "06",
    title: "Seamless Handoff",
    description: "Directly export structural Revit models into estimation software like Revit to BOQ or MeasureonAir.",
    image: "/images/3d_revit_model.png",
  },
];

interface Step {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  image: string;
}

function ParallaxProcessFlow({ steps }: { steps: Step[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax offsets for step circles (staggered rates & directions)
  const y1 = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y3 = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const y4 = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const y5 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const y6 = useTransform(scrollYProgress, [0, 1], [30, -30]);

  // Parallax offsets for background elements
  const bgY1 = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const bgY3 = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  const parallaxTransforms = [y1, y2, y3, y4, y5, y6];

  // Precise coordinates for 6 steps winding layout (in relative %)
  const desktopCoordinates = [
    { left: "8%", top: "22%" },
    { left: "36%", top: "10%" },
    { left: "54%", top: "34%" },
    { left: "76%", top: "12%" },
    { left: "74%", top: "54%" },
    { left: "42%", top: "66%" },
  ];

  return (
    <div 
      ref={containerRef} 
      className="relative w-full overflow-hidden py-24 bg-[#FAFAF8] dark:bg-zinc-950/20 border-y border-zinc-200 dark:border-zinc-800 select-none"
    >
      {/* Blueprint background grid pattern */}
      <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15] bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* ─── DESKTOP PARALLAX CANVAS ─── */}
      <div className="hidden lg:block relative w-full max-w-6xl mx-auto h-[820px]">
        
        {/* Background Floating Decorative Dashed Circle 1 */}
        <motion.div 
          style={{ y: bgY1 }}
          className="absolute top-[5%] left-[20%] w-[380px] h-[380px] rounded-full border border-dashed border-zinc-300/60 dark:border-zinc-800/40 pointer-events-none"
        />

        {/* Background Floating Decorative Dashed Circle 2 */}
        <motion.div 
          style={{ y: bgY2 }}
          className="absolute bottom-[8%] right-[15%] w-[280px] h-[280px] rounded-full border border-dashed border-zinc-200/80 dark:border-zinc-800/30 pointer-events-none"
        />

        {/* Floating background decorative details (dots & arrows) */}
        <motion.div style={{ y: bgY3 }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[18%] left-[28%] w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <div className="absolute bottom-[25%] right-[32%] w-4.5 h-4.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="absolute top-[55%] left-[12%] w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600" />
        </motion.div>

        {/* Connected Flow Paths (SVGs) */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none stroke-zinc-300 dark:stroke-zinc-800 fill-none" 
          viewBox="0 0 1152 820" 
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker 
              id="arrow" 
              viewBox="0 0 10 10" 
              refX="5" 
              refY="5" 
              markerWidth="6" 
              markerHeight="6" 
              orient="auto-start-reverse"
            >
              <path 
                d="M 2 2 L 8 5 L 2 8" 
                className="stroke-zinc-400 dark:stroke-zinc-600"
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none" 
              />
            </marker>
          </defs>

          {/* Connection 1 (Step 1 -> 2) */}
          <motion.path 
            d="M 207,295 Q 278,247 359,223" 
            markerEnd="url(#arrow)" 
            strokeWidth="2.5" 
            strokeDasharray="6 6"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            vectorEffect="non-scaling-stroke"
          />
          <motion.path 
            d="M 359,223 Q 440,198 530,197" 
            strokeWidth="2.5" 
            strokeDasharray="6 6"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeInOut" }}
            vectorEffect="non-scaling-stroke"
          />

          {/* Connection 2 (Step 2 -> 3) */}
          <motion.path 
            d="M 530,197 Q 590,223 642,273" 
            markerEnd="url(#arrow)" 
            strokeWidth="2.5" 
            strokeDasharray="6 6"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeInOut" }}
            vectorEffect="non-scaling-stroke"
          />
          <motion.path 
            d="M 642,273 Q 693,322 737,394" 
            strokeWidth="2.5" 
            strokeDasharray="6 6"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.6, ease: "easeInOut" }}
            vectorEffect="non-scaling-stroke"
          />

          {/* Connection 3 (Step 3 -> 4) */}
          <motion.path 
            d="M 737,394 Q 808,337 872,292" 
            markerEnd="url(#arrow)" 
            strokeWidth="2.5" 
            strokeDasharray="6 6"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.8, ease: "easeInOut" }}
            vectorEffect="non-scaling-stroke"
          />
          <motion.path 
            d="M 872,292 Q 935,246 990,213" 
            strokeWidth="2.5" 
            strokeDasharray="6 6"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 1.0, ease: "easeInOut" }}
            vectorEffect="non-scaling-stroke"
          />

          {/* Connection 4 (Step 4 -> 5) */}
          <motion.path 
            d="M 990,213 Q 1005,296 999,383" 
            markerEnd="url(#arrow)" 
            strokeWidth="2.5" 
            strokeDasharray="6 6"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 1.2, ease: "easeInOut" }}
            vectorEffect="non-scaling-stroke"
          />
          <motion.path 
            d="M 999,383 Q 993,469 967,558" 
            strokeWidth="2.5" 
            strokeDasharray="6 6"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 1.4, ease: "easeInOut" }}
            vectorEffect="non-scaling-stroke"
          />

          {/* Connection 5 (Step 5 -> 6) */}
          <motion.path 
            d="M 967,558 Q 873,619 781,643" 
            markerEnd="url(#arrow)" 
            strokeWidth="2.5" 
            strokeDasharray="6 6"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 1.6, ease: "easeInOut" }}
            vectorEffect="non-scaling-stroke"
          />
          <motion.path 
            d="M 781,643 Q 689,668 599,656" 
            strokeWidth="2.5" 
            strokeDasharray="6 6"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 1.8, ease: "easeInOut" }}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {steps.map((step, idx) => {
          const coords = desktopCoordinates[idx];
          const yTransform = parallaxTransforms[idx];
          
          return (
            <motion.div
              key={step.id}
              style={{ 
                left: coords.left, 
                top: coords.top,
                y: yTransform 
              }}
              className="absolute w-[230px] h-[230px] rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-[0_10px_35px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors duration-300 hover:border-zinc-900 dark:hover:border-zinc-100 group select-none"
              whileHover={{ scale: 1.05, rotate: 0.5 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
            >
              {/* Overlapping Step Number Badge (Black & White style) */}
              <div className="absolute top-2 left-2 -translate-x-4 -translate-y-4 w-12 h-12 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-lg shadow-lg border border-zinc-800 dark:border-zinc-200 group-hover:scale-110 transition-transform duration-300">
                {step.stepNumber}
              </div>

              {/* Step Title */}
              <h4 className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white mb-2 leading-snug">
                {step.title}
              </h4>

              {/* Step Description */}
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-[95%]">
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* ─── MOBILE RESPONSIVE LAYOUT (Timeline card view) ─── */}
      <div className="block lg:hidden space-y-6 px-4">
        {steps.map((step, idx) => {
          const isEven = idx % 2 === 0;
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
              <div className="shrink-0 w-16 h-16 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-2xl shadow-md border border-zinc-800 dark:border-zinc-200">
                {step.stepNumber}
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
  );
}

export default function WordToBIMPage() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoAreaRef = useRef<HTMLDivElement>(null);
  const [chatStep, setChatStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const demoSectionRef = useRef<HTMLDivElement>(null);

  // Auto-toggle Before/After every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev === "before" ? "after" : "before"));
    }, 3500);
    return () => clearInterval(timer);
  }, [autoToggleKey]);

  const handleTabClick = (tab: "before" | "after") => {
    setActiveTab(tab);
    setAutoToggleKey((k) => k + 1);
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoAreaRef.current?.requestFullscreen().catch((err) => {
        console.error("Error going fullscreen:", err);
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const scrollToDemo = useCallback(() => {
    demoSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  // Chat simulator messages
  const chatMessages = [
    {
      role: "user" as const,
      text: "A three-storey office building with a central atrium on a 15,000 sqm site in Dubai. Each floor is 5,000 sqm. Ground floor has restaurants and retail. Upper floors are open-plan offices.",
    },
    {
      role: "bot" as const,
      text: "✓ Generating 3D model...\n\n**Project Summary**\n• Site: 15,000 sqm, Dubai\n• Storeys: G+2 (3 total)\n• Total GFA: 15,000 sqm\n• Ground: Restaurant + Retail (5,000 sqm)\n• Floors 1–2: Open-plan offices (10,000 sqm)\n• Central atrium: 8m × 8m void through all levels\n\nModel is ready in the 3D viewport →",
    },
    {
      role: "user" as const,
      text: "Make the atrium taller and add a green roof.",
    },
    {
      role: "bot" as const,
      text: "✓ Atrium height increased to 14m. Green roof system (200mm substrate) added to Level 3 slab.\n\n**Updated schedules:**\n• Roof area: 4,800 sqm\n• Atrium glazing: 448 sqm\n• Total volume: 52,500 m³",
    },
  ];

  const runChatDemo = () => {
    setChatStep(0);
    setIsTyping(false);

    const showMessage = (index: number) => {
      if (index >= chatMessages.length) return;
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setChatStep(index + 1);
        if (index + 1 < chatMessages.length) {
          setTimeout(() => showMessage(index + 1), 1200);
        }
      }, 1200);
    };

    setTimeout(() => showMessage(0), 300);
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-lime/30 selection:text-black">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950 pt-32 pb-24">
        {/* Massive vibrant glowing mesh gradients */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-gradient-to-br from-lime/30 via-lime/20 to-transparent rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-bl from-zinc-500/30 via-zinc-400/20 to-transparent rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse" style={{ animationDuration: '12s' }} />
          <div className="absolute bottom-[-20%] left-[30%] w-[900px] h-[900px] bg-gradient-to-tr from-lime/20 via-zinc-300/10 to-transparent rounded-full blur-[130px] mix-blend-multiply dark:mix-blend-screen opacity-60" />
          <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/60 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full mb-12 flex justify-start"
          >
            <Link
              href="/learnmore"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-sm font-semibold text-zinc-650 hover:text-zinc-955 dark:text-zinc-405 dark:hover:text-white transition-all hover:bg-white/80 dark:hover:bg-black/80 hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Learn More
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center max-w-4xl mx-auto space-y-6 mb-16"
          >


            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.1] uppercase product-title-sweep">
              WordToBIM
            </h1>

            <p className="text-lg sm:text-xl text-zinc-950 dark:text-white font-bold leading-relaxed max-w-2xl mx-auto">
              Prompt your way through any stage of the model. From hand drawings to compliance-checked 3D.
            </p>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl mx-auto font-medium">
              WordToBIM is a Revit plugin that models elements from a text prompt, customised to your firm's own Revit family library and design conventions so every prompt resolves to your actual elements, not generic geometry. It handles hand-drawn sketch input, 2D to 3D conversion detailing, compliance checks against active planning codes, and schedule generation, all without leaving your Revit session. CAD experience recommended.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <Button
                asChild
                size="lg"
                className="rounded-2xl px-8 py-7 font-bold shadow-xl shadow-lime/20 cursor-pointer bg-lime text-black hover:bg-lime/90 border-0 transition-transform hover:scale-105"
              >
                <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                  Book a Demo
                </a>
              </Button>
              <Button
                onClick={scrollToDemo}
                size="lg"
                variant="outline"
                className="rounded-2xl px-8 py-7 font-bold shadow-sm cursor-pointer border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 transition-transform hover:scale-105"
              >
                <Play className="w-4 h-4 mr-2 text-zinc-900 dark:text-zinc-300 fill-zinc-900 dark:fill-zinc-300" />
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Central Floating Widget */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-3xl mx-auto relative group perspective-[1000px]"
          >
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl border border-white/50 dark:border-zinc-700/50 rounded-[2rem] p-8 shadow-2xl shadow-lime/10 dark:shadow-zinc-900/20"
            >
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-zinc-400 to-lime rounded-full blur-2xl opacity-50" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-lime to-zinc-500 rounded-full blur-2xl opacity-30" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-6">
                  <h3 className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">

                    Compare Workflows
                  </h3>
                  <div className="relative flex bg-zinc-100/80 dark:bg-zinc-950/80 backdrop-blur-sm p-1.5 rounded-xl w-52 justify-between border border-zinc-200/50 dark:border-zinc-800/50 shadow-inner">
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
                      layoutId="wtb-toggle-pill"
                      className="absolute top-1.5 bottom-1.5 bg-white dark:bg-zinc-800 shadow-md border border-zinc-200/50 dark:border-zinc-700/50 rounded-lg"
                      animate={{ left: activeTab === "before" ? 6 : 100, width: 96 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  </div>
                </div>

                <div className="min-h-[200px] flex flex-col justify-center">
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
                        <div className="inline-block px-3 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-900/30 text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                          BIM Software Today
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            "Requires CAD training to use effectively.",
                            "Drawing lines and clicking buttons manually.",
                            "Design intent filtered through software learning curve.",
                            "Architect ideas, software complexity."
                          ].map((item, i) => (
                            <li key={i} className="flex gap-3 text-zinc-600 dark:text-zinc-300 text-sm bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50">
                              <X className="w-5 h-5 text-zinc-500 shrink-0" />
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
                        <div className="inline-block px-3 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-900/30 text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                          WordToBIM
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            "Prompt an element and it is modelled instantly.",
                            "Upload a hand drawing and convert to 3D by prompt.",
                            "Run compliance checks without leaving Revit.",
                            "Schedules generated automatically as elements added."
                          ].map((item, i) => (
                            <li key={i} className="flex gap-3 text-zinc-600 dark:text-zinc-300 text-sm bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50">
                              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
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
        </div>
      </section>

      {/* ─── Video Showcase Section ─── */}
      <section ref={demoSectionRef} className="py-24 px-6 bg-zinc-950 text-white relative overflow-hidden border-y border-zinc-900">
        {/* Soft yellow glow effect */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-lime/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

          {/* Left Column: Stacked High-Impact Typography */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[0.95] uppercase">
              We <br />
              design <br />
              <span className="text-grey-900 dark:text-white">BIM.</span>
            </h2>
            <div className="h-[2px] bg-zinc-800 w-32 my-2" />
            <p className="text-zinc-400 text-sm tracking-wider uppercase font-semibold">
              AI-Powered Revit Plugin. WordToBIM Engine.
            </p>
          </div>

          {/* Right Column: Premium Mockup Player */}
          <div className="lg:col-span-7 w-full">
            <div
              ref={videoAreaRef}
              onDoubleClick={toggleFullscreen}
              className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900 group cursor-pointer select-none"
            >
              {/* Decorative yellow glow inside the border on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-lime/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]" />

              <div className="relative rounded-[2rem] overflow-hidden bg-black aspect-video flex items-center justify-center">
                <video
                  ref={videoRef}
                  src="/videos/WordtoBIM/word2bim_final_product_video-h264.mp4"
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

      {/* ─── Problem Section ─── */}
      <section className="bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
              The Friction
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              The modeller's time goes on repetitive input, not on detailing
            </h2>
            <div className="w-16 h-1 bg-lime rounded-full" />
          </div>
          <div className="lg:col-span-7 text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed space-y-6">
            <p>
              Modellers spend a disproportionate share of their time on manual element input: drawing geometry, placing families, entering parameters, cross-checking planning codes in a separate tab, and rebuilding elements that came in from a 2D drawing or a hand sketch.
            </p>
            <p>
              WordToBIM puts all of that inside a prompt. Describe the element, the geometry, or the compliance check you need, and it is done inside Revit using your firm's own families. The detailing, coordination, and judgment stay with the modeller. The repetitive input does not.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Bento Grid Capabilities Section ─── */}
      <section className="py-32 px-6 bg-[#FAFAF8] dark:bg-zinc-950 relative overflow-hidden">
        {/* Soft floating background blobs for glassmorphism */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-lime/10 dark:bg-zinc-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-lime/10 dark:bg-zinc-400/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              But Why WordToBIM ?
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
              Explore the incredible advantages of generating precise 3D Revit models directly from natural language prompts, bypassing manual drafting.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(280px,auto)]">

            {/* Large Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="md:col-span-8 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white dark:border-zinc-800 rounded-[2rem] p-8 md:p-10 shadow-xl shadow-zinc-200/50 dark:shadow-black/50 flex flex-col justify-between group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-lime/10 dark:bg-lime/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 bg-lime/20 dark:bg-zinc-800 rounded-2xl flex items-center justify-center">
                  <Bot className="w-7 h-7 text-zinc-900 dark:text-zinc-300" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Open WordToBIM inside Revit</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
                    The plugin runs as a panel inside your active Revit session. No separate application to open. Prompt an element and it is modelled instantly. WordToBIM already knows your family library and naming conventions, so the element placed is yours, not a default.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex gap-2">
                <span className="px-3 py-1 bg-white dark:bg-zinc-800 rounded-full text-xs font-bold text-zinc-500 shadow-sm border border-zinc-100 dark:border-zinc-700">Native Plugin</span>
                <span className="px-3 py-1 bg-white dark:bg-zinc-800 rounded-full text-xs font-bold text-zinc-500 shadow-sm border border-zinc-100 dark:border-zinc-700">Instant Gen</span>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="md:col-span-4 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white dark:border-zinc-800 rounded-[2rem] p-8 shadow-xl shadow-zinc-200/50 dark:shadow-black/50 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-zinc-400/10 dark:bg-zinc-500/5 rounded-full blur-[60px] -mr-10 -mb-10 pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 bg-zinc-200 dark:bg-zinc-800 rounded-2xl flex items-center justify-center">
                  <Globe className="w-7 h-7 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Compliance checks by prompt</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    Type the check and get a pass or fail against the active planning code for your jurisdiction, with clause reference. Covers UAE, Sri Lanka, KSA, UK, and Australia.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="md:col-span-4 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white dark:border-zinc-800 rounded-[2rem] p-8 shadow-xl shadow-zinc-200/50 dark:shadow-black/50 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-48 h-48 bg-lime/10 dark:bg-lime/5 rounded-full blur-[60px] -ml-10 -mt-10 pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 bg-lime/20 dark:bg-zinc-800 rounded-2xl flex items-center justify-center">
                  <PencilRuler className="w-7 h-7 text-zinc-900 dark:text-zinc-300" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Hand drawing to element</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    Upload a photo or scan of a hand-drawn sketch. WordToBIM interprets the geometry and models the elements into your Revit session.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Large Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="md:col-span-8 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white dark:border-zinc-800 rounded-[2rem] p-8 md:p-10 shadow-xl shadow-zinc-200/50 dark:shadow-black/50 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-zinc-300/10 dark:bg-zinc-400/5 rounded-full blur-[80px] -ml-32 -mb-20 pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 bg-zinc-200 dark:bg-zinc-800 rounded-2xl flex items-center justify-center">
                  <Box className="w-7 h-7 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Refining by follow-up prompt</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
                    "Move it 500mm north." "Change the slab thickness to 250mm." The model updates in Revit in real time. WordToBIM is trained on your Revit family library, naming conventions, and design standards before deployment so it perfectly fits your pipeline.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-300 shadow-sm border border-zinc-100 dark:border-zinc-700">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> 2D to 3D detailing
                </span>
                <span className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-300 shadow-sm border border-zinc-100 dark:border-zinc-700">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Auto Schedules
                </span>
                <span className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-300 shadow-sm border border-zinc-100 dark:border-zinc-700">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Custom Training
                </span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── Workflow / Integration Section ─── */}
      <section className="bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">

          {/* Header Layout (Reference Image Style) */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-zinc-850 pb-10">
            <div className="space-y-4 max-w-2xl">

              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.1] uppercase">
                Start simple. <br className="hidden sm:inline" />
                Scale when you're ready
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg font-medium">
                From a single text prompt to a complete Revit model workflow, at your own pace.
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

          {/* Bento Grid (Reference Image Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">

            {/* Left Column Tall Card */}
            <div className="lg:row-span-2 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-850 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-300 shadow-sm">
              <div className="space-y-4">
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block">Input Options</span>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Every tool, ready to go</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                  Text prompt, hand-drawn sketch (photo/scan), or 2D drawing reference. No complex setup. Open what you need, generate what you want.
                </p>
              </div>

              {/* Tab Selector & input preview mockup */}
              <div className="mt-10 bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-900 rounded-2xl p-4 shadow-sm space-y-4">
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[9px] font-extrabold uppercase tracking-wider">
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-900/60 rounded-xl p-3 border border-zinc-100 dark:border-zinc-800/80 space-y-2">
                  <div className="flex items-center gap-2">
                  </div>

                </div>
              </div>
            </div>

            {/* Right Column Wide Card */}
            <div className="lg:col-span-2 bg-zinc-950 text-white border border-zinc-900 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row justify-between gap-8 overflow-hidden relative group shadow-xl">
              <div className="flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-[9px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest block">AI Translation Engine</span>
                  <h3 className="text-2xl font-bold tracking-tight text-white leading-tight">Your entire modeling process on one connected AI canvas</h3>
                  <p className="text-zinc-450 text-sm leading-relaxed">
                    Our core AI translation engine connects directly to your active Revit model, creating clean native elements in real time.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-lime animate-ping" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-650 dark:text-zinc-400">Active Revit Native Bridge</span>
                </div>
              </div>

              {/* Graphical flowchart mockup */}
              <div className="flex-1 bg-zinc-900/40 border border-zinc-905 rounded-2xl p-6 min-h-[190px] relative overflow-hidden flex flex-col justify-center shadow-inner">
                {/* Grid canvas background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--color-lime-rgb,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--color-lime-rgb,0.02)_1px,transparent_1px)] bg-[size:14px_20px]" />

                {/* Connected flow path SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 30,120 Q 90,60 160,105 T 280,45" fill="none" stroke="var(--color-lime)" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-30" />
                  <path d="M 30,120 Q 90,60 160,105 T 280,45" fill="none" stroke="url(#lime-flow)" strokeWidth="2.5" />
                  <defs>
                    <linearGradient id="lime-flow" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--color-lime)" stopOpacity="0.05" />
                      <stop offset="60%" stopColor="var(--color-lime)" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="var(--color-lime)" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Floating Mockup Nodes */}
                <div className="absolute top-[32px] right-[24px] z-10 bg-zinc-950/90 border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                  <div className="w-6 h-6 rounded-md overflow-hidden bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-800">
                    <img src="/images/3d_revit_model.png" className="object-cover w-full h-full" />
                  </div>
                  <div className="text-left leading-none">
                    <span className="text-[8px] font-bold text-white block">Revit 3D</span>
                    <span className="text-[6px] text-zinc-950 dark:text-white font-black uppercase tracking-wider">Modelled</span>
                  </div>
                </div>

                <div className="absolute bottom-[24px] left-[20px] z-10 bg-zinc-950/90 border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                  <span className="text-[9px] font-bold text-zinc-300">Prompt</span>
                </div>

                {/* Collaborative Cursors (yellow active style) */}
                <div className="absolute bottom-[48px] right-[88px] z-20 flex items-center gap-1 bg-lime text-black px-2 py-0.5 rounded-md text-[8px] font-extrabold tracking-wider shadow-md">
                  <svg className="w-2 h-2 fill-black" viewBox="0 0 24 24">
                    <path d="M7 2l12 11.2-5.8.8 3.8 6.5-2.2 1.3-3.8-6.5-4 4.7V2z" />
                  </svg>
                  AI Engine
                </div>

                <div className="absolute top-[52px] left-[80px] z-20 flex items-center gap-1 bg-zinc-800 text-white px-2 py-0.5 rounded-md text-[8px] font-bold tracking-wider shadow-md border border-zinc-700">
                  <svg className="w-2 h-2 fill-white" viewBox="0 0 24 24">
                    <path d="M7 2l12 11.2-5.8.8 3.8 6.5-2.2 1.3-3.8-6.5-4 4.7V2z" />
                  </svg>
                  Modeller
                </div>
              </div>
            </div>

            {/* Bottom Left Card */}
            <div className="bg-[#12130e] text-white border border-lime/15 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-lime/30 transition-all duration-300 shadow-md">
              <div className="space-y-4">
                <span className="text-[9px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest block">Autodesk Integration</span>
                <h3 className="text-xl font-bold tracking-tight text-white leading-tight">One place, whole team</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Sync models directly into Autodesk Construction Cloud or local Revit files, maintaining firm standards.
                </p>
              </div>

            </div>

            {/* Bottom Right Card */}
            <div className="bg-[#0f1115] text-white border border-zinc-900 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-zinc-800 transition-all duration-300 shadow-md">
              <div className="space-y-4">
                <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block">Handoff Workflows</span>
                <h3 className="text-xl font-bold tracking-tight text-white leading-tight">Workflow in one click</h3>
                <p className="text-zinc-450 text-sm leading-relaxed">
                  Export structure models directly to estimation dashboards like Revit to BOQ or onsite in MeasureonAir.
                </p>
              </div>

            </div>

          </div>
          {/* Workflow Steps Title & Tagline */}
          <div className="text-center space-y-3 pt-16">
            <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
              WordToBIM Steps
            </h3>
            <p className="text-zinc-550 dark:text-zinc-400 text-sm sm:text-base font-medium max-w-xl mx-auto">
              From natural language prompt to coordinated 3D Revit model in six automated stages.
            </p>
          </div>

          {/* Workflow Steps - Custom Parallax Process Flow */}
          <div className="w-full">
            <ParallaxProcessFlow steps={carouselSteps} />
          </div>
        </div>
      </section>

      {/* ─── Pricing & Quick Facts Section ─── */}
      <section className="py-24 px-6 bg-[#FAFAF8] dark:bg-zinc-955/20">
        <div className="space-y-16 max-w-4xl mx-auto">
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block mb-2">Deployment</span>
              <h2 className="text-3xl font-bold text-zinc-955 dark:text-zinc-50 uppercase">Pricing &amp; Availability</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-xs">
                <span className="text-xs text-zinc-455 font-bold uppercase tracking-widest">Company Subscription</span>
                <p className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">$100<span className="text-sm font-normal text-zinc-455">/month</span></p>
                <p className="text-xs text-zinc-500">Unlimited seats across your firm. Includes full plugin access, hand sketch input, compliance checks, 2D detailing prompts, schedule generation, and your firm-specific family library configuration.</p>
              </div>
              <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-xs">
                <span className="text-xs text-zinc-455 font-bold uppercase tracking-widest">One-Off Licence</span>
                <p className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">$4,800</p>
                <p className="text-xs text-zinc-500">Single purchase covering full deployment, firm-specific Revit family training, planning code integration, and design standard configuration. Ongoing maintenance and updates at $100/month after the first year.</p>
              </div>
              <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-xs">
                <span className="text-xs text-zinc-455 font-bold uppercase tracking-widest">Multi-Firm / Enterprise</span>
                <p className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Custom</p>
                <p className="text-xs text-zinc-500">Custom pricing for practices with multiple offices or firms that want to white-label or resell WordToBIM to their clients.</p>
              </div>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4 text-center italic">
              Not sure which to choose? Firms with more than five active modellers typically find the one-off licence pays back within the first year.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16 border-t border-zinc-200 dark:border-zinc-800">
            {/* Quick Facts Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-8 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-xl border-b border-zinc-100 dark:border-zinc-800 pb-4 text-zinc-900 dark:text-white">Quick Facts</h3>
                <div className="space-y-5 pt-4">
                  {[
                    { label: "Stage", value: "Design" },
                    { label: "Best For", value: "BIM modellers and architects at firms customised with their own Revit family library and design standards" },
                    { label: "Regions", value: "Universal" },
                    { label: "Time to Implement", value: "1 week + custom training" },
                    { label: "Pricing", value: "USD 100/month company subscription, or USD 4,800 one-off plus USD 100/month maintenance" },
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
                className="w-full rounded-2xl py-7 font-bold shadow-lg bg-lime text-black hover:bg-lime/90 cursor-pointer border-0 mt-8"
              >
                <a href="/#">
                  Buy Products →
                </a>
              </Button>
            </motion.div>

            {/* Related Products Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-6">Related Products</h4>
                <ul className="space-y-4 text-sm">
                  {[
                    { href: "/learnmore/auto-conversion-2d-to-3d", label: "Auto Conversion 2D to 3D", tag: "Alternative" },
                    { href: "/learnmore/revit-to-boq", label: "Revit to BOQ", tag: "Next stage" },
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

      {/* ─── Comparison Section ─── */}
      <ComparisonGrid
        sectionTitle="Why choose WordToBIM"
        card1={{
          title: "Traditional BIM",
          subtitle: "Traditional Workflow",
          features: [
            "Requires CAD training to use",
            "Slow concept iteration",
            "Design intent filtered through software",
            "Not designed for conversation",
          ],
          metric: { value: "WEEKS", label: "TIMELINE" },
          button: { text: "Traditional Route", href: "/#" },
        }}
        card2={{
          title: "WordToBIM",
          subtitle: "WordToBIM Workflow",
          features: [
            "Prompt an element and it is modelled in Revit instantly using your firm's family library.",
            "Fast iteration by prompt, using your firm's own families",
            "Prompt > your firm's element placed in Revit with your default parameters",
            "Built for modellers who want to work faster, customised to your practice",
          ],
          metric: { value: "SECONDS", label: "GEN TIME" },
          button: { text: "Book A Demo", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
        }}
        card3={{
          title: "Other Tools",
          subtitle: "Generic AI",
          features: [
            "Focus on optimisation, not design intent",
            "Require technical briefing documents",
            "Output is generic geometry that needs remapping to your family library",
            { text: "WordToBIM places your elements directly into Revit, other tools give you geometry you still have to remap", type: "x" },
          ],
          metric: { value: "GENERAL AI" },
          button: { text: "Other Tools", href: "#" },
        }}
      />

      {/* ─── FAQ Section ─── */}
      <section className="py-32 px-6 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        {/* Soft floating background blobs for glassmorphism */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-lime/10 dark:bg-zinc-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-lime/10 dark:bg-zinc-400/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest block">
              Questions
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Frequently Asked Questions!
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Can non-architects use this?",
                a: "Yes. Anyone can describe a building, architects, clients, project managers, even AI agents describing building requirements. No CAD training needed.",
              },
              {
                q: "Does it handle complex geometry?",
                a: "Simple-to-moderate geometry works well (boxes, slabs, extrusions, offsets). Very complex curved or freeform geometry is planned but not yet in production.",
              },
              {
                q: "Can we integrate planning data for our specific market?",
                a: "Yes. Custom markets available at USD 2,000–4,000 per region. We currently have planning integrations for UAE, UK, Australia, Sri Lanka, and KSA.",
              },
              {
                q: "What if we want to refine the model in Revit afterward?",
                a: "The export to Revit is clean and maintains element hierarchy. You can open the exported model in Revit and continue detailed design from there.",
              },
              {
                q: "How long does a model generation take?",
                a: "Typically 30 seconds to 2 minutes depending on complexity. You see updates in real time as the model is built.",
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white dark:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-500 shadow-xl shadow-zinc-200/50 dark:shadow-black/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-lime/10"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 sm:p-8 text-left font-bold text-base sm:text-lg tracking-tight text-zinc-900 dark:text-zinc-50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full shrink-0 ml-4 flex items-center justify-center transition-colors duration-300 ${activeFaq === idx ? "bg-zinc-900 dark:bg-white text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"}`}>
                    {activeFaq === idx ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <div className="p-6 sm:p-8 pt-0 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
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

      {/* ─── Final CTA Footer ─── */}
      <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
            Model faster. Check compliance. Complete the conversion.
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            See how WordToBIM lets your modellers prompt their way through elements, compliance checks, and 2D detailing using your firm's own Revit families, without leaving Revit.
          </p>
          <div className="pt-4 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 py-6 font-bold shadow-xl bg-lime text-black hover:bg-lime/90 cursor-pointer border-0 transition-transform hover:scale-105 animate-pulse"
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

      {/* ─── Demo Lightbox ─── */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLightboxOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl z-10 p-6 sm:p-8 space-y-6 text-white"
            >
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
                  Interactive Video Demo
                </span>
                <h3 className="text-xl font-bold">WordToBIM Walkthrough</h3>
              </div>

              <div className="relative w-full aspect-video rounded-2xl bg-zinc-950 overflow-hidden border border-zinc-800 flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-br from-lime/10 via-transparent to-zinc-950" />
                <div className="relative z-10 text-center space-y-4">
                  <a
                    href="https://drive.google.com/drive/folders/1C8KTwemod1FyxAuZr7jefJLqbs1LCn2L?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 rounded-full bg-lime text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform mx-auto cursor-pointer"
                  >
                    <Play className="w-6 h-6 fill-black ml-1" />
                  </a>
                  <p className="text-xs text-zinc-300 font-bold uppercase tracking-wider">
                    Click to Open Demo in Google Drive
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 text-xs text-zinc-500 border-t border-zinc-850">
                <span>WordToBIM Demo</span>
                <span>Includes concept generation and schedule export</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

