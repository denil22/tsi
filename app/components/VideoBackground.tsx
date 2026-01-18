'use client'

import { useEffect, useRef, useState } from 'react'

interface VideoBackgroundProps {
  isMuted: boolean
  onLoaded?: () => void
}

/**
 * VideoBackground Component
 * 
 * Optimized full-screen video background with:
 * - Immediate autoplay for muted videos
 * - Cache handling for page refreshes
 * - Proper error handling
 */
export default function VideoBackground({ isMuted, onLoaded }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const playAttemptedRef = useRef(false)
  const userInteractedRef = useRef(false)
  const hasLoadedRef = useRef(false)

  // Initialize video on mount - simple continuous play
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Reset state
    setIsLoading(true)
    setHasError(false)
    hasLoadedRef.current = false

    // Set muted state
    video.muted = isMuted

    // Simple play function - just play continuously
    const playVideo = async () => {
      if (!video) return
      try {
        if (video.paused) {
          await video.play()
        }
      } catch (error) {
        // Silently handle - will retry
      }
    }

    // Handle video ready events
    const handleReady = () => {
      if (!hasLoadedRef.current) {
        hasLoadedRef.current = true
        setIsLoading(false)
        onLoaded?.()
      }
      playVideo()
    }

    const handleError = () => {
      setHasError(true)
      setIsLoading(false)
    }

    // Add event listeners
    video.addEventListener('loadedmetadata', handleReady)
    video.addEventListener('canplay', handleReady)
    video.addEventListener('loadeddata', handleReady)
    video.addEventListener('error', handleError)

    // If video is already cached and ready, play immediately
    if (video.readyState >= 2) {
      handleReady()
    } else {
      // Force load if not ready
      video.load()
    }

    // Also try playing after a short delay
    const timeoutId = setTimeout(() => {
      if (video && video.paused) {
        playVideo()
      }
    }, 300)

    return () => {
      clearTimeout(timeoutId)
      video.removeEventListener('loadedmetadata', handleReady)
      video.removeEventListener('canplay', handleReady)
      video.removeEventListener('loadeddata', handleReady)
      video.removeEventListener('error', handleError)
    }
  }, [isMuted, onLoaded])

  // Track user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      userInteractedRef.current = true
    }

    const events = ['click', 'touchstart', 'keydown']
    events.forEach((event) => {
      document.addEventListener(event, handleUserInteraction, { once: true })
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction)
      })
    }
  }, [])

  // Update muted state when it changes
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Handle unmuting - requires user interaction
    if (!isMuted && video.muted) {
      // User is trying to unmute - only allow if user has interacted
      if (userInteractedRef.current) {
        try {
          video.muted = false
          // Ensure video continues playing
          if (video.paused) {
            video.play().catch((error) => {
              // If unmuting fails, revert to muted
              if (error instanceof Error) {
                video.muted = true
              }
            })
          }
        } catch (error) {
          // If setting muted fails, keep it muted
          video.muted = true
        }
      }
    } else if (isMuted && !video.muted) {
      // User is muting - this always works
      video.muted = true
      // Ensure video continues playing
      if (video.paused) {
        video.play().catch(() => {})
      }
    }
  }, [isMuted])


  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
          <div className="skeleton w-full h-full" />
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
          <p className="text-white">Failed to load video</p>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            width: '100%',
            height: '100%',
            minWidth: '100%',
            minHeight: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          }}
          playsInline
          loop
          muted={isMuted}
          preload="auto"
          autoPlay
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          aria-label="Background video with autumn scene"
          onLoadedMetadata={(e) => {
            const video = e.currentTarget
            setIsLoading(false)
            onLoaded?.()
            if (video.muted && video.paused) {
              video.play().catch(() => {})
            }
          }}
          onCanPlay={(e) => {
            const video = e.currentTarget
            if (video.muted && video.paused) {
              video.play().catch(() => {})
            }
          }}
          onLoadedData={(e) => {
            const video = e.currentTarget
            if (video.muted && video.paused) {
              video.play().catch(() => {})
            }
          }}
          onPlay={() => {
            setIsLoading(false)
            onLoaded?.()
          }}
        >
          <source src="/videos/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  )
}
