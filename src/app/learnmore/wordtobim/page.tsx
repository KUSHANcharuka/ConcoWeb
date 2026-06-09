"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer";
import {
  ArrowLeft,
  Play,
  Calendar,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  MessageSquare,
  Box,
  Bot,
  BarChart3,
  FileText,
  Globe,
  Users,
  Zap,
  Download,
  PencilRuler,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WordtoBIMPage() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const demoSectionRef = useRef<HTMLDivElement>(null);

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

  const scrollToDemo = useCallback(() => {
    demoSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  // Chat simulator messages
  const chatMessages = [
    {
      role: "user" as const,
      text: "A three-storey office building with a central atrium on a 15,000 sqm site in Dubai. Each floor is 5,000 sqm. Ground floor has restaurants and retail. Upper floors are open-plan offices.",
    },
    {
      role: "bot" as const,
      text: "✓ Generating 3D model...\n\n**Project Summary**\n• Site: 15,000 sqm — Dubai\n• Storeys: G+2 (3 total)\n• Total GFA: 15,000 sqm\n• Ground: Restaurant + Retail (5,000 sqm)\n• Floors 1–2: Open-plan offices (10,000 sqm)\n• Central atrium: 8m × 8m void through all levels\n\nModel is ready in the 3D viewport →",
    },
    {
      role: "user" as const,
      text: "Make the atrium taller and add a green roof.",
    },
    {
      role: "bot" as const,
      text: "✓ Atrium height increased to 14m. Green roof system (200mm substrate) added to Level 3 slab.\n\n**Updated schedules:**\n• Roof area: 4,800 sqm\n• Atrium glazing: 448 sqm\n• Total volume: 52,500 m³",
    },
  ];

  const runChatDemo = () => {
    setChatStep(0);
    setIsTyping(false);

    const showMessage = (index: number) => {
      if (index >= chatMessages.length) return;
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setChatStep(index + 1);
        if (index + 1 < chatMessages.length) {
          setTimeout(() => showMessage(index + 1), 1200);
        }
      }, 1200);
    };

    setTimeout(() => showMessage(0), 300);
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-lime/30 selection:text-black">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#FAFAF8] dark:bg-zinc-950">
        {/* Background gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(99,102,241,0.08),rgba(250,250,248,0.95))]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-to-br from-indigo-400/8 via-transparent to-violet-400/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAF8]/60 via-transparent to-[#FAFAF8]/80 dark:from-zinc-950/60 dark:to-zinc-950/80" />
        </div>

        {/* Hero Content */}
        <div className="relative w-full z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto px-6 pt-28"
          >
            <Link
              href="/learnmore"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Learn More
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="px-6 pt-10 pb-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Left Column - Text Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100/60 dark:bg-indigo-900/30 border border-indigo-200/40 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300">
                  Design
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400">
                  Custom / R&D · Universal
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
                WordtoBIM
              </h1>

              <p className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 font-medium leading-normal">
                Build 3D models from text prompts. No CAD skills required.
              </p>

              <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
                Describe a building layout or element in plain language. WordtoBIM generates a 3D model, pulls live planning data into the session, and produces schedules automatically. CAD skills optional.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  onClick={() => setIsLightboxOpen(true)}
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-6 py-6 font-bold shadow-xs cursor-pointer border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <Play className="w-4 h-4 mr-2 text-indigo-600" />
                  Watch Demo
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl px-6 py-6 font-bold shadow-md cursor-pointer bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100"
                >
                  <a
                    href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book a demo →
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Column - Before/After Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="relative bg-white dark:bg-zinc-900 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50">
                <div className="flex items-center justify-between mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <h3 className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-50">
                    Compare Workflows
                  </h3>
                  <div className="relative flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl w-48 justify-between">
                    <button
                      onClick={() => handleTabClick("before")}
                      className={`relative z-10 w-24 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        activeTab === "before" ? "text-zinc-900 dark:text-white" : "text-zinc-400"
                      }`}
                    >
                      Before
                    </button>
                    <button
                      onClick={() => handleTabClick("after")}
                      className={`relative z-10 w-24 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        activeTab === "after" ? "text-zinc-900 dark:text-white" : "text-zinc-400"
                      }`}
                    >
                      After
                    </button>
                    <motion.div
                      layoutId="wtb-toggle-pill"
                      className="absolute top-1 bottom-1 bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-lg"
                      animate={{ left: activeTab === "before" ? 4 : 92, width: 92 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  </div>
                </div>

                <div className="min-h-[220px] flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {activeTab === "before" ? (
                      <motion.div
                        key="before"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="text-xs font-bold text-red-500 uppercase tracking-wider">
                          BIM Software Today
                        </div>
                        <ul className="space-y-3.5">
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>Requires CAD training to use effectively.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>Drawing lines and clicking buttons manually.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>Design intent filtered through software learning curve.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span>Architect ideas → software complexity.</span>
                          </li>
                        </ul>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="after"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                          WordtoBIM
                        </div>
                        <ul className="space-y-3.5">
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Describe what you want to build in plain language.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>3D model generated from your description instantly.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Refine by asking follow-up questions naturally.</span>
                          </li>
                          <li className="flex gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Schedules and analysis generated in the same session.</span>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Interactive Chat Simulator Section ─── */}
      <section ref={demoSectionRef} className="py-24 px-6 bg-[#FAFAF8] dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
              See It In Action
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Design by conversation
            </h2>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto">
              Type a description. Get a 3D model. Refine by talking. No CAD skills required.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Chat Panel */}
            <div className="bg-zinc-950 text-white rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl flex flex-col">
              {/* Chrome bar */}
              <div className="flex items-center gap-2 px-5 py-3.5 bg-zinc-900 border-b border-zinc-800">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-[10px] font-mono text-zinc-500">WordtoBIM — Chat Interface</span>
                <div className="ml-auto px-2 py-0.5 rounded bg-indigo-900/60 text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                  Live
                </div>
              </div>

              {/* Chat messages */}
              <div ref={chatRef} className="flex-1 p-5 space-y-4 overflow-y-auto min-h-[320px]">
                {chatStep === 0 && (
                  <div className="flex items-center justify-center h-full py-12 text-center">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-900/50 border border-indigo-800/60 flex items-center justify-center mx-auto">
                        <MessageSquare className="w-5 h-5 text-indigo-400" />
                      </div>
                      <p className="text-zinc-500 text-sm">Click &quot;Run Demo&quot; to see WordtoBIM in action</p>
                    </div>
                  </div>
                )}

                {chatMessages.slice(0, chatStep).map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white rounded-br-sm"
                          : "bg-zinc-800 text-zinc-200 rounded-bl-sm border border-zinc-700/60"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-zinc-800 border border-zinc-700/60 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Run button */}
              <div className="p-4 border-t border-zinc-800">
                <button
                  onClick={runChatDemo}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Bot className="w-3.5 h-3.5" />
                  Run Demo
                </button>
              </div>
            </div>

            {/* 3D Viewport Panel */}
            <div className="bg-zinc-950 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl flex flex-col">
              <div className="flex items-center gap-2 px-5 py-3.5 bg-zinc-900 border-b border-zinc-800">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-[10px] font-mono text-zinc-500">WordtoBIM — 3D Viewport</span>
              </div>

              <div className="flex-1 min-h-[320px] flex items-center justify-center relative">
                <AnimatePresence mode="wait">
                  {chatStep < 2 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-4 p-8"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto">
                        <Box className="w-8 h-8 text-zinc-700" />
                      </div>
                      <p className="text-zinc-600 text-xs">3D viewport ready — describe a building to generate a model</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="model"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full p-8 flex flex-col items-center justify-center space-y-4"
                    >
                      {/* Building wireframe diagram */}
                      <svg viewBox="0 0 200 220" className="w-48 h-auto drop-shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                        {/* Floors */}
                        {[0, 1, 2].map((floor) => (
                          <g key={floor}>
                            <rect
                              x="20" y={170 - floor * 55}
                              width="160" height="50"
                              fill="none"
                              stroke={floor === 0 ? "#818cf8" : "#6366f1"}
                              strokeWidth="1.5"
                              opacity={floor === 0 ? 1 : 0.7}
                            />
                            {/* Atrium void */}
                            <rect
                              x="88" y={172 - floor * 55}
                              width="24" height="46"
                              fill={floor === 0 ? "rgba(99,102,241,0.15)" : "rgba(30,30,30,0.8)"}
                              stroke="#4f46e5"
                              strokeWidth="1"
                              strokeDasharray={floor > 0 ? "3,2" : "0"}
                            />
                          </g>
                        ))}
                        {/* Green roof */}
                        {chatStep >= 4 && (
                          <rect
                            x="20" y="60"
                            width="160" height="8"
                            fill="rgba(52,211,153,0.5)"
                            stroke="#10b981"
                            strokeWidth="1.5"
                          />
                        )}
                        {/* Dimension labels */}
                        <text x="100" y="215" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="monospace">
                          15,000 sqm site · G+2
                        </text>
                        {/* Atrium label */}
                        <text x="100" y="97" textAnchor="middle" fill="#818cf8" fontSize="7" fontFamily="monospace">
                          {chatStep >= 4 ? "Atrium 14m" : "Atrium"}
                        </text>
                      </svg>

                      <div className="grid grid-cols-2 gap-2 w-full max-w-[200px] text-[10px]">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-center">
                          <p className="text-zinc-500">GFA</p>
                          <p className="font-bold text-indigo-400">15,000 sqm</p>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-center">
                          <p className="text-zinc-500">Storeys</p>
                          <p className="font-bold text-indigo-400">G+2</p>
                        </div>
                      </div>

                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Model Live</span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Problem Section ─── */}
      <section className="bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
              The Friction
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              BIM software was built for modellers, not architects
            </h2>
            <div className="w-16 h-1 bg-indigo-500 rounded-full" />
          </div>
          <div className="lg:col-span-7 text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed space-y-6">
            <p>
              BIM software like Revit requires significant training to use effectively. Architects think in spatial concepts and design intent, but translating that into CAD geometry means learning software tools, understanding model organisation, working with nested families.
            </p>
            <p>
              The software does not work the way architects think. It gets in the way of creative exploration. WordtoBIM reverses this: you describe what you want to build in plain language, and the model is generated for you.
            </p>
          </div>
        </div>
      </section>

      {/* ─── How it Works Section ─── */}
      <section className="py-24 px-6 bg-[#FAFAF8] dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column - Steps */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-6 space-y-8"
          >
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">How it works</h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Open WordtoBIM chat",
                  desc: "No drawing software to open. No files to prepare. Just a chat interface.",
                },
                {
                  step: "02",
                  title: "Describe the building",
                  desc: "Example: \"A three-storey office building with a central atrium on a 15,000 sqm site in Dubai. Each floor is 5,000 sqm.\"",
                },
                {
                  step: "03",
                  title: "Model is generated",
                  desc: "3D model appears in a 3D viewport alongside the chat — typically 30 seconds to 2 minutes.",
                },
                {
                  step: "04",
                  title: "Refine by conversation",
                  desc: "\"Make the atrium taller.\" \"Add a green roof.\" Models updated in real time as you ask.",
                },
                {
                  step: "05",
                  title: "Schedules generated automatically",
                  desc: "Floor area schedules, volume calculations, and material estimates produced in the same session.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex gap-4"
                >
                  <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-[10px] font-black text-indigo-600 dark:text-indigo-400">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1">{item.title}</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}

              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-3">The tool also does:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Live planning data integration",
                    "Floor area & volume schedules",
                    "Export to Revit, IFC, or DWG",
                    "Multi-user collaboration",
                  ].map((feat, i) => (
                    <li key={i} className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-400 font-semibold items-start">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
                Technology: Large language model + parametric 3D geometry engine + live planning regulation API. Generates production-ready or near-production-ready models.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
            className="lg:col-span-6 space-y-4"
          >
            <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-4">Key capabilities:</h4>
            {[
              {
                icon: Globe,
                title: "Live planning data",
                desc: "Pulls zoning and regulation data while you model. No separate tab, no manual lookup.",
                color: "text-blue-600 dark:text-blue-400",
                bg: "bg-blue-50 dark:bg-blue-900/30",
              },
              {
                icon: BarChart3,
                title: "Auto schedule generation",
                desc: "Floor area, window areas, wall areas, volume — all calculated and formatted instantly.",
                color: "text-emerald-600 dark:text-emerald-400",
                bg: "bg-emerald-50 dark:bg-emerald-900/30",
              },
              {
                icon: Download,
                title: "Multi-format export",
                desc: "Export to Revit, IFC, or DWG. Clean element hierarchy. Continue in Revit immediately.",
                color: "text-purple-600 dark:text-purple-400",
                bg: "bg-purple-50 dark:bg-purple-900/30",
              },
              {
                icon: Users,
                title: "Collaboration",
                desc: "Multiple users can refine the same model simultaneously. Ideal for client sessions.",
                color: "text-amber-600 dark:text-amber-400",
                bg: "bg-amber-50 dark:bg-amber-900/30",
              },
            ].map((feat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -3, scale: 1.01 }}
                className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex gap-4 items-start shadow-xs hover:shadow-md transition-all duration-300"
              >
                <div className={`shrink-0 w-9 h-9 rounded-xl ${feat.bg} flex items-center justify-center`}>
                  <feat.icon className={`w-4.5 h-4.5 ${feat.color}`} />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1">{feat.title}</h5>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Workflow / Integration Section ─── */}
      <section className="bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
              Workflow Hook
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Fits into your workflow
            </h2>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto">
              From design concept in words to 3D model to coordinated Revit file
            </p>
          </motion.div>

          {/* Feeds in / Feeds into */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pb-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3 hover:shadow-md transition-shadow duration-300"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">What feeds in</span>
              <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Design concept (spoken or written)</h4>
              <p className="text-sm text-zinc-500">Plain language description of the building, site, and requirements. No files needed to start.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3 hover:shadow-md transition-shadow duration-300"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">What it feeds into</span>
              <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Revit or Auto Conversion 2D to 3D</h4>
              <p className="text-sm text-zinc-500">Export to Revit for detailed design coordination, or feed into Auto Conversion 2D to 3D for automated conversion workflows.</p>
            </motion.div>
          </div>

          {/* Workflow Steps */}
          {(() => {
            const steps = [
              {
                number: 1,
                title: "Design Concept",
                subtitle: "Natural Language",
                description: "Describe the building in plain text or speech.",
                icon: MessageSquare,
              },
              {
                number: 2,
                title: "WordtoBIM",
                subtitle: "3D Model + Schedules",
                description: "AI generates the model and produces schedules automatically.",
                icon: Box,
                highlight: true,
              },
              {
                number: 3,
                title: "Client Presentation",
                subtitle: "Concept Approval",
                description: "Present 3D model to client for concept approval in the same session.",
                icon: Users,
              },
              {
                number: 4,
                title: "Revit / Auto 2D-3D",
                subtitle: "Detailed Design",
                description: "Export to Revit for coordination or use Auto Conversion for further automation.",
                icon: Zap,
              },
            ];

            return (
              <div className="relative max-w-5xl mx-auto">
                <div className="absolute top-12 left-[10%] right-[10%] h-0.5 bg-zinc-200 dark:bg-zinc-800 hidden md:block" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.4, delay: i * 0.12 }}
                      className="relative text-center space-y-3"
                    >
                      <div
                        className={`relative z-10 w-24 h-24 mx-auto rounded-2xl flex items-center justify-center shadow-sm ${
                          step.highlight
                            ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-xl"
                            : i === 0
                            ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                            : i === 2
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                            : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        <step.icon className="w-10 h-10" />
                        {step.highlight && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[var(--color-lime)] text-black text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">
                            This tool
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Step {step.number}</span>
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{step.title}</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-center pt-10"
                >
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">Workflow:</span> Design concept in words → WordtoBIM → Quick 3D model + schedules → Export to Revit for detailed coordination OR present to client for concept approval
                  </p>
                </motion.div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ─── Pricing & Quick Facts Section ─── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-16">
            <div className="space-y-6">
              <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">Deployment</span>
              <h2 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">Pricing &amp; Availability</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-xs">
                  <span className="text-xs text-zinc-450 font-bold uppercase tracking-widest">Monthly Subscription</span>
                  <p className="text-3xl font-black tracking-tight">$10<span className="text-sm font-normal text-zinc-450">/user/mo</span></p>
                  <p className="text-xs text-zinc-500">Standard features. No CAD skills required.</p>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-xs">
                  <span className="text-xs text-zinc-450 font-bold uppercase tracking-widest">Custom Training</span>
                  <p className="text-3xl font-black tracking-tight">$1K–6K</p>
                  <p className="text-xs text-zinc-500">One-off for custom integrations and planning data per region.</p>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2 shadow-xs">
                  <span className="text-xs text-zinc-450 font-bold uppercase tracking-widest">Enterprise</span>
                  <p className="text-3xl font-black tracking-tight">Custom</p>
                  <p className="text-xs text-zinc-500">Multi-firm licensing, custom planning markets, and API access.</p>
                </div>
              </div>
            </div>

            {/* Related Products */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-zinc-200 to-transparent dark:from-zinc-800" />
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Related Products in this suite</span>
                <div className="h-px flex-1 bg-gradient-to-l from-zinc-200 to-transparent dark:from-zinc-800" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    href: "/learnmore/auto-conversion-2d-to-3d",
                    title: "Auto Conversion 2D to 3D",
                    desc: "Alternative workflow — convert 2D PDF drawings to 3D BIM models automatically.",
                    tag: "Alternative",
                  },
                  {
                    href: "/learnmore/revit-to-boq",
                    title: "Revit to BOQ",
                    desc: "Next step — generate a priced BOQ directly from your Revit model output.",
                    tag: "Next stage",
                  },
                  {
                    href: "/learnmore/cost-plan-calculator",
                    title: "Cost Plan Calculator",
                    desc: "Pre-design — get a construction cost estimate before the model is built.",
                    tag: "Pre-design",
                  },
                ].map((rel, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                  >
                    <Link
                      href={rel.href}
                      className="group block p-5 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
                            {rel.title}
                          </h4>
                          <p className="text-xs text-zinc-500 leading-relaxed">{rel.desc}</p>
                        </div>
                        <span className="shrink-0 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                          {rel.tag}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-[10px] font-semibold text-primary">Learn more</span>
                        <ChevronRight className="w-3 h-3 text-primary transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="text-center"
              >
                <Link
                  href="/learnmore"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors group"
                >
                  View full product suite
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Quick Facts Sidebar */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-3">Quick Facts</h3>
              <div className="space-y-4">
                {[
                  { label: "Stage", value: "Design" },
                  { label: "Best For", value: "Architects, designers, modelling firms, clients" },
                  { label: "Regions", value: "Universal" },
                  { label: "Time to Implement", value: "1 week + custom training" },
                  { label: "Pricing", value: "USD 10/mo + custom modules" },
                ].map((fact, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 gap-4">
                    <span className="text-zinc-500 font-semibold shrink-0">{fact.label}</span>
                    <span className="font-bold text-zinc-850 dark:text-zinc-200 text-right">{fact.value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-150 dark:border-zinc-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Related Products</h4>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link href="/learnmore/auto-conversion-2d-to-3d" className="font-bold hover:text-primary transition-colors flex items-center justify-between">
                      <span>Auto Conversion 2D to 3D</span>
                      <span className="text-xs text-zinc-400 font-medium">Alternative</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/learnmore/revit-to-boq" className="font-bold hover:text-primary transition-colors flex items-center justify-between">
                      <span>Revit to BOQ</span>
                      <span className="text-xs text-zinc-400 font-medium">Next step</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/learnmore/cost-plan-calculator" className="font-bold hover:text-primary transition-colors flex items-center justify-between">
                      <span>Cost Plan Calculator</span>
                      <span className="text-xs text-zinc-400 font-medium">Pre-design</span>
                    </Link>
                  </li>
                </ul>
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-850/60">
                  <Link href="/learnmore" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                    View full suite <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  asChild
                  className="w-full rounded-xl py-6 font-bold shadow-md bg-primary text-black hover:bg-primary/90 cursor-pointer"
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
          </div>
        </div>
      </section>

      {/* ─── Comparison Section ─── */}
      <section className="bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
              Comparative Advantage
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Why choose WordtoBIM
            </h2>
          </div>

          <div className="relative pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              {/* Traditional BIM */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-col justify-between shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                    Traditional BIM (Revit)
                  </h4>
                  <div className="h-0.5 bg-zinc-200 dark:bg-zinc-800 w-full" />
                  <ul className="space-y-3 pt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <li className="flex gap-3 items-start"><X className="w-4 h-4 text-red-500 mt-1 shrink-0" />Requires CAD training to use</li>
                    <li className="flex gap-3 items-start"><X className="w-4 h-4 text-red-500 mt-1 shrink-0" />Slow concept iteration</li>
                    <li className="flex gap-3 items-start"><X className="w-4 h-4 text-red-500 mt-1 shrink-0" />Design intent filtered through software</li>
                    <li className="flex gap-3 items-start"><X className="w-4 h-4 text-red-500 mt-1 shrink-0" />Not designed for conversation</li>
                  </ul>
                </div>
              </motion.div>

              {/* WordtoBIM - highlighted */}
              <motion.div
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.08 }}
                whileHover={{ y: -18, scale: 1.04 }}
                className="relative p-8 rounded-3xl border-2 border-transparent bg-gradient-to-br from-[#071022] to-[#0b1724] text-zinc-100 flex flex-col justify-between shadow-2xl transform-gpu"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--color-lime)] text-black text-[10px] font-bold uppercase tracking-wider">
                  Recommended Choice
                </div>
                <div className="space-y-5">
                  <h4 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">WordtoBIM</h4>
                  <div className="h-0.5 bg-zinc-800 w-full" />
                  <ul className="space-y-3 pt-2 text-sm">
                    <li className="flex gap-3 items-start text-zinc-100"><Check className="w-5 h-5 text-[var(--color-lime)] mt-1 shrink-0" />No CAD skills needed</li>
                    <li className="flex gap-3 items-start text-zinc-100"><Check className="w-5 h-5 text-[var(--color-lime)] mt-1 shrink-0" />Fast iteration through conversation</li>
                    <li className="flex gap-3 items-start text-zinc-100"><Check className="w-5 h-5 text-[var(--color-lime)] mt-1 shrink-0" />Design intent → direct model</li>
                    <li className="flex gap-3 items-start text-zinc-100"><Check className="w-5 h-5 text-[var(--color-lime)] mt-1 shrink-0" />Built for natural language</li>
                  </ul>
                </div>
              </motion.div>

              {/* Other generative tools */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.12 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-col justify-between shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                    Other Generative Tools
                  </h4>
                  <div className="h-0.5 bg-zinc-200 dark:bg-zinc-800 w-full" />
                  <ul className="space-y-3 pt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <li className="flex gap-3 items-start"><X className="w-4 h-4 text-red-500 mt-1 shrink-0" />Focus on optimisation, not design intent</li>
                    <li className="flex gap-3 items-start"><X className="w-4 h-4 text-red-500 mt-1 shrink-0" />Require technical briefing documents</li>
                    <li className="flex gap-3 items-start"><X className="w-4 h-4 text-red-500 mt-1 shrink-0" />Output is conceptual — needs re-modelling</li>
                    <li className="flex gap-3 items-start">
                      <Check className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>WordtoBIM outputs are production-ready or near-ready</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="py-24 px-6 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
            Questions
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Can non-architects use this?",
              a: "Yes. Anyone can describe a building — architects, clients, project managers, even AI agents describing building requirements. No CAD training needed.",
            },
            {
              q: "Does it handle complex geometry?",
              a: "Simple-to-moderate geometry works well (boxes, slabs, extrusions, offsets). Very complex curved or freeform geometry is planned but not yet in production.",
            },
            {
              q: "Can we integrate planning data for our specific market?",
              a: "Yes. Custom markets available at USD 2,000–4,000 per region. We currently have planning integrations for UAE, UK, Australia, and Sri Lanka.",
            },
            {
              q: "What if we want to refine the model in Revit afterward?",
              a: "The export to Revit is clean and maintains element hierarchy. You can open the exported model in Revit and continue detailed design from there.",
            },
            {
              q: "How long does a model generation take?",
              a: "Typically 30 seconds to 2 minutes depending on complexity. You see updates in real time as the model is built.",
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left font-bold text-sm tracking-tight text-zinc-950 dark:text-zinc-50 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-300 shrink-0 ml-4 ${
                    activeFaq === idx ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="p-6 pt-0 text-sm text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/60 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Final CTA Footer ─── */}
      <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
            Design by conversation, not by clicking.
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            See how WordtoBIM turns design concepts into 3D models instantly.
          </p>
          <div className="pt-4 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-xl px-8 py-6 font-bold shadow-md bg-primary text-black hover:bg-primary/90 cursor-pointer"
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

      {/* ─── Demo Lightbox ─── */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLightboxOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl z-10 p-6 sm:p-8 space-y-6 text-white"
            >
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[var(--color-lime)] uppercase tracking-widest">
                  Interactive Video Demo
                </span>
                <h3 className="text-xl font-bold">WordtoBIM Walkthrough</h3>
              </div>

              <div className="relative w-full aspect-video rounded-2xl bg-zinc-950 overflow-hidden border border-zinc-800 flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-transparent to-zinc-950" />
                <div className="relative z-10 text-center space-y-4">
                  <a
                    href="https://drive.google.com/drive/folders/1C8KTwemod1FyxAuZr7jefJLqbs1LCn2L?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 rounded-full bg-primary text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform mx-auto cursor-pointer"
                  >
                    <Play className="w-6 h-6 fill-black ml-1" />
                  </a>
                  <p className="text-xs text-zinc-300 font-bold uppercase tracking-wider">
                    Click to Open Demo in Google Drive
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 text-xs text-zinc-500 border-t border-zinc-850">
                <span>WordtoBIM Demo</span>
                <span>Includes concept generation and schedule export</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
