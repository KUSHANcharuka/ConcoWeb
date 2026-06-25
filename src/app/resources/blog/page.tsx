import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/footer"
import { BlogHero } from "@/components/blog/blog-hero"
import { BlogGrid } from "@/components/blog/blog-grid"
import { blogPosts } from "@/lib/blog-data"
import { type BlogPost } from "@/components/blog/blog-card"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  title: "The Concolabs Blog",
  description: "Insights on AI, automation, software engineering, digital transformation, and modern product development from Concolabs.",
}

export default function BlogPage() {
  const featured = blogPosts.slice(0, 3) // Cycle top 3 articles as featured spotlight
  const gridPosts = blogPosts // Display all posts in grid

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-black text-foreground antialiased">
      <Navbar />
      <BlogHero featuredPosts={featured} />
      <BlogGrid posts={gridPosts} />
      <Footer />
    </main>
  )
}

