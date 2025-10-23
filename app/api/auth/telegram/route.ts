import { NextRequest, NextResponse } from 'next/server'
import { supabase, TelegramUser } from '@/lib/supabase'
import crypto from 'crypto'

// Функция для проверки подписи Telegram
function verifyTelegramAuth(authData: TelegramUser, botToken: string): boolean {
  const { hash, ...userData } = authData
  
  // Создаем строку для проверки
  const dataCheckString = Object.keys(userData)
    .sort()
    .map(key => `${key}=${userData[key as keyof typeof userData]}`)
    .join('\n')
  
  // Создаем секретный ключ
  const secretKey = crypto.createHash('sha256').update(botToken).digest()
  
  // Создаем HMAC
  const hmac = crypto.createHmac('sha256', secretKey)
  hmac.update(dataCheckString)
  const calculatedHash = hmac.digest('hex')
  
  return calculatedHash === hash
}

export async function POST(request: NextRequest) {
  try {
    const authData: TelegramUser = await request.json()
    
    // Проверяем подпись (в реальном проекте используйте ваш bot token)
    const botToken = process.env.TELEGRAM_BOT_TOKEN || 'your_bot_token_here'
    
    if (!verifyTelegramAuth(authData, botToken)) {
      return NextResponse.json({ error: 'Invalid authentication data' }, { status: 401 })
    }
    
    // Проверяем, существует ли пользователь
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.id)
      .single()
    
    let user
    
    if (fetchError && fetchError.code === 'PGRST116') {
      // Пользователь не существует, создаем нового
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.id,
          first_name: authData.first_name,
          last_name: authData.last_name,
          username: authData.username,
          photo_url: authData.photo_url,
        })
        .select()
        .single()
      
      if (insertError) {
        console.error('Error creating user:', insertError)
        return NextResponse.json({ error: 'Failed to create user', details: insertError }, { status: 500 })
      }
      
      user = newUser
    } else if (fetchError) {
      console.error('Error fetching user:', fetchError)
      return NextResponse.json({ error: 'Database error', details: fetchError }, { status: 500 })
    } else {
      // Пользователь существует, обновляем данные
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          first_name: authData.first_name,
          last_name: authData.last_name,
          username: authData.username,
          photo_url: authData.photo_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', authData.id)
        .select()
        .single()
      
      if (updateError) {
        console.error('Error updating user:', updateError)
        return NextResponse.json({ error: 'Failed to update user', details: updateError }, { status: 500 })
      }
      
      user = updatedUser
    }
    
    // Создаем сессию
    const sessionData = {
      user_id: user.id,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 дней
    }
    
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert(sessionData)
      .select()
      .single()
    
    if (sessionError) {
      console.error('Error creating session:', sessionError)
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      user, 
      session,
      success: true 
    })
    
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}