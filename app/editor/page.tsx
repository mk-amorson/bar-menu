'use client'

import { useEffect, useState } from 'react'
import { useNavbar } from '@/lib/navbar-context'
import { useUser } from '@/lib/user-context'
import Sidebar from '@/components/Sidebar'
import CategoryManager from '@/components/editor/CategoryManager'
import DishManager from '@/components/editor/DishManager'

export default function EditorPage() {
  const { navbarState, setNavbarState } = useNavbar()
  const { user } = useUser()
  const [refreshKey, setRefreshKey] = useState(0)

  // Устанавливаем состояние навигации при загрузке редактора
  useEffect(() => {
    setNavbarState('editor')
  }, [setNavbarState])

  // Временно убираем проверку авторизации для тестирования
  // if (user?.role !== 'ADMIN') {
  //   return (
  //     <div className="h-full bg-vintage-black">
  //       <Sidebar />
  //       <div className="h-full flex items-center justify-center">
  //         <div className="text-center">
  //           <h1 className="text-white text-2xl mb-4">Доступ запрещен</h1>
  //           <p className="text-gray-400">У вас нет прав для доступа к редактору</p>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1)
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

            {/* Интерфейс редактора */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryManager key={`categories-${refreshKey}`} onCategoryChange={handleDataChange} />
              <DishManager key={`dishes-${refreshKey}`} onDishChange={handleDataChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
