import { useState, useEffect, useRef } from 'react'
import { ChatMessage } from '@/types/chat'
import { useUser } from '@/lib/user-context'

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useUser()

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
        loadMessages()
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

  // Автоскролл к последнему сообщению
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return {
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
  }
}
