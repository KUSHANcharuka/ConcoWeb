"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  PencilRuler,
  Box,
  MessageSquare,
  Calculator,
  Layers,
  BarChart3,
  FileSearch,
  Wrench,
  Scale,
  Hammer,
  Ruler,
  Cog,
  BrainCircuit,
  Store,
} from "lucide-react";

// All 15 products in the ecosystem
export const circuitProducts = [
  {
    id: "planning-law-chatbot",
    title: "Planning Law Chatbot",
    icon: FileText,
    tagline: "Instant regulatory lookup",
    description: "Enter a plot location and get allowable use, maximum height, floor area ratio, and sanitary requirements instantly.",
    connections: ["BuilderBot.ai", "Cost Plan Calculator"],
    category: "Legal & Compliance",
  },
  {
    id: "hand-drawn-to-autocad",
    title: "Hand Drawn to AutoCAD",
    icon: PencilRuler,
    tagline: "Sketches to CAD floorplans",
    description: "Photograph your hand-drawn floor plan and receive a clean CAD file. Style learned automatically.",
    connections: ["Auto Conversion 2D to 3D", "2D Drawing to BOQ"],
    category: "BIM & Modelling",
  },
  {
    id: "auto-conversion-2d-to-3d",
    title: "Auto Conversion 2D to 3D",
    icon: Box,
    tagline: "2D drawing to 3D BIM models",
    description: "Computer vision reads your 2D PDF drawing and converts elements directly into a 3D BIM model.",
    connections: ["Hand Drawn to AutoCAD", "WordtoBIM", "Revit to BOQ Plugin"],
    category: "BIM & Modelling",
  },
  {
    id: "wordtobim",
    title: "WordtoBIM",
    icon: MessageSquare,
    tagline: "Describe a building, get a 3D model",
    description: "Describe a building element or layout in plain text and the 3D model is generated from your words.",
    connections: ["Auto Conversion 2D to 3D", "BuilderBot.ai"],
    category: "BIM & Modelling",
  },
  {
    id: "cost-plan-calculator",
    title: "Cost Plan Calculator",
    icon: Calculator,
    tagline: "Concept drawing to budget in minutes",
    description: "Upload a concept drawing. Get the Gross Floor Area, project cost, and consultancy fee automatically.",
    connections: ["Planning Law Chatbot", "Revit to BOQ Plugin", "Tender Evaluations"],
    category: "Costing & BOQ",
  },
  {
    id: "revit-to-boq",
    title: "Revit to BOQ Plugin",
    icon: Layers,
    tagline: "Automated BOQ from Revit models",
    description: "Identifies all building elements from Revit take-off files and generates a standard BOQ automatically.",
    connections: ["Auto Conversion 2D to 3D", "Autodesk CC to BOQ", "Cost Plan Calculator"],
    category: "Costing & BOQ",
  },
  {
    id: "acc-to-boq",
    title: "Autodesk CC to BOQ",
    icon: BarChart3,
    tagline: "Cloud-native ACC takeoff",
    description: "Same BOQ automation as the Revit plugin, built natively for Autodesk Construction Cloud.",
    connections: ["Revit to BOQ Plugin", "2D Drawing to BOQ"],
    category: "Costing & BOQ",
  },
  {
    id: "2d-drawing-to-boq",
    title: "2D Drawing to BOQ",
    icon: FileSearch,
    tagline: "BOQ from flat drawings",
    description: "Reads a 2D PDF structural drawing, identifies elements, and produces a priced BOQ automatically.",
    connections: ["Hand Drawn to AutoCAD", "Autodesk CC to BOQ", "Auto Reinforcement Plugin"],
    category: "Costing & BOQ",
  },
  {
    id: "auto-reinforcement",
    title: "Auto Reinforcement Plugin",
    icon: Wrench,
    tagline: "Complete reinforcement schedules",
    description: "Computer vision reads rebar notations directly from drawings to generate schedules.",
    connections: ["2D Drawing to BOQ", "MeasureonAir"],
    category: "Costing & BOQ",
  },
  {
    id: "tender-evaluations",
    title: "Tender Evaluations",
    icon: Scale,
    tagline: "Bid comparison from supplier emails",
    description: "Automatically downloads emails from suppliers and extracts pricing data for evaluation.",
    connections: ["Cost Plan Calculator", "BuildMarketlk.com"],
    category: "Site & Execution",
  },
  {
    id: "buildmonitor",
    title: "BuildMonitor Mobile",
    icon: Hammer,
    tagline: "Self-generating daily progress reports",
    description: "Site personnel record progress on mobile — photos, quantities. Reports generate automatically.",
    connections: ["MeasureonAir", "ERP Automations"],
    category: "Site & Execution",
  },
  {
    id: "measureonair",
    title: "MeasureonAir",
    icon: Ruler,
    tagline: "Site measurement to payment certificate",
    description: "Record measurements directly against the digital drawing on site. Payment applications generate automatically.",
    connections: ["BuildMonitor Mobile", "Auto Reinforcement Plugin", "ERP Automations"],
    category: "Site & Execution",
  },
  {
    id: "erp-automations",
    title: "ERP Automations",
    icon: Cog,
    tagline: "Bridge site and back office",
    description: "Email instructions automatically converted into ERP job cards. Site app data syncs directly.",
    connections: ["BuildMonitor Mobile", "MeasureonAir", "BuildMarketlk.com"],
    category: "Site & Execution",
  },
  {
    id: "builderbot",
    title: "BuilderBot.ai",
    icon: BrainCircuit,
    tagline: "FIDIC-trained contract legal AI",
    description: "Get clause-referenced legal contract audit reports and answers in seconds.",
    connections: ["Planning Law Chatbot", "WordtoBIM", "BuildMarketlk.com"],
    category: "Legal & Compliance",
  },
  {
    id: "buildmarketlk",
    title: "BuildMarketlk.com",
    icon: Store,
    tagline: "Construction materials marketplace",
    description: "Searchable marketplace of material suppliers, builders, and subcontractors with live price benchmarking.",
    connections: ["Tender Evaluations", "ERP Automations", "BuilderBot.ai"],
    category: "Legal & Compliance",
  },
];

