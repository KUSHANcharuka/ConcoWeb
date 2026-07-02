"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import {
  ArrowRight, Check, Monitor, Users, BookOpen,
  Zap, BarChart3, ShieldCheck, Globe, Headphones, TrendingUp,
  Calendar, Clock, Star
} from "lucide-react"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

// ─── Theme tokens matching /customers page ───────────────────
const TEXT_PRIMARY = "text-zinc-850 dark:text-zinc-100"
const TEXT_MUTED = "text-zinc-600 dark:text-zinc-400"
const TEXT_HEADING = "text-zinc-950 dark:text-zinc-50"
const BORDER_COLOR = "border-zinc-200 dark:border-zinc-800"
const CARD_BG = "bg-white dark:bg-zinc-900"
const SECTION_BG = "bg-[#F4F2F0] dark:bg-zinc-950"

// ─── Data ────────────────────────────────────────────────────
const partnerTypes = [
  {
    icon: Monitor,
    title: "Construction Technology Firms",
    desc: "Add a proven, all-in-one construction platform to your portfolio. Integrate, implement, and resell Concolabs alongside your own solutions to deliver more value to every client.",
    tag: "Reseller & integration",
  },
  {
    icon: Users,
    title: "Consulting Firms",
    desc: "Quantity surveyors, project management consultancies, and advisory firms can recommend and deploy Concolabs as part of their engagements, and get paid for the contracts they bring in.",
    tag: "Referral & consulting",
  },
  {
    icon: BookOpen,
    title: "Professional Institutes",
    desc: "Industry bodies, training institutes, and member associations can offer Concolabs to their network as a recommended platform, strengthening member value while sharing in the revenue.",
    tag: "Endorsement & member offer",
  },
]

const steps = [
  { num: "1", title: "Apply & onboard", desc: "Submit your application and meet our partnerships team. We agree on your partner type and a revenue share that fits your model." },
  { num: "2", title: "Get enabled", desc: "Access partner training, demo environments, sales collateral, and a dedicated partner manager to get you confident fast." },
  { num: "3", title: "Introduce & consult", desc: "Recommend, demo, or resell Concolabs to your clients and network. We support every deal with co-selling and technical help." },
  { num: "4", title: "Earn on every contract", desc: "Get a competitive percentage of each contract you help secure, paid out on the deals you source, for as long as they renew." },
]

const perks = [
  { title: "Percentage of every contract", desc: "Earn on the contract value you bring in, not a flat finder's fee." },
  { title: "Recurring on renewals", desc: "Keep earning as your sourced accounts continue and grow." },
  { title: "Transparent tracking", desc: "A partner dashboard shows your deals, status, and payouts." },
]

const whyCards = [
  { icon: Zap, title: "Proven platform", desc: "Trusted by 500+ construction companies across 120+ countries, with a 4.8★ average rating across 5,000+ reviews." },
  { icon: Headphones, title: "Dedicated support", desc: "A named partner manager, co-selling, technical pre-sales, and onboarding so you're never closing a deal alone." },
  { icon: TrendingUp, title: "Real recurring income", desc: "Turn one introduction into ongoing revenue. The more value your clients get, the longer you keep earning." },
  { icon: BarChart3, title: "Sales enablement", desc: "Demo environments, pitch decks, case studies, and training — everything you need to represent Concolabs well." },
  { icon: ShieldCheck, title: "Deal protection", desc: "Register your opportunities and we protect the accounts you source, so your pipeline stays yours." },
  { icon: Globe, title: "Stronger relationships", desc: "Bring your clients a platform that cuts paperwork and overruns, and become the advisor who solved it for them." },
]

const faqs = [
  { q: "How much can I earn?", a: "Partners earn a competitive percentage of every contract they help secure. The exact share depends on your partner type and how involved you are in the sale. We'll agree concrete numbers with you during onboarding." },
  { q: "Is there a cost to join?", a: "No. There are no upfront fees and no minimum commitments. You only ever benefit when you bring in a contract." },
  { q: "Do I need to be technical to resell Concolabs?", a: "Not at all. We provide demo environments, training, sales collateral, and a dedicated partner manager. Our team can co-sell and handle technical pre-sales with you on any deal." },
  { q: "What's the difference between reselling and referring?", a: "Resellers actively sell, implement, and manage the client relationship. Referrers introduce qualified prospects and we take it from there. Both earn a share of the contract, resellers typically more." },
  { q: "How are my deals and payouts tracked?", a: "You register opportunities through a partner dashboard that shows each deal's status and your payouts in real time. Registered opportunities are protected, so the accounts you source stay attributed to you." },
  { q: "How do I get started?", a: "Submit the application below or book a partnership call. We'll respond within two business days to agree your partner track and revenue share, then get you enabled." },
]

