-- Создаем таблицу для сообщений чата
CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);

-- Включаем RLS (Row Level Security)
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Политика: все могут читать сообщения (публичный чат)
CREATE POLICY "Anyone can read chat messages" ON chat_messages
  FOR SELECT USING (true);

-- Политика: все могут создавать сообщения (через API)
CREATE POLICY "Anyone can create messages" ON chat_messages
  FOR INSERT WITH CHECK (true);

-- Политика: все могут редактировать сообщения (через API)
CREATE POLICY "Anyone can update messages" ON chat_messages
  FOR UPDATE USING (true);

-- Политика: все могут удалять сообщения (через API)
CREATE POLICY "Anyone can delete messages" ON chat_messages
  FOR DELETE USING (true);