// Coordinate mapping for 15 nodes (shared module-level scope)
export const circleCoords = [
  { cx: 390, cy: 360 }, // Planning Law Chatbot
  { cx: 180, cy: 230 }, // Hand Drawn to AutoCAD
  { cx: 90, cy: 500 },  // Auto Conversion 2D to 3D
  { cx: 515, cy: 320 }, // WordtoBIM
  { cx: 570, cy: 430 }, // Cost Plan Calculator
  { cx: 210, cy: 315 }, // Revit to BOQ Plugin
  { cx: 350, cy: 580 }, // Autodesk CC to BOQ
  { cx: 1090, cy: 580 }, // 2D Drawing to BOQ
  { cx: 1230, cy: 315 }, // Auto Reinforcement Plugin
  { cx: 870, cy: 430 }, // Tender Evaluations
  { cx: 925, cy: 320 }, // BuildMonitor Mobile
  { cx: 1350, cy: 500 }, // MeasureonAir
  { cx: 1260, cy: 230 }, // ERP Automations
  { cx: 1050, cy: 360 }, // BuilderBot.ai
  { cx: 720, cy: 180 },  // BuildMarketlk.com
];

// Center Concolabs logo
function ConcolabsLogoIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Left Tower */}
      <path
        d="M 25 80 L 25 35 L 43 35 L 43 80"
        className="text-lime stroke-current"
      />
      {/* Middle Tower */}
      <path
        d="M 49 80 L 49 20 L 67 20 L 67 80"
        className="text-lime stroke-current"
      />
      {/* Right Tower */}
      <path
        d="M 73 80 L 73 10 L 91 10 L 91 80"
        className="text-lime stroke-current"
      />

      {/* Slanted foundation circuit lines at the bottom */}
      <path
        d="M 15 85 L 50 60"
        className="text-lime stroke-current"
        strokeWidth="3.2"
      />
      <circle
        cx="15"
        cy="85"
        r="3"
        className="fill-lime text-lime"
      />
      <circle
        cx="50"
        cy="60"
        r="3"
        className="fill-lime text-lime"
      />

      <path
        d="M 30 95 L 75 62"
        className="text-lime stroke-current"
        strokeWidth="3.2"
      />
      <circle
        cx="30"
        cy="95"
        r="3"
        className="fill-lime text-lime"
      />
      <circle
        cx="75"
        cy="62"
        r="3"
        className="fill-lime text-lime"
      />
    </svg>
  );
}

function ConcolabsCenterLogo({
  className = "w-14 h-14",
}: {
  className?: string;
}) {
  return (
    <div
      className={`rounded-[28px] bg-zinc-950 flex items-center justify-center p-5 shadow-2xl border border-zinc-800 ring-4 ring-zinc-900/50 ${className}`}
    >
      <ConcolabsLogoIcon className="w-8 h-8" />
    </div>
  );
}

interface EcosystemTreeProps {
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
  isMobileSize: boolean;
}

