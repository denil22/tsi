'use client'

import { createContext, useContext, useRef, useEffect, ReactNode } from 'react'

interface SoundContextType {
  playClickSound: () => void
  playSoundEffect: () => void
  stopSoundEffect: () => void
  playBushSound: () => void
}

const defaultContextValue: SoundContextType = {
  playClickSound: () => {},
  playSoundEffect: () => {},
  stopSoundEffect: () => {},
  playBushSound: () => {},
}

const SoundContext = createContext<SoundContextType>(defaultContextValue)

interface SoundProviderProps {
  children: ReactNode
}

export function SoundProvider({ children }: SoundProviderProps) {
  const clickSoundRef = useRef<HTMLAudioElement | null>(null)
  const soundEffectRef = useRef<HTMLAudioElement | null>(null)
  const bushSoundRef = useRef<HTMLAudioElement | null>(null)
  const wasPlayingRef = useRef(false)
  const userInteractedRef = useRef(false)
  const isAudioReadyRef = useRef(false)
  const playPendingRef = useRef(false)

  useEffect(() => {
    clickSoundRef.current = new Audio('/sounds/click-sound.mp3')
    clickSoundRef.current.volume = 0.5
    clickSoundRef.current.preload = 'auto'
    clickSoundRef.current.load()

    soundEffectRef.current = new Audio('/sounds/sound-effect.mp3')
    soundEffectRef.current.loop = true
    soundEffectRef.current.volume = 0.3
    soundEffectRef.current.preload = 'auto'
    soundEffectRef.current.load()

    bushSoundRef.current = new Audio('/sounds/bushsound.mp3')
    bushSoundRef.current.volume = 0.5
    bushSoundRef.current.preload = 'auto'
    bushSoundRef.current.load()

    const handleCanPlay = () => {
      isAudioReadyRef.current = true
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

    const handleUserInteraction = () => {
      userInteractedRef.current = true

      if (clickSoundRef.current && clickSoundRef.current.readyState === 0) {
        clickSoundRef.current.load()
      }
      if (soundEffectRef.current && soundEffectRef.current.readyState === 0) {
        soundEffectRef.current.load()
      }
      if (bushSoundRef.current && bushSoundRef.current.readyState === 0) {
        bushSoundRef.current.load()
      }

      if (wasPlayingRef.current && soundEffectRef.current) {
        if (isAudioReadyRef.current && soundEffectRef.current.readyState >= 2) {
          soundEffectRef.current.play().catch(() => {})
        } else {
          playPendingRef.current = true
        }
      }
    }

    const events = ['click', 'touchstart', 'keydown']
    events.forEach((event) => {
      document.addEventListener(event, handleUserInteraction)
    })

    const handleVisibilityChange = () => {
      if (soundEffectRef.current) {
        if (document.hidden) {
          wasPlayingRef.current = !soundEffectRef.current.paused
          soundEffectRef.current.pause()
        } else {
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
      if (bushSoundRef.current) {
        bushSoundRef.current.pause()
        bushSoundRef.current = null
      }
    }
  }, [])

  const playClickSound = () => {
    if (clickSoundRef.current) {
      if (clickSoundRef.current.readyState === 0) {
        clickSoundRef.current.load()
      }

      clickSoundRef.current.currentTime = 0

      if (clickSoundRef.current.readyState >= 2) {
        clickSoundRef.current.play().catch(() => {})
      } else {
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

  const playSoundEffect = () => {
    if (soundEffectRef.current) {
      wasPlayingRef.current = true
      playPendingRef.current = true

      if (soundEffectRef.current.readyState === 0) {
        soundEffectRef.current.load()
      }

      if (userInteractedRef.current) {
        if (soundEffectRef.current.readyState >= 3) {
          soundEffectRef.current.play().then(() => {
            playPendingRef.current = false
            isAudioReadyRef.current = true
          }).catch(() => {
            wasPlayingRef.current = false
            playPendingRef.current = false
          })
        } else if (soundEffectRef.current.readyState >= 2) {
          soundEffectRef.current.play().then(() => {
            playPendingRef.current = false
            isAudioReadyRef.current = true
          }).catch(() => {
            wasPlayingRef.current = false
            playPendingRef.current = false
          })
        } else {
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
          if (soundEffectRef.current.readyState === 0) {
            soundEffectRef.current.load()
          }
        }
      }
    }
  }

  const stopSoundEffect = () => {
    if (soundEffectRef.current) {
      wasPlayingRef.current = false
      playPendingRef.current = false
      soundEffectRef.current.pause()
      soundEffectRef.current.currentTime = 0
    }
  }

  const playBushSound = () => {
    if (bushSoundRef.current) {
      if (bushSoundRef.current.readyState === 0) {
        bushSoundRef.current.load()
      }

      bushSoundRef.current.currentTime = 0

      if (bushSoundRef.current.readyState >= 2) {
        bushSoundRef.current.play().catch(() => {})
      } else {
        const handleCanPlay = () => {
          if (bushSoundRef.current) {
            bushSoundRef.current.currentTime = 0
            bushSoundRef.current.play().catch(() => {})
          }
        }
        bushSoundRef.current.addEventListener('canplay', handleCanPlay, { once: true })
        bushSoundRef.current.load()
      }
    }
  }

  const value: SoundContextType = {
    playClickSound,
    playSoundEffect,
    stopSoundEffect,
    playBushSound,
  }

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSoundContext() {
  return useContext(SoundContext)
}
