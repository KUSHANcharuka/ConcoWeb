import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/footer"
import { CustomersHero } from "@/components/customers/customers-hero"
import { CustomerSpotlight } from "@/components/customers/customer-spotlight"
import { CustomerGrid } from "@/components/customers/customer-grid"

export const metadata = {
  title: "Customer Stories & Success Cases | Concolabs",
  description: "See how leading contractors, developers, and engineers use Concolabs to streamline operations, control costs, and scale project capacity.",
}

export default function CustomersPage() {
  return (
    <main className="min-h-screen bg-background text-foreground antialiased">
      <Navbar />
      <CustomersHero />
      <CustomerSpotlight />
      <CustomerGrid />
      <Footer />
    </main>
  )
}
