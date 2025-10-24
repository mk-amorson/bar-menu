'use client'

import { useNavbar } from '@/lib/navbar-context'
import { useUser } from '@/lib/user-context'
import { useDishes } from '@/hooks/useDishes'
import Sidebar from '@/components/Sidebar'
import StatusDisplay from '@/components/StatusDisplay'
import SidebarAutoOpen from '@/components/SidebarAutoOpen'
import CategorySection from '@/components/CategorySection'

export default function Home() {
  const { navbarState } = useNavbar()
  const { user } = useUser()
  const { dishesByCategory, isLoading, error } = useDishes()

  return (
    <div className="h-full relative">
      <Sidebar />
      <StatusDisplay />
      <SidebarAutoOpen />

      {/* Основной контент */}
      <div className="h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vintage-green"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">Ошибка загрузки меню: {error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-vintage-green hover:bg-vintage-green/80 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Попробовать снова
              </button>
            </div>
          ) : Object.keys(dishesByCategory).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Меню пока пустое</p>
            </div>
          ) : (
            <div>
              {/* Отображаем категории в порядке: NEW, затем остальные */}
              {Object.keys(dishesByCategory)
                .sort((a, b) => {
                  if (a === 'NEW') return -1
                  if (b === 'NEW') return 1
                  return dishesByCategory[a].category?.sort_order - dishesByCategory[b].category?.sort_order
                })
                .map((categoryName) => (
                  <CategorySection
                    key={categoryName}
                    categoryName={categoryName}
                    category={dishesByCategory[categoryName].category}
                    dishes={dishesByCategory[categoryName].dishes}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
