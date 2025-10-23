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
}
