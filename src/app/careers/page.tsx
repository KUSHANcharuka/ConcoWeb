import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/footer"
import { CareersHero } from "@/components/careers/careers-hero"
import { CareersValues } from "@/components/careers/careers-values"
import { CareersPositions } from "@/components/careers/careers-positions"
import { CareersPerks } from "@/components/careers/careers-perks"

export const metadata = {
  title: "Careers at Concolabs | We're Hiring!",
  description: "Join us in our mission to build the future of construction operations software. Explore open positions in Engineering, Product, Sales, and Operations.",
}

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-black text-foreground antialiased">
      <Navbar />
      <CareersHero />
      <CareersValues />
      <CareersPositions />
      <CareersPerks />
      <Footer />
    </main>
  )
}
