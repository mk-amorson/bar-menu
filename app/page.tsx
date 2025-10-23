'use client'

import { useNavbar } from '@/lib/navbar-context'
import { useUser } from '@/lib/user-context'
import Sidebar from '@/components/Sidebar'
import StatusDisplay from '@/components/StatusDisplay'
import SidebarAutoOpen from '@/components/SidebarAutoOpen'

export default function Home() {
  const { navbarState } = useNavbar()
  const { user } = useUser()

  return (
    <div className="h-full relative">
      <Sidebar />
      <StatusDisplay />
      <SidebarAutoOpen />

      {/* Основной контент */}
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          {/* Контент главной страницы */}
          <h1 className="text-white text-2xl">Главная страница</h1>
          <p className="text-gray-400 mt-4">Нажмите на кнопку чата в боковом меню</p>
        </div>
      </div>
    </div>
  )
}
