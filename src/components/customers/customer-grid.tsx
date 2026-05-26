"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { CustomerCard } from "./customer-card"

const customers = [
  {
    name: "Turner Construction",
    logo: "TC",
    industry: "Commercial",
    size: "Enterprise",
    region: "North America",
    quote: "Concolabs has completely transformed how we manage our construction projects. We've reduced paperwork by 60% and improved team coordination dramatically.",
    author: "Michael Chen",
    role: "CEO",
    result: "40% faster project delivery",
    slug: "turner-construction",
  },
  {
    name: "Berkeley Group",
    logo: "BG",
    industry: "Residential",
    size: "Enterprise",
    region: "Europe",
    quote: "The real-time budget tracking alone has saved us millions. We catch cost overruns before they spiral out of control.",
    author: "Sarah Williams",
    role: "CFO",
    result: "60% reduction in paperwork",
    slug: "berkeley-group",
  },
  {
    name: "Lendlease Projects",
    logo: "LP",
    industry: "Infrastructure",
    size: "Enterprise",
    region: "Asia Pacific",
    quote: "Our field teams and office staff finally speak the same language. Project handoffs are seamless now.",
    author: "David Park",
    role: "Project Director",
    result: "3x improvement in collaboration",
    slug: "lendlease-projects",
  },
  {
    name: "SkyHigh Projects",
    logo: "SH",
    industry: "Commercial",
    size: "Mid-Market",
    region: "Middle East",
    quote: "The AI-powered insights have helped us predict and prevent delays on multiple major projects. Game changer.",
    author: "Emma Rodriguez",
    role: "Operations Manager",
    result: "95% on-time delivery rate",
    slug: "skyhigh-projects",
  },
  {
    name: "MetroConstruct",
    logo: "MC",
    industry: "Infrastructure",
    size: "Mid-Market",
    region: "North America",
    quote: "Implementing Concolabs was the best decision we made. Our clients are impressed by the transparency we can now offer.",
    author: "James Mitchell",
    role: "Managing Director",
    result: "50% fewer client escalations",
    slug: "metroconstruct",
  },
  {
    name: "Apex Builders",
    logo: "AB",
    industry: "Residential",
    size: "Growing",
    region: "North America",
    quote: "As a growing company, Concolabs gave us enterprise-level tools without the enterprise-level complexity.",
    author: "Lisa Thompson",
    role: "Founder",
    result: "Scaled from 5 to 50 projects",
    slug: "apex-builders",
  },
  {
    name: "Shimizu Corporation",
    logo: "SC",
    industry: "Commercial",
    size: "Enterprise",
    region: "Asia Pacific",
    quote: "The integration capabilities are unmatched. We connected all our legacy systems in weeks, not months.",
    author: "Takeshi Yamamoto",
    role: "CTO",
    result: "80% faster data sync",
    slug: "shimizu-corporation",
  },
  {
    name: "Hochtief",
    logo: "HT",
    industry: "Infrastructure",
    size: "Enterprise",
    region: "Europe",
    quote: "Concolabs helps us maintain consistency across hundreds of simultaneous projects worldwide.",
    author: "Klaus Mueller",
    role: "Global Operations Head",
    result: "Standardized 500+ projects",
    slug: "hochtief",
  },
]

const filters = {
  industry: ["All", "Commercial", "Residential", "Infrastructure"],
  size: ["All", "Enterprise", "Mid-Market", "Growing"],
  region: ["All", "North America", "Europe", "Asia Pacific", "Middle East"],
}

export function CustomerGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  
  const [activeFilters, setActiveFilters] = useState({
    industry: "All",
    size: "All",
    region: "All",
  })

  const filteredCustomers = customers.filter((customer) => {
    const industryMatch = activeFilters.industry === "All" || customer.industry === activeFilters.industry
    const sizeMatch = activeFilters.size === "All" || customer.size === activeFilters.size
    const regionMatch = activeFilters.region === "All" || customer.region === activeFilters.region
    return industryMatch && sizeMatch && regionMatch
  })

  return (
    <section ref={containerRef} className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-6">
            {/* Industry Filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                Industry
              </label>
              <div className="flex flex-wrap gap-2">
                {filters.industry.map((option) => (
                  <button
                    key={option}
                    onClick={() => setActiveFilters((prev) => ({ ...prev, industry: option }))}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      activeFilters.industry === option
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                Company Size
              </label>
              <div className="flex flex-wrap gap-2">
                {filters.size.map((option) => (
                  <button
                    key={option}
                    onClick={() => setActiveFilters((prev) => ({ ...prev, size: option }))}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      activeFilters.size === option
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Region Filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                Region
              </label>
              <div className="flex flex-wrap gap-2">
                {filters.region.map((option) => (
                  <button
                    key={option}
                    onClick={() => setActiveFilters((prev) => ({ ...prev, region: option }))}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      activeFilters.region === option
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm text-muted-foreground mb-6"
        >
          Showing {filteredCustomers.length} {filteredCustomers.length === 1 ? "customer" : "customers"}
        </motion.p>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer, index) => (
            <CustomerCard
              key={customer.slug}
              customer={customer}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground">No customers match your filters.</p>
            <button
              onClick={() => setActiveFilters({ industry: "All", size: "All", region: "All" })}
              className="text-primary font-medium mt-2 hover:underline"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
