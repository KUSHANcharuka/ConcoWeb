"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface VideoLightboxProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
}

export function VideoLightbox({ isOpen, onClose, videoUrl }: VideoLightboxProps) {
  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  // Function to get the correct embeddable URL
  const getEmbedUrl = (url: string) => {
    try {
      // Handle YouTube links
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        let videoId = ""
        if (url.includes("youtube.com/watch")) {
          const params = new URLSearchParams(url.split("?")[1])
          videoId = params.get("v") || ""
        } else if (url.includes("youtu.be/")) {
          videoId = url.split("youtu.be/")[1]?.split("?")[0] || ""
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url
      }

      // Handle Google Drive file link
      if (url.includes("drive.google.com/file/d/")) {
        const fileId = url.split("/file/d/")[1]?.split("/")[0]
        return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url
      }

      // Handle Google Drive folder link
      if (url.includes("drive.google.com/drive/folders/")) {
        const folderId = url.split("/folders/")[1]?.split("?")[0]
        return folderId ? `https://drive.google.com/embeddedfolderview?id=${folderId}` : url
      }
    } catch (e) {
      console.error("Error formatting video embed URL:", e)
    }
    return url
  }

  const embedUrl = getEmbedUrl(videoUrl)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md">
          {/* Background Click Close */}
          <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-5xl aspect-video rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl z-10"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/85 transition-colors z-20 cursor-pointer"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video container */}
            <div className="w-full h-full">
              {videoUrl.endsWith(".mp4") ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              ) : embedUrl ? (
                <iframe
                  src={embedUrl}
                  title="Concolabs Demo Video"
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                  Invalid video link.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
