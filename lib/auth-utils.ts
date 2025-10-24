import { NextRequest } from 'next/server'
import { User } from '@/lib/supabase'

// Функция для проверки авторизации и роли ADMIN
export function checkAdminAuth(request: NextRequest): { user: User | null; error: string | null } {
  try {
    // Получаем данные пользователя из заголовков
    const userHeader = request.headers.get('x-user')
    
    if (!userHeader) {
      return { user: null, error: 'Пользователь не авторизован' }
    }

    const user: User = JSON.parse(userHeader)
    
    if (!user) {
      return { user: null, error: 'Пользователь не найден' }
    }

    if (user.role !== 'ADMIN') {
      return { user: null, error: 'Недостаточно прав для выполнения операции' }
    }

    return { user, error: null }
  } catch (error) {
    return { user: null, error: 'Ошибка проверки авторизации' }
  }
}

// Функция для создания ответа с ошибкой авторизации
export function createAuthErrorResponse(message: string, status: number = 403) {
  return Response.json({ 
    error: message,
    code: 'AUTH_ERROR'
  }, { status })
}
