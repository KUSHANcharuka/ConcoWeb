import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/footer"
import { blogPosts } from "@/lib/blog-data"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar } from "lucide-react"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) {
    return {
      title: "Article Not Found | Concolabs",
    }
  }
  return {
    title: `${post.title} | Concolabs Blog`,
    description: post.description,
  }
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-black text-foreground antialiased">
      <Navbar />

      <article className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/resources/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to blog</span>
          </Link>
        </div>

        {/* Two-Column Grid: Text on Left, Sticky Image on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Text Area (7 columns) */}
          <div className="lg:col-span-7 space-y-6 lg:order-1">
            {/* Category & Metadata */}
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-zinc-900/5 dark:bg-zinc-50/5 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                {post.category}
              </span>
              
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.15] text-balance">
                {post.title}
              </h1>

              <p className="text-lg text-zinc-500 leading-relaxed text-pretty">
                {post.description}
              </p>
            </div>

            {/* Author / Date Strip */}
            <div className="flex flex-wrap items-center gap-6 py-4 border-y border-zinc-200/60 dark:border-zinc-800/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                    {post.author}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-medium">
                    Concolabs Contributor
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-zinc-500 ml-auto sm:ml-0 font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{post.date}</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>

            {/* Article Body Content */}
            <div 
              className="prose prose-zinc dark:prose-invert max-w-none text-zinc-650 dark:text-zinc-350 leading-relaxed space-y-6 pt-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Right Side: Featured Image (5 columns) - Sticky on Desktop, Top on Mobile */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:order-2 order-first mb-6 lg:mb-0">
            <div className="aspect-[4/3] w-full rounded-3xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </article>

      <Footer />
    </main>
  )
}
