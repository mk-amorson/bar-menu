import { ChatMessage } from '@/types/chat'
import UserAvatar from '@/components/ui/UserAvatar'

interface MessageItemProps {
  message: ChatMessage
  isOwnMessage: boolean
  formatTime: (dateString: string) => string
}

export default function MessageItem({ message, isOwnMessage, formatTime }: MessageItemProps) {
  return (
    <div className={`group relative ${isOwnMessage ? 'flex flex-row-reverse' : 'flex'} space-x-4`}>
      {/* Аватарка пользователя */}
      <UserAvatar 
        user={message.users || null} 
        size="md" 
        showRole={true}
      />
      
      {/* Область сообщения */}
      <div className="flex flex-col min-w-0">
        {/* Строка с именем и фамилией */}
        <div className={`flex items-center mb-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
          <span className="text-sm font-bold text-white">
            {message.users?.first_name} {message.users?.last_name || ''}
          </span>
        </div>
        
        {/* Бокс с сообщением - теперь по ширине контента */}
        <div className={`inline-block max-w-xs sm:max-w-md rounded-2xl px-4 py-3 shadow-xl transition-all duration-300 group-hover:scale-[1.01] ${
          isOwnMessage 
            ? 'bg-vintage-green text-white' 
            : 'bg-vintage-dark-gray text-white border border-vintage-medium-gray hover:border-vintage-green hover:shadow-2xl'
        }`}>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.message}</p>
        </div>
        
        {/* Время на нижней границе бокса под аватаркой */}
        <div className={`${isOwnMessage ? 'text-right' : 'text-left'}`}>
          <span className="text-xs text-vintage-light-gray opacity-70">{formatTime(message.created_at)}</span>
        </div>
      </div>
    </div>
  )
}
