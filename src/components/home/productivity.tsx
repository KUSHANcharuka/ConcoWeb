"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion"
import { Check, TrendingUp, Clock, FileText, Users } from "lucide-react"

const metrics = [
  {
    icon: TrendingUp,
    value: 40,
    suffix: "%",
    label: "Faster project delivery",
    description: "Average improvement across all projects",
  },
  {
    icon: Clock,
    value: 60,
    suffix: "%",
    label: "Less time on paperwork",
    description: "More time for what matters",
  },
  {
    icon: FileText,
    value: 3,
    suffix: "x",
    label: "Better documentation",
    description: "Auto-organized and searchable",
  },
  {
    icon: Users,
    value: 95,
    suffix: "%",
    label: "Team satisfaction",
    description: "Field crews love the mobile app",
  },
]

const features = [
  "Unified project dashboard",
  "Real-time cost tracking",
  "Automated reporting",
  "AI-powered insights",
  "Document management",
  "Team collaboration",
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest))
        },
      })
      return () => controls.stop()
    }
  }, [isInView, value])

  return (
    <div ref={ref} className="text-4xl sm:text-5xl font-bold text-foreground">
      {displayValue}{suffix}
    </div>
  )
}

export function Productivity() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section ref={containerRef} className="py-24 px-6 bg-card/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            More productivity.<br />
            <span className="text-foreground">Fewer tools.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Replace your fragmented toolstack with one unified platform designed for construction.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <metric.icon className="w-5 h-5 text-primary" />
                </div>
                <AnimatedNumber value={metric.value} suffix={metric.suffix} />
                <p className="text-foreground font-medium mt-2">{metric.label}</p>
                <p className="text-sm text-muted-foreground mt-1">{metric.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Comparison */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="p-8 rounded-2xl bg-card border border-border">
              <h3 className="text-xl font-bold text-foreground mb-6">
                Everything you need, nothing you don&apos;t
              </h3>

              {/* Before/After comparison */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <p className="text-sm font-medium text-destructive mb-3">Before Concolabs</p>
                  <div className="text-3xl font-bold text-destructive mb-1">8+</div>
                  <p className="text-xs text-destructive/70">disconnected tools</p>
                </div>
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <p className="text-sm font-medium text-primary mb-3">With Concolabs</p>
                  <div className="text-3xl font-bold text-primary mb-1">1</div>
                  <p className="text-xs text-muted-foreground">unified platform</p>
                </div>
              </div>

              {/* Feature list */}
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
