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
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComparisonGrid from "@/components/learnmore/comparison-grid";

export default function BuildmonitorPage() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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
    <main className="min-h-screen bg-[#F5F5F7] dark:bg-black text-zinc-900 dark:text-zinc-50 antialiased selection:bg-lime/30 selection:text-black overflow-hidden">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: appleEase, delay: 0.1 }}
            className="flex justify-center"
          >
            <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-black/5 dark:bg-white/10 backdrop-blur-md text-zinc-800 dark:text-zinc-200">
              Stage: Construction
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: appleEase, delay: 0.2 }}
            className="text-5xl sm:text-7xl lg:text-[7rem] font-semibold tracking-tighter text-zinc-950 dark:text-white leading-[1.05] product-title-sweep"
          >
            BuildMonitor <br className="hidden md:block" /> Mobile App
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
              className="rounded-full px-8 py-7 text-lg font-semibold shadow-xl cursor-pointer bg-primary text-primary-foreground border-0 hover:scale-105 transition-transform duration-300"
            >
              <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                Book a demo →
              </a>
            </Button>
            <Button
              onClick={() => setIsLightboxOpen(true)}
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
            className="mt-20 mx-auto max-w-[320px] aspect-[9/19] bg-zinc-950 dark:bg-zinc-900 border-[12px] border-zinc-200 dark:border-[#222] rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
            {/* iPhone Notch */}
            <div className="absolute top-0 inset-x-0 h-7 bg-zinc-200 dark:bg-[#222] rounded-b-[1.5rem] w-40 mx-auto z-20"></div>
            {/* Mock UI */}
            <div className="w-full h-full p-6 pt-16 flex flex-col gap-4 relative z-10">
              <div className="h-12 bg-zinc-800/50 rounded-2xl w-full"></div>
              <div className="h-32 bg-primary/20 border border-primary/30 rounded-3xl w-full flex items-center justify-center text-primary font-semibold">Progress Synced</div>
              <div className="h-16 bg-zinc-800/50 rounded-2xl w-full"></div>
              <div className="h-16 bg-zinc-800/50 rounded-2xl w-full"></div>
              <div className="h-16 bg-zinc-800/50 rounded-2xl w-full"></div>
              <div className="mt-auto h-14 bg-zinc-800/80 rounded-2xl w-full"></div>
            </div>
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
            <motion.h2 variants={fadeUp} className="text-5xl sm:text-6xl font-semibold tracking-tighter text-zinc-950 dark:text-white">
              How it works.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-2xl text-zinc-500 font-medium tracking-tight">
              From job site to inbox without opening Excel.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Large Bento Card */}
            <motion.div variants={fadeUp} className="md:col-span-8 bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-10 md:p-14 flex flex-col justify-center overflow-hidden relative group">
              <div className="relative z-10 space-y-4 max-w-lg">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-3xl font-semibold tracking-tight dark:text-white">Record Progress on Site</h3>
                <p className="text-lg text-zinc-500">Log completed activities, quantities, labor, equipment, and snap timestamped photos available on iOS and Android.</p>
              </div>
            </motion.div>

            {/* Medium Bento Card */}
            <motion.div variants={fadeUp} className="md:col-span-4 bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-10 flex flex-col justify-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                <WifiOff className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight dark:text-white mb-2">Offline Mode</h3>
              <p className="text-zinc-500">Works fully on site with no connectivity. Auto-syncs when online.</p>
            </motion.div>

            {/* Medium Bento Card 2 */}
            <motion.div variants={fadeUp} className="md:col-span-4 bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-10 flex flex-col justify-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Camera className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight dark:text-white mb-2">Photo Evidence</h3>
              <p className="text-zinc-500">Timestamp and location are permanently recorded with every photo.</p>
            </motion.div>

            {/* Large Bento Card 2 */}
            <motion.div variants={fadeUp} className="md:col-span-8 bg-black text-white rounded-[2.5rem] p-10 md:p-14 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 to-transparent"></div>
              <div className="relative z-10 space-y-4 max-w-lg">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                  <LayoutTemplate className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-semibold tracking-tight">Contractually Compliant DPR</h3>
                <p className="text-lg text-zinc-400">System produces the Daily Progress Report in FIDIC, NEC, or JCT format automatically. Export to PDF or your ERP.</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Integration Parallax Section */}
      <section className="py-40 px-6 bg-black text-white relative overflow-hidden flex items-center justify-center min-h-[80vh]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/40 via-black to-black"></div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerVariants}
          className="max-w-5xl mx-auto space-y-16 relative z-10 text-center"
        >
          <motion.h2 variants={fadeUp} className="text-5xl sm:text-7xl font-semibold tracking-tighter">
            Fits perfectly into <br /> your workflow.
          </motion.h2>

          <motion.div variants={fadeUp} className="flex flex-col md:flex-row items-center justify-center gap-6 text-xl md:text-2xl font-medium tracking-tight">
            <div className="px-8 py-4 bg-zinc-900 rounded-[2rem] border border-zinc-800">Site Activity</div>
            <ArrowRight className="w-6 h-6 text-zinc-600 rotate-90 md:rotate-0" />
            <div className="px-8 py-4 bg-zinc-900 rounded-[2rem] border border-zinc-800">BuildMonitor</div>
            <ArrowRight className="w-6 h-6 text-zinc-600 rotate-90 md:rotate-0" />
            <div className="px-8 py-4 bg-zinc-900 rounded-[2rem] border border-zinc-800">DPR & ERP</div>
          </motion.div>
        </motion.div>
      </section>

      {/* Comparison */}
      <ComparisonGrid
        sectionTitle="Why choose BuildMonitor"
        card1={{
          title: "Traditional Route",
          subtitle: "Manual Excel DPR",
          features: [
            "1+ hour per day per site manager",
            "Information from memory, not observation",
            "Format depends on who is writing",
            "No photo evidence linked to progress",
            "Errors in manual data entry",
          ],
          metric: { value: "1+", label: "HOUR" },
          button: { text: "Traditional Route", href: "/pricing" },
        }}
        card2={{
          title: "BuildMonitor",
          subtitle: "BuildMonitor App",
          badge: "Concolabs",
          features: [
            "10 minutes per day (quick checklist)",
            "Information recorded as work happens",
            "Standardized contract-compliant format",
            "Photos automatically linked to activities",
            "ERP updated automatically",
            "Data quality high (structured capture)",
          ],
          metric: { value: "10", label: "MINUTES" },
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
          metric: { value: "UNRELIABLE", label: "FAST /" },
          button: { text: "Other Tools", href: "https://chat.openai.com" },
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
              className="rounded-full px-10 py-8 text-xl font-bold shadow-xl cursor-pointer bg-primary text-primary-foreground border-0 hover:scale-105 transition-transform duration-300"
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
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 max-w-5xl w-full space-y-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="float-right text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Video Demo
                </span>
                <h3 className="text-3xl font-semibold tracking-tight text-white">
                  BuildMonitor Mobile App Walkthrough
                </h3>
              </div>

              <div className="relative w-full aspect-video rounded-[1.5rem] bg-black overflow-hidden border border-zinc-800 flex items-center justify-center group shadow-inner">
                <div className="relative z-10 text-center space-y-4">
                  <a
                    href="https://drive.google.com/file/d/1bof_YpZZdzkxGAQEfGqYNdAASqSkiZ0p/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-black px-6 py-4 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                  >
                    <Play className="w-4 h-4" />
                    Watch on Google Drive
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

