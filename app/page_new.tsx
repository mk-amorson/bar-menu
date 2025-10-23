'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { User } from '@/lib/supabase'
import { useNavbar } from '@/lib/navbar-context'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { navbarState } = useNavbar()

  // Проверяем авторизацию при загрузке
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

  // Проверяем URL параметр для автоматического открытия sidebar
  useEffect(() => {
    if (searchParams.get('openSidebar') === 'true') {
      // Убираем параметр из URL
      router.replace('/', { scroll: false })
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Navbar />
      <Sidebar />

      {/* Основной контент */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            {isLoading && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
