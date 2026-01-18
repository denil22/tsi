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

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('videoMuted')
    if (savedState !== null) {
      const muted = savedState === 'true'
      setIsMuted(muted)
      onToggle(muted)
      // Play or stop sound effect based on saved state
      if (muted) {
        stopSoundEffect()
      } else {
        playSoundEffect()
      }
    } else {
      // Default to muted
      onToggle(true)
      stopSoundEffect()
    }
  }, [onToggle, playSoundEffect, stopSoundEffect])

  const handleToggle = () => {
    // Play click sound
    playClickSound()
    
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    localStorage.setItem('videoMuted', String(newMutedState))
    onToggle(newMutedState)
    
    // Play or stop sound effect based on new state
    if (newMutedState) {
      stopSoundEffect()
    } else {
      playSoundEffect()
    }
  }

  return (
    <button
      onClick={handleToggle}
      className="fixed z-50 
                 flex items-center justify-center 
                 bg-transparent border-none p-0
                 hover:opacity-80 active:opacity-70
                 transition-opacity duration-200
                 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2
                 animate-fade-in cursor-pointer
                 top-[0.5rem] left-[0.5rem]
                 sm:top-[0.75rem] sm:left-[0.75rem]
                 md:top-[1rem] md:left-[1rem]
                 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20"
      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      aria-pressed={isMuted}
    >
      <Image
        src={isMuted ? '/images/sound-off.png' : '/images/sound-on.png'}
        alt={isMuted ? 'Sound off icon' : 'Sound on icon'}
        width={64}
        height={64}
        className="w-full h-full object-contain"
        style={{ width: '90%', height: '90%' }}
        priority
        quality={100}
      />
    </button>
  )
}
