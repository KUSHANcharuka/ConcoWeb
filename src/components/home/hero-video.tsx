"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Play, Maximize, Minimize, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoAreaRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3])
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.95])

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(() => {
        setIsPlaying(false)
      })
    }
  }, [])

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  // Exit fullscreen on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoAreaRef.current?.requestFullscreen().catch((err) => {
        console.error("Error going fullscreen:", err)
      })
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

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

  return (
    <section ref={containerRef} className="relative px-6 py-16">
      <motion.div
        style={{ opacity, scale }}
        className="relative max-w-6xl mx-auto"
      >
        {/* Video Container */}
        <div
          ref={videoAreaRef}
          onDoubleClick={toggleFullscreen}
          className="relative aspect-video rounded-2xl overflow-hidden bg-card border border-border shadow-2xl group cursor-pointer select-none"
        >
          {/* Video Placeholder - using a construction stock video */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
            className="w-full h-full object-cover"
          >
            {/* Placeholder - replace with actual video */}
            <source
              src="https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4"
              type="video/mp4"
            />
          </video>

          {/* Overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" /> */}

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 drop-shadow-lg text-balance">
                Building the future of construction
              </h2>
              <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto mb-6 drop-shadow-md">
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

          {/* Fullscreen Close Button */}
          {isFullscreen && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFullscreen()
              }}
              className="absolute top-6 right-6 z-50 p-3 bg-zinc-900/80 border border-zinc-700 hover:bg-zinc-800 text-white rounded-full transition-colors cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Hover HUD Controls */}
          <div
            className="absolute bottom-4 right-4 z-30 flex items-center gap-3 bg-zinc-950/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                if (videoRef.current) {
                  if (videoRef.current.paused) {
                    videoRef.current.play()
                  } else {
                    videoRef.current.pause()
                  }
                }
              }}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
            <div className="h-4 w-[1px] bg-zinc-800" />
            <button
              onClick={toggleFullscreen}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>

          {/* Corner Accents */}
          <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary/50 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-primary/50 rounded-tr-lg" />
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
