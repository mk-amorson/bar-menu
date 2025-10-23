import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - получение сообщений
export async function GET() {
  try {
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        users:user_id (
          first_name,
          last_name,
          username,
          photo_url,
          role
        )
      `)
      .order('created_at', { ascending: true })
      .limit(50)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch messages', 
        details: error.message,
        code: error.code 
      }, { status: 500 })
    }

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('GET messages error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST - отправка сообщения
export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json()

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (message.length > 1000) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const { data: newMessage, error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: parseInt(userId),
        message: message.trim(),
      })
      .select(`
        *,
        users:user_id (
          first_name,
          last_name,
          username,
          photo_url,
          role
        )
      `)
      .single()

    if (error) {
      console.error('Error creating message:', error)
      return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
    }

    return NextResponse.json({ message: newMessage })
  } catch (error) {
    console.error('POST message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
