"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

// Floating Particle types
interface Particle {
  id: number;
  type: "helmet" | "ibeam" | "screw" | "blueprint" | "level" | "crane";
  x: string;
  y: string;
  delay: number;
  scale: number;
}

const particles: Particle[] = [
  { id: 1, type: "helmet", x: "8%", y: "20%", delay: 0, scale: 0.9 },
  { id: 2, type: "ibeam", x: "88%", y: "15%", delay: 2, scale: 1.1 },
  { id: 3, type: "screw", x: "82%", y: "82%", delay: 1, scale: 0.85 },
  { id: 4, type: "blueprint", x: "12%", y: "85%", delay: 3, scale: 1.0 },
  { id: 5, type: "level", x: "48%", y: "8%", delay: 1.5, scale: 0.95 },
  { id: 6, type: "crane", x: "92%", y: "55%", delay: 2.5, scale: 1.05 },
];

const steps = [
  {
    id: 1,
    title: "Analyze Project Scope",
    desc: "Natively parses the 3D model, extracting component IDs, materials, and dimensional parameters.",
    threshold: 0.0,
  },
  {
    id: 2,
    title: "Model Validation",
    desc: "Validates elements (slabs, columns, piles, walls) and flags anomalies or inconsistencies before takeoff.",
    threshold: 0.25,
  },
  {
    id: 3,
    title: "Itemization & Mapping",
    desc: "Aligns the validated component data with standard rules of measurement such as SMM7 and POMI.",
    threshold: 0.50,
  },
  {
    id: 4,
    title: "Understanding BOQ Generation",
    desc: "Applies local historical rate card pricing structures and aggregates quantities into formatted sheets.",
    threshold: 0.75,
  },
  {
    id: 5,
    title: "Mapping the Value Proposition",
    desc: "Compiles a fully priced, error-free Bill of Quantities, saving weeks of manual estimation work.",
    threshold: 0.95,
  },
];

