"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

        {/* ─── MAIN WORKFLOW INTERACTIVE AREA (Centered steps list) ─── */}
        <div className="flex-1 max-w-xl w-full mx-auto flex flex-col justify-center items-center z-10 my-2 overflow-visible">
          
          <div className="flex flex-col space-y-4 border-l-2 border-zinc-200 dark:border-zinc-800 pl-8 py-2 w-full">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-450 dark:text-zinc-550 mb-2">
              Workflow Navigation
            </span>
            {steps.map((step, idx) => {
              const highlighted = isStepHighlighted(idx);
              const isActive = activeIndex === idx;

              return (
                <button
                  key={step.id}
                  onClick={() => scrollToStep(idx)}
                  className={`text-left group flex items-start gap-4 py-2 cursor-pointer transition-all duration-300 w-full focus:outline-none ${
                    isActive
                      ? "text-zinc-950 dark:text-white scale-[1.01]"
                      : highlighted
                      ? "text-zinc-800 dark:text-zinc-300"
                      : "text-zinc-400 dark:text-zinc-650 hover:text-zinc-600 dark:hover:text-zinc-400"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black font-mono shrink-0 transition-all border-2 ${
                      isActive
                        ? "bg-lime text-black border-lime shadow-[0_0_12px_rgba(163,230,53,0.4)]"
                        : highlighted
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800"
                    }`}
                  >
                    {highlighted && !isActive ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      `0${step.id}`
                    )}
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`text-sm font-bold uppercase tracking-wider transition-colors ${
                        isActive
                          ? "text-zinc-955 dark:text-white"
                          : "text-zinc-700 dark:text-zinc-400"
                      }`}
                    >
                      {step.title}
                    </h4>
                    
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="text-xs text-zinc-650 dark:text-zinc-450 leading-relaxed font-medium mt-1 max-w-md overflow-hidden"
                        >
                          {step.desc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              );
            })}
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

    </div>
  );
}
