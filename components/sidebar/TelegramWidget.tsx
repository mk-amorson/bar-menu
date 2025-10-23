'use client'

import { useState, useEffect } from 'react'

interface TelegramWidgetProps {
  botUsername: string
  authUrl: string
}

export default function TelegramWidget({ botUsername, authUrl }: TelegramWidgetProps) {
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