// ─── Fade-in animation wrapper ────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Eyebrow pill ─────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full mb-5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold">
      {children}
    </span>
  )
}

// ─── Main Page ────────────────────────────────────────────────
export default function PartnerPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  return (
    <main className="min-h-screen bg-[#F4F2F0] dark:bg-zinc-950 text-zinc-650 dark:text-zinc-300 antialiased" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden bg-[#F4F2F0] dark:bg-zinc-950">
        {/* Subtle Background Radial Gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-zinc-900/5 dark:bg-zinc-50/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-zinc-800 dark:text-zinc-100 leading-tight tracking-tight mb-6">
              Grow your business by bringing{" "}
              <span className="text-zinc-500 mt-2 block sm:inline">
                modern construction software
              </span>{" "}
              to your clients
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg sm:text-xl max-w-2xl leading-relaxed mb-8">
              Partner with Concolabs to consult on and resell the operating system for modern construction, and earn a competitive share of every contract you help secure.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="rounded-xl px-6 font-bold cursor-pointer bg-[#FFEF1A] hover:bg-[#f5e500] text-black">
                <Link href="#apply">Become a Partner</Link>
              </Button>

              <a
                href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ36g8nHHMaGgbaQdtlNRO-WqiiLSTuA1LgF8dV7cqGCGcrBTIJhXOWRMSUgkkuQL9UFKeGEztHI"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-800 text-sm font-bold text-zinc-800 dark:text-zinc-200 bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <span>Book a Partnership Call</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </a>
            </div>

            {/* Hero stats */}
            <div className="flex flex-wrap gap-10 mt-14 border-t border-zinc-300/60 dark:border-zinc-800 pt-8">
              {[
                { value: "500+", label: "Companies on Concolabs" },
                { value: "120+", label: "Countries served" },
                { value: "Recurring", label: "Revenue share on contracts" },
              ].map((s) => (
                <div key={s.label}>
                  <span className="block text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">{s.value}</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mt-1 block">{s.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────────────────── */}
      <section id="who" className="py-24 px-6 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className={`text-3xl sm:text-5xl font-bold tracking-tight mb-4 ${TEXT_HEADING}`}>
              Built for the firms construction companies already trust
            </h2>
            <p className={`text-base sm:text-lg max-w-2xl mb-12 ${TEXT_MUTED}`}>
              If you advise, build for, or sell to construction businesses, the Concolabs Partner Program turns your existing relationships into a new, recurring revenue stream.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partnerTypes.map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.1}>
                <div className={`rounded-3xl p-8 border h-full flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${CARD_BG} ${BORDER_COLOR}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-zinc-100 dark:bg-zinc-800 border ${BORDER_COLOR}`}>
                    <p.icon className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
                  </div>
                  <h3 className={`text-lg font-bold mb-3 ${TEXT_HEADING}`}>{p.title}</h3>
                  <p className={`text-sm leading-relaxed flex-1 ${TEXT_MUTED}`}>{p.desc}</p>
                  <span className="inline-block mt-5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 w-fit">
                    {p.tag}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section id="how" className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className={`text-3xl sm:text-5xl font-bold tracking-tight mb-4 ${TEXT_HEADING}`}>
              From introduction to recurring income in four steps
            </h2>
            <p className={`text-base sm:text-lg max-w-2xl mb-12 ${TEXT_MUTED}`}>
              No heavy lifting, no upfront cost. You bring the relationship and context; we handle the product, onboarding, and support.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <FadeIn key={s.num} delay={i * 0.08}>
                <div className={`rounded-3xl p-7 border h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${CARD_BG} ${BORDER_COLOR}`}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm mb-5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                    {s.num}
                  </div>
                  <h3 className={`font-bold mb-2 ${TEXT_HEADING}`}>{s.title}</h3>
                  <p className={`text-sm leading-relaxed ${TEXT_MUTED}`}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVENUE / COMMERCIALS ────────────────────────────── */}
      <section id="earn" className="py-24 px-6 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className={`rounded-3xl p-8 sm:p-12 border ${CARD_BG} ${BORDER_COLOR} shadow-sm`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7">
                  <Eyebrow>The commercials</Eyebrow>
                  <h2 className={`text-3xl sm:text-5xl font-bold tracking-tight mb-5 ${TEXT_HEADING}`}>
                    A competitive revenue share, structured around you
                  </h2>
                  <p className={`text-base leading-relaxed mb-3 ${TEXT_MUTED}`}>
                    We don't believe in one-size-fits-all. Whether you're reselling, referring, or endorsing, we agree a revenue share tailored to your partner type and level of involvement in each deal.
                  </p>
                  <p className={`text-base leading-relaxed mb-7 ${TEXT_MUTED}`}>
                    Reach out and our partnerships team will walk you through the model and put concrete numbers against your pipeline.
                  </p>
                  <Button asChild size="lg" className="rounded-xl px-6 font-bold cursor-pointer bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950">
                    <Link href="#apply">Discuss your revenue share</Link>
                  </Button>
                </div>

                <div className="lg:col-span-5 space-y-6">
                  {perks.map((p) => (
                    <div key={p.title} className="flex gap-4 items-start">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-green-100 dark:bg-green-950/30">
                        <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${TEXT_HEADING}`}>{p.title}</p>
                        <p className={`text-sm mt-0.5 ${TEXT_MUTED}`}>{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── WHY PARTNER ──────────────────────────────────────── */}
      <section id="why" className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className={`text-3xl sm:text-5xl font-bold tracking-tight mb-12 ${TEXT_HEADING}`}>
              A product your clients will thank you for
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyCards.map((c, i) => (
              <FadeIn key={c.title} delay={i * 0.07}>
                <div className={`rounded-3xl p-7 border h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${CARD_BG} ${BORDER_COLOR}`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-zinc-100 dark:bg-zinc-800 border ${BORDER_COLOR}`}>
                    <c.icon className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
                  </div>
                  <h3 className={`font-bold mb-2 ${TEXT_HEADING}`}>{c.title}</h3>
                  <p className={`text-sm leading-relaxed ${TEXT_MUTED}`}>{c.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLY + BOOK ─────────────────────────────────────── */}
      <section id="apply" className="py-24 px-6 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className={`text-3xl sm:text-5xl font-bold tracking-tight mb-4 ${TEXT_HEADING}`}>
                Become a Concolabs partner
              </h2>
              <p className={`text-base sm:text-lg max-w-xl mx-auto ${TEXT_MUTED}`}>
                Apply in two minutes, or book a call to talk it through first. Either way, we'll get back to you within two business days.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Application Form */}
            <FadeIn delay={0.05}>
              <div className={`rounded-3xl p-8 border h-full bg-[#F4F2F0] dark:bg-zinc-950/40 ${BORDER_COLOR}`}>
                <h3 className={`text-xl font-bold mb-1 ${TEXT_HEADING}`}>Apply to the program</h3>
                <p className={`text-sm mb-7 ${TEXT_MUTED}`}>Tell us about your firm and we'll match you with the right partner track.</p>

                {!submitted ? (
                  <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-xs font-semibold mb-1.5 ${TEXT_MUTED}`}>Full name</label>
                        <input
                          required placeholder="Jane Doe"
                          className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-zinc-900 outline-none transition-all focus:border-zinc-500 ${BORDER_COLOR}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-semibold mb-1.5 ${TEXT_MUTED}`}>Work email</label>
                        <input
                          type="email" required placeholder="jane@firm.com"
                          className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-zinc-900 outline-none transition-all focus:border-zinc-500 ${BORDER_COLOR}`}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-xs font-semibold mb-1.5 ${TEXT_MUTED}`}>Company</label>
                        <input
                          required placeholder="Firm name"
                          className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-zinc-900 outline-none transition-all focus:border-zinc-500 ${BORDER_COLOR}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-semibold mb-1.5 ${TEXT_MUTED}`}>Country / region</label>
                        <input
                          placeholder="e.g. United Kingdom"
                          className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-zinc-900 outline-none transition-all focus:border-zinc-500 ${BORDER_COLOR}`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${TEXT_MUTED}`}>Partner type</label>
                      <select
                        className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-zinc-900 outline-none transition-all cursor-pointer ${BORDER_COLOR}`}
                      >
                        <option>Construction technology firm (reseller)</option>
                        <option>Consulting firm (referral / consulting)</option>
                        <option>Professional institute / association</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${TEXT_MUTED}`}>Tell us about your network & how you'd like to partner</label>
                      <textarea
                        rows={4}
                        placeholder="Who do you work with, and what kind of partnership are you interested in?"
                        className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-zinc-900 outline-none resize-none transition-all focus:border-zinc-500 ${BORDER_COLOR}`}
                      />
                    </div>
                    <button
                      type="submit" style={{ backgroundColor: '#FFEF1A', color: 'black' }}
                      className="w-full py-3.5 rounded-xl font-bold text-sm transition-all bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 active:scale-[0.99] cursor-pointer"
                    >
                      Submit application
                    </button>
                    <p className={`text-xs text-center ${TEXT_MUTED}`}>
                      By submitting, you agree to be contacted by the Concolabs partnerships team. We'll never share your details.
                    </p>
                  </form>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(55,210,122,0.14)" }}>
                      <Check className="w-7 h-7" style={{ color: "#37d27a" }} strokeWidth={2.5} />
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${TEXT_HEADING}`}>Thanks, application received</h3>
                    <p className={`text-sm ${TEXT_MUTED}`}>Our partnerships team will be in touch within two business days.</p>
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Book a call */}
            <FadeIn delay={0.12}>
              <div id="book" className={`rounded-3xl p-8 border h-full flex flex-col bg-[#F4F2F0] dark:bg-zinc-950/40 ${BORDER_COLOR}`}>
                <h3 className={`text-xl font-bold mb-1 ${TEXT_HEADING}`}>Prefer to talk first?</h3>
                <p className={`text-sm mb-6 ${TEXT_MUTED}`}>
                  Book a 30-minute partnership call. We'll cover your goals, how the program works, and the revenue share that fits your firm.
                </p>

                <ul className="space-y-4 mb-8 flex-1">
                  {[
                    "Walkthrough of the partner program & commercials",
                    "A live look at the Concolabs platform",
                    "A revenue share mapped to your pipeline",
                    "Clear next steps to get enabled",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-zinc-200 dark:bg-zinc-800">
                        <Check className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" strokeWidth={2.5} />
                      </div>
                      <span className={`text-sm leading-relaxed ${TEXT_MUTED}`}>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Slot grid — opens Google Calendar Appointment Scheduling */}
                <div className="mb-6">
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${TEXT_MUTED}`}>
                    <Calendar className="w-3.5 h-3.5" /> Available slots
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {["Mon · 09:00", "Tue · 10:30", "Wed · 13:00", "Thu · 15:30"].map((slot) => (
                      <a
                        key={slot}
                        href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ36g8nHHMaGgbaQdtlNRO-WqiiLSTuA1LgF8dV7cqGCGcrBTIJhXOWRMSUgkkuQL9UFKeGEztHI"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:border-zinc-500 cursor-pointer block ${BORDER_COLOR}`}
                      >
                        <Clock className="w-3 h-3 inline mr-1 opacity-40" />
                        {slot}
                      </a>
                    ))}
                  </div>
                </div>

                <a
                  href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ36g8nHHMaGgbaQdtlNRO-WqiiLSTuA1LgF8dV7cqGCGcrBTIJhXOWRMSUgkkuQL9UFKeGEztHI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full h-12 font-bold rounded-xl gap-2 transition-all bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950">
                    Book a partnership call <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <p className={`text-xs mt-3 text-center ${TEXT_MUTED}`}>
                  Or email us at{" "}
                  <a href="mailto:info@concolabs.com" className="underline hover:opacity-85" style={{ color: "inherit" }}>
                    info@concolabs.com
                  </a>
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className={`text-3xl sm:text-5xl font-bold tracking-tight text-center mb-10 ${TEXT_HEADING}`}>
              Partner program FAQ
            </h2>
          </FadeIn>

          <div className={`space-y-0 divide-y ${BORDER_COLOR}`}>
            {faqs.map((f, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className={`w-full flex justify-between items-center gap-4 py-5 text-left font-semibold text-base transition-colors ${TEXT_HEADING}`}
                  >
                    <span>{f.q}</span>
                    <span
                      className="text-2xl leading-none transition-transform duration-200 shrink-0 font-light"
                      style={{ transform: openFaq === i ? "rotate(45deg)" : "none" }}
                    >
                      +
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                    transition={{ duration: 0.26, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <p className={`text-sm leading-relaxed pb-5 pr-6 ${TEXT_MUTED}`}>{f.a}</p>
                  </motion.div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className={`rounded-3xl px-10 py-16 text-center relative overflow-hidden border ${CARD_BG} ${BORDER_COLOR} shadow-sm`}>
              <div className="relative z-10">
                <div className="flex justify-center mb-4">
                  <span className={`flex items-center gap-1.5 text-sm font-medium ${TEXT_MUTED}`}>
                    <Star className="w-4 h-4 fill-zinc-400 text-zinc-400" /> Trusted by 500+ construction companies
                  </span>
                </div>
                <h2 className={`text-3xl sm:text-5xl font-bold tracking-tight mb-4 ${TEXT_HEADING}`}>
                  Let&apos;s build something together
                </h2>
                <p className={`text-lg max-w-xl mx-auto mb-8 ${TEXT_MUTED}`}>
                  Turn your relationships in the construction industry into recurring revenue, with a platform your clients will be glad you recommended.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button asChild size="lg" className="rounded-xl px-6 font-bold cursor-pointer bg-[#FFEF1A] hover:bg-[#f5e500] text-black">
                    <Link href="#apply">Become a Partner</Link>
                  </Button>

                  <a href="#book">
                    <button
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-800 text-sm font-bold text-zinc-800 dark:text-zinc-200 bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <span>Book a Call</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  )
}
