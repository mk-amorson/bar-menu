'use client'

import { useRouter } from 'next/navigation'
import { useNavbar } from '@/lib/navbar-context'

export default function Navbar() {
  const router = useRouter()
  const { navbarState, setNavbarState } = useNavbar()

  const toggleSidebar = () => {
    if (navbarState === 'home') {
      setNavbarState('sidebar')
    } else if (navbarState === 'sidebar') {
      setNavbarState('home')
    }
  }

  const goToChat = () => {
    setNavbarState('chat')
    router.push('/chat')
  }

  const goHome = () => {
    setNavbarState('home')
    router.push('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип слева */}
          <div className="flex items-center">
            <img
              src="/tap_logo_website.jpg"
              alt="TAP22"
              className="h-10 w-10"
              style={{ width: '40px', height: '40px' }}
            />
          </div>
          
          {/* Заголовок по центру с анимацией */}
          <div className="flex-1 flex justify-center items-center">
            <div className="relative h-6">
              {/* Community */}
              <h2 className={`text-xl font-semibold text-white transition-all duration-300 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 ${navbarState === 'sidebar' ? 'opacity-100 delay-150' : 'opacity-0'}`}>
                Community
              </h2>
              {/* Chat */}
              <h2 className={`text-xl font-semibold text-white transition-all duration-300 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 ${navbarState === 'chat' ? 'opacity-100 delay-150' : 'opacity-0'}`}>
                Chat
              </h2>
            </div>
          </div>
          
          {/* Анимированная кнопка справа */}
          <div className="flex items-center">
            <button
              onClick={navbarState === 'chat' ? goHome : toggleSidebar}
              className="relative w-10 h-10 flex items-center justify-center transition-transform duration-300 hover:scale-105"
            >
              {/* Бургер-меню */}
              <div className={`absolute transition-all duration-500 ${navbarState === 'home' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-180'}`}>
                <div className="space-y-1">
                  <div className="w-6 h-0.5 bg-white transition-all duration-300"></div>
                  <div className="w-6 h-0.5 bg-white transition-all duration-300"></div>
                  <div className="w-6 h-0.5 bg-white transition-all duration-300"></div>
                </div>
              </div>

              {/* Крестик */}
              <div className={`absolute transition-all duration-500 ${navbarState === 'sidebar' ? 'opacity-100 rotate-0' : navbarState === 'chat' ? 'opacity-100 rotate-180' : 'opacity-0 rotate-180'}`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
