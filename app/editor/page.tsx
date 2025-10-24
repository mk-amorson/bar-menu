'use client'

import { useEffect } from 'react'
import { useNavbar } from '@/lib/navbar-context'
import { useUser } from '@/lib/user-context'
import Sidebar from '@/components/Sidebar'

export default function EditorPage() {
  const { navbarState, setNavbarState } = useNavbar()
  const { user } = useUser()

  // Устанавливаем состояние навигации при загрузке редактора
  useEffect(() => {
    setNavbarState('editor')
  }, [setNavbarState])

  // Проверяем права доступа
  if (user?.role !== 'ADMIN') {
    return (
      <div className="h-full bg-vintage-black">
        <Sidebar />
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-white text-2xl mb-4">Доступ запрещен</h1>
            <p className="text-gray-400">У вас нет прав для доступа к редактору</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-vintage-black">
      <Sidebar />
      
      {/* Основной контент */}
      <div className="flex flex-col h-full bg-gradient-to-br from-vintage-black to-vintage-charcoal">
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-white text-3xl font-bold mb-2">Редактор меню</h1>
              <p className="text-gray-400">Управление категориями и блюдами</p>
            </div>

            {/* Здесь будет интерфейс редактора */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-vintage-dark-gray rounded-2xl p-6">
                <h2 className="text-white text-xl font-bold mb-4">Категории</h2>
                <p className="text-gray-400">Управление категориями блюд</p>
              </div>
              
              <div className="bg-vintage-dark-gray rounded-2xl p-6">
                <h2 className="text-white text-xl font-bold mb-4">Блюда</h2>
                <p className="text-gray-400">Управление блюдами</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
