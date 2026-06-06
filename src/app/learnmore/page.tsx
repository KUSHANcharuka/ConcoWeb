"use client"

import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/footer"
import { useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface TypewriterParagraphProps {
  text: string
  speed?: number
  delay?: number
}

function TypewriterParagraph({ text, speed = 8, delay = 0 }: TypewriterParagraphProps) {
  const [displayedText, setDisplayedText] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!isInView) return

    let timer: any
    const startTyping = () => {
      let index = 0
      timer = setInterval(() => {
        if (index < text.length) {
          setDisplayedText((prev) => prev + text.charAt(index))
          index++
        } else {
          clearInterval(timer)
        }
      }, speed)
    }

    const delayTimer = setTimeout(startTyping, delay)

    return () => {
      clearTimeout(delayTimer)
      clearInterval(timer)
    }
  }, [isInView, text, speed, delay])

  return (
    <div ref={ref} className="text-lg sm:text-xl md:text-2xl font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed min-h-[5em] relative text-pretty">
      <span>{displayedText}</span>
      {isInView && displayedText.length < text.length && (
        <span className="inline-block w-2 h-5 bg-lime ml-1 animate-pulse align-middle" />
      )}
    </div>
  )
}

export default function LearnMorePage() {
  const para1 = "Concolabs was founded to eliminate the administrative drag that compromises construction teams globally. We replace manual blueprint tracing, double-entry Excel logs, and coordination bottlenecks with unified AI engines, turning days of repetitive drafting into instant, compliant outputs."
  const para2 = "Our tools are built specifically for architects, developers, quantity surveyors, and contractors operating across residential, commercial, and civil infrastructure projects. It bridges the workflow from the first feasibility plot checks to final on-site payment claim approvals."
  const para3 = "By automating structural geometry conversions and legal contract auditing, our users achieve 85%+ reductions in estimating time, secure real-time visibility into project budgets, and unlock seamless offline mobile sync — allowing teams to focus on construction rather than documentation."

  return (
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-lime/30 selection:text-black">
      <Navbar />

      {/* Hero Header Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-zinc-50/20 dark:bg-zinc-950/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-lime/10 dark:bg-lime/5 rounded-full blur-[140px] opacity-60 animate-pulse" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10 text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1] max-w-4xl text-pretty">
            The complete operating system for{" "}
            <span className="text-zinc-500">modern construction</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-6 max-w-3xl leading-relaxed text-pretty">
            We build specialized AI engines and offline-first mobile tools to eliminate administrative drag, automate quantities, and synchronize site-to-office operations.
          </p>

          <div className="space-y-8 mt-12 max-w-3xl">
            <TypewriterParagraph text={para1} speed={6} delay={100} />
            <TypewriterParagraph text={para2} speed={6} delay={200} />
            <TypewriterParagraph text={para3} speed={6} delay={300} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
