"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Play,
  ChevronRight,
  ChevronDown,
  Check,
  Upload,
  Cpu,
  CuboidIcon as Cube,
  ArrowUpRight,
  Sparkles,
  ArrowRight,
  FileText,
  Clock,
  Layers,
  Sliders,
  Folder,
  Download
} from "lucide-react";
import ComparisonGrid from "@/components/learnmore/comparison-grid";
import { VideoLightbox } from "@/components/persona/video-lightbox";
import Lenis from "lenis";

// ─── Apple-style animation presets ───
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

// ─── ADVANCED EFFECT: MAGNETIC BUTTON ───
interface MagneticButtonProps extends React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  children: React.ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
}

function MagneticButton({ children, className = "", onClick, href, ...props }: MagneticButtonProps) {
  const ref = useRef<any>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    const distance = Math.sqrt(x * x + y * y);

    // Attract when cursor is within 80px
    if (distance < 80) {
      setPosition({ x: x * 0.35, y: y * 0.35 });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const isExternal = href?.startsWith("http");
  const Component = href ? (isExternal ? "a" : Link) : "button";

  return (
    <motion.div
      ref={ref}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      {/* @ts-ignore */}
      <Component
        className={`inline-flex items-center justify-center gap-2 select-none outline-none ${className}`}
        onClick={onClick}
        href={href as any}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      >
        {children}
      </Component>
    </motion.div>
  );
}

// ─── ADVANCED EFFECT: HOVER TILT CARD ───
function HoverTiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Tilt max 8 degrees
    const rX = -(mouseY / (height / 2)) * 8;
    const rY = (mouseX / (width / 2)) * 8;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── ADVANCED EFFECT: NUMBER TICKER ───
function NumberTicker({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 15);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration, inView]);

  return <span ref={nodeRef}>{count}</span>;
}

