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
  const isAudioReadyRef = useRef(false) // Track if audio is loaded and ready
  const playPendingRef = useRef(false) // Track if play is pending after user interaction

  // Initialize audio elements
  useEffect(() => {
    // Click sound - plays on button clicks
    clickSoundRef.current = new Audio('/sounds/click-sound.mp3')
    clickSoundRef.current.volume = 0.5
    clickSoundRef.current.preload = 'auto'
    clickSoundRef.current.load() // Force load on mobile

    // Sound effect - plays when sound is on
    soundEffectRef.current = new Audio('/sounds/sound-effect.mp3')
    soundEffectRef.current.loop = true
    soundEffectRef.current.volume = 0.3
    soundEffectRef.current.preload = 'auto'
    soundEffectRef.current.load() // Force load on mobile

    // Track when audio is ready
    const handleCanPlay = () => {
      isAudioReadyRef.current = true
      // If there's a pending play, try to play now
      if (playPendingRef.current && soundEffectRef.current && userInteractedRef.current) {
        soundEffectRef.current.play().catch(() => {
          playPendingRef.current = false
        })
      }
    }

    const handleLoadedData = () => {
      isAudioReadyRef.current = true
    }

    if (clickSoundRef.current) {
      clickSoundRef.current.addEventListener('canplaythrough', handleCanPlay, { once: true })
      clickSoundRef.current.addEventListener('loadeddata', handleLoadedData, { once: true })
    }

    if (soundEffectRef.current) {
      soundEffectRef.current.addEventListener('canplaythrough', handleCanPlay, { once: true })
      soundEffectRef.current.addEventListener('loadeddata', handleLoadedData, { once: true })
    }

    // Track user interaction to enable audio playback
    const handleUserInteraction = () => {
      userInteractedRef.current = true
      
      // Ensure audio is loaded on first interaction (mobile)
      if (clickSoundRef.current && clickSoundRef.current.readyState === 0) {
        clickSoundRef.current.load()
      }
      if (soundEffectRef.current && soundEffectRef.current.readyState === 0) {
        soundEffectRef.current.load()
      }
      
      // Try to play sound effect if it should be playing
      if (wasPlayingRef.current && soundEffectRef.current) {
        if (isAudioReadyRef.current && soundEffectRef.current.readyState >= 2) {
          soundEffectRef.current.play().catch(() => {})
        } else {
          // Audio not ready yet, mark as pending
          playPendingRef.current = true
        }
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
      // Ensure audio is ready on mobile
      if (clickSoundRef.current.readyState === 0) {
        clickSoundRef.current.load()
      }
      
      // Reset and play
      clickSoundRef.current.currentTime = 0
      
      // Wait for audio to be ready if needed
      if (clickSoundRef.current.readyState >= 2) {
        clickSoundRef.current.play().catch(() => {
          // Silently handle autoplay restrictions
        })
      } else {
        // Wait for audio to load
        const handleCanPlay = () => {
          if (clickSoundRef.current) {
            clickSoundRef.current.currentTime = 0
            clickSoundRef.current.play().catch(() => {})
          }
        }
        clickSoundRef.current.addEventListener('canplay', handleCanPlay, { once: true })
        clickSoundRef.current.load()
      }
    }
  }

  // Play sound effect (looping)
  const playSoundEffect = () => {
    if (soundEffectRef.current) {
      wasPlayingRef.current = true
      playPendingRef.current = true
      
      // Ensure audio is loaded on mobile
      if (soundEffectRef.current.readyState === 0) {
        soundEffectRef.current.load()
      }
      
      // If user has interacted, try to play
      if (userInteractedRef.current) {
        // Check if audio is ready
        if (soundEffectRef.current.readyState >= 3) {
          // Ready to play
          soundEffectRef.current.play().then(() => {
            playPendingRef.current = false
            isAudioReadyRef.current = true
          }).catch(() => {
            wasPlayingRef.current = false
            playPendingRef.current = false
          })
        } else if (soundEffectRef.current.readyState >= 2) {
          // Has some data, try to play
          soundEffectRef.current.play().then(() => {
            playPendingRef.current = false
            isAudioReadyRef.current = true
          }).catch(() => {
            wasPlayingRef.current = false
            playPendingRef.current = false
          })
        } else {
          // Wait for audio to load - use canplaythrough for better mobile support
          const handleCanPlay = () => {
            if (soundEffectRef.current && wasPlayingRef.current && userInteractedRef.current) {
              soundEffectRef.current.play().then(() => {
                playPendingRef.current = false
                isAudioReadyRef.current = true
              }).catch(() => {
                wasPlayingRef.current = false
                playPendingRef.current = false
              })
            }
          }
          soundEffectRef.current.addEventListener('canplaythrough', handleCanPlay, { once: true })
          // Force load if not already loading
          if (soundEffectRef.current.readyState === 0) {
            soundEffectRef.current.load()
          }
        }
      } else {
        // User hasn't interacted yet, mark as pending
        // It will start playing on first user interaction
      }
    }
  }

  // Stop sound effect
  const stopSoundEffect = () => {
    if (soundEffectRef.current) {
      wasPlayingRef.current = false
      playPendingRef.current = false
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
