"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/footer"
import { Scale, AlertCircle } from "lucide-react"

const sections = [
  { id: "acceptance", label: "1. Acceptance of Terms" },
  { id: "accounts", label: "2. Accounts & Subscriptions" },
  { id: "conduct", label: "3. Acceptable Conduct" },
  { id: "billing", label: "4. Fees & Billing Terms" },
  { id: "intellectual", label: "5. Intellectual Property" },
  { id: "liability", label: "6. Limitation of Liability" },
]

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("acceptance")

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 120,
        behavior: "smooth",
      })
      setActiveSection(id)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Header Section */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-lime/10 dark:bg-lime/5 rounded-full blur-[140px] opacity-60" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10 text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-900 border border-border/80 text-foreground mb-4">
            <Scale className="w-3.5 h-3.5" />
            Last Updated: June 5, 2026
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
            Terms of Service
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-4 max-w-2xl leading-relaxed">
            Please read these terms carefully before accessing or using the Concolabs operating system. By signing up, you agree to these contract conditions.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Sticky Table of Contents (4/12) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6 hidden lg:block">
            <div className="p-6 bg-card border border-border rounded-2xl shadow-2xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                Table of Contents
              </h3>
              <ul className="space-y-3">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollTo(section.id)}
                      className={`text-xs font-semibold text-left transition-colors duration-200 block ${
                        activeSection === section.id
                          ? "text-foreground font-bold pl-2 border-l-2 border-lime"
                          : "text-muted-foreground hover:text-foreground pl-2 border-l border-transparent"
                      }`}
                    >
                      {section.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Detailed Text (8/12) */}
          <div className="lg:col-span-8 space-y-12 text-left prose prose-sm dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-300">
            
            {/* Section 1 */}
            <div id="acceptance" className="space-y-4 pt-4 first:pt-0">
              <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed">
                By creating a user profile, uploading CAD floor plans, or referencing our API integration interfaces, you agree to be bound by these Terms of Service. If you are accepting these terms on behalf of a contractor, consultancy, or builder corporation, you warrant that you hold appropriate corporate power of attorney to bind your organization.
              </p>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-border/80 rounded-xl flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Important Notice:</strong> These conditions include binding arbitration clauses and waiver rights concerning class action proceedings. Please review Section 6 carefully.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div id="accounts" className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">2. Accounts & Subscriptions</h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed">
                You are responsible for keeping your login credentials secure. You agree to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li>Provide accurate profile descriptions and contact numbers during registration.</li>
                <li>Prevent unauthorized sharing of seat licenses. User accounts are designated for individual use only.</li>
                <li>Notify Concolabs operations team immediately of any discovered vulnerability or unauthorized entry into your workspace.</li>
                <li>Ensure that all users on your corporate plan comply with the user obligations stated herein.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="conduct" className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. Acceptable Conduct</h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed">
                You agree not to use the Concolabs operating system to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li>Upload malware, virus code, or SQL injection vectors through file uploads or REST API parameters.</li>
                <li>Perform automated scraping, high-frequency rate checks, or load testing without prior consent from our systems engineers.</li>
                <li>Access or query database nodes of other workspaces without authorization credentials.</li>
                <li>Use automated scripts to bypass product selection parameters, pricing rules, or checkout gates.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div id="billing" className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Fees & Billing Terms</h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed">
                Fees for paid plans (Starter, Mid-market, Growth, Enterprise) are billed recurrently in advance. One-off license tools (such as 2D to 3D conversions or automated BOQ measurements) are charged immediately upon execution. All charges are handled securely through third-party processors. Fees are non-refundable except as required by local consumer rules or explicitly agreed in an Enterprise SLA.
              </p>
            </div>

            {/* Section 5 */}
            <div id="intellectual" className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">5. Intellectual Property</h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed">
                The Concolabs brand, logo layouts, web applications, background algorithms, rendering engines, and source codes are the exclusive intellectual property of Concolabs, Inc. Your drawing files, CAD models, uploaded databases, and sheets remain your property. By uploading assets, you grant us a limited, worldwide license to process, parse, and render files inside your private workspace.
              </p>
            </div>

            {/* Section 6 */}
            <div id="liability" className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">6. Limitation of Liability</h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed text-balance">
                TO THE EXTENT PERMITTED BY DELAWARE LAW, CONCOLABS AND ITS AFFILIATES SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, OR LOSS OF PROJECT REVENUE, MATERIAL BUDGET CORRECTIONS, OR INTEGRATION DATA LOSS. OUR MAXIMUM LIABILITY FOR CONTRACT BREACH CLAIMS IS LIMITED TO THE TOTAL AMOUNT PAID BY YOU TO CONCOLABS IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
              </p>
              <div className="pt-6 mt-6 border-t border-border/60">
                <p className="text-xs text-muted-foreground">
                  For questions or formal contract disputes, please write to our legal team at: <a href="mailto:legal@concolabs.com" className="text-foreground hover:underline font-semibold">legal@concolabs.com</a>
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}
