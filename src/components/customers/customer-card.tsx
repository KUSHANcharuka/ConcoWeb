"use client"

import { motion } from "framer-motion"
import { ArrowRight, Quote } from "lucide-react"
import Link from "next/link"

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
    slug: string
  }
  index: number
  isInView: boolean
}

export function CustomerCard({ customer, index, isInView }: CustomerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={`/customers/${customer.slug}`}>
        <div className="h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <span className="text-lg font-bold text-primary">{customer.logo}</span>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded-full bg-secondary/50 text-xs text-muted-foreground">
                {customer.industry}
              </span>
            </div>
          </div>

          {/* Company Name */}
          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {customer.name}
          </h3>

          {/* Meta */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span>{customer.size}</span>
            <span>•</span>
            <span>{customer.region}</span>
          </div>

          {/* Result highlight */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 mb-4">
            <p className="text-sm font-medium text-primary">{customer.result}</p>
          </div>

          {/* Quote */}
          <div className="relative">
            <Quote className="w-6 h-6 text-primary/20 absolute -top-1 -left-1" />
            <p className="text-sm text-muted-foreground pl-4 line-clamp-3">
              &ldquo;{customer.quote}&rdquo;
            </p>
          </div>

          {/* Author */}
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{customer.author}</p>
              <p className="text-xs text-muted-foreground">{customer.role}</p>
            </div>
            <div className="flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Read story
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
