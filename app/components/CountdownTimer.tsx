'use client'

import { useEffect, useState } from 'react'

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const calculateTimeLeft = () => {
      const now = new Date()
      const targetDate = new Date(now.getFullYear(), 0, 31, 23, 59, 59, 999)
      
      if (targetDate < now) {
        targetDate.setFullYear(targetDate.getFullYear() + 1)
      }

      const difference = targetDate.getTime() - now.getTime()

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [isMounted])

  if (!isMounted) {
    return null
  }

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return null
  }

  const containerClasses = 'fixed z-40 flex flex-col items-end justify-end bottom-[0.25rem] right-[0.25rem] xs:bottom-[0.375rem] xs:right-[0.375rem] sm:bottom-[0.5rem] sm:right-[0.5rem] md:bottom-[0.75rem] md:right-[0.75rem] lg:bottom-[1rem] lg:right-[1rem] select-none'

  const containerStyles: React.CSSProperties = {
    paddingRight: 'env(safe-area-inset-right, 0)',
    paddingBottom: 'env(safe-area-inset-bottom, 0)',
  }

  const textClasses = 'text-white font-medium text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
  
  const textStyles: React.CSSProperties = {
    fontFamily: "'Sukajan Brush', cursive",
  }

  return (
    <div className={containerClasses} style={containerStyles}>
      <div className="flex flex-col items-end gap-0.5 xs:gap-1">
        <div className={textClasses} style={textStyles}>
          {timeLeft.days > 0 && (
            <span>
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
          )}
          {timeLeft.days === 0 && timeLeft.hours > 0 && (
            <span>
              {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
          )}
          {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes > 0 && (
            <span>
              {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
          )}
          {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && (
            <span>
              {timeLeft.seconds}s
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