/* ─── Benefit Tree Layout (Desktop/Mobile responsive SVG) ─── */
function EcosystemTree({ hoveredIndex, setHoveredIndex, isMobileSize }: EcosystemTreeProps) {
  // Base circuit paths to render (keeps existing layout + adds new center/circuit lines)
  const basePaths = [
    // Left side paths (Original)
    "M 0,-130 L 220,90 L 220,190 L 530,500 L 720,500", // Line 1
    "M 0,110 L 60,110 L 450,500 L 720,500", // Line 2
    "M 0,340 L 170,340 L 250,420", // Line 3 Y-junction upper
    "M 0,500 L 170,500 L 250,420 L 370,420 L 450,500 L 720,500", // Line 3 merged

    // Right side paths (Original)
    "M 1440,-130 L 1220,90 L 1220,190 L 910,500 L 720,500", // Line 1
    "M 1440,110 L 1380,110 L 990,500 L 720,500", // Line 2
    "M 1440,340 L 1270,340 L 1190,420", // Line 3 Y-junction upper
    "M 1440,500 L 1270,500 L 1190,420 L 1070,420 L 990,500 L 720,500", // Line 3 merged

    // New Center / Circuit Lines (for more connected look)
    "M 720,-50 L 720,400 L 720,500", // Center top vertical
    "M 450,500 L 520,430 L 620,430 L 720,500", // Left center inner diagonal
    "M 990,500 L 920,430 L 820,430 L 720,500", // Right center inner diagonal
    "M 220,190 L 320,190 L 450,320 L 580,320 L 720,500", // Left upper center branch
    "M 1220,190 L 1120,190 L 990,320 L 860,320 L 720,500", // Right upper center branch
    "M 170,500 L 250,580 L 450,580 L 530,500 L 720,500", // Left lower branch
    "M 1270,500 L 1190,580 L 990,580 L 910,500 L 720,500", // Right lower branch
    "M 0,225 L 120,225 L 300,405 L 530,500 L 720,500", // Left diagonal outer mid
    "M 1440,225 L 1320,225 L 1140,405 L 910,500 L 720,500", // Right diagonal outer mid
  ];

  // Trace paths matching each of the 15 nodes to the center
  const paths = [
    "M 0,-130 L 220,90 L 220,190 L 530,500 L 720,500", // Node 0
    "M 0,110 L 60,110 L 450,500 L 720,500", // Node 1
    "M 0,500 L 170,500 L 250,420 L 370,420 L 450,500 L 720,500", // Node 2
    "M 220,190 L 320,190 L 450,320 L 580,320 L 720,500", // Node 3
    "M 450,500 L 520,430 L 620,430 L 720,500", // Node 4
    "M 0,225 L 120,225 L 300,405 L 530,500 L 720,500", // Node 5
    "M 170,500 L 250,580 L 450,580 L 530,500 L 720,500", // Node 6
    "M 1270,500 L 1190,580 L 990,580 L 910,500 L 720,500", // Node 7
    "M 1440,225 L 1320,225 L 1140,405 L 910,500 L 720,500", // Node 8
    "M 990,500 L 920,430 L 820,430 L 720,500", // Node 9
    "M 1220,190 L 1120,190 L 990,320 L 860,320 L 720,500", // Node 10
    "M 1440,500 L 1270,500 L 1190,420 L 1070,420 L 990,500 L 720,500", // Node 11
    "M 1440,110 L 1380,110 L 990,500 L 720,500", // Node 12
    "M 1440,-130 L 1220,90 L 1220,190 L 910,500 L 720,500", // Node 13
    "M 720,-50 L 720,400 L 720,500", // Node 14
  ];

  return (
    <div className="relative w-full h-[640px] select-none overflow-visible">
      {/* SVG Circuit Connection Lines */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <svg
          viewBox="0 0 1440 640"
          className="h-full w-full text-zinc-300 pointer-events-none"
          fill="none"
        >
          <defs>
            <linearGradient
              id="active-line-grad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="var(--color-lime)" />
              <stop offset="25%" stopColor="var(--color-lime)" />
              <stop offset="50%" stopColor="var(--color-lime)" />
              <stop offset="75%" stopColor="var(--color-lime)" />
              <stop offset="100%" stopColor="var(--color-lime)" />
            </linearGradient>
          </defs>

          {/* Symmetrical circuit lines (Yellow on mobile size, zinc on desktop) */}
          <g
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`pointer-events-none transition-colors duration-300 ${
              isMobileSize ? "text-lime opacity-80" : "text-zinc-300 opacity-40"
            }`}
          >
            {basePaths.map((p, i) => (
              <path key={`base-${i}`} d={p} />
            ))}
          </g>

          {/* Active laser lines on hover (Desktop only, completely disabled on mobile) */}
          <AnimatePresence>
            {!isMobileSize && hoveredIndex !== null && (
              <>
                {/* Neon Glow Underlay */}
                <motion.path
                  key={`active-glow-${hoveredIndex}`}
                  d={paths[hoveredIndex]}
                  fill="none"
                  stroke="url(#active-line-grad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  exit={{ pathLength: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="blur-[2px] opacity-40 pointer-events-none"
                />
                {/* Laser Core Animation */}
                <motion.path
                  key={`active-core-${hoveredIndex}`}
                  d={paths[hoveredIndex]}
                  fill="none"
                  stroke="url(#active-line-grad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="16 8"
                  initial={{ pathLength: 0, strokeDashoffset: 0 }}
                  animate={{
                    pathLength: 1,
                    strokeDashoffset: [0, -36],
                  }}
                  exit={{ pathLength: 0 }}
                  transition={{
                    pathLength: { duration: 0.45, ease: "easeOut" },
                    strokeDashoffset: {
                      repeat: Infinity,
                      duration: 1.2,
                      ease: "linear",
                    },
                  }}
                  className="drop-shadow-[0_0_8px_var(--color-lime)] pointer-events-none"
                />
              </>
            )}
          </AnimatePresence>

          {/* Interactive Nodes (Renders direct button circle only, removing redundant SVG bg-circles to prevent offset alignment glitch) */}
          {circuitProducts.map((b, idx) => {
            const coord = circleCoords[idx];
            const Icon = b.icon;
            const isHovered = hoveredIndex === idx;

            // Size foreignObject to encapsulate the circle button perfectly
            const foWidth = isMobileSize ? 120 : 80;
            const foHeight = isMobileSize ? 90 : 80;
            const foX = isMobileSize ? coord.cx - 60 : coord.cx - 40;
            const foY = isMobileSize ? coord.cy - 45 : coord.cy - 40;

            return (
              <foreignObject
                key={b.title}
                x={foX}
                y={foY}
                width={foWidth}
                height={foHeight}
                className="overflow-visible pointer-events-auto"
              >
                <div className="w-full h-full flex flex-col items-center justify-center">
                  {isMobileSize ? (
                    // Mobile view: static circle with product name in black rectangle (no animations, all lines yellow)
                    <>
                      <div                      className="w-12 h-12 rounded-full border-2 border-lime bg-white text-zinc-900 flex items-center justify-center shadow-xs flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="mt-1.5 px-2 py-1.5 rounded-md bg-zinc-950 text-white text-[9px] font-extrabold text-center leading-none tracking-tight shadow-md max-w-[110px] truncate select-none border border-zinc-800">
                        {b.title}
                      </div>
                    </>
                  ) : (
                    // Desktop view: interactive hover button (perfectly sized, matches coordinate centers)
                    <button
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative focus:outline-hidden cursor-pointer border-2 bg-white text-zinc-800 ${
                        isHovered
                          ? "border-lime bg-lime text-black scale-110 shadow-[0_0_20px_var(--color-lime)] ring-4 ring-lime/20"
                          : "border-zinc-200 hover:border-lime/60 hover:scale-105"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </foreignObject>
            );
          })}

          {/* Center logo (Concolabs Logo) */}
          <foreignObject
            x={720 - 64}
            y={500 - 64}
            width="128"
            height="128"
            className="overflow-visible pointer-events-auto"
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative group">
                <div className="absolute -inset-2 bg-lime/30 rounded-[32px] blur-md opacity-75 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse" />
                <ConcolabsCenterLogo className="relative w-20 h-20 md:w-24 md:h-24" />
              </div>
            </div>
          </foreignObject>
        </svg>
      </div>
    </div>
  );
}

/* ─── Main Section Export ─── */
export function WhySwitch() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobileSize, setIsMobileSize] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setIsMobileSize(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hoveredProduct = hoveredIndex !== null ? circuitProducts[hoveredIndex] : null;
  const HoveredIcon = hoveredProduct?.icon;

  // Determine if the tooltip should display below the icon (if icon cy is in the upper part of the SVG < 350)
  const isUpperIcon = hoveredIndex !== null && circleCoords[hoveredIndex].cy < 350;

  // Calculate horizontal shifts (shiftX) to prevent tooltips from clipping past left/right window edges
  let shiftX = 0;
  if (hoveredIndex !== null) {
    const cx = circleCoords[hoveredIndex].cx;
    if (cx < 180) {
      shiftX = 180 - cx; // Shift right
    } else if (cx > 1260) {
      shiftX = 1260 - cx; // Shift left
    }
  }

  return (
    <section className="relative bg-[#F4F2F0] px-6 py-24 border-t border-zinc-200/50 overflow-hidden">
      {/* Background visual nodes */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-lime/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-lime/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl relative">
        {/* Unified Header */}
        <div className="text-center mb-10 relative z-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 tracking-tight leading-none">
            Why teams switch to Concolabs
          </h2>
          <p className="text-zinc-500 mt-5 text-base sm:text-lg lg:text-[21px] max-w-3xl mx-auto leading-relaxed">
            A unified ecosystem of 15 specialized products designed to work in synergy. 
            Hover over any node to trace its connections and see how data flows in real-time.
          </p>
        </div>

        {/* Scroll Helper for Mobile/Tablet Screens */}
        <div className="flex lg:hidden items-center justify-center gap-2 mb-6 text-zinc-500 text-xs font-bold bg-zinc-200/50 px-4 py-2 rounded-full w-fit mx-auto select-none">
          <span className="animate-pulse">← Swipe left/right to explore full circuit →</span>
        </div>

        {/* Responsive Horizontal Scroll Wrapper for all screens */}
        <div className="w-full overflow-x-auto scrollbar-thin py-6">
          <div className="min-w-[1200px] lg:min-w-0 w-full relative overflow-visible mx-auto">
            
            {/* Ecosystem tree rendering lines and button icons */}
            <EcosystemTree
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              isMobileSize={isMobileSize}
            />

            {/* Global absolute positioned tooltip (Outside SVG to fix z-index/clipping - Desktop only) */}
            <AnimatePresence>
              {!isMobileSize && hoveredIndex !== null && hoveredProduct && HoveredIcon && (
                <motion.div
                  initial={{ opacity: 0, y: isUpperIcon ? -15 : 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: isUpperIcon ? -15 : 15, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{
                    left: `${((circleCoords[hoveredIndex].cx + shiftX) / 1440) * 100}%`,
                    top: `${(circleCoords[hoveredIndex].cy / 640) * 100}%`,
                  }}
                  className={`absolute z-50 pointer-events-none -translate-x-1/2 ${
                    isUpperIcon ? "mt-[44px]" : "-translate-y-full mt-[-44px]"
                  }`}
                >
                  <div className="w-80 shadow-2xl z-50 text-left select-none relative">
                    
                    {/* Black Header Rectangle with White Text & Lime Tagline */}
                    <div className="rounded-t-2xl bg-zinc-950 p-5 pb-4 flex items-center gap-3.5 border-b border-zinc-850 text-white relative">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-lime flex-shrink-0">
                        <HoveredIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-white text-sm tracking-tight truncate">
                          {hoveredProduct.title}
                        </h4>
                        <p className="text-zinc-400 text-[10px] font-bold truncate uppercase tracking-wider mt-0.5">
                          {hoveredProduct.tagline}
                        </p>
                      </div>

                      {/* Tooltip Triangle pointer (at the top if card is below icon - shifted in opposite direction to point at node) */}
                      {isUpperIcon && (
                        <>
                          <div
                            style={{ left: `calc(50% - ${shiftX}px)` }}
                            className="absolute bottom-full -translate-x-1/2 -mb-px w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-zinc-950"
                          />
                          <div
                            style={{ left: `calc(50% - ${shiftX}px)` }}
                            className="absolute bottom-full -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-zinc-950 -z-10"
                          />
                        </>
                      )}
                    </div>

                    {/* White Tooltip Body */}
                    <div className="rounded-b-2xl bg-white p-5 pt-4 border-x border-b border-zinc-200/80 relative">
                      <p className="text-zinc-500 text-xs leading-relaxed">
                        {hoveredProduct.description}
                      </p>

                      <div className="pt-3.5 mt-3.5 border-t border-zinc-100 flex flex-col gap-1.5">
                        <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-extrabold block">Interconnectivity</span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {hoveredProduct.connections.map((conn) => (
                            <span key={conn} className="px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-600 text-[9px] font-semibold">
                              {conn}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Tooltip Triangle pointer (at the bottom if card is above icon - shifted in opposite direction to point at node) */}
                      {!isUpperIcon && (
                        <>
                          <div
                            style={{ left: `calc(50% - ${shiftX}px)` }}
                            className="absolute top-full -translate-x-1/2 -mt-px w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"
                          />
                          <div
                            style={{ left: `calc(50% - ${shiftX}px)` }}
                            className="absolute top-full -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-zinc-200 -z-10"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
