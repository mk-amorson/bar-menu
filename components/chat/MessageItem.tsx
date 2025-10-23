import { ChatMessage } from '@/types/chat'

interface MessageItemProps {
  message: ChatMessage
  isOwnMessage: boolean
  formatTime: (dateString: string) => string
}

export default function MessageItem({ message, isOwnMessage, formatTime }: MessageItemProps) {
  return (
    <div className={`group relative ${isOwnMessage ? 'flex flex-row-reverse' : 'flex'} space-x-4`}>
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
}
