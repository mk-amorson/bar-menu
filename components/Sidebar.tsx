'use client'

import { useState, useEffect } from 'react'
import { useNavbar } from '@/lib/navbar-context'
import { useUser } from '@/lib/user-context'

// Расширяем интерфейс Window для Telegram
declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void
  }
}

// Компонент кнопки чата
function ChatButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
      className="w-full text-left p-4 bg-vintage-dark-gray hover:bg-vintage-medium-gray rounded-xl transition-all duration-300 flex items-center space-x-3 group cursor-pointer"
      style={{ 
        pointerEvents: 'auto',
        zIndex: 9999,
        position: 'relative'
      }}
    >
      <div className="p-2 rounded-lg group-hover:transition-colors duration-300">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <div className="flex-1">
        <span className="text-white font-medium text-lg">Общий чат</span>
      </div>
      <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )
}

// Компонент Telegram виджета
function TelegramWidget({ botUsername, authUrl }: { botUsername: string, authUrl: string }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      const container = document.getElementById('telegram-widget-sidebar')
      if (container) {
        container.innerHTML = '' // Очищаем контейнер

        // Создаем script элемент
        const script = document.createElement('script')
        script.src = 'https://telegram.org/js/telegram-widget.js?22'
        script.setAttribute('data-telegram-login', botUsername)
        script.setAttribute('data-size', 'large')
        script.setAttribute('data-userpic', 'false')
        script.setAttribute('data-onauth', 'onTelegramAuth(user)')
        script.setAttribute('data-request-access', 'write')
        script.async = true

        container.appendChild(script)

        script.onload = () => {
          // Принудительно делаем виджет кликабельным
          setTimeout(() => {
            const iframe = container.querySelector('iframe')
            if (iframe) {
              iframe.style.pointerEvents = 'auto'
              iframe.style.zIndex = '9999'
              iframe.style.position = 'relative'
            }
            
            // Также проверяем кнопку внутри iframe
            const button = container.querySelector('a')
            if (button) {
              button.style.pointerEvents = 'auto'
              button.style.zIndex = '9999'
              button.style.position = 'relative'
            }
          }, 1000)
        }

        script.onerror = (error) => {
          console.error('❌ Telegram widget script failed to load:', error)
        }
      }
    }
  }, [isClient, botUsername, authUrl])

  return (
    <div className="w-full max-w-xs" style={{ position: 'relative', zIndex: 9999 }}>
      <div 
        id="telegram-widget-sidebar" 
        className="flex justify-center"
        style={{ 
          position: 'relative',
          zIndex: 9999,
          pointerEvents: 'auto'
        }}
      ></div>
    </div>
  )
}

// Компонент профиля пользователя
function UserProfile({ user, onLogout }: { user: any, onLogout: () => void }) {
  return (
    <div className="w-full max-w-xs">
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative flex-shrink-0">
          {user.photo_url && (
            <img
              src={user.photo_url}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          {user.role === 'ADMIN' && (
            <div className="absolute -top-3 -right-3 w-7 h-7 bg-black/80 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white rotate-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 text-left">
          <h4 className="text-white font-medium mb-1">
            {user.first_name} {user.last_name || ''}
          </h4>
          {user.username && (
            <p className="text-sm text-green-400">@{user.username}</p>
          )}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onLogout()
        }}
        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        style={{ 
          pointerEvents: 'auto',
          zIndex: 9999,
          position: 'relative',
          cursor: 'pointer'
        }}
      >
        Выйти из аккаунта
      </button>
    </div>
  )
}

// Основной компонент Sidebar
export default function Sidebar() {
  const { navbarState, setNavbarState } = useNavbar()
  const { user, setUser, setIsLoading, setError } = useUser()
  const isSidebarOpen = navbarState === 'sidebar'

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

  const goToChat = () => {
    window.location.href = '/chat'
  }

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
      <div className={`sidebar fixed top-0 right-0 bottom-0 w-80 bg-black shadow-xl z-40 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-16">
          {/* Контент */}
          <div className="flex-1 p-6">
            <div className="space-y-4">
              <ChatButton onClick={goToChat} />
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
            className="fixed top-0 right-0 bottom-0 left-0 bg-black bg-opacity-50 z-30"
            onClick={() => setNavbarState('home')}
          />
        )}
      </div>
    </>
  )
}