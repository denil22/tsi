'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSoundEffects } from '../hooks/useSoundEffects'

interface SoundToggleProps {
  onToggle: (isMuted: boolean) => void
}

/**
 * SoundToggle Component
 * 
 * Toggle button for video audio with:
 * - State persistence using localStorage
 * - Accessible button with ARIA labels
 * - Smooth hover effects
 * - Touch-friendly sizing for mobile
 * - Click sound on button click
 * - Sound effect plays when sound is on, stops when muted
 */
export default function SoundToggle({ onToggle }: SoundToggleProps) {
  const [isMuted, setIsMuted] = useState(true) // Default to muted
  const { playClickSound, playSoundEffect, stopSoundEffect } = useSoundEffects()

  // Always start muted on mount - ignore localStorage for initial state
  useEffect(() => {
    // Always default to muted state on page load
    setIsMuted(true)
    onToggle(true)
    stopSoundEffect()
    
    // Clear any saved state to ensure fresh start
    localStorage.removeItem('videoMuted')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run only once on mount - onToggle and stopSoundEffect are stable

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    // Prevent default and stop propagation for better mobile handling
    e.preventDefault()
    e.stopPropagation()
    
    // Play click sound first
    playClickSound()
    
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    localStorage.setItem('videoMuted', String(newMutedState))
    onToggle(newMutedState)
    
    // Play or stop sound effect based on new state
    // Since user clicked, we can play sound effect immediately
    if (newMutedState) {
      stopSoundEffect()
    } else {
      // User clicked to turn sound on - play sound effect
      // On mobile, audio needs time to be ready after page load
      // Use longer delay to ensure audio is loaded and user interaction is registered
      setTimeout(() => {
        playSoundEffect()
      }, 150)
    }
  }

  return (
    <button
      onClick={handleToggle}
      onTouchEnd={(e) => {
        // Handle touch events explicitly for mobile - prevent double firing
        e.stopPropagation()
        const touch = e.changedTouches[0]
        const target = e.target as HTMLElement
        const rect = target.getBoundingClientRect()
        const touchX = touch.clientX
        const touchY = touch.clientY
        
        // Only fire if touch is within button bounds
        if (
          touchX >= rect.left &&
          touchX <= rect.right &&
          touchY >= rect.top &&
          touchY <= rect.bottom
        ) {
          e.preventDefault()
          handleToggle(e)
        }
      }}
      className="fixed z-50 
                 flex items-center justify-center 
                 bg-transparent border-none p-0
                 hover:opacity-80 active:opacity-70
                 transition-opacity duration-200
                 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2
                 animate-fade-in cursor-pointer
                 touch-manipulation
                 select-none
                 top-[0.25rem] left-[0.25rem]
                 xs:top-[0.375rem] xs:left-[0.375rem]
                 sm:top-[0.5rem] sm:left-[0.5rem]
                 md:top-[0.75rem] md:left-[0.75rem]
                 lg:top-[1rem] lg:left-[1rem]
                 w-11 h-11 
                 xs:w-12 xs:h-12
                 sm:w-12 sm:h-12
                 md:w-14 md:h-14
                 lg:w-16 lg:h-16
                 xl:w-18 xl:h-18
                 2xl:w-20 2xl:h-20"
      style={{
        paddingLeft: 'env(safe-area-inset-left, 0)',
        paddingTop: 'env(safe-area-inset-top, 0)',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
      }}
      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      aria-pressed={isMuted}
      type="button"
    >
      <Image
        src={isMuted ? '/images/sound-off.png' : '/images/sound-on.png'}
        alt={isMuted ? 'Sound off icon' : 'Sound on icon'}
        width={64}
        height={64}
        className="object-contain"
        style={{ width: '90%', height: '90%' }}
        priority
      />
    </button>
  )
}
