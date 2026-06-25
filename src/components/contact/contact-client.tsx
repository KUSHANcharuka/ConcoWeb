"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Phone,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Linkedin,
  Twitter,
  Github,
  Youtube,
  Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function ContactClient() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle")

  // General form state
  const [genName, setGenName] = useState("")
  const [genEmail, setGenEmail] = useState("")
  const [genSubject, setGenSubject] = useState("")
  const [genMessage, setGenMessage] = useState("")

  const handleSubmitGeneral = (e: React.FormEvent) => {
    e.preventDefault()
    setFormState("submitting")
    setTimeout(() => {
      setFormState("success")
      setGenName("")
      setGenEmail("")
      setGenSubject("")
      setGenMessage("")
    }, 1500)
  }

  return (
    <div className="relative min-h-screen bg-background pt-32 pb-24 overflow-hidden">

      {/* Background radial glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-lime/10 dark:bg-lime/5 rounded-full blur-[140px] opacity-60" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-lime/5 dark:bg-lime/2 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column: Branding, Context and Channels (5/12 width) */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]"
              >
                Let's build the future <br />
                <span className="relative inline-block mt-1 text-gradient">
                  together.
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg text-muted-foreground leading-relaxed pt-2"
              >
                Whether you're looking to automate material take-offs, integrate site workflows, or build custom AI modules, our teams are ready to support your operations.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="pt-2 text-left"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-black hover:bg-primary/90 font-bold rounded-xl shadow-md hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
                >
                  <a
                    href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar className="w-5 h-5 mr-1" />
                    Book a Meeting with us
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </motion.div>
            </div>

            {/* Contact Details & Socials */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6 border-t border-border/60 pt-8 text-left"
            >
              {/* Address Card */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-card border border-border/80 rounded-xl text-foreground shrink-0 shadow-2xs">
                  <MapPin className="w-5 h-5 text-zinc-950 dark:text-zinc-50" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm sm:text-base mb-1">Corporate Office</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    131 Continental Dr, Suite 305,<br />
                    Newark, Delaware 19713, USA
                  </p>
                </div>
              </div>

              {/* Direct Lines Card */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-card border border-border/80 rounded-xl text-foreground shrink-0 shadow-2xs">
                  <Phone className="w-5 h-5 text-zinc-950 dark:text-zinc-50" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm sm:text-base mb-1">Direct Contacts</h3>
                  <div className="space-y-2 mt-1.5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Email:</span>
                      <a href="mailto:ishini@concolabs.com" className="hover:text-foreground hover:underline transition-colors">
                        ishini@concolabs.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Mobile:</span>
                      <a href="tel:+94774102909" className="hover:text-foreground hover:underline transition-colors">
                        +94 774 102 909
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-6 border-t border-border/40">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Connect With Us</h4>
                <div className="flex gap-3">
                  <a
                    href="https://www.linkedin.com/company/concolabs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-card border border-border hover:border-foreground rounded-lg text-muted-foreground hover:text-foreground shadow-2xs transition-all duration-200 hover:-translate-y-0.5"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.youtube.com/@ConcolabsInc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-card border border-border hover:border-foreground rounded-lg text-muted-foreground hover:text-foreground shadow-2xs transition-all duration-200 hover:-translate-y-0.5"
                    aria-label="Youtube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a
                    href="https://github.com/concolabs-com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-card border border-border hover:border-foreground rounded-lg text-muted-foreground hover:text-foreground shadow-2xs transition-all duration-200 hover:-translate-y-0.5"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Contact Form Card (7/12 width) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7 bg-card border border-foreground p-6 sm:p-8 rounded-3xl shadow-xl w-full"
          >
            <AnimatePresence mode="wait">
              {formState === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-14 h-14 bg-lime/10 border border-lime/30 rounded-full flex items-center justify-center relative">
                    <CheckCircle2 className="w-8 h-8 text-foreground fill-lime stroke-[2.5]" />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-lime/50"
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 1.4, opacity: 0 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-foreground tracking-tight">Message Received!</h3>
                  <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                    Thank you for reaching out. A Concolabs team member will review your request and get back to you shortly.
                  </p>
                  <Button variant="outline" className="px-6 rounded-lg text-xs" onClick={() => setFormState("idle")}>
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="general"
                  onSubmit={handleSubmitGeneral}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 text-left"
                >
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1 tracking-tight">General Enquiries</h3>
                    <p className="text-xs text-muted-foreground">Have a general question, career inquiry, or partnership suggestion? Write to our team below.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Your Name</label>
                        <input
                          type="text"
                          required
                          value={genName}
                          onChange={(e) => setGenName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-border/80 focus:border-lime focus:outline-none focus:ring-1 focus:ring-lime text-xs rounded-xl text-foreground"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Email Address</label>
                        <input
                          type="email"
                          required
                          value={genEmail}
                          onChange={(e) => setGenEmail(e.target.value)}
                          placeholder="yourname@domain.com"
                          className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-border/80 focus:border-lime focus:outline-none focus:ring-1 focus:ring-lime text-xs rounded-xl text-foreground"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Subject</label>
                      <input
                        type="text"
                        required
                        value={genSubject}
                        onChange={(e) => setGenSubject(e.target.value)}
                        placeholder="Inquiry subject..."
                        className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-border/80 focus:border-lime focus:outline-none focus:ring-1 focus:ring-lime text-xs rounded-xl text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Your Message</label>
                      <textarea
                        rows={5}
                        required
                        value={genMessage}
                        onChange={(e) => setGenMessage(e.target.value)}
                        placeholder="Write your message details..."
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-border/80 focus:border-lime focus:outline-none focus:ring-1 focus:ring-lime text-xs rounded-xl text-foreground resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" disabled={formState === "submitting"} className="w-full py-5 text-xs font-semibold rounded-xl flex items-center justify-center gap-2">
                      {formState === "submitting" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
