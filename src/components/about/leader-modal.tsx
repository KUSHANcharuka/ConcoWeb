"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { X, Linkedin, MapPin, Briefcase, UserPlus, Check, MessageSquare, ExternalLink } from "lucide-react"
import type { Leader } from "@/lib/team-data"

interface LeaderProfileModalProps {
  isOpen: boolean
  onClose: () => void
  leader: Leader | null
}

export function LeaderProfileModal({ isOpen, onClose, leader }: LeaderProfileModalProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isPending, setIsPending] = useState(false)

  // Escape key handler to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
      // Prevent body scroll
      document.body.style.overflow = "hidden"
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  // Reset states when leader changes
  useEffect(() => {
    setIsConnected(false)
    setIsPending(false)
  }, [leader])

  // Play audio related to team member name once when selected
  useEffect(() => {
    if (isOpen && leader) {
      // Map name to the exact audio filename (matching trailing space in Elena's file)
      let fileName = leader.name
      if (leader.name === "Elena Rostova") {
        fileName = "Elena Rostova "
      }
      const audioUrl = `/Audio/${fileName}.aac`
      const audio = new Audio(encodeURI(audioUrl))

      audio.play().catch(err => {
        console.error("Audio playback failed:", err)
      })

      return () => {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [isOpen, leader])

  if (!isOpen || !leader) return null

  const handleConnect = () => {
    if (!isConnected && !isPending) {
      setIsPending(true)
      setTimeout(() => {
        setIsPending(false)
        setIsConnected(true)
      }, 1000)
    } else {
      setIsConnected(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/55 backdrop-blur-2xl cursor-pointer"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
        className="relative w-full max-w-5xl bg-white/15 dark:bg-zinc-950/40 backdrop-blur-3xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-zinc-800/40 z-10 flex flex-col max-h-[90vh] md:max-h-[85vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 text-zinc-900 dark:text-zinc-100 border border-white/10 dark:border-white/10 flex items-center justify-center transition-colors focus:outline-hidden cursor-pointer shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 scrollbar-thin p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">
            
            {/* Left Column: Image and Upper Part */}
            <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-6 md:sticky md:top-0">
              {/* Avatar Image (size up!) */}
              <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full border-4 border-white/30 dark:border-zinc-700/50 bg-zinc-200/20 overflow-hidden shrink-0 shadow-lg relative">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Info */}
              <div className="space-y-2 w-full">
                <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight leading-tight">
                  {leader.name}
                </h2>
                <p className="text-base sm:text-lg text-zinc-800 dark:text-zinc-200 mt-1 leading-normal font-semibold">
                  {leader.headline}
                </p>
              </div>

              {/* LinkedIn-style Action Buttons */}
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={handleConnect}
                  disabled={isPending}
                  className={`w-full inline-flex items-center justify-center gap-1.5 font-bold px-5 py-3 rounded-full text-sm shadow-sm transition-all active:scale-97 cursor-pointer ${
                    isConnected
                      ? "bg-white/20 dark:bg-zinc-800/30 text-zinc-900 dark:text-zinc-200 hover:bg-white/35 dark:hover:bg-zinc-800/50 border border-white/20 dark:border-zinc-700/50"
                      : isPending
                      ? "bg-primary/70 text-black cursor-not-allowed"
                      : "bg-primary text-black hover:bg-primary/90"
                  }`}
                >
                  {isConnected ? (
                    <>
                      <Check className="w-4 h-4" />
                      Connected
                    </>
                  ) : isPending ? (
                    "Connecting..."
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Connect
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <a
                    href={`mailto:${leader.name.toLowerCase().replace(" ", ".")}@concolabs.com`}
                    className="inline-flex items-center justify-center gap-1.5 border border-white/25 dark:border-zinc-700/50 bg-white/10 dark:bg-zinc-900/20 hover:bg-white/20 dark:hover:bg-zinc-800/40 text-zinc-900 dark:text-zinc-100 font-bold px-4 py-3 rounded-full text-sm transition-colors cursor-pointer text-center"
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span>Message</span>
                  </a>

                  <a
                    href={leader.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 border border-white/25 dark:border-zinc-700/50 bg-white/10 dark:bg-zinc-900/20 hover:bg-white/20 dark:hover:bg-zinc-800/40 text-zinc-900 dark:text-zinc-100 font-bold px-4 py-3 rounded-full text-sm transition-colors cursor-pointer text-center"
                  >
                    <Linkedin className="w-4 h-4 shrink-0" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Other Part (About, Experience, Skills) */}
            <div className="md:col-span-7 space-y-6 w-full">
              {/* About Card */}
              <div className="bg-white/15 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xs backdrop-blur-xs">
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-3">
                  About
                </h3>
                <p className="text-sm sm:text-base text-zinc-855 dark:text-zinc-200 leading-relaxed font-normal">
                  {leader.bio}
                </p>
              </div>

              {/* Experience Card */}
              <div className="bg-white/15 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xs backdrop-blur-xs">
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-5">
                  Experience
                </h3>
                <div className="space-y-6 relative">
                  {leader.experience.map((exp, idx) => (
                    <div key={idx} className="flex gap-4 relative group">
                      {/* Visual Line connector */}
                      {idx < leader.experience.length - 1 && (
                        <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-zinc-350/30 dark:bg-zinc-700/50" />
                      )}

                      {/* Logo representation */}
                      <div className="w-12 h-12 rounded-lg bg-white/20 dark:bg-zinc-800/30 border border-white/20 dark:border-zinc-700/50 flex items-center justify-center shrink-0">
                        <Briefcase className="w-6 h-6 text-zinc-800 dark:text-zinc-350" />
                      </div>

                      {/* Experience Info */}
                      <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-zinc-950 dark:text-white text-base">
                          {exp.role}
                        </h4>
                        <p className="text-sm font-semibold text-zinc-850 dark:text-zinc-200">
                          {exp.company}
                        </p>
                        <p className="text-xs text-zinc-650 dark:text-zinc-400 font-medium">
                          {exp.duration}
                        </p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {exp.location}
                        </p>
                        <p className="text-sm text-zinc-800 dark:text-zinc-300 leading-relaxed mt-2.5">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Card */}
              <div className="bg-white/15 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xs backdrop-blur-xs">
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-4">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {leader.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-white/25 dark:bg-white/10 text-zinc-900 dark:text-zinc-200 text-xs px-3.5 py-2 rounded-full font-semibold border border-white/20 dark:border-zinc-700/40 hover:bg-white/35 dark:hover:bg-white/20 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  )
}
