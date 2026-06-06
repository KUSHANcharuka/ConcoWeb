"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SolutionsMenu } from "./solutions-menu"
import { PartnersMenu } from "./partners-menu"
import { ResourcesMenu } from "./resources-menu"
import { ChatModal } from "@/components/ui/chat-modal"

const navItems = [
  { id: "solutions", label: "Solutions", hasDropdown: true },
  { id: "customers", label: "Customers", hasDropdown: false, href: "/customers" },
  { id: "partners", label: "Partners", hasDropdown: true },
  { id: "resources", label: "Resources", hasDropdown: true },
  { id: "pricing", label: "Pricing", hasDropdown: false, href: "/pricing" },
]

const menuComponents: Record<string, React.FC> = {
  solutions: SolutionsMenu,
  partners: PartnersMenu,
  resources: ResourcesMenu,
}

const menuSlideVariants = {
  enter: (direction: 1 | -1) => ({
    x: direction > 0 ? 20 : -20,
    opacity: 0,
    position: "absolute" as const,
    inset: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    position: "absolute" as const,
    inset: 0,
  },
  exit: (direction: 1 | -1) => ({
    x: direction > 0 ? -20 : 20,
    opacity: 0,
    position: "absolute" as const,
    inset: 0,
  }),
}

export function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1)
  const [viewportHeight, setViewportHeight] = useState(0)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const measureRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = (itemId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    const item = navItems.find((i) => i.id === itemId)
    if (!item?.hasDropdown) return

    if (activeMenu && activeMenu !== itemId) {
      const currentIndex = navItems.findIndex((i) => i.id === activeMenu)
      const nextIndex = navItems.findIndex((i) => i.id === itemId)
      if (currentIndex !== -1 && nextIndex !== -1) {
        setSlideDirection(nextIndex > currentIndex ? 1 : -1)
      }
    }

    setActiveMenu(itemId)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
    }, 150)
  }

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!measureRef.current || !activeMenu) return

    const updateHeight = () => {
      if (measureRef.current) {
        setViewportHeight(measureRef.current.offsetHeight)
      }
    }

    updateHeight()

    const observer = new ResizeObserver(updateHeight)
    observer.observe(measureRef.current)

    return () => observer.disconnect()
  }, [activeMenu])

  const ActiveMenuComponent = activeMenu ? menuComponents[activeMenu] : null

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-sm border-b border-border/30">
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-semibold text-foreground">Concolabs</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div key={item.id} className="relative">
                  {item.href && !item.hasDropdown ? (
                    <Link
                      href={item.href}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      onMouseEnter={() => handleMouseEnter(item.id)}
                      onMouseLeave={handleMouseLeave}
                      className={`inline-flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                        activeMenu === item.id
                          ? "text-foreground bg-secondary/50"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      {item.label}
                      {item.hasDropdown && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            activeMenu === item.id ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <Link href="/contact">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact
                </Link>
              </Button>
              <Button asChild>
                <Link href="/demo">Request a Demo</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Dropdown Menu */}
          <AnimatePresence mode="wait">
            {activeMenu && ActiveMenuComponent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="absolute left-0 right-0 top-full mt-2 px-6 flex justify-center"
              >
                <motion.div
                  className="relative w-full max-w-[1104px] bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
                  animate={{ height: viewportHeight }}
                  transition={{ duration: 0.3, ease: [0.45, 0.05, 0.55, 0.95] }}
                >
                  <div className="relative overflow-hidden">
                    <div ref={measureRef} className="invisible p-6 pointer-events-none" aria-hidden="true">
                      <ActiveMenuComponent />
                    </div>
                    <AnimatePresence initial={false} custom={slideDirection} mode="sync">
                      <motion.div
                        key={activeMenu}
                        custom={slideDirection}
                        variants={menuSlideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                        className="p-6 will-change-transform"
                      >
                        <ActiveMenuComponent />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border bg-background"
            >
              <div className="px-6 py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href || `/${item.id}`}
                    className="block px-4 py-3 text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/demo">Request a Demo</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Chat Modal */}
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
}
