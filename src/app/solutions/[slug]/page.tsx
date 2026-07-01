import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/footer"
import { ProductDetail, productDetailMap } from "@/components/solutions/product-detail"
import { PersonaSwitcher } from "@/components/persona/persona-switcher"
import { PersonaTimeline } from "@/components/persona/persona-timeline"
import { personasData } from "@/lib/persona-data"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return [
    // Product Slugs
    { slug: "project-management" },
    { slug: "budget-control" },
    { slug: "documents" },
    { slug: "collaboration" },
    { slug: "analytics" },
    // Persona Slugs
    { slug: "architects" },
    { slug: "real-estate-developers" },
    { slug: "contractors" },
    { slug: "construction-consultancies" },
    { slug: "modellers" },
    { slug: "legal-professionals" }
  ]
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  
  const product = productDetailMap[slug]
  if (product) {
    return {
      title: `${product.title} | Concolabs Construction Suite`,
      description: product.tagline,
    }
  }

  const persona = personasData[slug]
  if (persona) {
    return {
      title: `${persona.eyebrow} Suite | Concolabs`,
      description: persona.heroTitle,
    }
  }

  return {
    title: "Page Not Found | Concolabs",
  }
}

export default async function SolutionsDynamicPage({ params }: PageProps) {
  const { slug } = await params
  
  // 1. Try to render Product Detail Page
  const product = productDetailMap[slug]
  if (product) {
    return (
      <main className="min-h-screen bg-background text-foreground antialiased">
        <Navbar />
        <ProductDetail slug={slug} />
        <Footer />
      </main>
    )
  }

  // 2. Try to render Persona Page
  const persona = personasData[slug]
  if (persona) {
    const bookingUrl = "https://calendar.app.google/mCq7zBhXrDnEAJvB7"
    return (
      <main className="min-h-screen bg-[#FAFAF8] dark:bg-zinc-950 text-foreground antialiased">
        <Navbar />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6 bg-[#F4F2F0] dark:bg-zinc-900/40 relative overflow-hidden">
          {/* Subtle Background Radial Gradient */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-zinc-900/5 dark:bg-zinc-50/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10 text-center space-y-6">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight text-balance">
              {persona.heroTitleNormal || persona.heroTitle}{" "}
              {persona.heroTitleHighlight && (
                <span className="relative inline-block">
                  {persona.heroTitleHighlight}
                  <span className="absolute left-0 right-0 bottom-2 h-3 bg-lime/20 -z-10 rounded-xs" />
                </span>
              )}
            </h1>
            <p className="text-zinc-650 dark:text-zinc-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
              {persona.heroSubtext}
            </p>
          </div>
        </section>

        {/* Switcher Strip */}
        <PersonaSwitcher currentPersona={slug} />

        {/* Timeline Section */}
        <PersonaTimeline data={persona} />

        {/* Footer CTA */}
        <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/40 relative overflow-hidden border-t border-zinc-200 dark:border-zinc-800">
          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 text-balance leading-tight">
              {persona.footerTitle}
            </h2>
            <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              {persona.footerSubtext}
            </p>
            <div className="flex justify-center">
              <Button asChild size="lg" className="rounded-xl px-8 py-6 font-bold shadow-md cursor-pointer bg-primary text-black hover:bg-primary/90">
                <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
                  Book a walkthrough →
                </a>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  // 3. Fallback to 404 View
  return (
    <main className="min-h-screen bg-background text-foreground pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
      <Navbar />
      <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
      <p className="text-zinc-500 mb-8">The requested solutions page does not exist.</p>
      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
      <Footer />
    </main>
  )
}
