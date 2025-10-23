'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/lib/supabase'

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Загружаем пользователя из localStorage при инициализации
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        } catch (e) {
          localStorage.removeItem('user')
          localStorage.removeItem('session')
        }
      }
    }
  }, [])

  const logout = () => {
    setUser(null)
    setError(null)
    localStorage.removeItem('user')
    localStorage.removeItem('session')
  }

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      isLoading, 
      setIsLoading, 
      error, 
      setError, 
      logout 
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
