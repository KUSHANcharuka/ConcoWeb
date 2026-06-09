import Link from "next/link"
import { Twitter, Linkedin, Github, Youtube } from "lucide-react"

const footerLinks = {
  solutions: {
    title: "Solutions",
    links: [
      { label: "Architects", href: "/solutions/architects" },
      { label: "Real Estate Developers", href: "/solutions/real-estate-developers" },
      { label: "Contractors & Builders", href: "/solutions/contractors" },
      { label: "Consultancies & QS", href: "/solutions/construction-consultancies" },
      { label: "3D Modellers", href: "/solutions/modellers" },
      { label: "Legal & Contracts", href: "/solutions/legal-professionals" },
      { label: "View all solutions →", href: "/solutions" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Learn More", href: "/learnmore" },
      { label: "Blog", href: "/resources/blog" },
      { label: "Help Center", href: "/resources/help" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Partners", href: "/partners" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Security", href: "/security" },
    ],
  },
}

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/concolabs", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/concolabs", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/concolabs", label: "GitHub" },
  { icon: Youtube, href: "https://youtube.com/concolabs", label: "YouTube" },
]

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-semibold text-foreground">Concolabs</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              The operating system for modern construction. Unify your projects, teams, and data.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="py-8 border-t border-border mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Stay updated
              </h3>
              <p className="text-sm text-muted-foreground">
                Get the latest news and updates from Concolabs.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-64"
              />
              <button className="px-4 py-2 rounded-lg bg-primary text-black text-sm font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Concolabs, Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
