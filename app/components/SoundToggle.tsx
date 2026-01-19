'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSoundContext } from '../contexts/SoundContext'

interface SoundToggleProps {
  onToggle: (isMuted: boolean) => void
}

export default function SoundToggle({ onToggle }: SoundToggleProps) {
  const [isMuted, setIsMuted] = useState(true)
  const { playClickSound, playSoundEffect, stopSoundEffect } = useSoundContext()

  useEffect(() => {
    setIsMuted(true)
    onToggle(true)
    stopSoundEffect()
    localStorage.removeItem('videoMuted')
  }, [])

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    playClickSound()
    
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    localStorage.setItem('videoMuted', String(newMutedState))
    onToggle(newMutedState)
    
    if (newMutedState) {
      stopSoundEffect()
    } else {
      setTimeout(() => {
        playSoundEffect()
      }, 150)
    }
  }

  return (
    <button
      onClick={handleToggle}
      onTouchEnd={(e) => {
        e.stopPropagation()
        const touch = e.changedTouches[0]
        const target = e.target as HTMLElement
        const rect = target.getBoundingClientRect()
        const touchX = touch.clientX
        const touchY = touch.clientY
        
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
      className="fixed z-50 flex items-center justify-center bg-transparent border-none p-0 hover:opacity-80 active:opacity-70 transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 animate-fade-in cursor-pointer touch-manipulation select-none top-[0.25rem] left-[0.25rem] xs:top-[0.375rem] xs:left-[0.375rem] sm:top-[0.5rem] sm:left-[0.5rem] md:top-[0.75rem] md:left-[0.75rem] lg:top-[1rem] lg:left-[1rem] w-11 h-11 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16"
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
