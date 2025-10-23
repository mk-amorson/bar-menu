'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useNavbar } from '@/lib/navbar-context'
import { useUser } from '@/lib/user-context'
import Sidebar from '@/components/Sidebar'
import StatusDisplay from '@/components/StatusDisplay'
import SidebarAutoOpen from '@/components/SidebarAutoOpen'

export default function Home() {
  const { navbarState } = useNavbar()
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-vintage-black relative">
      <Sidebar />
      <StatusDisplay />
      <SidebarAutoOpen />

      {/* Основной контент */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            {/* Контент главной страницы */}
          </div>
        </div>
      </main>
    </div>
  )
}
