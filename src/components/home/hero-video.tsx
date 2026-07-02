"use client"

import React, { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Play, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3])
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.95])

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.muted = true
      video.play().catch(() => {
        setIsPlaying(false)
      })
    }
  }, [])

  const handlePlayClick = () => {
    const video = videoRef.current
    if (video) {
      if (video.paused) {
        video.play()
        setIsPlaying(true)
      } else {
        video.pause()
        setIsPlaying(false)
      }
    }
  }

  const handleSoundToggle = () => {
    const video = videoRef.current
    if (video) {
      const nextMuted = !isMuted
      video.muted = nextMuted
      setIsMuted(nextMuted)
    }
  }

  return (
    <section ref={containerRef} className="relative px-6 pt-6 pb-16 sm:pt-10">
      <motion.div
        style={{ opacity, scale }}
        className="relative max-w-6xl mx-auto"
      >
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-card border border-border shadow-2xl">
          <video
            ref={videoRef}
            src="/videos/Intro/Concolabs Suite Overview.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />

          <button
            type="button"
            onClick={handleSoundToggle}
            className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label={isMuted ? "Turn sound on" : "Turn sound off"}
            title={isMuted ? "Turn sound on" : "Turn sound off"}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Volume2 className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          {/* Overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" /> */}

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 sm:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="mb-4 text-2xl font-bold text-white drop-shadow-lg text-balance sm:text-3xl lg:text-4xl">
                Building the future of construction
              </h2>
              <p className="mx-auto mb-6 hidden max-w-xl text-sm text-white/80 drop-shadow-md sm:block sm:text-base">
                See how Concolabs transforms the way construction teams work
              </p>
              <Button
                onClick={handlePlayClick}
                size="lg"
                className="bg-primary text-black hover:bg-primary/90"
              >
                <Play className="w-5 h-5 mr-2" fill="currentColor" />
                {isPlaying ? "Pause Video" : "Watch Video"}
              </Button>
            </motion.div>
          </div>

          {/* Corner Accents */}
          <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary/50 rounded-tl-lg" />
          <div className="absolute top-4 right-16 w-12 h-12 border-r-2 border-t-2 border-primary/50 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-primary/50 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-primary/50 rounded-br-lg" />
        </div>

        {/* Stats below video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          {[
            { value: "97", label: "Companies served" },
            { value: "500+", label: "Projects Managed" },
            { value: "12K+", label: "Lifetime users" },
            { value: "16+", label: "Countries" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-xl bg-card/50 border border-border/50"
            >
              <div className="text-2xl sm:text-3xl font-bold text-zinc-500">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
