'use client'

import { Component, ErrorInfo, ReactNode, useState } from 'react'
import FlameEffect from './components/FlameEffect'
import Navigation from './components/Navigation'
import SoundToggle from './components/SoundToggle'
import VideoBackground from './components/VideoBackground'
import { SoundProvider } from './contexts/SoundContext'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="text-center text-white">
            <h1 className="text-2xl mb-4">Something went wrong</h1>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default function Home() {
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false)
  const [isWhiteFlame, setIsWhiteFlame] = useState(false)

  const handleBackgroundLoaded = () => {
    setIsBackgroundLoaded(true)
  }

  const handleVideoChange = (isWhite: boolean) => {
    setIsWhiteFlame(isWhite)
  }

  const videoSource = isWhiteFlame 
    ? '/images/Light only .webm'
    : '/images/Dark only.webm'

  return (
    <ErrorBoundary>
      <SoundProvider>
        <main 
          className="relative w-full h-screen min-h-screen overflow-hidden" 
          style={{ 
            width: '100vw', 
            height: '100vh', 
            minHeight: '100vh',
            maxWidth: '100%',
            overflowX: 'hidden',
            position: 'relative',
          }}
        >
          <VideoBackground onLoaded={handleBackgroundLoaded} videoSource={videoSource} />

          {!isBackgroundLoaded && (
            <div className="fixed inset-0 bg-black z-30 flex items-center justify-center">
              <div className="text-white text-center px-4">
                <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3 xs:mb-4" />
                <p className="text-xs xs:text-sm sm:text-base md:text-lg">Loading...</p>
              </div>
            </div>
          )}

          <SoundToggle onToggle={() => {}} />

          <Navigation />

          <FlameEffect onVideoChange={handleVideoChange} />

        </main>
      </SoundProvider>
    </ErrorBoundary>
  )
}
