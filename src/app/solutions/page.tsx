"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SolutionsPage() {
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("active_persona")
    const defaultPersona = "architects"
    if (stored) {
      router.replace(`/solutions/${stored}`)
    } else {
      router.replace(`/solutions/${defaultPersona}`)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      {/* Sleek micro-animation loading spinner during transition */}
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  )
}
