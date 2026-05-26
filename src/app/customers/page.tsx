import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/footer"
import { CustomersHero } from "@/components/customers/customers-hero"
import { CustomerGrid } from "@/components/customers/customer-grid"

export const metadata = {
  title: "Customers | Concolabs",
  description: "See how leading construction companies transform their operations with Concolabs.",
}

export default function CustomersPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <CustomersHero />
      <CustomerGrid />
      <Footer />
    </main>
  )
}
