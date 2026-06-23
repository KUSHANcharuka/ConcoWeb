"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Calendar, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section ref={containerRef} className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        {/* Background decoration */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance"
            >
              Ready to transform your<br />
              <span className="text-gradient">construction workflow?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 font-medium"
            >
              Join construction companies already using Concolabs to deliver projects faster and smarter.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button asChild size="lg" className="bg-primary text-black hover:bg-primary/90 min-w-[180px] font-bold rounded-full">
                <Link href="/demo">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book a Demo
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-[180px] font-bold rounded-full">
                <Link href="/chat">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Chat with our Agent
                </Link>
              </Button>
            </motion.div>

            {/* Talk to our AI */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-10 text-base text-muted-foreground font-semibold tracking-tight"
            >
              Talk to our AI. Get the right workflow and pricing in minutes.
            </motion.p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
