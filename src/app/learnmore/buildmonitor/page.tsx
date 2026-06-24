"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence, useScroll, useTransform, type Variants } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  X,
  Smartphone,
  WifiOff,
  Camera,
  FileText,
  LayoutTemplate,
  Globe,
  Database,
  ArrowRight,
  Play,
  Zap,
  Building2,
  Users,
  ChevronDown,
  ClipboardList,
  Gauge,
  AlertTriangle,
  Clock,
  Truck,
  ShieldCheck,
  MapPin,
  Settings,
  ArrowRightLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComparisonGrid from "@/components/learnmore/comparison-grid";

export default function BuildmonitorPage() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const startScrollYRef = useRef(0);

  const exitDemoMode = useCallback(() => {
    if (!isDemoMode) return;
    setIsDemoMode(false);
  }, [isDemoMode]);

  const enterDemoMode = useCallback(() => {
    setIsDemoMode(true);
  }, []);

  useEffect(() => {
    if (isDemoMode) {
      startScrollYRef.current = window.scrollY;
    }
  }, [isDemoMode]);

  useEffect(() => {
    if (!isDemoMode) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = Math.abs(currentScrollY - startScrollYRef.current);
      if (diff > 40) {
        exitDemoMode();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitDemoMode();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDemoMode, exitDemoMode]);

  // Apple-style custom ease
  const appleEase = [0.16, 1, 0.3, 1] as const;

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: appleEase } }
  };

  const staggerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  // Parallax setup for Hero
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 0.85]);

  return (
    <main className="min-h-screen bg-[#F5F5F7] dark:bg-black text-zinc-900 dark:text-zinc-50 antialiased selection:bg-[#FFEF1A]/30 selection:text-black overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-40 pb-20 overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="max-w-5xl mx-auto text-center space-y-8 relative z-30 w-full"
        >
          <Link
            href="/learnmore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-black/60 backdrop-blur-md text-sm font-semibold text-zinc-650 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-all hover:bg-white/80 dark:hover:bg-black/80 hover:scale-105 active:scale-95 group shadow-xs cursor-pointer mb-6"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Learn More
          </Link>



          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: appleEase, delay: 0.2 }}
            className="text-5xl sm:text-7xl lg:text-[7rem] font-semibold tracking-tighter text-zinc-950 dark:text-white leading-[1.05] uppercase product-title-sweep"
          >
            BuildMonitor Mobile App
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: appleEase, delay: 0.3 }}
            className="text-2xl sm:text-4xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-3xl mx-auto tracking-tight"
          >
            DPR written automatically. <br /> During the day, not after.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: appleEase, delay: 0.35 }}
            className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto"
          >
            Site personnel record progress on mobile as work happens. BuildMonitor generates the Daily Progress Report automatically in the format your contract requires — no typing, no Excel, no end-of-day admin.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: appleEase, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 pt-8"
          >
            <Button
              asChild
              className="rounded-full px-8 py-7 text-lg font-semibold shadow-xl cursor-pointer bg-[#FFEF1A] text-black hover:bg-[#FFEF1A]/90 border-0 hover:scale-105 transition-transform duration-300"
            >
              <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                Book a demo →
              </a>
            </Button>
            <Button
              onClick={enterDemoMode}
              variant="outline"
              className="rounded-full px-8 py-7 text-lg font-semibold cursor-pointer hover:scale-105 transition-transform duration-300 dark:border-zinc-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch demo
            </Button>
          </motion.div>

          {/* Apple-style Device Mockup Parallax */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: appleEase, delay: 0.5 }}
            className="mt-20 mx-auto max-w-[320px] bg-zinc-955 dark:bg-zinc-900 border-[12px] border-zinc-200 dark:border-[#222] rounded-[3rem] shadow-2xl relative overflow-hidden cursor-pointer group"
            onClick={enterDemoMode}
          >
            {/* iPhone Notch */}
            <div className="absolute top-0 inset-x-0 h-7 bg-zinc-200 dark:bg-[#222] rounded-b-[1.5rem] w-40 mx-auto z-20"></div>
            {/* Image mockup */}
            <img
              src="/images/buildMonitorAPPinscreen.png"
              alt="BuildMonitor App Screen"
              className="w-full h-auto object-cover relative z-10 transition-transform duration-500 group-hover:scale-102"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="bg-black text-white py-40 px-6 relative overflow-hidden">
        <motion.div
          variants={staggerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto space-y-12 text-center"
        >
          <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-semibold tracking-tighter leading-tight">
            The Daily Progress Report <br /> is still a manual task.
          </motion.h2>
          <motion.div variants={fadeUp} className="prose prose-invert max-w-2xl mx-auto text-zinc-400 text-xl md:text-2xl leading-relaxed tracking-tight">
            <p>On every construction project, the Site Manager or foreman is contractually required to produce a Daily Progress Report — documenting what work was done, quantities, safety incidents, and issues.</p>
            <p>Today, this is still done by typing a report in Excel at the end of a twelve-hour shift. The site team has no time during the day to record structured data. Information is captured from memory, not from observation. By the time the DPR is written, details are forgotten or incorrect.</p>
            <p>The report exists only in the format the site manager knows how to create, not necessarily the format the contract requires.</p>
            <p className="text-white font-medium">BuildMonitor moves DPR creation from the end of a shift (manual typing in exhaustion) to during the workday (structured data capture on mobile) and then generates the contractually compliant report automatically.</p>
          </motion.div>
        </motion.div>
      </section>
      {/* How it works (Interactive Timeline) */}
      <section className="py-32 px-6 bg-white dark:bg-zinc-950 border-y border-zinc-200 dark:border-zinc-900">
        <div className="max-w-6xl mx-auto space-y-24">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">
              Workflow Automation
            </span>
            <h2 className="text-4xl sm:text-6xl font-semibold tracking-tighter text-zinc-900 dark:text-white">
              How it works
            </h2>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">
              A structured, compliant process from the field directly to your back office.
            </p>
          </div>

          {/* Timeline Steps */}
          <div className="relative max-w-4xl mx-auto pl-8 sm:pl-16 border-l-2 border-[#FFEF1A]/40 dark:border-[#FFEF1A]/20 space-y-20">
            {/* Step 1 */}
            <div className="relative">
              {/* Step indicator circle */}
              <div className="absolute -left-[49px] sm:-left-[81px] top-1.5 w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border-4 border-[#FFEF1A]/40 dark:border-[#FFEF1A]/20 flex items-center justify-center text-xs font-bold text-zinc-400 z-10">
                1
              </div>
              <div className="space-y-4">
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full border border-zinc-200/50 dark:border-zinc-800/50">
                  Step 1: Initiation
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                  Site personnel open BuildMonitor app
                </h3>
                <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                  Available on Android and iOS. Offline mode for sites with poor connectivity.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -left-[49px] sm:-left-[81px] top-1.5 w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border-4 border-[#FFEF1A]/40 dark:border-[#FFEF1A]/20 flex items-center justify-center text-xs font-bold text-zinc-450 z-10">
                2
              </div>
              <div className="space-y-6">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full border border-zinc-200/50 dark:border-zinc-800/50">
                    Step 2: Progress Recording
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                    Record progress during the workday
                  </h3>
                  <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                    Instead of writing from memory at the end of the shift, log work, counts, and issues directly as they occur.
                  </p>
                </div>

                {/* Progress Checklist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl pt-2">
                  {[
                    { label: "Progress checklist", desc: "Which activities completed", icon: ClipboardList },
                    { label: "Quantities completed", desc: "Cubic metres concrete, square metres formwork, etc.", icon: Gauge },
                    { label: "Photos of completed work", desc: "With automatic timestamp and location", icon: Camera },
                    { label: "Safety incidents", desc: "Record near-misses and hazards instantly", icon: AlertTriangle },
                    { label: "Issues or delays", desc: "Document blockers and reason", icon: Clock },
                    { label: "Equipment on site", desc: "Track machinery status and hours", icon: Truck },
                    { label: "Labour count", desc: "Log subcontractor and trade counts", icon: Users }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-[#FFEF1A]" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm text-zinc-900 dark:text-white">{item.label}</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -left-[49px] sm:-left-[81px] top-1.5 w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border-4 border-[#FFEF1A]/40 dark:border-[#FFEF1A]/20 flex items-center justify-center text-xs font-bold text-zinc-450 z-10">
                3
              </div>
              <div className="space-y-4">
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full border border-zinc-200/50 dark:border-zinc-800/50">
                  Step 3: Synchronization
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                  Information syncs to office
                </h3>
                <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                  When connection is available (WiFi or mobile data), the logged information syncs automatically to the office system and directly to the ERP.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="absolute -left-[49px] sm:-left-[81px] top-1.5 w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border-4 border-[#FFEF1A]/40 dark:border-[#FFEF1A]/20 flex items-center justify-center text-xs font-bold text-zinc-455 z-10">
                4
              </div>
              <div className="space-y-6">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full border border-zinc-200/50 dark:border-zinc-800/50">
                    Step 4: Report Generation
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                    Daily Progress Report generated automatically
                  </h3>
                  <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                    No formatting or compiling. BuildMonitor builds a comprehensive DPR matching contract demands.
                  </p>
                </div>

                {/* DPR Contents Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl pt-2">
                  {[
                    { label: "Activities completed", desc: "With start/end times explicitly listed", icon: Clock },
                    { label: "Quantities with source", desc: "Manually recorded or auto-calculated", icon: Gauge },
                    { label: "Linked Photos", desc: "Photos attached to specific activities as evidence", icon: Camera },
                    { label: "Safety summary", desc: "Consolidated list of safety hazards/near-misses", icon: ShieldCheck },
                    { label: "Issues & resolutions", desc: "Blockers logged along with resolution status", icon: FileText },
                    { label: "Labour hours by trade", desc: "Aggregated timesheet and subcontractor stats", icon: Users },
                    { label: "Equipment hours", desc: "Run-time log of site equipment", icon: Truck }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-[#FFEF1A]" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm text-zinc-900 dark:text-white">{item.label}</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="relative">
              <div className="absolute -left-[49px] sm:-left-[81px] top-1.5 w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border-4 border-[#FFEF1A]/40 dark:border-[#FFEF1A]/20 flex items-center justify-center text-xs font-bold text-zinc-450 z-10">
                5
              </div>
              <div className="space-y-4">
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full border border-zinc-200/50 dark:border-zinc-800/50">
                  Step 5: Compliance & Export
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                  DPR is contractually compliant
                </h3>
                <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                  Format matches FIDIC, NEC, JCT requirements (fully configurable). Ready to submit to clients or administrators. Exportable as PDF, email, or direct sync to PM tools.
                </p>
              </div>
            </div>
          </div>

          {/* Features Bento Grid */}
          <div className="pt-24 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                Product Capabilities
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Core Features
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Offline mode", desc: "Works on site with no connectivity. Syncs when network is available.", icon: WifiOff, span: "md:col-span-1" },
                { title: "Photo tagging", desc: "Timestamp and GPS location automatically recorded with every photo.", icon: MapPin, span: "md:col-span-1" },
                { title: "Customizable template", desc: "Match your contract or client requirements (FIDIC, NEC, JCT, custom).", icon: Settings, span: "md:col-span-1" },
                { title: "Multi-language", desc: "Supports site teams in local languages for higher compliance and accuracy.", icon: Globe, span: "md:col-span-1" },
                { title: "ERP sync", desc: "All data flows to your ERP automatically (no double entry).", icon: Database, span: "md:col-span-2" }
              ].map((feature, idx) => (
                <div key={idx} className={`${feature.span} bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850/80 rounded-3xl p-8 hover:scale-[1.01] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group`}>
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <feature.icon className="w-6 h-6 text-[#FFEF1A]" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-zinc-900 dark:text-white">{feature.title}</h4>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-32 px-6 bg-zinc-50 dark:bg-zinc-900/40 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest block">
              Systems Compatibility
            </span>
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tighter text-zinc-900 dark:text-white">
              Fits into your workflow
            </h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
              Seamlessly bridge the gap between site activities and back-office management systems.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-6">
            {/* Input Card */}
            <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">What feeds in</span>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Data Input</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                  Site team activity and progress logged directly via mobile recording.
                </p>
              </div>
              <div className="mt-8 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-850/50 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-850 flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4 text-[#FFEF1A]" />
                  </div>
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Site Progress Checklist</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-850 flex items-center justify-center shrink-0">
                    <Camera className="w-4 h-4 text-[#FFEF1A]" />
                  </div>
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Media & Incident Photos</span>
                </div>
              </div>
            </div>

            {/* Core Processor Card */}
            <div className="lg:col-span-4 bg-zinc-900 dark:bg-zinc-955 text-white rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group border border-zinc-800">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFEF1A]/10 to-transparent pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">Processing Core</span>
                <h3 className="text-2xl font-bold tracking-tight">BuildMonitor App</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Formats and organizes data points dynamically to generate compliance reports.
                </p>
              </div>
              <div className="relative z-10 mt-8 bg-zinc-955 dark:bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-[#FFEF1A] animate-pulse" />
                  <span className="text-xs font-medium text-zinc-200">Automated DPR Compiler</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowRightLeft className="w-5 h-5 text-[#FFEF1A]" />
                  <span className="text-xs font-medium text-zinc-200">Real-time Cloud Sync</span>
                </div>
              </div>
            </div>

            {/* Output Card */}
            <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">What it feeds into</span>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Downstream Systems</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                  Automatic data distribution to compliance and financial pipelines.
                </p>
              </div>
              <div className="mt-8 bg-zinc-50 dark:bg-zinc-955 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/50 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-850 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-[#FFEF1A]" />
                  </div>
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Daily Progress Report (DPR)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-850 flex items-center justify-center shrink-0">
                    <Database className="w-4 h-4 text-[#FFEF1A]" />
                  </div>
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">ERP system sync</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-850 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-[#FFEF1A]" />
                  </div>
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">MeasureonAir measurement</span>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Pipeline */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 md:p-10 shadow-sm space-y-8">
            <h4 className="text-center font-bold text-sm tracking-wider uppercase text-zinc-500">
              Workflow pipeline
            </h4>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 text-center w-full md:w-auto">
                Site Activity
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-400 rotate-90 md:rotate-0" />
              <div className="px-6 py-3 bg-zinc-900 dark:bg-zinc-800 text-zinc-100 dark:text-zinc-200 rounded-xl border-2 border-[#FFEF1A] text-center w-full md:w-auto font-bold animate-pulse">
                BuildMonitor App
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-400 rotate-90 md:rotate-0" />
              <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 text-center w-full md:w-auto">
                Daily Progress Report Generated
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-400 rotate-90 md:rotate-0" />
              <div className="px-6 py-3 bg-zinc-950 text-white rounded-xl border border-zinc-850 text-center w-full md:w-auto">
                Submitted to Client + ERP Updated
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Availability Section */}
      <section className="py-32 px-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="space-y-4">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">
              Investment & Setup
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
              Pricing & Availability
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side: Pricing details */}
            <div className="space-y-6">
              <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm border-l-4 border-l-[#FFEF1A] space-y-3">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Pricing Model</span>
                <h3 className="text-3xl font-black text-zinc-900 dark:text-white">Per-User License</h3>
                <p className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white mt-4">
                  USD 100 <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">/ user / year</span>
                </p>
                <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800 my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
                  Typical project: 3–5 site personnel (so USD 300–500/year per project).
                </p>
              </div>

              <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm space-y-4 text-sm leading-relaxed">
                <div>
                  <strong className="text-zinc-900 dark:text-white font-bold block mb-1">Status</strong>
                  <span className="text-zinc-500 dark:text-zinc-400">Scaling with sales</span>
                </div>
                <div>
                  <strong className="text-zinc-900 dark:text-white font-bold block mb-1">Target Markets</strong>
                  <span className="text-zinc-500 dark:text-zinc-400">Contractors, builders (Middle East, Sri Lanka primary)</span>
                </div>
                <div>
                  <strong className="text-zinc-900 dark:text-white font-bold block mb-1">Implementation Timeline</strong>
                  <span className="text-zinc-500 dark:text-zinc-400">1 week (app setup + user training)</span>
                </div>
                <div>
                  <strong className="text-zinc-900 dark:text-white font-bold block mb-1">Best For</strong>
                  <span className="text-zinc-500 dark:text-zinc-400">Site managers, foremen, construction teams</span>
                </div>
              </div>
            </div>

            {/* Right side: Quick Facts & Related Products */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6 uppercase text-sm text-zinc-900 dark:text-white tracking-wider">
                  Quick Facts
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center border-b border-zinc-50 dark:border-zinc-850 pb-2">
                    <span className="text-zinc-500 dark:text-zinc-450 font-medium">Stage</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">Construction</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-50 dark:border-zinc-850 pb-2">
                    <span className="text-zinc-500 dark:text-zinc-450 font-medium">Best for</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-right">Site managers, foremen, teams</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-50 dark:border-zinc-850 pb-2">
                    <span className="text-zinc-500 dark:text-zinc-450 font-medium">Regions</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">Middle East, Sri Lanka</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-50 dark:border-zinc-850 pb-2">
                    <span className="text-zinc-500 dark:text-zinc-450 font-medium">Time to implement</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">1 week</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-50 dark:border-zinc-850 pb-2">
                    <span className="text-zinc-500 dark:text-zinc-455 font-medium">Pricing</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">USD 100 / user / year</span>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full mt-8 rounded-xl py-6 font-bold bg-[#FFEF1A] text-black hover:bg-[#FFEF1A]/90 cursor-pointer shadow-md border-0 transition-colors duration-300"
                >
                  <a
                    href="/pricing?product=build_monitor"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buy Products <ArrowRight className="w-4 h-4 ml-1 inline" />
                  </a>
                </Button>
              </div>

              <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Related Products</h4>
                  <Link href="/learnmore" className="text-xs font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline">View full suite</Link>
                </div>
                <ul className="space-y-3 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  <li>
                    <Link href="/learnmore/measureonair" className="hover:text-[#FFEF1A] dark:hover:text-[#FFEF1A] transition-colors flex items-center justify-between">
                      <span>MeasureonAir</span>
                      <span className="text-[10px] font-medium text-zinc-400 bg-zinc-50 dark:bg-zinc-950 px-2 py-0.5 rounded border border-zinc-200/50 dark:border-zinc-800">Payment Applications</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/learnmore/tender-evaluations" className="hover:text-[#FFEF1A] dark:hover:text-[#FFEF1A] transition-colors flex items-center justify-between">
                      <span>Tender Evaluations</span>
                      <span className="text-[10px] font-medium text-zinc-400 bg-zinc-50 dark:bg-zinc-950 px-2 py-0.5 rounded border border-zinc-200/50 dark:border-zinc-800">Procurement</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/learnmore/builderbot" className="hover:text-[#FFEF1A] dark:hover:text-[#FFEF1A] transition-colors flex items-center justify-between">
                      <span>BuilderBot.ai</span>
                      <span className="text-[10px] font-medium text-zinc-400 bg-zinc-50 dark:bg-zinc-950 px-2 py-0.5 rounded border border-zinc-200/50 dark:border-zinc-800">Contract Management</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <ComparisonGrid
        sectionTitle="Why choose BuildMonitor"
        card1={{
          title: "Traditional Route",
          subtitle: "Manual Excel DPR",
          features: [
            "1+ hour per day per site manager (at end of shift)",
            "Information from memory, not observation",
            "Format depends on who is writing (inconsistent)",
            "No photo evidence linked to progress",
            "Manual ERP entry (double work)",
            "Errors in manual data entry",
          ],
          metric: { value: "1+ hr", label: "per day" },
          button: { text: "Manual Method", href: "#" },
        }}
        card2={{
          title: "BuildMonitor",
          subtitle: "BuildMonitor App",
          badge: "Concolabs",
          features: [
            "10 minutes per day (quick checklist + photos)",
            "Information recorded as work happens",
            "Format standardized (contract-compliant)",
            "Photos automatically linked to activities",
            "ERP updated automatically (no double entry)",
            "Data quality high (structured capture)",
          ],
          metric: { value: "10 min", label: "per day" },
          button: { text: "Book A Demo", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
        }}
        card3={{
          title: "Other Apps",
          subtitle: "Existing Apps",
          features: [
            "Require connectivity or work offline poorly",
            "Don't auto-generate DPRs",
            "Don't sync to ERP automatically",
            "Still require manual DPR writing",
          ],
          metric: { value: "PARTIAL / MANUAL", label: "" },
          button: { text: "Other Apps", href: "#" },
        }}
      />

      {/* FAQ */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerVariants}>
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "What if the site has no internet connectivity?",
                a: "BuildMonitor works fully offline. Data syncs when connection is available (WiFi or mobile). Offline queue ensures no data is lost."
              },
              {
                q: "Can we customize the app to our own DPR format?",
                a: "Yes. We configure the template to match your contract requirements (FIDIC, NEC, JCT) or custom format. Setup takes 1–2 days."
              },
              {
                q: "What happens if information is entered incorrectly?",
                a: "Site manager can review the generated DPR before submission and make corrections. Changes are tracked and auditable."
              },
              {
                q: "Does it work on older mobile devices?",
                a: "Minimum requirements: Android 8.0 or iOS 12. Works on basic smartphones, not just modern devices."
              },
              {
                q: "Can multiple users enter data on the same project?",
                a: "Yes. Each user can record their own progress. System consolidates information into a single DPR."
              },
              {
                q: "How is data secured?",
                a: "All data is encrypted in transit and at rest. Access controls ensure only authorized personnel can view or edit project data."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="border-b border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between py-6 text-left font-semibold text-xl tracking-tight text-zinc-900 dark:text-white cursor-pointer hover:opacity-70 transition-opacity"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-300 shrink-0 ml-4 ${activeFaq === idx ? "rotate-180" : "rotate-0"
                      }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: appleEase }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 pr-8">
                        <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed font-medium">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Footer */}
      <section className="py-32 px-6 relative overflow-hidden flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-5xl sm:text-7xl font-bold tracking-tighter text-zinc-950 dark:text-white leading-[1.1]">
            Your DPR should be generated, not typed.
          </h2>
          <p className="text-zinc-500 text-xl max-w-2xl mx-auto leading-relaxed font-medium tracking-tight">
            See how BuildMonitor Mobile App eliminates the end-of-day admin burden.
          </p>
          <div className="pt-8 flex justify-center">
            <Button
              asChild
              className="rounded-full px-10 py-8 text-xl font-bold shadow-xl cursor-pointer bg-[#FFEF1A] text-black hover:bg-[#FFEF1A]/90 border-0 hover:scale-105 transition-transform duration-300"
            >
              <a
                href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a demo →
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Lightbox for Demo Video */}
      <AnimatePresence>
        {isDemoMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
            onClick={exitDemoMode}
          >
            <motion.div
              initial={{ scale: 0.5, y: 100, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.5, y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-[320px] aspect-[9/19] bg-black border-[12px] border-zinc-200 dark:border-[#222] rounded-[3rem] shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* iPhone Notch */}
              <div className="absolute top-0 inset-x-0 h-7 bg-zinc-200 dark:bg-[#222] rounded-b-[1.5rem] w-40 mx-auto z-20"></div>
              {/* Embed Google Drive demo video preview on the screen */}
              <iframe
                src="https://drive.google.com/file/d/1bof_YpZZdzkxGAQEfGqYNdAASqSkiZ0p/preview?autoplay=1"
                className="w-full h-full border-0 relative z-10"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

