'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useSoundEffects } from '../hooks/useSoundEffects'

interface NavigationProps {
  onApplicationClick?: () => void
  onTwitterClick?: () => void
  onDiscordClick?: () => void
}

/**
 * Navigation Component
 * 
 * Top-right navigation with:
 * - Application button
 * - Twitter/X icon
 * - Discord icon
 * - Matches sound button size
 * - Responsive sizing
 * - Hover effects
 * - Accessibility features
 * - Click sound on button clicks
 */
export default function Navigation({
  onApplicationClick,
  onTwitterClick,
  onDiscordClick,
}: NavigationProps) {
  const [isHovered, setIsHovered] = useState<string | null>(null)
  const { playClickSound } = useSoundEffects()

  const handleApplicationClick = () => {
    // Play click sound
    playClickSound()
    // Add your application link/action here
    onApplicationClick?.()
    console.log('Application clicked')
  }

  const handleTwitterClick = () => {
    // Play click sound
    playClickSound()
    // Add your Twitter link here
    onTwitterClick?.()
    window.open('https://twitter.com', '_blank', 'noopener,noreferrer')
  }

  const handleDiscordClick = () => {
    // Play click sound
    playClickSound()
    // Add your Discord link here
    onDiscordClick?.()
    window.open('https://discord.com', '_blank', 'noopener,noreferrer')
  }

  return (
    <nav
      className="fixed z-50 
                 flex items-center flex-wrap
                 top-[0.25rem] right-[0.25rem]
                 xs:top-[0.375rem] xs:right-[0.375rem]
                 sm:top-[0.5rem] sm:right-[0.5rem]
                 md:top-[0.75rem] md:right-[0.75rem]
                 lg:top-[1rem] lg:right-[1rem]
                 gap-[0.25rem] 
                 xs:gap-[0.3rem]
                 sm:gap-[0.375rem]
                 md:gap-[0.5rem]
                 lg:gap-[0.625rem]
                 xl:gap-[0.75rem]
                 animate-fade-in-delay"
      style={{
        maxWidth: 'calc(100vw - 0.5rem)',
        paddingRight: 'env(safe-area-inset-right, 0)',
        paddingTop: 'env(safe-area-inset-top, 0)',
      }}
      aria-label="Main navigation"
    >
      {/* Application Button - Matches sound button height */}
      <button
        onClick={handleApplicationClick}
        onMouseEnter={() => setIsHovered('application')}
        onMouseLeave={() => setIsHovered(null)}
        className="flex items-center justify-center
                   bg-transparent border-none p-0
                   hover:opacity-80 active:opacity-70
                   transition-opacity duration-200
                   focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2
                   cursor-pointer touch-manipulation
                   flex-shrink-0
                   h-11 
                   xs:h-12
                   sm:h-12
                   md:h-14
                   lg:h-16
                   xl:h-18
                   2xl:h-20"
        style={{ 
          minWidth: '2.75rem', 
          minHeight: '2.75rem',
        }}
        aria-label="Open application"
      >
        <Image
          src="/images/application-btn.png"
          alt="Application button"
          width={300}
          height={99}
          className="h-full w-auto object-contain"
          style={{ height: '100%', width: 'auto' }}
          priority
          quality={100}
        />
      </button>

      {/* Twitter/X Icon - Matches sound button size (square) */}
      <button
        onClick={handleTwitterClick}
        onMouseEnter={() => setIsHovered('twitter')}
        onMouseLeave={() => setIsHovered(null)}
        className="flex items-center justify-center
                   bg-transparent border-none p-0
                   hover:opacity-80 active:opacity-70
                   transition-opacity duration-200
                   focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2
                   cursor-pointer touch-manipulation
                   flex-shrink-0
                   h-11 w-11
                   xs:h-12 xs:w-12
                   sm:h-12 sm:w-12
                   md:h-14 md:w-14
                   lg:h-16 lg:w-16
                   xl:h-18 xl:w-18
                   2xl:h-20 2xl:w-20"
        aria-label="Visit our Twitter"
      >
        <Image
          src="/images/x-icon.png"
          alt="Twitter/X icon"
          width={99}
          height={99}
          className="w-full h-full object-contain"
          style={{ width: '70%', height: '70%', objectFit: 'contain' }}
          quality={100}
        />
      </button>

      {/* Discord Icon - Matches sound button size (square) */}
      <button
        onClick={handleDiscordClick}
        onMouseEnter={() => setIsHovered('discord')}
        onMouseLeave={() => setIsHovered(null)}
        className="flex items-center justify-center
                   bg-transparent border-none p-0
                   hover:opacity-80 active:opacity-70
                   transition-opacity duration-200
                   focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2
                   cursor-pointer touch-manipulation
                   flex-shrink-0
                   h-11 w-11
                   xs:h-12 xs:w-12
                   sm:h-12 sm:w-12
                   md:h-14 md:w-14
                   lg:h-16 lg:w-16
                   xl:h-18 xl:w-18
                   2xl:h-20 2xl:w-20"
        aria-label="Join our Discord"
      >
        <Image
          src="/images/discord-icon.png"
          alt="Discord icon"
          width={99}
          height={99}
          className="w-full h-full object-contain"
          style={{ width: '90%', height: '90%', objectFit: 'contain' }}
          quality={100}
        />
      </button>
    </nav>
  )
}
