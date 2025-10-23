import UserAvatar from '@/components/ui/UserAvatar'

interface UserProfileProps {
  user: any
  onLogout: () => void
}

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  return (
    <div className="w-full max-w-xs">
      <div className="flex items-center space-x-3 mb-4">
        <UserAvatar user={user} size="lg" showRole={true} />
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
