"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const personas = [
  { id: "architects", label: "Architects" },
  { id: "real-estate-developers", label: "Real estate developers" },
  { id: "contractors", label: "Contractors" },
  { id: "construction-consultancies", label: "Construction consultancies" },
  { id: "modellers", label: "Modellers" },
  { id: "legal-professionals", label: "Legal professionals" }
]

interface PersonaSwitcherProps {
  currentPersona: string
}

export function PersonaSwitcher({ currentPersona }: PersonaSwitcherProps) {
  return (
    <div className="w-full bg-[#FAFAF8] dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-900 sticky top-16 z-40 py-3.5 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-start lg:justify-center overflow-x-auto no-scrollbar gap-2 sm:gap-3">
        {personas.map((per) => {
          const isActive = per.id === currentPersona
          return (
            <Link
              key={per.id}
              href={`/solutions/${per.id}`}
              className={`shrink-0 select-none px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              {per.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
