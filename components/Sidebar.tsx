'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useNavbar } from '@/lib/navbar-context'
import { useUser } from '@/lib/user-context'

// Расширяем интерфейс Window для Telegram
declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void
  }
}

export default function Sidebar() {
  const [widgetStyles, setWidgetStyles] = useState<any>(null)
  const router = useRouter()
  const { navbarState, setNavbarState } = useNavbar()
  const { user, setUser, isLoading, setIsLoading, error, setError, logout } = useUser()

  const isSidebarOpen = navbarState === 'sidebar'

  // Функция для получения стилей виджета
  const getWidgetStyles = () => {
    const telegramButton = document.querySelector('#telegram-widget-sidebar a') as HTMLElement
    if (telegramButton) {
      const styles = window.getComputedStyle(telegramButton)
      return {
        width: '100%', // Широкая кнопка
        minWidth: '200px', // Минимальная ширина
        height: telegramButton.offsetHeight + 'px',
        backgroundColor: '#223f22', // Зеленый для кнопки выхода
        borderRadius: '20px', // Округлые углы
        padding: styles.padding,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: 'white',
        border: styles.border,
        boxShadow: styles.boxShadow,
        display: 'block',
        margin: '0 auto',
        textAlign: 'center' as const,
        textDecoration: 'none',
        cursor: 'pointer',
        lineHeight: telegramButton.offsetHeight + 'px',
        fontFamily: styles.fontFamily
      }
    }
    return null
  }

  // Функция обработки авторизации Telegram
  const handleTelegramAuth = async (telegramUser: any) => {
    console.log('🔐 Telegram auth received:', telegramUser)
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
    logout()
  }

  const goToChat = () => {
    setNavbarState('chat')
    router.push('/chat')
  }

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.onTelegramAuth = handleTelegramAuth
      
      // ДИАГНОСТИКА CSP - проверяем все возможные источники
      console.log('🔍 CSP DIAGNOSTICS:')
      console.log('1. Document CSP meta tag:', document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.getAttribute('content'))
      console.log('2. Document CSP meta tag (name):', document.querySelector('meta[name="Content-Security-Policy"]')?.getAttribute('content'))
      console.log('3. Window location:', window.location.href)
      console.log('4. Document referrer:', document.referrer)
      console.log('5. User agent:', navigator.userAgent)
      
      // Проверяем заголовки ответа (если доступно)
      if (window.performance && window.performance.getEntriesByType) {
        const navigationEntries = window.performance.getEntriesByType('navigation')
        if (navigationEntries.length > 0) {
          console.log('6. Navigation timing:', navigationEntries[0])
        }
      }
      
      // Проверяем все meta теги
      const allMetaTags = document.querySelectorAll('meta')
      console.log('7. All meta tags:')
      allMetaTags.forEach((meta, index) => {
        console.log(`   Meta ${index}:`, {
          name: meta.getAttribute('name'),
          httpEquiv: meta.getAttribute('http-equiv'),
          content: meta.getAttribute('content')
        })
      })
      
      // Проверяем все заголовки документа
      console.log('8. Document head content:', document.head.innerHTML)
      
      // ПРИНУДИТЕЛЬНО УДАЛЯЕМ CSP ИЗ DOM
      console.log('🔧 FORCE REMOVING CSP FROM DOM')
      const cspMetaTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"], meta[name="Content-Security-Policy"]')
      cspMetaTags.forEach((meta, index) => {
        console.log(`   Removing CSP meta tag ${index}:`, meta.outerHTML)
        meta.remove()
      })
      
      // Также пытаемся переопределить CSP через JavaScript
      if (typeof window !== 'undefined') {
        try {
          // Пытаемся отключить CSP через экспериментальные API
          if ('securityPolicy' in window) {
            console.log('🔧 Attempting to disable CSP via securityPolicy API')
            // @ts-ignore
            window.securityPolicy = null
          }
        } catch (e) {
          console.log('🔧 Could not disable CSP via securityPolicy API:', e)
        }
      }
      
      // Добавляем обработчик для сообщений от iframe
      const handleMessage = (event: MessageEvent) => {
        console.log('📨 Message received:', { origin: event.origin, data: event.data })
        if (event.origin === 'https://oauth.telegram.org') {
          console.log('📨 Message from Telegram OAuth:', event.data)
          if (event.data && typeof event.data === 'object' && event.data.first_name) {
            handleTelegramAuth(event.data)
          }
        }
      }
      
      window.addEventListener('message', handleMessage)
      
      return () => {
        window.removeEventListener('message', handleMessage)
      }
    }
  }, [])

  // Настраиваем Telegram виджет
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.onTelegramAuth = handleTelegramAuth

      const container = document.getElementById('telegram-widget-sidebar')
      if (container && isSidebarOpen) {
        container.innerHTML = '' // Всегда очищаем контейнер при открытии меню

        if (!user) {
          const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'tap22login_bot'
          // Используем production домен
          const authUrl = process.env.NODE_ENV === 'production' 
            ? 'https://testing.tap-22.ru'
            : (window.location.host === '127.0.0.1:3000' 
                ? 'http://localhost:3000' 
                : `${window.location.protocol}//${window.location.host}`)
          
          console.log('🔧 Telegram Widget Config:', {
            botUsername,
            authUrl,
            originalUrl: `${window.location.protocol}//${window.location.host}`,
            currentHost: window.location.host,
            currentProtocol: window.location.protocol,
            containerId: container.id,
            isSidebarOpen,
            nodeEnv: process.env.NODE_ENV
          })

          // Создаем iframe напрямую вместо использования скрипта
          const iframeSrc = `https://oauth.telegram.org/embed/${botUsername}?origin=${encodeURIComponent(authUrl)}&return_to=${encodeURIComponent(authUrl + '/')}&size=large&userpic=false&request_access=write`
          console.log('🔧 Creating iframe with src:', iframeSrc)
          
          const iframe = document.createElement('iframe')
          iframe.src = iframeSrc
          iframe.width = '238'
          iframe.height = '40'
          iframe.frameBorder = '0'
          iframe.scrolling = 'no'
          iframe.style.cssText = 'overflow: hidden; color-scheme: light dark; border: none;'
          
          console.log('🔧 Iframe created:', {
            src: iframe.src,
            width: iframe.width,
            height: iframe.height,
            frameBorder: iframe.frameBorder,
            scrolling: iframe.scrolling,
            style: iframe.style.cssText
          })
          
          container.appendChild(iframe)
          console.log('🔧 Iframe appended to container')

          // Добавляем альтернативную кнопку если iframe не работает
          const fallbackButton = document.createElement('button')
          fallbackButton.textContent = 'Войти через Telegram'
          fallbackButton.className = 'w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
          fallbackButton.onclick = () => {
            const telegramAuthUrl = `https://oauth.telegram.org/auth?bot_id=${botUsername}&origin=${encodeURIComponent(authUrl)}&return_to=${encodeURIComponent(authUrl + '/')}&size=large&userpic=false&request_access=write`
            console.log('🔧 Opening Telegram auth in new window:', telegramAuthUrl)
            window.open(telegramAuthUrl, '_blank', 'width=400,height=500')
          }
          
          container.appendChild(fallbackButton)
          console.log('🔧 Added fallback button')

          // Также попробуем создать script элемент как fallback
          const script = document.createElement('script')
          script.src = 'https://telegram.org/js/telegram-widget.js?22'
          script.setAttribute('data-telegram-login', botUsername)
          script.setAttribute('data-size', 'large')
          script.setAttribute('data-userpic', 'false')
          script.setAttribute('data-onauth', 'onTelegramAuth(user)')
          script.setAttribute('data-request-access', 'write')
          script.setAttribute('data-auth-url', authUrl)
          script.async = true

          // Добавляем script после iframe
          setTimeout(() => {
            container.appendChild(script)
          }, 100)

          script.onload = () => {
            console.log('✅ Telegram widget script loaded')
            setTimeout(() => {
              const telegramButton = container.querySelector('a')
              const telegramIframe = container.querySelector('iframe')
              if (telegramButton || telegramIframe) {
                console.log('✅ Telegram widget found:', { telegramButton: !!telegramButton, telegramIframe: !!telegramIframe })
                if (telegramButton) {
                  telegramButton.style.margin = '0 auto'
                  telegramButton.style.display = 'block'
                  setWidgetStyles(getWidgetStyles())
                }
              } else {
                console.warn('⚠️ Telegram widget not found after script load')
                console.log('Container content:', container.innerHTML)
              }
            }, 500)
          }

          script.onerror = (error) => {
            console.error('❌ Telegram widget script failed to load:', error)
          }
        } else {
          container.innerHTML = '' // Убеждаемся, что виджет удален, если пользователь вошел
        }
      }
    }
  }, [user, isSidebarOpen])

  return (
    <>
      {/* Боковое меню */}
      <div className={`fixed top-0 right-0 bottom-0 w-80 bg-black shadow-xl z-40 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-16">
          {/* Контент */}
          <div className="flex-1 p-6">
            <div className="space-y-4">
              {/* Пункт меню - Общий чат */}
              <button
                onClick={goToChat}
                className="w-full text-left p-4 bg-vintage-dark-gray hover:bg-vintage-medium-gray rounded-xl transition-all duration-300 flex items-center space-x-3 group"
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
            </div>
          </div>
          
          {/* Нижняя часть с виджетом или профилем */}
          <div className="p-6 border-t border-gray-700">
            <div className="flex justify-center">
              {user ? (
                /* Профиль пользователя внизу */
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
                      {/* Иконка шестеренки для ADMIN */}
                      {user.role === 'ADMIN' && (
                        <div className="absolute -top-3 -right-3 w-7 h-7 bg-black/80 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white rotate-12" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
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
                    onClick={handleLogout}
                    style={widgetStyles || {
                      width: '100%',
                      height: '40px',
                      backgroundColor: '#223f22',
                      color: 'white',
                      padding: '0',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'block',
                      margin: '0 auto',
                      textAlign: 'center',
                      lineHeight: '40px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }}
                    className="hover:opacity-90 transition-opacity duration-200"
                  >
                    Выйти из аккаунта
                  </button>
                </div>
              ) : (
                /* Виджет входа */
                <div className="w-full max-w-xs">
                  <div id="telegram-widget-sidebar" className="flex justify-center"></div>
                </div>
              )}
            </div>
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
    </>
  )
}
