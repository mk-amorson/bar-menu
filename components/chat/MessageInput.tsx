import { useNavbar } from '@/lib/navbar-context'

interface MessageInputProps {
  newMessage: string
  setNewMessage: (message: string) => void
  handleKeyPress: (e: React.KeyboardEvent) => void
  sendMessage: () => void
  isSending: boolean
  user: any
}

export default function MessageInput({ 
  newMessage, 
  setNewMessage, 
  handleKeyPress, 
  sendMessage, 
  isSending, 
  user 
}: MessageInputProps) {
  const { setIsSidebarOpen } = useNavbar()

  return (
    <div className="p-4">
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
            onClick={() => setIsSidebarOpen(true)}
            className="w-12 h-12 bg-vintage-green text-white rounded-xl hover:bg-vintage-green-light transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-vintage-bronze flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
