'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/lib/supabase'
import { useNavbar } from '@/lib/navbar-context'
import { useUser } from '@/lib/user-context'

interface ChatMessage {
  id: number
  user_id: number
  message: string
  created_at: string
  updated_at: string
  users?: {
    first_name: string
    last_name?: string
    username?: string
    photo_url?: string
    role?: string
  }
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { navbarState, setNavbarState } = useNavbar()
  const { user } = useUser()

  // Устанавливаем состояние навигации при загрузке чата
  useEffect(() => {
    setNavbarState('chat')
  }, [setNavbarState])

  // Загружаем сообщения
  useEffect(() => {
    loadMessages()
  }, [])

  // Автоскролл к последнему сообщению
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/chat/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || isSending) return

    setIsSending(true)
    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage.trim(),
          userId: user.id,
        }),
      })

      if (response.ok) {
        setNewMessage('')
        loadMessages() // Перезагружаем сообщения
      } else {
        console.error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="h-screen bg-vintage-black -mt-16">
      {/* Основной контент */}
      <div className="flex flex-col h-full bg-gradient-to-br from-vintage-black to-vintage-charcoal pt-16">
        {/* Область сообщений */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vintage-green"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-white py-8">
              <p>Пока нет сообщений. Будьте первым!</p>
            </div>
          ) : (
                messages.map((message) => {
                  const isOwnMessage = user && message.user_id === user.id
                  
                  return (
                    <div key={message.id} className={`group relative ${isOwnMessage ? 'flex flex-row-reverse' : 'flex'} space-x-4`}>
                      {/* Аватарка пользователя */}
                      <div className="relative flex-shrink-0">
                        {message.users?.photo_url ? (
                          <img
                            src={message.users.photo_url}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full object-cover shadow-lg"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                            {message.users?.first_name?.charAt(0).toUpperCase() || '?'}
                          </div>
                        )}
                        {/* Шестеренка для ADMIN */}
                        {message.users?.role === 'ADMIN' && (
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-black/80 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white rotate-12" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Область сообщения */}
                      <div className="flex-1 min-w-0 max-w-md">
                        {/* Строка с именем и юзернеймом */}
                        <div className={`flex items-center justify-between mb-2 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                          <span className="text-sm font-bold text-white">
                            {message.users?.first_name} {message.users?.last_name || ''}
                          </span>
                          {message.users?.username && (
                            <span className="text-xs text-green-400 bg-vintage-dark-gray px-2 py-1 rounded-full">@{message.users.username}</span>
                          )}
                        </div>
                        
                        {/* Пустая область для отступа */}
                        <div className="h-1"></div>
                        
                        {/* Бокс с сообщением */}
                        <div className={`rounded-2xl px-4 py-3 shadow-xl transition-all duration-300 group-hover:scale-[1.01] ${
                          isOwnMessage 
                            ? 'bg-vintage-green text-white' 
                            : 'bg-vintage-dark-gray text-white border border-vintage-medium-gray hover:border-vintage-green hover:shadow-2xl'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.message}</p>
                        </div>
                      </div>
                      
                      {/* Время на пересечении линий аватарки и нижней границы сообщения */}
                      <div className={`absolute bottom-0 ${isOwnMessage ? 'right-0' : 'left-0'} transform ${isOwnMessage ? 'translate-x-full' : '-translate-x-full'} translate-y-1/2`}>
                        <span className="text-xs text-vintage-light-gray opacity-70 whitespace-nowrap">{formatTime(message.created_at)}</span>
                      </div>
                    </div>
                  )
                })
          )}
          <div ref={messagesEndRef} />
        </div>

            {/* Область ввода сообщения */}
            <div className="border-t border-vintage-medium-gray bg-vintage-charcoal p-4 shadow-2xl">
              {user ? (
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Напишите сообщение..."
                    className="flex-1 border-2 border-vintage-medium-gray rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-vintage-green focus:border-vintage-green transition-all duration-300 shadow-lg bg-vintage-dark-gray text-white placeholder-vintage-light-gray"
                    disabled={isSending}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isSending}
                    className="w-12 h-12 bg-vintage-green text-white rounded-xl hover:bg-vintage-green-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none border border-vintage-bronze flex items-center justify-center"
                  >
                    {isSending ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Для отправки сообщений войдите в аккаунт"
                    disabled
                    className="flex-1 border-2 border-vintage-medium-gray rounded-xl px-4 py-3 bg-gradient-to-r from-vintage-dark-gray to-vintage-medium-gray text-vintage-light-gray cursor-not-allowed shadow-lg"
                  />
                  <button
                    onClick={() => router.push('/?openSidebar=true')}
                    className="w-12 h-12 bg-vintage-green text-white rounded-xl hover:bg-vintage-green-light transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-vintage-bronze flex items-center justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
      </div>
    </div>
  )
}
