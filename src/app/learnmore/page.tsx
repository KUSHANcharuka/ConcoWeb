"use client";

import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400"],
});
import {
  useInView,
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { InteractiveCanvas } from "@/components/home/interactive-canvas";
import {
  FileText,
  PencilRuler,
  Box,
  MessageSquare,
  Calculator,
  Cog,
  Hammer,
  Ruler,
  BarChart3,
  Store,
  Scale,
  FileSearch,
  Layers,
  Wrench,
  BrainCircuit,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Globe,
  Users,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

import { allProducts } from "@/lib/products-data";

const benefits = [
  {
    icon: Clock,
    title: "85%+ Time Savings",
    description:
      "Automate repetitive estimating, measurement, and documentation tasks.",
    image: "/images/perk-vacation.png",
  },
  {
    icon: Globe,
    title: "Offline-First Mobile",
    description: "Seamless sync from remote construction sites to the office.",
    image: "/images/perk-wellbeing.png",
  },
  {
    icon: Zap,
    title: "AI-Powered Accuracy",
    description:
      "Computer vision and ML that learn from your specific workflows.",
    image: "/images/value-kind.png",
  },
  {
    icon: Shield,
    title: "Compliance Built-In",
    description: "Planning regulations and FIDIC clauses integrated natively.",
    image: "/images/value-mission.png",
  },
  {
    icon: TrendingUp,
    title: "Real-Time Visibility",
    description: "Live project budgets, progress, and financial records.",
    image: "/images/value-pace.png",
  },
  {
    icon: Users,
    title: "Built for Specialists",
    description:
      "Purpose-built for architects, QS firms, contractors, and developers.",
    image: "/images/value-truth.png",
  },
];

const filterTabs = [
  { id: "all", label: "All Tools" },
  { id: "architects", label: "Architects" },
  { id: "real-estate-developers", label: "Developers" },
  { id: "contractors", label: "Contractors" },
  { id: "construction-consultancies", label: "Quantity Surveyors" },
  { id: "modellers", label: "3D Modellers" },
  { id: "legal-professionals", label: "Legal & Contracts" },
];

/* ─── Product Card ─── */
function ProductCard({ product }: { product: (typeof allProducts)[0] }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardLink = `/learnmore/${product.id}`;

  return (
    <Link
      href={cardLink}
      className="relative lg:h-[280px] w-full block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="hidden lg:block h-[280px]" />

      <motion.div
        layout
        animate={{
          y: isHovered ? -8 : 0,
          scale: isHovered ? 1.02 : 1,
          zIndex: isHovered ? 30 : 10,
          boxShadow: isHovered
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
            : "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        }}
        className="lg:absolute lg:top-0 lg:left-0 lg:right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300"
      >
        <div>
          <motion.div
            layout="position"
            animate={{
              height: isHovered ? 160 : 0,
              opacity: isHovered ? 1 : 0,
              marginBottom: isHovered ? 16 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 hidden lg:block"
          >
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover object-center"
            />
          </motion.div>

          <div className="relative w-full h-40 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 mb-4 lg:hidden">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover object-center"
            />
          </div>

          <div className="flex justify-end items-start gap-4 mb-3">
            <span
              className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${
                product.status === "Scaling"
                  ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/40 dark:border-emerald-800/40"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200/60 dark:border-zinc-800/60"
              }`}
            >
              {product.status}
            </span>
          </div>

          <div className="space-y-1 mb-3">
            <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight leading-tight">
              {product.title}
            </h3>
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              {product.tagline}
            </p>
          </div>

          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
            {product.description}
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
          <div className="flex flex-wrap gap-1.5">
            {product.industries.map((ind) => (
              <span
                key={ind}
                className="text-[10px] font-semibold bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded border border-zinc-100 dark:border-zinc-800"
              >
                {ind}
              </span>
            ))}
            {product.regions.map((reg) => (
              <span
                key={reg}
                className="text-[10px] font-medium bg-zinc-100/50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 px-2 py-0.5 rounded"
              >
                {reg}
              </span>
            ))}
          </div>

          <div className="platform-card-link inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:text-zinc-650 dark:hover:text-zinc-300 transition-colors mt-2">
            <span>Explore Solution</span>
            <ArrowUpRight className="platform-card-arrow w-3.5 h-3.5" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

/* ─── Benefit Card ─── */
function BenefitCard({
  benefit,
  index,
}: {
  benefit: (typeof benefits)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const Icon = benefit.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group flex flex-col p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:bg-[#FAFAF8] dark:hover:bg-zinc-900/55 hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div className="relative w-full h-40 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-4">
        <Image
          src={benefit.image}
          alt={benefit.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
        <div className="absolute bottom-3 left-3 flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-900/80 backdrop-blur-xs flex items-center justify-center text-lime dark:text-zinc-100">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-base">
          {benefit.title}
        </h4>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 leading-relaxed">
          {benefit.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Vision Cards Data ─── */
const visionCards = [
  {
    id: "admin-drag",
    title: "Eliminating Admin Drag",
    description:
      "Concolabs was founded to eliminate the administrative drag that compromises construction teams globally. We replace manual blueprint tracing, double-entry Excel logs, and coordination bottlenecks with unified AI engines — turning days of repetitive drafting into instant, compliant outputs.",
    icon: Zap,
    image: "/images/learnmore-hero-bg.png",
  },
  {
    id: "specialists",
    title: "Built for Specialists",
    description:
      "Our tools are built specifically for architects, developers, quantity surveyors, and contractors operating across residential, commercial, and civil infrastructure projects. They bridge the workflow from the first feasibility plot checks to final on-site payment claim approvals.",
    icon: Users,
    image: "/images/perk-health.png",
  },
  {
    id: "performance",
    title: "Unlocking Performance",
    description:
      "By automating structural geometry conversions and legal contract auditing, our users achieve 85%+ reductions in estimating time, secure real-time visibility into project budgets, and unlock seamless offline mobile sync — allowing teams to focus on construction rather than documentation.",
    icon: TrendingUp,
    image: "/images/perk-parental.png",
  },
];

/* ─── Stacking Vision Card ─── */
function VisionCard({
  card,
  index,
}: {
  card: (typeof visionCards)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start start", "end start"],
  });

  // Scale down slightly and dim as user scrolls past
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  const Icon = card.icon;
  const isEven = index % 2 === 0;

  return (
    <div
      ref={cardRef}
      className="relative h-auto py-8 md:py-0 md:h-[90vh] flex items-start justify-center w-full"
    >
      <motion.div
        style={{
          scale: isMobile ? 1 : scale,
          opacity: isMobile ? 1 : opacity,
          top: isMobile ? undefined : "96px",
          zIndex: index + 1,
        }}
        className="relative md:sticky w-full max-w-5xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
      >
        {/* Text Column */}
        <div
          className={`md:col-span-7 space-y-6 order-2 ${isEven ? "md:order-1" : "md:order-2"}`}
        >
          <div className="w-12 h-12 rounded-xl bg-lime/20 dark:bg-lime/10 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
            <Icon className="w-6 h-6 text-zinc-800 dark:text-zinc-200" />
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none">
            {card.title}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed font-normal">
            {card.description}
          </p>
        </div>

        {/* Image Column */}
        <div
          className={`md:col-span-5 order-1 ${isEven ? "md:order-2" : "md:order-1"} relative w-full h-[220px] md:h-[300px] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 shadow-inner`}
        >
          <Image
            src={card.image}
            alt={card.title}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover object-center"
          />
        </div>
      </motion.div>
    </div>
  );
}
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
        className="text-yellow-500 stroke-current"
      />
      {/* Middle Tower */}
      <path
        d="M 49 80 L 49 20 L 67 20 L 67 80"
        className="text-yellow-500 stroke-current"
      />
      {/* Right Tower */}
      <path
        d="M 73 80 L 73 10 L 91 10 L 91 80"
        className="text-yellow-500 stroke-current"
      />

      {/* Slanted foundation circuit lines at the bottom */}
      <path
        d="M 15 85 L 50 60"
        className="text-yellow-500 stroke-current"
        strokeWidth="3.2"
      />
      <circle
        cx="15"
        cy="85"
        r="3"
        className="fill-yellow-500 text-yellow-500"
      />
      <circle
        cx="50"
        cy="60"
        r="3"
        className="fill-yellow-500 text-yellow-500"
      />

      <path
        d="M 30 95 L 75 62"
        className="text-yellow-500 stroke-current"
        strokeWidth="3.2"
      />
      <circle
        cx="30"
        cy="95"
        r="3"
        className="fill-yellow-500 text-yellow-500"
      />
      <circle
        cx="75"
        cy="62"
        r="3"
        className="fill-yellow-500 text-yellow-500"
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

/* ─── Benefit Tree Layout (Desktop) ─── */
function BenefitTree() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const circleCoords = [
    { cx: 390, cy: 360 }, // Left Inner/Top (Clock)
    { cx: 180, cy: 230 }, // Left Mid (Globe)
    { cx: 90, cy: 500 }, // Left Bottom (Zap)
    { cx: 1350, cy: 500 }, // Right Bottom (Shield)
    { cx: 1260, cy: 230 }, // Right Mid (TrendingUp)
    { cx: 1050, cy: 360 }, // Right Top (Users)
  ];

  const basePaths = [
    // Left side paths
    "M 0,-130 L 220,90 L 220,190 L 530,500 L 720,500", // Line 1
    "M 0,110 L 60,110 L 450,500 L 720,500", // Line 2
    "M 0,340 L 170,340 L 250,420", // Line 3 Y-junction upper
    "M 0,500 L 170,500 L 250,420 L 370,420 L 450,500 L 720,500", // Line 3 merged

    // Right side paths
    "M 1440,-130 L 1220,90 L 1220,190 L 910,500 L 720,500", // Line 1
    "M 1440,110 L 1380,110 L 990,500 L 720,500", // Line 2
    "M 1440,340 L 1270,340 L 1190,420", // Line 3 Y-junction upper
    "M 1440,500 L 1270,500 L 1190,420 L 1070,420 L 990,500 L 720,500", // Line 3 merged
  ];

  const paths = [
    "M 0,-130 L 220,90 L 220,190 L 530,500 L 720,500", // Left Inner/Top (Clock)
    "M 0,110 L 60,110 L 450,500 L 720,500", // Left Mid (Globe)
    "M 0,500 L 170,500 L 250,420 L 370,420 L 450,500 L 720,500", // Left Bottom (Zap)
    "M 1440,500 L 1270,500 L 1190,420 L 1070,420 L 990,500 L 720,500", // Right Bottom (Shield)
    "M 1440,110 L 1380,110 L 990,500 L 720,500", // Right Mid (TrendingUp)
    "M 1440,-130 L 1220,90 L 1220,190 L 910,500 L 720,500", // Right Inner/Top (Users)
  ];

  return (
    <div className="relative w-full h-[580px] select-none overflow-visible">
      {/* SVG Circuit Connection Lines */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <svg
          viewBox="0 0 1440 580"
          className="h-full w-full text-zinc-200 dark:text-zinc-800/40 pointer-events-none"
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
              {/* Dark/gold yellow stop */}
              <stop offset="0%" stopColor="#dae910ff" />
              {/* Bright yellow stop */}
              <stop offset="25%" stopColor="#ead708ff" />
              {/* Metallic gray stop */}
              <stop offset="50%" stopColor="#edf500ff" />
              {/* Light yellow stop */}
              <stop offset="75%" stopColor="#dae910ff" />
              {/* Bright yellow stop */}
              <stop offset="100%" stopColor="#eadf08ff" />
            </linearGradient>
          </defs>

          <g
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none"
          >
            {/* Base connection lines */}
            {basePaths.map((p, i) => (
              <path key={`base-${i}`} d={p} />
            ))}
          </g>

          {/* Symmetrical empty circle shapes on the lines */}
          <g
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            className="text-zinc-300 dark:text-zinc-700/60 pointer-events-none"
          >
            {/* Left Circles */}
            <circle
              cx="180"
              cy="230"
              r="24"
              fill="white"
              className="dark:fill-zinc-950 transition-colors duration-300"
              stroke={hoveredIndex === 1 ? "#e8ec64ff" : undefined}
              strokeWidth={hoveredIndex === 1 ? "3" : undefined}
            />
            <circle
              cx="390"
              cy="360"
              r="24"
              fill="white"
              className="dark:fill-zinc-950 transition-colors duration-300"
              stroke={hoveredIndex === 0 ? "#e8ec64ff" : undefined}
              strokeWidth={hoveredIndex === 0 ? "3" : undefined}
            />
            <circle
              cx="90"
              cy="500"
              r="24"
              fill="white"
              className="dark:fill-zinc-950 transition-colors duration-300"
              stroke={hoveredIndex === 2 ? "#e8ec64ff" : undefined}
              strokeWidth={hoveredIndex === 2 ? "3" : undefined}
            />

            {/* Right Circles */}
            <circle
              cx="1350"
              cy="500"
              r="24"
              fill="white"
              className="dark:fill-zinc-950 transition-colors duration-300"
              stroke={hoveredIndex === 3 ? "#e8ec64ff" : undefined}
              strokeWidth={hoveredIndex === 3 ? "3" : undefined}
            />
            <circle
              cx="1050"
              cy="360"
              r="24"
              fill="white"
              className="dark:fill-zinc-950 transition-colors duration-300"
              stroke={hoveredIndex === 5 ? "#e8ec64ff" : undefined}
              strokeWidth={hoveredIndex === 5 ? "3" : undefined}
            />
            <circle
              cx="1260"
              cy="230"
              r="24"
              fill="white"
              className="dark:fill-zinc-950 transition-colors duration-300"
              stroke={hoveredIndex === 4 ? "#e8ec64ff" : undefined}
              strokeWidth={hoveredIndex === 4 ? "3" : undefined}
            />
          </g>

          {/* Active glowing lines on hover */}
          <AnimatePresence>
            {hoveredIndex !== null && (
              <motion.path
                key={`active-${hoveredIndex}`}
                d={paths[hoveredIndex]}
                fill="none"
                stroke="url(#active-line-grad)" // Uses multi-color theme gradient
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="12 6" // Dashed line for flow animation
                initial={{ pathLength: 0, strokeDashoffset: 0 }}
                animate={{
                  pathLength: 1,
                  strokeDashoffset: [0, -36], // Animate offset to create flowing movement
                }}
                exit={{ pathLength: 0 }}
                transition={{
                  pathLength: { duration: 0.45, ease: "easeOut" },
                  strokeDashoffset: {
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                  },
                }}
                className="drop-shadow-[0_0_8px_rgba(234,179,8,0.4)] pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Interactive foreignObject Nodes inside the SVG */}
          {benefits.map((b, idx) => {
            const coord = circleCoords[idx];
            const Icon = b.icon;
            const isHovered = hoveredIndex === idx;

            const foWidth = isHovered ? 320 : 80;
            const foHeight = isHovered ? 400 : 80;
            const foX = isHovered ? coord.cx - 160 : coord.cx - 40;
            const foY = isHovered ? coord.cy - 340 : coord.cy - 40;

            return (
              <foreignObject
                key={b.title}
                x={foX}
                y={foY}
                width={foWidth}
                height={foHeight}
                className="overflow-visible pointer-events-auto"
              >
                <div
                  className={`w-full h-full relative flex flex-col items-center ${
                    isHovered ? "justify-end pb-8" : "justify-center"
                  }`}
                >
                  {/* Popover Benefit Card */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="absolute bottom-[105px] w-72 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 text-left select-none"
                      >
                        <div className="space-y-3">
                          <div className="relative w-full h-28 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                            <Image
                              src={b.image}
                              alt={b.title}
                              fill
                              sizes="288px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-zinc-900 dark:text-zinc-50 text-sm tracking-tight">
                              {b.title}
                            </h4>
                            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 leading-relaxed">
                              {b.description}
                            </p>
                          </div>
                        </div>
                        {/* Triangle Pointer */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white dark:border-t-zinc-900" />
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-zinc-200 dark:border-t-zinc-800 -z-10" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Interactive Node Button */}
                  <button
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 relative focus:outline-hidden cursor-pointer border bg-white dark:bg-zinc-950 ${
                      isHovered
                        ? "border-yellow-500 text-yellow-600 dark:text-yellow-400 scale-110 shadow-lg ring-4 ring-yellow-500/20"
                        : "border-zinc-200/80 dark:border-zinc-800/80 text-zinc-900 dark:text-zinc-100 hover:text-zinc-900 dark:hover:text-white shadow-xs hover:scale-105"
                    }`}
                  >
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              </foreignObject>
            );
          })}

          {/* Center Node (Concolabs Logo) inside SVG */}
          <foreignObject
            x={720 - 64}
            y={500 - 64}
            width="128"
            height="128"
            className="overflow-visible pointer-events-auto"
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative group">
                {/* Ambient Glow */}
                <div className="absolute -inset-1.5 bg-yellow-500/30 dark:bg-yellow-500/20 rounded-[32px] blur-md opacity-75 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse" />
                <ConcolabsCenterLogo className="relative w-20 h-20 md:w-24 md:h-24" />
              </div>
            </div>
          </foreignObject>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center pt-16 text-center pointer-events-none">
        <h2 className="text-center text-5xl lg:text-[78px] font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.0] text-pretty pointer-events-auto">
          Why teams switch to Concolabs
        </h2>

        <p className="mt-6 max-w-[800px] text-center text-lg lg:text-[22px] text-zinc-500 dark:text-zinc-400 leading-relaxed text-pretty pointer-events-auto">
          Purpose-built for the construction industry — not adapted from
          general-purpose tools.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
export default function LearnMorePage() {
  const [selectedTab, setSelectedTab] = useState("all");

  const filteredProducts = allProducts.filter((product) => {
    if (selectedTab === "all") return true;
    return product.personas.includes(selectedTab);
  });

  return (
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-lime/30 selection:text-black">
      <Navbar />

      {/* ───────── HERO with Background Canvas ───────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#FAFAF8] dark:bg-zinc-950 pt-20">
        {/* Interactive Canvas Background - starts below navbar */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 0 }}
        >
          <InteractiveCanvas />
        </div>

        {/* Subtle Radial Gradient Overlay to darken edges and make content readable */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(250,250,248,0.4),rgba(250,250,248,0.95))]" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.1] text-pretty"
          >
            Powerful tools built for{" "}
            <span className="text-zinc-500 dark:text-zinc-400">
              modern construction
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 mt-6 max-w-2xl mx-auto leading-relaxed text-pretty"
          >
            AI engines and offline-first mobile tools designed to eliminate
            administrative drag, automate quantities, and synchronize
            site-to-office operations.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-primary text-black hover:bg-primary/90 rounded-full h-12 px-8 font-semibold shadow-md"
            >
              <Link href="/demo">
                Request a Demo
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full h-12 px-8 font-semibold"
            >
              <Link href="/contact">Talk to Sales</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ───────── Mission & Vision Section ───────── */}
      <section className="relative py-24 bg-[#FAFAF8] dark:bg-zinc-950 border-t border-zinc-200/50 dark:border-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6">
          {/* Stacking Cards Container */}
          <div className="relative space-y-12 pb-24">
            {visionCards.map((card, i) => (
              <VisionCard key={card.id} card={card} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Desktop view: Interactive Circuit Tree view */}
      <section className="relative bg-zinc-50/10 dark:bg-zinc-900/10 overflow-hidden hidden lg:block h-[580px] w-full select-none border-t border-zinc-200/50 dark:border-zinc-900/50">
        <BenefitTree />
      </section>

      {/* Mobile view: Grid of benefit cards */}
      <section className="relative py-20 bg-zinc-50/80 dark:bg-zinc-900/20 lg:hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Why teams switch to Concolabs
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-3 text-base sm:text-lg max-w-xl mx-auto">
              Purpose-built for the construction industry — not adapted from
              general-purpose tools.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <BenefitCard key={b.title} benefit={b} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────── All Products ───────── */}
      <section className="relative py-24 sm:py-32 bg-white dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/5 dark:bg-zinc-100/5 border border-zinc-200/60 dark:border-zinc-800 text-xs font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase mb-6">
              Product Suite
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Every tool, one platform
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              From feasibility checks to payment certificates — 15 specialized
              AI tools covering every stage of the construction lifecycle.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col items-center gap-3 mb-12">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Filter by industry role
            </span>
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
              {filterTabs.map((tab) => {
                const isActive = selectedTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className="relative px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer select-none border border-zinc-200/60 dark:border-zinc-800"
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeLearnMoreTab"
                        className="absolute inset-0 bg-zinc-900 dark:bg-zinc-100 rounded-full z-0"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      className={`relative z-10 ${isActive ? "text-white dark:text-zinc-950 font-bold" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"}`}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ───────── Final CTA ───────── */}
      <section className="relative py-24 sm:py-32 overflow-hidden border-t border-zinc-200/50 dark:border-zinc-900/50 bg-[#FAFAF8] dark:bg-zinc-950">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-primary/5 dark:bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">
            Ready to eliminate the admin?
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-4 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Book a 30-minute walkthrough to see exactly which tools apply to the
            way your team works.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary text-black hover:bg-primary/90 rounded-full h-12 px-8 font-semibold shadow-md"
            >
              <Link href="/demo">
                Book a Demo
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full h-12 px-8 font-semibold bg-white/80 dark:bg-zinc-900"
            >
              <Link href="/pricing">
                View Pricing
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
