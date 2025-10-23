'use client'

import { useNavbar } from '@/lib/navbar-context'
import { useEffect, useState } from 'react'

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const { isPageTransitioning } = useNavbar()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (isPageTransitioning) {
      // Fade out
      setIsVisible(false)
    } else {
      // Fade in
      setIsVisible(true)
    }
  }, [isPageTransitioning])

  return (
    <div 
      className={`w-full h-full transition-opacity duration-300 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  )
}