export default function RevitToBoqWorkflow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const [tipPos, setTipPos] = useState({ x: 500, y: 300 });

  // Measure scroll progress relative to the viewport height within the sticky container
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollHeight = rect.height - windowHeight;
      if (totalScrollHeight <= 0) return;

      const scrolled = -rect.top;
      // Clamp scroll progress between 0 and 1
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollHeight));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Measure path length
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  // Fallback path length measurement and tip position tracking
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    try {
      const length = pathLength || path.getTotalLength();
      if (pathLength === 0 && length > 0) {
        setPathLength(length);
      }
      
      const currentPointLength = scrollProgress * length;
      const pt = path.getPointAtLength(currentPointLength);
      setTipPos({ x: pt.x, y: pt.y });
    } catch (e) {
      // SVG path may not be fully loaded
    }
  }, [scrollProgress, pathLength]);

  // Click on a step in the sidebar to scroll to it
  const scrollToStep = (stepIndex: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScrollHeight = rect.height - windowHeight;
    const targetThreshold = steps[stepIndex].threshold;

    const containerTop = window.scrollY + rect.top;
    const targetScrollY = containerTop + targetThreshold * totalScrollHeight;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  };

  // Determine active states
  const isStepHighlighted = (index: number) => {
    return scrollProgress >= steps[index].threshold;
  };

  const activeIndex = steps.reduce(
    (acc, step, idx) => (scrollProgress >= step.threshold ? idx : acc),
    0
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[300vh] bg-gradient-to-br from-[#E8F3F6] via-[#F4F9FA] to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-955 transition-colors duration-500"
    >
      {/* ─── STICKY WRAPPER ─── */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between py-6 px-6">
        
        {/* Floating background particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute select-none pointer-events-none opacity-40 dark:opacity-20 animate-float"
              style={{
                left: p.x,
                top: p.y,
                transform: `scale(${p.scale})`,
                animation: `float ${8 + (p.id % 3) * 3}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`,
              }}
            >
              {p.type === "helmet" && (
                <svg viewBox="0 0 24 24" className="w-12 h-12 text-amber-500 fill-amber-400">
                  <path d="M4 14 A 8 8 0 0 1 20 14 Z" />
                  <path d="M2 13 H 22 V 15 H 2 Z" fill="currentColor" />
                  <path d="M10 6 H 14 V 11 H 10 Z" fill="currentColor" opacity="0.8" />
                </svg>
              )}
              {p.type === "ibeam" && (
                <svg viewBox="0 0 24 24" className="w-16 h-16 text-zinc-400 dark:text-zinc-650 fill-current">
                  <rect x="4" y="2" width="16" height="3" />
                  <rect x="10" y="5" width="4" height="14" />
                  <rect x="4" y="19" width="16" height="3" />
                </svg>
              )}
              {p.type === "screw" && (
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-zinc-400 dark:text-zinc-500 fill-none stroke-current" strokeWidth="2">
                  <path d="M 6,4 H 18 V 6 H 6 Z" fill="currentColor" />
                  <path d="M 10,6 V 18 L 12,21 L 14,18 V 6" strokeLinecap="round" />
                  <line x1="9" y1="9" x2="15" y2="9" />
                  <line x1="9" y1="12" x2="15" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              )}
              {p.type === "blueprint" && (
                <svg viewBox="0 0 24 24" className="w-12 h-12 text-blue-500 dark:text-blue-600 fill-none stroke-current" strokeWidth="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M 2,8 L 12,14 L 22,8" />
                  <line x1="6" y1="12" x2="18" y2="12" strokeDasharray="2 2" opacity="0.6" />
                  <line x1="6" y1="16" x2="18" y2="16" strokeDasharray="2 2" opacity="0.6" />
                </svg>
              )}
              {p.type === "level" && (
                <svg viewBox="0 0 24 24" className="w-14 h-8 text-emerald-500 fill-none stroke-current" strokeWidth="1.5">
                  <rect x="2" y="8" width="20" height="8" rx="1" fill="currentColor" fillOpacity="0.1" />
                  <rect x="9" y="11" width="6" height="2" rx="0.5" stroke="currentColor" />
                  <circle cx="12" cy="12" r="0.75" fill="currentColor" className="animate-pulse" />
                </svg>
              )}
              {p.type === "crane" && (
                <svg viewBox="0 0 24 24" className="w-16 h-16 text-yellow-600 fill-none stroke-current" strokeWidth="1.5">
                  <line x1="6" y1="22" x2="6" y2="4" strokeWidth="2" />
                  <line x1="6" y1="22" x2="10" y2="22" />
                  <line x1="2" y1="4" x2="22" y2="4" strokeWidth="2" />
                  <rect x="2" y="4" width="2" height="4" fill="currentColor" />
                  <line x1="18" y1="4" x2="18" y2="14" />
                  <path d="M 18,14 Q 17,16 16,16" />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* ─── HEADER AREA ─── */}
        <div className="text-center space-y-1.5 z-10">
          <span className="text-[10px] sm:text-xs font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest block">
            Automated 5-Step Takeoff Sequence
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-955 dark:text-white leading-tight uppercase">
            REVIT TO BOQ
          </h2>
          <div className="w-16 h-1 bg-yellow-400 mx-auto rounded-full" />
        </div>

        {/* ─── MAIN WORKFLOW INTERACTIVE AREA ─── */}
        <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 my-2 overflow-visible">
          
          {/* LEFT COLUMN: Sidebar Navigation */}
          <div className="lg:col-span-3 hidden lg:flex flex-col space-y-3 border-l border-zinc-200 dark:border-zinc-800 pl-6 py-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-450 dark:text-zinc-500 mb-1">
              Workflow Navigation
            </span>
            {steps.map((step, idx) => {
              const highlighted = isStepHighlighted(idx);
              const isActive = activeIndex === idx;

              return (
                <button
                  key={step.id}
                  onClick={() => scrollToStep(idx)}
                  className={`text-left group flex items-start gap-3 py-1.5 cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "text-zinc-950 dark:text-white scale-[1.02]"
                      : highlighted
                      ? "text-zinc-800 dark:text-zinc-300"
                      : "text-zinc-400 dark:text-zinc-650 hover:text-zinc-600 dark:hover:text-zinc-400"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black font-mono shrink-0 transition-all border ${
                      isActive
                        ? "bg-lime text-black border-lime shadow-[0_0_12px_rgba(163,230,53,0.4)]"
                        : highlighted
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800"
                    }`}
                  >
                    {highlighted && !isActive ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      `0${step.id}`
                    )}
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                        isActive
                          ? "text-zinc-950 dark:text-white"
                          : "text-zinc-700 dark:text-zinc-400"
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-[10px] text-zinc-450 dark:text-zinc-550 leading-relaxed font-medium mt-0.5 max-w-[200px]">
                      {step.id === 1 ? "Start" : step.id === 5 ? "Complete" : `Step 0${step.id}`}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* CENTER/RIGHT COLUMN: The Infinity Loop Path */}
          <div className="lg:col-span-9 flex flex-col items-center justify-center relative w-full h-full overflow-visible">
            
            {/* Aspect container cropped vertically to aspect-[5/2] to prevent clipping */}
            <div className="relative w-full max-w-[850px] aspect-[5/2] overflow-visible">
              
              {/* Responsive overlay step text inside loop spaces (Desktop/Tablet only) */}
              <div className="absolute inset-0 pointer-events-none select-none z-20 hidden sm:block">
                {steps.map((step, idx) => {
                  const highlighted = isStepHighlighted(idx);
                  const isActive = activeIndex === idx;

                  // Define positioning offsets based on step indices (relative to the cropped y = 100 to 500 range)
                  let styleObj = {};
                  if (idx === 0) styleObj = { left: "32.5%", top: "32.5%" };
                  else if (idx === 1) styleObj = { left: "32.5%", top: "67.5%" };
                  else if (idx === 2) styleObj = { left: "50%", top: "30.0%" };
                  else if (idx === 3) styleObj = { left: "67.5%", top: "32.5%" };
                  else if (idx === 4) styleObj = { left: "67.5%", top: "67.5%" };

                  return (
                    <div
                      key={step.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 w-44 text-center transition-all duration-500"
                      style={styleObj}
                    >
                      <span
                        className={`text-xs font-black uppercase tracking-wider block transition-all duration-300 ${
                          isActive
                            ? "text-black dark:text-white scale-[1.08] font-black"
                            : highlighted
                            ? "text-zinc-900 dark:text-zinc-100 opacity-90 font-bold"
                            : "text-zinc-400 dark:text-zinc-600 opacity-55 font-semibold"
                        }`}
                        style={{
                          textShadow: isActive
                            ? "0 0 10px rgba(255,255,255,1), 0 0 20px rgba(255,255,255,0.8)"
                            : "none",
                        }}
                      >
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* The SVG Artwork (viewBox cropped from y=100 to y=500, height = 400) */}
              <svg
                viewBox="0 100 1000 400"
                className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.05)] overflow-visible"
              >
                <defs>
                  {/* Metallic Slate / Chrome linear gradient for the track base */}
                  <linearGradient id="track-metallic" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#64748b" />
                    <stop offset="30%" stopColor="#94a3b8" />
                    <stop offset="50%" stopColor="#cbd5e1" />
                    <stop offset="70%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>

                  {/* Vibrant Lime to Emerald gradient for the flowing liquid */}
                  <linearGradient id="liquid-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a3e635" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  
                  {/* Lime neon glow */}
                  <filter id="lime-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  
                  {/* Node point pulse gradient */}
                  <radialGradient id="lime-node-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#a3e635" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* THE INFINITY TRACK */}
                {/* Layer 1: Ground shadow */}
                <path
                  d="M 500,300 C 350,150 150,150 150,300 C 150,450 350,450 500,300 C 650,150 850,150 850,300 C 850,450 650,450 500,300 Z"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="38"
                  strokeLinecap="round"
                  opacity="0.08"
                />

                {/* Layer 2: Core Metallic Slate Track */}
                <path
                  d="M 500,300 C 350,150 150,150 150,300 C 150,450 350,450 500,300 C 650,150 850,150 850,300 C 850,450 650,450 500,300 Z"
                  fill="none"
                  stroke="url(#track-metallic)"
                  strokeWidth="32"
                  strokeLinecap="round"
                />

                {/* Layer 3: Recessed center groove */}
                <path
                  d="M 500,300 C 350,150 150,150 150,300 C 150,450 350,450 500,300 C 650,150 850,150 850,300 C 850,450 650,450 500,300 Z"
                  fill="none"
                  stroke="#18181b"
                  strokeWidth="14"
                  strokeLinecap="round"
                  className="stroke-slate-200 dark:stroke-zinc-900 transition-colors"
                />

                {/* Layer 4: DYNAMIC LIQUID FILL PATH */}
                <path
                  ref={pathRef}
                  d="M 500,300 C 350,150 150,150 150,300 C 150,450 350,450 500,300 C 650,150 850,150 850,300 C 850,450 650,450 500,300 Z"
                  fill="none"
                  stroke="url(#liquid-gradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={pathLength || 2500}
                  strokeDashoffset={pathLength ? pathLength - scrollProgress * pathLength : 2500}
                  filter="url(#lime-glow)"
                  className="transition-all duration-75 ease-out"
                />

                {/* Layer 5: Neon running pulse overlay (Only active on filled area) */}
                {scrollProgress > 0 && (
                  <path
                    d="M 500,300 C 350,150 150,150 150,300 C 150,450 350,450 500,300 C 650,150 850,150 850,300 C 850,450 650,450 500,300 Z"
                    fill="none"
                    stroke="#a3e635"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="20, 20"
                    strokeDashoffset={pathLength ? pathLength - scrollProgress * pathLength : 2500}
                    className="animate-neon-flow select-none pointer-events-none"
                  />
                )}

                {/* STEP NODES */}
                {/* Step 1 Node: (300, 230) */}
                <g className="cursor-pointer" onClick={() => scrollToStep(0)}>
                  <circle cx="300" cy="230" r="16" fill="url(#lime-node-glow)" className={activeIndex === 0 ? "animate-pulse" : ""} />
                  <circle cx="300" cy="230" r="6" fill={isStepHighlighted(0) ? "#a3e635" : "#64748b"} stroke="#fff" strokeWidth="1.5" className="transition-all duration-300" />
                </g>

                {/* Step 2 Node: (300, 370) */}
                <g className="cursor-pointer" onClick={() => scrollToStep(1)}>
                  <circle cx="300" cy="370" r="16" fill="url(#lime-node-glow)" className={activeIndex === 1 ? "animate-pulse" : ""} />
                  <circle cx="300" cy="370" r="6" fill={isStepHighlighted(1) ? "#a3e635" : "#64748b"} stroke="#fff" strokeWidth="1.5" className="transition-all duration-300" />
                </g>

                {/* Step 3 Node: (500, 220) */}
                <g className="cursor-pointer" onClick={() => scrollToStep(2)}>
                  <circle cx="500" cy="220" r="16" fill="url(#lime-node-glow)" className={activeIndex === 2 ? "animate-pulse" : ""} />
                  <circle cx="500" cy="220" r="6" fill={isStepHighlighted(2) ? "#a3e635" : "#64748b"} stroke="#fff" strokeWidth="1.5" className="transition-all duration-300" />
                </g>

                {/* Step 4 Node: (700, 230) */}
                <g className="cursor-pointer" onClick={() => scrollToStep(3)}>
                  <circle cx="700" cy="230" r="16" fill="url(#lime-node-glow)" className={activeIndex === 3 ? "animate-pulse" : ""} />
                  <circle cx="700" cy="230" r="6" fill={isStepHighlighted(3) ? "#a3e635" : "#64748b"} stroke="#fff" strokeWidth="1.5" className="transition-all duration-300" />
                </g>

                {/* Step 5 Node: (700, 370) */}
                <g className="cursor-pointer" onClick={() => scrollToStep(4)}>
                  <circle cx="700" cy="370" r="16" fill="url(#lime-node-glow)" className={activeIndex === 4 ? "animate-pulse" : ""} />
                  <circle cx="700" cy="370" r="6" fill={isStepHighlighted(4) ? "#a3e635" : "#64748b"} stroke="#fff" strokeWidth="1.5" className="transition-all duration-300" />
                </g>

                {/* Glowing Liquid flow tip circle */}
                {scrollProgress > 0 && scrollProgress < 1 && (
                  <circle
                    cx={tipPos.x}
                    cy={tipPos.y}
                    r="8"
                    fill="#ffffff"
                    stroke="#a3e635"
                    strokeWidth="2"
                    filter="url(#lime-glow)"
                    className="select-none pointer-events-none"
                  />
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* ─── BOTTOM CONTROL AREA (Product Sandbox card centered and scaled up) ─── */}
        <div className="w-full max-w-7xl mx-auto flex justify-center z-10 pt-4 border-t border-zinc-200/50 dark:border-zinc-800">
          
          {/* Centered, Scaled-Up Glassmorphic "Book A Demo" Card */}
          <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-white/30 dark:border-zinc-800 p-5 md:p-6 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-8 w-full max-w-xl text-black dark:text-white transform transition-all duration-300 hover:scale-[1.01]">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[10px] text-zinc-950 dark:text-zinc-300 font-extrabold uppercase tracking-widest block">
                Product Sandbox
              </span>
              <h4 className="text-sm font-black uppercase text-black dark:text-white leading-tight">
                Revit extraction engine
              </h4>
              <p className="text-xs text-zinc-800 dark:text-zinc-300 font-semibold leading-normal max-w-xs">
                Initiate the fully automated BIM quantities compiler dynamically.
              </p>
            </div>
            
            <Button
              asChild
              className="bg-lime text-black hover:bg-lime/90 font-extrabold text-[11px] tracking-widest px-8 py-6 rounded-xl uppercase shadow-xl shadow-lime/25 active:scale-95 transition-all cursor-pointer shrink-0 border-0"
            >
              <a
                href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book A Demo
              </a>
            </Button>
          </div>

        </div>

      </div>

      {/* Global CSS Styles injected dynamically */}
      <style jsx global>{`
        @keyframes neon-flow {
          to {
            stroke-dashoffset: -40;
          }
        }
        .animate-neon-flow {
          animation: neon-flow 2s linear infinite;
        }

        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(4deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
        .animate-float {
          animation: float 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
