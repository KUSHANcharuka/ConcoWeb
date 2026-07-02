"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { type BlogPost } from "./blog-card"

interface BlogHeroProps {
  featuredPosts: BlogPost[]
}

export function BlogHero({ featuredPosts }: BlogHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (isHovering || featuredPosts.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredPosts.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [isHovering, featuredPosts.length])

  const activePost = featuredPosts[currentIndex]
  if (!activePost) return null

  return (
    <section ref={containerRef} className="pt-36 pb-12 bg-[#FAFAF8] dark:bg-black border-b border-zinc-200/50 dark:border-zinc-900/50 relative overflow-hidden">
      {/* Subtle background element */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[300px] bg-zinc-100/50 dark:bg-zinc-900/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        
        {/* Page Title & Eyebrow */}
        <div className="mb-12 space-y-3">
          <span className="text-sm uppercase tracking-[0.2em] font-medium text-zinc-500 block">
            Resources & Insights
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.95] font-sans text-zinc-950 dark:text-zinc-50">
            The Concolabs Blog
          </h1>
        </div>

        {/* Featured Post Spotlight Card (Ramp style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/60 p-8 md:p-12 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 shadow-xs relative overflow-hidden min-h-[380px] flex flex-col justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full"
            >
              
              {/* Left Content Column */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6 lg:space-y-8 order-2 lg:order-1">
                <div className="space-y-4">
                  
                  {/* Category badge */}
                  <div>
                    <span className="inline-flex rounded-full bg-zinc-100 dark:bg-zinc-850 px-3 py-1 text-xs font-semibold tracking-tight text-zinc-800 dark:text-zinc-200">
                      {activePost.category}
                    </span>
                  </div>

                  {/* Main Title */}
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sans text-zinc-950 dark:text-zinc-50 leading-tight tracking-tight">
                    <Link href={`/resources/blog/${activePost.slug}`} className="hover:opacity-85 transition-opacity focus:outline-none">
                      {activePost.title}
                    </Link>
                  </h2>

                  {/* Description */}
                  <p className="text-lg leading-relaxed text-zinc-655 dark:text-zinc-400 font-sans">
                    {activePost.description}
                  </p>
                </div>

                {/* Author Row */}
                <div className="flex items-center gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-900">
                  <img
                    src={activePost.avatar}
                    alt={`${activePost.author}, author of Concolabs construction technology insights`}
                    className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-x-2 text-sm font-sans">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{activePost.author}</span>
                    <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">&bull;</span>
                    <span className="text-zinc-550 dark:text-zinc-400">{activePost.date} &bull; {activePost.readTime}</span>
                  </div>
                </div>

              </div>

              {/* Right Image Column */}
              <div className="lg:col-span-7 order-1 lg:order-2">
                <Link href={`/resources/blog/${activePost.slug}`} className="block relative aspect-[2/1] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 group">
                  <img
                    src={activePost.image}
                    alt={`Concolabs construction software featured article cover: ${activePost.title}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Slide Indicators */}
          {featuredPosts.length > 1 && (
            <div className="absolute bottom-4 right-8 lg:right-12 flex items-center gap-1.5 z-10">
              {featuredPosts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentIndex ? "w-6 bg-zinc-950 dark:bg-white" : "w-1.5 bg-zinc-200 dark:bg-zinc-800"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}

        </motion.div>

      </div>
    </section>
  )
}


