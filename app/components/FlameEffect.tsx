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
                 bottom-[0.25rem] left-[0.25rem]
                 xs:bottom-[0.375rem] xs:left-[0.375rem]
                 sm:bottom-[0.5rem] sm:left-[0.5rem]
                 md:bottom-[0.75rem] md:left-[0.75rem]
                 lg:bottom-[1rem] lg:left-[1rem]
                 animate-fade-in-delay"
      style={{
        paddingLeft: 'env(safe-area-inset-left, 0)',
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
      }}
      aria-hidden="true"
    >
      <Image
        src="/images/fire-effect.png"
        alt="Flame effect decoration"
        width={96}
        height={96}
        className="w-10 h-10 
                   xs:w-11 xs:h-11
                   sm:w-12 sm:h-12
                   md:w-14 md:h-14
                   lg:w-16 lg:h-16
                   xl:w-20 xl:h-20
                   2xl:w-24 2xl:h-24
                   object-contain"
        quality={100}
        priority={false}
      />
    </div>
  )
}
