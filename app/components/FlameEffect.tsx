'use client'

import Image from 'next/image'

/**
 * FlameEffect Component
 * 
 * Bottom-left decorative flame effect with:
 * - Responsive positioning
 * - Fade-in animation
 * - Optimized image loading
 */
export default function FlameEffect() {
  return (
    <div
      className="fixed z-40
                 flex items-center justify-center
                 bottom-[0.5rem] left-[0.5rem]
                 sm:bottom-[0.75rem] sm:left-[0.75rem]
                 md:bottom-[1rem] md:left-[1rem]
                 animate-fade-in-delay"
      aria-hidden="true"
    >
      <Image
        src="/images/fire-effect.png"
        alt="Flame effect decoration"
        width={96}
        height={96}
        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 object-contain"
        quality={100}
        priority={false}
      />
    </div>
  )
}
