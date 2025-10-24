'use client'

import { useRouter } from 'next/navigation'
import { useNavbar } from '@/lib/navbar-context'

export default function Navbar() {
  const router = useRouter()
  const { navbarState, setNavbarState, isSidebarOpen, setIsSidebarOpen, isPageTransitioning, setIsPageTransitioning } = useNavbar()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const goToHome = () => {
    if (navbarState !== 'home') {
      // Используем точно такую же логику переходов, как в Sidebar
      setIsPageTransitioning(true)
      setNavbarState('home')
      
      // Ждем завершения fade-out (300ms) перед переходом
      setTimeout(() => {
        router.push('/')
        
        // Ждем немного для загрузки новой страницы, затем fade-in
        setTimeout(() => {
          setIsPageTransitioning(false)
        }, 100)
      }, 300)
    }
  }

  return (
    <nav className="bg-black shadow-sm z-50 flex-shrink-0">
      <div className="w-full h-16 flex justify-between items-center px-4 sm:px-6 lg:px-8">
        {/* Логотип слева - всегда у левого края */}
        <div className="flex items-center">
          <button 
            onClick={goToHome}
            className="hover:opacity-80 transition-opacity duration-200"
          >
            <img
              src="/tap_logo_website.jpg"
              alt="TAP22"
              className="h-10 w-10"
              style={{ width: '40px', height: '40px' }}
            />
          </button>
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
            {/* Editor */}
            <h2 className={`text-xl font-semibold text-white transition-all duration-300 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 ${navbarState === 'editor' ? 'opacity-100 delay-150' : 'opacity-0'}`}>
              Редактор
            </h2>
          </div>
        </div>
        
          {/* Анимированная кнопка справа - всегда у правого края */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="relative w-10 h-10 flex items-center justify-center transition-transform duration-300 hover:scale-105"
            >
              {/* Бургер-меню */}
              <div className={`absolute transition-all duration-500 ${!isSidebarOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`}>
                <div className="space-y-1">
                  <div className="w-6 h-0.5 bg-white transition-all duration-300"></div>
                  <div className="w-6 h-0.5 bg-white transition-all duration-300"></div>
                  <div className="w-6 h-0.5 bg-white transition-all duration-300"></div>
                </div>
              </div>

              {/* Крестик */}
              <div className={`absolute transition-all duration-500 ${isSidebarOpen ? 'opacity-100 -rotate-180' : 'opacity-0 rotate-0'}`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>
          </div>
      </div>
    </nav>
  )
}
