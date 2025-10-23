import { User } from '@/lib/supabase'

interface UserAvatarProps {
  user: User | { first_name: string; last_name?: string; photo_url?: string; role?: string } | null
  size?: 'sm' | 'md' | 'lg'
  showRole?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12'
}

const roleIconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4', 
  lg: 'w-5 h-5'
}

const roleBadgeSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-7 h-7'
}

export default function UserAvatar({ 
  user, 
  size = 'md', 
  showRole = true, 
  className = '' 
}: UserAvatarProps) {
  if (!user) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-bold shadow-lg ${className}`}>
        ?
      </div>
    )
  }

  const getInitials = () => {
    const firstName = user.first_name?.charAt(0).toUpperCase() || ''
    const lastName = user.last_name?.charAt(0).toUpperCase() || ''
    return firstName + lastName
  }

  const getRoleIcon = () => {
    switch (user.role) {
      case 'ADMIN':
        return (
          <svg className={`${roleIconSizes[size]} text-white rotate-12`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
          </svg>
        )
      case 'MODERATOR':
        return (
          <svg className={`${roleIconSizes[size]} text-white`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.4 7 14.8 8.6 14.8 10V11.5C15.4 11.5 16 12.4 16 13V16C16 16.6 15.6 17 15 17H9C8.4 17 8 16.6 8 16V13C8 12.4 8.4 11.5 9 11.5V10C9 8.6 10.6 7 12 7M12 8.2C11.2 8.2 10.2 9.2 10.2 10V11.5H13.8V10C13.8 9.2 12.8 8.2 12 8.2Z"/>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {user.photo_url ? (
        <img
          src={user.photo_url}
          alt="Avatar"
          className={`${sizeClasses[size]} rounded-full object-cover shadow-lg`}
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
          {getInitials()}
        </div>
      )}
      
      {/* Значок роли */}
      {showRole && user.role && user.role !== 'CLIENT' && (
        <div className={`absolute -top-2 -right-2 ${roleBadgeSizes[size]} bg-black/80 rounded-full flex items-center justify-center`}>
          {getRoleIcon()}
        </div>
      )}
    </div>
  )
}
