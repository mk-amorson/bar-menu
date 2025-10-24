'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useNavbar } from '@/lib/navbar-context'
import { useUser } from '@/lib/user-context'
import ChatButton from '@/components/sidebar/ChatButton'
import MenuButton from '@/components/sidebar/MenuButton'
import EditorButton from '@/components/sidebar/EditorButton'
import TelegramWidget from '@/components/sidebar/TelegramWidget'
import UserProfile from '@/components/sidebar/UserProfile'

// Расширяем интерфейс Window для Telegram
declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void
  }
}

// Основной компонент Sidebar
export default function Sidebar() {
  const { navbarState, setNavbarState, isSidebarOpen, setIsSidebarOpen, isPageTransitioning, setIsPageTransitioning, sidebarContentState, setSidebarContentState } = useNavbar()
  const { user, setUser, setIsLoading, setError } = useUser()
  const router = useRouter()


  // Функция обработки авторизации Telegram
  const handleTelegramAuth = async (telegramUser: any) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(telegramUser),
      })

      const data = await response.json()

      if (response.ok) {
        // Сохраняем данные пользователя в localStorage
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('session', JSON.stringify(data.session))
        
        // Обновляем состояние
        setUser(data.user)
        
        // Принудительно удаляем виджет Telegram
        const widgetContainer = document.getElementById('telegram-widget-sidebar')
        if (widgetContainer) {
          widgetContainer.innerHTML = ''
        }
      } else {
        setError(data.error || 'Ошибка авторизации')
      }
    } catch (err) {
      setError('Произошла ошибка при авторизации')
      console.error('Auth error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('session')
    setUser(null)
  }

  // Единая функция для всех переходов между страницами
  const navigateToPage = (newState: 'home' | 'chat' | 'editor', newPath: string) => {
    // Одновременно запускаем все анимации: закрытие меню, fade-out контента и смену надписи
    setIsSidebarOpen(false)
    setIsPageTransitioning(true)
    setNavbarState(newState)
    
    // Ждем завершения fade-out контента (300ms) перед переходом
    setTimeout(() => {
      router.push(newPath)
      
      // Ждем немного для загрузки новой страницы, затем fade-in
      setTimeout(() => {
        setIsPageTransitioning(false)
      }, 100)
    }, 300)
  }

  const goToChat = () => {
    navigateToPage('chat', '/chat')
  }

  const goToMenu = () => {
    navigateToPage('home', '/')
  }

  const goToEditor = () => {
    navigateToPage('editor', '/editor')
  }

  // Обновляем содержимое бокового меню при изменении navbarState
  useEffect(() => {
    setSidebarContentState(navbarState)
  }, [navbarState, setSidebarContentState])

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.onTelegramAuth = handleTelegramAuth
      
      // Дополнительная проверка виджета каждые 2 секунды
      const interval = setInterval(() => {
        const container = document.getElementById('telegram-widget-sidebar')
        if (container) {
          const iframe = container.querySelector('iframe')
          if (iframe) {
            iframe.style.pointerEvents = 'auto'
            iframe.style.zIndex = '9999'
            iframe.style.position = 'relative'
            iframe.style.cursor = 'pointer'
          }
          
          const button = container.querySelector('a')
          if (button) {
            button.style.pointerEvents = 'auto'
            button.style.zIndex = '9999'
            button.style.position = 'relative'
            button.style.cursor = 'pointer'
          }
        }
      }, 2000)
      
      return () => clearInterval(interval)
    }
  }, [handleTelegramAuth])

  return (
    <>
      {/* CSS для исправления Telegram виджета */}
      <style jsx>{`
        #telegram-widget-sidebar iframe {
          pointer-events: auto !important;
          z-index: 9999 !important;
          position: relative !important;
          cursor: pointer !important;
        }
        #telegram-widget-sidebar a {
          pointer-events: auto !important;
          z-index: 9999 !important;
          position: relative !important;
          cursor: pointer !important;
        }
      `}</style>
      
      {/* Боковое меню */}
      <div className={`sidebar fixed top-16 right-0 bottom-0 w-80 bg-black shadow-xl z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ transform: isSidebarOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <div className="flex flex-col h-full">
          {/* Контент */}
          <div className="flex-1 p-6">
            <div className="space-y-4">
              {sidebarContentState === 'home' && (
                <>
                  <ChatButton onClick={goToChat} />
                  {/* Временно показываем всем для тестирования */}
                  <EditorButton onClick={goToEditor} />
                </>
              )}
              {sidebarContentState === 'chat' && (
                <>
                  <MenuButton onClick={goToMenu} />
                  {/* Временно показываем всем для тестирования */}
                  <EditorButton onClick={goToEditor} />
                </>
              )}
              {sidebarContentState === 'editor' && (
                <>
                  <MenuButton onClick={goToMenu} />
                  <ChatButton onClick={goToChat} />
                </>
              )}
            </div>
          </div>

          {/* Нижняя часть с виджетом или профилем */}
          <div className="p-6 border-t border-gray-700">
            <div className="flex justify-center">
              {user ? (
                <UserProfile user={user} onLogout={handleLogout} />
              ) : (
                <TelegramWidget 
                  botUsername={process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'tap22_combot'}
                  authUrl={typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}
                />
              )}
            </div>
          </div>
        </div>

        {/* Оверлей для закрытия бокового меню */}
        {isSidebarOpen && (
          <div
            className="fixed top-16 right-0 bottom-0 left-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </>
  )
}