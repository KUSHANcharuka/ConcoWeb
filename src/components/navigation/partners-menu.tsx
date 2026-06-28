"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PartnersMenu() {
  return (
    <div className="max-w-md mx-auto py-2">
      {/* Become a Partner CTA */}
      <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Become a Partner
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Join our partner ecosystem and grow your business while helping construction companies succeed.
        </p>
        <Button asChild>
          <Link href="/partner">
            Apply Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

