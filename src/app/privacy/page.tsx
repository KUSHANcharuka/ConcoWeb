"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/footer"
import { Shield } from "lucide-react"

const sections = [
  { id: "collection", label: "1. Information We Collect" },
  { id: "usage", label: "2. How We Use Information" },
  { id: "sharing", label: "3. Information Sharing" },
  { id: "security", label: "4. Data Security" },
  { id: "rights", label: "5. Your Privacy Rights" },
  { id: "updates", label: "6. Policy Updates" },
]

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("collection")

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
            <Shield className="w-3.5 h-3.5" />
            Last Updated: June 5, 2026
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
            Privacy Policy
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-4 max-w-2xl leading-relaxed">
            At Concolabs, we value your trust. This policy describes how we collect, use, protect, and handle your data across our platforms, mobile apps, and integration endpoints.
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
            <div id="collection" className="space-y-4 pt-4 first:pt-0">
              <h2 className="text-2xl font-bold text-foreground">1. Information We Collect</h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed">
                We collect personal information that you provide to us directly when creating workspaces, purchasing enterprise licenses, or configuring sync endpoints. This includes:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li><strong>Identity Data:</strong> Full name, organizational email, mobile number, company name, and job title.</li>
                <li><strong>Integration Data:</strong> Connection strings, credentials, and API access tokens for integrated ERP tools (e.g., Procore, Autodesk, Sage, QuickBooks).</li>
                <li><strong>CAD & Document Files:</strong> Floor plans, DWG files, project specs, and material catalog values uploaded for BOQ extraction.</li>
                <li><strong>Billing Data:</strong> Credit card hashes, transaction records, and invoice parameters handled by our secure payment partners (Stripe).</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div id="usage" className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">2. How We Use Information</h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed">
                We use collected parameters to deliver our core services, build 3D rendering profiles, and ensure database consistency. This includes:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li>Automating material take-offs and generating PDF/Excel bill-of-quantities sheets.</li>
                <li>Syncing project logs, invoice schedules, and labor metrics across remote jobsites using SQLite offline replication.</li>
                <li>Providing customer support and debugging API integration timeouts.</li>
                <li>Monitoring system health, detecting SQL injection risks, and defending cloud instances against network attacks.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="sharing" className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. Information Sharing & Disclosure</h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed">
                Concolabs does not sell, lease, or trade your construction drawing values or team records to third-party brokers. We share data only in these defined cases:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li><strong>Subprocessors:</strong> We coordinate with SOC-2 compliant hosting providers (AWS, Google Cloud Platform) and database instances to maintain backend state.</li>
                <li><strong>Client Integrations:</strong> If you explicitly authorize a third-party app in our developer dashboard, we share specific sync channels as instructed.</li>
                <li><strong>Legal Mandates:</strong> We may disclose parameters if required by federal law, binding regulatory rulings, or valid court subpoenas.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div id="security" className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Data Security</h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed">
                Our operations framework is engineered to safeguard your drawing repository and financial sheets:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li>All network routes are protected with HTTPS, HTTP/2, and TLS 1.3 encryption.</li>
                <li>Drawing assets and CAD objects are encrypted at-rest using FIPS 140-2 validated AES-256 modules.</li>
                <li>Engineering logs are monitored 24/7 for suspicious authentication failures, unauthorized key queries, or data leaks.</li>
                <li>We conduct annual third-party security reviews and host active vulnerability disclosure channels.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div id="rights" className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">5. Your Privacy Rights</h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed">
                Depending on your operating location (including GDPR, UK GDPR, and CCPA guidelines), you hold statutory control rights over your personal profile records:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li><strong>Right to Access:</strong> You can query a full copy of your account profile records and stored database rows.</li>
                <li><strong>Right to Rectify:</strong> You can edit incorrect address values or profile numbers from the workspace panel.</li>
                <li><strong>Right to Delete:</strong> You can request complete termination of your workspace records and related drawing replicas.</li>
                <li><strong>Right to Restrict:</strong> You can opt-out of specific integrations, analytics reporting, or corporate newsletters.</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div id="updates" className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">6. Policy Updates</h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed">
                We may modify this policy periodically to align with product updates, developer APIs, or statutory regulations. Any revisions will be announced by modifying the Last Updated date pill at the top of this document. For significant changes, we will send an email alert to all registered workspace administrators.
              </p>
              <div className="pt-6 mt-6 border-t border-border/60">
                <p className="text-xs text-muted-foreground">
                  If you have questions, inquiries, or feedback regarding our privacy practices, please contact us at: <a href="mailto:privacy@concolabs.com" className="text-foreground hover:underline font-semibold">privacy@concolabs.com</a>
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
