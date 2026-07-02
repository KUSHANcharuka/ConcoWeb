"use client"

import { useState, useEffect } from "react"
import {
  Lock,
  Unlock,
  Search,
  Plus,
  Trash2,
  Save,
  Undo,
  Globe,
  RefreshCw,
  User,
  Image as ImageIcon,
  Tag,
  Calendar as CalendarIcon,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Edit2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface BlogPost {
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

export default function AdminBlogEditPage() {
  // Passcode gate state
  const [passcode, setPasscode] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authError, setAuthError] = useState("")

  // Blog data state
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [originalBlogs, setOriginalBlogs] = useState<BlogPost[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")

  // Editor state
  const [editingIndex, setEditingIndex] = useState<number | null>(null) // null means not editing/creating, -1 means creating new
  const [editorTitle, setEditorTitle] = useState("")
  const [editorSlug, setEditorSlug] = useState("")
  const [editorCategory, setEditorCategory] = useState("Product News")
  const [editorDate, setEditorDate] = useState("")
  const [editorReadTime, setEditorReadTime] = useState("")
  const [editorDescription, setEditorDescription] = useState("")
  const [editorImage, setEditorImage] = useState("")
  const [editorAuthor, setEditorAuthor] = useState("")
  const [editorAvatar, setEditorAvatar] = useState("")
  const [editorContent, setEditorContent] = useState("")

  // App status states
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState("")

  // Load passcode from localStorage if available
  useEffect(() => {
    const savedPass = localStorage.getItem("conco_admin_pass")
    if (savedPass) {
      setPasscode(savedPass)
      verifyPasscode(savedPass, true)
    } else {
      fetchBlogs()
    }
  }, [])

  // Auto-generate slug from title
  useEffect(() => {
    if (editingIndex === -1 && editorTitle) {
      const generated = editorTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      setEditorSlug(generated)
    }
  }, [editorTitle, editingIndex])

  const verifyPasscode = async (pass: string, isAuto = false) => {
    if (!pass) return
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: pass }) // Passcode verification only
      })

      if (response.status === 401) {
        if (!isAuto) setAuthError("Incorrect passcode. Try again.")
        localStorage.removeItem("conco_admin_pass")
      } else {
        setIsAuthenticated(true)
        setAuthError("")
        localStorage.setItem("conco_admin_pass", pass)
        // Fetch actual blogs
        await fetchBlogs()
      }
    } catch (err) {
      setAuthError("Server communication error.")
    } finally {

      setIsLoading(false)
    }
  }

  const fetchBlogs = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/blogs")
      const data = await response.json()
      if (data.success) {
        setBlogs(data.blogs)
        setOriginalBlogs(JSON.parse(JSON.stringify(data.blogs)))
      }
    } catch (err) {
      console.error("Failed to fetch blogs", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    verifyPasscode(passcode)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPasscode("")
    localStorage.removeItem("conco_admin_pass")
  }

  // Load selected blog into the editor panel
  const startEditing = (index: number) => {
    const post = filteredBlogs[index]
    // Find absolute index in the master blogs array
    const masterIndex = blogs.findIndex((b) => b.slug === post.slug)

    setEditingIndex(masterIndex)
    setEditorTitle(post.title)
    setEditorSlug(post.slug)
    setEditorCategory(post.category)
    setEditorDate(post.date)
    setEditorReadTime(post.readTime)
    setEditorDescription(post.description)
    setEditorImage(post.image)
    setEditorAuthor(post.author)
    setEditorAvatar(post.avatar)
    setEditorContent(post.content)

    // Smooth scroll to form on mobile
    window.scrollTo({ top: 300, behavior: "smooth" })
  }

  const startCreating = () => {
    setEditingIndex(-1)
    setEditorTitle("")
    setEditorSlug("")
    setEditorCategory("Product News")

    // Auto-fill today's date in human readable format
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    const today = new Date().toLocaleDateString("en-US", options)
    setEditorDate(today)

    setEditorReadTime("5 min read")
    setEditorDescription("")
    setEditorImage("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800")
    setEditorAuthor("Marcus Vance")
    setEditorAvatar("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100")
    setEditorContent(`<p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6 font-medium">\n  Write introduction paragraph here...\n</p>\n\n<h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 mt-8 mb-4">\n  Section Title\n</h2>\n<p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">\n  Write section body content here...\n</p>`)

    window.scrollTo({ top: 300, behavior: "smooth" })
  }

  // Save changes from editor to the local array state (not server yet)
  const saveToLocalList = (e: React.FormEvent) => {
    e.preventDefault()

    if (!editorTitle || !editorSlug) {
      alert("Title and Slug are required.")
      return
    }

    const updatedPost: BlogPost = {
      title: editorTitle,
      category: editorCategory,
      date: editorDate,
      readTime: editorReadTime,
      description: editorDescription,
      image: editorImage,
      author: editorAuthor,
      avatar: editorAvatar,
      slug: editorSlug,
      content: editorContent
    }

    let updatedBlogs = [...blogs]

    if (editingIndex === -1) {
      // Create - check for duplicate slugs
      if (blogs.some((b) => b.slug === editorSlug)) {
        alert("A blog post with this slug already exists. Please choose a unique slug.")
        return
      }
      updatedBlogs = [updatedPost, ...updatedBlogs] // Prepend new blogs
    } else if (editingIndex !== null) {
      // Edit - check for duplicate slugs in other posts
      if (blogs.some((b, idx) => b.slug === editorSlug && idx !== editingIndex)) {
        alert("A blog post with this slug already exists. Please choose a unique slug.")
        return
      }
      updatedBlogs[editingIndex] = updatedPost
    }

    setBlogs(updatedBlogs)
    setEditingIndex(null) // Close editor
  }

  // Delete a post from the local list
  const deleteLocalPost = (slug: string) => {
    if (confirm("Are you sure you want to delete this blog post? This change is local until you publish.")) {
      const updatedBlogs = blogs.filter((b) => b.slug !== slug)
      setBlogs(updatedBlogs)
      if (editingIndex !== null && blogs[editingIndex]?.slug === slug) {
        setEditingIndex(null)
      }
    }
  }

  // Revert all local changes back to what is currently saved on the server
  const revertChanges = () => {
    if (confirm("Revert all local changes and reload from server?")) {
      setBlogs(JSON.parse(JSON.stringify(originalBlogs)))
      setEditingIndex(null)
    }
  }

  // Publish all changes to the server (saves JSON file on disk)
  const publishToServer = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    setSaveError("")
    try {
      const response = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, blogs })
      })

      const data = await response.json()
      if (data.success) {
        setSaveSuccess(true)
        setOriginalBlogs(JSON.parse(JSON.stringify(blogs)))
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        setSaveError(data.error || "Failed to publish changes.")
      }
    } catch (err: any) {
      setSaveError(err.message || "Failed to publish changes due to a connection issue.")
    } finally {
      setIsSaving(false)
    }
  }

  // Filter and search
  const filteredBlogs = blogs.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      categoryFilter === "All" || post.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Get list of unique categories currently in use
  const allCategories = ["All", ...Array.from(new Set(blogs.map((b) => b.category)))]

  // Check if there are local modifications compared to server data
  const hasUnsavedChanges = JSON.stringify(blogs) !== JSON.stringify(originalBlogs)

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-zinc-900 border border-zinc-800 rounded-2xl mb-4 text-primary shadow-lg shadow-primary/5">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Admin Portal Access</h1>
            <p className="text-xs text-zinc-400 mt-1">Please enter your passcode to manage the Concolabs blog.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Passcode</label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-xs rounded-xl text-white tracking-widest placeholder:tracking-normal placeholder:text-zinc-650"
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-900/10 border border-red-900/30 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 bg-primary text-black hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Unlock Console
                  <Unlock className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center mt-6">
            <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 antialiased pb-24">
      {/* Banner alerting local changes */}
      {hasUnsavedChanges && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 text-center text-xs text-amber-400 flex items-center justify-center gap-2 relative z-50">
          <AlertCircle className="w-4 h-4" />
          <span>You have unsaved local modifications. Remember to click <strong>Publish Changes</strong> to save them permanently to the server.</span>
          <button
            onClick={revertChanges}
            className="ml-3 px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg font-bold transition-all"
          >
            Revert Changes
          </button>
        </div>
      )}

      {/* Main Header Admin Console */}
      <header className="border-b border-zinc-900 bg-zinc-900/40 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">Concolabs Blog Management Console</h1>
              <p className="text-[10px] text-zinc-400">Authenticated Admin Session • Manage and publish articles in real-time</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/resources/blog" target="_blank">
              <Button variant="outline" size="sm" className="text-black hover:text-black border-zinc-800 text-xs">
                View Live Blog
              </Button>
            </Link>

            <Button
              onClick={publishToServer}
              disabled={isSaving || !hasUnsavedChanges}
              size="sm"
              className="bg-primary text-black hover:bg-primary/90 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Publish Changes
                </>
              )}
            </Button>

            <button
              onClick={handleLogout}
              className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Logout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Feedback Messages */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        {saveSuccess && (
          <div className="flex items-center gap-2 text-xs text-lime-400 bg-lime-900/10 border border-lime-900/30 p-3 rounded-xl mb-4">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Success: All blog posts have been successfully published and written to the database!</span>
          </div>
        )}
        {saveError && (
          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-900/10 border border-red-900/30 p-3 rounded-xl mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Error: {saveError}</span>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">

        {/* Left Column: Post Manager (5 columns) */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-900 p-5 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Your Articles ({blogs.length})</h2>
              <Button
                onClick={startCreating}
                size="sm"
                className="bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 text-xs font-semibold rounded-lg py-1 px-3"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> New Post
              </Button>
            </div>

            {/* Filters */}
            <div className="space-y-2">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search title, description, or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-xs rounded-xl text-white placeholder:text-zinc-650"
                />
              </div>

              {/* Category selector row */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 text-[10px] rounded-md font-bold transition-all ${categoryFilter === cat
                      ? "bg-primary text-black"
                      : "bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-900"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable list */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {filteredBlogs.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500 border border-dashed border-zinc-900 rounded-2xl">
                  No articles found matching filters.
                </div>
              ) : (
                filteredBlogs.map((post, idx) => {
                  const isCurrent = editingIndex !== null && blogs[editingIndex]?.slug === post.slug
                  return (
                    <div
                      key={post.slug}
                      className={`flex gap-3 p-3 rounded-2xl border transition-all ${isCurrent
                        ? "bg-zinc-850/80 border-primary shadow-md"
                        : "bg-zinc-950/60 border-zinc-900 hover:bg-zinc-900/50"
                        }`}
                    >
                      <img
                        src={post.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100"}
                        alt=""
                        className="w-16 h-16 rounded-xl object-cover border border-zinc-900 shrink-0"
                      />
                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold text-primary uppercase tracking-wider">
                              {post.category}
                            </span>
                            <span className="text-zinc-650 text-[9px]">•</span>
                            <span className="text-[9px] text-zinc-500 font-medium">
                              {post.date}
                            </span>
                          </div>
                          <h3 className="font-bold text-xs text-zinc-150 truncate mt-0.5" title={post.title}>
                            {post.title}
                          </h3>
                          <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                            {post.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-zinc-900/60 mt-1">
                          <span className="text-[9px] text-zinc-500 font-medium truncate">By {post.author}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditing(idx)}
                              className="p-1 hover:text-primary transition-colors"
                              title="Edit Article"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteLocalPost(post.slug)}
                              className="p-1 hover:text-red-400 transition-colors"
                              title="Delete Article"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </section>

        {/* Right Column: Blog Post Editor panel (7 columns) */}
        <section className="lg:col-span-7">
          {editingIndex === null ? (
            <div className="bg-zinc-900/30 border border-dashed border-zinc-900 rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center space-y-3">
              <div className="p-4 bg-zinc-900/80 rounded-2xl text-zinc-600 border border-zinc-850">
                <Save className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Editor Workspace</h3>
              <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                Select an existing article from the list to modify its content, or click <strong>New Post</strong> to start writing a new blog.
              </p>
            </div>
          ) : (
            <form onSubmit={saveToLocalList} className="bg-zinc-900/50 border border-zinc-900 p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white">
                    {editingIndex === -1 ? "Write New Blog Post" : "Edit Blog Post Details"}
                  </h2>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {editingIndex === -1
                      ? "Create an article and specify its attributes. It will be prepended to the post list."
                      : `Modifying slot index #${editingIndex} of master list`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingIndex(null)}
                  className="p-1.5 bg-zinc-950 border border-zinc-900 hover:border-zinc-850 text-zinc-400 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Grid */}
              <div className="space-y-4 text-left">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Article Title</label>
                  <input
                    type="text"
                    required
                    value={editorTitle}
                    onChange={(e) => setEditorTitle(e.target.value)}
                    placeholder="Announcing the new engine..."
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-xs rounded-xl text-white font-medium"
                  />
                </div>

                {/* Slug & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">URL Slug</label>
                    <input
                      type="text"
                      required
                      value={editorSlug}
                      onChange={(e) => setEditorSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      placeholder="announcing-new-engine"
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-xs rounded-xl text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Category</label>
                    <select
                      value={editorCategory}
                      onChange={(e) => setEditorCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-xs rounded-xl text-white"
                    >
                      <option value="Product News">Product News</option>
                      <option value="Best Practices">Best Practices</option>
                      <option value="Integrations">Integrations</option>
                      <option value="Engineering">Engineering</option>
                      <option value="News">News</option>
                      <option value="Research">Research</option>
                    </select>
                  </div>
                </div>

                {/* Date & Read Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3 text-zinc-400" />
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Publish Date</label>
                    </div>
                    <input
                      type="text"
                      required
                      value={editorDate}
                      onChange={(e) => setEditorDate(e.target.value)}
                      placeholder="May 25, 2026"
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-xs rounded-xl text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Read Time</label>
                    </div>
                    <input
                      type="text"
                      required
                      value={editorReadTime}
                      onChange={(e) => setEditorReadTime(e.target.value)}
                      placeholder="5 min read"
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-xs rounded-xl text-white"
                    />
                  </div>
                </div>

                {/* Author Name & Avatar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-zinc-400" />
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Author Name</label>
                    </div>
                    <input
                      type="text"
                      required
                      value={editorAuthor}
                      onChange={(e) => setEditorAuthor(e.target.value)}
                      placeholder="Marcus Vance"
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-xs rounded-xl text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Author Avatar URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={editorAvatar}
                        onChange={(e) => setEditorAvatar(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-xs rounded-xl text-white truncate"
                      />
                      {editorAvatar && (
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-zinc-800 shrink-0">
                          <img src={editorAvatar} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Featured Image URL</label>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <input
                      type="text"
                      required
                      value={editorImage}
                      onChange={(e) => setEditorImage(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-xs rounded-xl text-white truncate"
                    />
                    {editorImage && (
                      <div className="w-20 h-12 rounded-lg overflow-hidden border border-zinc-800 shrink-0 bg-zinc-950">
                        <img src={editorImage} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100" }} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Short Description / Card Snippet</label>
                  <textarea
                    required
                    rows={2}
                    value={editorDescription}
                    onChange={(e) => setEditorDescription(e.target.value)}
                    placeholder="Write a brief, punchy intro snippet..."
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-xs rounded-xl text-white resize-none"
                  />
                </div>

                {/* HTML Content Body */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Article Body (HTML content)</label>
                    <span className="text-[9px] text-zinc-500">Supports HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, etc.</span>
                  </div>
                  <textarea
                    required
                    rows={12}
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    placeholder="<p className='text-zinc-650 mb-6'>Write content...</p>"
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-xs rounded-xl text-white font-mono resize-y min-h-[250px]"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-900">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingIndex(null)}
                  className="border-zinc-800 text-black hover:text-white text-xs"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary text-black hover:bg-primary/90 text-xs font-bold"
                >
                  {editingIndex === -1 ? "Add to List" : "Apply Changes to List"}
                </Button>
              </div>
            </form>
          )}
        </section>

      </div>
    </main>
  )
}
