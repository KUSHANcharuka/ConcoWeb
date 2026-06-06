import { type Metadata } from "next"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/footer"
import { PricingClient } from "@/components/pricing/pricing-client"

export const metadata: Metadata = {
  title: "Pricing | Concolabs Construction Platform",
  description:
    "Explore transparent pricing plans for Concolabs. Select from comprehensive All-in-One packages or construct your custom SaaS tool suite with our A La Carte builder.",
  keywords: [
    "construction software pricing",
    "concolabs pricing",
    "saas pricing calculator",
    "modular construction pricing",
  ],
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PricingClient />
      <Footer />
    </main>
  )
}
