"use client";

import { useState, useRef } from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence, useScroll, useTransform, type Variants } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  X,
  Layers,
  Scale,
  BrainCircuit,
  ArrowRight,
  Play,
  Zap,
  Globe,
  Users,
  ChevronDown,
  MessageSquare,
  Box,
  Database,
  ExternalLink,
  Clock,
  ShieldCheck,
  Minus,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComparisonGrid from "@/components/learnmore/comparison-grid";

export default function BuilderbotPage() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeToggle, setActiveToggle] = useState<"before" | "after">("after");

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
    <main className="min-h-screen bg-[#F5F5F7] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-lime/30 selection:text-black overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-40 pb-20 overflow-hidden">
        {/* Glow gradients */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-gradient-to-br from-lime/20 via-lime/10 to-transparent rounded-full blur-[130px] opacity-70 animate-pulse" style={{ animationDuration: '9s' }} />
          <div className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] bg-gradient-to-tr from-lime/10 via-zinc-400/5 to-transparent rounded-full blur-[140px] opacity-65" />
          <div className="absolute inset-0 bg-white/45 dark:bg-zinc-950/65 backdrop-blur-[1px]" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="max-w-5xl mx-auto text-center space-y-8 relative z-30 w-full"
        >
          <Link
            href="/learnmore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-black/60 backdrop-blur-md text-sm font-semibold text-zinc-650 hover:text-zinc-955 dark:text-zinc-405 dark:hover:text-white transition-all hover:bg-white/80 dark:hover:bg-black/80 hover:scale-105 active:scale-95 group shadow-sm cursor-pointer mb-6"
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
            BuilderBot.ai
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: appleEase, delay: 0.3 }}
            className="text-2xl sm:text-4xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-3xl mx-auto tracking-tight"
          >
            Contract questions answered with clause references. <br /> In seconds.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: appleEase, delay: 0.35 }}
            className="text-base sm:text-lg text-zinc-650 dark:text-zinc-400 leading-relaxed max-w-3xl mx-auto font-medium"
          >
            FIDIC-trained legal chatbot. Upload 3D models and contracts together. Ask questions that span the model, the drawings, and the contract simultaneously — and get answers with exact clause references. The only tool of its kind.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: appleEase, delay: 0.4 }}
            className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 pt-8"
          >
            <Button
              asChild
              className="w-full sm:w-auto rounded-full px-8 py-7 text-lg font-semibold shadow-xl shadow-lime/15 cursor-pointer bg-lime text-black hover:bg-lime/90 border-0 hover:scale-105 transition-transform duration-300"
            >
              <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                Book a Demo
              </a>
            </Button>
            <Button
              asChild
              className="w-full sm:w-auto rounded-full px-8 py-7 text-lg font-semibold shadow-xl cursor-pointer bg-zinc-900 text-white dark:bg-white dark:text-black hover:scale-105 transition-transform duration-300"
            >
              <a href="https://builderbot.ai" target="_blank" rel="noopener noreferrer">
                Visit BuilderBot.ai <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button
              onClick={() => setIsLightboxOpen(true)}
              variant="outline"
              className="w-full sm:w-auto rounded-full px-8 py-7 text-lg font-semibold cursor-pointer hover:scale-105 transition-transform duration-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm"
            >
              <Play className="w-4 h-4 mr-2 text-zinc-900 dark:text-zinc-300" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Apple-style Chat Mockup Parallax */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: appleEase, delay: 0.5 }}
            className="mt-20 mx-auto max-w-3xl rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-[#111]"
          >
            <img
              src="/images/BuilderBot.AIInBrowser.png"
              alt="BuilderBot.ai in Browser"
              className="w-full h-auto object-cover"
            />
          </motion.div>

          {/* Before / After Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: appleEase, delay: 0.6 }}
            className="mt-20 max-w-4xl w-full mx-auto bg-white/70 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative z-10"
          >
            <div className="flex flex-col sm:flex-row bg-[#F5F5F7] dark:bg-black p-1.5 rounded-2xl mb-8 border border-zinc-200 dark:border-zinc-850">
              <button
                onClick={() => setActiveToggle("before")}
                className={`flex-1 py-3 px-6 rounded-xl text-sm sm:text-base font-semibold transition-all cursor-pointer ${activeToggle === "before"
                  ? "bg-white dark:bg-zinc-900 text-red-500 dark:text-red-400 shadow-sm border border-zinc-200/50 dark:border-zinc-800/50"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                  }`}
              >
                BEFORE: Manual contract research
              </button>
              <button
                onClick={() => setActiveToggle("after")}
                className={`flex-1 py-3 px-6 rounded-xl text-sm sm:text-base font-semibold transition-all cursor-pointer ${activeToggle === "after"
                  ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-sm border border-zinc-200/50 dark:border-zinc-800/50"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                  }`}
              >
                AFTER: BuilderBot.ai
              </button>
            </div>

            <div className="min-h-[280px] sm:min-h-[200px] text-left">
              {activeToggle === "before" ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  {[
                    "Search FIDIC by keyword",
                    "Read clauses manually",
                    "Cross-reference with project documents",
                    "Consult with legal advisor",
                    "Days to resolve contract questions",
                    "No guarantee of accuracy",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 bg-zinc-50/40 dark:bg-zinc-900/40 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
                      <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-zinc-650 dark:text-zinc-400 text-base font-medium leading-tight">{item}</span>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  {[
                    "Ask contract question in natural language",
                    "Upload 3D model + contract together",
                    "Get clause-referenced answer in seconds",
                    "Answer validated against UNSW research (accuracy above ChatGPT)",
                    "Question resolved in minutes, not days",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 bg-zinc-50/40 dark:bg-zinc-900/40 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
                      <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-zinc-650 dark:text-zinc-400 text-base font-medium leading-tight">{item}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="bg-zinc-950 text-white py-40 px-6 relative overflow-hidden border-y border-zinc-900">
        <motion.div
          variants={staggerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto space-y-12 text-center"
        >
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter leading-tight uppercase">
            Construction contract disputes are expensive because the answers are hidden.
          </motion.h2>
          <motion.div variants={fadeUp} className="prose prose-invert max-w-3xl mx-auto text-zinc-450 text-lg md:text-xl leading-relaxed tracking-tight font-medium">
            <p>Construction disputes cost money — not just the final arbitration, but the weeks of legal research and back-and-forth to determine what the contract actually says and what the project record shows.</p>
            <p>A legal team might spend days searching FIDIC by keyword, reading clauses manually, and cross-referencing with drawings and correspondence.</p>
            <p>ChatGPT can answer questions quickly but misreads tabular content in FIDIC and has no construction law training — answers require verification before use.</p>
            <p className="text-white font-bold">BuilderBot.ai is FIDIC-trained and can read 3D models alongside contracts — making it the only legal AI that understands both the building and the contract terms.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* How it works (Bento Grid) */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerVariants}
          className="space-y-16"
        >
          <div className="text-center space-y-4">
            <motion.h2 variants={fadeUp} className="text-5xl sm:text-6xl font-semibold tracking-tighter text-zinc-950 dark:text-white uppercase">
              How it works.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-2xl text-zinc-500 font-medium tracking-tight">
              Upload everything. Ask anything.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Large Bento Card */}
            <motion.div variants={fadeUp} className="md:col-span-8 bg-white/70 dark:bg-[#111]/70 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-10 md:p-14 flex flex-col justify-center overflow-hidden relative group">
              <div className="relative z-10 space-y-4 max-w-lg">
                <div className="w-12 h-12 bg-lime/20 rounded-2xl flex items-center justify-center mb-6">
                  <Layers className="w-6 h-6 text-zinc-900 dark:text-zinc-300" />
                </div>
                <h3 className="text-3xl font-semibold tracking-tight dark:text-white">Upload all project documents</h3>
                <p className="text-lg text-zinc-500">Upload contract PDFs (FIDIC, NEC, JCT), 2D or 3D drawings, correspondence, site records, and photos into a single secure workspace.</p>
              </div>
            </motion.div>

            {/* Medium Bento Card */}
            <motion.div variants={fadeUp} className="md:col-span-4 bg-white/70 dark:bg-[#111]/70 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-10 flex flex-col justify-center">
              <div className="w-12 h-12 bg-lime/20 rounded-2xl flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6 text-zinc-900 dark:text-zinc-300" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight dark:text-white mb-2">Natural Language Queries</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Ask questions in plain English via the web interface or directly through WhatsApp integration.</p>
            </motion.div>

            {/* Medium Bento Card 2 */}
            <motion.div variants={fadeUp} className="md:col-span-4 bg-white/70 dark:bg-[#111]/70 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-10 flex flex-col justify-center">
              <div className="w-12 h-12 bg-lime/20 rounded-2xl flex items-center justify-center mb-6">
                <Box className="w-6 h-6 text-zinc-900 dark:text-zinc-300" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight dark:text-white mb-2">3D Model Support</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">The only legal AI tool capable of reading and cross-referencing 3D models alongside contracts.</p>
            </motion.div>

            {/* Large Bento Card 2 */}
            <motion.div variants={fadeUp} className="md:col-span-8 bg-zinc-900 text-white rounded-[2.5rem] p-10 md:p-14 flex flex-col justify-center relative overflow-hidden border border-zinc-800">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 to-transparent"></div>
              <div className="relative z-10 space-y-4 max-w-xl">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-zinc-900 dark:text-zinc-300" />
                </div>
                <h3 className="text-3xl font-semibold tracking-tight">Clause-Referenced Answers</h3>
                <p className="text-lg text-zinc-400">BuilderBot analyzes everything together and returns exact clause numbers, how they apply, project evidence, related clauses, and recommended next steps.</p>
                <ul className="pt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2 font-bold"><Check className="w-4 h-4 text-emerald-500" /> Validated by UNSW against human expert interpretation</li>
                  <li className="flex items-center gap-2 font-bold"><Check className="w-4 h-4 text-emerald-500" /> SharePoint connector for auto-indexing</li>
                  <li className="flex items-center gap-2 font-bold"><Check className="w-4 h-4 text-emerald-500" /> Full audit trail for later reference</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Integration Parallax Section */}
      <section className="py-40 px-6 bg-zinc-950 text-white relative overflow-hidden flex items-center justify-center min-h-[80vh] border-t border-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-850/40 via-black to-black"></div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerVariants}
          className="max-w-5xl mx-auto space-y-16 relative z-10 text-center"
        >
          <motion.h2 variants={fadeUp} className="text-5xl sm:text-7xl font-semibold tracking-tighter uppercase">
            Fits perfectly into <br /> your dispute workflow.
          </motion.h2>

          <motion.div variants={fadeUp} className="flex flex-col md:flex-row items-center justify-center gap-6 text-xl md:text-2xl font-medium tracking-tight mt-12">
            <div className="flex flex-col items-center gap-2">
              <div className="px-8 py-4 bg-zinc-900 rounded-[2rem] border border-zinc-800 whitespace-nowrap">Documents & 3D</div>
              <span className="text-xs text-zinc-500 uppercase tracking-widest">Input</span>
            </div>
            <ArrowRight className="w-6 h-6 text-zinc-650 rotate-90 md:rotate-0 mb-6 md:mb-0" />

            <div className="flex flex-col items-center gap-2">
              <div className="px-8 py-4 bg-lime text-black rounded-[2rem] font-bold shadow-[0_0_40px_rgba(var(--color-lime-rgb,0.3)] whitespace-nowrap">BuilderBot.ai</div>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 uppercase tracking-widest font-bold">Engine</span>
            </div>
            <ArrowRight className="w-6 h-6 text-zinc-655 rotate-90 md:rotate-0 mb-6 md:mb-0" />

            <div className="flex flex-col items-center gap-2">
              <div className="px-8 py-4 bg-zinc-900 rounded-[2rem] border border-zinc-800 whitespace-nowrap">Claim Prep</div>
              <span className="text-xs text-zinc-550 uppercase tracking-widest">Output</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Comparison */}
      <ComparisonGrid
        sectionTitle="Why choose BuilderBot.ai"
        card1={{
          title: "Traditional Route",
          subtitle: "Reading the book",
          features: [
            "Days per question to find answers",
            "Accuracy depends entirely on manual review",
            "Cost: High lawyer time ($300-500/hr)",
            "No integration with 3D models",
          ],
          metric: { value: "DAYS", label: "TIME" },
          button: { text: "Traditional Route", href: "/pricing" },
        }}
        card2={{
          title: "BuilderBot",
          subtitle: "BuilderBot.ai",
          features: [
            "Seconds per question (instant search)",
            "Accuracy: 90%+ (UNSW Validated)",
            "Cost: Fixed monthly subscription fee",
            "Integrates 3D models and contracts",
          ],
          metric: { value: "SECONDS", label: "TIME" },
          button: { text: "Book A Demo", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
        }}
        card3={{
          title: "Generic AI",
          subtitle: "ChatGPT / general AI",
          features: [
            "Cannot read 3D models at all",
            "Misinterprets tabular data & clauses",
            "No specific construction law training",
            "No verification or legal validation",
          ],
          metric: { value: "UNRELIABLE", label: "FAST /" },
          button: { text: "Other Tools", href: "https://chat.openai.com" },
        }}
      />

      {/* Deployment, Pricing & Quick Facts */}
      <section className="py-32 px-6 max-w-7xl mx-auto border-t border-zinc-200 dark:border-zinc-800">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerVariants}
          className="space-y-16"
        >
          <div className="text-center space-y-4">
            <motion.h2 variants={fadeUp} className="text-5xl sm:text-6xl font-semibold tracking-tighter text-zinc-950 dark:text-white uppercase">
              Pricing & Deployment.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-2xl text-zinc-500 font-medium tracking-tight">
              Everything you need to know to get started.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pricing */}
            <motion.div variants={fadeUp} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-10 flex flex-col">
              <div className="w-12 h-12 bg-lime/20 rounded-2xl flex items-center justify-center mb-6">
                <Database className="w-6 h-6 text-zinc-900 dark:text-zinc-300" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight dark:text-white mb-2">Pricing</h3>
              <div className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">$20<span className="text-lg text-zinc-550 font-medium">/month</span></div>
              <p className="text-sm text-zinc-500 mb-6 flex-1">Single user (includes 10 projects). Enterprise plan available at $250/month for unlimited projects and users.</p>
              <Button asChild className="w-full rounded-2xl py-6 font-bold shadow-lg bg-lime text-black hover:bg-lime/90 cursor-pointer mt-auto border-0">
                <a href="/pricing">
                  Buy Products →
                </a>
              </Button>
            </motion.div>

            {/* Quick Facts */}
            <motion.div variants={fadeUp} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-10 flex flex-col">
              <h3 className="text-2xl font-semibold tracking-tight dark:text-white mb-8">Quick Facts</h3>
              <div className="space-y-6 flex-1">
                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-zinc-400 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">Best For</p>
                    <p className="text-sm text-zinc-500">Construction lawyers, legal consultants, disputes specialists</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Globe className="w-6 h-6 text-zinc-400 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">Regions</p>
                    <p className="text-sm text-zinc-500">UAE (primary), global</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-zinc-400 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">Implementation</p>
                    <p className="text-sm text-zinc-500">1 day (upload and start asking)</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Related Products */}
            <motion.div variants={fadeUp} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-10 flex flex-col">
              <h3 className="text-2xl font-semibold tracking-tight dark:text-white mb-8">Related Products</h3>
              <div className="space-y-4 flex-1">
                <Link href="/learnmore/measureonair" className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 hover:bg-primary/10 transition-colors">
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white group-hover:text-zinc-955 dark:group-hover:text-white transition-colors">MeasureonAir</p>
                    <p className="text-xs text-zinc-500">Evidence for claims</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-955 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
                <Link href="/learnmore/buildmonitor" className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 hover:bg-primary/10 transition-colors">
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white group-hover:text-zinc-955 dark:group-hover:text-white transition-colors">BuildMonitor App</p>
                    <p className="text-xs text-zinc-500">Site records</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-955 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
                <Link href="/learnmore/tender-evaluations" className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 hover:bg-primary/10 transition-colors">
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white group-hover:text-zinc-955 dark:group-hover:text-white transition-colors">Tender Evaluations</p>
                    <p className="text-xs text-zinc-500">Contract baseline</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-955 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerVariants}>
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-955 dark:text-zinc-50 uppercase">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "Is BuilderBot.ai a replacement for lawyers?",
                a: "No. It is a research tool that speeds up contract analysis. Lawyers still make final decisions. The tool answers questions quickly so lawyers can focus on strategy rather than research."
              },
              {
                q: "What contracts does it support?",
                a: "Trained on FIDIC, NEC, JCT, and common regional variants. Can be trained on custom contracts (requires sample contracts and case history)."
              },
              {
                q: "How accurate is it?",
                a: "UNSW research shows accuracy of 90%+ on FIDIC clauses when compared to expert interpretation. Always review final answers before relying on them for disputes."
              },
              {
                q: "Can it handle multiple jurisdictions?",
                a: "Yes. If your contract has jurisdiction-specific clauses (e.g., UAE labour law, Australian site safety), the tool references applicable law."
              },
              {
                q: "Is document confidentiality maintained?",
                a: "Yes. All documents are encrypted. No data is shared or used to train models on other projects. You own all project data."
              },
              {
                q: "Can it predict dispute outcomes?",
                a: "No. It answers questions about what the contract says. Outcomes depend on arbitrator judgment, not the contract text alone."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="border-b border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between py-6 text-left font-bold text-xl tracking-tight text-zinc-900 dark:text-white cursor-pointer hover:opacity-75 transition-opacity"
                >
                  <span>{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full shrink-0 ml-4 flex items-center justify-center transition-colors duration-300 ${activeFaq === idx ? "bg-zinc-900 dark:bg-white text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"}`}>
                    {activeFaq === idx ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
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
                      <div className="pb-8 pt-2">
                        <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed font-medium">
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

      {/* ─── Footer CTA ─── */}
      <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-zinc-955 dark:text-zinc-50 uppercase">
            The contract answer. <br /> With the clause reference. <br /> In seconds.
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            See how BuilderBot.ai answers construction law questions instantly.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              className="w-full sm:w-auto rounded-2xl px-8 py-6 font-bold shadow-xl border-0 bg-lime text-zinc-955 hover:bg-lime/90 cursor-pointer"
            >
              <a
                href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a Demo →
              </a>
            </Button>
            <Button
              asChild
              className="w-full sm:w-auto rounded-2xl px-8 py-6 font-bold border border-zinc-300 dark:border-zinc-700 text-zinc-955 dark:text-zinc-300 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <a href="https://builderbot.ai" target="_blank" rel="noopener noreferrer">
                Visit BuilderBot.ai directly <ExternalLink className="w-4 h-4 ml-2 text-zinc-900 dark:text-zinc-300" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Lightbox for Demo Video */}
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
              className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 max-w-5xl w-full space-y-6 shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="float-right text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
                  Video Demo
                </span>
                <h3 className="text-3xl font-semibold tracking-tight text-white">
                  BuilderBot.ai Walkthrough
                </h3>
              </div>

              <div className="relative w-full aspect-video rounded-[1.5rem] bg-black overflow-hidden border border-zinc-800 flex items-center justify-center group shadow-inner">
                <iframe
                  src="https://drive.google.com/file/d/1yJ1Oyo0hs1QDQ39ezYd87Cqyz-OO0awJ/preview"
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="BuilderBot.ai Demo Video"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
