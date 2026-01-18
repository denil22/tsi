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
  const wasPlayingRef = useRef(false) // Track if sound effect was playing before tab switch

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
          // Remember if it was playing
          wasPlayingRef.current = !soundEffectRef.current.paused
          soundEffectRef.current.pause()
        } else {
          // Resume if it was playing before tab switch
          if (wasPlayingRef.current) {
            soundEffectRef.current.play().catch(() => {
              wasPlayingRef.current = false
            })
          }
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
      wasPlayingRef.current = true
      soundEffectRef.current.play().catch(() => {
        wasPlayingRef.current = false
        // Silently handle autoplay restrictions
      })
    }
  }

  // Stop sound effect
  const stopSoundEffect = () => {
    if (soundEffectRef.current) {
      wasPlayingRef.current = false
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
