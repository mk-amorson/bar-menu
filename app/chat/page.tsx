'use client'

import { useEffect } from 'react'
import { useNavbar } from '@/lib/navbar-context'
import { useUser } from '@/lib/user-context'
import { useChat } from '@/hooks/useChat'
import MessageItem from '@/components/chat/MessageItem'
import MessageInput from '@/components/chat/MessageInput'

export default function ChatPage() {
  const { navbarState, setNavbarState } = useNavbar()
  const { user } = useUser()
  
  const {
    messages,
    newMessage,
    setNewMessage,
    isSending,
    isLoadingMessages,
    messagesEndRef,
    loadMessages,
    sendMessage,
    handleKeyPress,
    formatTime
  } = useChat()

  // Устанавливаем состояние навигации при загрузке чата
  useEffect(() => {
    setNavbarState('chat')
  }, [setNavbarState])

  // Загружаем сообщения
  useEffect(() => {
    loadMessages()
  }, [loadMessages])

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
              const isOwnMessage = Boolean(user && message.user_id === user.id)
              return (
                <MessageItem
                  key={message.id}
                  message={message}
                  isOwnMessage={isOwnMessage}
                  formatTime={formatTime}
                />
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Область ввода сообщения */}
        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleKeyPress={handleKeyPress}
          sendMessage={sendMessage}
          isSending={isSending}
          user={user}
        />
      </div>
    </div>
  )
}
