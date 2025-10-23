export interface ChatMessage {
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

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}
