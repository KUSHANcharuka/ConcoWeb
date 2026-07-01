import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/hero-section";
import { CustomerLogos } from "@/components/home/customer-logos";
import { PlatformSection } from "@/components/home/platform-section";
import { SystemsIntegration } from "@/components/home/systems-integration";
import { CTASection } from "@/components/home/cta-section";
import { Testimonials } from "@/components/home/testimonials";
import { GlobalPresence } from "@/components/home/global-presence";
import { WhatsNew } from "@/components/home/whats-new";
import { Productivity } from "@/components/home/productivity";
import { AwardsSection } from "@/components/home/awards-section";
import { FinalCTA } from "@/components/home/final-cta";
import { WhySwitch } from "@/components/home/why-switch";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CustomerLogos />
      <PlatformSection />
      <SystemsIntegration />
      <CTASection />
      {/* <Testimonials /> */}
      <WhySwitch />
      {/* <WhatsNew /> */}
      <Productivity />
      {/* <AwardsSection /> */}
      <FinalCTA />
      <Footer />
    </main>
  );
}
