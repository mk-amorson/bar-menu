'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type NavbarState = 'home' | 'sidebar' | 'chat'

interface NavbarContextType {
  navbarState: NavbarState
  setNavbarState: (state: NavbarState) => void
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined)

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [navbarState, setNavbarState] = useState<NavbarState>('home')

  return (
    <NavbarContext.Provider value={{ navbarState, setNavbarState }}>
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
