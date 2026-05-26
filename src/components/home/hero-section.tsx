'use client'

import { HeroTagline } from './hero-tagline'
import { HeroVideo } from './hero-video'
import { InteractiveCanvas } from './interactive-canvas'

export function HeroSection() {
  return (
    <section className="relative">
      {/* Interactive Canvas Background - starts below navbar (top-16 = 64px) */}
      <div 
        className="absolute inset-0 top-16 pointer-events-none overflow-hidden" 
        style={{ zIndex: 0 }}
      >
        <InteractiveCanvas />
      </div>
      
      {/* Hero Content - sits above canvas */}
      <div className="relative" style={{ zIndex: 1 }}>
        <HeroTagline />
        <HeroVideo />
      </div>
    </section>
  )
}
