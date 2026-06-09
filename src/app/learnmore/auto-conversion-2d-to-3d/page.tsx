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
  Upload,
  Cpu,
  CuboidIcon as Cube,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Apple-style animation variants ───
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

// ─── Split-Screen Before/After Slider Component ───
function BeforeAfterSlider() {
  const [isDragging, setIsDragging] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      setSliderPos((x / rect.width) * 100);
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("touchmove", onTouchMove);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden select-none bg-zinc-900 cursor-ew-resize"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {/* After (3D) - right side */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop"
          alt="3D BIM model"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-500/80 backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-wider">
          After — 3D Model
        </div>
      </div>

      {/* Before (2D) - clipped left side */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop"
          alt="2D structural drawing"
          className="w-full h-full object-cover"
          style={{ width: `${100 / (sliderPos / 100)}%`, maxWidth: "none" }}
        />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-500/80 backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-wider">
          Before — 2D Drawing
        </div>
      </div>

      {/* Handle line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center">
          <div className="flex gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-700 -rotate-45" />
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-700 rotate-[135deg]" />
          </div>
        </div>
      </div>
    </div>
  );
}

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
export default function AutoConversion2Dto3DPage() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

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
  const hero2dOpacity = useTransform(heroScrollProgress, [0, 0.6], [1, 0]);
  const hero3dOpacity = useTransform(heroScrollProgress, [0, 0.6], [0, 1]);

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

  // Demo video URL
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

  // Auto-cycle workflow steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWorkflowStep((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Workflow steps data
  const workflowSteps = [
    {
      number: 1,
      title: "Upload",
      subtitle: "2D Structural Drawing",
      description: "Upload your 2D structural drawing (PDF, DWG, or DXF).",
      detail: "Architect produces a 2D structural drawing. Upload the PDF or CAD file directly — the tool accepts standard BIM output formats.",
    },
    {
      number: 2,
      title: "Computer Vision",
      subtitle: "Element Recognition",
      description: "AI identifies lines, dimensions, annotations, and element types.",
      detail: "Deep learning models read every line, dimension, hatch pattern, and annotation. Walls, slabs, beams, columns, and openings are classified automatically.",
    },
    {
      number: 3,
      title: "3D Generation",
      subtitle: "BIM Model Output",
      description: "3D Revit/IFC model generated with accurate dimensions.",
      detail: "Complete 3D BIM model with walls, slabs, beams, columns, and openings converted with accurate thickness, slopes, and dimensions.",
    },
    {
      number: 4,
      title: "Downstream",
      subtitle: "BOQ & Coordination",
      description: "Model feeds into estimating, clash detection, and site workflows.",
      detail: "The 3D BIM model flows into Revit to BOQ for automated estimating, MeasureonAir for site measurement, or clash detection workflows.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-lime/30 selection:text-black">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════
         HERO - Parallax Scroll (framer-motion)
         ═══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden bg-black"
      >
        {/* Background Visual with Parallax */}
        <motion.div
          style={!isDemoMode ? { y: heroY, scale: heroScale } : {}}
          className={`transition-all duration-700 ease-in-out ${
            isDemoMode ? "fixed inset-0 z-50 bg-black" : "absolute inset-0 z-0"
          }`}
          onClick={() => isDemoMode && exitDemoMode()}
        >
          {/* 2D Drawing Layer */}
          <motion.div
            className="absolute inset-0"
            style={{ opacity: hero2dOpacity }}
          >
            <img
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&h=1080&fit=crop"
              alt="2D structural drawing"
              className="w-full h-full object-cover"
            />
          </motion.div>
          {/* 3D Model Layer */}
          <motion.div
            className="absolute inset-0"
            style={{ opacity: hero3dOpacity }}
          >
            <img
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920&h=1080&fit=crop"
              alt="3D BIM model"
              className="w-full h-full object-cover"
            />
          </motion.div>
          {/* Ambient video beneath */}
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1920&h=1080&fit=crop"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          >
            <source src="https://cdn.coverr.co/videos/coverr-architect-working-on-blueprint-2524/1080p.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </motion.div>

        {/* Breadcrumb */}
        <div className="absolute top-28 left-6 z-10">
          <Link
            href="/learnmore"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Learn More
          </Link>
        </div>

        {/* Hero Content */}
        <motion.div
          style={!isDemoMode ? { y: textY, opacity: heroOpacity } : {}}
          className={`relative w-full z-10 transition-opacity duration-500 ${
            isDemoMode ? "opacity-0 pointer-events-none" : ""
          }`}
        >
          <div className="px-6 pt-32 pb-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.div variants={fadeInUp} className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-white">
                    Design
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-zinc-300">
                    Active Regions: Australia
                  </span>
                </motion.div>

                <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]">
                  Auto Conversion
                  <br />
                  <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                    2D to 3D
                  </span>
                </motion.h1>

                <motion.p variants={fadeInUp} className="text-2xl sm:text-3xl text-zinc-300 font-medium leading-relaxed max-w-xl">
                  From drawing to 3D model.
                  <br />
                  <span className="text-zinc-500">Zero manual redraw.</span>
                </motion.p>

                <motion.p variants={fadeInUp} className="text-lg text-zinc-400 leading-relaxed max-w-xl">
                  Computer vision reads your 2D PDF structural drawing and converts elements directly into 3D BIM elements — no polyline tracing, no manual geometry entry. Slab automation is production-ready now.
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
                  <Button onClick={enterDemoMode} variant="outline" size="lg" className="rounded-xl px-6 py-6 font-bold shadow-lg cursor-pointer border-white/40 bg-white/10 text-white hover:bg-white/25 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Demo
                  </Button>
                  <Button asChild size="lg" className="rounded-xl px-6 py-6 font-bold shadow-lg cursor-pointer bg-yellow-400 text-black hover:bg-yellow-500 hover:scale-105 transition-all duration-300">
                    <Link href="/pricing">
                      Buy Products →
                    </Link>
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
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 sm:p-6 shadow-2xl">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900/50">
                  <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=450&fit=crop" alt="3D BIM preview" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/80 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm">
                      2D → 3D in minutes
                    </span>
                    <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-3 h-3 text-white" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Scroll</span>
            <div className="w-5 h-8 rounded-full border border-zinc-600 flex justify-center pt-1.5">
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-1 h-1.5 rounded-full bg-zinc-400" />
            </div>
          </motion.div>
        </div>

        {/* Demo Mode */}
        <AnimatePresence>
          {isDemoMode && (
            <>
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, delay: 0.2 }} className="fixed top-0 left-0 right-0 z-[70] flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/60 to-transparent">
                <button onClick={exitDemoMode} className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors cursor-pointer">
                  <Minimize2 className="w-4 h-4" />
                  Exit Full Screen
                </button>
                <span className="text-xs text-white/50 font-medium">Auto Conversion 2D to 3D Demo</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }} className="fixed inset-0 z-[55] flex items-center justify-center p-8">
                <div className="relative w-full max-w-6xl aspect-video rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl border border-white/10">
                  <iframe src={demoVideoUrl} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, delay: 1.5 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70]">
                <p className="text-xs text-white/40 flex items-center gap-2">
                  <span>Press</span>
                  <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/60 text-[10px] font-mono">Esc</kbd>
                  <span>or scroll/wheel to exit</span>
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[45] cursor-pointer" onClick={exitDemoMode} />
            </>
          )}
        </AnimatePresence>
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
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
                The Friction
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 leading-tight">
                The 2D-to-3D duplication
              </h2>
              <div className="w-20 h-1.5 bg-[var(--color-lime)] rounded-full" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={isProblemInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:col-span-7 space-y-6"
            >
              <p className="text-xl text-zinc-600 leading-relaxed">Architects draw the building in 2D on a structural drawing. Modellers then spend days recreating that same geometry in 3D — tracing every slab, beam, column, and opening with polylines, measuring dimensions, and building 3D elements manually.</p>
              <p className="text-lg text-zinc-500 leading-relaxed">It is the same geometry, drawn twice, with the modeller&apos;s version adding nothing except digital format. The time spent on this conversion step is time not spent on complex coordination, clash detection, or detailed design.</p>
              <p className="text-lg font-semibold text-zinc-900 leading-relaxed">Auto Conversion 2D to 3D automates this conversion step entirely, eliminating duplication from your workflow.</p>
            </motion.div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-zinc-50 to-transparent pointer-events-none" />
      </section>

      {/* ═══════════════════════════════════════════════════════
         HOW IT WORKS - With Before/After Slider
         ═══════════════════════════════════════════════════════ */}
      <section ref={solutionRef} className="relative py-32 px-6 bg-[#FAFAF8] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isSolutionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-4">
              The Solution
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950">
              How it works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isSolutionInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:sticky lg:top-32 space-y-6"
            >
              <BeforeAfterSlider />
              <p className="text-xs text-zinc-400 text-center">
                Drag the slider left or right to compare 2D drawing vs 3D model
              </p>
            </motion.div>

            <div className="space-y-20">
              {[
                { icon: <Upload className="w-7 h-7" />, bgColor: "bg-blue-100", iconColor: "text-blue-600", number: "01", title: "Upload 2D structural drawing", desc: "Upload your 2D structural drawing in PDF, DWG, or DXF format. The tool accepts standard BIM output from architects." },
                { icon: <Cpu className="w-7 h-7" />, bgColor: "bg-purple-100", iconColor: "text-purple-600", number: "02", title: "Computer vision identifies elements", desc: "Lines, dimensions, annotations, hatching patterns, and element types are recognized automatically by deep learning models trained on structural drawings." },
                { icon: <Cube className="w-7 h-7" />, bgColor: "bg-emerald-100", iconColor: "text-emerald-600", number: "03", title: "3D BIM model generated", desc: "Walls, slabs, beams, columns, and openings are converted to 3D Revit or IFC elements with accurate dimensions. Slab automation is production-ready now." },
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 100 }}
                  animate={isSolutionInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 + idx * 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${step.bgColor} flex items-center justify-center ${step.iconColor}`}>{step.icon}</div>
                    <span className="text-2xl font-black text-zinc-200 tabular-nums">{step.number}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-950">{step.title}</h3>
                  <p className="text-lg text-zinc-600 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isSolutionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="space-y-6 p-8 bg-white rounded-[2rem] border border-zinc-200 shadow-lg"
              >
                <h4 className="text-lg font-bold text-zinc-950">Current capabilities</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30" />
                    <span className="text-sm font-bold text-zinc-800">Slab automation — <span className="text-emerald-600">PRODUCTION READY</span></span>
                  </div>
                  <p className="text-sm text-zinc-500 pl-6">Complete conversion of floor slabs with accurate thickness, slopes, and openings identified.</p>
                </div>
                <div className="border-t border-zinc-100 pt-4 space-y-2">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Planned capabilities (custom modules)</p>
                  <div className="flex flex-wrap gap-2">
                    {["Beam & column identification", "Wall conversion with openings", "Ramp and stair geometry", "Foundation elements"].map((cap, i) => (
                      <span key={i} className="px-3 py-1.5 text-xs font-semibold bg-zinc-100 text-zinc-600 rounded-full border border-zinc-200">{cap}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
         WORKFLOW SECTION
         ═══════════════════════════════════════════════════════ */}
      <section ref={workflowRef} className="py-32 px-6 bg-zinc-900 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isWorkflowInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-4">Integration</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">Fits into your workflow</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={isWorkflowInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="p-8 bg-zinc-800/50 border border-zinc-700/50 rounded-3xl space-y-4 backdrop-blur-sm hover:border-zinc-600 transition-colors duration-300">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">What feeds in</span>
              <h4 className="font-bold text-2xl text-white">2D structural drawing</h4>
              <p className="text-zinc-400">Accepts PDF, DWG, DXF, and TIFF images of 2D orthographic drawings from architects or structural engineers.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} animate={isWorkflowInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="p-8 bg-zinc-800/50 border border-zinc-700/50 rounded-3xl space-y-4 backdrop-blur-sm hover:border-zinc-600 transition-colors duration-300">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">What it feeds into</span>
              <h4 className="font-bold text-2xl text-white">Revit to BOQ + MeasureonAir</h4>
              <p className="text-zinc-400">The 3D BIM model flows into automated estimating via Revit to BOQ and site measurement via MeasureonAir.</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isWorkflowInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Mobile Carousel */}
            <div className="lg:hidden">
              <div className="relative overflow-hidden rounded-3xl">
                <div className="p-8 bg-zinc-800/30 border border-zinc-700/50 rounded-3xl space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-extrabold text-white">{workflowSteps[activeWorkflowStep].number}</span>
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{workflowSteps[activeWorkflowStep].title}</p>
                      <p className="text-sm font-semibold text-white">{workflowSteps[activeWorkflowStep].subtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{workflowSteps[activeWorkflowStep].detail}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 mt-6">
                {[0, 1, 2, 3].map((i) => (
                  <button key={i} onClick={() => setActiveWorkflowStep(i)} className="cursor-pointer">
                    <div className="h-2 rounded-full transition-all duration-300" style={{ width: activeWorkflowStep === i ? 24 : 8, backgroundColor: activeWorkflowStep === i ? "#a3e635" : "rgb(113 113 122)" }} />
                  </button>
                ))}
              </div>
              <p className="text-center text-xs text-zinc-500 font-medium mt-2">{workflowSteps[activeWorkflowStep].number}. {workflowSteps[activeWorkflowStep].subtitle}</p>
            </div>

            {/* Desktop grid */}
            <div className="hidden lg:grid grid-cols-4 gap-6">
              {workflowSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isWorkflowInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="p-6 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl space-y-4 hover:border-zinc-500/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-extrabold text-white">{step.number}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{step.title}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{step.subtitle}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
         PRICING & QUICK FACTS
         ═══════════════════════════════════════════════════════ */}
      <section ref={pricingRef} className="py-32 px-6 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-8 space-y-16">
              <div className="space-y-8">
                <motion.div initial={{ opacity: 0, y: 40 }} animate={isPricingInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-4">Deployment</span>
                  <h2 className="text-4xl sm:text-5xl font-bold text-zinc-950">Pricing & Availability</h2>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} animate={isPricingInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { label: "Per-Module Customisation", price: "$2,200", desc: "Slab, beam, column, wall, or stair module." },
                    { label: "Slab Module (Standalone)", price: "$2,200", desc: "Production-ready slab automation available now.", suffix: "/standalone" },
                    { label: "Output Format", price: "+$500", desc: "IFC or DWG export as custom implementation." },
                  ].map((card, i) => (
                    <motion.div key={i} whileHover={{ y: -8, scale: 1.02 }} className="p-8 bg-white border border-zinc-200 rounded-3xl space-y-3 shadow-sm hover:shadow-xl transition-all duration-300">
                      <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">{card.label}</span>
                      <p className="text-4xl font-black tracking-tight">{card.price}{card.suffix && <span className="text-base font-normal text-zinc-400">{card.suffix}</span>}</p>
                      <p className="text-sm text-zinc-500">{card.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} animate={isPricingInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-6">Related Products</h4>
                  <ul className="space-y-4 text-sm">
                    {[
                      { href: "/learnmore/hand-drawn-to-autocad", label: "Hand Drawn to AutoCAD", tag: "Input conversion" },
                      { href: "/learnmore/revit-to-boq", label: "Revit to BOQ", tag: "Measurement workflow" },
                      { href: "/learnmore/auto-reinforcement", label: "Auto Reinforcement Plugin", tag: "Rebar from drawings" },
                    ].map((item, i) => (
                      <li key={i}>
                        <Link href={item.href} className="font-bold hover:text-primary transition-colors flex items-center justify-between group">
                          <span>{item.label}</span>
                          <span className="text-xs text-zinc-400 font-medium group-hover:text-primary transition-colors">{item.tag}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 mt-4 border-t border-zinc-100">
                    <Link href="/learnmore" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                      View full suite <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div initial={{ opacity: 0, x: 60 }} animate={isPricingInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="lg:col-span-4 sticky top-32">
              <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-lg space-y-8">
                <h3 className="font-bold text-xl border-b border-zinc-100 pb-4">Quick Facts</h3>
                <div className="space-y-5">
                  {[
                    { label: "Stage", value: "Design" },
                    { label: "Best For", value: "BIM modellers, structural engineers" },
                    { label: "Regions", value: "Australia (primary)" },
                    { label: "Time to Implement", value: "2–4 weeks per module" },
                    { label: "Pricing", value: "USD 2,200/module" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-zinc-500 font-semibold">{item.label}</span>
                      <span className="font-bold text-zinc-900 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
                <Button asChild className="w-full rounded-2xl py-7 font-bold shadow-lg bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime)]/90 cursor-pointer">
                  <Link href="/pricing">Buy Products →</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
         COMPARISON SECTION
         ═══════════════════════════════════════════════════════ */}
      <section ref={comparisonRef} className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.div initial={{ opacity: 0, y: 60 }} animate={isComparisonInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-4">Comparative Advantage</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950">Why choose Auto Conversion 2D to 3D</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Manual Polyline Tracing", items: ["1–2 weeks per drawing set", "Labor-intensive, error-prone", "Modeller time wasted on conversion", "Geometry duplicated unnecessarily"], highlight: false },
              { label: "Auto Conversion 2D to 3D", items: ["1–2 days per drawing set", "Fully automated, consistent", "Modeller time freed for coordination", "Slab automation is production-ready"], highlight: true },
              { label: "Other PDF-to-3D tools", items: ["Require manual validation at every step", "Work only for simple geometry", "Not trained on structural drawings", "No complete automation available"], highlight: false },
            ].map((col, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                animate={isComparisonInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: col.highlight ? -16 : -12, scale: col.highlight ? 1.02 : 1 }}
                className={`relative p-8 rounded-3xl flex flex-col ${
                  col.highlight
                    ? "bg-zinc-900 text-white shadow-2xl border-2 border-[var(--color-lime)]"
                    : "bg-zinc-50 border border-zinc-200"
                }`}
              >
                {col.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-[var(--color-lime)] text-black text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">★ Recommended</div>
                )}
                <h4 className={`text-sm font-bold uppercase tracking-wider mb-6 ${col.highlight ? "text-white" : "text-zinc-400"}`}>{col.label}</h4>
                <div className={`h-0.5 w-full mb-6 ${col.highlight ? "bg-zinc-700" : "bg-zinc-200"}`} />
                <ul className="space-y-4 flex-1">
                  {col.items.map((item, i) => (
                    <li key={i} className="flex gap-3 items-start text-sm">
                      {col.highlight ? (
                        <div className="w-6 h-6 rounded-full bg-[var(--color-lime)] flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4 text-black" />
                        </div>
                      ) : (
                        <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <span className={col.highlight ? "font-semibold" : "text-zinc-600"}>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
         FAQ SECTION
         ═══════════════════════════════════════════════════════ */}
      <section ref={faqRef} className="py-32 px-6 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 60 }} animate={isFaqInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-4">FAQ</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950">Frequently Asked Questions</h2>
          </motion.div>

          <AppleAccordion
            items={[
              { q: "What file formats does it accept?", a: "PDF is primary. We also accept DWG, DXF, and TIFF images of drawings. File must be 2D orthographic (not perspective)." },
              { q: "Can it handle complex slab geometry?", a: "Yes. Slabs with multiple depths, slopes, openings, and hatched areas are all recognized. Best results with clear line work and proper dimensioning." },
              { q: "What if the 2D drawing has missing dimensions?", a: "The tool estimates dimensions from scale and nearby measurements. Manual review and correction can be requested for critical elements." },
              { q: "Does it work with hand-drawn structural drawings?", a: "Not ideally. Best results are with CAD-produced (clean) drawings. Hand Drawn to AutoCAD can convert hand sketches to CAD first." },
              { q: "Can we choose output format (Revit, IFC, DWG)?", a: "Currently exports to Revit native format (RVT). IFC and DWG exports available as custom implementation (USD 500 additional)." },
            ]}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
         FOOTER CTA
         ═══════════════════════════════════════════════════════ */}
      <section ref={ctaRef} className="py-32 px-6 bg-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[var(--color-lime)]/15 via-[var(--color-lime)]/8 to-[var(--color-lime)]/15 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <motion.h2 initial={{ opacity: 0, y: 40 }} animate={isCtaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Stop drawing the same<br /><span className="text-zinc-400">geometry twice.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={isCtaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="text-zinc-400 text-xl max-w-2xl mx-auto leading-relaxed">
            See how Auto Conversion 2D to 3D eliminates geometry duplication from your workflow.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isCtaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }} className="pt-6 flex justify-center">
            <Button asChild size="lg" className="rounded-2xl px-10 py-7 font-bold shadow-xl bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime)]/90 cursor-pointer hover:scale-105 transition-all duration-300">
              <Link href="/pricing">Buy Products →</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
