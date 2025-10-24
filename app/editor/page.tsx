'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNavbar } from '@/lib/navbar-context'
import { useUser } from '@/lib/user-context'
import Sidebar from '@/components/Sidebar'
import CategoryManager from '@/components/editor/CategoryManager'

export default function EditorPage() {
  const { navbarState, setNavbarState } = useNavbar()
  const { user } = useUser()
  const router = useRouter()
  const [refreshKey, setRefreshKey] = useState(0)

  // Устанавливаем состояние навигации при загрузке редактора
  useEffect(() => {
    setNavbarState('editor')
  }, [setNavbarState])

  // Проверка авторизации и роли ADMIN
  useEffect(() => {
    if (!user) {
      // Если пользователь не авторизован, перенаправляем на главную
      router.push('/')
      return
    }
    
    if (user.role !== 'ADMIN') {
      // Если пользователь не ADMIN, перенаправляем на главную
      router.push('/')
      return
    }
  }, [user, router])

  // Если пользователь не авторизован или не ADMIN, показываем загрузку
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="h-full bg-vintage-black">
        <Sidebar />
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vintage-green mx-auto mb-4"></div>
            <p className="text-gray-400">Проверка доступа...</p>
          </div>
        </div>
      </div>
    )
  }

  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="h-full bg-vintage-black">
      <Sidebar />
      
      {/* Основной контент */}
      <div className="flex flex-col h-full bg-gradient-to-br from-vintage-black to-vintage-charcoal">
        <div className="flex-1 overflow-y-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-white text-2xl sm:text-3xl font-bold mb-2">Редактор меню</h1>
              <p className="text-gray-400 text-sm sm:text-base">Управление категориями и блюдами</p>
            </div>

            {/* Интерфейс редактора */}
            <div className="space-y-4 sm:space-y-6">
              <CategoryManager key={`categories-${refreshKey}`} onDataChange={handleDataChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
