"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { CustomerCard } from "./customer-card"
import { SlidersHorizontal } from "lucide-react"

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
    metric: "20 hrs",
    metricLabel: "saved weekly per site manager",
    product: "Field Operations",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&auto=format&fit=crop&q=80",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
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
    metric: "15%",
    metricLabel: "reduction in concrete wastage cost",
    product: "AI Cost Control",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
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
    metric: "3.5x",
    metricLabel: "increase in logistics speed",
    product: "Field Operations",
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&auto=format&fit=crop&q=80",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
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
    metric: "95%",
    metricLabel: "on-time delivery rate",
    product: "AI Cost Control",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
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
    metric: "50%",
    metricLabel: "fewer client escalations",
    product: "ERP Financial Sync",
    image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&auto=format&fit=crop&q=80",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
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
    metric: "10x",
    metricLabel: "project scaling capacity",
    product: "Offline Mobile Sync",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
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
    metric: "80%",
    metricLabel: "faster ERP data sync",
    product: "ERP Financial Sync",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
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
    metric: "500+",
    metricLabel: "standardized global sites",
    product: "Offline Mobile Sync",
    image: "https://images.unsplash.com/photo-1473876615753-2709032c524e?w=600&auto=format&fit=crop&q=80",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80",
    slug: "hochtief",
  },
  {
    name: "Novus Development",
    logo: "ND",
    industry: "Residential",
    size: "Enterprise",
    region: "North America",
    quote: "Before Concolabs, we were always reacting to cost overruns weeks after they happened. Now, the AI engine flags potential anomalies in real-time, letting us adjust on the fly and stay on budget.",
    author: "Elena Rostova",
    role: "VP of Product Development",
    result: "98% forecasting accuracy",
    metric: "98.4%",
    metricLabel: "budget forecasting accuracy",
    product: "AI Cost Control",
    image: "https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=600&auto=format&fit=crop&q=80",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    slug: "novus-development",
  },
  {
    name: "Summit Structures",
    logo: "SS",
    industry: "Commercial",
    size: "Mid-Market",
    region: "Europe",
    quote: "Integrating our jobsite operations directly with Procore and Sage meant no more manual data entry. The finance office in London and field site in Manchester are now in perfect lockstep.",
    author: "Elena Rostova",
    role: "VP of Finance",
    result: "3 days faster financial close",
    metric: "3 Days",
    metricLabel: "faster financial close",
    product: "ERP Financial Sync",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    slug: "summit-structures",
  },
  {
    name: "Vertex Infrastructure",
    logo: "VI",
    industry: "Infrastructure",
    size: "Enterprise",
    region: "North America",
    quote: "Our crews work in remote mountainous regions with zero cell service. Concolabs saves inspections locally and uploads the second they hit connectivity. It's transformed site reports.",
    author: "Elena Rostova",
    role: "Infrastructure Lead",
    result: "Zero data loss across remote sites",
    metric: "0.0%",
    metricLabel: "offline data loss rate",
    product: "Offline Mobile Sync",
    image: "https://images.unsplash.com/photo-1533513780520-9867c585187e?w=600&auto=format&fit=crop&q=80",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    slug: "vertex-infrastructure",
  },
]

const filterOptions = {
  product: ["All", "AI Cost Control", "Field Operations", "ERP Financial Sync", "Offline Mobile Sync"],
  size: ["All", "Enterprise", "Mid-Market", "Growing"],
  industry: ["All", "Commercial", "Residential", "Infrastructure"],
}

export function CustomerGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  
  const [activeFilters, setActiveFilters] = useState({
    product: "All",
    size: "All",
  })

  const filteredCustomers = customers.filter((customer) => {
    const productMatch = activeFilters.product === "All" || customer.product === activeFilters.product
    const sizeMatch = activeFilters.size === "All" || customer.size === activeFilters.size
    return productMatch && sizeMatch
  })

  return (
    <section ref={containerRef} className="py-24 px-6 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        
        {/* Filters Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-zinc-500" />
            <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
              Filter customer stories
            </h3>
          </div>
          
          <div className="text-sm font-semibold text-zinc-400">
            Showing {filteredCustomers.length} {filteredCustomers.length === 1 ? "story" : "stories"}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Filter */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Product Module</span>
            <div className="flex flex-wrap gap-2">
              {filterOptions.product.map((option) => {
                const isActive = activeFilters.product === option
                return (
                  <button
                    key={option}
                    onClick={() => setActiveFilters((prev) => ({ ...prev, product: option }))}
                    className="relative px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer select-none"
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeProduct"
                        className="absolute inset-0 bg-zinc-950 dark:bg-white rounded-full z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? "text-white dark:text-zinc-950" : "text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-200"}`}>
                      {option}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Company Size Filter */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Company Size</span>
            <div className="flex flex-wrap gap-2">
              {filterOptions.size.map((option) => {
                const isActive = activeFilters.size === option
                return (
                  <button
                    key={option}
                    onClick={() => setActiveFilters((prev) => ({ ...prev, size: option }))}
                    className="relative px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer select-none"
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeSize"
                        className="absolute inset-0 bg-zinc-950 dark:bg-white rounded-full z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? "text-white dark:text-zinc-950" : "text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-200"}`}>
                      {option}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Grid of customer stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCustomers.map((customer, index) => (
              <motion.div
                key={customer.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <CustomerCard
                  customer={customer}
                  index={index}
                  isInView={true}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-zinc-50 dark:bg-zinc-900/30 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl"
          >
            <p className="text-zinc-500 font-medium">No customer stories match your selection.</p>
            <button
              onClick={() => setActiveFilters({ product: "All", size: "All" })}
              className="text-zinc-950 dark:text-white font-bold text-sm mt-3 hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          </motion.div>
        )}

      </div>
    </section>
  )
}
