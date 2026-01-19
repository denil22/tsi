'use client'

import { useEffect, useRef, useState } from 'react'
import { useSoundContext } from '../contexts/SoundContext'

export default function FlameEffect() {
  const [isWhite, setIsWhite] = useState(false)
  const [imageKey, setImageKey] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const { playBushSound } = useSoundContext()
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWhite(prev => !prev)
    setImageKey(prev => prev + 1)
    try {
      playBushSound()
    } catch (error) {
    }
  }
  
  useEffect(() => {
    if (isMounted && imgRef.current) {
      const newSrc = isWhite 
        ? `/images/${encodeURIComponent('fire white.png')}?k=${imageKey}` 
        : `/images/fire-effect.png?k=${imageKey}`
      
      const currentSrcPath = imgRef.current.src.split('?')[0]
      const newSrcPath = newSrc.split('?')[0]
      
      if (currentSrcPath !== newSrcPath || !imgRef.current.src.includes(`k=${imageKey}`)) {
        imgRef.current.src = newSrc
      }
    }
  }, [isWhite, imageKey, isMounted])

  const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    handleClick(e)
  }

  const buttonClasses = 'fixed z-50 flex items-center justify-center bg-transparent border-none p-0 hover:opacity-80 active:opacity-70 transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 cursor-pointer touch-manipulation bottom-[0.25rem] left-[0.25rem] xs:bottom-[0.375rem] xs:left-[0.375rem] sm:bottom-[0.5rem] sm:left-[0.5rem] md:bottom-[0.75rem] md:left-[0.75rem] lg:bottom-[1rem] lg:left-[1rem] select-none scale-100'

  const buttonStyles: React.CSSProperties = {
    paddingLeft: 'env(safe-area-inset-left, 0)',
    paddingBottom: 'env(safe-area-inset-bottom, 0)',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
    pointerEvents: 'auto',
  }

  const imageClasses = 'w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-[58px] lg:h-[58px] xl:w-18 xl:h-18 2xl:w-[86px] 2xl:h-[86px] object-contain'

  const imageSrc = isWhite 
    ? `/images/${encodeURIComponent('fire white.png')}?k=${imageKey}` 
    : `/images/fire-effect.png?k=${imageKey}`
  return (
    <button
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
      className={buttonClasses}
      style={buttonStyles}
      aria-label={isWhite ? 'Switch to regular flame' : 'Switch to white flame'}
      type="button"
      suppressHydrationWarning
    >
      <img
        ref={imgRef}
        src={imageSrc}
        alt={isWhite ? 'White flame effect' : 'Flame effect decoration'}
        width={96}
        height={96}
        className={imageClasses}
        key={`flame-${isWhite ? 'white' : 'regular'}-${imageKey}`}
        draggable="false"
        suppressHydrationWarning
        style={{
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
        }}
      />
    </button>
  )
}
