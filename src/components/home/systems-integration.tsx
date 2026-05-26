"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  FileSpreadsheet,
  Receipt,
  ClipboardList,
  Building2,
  HardHat,
  Truck,
  RefreshCw,
  LayoutGrid,
  Sparkles,
} from "lucide-react"

const integrationApps = [
  { icon: FileSpreadsheet, label: "Excel" },
  { icon: Building2, label: "BIM" },
  { icon: Receipt, label: "Accounting" },
  { icon: HardHat, label: "Safety" },
  { icon: ClipboardList, label: "Tracking" },
  { icon: Truck, label: "Supply Chain" },
]

const features = [
  {
    icon: RefreshCw,
    title: "Save money by eliminating duplicate systems",
    description:
      "One platform replaces overlapping tools and admin effort, cutting software spend and saving you time.",
  },
  {
    icon: LayoutGrid,
    title: "Automate end-to-end workflows, not just tasks",
    description:
      "Connect project management, budgeting, and compliance in a single automated pipeline — no switching required.",
  },
  {
    icon: Sparkles,
    title: "Start with the right data, get AI that actually works",
    description:
      "Unified, structured data gives AI full context so it can answer real questions and take real action, not just generate text.",
  },
]

export function SystemsIntegration() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — heading + feature list */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance leading-tight">
              When everything runs on one system, work moves faster
            </h2>
            <p className="text-muted-foreground text-lg mb-12">
              Replace dozens of tools, handoffs, and manual work with one unified platform.
            </p>

            <div className="flex flex-col">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.12 }}
                >
                  <div className="flex items-start gap-5 py-8">
                    <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  {index < features.length - 1 && (
                    <div className="h-px bg-border w-full" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — hub diagram */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-[480px] aspect-square mx-auto select-none">

              {/* SVG connection lines */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 480 480"
                fill="none"
              >
                {/* horizontal line through center */}
                <line x1="60"  y1="240" x2="420" y2="240" stroke="#D4A800" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />
                {/* top row verticals to center row */}
                <line x1="100" y1="120" x2="100" y2="200" stroke="#D4A800" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />
                <line x1="380" y1="120" x2="380" y2="200" stroke="#D4A800" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />
                {/* bottom row verticals from center row */}
                <line x1="100" y1="280" x2="100" y2="360" stroke="#D4A800" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />
                <line x1="380" y1="280" x2="380" y2="360" stroke="#D4A800" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />
                {/* left connector to hub */}
                <path d="M145 240 Q200 240 200 240" stroke="#D4A800" strokeWidth="1.5" opacity="0.5" />
                {/* right connector to hub */}
                <path d="M335 240 Q280 240 280 240" stroke="#D4A800" strokeWidth="1.5" opacity="0.5" />
              </svg>

              {/* 6 App cards — 2 cols × 3 rows, hub in dead center */}
              {/* Top-left */}
              <AppCard icon={integrationApps[0].icon} label={integrationApps[0].label} style={{ top: "6%", left: "6%" }} delay={0.3} isInView={isInView} />
              {/* Top-right */}
              <AppCard icon={integrationApps[1].icon} label={integrationApps[1].label} style={{ top: "6%", right: "6%" }} delay={0.35} isInView={isInView} />
              {/* Middle-left */}
              <AppCard icon={integrationApps[2].icon} label={integrationApps[2].label} style={{ top: "50%", left: "6%", transform: "translateY(-50%)" }} delay={0.4} isInView={isInView} />
              {/* Middle-right */}
              <AppCard icon={integrationApps[3].icon} label={integrationApps[3].label} style={{ top: "50%", right: "6%", transform: "translateY(-50%)" }} delay={0.45} isInView={isInView} />
              {/* Bottom-left */}
              <AppCard icon={integrationApps[4].icon} label={integrationApps[4].label} style={{ bottom: "6%", left: "6%" }} delay={0.5} isInView={isInView} />
              {/* Bottom-right */}
              <AppCard icon={integrationApps[5].icon} label={integrationApps[5].label} style={{ bottom: "6%", right: "6%" }} delay={0.55} isInView={isInView} />

              {/* Central Hub */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 200 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <div
                  className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center shadow-xl"
                  style={{ background: "linear-gradient(135deg, #C49000 0%, #F5C400 100%)" }}
                >
                  <span className="text-black font-black text-2xl tracking-tight">C</span>
                  <span className="text-black/70 text-[9px] font-semibold tracking-widest uppercase mt-0.5">Concolabs</span>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

/* ---------- App Card ---------- */
function AppCard({
  icon: Icon,
  label,
  style,
  delay,
  isInView,
}: {
  icon: React.ElementType
  label: string
  style: React.CSSProperties
  delay: number
  isInView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.45, delay, type: "spring", stiffness: 180 }}
      className="absolute w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg"
      style={{
        ...style,
        background: "linear-gradient(145deg, #7A5C00 0%, #C49000 100%)",
      }}
    >
      <Icon className="w-7 h-7 text-yellow-100" strokeWidth={1.5} />
      <span className="text-[9px] font-semibold text-yellow-200 tracking-wide">{label}</span>
    </motion.div>
  )
}
