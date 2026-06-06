import { type Metadata } from "next"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/footer"
import { ContactClient } from "@/components/contact/contact-client"

export const metadata: Metadata = {
  title: "Contact Us | Concolabs Construction Platform",
  description:
    "Get in touch with Concolabs. Schedule a customized project operations sales demo, access technical systems support, or contact our global offices.",
  keywords: [
    "contact concolabs",
    "construction tech support",
    "talk to sales concolabs",
    "concolabs office location",
    "general inquiry construction",
  ],
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground antialiased">
      <Navbar />
      <ContactClient />
      <Footer />
    </main>
  )
}
