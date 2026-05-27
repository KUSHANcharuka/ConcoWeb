"use client"

import { useRef, useState, useCallback } from "react"
import { motion, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"

const testimonials = [
  {
    quote: "Concolabs has completely transformed how we manage our construction projects. We've reduced paperwork by 60% and improved team coordination dramatically.",
    author: "Michael Chen",
    role: "CEO",
    company: "Turner Construction",
    image: "MC",
  },
  {
    quote: "The real-time budget tracking alone has saved us millions. We catch cost overruns before they spiral out of control.",
    author: "Sarah Williams",
    role: "CFO",
    company: "Berkeley Group",
    image: "SW",
  },
  {
    quote: "Our field teams and office staff finally speak the same language. Project handoffs are seamless now.",
    author: "David Park",
    role: "Project Director",
    company: "Lendlease Projects",
    image: "DP",
  },
  {
    quote: "The AI-powered insights have helped us predict and prevent delays on multiple major projects. Game changer.",
    author: "Emma Rodriguez",
    role: "Operations Manager",
    company: "SkyHigh Projects",
    image: "ER",
  },
  {
    quote: "Implementing Concolabs was the best decision we made. Our clients are impressed by the transparency we can now offer.",
    author: "James Mitchell",
    role: "Managing Director",
    company: "MetroConstruct",
    image: "JM",
  },
]

export function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: "center",
    skipSnaps: false,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  // Set up the select callback
  if (emblaApi) {
    emblaApi.on("select", onSelect)
  }

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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Loved by construction teams
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what industry leaders say about Concolabs
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_80%] lg:flex-[0_0_60%] px-4"
                >
                  <div 
                    className={`p-8 rounded-2xl bg-card border transition-all duration-300 ${
                      selectedIndex === index 
                        ? "border-zinc-500 shadow-lg shadow-zinc-400/20" 
                        : "border-border"
                    }`}
                  >
                    <Quote className="w-10 h-10 text-zinc-500/40 mb-4" />
                    <p className="text-lg sm:text-xl text-foreground mb-6 leading-relaxed">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center">
                        <span className="text-sm font-bold text-zinc-800">{testimonial.image}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary/50 hover:border-zinc-400 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    selectedIndex === index
                      ? "w-8 bg-zinc-700"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={scrollNext}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary/50 hover:border-zinc-400 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