// ─── 1. HERO GRAPHICS - NARRATIVE STORYBOARD CYCLING ANIMATION ───
function HeroStorylineVisual() {
  const [activeScene, setActiveScene] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-[16/10] rounded-[2rem] bg-white/60 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 shadow-2xl overflow-hidden p-6 flex items-center justify-center">
      {/* Blueprint grid lines behind visual */}
      <div className="absolute inset-0 opacity-5 dark:hidden" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
        backgroundSize: "20px 20px"
      }} />
      <div className="absolute inset-0 opacity-5 hidden dark:block" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: "20px 20px"
      }} />

      <svg viewBox="0 0 500 300" className="w-full h-full text-zinc-400 dark:text-zinc-800">
        <g stroke="currentColor" strokeWidth="1.2" fill="none">
          {/* Architect wall lines grid */}
          <path d="M 50,50 L 450,50 L 450,250 L 250,250 L 250,280 L 50,280 Z" strokeWidth="1.5" opacity="0.3" />
        </g>

        {/* Scene 0 (Architect drawing) */}
        {activeScene >= 0 && (
          <motion.path
            d="M 50,50 L 450,50 L 450,250 L 250,250 L 250,280 L 50,280 Z"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: activeScene >= 0 ? 1 : 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        )}

        {/* Scene 1 (Modeller tracing) */}
        {activeScene >= 1 && (
          <motion.path
            d="M 50,50 L 450,50 L 450,250 L 250,250 L 250,280 L 50,280 Z"
            fill="none"
            stroke={activeScene === 2 ? "#f43f5e" : "#ef4444"}
            strokeDasharray="6 4"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: activeScene >= 1 ? 1 : 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        )}

        {/* Scene 2 (Duplication Error alert) */}
        {activeScene === 2 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            transform="translate(250, 150)"
          >
            <rect x="-80" y="-12" width="160" height="22" fill="rgba(244,63,94,0.15)" stroke="#f43f5e" strokeWidth="1" rx="4" />
            <text fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle" y="2" fontFamily="monospace">
              ⚠ DUPLICATION ERROR
            </text>
          </motion.g>
        )}

        {/* Scene 3 (Auto Conversion Yellow complete) */}
        {activeScene === 3 && (
          <motion.path
            d="M 50,50 L 450,50 L 450,250 L 250,250 L 250,280 L 50,280 Z"
            fill="var(--color-lime)"
            fillOpacity={0.08}
            stroke="var(--color-lime)"
            strokeWidth="3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </svg>

      <AnimatePresence>
        {activeScene === 3 && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="absolute inset-0 bg-lime/10 border border-lime/25 flex flex-col justify-center items-center backdrop-blur-xs rounded-3xl"
          >
            <Check className="w-12 h-12 text-zinc-900 dark:text-zinc-300 mb-2 animate-bounce" />
            <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-center px-4">Conversion Completed Automatically</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Status Overlay */}
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-black/60 border border-zinc-200 dark:border-white/10 backdrop-blur-md text-[10px] sm:text-xs font-mono select-none text-zinc-850 dark:text-zinc-250">
        {activeScene === 0 && <span className="text-blue-500 font-bold">Scene 1: Architect draws 2D layout</span>}
        {activeScene === 1 && <span className="text-red-500 font-bold">Scene 2: Modeller redraws same lines</span>}
        {activeScene === 2 && <span className="text-rose-500 font-black">Scene 3: Wasted duplication hours</span>}
        {activeScene === 3 && <span className="text-zinc-950 dark:text-white font-black">Scene 4: Instant 3D Conversion</span>}
      </div>

      {/* Step Indicators */}
      <div className="absolute bottom-4 left-4 flex gap-1.5">
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${activeScene === idx
              ? (idx === 3 ? "bg-lime border-lime scale-110" : idx === 2 ? "bg-rose-500 border-rose-500 scale-110" : "bg-blue-500 border-blue-500 scale-110")
              : "bg-zinc-300 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
              }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── 2. BEFORE VS AFTER - DRAGGABLE DIVIDER SLIDER COMPONENT ───
function InteractiveBeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setSliderPos((x / rect.width) * 100);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) handleMove(e.touches[0].clientX);
    };
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMove]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto w-full">
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-3xl overflow-hidden select-none bg-zinc-950 border border-zinc-900 cursor-ew-resize shadow-2xl"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Right side: 3D Revit Model (After) */}
        <div className="absolute inset-0 w-full h-full bg-zinc-950 flex items-center justify-center">
          <svg viewBox="0 0 800 450" className="w-full h-full text-zinc-900 dark:text-zinc-300 p-2 sm:p-6">
            <g stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.8">
              {/* Isometric Slab wireframes */}
              <polygon points="400,120 650,230 520,290 400,240 280,290 150,230" fill="var(--color-lime)" fillOpacity={0.12} />
              <path d="M400,120 L400,145 M650,230 L650,255 M520,290 L520,315 M150,230 L150,255" />
              <polygon points="400,145 650,255 520,315 400,265 280,315 150,255" fill="var(--color-lime)" fillOpacity={0.06} />
              {/* Columns */}
              <line x1="400" y1="145" x2="400" y2="340" />
              <line x1="650" y1="255" x2="650" y2="400" />
              <line x1="150" y1="255" x2="150" y2="400" />
            </g>
          </svg>
          <div className="absolute top-3 right-3 sm:top-6 sm:right-6 px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-lime/10 border border-lime/30 backdrop-blur-md text-[10px] sm:text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">
            Auto Conversion: 3D Revit
          </div>
          <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 p-2.5 sm:p-4 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md text-right">
            <span className="text-[9px] sm:text-[10px] text-zinc-550 uppercase font-mono block">Processing Time</span>
            <span className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white font-mono"><NumberTicker value={10} duration={1} /> Seconds</span>
          </div>
        </div>

        {/* Left side: Manual 2D Tracing (Before - Clipped) */}
        <div
          className="absolute inset-0 w-full h-full bg-[#1e293b] overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
        >
          <svg viewBox="0 0 800 450" className="w-full h-full text-blue-400 p-2 sm:p-6">
            <g stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4">
              <rect x="80" y="80" width="640" height="290" />
              <line x1="400" y1="80" x2="400" y2="370" strokeDasharray="4 4" />
              <line x1="80" y1="225" x2="720" y2="225" strokeDasharray="4 4" />
            </g>
            {/* Animated tedious polyline tracing */}
            <path
              d="M 120,120 L 680,120 L 680,330 L 400,330 L 400,350 L 120,350 Z"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2.5"
              strokeDasharray="1800"
              strokeDashoffset="1800"
            >
              <animate attributeName="stroke-dashoffset" values="1800;0" dur="10s" repeatCount="indefinite" />
            </path>
            <g>
              <animateMotion dur="10s" repeatCount="indefinite" path="M 120,120 L 680,120 L 680,330 L 400,330 L 400,350 L 120,350 Z" />
              <circle r="5" fill="#f43f5e" />
              <line x1="-15" y1="0" x2="15" y2="0" stroke="#f43f5e" strokeWidth="1" />
              <line x1="0" y1="-15" x2="0" y2="15" stroke="#f43f5e" strokeWidth="1" />
            </g>
          </svg>
          <div className="absolute top-3 left-3 sm:top-6 sm:left-6 px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 backdrop-blur-md text-[10px] sm:text-xs font-black text-rose-400 uppercase tracking-widest">
            Manual Drafting & Tracing
          </div>
          <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 p-2.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-700 backdrop-blur-md">
            <span className="text-[9px] sm:text-[10px] text-rose-400 uppercase font-mono block">Drafting Time</span>
            <span className="text-lg sm:text-2xl font-black text-rose-400 font-mono"><NumberTicker value={14} duration={1.5} /> Days</span>
          </div>
        </div>

        {/* Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl z-20 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-zinc-950 border border-zinc-200 flex items-center justify-center shadow-2xl pointer-events-auto cursor-ew-resize">
            <div className="flex gap-0.5 text-zinc-550">
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-180" />
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



// ─── 4. CAPABILITY CARDS WITH MOVING BORDER BEAM ───
function CapabilitySpotlightCard() {
  return (
    <div className="relative rounded-3xl bg-zinc-900 border border-zinc-850 p-8 md:p-12 overflow-hidden shadow-2xl group hover:border-lime/20 transition-all duration-300">

      {/* Moving border beam animation */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-3xl" rx="24">
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="24"
          fill="none"
          stroke="url(#beam-gradient-cap)"
          strokeWidth="3"
          strokeDasharray="280 400"
          strokeDashoffset="680"
          className="animate-[dash_6s_linear_infinite]"
        />
        <defs>
          <linearGradient id="beam-gradient-cap" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-lime)" />
            <stop offset="50%" stopColor="transparent" />
            <stop offset="100%" stopColor="var(--color-lime)" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute top-0 right-0 w-60 h-60 bg-[radial-gradient(circle_at_top_right,color-mix(in srgb,var(--color-lime)_8%,transparent),transparent_70%)] pointer-events-none" />

      <div className="max-w-3xl space-y-6 relative z-10">


        <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">
          Slab Automation Module
        </h3>

        <p className="text-zinc-400 leading-relaxed text-base md:text-lg">
          Complete automated conversion of floor slabs. Our CV engine recognizes concrete hatches, sloped contours, slab drops, and structural voids to construct 3D slab volumes with correct thickness offsets automatically.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-zinc-800">
          {[
            { title: "Thickness Range", val: "100mm to 600mm" },
            { title: "Slope Recognition", val: "Pitch & Fall slopes mapped" },
            { title: "Openings / Voids", val: "Automatic stair/lift voids cut" }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <span className="text-[10px] text-zinc-550 uppercase font-mono block tracking-wider">{item.title}</span>
              <span className="text-sm font-bold text-zinc-200">{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 5. ISOMETRIC WORKFLOW (RECREATION) ───
function IsometricWorkflow() {
  return (
    <div className="relative w-full max-w-7xl mx-auto py-24 flex flex-col items-center justify-center min-h-[600px]">

      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Central Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl px-6">


        <h2 className="text-5xl md:text-7xl font-bold text-zinc-900 dark:text-white tracking-tight leading-[1.1] mb-8">
          A <em className=" text-5xl md:text-7xl font-bold text-zinc-900 dark:text-white tracking-tight leading-[1.1] mb-80">Smarter</em> Way to<br />
          Build <em className=" text-5xl md:text-7xl font-bold text-zinc-900 dark:text-white tracking-tight leading-[1.1] mb-8">in</em> 3D
        </h2>

        <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-10 leading-relaxed font-light">
          Concolabs fits into your workflow, instantly generating precise 3D Revit models from your 2D plans without the manual tracing.
        </p>

        <a
          href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-lime text-black px-8 py-3.5 rounded-full font-bold hover:bg-lime/90 transition-colors inline-block"
        >
          Try a demo
        </a>
      </div>

      {/* Background Animated Connecting Line (Behind Text) */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block overflow-hidden">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e4e4e7" stopOpacity="0" />
              <stop offset="20%" stopColor="#3b82f6" />
              <stop offset="80%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#e4e4e7" stopOpacity="0" />
            </linearGradient>
            <filter id="flow-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <path
            d="M 150 300 C 400 300, 400 400, 600 400 C 800 400, 800 300, 1050 300"
            stroke="#e4e4e7" strokeWidth="2" fill="none" className="dark:stroke-zinc-800"
          />
          <path
            d="M 150 300 C 400 300, 400 400, 600 400 C 800 400, 800 300, 1050 300"
            stroke="url(#flow-grad)" strokeWidth="3" fill="none" filter="url(#flow-glow)"
            strokeDasharray="15 30"
            className="animate-[dash_2s_linear_infinite]"
          />
        </svg>
      </div>

      {/* Left UI Card: 2D Blueprint Input */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute left-0 lg:left-12 top-[60%] lg:top-1/2 -translate-y-1/2 w-64 hidden sm:flex flex-col gap-4 z-20"
      >
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden">
          {/* Scanning line animation */}
          <motion.div
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] z-30"
          />

          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Input</span>
          </div>

          {/* Mock Blueprint */}
          <div className="w-full h-32 border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-3 flex flex-col gap-2 relative">
            <div className="w-full h-1.5 bg-blue-200 dark:bg-blue-800/50 rounded-full" />
            <div className="w-3/4 h-1.5 bg-blue-200 dark:bg-blue-800/50 rounded-full" />
            <div className="w-5/6 h-1.5 bg-blue-200 dark:bg-blue-800/50 rounded-full" />
            <div className="mt-auto grid grid-cols-2 gap-2">
              <div className="h-8 border-2 border-blue-200 dark:border-blue-800/50 rounded" />
              <div className="h-8 border-2 border-blue-200 dark:border-blue-800/50 rounded" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">floorplan.pdf</span>
            <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_4px_rgba(59,130,246,0.8)] animate-pulse" />
          </div>
        </div>
      </motion.div>

      {/* Right UI Card: 3D Revit Output */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="absolute right-0 lg:right-12 top-[60%] lg:top-1/2 -translate-y-1/2 w-64 hidden sm:flex flex-col gap-4 z-20"
      >
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Output</span>
          </div>

          {/* Mock 3D Model Properties */}
          <div className="w-full h-32 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-lg p-3 flex flex-col gap-3 justify-center">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">Elements</span>
              <span className="text-[10px] font-mono text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">3,492</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">Materials</span>
              <span className="text-[10px] font-mono text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">Assigned</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">Level</span>
              <span className="text-[10px] font-mono text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">L01 - L05</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-mono text-zinc-900 dark:text-zinc-100 bg-zinc-150 dark:bg-zinc-800/60 px-2 py-1 rounded">structure.rvt</span>
            <Download className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </motion.div>

    </div>
  );
}

// ─── Main Page Component ───
export default function AutoConversion2Dto3DPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialize Lenis scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Global mouse spotlight position setup
  const globalContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!globalContainerRef.current) return;
      const rect = globalContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      globalContainerRef.current.style.setProperty("--mouse-x", `${x}px`);
      globalContainerRef.current.style.setProperty("--mouse-y", `${y}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Page Scroll Progress
  const { scrollYProgress: pageScrollProgress } = useScroll();
  const springProgress = useSpring(pageScrollProgress, { stiffness: 200, damping: 25 });

  // ─── Hero Scroll Linkage ───
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScrollProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.75], [1, 0]);
  const textY = useTransform(heroScrollProgress, [0, 1], [0, -50]);

  // Section Refs for scroll hooks
  const problemRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const isProblemInView = useInView(problemRef, { once: true, margin: "-120px" });
  const isPricingInView = useInView(pricingRef, { once: true, margin: "-120px" });
  const isComparisonInView = useInView(comparisonRef, { once: true, margin: "-120px" });
  const isFaqInView = useInView(faqRef, { once: true, margin: "-120px" });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-120px" });

  // Accordion faq active state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Google Drive folder URL
  const demoFolderUrl = "https://drive.google.com/drive/folders/1H63HxhRAEjOyEDD424G4Yh1BNrKz-6U9?usp=sharing";

  // ─── State-based Interactive Steps Section ───
  const [activeStep, setActiveStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const stepDuration = 6000; // 6 seconds per step

  // We rely on Framer Motion's onAnimationComplete for desktop layout autoplay.
  // For mobile layout (which hides the desktop component), we use a separate simple timeout.
  useEffect(() => {
    if (!isMobile) return;
    const timer = setTimeout(() => {
      setActiveStep((curr) => (curr === 2 ? 0 : curr + 1));
    }, stepDuration);
    return () => clearTimeout(timer);
  }, [activeStep, isMobile]);

  const handleStepSelect = (idx: number) => {
    setActiveStep(idx);
  };

  // ─── Apple TV style scale-up Demo section scroll setup ───
  const demoShowcaseRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: demoScrollProgress } = useScroll({
    target: demoShowcaseRef,
    offset: ["start end", "end start"],
  });
  // Video scales up from 65% (or 95% on mobile) to 100% width on scroll
  const videoScale = useTransform(
    demoScrollProgress,
    [0.1, 0.85],
    isMobile ? [0.95, 1] : [0.65, 1]
  );

  return (
    <div
      ref={globalContainerRef}
      className="relative min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased overflow-x-hidden"
    >
      {/* Global Mouse Follow Spotlight Halo */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-30 dark:opacity-20 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), color-mix(in srgb, var(--color-lime) 15%, transparent), transparent 80%)`
        }}
      />

      {/* Top Page Scroll Progress Indicator */}
      <motion.div
        style={{ scaleX: springProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-lime to-lime-dark z-50 origin-left"
      />

      <Navbar />

      {/* ═══════════════════════════════════════════════════════
           1. HERO - Background Video, Back Link, Animated Title & Storyboard
           ═══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden bg-[#FAFAF8] dark:bg-zinc-950"
      >
        {/* Cinematic Ambient Background Video with Glass overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#FAFAF8] dark:bg-zinc-950 pointer-events-none">
          <video
            src="/videos/Auto%20Conversion%202D%20to%203D/Auto%20Conversion%20from%202D%20to%203D_1080p-h264.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 scale-110 object-cover opacity-20 dark:opacity-30"
          />
          {/* Glass Overlay Layer */}
          <div className="absolute inset-0 bg-white/50 dark:bg-zinc-950/65 backdrop-blur-[4px] z-10 pointer-events-none" />
          {/* Vignette Layer */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#FAFAF8_90%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_20%,#09090b_90%)] z-15 pointer-events-none" />
        </div>

        {/* Back to Learn More Link Button */}
        <div className="absolute top-28 left-6 z-30">
          <Link
            href="/learnmore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-black/60 backdrop-blur-md text-sm font-semibold text-zinc-650 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-all hover:bg-white/80 dark:hover:bg-black/80 hover:scale-105 active:scale-95 group shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Learn More
          </Link>
        </div>

        <div className="w-full relative z-20 max-w-6xl mx-auto px-6 pt-32 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Hero text */}
          <motion.div
            style={{ y: textY, opacity: heroOpacity }}
            className="lg:col-span-6 space-y-6"
          >
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >


              <motion.h1
                variants={fadeInUp}
                className="text-5xl sm:text-6xl xl:text-7.5xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.03] uppercase product-title-sweep"
              >
                Auto Conversion 2D to 3D
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-2xl sm:text-3xl text-zinc-700 dark:text-zinc-300 font-bold leading-tight"
              >
                From drawing to 3D model.
                <br />
                <span className="text-zinc-500">Zero manual redraw.</span>
              </motion.p>

              <motion.p
                variants={fadeInUp}
                className="text-lg text-zinc-650 dark:text-zinc-400 leading-relaxed max-w-xl"
              >
                Computer vision reads your 2D PDF structural drawing and converts it directly to 3D BIM elements — no polyline tracing, no manual geometry entry. Slab automation is production-ready now.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
                <MagneticButton
                  className="rounded-2xl h-14 px-6 font-bold shadow-md cursor-pointer border border-zinc-300 dark:border-white/10 bg-white/50 dark:bg-white/5 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/15 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                  onClick={() => document.getElementById("demo-showcase")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <Play className="w-4 h-4 mr-2 text-zinc-900 dark:text-zinc-300" />
                  Watch Demo
                </MagneticButton>
                <MagneticButton
                  href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                  className="rounded-2xl h-14 px-6 font-black shadow-xl bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime)]/90 hover:scale-105 transition-all duration-300 cursor-pointer border-0"
                >
                  Book a demo →
                </MagneticButton>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Storyboard graphic display on the right */}
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="lg:col-span-6 w-full"
          >
            <HeroStorylineVisual />
          </motion.div>
        </div>
      </section>



      {/* ═══════════════════════════════════════════════════════
         3. DEMO SHOWCASE - APPLE TV SCALE-UP EXPERIENCE
         ═══════════════════════════════════════════════════════ */}
      <section
        id="demo-showcase"
        ref={demoShowcaseRef}
        className="relative h-[120vh]"
      >
        <div
          className="sticky top-0 h-screen flex flex-col justify-center items-center overflow-hidden px-6"
        >
          {/* Scroll Scaling Video Player Container */}
          <motion.div
            style={{ scale: videoScale }}
            className="relative w-full max-w-6xl aspect-video rounded-3xl bg-zinc-950 border border-white/10 overflow-hidden shadow-2xl z-20 flex items-center justify-center"
          >
            <video
              src="/videos/Auto%20Conversion%202D%20to%203D/Auto%20Conversion%20from%202D%20to%203D_1080p-h264.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
         4. HOW IT WORKS - INTERACTIVE AUTOPLAY TIMELINE
         ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 px-6 bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border-t border-zinc-200 dark:border-zinc-900">
        <div className="max-w-6xl mx-auto w-full">

          <div className="space-y-2 text-center mb-10">

            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white tracking-tight leading-tight">How it works</h2>
            <p className="text-zinc-550 dark:text-zinc-400 max-w-xl mx-auto text-sm sm:text-base font-medium">
              A fully automated pipeline converting standard engineering drawings into clean, native 3D BIM formats.
            </p>
          </div>

          {/* DESKTOP LAYOUT (1024px and up) */}
          <div className="hidden lg:grid grid-cols-12 gap-10 items-center">

            {/* Left Steps Cards */}
            <div className="col-span-5 space-y-4">
              {[
                {
                  step: 1,
                  tag: "Upload Document",
                  title: "Upload flat structural PDF",
                  desc: "Drop your 2D structural drawings into the secure web upload interface. The platform supports standard BIM sheets and exports from CAD setups instantly."
                },
                {
                  step: 2,
                  tag: "Computer Vision Parse",
                  title: "Identify lines and annotations",
                  desc: "Deep learning models segment hatches, outline walls, measure grid spans, and locate structural annotation labels automatically."
                },
                {
                  step: 3,
                  tag: "3D RVT Generation",
                  title: "Generate native 3D BIM model",
                  desc: "Slabs, beam grids, walls, and structural columns assemble directly on the coordinates, creating native Revit or IFC models ready for coordination."
                }
              ].map((item, index) => {
                const isActive = activeStep === index;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className={`block w-full text-left p-6 rounded-2xl transition-all duration-300 relative overflow-hidden group outline-none ${isActive
                      ? "bg-white dark:bg-zinc-900 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border border-zinc-200/60 dark:border-zinc-800"
                      : "bg-transparent border border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900/40"
                      }`}
                  >
                    <div className="space-y-2 relative z-10">
                      <span className="text-zinc-950 dark:text-white font-sans text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full bg-lime ${isActive ? "animate-pulse" : ""}`} />
                        Step {item.step} — {item.tag}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight leading-tight">{item.title}</h3>
                      <p className="text-zinc-650 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed mt-2 font-medium">{item.desc}</p>
                    </div>

                    {/* Progress Bar Track */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <motion.div
                          key={`progress-${activeStep}`}
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 6, ease: "linear" }}
                          onAnimationComplete={() => {
                            if (!isMobile) setActiveStep((curr) => (curr === 2 ? 0 : curr + 1));
                          }}
                          className="h-full bg-lime"
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Graphic Viewport */}
            <div className="col-span-7 h-[400px] flex items-center justify-center relative">
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div
                    key="step-upload"
                    initial={{ opacity: 0, scale: 0.96, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -15 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                  >
                    <div className="bg-white/65 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl aspect-[16/10] overflow-hidden flex items-center justify-center p-8 relative shadow-xl backdrop-blur-md">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in srgb,var(--color-lime)_5%,transparent),transparent_60%)] pointer-events-none" />
                      <div className="relative w-full max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/60 p-6 flex flex-col items-center justify-center shadow-lg transition-colors">
                        <div className="relative mb-4">
                          <div className="absolute inset-0 rounded-full bg-lime/10 animate-ping opacity-75" />
                          <div className="relative w-16 h-16 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center text-zinc-900 dark:text-zinc-300">
                            <Upload className="w-7 h-7" />
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Upload structural PDF</h4>
                        <p className="text-[11px] text-zinc-400 mt-1 text-center font-mono">Drag & Drop or Click to browse</p>

                        <motion.div
                          className="w-full mt-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-xl p-3.5 flex items-center gap-3"
                          animate={{ y: [10, 0, 10], opacity: [0.9, 1, 0.9] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <div className="w-8 h-8 rounded-lg bg-lime/10 border border-lime/20 flex items-center justify-center text-zinc-900 dark:text-zinc-300">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold font-mono text-zinc-850 dark:text-zinc-200 truncate">2D_Slab_Layout.pdf</span>
                              <span className="text-[9px] font-mono text-zinc-900 dark:text-white font-bold">100%</span>
                            </div>
                            <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-lime rounded-full"
                                animate={{ width: ["0%", "100%", "100%"] }}
                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 1 && (
                  <motion.div
                    key="step-parse"
                    initial={{ opacity: 0, scale: 0.96, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -15 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                  >
                    <div className="bg-white/65 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl aspect-[16/10] overflow-hidden flex items-center justify-center p-8 relative shadow-xl backdrop-blur-md">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in srgb,var(--color-lime)_3%,transparent),transparent_70%)] pointer-events-none" />
                      <div className="w-full h-full relative border border-zinc-200 dark:border-zinc-800/60 rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 overflow-hidden p-6 flex items-center justify-center">
                        <svg viewBox="0 0 400 250" className="w-full h-full text-zinc-350 dark:text-zinc-800">
                          <g stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5">
                            <line x1="50" y1="20" x2="50" y2="230" />
                            <line x1="150" y1="20" x2="150" y2="230" />
                            <line x1="250" y1="20" x2="250" y2="230" />
                            <line x1="350" y1="20" x2="350" y2="230" />
                            <line x1="20" y1="50" x2="380" y2="50" />
                            <line x1="20" y1="130" x2="380" y2="130" />
                            <line x1="20" y1="200" x2="380" y2="200" />
                          </g>
                          <path d="M50,50 L350,50 L350,200 L150,200 L150,130 L50,130 Z" stroke="currentColor" fill="none" strokeWidth="1" />
                          <motion.path
                            d="M50,50 L350,50 L350,200 L150,200 L150,130 L50,130 Z"
                            stroke="var(--color-lime)"
                            fill="var(--color-lime)"
                            fillOpacity={0.06}
                            strokeWidth="2"
                            strokeDasharray="1000"
                            animate={{ strokeDashoffset: [1000, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          />
                          <rect x="44" y="44" width="12" height="12" stroke="var(--color-lime)" fill="var(--color-lime)" fillOpacity={0.2} strokeWidth="1.5" />
                          <rect x="344" y="44" width="12" height="12" stroke="var(--color-lime)" fill="var(--color-lime)" fillOpacity={0.2} strokeWidth="1.5" />
                          <rect x="344" y="194" width="12" height="12" stroke="var(--color-lime)" fill="var(--color-lime)" fillOpacity={0.2} strokeWidth="1.5" />
                          <rect x="144" y="194" width="12" height="12" stroke="var(--color-lime)" fill="var(--color-lime)" fillOpacity={0.2} strokeWidth="1.5" />
                        </svg>

                        <div className="absolute top-8 left-8 bg-black/60 dark:bg-black/80 border border-lime/30 rounded-lg px-2.5 py-1 text-[9px] font-mono text-zinc-900 dark:text-white font-bold shadow-md backdrop-blur-xs flex items-center gap-1.5 animate-pulse">
                          <div className="w-1.5 h-1.5 rounded-full bg-lime" />
                          <span>SLAB S1 (THK: 200mm)</span>
                        </div>

                        <div className="absolute bottom-10 right-8 bg-black/60 dark:bg-black/80 border border-lime/30 rounded-lg px-2.5 py-1 text-[9px] font-mono text-zinc-900 dark:text-white font-bold shadow-md backdrop-blur-xs flex items-center gap-1.5 animate-pulse">
                          <div className="w-1.5 h-1.5 rounded-full bg-lime" />
                          <span>COL C1 (400x400)</span>
                        </div>

                        <motion.div
                          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-lime to-transparent shadow-[0_0_12px_var(--color-lime)]"
                          animate={{ top: ["0%", "100%", "0%"] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    key="step-rvt"
                    initial={{ opacity: 0, scale: 0.96, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -15 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                  >
                    <div className="bg-white/65 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl aspect-[16/10] overflow-hidden flex items-center justify-center p-8 relative shadow-xl backdrop-blur-md">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in srgb,var(--color-lime)_6%,transparent),transparent_60%)] pointer-events-none" />
                      <div className="w-full h-full relative border border-zinc-200 dark:border-zinc-800/60 rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 opacity-10 dark:opacity-5" style={{
                          backgroundImage: `linear-gradient(color-mix(in srgb, var(--color-lime) 15%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-lime) 15%, transparent) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                          transform: "rotateX(60deg) rotateZ(45deg) scale(1.8)",
                          transformOrigin: "center center"
                        }} />

                        <svg viewBox="0 0 400 250" className="w-[85%] h-[85%] relative z-10 text-zinc-900 dark:text-zinc-300">
                          <g stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3">
                            <line x1="50" y1="200" x2="350" y2="200" />
                            <line x1="200" y1="50" x2="200" y2="235" />
                          </g>

                          <motion.g
                            initial={{ y: 80, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <line x1="100" y1="140" x2="100" y2="190" stroke="currentColor" strokeWidth="2.5" />
                            <polygon points="97,140 103,140 103,190 97,190" fill="var(--color-lime)" fillOpacity={0.2} />
                            <line x1="300" y1="140" x2="300" y2="190" stroke="currentColor" strokeWidth="2.5" />
                            <polygon points="297,140 303,140 303,190 297,190" fill="var(--color-lime)" fillOpacity={0.2} />
                            <line x1="200" y1="170" x2="200" y2="220" stroke="currentColor" strokeWidth="2.5" />
                            <polygon points="197,170 203,170 203,220 197,220" fill="var(--color-lime)" fillOpacity={0.2} />
                          </motion.g>

                          <motion.g
                            initial={{ y: -60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1.2, delay: 0.4, repeat: Infinity, repeatDelay: 2, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <line x1="100" y1="140" x2="200" y2="170" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                            <line x1="200" y1="170" x2="300" y2="140" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                          </motion.g>

                          <motion.g
                            initial={{ scale: 0.85, y: -100, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            transition={{ duration: 1.2, delay: 0.8, repeat: Infinity, repeatDelay: 2, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <polygon points="200,75 310,120 200,165 90,120" fill="var(--color-lime)" fillOpacity={0.18} stroke="currentColor" strokeWidth="2.5" />
                            <polygon points="90,120 200,165 200,173 90,128" fill="var(--color-lime)" fillOpacity={0.1} stroke="currentColor" strokeWidth="1.5" />
                            <polygon points="200,165 310,120 310,128 200,173" fill="var(--color-lime)" fillOpacity={0.06} stroke="currentColor" strokeWidth="1.5" />
                          </motion.g>
                        </svg>

                        <div className="absolute bottom-4 left-4 bg-zinc-950/80 border border-lime/30 rounded-xl px-3 py-1.5 text-[10px] font-mono text-zinc-900 dark:text-white font-black shadow-lg flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-300 animate-spin-slow" />
                          <span>3D Model: Generation Complete</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* MOBILE LAYOUT (Stacked and Tap-based) */}
          <div className="block lg:hidden space-y-4">

            {/* Horizontal tab headers */}
            <div className="flex gap-2 border-b border-zinc-250 dark:border-zinc-850 pb-2 overflow-x-auto scrollbar-none">
              {[
                "1. Upload",
                "2. Parse",
                "3. Generate"
              ].map((tabName, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleStepSelect(idx)}
                    className={`px-4 py-2 text-xs font-black font-sans rounded-xl shrink-0 transition-colors ${isActive
                      ? "bg-lime text-zinc-950"
                      : "text-zinc-500 hover:text-zinc-850 dark:hover:text-white"
                      }`}
                  >
                    {tabName}
                  </button>
                );
              })}
            </div>

            {/* Mobile Graphic Viewport */}
            <div className="relative aspect-[16/10] w-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div
                    key="mobile-upload"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35 }}
                    className="w-full h-full"
                  >
                    <div className="bg-white/65 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl h-full w-full overflow-hidden flex items-center justify-center p-6 relative shadow-md backdrop-blur-md">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in srgb,var(--color-lime)_5%,transparent),transparent_60%)] pointer-events-none" />
                      <div className="relative w-full max-w-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/85 dark:bg-zinc-950/70 p-4 flex flex-col items-center justify-center shadow-sm">
                        <div className="relative mb-3">
                          <div className="absolute inset-0 rounded-full bg-lime/10 animate-ping opacity-75" />
                          <div className="relative w-12 h-12 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center text-zinc-900 dark:text-zinc-300">
                            <Upload className="w-5 h-5" />
                          </div>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-105">Upload structural PDF</h4>
                        <div className="w-full mt-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-lg p-2.5 flex items-center gap-2.5">
                          <div className="w-6.5 h-6.5 rounded bg-lime/10 border border-lime/20 flex items-center justify-center text-zinc-900 dark:text-zinc-300 shrink-0">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                              <span className="text-[10px] font-bold font-mono text-zinc-850 dark:text-zinc-200 truncate">2D_Slab_Layout.pdf</span>
                            </div>
                            <div className="w-full h-0.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-lime rounded-full w-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 1 && (
                  <motion.div
                    key="mobile-parse"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35 }}
                    className="w-full h-full"
                  >
                    <div className="bg-white/65 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl h-full w-full overflow-hidden flex items-center justify-center p-6 relative shadow-md backdrop-blur-md">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in srgb,var(--color-lime)_3%,transparent),transparent_70%)] pointer-events-none" />
                      <div className="w-full h-full relative border border-zinc-200 dark:border-zinc-800/60 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 overflow-hidden p-4 flex items-center justify-center">
                        <svg viewBox="0 0 400 250" className="w-full h-full text-zinc-350 dark:text-zinc-800">
                          <g stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5">
                            <line x1="50" y1="20" x2="50" y2="230" />
                            <line x1="150" y1="20" x2="150" y2="230" />
                            <line x1="250" y1="20" x2="250" y2="230" />
                            <line x1="350" y1="20" x2="350" y2="230" />
                            <line x1="20" y1="50" x2="380" y2="50" />
                            <line x1="20" y1="130" x2="380" y2="130" />
                            <line x1="20" y1="200" x2="380" y2="200" />
                          </g>
                          <path d="M50,50 L350,50 L350,200 L150,200 L150,130 L50,130 Z" stroke="currentColor" fill="none" strokeWidth="1" />
                          <motion.path
                            d="M50,50 L350,50 L350,200 L150,200 L150,130 L50,130 Z"
                            stroke="var(--color-lime)"
                            fill="var(--color-lime)"
                            fillOpacity={0.06}
                            strokeWidth="2"
                            strokeDasharray="1000"
                            animate={{ strokeDashoffset: [1000, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          />
                        </svg>
                        <div className="absolute top-4 left-4 bg-black/70 border border-lime/30 rounded px-1.5 py-0.5 text-[8px] font-mono text-zinc-900 dark:text-white font-bold">
                          <span>Parsing Layout...</span>
                        </div>
                        <motion.div
                          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-lime to-transparent shadow-[0_0_8px_var(--color-lime)]"
                          animate={{ top: ["0%", "100%", "0%"] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    key="mobile-rvt"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35 }}
                    className="w-full h-full"
                  >
                    <div className="bg-white/65 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl h-full w-full overflow-hidden flex items-center justify-center p-6 relative shadow-md backdrop-blur-md">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in srgb,var(--color-lime)_6%,transparent),transparent_60%)] pointer-events-none" />
                      <div className="w-full h-full relative border border-zinc-200 dark:border-zinc-800/60 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 opacity-5" style={{
                          backgroundImage: `linear-gradient(color-mix(in srgb, var(--color-lime) 15%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-lime) 15%, transparent) 1px, transparent 1px)`,
                          backgroundSize: "15px 15px",
                          transform: "rotateX(60deg) rotateZ(45deg) scale(1.8)",
                          transformOrigin: "center center"
                        }} />
                        <svg viewBox="0 0 400 250" className="w-[80%] h-[80%] relative z-10 text-zinc-900 dark:text-zinc-300">
                          <g stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3">
                            <line x1="50" y1="200" x2="350" y2="200" />
                          </g>
                          <motion.g
                            initial={{ y: 80, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <line x1="100" y1="140" x2="100" y2="190" stroke="currentColor" strokeWidth="2.5" />
                            <line x1="300" y1="140" x2="300" y2="190" stroke="currentColor" strokeWidth="2.5" />
                          </motion.g>
                          <motion.g
                            initial={{ scale: 0.85, y: -100, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            transition={{ duration: 1.2, delay: 0.8, repeat: Infinity, repeatDelay: 2, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <polygon points="200,75 310,120 200,165 90,120" fill="var(--color-lime)" fillOpacity={0.18} stroke="currentColor" strokeWidth="2.5" />
                          </motion.g>
                        </svg>
                        <div className="absolute bottom-3 left-3 bg-zinc-950/80 border border-lime/30 rounded-lg px-2 py-0.5 text-[8px] font-mono text-zinc-900 dark:text-white font-black shadow-sm">
                          <span>3D Generated</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile active step text */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
              {[
                {
                  step: 1,
                  tag: "Upload Document",
                  title: "Upload flat structural PDF",
                  desc: "Drop your 2D structural drawings into the secure web upload interface. The platform supports standard BIM sheets and exports from CAD setups instantly."
                },
                {
                  step: 2,
                  tag: "Computer Vision Parse",
                  title: "Identify lines and annotations",
                  desc: "Deep learning models segment hatches, outline walls, measure grid spans, and locate structural annotation labels automatically."
                },
                {
                  step: 3,
                  tag: "3D RVT Generation",
                  title: "Generate native 3D BIM model",
                  desc: "Slabs, beam grids, walls, and structural columns assemble directly on the coordinates, creating native Revit or IFC models ready for coordination."
                }
              ].map((item, idx) => {
                if (activeStep !== idx) return null;
                return (
                  <div key={idx} className="space-y-2">
                    <span className="text-zinc-950 dark:text-white font-sans text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                      Step {item.step} — {item.tag}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">{item.title}</h3>
                    <p className="text-zinc-650 dark:text-zinc-400 text-sm leading-relaxed mt-2">{item.desc}</p>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
         6. CAPABILITY SPOTLIGHT & CUSTOM MODULE CARDS
         ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-32 px-6 bg-[#FAFAF8] dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="space-y-4">

            <h2 className="text-4xl sm:text-5xl font-black text-zinc-950 dark:text-white leading-tight">Module Specifications</h2>
          </div>

          <CapabilitySpotlightCard />

          {/* Planned modules grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Beam & column mapping", desc: "Maps structural framing coordinates and support points." },
              { title: "Wall conversion", desc: "Constructs 3D load bearing wall systems with openings." },
              { title: "Ramp and stair geometry", desc: "Extrudes angled floor slab segments automatically." },
              { title: "Foundation elements", desc: "Traces pads, pile caps, and strip footings from drawings." }
            ].map((module, idx) => (
              <HoverTiltCard key={idx} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 shadow-sm relative group hover:border-lime/20 transition-all duration-300">

                <h4 className="font-bold text-zinc-950 dark:text-white mt-4 text-base">{module.title}</h4>
                <p className="text-xs text-zinc-450 dark:text-zinc-550 mt-2 leading-relaxed">{module.desc}</p>
              </HoverTiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
         7. WORKFLOW PIPELINE (ISOMETRIC REDESIGN)
         ═══════════════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white border-y border-zinc-200 dark:border-zinc-850 relative overflow-hidden">
        <IsometricWorkflow />
      </section>

      {/* ═══════════════════════════════════════════════════════
         8. COMPARISON SECTION (STANDARD STRUCTURE PRESERVED)
         ═══════════════════════════════════════════════════════ */}
      <div ref={comparisonRef}>
        <ComparisonGrid
          sectionTitle="Why choose Auto Conversion 2D to 3D"
          card1={{
            title: "Manual Tracing",
            subtitle: "Manual polyline tracing",
            features: [
              "1–2 weeks per drawing set",
              "Labor-intensive, error-prone",
              "Modeller time wasted on conversion",
              "No audit trail of conversion process.",
            ],
            metric: { value: "1-2", label: "WEEKS" },
            button: { text: "Traditional Route", href: "/#" },
          }}
          card2={{
            title: "Auto Conversion",
            subtitle: "Auto Conversion 2D to 3D",
            features: [
              "1–2 days per drawing set",
              "Fully automated, consistent",
              "Modeller time freed for coordination work",
              "Conversion logged and auditable.",
            ],
            metric: { value: "1-2", label: "DAYS" },
            button: { text: "Book A Demo", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
          }}
          card3={{
            title: "Other Tools",
            subtitle: "Other PDF-to-3D tools",
            features: [
              "Require manual validation at every step",
              "Still need modeller intervention",
              "Work only for simple geometry",
              "Slab automation is the only complete, production-ready solution on the market.",
            ],
            metric: { value: "UNRELIABLE", label: "FAST /" },
            button: { text: "Other Tools", href: "#" },
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════
         9. PRICING & SIDEBAR SYSTEM
         ═══════════════════════════════════════════════════════ */}
      <section ref={pricingRef} className="py-16 md:py-32 px-6 bg-[#FAFAF8] dark:bg-zinc-950">
        <div className="space-y-16 max-w-4xl mx-auto text-left">
          <div className="space-y-8">
            <div>
              <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block mb-2">Investment</span>
              <h2 className="text-3xl sm:text-5xl font-black text-zinc-955 dark:text-white">Pricing &amp; Availability</h2>
            </div>

            {/* pricing details card */}
            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 shadow-xl relative overflow-hidden group">
              <div className="relative space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="text-2xl font-bold text-zinc-955 dark:text-white">
                      Per-module customisation
                    </h4>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <span className="text-[10px] text-zinc-400 block uppercase font-mono tracking-wider">Starting at</span>
                    <span className="text-5xl font-black tracking-tight text-zinc-950 dark:text-white font-mono">
                      $2,200
                    </span>
                    <span className="text-xs text-zinc-400 block font-semibold">/ module</span>
                  </div>
                </div>
                <p className="text-zinc-655 dark:text-zinc-400 text-sm leading-relaxed">
                  Pricing structure is built on a per-module customization model of USD 2,200 per customized module, allowing custom mapping configurations for beams, columns, or ramps. The slab module is currently available standalone.
                </p>
                <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-850 pt-4">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Slab automation module ready for immediate implementation</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16 border-t border-zinc-200 dark:border-zinc-800">
            {/* Desktop Quick Facts Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-8 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-xl border-b border-zinc-100 dark:border-zinc-800 pb-4 text-zinc-900 dark:text-white uppercase">Quick Facts</h3>
                <div className="space-y-5 pt-4">
                  {[
                    { label: "Stage", value: "Design" },
                    { label: "Best For", value: "BIM modellers, structural engineers, architects" },
                    { label: "Regions", value: "Australia (primary)" },
                    { label: "Time to Implement", value: "2–4 weeks per module" },
                    { label: "Pricing", value: "USD 2,200/module" }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 last:border-0 gap-4">
                      <span className="text-zinc-500 font-semibold shrink-0">{item.label}</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                asChild
                className="w-full rounded-2xl py-7 font-bold shadow-xl border-0 bg-lime text-black hover:bg-lime/90 cursor-pointer mt-8"
              >
                <a href="/#">
                  Buy Products <ArrowRight />
                </a>
              </Button>
            </motion.div>

            {/* Related products */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-3xl p-8 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-6 font-mono">
                  Related Products
                </h4>
                <ul className="space-y-4 text-sm font-semibold">
                  {[
                    { href: "/learnmore/hand-drawn-to-autocad", label: "Hand Drawn to AutoCAD", tag: "Sketch to CAD" },
                    { href: "/learnmore/revit-to-boq", label: "Revit to BOQ", tag: "BOQ automation" },
                    { href: "/learnmore/auto-reinforcement", label: "Auto Reinforcement Plugin", tag: "Rebar schedule" }
                  ].map((item, idx) => (
                    <li key={idx}>
                      <Link
                        href={item.href}
                        className="group flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-855 last:border-0"
                      >
                        <span className="font-bold text-zinc-900 dark:text-white group-hover:text-zinc-650 dark:group-hover:text-zinc-300 transition-colors">
                          {item.label}
                        </span>
                        <span className="text-xs text-zinc-450 dark:text-zinc-550 font-medium group-hover:translate-x-1.5 transition-transform">
                          {item.tag} →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 mt-4 border-t border-zinc-150 dark:border-zinc-850">
                <Link
                  href="/learnmore"
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  View full suite <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
         10. FAQ ACCORDION
         ═══════════════════════════════════════════════════════ */}
      <section ref={faqRef} className="py-16 md:py-32 px-6 bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-850">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block">Got Questions?</span>
            <h2 className="text-4xl sm:text-5xl font-black text-zinc-950 dark:text-white leading-tight">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What file formats does it accept?",
                a: "PDF is primary. We also accept DWG, DXF, and TIFF images of drawings. File must be 2D orthographic (not perspective)."
              },
              {
                q: "Can it handle complex slab geometry?",
                a: "Yes. Slabs with multiple depths, slopes, openings, and hatched areas are all recognized. Best results with clear line work and proper dimensioning."
              },
              {
                q: "What if the 2D drawing has missing dimensions?",
                a: "The tool estimates dimensions from scale and nearby measurements. Manual review and correction can be requested for critical elements."
              },
              {
                q: "Does it work with hand-drawn structural drawings?",
                a: "Not ideally. Best results are with CAD-produced (clean) drawings. Hand Drawn to AutoCAD can convert hand sketches to CAD first."
              },
              {
                q: "Can we choose output format (Revit, IFC, DWG)?",
                a: "Currently exports to Revit native format (RVT). IFC and DWG exports available as custom implementation (USD 500 additional)."
              }
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                className="bg-[#FAFAF8] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer group"
                >
                  <span className="font-bold text-zinc-900 dark:text-white pr-4 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: activeFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 text-zinc-450 dark:text-zinc-500"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      key="faq-anim-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-zinc-650 dark:text-zinc-400 text-sm leading-relaxed border-t border-zinc-150/40 dark:border-zinc-850/40 pt-4">
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

      {/* ═══════════════════════════════════════════════════════
         11. FOOTER CTA - EMOTIONAL FULL SCREEN CINEMA CARD
         ═══════════════════════════════════════════════════════ */}
      <section ref={ctaRef} className="py-24 md:py-40 px-6 bg-[#FAFAF8] dark:bg-zinc-950 relative overflow-hidden border-t border-zinc-200 dark:border-zinc-850">

        {/* Infinite slow moving grid background */}
        <div
          className="absolute inset-0 opacity-20 dark:opacity-5 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
            backgroundSize: "45px 45px",
            animation: "pulse-grid 15s linear infinite"
          }}
        />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl lg:text-7.5xl font-black tracking-tight text-zinc-950 dark:text-white leading-tight"
          >
            Stop drawing the same
            <br />
            <span className="text-zinc-500 dark:text-zinc-400">geometry twice.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-zinc-600 dark:text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            See how Auto Conversion 2D to 3D cuts modelling time in half.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-6 flex justify-center"
          >
            <MagneticButton
              href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
              className="rounded-2xl px-12 h-14 font-black shadow-xl bg-[var(--color-lime)] text-zinc-950 hover:bg-[var(--color-lime)]/90 cursor-pointer animate-pulse"
            >
              Book a demo →
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Embedded video player lightbox overlay */}
      <VideoLightbox
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl={demoFolderUrl}
      />

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -40;
          }
        }
        @keyframes pulse-grid {
          0% { background-position: 0 0; }
          100% { background-position: 45px 45px; }
        }
      `}</style>
    </div>
  );
}
