"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/footer"
import { Lock } from "lucide-react"

const sections = [
  { id: "compliance", label: "1. Security Operations & Compliance" },
  { id: "encryption", label: "2. Data Encryption Protocols" },
  { id: "infrastructure", label: "3. Infrastructure Defense" },
  { id: "access", label: "4. Access Control & IAM" },
  { id: "disclosure", label: "5. Vulnerability Disclosure" },
]

export default function SecurityPage() {
  const [activeSection, setActiveSection] = useState("compliance")

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
            <Lock className="w-3.5 h-3.5" />
            Last Updated: June 5, 2026
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
            Security Infrastructure
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-4 max-w-2xl leading-relaxed">
            Concolabs is built from the ground up to protect active drawing assets, financial tables, and project identities. Learn how we safeguard your enterprise operations.
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
            <div id="compliance" className="space-y-4 pt-4 first:pt-0">
              <h2 className="text-2xl font-bold text-foreground">
                1. Security Operations & Compliance
              </h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed">
                Concolabs implements operational controls verified by independent third-party assessments:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li><strong>SOC 2 Type II:</strong> Our infrastructure, employee workflows, and development life cycles are audited annually under SOC 2 Security and Availability criteria.</li>
                <li><strong>GDPR & CCPA Compliant:</strong> Stored profile records, drawing archives, and active databases are managed in compliance with EU and US data privacy regulations.</li>
                <li><strong>PCI-DSS Level 1:</strong> All financial and subscription payments are directly handled by Stripe, a certified PCI Level 1 credit card processor. We do not store raw card numbers.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div id="encryption" className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                2. Data Encryption Protocols
              </h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed">
                We ensure that all customer files, databases, and API keys are heavily encrypted during transit and at rest:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li><strong>In Transit:</strong> Web connections, mobile requests, and SQLite sync routes are encrypted using HTTPS and TLS 1.3. Standard HTTP requests are automatically upgraded.</li>
                <li><strong>At Rest:</strong> Stored assets, CAD drawings, metadata values, and credentials are encrypted using AES-256 with keys managed by AWS Key Management Service (KMS).</li>
                <li><strong>Key Rotation:</strong> Encryption keys are automatically rotated periodically to protect access credentials from compromise.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="infrastructure" className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                3. Infrastructure Defense
              </h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed">
                Our application servers reside in premium AWS and GCP data centers, featuring:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li><strong>Isolated VPCs:</strong> Databases are housed in private subnets with strict firewall rules and are inaccessible from the open web.</li>
                <li><strong>DDoS Mitigation:</strong> High-bandwidth edge routing services defend instance gateways against volumetric network attacks and resource exhaustion.</li>
                <li><strong>Automated Backups:</strong> Database replicas and system snapshots are encrypted and captured daily, with multi-region backup replication.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div id="access" className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                4. Access Control & IAM
              </h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed">
                We strictly enforce identity and access management guidelines internally and externally:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li><strong>Multi-Factor Authentication (MFA):</strong> Corporate workspaces can enforce mandatory 2FA/MFA for all team profiles (via Google Authenticator or SMS).</li>
                <li><strong>Role-Based Access Control (RBAC):</strong> Admin, Member, and Viewer roles restrict drawing editing rights and checkout access.</li>
                <li><strong>Single Sign-On (SSO):</strong> Enterprise accounts can configure custom SAML 2.0 or OIDC single sign-on connections (e.g., Okta, Azure AD).</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div id="disclosure" className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                5. Vulnerability Disclosure
              </h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed">
                We welcome reports from cybersecurity researchers. If you identify a bug or vulnerability:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li>Please submit details via email to <a href="mailto:security@concolabs.com" className="text-foreground hover:underline font-semibold">security@concolabs.com</a> before making it public.</li>
                <li>Provide reproducible steps, payload examples, and affected routes.</li>
                <li>We do not seek legal action against researchers acting in good faith. We review reports within 48 hours and work to deploy hotfixes promptly.</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}
