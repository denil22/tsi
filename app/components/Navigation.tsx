'use client'

import Image from 'next/image'
import { useSoundContext } from '../contexts/SoundContext'

export default function Navigation() {
  const { playClickSound } = useSoundContext()

  const handleApplicationClick = () => {
    playClickSound()
    window.open('https://velcor3.typeform.com/Velist', '_blank', 'noopener,noreferrer')
  }

  const handleTwitterClick = () => {
    playClickSound()
    window.open('https://x.com/V3LCOR3', '_blank', 'noopener,noreferrer')
  }

  const handleDiscordClick = () => {
    playClickSound()
  }

  return (
    <nav
      className="fixed z-50 flex items-center flex-wrap top-[0.25rem] right-[0.25rem] xs:top-[0.375rem] xs:right-[0.375rem] sm:top-[0.5rem] sm:right-[0.5rem] md:top-[0.75rem] md:right-[0.75rem] lg:top-[1rem] lg:right-[1rem] gap-[0.25rem] xs:gap-[0.3rem] sm:gap-[0.375rem] md:gap-[0.5rem] lg:gap-[0.625rem] xl:gap-[0.75rem] animate-fade-in-delay"
      style={{
        maxWidth: 'calc(100vw - 0.5rem)',
        paddingRight: 'env(safe-area-inset-right, 0)',
        paddingTop: 'env(safe-area-inset-top, 0)',
      }}
      aria-label="Main navigation"
    >
      <button
        onClick={handleApplicationClick}
        className="flex items-center justify-center bg-transparent border-none p-0 hover:opacity-80 active:opacity-70 transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 cursor-pointer touch-manipulation flex-shrink-0 h-12 xs:h-11 sm:h-11 md:h-12 lg:h-14 xl:h-14 2xl:h-16"
        style={{ 
          minWidth: '2.5rem', 
          minHeight: '2.5rem',
        }}
        aria-label="Open application"
      >
        <Image
          src="/images/application-btn.png"
          alt="Application button"
          width={300}
          height={99}
          className="h-full w-auto object-contain"
          priority
        />
      </button>

      <button
        onClick={handleTwitterClick}
        className="flex items-center justify-center bg-transparent border-none p-0 hover:opacity-80 active:opacity-70 transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 cursor-pointer touch-manipulation flex-shrink-0 h-11 w-11 xs:h-11 xs:w-11 sm:h-12 sm:w-12 md:h-12 md:w-12 lg:h-14 lg:w-14 xl:h-14 xl:w-14 2xl:h-16 2xl:w-16"
        aria-label="Visit V3LCOR3 on X"
      >
        <Image
          src="/images/x-icon.png"
          alt="Twitter/X icon"
          width={99}
          height={99}
          className="object-contain"
          style={{ width: '70%', height: '70%' }}
        />
      </button>

      <button
        onClick={handleDiscordClick}
        className="flex items-center justify-center bg-transparent border-none p-0 hover:opacity-80 active:opacity-70 transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 cursor-pointer touch-manipulation flex-shrink-0 h-11 w-11 xs:h-11 xs:w-11 sm:h-12 sm:w-12 md:h-12 md:w-12 lg:h-14 lg:w-14 xl:h-14 xl:w-14 2xl:h-16 2xl:w-16"
        aria-label="Join our Discord"
      >
        <Image
          src="/images/discord-icon.png"
          alt="Discord icon"
          width={99}
          height={99}
          className="object-contain"
          style={{ width: '90%', height: '90%' }}
        />
      </button>
    </nav>
  )
}
