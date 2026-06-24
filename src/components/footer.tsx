"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { Twitter, Linkedin, Github, Youtube } from "lucide-react";

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
};

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/concolabs", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/concolabs", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/concolabs", label: "GitHub" },
  { icon: Youtube, href: "https://youtube.com/concolabs", label: "YouTube" },
];

// ── High-performance brand watermark text ──
function BrandWatermark() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const span = spanRef.current;
    if (!container || !span) return;

    let rafId: number;

    const update = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;

      // progress: 0 when footer-top is at viewport bottom, 1 when footer-top is at viewport top
      const raw = (vh - rect.top) / rect.height;
      const progress = Math.min(1, Math.max(0, raw));

      // Animate only GPU-composited properties — no layout repaints
      const scale = 0.4 + progress * 0.65;          // 0.4 → 1.05
      const opacity = progress * 0.13;               // 0 → 0.13 (clearly visible)
      const ty = (1 - progress) * 80;               // 80px → 0px rise

      span.style.transform = `translateY(${ty}px) scale(${scale})`;
      span.style.opacity = String(opacity);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Trigger immediately in case footer is already partially visible
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 flex items-end justify-center pointer-events-none select-none"
      style={{ zIndex: 0, height: "100%", overflow: "hidden", paddingBottom: "1rem" }}
    >
      <span
        ref={spanRef}
        style={{
          fontSize: "clamp(4.5rem, 17vw, 19rem)",
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 0.9,
          color: "#111111",
          whiteSpace: "nowrap",
          transformOrigin: "center bottom",
          willChange: "transform, opacity",
          // Start invisible; JS sets the real values after mount
          opacity: 0,
          transform: "translateY(80px) scale(0.4)",
        }}
      >
        CONCOLABS
      </span>
    </div>
  );
}


export function Footer() {
  return (
    <footer className="relative w-full bg-white border-t border-zinc-150 overflow-hidden">
      {/* ── Giant brand watermark behind content ── */}
      <BrandWatermark />

      {/* ── All footer content sits above watermark ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-10">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-semibold text-zinc-900">Concolabs</span>
            </Link>

            <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
              The operating system for modern construction. Unify your projects, teams, and data.
            </p>

            {/* Social row */}
            <div className="flex items-center gap-2.5 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key} className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors duration-200"
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
        <div className="border-t border-zinc-150 py-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-1">Stay updated</h3>
              <p className="text-sm text-zinc-500">Get the latest news and updates from Concolabs.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 w-full sm:w-64"
              />
              <button className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors duration-200 w-full sm:w-auto cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar divider */}
        <div className="border-t border-zinc-150" />

        {/* Spacer so watermark text has room below the content */}
        <div className="h-28 md:h-40" />

        {/* Copyright notice centered at the bottom middle */}
        <div className="flex justify-center w-full relative z-10">
          <p className="text-xs text-zinc-450 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} Concolabs, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
