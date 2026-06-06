"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { motion, animate } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ToolItem {
  id: string
  name: string
  price: number
  defaultChecked: boolean
}

const TOOLS: ToolItem[] = [
  { id: "ai_search", name: "AI Search", price: 35, defaultChecked: false },
  { id: "ai_chatbot", name: "AI Chatbot", price: 20, defaultChecked: true },
  { id: "meeting_notes", name: "AI Meeting Notes", price: 18, defaultChecked: false },
  { id: "writing_assist", name: "AI Writing Assistant", price: 20, defaultChecked: false },
  { id: "email_app", name: "AI Email App", price: 30, defaultChecked: true },
  { id: "ai_research", name: "AI Research", price: 40, defaultChecked: false },
  { id: "calendar", name: "Calendar Scheduling", price: 15, defaultChecked: false },
  { id: "team_wiki", name: "Team Wiki", price: 10, defaultChecked: true },
  { id: "pm_tool", name: "Project Management Tool", price: 24, defaultChecked: true },
  { id: "basic_crm", name: "Basic CRM", price: 20, defaultChecked: false },
  { id: "site_builder", name: "Site Builder", price: 20, defaultChecked: true },
  { id: "forms", name: "Forms", price: 15, defaultChecked: true },
]

function AnimatedSavings({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value)
  const prevValueRef = useRef(value)

  useEffect(() => {
    const controls = animate(prevValueRef.current, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest))
      },
    })
    prevValueRef.current = value
    return () => controls.stop()
  }, [value])

  return <span>{displayValue.toLocaleString()}</span>
}

export function Productivity() {
  const [selectedTools, setSelectedTools] = useState<string[]>(
    TOOLS.filter((t) => t.defaultChecked).map((t) => t.id)
  )
  const [teamSizeInput, setTeamSizeInput] = useState<string>("10")

  const handleToggle = (id: string) => {
    setSelectedTools((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    )
  }

  const teamSize = parseInt(teamSizeInput, 10) || 1

  // Calculate costs
  const selectedToolsCostPerUser = TOOLS
    .filter((t) => selectedTools.includes(t.id))
    .reduce((sum, t) => sum + t.price, 0)

  const concolabsCostPerUser = 20 // Concolabs flat price per user
  const monthlySavings = Math.max(0, (selectedToolsCostPerUser - concolabsCostPerUser) * teamSize)
  const annualSavings = monthlySavings * 12

  return (
    <section className="py-24 px-6 bg-card/30 border-y border-border/40">
      <div className="max-w-7xl mx-auto">
        {/* Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
              More productivity.<br />
              <span className="text-foreground">Fewer tools.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Bring all your tools and teams under one roof. Calculate savings below.
            </p>
            <div>
              <Button asChild>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 font-semibold group"
                >
                  See pricing plans
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                    →
                  </span>
                </Link>
              </Button>
            </div>
          </div>
          <div className="w-full lg:max-w-xl ml-auto">
            <img
              src="/asset-calculator.png"
              alt="More productivity. Fewer tools."
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Calculator Card */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xs">
          {/* Checkboxes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 mb-8">
            {TOOLS.map((tool) => {
              const isChecked = selectedTools.includes(tool.id)
              return (
                <label
                  key={tool.id}
                  className="flex items-center gap-3 cursor-pointer group select-none py-1.5"
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isChecked}
                      onChange={() => handleToggle(tool.id)}
                    />
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isChecked
                          ? "bg-foreground border-foreground text-background"
                          : "bg-background border-muted-foreground/30 hover:border-muted-foreground/60"
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <span className="text-foreground/90 font-medium text-sm sm:text-base transition-colors group-hover:text-foreground flex items-baseline flex-wrap">
                    <span>{tool.name}</span>
                    {isChecked && (
                      <span className="ml-1.5 text-xs sm:text-sm text-muted-foreground font-normal whitespace-nowrap">
                        ${tool.price}/user
                      </span>
                    )}
                  </span>
                </label>
              )
            })}
          </div>

          {/* Results Summary Box */}
          <div className="bg-secondary/20 dark:bg-muted/10 border border-border/50 rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Team Size input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="team-size-input" className="text-sm font-semibold text-muted-foreground">
                Team size
              </label>
              <input
                id="team-size-input"
                type="number"
                min="1"
                value={teamSizeInput}
                onChange={(e) => setTeamSizeInput(e.target.value)}
                className="w-full max-w-[180px] bg-background border border-border rounded-xl px-4 py-3 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-foreground/20 text-foreground"
              />
            </div>

            {/* Monthly Savings */}
            <div className="flex flex-col gap-1 md:border-l md:border-border/50 md:pl-8">
              <span className="text-sm font-semibold text-muted-foreground">
                Monthly savings
              </span>
              <div className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
                $<AnimatedSavings value={monthlySavings} />
              </div>
            </div>

            {/* Annual Savings */}
            <div className="flex flex-col gap-1 md:border-l md:border-border/50 md:pl-8">
              <span className="text-sm font-semibold text-muted-foreground">
                Annual savings
              </span>
              <div className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
                $<AnimatedSavings value={annualSavings} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

