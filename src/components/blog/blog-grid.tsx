"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BlogCard, type BlogPost } from "./blog-card"
import { Search } from "lucide-react"

interface BlogGridProps {
  posts: BlogPost[]
}

const categories = ["All Posts", "Insights", "Company", "Technical", "Product"]

const categoryMapping: Record<string, string[]> = {
  "All Posts": ["All"],
  "Insights": ["Best Practices", "Research"],
  "Company": ["News"],
  "Technical": ["Engineering", "Integrations"],
  "Product": ["Product News"]
}

export function BlogGrid({ posts }: BlogGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [activeCategory, setActiveCategory] = useState("All Posts")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = posts.filter((post) => {
    const isAll = activeCategory === "All Posts"
    const mappedCategories = categoryMapping[activeCategory] || []
    const categoryMatch = isAll || mappedCategories.includes(post.category)
    const searchMatch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
    return categoryMatch && searchMatch
  })

  return (
    <section ref={containerRef} className="py-20 bg-[#FAFAF8] dark:bg-black">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column (Sidebar) */}
          <div className="lg:col-span-4 lg:sticky lg:top-36 space-y-8 flex flex-col justify-between">
            {/* Category list stack */}
            <div className="space-y-4 flex flex-col items-start">
              {categories.map((category) => {
                const isActive = activeCategory === category
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`font-serif text-left transition-colors duration-300 cursor-pointer select-none leading-none ${
                      isActive 
                        ? "text-3xl sm:text-4xl font-medium text-zinc-950 dark:text-zinc-50"
                        : "text-2xl sm:text-3xl text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-200"
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>

            {/* Search Bar Input */}
            <div className="relative w-full max-w-[280px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 flex items-center justify-between rounded-md mt-8 shadow-xs">
              <input
                type="text"
                placeholder="Search all posts"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none border-none w-full text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-0 focus:outline-none font-sans"
              />
              <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
            </div>

            {/* Back to top Link */}
            <div className="pt-4 hidden lg:block">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-955 dark:hover:text-zinc-50 transition-colors text-sm font-sans"
              >
                <span>↑</span>
                <span>Back to top</span>
              </button>
            </div>

          </div>

          {/* Right Column (Articles Vertical List) */}
          <div className="lg:col-span-8 border-t lg:border-t-0 border-zinc-200/60 dark:border-zinc-800/60 pt-8 lg:pt-0">
            <AnimatePresence mode="popLayout">
              {filteredPosts.length > 0 ? (
                <div className="flex flex-col">
                  {filteredPosts.map((post, index) => (
                    <BlogCard key={post.slug} post={post} index={index} />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-24 bg-white dark:bg-zinc-950 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl"
                >
                  <p className="text-zinc-500 font-medium font-sans">No articles match your filters.</p>
                  <button
                    onClick={() => {
                      setActiveCategory("All Posts")
                      setSearchQuery("")
                    }}
                    className="text-zinc-950 dark:text-white font-bold text-sm mt-3 hover:underline cursor-pointer font-sans"
                  >
                    Reset filters & search
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}
