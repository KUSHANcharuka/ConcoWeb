"use client";

import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer";
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
import concoLogoSign from "@/Images/Conco Logo Sign.png";
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
  ChevronDown,
  Sparkles,
  Globe,
  Users,
  Zap,
  Shield,
  ShieldCheck,
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
              className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${product.status === "Scaling"
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

/* ─── Stacking Vision Cards Stack ─── */
function VisionCardsStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Card 0 (Eliminating Admin Drag) — starts in place, shifts up slightly to show deck edge
  const y0 = useTransform(scrollYProgress, [0.15, 0.45], [0, -32]);
  const scale0 = useTransform(scrollYProgress, [0.3, 0.6], [1, 0.92]);
  const opacity0 = useTransform(scrollYProgress, [0.3, 0.6], [1, 0.6]);
  
  // Card 1 (Built for Specialists) — falls from above, lands at -16px
  const y1 = useTransform(scrollYProgress, [0.15, 0.45], [-1000, -16]);
  const scale1 = useTransform(scrollYProgress, [0.5, 0.8], [1, 0.96]);
  const opacity1 = useTransform(scrollYProgress, [0.5, 0.8], [1, 0.8]);

  // Card 2 (Unlocking Performance) — falls from above, lands at 0px (front of deck)
  const y2 = useTransform(scrollYProgress, [0.5, 0.8], [-1000, 0]);

  if (isMobile) {
    return (
      <div className="space-y-8 pb-12">
        {visionCards.map((card, i) => {
          const Icon = card.icon;
          const isEven = i % 2 === 0;
          return (
            <div
              key={card.id}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col gap-6"
            >
              {/* Image Column first on mobile */}
              <div className="relative w-full h-[200px] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 shadow-inner">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
              
              {/* Text Column */}
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-lime/20 dark:bg-lime/10 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                  <Icon className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Desktop Stacking Layout
  return (
    <div ref={containerRef} className="relative h-[300vh] w-full mt-12">
      <div className="sticky top-24 h-[80vh] w-full flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-5xl h-[500px]">
          {visionCards.map((card, i) => {
            const Icon = card.icon;
            const isEven = i % 2 === 0;
            
            // Assign transform styles per card
            let cardStyle = {};
            if (i === 0) {
              cardStyle = { y: y0, scale: scale0, opacity: opacity0, zIndex: 10 };
            } else if (i === 1) {
              cardStyle = { y: y1, scale: scale1, opacity: opacity1, zIndex: 20 };
            } else if (i === 2) {
              cardStyle = { y: y2, zIndex: 30 };
            }

            return (
              <motion.div
                key={card.id}
                style={cardStyle}
                className="absolute inset-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl grid grid-cols-12 gap-8 items-center"
              >
                {/* Text Column */}
                <div
                  className={`col-span-7 space-y-6 order-2 ${isEven ? "order-1" : "order-2"}`}
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
                  className={`col-span-5 order-1 ${isEven ? "order-2" : "order-1"} relative w-full h-[300px] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 shadow-inner`}
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="40vw"
                    className="object-cover object-center"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function ConcolabsCenterLogo({
  className = "w-14 h-14",
}: {
  className?: string;
}) {
  return (
    <div
      className={`rounded-[28px] bg-zinc-950 flex items-center justify-center p-3 shadow-2xl border border-zinc-800 ring-4 ring-zinc-900/50 ${className}`}
    >
      <div className="relative w-full h-full">
        <Image
          src={concoLogoSign}
          alt="Concolabs Sign"
          fill
          sizes="(max-width: 768px) 56px, 64px"
          className="object-contain scale-[1.85] translate-y-[4.5%]"
          priority
        />
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

        {/* Yellow fade radial gradient for focus tagline */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(218,233,16,0.18)_0%,rgba(218,233,16,0.03)_50%,transparent_75%)] dark:bg-[radial-gradient(circle_at_center,rgba(218,233,16,0.1)_0%,rgba(218,233,16,0.01)_50%,transparent_75%)] pointer-events-none" />

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
              className="bg-primary text-primary-foreground border-0 rounded-full h-12 px-8 font-semibold shadow-md cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <a href="#products">
                View All Products
                <ChevronDown className="w-4 h-4 ml-2 animate-bounce" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ───────── Mission & Vision Section ───────── */}
      <section className="relative py-12 md:py-24 bg-[#FAFAF8] dark:bg-zinc-950 border-t border-zinc-200/50 dark:border-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <VisionCardsStack />
        </div>
      </section>





      {/* ───────── All Products ───────── */}
      <section id="products" className="relative py-24 sm:py-32 bg-white dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">

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
              className="bg-primary text-primary-foreground border-0 rounded-full h-12 px-8 font-semibold shadow-md"
            >
              <Link href="/demo">
                Book a Demo
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground border-0 rounded-full h-12 px-8 font-semibold shadow-md"
            >
              <Link href="/#">
                Buy Products
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
