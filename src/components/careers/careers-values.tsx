"use client"

import { motion } from "framer-motion"

const values = [
  {
    id: "mission",
    title: "We are drivers of our mission.",
    description: "We’re driven by our commitment to empower every person on the planet to use software exactly the way they want.",
    image: "/images/value-mission.png"
  },
  {
    id: "pace",
    title: "Be a pace setter.",
    description: "We move with urgency so we can set the cadence for our market, cover more ground, and ship more great products and programs for our users, faster.",
    image: "/images/value-pace.png"
  },
  {
    id: "truth",
    title: "Be a truth seeker.",
    description: "We pursue the best data, ideas, and solutions with rigor and open-mindedness, always guided by our users’ most pressing needs.",
    image: "/images/value-truth.png"
  },
  {
    id: "kind",
    title: "Be kind and direct.",
    description: "We deliver feedback in the spirit of helping our colleagues improve, balancing sensitivity with caring honesty. We’re in this together.",
    image: "/images/value-kind.png"
  }
]

export function CareersValues() {
  return (
    <section className="py-20 bg-white dark:bg-zinc-950">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">

        {/* Our Values Section */}
        <div className="space-y-10 max-w-4xl mx-auto">
          <div className="text-center md:text-left border-b border-zinc-150 dark:border-zinc-900 pb-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-950 dark:text-zinc-50 font-sans tracking-tight">
              Our values
            </h2>
          </div>

          <div className="space-y-12 md:space-y-16">
            {values.map((v, i) => {
              const isEven = i % 2 === 0
              return (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center"
                >
                  {/* Image Column */}
                  <div
                    className={`flex justify-center md:col-span-5 order-1 ${isEven ? "md:order-1" : "md:order-2"}`}
                  >
                    <img
                      src={v.image}
                      alt={v.title}
                      className="w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] object-contain dark:invert dark:mix-blend-screen transition-all select-none pointer-events-none"
                    />
                  </div>

                  {/* Text Column */}
                  <div
                    className={`space-y-3 text-left md:col-span-7 order-2 ${isEven ? "md:order-2" : "md:order-1"}`}
                  >
                    <p className="text-base sm:text-lg leading-relaxed text-zinc-650 dark:text-zinc-400 font-sans font-normal">
                      <strong className="font-extrabold text-zinc-950 dark:text-zinc-50 mr-1.5 block md:inline mb-1 md:mb-0">
                        {v.title}
                      </strong>
                      {v.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
