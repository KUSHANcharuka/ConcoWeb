"use client"

import { motion } from "framer-motion"

const companies = [
  { name: "BuildRight Construction", logo: "BR" },
  { name: "SteelFrame Industries", logo: "SF" },
  { name: "Foundation Pro", logo: "FP" },
  { name: "UrbanDev Group", logo: "UD" },
  { name: "Apex Builders", logo: "AB" },
  { name: "MetroConstruct", logo: "MC" },
  { name: "SkyHigh Projects", logo: "SH" },
  { name: "Concrete Solutions", logo: "CS" },
  { name: "Titan Engineering", logo: "TE" },
  { name: "Premier Developments", logo: "PD" },
  { name: "Vertex Construction", logo: "VC" },
  { name: "Landmark Builders", logo: "LB" },
]

export function CustomerLogos() {

  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
            Trusted by industry leaders
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Powering the world&apos;s best construction companies
          </h2>
        </motion.div>

        {/* Logo Carousel - First Row (Left to Right) */}
        <div className="relative overflow-hidden">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: -1000 }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-8 items-center"
          >
            {[...companies, ...companies, ...companies].map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="flex-shrink-0 group"
              >
                <div className="w-40 h-20 rounded-xl bg-card border border-border flex items-center justify-center gap-3 transition-all duration-300 hover:border-primary/50 hover:bg-secondary/30">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{company.logo}</span>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                    {company.name.split(" ")[0]}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Gradient Masks */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>

        {/* Logo Carousel - Second Row (Right to Left) */}
        <div className="relative mt-6 overflow-hidden">
          <motion.div
            initial={{ x: -1000 }}
            animate={{ x: 0 }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-8 items-center"
          >
            {[...companies.slice().reverse(), ...companies.slice().reverse(), ...companies.slice().reverse()].map((company, index) => (
              <div
                key={`${company.name}-rev-${index}`}
                className="flex-shrink-0 group"
              >
                <div className="w-40 h-20 rounded-xl bg-card border border-border flex items-center justify-center gap-3 transition-all duration-300 hover:border-primary/50 hover:bg-secondary/30">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{company.logo}</span>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                    {company.name.split(" ")[0]}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Gradient Masks */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  )
}
