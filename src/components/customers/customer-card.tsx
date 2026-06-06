"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface CustomerCardProps {
  customer: {
    name: string
    logo: string
    industry: string
    size: string
    region: string
    quote: string
    author: string
    role: string
    result: string
    metric: string
    metricLabel: string
    product: string
    avatar?: string
    slug: string
  }
  index: number
  isInView: boolean
}

export function CustomerCard({ customer, index, isInView }: CustomerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group flex flex-col justify-between h-full bg-white dark:bg-zinc-900/45 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-300 relative overflow-hidden"
    >
      {/* Decorative subtle background gradient */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

      <div>
        {/* Metric Highlight (Ramp-inspired) */}
        <div className="mb-6">
          <div className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 mb-1.5 group-hover:text-primary transition-colors">
            {customer.metric}
          </div>
          <div className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            {customer.metricLabel}
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-zinc-200 dark:bg-zinc-800 mb-6" />

        {/* Client details tags */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
            {customer.industry}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
            {customer.size}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
            {customer.product}
          </span>
        </div>

        {/* Testimonial Quote */}
        <blockquote className="text-zinc-700 dark:text-zinc-300 text-[14px] leading-relaxed italic mb-8 relative font-medium">
          &ldquo;{customer.quote}&rdquo;
        </blockquote>
      </div>

      {/* Card Footer: Logo, Author details, Read Story link */}
      <div>
        <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            {/* Spokesperson Avatar / Logo Badge */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-black text-sm shadow-sm select-none flex-shrink-0 border border-zinc-200 dark:border-zinc-800">
              {customer.avatar ? (
                <img
                  src={customer.avatar}
                  alt={customer.author}
                  className="w-full h-full object-cover"
                />
              ) : (
                customer.logo
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-none mb-1">
                {customer.author}
              </p>
              <p className="text-xs font-medium text-zinc-500 leading-none">
                {customer.role}, {customer.name}
              </p>
            </div>
          </div>
        </div>

        {/* Read Story Link overlay on hover */}
        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-50 transition-colors cursor-pointer select-none">
          <span>Read story</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </motion.div>
  )
}
