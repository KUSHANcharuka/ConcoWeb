"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export interface BlogPost {
  title: string
  category: string
  date: string
  readTime: string
  description: string
  image: string
  author: string
  avatar: string
  slug: string
}

interface BlogCardProps {
  post: BlogPost
  index: number
}

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col sm:flex-row gap-6 md:gap-8 items-start py-8 border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-b-0"
    >
      {/* Left Image */}
      <Link href={`/resources/blog/${post.slug}`} className="block w-full sm:w-[220px] md:w-[260px] aspect-[16/10] rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/40">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none pointer-events-none"
        />
      </Link>

      {/* Right Details */}
      <div className="flex-1 flex flex-col justify-between h-full pt-1">
        <div>
          {/* Category */}
          <span className="text-xs font-semibold tracking-wide text-zinc-550 uppercase font-sans">
            {post.category}
          </span>

          {/* Title - Serif style matching Harvey */}
          <h3 className="text-xl md:text-2xl font-serif font-medium tracking-tight text-zinc-950 dark:text-zinc-50 leading-snug mt-1.5">
            <Link href={`/resources/blog/${post.slug}`} className="hover:opacity-80 transition-opacity focus:outline-none block">
              {post.title}
            </Link>
          </h3>
        </div>

        {/* Date */}
        <div className="text-xs text-zinc-400 font-sans mt-3">
          {post.date}
        </div>
      </div>
    </motion.div>
  )
}


