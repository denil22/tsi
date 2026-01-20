'use client'

import { useState, useEffect, useRef } from 'react'

interface VideoBackgroundProps {
  onLoaded?: () => void
  videoSource?: string
}

export default function VideoBackground({ onLoaded, videoSource = '/images/Dark only.mp4' }: VideoBackgroundProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const wasPlayingRef = useRef(false)
  const previousSourceRef = useRef<string>(videoSource)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !videoRef.current) return

    const video = videoRef.current

    if (videoSource !== previousSourceRef.current) {
      previousSourceRef.current = videoSource
      setIsLoading(true)
      setHasError(false)
      video.src = videoSource
      video.load()
    }

    const handleCanPlay = () => {
      setIsLoading(false)
      onLoaded?.()
      if (video.paused) {
        video.play().catch(() => {
          setIsLoading(false)
          onLoaded?.()
        })
      }
    }

    const handleLoadedData = () => {
      setIsLoading(false)
      onLoaded?.()
    }

    const handlePlay = () => {
      setIsLoading(false)
      onLoaded?.()
    }

    const handleError = () => {
      setHasError(true)
      setIsLoading(false)
      onLoaded?.()
    }

    if (video.readyState >= 3) {
      handleCanPlay()
    }

    video.addEventListener('canplaythrough', handleCanPlay)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('play', handlePlay)
    video.addEventListener('error', handleError)

    const handleVisibilityChange = () => {
      if (video) {
        if (document.hidden) {
          wasPlayingRef.current = !video.paused
          video.pause()
        } else {
          if (wasPlayingRef.current && video.paused) {
            video.play().catch(() => {
              wasPlayingRef.current = false
            })
          }
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('error', handleError)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isMounted, onLoaded, videoSource])

  return (
    <div 
      className="fixed inset-0 w-full h-full z-0 overflow-hidden"
      style={{
        width: '100vw',
        height: '100vh',
        minWidth: '100vw',
        minHeight: '100vh',
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
          <div className="skeleton w-full h-full" />
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
          <p className="text-white text-xs xs:text-sm sm:text-base px-4 text-center">Failed to load background</p>
        </div>
      ) : isMounted ? (
        <video
          ref={videoRef}
          src={videoSource}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          onContextMenu={(e) => e.preventDefault()}
          className="object-cover"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            minWidth: '100vw',
            minHeight: '100vh',
            maxWidth: 'none',
            maxHeight: 'none',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0,
          }}
        />
      ) : (
        <div 
          className="w-full h-full object-cover"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            minWidth: '100vw',
            minHeight: '100vh',
            maxWidth: 'none',
            maxHeight: 'none',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0,
            backgroundColor: '#000',
          }}
        />
      )}
    </div>
  )
}
