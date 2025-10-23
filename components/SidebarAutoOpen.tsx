'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useNavbar } from '@/lib/navbar-context'

export default function SidebarAutoOpen() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setNavbarState } = useNavbar()

  useEffect(() => {
    if (searchParams.get('openSidebar') === 'true') {
      setNavbarState('sidebar')
      // Убираем параметр из URL
      router.replace('/', { scroll: false })
    }
  }, [searchParams, router, setNavbarState])

  return null
}
