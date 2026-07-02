"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/footer"
import { Eye } from "lucide-react"

const sections = [
  { id: "what", label: "1. What Are Cookies" },
  { id: "how", label: "2. How We Use Cookies" },
  { id: "types", label: "3. Types of Cookies" },
  { id: "control", label: "4. Controlling Preferences" },
]

export default function CookiesPage() {
  const [activeSection, setActiveSection] = useState("what")

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
            <Eye className="w-3.5 h-3.5" />
            Last Updated: June 5, 2026
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
            Cookie Policy
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-4 max-w-2xl leading-relaxed">
            This policy explains how Concolabs uses cookies and tracking technologies to optimize drawing tools and verify your sign-in status.
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
            <div id="what" className="space-y-4 pt-4 first:pt-0">
              <h2 className="text-2xl font-bold text-foreground">1. What Are Cookies</h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed">
                Cookies are small text fragments sent to your web browser when visiting web instances. They enable site databases to recognize your browser, save regional settings (such as currency displays), and verify active user sessions.
              </p>
            </div>

            {/* Section 2 */}
            <div id="how" className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">2. How We Use Cookies</h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed">
                We use cookies and local storage tokens to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li>Verify your session ID and prevent forgery risks (CSRF).</li>
                <li>Store your light or dark mode theme selection.</li>
                <li>Remember your active workspace parameter views and drawing scales.</li>
                <li>Analyze system performance metrics, network latency, and rendering speeds.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="types" className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. Types of Cookies We Use</h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed">
                Our site uses both first-party and third-party cookies:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li><strong>Essential Session Cookies:</strong> Required to access active account segments, workspaces, and checkout gates. Disabling these will prevent sign-in behaviors.</li>
                <li><strong>Preference Cookies:</strong> Used to maintain UI settings across reloads, such as your workspace dashboard configurations.</li>
                <li><strong>Performance Analytics:</strong> Handled by SOC-2 compliant analytical subprocessors to help us understand crash patterns and fix lag.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div id="control" className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Controlling Preferences</h2>
              <div className="w-12 h-1 bg-lime rounded-full mb-6" />
              <p className="text-sm leading-relaxed">
                You hold direct authority over how cookies are utilized:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li><strong>Browser Settings:</strong> You can edit browser parameters to clear all cookies or warn you before they are saved. Refer to your browser&apos;s Help page for details.</li>
                <li><strong>Workspace Preferences:</strong> You can configure tracking preferences directly from your account security panel.</li>
              </ul>
              <div className="pt-6 mt-6 border-t border-border/60">
                <p className="text-xs text-muted-foreground">
                  If you have queries regarding our cookie preferences, please contact our support desk: <a href="mailto:support@concolabs.com" className="text-foreground hover:underline font-semibold">support@concolabs.com</a>
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
