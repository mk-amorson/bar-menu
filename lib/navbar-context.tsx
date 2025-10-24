'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type NavbarState = 'home' | 'sidebar' | 'chat' | 'editor'

interface NavbarContextType {
  navbarState: NavbarState
  setNavbarState: (state: NavbarState) => void
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
  isPageTransitioning: boolean
  setIsPageTransitioning: (transitioning: boolean) => void
  sidebarContentState: NavbarState
  setSidebarContentState: (state: NavbarState) => void
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined)

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [navbarState, setNavbarState] = useState<NavbarState>('home')
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [isPageTransitioning, setIsPageTransitioning] = useState<boolean>(false)
  const [sidebarContentState, setSidebarContentState] = useState<NavbarState>('home')

  return (
    <NavbarContext.Provider value={{ navbarState, setNavbarState, isSidebarOpen, setIsSidebarOpen, isPageTransitioning, setIsPageTransitioning, sidebarContentState, setSidebarContentState }}>
      {children}
    </NavbarContext.Provider>
  )
}

export function useNavbar() {
  const context = useContext(NavbarContext)
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider')
  }
  return context
}
