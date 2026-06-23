"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer";
import {
  ArrowLeft,
  Check,
  X,
  Play,
  Mail,
  FileText,
  Smartphone,
  Cpu,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Calendar,
  Lock,
  ShieldCheck,
  Building2,
  Database,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Globe,
  Users,
  Plus,
  Minus,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComparisonGrid from "@/components/learnmore/comparison-grid";

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
} as const;

export default function ERPAutomationsPage() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isSubmitShake, setIsSubmitShake] = useState(false);

  const videoSectionRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const isPricingInView = useInView(pricingRef, { once: true });

  // Auto-toggle Before/After every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev === "before" ? "after" : "before"));
    }, 3500);
    return () => clearInterval(timer);
  }, [autoToggleKey]);

  const handleTabClick = (tab: "before" | "after") => {
    setActiveTab(tab);
    setAutoToggleKey((k) => k + 1);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === "concolabs") {
      setIsUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setIsSubmitShake(true);
      setTimeout(() => setIsSubmitShake(false), 500);
    }
  };

  const scrollToVideo = useCallback(() => {
    videoSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-lime/30 selection:text-black overflow-x-hidden">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-zinc-50 dark:bg-zinc-950 pt-16">
        {/* Background glows */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-gradient-to-br from-lime/20 via-lime/10 to-transparent rounded-full blur-[130px] mix-blend-multiply dark:mix-blend-screen opacity-75 animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] bg-gradient-to-tr from-lime/10 via-zinc-400/5 to-transparent rounded-full blur-[140px] mix-blend-multiply dark:mix-blend-screen opacity-65" />
          <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/60 backdrop-blur-[1px]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
              backgroundSize: "44px 44px",
            }}
          />
        </div>

        {/* Back button */}
        <div className="absolute top-28 left-6 z-30">
          <Link
            href="/learnmore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-sm font-semibold text-zinc-650 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-all hover:bg-white/80 dark:hover:bg-black/80 hover:scale-105 active:scale-95 group shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Learn More
          </Link>
        </div>

        <div className="relative w-full z-10">
          <div className="px-6 pt-32 pb-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column */}
            <div className="lg:col-span-7 space-y-8">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.h1
                  variants={fadeInUp}
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.05] uppercase product-title-sweep"
                >
                  ERP Automations
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-300 font-semibold leading-relaxed max-w-xl"
                >
                  Mobile to finance.{" "}
                  <span className="text-zinc-950 dark:text-white font-bold">Automated end-to-end.</span>
                </motion.p>

                {/* Before/After mini-switcher in hero */}
                <motion.div
                  variants={fadeInUp}
                  className="relative bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/70 dark:border-zinc-800/70 rounded-3xl p-6 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4 border-b border-zinc-150 dark:border-zinc-850 pb-3">
                    <h3 className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white">
                      Compare Entry Workflows
                    </h3>
                    <div className="relative flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl w-52 justify-between border border-zinc-200/50 dark:border-zinc-850/50">
                      <button
                        onClick={() => handleTabClick("before")}
                        className={`relative z-10 w-[50%] py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${activeTab === "before" ? "text-zinc-900 dark:text-white" : "text-zinc-400"
                          }`}
                      >
                        Manual
                      </button>
                      <button
                        onClick={() => handleTabClick("after")}
                        className={`relative z-10 w-[50%] py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${activeTab === "after" ? "text-zinc-900 dark:text-white" : "text-zinc-400"
                          }`}
                      >
                        Automated
                      </button>
                      <motion.div
                        layout
                        className="absolute top-1 bottom-1 bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-lg"
                        style={{ width: "calc(50% - 4px)" }}
                        animate={{
                          left: activeTab === "before" ? 4 : "calc(100% / 2 + 4px)",
                        }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      />
                    </div>
                  </div>

                  <div className="min-h-[130px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      {activeTab === "before" ? (
                        <motion.div
                          key="before"
                          initial={{ opacity: 0, x: -14 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 14 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2.5"
                        >
                          <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                            Manual ERP Entry
                          </div>
                          <ul className="space-y-1.5">
                            {["Admin reads emails and types into ERP manually", "Field data synced hours or days later", "High risk of coding errors and duplicates"].map((item) => (
                              <li key={item} className="flex gap-2 text-zinc-650 dark:text-zinc-400 text-xs">
                                <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="after"
                          initial={{ opacity: 0, x: 14 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -14 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2.5"
                        >
                          <div className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                            ERP Automations
                          </div>
                          <ul className="space-y-1.5">
                            {["Email → job card in seconds, zero typing", "Mobile app data syncs to finance in real time", "100% data integrity, errors eliminated"].map((item) => (
                              <li key={item} className="flex gap-2 text-zinc-650 dark:text-zinc-350 text-xs">
                                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-2">
                  <Button
                    onClick={scrollToVideo}
                    variant="outline"
                    size="lg"
                    className="rounded-2xl px-8 py-7 font-bold shadow-sm cursor-pointer border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 transition-transform hover:scale-105"
                  >
                    <Play className="w-4 h-4 mr-2 text-zinc-900 dark:text-zinc-300 fill-zinc-900 dark:fill-zinc-300" />
                    Watch Demo
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="rounded-2xl px-8 py-7 font-bold shadow-xl shadow-lime/10 cursor-pointer bg-lime text-black hover:bg-lime/90 border-0 transition-transform hover:scale-105"
                  >
                    <a
                      href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Book a demo →
                    </a>
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column – Live Stats Mockup */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute -inset-1 rounded-[30px] bg-gradient-to-tr from-lime to-transparent opacity-20 blur-lg" />
                <div className="relative rounded-[28px] overflow-hidden border border-zinc-200/70 dark:border-zinc-800/70 bg-white/80 dark:bg-zinc-900/50 shadow-xl p-6 space-y-5 backdrop-blur-xl">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-4">
                    <div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ERP Automations</div>
                      <div className="text-base font-bold text-zinc-900 dark:text-white">Live Sync Dashboard</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Active</span>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Model Efficiency", value: "99.4%", color: "text-zinc-900 dark:text-white" },
                      { label: "Jobs Automated", value: "14,204", color: "text-zinc-900 dark:text-white" },
                      { label: "Errors Flagged", value: "12", color: "text-red-500" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="bg-zinc-50 dark:bg-zinc-950/60 rounded-xl p-3 border border-zinc-100 dark:border-zinc-800 space-y-1">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">{label}</span>
                        <p className={`text-lg font-mono font-bold ${color}`}>{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Flow visual */}
                  <div className="bg-zinc-50 dark:bg-zinc-950/60 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800 space-y-3">
                    <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Email → Job Card Pipeline</div>
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span className="px-2 py-1 bg-lime/10 border border-lime/20 rounded text-zinc-700 dark:text-zinc-300 truncate max-w-[140px]">"Order 50m³ concrete..."</span>
                      <ArrowRight className="w-3 h-3 text-zinc-900 dark:text-zinc-300 shrink-0" />
                      <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-900 dark:text-zinc-100 font-bold">JC-4821 <span className="text-emerald-500">✓</span></span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-lime h-1.5 rounded-full" style={{ width: "92%" }} />
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-400 font-mono">
                      <span>Parsing</span><span>Validation</span><span className="text-zinc-950 dark:text-white font-bold">ERP Posted ✓</span>
                    </div>
                  </div>

                  {/* Data tags */}
                  <div className="flex flex-wrap gap-1.5 text-[9px]">
                    {["SAP", "Oracle", "NetSuite", "Sage", "Custom ERP"].map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-350 border border-zinc-200/50 dark:border-zinc-700 font-bold">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── PROBLEM SECTION ─── */}
      <section className="relative py-32 px-6 bg-white dark:bg-zinc-950 overflow-hidden border-y border-zinc-200 dark:border-zinc-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-6"
          >
            <span className="text-xs font-bold text-zinc-450 dark:text-zinc-550 uppercase tracking-widest block">
              The Problem
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight uppercase">
              Your ERP is only as good as your data entry.
            </h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400 text-base leading-relaxed font-medium">
              <p>
                ERP systems are the source of truth for project status, costs, and cash flow. But ERP data quality depends entirely on manual entry.
              </p>
              <p>
                A manager sends an email. An admin transcribes it. A site worker records something on mobile. Someone types it into the ERP hours or days later. The gap between reality and your ERP is where budget overruns hide.
              </p>
              <p className="text-zinc-950 dark:text-white font-bold">
                ERP Automations closes that gap entirely.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: Mail,
                  title: "Transcription Bottleneck",
                  desc: "Admin staff read emails and manually type into ERP job cards. Hours wasted daily.",
                  stat: "Admin hours wasted weekly",
                },
                {
                  icon: Smartphone,
                  title: "Disconnected Mobile",
                  desc: "Field data uploaded separately. Financial records lag behind actual work by 1–2 days.",
                  stat: "24–48h finance delays",
                },
                {
                  icon: FileText,
                  title: "Transcription Errors",
                  desc: "Typos, wrong cost codes, duplicate jobs. Discrepancies cause tracking issues.",
                  stat: "High error risk",
                },
              ].map(({ icon: Icon, title, desc, stat }) => (
                <div key={title} className="bg-red-500/[0.02] border border-red-200/50 dark:border-red-500/10 rounded-2xl p-6 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-4 h-4 text-red-500" />
                    </div>
                    <h3 className="font-bold text-zinc-950 dark:text-white text-sm mb-1">{title}</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">{desc}</p>
                  </div>
                  <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-2">
                    <X className="w-3 h-3" /> {stat}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/40 border-b border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block">Workflow</span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white uppercase">How It Works</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Email instructions become ERP job cards. Mobile data syncs to finance. No human transcription required.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Mail, num: "01", title: "Email Received", desc: "Manager sends email instructions for ordering materials, starting tasks, or assigning vendors.", highlight: false },
              { icon: Cpu, num: "02", title: "AI Parsing", desc: "ML model extracts vendor, quantities, cost centers, and job codes from the email automatically.", highlight: false },
              { icon: Database, num: "03", title: "ERP Job Card Created", desc: "Populated job card is created in SAP, Oracle, NetSuite, or your ERP — zero typing required.", highlight: false },
              { icon: TrendingUp, num: "04", title: "Finance Updated", desc: "Site mobile data flows directly to finance. Ledger reflects reality in real time.", highlight: false },
            ].map(({ icon: Icon, num, title, desc, highlight }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative rounded-3xl p-8 flex flex-col gap-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group ${highlight
                  ? "bg-lime border border-lime"
                  : "bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${highlight
                    ? "bg-zinc-950/10 border border-zinc-950/20 group-hover:bg-zinc-950/20"
                    : "bg-lime/10 border border-lime/20 group-hover:bg-lime/20"
                    }`}>
                    <Icon className={`w-7 h-7 ${highlight ? "text-zinc-950" : "text-zinc-900 dark:text-white"}`} />
                  </div>
                  <span className={`text-5xl font-black select-none ${highlight ? "text-zinc-950/20" : "text-zinc-100 dark:text-zinc-800"}`}>{num}</span>
                </div>
                <div className="space-y-2">
                  <h3 className={`text-lg font-bold uppercase tracking-tight ${highlight ? "text-zinc-950" : "text-zinc-950 dark:text-white"}`}>{title}</h3>
                  <p className={`text-sm leading-relaxed ${highlight ? "text-zinc-800" : "text-zinc-500 dark:text-zinc-400"}`}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEMO / VIDEO SECTION ─── */}
      <section ref={videoSectionRef} className="py-24 px-6 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">Watch It In Action</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase">Interactive Demonstration</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Click play to view a walkthrough of our ML model processing site instructions and updating the ERP ledger.
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-zinc-100 dark:bg-zinc-900 aspect-video border border-zinc-200 dark:border-zinc-800 cursor-pointer group flex items-center justify-center max-w-4xl mx-auto"
            onClick={() => setIsLightboxOpen(true)}
          >
            {/* Mock dashboard */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between select-none opacity-40 group-hover:opacity-55 transition-opacity duration-300">
              <div className="flex justify-between items-center border-b border-zinc-300 dark:border-zinc-700 pb-3">
                <span className="text-xs font-mono text-zinc-500">concolabs_erp_automations v2.1</span>
                <span className="w-2.5 h-2.5 rounded-full bg-lime animate-pulse" />
              </div>
              <div className="grid grid-cols-3 gap-4 my-auto">
                {[{ label: "Model Efficiency", val: "99.4%", accent: true }, { label: "Jobs Automated", val: "14,204", accent: false }, { label: "Errors Flagged", val: "12", red: true }].map(({ label, val, accent, red }) => (
                  <div key={label} className="bg-white/60 dark:bg-zinc-800/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">{label}</span>
                    <p className={`text-2xl font-mono ${accent ? "text-zinc-900 dark:text-white" : red ? "text-red-400" : "text-zinc-900 dark:text-white"}`}>{val}</p>
                  </div>
                ))}
              </div>
              <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div className="h-full bg-lime w-2/3 rounded-full" />
              </div>
            </div>

            {/* Play button */}
            <div className="relative z-10 w-20 h-20 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/40 dark:border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-xl">
              <Play className="w-8 h-8 text-zinc-900 dark:text-white fill-zinc-900 dark:fill-white translate-x-0.5" />
            </div>

            {/* Badge */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center bg-white/80 dark:bg-black/80 backdrop-blur-md px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-300" /> Restricted: Client Configurations Shown
              </span>
              <span className="text-[10px] font-mono text-zinc-500">Requires Access Credentials</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CAPABILITIES BENTO ─── */}
      <section className="bg-[#F4F2F0] dark:bg-zinc-900/30 border-b border-zinc-200 dark:border-zinc-800 py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-10">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block">Capabilities</span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.1] uppercase">
                Fits into your workflow
              </h2>
              <p className="text-zinc-550 dark:text-zinc-400 text-base sm:text-lg font-medium">
                Connect your existing ERP natively. Keep your financial records current in real time.
              </p>
            </div>
            <div className="flex md:justify-end items-center shrink-0">
              <Button
                asChild
                size="lg"
                className="rounded-xl px-6 py-5 font-bold shadow-md bg-lime text-black hover:bg-lime/90 border-0 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                  Book a Demo →
                </a>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Tall card — Email Parsing */}
            <div className="lg:row-span-2 bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-300 shadow-sm">
              <div className="space-y-4">
                <span className="text-[9px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest block">Layer 1</span>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Email-to-ERP Parsing</h3>
                <p className="text-zinc-550 dark:text-zinc-400 text-sm leading-relaxed">
                  Manager sends email instructions. The ML model extracts vendor details, cost centers, and quantities to populate job cards automatically. No admin needed.
                </p>
              </div>
              <div className="mt-10 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-4 shadow-sm space-y-3">


              </div>
            </div>

            {/* Wide card — Live Sync */}
            <div className="lg:col-span-2 bg-zinc-950 text-white border border-zinc-900 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row justify-between gap-8 overflow-hidden relative group shadow-xl">
              <div className="flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-[9px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest block">Layer 2</span>
                  <h3 className="text-2xl font-bold tracking-tight text-white leading-tight">SAP &amp; Oracle Live Sync</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Continuous synchronization of site timesheets, material receipts, and machinery records directly to standard ledger architectures.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-lime animate-ping" />

                </div>
              </div>

              {/* Flow path visual */}
              <div className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 min-h-[160px] relative overflow-hidden flex flex-col justify-center shadow-inner">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--color-lime-rgb,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--color-lime-rgb,0.02)_1px,transparent_1px)] bg-[size:14px_20px]" />
                <div className="relative z-10 space-y-3 text-xs font-mono">
                  {["Site App → ERP Automations", "ERP Automations → SAP / Oracle", "Finance Updated in Real Time"].map((line, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-lime shrink-0" />
                      <span className="text-zinc-300">{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ML card */}
            <div className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-300 group">
              <div className="space-y-4">
                <span className="text-[9px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest block">Layer 3</span>
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">Adaptive ML Models</h3>
                <p className="text-zinc-550 dark:text-zinc-400 text-sm leading-relaxed">
                  Custom ML configurations trained on your legacy email records to auto-populate codes. Improves continuously over time.
                </p>
              </div>

            </div>

            {/* Legacy connectors card */}
            <div className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-300 group">
              <div className="space-y-4">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Legacy Bridge</span>
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">Sage &amp; NetSuite</h3>
                <p className="text-zinc-550 dark:text-zinc-400 text-sm leading-relaxed">
                  Pre-built connectors to link legacy financial modules without rebuilding IT stacks.
                </p>
              </div>

            </div>

          </div>


        </div>
      </section>

      {/* ─── WORKFLOW PIPELINE ─── */}
      <section className="py-24 px-6 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">Integration Flow</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase">End-to-End Data Pipeline</h2>
          </div>

          <div className="relative p-8 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
            <div className="relative flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 z-10">
              {[
                { label: "Site Activity", icon: Building2 },
                { label: "BuildMonitor App", icon: Smartphone },
                { label: "ERP Automations", icon: Cpu, highlight: true },
                { label: "ERP Updated", icon: Database },
                { label: "Finance Updated", icon: TrendingUp },
                { label: "Dashboards", icon: Sparkles }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-2.5 w-full max-w-[120px] relative">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md relative z-10 transition-colors ${step.highlight
                    ? "bg-lime text-black"
                    : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                    }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold tracking-tight text-zinc-900 dark:text-zinc-300 leading-tight">
                    {step.label}
                  </span>
                  {i < 5 && (
                    <div className="hidden md:block absolute left-[70%] top-6 w-full h-[1.5px] bg-gradient-to-r from-zinc-300 dark:from-zinc-700 to-transparent z-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={pricingRef} className="py-32 px-6 bg-[#FAFAF8]">
        <div className="space-y-16 max-w-4xl mx-auto">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Deployment</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-zinc-950">Pricing & Availability</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4"
            >
              <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-sm hover:shadow-xl transition-all duration-300">
                <span className="text-xs text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-widest font-mono">Enterprise Subscription</span>
                <p className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">USD 800<span className="text-sm font-normal text-zinc-400 font-sans">/month</span></p>
                <p className="text-xs text-zinc-500 leading-normal">Billed monthly. Covers core ML email-to-ERP parsing, real-time sync, and standard system support.</p>
              </div>
              <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-sm hover:shadow-xl transition-all duration-300">
                <span className="text-xs text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-widest font-mono">Enterprise Add-on</span>
                <p className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">Custom Plan</p>
                <p className="text-xs text-zinc-500 leading-normal">One-off customized configuration and API mappings for proprietary ERP workflows (SAP, Oracle, NetSuite).</p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16 border-t border-zinc-200 dark:border-zinc-800">
            {/* Quick Facts Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-8 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-xl border-b border-zinc-100 dark:border-zinc-800 pb-4 text-zinc-900 dark:text-white">Quick Facts</h3>
                <div className="space-y-5 pt-4">
                  {[
                    { label: "Stage", value: "Operations" },
                    { label: "Best For", value: "Contractors, Developers" },
                    { label: "Calibration", value: "2 weeks" },
                    { label: "Pricing", value: "USD 800/month flat-rate" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2">
                      <span className="text-zinc-500 font-semibold">{item.label}</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                asChild
                className="w-full rounded-2xl py-7 font-bold shadow-lg bg-lime text-black hover:bg-lime/90 cursor-pointer border-0 mt-8"
              >
                <a href="/pricing">
                  Buy Products →
                </a>
              </Button>
            </motion.div>

            {/* Related Products Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-6">Related Products</h4>
                <ul className="space-y-4 text-sm">
                  {[
                    { href: "/learnmore/auto-conversion-2d-to-3d", label: "Auto Conversion 2D to 3D", tag: "Next step" },
                    { href: "/learnmore/revit-to-boq", label: "Revit to BOQ", tag: "Workflow" },
                    { href: "/learnmore/planning-law-chatbot", label: "Planning Law Chatbot", tag: "Pre-design" },
                  ].map((item, i) => (
                    <li key={i}>
                      <Link href={item.href} className="font-bold hover:text-primary transition-colors flex items-center justify-between">
                        <span>{item.label}</span>
                        <span className="text-xs text-zinc-400 font-medium">{item.tag}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Link href="/learnmore" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  View full suite <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── COMPARISON GRID ─── */}
      <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/30 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <ComparisonGrid
            sectionTitle="Why choose ERP Automations"
            card1={{
              title: "Manual Method",
              subtitle: "Manual ERP Entry",
              features: [
                "Staff constantly typing data manually",
                "High risk of typos and wrong cost codes",
                "Days behind field reality",
                "High administrative labor cost",
              ],
              metric: { value: "DAYS", label: "LAG TIME" },
              button: { text: "Traditional Route", href: "/pricing" },
            }}
            card2={{
              title: "ERP Automations",
              subtitle: "ERP Automation Workflow",
              features: [
                "Machine learning trained on your historical workflows",
                "Continuous adaptive learning improving patterns over time",
                "Construction context resolving complex scenarios easily",
                "Deep native integration built directly into your ERP",
              ],
              metric: { value: "INSTANT", label: "SYNC TIME" },
              button: { text: "Book A Demo", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
            }}
            card3={{
              title: "Generic Apps",
              subtitle: "Generic Automation",
              features: [
                "Pre-defined rigid rules without machine learning models",
                "Struggle with construction specific fields",
                "Don't connect with legacy ERPs",
                "No custom training on legacy data",
              ],
              metric: { value: "UNRELIABLE", label: "FAST /" },
              button: { text: "Other Tools", href: "https://chat.openai.com" },
            }}
          />
        </div>
      </section>


      {/* ─── FAQ ─── */}
      <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/30 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Which ERP systems does it support?", a: "We have built automations for SAP, Oracle, NetSuite, Sage, and many regional ERPs. Custom ERP support available via API integration." },
              { q: "What if the email format is inconsistent?", a: "ML models are trained on your historical emails (100–500 examples). The model learns to recognize intent even when format varies. Over time, accuracy improves." },
              { q: "How is data security handled?", a: "All data stays in your ERP. We only provide the automation layer (the translator between email and ERP). Your data is never stored in our systems." },
              { q: "What happens if an instruction is ambiguous?", a: "The automation flags it for manual review. You always see which entries were automated and which need human review. You maintain 100% control." },
              { q: "Can it handle multiple languages?", a: "Yes. We can train models on instructions in any language. Works particularly well for international contractors with multilingual teams." },
              { q: "Is there a per-transaction fee?", a: "No. The one-off fee covers unlimited transactions. No recurring costs. (You pay only once, at implementation.)" },
            ].map((faq, i) => (
              <div key={i} className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left py-4 font-bold text-zinc-900 dark:text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full shrink-0 ml-4 flex items-center justify-center transition-colors duration-300 ${activeFaq === i ? "bg-zinc-900 dark:bg-white text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"}`}>
                    {activeFaq === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-zinc-550 dark:text-zinc-400 mt-2 pb-2 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer CTA ─── */}
      <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime/5 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-zinc-950 dark:text-zinc-50 uppercase">
            Your ERP data should flow, not sit and wait.
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            See how ERP Automations eliminates manual data entry and brings your operations into real time.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 py-6 font-bold shadow-xl border-0 bg-lime text-black hover:bg-lime/90 cursor-pointer hover:scale-105 transition-transform"
            >
              <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                Book a demo →
              </a>
            </Button>
            <Button
              onClick={() => setIsLightboxOpen(true)}
              variant="outline"
              size="lg"
              className="rounded-2xl px-8 py-6 font-bold border-zinc-300 dark:border-zinc-700 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 cursor-pointer hover:scale-105 transition-transform"
            >
              <Play className="w-4 h-4 mr-2 text-zinc-900 dark:text-zinc-300 fill-zinc-900 dark:fill-zinc-300" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* ─── Lightbox Modal ─── */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 max-w-4xl w-full space-y-6 shadow-2xl relative cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest block">Restricted Walkthrough</span>
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                  ERP Automations Video Demonstration
                </h3>
              </div>

              <div className="relative w-full aspect-video rounded-[1.5rem] bg-black overflow-hidden border border-zinc-800 flex items-center justify-center group shadow-inner">
                {!isUnlocked ? (
                  <motion.div
                    animate={isSubmitShake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="max-w-md w-full px-6 text-center space-y-6"
                  >
                    <div className="w-14 h-14 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-zinc-900 dark:text-zinc-300 shadow-inner">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-white font-bold text-lg">Credentials Required</h4>
                      <p className="text-xs text-zinc-400">
                        This video demonstrates client configurations. Enter code <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-white font-mono">concolabs</code> to view.
                      </p>
                    </div>
                    <form onSubmit={handlePasswordSubmit} className="flex gap-2">
                      <input
                        type="password"
                        placeholder="Enter credentials"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex-1 bg-zinc-950 border border-zinc-800 px-4 py-2.5 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-lime transition-colors font-mono"
                      />
                      <button
                        type="submit"
                        className="bg-lime hover:scale-105 transition-transform text-black px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Unlock
                      </button>
                    </form>
                    {passwordError && (
                      <p className="text-xs text-red-500 font-bold">Access Denied: Invalid credentials</p>
                    )}
                  </motion.div>
                ) : (
                  <div className="absolute inset-0 w-full h-full flex flex-col">
                    <iframe
                      src="https://drive.google.com/file/d/1vRryMMRW4OSo5xRjYbSr8CcRbDsMjFEr/preview"
                      className="w-full h-full border-0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      title="ERP Automations Demo Video"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/90 backdrop-blur-md px-4 py-3 rounded-xl border border-zinc-800 flex justify-between items-center shadow-lg">
                      <span className="text-[11px] font-medium text-zinc-100 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" /> Credentials Validated (Access Granted)
                      </span>
                      <a
                        href="https://drive.google.com/drive/folders/18J2VjOiLVjqKuZjIgUzGHVGSg2eFR1hd?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-black hover:bg-zinc-200 px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors inline-flex items-center gap-1"
                      >
                        Open Folder <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
