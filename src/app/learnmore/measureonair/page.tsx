"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer";
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  Play,
  Minimize2,
  Smartphone,
  Layers,
  ShieldCheck,
  BarChart3,
  MapPin,
  Clock,
  FileText,
  FileSearch,
  Pencil,
  Send,
  ExternalLink,
  Globe,
  Ruler,
  Camera,
  Calculator,
  FileCheck,
  History,
  BadgeCheck,
  WalletCards,
  GitBranch,
  ArrowRight,
  ReceiptText,
  Bot,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComparisonGrid from "@/components/learnmore/comparison-grid";
import { VideoLightbox } from "@/components/persona/video-lightbox";

// Apple-style animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

// FAQ Accordion
function AppleAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md"
        >
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full flex items-center justify-between p-6 text-left cursor-pointer group"
          >
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 pr-4 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
              {item.q}
            </span>
            <motion.span
              animate={{ rotate: openIndex === idx ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.87, 0, 0.13, 1] }}
            >
              <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {openIndex === idx && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 pt-4">
                  {item.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}



export default function MeasureonairPage() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const [autoToggleKey, setAutoToggleKey] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroScrollProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 1.05]);
  const textY = useTransform(heroScrollProgress, [0, 1], [0, -100]);

  const problemRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const workflowRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const isProblemInView = useInView(problemRef, { once: true, margin: "-100px" });
  const isSolutionInView = useInView(solutionRef, { once: true, margin: "-100px" });
  const isWorkflowInView = useInView(workflowRef, { once: true, margin: "-100px" });
  const isPricingInView = useInView(pricingRef, { once: true, margin: "-100px" });
  const isComparisonInView = useInView(comparisonRef, { once: true, margin: "-100px" });
  const isFaqInView = useInView(faqRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev === "before" ? "after" : "before"));
    }, 4000);
    return () => clearInterval(timer);
  }, [autoToggleKey]);

  const handleTabClick = (tab: "before" | "after") => {
    setActiveTab(tab);
    setAutoToggleKey((k) => k + 1);
  };

  const beforeBullets = [
    "Take printed plans to site",
    "Annotate measurements by hand",
    "Back in office, type into Excel manually",
    "Calculate the certified quantity",
    "Produce payment application manually",
    "Cross-reference drawings (multiple windows)",
    "2–3 days per valuation, high error rate",
  ];

  const afterBullets = [
    "Open MeasureonAir app on site",
    "Record measurements against digital drawing",
    "App calculates certified quantity automatically",
    "Payment application generated in real-time",
    "Send directly to client from the field",
    "1–2 hours per valuation, zero manual steps",
  ];

  const faqs = [
    {
      q: "How does it handle site measurements that don't match the drawing?",
      a: "All measurements are compared to the baseline drawing. Discrepancies outside configured tolerances are automatically flagged for manager review.",
    },
    {
      q: "What if site conditions change or require rework?",
      a: "You can adjust certified quantities down for defective work. All adjustments are historically tracked with audit notes for full traceability.",
    },
    {
      q: "Can we use measurements from previous projects?",
      a: "Yes, previous measurements are visible for historical reference, but each valuation period uses only measurements recorded for that specific period.",
    },
    {
      q: "How does it handle variations or contract changes?",
      a: "The baseline BOQ can be updated dynamically to reflect approved variations. New site measurements are automatically measured against the updated baseline.",
    },
    {
      q: "What formats does the payment application export to?",
      a: "You can export to fully formatted PDFs, Excel spreadsheets, or email directly to the contract administrator. Direct API integrations with ERPs are also supported.",
    },
    {
      q: "Is an internet connection required on site?",
      a: "No. The app functions fully offline. Measurements are stored locally on your device and sync automatically when internet connectivity is re-established.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-[#FFEF1A]/30 selection:text-black">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-zinc-50 dark:bg-zinc-950 pt-16">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-gradient-to-br from-[#FFEF1A]/20 via-[#FFEF1A]/10 to-transparent rounded-full blur-[130px] mix-blend-multiply dark:mix-blend-screen opacity-75 animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] bg-gradient-to-tr from-[#FFEF1A]/10 via-zinc-400/5 to-transparent rounded-full blur-[140px] mix-blend-multiply dark:mix-blend-screen opacity-65" />
          <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/60 backdrop-blur-[1px]" />

          {/* Blueprint grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
              backgroundSize: "44px 44px",
            }}
          />
        </div>

        <div className="absolute top-28 left-6 z-30">
          <Link
            href="/learnmore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-sm font-semibold text-zinc-650 hover:text-zinc-955 dark:text-zinc-405 dark:hover:text-white transition-all hover:bg-white/80 dark:hover:bg-black/80 hover:scale-105 active:scale-95 group shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Learn More
          </Link>
        </div>

        <motion.div
          style={{ y: textY, opacity: heroOpacity }}
          className="relative w-full z-10"
        >
          <div className="px-6 pt-32 pb-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column - Hero Content & Switcher */}
            <div className="lg:col-span-7 space-y-8">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >


                <motion.h1
                  variants={fadeInUp}
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-955 dark:text-white leading-[1.05] uppercase product-title-sweep"
                >
                  MeasureonAir
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-300 font-semibold leading-relaxed max-w-xl"
                >
                  From site measurements to certified payment applications.
                  <br />
                  <span className="text-zinc-950 dark:text-white font-bold">One continuous workflow.</span>
                </motion.p>

                {/* Switcher Widget inside Hero Left */}
                <motion.div
                  variants={fadeInUp}
                  className="relative bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/70 dark:border-zinc-800/70 rounded-3xl p-6 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4 border-b border-zinc-150 dark:border-zinc-850 pb-3">
                    <h3 className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white">
                      Compare Site Workflows
                    </h3>
                    <div className="relative flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl w-48 justify-between border border-zinc-200/50 dark:border-zinc-850/50">
                      <button
                        onClick={() => handleTabClick("before")}
                        className={`relative z-10 w-[50%] py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${activeTab === "before"
                          ? "text-zinc-900 dark:text-white"
                          : "text-zinc-400"
                          }`}
                      >
                        Before
                      </button>
                      <button
                        onClick={() => handleTabClick("after")}
                        className={`relative z-10 w-[50%] py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${activeTab === "after"
                          ? "text-zinc-900 dark:text-white"
                          : "text-zinc-400"
                          }`}
                      >
                        After
                      </button>

                      <motion.div
                        layout
                        className="absolute top-1 bottom-1 bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-lg"
                        style={{ width: "calc(50% - 4px)" }}
                        animate={{
                          left:
                            activeTab === "before" ? 4 : "calc(100% / 2 + 4px)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25,
                        }}
                      />
                    </div>
                  </div>

                  <div className="min-h-[140px] flex flex-col justify-center">
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
                            Traditional Manual Steps
                          </div>
                          <ul className="space-y-1.5">
                            {beforeBullets.slice(0, 4).map((t, i) => (
                              <li key={i} className="flex gap-2 text-zinc-600 dark:text-zinc-400 text-xs">
                                <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <span>{t}</span>
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
                          <div className="text-[10px] font-bold text-zinc-650 dark:text-zinc-400 uppercase tracking-wider">
                            MeasureonAir Automation
                          </div>
                          <ul className="space-y-1.5">
                            {afterBullets.slice(0, 4).map((t, i) => (
                              <li key={i} className="flex gap-2 text-zinc-650 dark:text-zinc-350 text-xs">
                                <Check className="w-4 h-4 text-[#FFEF1A] shrink-0 mt-0.5" />
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* CTAs */}
                <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-2">
                  <Button
                    onClick={() => setLightboxOpen(true)}
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
                    className="rounded-2xl px-8 py-7 font-bold shadow-xl shadow-[#FFEF1A]/10 cursor-pointer bg-[#FFEF1A] text-black hover:bg-[#FFEF1A]/90 border-0 transition-transform hover:scale-105"
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

            {/* Right Column - Mockup Player */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute -inset-1 rounded-[30px] bg-gradient-to-tr from-[#FFEF1A] to-transparent opacity-20 blur-lg" />
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#FFEF1A]/5 via-transparent to-transparent rounded-[28px] pointer-events-none" />
                  <VideoMockupPlayer onPlayClick={() => setLightboxOpen(true)} />
                </div>
              </motion.div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* Video Lightbox */}
      <VideoLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=1u8_royKFEE"
      />

      {/* ─── PROBLEM SECTION ─── */}
      <section ref={problemRef} className="relative py-32 px-6 bg-white dark:bg-zinc-950 overflow-hidden border-y border-zinc-200 dark:border-zinc-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isProblemInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-5 space-y-6"
          >
            <span className="text-xs font-bold text-zinc-450 dark:text-zinc-550 uppercase tracking-widest block">
              The Pain Point
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight uppercase">
              Valuations should take hours, not days
            </h2>
            <div className="w-16 h-1 bg-[#FFEF1A] rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isProblemInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-7 space-y-6 text-zinc-650 dark:text-zinc-400 text-base sm:text-lg leading-relaxed"
          >
            <p>
              Traditional interim site valuation is an archaic manual bottleneck. Engineers walk the site carrying rolled plans, annotating dimensions and quantities with physical pens, only to spend the next two days in the office re-typing those records into disconnected Excel sheets.
            </p>
            <p>
              Data gets corrupted. Transcription errors slip in, and when audits happen, tracing a certified quantity back to a specific spot on the drawing is nearly impossible.
            </p>
            <p className="font-semibold text-zinc-950 dark:text-white">
              MeasureonAir brings the BOQ directly onto site. You measure once on a digital tablet screen, and our engine automatically calculates, audits, and builds the interim payment application.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (Connected alternating grid) ─── */}
      <HowItWorksSection solutionRef={solutionRef} isSolutionInView={isSolutionInView} />

      {/* ─── FEATURES SECTION (3D cards) ─── */}
      <FeaturesSection />

      {/* ─── WORKFLOW INTEGRATION SECTION ─── */}
      <WorkflowIntegrationSection workflowRef={workflowRef} isWorkflowInView={isWorkflowInView} />


      <section ref={pricingRef} className="py-32 px-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
        <div className="space-y-16 max-w-4xl mx-auto">
          <div className="space-y-8 text-left">
            <div>
              <span className="text-xs font-bold text-zinc-450 dark:text-zinc-555 uppercase tracking-widest block mb-2">Deployment</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-955 dark:text-zinc-50">Pricing &amp; Availability</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-sm">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Pricing Model</span>
                <p className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">USD 200<span className="text-sm font-normal text-zinc-455">/month</span></p>
                <p className="text-xs text-zinc-505">Billed monthly per enterprise, covering unlimited active projects and users.</p>
              </div>
              <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3 shadow-sm">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Enterprise Add-on</span>
                <p className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">Custom Plan</p>
                <p className="text-xs text-zinc-500">Tailored ERP connections (SAP, Oracle) and custom workflow setup.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16 border-t border-zinc-200 dark:border-zinc-800 text-left">
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
                    { label: "Project Stage", value: "Construction" },
                    { label: "Ideal Target", value: "Quantity Surveyors, Site Engineers" },
                    { label: "Target Regions", value: "Middle East, Sri Lanka" },
                    { label: "Time to Implement", value: "1 week (with baseline BOQ)" },
                    { label: "Pricing Model", value: "USD 200/month flat-rate" },
                  ].map((fact, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-zinc-50 dark:border-zinc-850/50 pb-2 gap-4">
                      <span className="text-zinc-500 font-semibold shrink-0">{fact.label}</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 text-right">{fact.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                asChild
                className="w-full rounded-2xl py-7 font-bold shadow-xl border-0 bg-[#FFEF1A] text-black hover:bg-[#FFEF1A]/90 cursor-pointer mt-8"
              >
                <a
                  href="/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy Products <ArrowRight />
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
                    { href: "/learnmore/revit-to-boq", label: "Revit to BOQ", tag: "Baseline Setup" },
                    { href: "/learnmore/buildmonitor", label: "BuildMonitor", tag: "Execution" },
                    { href: "/learnmore/builderbot", label: "BuilderBot.ai", tag: "Contract Bot" },
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
      <ComparisonGrid
        sectionTitle="Why choose MeasureonAir"
        card1={{
          title: "Manual Method",
          subtitle: "Manual Takeoff & Excel",
          features: [
            "2–3 days per interim valuation",
            "Prone to copy-paste transcription errors",
            "Traceability and audit logs are difficult",
            "Contract maximum boundaries checked by hand",
          ],
          metric: { value: "DAYS", label: "TIMELINE" },
          button: { text: "Traditional Route", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
        }}
        card2={{
          title: "MeasureonAir",
          subtitle: "Digital Site Measurements",
          features: [
            "1–2 hours per valuation",
            "Completely digital from site to client certificate",
            "Interactive drawing verification",
            "Auto-calculates quantity tolerance boundaries",
          ],
          metric: { value: "HOURS", label: "TIMELINE" },
          button: { text: "Book A Demo", href: "https://calendar.app.google/mCq7zBhXrDnEAJvB7" },
        }}
        card3={{
          title: "Standard Take-off Apps",
          subtitle: "Partial Tools",
          features: [
            "Annotate plans but don't export BOQs",
            "Do not enforce contract tolerance limits",
            "No audit trace linking coordinates back to bills",
            "Excel format exports only",
          ],
          metric: { value: "PARTIAL", label: "AUTOMATION" },
          button: { text: "Other Tools", href: "https://chat.openai.com" },
        }}
      />

      {/* ─── FAQ ─── */}
      <section ref={faqRef} className="py-32 px-6 bg-[#FAFAF8] dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
              FAQ
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <AppleAccordion items={faqs} />
        </div>
      </section>

      {/* ─── Footer CTA ─── */}
      <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-955 dark:text-zinc-50 leading-tight uppercase">
            YOUR PAYMENT APPLICATIONS SHOULD TAKE HOURS, NOT DAYS.
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Eliminate hand annotations and manual calculations today.
          </p>

          <div className="pt-4 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 py-6 font-bold shadow-xl border-0 bg-[#FFEF1A] text-black hover:bg-[#FFEF1A]/90 cursor-pointer"
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

      <Footer />
    </main>
  );
}


// Floating background particle component
function FloatingParticle({
  delay,
  duration,
  size,
  top,
  left,
}: {
  delay: number;
  duration: number;
  size: number;
  top: string;
  left: string;
}) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 0.15 }}
      animate={{
        y: [-15, 15, -15],
        opacity: [0.15, 0.4, 0.15],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      style={{ top, left, width: size, height: size }}
      className="absolute rounded-full bg-[#FFEF1A] filter blur-[2px] pointer-events-none"
    />
  );
}

// Circular Step Card sub-component
function StepCircleCard({
  step,
  yOffset,
}: {
  step: {
    number: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    subIcons?: React.ComponentType<{ className?: string }>[];
  };
  yOffset: any;
}) {
  const colorMap: Record<string, { text: string; bg: string; border: string; glow: string }> = {
    blue: { text: "text-zinc-500", bg: "bg-zinc-500/10", border: "border-zinc-500/20", glow: "shadow-[#FFEF1A]/10" },
    emerald: { text: "text-zinc-500", bg: "bg-zinc-500/10", border: "border-zinc-500/20", glow: "shadow-[#FFEF1A]/10" },
    orange: { text: "text-zinc-500", bg: "bg-zinc-500/10", border: "border-zinc-500/20", glow: "shadow-[#FFEF1A]/10" },
    purple: { text: "text-zinc-500", bg: "bg-zinc-500/10", border: "border-zinc-500/20", glow: "shadow-[#FFEF1A]/10" },
    green: { text: "text-zinc-500", bg: "bg-zinc-500/10", border: "border-zinc-500/20", glow: "shadow-[#FFEF1A]/10" },
  };

  const currentColors = colorMap[step.color] || colorMap.blue;

  return (
    <motion.div
      style={{ y: yOffset }}
      whileHover="hover"
      initial="initial"
      className="relative w-[240px] h-[240px] rounded-full flex flex-col items-center justify-center p-6 text-center bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl transition-shadow hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] group"
    >
      {/* Floating glow ring on hover */}
      <motion.div
        variants={{
          initial: { opacity: 0, scale: 0.95 },
          hover: { opacity: 1, scale: 1.03 }
        }}
        transition={{ duration: 0.3 }}
        className={`absolute inset-0 rounded-full border-2 border-[#FFEF1A] pointer-events-none ${currentColors.glow} shadow-[0_0_20px_rgba(255,239,26,0.2)]`}
      />

      {/* Floating Step Number Badge */}
      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-zinc-950 dark:bg-zinc-800 text-[#FFEF1A] border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-black text-xs shadow-md z-20">
        {step.number}
      </div>

      {/* Icon Wrapper */}
      <motion.div
        variants={{
          initial: { rotate: 0, scale: 1 },
          hover: { rotate: 8, scale: 1.1 }
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-14 h-14 rounded-full flex items-center justify-center mb-3 shrink-0 bg-zinc-950 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-inner"
      >
        {step.subIcons ? (
          <div className="flex -space-x-2">
            {step.subIcons.map((Icon, idx) => (
              <Icon key={idx} className="w-6 h-6 text-[#FFEF1A]" />
            ))}
          </div>
        ) : (
          <step.icon className="w-7 h-7 text-[#FFEF1A]" />
        )}
      </motion.div>

      {/* Step Content */}
      <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug max-w-[180px]">
        {step.title}
      </h3>
      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed max-w-[170px] font-medium">
        {step.description}
      </p>
    </motion.div>
  );
}

// How It Works Section Component
function HowItWorksSection({
  solutionRef,
  isSolutionInView,
}: {
  solutionRef: React.RefObject<HTMLDivElement | null>;
  isSolutionInView: boolean;
}) {
  const { scrollYProgress } = useScroll({
    target: solutionRef,
    offset: ["start end", "end start"],
  });

  // Parallax offsets for circular cards (subtle values to keep line connected)
  const yCard1 = useTransform(scrollYProgress, [0, 1], [-15, 15]);
  const yCard2 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const yCard3 = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const yCard4 = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const yCard5 = useTransform(scrollYProgress, [0, 1], [-25, 25]);

  // Dotted lines rotation parallax
  const pathRotate = useTransform(scrollYProgress, [0, 1], [-1, 1]);

  const steps = [
    {
      number: "01",
      title: "Open MeasureonAir on site",
      description: "Web app or mobile app. Works offline or with connectivity.",
      icon: Smartphone,
      subIcons: [Smartphone, Globe],
      color: "blue",
    },
    {
      number: "02",
      title: "Select drawing section",
      description: "Building elements on screen: Walls, Slabs, Openings, Finishes.",
      icon: Layers,
      color: "emerald",
    },
    {
      number: "03",
      title: "Record measurements",
      description: "Length, Area, Count, Depth/height & Photo evidence.",
      icon: Ruler,
      subIcons: [Ruler, Camera],
      color: "orange",
    },
    {
      number: "04",
      title: "App calculates quantity",
      description: "BOQ comparisons & rules: Tolerance (+/- 5%), Defects, Hold-backs.",
      icon: Calculator,
      color: "purple",
    },
    {
      number: "05",
      title: "Payment application",
      description: "Interim certificate, payment summary, ready for admin.",
      icon: FileCheck,
      color: "green",
    },
  ];

  return (
    <section
      ref={solutionRef}
      className="relative py-32 px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-black dark:to-zinc-955 overflow-hidden border-b border-zinc-200 dark:border-zinc-900"
      style={{
        backgroundImage: `
          radial-gradient(ellipse at top, rgba(255,239,26,0.06), transparent 70%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.015'/%3E%3C/svg%3E")
        `
      }}
    >
      {/* Ambient background light blobs */}
      <div className="absolute top-[15%] left-[-10%] w-[600px] h-[600px] bg-blue-300/10 dark:bg-blue-900/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-orange-300/10 dark:bg-orange-900/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[50%] left-[45%] w-[400px] h-[400px] bg-yellow-200/10 dark:bg-yellow-900/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating background particles */}
      <FloatingParticle delay={0} duration={8} size={6} top="15%" left="20%" />
      <FloatingParticle delay={2} duration={10} size={8} top="40%" left="75%" />
      <FloatingParticle delay={4} duration={7} size={5} top="65%" left="15%" />
      <FloatingParticle delay={1} duration={9} size={7} top="80%" left="60%" />

      <div className="max-w-6xl mx-auto space-y-24 relative z-10">
        {/* Headline */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white uppercase">
            How it works
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">
            Measure, certify and generate payment applications automatically.
          </p>
        </div>

        {/* Desktop Connected Journey Map */}
        <div className="hidden md:block relative w-full h-[620px] max-w-5xl mx-auto">
          {/* Curved Connections Layer */}
          <motion.div
            style={{ rotate: pathRotate }}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 1000 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="glow-path" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Path 1: Step 1 -> Step 2 */}
              <path
                d="M 150 150 Q 325 180 500 150"
                stroke="#FFEF1A"
                strokeWidth="4"
                strokeDasharray="8,8"
                opacity="0.3"
              />
              <path
                d="M 150 150 Q 325 180 500 150"
                stroke="#FFEF1A"
                strokeWidth="2"
                opacity="0.15"
                filter="url(#glow-path)"
              />

              {/* Path 2: Step 2 -> Step 3 */}
              <path
                d="M 500 150 Q 675 180 850 150"
                stroke="#FFEF1A"
                strokeWidth="4"
                strokeDasharray="8,8"
                opacity="0.3"
              />
              <path
                d="M 500 150 Q 675 180 850 150"
                stroke="#FFEF1A"
                strokeWidth="2"
                opacity="0.15"
                filter="url(#glow-path)"
              />

              {/* Path 3: Step 3 -> Step 4 */}
              <path
                d="M 850 150 C 950 250, 225 350, 325 450"
                stroke="#FFEF1A"
                strokeWidth="4"
                strokeDasharray="8,8"
                opacity="0.3"
              />
              <path
                d="M 850 150 C 950 250, 225 350, 325 450"
                stroke="#FFEF1A"
                strokeWidth="2"
                opacity="0.15"
                filter="url(#glow-path)"
              />

              {/* Path 4: Step 4 -> Step 5 */}
              <path
                d="M 325 450 Q 500 480 675 450"
                stroke="#FFEF1A"
                strokeWidth="4"
                strokeDasharray="8,8"
                opacity="0.3"
              />
              <path
                d="M 325 450 Q 500 480 675 450"
                stroke="#FFEF1A"
                strokeWidth="2"
                opacity="0.15"
                filter="url(#glow-path)"
              />

              {/* Glowing particles travelling along paths */}
              {/* Path 1 particles */}
              <circle r="4" fill="#FFEF1A" className="filter drop-shadow-[0_0_6px_#FFEF1A]">
                <animateMotion dur="6s" repeatCount="indefinite" path="M 150 150 Q 325 180 500 150" begin="0s" />
              </circle>
              <circle r="4" fill="#FFEF1A" className="filter drop-shadow-[0_0_6px_#FFEF1A]">
                <animateMotion dur="6s" repeatCount="indefinite" path="M 150 150 Q 325 180 500 150" begin="3s" />
              </circle>

              {/* Path 2 particles */}
              <circle r="4" fill="#FFEF1A" className="filter drop-shadow-[0_0_6px_#FFEF1A]">
                <animateMotion dur="6s" repeatCount="indefinite" path="M 500 150 Q 675 180 850 150" begin="1s" />
              </circle>
              <circle r="4" fill="#FFEF1A" className="filter drop-shadow-[0_0_6px_#FFEF1A]">
                <animateMotion dur="6s" repeatCount="indefinite" path="M 500 150 Q 675 180 850 150" begin="4s" />
              </circle>

              {/* Path 3 particles */}
              <circle r="4.5" fill="#FFEF1A" className="filter drop-shadow-[0_0_6px_#FFEF1A]">
                <animateMotion dur="8s" repeatCount="indefinite" path="M 850 150 C 950 250, 225 350, 325 450" begin="2s" />
              </circle>
              <circle r="4.5" fill="#FFEF1A" className="filter drop-shadow-[0_0_6px_#FFEF1A]">
                <animateMotion dur="8s" repeatCount="indefinite" path="M 850 150 C 950 250, 225 350, 325 450" begin="6s" />
              </circle>

              {/* Path 4 particles */}
              <circle r="4" fill="#FFEF1A" className="filter drop-shadow-[0_0_6px_#FFEF1A]">
                <animateMotion dur="6s" repeatCount="indefinite" path="M 325 450 Q 500 480 675 450" begin="2.5s" />
              </circle>
              <circle r="4" fill="#FFEF1A" className="filter drop-shadow-[0_0_6px_#FFEF1A]">
                <animateMotion dur="6s" repeatCount="indefinite" path="M 325 450 Q 500 480 675 450" begin="5.5s" />
              </circle>
            </svg>
          </motion.div>

          {/* Steps Cards Layer */}
          <div className="absolute inset-0">
            {/* Step 1: Top Row Left */}
            <div className="absolute left-[15%] top-[25%] -translate-x-1/2 -translate-y-1/2 z-10">
              <StepCircleCard step={steps[0]} yOffset={yCard1} />
            </div>

            {/* Step 2: Top Row Middle */}
            <div className="absolute left-[50%] top-[25%] -translate-x-1/2 -translate-y-1/2 z-10">
              <StepCircleCard step={steps[1]} yOffset={yCard2} />
            </div>

            {/* Step 3: Top Row Right */}
            <div className="absolute left-[85%] top-[25%] -translate-x-1/2 -translate-y-1/2 z-10">
              <StepCircleCard step={steps[2]} yOffset={yCard3} />
            </div>

            {/* Step 4: Bottom Row Left */}
            <div className="absolute left-[32.5%] top-[75%] -translate-x-1/2 -translate-y-1/2 z-10">
              <StepCircleCard step={steps[3]} yOffset={yCard4} />
            </div>

            {/* Step 5: Bottom Row Right */}
            <div className="absolute left-[67.5%] top-[75%] -translate-x-1/2 -translate-y-1/2 z-10">
              <StepCircleCard step={steps[4]} yOffset={yCard5} />
            </div>
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="md:hidden relative max-w-sm mx-auto pl-8 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:border-l-2 before:border-dashed before:border-[#FFEF1A] space-y-12">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative flex gap-4 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-lg"
            >
              {/* Timeline indicator circle */}
              <div className="absolute -left-[30px] top-6 w-5 h-5 rounded-full bg-zinc-950 border-2 border-[#FFEF1A] flex items-center justify-center z-10 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FFEF1A]" />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-[#FFEF1A] bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    {step.number}
                  </span>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    {step.title}
                  </h3>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 3D Tilt Wrapper
function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Subtle 3D perspective rotation (max 10 degrees)
    const rX = -(mouseY / (height / 2)) * 10;
    const rY = (mouseX / (width / 2)) * 10;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Features Section Component
function FeaturesSection() {
  return (
    <section className="py-32 px-6 bg-white dark:bg-zinc-955 overflow-hidden relative border-b border-zinc-200 dark:border-zinc-900">
      <div className="max-w-6xl mx-auto space-y-20 relative z-10">
        {/* Headline */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest block">
            Product Capabilities
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-955 dark:text-white uppercase">
            Features
          </h2>
        </div>

        {/* 3D Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 max-w-5xl mx-auto">
          {/* Card 1 */}
          <TiltCard className="md:col-span-2 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 backdrop-blur-md shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between h-[320px] group">
            <div style={{ transform: "translateZ(30px)" }} className="w-12 h-12 rounded-2xl bg-zinc-950 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-6 shadow-sm transition-transform group-hover:scale-105">
              <FileSearch className="w-6 h-6 text-[#FFEF1A]" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                Digital drawing comparison
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                No printed plans. Compare structural revisions and quantities seamlessly.
              </p>
            </div>
          </TiltCard>

          {/* Card 2 */}
          <TiltCard className="md:col-span-2 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 backdrop-blur-md shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between h-[320px] group">
            <div style={{ transform: "translateZ(30px)" }} className="w-12 h-12 rounded-2xl bg-zinc-950 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-6 shadow-sm transition-transform group-hover:scale-105">
              <History className="w-6 h-6 text-[#FFEF1A]" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                Measurement history
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                Track baseline progress and certification logs dynamically across weeks.
              </p>
            </div>
          </TiltCard>

          {/* Card 3 */}
          <TiltCard className="md:col-span-2 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 backdrop-blur-md shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between h-[320px] group">
            <div style={{ transform: "translateZ(30px)" }} className="w-12 h-12 rounded-2xl bg-zinc-950 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-6 shadow-sm transition-transform group-hover:scale-105">
              <BadgeCheck className="w-6 h-6 text-[#FFEF1A]" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                Automated certification
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                Contract rules and tolerance bounds verified automatically on measurement lock.
              </p>
            </div>
          </TiltCard>

          {/* Card 4 */}
          <TiltCard className="md:col-span-3 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 backdrop-blur-md shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between h-[280px] group">
            <div style={{ transform: "translateZ(30px)" }} className="w-12 h-12 rounded-2xl bg-zinc-950 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-6 shadow-sm transition-transform group-hover:scale-105">
              <WalletCards className="w-6 h-6 text-[#FFEF1A]" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                Payment tracking
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                Complete overview of paid versus certified sums with contract deduction analytics.
              </p>
            </div>
          </TiltCard>

          {/* Card 5 */}
          <TiltCard className="md:col-span-3 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 backdrop-blur-md shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between h-[280px] group">
            <div style={{ transform: "translateZ(30px)" }} className="w-12 h-12 rounded-2xl bg-zinc-950 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-6 shadow-sm transition-transform group-hover:scale-105">
              <GitBranch className="w-6 h-6 text-[#FFEF1A]" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                Version control
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                Every drawing takeoff edit and quantities adjustment log is tracked and fully traceable.
              </p>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}

// Custom Video Player Mockup Wrapper
function VideoMockupPlayer({ onPlayClick }: { onPlayClick: () => void }) {
  return (
    <div className="relative rounded-[28px] overflow-hidden border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-900/5 dark:bg-zinc-900/40 shadow-xl group">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--color-lime-rgb,0.15),transparent_55%)]" />
      <div className="relative p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">

            <div className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">MEASUREONAIR</div>
            <div className="text-xs text-zinc-500">
              Watch how site measurements generate payment apps
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-lime/10 border border-lime/30 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-zinc-900 dark:text-zinc-300" />
          </div>
        </div>

        <button
          onClick={onPlayClick}
          className="mt-6 w-full rounded-2xl overflow-hidden border border-zinc-200/70 dark:border-zinc-800/70 bg-white/50 dark:bg-zinc-900/30 hover:bg-white/80 dark:hover:bg-zinc-900/50 transition-all cursor-pointer group-hover:scale-[1.01] duration-300"
        >
          <div className="relative aspect-[16/10]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.1),rgba(0,0,0,0.4))]" />
            <video
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              muted
              playsInline
              autoPlay
              loop
              preload="metadata"
              src="/videos/hand-drawn-to-autocad/hero-bg.mp4"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-black/60 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Play className="w-6 h-6 text-zinc-900 dark:text-zinc-300 fill-zinc-900 dark:fill-zinc-300 ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15">

              </div>
            </div>
          </div>
        </button>

        <div className="mt-4 flex flex-wrap gap-2.5 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/60">
            <FileSearch className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-300" />
            Digital Drawings
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/60">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-300" />
            Auto Certification
          </span>
        </div>
      </div>
    </div>
  );
}

// Workflow Integration Section Component
interface WorkflowIntegrationSectionProps {
  workflowRef: React.RefObject<HTMLDivElement | null>;
  isWorkflowInView: boolean;
}

function WorkflowIntegrationSection({
  workflowRef,
  isWorkflowInView,
}: WorkflowIntegrationSectionProps) {
  const floatingIcons = [
    { icon: Layers, top: "12%", left: "6%", delay: 0, duration: 6 },
    { icon: Calculator, top: "25%", right: "8%", delay: 1, duration: 7 },
    { icon: Ruler, top: "45%", left: "4%", delay: 2, duration: 5 },
    { icon: ReceiptText, top: "62%", right: "6%", delay: 0.5, duration: 8 },
    { icon: Bot, top: "78%", left: "8%", delay: 1.5, duration: 6.5 },
    { icon: Send, top: "88%", right: "10%", delay: 2.5, duration: 7.5 },
  ];

  const rows = [
    {
      step: "01",
      title: "BOQ baseline setup",
      desc: "Imports directly from Revit-to-BOQ or 2D Drawing-to-BOQ modules.",
      detail: "Establishes reference quantity structures.",
    },
    {
      step: "02",
      title: "App synchronization",
      desc: "Syncs baseline data to site engineer tablet, works 100% offline.",
      detail: "Zero-latency database replication.",
    },
    {
      step: "03",
      title: "Site measurement record",
      desc: "Engineers record physical takeoff dimensions directly on drawings.",
      detail: "Attaches photo and coordinate proof.",
    },
    {
      step: "04",
      title: "Automated quantities checks",
      desc: "Tolerance limits check (+/- 5%) and contract holdback rule audits.",
      detail: "Prevents over-billing errors.",
    },
    {
      step: "05",
      title: "Interim valuation compiling",
      desc: "Generates invoice summaries and payment applications automatically.",
      detail: "Compiled in standard contract formats.",
    },
    {
      step: "06",
      title: "Downstream system flow",
      desc: "Exports directly to ERPs (SAP/Oracle) or sends to BuilderBot.ai.",
      detail: "Triggers instant automated audit reviews.",
    },
  ];

  const timelineStages = [
    { label: "Intake", desc: "Baseline BOQ" },
    { label: "Setup", desc: "Sync to Device" },
    { label: "Measure", desc: "Site Takeoff" },
    { label: "Audit", desc: "Rule Check" },
    { label: "Compile", desc: "Draft Valuation" },
    { label: "Dispatch", desc: "ERP / BuilderBot" },
  ];

  return (
    <section
      ref={workflowRef}
      className="relative py-32 px-6 bg-[#FAF9F4] dark:bg-black overflow-hidden border-b border-zinc-200 dark:border-zinc-900"
      style={{
        backgroundImage: `
          radial-gradient(circle at center, rgba(255,239,26,0.03), transparent 70%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.012'/%3E%3C/svg%3E")
        `
      }}
    >
      {/* 3D Organic Fluid Blob */}
      <motion.div
        animate={{
          scale: [1, 1.15, 0.95, 1.05, 1],
          rotate: [0, 90, 180, 270, 360],
          x: [0, 20, -20, 10, 0],
          y: [0, -30, 20, -10, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[2%] bottom-[12%] w-[320px] h-[320px] bg-gradient-to-tr from-blue-500/15 to-purple-500/15 rounded-[45%_55%_65%_35%_/_45%_55%_45%_55%] filter blur-[80px] pointer-events-none z-0"
      />

      {/* Floating Icons Layer */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none z-10">
        {floatingIcons.map((item, idx) => (
          <motion.div
            key={idx}
            style={{
              position: "absolute",
              top: item.top,
              left: item.left,
              right: item.right,
            }}
            animate={{
              y: [0, -12, 0],
              rotate: [0, 6, -6, 0],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
            className="w-12 h-12 rounded-2xl bg-zinc-950 dark:bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#FFEF1A] shadow-xl"
          >
            <item.icon className="w-5 h-5 text-[#FFEF1A]" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto space-y-24 relative z-10">
        {/* Headline block */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
            Integration Pipeline
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-955 dark:text-white leading-none uppercase">
            Fits into your workflow
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium max-w-2xl mx-auto">
            MeasureonAir connects measurements, payment applications and contract reviews automatically.
          </p>
        </div>

        {/* Centerpiece Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isWorkflowInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative max-w-3xl mx-auto bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.06)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.3)] p-8 md:p-10 overflow-hidden"
        >
          {/* Mock Header */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-200/60 dark:border-zinc-800/60">
            <div className="flex items-center gap-2">


            </div>

          </div>

          {/* 6 Rows Container with Animated SVG Line */}
          <div className="relative pl-12 sm:pl-16 space-y-8">
            {/* Animated SVG line on the left side */}
            <div className="absolute left-4 sm:left-6 top-3 bottom-3 w-1 pointer-events-none">
              <svg className="w-full h-full" preserveAspectRatio="none">
                <line
                  x1="2"
                  y1="0"
                  x2="2"
                  y2="100%"
                  stroke="#FFEF1A"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                  className="opacity-20"
                />
                <motion.circle
                  r="3.5"
                  fill="#FFEF1A"
                  cx="2"
                  animate={{ cy: ["0%", "100%"] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0,
                  }}
                  className="filter drop-shadow-[0_0_5px_#FFEF1A]"
                />
                <motion.circle
                  r="3.5"
                  fill="#FFEF1A"
                  cx="2"
                  animate={{ cy: ["0%", "100%"] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 2.5,
                  }}
                  className="filter drop-shadow-[0_0_5px_#FFEF1A]"
                />
              </svg>
            </div>

            {/* Render 6 rows */}
            {rows.map((row, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={isWorkflowInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 border border-transparent hover:border-zinc-200/40 dark:hover:border-zinc-800/40 hover:shadow-xs transition-all duration-300"
              >
                {/* Check circle bullet next to the SVG line */}
                <div className="absolute -left-10 sm:-left-12 top-4.5 w-5 h-5 rounded-full bg-zinc-950 border border-[#FFEF1A] flex items-center justify-center z-10 shadow-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFEF1A] animate-pulse" />
                </div>

                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-zinc-950 text-[#FFEF1A] px-1.5 py-0.5 rounded border border-zinc-800">
                      {row.step}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                      {row.title}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                    {row.desc}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="inline-block text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider bg-zinc-100 dark:bg-zinc-955 border border-zinc-200/50 dark:border-zinc-800/50 px-2 py-0.5 rounded-md font-mono">
                    {row.detail}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Horizontal Timeline */}
        <div className="relative pt-8 border-t border-zinc-200 dark:border-zinc-900">
          <div className="relative max-w-4xl mx-auto">
            {/* Dashed Connector Line */}
            <div className="absolute top-5 left-[8%] right-[8%] h-0.5 border-t border-dashed border-[#FFEF1A]/40 z-0 hidden sm:block" />

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-6 text-center">
              {timelineStages.map((stage, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-950 border border-[#FFEF1A] text-[#FFEF1A] flex items-center justify-center font-bold text-xs shadow-[0_0_15px_rgba(255,239,26,0.2)]">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 mt-2">
                    {stage.label}
                  </h3>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 font-medium leading-tight max-w-[110px]">
                    {stage.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
