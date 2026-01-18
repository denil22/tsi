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
  const userInteractedRef = useRef(false) // Track user interaction for autoplay

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

    // Track user interaction to enable audio playback
    const handleUserInteraction = () => {
      userInteractedRef.current = true
      // Try to play sound effect if it should be playing
      if (wasPlayingRef.current && soundEffectRef.current && soundEffectRef.current.paused) {
        soundEffectRef.current.play().catch(() => {})
      }
    }

    // Listen for user interactions (not once, so it works every time)
    const events = ['click', 'touchstart', 'keydown']
    events.forEach((event) => {
      document.addEventListener(event, handleUserInteraction)
    })

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
      events.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction)
      })
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
      
      // If user has interacted, play immediately
      if (userInteractedRef.current) {
        if (soundEffectRef.current.readyState >= 2) {
          soundEffectRef.current.play().catch(() => {
            wasPlayingRef.current = false
          })
        } else {
          // Wait for audio to load
          const handleCanPlay = () => {
            if (soundEffectRef.current && wasPlayingRef.current) {
              soundEffectRef.current.play().catch(() => {
                wasPlayingRef.current = false
              })
            }
          }
          soundEffectRef.current.addEventListener('canplay', handleCanPlay, { once: true })
        }
      } else {
        // User hasn't interacted yet, but mark as should play
        // It will start playing on first user interaction
      }
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
