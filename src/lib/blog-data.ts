import blogPostsJson from "./blog-posts.json"

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
  content: string
}

export const blogPosts: BlogPost[] = blogPostsJson as BlogPost[]
