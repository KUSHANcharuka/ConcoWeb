"use client"

import { motion } from "framer-motion"

const perks = [
  {
    image: "/images/perk-health.png",
    title: "Medical, dental & vision",
    description: "We offer competitive medical, dental, and vision insurance for employees and dependents. This includes full coverage of medical, dental, and vision premiums."
  },
  {
    image: "/images/perk-vacation.png",
    title: "Time off",
    description: "We want you to take time off to rest and rejuvenate. Concolabs offers flexible paid vacation as well as 10+ observed holidays by country."
  },
  {
    image: "/images/perk-wellbeing.png",
    title: "Mental health & wellbeing",
    description: "You and your dependents will have access to providers that create personalized treatment plans, including therapy, coaching, medication management, and EAP services."
  },
  {
    image: "/images/perk-parental.png",
    title: "Parental leave",
    description: "We offer biological, adoptive, and foster parents paid time off to spend quality time with family."
  },
  {
    image: "/images/perk-setup.png",
    title: "Home office & tech setup",
    description: "Get a generous budget to customize your home office workspace, plus a high-performance computer and top-tier accessories."
  },
  {
    image: "/images/perk-retirement.png",
    title: "Retirement matching",
    description: "Concolabs offers competitive retirement contribution matching plans to support your long-term financial stability and security."
  }
]

export function CareersPerks() {
  return (
    <section className="py-20 bg-white dark:bg-zinc-950 border-t border-zinc-200/50 dark:border-zinc-900/50">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 space-y-16">

        {/* Header */}
        <div className="text-left border-b border-zinc-150 dark:border-zinc-900 pb-8 max-w-5xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-950 dark:text-zinc-50 font-sans tracking-tight">
            Perks & benefits
          </h2>
          <p className="text-base sm:text-lg text-zinc-650 dark:text-zinc-400 font-sans leading-relaxed max-w-3xl">
            Concolabs is committed to providing highly competitive, innovative, and inclusive benefits offerings that attract the best talent from diverse backgrounds. We aim for all our programs to promote overall employee health.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 max-w-5xl mx-auto">
          {perks.map((p, i) => {
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="flex flex-col items-start gap-4"
              >
                <img
                  src={p.image}
                  alt={`Illustration representing the Concolabs construction technology career perk: ${p.title}`}
                  className="w-full max-w-[140px] sm:max-w-[160px] object-contain dark:invert dark:mix-blend-screen transition-all select-none pointer-events-none"
                />
                <div className="space-y-2 text-left">
                  <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 font-sans tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-base text-zinc-650 dark:text-zinc-400 font-sans leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
