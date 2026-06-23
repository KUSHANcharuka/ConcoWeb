"use client";

import { useState, useEffect, useRef } from "react";

interface Step {
  id: number;
  number: string;
  header: string;
  body: string;
}

const steps: Step[] = [
  {
    id: 1,
    number: "01",
    header: "MODEL UPDATED IN ACC",
    body: "Architects and designers work in Autodesk Construction Cloud as normal.",
  },
  {
    id: 2,
    number: "02",
    header: "GENERATE BOQ",
    body: "Cost consultant clicks \"Generate BOQ\" directly in ACC — no exports or local files needed.",
  },
  {
    id: 3,
    number: "03",
    header: "BOQ PRODUCED",
    body: "Tool identifies all elements, measures them, and applies your firm's standard current rates.",
  },
  {
    id: 4,
    number: "04",
    header: "DESIGN CHANGES?",
    body: "When the model is updated, regenerate the BOQ instantly to see how costs have changed.",
  },
];

export default function AccToBoqWorkflow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll progress within the sticky container
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

  // Check if a step is reached by the scroll progression fill
  const isStepReached = (index: number) => {
    const nodeThresholds = [0.0, 0.33, 0.66, 0.99];
    return scrollProgress >= nodeThresholds[index];
  };

  // Determine active step (illuminated state)
  const activeIndex = steps.reduce(
    (acc, _, idx) => (isStepReached(idx) ? idx : acc),
    0
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[280vh] bg-[#F5F5F5] dark:bg-zinc-955 transition-colors duration-500 border-y border-zinc-200 dark:border-zinc-900 [--line-offset:64px] lg:[--line-offset:80px]"
    >
      {/* Sticky Section Wrapper */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center py-8 px-6">
        
        <div className="w-full max-w-4xl flex flex-col justify-between py-2">
          
          {/* Header Block */}
          <div className="text-center space-y-1.5 z-10 mb-8 md:mb-12">
            <span className="text-[10px] sm:text-xs font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-widest block">
              Workflow Timeline
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#111111] dark:text-white leading-tight uppercase">
              How It Works
            </h2>
            <div className="w-12 h-1 bg-yellow-400 dark:bg-[#FFFF00] mx-auto rounded-full mt-1.5" />
          </div>

          {/* Timeline Area */}
          <div className="relative flex flex-col gap-8 md:gap-12 py-2 overflow-visible w-full max-w-2xl mx-auto">
            
            {/* Vertical Dashed Line (Background Track) */}
            <div className="absolute left-6 lg:left-12 -translate-x-1/2 top-[32px] lg:top-[40px] bottom-[32px] lg:bottom-[40px] w-0.5 border-r-2 border-dashed border-zinc-300 dark:border-zinc-800 pointer-events-none z-0" />
            
            {/* Yellow Liquid-Fill Connector Line */}
            <div
              className="absolute left-6 lg:left-12 -translate-x-1/2 top-[32px] lg:top-[40px] w-0.5 bg-[#FFFF00] pointer-events-none z-10 transition-all duration-75 ease-out shadow-[0_0_8px_rgba(255,255,0,0.5)]"
              style={{
                height: `calc(${scrollProgress} * (100% - var(--line-offset, 80px)))`,
                minHeight: "0px",
                borderRight: "2.5px solid #FFFF00"
              }}
            />

            {steps.map((step, idx) => (
              <div
                key={step.id}
                className={`relative flex flex-col items-start w-full transition-all duration-500 pl-16 lg:pl-24 z-20 min-h-[90px] justify-center ${
                  activeIndex === idx
                    ? "opacity-100 scale-[1.01]"
                    : "opacity-35 saturate-50"
                }`}
              >
                {/* Absolute Node Badge on the line */}
                <div
                  className={`absolute left-6 lg:left-12 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-30 bg-[#F5F5F5] dark:bg-zinc-950 px-2 transition-all duration-300 border ${
                    isStepReached(idx) ? "border-[#FFFF00]" : "border-transparent"
                  } py-1.5 rounded-xl`}
                >
                  <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest leading-none">
                    STEP
                  </span>
                  <span className={`text-base font-mono font-black leading-none mt-0.5 transition-colors duration-300 ${
                    isStepReached(idx) ? "text-[#FFFF00] dark:text-[#FFFF00]" : "text-[#111111] dark:text-zinc-700"
                  }`}>
                    {step.number}
                  </span>
                </div>

                {/* Content Block */}
                <div className="w-full text-left flex flex-col items-start justify-center space-y-1 bg-white/60 dark:bg-zinc-900/30 p-4 sm:p-6 rounded-2xl border border-zinc-200/55 dark:border-zinc-800/30 hover:border-zinc-300/80 dark:hover:border-zinc-700/80 transition-colors duration-300 shadow-sm">
                  <h3 className={`text-sm sm:text-base font-black uppercase leading-tight transition-colors duration-300 ${
                    isStepReached(idx) ? "text-[#111111] dark:text-white" : "text-zinc-500 dark:text-zinc-650"
                  }`}>
                    {step.header}
                  </h3>
                  <p className="text-zinc-650 dark:text-zinc-400 text-xs sm:text-sm font-medium leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}

          </div>

          {/* Bottom Banner Row */}
          <div className="w-full max-w-2xl mx-auto flex items-center justify-center gap-3 text-zinc-400 dark:text-zinc-600 text-sm font-medium pt-8 border-t border-zinc-200/50 dark:border-zinc-900 mt-6 z-20">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-300 dark:to-zinc-800" />
            <span className="px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-500 dark:text-zinc-400">
              End-to-end, cloud-native
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-300 dark:to-zinc-800" />
          </div>

        </div>

      </div>

      {/* Global CSS Styles injected dynamically */}
      <style jsx global>{`
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
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
