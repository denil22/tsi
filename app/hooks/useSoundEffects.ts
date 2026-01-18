'use client'

import { useRef, useEffect } from 'react'

/**
 * Hook to manage sound effects
 * - Click sound for button interactions
 * - Background sound effect that plays when sound is on
 */
export function useSoundEffects() {
  const clickSoundRef = useRef<HTMLAudioElement | null>(null)
  const soundEffectRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio elements
  useEffect(() => {
    // Click sound - plays on button clicks
    clickSoundRef.current = new Audio('/sounds/click-sound.mp3')
    clickSoundRef.current.volume = 0.5
    clickSoundRef.current.preload = 'auto'

    // Sound effect - plays when sound is on
    soundEffectRef.current = new Audio('/sounds/sound-effect.mp3')
    soundEffectRef.current.loop = true
    soundEffectRef.current.volume = 0.3
    soundEffectRef.current.preload = 'auto'

    // Handle page visibility - pause sound effect when tab is hidden
    const handleVisibilityChange = () => {
      if (soundEffectRef.current) {
        if (document.hidden) {
          soundEffectRef.current.pause()
        } else if (!soundEffectRef.current.paused) {
          // Resume if it was playing before
          soundEffectRef.current.play().catch(() => {})
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      // Cleanup
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (clickSoundRef.current) {
        clickSoundRef.current.pause()
        clickSoundRef.current = null
      }
      if (soundEffectRef.current) {
        soundEffectRef.current.pause()
        soundEffectRef.current = null
      }
    }
  }, [])

  // Play click sound
  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0
      clickSoundRef.current.play().catch(() => {
        // Silently handle autoplay restrictions
      })
    }
  }

  // Play sound effect (looping)
  const playSoundEffect = () => {
    if (soundEffectRef.current) {
      soundEffectRef.current.play().catch(() => {
        // Silently handle autoplay restrictions
      })
    }
  }

  // Stop sound effect
  const stopSoundEffect = () => {
    if (soundEffectRef.current) {
      soundEffectRef.current.pause()
      soundEffectRef.current.currentTime = 0
    }
  }

  return {
    playClickSound,
    playSoundEffect,
    stopSoundEffect,
  }
}
