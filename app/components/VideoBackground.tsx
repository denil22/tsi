'use client'

import { useState } from 'react'
import Image from 'next/image'

interface VideoBackgroundProps {
  isMuted: boolean
  onLoaded?: () => void
}

/**
 * GIF Background Component
 * 
 * Optimized full-screen GIF background with:
 * - Fast loading with priority
 * - Proper error handling
 * - Responsive scaling
 * - Automatic animation (GIF loops automatically)
 */
export default function VideoBackground({ isMuted, onLoaded }: VideoBackgroundProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    onLoaded?.()
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
  }

  return (
    <div 
      className="fixed inset-0 w-full h-full z-0 overflow-hidden"
      style={{
        width: '100vw',
        height: '100vh',
        maxWidth: '100%',
        maxHeight: '100%',
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
      ) : (
        <Image
          src="/images/background.gif"
          alt="Background animation"
          fill
          className="object-cover"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0,
            maxWidth: '100vw',
            maxHeight: '100vh',
          }}
          priority
          quality={100}
          unoptimized
          onLoad={handleLoad}
          onError={handleError}
          sizes="100vw"
        />
      )}
    </div>
  )
}
