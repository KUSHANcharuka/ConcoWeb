"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    id: 1,
    title: "Assigned",
    desc: "Work is created against a defined scope with a structured task ID, then assigned to a named person by designation, with a deadline and a target productivity rate.",
    threshold: 0.0,
  },
  {
    id: 2,
    title: "In Progress",
    desc: "The live timer runs, or hours are entered manually, while the assignee logs measurement data against the task. Risk, query and revision flags can be raised at any point.",
    threshold: 0.25,
  },
  {
    id: 3,
    title: "Sent to Review",
    desc: "A formal internal gate. Technical staff review the work before it can move on, with comments and changes captured in the task activity panel.",
    threshold: 0.50,
  },
  {
    id: 4,
    title: "Submission",
    desc: "The reviewed task is packaged and submitted, with its deadline tracked by the colour-coded indicator: green on track, yellow approaching, red overdue.",
    threshold: 0.75,
  },
  {
    id: 5,
    title: "Completed",
    desc: "Signed off and closed, with the full activity trail and actual hours captured, feeding straight into productivity benchmarking for the next estimate.",
    threshold: 0.95,
  },
];

export default function PrelimWorkflow() {
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
      className="relative w-full h-[300vh] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-955 text-white transition-colors duration-500"
    >
      {/* ─── STICKY WRAPPER ─── */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between py-6 px-6">

        {/* ─── HEADER AREA ─── */}
        <div className="text-center space-y-1.5 z-10">
          <span className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest block">
            Task Lifecycle
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight uppercase">
            PRELIM WORKFLOW
          </h2>
          <div className="w-16 h-1 bg-lime mx-auto rounded-full" />
        </div>

        {/* ─── MAIN WORKFLOW INTERACTIVE AREA ─── */}
        <div className="flex-1 max-w-xl w-full mx-auto flex flex-col justify-center items-center z-10 my-2 overflow-visible">

          <div className="flex flex-col space-y-4 border-l-2 border-zinc-800 pl-8 py-2 w-full">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 mb-2">
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
                      ? "text-white scale-[1.01]"
                      : highlighted
                        ? "text-zinc-300"
                        : "text-zinc-600 hover:text-zinc-400"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black font-mono shrink-0 transition-all border-2 ${
                      isActive
                        ? "bg-lime text-black border-lime shadow-[0_0_12px_rgba(163,230,53,0.4)]"
                        : highlighted
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : "bg-zinc-900 text-zinc-500 border-zinc-800"
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
                          ? "text-white"
                          : "text-zinc-400"
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
                          className="text-xs text-zinc-400 leading-relaxed font-medium mt-1 max-w-md overflow-hidden"
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

        {/* ─── BOTTOM CONTROL AREA ─── */}
        <div className="w-full max-w-7xl mx-auto flex justify-center z-10 pt-4 border-t border-zinc-800">
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-5 md:p-6 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-8 w-full max-w-xl text-white transform transition-all duration-300 hover:scale-[1.01]">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest block">
                Product Sandbox
              </span>
              <h4 className="text-sm font-black uppercase text-white leading-tight">
                Productivity benchmarking engine
              </h4>
              <p className="text-xs text-zinc-400 font-semibold leading-normal max-w-xs">
                See planned versus actual on every task, person and project, live.
              </p>
            </div>

            {/* Efficiency bars visual */}
            <div className="w-full sm:w-auto space-y-2.5 min-w-[200px]">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-bold">
                  <span className="text-zinc-400">Measurement L3 slab</span>
                  <span className="text-lime">91%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-lime rounded-full" style={{ width: '91%' }} />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-bold">
                  <span className="text-zinc-400">Cost plan Tower B</span>
                  <span className="text-lime">78%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-lime rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-bold">
                  <span className="text-zinc-400">Tender review Villa 9</span>
                  <span className="text-amber-400">64%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '64%' }} />
                </div>
              </div>
              <div className="pt-1.5 border-t border-zinc-800 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[9px] font-bold text-emerald-400">+12% team efficiency vs last quarter</span>
              </div>
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
