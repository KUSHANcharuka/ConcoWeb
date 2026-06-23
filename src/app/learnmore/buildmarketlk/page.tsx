"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence, useScroll, useTransform, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Play,
  ChevronDown,
  Check,
  TrendingUp,
  Layers,
  Scale,
  Search,
  PhoneCall,
  AlertCircle,
  Clock,
  Globe,
  Building2,
  Tag,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BuildmarketlkPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isAfterMode, setIsAfterMode] = useState(false);
  const [activeSolutionTab, setActiveSolutionTab] = useState<"users" | "suppliers">("users");

  // Apple-style custom ease transition
  const appleEase = [0.16, 1, 0.3, 1] as const;

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: appleEase } }
  };

  const staggerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  // Parallax setup for Hero Section
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 0.9]);

  // Subheader stickiness & visibility based on scroll
  const [showSubheader, setShowSubheader] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowSubheader(true);
      } else {
        setShowSubheader(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-850 dark:text-zinc-200 antialiased selection:bg-lime/30 selection:text-zinc-900 overflow-x-hidden">
      <Navbar />

      {/* Floating Glass Sub-header (Apple Style) */}
      <AnimatePresence>
        {showSubheader && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.4, ease: appleEase }}
            className="fixed top-[64px] left-0 right-0 z-40 bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-900 backdrop-blur-xl"
          >
            <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-white">BuildMarketlk.com</span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-lime/20 border border-lime/30 text-zinc-800 dark:text-zinc-200">
                  Operations / Marketplace
                </span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="#video-demo"
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer px-3 py-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-white/5"
                >
                  Watch Demo
                </a>
                <Button
                  asChild
                  size="sm"
                  className="bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 rounded-full font-bold shadow-md text-xs border-0"
                >
                  <a href="https://buildmarketlk.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    Visit Marketplace <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[95vh] flex flex-col items-center justify-center px-6 pt-32 pb-20 overflow-hidden bg-gradient-to-b from-[#FAFAF8] via-[#FAFAF8] to-white dark:from-zinc-950 dark:via-black dark:to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.01)_0%,transparent_60%)] pointer-events-none" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="max-w-5xl mx-auto text-center space-y-8 relative z-30 w-full flex flex-col items-center"
        >
          {/* Back Nav Link */}
          <Link
              href="/learnmore"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-black/60 backdrop-blur-md text-sm font-semibold text-zinc-650 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-all hover:bg-white/80 dark:hover:bg-black/80 hover:scale-105 active:scale-95 group shadow-xs cursor-pointer mb-4"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Learn More
            </Link>



          {/* Massive Apple-style Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: appleEase, delay: 0.15 }}
            className="text-5xl sm:text-7xl lg:text-[7.5rem] font-bold tracking-tighter text-zinc-950 dark:text-white leading-[0.95] product-title-sweep"
          >
            BuildMarketlk
            .com
          </motion.h1>

          {/* Value Prop Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: appleEase, delay: 0.25 }}
            className="text-2xl sm:text-4xl text-zinc-500 dark:text-zinc-400 font-semibold tracking-tight max-w-3xl leading-snug"
          >
            eBay for construction. <br className="hidden sm:inline" />
            <span className="text-zinc-950 dark:text-white">One place to find everything.</span>
          </motion.p>

          {/* Subtext description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: appleEase, delay: 0.35 }}
            className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-455 max-w-3xl leading-relaxed font-normal"
          >
            Search for material suppliers, builders, subcontractors, and average construction prices in Sri Lanka — all in one hub with verified ratings, pricing history, and average cost data. A transparent market for the entire industry.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: appleEase, delay: 0.45 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 w-full sm:w-auto"
          >
            <Button
              asChild
              className="w-full sm:w-auto rounded-full px-8 py-7 text-lg font-bold shadow-xl cursor-pointer bg-primary text-primary-foreground border-0 hover:scale-105 transition-transform duration-300"
            >
              <Link href="/pricing" className="flex items-center gap-2">
                Buy products <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            <Button
              asChild
              className="w-full sm:w-auto rounded-full px-8 py-7 text-lg font-bold shadow-xl cursor-pointer bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 border-0 hover:scale-105 transition-transform duration-300"
            >
              <a href="https://buildmarketlk.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                Visit Marketplace <ExternalLink className="w-5 h-5" />
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto rounded-full px-8 py-7 text-lg font-semibold cursor-pointer hover:bg-zinc-100 text-zinc-900 border-zinc-200 hover:border-zinc-300 dark:hover:bg-white/5 dark:text-white dark:border-zinc-800 dark:hover:border-zinc-700 hover:scale-105 transition-transform duration-300"
            >
              <a href="#video-demo" className="flex items-center justify-center">
                <Play className="w-4 h-4 mr-2 text-zinc-900 fill-zinc-900 dark:text-white dark:fill-white" />
                Watch Demo
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Before/After Toggle Section */}
      <section className="bg-white dark:bg-zinc-950 py-32 px-6 border-y border-zinc-150 dark:border-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(0,0,0,0.01)_0%,transparent_50%)] pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block">Workflow Comparison</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
              A paradigm shift in construction discovery
            </h2>
            <p className="text-zinc-550 dark:text-zinc-500 text-lg max-w-xl mx-auto">
              Toggle below to see how BuildMarketlk transforms sourcing in Sri Lanka.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex justify-center">
            <div className="relative p-1 bg-zinc-100 dark:bg-zinc-900/80 backdrop-blur-md rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center">
              {/* Sliding Background */}
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="absolute inset-y-1 left-1 rounded-full bg-lime"
                style={{
                  width: "calc(50% - 4px)",
                  transform: isAfterMode ? "translateX(100%)" : "translateX(0%)"
                }}
              />
              <button
                onClick={() => setIsAfterMode(false)}
                className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-bold transition-colors duration-200 cursor-pointer ${
                  !isAfterMode ? "text-black" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                Traditional Search
              </button>
              <button
                onClick={() => setIsAfterMode(true)}
                className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-bold transition-colors duration-200 cursor-pointer ${
                  isAfterMode ? "text-black" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                BuildMarketlk.com
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="relative min-h-[380px] sm:min-h-[300px]">
            <AnimatePresence mode="wait">
              {!isAfterMode ? (
                <motion.div
                  key="before"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: appleEase }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-8 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6 text-red-650 dark:text-red-400">
                        <PhoneCall className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-zinc-950 dark:text-white">Manual Calling</h3>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mt-2">
                        Relying heavily on personal Rolodexes or calling contacts from previous projects. Hoping suppliers are still operational and rates haven't spiked.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400/80 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Slow & locked networks
                    </span>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-8 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6 text-red-650 dark:text-red-400">
                        <Search className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-zinc-950 dark:text-white">Unpredictable Google Search</h3>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mt-2">
                        Googling blindly to find new providers. Quality is completely unpredictable, reviews are scarce, and there is no verification of business registration.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400/80 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> High quality risk
                    </span>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-8 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6 text-red-650 dark:text-red-400">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-zinc-950 dark:text-white">No Price Transparency</h3>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mt-2">
                        Zero centralized pricing. It takes days of manual email/call follow-ups to collect and organize multiple quotes, with no market average cost to benchmark against.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400/80 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Days to compare quote sheets
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="after"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: appleEase }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <div className="bg-[#FAFAF8] dark:bg-zinc-900/60 border border-lime/30 dark:border-lime/20 rounded-3xl p-8 space-y-4 flex flex-col justify-between shadow-[0_0_30px_rgba(147,242,5,0.01)]">
                    <div>
                      <div className="w-12 h-12 bg-lime/10 border border-lime/20 rounded-2xl flex items-center justify-center mb-6 text-zinc-800 dark:text-zinc-200">
                        <Search className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
                      </div>
                      <h3 className="text-xl font-bold text-zinc-950 dark:text-white">Instant Sourcing</h3>
                      <p className="text-zinc-655 dark:text-zinc-400 text-sm leading-relaxed mt-2">
                        Search by concrete, brick, labor, or machinery type. Filter by district in Sri Lanka. Instant supplier list with clear contacts, rates, and active location mappings.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> 5 minutes vs days
                    </span>
                  </div>

                  <div className="bg-[#FAFAF8] dark:bg-zinc-900/60 border border-lime/30 dark:border-lime/20 rounded-3xl p-8 space-y-4 flex flex-col justify-between shadow-[0_0_30px_rgba(147,242,5,0.01)]">
                    <div>
                      <div className="w-12 h-12 bg-lime/10 border border-lime/20 rounded-2xl flex items-center justify-center mb-6 text-zinc-800 dark:text-zinc-200">
                        <TrendingUp className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
                      </div>
                      <h3 className="text-xl font-bold text-zinc-950 dark:text-white">Market-Driven Benchmark</h3>
                      <p className="text-zinc-655 dark:text-zinc-400 text-sm leading-relaxed mt-2">
                        See real-time average prices across Sri Lanka for materials and services. Verify if a supplier quote is fair, underpriced, or overpriced instantly using trend reports.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Transparent cost indexes
                    </span>
                  </div>

                  <div className="bg-[#FAFAF8] dark:bg-zinc-900/60 border border-lime/30 dark:border-lime/20 rounded-3xl p-8 space-y-4 flex flex-col justify-between shadow-[0_0_30px_rgba(147,242,5,0.01)]">
                    <div>
                      <div className="w-12 h-12 bg-lime/10 border border-lime/20 rounded-2xl flex items-center justify-center mb-6 text-zinc-800 dark:text-zinc-200">
                        <Layers className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
                      </div>
                      <h3 className="text-xl font-bold text-zinc-950 dark:text-white">Direct Ordering & Bid</h3>
                      <p className="text-zinc-655 dark:text-zinc-400 text-sm leading-relaxed mt-2">
                        Compare suppliers side-by-side. Request bulk quotes directly, buy standard materials, and review price history graphs to track seasonal cost variations.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Transaction history saved
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section id="video-demo" className="py-24 px-6 max-w-5xl mx-auto space-y-12 scroll-mt-24">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block">Video Tour</span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
            See the marketplace in action
          </h2>
        </div>

        {/* Embedded Iframe Player from Google Drive */}
        <div className="relative w-full aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-900 shadow-2xl">
          <iframe
            src="https://drive.google.com/file/d/1SZPURCcouuLthXbbxqzcg7uSmoWpw2fQ/preview"
            className="absolute inset-0 w-full h-full border-0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      </section>

      {/* Full-Page Width Core Layout */}
      <section className="py-24 px-6 max-w-4xl mx-auto border-t border-zinc-200 dark:border-zinc-900 bg-[#FAFAF8] dark:bg-zinc-950">
        <div className="space-y-32">
          
          {/* Main Details */}
          <div className="space-y-32">
            
            {/* Problem Section */}
            <div id="problem" className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-[1px] bg-red-500" />
                <span className="text-xs font-bold text-red-650 dark:text-red-400 uppercase tracking-widest">The Challenge</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
                Sri Lanka's construction pricing is hidden in folders & phone logs.
              </h2>
              <div className="prose max-w-none text-zinc-650 dark:text-zinc-400 text-lg sm:text-xl leading-relaxed space-y-6">
                <p>
                  Finding a builder, getting material quotes, or benchmarking subcontractor rates in Sri Lanka still runs on personal contacts and Googling. There is no single, centralized source of information about suppliers, their pricing, their reliability, or industry averages.
                </p>
                <p>
                  When a contractor needs to buy concrete, there is no quick way to compare prices across Colombo suppliers. When a consultant wants to benchmark labour rates, they call peers and hope the information is current.
                </p>
                <p className="text-zinc-950 dark:text-white font-medium text-left">
                  The lack of transparency means projects are quoted without competitive context — clients can be overcharged, and suppliers don't compete on quality. BuildMarketlk.com brings the transparency of eBay or Amazon to Sri Lankan construction.
                </p>
              </div>
            </div>

            {/* Solution Section (How it works) */}
            <div id="solution" className="space-y-12 text-left">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-lime" />
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">How it Works</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
                  Search. Compare. Procure.
                </h2>
              </div>

              {/* Toggle Tab for Buyers vs Suppliers */}
              <div className="flex border-b border-zinc-200 dark:border-zinc-900">
                <button
                  onClick={() => setActiveSolutionTab("users")}
                  className={`pb-4 text-lg font-bold border-b-2 transition-colors duration-200 pr-8 cursor-pointer ${
                    activeSolutionTab === "users" ? "border-lime text-zinc-900 dark:text-white" : "border-transparent text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300"
                  }`}
                >
                  For Buyers & Consultants
                </button>
                <button
                  onClick={() => setActiveSolutionTab("suppliers")}
                  className={`pb-4 text-lg font-bold border-b-2 transition-colors duration-200 cursor-pointer ${
                    activeSolutionTab === "suppliers" ? "border-lime text-zinc-900 dark:text-white" : "border-transparent text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300"
                  }`}
                >
                  For Suppliers (Sellers)
                </button>
              </div>

              {/* Solution Tab Content */}
              <div className="mt-8">
                <AnimatePresence mode="wait">
                  {activeSolutionTab === "users" ? (
                    <motion.div
                      key="buyers"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="space-y-12"
                    >
                      {/* Step Guides */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 space-y-4">
                          <div className="w-10 h-10 rounded-full bg-lime/20 text-zinc-900 dark:text-zinc-200 flex items-center justify-center font-bold text-sm">
                            01
                          </div>
                          <h4 className="text-lg font-bold text-zinc-950 dark:text-white">Search Location & Type</h4>
                          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                            Search by concrete, gravel, brick, subcontractor service, or specific brand names. Review locations, direct contact points, and rating averages.
                          </p>
                        </div>

                        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 space-y-4">
                          <div className="w-10 h-10 rounded-full bg-lime/20 text-zinc-900 dark:text-zinc-200 flex items-center justify-center font-bold text-sm">
                            02
                          </div>
                          <h4 className="text-lg font-bold text-zinc-950 dark:text-white">Benchmark Instantly</h4>
                          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                            Compare rates side-by-side. Check historical pricing trends to spot inflation and compare against the computed average market pricing.
                          </p>
                        </div>

                        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 space-y-4">
                          <div className="w-10 h-10 rounded-full bg-lime/20 text-zinc-900 dark:text-zinc-200 flex items-center justify-center font-bold text-sm">
                            03
                          </div>
                          <h4 className="text-lg font-bold text-zinc-950 dark:text-white">Request Quote or Order</h4>
                          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                            Submit digital requests for custom quotes, purchase standard catalog items directly, or call the verified number with your history logged.
                          </p>
                        </div>
                      </div>

                      {/* Feature Checklist */}
                      <div className="space-y-6">
                        <h4 className="text-xl font-bold text-zinc-950 dark:text-white">Marketplace Features</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            { title: "Average Price Data", desc: "Instantly see average costs for verification" },
                            { title: "Verified Ratings", desc: "Vetted reviews from certified project buyers" },
                            { title: "Price Trends", desc: "Historical records show supplier price variations" },
                            { title: "Delivery Filtering", desc: "Sort by logistics capabilities to your site district" },
                            { title: "Wholesale vs Retail Filters", desc: "Segment suppliers based on your procurement size" },
                            { title: "Bulk Tiered Discounts", desc: "View automatic pricing reductions for scale orders" }
                          ].map((feat, i) => (
                            <div key={i} className="flex gap-3 items-start p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900/50 rounded-xl">
                              <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold text-zinc-950 dark:text-white block text-sm">{feat.title}</span>
                                <span className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">{feat.desc}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sellers"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-8 space-y-6"
                    >
                      <h3 className="text-2xl font-bold text-zinc-950 dark:text-white">List Materials. Get Discovered. Win Deals.</h3>
                      <p className="text-zinc-605 dark:text-zinc-400 leading-relaxed">
                        Suppliers set up a professional shop profile, list their products, materials, and services, and get immediate exposure to thousands of contractors, estimators, and developers searching for them.
                      </p>
                      <ul className="space-y-4 pt-2">
                        <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                          <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span><strong>Margin Protection:</strong> Prices are transparent but protected—only verified, registered developers and builders can view them.</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                          <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span><strong>Direct RFQs:</strong> Receive structured quote requests with clear drawings, volumes, and contact numbers.</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                          <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span><strong>Commission-Only:</strong> Listing is 100% free. No monthly subscription or startup costs. You only pay a small commission on successful sales processed through the platform escrow.</span>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Workflow Integration Section */}
            <div id="integration" className="space-y-8 text-left">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-lime" />
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Workflow Fit</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
                  Seamless Procurement Pipeline
                </h2>
                <p className="text-zinc-550 dark:text-zinc-400 text-lg leading-relaxed">
                  How BuildMarketlk.com integrates directly into your day-to-day building and budgeting workflows.
                </p>
              </div>

              {/* Pipeline Flowchart */}
              <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[2rem] p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white dark:from-zinc-950 dark:via-transparent dark:to-zinc-950 pointer-events-none" />

                <div className="flex-1 p-6 bg-[#FAFAF8] dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-900 rounded-2xl flex flex-col justify-between space-y-4 relative z-10 text-center md:text-left">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-2">01. Inputs Feed</span>
                    <h4 className="text-md font-bold text-zinc-950 dark:text-white">Supplier Rates & History</h4>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Live catalogs, historical transaction values, and supplier submissions feed automatically into our database.
                  </p>
                </div>

                <div className="flex items-center justify-center shrink-0 py-2 md:py-0">
                  <ArrowRight className="w-5 h-5 text-zinc-400 dark:text-zinc-500 rotate-90 md:rotate-0" />
                </div>

                <div className="flex-1 p-6 bg-lime/10 dark:bg-lime/5 border border-lime/20 dark:border-lime/20 rounded-2xl flex flex-col justify-between space-y-4 relative z-10 text-center md:text-left shadow-xs">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-2">02. Market Engine</span>
                    <h4 className="text-md font-bold text-zinc-950 dark:text-white">Search & Compare</h4>
                  </div>
                  <p className="text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed">
                    Instantly search materials in Sri Lanka. Evaluate suppliers side-by-side and cross-reference with pricing index lines.
                  </p>
                </div>

                <div className="flex items-center justify-center shrink-0 py-2 md:py-0">
                  <ArrowRight className="w-5 h-5 text-zinc-400 dark:text-zinc-500 rotate-90 md:rotate-0" />
                </div>

                <div className="flex-1 p-6 bg-[#FAFAF8] dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-900 rounded-2xl flex flex-col justify-between space-y-4 relative z-10 text-center md:text-left">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-2">03. Outputs Fit</span>
                    <h4 className="text-md font-bold text-zinc-950 dark:text-white">Procurement & Budgeting</h4>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Approved suppliers, negotiated quote rates, and final orders sync directly to your procurement team and cost estimators.
                  </p>
                </div>
              </div>
            </div>

            {/* Replication Model Section */}
            <div id="replication" className="space-y-8 text-left">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-lime" />
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Global Scalability</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
                  Replicable software for any country
                </h2>
                <p className="text-zinc-555 dark:text-zinc-400 text-lg leading-relaxed">
                  The BuildMarketlk.com software framework is fully customizable and available for licensing internationally.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-md">
                <div className="absolute right-0 top-0 w-80 h-80 bg-lime/5 rounded-full blur-[80px] -z-10" />

                <div className="space-y-6 flex-1 text-left">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-lime/25 border border-lime/35 text-zinc-800 dark:text-zinc-200 tracking-wider inline-block">
                    Licensing Package
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-white">
                    One-time licensing fee of <span className="text-zinc-900 dark:text-white">USD 7,000</span>
                  </h3>
                  <p className="text-zinc-550 dark:text-zinc-455 text-sm sm:text-base leading-relaxed">
                    Professional construction bodies, associations, or engineers' institutions (such as those in India, Pakistan, or Bangladesh) can license this codebase. Deploy your local domain using our established product database architecture and pricing system.
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-[#FAFAF8] dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-900 rounded-xl">
                      <span className="text-xs text-zinc-400 font-bold block">India</span>
                      <span className="text-sm font-semibold text-zinc-950 dark:text-white">BuildMarketIN.com</span>
                    </div>
                    <div className="p-4 bg-[#FAFAF8] dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-900 rounded-xl">
                      <span className="text-xs text-zinc-400 font-bold block">Pakistan</span>
                      <span className="text-sm font-semibold text-zinc-950 dark:text-white">BuildMarketPK.com</span>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-64 aspect-square rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/30 flex flex-col items-center justify-center p-6 relative group overflow-hidden shrink-0">
                  <div className="absolute -inset-1.5 bg-lime/15 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Globe className="w-16 h-16 text-zinc-750 dark:text-zinc-300 mb-4 group-hover:scale-110 transition-transform duration-500" />
                  <span className="text-center font-bold text-zinc-950 dark:text-white text-md">Global Deployments</span>
                  <span className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-1 leading-normal">Onboard suppliers and launch in 2 weeks</span>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div id="faq" className="space-y-8 text-left">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-lime" />
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Questions</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4 border-t border-zinc-200 dark:border-zinc-900 pt-6">
                {[
                  {
                    q: "Is pricing transparent to everyone or just registered users?",
                    a: "Registered users only (builders, consultants, suppliers). Pricing sheets are hidden from the public to protect supplier profit margins and prevent scrapers."
                  },
                  {
                    q: "How are suppliers verified?",
                    a: "Suppliers are verified via telephone calls, business registration checks, and location checks. Ratings come strictly from documented transactions on the platform to avoid fake reviews."
                  },
                  {
                    q: "What if I find a better price elsewhere?",
                    a: "BuildMarketlk.com is market-driven. If you find a better price offline, you can report it. We verify and update cost metrics to keep averages accurate for everyone."
                  },
                  {
                    q: "Can I order directly from BuildMarketlk.com?",
                    a: "For standardized materials (like standard concrete volumes, bricks, sand), yes. Orders and escrow payments are processed natively. For custom structural or labor subcontracting, you submit requests for quotes and negotiate."
                  },
                  {
                    q: "Is payment handled through the platform?",
                    a: "We support two modes: Direct payment (you pay the supplier directly offline at no fee) or Platform Escrow (processed via the system with dispute protection, where we charge a commission on the order)."
                  },
                  {
                    q: "How do I get started as a supplier?",
                    a: "Register your shop, complete our quick business phone validation, upload your lists, and define your delivery zones. You can go live within 1 to 2 days with zero listing charges."
                  },
                  {
                    q: "Is there a membership fee for suppliers?",
                    a: "No. Listing is entirely free for suppliers. We only collect a small commission on orders processed through our platform escrow."
                  }
                ].map((faq, idx) => (
                  <div
                    key={idx}
                    className="border-b border-zinc-200 dark:border-zinc-900 overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between py-5 text-left font-bold text-lg tracking-tight text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-zinc-450 transition-transform duration-300 shrink-0 ml-4 ${
                          activeFaq === idx ? "rotate-180 text-zinc-800 dark:text-zinc-250" : "rotate-0"
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {activeFaq === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: appleEase }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6 text-zinc-550 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Grid for Sidebar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16 border-t border-zinc-200 dark:border-zinc-800">
            
            {/* Sidebar Quick Facts Card */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[2rem] p-8 space-y-8 shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase bg-lime/25 border border-lime/30 text-zinc-800 dark:text-zinc-200 px-2.5 py-0.5 rounded-full inline-block tracking-wider">
                    Product Facts
                  </span>
                  <h3 className="text-xl font-bold text-zinc-950 dark:text-white pt-2">BuildMarketlk.com</h3>
                </div>

                {/* Facts List */}
                <div className="space-y-4 border-t border-zinc-200 dark:border-zinc-900 pt-6">
                  <div className="flex gap-4">
                    <Store className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-zinc-450 dark:text-zinc-500 font-bold block uppercase tracking-wider">Stage</span>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-white">Operations / Marketplace</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Globe className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-zinc-455 dark:text-zinc-500 font-bold block uppercase tracking-wider">Regions</span>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-white">Sri Lanka (primary), replicable to other countries</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Clock className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-zinc-455 dark:text-zinc-500 font-bold block uppercase tracking-wider">Time to Onboard</span>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-white">1–2 weeks onboarding</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Tag className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-zinc-455 dark:text-zinc-500 font-bold block uppercase tracking-wider">Pricing model</span>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-white">USD 14/month for users; Commission-only for suppliers</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Building2 className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-zinc-455 dark:text-zinc-500 font-bold block uppercase tracking-wider">Best For</span>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight block">
                        Contractors, builders, consultancies, developers, material suppliers, subcontractors
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-900 mt-6">
                <Button
                  asChild
                  className="w-full rounded-2xl py-6 font-bold bg-lime text-black hover:bg-lime/90 border-0 shadow-md"
                >
                  <Link href="/pricing" className="flex items-center justify-center gap-1.5">
                    Buy products <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                
                <Button
                  asChild
                  className="w-full rounded-2xl py-6 font-bold bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 border-0 shadow-md"
                >
                  <a href="https://buildmarketlk.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5">
                    Visit Marketplace <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Sidebar Related Products Card */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[2rem] p-8 space-y-6 shadow-lg flex flex-col justify-between">
              <div>
                <h4 className="text-md font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-zinc-600 dark:text-zinc-300" /> Related Products
                </h4>

                <div className="space-y-3 pt-4">
                  <Link
                    href="/learnmore/erp-automations"
                    className="flex justify-between items-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-900 hover:border-lime/40 dark:hover:border-lime/30 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-300 group"
                  >
                    <div className="text-left">
                      <span className="font-bold text-sm text-zinc-900 dark:text-white group-hover:text-zinc-955 dark:group-hover:text-white transition-colors block">ERP Automations</span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-550 mt-0.5 block">Procurement workflow fit</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-955 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </Link>

                  <Link
                    href="/learnmore/cost-plan-calculator"
                    className="flex justify-between items-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-900 hover:border-lime/40 dark:hover:border-lime/30 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-300 group"
                  >
                    <div className="text-left">
                      <span className="font-bold text-sm text-zinc-900 dark:text-white group-hover:text-zinc-955 dark:group-hover:text-white transition-colors block">Cost Plan Calculator</span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-555 mt-0.5 block">Budgeting and feasibility</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-450 dark:text-zinc-550 group-hover:text-zinc-955 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </Link>

                  <Link
                    href="/learnmore/tender-evaluations"
                    className="flex justify-between items-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-900 hover:border-lime/40 dark:hover:border-lime/30 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-300 group"
                  >
                    <div className="text-left">
                      <span className="font-bold text-sm text-zinc-900 dark:text-white group-hover:text-zinc-955 dark:group-hover:text-white transition-colors block">Tender Evaluations</span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-555 mt-0.5 block">Supplier bids comparison</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-455 dark:text-zinc-550 group-hover:text-zinc-955 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-900 text-center">
                <Link
                  href="/learnmore"
                  className="text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white transition-colors inline-flex items-center gap-1 group"
                >
                  View full suite
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Footer Call-To-Action Banner (Soft CTA) */}
      <section className="py-32 px-6 border-t border-zinc-200 dark:border-zinc-900 bg-gradient-to-t from-[#F5F5F7] to-white dark:from-zinc-950 dark:to-black relative overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.01)_0%,transparent_60%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tighter text-zinc-950 dark:text-white leading-tight">
            Stop calling around. <br />
            Find your suppliers online.
          </h2>
          <p className="text-zinc-550 dark:text-zinc-450 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            See how BuildMarketlk.com brings marketplace transparency to the construction industry in Sri Lanka.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              className="w-full sm:w-auto rounded-full px-10 py-8 text-xl font-bold shadow-xl cursor-pointer bg-primary text-primary-foreground border-0 hover:scale-105 transition-transform duration-300"
            >
              <Link href="/pricing" className="flex items-center gap-2">
                Buy products <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            
            <Button
              asChild
              className="w-full sm:w-auto rounded-full px-10 py-8 text-xl font-bold shadow-xl cursor-pointer bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 border-0 hover:scale-105 transition-transform duration-300"
            >
              <a href="https://buildmarketlk.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                Visit BuildMarketlk.com <ExternalLink className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

